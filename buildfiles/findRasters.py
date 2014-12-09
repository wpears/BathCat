import arcpy
arcpy.env.workspace=r"\\nasgisnp\EntGIS\Cadre\Bathymetry\Bathymetry.gdb"

mxd = arcpy.mapping.MapDocument(r"\\nasgisnp\EntGIS\Cadre\Bathymetry\bathymetry_rasters.mxd")
layers = arcpy.mapping.ListLayers(mxd)

newRasters = []
oldRasters = []

for layer in layers:
  if arcpy.Describe(layer).spatialReference.name != 'WGS_1984_Web_Mercator_Auxiliary_Sphere':
    newRasters.append(layer)
  else:
    oldRasters.append(layer)
 

for raster in newRasters:
  arcpy.ProjectRaster_management(
    raster.name,
    raster.name,
    oldRasters[0].datasetName,
    "BILINEAR",
    "",
    "NAD_1983_To_WGS_1984_5"
  )
