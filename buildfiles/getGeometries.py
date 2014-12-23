import httplib
import arcpy
from time import time
import os

def GetGeometries(server, folder, service, appServerRoot, isTight):

  buildDir = os.path.join(appServerRoot, r'static_data\build' + str(int(time()/100)))

  if not os.path.exists(buildDir):
    os.makedirs(buildDir)

  outfile = os.path.join(buildDir, service +'.js')
  url = "/arcgis/rest/services/" + folder + "/" + service + "/MapServer/0/query?where=1%3D1&returnGeometry=true&f=json&maxAllowableOffset=4"


  if isTight:
    url += "&outFields=OBJECTID"
  else:
    url += "&outFields=*"


  httpConn = httplib.HTTPConnection(server, 6080)
  httpConn.request("GET", url)


  response = httpConn.getresponse()
  print response.status
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
