import arcpy
from os import path
from addheader import addHeader
arcpy.CheckOutExtension('3D')


def RasterToXYZ(rastPath, outLocation=r"\\mrsbmapp21161\giswebapps\bathymetry\zips"):

  arcpy.AddMessage("Creating XYZ file...")
  outName = path.basename(rastPath) + '.txt'
  outPath = path.join(outLocation, outName)


  arcpy.AddMessage("Running Raster to Point...")
  point = arcpy.RasterToPoint_conversion(rastPath, r"TEMPPOINT", "VALUE")
  arcpy.AddMessage("Point feature created")

  arcpy.AddMessage("Converting to 3D by Attribute...")
  threed = arcpy.FeatureTo3DByAttribute_3d(point, r"TEMPPOINT3D", "grid_code")
  arcpy.AddMessage("3D conversion complete")
  del point
  arcpy.Delete_management("TEMPPOINT")

  arcpy.AddMessage("Creating XYZ...")
  arcpy.FeatureClassZToASCII_3d(threed, outLocation, outName, "XYZ", "COMMA", "FIXED", 2)
  del threed
  arcpy.Delete_management("TEMPPOINT3D")
  arcpy.AddMessage("XYZ created")

  arcpy.AddMessage("Adding header...")
  xyz = addHeader(outPath)
  arcpy.AddMessage("Header added")

  return xyz