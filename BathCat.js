require(["esri/esri","dgrid/dgrid", "dojox/dojox","modules/modules"],function(){
require(["dojo/dom"
				,"dojo/query"
				,"dojo/dom-class"
				,"dojo/on"
				,"dojo/ready"
				,"dojo/aspect"
				,"dojo/_base/Color"
				,"dojo/has"

				,"esri/map"
				,"esri/config"
				,"esri/SpatialReference"
				,"esri/geometry/Extent"
				,"esri/layers/FeatureLayer"
				,"esri/layers/ArcGISDynamicMapServiceLayer"
				,"esri/layers/ArcGISTiledMapServiceLayer"
				,"esri/tasks/GeometryService"
				,"esri/tasks/geometry"
				,"esri/dijit/TimeSlider"
				,"esri/TimeExtent"
				,"esri/dijit/Scalebar"
				,"esri/renderers/SimpleRenderer"
				,"esri/symbols/SimpleLineSymbol"
				,"esri/symbols/SimpleFillSymbol"
  			,"esri/symbols/SimpleMarkerSymbol"
  			,"esri/geometry/Point"

  			,"modules/geosearch"
  			,"modules/symbols"
				,"modules/popup"
				,"modules/animationtool"
				,"modules/crosstool"
				,"modules/identtool"
				,"modules/measuretool"
				,"modules/clearnode"
				,"modules/tooltip"
				,"modules/getdate"
				,"modules/gridconnector"
				,"modules/setvisiblerasters"
				,"modules/basemap"
				,"modules/zoomlevel"

				,"require"
				],
function( dom
				, dquery
				, domClass
				, on
				, ready
				, aspect
				, Color
				, has

				, Map
				, Config
				, SpatialReference
				, Extent
				, FeatureLayer
				, DynamicLayer
				, TiledLayer
				, GeometryService
				, esriGeom
			  , TimeSlider
			  , TimeExtent
			  , ScaleBar
			  , SimpleRenderer
			  , SimpleLine
				, SimpleFill
				, SimpleMarker
				, Point

				, GeoSearch
        , symbols
				, Popup
				, AnimationTool
				, CrossTool
				, IdentTool
				, MeasureTool
				, clearNode
				, Tooltip
				, getDate
				, GridConnector
				, SetVisibleRasters
				, GetBasemap
				, zoomLevel

				, require
				){


  ready(function(){ //wait for the dom
   	var W = window
   		, DOC = document
   		, protocol = DOC.location.protocol
   		, host = DOC.location.host
   		, origin = protocol +'//' + host
   		, touch = has("touch")
   		, ie9 = (DOC.all&&DOC.addEventListener&&!W.atob) ? true : false
   		, fx = ie9 ? require("dojo/_base/fx", function(fx){return fx}) : null
   		, innerHeight = W.innerHeight
   		, innerWidth = W.innerWidth
   		, showData

   		//DOM handles
   		, mainWindow = dom.byId("mainWindow")
   		, mapDiv = dom.byId("mapDiv")
   		, gridPane, gridNode, spl
   		, dataPane, dataCon, dataNode, dlLink, downloadNode
   		, animAnchor, crossAnchor, identAnchor, measureAnchor, toolOffMessage
   		, zoomSlider, fullExtentButton, topo, sat, timeDiv

   		, introText = "<p>The <strong>Delta Bathymetry Catalog</strong> houses the complete set of multibeam bathymetric data collected by the Bathymetry and Technical Support section of the California Department of Water Resources.</p><p>Click on a feature in the map or table to bring up its <strong>description</strong>. Double-click to view the <strong>raster image</strong>.</p> <p><strong>Download</strong> data as text files from the descrption pane.</p> <p><strong>Measure</strong> distances, <strong>identify</strong> raster elevations, draw <strong>profile graphs</strong>, and <strong>animate</strong> selected rasters with the tools at the top-right.</p> <p>Change what displays by <strong>collection date</strong> with the slider at bottom-right. <strong>Sort</strong> by date and name with the table's column headers.</p> <p>See the <strong>help</strong> below for further information.</p>"
   		;

   	//UI split between desktop and mobile
   	makePeripherals();
   	makeViews();
   	setHeader();


   	//Show body once the DOM is ready and the panes are built to prevent FOUC
   	DOC.body.style.visibility = "visible";


   	//API tweaks
    Config.defaults.io.corsDetection = false;
    Config.defaults.io.corsEnabledServers.push(origin);//enable cors for quicker queries
    Config.defaults.geometryService = new GeometryService(protocol+"//sampleserver3.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer"); 	


 		var rasterUrl = origin+"/arcgis/rest/services/Public/bathymetry_rasters/MapServer" 
 		var topoUrl = protocol+"//services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer";


 		var spatialRef = new SpatialReference(102100);
 		var initialExtent = new Extent(-13612000, 4519000,-13405000, 4662600,spatialRef);
 		var defaultZoomLevel = innerHeight > 940?11:innerHeight > 475?10:9;


 		var centerPoint;
 	  if (touch)centerPoint = new Point({x: -13528681.36062705, y: 4583780.268055417,spatialReference:spatialRef});
   	else centerPoint = new Point({x: -13523942.264873397, y: 4586455.564045421,spatialReference:spatialRef});


    var map = new Map(mapDiv, {extent:initialExtent,center:centerPoint,zoom:defaultZoomLevel})
    window.map = map;
    var topoMap = new TiledLayer(topoUrl);
    var satMap;
    var rasterLayer = new DynamicLayer(rasterUrl, {id:"raster"})
    var tiout;
		var outlines;


		map.addLayer(topoMap);
		rasterLayer.setVisibleLayers([-1]);

		//outlines are included in separate files, loaded before the module loader is even in place
		var outlinesFeatureSet = window.DATA_OUTLINES;
		var features = outlinesFeatureSet.features;
	  var featureCount = features.length;


    var blank = new SimpleFill(SimpleFill.STYLE_SOLID, new SimpleLine(SimpleLine.STYLE_SOLID, new Color([255, 255, 255, 0]), 1), new Color([0, 0, 0, 0]))


		var layDef ={"geometryType":"esriGeometryPolygon"
		            ,"spatialReference":spatialRef
		            ,"displayFieldName": "OBJECTID"
		            , "fields" : [
				    {"name" : "OBJECTID",
				      "type" : "esriFieldTypeOID"},
				    {"name" : "Project",
				      "type" : "esriFieldTypeString"},
				    {"name" : "Date",
				      "type" : "esriFieldTypeDate"},
				    {"name" : "Waterways",
				      "type" : "esriFieldTypeString"},
				    {"name" : "Method",
				      "type" : "esriFieldTypeString"},
				    {"name" : "Client",
				      "type" : "esriFieldTypeString"},
				    {"name" : "Purpose",
				      "type" : "esriFieldTypeString"}
				  ]};



		tiout = new FeatureLayer({
			featureSet:window.TIGHT_OUTLINES,
				layerDefinition:{
					"geometryType":"esriGeometryPolygon"
				 ,"spatialReference":spatialRef
				 ,"displayFieldName": "Shape_Length"
				 , "fields" : [{
					  "name" : "OBJECTID"
					  ,"type" : "esriFieldTypeOID"
				   }]
				}
		  },
		  {id:"tiout"
		  ,mode: FeatureLayer.MODE_SNAPSHOT
		  }
		);


		outlines = new FeatureLayer({layerDefinition:layDef, featureSet:outlinesFeatureSet}, {
	  	id:"out",
     	 	mode: FeatureLayer.MODE_SNAPSHOT,
     	 	outFields: ["*"]
		});


    tiout.setRenderer(new SimpleRenderer(blank));
		outlines.setRenderer(new SimpleRenderer(blank));


    map.addLayer(tiout);
    map.addLayer(outlines);


   	tiout.on("graphic-node-add",function(e){
	  	if(insideTimeBoundary[e.graphic.attributes.OBJECTID]){
  	  	return;
	  	}
	    e.node.setAttribute("class","hiddenPath")
    });

    tiout.on("update-end", function(){
 		  redrawAllGraphics(tiout.graphics);							
    });


    satMap = new TiledLayer(protocol+"//services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer");
	  map.addLayer(satMap);
	  satMap.hide();



	  //varibles for modules to be instantiated
	  var gridObject
	  	, geoSearch
	  	, setVisibleRasters
	  	, getBasemap	  	
	 		, tooltip
	 		, phasingTools
	 		, crossTool
	 		, identTool
	 		, meaTool
	 		//needed by some tools
	 		, eventFeatures= [outlines]
	 		, legendObj
	 		//needed semi-global
	 		, rPConHeight=setrPConHeight()
	 		;


	 	//tracking arrays, used to speed up some functions ( O(n) -> O(1) )
	  var	layerArray = new Array(featureCount)
	  	, hl = new Array(featureCount + 1)
	  	, gridData = new Array(featureCount)
			, formattedDates = new Array(featureCount)
			, names = new Array(featureCount)
			, insideTimeBoundary = new Array(featureCount + 1)
			, rastersShowing = {}
			;




	  //Initialize all app-wide tracking arrays
		(function(){
			var att, mi, ss="Soil Sed. ";
			for(var i = 0; i<featureCount; i++){
				att=features[i].attributes;
				layerArray[i] = i;
				hl[i] = 0;
				insideTimeBoundary[i] = 1;
				rastersShowing[i+1] = 0;
				formattedDates[i]= getDate(att.Date);
				names[i] = (att.Project.length<6?ss + att.Project:att.Project);
			}
		})();
		hl[featureCount] = 0;
		insideTimeBoundary[featureCount] = 1;

		(function(){
			for(var i = 0; i<featureCount; i++){
				var intData ={};
				var featureAttr = features[i].attributes;
				intData.__Date = featureAttr.Date;
				intData.Date = formattedDates[i];
				intData.Project = names[i];
				intData.OBJECTID = featureAttr.OBJECTID;
				gridData[i]=intData;
			}
		})();




		//selects map features and manages OIDs
		geoSearch = GeoSearch(outlines, highlighter, insideTimeBoundary, showData);





	/************UI WIDGETS AND MODULES***************/





    gridObject = GridConnector( gridData
     													, gridNode
     													, gridPane
     													, spl
     													, rasterLayer
     													, insideTimeBoundary
     													, rastersShowing
     													, oidToGraphic
     													, placeMap
     													, map);



    //Identify and profile tools don't make sense without rasters on. Added here to pass around later
		//for updating of the tools' visibility
		phasingTools = [
		  {tool:null,anchor:crossAnchor,eventFeatures:eventFeatures},
		  {tool:null,anchor:identAnchor,eventFeatures:eventFeatures}
		];



		if(!touch){
			legendObj = function(){
				var leg = dom.byId("legendWrapper");

				function showLegend(){
					if(ie9){
						fx.animateProperty({node:leg, duration:200, properties:{right:30}}).play();
					}else
					domClass.replace(leg,"movd","hiddenLegend")
				}
				function hideLegend(){
					if(ie9){
						fx.animateProperty({node:leg, duration:200, properties:{right:-255}}).play();
					}else
					domClass.replace(leg,"hiddenLegend","movd");
				}
				return{
					node:leg,
					show:showLegend,
					hide:hideLegend
				}
			}();
		}



    setVisibleRasters = SetVisibleRasters( map
    	                                   , rasterLayer
    	                                   , touch
    	                                   , phasingTools
    	                                   , legendObj
    	                                   , insideTimeBoundary
    	                                   );



		(function(){

			//Scalebar instantiation
			new ScaleBar({map:map});
			var scalebarNode = dquery(".esriScalebar")[0]



			//Basemap instantiation
		  getBasemap = GetBasemap([{name:"topo",layer:topoMap,anchor:topo}
						 ,{name:"sat",layer:satMap,anchor:sat}
						 ]
						 , map
						 , function(){
						 		setTextColor();
								redrawAllGraphics(tiout.graphics);
							 }
						);



		  //Connect initial extent button
		  on(fullExtentButton,"mousedown", function(e){
				map.centerAndZoom(centerPoint,defaultZoomLevel)
			});



			//TimeSlider instantiation
			var timeSlider
			  , tCount
			  , sliderDiv = DOC.createElement('div')
				, timeExtent = new TimeExtent(new Date("01/01/2010 UTC"), new Date("12/31/2014 UTC"))
				;

			map.setTimeExtent(timeExtent);
			timeDiv.appendChild(sliderDiv);
			timeSlider = new TimeSlider({                                            //create TimeSlider
				style:"width:300px;",
				id: "timeSlider",
				intermediateChanges: true},
				sliderDiv
				);
			timeSlider.setThumbCount(2);
			timeSlider.createTimeStopsByTimeInterval(timeExtent, 2, "esriTimeUnitsMonths");
			tCount = timeSlider.timeStops.length;
			timeSlider.setThumbIndexes([0, tCount]);
			timeSlider.setTickCount(Math.ceil(tCount/2));
			timeSlider.startup();
			timeSlider.on("time-extent-change", doTimeUpdate);
			map.setTimeSlider(timeSlider);

		

			//TimeSlider labels
			var labelCon = DOC.createElement('div');
			var endDate = timeSlider.fullTimeExtent.endTime.getFullYear() + 1;
			var currNode;
			var tsLinks = [];

			labelCon.className = 'labelCon atop';

			if (touch){
				labelCon.className += ' labelTouch';
				timeDiv.style.display="none";
			}

			for(var startDate = 2010;startDate<=endDate;startDate++){
				var elem = DOC.createElement('div');
				tsLinks.push(elem);
				elem.className = "tsLabel";
				if(startDate === endDate){
					elem.innerText = "All";
					currNode = elem;
				}
				else elem.innerText = startDate;
				labelCon.appendChild(elem);
			}
			mapDiv.appendChild(labelCon);

			highlightLabel(currNode);



			//TimeSlider eventhandlers
			if(touch){
				on(labelCon,".tsLabel:touchstart",function(e){
					clearHighlight(currNode);
					currNode=e.target
					highlightLabel(currNode);
					setTimeout(function(){setTime(e)},0);
				})
			}else{
				on(labelCon, ".tsLabel:mouseover", function(e){
					if(e.target!==currNode)highlightLabel(e.target);
				});
				on(labelCon, ".tsLabel:mouseout", function(e){
					if(e.target!==currNode)clearHighlight(e.target);
				});
				on(labelCon, ".tsLabel:mousedown", function(e){
					clearHighlight(currNode);
					currNode = e.target;
					setTime(e)
				});
			}



			function doTimeUpdate(timeExtent){
				var currentCount = geoSearch.selected.length;
				gridObject.timeUpdate(timeExtent);
				if(currentCount!== geoSearch.selected.length){
	        showData(null)
	      }
			}


			function setTime(e){  //timeslider quicklinks handler
				var yr = e.target.innerHTML;
				if(yr.charAt(0)=== "A")
					timeSlider.setThumbIndexes([0, timeSlider.timeStops.length]);
				else
					timeSlider.setThumbIndexes([6*(yr-2010), 6*(yr-2010)+6]);
			}


			function highlightLabel(node){
				domClass.add(node,"tsHighlight")
			}


			function clearHighlight(node) {
				domClass.remove(node,"tsHighlight")
			}


			//basemap labeling
			function setTextColor(){
				if(getBasemap() === 'sat'){
					domClass.add(scalebarNode,"whiteScaleLabels");
					domClass.add(labelCon,"satLabels")
				}else{
					domClass.remove(scalebarNode,"whiteScaleLabels");
					domClass.remove(labelCon,"satLabels")
				}
			}

			//set initial labels
		  setTextColor();
		})();


  



/************TOOLS***************/



		AnimationTool(animAnchor, features, rasterLayer, rastersShowing, geoSearch,  gridObject.oidToRow, map)


		tooltip = Tooltip(toolOffMessage);


		on.once(crossAnchor,"mousedown", function(e){
				var options = { map:map
											, rastersShowing:rastersShowing
											, eventFeatures:eventFeatures
											, chartNames:names
											, chartDates:formattedDates
											, tooltip:tooltip
										  };						  	  
				crossTool = CrossTool(rasterLayer, Popup(), crossAnchor, geoSearch, options);
				phasingTools[0].tool = crossTool;
				crossTool.init(e);				
		});


		on.once (identAnchor,"mousedown", function(e){
				var options= { map: map
										 , rastersShowing: rastersShowing
										 , eventFeatures:eventFeatures
										 , names:names
										 , dates:formattedDates
										 , tooltip:tooltip
									   };
				identTool = IdentTool(identAnchor, rasterUrl, layerArray, options);
				phasingTools[1].tool = identTool;
				identTool.init(e);
		});


		meaTool = MeasureTool( measureAnchor
			                   , new SimpleLine(SimpleLine.STYLE_SOLID, new Color([0, 0, 0]), 2)
												 , new SimpleMarker({"size":6,"color":new Color([0, 0, 0])})
												 , { map:map
												 	 , eventFeatures:eventFeatures
												 	 }
												 );


		on.once(measureAnchor,"mousedown", function(e){meaTool.init(e)});





/************* MOUSE EVENTS ****************/




		(function(){
			var outlineMouseMove
				, mouseDownTimeout
				, previousRecentTarget
				, mouseDownX
				, mouseDownY
				, justMousedUp = false
				, outMoveTime = 0
				, cursor = 1
				, headerNodes = dom.byId("gridNode-header").firstChild.children
				;
		

				function nullPrevious(){
					previousRecentTarget = null;
				}



		/************* GRID ****************/




		    function cellClick(e){  //grid click handler
		      var et = e.target
		      	, oid = getOIDFromGrid(e)
		      	, attributes
		      	;

		      if(!oid || et.tagName=="INPUT")return;
		      if(domClass.contains(et,"field-Image")){
		      	var input = et.firstChild;
		      	input.checked = !input.checked;
		      	return gridInput(e);
		      }

		      highlighter(oid,"hi", 1);

		      //prevent click before double click
		      if(et!== previousRecentTarget){
		        window.clearTimeout(mouseDownTimeout);
		        previousRecentTarget = et;
		        mouseDownTimeout = W.setTimeout(nullPrevious, 400);
		        attributes = features[oid-1].attributes;

		        //target is sole open
		        if(geoSearch.isStored(oid)&&geoSearch.selected.length === 1){
		          geoSearch.clear(oid, 1, 1);
		          showData(null);
		        }else{
		          geoSearch.clearAndSet(oid);
		        }   
		      }
		    }


		    
		    function gridDbl(e){
		      var inputBox, oid = getOIDFromGrid(e);
		      if(oid){
		        var graphic = oidToGraphic(oid);
		        if(!graphic){
		          return;
		        }

		        if(e.target.localName!== "div"){
		          geoSearch.clearAndSet(oid)
		          inputBox = gridObject.getInputBox(oid);
		          map.setExtent(graphic._extent.expand(1.3));

		          if(!inputBox.checked){
		            inputBox.checked = true;
		            rastersShowing[oid] = 1;
		            setVisibleRasters.add(oid);
		            setVisibleRasters.run(0);
		          }
		        }
		      }
		    }



		    function gridInput (e){
        	var oid = getOIDFromGrid(e);

        	if(rastersShowing[oid]){
          	rastersShowing[oid] = 0;
        	}else{
          	rastersShowing[oid] = 1;
          //gridObject.makeViewable(oid,map.getLevel(),map.extent.getCenter());
        	}

        	setVisibleRasters.add(oid);
        	setVisibleRasters.run(1);
    		}



		    function sortAndScroll(fn){
		    	return function(e){
		    	  fn(e);
		    	  if(geoSearch.selected.length)gridObject.scrollToRow(geoSearch.selected[0]);
		    	}
		    }


		   	gridObject.gridSorter.date();

		    if(touch){
		    }else{
		      gridObject.grid.on(".dgrid-cell:mousedown", cellClick);


		      gridObject.grid.on(".dgrid-cell:dblclick", gridDbl);


		      gridObject.grid.on(".dgrid-cell:mouseover", function(e){
		        var oid = getOIDFromGrid(e);
		        if(oid)highlighter(oid,"hi", 1);  
		      });


		      gridObject.grid.on(".dgrid-cell:mouseout", function(e){
		        var oid = getOIDFromGrid(e);
		        if(geoSearch.isStored(oid))
		          return;
		        else
		          highlighter(oid,"", 1);
		      });


		      gridObject.grid.on(".dgrid-input:change", gridInput);


		      on(headerNodes[0], "mousedown", sortAndScroll(gridObject.gridSorter.name));


		      on(headerNodes[1], "mousedown", sortAndScroll(gridObject.gridSorter.date));
		    }




		/*********** FEATURES ************/



				//map mouseover handler
				outlines.on("mouse-over", function(e) {
					if(outlineMouseMove) outlineMouseMove.remove();
					outlineMouseMove = outlines.on("mouse-move", mmManager);
					if(cursor){
		        map.setMapCursor("pointer");
		        cursor = 0;
		      }
				});


				function mmManager(e){
					if(Date.now()<outMoveTime+100)
						return;
					if(justMousedUp){
						justMousedUp = false;
						return;
					}
					geoSearch(e, 0, 0);
					outMoveTime = Date.now();
				}


				//map mouseout handler
				outlines.on("mouse-out", function(e){
					if(!cursor){map.setMapCursor("default"); cursor=1;}
					outlineMouseMove.remove();
					outlineMouseMove = null;
					geoSearch(null, 0, 0);
				});


				outlines.on("mouse-down", function(e){mouseDownX = e.pageX;mouseDownY = e.pageY;});


        //map click handler
				outlines.on("mouse-up", function(e){
					if(e.pageX < mouseDownX+10&&e.pageX > mouseDownX-10&&e.pageY < mouseDownY+10&&e.pageY > mouseDownY-10){
						justMousedUp = true;

						var attributes = e.graphic.attributes
							, oid = attributes.OBJECTID
							;

						//prevent click before double click
						if(oid!== previousRecentTarget){
							W.clearTimeout(mouseDownTimeout);
							previousRecentTarget = oid;
							mouseDownTimeout = W.setTimeout(nullPrevious, 400);

							geoSearch(e, 1, 0);

							if(geoSearch.selected.length > 1) gridObject.gridSorter.ascendingName();
							gridObject.scrollToRow(oid);
						}
					}
				});


				//map dblclick handler
				outlines.on("dbl-click", function(e){
					var oid = e.graphic.attributes.OBJECTID
						//If graphics were already on and accidentally cleared by doubleclick
						, reSearch = geoSearch.selected.indexOf(oid)===-1
						;

					if(reSearch){
						geoSearch(e, 1, 0);
						gridObject.scrollToRow(oid);
					}

					if(geoSearch.selected.length){
						if(map.getScale()>73000)
							map.setExtent(oidToGraphic(geoSearch.selected[0])._extent.expand(1.3));
						setVisibleRasters(geoSearch.selected, 0);
						gridObject.checkImageInputs(geoSearch.selected);
					}
				});

		})();




 

/*******DRAWING FUNCTIONS*********/






																					//apply highlighting logic to an array
		function redrawAllGraphics(){    
			for(var i =1,j=featureCount+1;i<j;i++){
				if(insideTimeBoundary[i]){
					if(geoSearch.isStored(i))
						highlighter(i,"hi", 0);
				  else
						highlighter(i,"", 0);
				}
			}
		}
																//main highlighting logic, separated by year with different basemap

		function highlighter(oid, hi, fromEvent){
			if(fromEvent&&(hi&&hl[oid]||!hi&&!hl[oid])){return}//short circuit unless on a redraw (fromEvent==0)
			var symbolSet = symbols[getBasemap()]
				, date
			  , graphic = oidToGraphic(oid)
				,	row
				;

			if(!graphic) return;

			date = features[oid-1].attributes.Date;
			color = getColor(date);
			if(fromEvent){
				row = gridObject.oidToRow(oid);
				if (hi!== ""){
					domClass.add(row,"highl"+color);
					hl[oid]=1;
				}else{
					domClass.remove(row,"highl"+color);
					hl[oid]=0;
				}
			}
			if(zoomLevel.get() > 12){
				if (hi) hi="";
				else color+="thin";
			}
			graphic.setSymbol(symbolSet[color+hi]);
		}

		function getColor(date){
			if (date < 1293840000000) return "gre";
			if (date < 1325376000000) return "mag";
			if (date < 1357027200000) return "blu";
			if (date < 1388563200000) return "red";
			if (date < 1420099200000) return "bro";
		}

		function oidToGraphic(oid){
			return tiout.graphics[oid-1];
		}

		function getOIDFromGrid(e){ //returns the gets an ObjectID from an event either on the grid or map
			var etP = e.target.parentNode;
			if(etP.children[2])
				return +etP.children[2].innerHTML;
			else if(e.target.className == "dgrid-input")
				return +etP.parentNode.children[2].innerHTML;
		}







/************* INITIALIZE THE UI, FORKING FOR MOBILE *************/




		//Make important accessory layout features (tabs, legend, etc)
    function makePeripherals(){
   		if(touch){
   			var dataTab = DOC.createElement('div');
   			var gridTab = DOC.createElement('div');
   			var mid = innerHeight/2;

   			dataTab.id = 'dataTab';
   			gridTab.id = 'gridTab';

   			dataTab.className = "atop unselectable";
   			gridTab.className = "atop unselectable";

   			dataTab.innerHTML='<strong class="sideways">Info</strong>';
   			gridTab.innerHTML='<strong class="sideways">Grid</strong>';

   			dataTab.style.top = mid-100+"px";
   			gridTab.style.top = mid-100+"px";
   			mainWindow.appendChild(dataTab);
   			mainWindow.appendChild(gridTab);

   		}else{
   			var closer = DOC.createElement('div');
   			closer.id = 'closeRp';
   			closer.className = 'mov atop unselectable';
   			closer.innerHTML = '<div id="arro"></div>';
	   		mainWindow.appendChild(closer);

	   		var legendWrapper = DOC.createElement('div');
	   		var legend = DOC.createElement('div');

	   		legendWrapper.id = "legendWrapper";
	   		legend.id = "legend";

	   		legendWrapper.className = "atop";
	   		legendWrapper.title = "Image Legend (NAVD88 ft)";

	   		legendWrapper.appendChild(legend);
	   		DOC.body.appendChild(legendWrapper);
	   	}
   	}




    //Make and initialize grid and data containers. Afterwards get handles for important DOM nodes
		function makeViews(){
			gridPane = DOC.createElement('div');
   		dataPane = DOC.createElement('div');


			if(touch){
				gridPane.id = "gridView";
   			dataPane.id = "dataView";
   			gridPane.innerHTML = '<div id="gridNode"></div>';
   		}else{
   			gridPane.id = "lP";
   			dataPane.id = "rP";
   			dataPane.className = "mov atop";
   			gridPane.innerHTML = '<div id="gridNode"></div><div id="lPSplitter"><div class="splitterThumb"></div></div>';
   		}


   		dataPane.innerHTML='<div id="dataCon"><div id="dataNode"></div><div id="downloadNode"><strong id="dlTitle">Downloads:</strong><a class="downloadlink" href="zips/Metadata.zip" target="_self">Metadata</a><a class="downloadlink" id="dlLink" href="tryagain.zip" target="_self">Dataset</a></div></div><div id="infopane"></div><div id="foot" class="unselectable"><div class="footDiv">Help</div><div class="footDiv">Terms of Use</div><div class="footDiv">Contact</div></div>';

   		mainWindow.appendChild(gridPane);
   		mainWindow.appendChild(dataPane);

   		defineDOMHandles();
   		setDataPaneHeight();

   		if(touch){
   			attachMobileViews();
   		}else{
   			placeMap(gridPane.clientWidth + 6);
   			attachPanes();
   		}
		}



		//call to wire up datapane functionality
   	function attachDataPaneHandlers(){
		  var helpText = "<strong id = 'infoPaneTitle'>Help</strong><p>Zoom in and out with the <b>Zoom buttons</b> or the mousewheel. Shift and drag on the map to zoom to a selected area.</p><p>Go to the full extent of the data with the <b>Globe</b>.</p><p>Select map or satellite view with the <b>Basemap buttons</b>.</p><p>Browse through projects in the table. Sort the table with the column headers and collapse it with the <b>Slider</b>.</p><p>Turn on a raster by double-clicking it in the table or map, or checking its checkbox in the table.</p><p>When a raster is displayed:<ul><li><b>Animate</b> selected rasters, with the currently shown raster underlined in the right pane and highlighted in the table.</li><li>Draw a cross-section graph with the <b>Profile tool</b>. Click the start and end points of the line to generate a graph in a draggable window. Hover over points to display elevation.</li><li>With the <b>Identify</b> tool, click to display NAVD88 elevation at any point.</li></ul><p>Use the <b>Measure tool</b> to calculate distance, area, or geographic location.</p><p>Project information and Identify results are displayed in the right pane. Toggle this pane with the <b>Arrow button</b>.</p><p>Use the <b>Time slider</b> to filter the display of features by date. Drag the start and end thumbs or click a year to only display data from that year.</p>"
			, termText = "<strong id = 'infoPaneTitle'>Terms of Use</strong><p>The data displayed in this application is for qualitative purposes only. Do not use the data as displayed in rigorous analyses. If downloading the data, familiarize yourself with the metadata before use. Not for use as a navigation aid. The data reflects measurements taken at specific time periods and the Department of Water Resources makes no claim as to the current state of these channels, nor to the accuracy of the data as displayed. Do not share or publish this data without including proper attribution.</p>"
			,	conText = "<strong id = 'infoPaneTitle'>Contact</strong><p>For information on scheduling new bathymetric surveys, contact  <a href = 'mailto:shawn.mayr@water.ca.gov?subject = Bathymetric Survey'>Shawn Mayr</a>, (916) 376-9664.</p><p>For information on this application or the data contained herein, contact  <a href = 'mailto:wyatt.pearsall@water.ca.gov?subject = Bathymetry Catalog'>Wyatt Pearsall</a>, (916) 376-9643.</p>"
			,	infoPane = dom.byId("infopane")
			, foot = dom.byId("foot")
			, infoPaneOpen = 0
			, timeout
			, lastButt
			;


			//Allow easy exploration of the widgets by highlighting them when describing their function
			function toggleHelpGlow(e){
				if(e.target.tagName === "B"){
	 				var key = e.target.textContent.slice(0, 3);
	 				switch (key){
		   			case "Zoo":
		   			  if (!zoomSlider)zoomSlider = dom.byId("mapDiv_zoom_slider")
		   				domClass.toggle(zoomSlider,"helpglow");
		   				break;
		   			case "Glo":
		   				domClass.toggle(dom.byId('fullExtentButton'),"helpglow");
		   				break;
		   			case "Bas":
		   				domClass.toggle(topo,"helpglow");
		   				domClass.toggle(sat,"helpglow");
		   				break;
		   			case "Sli":
		   				domClass.toggle(spl,"helpglow");
		   				break;
		   			case "Ani":
		   				domClass.toggle(animAnchor,"helpglow");
		   				break;
		   			case "Ide":
		   				domClass.toggle(identAnchor,"helpglow");
		   				break;
		   			case "Pro":
		   				domClass.toggle(crossAnchor,"helpglow");
		   				break;
		   			case "Mea":
		   				domClass.toggle(measureAnchor,"helpglow");
		   				break;
		   			case "Arr":
		   				var closeButton = dom.byId("closeRp");
		   				if(closeButton)
		   					domClass.toggle(closeButton,"helpglow");
		   				break;
		   			case "Tim":
		   				domClass.toggle(dom.byId("timeSlider"),"helpglow");
		   				break;
	 				}
	 			}
			}


			//Populate and possibly trigger the display of the info pane, controlled by the datapane buttons
			function setInfo(e){
   			if(timeout)clearTimeout(timeout);
   			if(lastButt)
   					domClass.remove(lastButt,"activeFoot");
   			else{
   				showInfoPane();
   			}

   			if(lastButt === e.target){
   				hideInfoPane();
   				lastButt = null;
   				return;
   			}
   			lastButt = e.target;
   			var whichButt = lastButt.innerHTML.slice(0, 1);
   			infoPane.innerHTML = whichButt === "H"
   												 ? helpText
   												 : whichButt === "T"
   												 		 ? termText
   												 		 : conText
   												 		 ;
   			domClass.add(lastButt,"activeFoot");
   		}
	   

			function clearInfo(){
				timeout = 0;
	   		clearNode(infoPane);
	  		infoPaneOpen = 0;
	   		infoPane.style.borderTop = "none";
	   	}


	   	//infopane display logic
	   	function showInfoPane(){
			  infoPaneOpen = 1;
				infoPane.style.borderTop = "2px solid #99ceff";
				if(ie9){
					infoPane.style.width=dataCon.offsetWidth+16+"px";
					fx.animateProperty({node:infoPane, duration:200, properties:{bottom:0}}).play();
					fx.animateProperty({node:dataCon, duration:200, properties:{height:rPConHeight-210}}).play();
				}else{
					infoPane.style["-webkit-transform"] = "translate3d(0,-242px,0)";
					infoPane.style["transform"] = "translate3d(0,-242px,0)";
					setTimeout(function(){setDataConHeight(rPConHeight-242)},180)
				}
			}


			function hideInfoPane(){
				timeout = W.setTimeout(clearInfo, 205);
				if(ie9){
	   					fx.animateProperty({node:infoPane, duration:200, properties:{bottom:-210}}).play();
	   					fx.animateProperty({node:dataCon, duration:200, properties:{height:rPConHeight}}).play();
	   		}else{
	   			setDataConHeight(rPConHeight)
	   			infoPane.style["-webkit-transform"] = "translate3d(0,0,0)";
					infoPane.style["transform"] = "translate3d(0,0,0)";
	   		}
			}


   		//when multiple datasets are listed in the dataNode, make them act like links to their data
			function oneFromMany(e){
   			var node = e.target;
   			if (node.tagName === "STRONG") node = node.parentNode;
   			var oid = +node.getAttribute('data-oid');
   			node.style.cursor="default";
   			geoSearch.clearAndSet(oid,features[oid-1].attributes);
   		}


   		//assign the download dataset link to the proper file
   		function makeDownloadLink(e){
	   		var project =(dataNode.firstChild.textContent).split(" ").join("")
	   		, dat = new Date(dataNode.firstChild.nextElementSibling.textContent.slice(-11))
	   		, year = dat.getFullYear()
	   		, month = dat.getUTCMonth()+1
	   		, day = dat.getUTCDate()
	   		;
 				month = month+'';
 				day = day+'';
 				month = (month.length === 1?"0"+month:month);
 				day = (day.length === 1?"0"+day:day);
 				dlLink.href = "zips/"+project+"_"+year+"_"+month+"_"+day+".zip";
   		}


   		/***HANDLERS***/

	   	on(foot, "mousedown", setInfo);

	   	on(dlLink,"mouseover", makeDownloadLink);


   		if(touch){

   			on(dataNode,".multiSelect:touchstart",oneFromMany);

   		}else{

   			on(dataNode,".multiSelect:mousedown",oneFromMany);

   			on(infoPane, "mouseover", toggleHelpGlow);

	   		on(infoPane, "mouseout", toggleHelpGlow);

   		}


      setrPConHeight();
   	}





/********DESKTOP LAYOUT FUNCTIONS**********/





   	function attachPanes(){
   		var movers = dquery(".mov")
   			, closeButton = dom.byId('closeRp')
   		 	, arro = dom.byId("arro")
   			, showing = 0
   			;


   		function showPane(){
				var i = 0, j = movers.length;
				showing = 1;
				arro.style.backgroundPosition = "-32px -16px";
				if(ie9){
					for(;i<j;i++){
						if(movers[i] === dataPane)
							fx.animateProperty({node:movers[i], duration:300, properties:{marginRight:0}}).play();
						else fx.animateProperty({node:movers[i], duration:300, properties:{marginRight:285}}).play();
					}
				}else{
					for(;i<j;i++)
						domClass.add(movers[i],"movd");
				}
			}


	    function hidePane(){
				var i = 0, j = movers.length;
				showing = 0;
				downloadNode.style.display="none";
				arro.style.backgroundPosition = "-96px -16px";
				if(ie9){
					for(;i<j;i++){
					if(movers[i] === dataPane)
						fx.animateProperty({node:movers[i], duration:250, properties:{marginRight:-285}}).play();
					else fx.animateProperty({node:movers[i], duration:250, properties:{marginRight:0}}).play();
					}
				}else{
					for(;i<j;i++)
						domClass.remove(movers[i],"movd");
				}
			}


			function emptyPane(){
				hidePane();
				geoSearch.clearAll();
			}


			function showIntro(){
				dataNode.style.marginTop = 0;
				clearNode(dataNode);
				dataNode.innerHTML = introText;
				W.setTimeout(showPane, 0);
			}


			function showDataFunc(setData,attributes){
				if(!geoSearch.selected.length){
					emptyPane();
					return;
				}
				if(showing){
					if(ie9){
						var fxArgs ={node:dataCon, duration:150, properties:{opacity:0},
								onEnd:function(){
									setData(attributes);
									fx.fadeIn({node:dataCon}).play();
								}
							};
						fx.animateProperty(fxArgs).play();
				  }else{
						dataNode.style.opacity = 0;
						downloadNode.style.opacity = 0;
						W.setTimeout(function(){
							setData(attributes);
							dataNode.style.opacity = 1;
							downloadNode.style.opacity = 1;
						}, 125);
					}
				}else{
					setData(attributes);
					showPane();
				}
			}


			function closeToggle(){
				if(showing) emptyPane();
				else showIntro();
			}

   		on(closeButton,"mousedown", closeToggle);
   		showData = makeShowData(showDataFunc);
   		W.setTimeout(showIntro,300);
   	}





/************MOBILE LAYOUT FUNCTIONS************/





   	function attachMobileViews(){
   		var dataTab = dom.byId('dataTab');
   		var gridTab = dom.byId('gridTab');
   		var zIndex = 1000;
   		var gridShowing = 0;
   		var dataShowing = 0;
   		var dataDisplayed = 0;
   		var translateRight = "translate3d("+innerWidth+"px,0,0);";
   		var translateLeft = "translate3d(-"+innerWidth+"px,0,0);";
   		var dataTrans = "-webkit-transform:"+translateRight+"transform:"+translateRight;
   		var gridTrans = "-webkit-transform:"+translateLeft+"transform:"+translateLeft;
   		var cssHide= "-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0);z-index:9999";
   		var currPane;

   		function addGlow(){
   			if(!geoSearch.selected.length){
					fade();
					setIntro();
					return;
				}
   			if(glowing) return;
   			domClass.add(dataTab,'tabglow')
   			
   		}

   		function fade(){
   			domClass.remove(dataTab,'tabglow')
   			
   		}

   		function setIntro(){
				//dataNode.style.marginTop = 0;
				dataTab.firstElementChild.innerText="Info";
				clearNode(dataNode);
				dataNode.innerHTML = introText;
			}

   		function showDataFunc(setData, attr){
   			if(dataDisplayed&&!geoSearch.selected.length){
   				setIntro();
					return hideView(dataPane);
				}
				dataTab.firstElementChild.innerText="Data";
   			setData(attr);
   			if(gridShowing&&!dataDisplayed) return;
   			showView(dataPane, dataTrans)
   			dataShowing = 1;
   			dataDisplayed = 1;
   		}

   		function showView(node,tab,transform){
   			node.style.cssText=transform;
   			node.style.zIndex = ++zIndex;
   			domClass.add(tab,"tabglow")
   		}


   		function hideView(node,tab){
   	  	node.style.cssText=cssHide;
   	  	domClass.remove(tab,"tabglow")
   	  	setTimeout(function(){
   	  		zIndex--;
   	  		node.style.zIndex=1000;
   	  	},155)
   		}

   		function dataToggle(){
   			if(dataShowing&&dataDisplayed){
   				hideView(dataPane,dataTab);
   				dataShowing = 0;
   				dataDisplayed = 0;
   			}else{
   				showView(dataPane,dataTab,dataTrans);
   				dataShowing = 1;
   				dataDisplayed = 1;
   			}
   		}

   		function gridToggle(){
   			if(gridShowing&&!dataDisplayed){
   				hideView(gridPane,gridTab);
   				gridShowing = 0;
   				if(dataShowing) dataDisplayed = 1;
   				else zIndex = 1000;
   			}else{
   				showView(gridPane,gridTab,gridTrans);
   				gridShowing = 1;
   				dataDisplayed = 0;
   			}
   		}


   		on(dataTab,"touchstart", dataToggle);
   		on(gridTab,"touchstart", gridToggle);


   		showData = makeShowData(showDataFunc)
   		setIntro();
   	}





		//Takes a showDataFunc which has access to private layout functions through a closure.
		//Layout functions can be separated and private between desktop/mobile while calling code 
		//only communicates through the common showData interface that makeShowData returns 
    function makeShowData(showDataFunc){
   	
   	  function showData(attributes){
   	    showDataFunc(setData,attributes);
   	  }

			var ssMessage = "Data was collected to determine the sediment impacts of the agricultural barriers at Middle River, Grant Line Canal, and Old River near the Delta Mendota Canal. Measurements have been made since 1998 at nineteen stations. Multibeam/RTK bathymetry has been gathered since 2011. Four stations have monthly data, the rest are visited in the Fall and Spring.";


			function WWays(attr){
				switch(attr.Project.slice(0, 2)){
				   case "GL":
						return "Grant Line Canal";
					case "OR":
						return "Old River";
					case "DC":
						return "Doughty Cut";
				}
			}

			function sortByDate(a,b){
				return features[a-1].attributes.Date - features[b-1].attributes.Date;
			}

		  function setData (attr){
		  	var sgCount = geoSearch.selected.length;
		  	var oid;
				if(!attr){
					if(sgCount === 1){
						oid = geoSearch.selected[0];
						parseAttributes(features[oid-1].attributes,oid-1);
					}else{
						geoSearch.selected.sort(sortByDate);
						var str ="<h2>"+sgCount+ " projects selected</h2><div id='multiSelectWrapper'>";
						for(var i=0; i<geoSearch.selected.length;i++){
							oid = geoSearch.selected[i];
							str+=("<span class='multiSelect' data-oid='"+oid+"'><strong>"+names[oid-1]+
								": </strong>"+formattedDates[oid-1]+"</span><br/>")
						}
						str+="</div>"
						downloadNode.style.display = "none";
						dataNode.style.marginTop = (rPConHeight/2-65)+"px";
						dataNode.innerHTML = str;
					}
				}else{
					if(attr&&attr.Project)
						parseAttributes(attr,attr.OBJECTID-1);	
				}
			}

			function parseAttributes(attr,ind){
				dataNode.style.marginTop = "0";	
				dataNode.innerHTML = "<h2>"+names[ind]+"</h2>"+
				"<span class = 'projectinfo'><strong>Collection Date: </strong>"+formattedDates[ind]+"</span>"+
				"<span class = 'projectinfo'><strong>Client: </strong>"+(attr.Client||"Groundwater Supply Assessment Section, DWR")+"</span>"+
				"<span class = 'projectinfo'><strong>Waterways Covered: </strong>"+(attr.Waterways||WWays(attr))+"</span>"+
				"<span class = 'projectinfo'><strong>Purpose: </strong>"+(attr.Purpose||ssMessage)+"</span>";
				downloadNode.style.display = "block";
			}


			return showData;
	  }





		function defineDOMHandles(){
			dataCon = dom.byId("dataCon")
			dataNode = dom.byId("dataNode")
			downloadNode = dom.byId('downloadNode')
			dlLink = dom.byId("dlLink")

			gridNode = dom.byId("gridNode")
			spl = dom.byId("lPSplitter")

			animAnchor = dom.byId("anim")
			crossAnchor = dom.byId("cros")
			identAnchor = dom.byId("ident")
			measureAnchor = dom.byId("mea")
			toolOffMessage = dom.byId("toolOffMessage")

			zoomSlider =dom.byId("mapDiv_zoom_slider")
			fullExtentButton = dom.byId("fullExtentButton")
			topo = dom.byId("topo")
			sat = dom.byId("sat")
			timeDiv = dom.byId('timeDiv')
		}




    //Allows proper map layout on load and resize
		function placeMap(width){
 	    if(ie9){
				mapDiv.style.left = width+"px";
			}else{
				mapDiv.style["-webkit-transform"] = "translate3d("+width+"px,0, 0)";
				mapDiv.style["transform"] = "translate3d("+width+"px,0, 0)";
			}

 			mapDiv.style.width = (innerWidth-width)+"px";
   	}




    //Change header name based on available screen space
   	function setHeader(){
			var wid = innerWidth;
			var appTitle = setHeader.appTitle = setHeader.appTitle?setHeader.appTitle:dom.byId("appTitle");
			if (wid < 750 && setHeader.fullText !== 0){
				appTitle.innerHTML = "Bathymetry";
				setHeader.fullText = 0;
			}else if(wid > 749 && setHeader.fullText === 0){
				appTitle.innerHTML = "Delta Bathymetry Catalog"
				setHeader.fullText = 1;
			}
		}




  //Datapane resizing  convenience functions
    function setDataPaneHeight(){
   		if(touch){
   			setDataConHeight(innerHeight/2 - 32);
   		}else{
   		  dataPane.style.height = innerHeight-225+"px";
   		  setDataConHeight(innerHeight-257);
   		}
   	}

		function setDataConHeight(height){
   		dataCon.style.height = height +"px";
   	}

		function setrPConHeight(){
			if(touch) rPConHeight = innerHeight-32;
			else rPConHeight = innerHeight - 257;
			return rPConHeight;
		}






		//Convenience and shims
		function isNumber(n) {
  			return !isNaN(parseFloat(n)) && isFinite(n);
		}

		(function checkRAF(W){
			if(!W.requestAnimationFrame)(function(W){var eaf = 'equestAnimationFrame', raf = 'r'+eaf, Raf = 'R'+eaf;W[raf] = W['webkit'+Raf]||W['moz'+Raf]||W[raf]||(function(callback){setTimeout(callback, 16)})})(W);
		})(W)






		//global resizer
		on(W, "resize", function(e){
			var winHeight = innerHeight = W.innerHeight;
			innerWidth = W.innerWidth;
			setrPConHeight();

			placeMap(gridPane.clientWidth+6);
			setHeader();
			defaultZoomLevel = winHeight > 940?11:winHeight > 475?10:9;

			if(+dataNode.style.marginTop.slice(0, 1)) dataNode.style.marginTop =(winHeight-257)/2-15+"px";

			if(ie9){
				fx.animateProperty({node:dataPane, duration:300, properties:{height:winHeight-225}}).play();
				fx.animateProperty({node:dataCon, duration:300, properties:{height:winHeight-257}}).play();
			}else{
				dataPane.style.height = winHeight-225+"px";
				dataCon.style.height = winHeight-257+"px";
			}
		});





		attachDataPaneHandlers();
		tiout.refresh() //ensure initial draw;
	});

//return from the requires
});
});
