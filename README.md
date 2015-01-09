Interactive catalog of Bathymetry collected by the California Department of Water Resources.


[Give it a whirl](https://gis.water.ca.gov/app/bathymetry).


##Issues
If you find a bug please file an [issue](https://github.com/wpears/BathCat/issues) including:

- the problem

- steps to reproduce

- browser and version

- any additional relevant info

##Build Process:

###To update rasters:
  
  - Open the master map document that contains the rasters already in the map. As of 1/9/2015 this is at \\\\nasgisnp\EntGIS\Cadre\Bathymetry\bathymetry_rasters.mxd

  - Add the new raster data. The only requirement is that it is *not* pre-projected to Web Mercator.

  - Run the update.py script. As of 1/9/2015 this is at \\\\mrsbmapp21161\giswebapps\bathymetry\buildfiles in the BathCat toolbox. Connecting to the above location in ArcMap will be convenient.

  - Defaults to the scripts can be reasonably accepted. You'll need to enter your username in the dialog box and your password in the separate python prompt (done to conceal your password).

  - The script may take quite a bit of time to run, depending on the size and number of the rasters. For ~5 large rasters, expect up to an hour of processing time. There will be feedback in the results window concerning what operations are happening at any given time.

###To update the app:

  - Change your index.html file to reference BathCat.js (rather than the minified version)
  - 
