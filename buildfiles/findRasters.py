import arcpy

mxd = arcpy.mapping.MapDocument("\\\\nasgisnp\\EntGIS\\Cadre\\Bathymetry\\bathymetry_rasters.mxd")

newRasters = [ layer for layer in arcpy.mapping.ListLayers(mxd) if layer.spatialReference.name != 'WGS_1984_Web_Mercator_Auxiliary_Sphere']

for raster in newRasters:
  arcpy.ProjectRaster_management(
    raster,
    "\\\\nasgisnp\\EntGIS\\Cadre\\Bathymetry\\Bathymetry.gdb\\"+raster.name,
    r"Coordinate Systems/Projected Coordinate Systems/World/WGS 1984 Web Mercator (Auxiliary Sphere).prj",
    "BILINEAR",
    "",
    "NAD_1983_to_WGS_1984_5"
  )

