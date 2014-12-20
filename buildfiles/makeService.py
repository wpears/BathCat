import arcpy
from os import path
import httplib, urllib, json

def MakeService(mxd, username, password, serverName="mrsbmapp21169", serverFolder="cadre", gisConnection="GIS Servers/staging"):

  arcpy.env.overwriteOutput = True
  serverPort = 6080

  arcpy.AddMessage("\nGetting token...\n")

  token = getToken(username, password, serverName, serverPort)

  if token == None:
    arcpy.AddMessage("Could not generate valid tokens with the username and password provided.")
    return

  #params = urllib.urlencode({'token': token, 'f': 'json'})
  #headers = {"Content-type": "application/x-www-form-urlencoded", "Accept": "text/plain"}
  mxdPath = mxd.filePath

  arcpy.AddMessage("Processing map: {}\n".format(mxd))

  name = path.basename(mxd.filePath).split('.')[0]
  sdName = path.join(path.dirname(mxdPath), name)
  draft = sdName+".sddraft"
  sd = sdName+".sd"

  arcpy.AddMessage("Making Service Definition Draft: {}.\n".format(draft))

  analysis = arcpy.mapping.CreateMapSDDraft(mxd.filePath,
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

  #url = "/arcgis/admin/services/" + serverFolder + "/" + name + ".MapServer"


  arcpy.AddMessage("Publishing Service.\n")
  arcpy.UploadServiceDefinition_server(sd, gisConnection)
  arcpy.AddMessage("{} published to {} folder on {}\n".format(name, serverFolder, serverName))

#read service properties read and update the service with edit endpoint


def doRequest(name, port, url, params, headers):
  httpConn = httplib.HTTPConnection(name, serverPort)
  httpConn.request("POST", url, params, headers)

  response = httpConn.getresponse()
  if (response.status != 200):
    httpConn.close()
    arcpy.AddMessage("Couldn't access the service {} on {}. Check if it exists".format(url,name))
    return None
  data = response.read()
  httpConn.close()
  if not assertJsonSuccess(data):          
    arcpy.AddMessage("Error returned by operation. " + data)
    return None
  return data


def getToken(username, password, serverName, serverPort):
  tokenURL = "/arcgis/admin/generateToken"

  params = urllib.urlencode({'username': username, 'password': password, 'client': 'requestip', 'expiration':300,'f': 'json'})
  headers = {"Content-type": "application/x-www-form-urlencoded", "Accept": "text/plain"}

  httpConn = httplib.HTTPConnection(serverName, serverPort)
  httpConn.request("POST", tokenURL, params, headers)

  response = httpConn.getresponse()
  if (response.status != 200):
    httpConn.close()
    arcpy.AddMessage("Error while fetching tokens from admin URL. Please check the URL and try again.")
    return
  else:
    data = response.read()
    httpConn.close()

    if not assertJsonSuccess(data):            
      return

    token = json.loads(data)        
    return token['token']            
        

def assertJsonSuccess(data):
  obj = json.loads(data)
  if 'status' in obj and obj['status'] == "error":
    arcpy.AddMessage("Error: JSON object returns an error. " + str(obj))
    return False
  else:
    return True

    '''

  arcpy.AddMessage("Getting service parameters.\n")             
  data = doRequest(serverName, serverPort, url, params, headers)
  if not data:
    continue


  if overrideProps != "":
    overrideJSON = json.loads(overrideProps)
    dataJSON = json.loads(data)
    for key in overrideJSON:
      dataJSON[key] = overrideJSON[key]
    data = json.dumps(dataJSON)
  arcpy.AddMessage("Service Parameters saved.\n")



  arcpy.AddMessage("Adding saved properties.\n")
  if not doRequest(serverName, serverPort, url+"/edit", urllib.urlencode({'token': token, 'service':data, 'f': 'json'})):
    continue
  arcpy.AddMessage("Properties added.\n")
'''