#Modify the import path to look in the buildfiles directory first
buildDir = r"\\mrsbmapp21161\giswebapps\bathymetry\buildfiles"
import sys
sys.path.insert(0, buildDir)

import arcpy
import xml.etree.ElementTree as ET
from os import path
from passwordPrompt import PasswordPrompt
from rasterToXYZ import RasterToXYZ
from getDate import GetDate
from zipXYZ import ZipXYZ
from webproducts import WebProducts
from makeService import MakeService

arcpy.env.workspace=r"\\nasgisnp\EntGIS\Cadre\Bathymetry\Bathymetry.gdb"
arcpy.env.addOutputsToMap = True

username = arcpy.GetParameterAsText(0)
server = arcpy.GetParameterAsText(1)
folder = arcpy.GetParameterAsText(2)
gisConnection = arcpy.GetParameterAsText(3)

password = PasswordPrompt()
mxd = arcpy.mapping.MapDocument("Current")

layers = arcpy.mapping.ListLayers(mxd)
df = arcpy.mapping.ListDataFrames(mxd)[0]

tight_mxd = arcpy.mapping.MapDocument(r"\\nasgisnp\EntGIS\Cadre\Bathymetry\tight_collection.mxd")
tight_df = arcpy.mapping.ListDataFrames(tight_mxd)[0]

event_mxd = arcpy.mapping.MapDocument(r"\\nasgisnp\EntGIS\Cadre\Bathymetry\event_collection.mxd")
event_df = arcpy.mapping.ListDataFrames(event_mxd)[0]

zipDir = r'\\mrsbmapp21161\giswebapps\bathymetry\zips'
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
  arcpy.AddField_Management(event_layer,"Completed","DATE")
  arcpy.AddField_Management(event_layer,"Abstract","TEXT",field_length=1200)

  arcpy.AddMessage("Fields added. Populating from metadata...")

  with arcpy.da.UpdateCursor(event_layer,['Completed','Abstract']) as cursor:
    for row in cursor:
      row[0] = unixtime
      row[1] = abstract
      cursor.updateRow(row)

  arcpy.AddMessage("Data applied.")   
arcpy.AddMessage("Merging web products to create services...")


#MakeService(tight_mxd,username,password)