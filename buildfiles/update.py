import arcpy, sys
from os import path

username = arcpy.GetParameterAsText(0)
appServerRoot = arcpy.GetParameterAsText(1)
dataRoot = arcpy.GetParameterAsText(2)
gisServer = arcpy.GetParameterAsText(3)
folder = arcpy.GetParameterAsText(4)
gisConnection = arcpy.GetParameterAsText(5)

#Modify the import path to look in the buildfiles directory first
buildDir = path.join(appServerRoot, "buildfiles")
gdb = path.join(dataRoot,"Bathymetry.gdb")
sys.path.insert(0, buildDir)

import xml.etree.ElementTree as ET
from os import path
from passwordPrompt import PasswordPrompt
from rasterToXYZ import RasterToXYZ
from getDate import GetDate
from zipXYZ import ZipXYZ
from webproducts import WebProducts
from getToken import GetToken
from makeService import MakeService
from getGeometries import GetGeometries

arcpy.env.workspace = gdb
arcpy.env.OverwriteOutput = True
arcpy.env.addOutputsToMap = True


password = PasswordPrompt()
mxd = arcpy.mapping.MapDocument("Current")
endpoint = "https://darcgis.water.ca.gov/arcgis/rest/services/cadre/"


layers = arcpy.mapping.ListLayers(mxd)
df = arcpy.mapping.ListDataFrames(mxd)[0]

tight_mxd = arcpy.mapping.MapDocument(path.join(dataRoot, "tight_collection.mxd")
tight_df = arcpy.mapping.ListDataFrames(tight_mxd)[0]

event_mxd = arcpy.mapping.MapDocument(path.join(dataRoot, "event_collection.mxd")
event_df = arcpy.mapping.ListDataFrames(event_mxd)[0]

zipDir = path.join(appServerRoot, r'zips')
translator = path.join(arcpy.GetInstallInfo("desktop")["InstallDir"], r"Metadata\Translator\ARCGIS2FGDC.xml")


newRasters = [layer for layer in layers if arcpy.Describe(layer).spatialReference.name != 'WGS_1984_Web_Mercator_Auxiliary_Sphere']

for raster in newRasters:

  xyz = RasterToXYZ(raster.dataSource)

  arcpy.AddMessage("Getting Metadata...")
  metadata = arcpy.ExportMetadata_conversion(raster,
    translator,
    path.join(zipDir,'TEMPmetadata.xml')
    ).getOutput(0)

  abstract = 'No description'
  for elem in ET.parse(metadata).iter('abstract'):
    abstract = elem.text
  unixtime = GetDate(raster.name)

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
  arcpy.Delete_management("in_memory")
  arcpy.AddMessage("Archived raster removed")

  newRaster = arcpy.mapping.ListLayers(mxd)[0]
  symLayer = arcpy.mapping.Layer(path.join(buildDir,"symbology.lyr"))

  arcpy.AddMessage("Setting new raster symbology...")
  arcpy.mapping.UpdateLayer(df, newRaster, symLayer, True)
  arcpy.AddMessage("\nRaster symbology set\n")

  event_layer = WebProducts(newRaster, (mxd,tight_mxd,event_mxd), (df,tight_df,event_df))

  arcpy.AddMessage("Adding fields for right pane...")
  arcpy.AddField_management(event_layer,"Project","TEXT",field_length=50)
  arcpy.AddField_management(event_layer,"Completed","FLOAT")
  arcpy.AddField_management(event_layer,"Abstract","TEXT",field_length=1200)

  arcpy.AddMessage("Fields added. Populating from metadata...")

  with arcpy.da.UpdateCursor(event_layer,['Project','Completed','Abstract']) as cursor:
    for row in cursor:
      row[0] = rasterName[:-10].replace("_", " ")
      row[1] = unixtime
      row[2] = abstract
      cursor.updateRow(row)

  arcpy.AddMessage("Data applied. Removing excess layers...")
  for layer in arcpy.mapping.ListLayers(mxd)[:6]:
    arcpy.mapping.RemoveLayer(df, layer)
  del event_layer
  
arcpy.AddMessage("Merging web products to create services...")

tight_layers = arcpy.mapping.ListLayers(tight_mxd)
event_layers = arcpy.mapping.ListLayers(event_mxd)

tight_merge = arcpy.Merge_management(tight_layers,"tight_layers")
event_merge = arcpy.Merge_management(event_layers,"event_layers")

arcpy.AddMessage("Merged. Removing products from map...")
for layer in arcpy.mapping.ListLayers(mxd)[:2]:
  arcpy.mapping.RemoveLayer(df, layer)

tight_outlines = arcpy.mapping.MapDocument(path.join(dataRoot, "bathymetry_tight_outlines.mxd")
event_outlines = arcpy.mapping.MapDocument(path.join(dataRoot, "bathymetry_event_outlines.mxd")

arcpy.AddMessage("Getting token...")
GetToken(username, password)
 if token == None:
    arcpy.AddMessage("Could not generate valid tokens with the username and password provided.")
    return


arcpy.AddMessage("Making services...")
MakeService(tight_outlines, username, password)
MakeService(event_outlines, username, password)

arcpy.AddMessage("Services created. Getting geometries...")
GetGeometries(endpoint, "bathymetry_event_outlines", appServerRoot, 0)
GetGeometries(endpoint, "bathymetry_tight_outlines", appServerRoot, 1)