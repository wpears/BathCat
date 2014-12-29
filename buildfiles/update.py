import arcpy, sys
from os import path

username = arcpy.GetParameterAsText(0)
appServerRoot = arcpy.GetParameterAsText(1)
dataRoot = arcpy.GetParameterAsText(2)
gisServerMachine = arcpy.GetParameterAsText(3)
folder = arcpy.GetParameterAsText(4)
gisConnection = arcpy.GetParameterAsText(5)

#GIS server machines available at https://darcgis.water.ca.gov/arcgis/admin/machines

#Modify the import path to look in the buildfiles directory first
buildDir = path.join(appServerRoot, "buildfiles")
gdb = path.join(dataRoot,"webData.gdb")
sys.path.insert(0, buildDir)

import xml.etree.ElementTree as ET
import re
from os import path
from time import sleep
from time import time
from passwordPrompt import PasswordPrompt
from rasterToXYZ import RasterToXYZ
from getDate import GetDate
from zipXYZ import ZipXYZ
from webproducts import WebProducts
from getToken import GetToken
from makeService import MakeService
from getGeometries import GetGeometries
from deleteService import DeleteService
from updateService import UpdateService

arcpy.env.workspace = gdb
arcpy.env.OverwriteOutput = True
arcpy.env.addOutputsToMap = True


password = PasswordPrompt()
gisServerSite = "darcgis.water.ca.gov"
endpoint = "https://darcgis.water.ca.gov/arcgis/rest/services/cadre/"
mxd = arcpy.mapping.MapDocument("Current")
buildNumber = str(int(time()/100))
staticBuildDir = path.join(appServerRoot, r'static_data\build' + buildNumber)


arcpy.AddMessage("Getting token...")
token = GetToken(username, password, gisServerMachine)

if token == None:
  arcpy.AddMessage("Could not generate valid tokens with the username and password provided.")
  sys.exit(1)


layers = arcpy.mapping.ListLayers(mxd)
df = arcpy.mapping.ListDataFrames(mxd)[0]

tight_mxd = arcpy.mapping.MapDocument(path.join(dataRoot, "tight_collection.mxd"))
tight_df = arcpy.mapping.ListDataFrames(tight_mxd)[0]

event_mxd = arcpy.mapping.MapDocument(path.join(dataRoot, "event_collection.mxd"))
event_df = arcpy.mapping.ListDataFrames(event_mxd)[0]

zipDir = path.join(appServerRoot, r'zips')
translator = path.join(arcpy.GetInstallInfo("desktop")["InstallDir"], r"Metadata\Translator\ARCGIS2FGDC.xml")


newRasters = [layer for layer in layers if arcpy.Describe(layer).spatialReference.name != 'WGS_1984_Web_Mercator_Auxiliary_Sphere']

for raster in newRasters:

  #Make XYZ
  xyz = RasterToXYZ(raster.dataSource)


  #Get Metadata
  arcpy.AddMessage("Getting Metadata...")
  metadata = arcpy.ExportMetadata_conversion(raster,
    translator,
    path.join(zipDir,'TEMPmetadata.xml')
    ).getOutput(0)

  abstract = 'No description'
  for elem in ET.parse(metadata).iter('abstract'):
    abstract = elem.text
  unixtime = GetDate(raster.name)


  #Make zipfiles
  arcpy.AddMessage("Metadata Retrieved. Zipping together with XYZ...")
  zipped = ZipXYZ(xyz, metadata, zipDir)

  arcpy.AddMessage("\nZipped XYZ and metadata created\nRemoving XYZ textfile and XML metadata from map...")

  arcpy.mapping.RemoveTableView(df, arcpy.mapping.ListTableViews(mxd)[0])
  arcpy.Delete_management(xyz)
  del xyz
  arcpy.Delete_management(metadata)
  del metadata
  arcpy.AddMessage("text and XML files removed")

  rasterName = raster.name

  arcpy.AddMessage(str.format("Projecting {0}...",rasterName))


  #Project the raster
  arcpy.ProjectRaster_management(
    rasterName,
    rasterName,
    df.spatialReference,
    "BILINEAR",
    "",
    "NAD_1983_To_WGS_1984_5"
  )

  arcpy.AddMessage("Raster projected.\nRemoving archived raster...")
  arcpy.mapping.RemoveLayer(df, raster)
  arcpy.AddMessage("Archived raster removed")

  
  #Add symbology
  arcpy.AddMessage("Setting new raster symbology...")
  newRaster = arcpy.mapping.ListLayers(mxd)[0]
  symLayer = arcpy.mapping.Layer(path.join(buildDir,"symbology.lyr"))
  arcpy.mapping.UpdateLayer(df, newRaster, symLayer, True)
  arcpy.AddMessage("\nRaster symbology set\n")


  #Create web products (the two outlines)
  event_layer = WebProducts(newRaster, (mxd,tight_mxd,event_mxd))


  #Add fields
  arcpy.AddMessage("Adding fields for right pane...")
  arcpy.AddField_management(event_layer,"Project","TEXT",field_length=50)
  arcpy.AddField_management(event_layer,"Completed","FLOAT")
  arcpy.AddField_management(event_layer,"Abstract","TEXT",field_length=1200)


  #Populate rows
  arcpy.AddMessage("Fields added. Populating from metadata...")
  with arcpy.da.UpdateCursor(event_layer,['Project','Completed','Abstract']) as cursor:
    for row in cursor:
      row[0] = rasterName[:-9].replace("_", " ")
      row[1] = unixtime
      row[2] = abstract
      cursor.updateRow(row)

  arcpy.AddMessage("Data applied. Removing excess layers...")
  for layer in arcpy.mapping.ListLayers(mxd)[:6]:
    arcpy.mapping.RemoveLayer(df, layer)
  del event_layer


#Exit loop


#Merge layers
arcpy.AddMessage("Merging web products to create services...")
tight_layers = arcpy.mapping.ListLayers(tight_mxd)
event_layers = arcpy.mapping.ListLayers(event_mxd)
arcpy.AddMessage(tight_layers)
arcpy.AddMessage(event_layers)
tight_merge = arcpy.Merge_management(tight_layers,"tight_layers")
event_merge = arcpy.Merge_management(event_layers,"event_layers")

arcpy.AddMessage("Merged. Removing products from map...")
for layer in arcpy.mapping.ListLayers(mxd)[:2]:
  arcpy.mapping.RemoveLayer(df, layer)


#Make temporary outline services
arcpy.AddMessage("Making services...")
tight_outlines = arcpy.mapping.MapDocument(path.join(dataRoot, "bathymetry_tight_outlines.mxd"))
event_outlines = arcpy.mapping.MapDocument(path.join(dataRoot, "bathymetry_event_outlines.mxd"))

MakeService(tight_outlines, folder, gisConnection)
MakeService(event_outlines, folder, gisConnection)

arcpy.AddMessage("Services created. Waiting 20 seconds for the server to spin them up...")
sleep(20)


#Save geometries
arcpy.AddMessage("Done waiting, getting geometries...")
GetGeometries(gisServerMachine, folder, "bathymetry_event_outlines", staticBuildDir, 0)
GetGeometries(gisServerMachine, folder, "bathymetry_tight_outlines", staticBuildDir, 1)


#Clear services
arcpy.AddMessage("Got geometries, deleting spare services...")
DeleteService(gisServerMachine, folder, "bathymetry_event_outlines", token)
DeleteService(gisServerMachine, folder, "bathymetry_tight_outlines", token)


#Update bathymetry_rasters
arcpy.AddMessage("Services deleted. Updating raster service...")
mxd.save()
UpdateService(gisServerMachine, folder, mxd, token, gisConnection)
mxd.save()


#Rewrite index.html
arcpy.AddMessage("Service updated. Updating app html document...")
index = path.join(appServerRoot,'index.html')

with open(index, 'r+') as file:
  buildStr = 'static_data/build'+buildNumber
  html = file.read()
  file.seek(0)
  file.write(buildStr.join(re.split('static_data/build\d{8}',html)))


#Donezo!
arcpy.AddMessage("html document updated. Script complete.")