from os import path
from zipfile import ZipFile

def ZipXYZ (xyz, dir='\\\\mrsbmapp21161\\giswebapps\\bathymetry\\zips'):

  file_name = path.basename(xyz)

  with ZipFile(path.join(dir, path.splitext(file_name)[0] + '.zip'),'w') as zippedXYZ:
    zippedXYZ.write(xyz, file_name)
    return zippedXYZ