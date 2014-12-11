import arcpy
from arcpy import env
from os import path
arcpy.CheckOutExtension("3D")
env.outputZFlag="Disabled"
env.outputMFlag="Disabled"

tight_mxd = arcpy.mapping.MapDocument(r"\\nasgisnp\EntGIS\Cadre\Bathymetry\bathymetry_tight_outlines.mxd")
event_mxd = arcpy.mapping.MapDocument(r"\\nasgisnp\EntGIS\Cadre\Bathymetry\bathymetry_event_outlines.mxd")

tight_df = arcpy.mapping.ListDataFrames(tight_mxd)[0]
event_df = arcpy.mapping.ListDataFrames(event_mxd)[0]

def webProducts (raster, method="POINT_REMOVE", tolerance=10, minimumArea=3000 ):
  rastName=arcpy.Describe(raster).baseName
  memPath = path.join("in_memory", rastName)
  tempPath = memPath + "TEMP"
  temp2Path = memPath + "TEMP2"

  print("Running Raster Domain...")
  domain = arcpy.RasterDomain_3d(raster, tempPath, "POLYGON")

  print("Raster Domain finished. Running Union...")
  union=arcpy.Union_analysis(domain, temp2Path, "ALL", 0.1, "NO_GAPS")
  arcpy.Delete_management(tempPath)

  print("Union finished. Running Dissolve...")
  dissolve=arcpy.Dissolve_management(union, tempPath)
  arcpy.Delete_management(temp2Path)

  print("Dissolve finished. Running Simplify...")
  simp=arcpy.cartography.SimplifyPolygon(dissolve, memPath, method, tolerance, minimumArea, "NO_CHECK", "NO_KEEP")
  arcpy.Delete_management(tempPath)
  arcpy.Delete_management(temp2Path)

  print("Simplify finished. Saving to bathymetry_tight_outlines...")
  tight_layer = arcpy.mapping.Layer(simp)
  arcpy.mapping.AddLayer(tight_df, tight_layer)
  tight_layer.save()

  arcpy.Buffer_analysis(simp, "out_"+rastName, "30 Feet", "FULL", "", "NONE")
  print "Products created."

  arcpy.Delete_management("in_memory")