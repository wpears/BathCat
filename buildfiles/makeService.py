import arcpy
from os import path

def MakeService(mxd, token, serverFolder="cadre", gisConnection="GIS Servers/staging"):

  arcpy.AddMessage("Processing map: {}\n".format(mxd))

  mxdPath = mxd.filePath
  name = path.basename(mxdPath).split('.')[0]
  sdName = path.join(path.dirname(mxdPath), name)
  draft = sdName+".sddraft"
  sd = sdName+".sd"

  arcpy.AddMessage("Making Service Definition Draft: {}.\n".format(draft))

  analysis = arcpy.mapping.CreateMapSDDraft(mxdPath,
                                            draft,
                                            name,
                                           "ARCGIS_SERVER",
                                           "",
                                           False,
                                           serverFolder
                                            )

  if analysis['errors'] == {}:
    arcpy.AddMessage("Making Service Definition: {}.\n".format(sd))
    arcpy.StageService_server(draft, sd)
    arcpy.AddMessage("Service Definition created.\n")
  else:
    arcpy.AddMessage("Errors creating service definition",analysis['errors'])


  arcpy.AddMessage("Publishing Service.\n")
  arcpy.UploadServiceDefinition_server(sd, gisConnection)
  arcpy.AddMessage("{} published to {} folder\n".format(name, serverFolder))

#read service properties read and update the service with edit endpoint
