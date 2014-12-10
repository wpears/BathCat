from os import path
import zipfile

def ZipXYZ (xyz, xml, dir='\\\\mrsbmapp21161\\giswebapps\\bathymetry\\zips'):

  file_name = path.basename(xyz)

  with zipfile.ZipFile(path.join(dir, path.splitext(file_name)[0] + '.zip'),'w') as zippedXYZ:
    zippedXYZ.write(xyz, file_name, zipfile.ZIP_DEFLATED)
    zippedXYZ.write(xml, "Metadata.xml", zipfile.ZIP_DEFLATED)
    return zippedXYZ