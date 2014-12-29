import arcpy
from arcpy import env
from os import path
arcpy.CheckOutExtension("3D")
env.outputZFlag="Disabled"
env.outputMFlag="Disabled"



def WebProducts (raster, mxds, dfs, method="POINT_REMOVE", tolerance=3, minimumArea=3000 ):

  rastName=arcpy.Describe(raster).baseName
  tempPath = rastName + "TEMP"
  temp2Path = tempPath + "2"
  temp3Path = tempPath + "3"
  temp4Path = tempPath + "4"

  arcpy.AddMessage("Running Raster Domain...")
  domain = arcpy.RasterDomain_3d(raster, tempPath, "POLYGON")

  arcpy.AddMessage("Raster Domain finished. Running Union...")
  union = arcpy.Union_analysis(domain, temp2Path, "ALL", 0.1, "NO_GAPS")

  arcpy.AddMessage("Union finished. Running Dissolve...")
  dissolve = arcpy.Dissolve_management(union, temp3Path)

  arcpy.AddMessage("Dissolve finished. Running Simplify and slight buffer...")
  simp = arcpy.cartography.SimplifyPolygon(dissolve, temp4Path, method, tolerance, minimumArea, "NO_CHECK", "NO_KEEP").getOutput(0)
  tight_buff = arcpy.Buffer_analysis(simp, rastName+"_tight", "10 Feet", "FULL", "", "NONE").getOutput(0)

  arcpy.AddMessage("Tight outline created. Cleaning up fields...")
  arcpy.DeleteField_management(tight_buff,["BUFF_DIST"])


  tight_mxd = mxds[1]
  tight_df = dfs[1]
  arcpy.AddMessage("Fields cleaned. Saving to: " + path.basename(tight_mxd.filePath))
  tight_layer = arcpy.mapping.Layer(tight_buff)
  arcpy.mapping.AddLayer(tight_df, tight_layer)
  tight_mxd.save()


  arcpy.AddMessage("Tight outlines saved. Creating buffer for event outlines...")
  extent = raster.getExtent()
  bufferDistance = (extent.width + extent.height) / 2 / 5
  buff = arcpy.Buffer_analysis(simp, rastName+"_event", str(bufferDistance)+ " Feet", "FULL", "", "NONE").getOutput(0)

  arcpy.AddMessage("Buffer created.  Cleaning up fields...")
  arcpy.DeleteField_management(buff,["BUFF_DIST"])


  event_mxd = mxds[2]
  event_df = dfs[2]
  arcpy.AddMessage("Fields cleaned. Saving to: " + path.basename(event_mxd.filePath))
  event_layer = arcpy.mapping.Layer(buff)
  arcpy.mapping.AddLayer(event_df, event_layer)
  event_mxd.save()

  arcpy.AddMessage("Event outlines saved.")

  del tempPath
  del temp2Path
  del temp3Path
  del temp4Path
  del domain
  del union
  del dissolve
  del simp
  del tight_buff
  del tight_layer
  del event_layer

  arcpy.Delete_management("in_memory")

  arcpy.AddMessage("\nWeb Products created\n")
  return buff