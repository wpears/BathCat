import arcpy
from os import path
import httplib, urllib, json

def MakeService(mxd, username, password, serverName="mrsbmapp21169", gisConnection="staging", serverFolder="cadre"):

  arcpy.env.overwriteOutput = True
  serverPort = 6080

  print("\nGetting token...\n")

  token = getToken(username, password, serverName, serverPort)

  if token == None:
    print("Could not generate valid tokens with the username and password provided.")
    return

  stagingParams = urllib.urlencode({'token': token, 'f': 'json'})
  headers = {"Content-type": "application/x-www-form-urlencoded", "Accept": "text/plain"}
  mxdPath = mxd.filePath

  print("Processing map: {}\n".format(mxd))

  name = path.basename(mxd.filePath).split('.')[0]
  sdName = path.join(path.dirname(mxdPath), name)
  draft = sdName+".sddraft"
  sd = sdName+".sd"

  print("Making Service Definition Draft: {}.\n".format(draft))

  analysis = arcpy.mapping.CreateMapSDDraft(mxd.filePath,
                                            draft,
                                            name,
                                           "ARCGIS_SERVER",
                                           "",
                                           False,
                                           serverFolder
                                            )

  if analysis['errors'] == {}:
    print("Making Service Definition: {}.\n".format(sd))
    arcpy.StageService_server(draft, sd)
    print("Service Definition created.\n")
  else:
    print("Errors creating service definition",analysis['errors'])
    continue

  url = "/arcgis/admin/services/" + serverFolder + "/" + name + ".MapServer"



  print("Getting service parameters.\n")             
  data = doRequest(stagingName, stagingURL, stagingParams)
  if not data:
    continue



  if overrideProps != "":
    overrideJSON = json.loads(overrideProps)
    dataJSON = json.loads(data)
    for key in overrideJSON:
      dataJSON[key] = overrideJSON[key]
    data = json.dumps(dataJSON)
  print("Service Parameters saved.\n")



  print("Removing old service.\n")
  try:
    doRequest(prodName, prodURL + "/delete", prodParams)
    print("Service Removed.\n")
  except:
    print("No service at {}. This must be the first time it's been published. Make sure you've analyzed it in ArcMap.\n".format(prodURL))



  print("Publishing new service.\n")
  arcpy.UploadServiceDefinition_server(sd,"GIS Servers/"+gisConnection)
  print("{} published to {} folder on {}\n".format(name,prodFolder,prodName))



  print("Adding saved properties.\n")
  if not doRequest(prodName, prodURL+"/edit", urllib.urlencode({'token': prodToken, 'service':data, 'f': 'json'})):
    continue
  print("Properties added.\n")



  print("{} successfully updated.\n".format(name))



def doRequest(name, url, params, headers):
  httpConn = httplib.HTTPConnection(name,serverPort)
  httpConn.request("POST", url, params, headers)

  response = httpConn.getresponse()
  if (response.status != 200):
    httpConn.close()
    print("Couldn't access the service {} on {}. Check if it exists".format(url,name))
    return None
  data = response.read()
  httpConn.close()
  if not assertJsonSuccess(data):          
    print("Error returned by operation. " + data)
    return None
  return data


def getToken(username, password, serverName, serverPort):
  tokenURL = "/arcgis/admin/generateToken"

  params = urllib.urlencode({'username': username, 'password': password, 'client': 'requestip', 'expiration':180,'f': 'json'})
  headers = {"Content-type": "application/x-www-form-urlencoded", "Accept": "text/plain"}

  httpConn = httplib.HTTPConnection(serverName, serverPort)
  httpConn.request("POST", tokenURL, params, headers)

  response = httpConn.getresponse()
  if (response.status != 200):
    httpConn.close()
    print("Error while fetching tokens from admin URL. Please check the URL and try again.")
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
    print("Error: JSON object returns an error. " + str(obj))
    return False
  else:
    return True