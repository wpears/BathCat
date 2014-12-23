import httplib
import arcpy
from os import path

def GetGeometries(server, folder, service, appServerRoot,isTight):

  outfile = path.join(path.join(appServerRoot, "static_data"),service+'.js')
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
    print('err')
    arcpy.AddMessage("Error making request.")
    return
  else:
    data = response.read()
    httpConn.close()
  print (data)
  with open(outfile, 'w') as file:
    file.write('window.'+service+'=')
    file.write(data)
