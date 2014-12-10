#Modify the import path to look in the buildfiles directory first
import sys
sys.path.insert(0,r"\\mrsbmapp21161\giswebapps\bathymetry\buildfiles")

import arcpy
from os import path
from rasterToXYZ import RasterToXYZ
from zipXYZ import ZipXYZ

arcpy.env.workspace=r"\\nasgisnp\EntGIS\Cadre\Bathymetry\Bathymetry.gdb"
arcpy.env.addOutputsToMap = False

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

  arcpy.Delete_management(xyz)
  del xyz
  arcpy.Delete_management(metadata)
  del metadata
  print("text and XML files removed")

  rasterName = raster.name

  print(str.format("Projecting {0}...",rasterName))

  newRaster = arcpy.ProjectRaster_management(
    rasterName,
    rasterName,
    df.spatialReference,
    "BILINEAR",
    "",
    "NAD_1983_To_WGS_1984_5"
  ).getOutput(0)

  print("Raster projected. Swapping with archived raster...")
  arcpy.mapping.RemoveLayer(df, raster)
  arcpy.MakeRasterLayer_management(newRaster, "rastlayer")
  arcpy.mapping.AddLayer(df, "rastlayer")
  print("Projected Raster added to map")

  
 

  




