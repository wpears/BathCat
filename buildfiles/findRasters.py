#Modify the import path to look in the buildfiles directory first
buildDir = r"\\mrsbmapp21161\giswebapps\bathymetry\buildfiles"
import sys
sys.path.insert(0, buildDir)

import arcpy
from os import path
from rasterToXYZ import RasterToXYZ
from zipXYZ import ZipXYZ
from webproducts import WebProducts

arcpy.env.workspace=r"\\nasgisnp\EntGIS\Cadre\Bathymetry\Bathymetry.gdb"
arcpy.env.addOutputsToMap = True

mxd = arcpy.mapping.MapDocument("Current")
layers = arcpy.mapping.ListLayers(mxd)
df = arcpy.mapping.ListDataFrames(mxd)[0]

zipDir = r'\\mrsbmapp21161\giswebapps\bathymetry\zips'
translator = path.join(arcpy.GetInstallInfo("desktop")["InstallDir"], r"Metadata\Translator\ARCGIS2FGDC.xml")

newRasters = [layer for layer in layers if arcpy.Describe(layer).spatialReference.name != 'WGS_1984_Web_Mercator_Auxiliary_Sphere']

for raster in newRasters:

  xyz = RasterToXYZ(raster.dataSource)

  print("Getting Metadata...")
  metadata = arcpy.ExportMetadata_conversion(raster,
    translator,
    path.join(zipDir,'TEMPmetadata.xml')
    ).getOutput(0)

  print("Metadata Retrieved. Zipping together with XYZ...")
  zipped = ZipXYZ(xyz, metadata, zipDir)

  print("Zipped XYZ and metadata created, removing XYZ textfile and XML metadata")

  arcpy.mapping.RemoveTableView(df, arcpy.mapping.ListTableViews(mxd)[0])
  arcpy.Delete_management(xyz)
  del xyz
  arcpy.Delete_management(metadata)
  del metadata
  print("text and XML files removed")

  rasterName = raster.name

  print(str.format("Projecting {0}...",rasterName))

  arcpy.ProjectRaster_management(
    rasterName,
    rasterName,
    df.spatialReference,
    "BILINEAR",
    "",
    "NAD_1983_To_WGS_1984_5"
  )

  print("Raster projected. Removing archived raster...")
  arcpy.mapping.RemoveLayer(df, raster)
  arcpy.Delete_management("in_memory")
  print("Archived raster removed")

  newRaster = arcpy.mapping.ListLayers(mxd)[0]
  symLayer = arcpy.mapping.Layer(path.join(buildDir,"symbology.lyr"))

  print("Setting new raster symbology...")
  arcpy.mapping.UpdateLayer(df, newRaster, symLayer, True)
  print("Raster symbology set")

  WebProducts(newRaster, mxd)