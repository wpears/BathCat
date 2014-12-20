import httplib
import arcpy

def GetGeometries(endpoint, service, isTight):
  server = endpoint.split('argis/rest')[0]
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

  