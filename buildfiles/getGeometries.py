import httplib
import arcpy
from os import makedirs
from os import path

def GetGeometries(server, folder, service, buildDir, isTight):

  if not path.exists(buildDir):
    makedirs(buildDir)

  outfile = path.join(buildDir, service +'.js')
  url = "/arcgis/rest/services/" + folder + "/" + service + "/MapServer/0/query?where=1%3D1&returnGeometry=true&f=json&maxAllowableOffset=4"


  if isTight:
    url += "&outFields=OBJECTID"
  else:
    url += "&outFields=*"


  httpConn = httplib.HTTPConnection(server, 6080)
  httpConn.request("GET", url)

  response = httpConn.getresponse()
  if (response.status != 200):
    httpConn.close()
    arcpy.AddMessage("Error making request.")
    return
  else:
    data = response.read()
    httpConn.close()

  with open(outfile, 'w') as file:
    file.write('window.'+service+'=')
    file.write(data)

  oldweb = path.join(path.dirname(buildDir), 'web.config')
  newweb = path.join(buildDir, "web.config")

  with open(oldweb, 'r') as oldFile:
    with open(newweb, 'w') as newFile:
      newFile.write(oldFile.read())

