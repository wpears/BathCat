require(["dijit/layout/BorderContainer"
				,"dijit/layout/ContentPane"

				,"dgrid/Grid"
				,"dgrid/editor"

				,"dojo/_base/declare"
				,"dojo/parser"
				,"dojo/dom-construct"
				,"dojo/dom"
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


				,"modules/tools.js"
				,"modules/popup.js"
				,"modules/crosstool.js"
				,"modules/identtool.js"
				,"modules/measuretool.js"
				,"modules/clearnode.js"
				,"modules/tooltip.js"
				,"modules/getdate.js"
				,"modules/gridcategory.js"

				,"require"
				],
function( BorderContainer
				, ContentPane
				, Grid
				, Editor
				, declare
				, parser
				, construct
				, dom
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


				, tools
				, Popup
				, CrossTool
				, IdentTool
				, MeasureTool
				, clearNode
				, Tooltip
				, getDate
        , GridCategory

				, require
				){



  	var allowMM = 0;  // An absolutely obscene amount of event handlers. And TONS of triggered body/map mm events
/*
  	(function(){ this patch breaks ie11. I'm omitting until I seem a need in chrome.
		var eael = HTMLElement.prototype.addEventListener;
		HTMLElement.prototype.addEventListener = function(){
 			if(arguments[0]!== "mousemove"||allowMM){
    			eael.apply(this, arguments);
		}
		}})();*/
		
   ready(function(){ //wait for the dom
   	var W = window
   		, DOC = document
   		, protocol = DOC.location.protocol
   		, origin = DOC.location.origin
   		, touch = has("touch")
   		, ie9 =(DOC.all&&DOC.addEventListener&&!W.atob)?true:false
   		, innerHeight = W.innerHeight
   		, innerWidth = W.innerWidth
   		, mainWindow = dom.byId("mainWindow")
   		, mapDiv = dom.byId("mapDiv")
   		, gridPane, gridNode, spl
   		, dataPane, dataCon, dataNode, dlLink, downloadNode
   		, crossAnchor, identAnchor, measureAnchor, noClick
   		, zoomSlider, fex, topo, sat, timeDiv
   		, infoFunc
   		, introText = "<p>The <strong>Delta Bathymetry Catalog</strong> houses the complete set of multibeam bathymetric data collected by the Bathymetry and Technical Support section of the California Department of Water Resources.</p><p>Click on a feature in the map or table to bring up its <strong>description</strong>. Double-click to view the <strong>raster image</strong>.</p> <p><strong>Download</strong> data as text files from the descrption pane.</p> <p><strong>Measure</strong> distances, <strong>identify</strong> raster elevations, and draw <strong>profile graphs</strong> with the tools at the top-right.</p> <p>Change what displays by <strong>collection date</strong> with the slider at bottom-right. <strong>Sort</strong> by date and name with the table's column headers.</p> <p>See the <strong>help</strong> below for further information.</p>"
   		;

   	makePeripherals();
   	makeViews();
   	setHeader();


   	
		if(ie9) fx = require("dojo/_base/fx", function(fx){return fx});

   	DOC.body.style.visibility = "visible"; //show the page on load.. no unstyled content


   Config.defaults.io.corsDetection = false;
   Config.defaults.io.corsEnabledServers.push(origin);//enable cors for quicker queries
   Config.defaults.geometryService = new GeometryService(protocol+"//sampleserver3.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer"); 	


   		var rasterUrl = origin+"/arcgis/rest/services/Public/bathymetry_rasters/MapServer" 
   		var topoUrl = protocol+"//services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer";


   		var timeSlider;
   		var spatialRef = new SpatialReference(102100);
   		var intExt = new Extent(-13612000, 4519000,-13405000, 4662600,spatialRef);
   		var centerPoint;
   		var zoomLevel = innerHeight > 940?11:innerHeight > 475?10:9;
   	  if (touch)centerPoint = new Point({x: -13528681.36062705, y: 4583780.268055417,spatialReference:spatialRef});
     	else centerPoint = new Point({x: -13523942.264873397, y: 4586455.564045421,spatialReference:spatialRef});

      var map = new Map(mapDiv, {extent:intExt,center:centerPoint,zoom:zoomLevel/*,basemap:"topo"*/})
      var tiout;
      var solidLine = SimpleLine.STYLE_SOLID;
			var solidFill = SimpleFill.STYLE_SOLID
      var blank = new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([255, 255, 255, 0.001]), 1), new Color([0, 0, 0, 0.001]))
     	var topoMap = new TiledLayer(topoUrl);
     	var rasterLayer = new DynamicLayer(rasterUrl, {id:"raster"})
			var topoOn = 1;
			var satOn = 0;
window.map = map
			map.addLayer(topoMap);

		rasterLayer.setVisibleLayers([-1]);


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



	window.tiout=tiout = new FeatureLayer({featureSet:window.TIGHT_OUTLINES,
														layerDefinition:{"geometryType":"esriGeometryPolygon"
		            														,"spatialReference":spatialRef
		            														,"displayFieldName": "Shape_Length"
		            														, "fields" : [
				    																	{"name" : "OBJECTID",
				      																"type" : "esriFieldTypeOID"}
				      																]
				      															}
				      						 },
													  {id:"tiout",mode: FeatureLayer.MODE_SNAPSHOT}
													 );
  	tiout.setRenderer(new SimpleRenderer(blank));
    map.addLayer(tiout);

tiout.on("graphic-node-add",function(e){
	if(insideTimeBoundary[e.graphic.attributes.OBJECTID]){
		//console.log("returning. inside boundary");
		//console.log(e.graphic.attributes,outlines.graphics[e.graphic.attributes.OBJECTID-1].attributes,outlines.graphics[e.graphic.attributes.OBJECTID-1].attributes.Project);
		return;
}
	e.node.setAttribute("class","hiddenPath")
})

	var featureSet = window.DATA_OUTLINES,
	  features = featureSet.features, featureCount=features.length, IE =!!document.all, fx,
		outlines, grid, gridObject, dScroll, outlineMouseMove, outlineTimeout, 
		mouseDownTimeout, previousRecentTarget, justMousedUp = false,  outMoveTime = 0,
	 	identifyUp, measure, tooltip, rPConHeight=setrPConHeight(), sedToggle, satMap, cursor = 1, scalebarNode,
	 	crossTool, identTool, meaTool;

		var geoArr, splitGeoArr, geoBins, selectedGraphics =[], selectedGraphicsCount = 0,
		legend, eventFeatures= [],
		zoomEnd, adjustOnZoom, showSat, showTopo, previousLevel = 8,
		processTimeUpdate,
		mouseDownX = 0, mouseDownY = 0;


	var	layerArray = new Array(featureCount),
		oidArray = new Array(featureCount),
		oidStore = new Array(featureCount + 1),
		hl = new Array(featureCount + 1),
		gdata = new Array(featureCount),
		formattedDates = new Array(featureCount),
		names = new Array(featureCount),
		insideTimeBoundary = new Array(featureCount + 1),
		rastersShowing = {};


		outlines = new FeatureLayer({layerDefinition:layDef, featureSet:featureSet}, {
		  	id:"out",
       	 	mode: FeatureLayer.MODE_SNAPSHOT,
       	 	outFields: ["*"]
  		});

		outlines.setRenderer(new SimpleRenderer(blank));
    map.addLayer(outlines);
		eventFeatures.push(outlines);

		satMap = new TiledLayer(protocol+"//services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer");
	  map.addLayer(satMap);
	  satMap.hide();









	var setTextColor = (function(){
		new ScaleBar({map:map});
		scalebarNode = dquery(".esriScalebar")[0]


		var tCount
			, timeExtent = new TimeExtent(new Date("01/01/2010 UTC"), new Date("12/31/2014 UTC"));
		map.setTimeExtent(timeExtent);
		timeSlider = new TimeSlider({                                            //create TimeSlider
			style:"width:300px;",
			id: "timeSlider",
			intermediateChanges: true},
			construct.create("div", null, timeDiv)
			);
		timeSlider.setThumbCount(2);
		timeSlider.createTimeStopsByTimeInterval(timeExtent, 2, "esriTimeUnitsMonths");
		tCount = timeSlider.timeStops.length;
		timeSlider.setThumbIndexes([0, tCount]);
		timeSlider.setTickCount(Math.ceil(tCount/2));
		timeSlider.startup();
		map.setTimeSlider(timeSlider);
	

		labelCon = DOC.createElement('div');
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

		function highlightLabel(node){
			domClass.add(node,"tsHighlight")
		}

		function clearHighlight(node) {
			domClass.remove(node,"tsHighlight")
		}

		function setTime(e){  //timeslider quicklinks handler
			var yr = e.target.innerHTML;
			if(yr.charAt(0)=== "A")
				timeSlider.setThumbIndexes([0, timeSlider.timeStops.length]);
			else
				timeSlider.setThumbIndexes([6*(yr-2010), 6*(yr-2010)+6]);
		}

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

		function setTextColor(){
			if(satOn){
				domClass.add(scalebarNode,"whiteScaleLabels");
				domClass.add(labelCon,"satLabels")
			}else{
				domClass.remove(scalebarNode,"whiteScaleLabels");
				domClass.remove(labelCon,"satLabels")
			}
		}
		setTextColor();
		return setTextColor;
	})();




//Initialize all app-wide tracking arrays




		(function(){
			var att, pl, mi, ss="Soil Sed. ";
			for(var i = 0; i<featureCount; i++){
				att=features[i].attributes;
				layerArray[i] = i;
				oidArray[i] = pl=i+1;
				oidStore[i] = 0;
				hl[i] = 0;
				insideTimeBoundary[i] = 1;
				rastersShowing[pl] = 0;
				formattedDates[i]= getDate(att.Date);
				names[i] = (att.Project.length<6?ss + att.Project:att.Project);
			}
		})();
		hl[featureCount] = 0;
		oidStore[featureCount] = 0;
		insideTimeBoundary[featureCount] = 1;
window.oidStore = oidStore;
		(function(){
			for(var i = 0; i<featureCount; i++){
				var intData ={};
				featureAttr = features[i].attributes;
				intData.__Date = featureAttr.Date;
				intData.Date = formattedDates[i];
				intData.Project = names[i];
				intData.OBJECTID = featureAttr.OBJECTID;
				gdata[i]=intData;
			}
		})();






//Prep geoBins for GeoSearch



  	(function(){
  			var i = 0, outG = outlines.graphics, j = outG.length, curr, k, l, currGeo;
  			geoArr = new Array(j);
  			geoBins = new Array(Math.ceil(j/10));
  			splitGeoArr = new Array(geoBins.length);
  			for(;i<j;i++){
  				curr = outG[i]._extent;
  				geoArr[i] ={oid:outG[i].attributes.OBJECTID,
  						   xmin:curr.xmin,
  						   xmax:curr.xmax,
  						   ymin:curr.ymin,
  						   ymax:curr.ymax
  						 }
  			}
  			geoArr.sort(function(a, b){return a.xmin-b.xmin})

  			for(k = 0, l = geoBins.length-1;k<l;k++){
  				geoBins[k] = geoArr[k*j/10>>0].xmin;
  				splitGeoArr[k] =[];
  			}
  			geoBins[l] = geoArr[j-1].xmin;
  			for(i = 0;i<j;i++){
  				currGeo = geoArr[i];
  				for(k = 0;k<l;k++){
  					if(currGeo.xmin<= geoBins[k+1]&&currGeo.xmax>= geoBins[k])
  						splitGeoArr[k].push(currGeo);

  				}
  			}
  	})();





//oidStore. Manages state of oids. Currently references peppered throughout almost everything
//Might be worth splitting into its own module





		function clearStoredOID(oid, doSplice, fromGrid){
			var oidIndex = geoSearch.prevArr.indexOf(oid);
			highlighter(oid,"", 1);
			if(oidStore[oid]){
				oidStore[oid] = 0;
				if(fromGrid&&oidIndex>-1)splice(geoSearch.prevArr, oidIndex);
				selectedGraphicsCount--;
				if(doSplice)
					splice(selectedGraphics, selectedGraphics.indexOf(oid));
			}else{console.log("NOT STORED")}
		}

		function storeOID(oid){
			if(!oidStore[oid]){
				oidStore[oid] = 1;
				selectedGraphics[selectedGraphicsCount] = oid;
				selectedGraphicsCount++;
			}
		}

		function clearAllStoredOIDs(){
			for(var i = 0, j = selectedGraphicsCount;i<j;i++)
					clearStoredOID(selectedGraphics[i], 0, 0);
			selectedGraphics.length = 0;
			geoSearch.prevArr.length = 0;
		}

		function clearAndSetOID(oid, attributes){
			clearAllStoredOIDs();
			storeOID(oid);
			geoSearch.prevArr.length = 1;
			geoSearch.prevArr[0] = oid;
			highlighter(oid,"hi", 1);
			infoFunc(attributes);
		}



		//*****initialize grid and attach all handlers*******\\
//console.log('grid')
		gridObject =(function(){
			var j = featureCount, gridCon, expandReady=1,toggleCount = 0,
				intData, featureAttr, lastNodePos =new Array(gdata.length+1),nameSorted = 0, dateSorted = 1,
				gridHeader, headerNodes;

				grid = new Grid({bufferRows:Infinity,
							columns:{
								Project:{label:"Project", sortable:false},
								Date:{label:"Date", sortable:false},
								OBJECTID:{label:"OBJECTID"},
								Editor:Editor({field: "Image", sortable:false}, "checkbox"),
								__Date:{label:"_Date"}
								},
							cellNavigation:0
							},
							gridNode);


			gdata.unshift({"__Date":1315008000000,Date:"Various",Project:"Soil Sedimentation",OBJECTID:gdata.length+1});
			grid.renderArray(gdata);

			gridHeader = dom.byId("gridNode-header").firstChild;
			headerNodes = gridHeader.children;

			headerNodes[0].title = "Sort by Name"; //maybe pass these into constructor
			headerNodes[1].title = "Sort by Date";         
			headerNodes[3].title = "Turn images on or off";
			
			gridCon = dquery(".dgrid-content")[0];
			dScroll = dquery(".dgrid-scroller")[0];
			dScroll.style.overflowY="scroll";
			
			for(var i = 0, j = gdata.length;i<j;i++){
				lastNodePos[i] = i+1;
			}
      lastNodePos[gdata.length-1]=0;

			sedToggle = GridCategory(grid, gdata, "Project","Soil Sed.", gridNode, lastNodePos);
			toggleCount++;

			function dateSortSeq(a, b){
				return a.__Date-b.__Date
			}
			function dateSortInv(a, b){
				return b.__Date-a.__Date
			}
			function nameSortSeq(a, b){
				if(a.Project===b.Project)return dateSortSeq(a,b);
				return a.Project>b.Project?1:-1
			}
			function nameSortInv(a, b){
				if(a.Project===b.Project)return dateSortSeq(a,b);
				return a.Project>b.Project?-1:1
			}
			function renderSort(sorter, gdata, gCon){
				var i = 0, j = gdata.length, newCon, currentNodes = gCon.children,
					nodeIndex, node, frag = DOC.createDocumentFragment(), togId = sedToggle.getRow().id,
				tog = gdata.shift();	
				gdata.sort(sorter);
				gdata.unshift(tog);
				for(var i = 0, j = gdata.length;i<j;i++){
					nodeIndex = gdata[i].OBJECTID-1;
					node = currentNodes[lastNodePos[nodeIndex]].cloneNode(true);
					frag.appendChild(node);
					lastNodePos[nodeIndex] = i;
				}
				newCon = gCon.cloneNode(false);
				newCon.appendChild(frag);
				gCon.parentNode.replaceChild(newCon, gridCon);
				gridCon = newCon;
				frag = null;
				sedToggle.setNode();
			}

			function oidToRow(oid){
				return gridCon.children[lastNodePos[oid-1]];
			}

			function scrollToRow(oid){
				var row = oidToRow(oid);
				var offset = row.offsetTop;
				if (!offset&&(domClass.contains(row,"hiddenRow")||domClass.contains(row,"hiddenGridToggle")))
					return;
				var scrollTop = dScroll.scrollTop;
				if(offset>dScroll.clientHeight+scrollTop-55||offset<scrollTop)
						dScroll.scrollTop = offset-95;
			}

			function timeUpdate(e){
				var startTime = +e.startTime, endTime = +e.endTime, currentRasters = rasterLayer.visibleLayers,
				currTime, currOID, rawGraphic, gridData = gdata, currentCount = selectedGraphicsCount,
				currRow, toBeHidden = timeUpdate.toBeHidden, oidRasterIndex, shape,
				rastersAsOIDs = timeUpdate.rastersAsOIDs;
				for(var i = toggleCount, j = gridData.length;i<j;i++){
					currOID = gridData[i].OBJECTID;
					if(currOID === j) continue;
					shape = oidToGraphic(currOID)._shape

					if(shape) rawGraphic = shape.rawNode;
					currRow = oidToRow(currOID);
					currTime =+gridData[i].__Date

					if(currTime<startTime||currTime>endTime){
				//		if(oidStore[currOID]) deselect a project if it outside the current time extent
				//	  	clearStoredOID(currOID, 1, 1);
						domClass.add(currRow, "hiddenRow");
						if(map.layerIds[2]){
							oidRasterIndex = currOID-1;
							toBeHidden.push(currOID);
							for(var k = 1;k<currentRasters.length;k++){
								if(currentRasters[k] === oidRasterIndex){
									splice(currentRasters, k);
									k--;
								}
							}
						}
						insideTimeBoundary[currOID] = 0;
						if(shape){
							rawGraphic.setAttribute("class","hiddenPath")
						}
					}else{
						if(insideTimeBoundary[currOID] === 0){
							domClass.remove(currRow, "hiddenRow");
							insideTimeBoundary[currOID] = 1;
							if(shape)
								rawGraphic.setAttribute("class","")
						}
					}
				}
				if(map.layerIds[2]){
					uncheckImageInputs(toBeHidden);
					for(var i = 1;i<currentRasters.length;i++){
						rastersAsOIDs.push(currentRasters[i]+1);
					}
					setVisibleRasters(rastersAsOIDs, 0);
				}
				if(currentCount!== selectedGraphicsCount)//make rP reflect possible change
					infoFunc(null)
				rastersAsOIDs.length = 0;
				toBeHidden.length = 0;
			}

			timeUpdate.rastersAsOIDs =[];
			timeUpdate.toBeHidden =[];

			timeSlider.on("time-extent-change", timeUpdate);

			renderSort(dateSortSeq, gdata, gridCon);
			domClass.add(headerNodes[1], "sortTarget");

			function nameSortEffects(){
			  dateSorted = 0;
			  domClass.add(headerNodes[0], "sortTarget");
			  domClass.remove(headerNodes[1], "sortTarget");
			  if(selectedGraphicsCount)scrollToRow(selectedGraphics[0])
			}

			function dateSortEffects(){
				nameSorted = 0;
				domClass.add(headerNodes[1], "sortTarget");
				domClass.remove(headerNodes[0], "sortTarget");
				if(selectedGraphicsCount)scrollToRow(selectedGraphics[0])
			}
		  function clickSort(){
		    if(nameSorted === 0 && selectedGraphicsCount>1){
				  renderSort(nameSortSeq, gdata, gridCon);
					nameSorted = 1;
					nameSortEffects();
					return true;
				}
        return false;
      }

			function runNameSort(){
				if(nameSorted>0){
					renderSort(nameSortInv, gdata, gridCon);
					nameSorted = -1;
				}else{
					renderSort(nameSortSeq, gdata, gridCon);
					nameSorted = 1;
				}
				nameSortEffects();
			}

			function runDateSort(){
				if(dateSorted>0){
					renderSort(dateSortInv, gdata, gridCon);
					dateSorted = -1;
				}else{
					renderSort(dateSortSeq, gdata, gridCon);
					dateSorted = 1;
				}
				dateSortEffects();
			}


			function showAllImages(){      						//mass image display/clear
				var someChecked = 0;
				for(var i = 1, j = layerArray.length;i<=j;i++){
					if(rastersShowing[i]){
						someChecked = 1;
						break;
					}
				}
				if(someChecked){
					setVisibleRasters.reusableArray.length = 0;
					setVisibleRasters(setVisibleRasters.reusableArray, 0);
					clearImageInputs();
				}else{
					setVisibleRasters(oidArray, 0);
					checkImageInputs(oidArray);
				}
			}


      
			function triggerExpand(e){
				if(expandReady){
					W.requestAnimationFrame(function(){expand(e)});
					expandReady = 0;
				}
			}

			function expand(e){
				var wid = e.x+"px";
				gridPane.style.width = wid;
				placeMap();
				expandReady = 1;
			}



			function cellClick(e){	//grid click handler
				var et = e.target, oid = getOIDFromGrid(e), attributes;
				if(!oid)return;
				if(!oidStore[oid]&&et.tagName=="INPUT"&&et.checked)return
				highlighter(oid,"hi", 1);
				if(et!== previousRecentTarget){ //prevent click before double click
					window.clearTimeout(mouseDownTimeout);
					previousRecentTarget = et;
					mouseDownTimeout = W.setTimeout(nullPrevious, 400);
					attributes = outlines.graphics[oid-1].attributes;
					if(oidStore[oid]&&selectedGraphicsCount === 1){ //target is sole open
						clearStoredOID(oid, 1, 1);
						infoFunc(null);
					}else{
						clearAndSetOID(oid);
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
						clearAndSetOID(oid)
						inputBox = getInputBox(oid);
						setExtent(graphic._extent.expand(1.3));
						if(!inputBox.checked){
							inputBox.checked = true;
							rastersShowing[oid] = 1;
							setVisibleRasters.reusableArray[0] = oid;
							setVisibleRasters(setVisibleRasters.reusableArray, 0);
						}
					}
				}
			}

			function makeViewable(oid, level, center){
				var mapX=center.x;
				var mapY=center.y;
				var ex1=oidToGraphic(oid)._extent;

			  if(ex1.xmax>= mapX&&ex1.xmin<= mapX&&ex1.ymin<= mapY&&ex1.ymax>= mapY&&level>=14) return;
				
				var ex=ex1.expand(1.3);
				if(ex.xmax-ex.xmin > makeViewable.xcutoff || ex.ymax-ex.ymin > makeViewable.ycutoff){
					setExtent(ex);
				}else{
				  map.setLevel(15);
				  map.centerAt(ex1.getCenter());
			  }
			}
			makeViewable.xcutoff=6500;
			makeViewable.ycutoff=4500;


			setVisibleRasters.reusableArray =[];
			function setVisibleRasters(newOIDs, fromCheck){
				if(!map.layerIds[2]){ //if the raster has not been added, add it.
					map.addLayer(rasterLayer);
					if(!touch){
						legend.node.src = "images/leg.png";
						legend.show();
					}
				}
				var rL = rasterLayer,
					visibleRasterOIDs = rL.visibleLayers,
					i,
					j = visibleRasterOIDs.length,
					splicedIfPresent,
					rasterIndex;
				if(newOIDs.length>1){
					(function(){
						for(var i = 0, j = newOIDs.length;i<j;i++){
							if(insideTimeBoundary[newOIDs[i]]&&visibleRasterOIDs.indexOf(newOIDs[i]-1)===-1)
								visibleRasterOIDs.push(newOIDs[i]-1);
						}
					})();
				}
				if(newOIDs.length === 1&&newOIDs[0]!==-1){
					rasterIndex = newOIDs[0]-1;
					while(j--){
						if(rasterIndex === visibleRasterOIDs[j]&&fromCheck){//splice this number out of visible layers if it is there
							splicedIfPresent = visibleRasterOIDs.splice(j, 1)[0]; 
							break;
						}
					}
					if(rasterIndex!== splicedIfPresent)
						visibleRasterOIDs.push(rasterIndex)
				}

				if(newOIDs.length === 0){
					visibleRasterOIDs =[-1];
				}

				rL.setVisibleLayers(visibleRasterOIDs);

				if(rL.suspended){											
					rL.resume();
					if(!touch) legend.show();
				}

				if(visibleRasterOIDs.length === 1){
					rL.suspend();
					if(!touch)legend.hide();
				}
				setToolVisibility(visibleRasterOIDs);
			}


			function setToolVisibility(visibleRasterOIDs){
				if(visibleRasterOIDs.length>1){//working identify logic below
					domClass.replace(identAnchor,"clickable","unclick");
					domClass.replace(crossAnchor,"clickable","unclick");
				}else{
					domClass.replace(identAnchor,"unclick","clickable");
					domClass.replace(crossAnchor,"unclick","clickable");
				}
			}


			function checkImageInputs(oidArr){
				var curr;
				for(var i = 0, j = oidArr.length;i<j;i++){
					if(insideTimeBoundary[oidArr[i]]){
						curr = getInputBox(oidArr[i]);
						curr.checked = true;
						rastersShowing[oidArr[i]] = 1;
					}
				}
			}


			function uncheckImageInputs(oidArr){
				var curr;
				for(var i = 0, j = oidArr.length;i<j;i++){
						curr = getInputBox(oidArr[i]);
						curr.checked = false;
						rastersShowing[oidArr[i]] = 0;
					}
			}


			function clearImageInputs(){
				var inputArr = dquery(".dgrid-input", gridNode);
					for(var i = 0, j = inputArr.length;i<j;i++){
						inputArr[i].checked = false;
						rastersShowing[i+1] = 0;
					}
			}


			on(grid,".dgrid-input:change", function(e){
					var oid =+e.target.parentNode.parentNode.children[2].innerHTML;
					if(rastersShowing[oid]){
						rastersShowing[oid] = 0;
					}else{
						rastersShowing[oid] = 1;
						makeViewable(oid,map.getLevel(),map.extent.getCenter());
					}       
					setVisibleRasters.reusableArray[0] = oid;
					setVisibleRasters(setVisibleRasters.reusableArray, 1);
			});

			if(touch){

			}else{
				grid.on(".dgrid-cell:mousedown", cellClick);
				grid.on(".dgrid-cell:dblclick", gridDbl);
				grid.on(".dgrid-cell:mouseover", function(e){
					var oid = getOIDFromGrid(e);
					if(oid)highlighter(oid,"hi", 1);	
				});
			  grid.on(".dgrid-cell:mouseout", function(e){
				  var oid = getOIDFromGrid(e);
				  if(oidStore[oid])
					  return;
				  else
					  highlighter(oid,"", 1);
			  });

				on(headerNodes[0], "mousedown", runNameSort);
				on(headerNodes[1], "mousedown", runDateSort);
				on(headerNodes[3],"mousedown", showAllImages);

				on(spl, "mousedown", function(e){								//expand left pane
					gridPane.style.minWidth = 0;
		    	var mM = on(W, "mousemove", triggerExpand);
			 		on.once(W,"mouseup", function(evt){
				  	map.resize();
				  	mM.remove();
			  	});
				});
			}
			return { timeUpdate:timeUpdate
				     , oidToRow:oidToRow
				     , scrollToRow:scrollToRow
				     , setVisibleRasters:setVisibleRasters
				     , checkImageInputs:checkImageInputs
				     , clickSort:clickSort
				     , expand:triggerExpand
				     , sedToggle:sedToggle
				     };
		})();













		var DJblack = new Color([0, 0, 0, 0])
			, symbols = {
						grethin: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([18, 160, 0]), 0.5), DJblack),
						magthin: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([221, 4, 178]), 0.5), DJblack),
						bluthin: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([50, 84, 255]), 0.5), DJblack),
						redthin: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([255, 0, 0]), 0.5), DJblack),
						brothin: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([112, 84, 59]), 0.5), DJblack),
						gre: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([18, 160, 0]), 1.5), DJblack),
						mag: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([221, 4, 178]), 1.5), DJblack),
						blu: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([50, 84, 255]), 1.5), DJblack),
						red: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([255, 0, 0]), 1.5), DJblack),
						bro: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([112, 84, 59]), 1.5), DJblack),
						grehi: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([18, 160, 0]), 4), DJblack),
						maghi: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([221, 4, 178]), 4), DJblack),
						bluhi: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([50, 84, 255]), 4), DJblack),
						redhi: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([255, 0, 0]), 4), DJblack),
						brohi: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([112, 84, 59]), 4), DJblack)
					}
			, satSym ={
					magthin: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([252, 109, 224]), 1), DJblack),
					bluthin: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([119, 173, 255]), 1), DJblack),
					redthin: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([243, 63, 51]), 1), DJblack),
					grethin: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([24, 211, 48]), 1), DJblack),
					brothin: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([169, 152, 137]), 1), DJblack),
					mag: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([252, 109, 224]), 1.5), DJblack),
					blu: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([119, 173, 255]), 1.5), DJblack),
					red: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([243, 63, 51]), 1.5), DJblack),
					gre: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([24, 211, 48]), 1.5), DJblack),
					bro: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([169, 152, 137]), 1.5), DJblack),
					maghi: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([252, 109, 224]), 4), DJblack),
					bluhi: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([119, 173, 255]), 4), DJblack),
					redhi: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([243, 63, 51]), 4), DJblack),
					grehi: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([24, 211, 48]), 4), DJblack),
					brohi: new SimpleFill(solidFill, new SimpleLine(solidLine, new Color([169, 152, 137]), 4), DJblack)
			};




		tiout.on("update-end", function(e, f, g, h){ // allows feature updating
   		//console.log("update-end");
   		redrawAllGraphics(tiout.graphics);							
    });

    function setExtent(extent){
    	map.setExtent(extent);
    }

		showSat = function(){										//turn on imagery
		  satMap.show();
		  topoMap.hide();
			satOn=1;
			topoOn=0;
			domClass.remove(topo,"currentbmap");
			domClass.add(sat,"currentbmap");
			setTextColor();
			redrawAllGraphics(tiout.graphics);
		};
		showTopo = function(){
		  topoMap.show();
		  satMap.hide();
			satOn=0;
			topoOn=1;
			domClass.remove(sat,"currentbmap");
			domClass.add(topo,"currentbmap");
			setTextColor();
			redrawAllGraphics(tiout.graphics);
		};
		basemapOff = function(){
			satMap.hide();
			topoMap.hide();
			satOn=0;
			topoOn=0;
			domClass.remove(sat,"currentbmap");
			domClass.remove(topo,"currentbmap");
		};


		adjustOnZoom = function(zoomObj){	//logic on ZoomEnd	
			var ext = zoomObj.extent
				, lev = zoomObj.level
				, redraw = 0;
				;
			if(lev > 17&&previousLevel<18&&topoOn) //extend topo to 18, 19 with satellite
				showSat();
			if(previousLevel > 12 && lev < 13||previousLevel < 13 && lev > 12)
					redraw = 1;
			previousLevel = lev;
			if(redraw)
				redrawAllGraphics(tiout.graphics);

			//redrawAllGraphics(tiout.graphics);
			//tiout.setMaxAllowableOffset(offs);
			//tiout.refresh();
		};

   	zoomEnd = map.on("zoom-end", adjustOnZoom);


   	on(topo, "mousedown", function(e){
   		if(topoOn) basemapOff();
   		else showTopo();
   	});

   	on(sat, "mousedown", function(e){
   		if(satOn) basemapOff();
   		else showSat();
   	});
	

(function(){
	var helpText = "<strong id = 'infoPaneTitle'>Help</strong><p>Zoom in and out with the <b>Zoom buttons</b> or the mousewheel. Shift and drag on the map to zoom to a selected area.</p><p>Go to the full extent of the data with the <b>Globe</b>.</p><p>Select map or satellite view with the <b>Basemap buttons</b>.</p><p>Browse through projects in the table. Sort the table with the column headers and collapse it with the <b>Slider</b>.</p><p>Turn on a raster by double-clicking it in the table or map, or checking its checkbox in the table.</p><ul>When a raster is displayed:<br/><li>With the <b>Identify</b> tool, click to display NAVD88 elevation at any point.</li><li>Draw a cross-section graph with the <b>Profile tool</b>. Click the start and end points of the line to generate a graph in a draggable window. Hover over points to display elevation.</li></ul><p>Use the <b>Measure tool</b> to calculate distance, area, or geographic location.</p><p>Project information and Identify results are displayed in the right pane. Toggle this pane with the <b>Arrow button</b>.</p><p>Use the <b>Time slider</b> to filter the display of features by date. Drag the start and end thumbs or click a year to only display data from that year.</p>",
		termText = "<strong id = 'infoPaneTitle'>Terms of Use</strong><p>The data displayed in this application is for qualitative purposes only. Do not use the data as displayed in rigorous analyses. If downloading the data, familiarize yourself with the metadata before use. Not for use as a navigation aid. The data reflects measurements taken at specific time periods and the Department of Water Resources makes no claim as to the current state of these channels, nor to the accuracy of the data as displayed. Do not share or publish this data without including proper attribution.</p>",
		conText = "<strong id = 'infoPaneTitle'>Contact</strong><p>For information on scheduling new bathymetric surveys, contact  <a href = 'mailto:shawn.mayr@water.ca.gov?subject = Bathymetric Survey'>Shawn Mayr</a>, (916) 376-9664.</p><p>For information on this application or the data contained herein, contact  <a href = 'mailto:wyatt.pearsall@water.ca.gov?subject = Bathymetry Catalog'>Wyatt Pearsall</a>, (916) 376-9643.</p>",
		infoPane = dom.byId("infopane"), foot = dom.byId("foot"), infoPaneOpen = 0, timeout, lastButt;



		function toggleHelpGlow(e){
			if(e.target.tagName === "B"){
   				var key = e.target.textContent.slice(0, 3);
   				switch (key){
		   			case "Zoo":
		   			  if (!zoomSlider)zoomSlider = dom.byId("mapDiv_zoom_slider")
		   				domClass.toggle(zoomSlider,"helpglow");
		   				break;
		   			case "Glo":
		   				domClass.toggle(dom.byId('fex'),"helpglow");
		   				break;
		   			case "Bas":
		   				domClass.toggle(topo,"helpglow");
		   				domClass.toggle(sat,"helpglow");
		   				break;
		   			case "Sli":
		   				domClass.toggle(spl,"helpglow");
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
		   	//		case "Arr":
		   	//			domClass.toggle(shoP,"helpglow");
		   //				break;
		   			case "Tim":
		   				domClass.toggle(dom.byId("timeSlider"),"helpglow");
		   				break;
   				}
   			}
		}
		if(!touch){
   		on(infoPane, "mouseover", function(e){
   			toggleHelpGlow(e);
   		});

   		on(infoPane, "mouseout", function(e){
   			toggleHelpGlow(e);
   		});
   	}
   		on(dlLink,"mouseover", function(e){  //remove spatial reference info from files
   			var pro =(dataNode.firstChild.textContent).split(" ").join(""),
   				dat = new Date(dataNode.firstChild.nextElementSibling.textContent.slice(-11)),
   				yea = dat.getFullYear(),
   				mo = dat.getUTCMonth()+1,
   				dayy = dat.getUTCDate();
   				mo = mo+'';
   				dayy = dayy+'';
   				mo = (mo.length === 1?"0"+mo:mo);
   				dayy = (dayy.length === 1?"0"+dayy:dayy);
   				dlLink.href = "zips/"+pro+"_"+yea+"_"+mo+"_"+dayy+".zip";
   		});

   		on(foot, "mousedown", setHelp);

   	on(W, "resize", function(e){			//resize map on browser resize

			var winHeight = innerHeight = W.innerHeight;

			setrPConHeight();

			placeMap();
			setHeader();
			zoomLevel = winHeight > 940?11:winHeight > 475?10:9;

			if(+dataNode.style.marginTop.slice(0, 1)) dataNode.style.marginTop =(winHeight-257)/2-15+"px";

			if(ie9){
				fx.animateProperty({node:dataPane, duration:300, properties:{height:winHeight-225}}).play();
				if(infoPaneOpen)
					fx.animateProperty({node:dataCon, duration:300, properties:{height:winHeight-507}}).play();
				else fx.animateProperty({node:dataCon, duration:300, properties:{height:winHeight-257}}).play();
			}else{
				dataPane.style.height = winHeight-225+"px";
				if(infoPaneOpen)
					dataCon.style.height = winHeight-507+"px";
				else dataCon.style.height = winHeight-257+"px";
			}
		});

		function clearHelp(){
			timeout = 0;
   		clearNode(infoPane);
  		infoPaneOpen = 0;
   		infoPane.style.borderTop = "none";
   	}


		function hideInfoPane(){
			timeout = W.setTimeout(clearHelp, 205);
			if(ie9){
   					fx.animateProperty({node:infoPane, duration:200, properties:{bottom:-210}}).play();
   					fx.animateProperty({node:dataCon, duration:200, properties:{height:rPConHeight}}).play();
   				}else{
   					setdataConHeight(rPConHeight)
   					infoPane.style["-webkit-transform"] = "translate3d(0,0,0)";
						infoPane.style["transform"] = "translate3d(0,0,0)";
   				}
		}

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
				setTimeout(function(){setdataConHeight(rPConHeight-242)},180)
			}
		}



   		function setHelp(e){
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
   			whichButt === "H"?infoPane.innerHTML = helpText:whichButt === "T"?infoPane.innerHTML = termText:infoPane.innerHTML = conText;
   			domClass.add(lastButt,"activeFoot");
   		}
   		setrPConHeight();
		})();

if(!touch){
		legend = function(){
			var leg = dom.byId("legend");

		function showLegend(){
			if(ie9){
				fx.animateProperty({node:leg, duration:200, properties:{right:30}}).play();
			}else
			domClass.replace(leg,"movd","legend")
		}
		function hideLegend(){
			if(ie9){
				fx.animateProperty({node:leg, duration:200, properties:{right:-255}}).play();
			}else
			domClass.replace(leg,"legend","movd");
		}
		return{
			node:leg,
			show:showLegend,
			hide:hideLegend
		}
	}();
}
		on(fex,"mousedown", function(e){                  //go to initial extent
			map.centerAndZoom(centerPoint,zoomLevel)
		});


  





/************TOOLS***************/






		tooltip = Tooltip(noClick);

		on.once(crossAnchor,"mousedown", function(e){
				var options = { map:map
											, rastersShowing:rastersShowing
											, eventFeatures:eventFeatures
											, chartNames:names
											, chartDates:formattedDates
											, tooltip:tooltip
										  };
				allowMM = 1;						  
				crossTool = CrossTool(rasterLayer, Popup(), crossAnchor, rasterUrl, layerArray, options);
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
				identTool.init(e);
		}); 

		meaTool = MeasureTool( measureAnchor
			                   , new SimpleLine(solidLine, new Color([0, 0, 0]), 2)
												 , new SimpleMarker({"size":6,"color":new Color([0, 0, 0])})
												 , { map:map
												 	 , eventFeatures:eventFeatures
												 	 }
												 );

		on.once(measureAnchor,"mousedown", function(e){allowMM=1;meaTool.init(e)});









//FEATURE MOUSE EVENTS


if(0&&touch){
	W.setTimeout(function(){
	var outlayer = dom.byId("out_layer");
	on(outlayer,"touchstart",function(e){
		outlines.emit("mouse-over",e);
		})
},500);
	outlines.on("mouse-over", function(e) {
		geoSearch(e, 1);
	})
}else{

		outlines.on("mouse-over", function(e) {//map mouseover handler
			if(outlineMouseMove) outlineMouseMove.remove();
			outlineMouseMove = outlines.on("mouse-move", mmManager);    	
		});

		function mmManager(e){
			if(Date.now()<outMoveTime+100)
				return;
			if(justMousedUp){
				justMousedUp = false;
				return;
			}
			geoSearch(e, 0);
			outMoveTime = Date.now();
		}


		outlines.on("mouse-out", function(e){		//map mouseout handler
				if(!cursor){map.setMapCursor("default"); cursor=1;}
				outlineMouseMove.remove();
				outlineMouseMove = null;
				geoSearch(null, 0);

		});

		outlines.on("mouse-down", function(e){mouseDownX = e.pageX;mouseDownY = e.pageY;});

		outlines.on("mouse-up", function(e){            //map click handler
			if(e.pageX < mouseDownX+10&&e.pageX > mouseDownX-10&&e.pageY < mouseDownY+10&&e.pageY > mouseDownY-10){
				justMousedUp = true;
				var attributes = e.graphic.attributes, oid = attributes.OBJECTID;
				if(oid!== previousRecentTarget){//prevent click before double click
					W.clearTimeout(mouseDownTimeout);
					previousRecentTarget = oid;
					mouseDownTimeout = W.setTimeout(nullPrevious, 400);
					geoSearch(e, 1);
					if(!gridObject.clickSort()) gridObject.scrollToRow(oid);
				}
			}
		});

		outlines.on("dbl-click", function(e){						//map dblclick handler
			var selected,
			oid = e.graphic.attributes.OBJECTID,
			reSearch = selectedGraphics.indexOf(oid)===-1; //might need to copy, not assign
			if(reSearch){
				geoSearch(e, 1);
				gridObject.scrollToRow(oid);
			}
			selected = geoSearch.prevArr;
			if(selected.length){
				if(map.getScale()>73000)
					setExtent(oidToGraphic(selected[0])._extent.expand(1.3));
				gridObject.setVisibleRasters(selected, 0);
				gridObject.checkImageInputs(selected);
			}
		});

}






//GEOSEARCH







		geoSearch.prevArr =[];
		geoSearch.currArr =[];
		geoSearch.binLength = geoBins.length;
		geoSearch.lastClickBin =[];

		function geoSearch(e, mouseDown){//think about using two sorted arrays, one mins one maxs
		//	console.log("searching")
			var timee=Date.now();
			var i = 0, j = geoSearch.binLength-1, curr, oid, temp, binTemp, prevArr = geoSearch.prevArr,
			currArr = geoSearch.currArr,mapX, mapY, breakMax, binArr, someTargeted = 0;

			if(e === null) binArr = geoSearch.lastMouseBin;
			else{
				mapX = e.mapPoint.x;
				mapY = e.mapPoint.y;
				breakMax = mapX+1000;

				for(;i<j;i++){ //find the right bin
					if(mapX<geoBins[i+1])
						break;
				}
				binArr = splitGeoArr[i]||splitGeoArr[i-1];
				geoSearch.lastMouseBin = binArr;
				i = 0;
			}

			if(mouseDown&&binArr!== geoSearch.lastClickBin){
				clearAllStoredOIDs(); //clear other bin
				geoSearch.lastClickBin = binArr;
			}

			if (binArr)
				j = binArr.length;
			else
				j= 0;

			for(;i<j;i++){
				curr = binArr[i];
				oid = curr.oid;
				if(curr.xmin>breakMax&&!mouseDown){
					break;
				}
				if(insideTimeBoundary[oid]){
					if(curr.xmax>= mapX&&curr.xmin<= mapX&&curr.ymin<= mapY&&curr.ymax>= mapY){
						someTargeted = 1;
						highlighter(oid,"hi", 1);
						if(cursor){
							map.setMapCursor("pointer");
							cursor = 0;
						}
						if(mouseDown){
								currArr.push(oid);
								if(!oidStore[oid])
									storeOID(oid);
						}
					}else{
						if(oidStore[oid]){
							if(mouseDown)clearStoredOID(oid, 1, 0); //clear unclicked from this bin
							continue;
						}else{
							highlighter(oid,"", 1);//clear mouseover highlight. Have to do whole bin since might be multiple hl
						}
					}
				}
			}
			
			if(mouseDown&&someTargeted){
				if(prevArr.length===currArr.length&&W.JSON.stringify(prevArr)=== W.JSON.stringify(currArr)){
					clearAllStoredOIDs();
					geoSearch.currArr.length = 0;
				}else{
					temp = prevArr;
					geoSearch.prevArr = currArr;
					temp.length = 0;
					geoSearch.currArr = temp;
				}
				infoFunc(null);
			}

			if(!someTargeted&&mouseDown&&prevArr){ //rehighlight true selections when clicking on
				for(var i = 0;i<prevArr.length;i++){ // TS hidden stuff
					highlighter(prevArr[i],"hi", 1);
					if(!oidStore[prevArr[i]])
						storeOID(prevArr[i]);
				}
			}
			binArr = null;
		//	console.log("done",Date.now()-timee);

		}
		





//DRAWING FUNCTIONS






																					//apply highlighting logic to an array
		function redrawAllGraphics(){    
		//	console.log("redrawing")
				for(var i =1;i<featureCount;i++){
					if(insideTimeBoundary[i]){
						if(oidStore[i])
							highlighter(i,"hi", 0);
					else
							highlighter(i,"", 0);
					}
				}
		}
																//main highlighting logic, separated by year with different basemap

		function highlighter(oid, hi, evt){
			if(evt&&(hi&&hl[oid]||!hi&&!hl[oid])){return}//short circuit unless on a redraw (evt==0)
			var symbo = topoOn?symbols:satSym
				, date
			  , graphic = oidToGraphic(oid)
				,	row
				;

			if(!graphic) return;

			date = features[oid-1].attributes.Date;
			color = getColor(date);
			if(evt){
				row = gridObject.oidToRow(oid);
				if (hi!== ""){
					domClass.add(row,"highl"+color);
					hl[oid]=1;
				}else{
					domClass.remove(row,"highl"+color);
					hl[oid]=0;
				}
			}
			if(previousLevel > 12){
				if (hi) hi="";
				else color+="thin";
			}
			graphic.setSymbol(symbo[color+hi]);
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

		function getInputBox(oid){
			return gridObject.oidToRow(oid).firstChild.firstChild.children[3].firstChild;
		}






//DEFINE UI






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
   		dataPane.innerHTML='<div id="dataCon"><div id="dataNode"></div><div id="downloadNode"><strong id="dlTitle">Downloads:</strong><a class="lrp" href="zips/Metadata.zip" target="_self">Metadata</a><a class="lrp" id="dlLink" href="tryagain.zip" target="_self">Dataset</a></div></div><div id="infopane"></div><div id="foot" class="unselectable"><div class="footDiv">Help</div><div class="footDiv">Terms of Use</div><div class="footDiv">Contact</div></div>';

   		mainWindow.appendChild(gridPane);
   		mainWindow.appendChild(dataPane);


   		defineDOMHandles();
   		resizeRp();

   		if(touch){
   			attachViews();
   		}else{
   			placeMap();
   			attachPanes();
   		}
		}

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

	   		var legend = DOC.createElement('img');
	   		legend.id = "legend";
	   		legend.className = "legend atop";
	   		legend.title = "Image Legend (NAVD88 ft)";
	   		legend.src = "";
	   		DOC.body.appendChild(legend);
	   	}
   	}

   	function attachHandlers(){

			function oneFromMany(e){
   			var node = e.target;
   			if (node.tagName === "STRONG") node = node.parentNode;
   			var oid = +node.getAttribute('data-oid');
   			node.style.cursor="default";
   			clearAndSetOID(oid,outlines.graphics[oid-1].attributes);
   		}

   		if(touch){
   			on(dataNode,".multiSelect:touchstart",oneFromMany);
   		}else{
   			on(dataNode,".multiSelect:mousedown",oneFromMany);
   		}
   	}

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
				clearAllStoredOIDs();
			}

			function showIntro(){
				dataNode.style.marginTop = 0;
				clearNode(dataNode);
				dataNode.innerHTML = introText;
				W.setTimeout(showPane, 0);
			}

			function prep(setData,attributes){
				if(selectedGraphicsCount === 0){
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
   		infoFunc = makeInfoFunc(prep);
   		W.setTimeout(showIntro,300);
   	}




//VIEWS


   	function attachViews(){
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
   			if(selectedGraphicsCount === 0){
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

   		function prep(setData, attr){
   			if(dataDisplayed&&selectedGraphicsCount === 0){
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


   		infoFunc = makeInfoFunc(prep)
   		setIntro();
   	}









   function makeInfoFunc(prep){
   	
   	function infoFunc(attributes){
   	 prep(setData,attributes);
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

		 function setData (attr){
			if(!attr){
				if(selectedGraphicsCount === 1){
					var oid = selectedGraphics[0];
					parseAttributes(outlines.graphics[oid-1].attributes,oid-1);
				}else{
					var str ="<h2>"+selectedGraphicsCount+ " projects selected</h2><div id='multiSelectWrapper'>";
					var count = 0;
					var i = 0;
					while (count < selectedGraphicsCount){
						if (oidStore[i] === 1){
							str+=("<span class='multiSelect' data-oid='"+i+"'><strong>"+names[i-1]+
								": </strong>"+formattedDates[i-1]+"</span><br/>")
							count++;
						}
						i++;
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
			"<span class = 'spirp'><strong>Collection Date: </strong>"+formattedDates[ind]+"</span>"+
			"<span class = 'spirp'><strong>Client: </strong>"+(attr.Client||"Groundwater Supply Assessment Section, DWR")+"</span>"+
			"<span class = 'spirp'><strong>Waterways Covered: </strong>"+(attr.Waterways||WWays(attr))+"</span>"+
			"<span class = 'spirp'><strong>Purpose: </strong>"+(attr.Purpose||ssMessage)+"</span>";
			downloadNode.style.display = "block";
		}


		return infoFunc;
}

		function defineDOMHandles(){
			 dataCon = dom.byId("dataCon")
			 dataNode = dom.byId("dataNode")
			 downloadNode = dom.byId('downloadNode')
			 dlLink = dom.byId("dlLink")

			 gridNode = dom.byId("gridNode")
			 spl = dom.byId("lPSplitter")

			 crossAnchor = dom.byId("cros")
			 identAnchor = dom.byId("ident")
			 measureAnchor = dom.byId("mea")
			 noClick = dom.byId("noClick")

			 zoomSlider =dom.byId("mapDiv_zoom_slider")
			 fex = dom.byId("fex")
			 topo = dom.byId("topo")
			 sat = dom.byId("sat")
			 timeDiv = dom.byId('timeDiv');

		}


		function placeMap(){
   	    var lPWidth = gridPane.clientWidth+6;
   	    if(ie9){
						mapDiv.style.left = lPWidth+"px";
					}else{
						mapDiv.style["-webkit-transform"] = "translate3d("+lPWidth+"px,0, 0)";
						mapDiv.style["transform"] = "translate3d("+lPWidth+"px,0, 0)";
					}
   			mapDiv.style.width = (innerWidth-lPWidth)+"px";
   	}


   	function resizeRp(){
   		if(touch){
   			setdataConHeight(innerHeight/2 - 32);
   		}else{
   		  dataPane.style.height = innerHeight-225+"px";
   		  setdataConHeight(innerHeight-257);
   		}
   	}

   	function setdataConHeight(height){
   		dataCon.style.height = height +"px";
   	}

   	function setHeader(){
			var wid = innerWidth;
			var appTitle = setHeader.appTitle = setHeader.appTitle?setHeader.appTitle:dom.byId("appTitle");
			if (wid < 600 && setHeader.fullText !== 0){
				appTitle.innerHTML = "Bathymetry";
				appTitle.style.width = "175px";
				setHeader.fullText = 0;
			}else if(wid > 599 && setHeader.fullText === 0){
				appTitle.style.width = "380px";
				appTitle.innerHTML = "Delta Bathymetry Catalog"
				setHeader.fullText = 1;
			}
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

//doesn't preserve order 
		function splice(arr,index){
			var newLen = arr.length-1;
			arr[index] = arr[newLen];
			arr.length = newLen;
			return arr;
		}
			/*	function splice(arr, index){
			for (var i = index, len = arr.length - 1; i < len; i++)
        		arr[i] = arr[i + 1];
			arr.length = len;
			return arr;
		}*/


		function nullPrevious(){
			previousRecentTarget = null;
		}

		(function checkRAF(W){
			if(!W.requestAnimationFrame)(function(W){var eaf = 'equestAnimationFrame', raf = 'r'+eaf, Raf = 'R'+eaf;W[raf] = W['webkit'+Raf]||W['moz'+Raf]||W[raf]||(function(callback){setTimeout(callback, 16)})})(W);
		})(W)

	attachHandlers();
	tiout.refresh() //ensure initial draw;
	});

//	});

//return from the require
});
