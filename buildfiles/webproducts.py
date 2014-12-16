import arcpy
from arcpy import env
from os import path
arcpy.CheckOutExtension("3D")
env.outputZFlag="Disabled"
env.outputMFlag="Disabled"



def WebProducts (raster, mxd, df, method="POINT_REMOVE", tolerance=10, minimumArea=3000 ):

  rastName=arcpy.Describe(raster).baseName
  tempPath = path.join("in_memory", rastName) + "TEMP"
  temp2Path = tempPath + "2"
  temp3Path = tempPath + "3"

  print("Running Raster Domain...")
  domain = arcpy.RasterDomain_3d(raster, tempPath, "POLYGON")

  print("Raster Domain finished. Running Union...")
  union = arcpy.Union_analysis(domain, temp2Path, "ALL", 0.1, "NO_GAPS")

  print("Union finished. Running Dissolve...")
  dissolve = arcpy.Dissolve_management(union, temp3Path)

  print("Dissolve finished. Running Simplify...")
  simp = arcpy.cartography.SimplifyPolygon(dissolve, rastName+"_tight", method, tolerance, minimumArea, "NO_CHECK", "NO_KEEP")

  print("Simplify finished. Saving to bathymetry_tight_outlines...")
  tight_mxd = arcpy.mapping.MapDocument(r"\\nasgisnp\EntGIS\Cadre\Bathymetry\bathymetry_tight_outlines.mxd")
  #event_mxd = arcpy.mapping.MapDocument(r"\\nasgisnp\EntGIS\Cadre\Bathymetry\bathymetry_event_outlines.mxd")

  tight_df = arcpy.mapping.ListDataFrames(tight_mxd)[0]
  #event_df = arcpy.mapping.ListDataFrames(event_mxd)[0]

  tight_layer = arcpy.mapping.Layer(simp.getOutput(0))
  arcpy.mapping.AddLayer(tight_df, tight_layer)
  tight_mxd.save()

  #arcpy.Buffer_analysis(simp, "out_"+rastName, "30 Feet", "FULL", "", "NONE")
  print("Products created. Deleting intermediate files.")

  for layer in arcpy.mapping.ListLayers(mxd)[:4]:
    arcpy.mapping.RemoveLayer(df, layer)

  del tempPath
  del temp2Path
  del temp3Path
  del domain
  del union
  del dissolve
  del simp
  del tight_mxd
  arcpy.Delete_management("in_memory")

  #tight_mxd saving trouble. Works from console but not from this fn.. Might call out to other fn..