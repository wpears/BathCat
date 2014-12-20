import httplib
import arcpy
from os import path
from time import sleep


def GetGeometries(endpoint, service, isTight, outprefix = r"\\nasgisnp\EntGIS\Cadre\Bathymetry\static_data"):
  server = endpoint.split('/arcgis/rest')[0].split("//")[1]
  outfile = path.join(outprefix,service+'.js')
  if isTight:
    url = "/arcgis/rest/services/" + service + "/MapServer/0/query?f=json&where=1%3D1&returnGeometry=true&spatialRel=esriSpatialRelIntersects&maxAllowableOffset=15&outFields=OBJECTID&outSR=102100"
  else:
    url = "/arcgis/rest/services/" + service + "/MapServer/0/query?f=json&where=1%3D1&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=*&outSR=102100"

  httpConn = httplib.HTTPSConnection(server)
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
