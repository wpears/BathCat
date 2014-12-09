import arcpy
arcpy.env.workspace=r"\\nasgisnp\EntGIS\Cadre\Bathymetry\Bathymetry.gdb"

mxd = arcpy.mapping.MapDocument("Current")
layers = arcpy.mapping.ListLayers(mxd)
df = arcpy.mapping.ListDataFrames(mxd)[0]

newRasters = [layer for layer in layers if arcpy.Describe(layer).spatialReference.name != 'WGS_1984_Web_Mercator_Auxiliary_Sphere']

for raster in newRasters:
  newRaster = arcpy.ProjectRaster_management(
    raster.name,
    raster.name,
    df.spatialReference,
    "BILINEAR",
    "",
    "NAD_1983_To_WGS_1984_5"
  )
  arcpy.mapping.RemoveLayer(df, raster)



