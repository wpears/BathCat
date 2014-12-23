import httplib

def DeleteService(server, folder, service, token):

  url = "/arcgis/admin/services/" + folder + "/" + service + ".MapServer/delete?token="+token
  
  httpConn = httplib.HTTPConnection(server, 6080)
  httpConn.request("POST", url)
  httpConn.close()
