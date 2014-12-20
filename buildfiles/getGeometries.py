import httplib
import arcpy
from os import path

def GetGeometries(endpoint, service, isTight, outprefix = r"\\nasgisnp\EntGIS\Cadre\Bathymetry\static_data"):
  server = endpoint.split('argis/rest')[0]
  outfile = path.join(outprefix,service+'.js')
  if isTight:
    url = endpoint + service + "/MapServer/0/query?f=json&where=1%3D1&returnGeometry=true&spatialRel=esriSpatialRelIntersects&maxAllowableOffset=15&outFields=OBJECTID&outSR=102100"
  else:
    url = endpoint + service + "/MapServer/0/query?f=json&where=1%3D1&returnGeometry=true&spatialRel=esriSpatialRelIntersects&outFields=*&outSR=102100"

  httpConn = httplib.HTTPConnection(server, 80)
  httpConn.request("GET", url)

  response = httpConn.getresponse()
  if (response.status != 200):
    httpConn.close()
    arcpy.AddMessage("Error while fetching tokens from admin URL. Please check the URL and try again.")
    return
  else:
    data = response.read()
    httpConn.close()

  with open(outfile, 'w') as file:
    file.write('window.'+service+'=')
    file.write(data)
