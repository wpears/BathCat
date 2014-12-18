import datetime
import time
import re

dateMatch = '(\d{4})_(\d{2})(\d{2})'
def GetDate(name):
  match = re.search(dateMatch,name)
  date = datetime.date(*[int(match.group(num)) for num in range(1,4)])
  return time.mktime(date.timetuple())*1000