import arcpy
import httplib
from os import path
from deleteService import DeleteService
from makeService import MakeService

def UpdateService(server, folder, mxd, token):
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






  editURL = "/arcgis/admin/services/" + folder + "/" + service + ".MapServer/edit?token="+token