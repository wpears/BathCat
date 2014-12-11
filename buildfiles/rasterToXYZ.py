import arcpy
from os import path
from addheader import addHeader
arcpy.CheckOutExtension('3D')


def RasterToXYZ(rastPath, outLocation=r"\\mrsbmapp21161\giswebapps\bathymetry\zips"):

  print("Creating XYZ file...")
  outName = path.basename(rastPath) + '.txt'
  outPath = path.join(outLocation, outName)


  print("Running Raster to Point...")
  point = arcpy.RasterToPoint_conversion(rastPath, r"in_memory\TEMPPOINT", "VALUE")
  print("Point feature created")

  print("Converting to 3D by Attribute...")
  threed = arcpy.FeatureTo3DByAttribute_3d(point, r"in_memory\TEMPPOINT3D", "grid_code")
  print("3D conversion complete")
  del point
  arcpy.Delete_management("TEMPPOINT")

  print("Creating XYZ...")
  arcpy.FeatureClassZToASCII_3d(threed, outLocation, outName, "XYZ", "COMMA", "FIXED", 2)
  del threed
  arcpy.Delete_management("TEMPPOINT3D")
  print("XYZ created")

  print("Adding header...")
  xyz = addHeader(outPath)
  print("Header added")

  print("Clearing in-memory workspace...")
  arcpy.Delete_management("in_memory")
  print("In-memory workspace cleared")

  return xyz