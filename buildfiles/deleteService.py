import httplib
import arcpy

def DeleteServices(server, folder, service, token):

  url = "/arcgis/admin/services/" + folder + "/" + service + ".MapServer/delete?token="+token
  
  httpConn = httplib.HTTPConnection(server, 6080)
  httpConn.request("POST", url)

  response = httpConn.getresponse()
  if (response.status != 200):
    arcpy.AddMessage("Couldn't delete service {}.".format(service))
  httpConn.close()
