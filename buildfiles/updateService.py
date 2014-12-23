import arcpy
import httplib, urllib
from os import path
from time import sleep
from deleteService import DeleteService
from makeService import MakeService

def UpdateService(server, folder, mxd, token, gisConnection):
  service = path.basename(mxd.filePath).split(path.extsep)[0]
  url = "/arcgis/admin/services/" + folder + "/" + service + ".MapServer?f=json&token="+token
  httpConn = httplib.HTTPConnection(server, 6080)
  httpConn.request("GET", url)
  resp = httpConn.getresponse()

  if resp.status != 200:
    arcpy.AddMessage("Failed to query for service params.")
    httpConn.close()
    return

  serviceParams = resp.read()
  httpConn.close()

  arcpy.AddMessage(serviceParams)

  DeleteService(server, folder, service, token)

  MakeService(mxd, folder, gisConnection)
  sleep(10)

  editURL = "/arcgis/admin/services/" + folder + "/" + service + ".MapServer/edit?"+urllib.urlencode({'service':serviceParams,'token':token,'f':'json'})
  httpConn = httplib.HTTPConnection(server, 6080)
  httpConn.request("POST", editURL)
  resp = httpConn.getresponse()
  if resp.status != 200:
    arcpy.AddMessage("Failed to update service with its params. Will need to be set manually.")
  httpConn.close()