import httplib, urllib
import arcpy
from os import path

def GetGeometries(server, service, appServerRoot, token, isTight):

  outfile = path.join(path.join(appServerRoot, "static_data"),service+'.js')
  headers = {"Content-Type": "application/x-www-form-urlencoded", "Accept": "text/plain"}
  url = "/arcgis/rest/services/" + service + "/MapServer/0/query"


  if isTight:
    params = urllib.urlencode({
      'token':token,
      'f': 'json',
      'where':'1=1',
      'returnGeometry':'true',
      'spatialRel':'esriSpatialRelIntersect',
      'outFields':'OBJECTID',
      'maxAllowableOffset':15,
      'outSR':102100
    })
  else:
    params = urllib.urlencode({
      'token':token,
      'f': 'json',
      'where':'1=1',
      'returnGeometry':'true',
      'spatialRel':'esriSpatialRelIntersect',
      'outFields':'*',
      'outSR':102100
    })


  httpConn = httplib.HTTPConnection(server, 6080)
  httpConn.request("GET", url, params, headers)


  response = httpConn.getresponse()
  if (response.status != 200):
    httpConn.close()
    arcpy.AddMessage("Error making request.")
    return
  else:
    data = response.read()
    httpConn.close()
  print (data)
  with open(outfile, 'w') as file:
    file.write('window.'+service+'=')
    file.write(data)
