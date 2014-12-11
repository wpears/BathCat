import arcpy
from arcpy import env
from os import path
arcpy.CheckOutExtension("3D")
env.outputZFlag="Disabled"
env.outputMFlag="Disabled"

def webProducts (raster, method="POINT_REMOVE", tolerance=15, minimumArea=3000 ):
  rastName=arcpy.Describe(raster).baseName
  q=arcpy.RasterDomain_3d(raster, path.join("in_memory", rastName), "POLYGON")
  qq=arcpy.Union_analysis(q, path.join("in_memory", rastName),"ALL",0.1,"NO_GAPS")
  qqq=arcpy.Dissolve_management(qq, path.join("in_memory", rastName))
  qqqq=arcpy.cartography.SimplifyPolygon(qqq, path.join("in_memory", rastName), method, tolerance, minimumArea, "NO_CHECK", "NO_KEEP")
  arcpy.Buffer_analysis(qqqq, "out_"+rastName, "30 Feet", "FULL", "", "NONE")
  print "Products created."
