import arcpy, httplib, urllib, json

def GetToken(username, password, machine):

  tokenURL = "/arcgis/admin/generateToken"
  params = urllib.urlencode({'username': username, 'password': password, 'client': 'requestip', 'expiration':180,'f': 'json'})
  headers = {"Content-Type": "application/x-www-form-urlencoded", "Accept": "text/plain"}

  conn = httplib.HTTPConnection(machine, 6080)
  conn.request("POST", tokenURL, params, headers)
  token = processConnection(conn)
  return token['token']
        
def processConnection(conn):
  response = conn.getresponse()
  if (response.status != 200):
    conn.close()
    arcpy.AddMessage("Error while fetching tokens from admin URL. Please check the URL and try again.")
    return
  else:
    data = response.read()
    conn.close()

    if not assertJsonSuccess(data):
      return

    return json.loads(data)

def assertJsonSuccess(data):
  obj = json.loads(data)
  if 'status' in obj and obj['status'] == "error":
    arcpy.AddMessage("Error: JSON object returns an error. " + str(obj))
    return False
  else:
    return True