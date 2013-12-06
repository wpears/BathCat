require(["dijit/layout/BorderContainer"
				,"dijit/layout/ContentPane" 
				,"dgrid/Grid"
				,"dgrid/editor"
				,"dgrid/extensions/ColumnResizer"
				,"dojo/_base/declare"
				,"dojo/parser"
				,"dojo/dom-construct"
				,"dojo/dom"
				,"dojo/query"
				,"dojo/dom-class"
				,"esri/layers/FeatureLayer"
				,"dojo/_base/array"
				,"esri/tasks/query"
				,"esri/tasks/geometry"
				,"dojo/on"
				,"esri/dijit/TimeSlider"
				,"dojo/ready"
				,"esri/dijit/Scalebar"
				,"dojo/aspect"
				,"require"
				,'modules/tools.js'
				,"modules/popup.js"
				,"modules/crosstool.js"
				,"modules/identtool.js"
				,"modules/measuretool.js"
				,"modules/addsymbol.js"
				,"modules/clearnode.js"
				,"modules/tooltip.js"
				],
function( BorderContainer
				, ContentPane
				, Grid
				, Editor
				, ColumnResizer
				, declare
				, parser
				, construct
				, dom
				, dquery
				, domClass
				, FeatureLayer
				, darr
				, esriQuery
				, esriGeom
				, O
			  , TimeSlider
				, ready
				, ScaleBar
				, aspect
				, require
				, tools
				, Popup
				, CrossTool
				, IdentTool
				, MeasureTool
				, addSymbol
				, clearNode
				, Tooltip
				){

		dijit = null;
		dojox = null; //clear references
	//esri.map,	esri.utils, alternate infowindow included compact build.. check AMD FIXME
  	parser.parse(); //parse widgets

  	var allowMM = 0;  // An absolutely obscene amount of event handlers. And TONS of triggered body/map mm events
  	
  	(function(){
		var eael = HTMLElement.prototype.addEventListener;
		HTMLElement.prototype.addEventListener = function(){
 			if(arguments[0]!== "mousemove"||allowMM){
    			eael.apply(this, arguments);
      		}
		};
		})();

   ready(function(){ //wait for the dom
   	dom.byId("rP").style.height = window.innerHeight-225+"px";
   	document.body.style.visibility = "visible"; //show the page on load.. no unstyled content

   	esri.config.defaults.io.corsDetection = false;
   	esri.config.defaults.io.corsEnabledServers.push("mrsbmapp00642");//enable cors for quicker queries
   	esri.config.defaults.geometryService = new esri.tasks.GeometryService("http://sampleserver3.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer");
   	
   	var E = esri
   		, eL = E.layers
   		, rasterUrl = "http://mrsbmapp00642/ArcGIS/rest/services/BATH/Web_Rr/MapServer" 
   		, dataUrl = "http://mrsbmapp00642/ArcGIS/rest/services/BATH/data_out/MapServer/0?f=json"
   		, imageryUrl = "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"
   		, topoUrl = "http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"
   		, eT = E.tasks
   		, qt = new eT.QueryTask(dataUrl)
   		, qry = new eT.Query()
   		, loadIt = dom.byId("loadingg")
   		, dots = "."
   		, gridLoaded
   		, sr = new E.SpatialReference({wkid:102100})
   		, timeDiv = dom.byId('timeDiv')
   		, timeSlider
   		, inExt = new E.geometry.Extent(-13612000, 4519000,-13405000, 4662600, sr)
      , map = new E.Map("mapDiv", {extent:inExt})
      , rasterLayer = new eL.ArcGISDynamicMapServiceLayer(rasterUrl, {id:"raster"})
      , basemapImagery = new eL.ArcGISTiledMapServiceLayer(imageryUrl, {id:"imagery"})
     	, basemapTopo = new eL.ArcGISTiledMapServiceLayer(topoUrl, {id:"topo"})
		  , imageryOn
		  , topoOn
			, imageryLoader = dojo.connect(basemapImagery, "onLoad", function(){
					map.addLayer(basemapImagery);
					basemapImagery.hide();
					imageryOn = true;
					dojo.disconnect(imageryLoader);
					imageryLoader = null;
				})
			, topoLoader = dojo.connect(basemapTopo, "onLoad", function(){
					map.addLayer(basemapTopo);
					topoOn = true;
					dojo.disconnect(topoLoader);
					topoLoader = null;
				});
		rasterLayer.setVisibleLayers([-1]);
		E.map = map;

		(function loadDots(){
			if(!gridLoaded){
				loadIt.textContent = "Loading"+dots;
				dots = dots === "..."?"":dots+".";
				window.setTimeout(loadDots, 200);
			}else
			loadIt.textContent = "";
		})();

		qry.returnGeometry = true;
		qry.outFields =["*"];
		qry.outSpatialReference = sr;
		qry.where = "1 = 1";
		qt.execute(qry);
		var layDef ={"geometryType":"esriGeometryPolygon", "spatialReference":sr, "displayFieldName": "OBJECTID", "fields" : [
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

	timeSlider =(function(){
		new ScaleBar({map:map});
		var tCount, timeSlider,
			timeExtent = new E.TimeExtent(new Date("01/01/2010 UTC"), new Date("12/31/2013 UTC"));
		map.setTimeExtent(timeExtent);
		timeSlider = new TimeSlider({                                            //create TimeSlider
			style:"width:300px;",
			id: "timeSlider",
			intermediateChanges: true},
			construct.create("div", null, timeDiv)
			);
		timeSlider.setThumbCount(2);
		timeSlider.createTimeStopsByTimeInterval(timeExtent, 2, "esriTimeUnitsMonths");
		timeSlider.setLabels([2010, 2011, 2012, 2013, "All"]);
		tCount = timeSlider.timeStops.length;
		timeSlider.setThumbIndexes([0, tCount]);
		timeSlider.setTickCount(Math.ceil(tCount/2));
		timeSlider.startup();
		map.setTimeSlider(timeSlider);
		return timeSlider;	  
	})();

	dojo.connect(qt, "onComplete", function(fs){ //declare most variables upfront for fewer vars/hoisting trouble
	var WIN = window, DOC = document, DJ = dojo, MAP = map, fsFeat = fs.features, IE =!!document.all, ie9, fx,
		outlines, grid, gridObject, dScroll, Symbol = E.symbol, outlineMouseMove, outlineTimeout, on = O,
		mouseDownTimeout, previousRecentTarget, justMousedUp = false,  outMoveTime = 0,
	 	identifyUp, identOff = 1, measure, tooltip,
	 	crossTool, identTool, meaTool, 
		geoArr, splitGeoArr, geoBins, selectedGraphics =[], selectedGraphicsCount = 0,
		infoPaneOpen = 0, legend, toggleRightPane, eventFeatures= [],
		zoomEnd, adjustOnZoom, enableImagery, enableMap, imageIsOn = 0, mapIsOn = 1, laOff, previousLevel = 8,
		processTimeUpdate,
		tiout, tiload,
		mouseDownX = 0, mouseDownY = 0,
		layerArray = new Array(fsFeat.length),
		oidArray = new Array(fsFeat.length),
		oidStore = new Array(fsFeat.length),
		outsideTimeBoundary = new Array(fsFeat.length),
		rastersShowing = new Array(fsFeat.length),
		crossAnchor = dom.byId("cros"),
		arro = dom.byId("arro"),
		zSlid = dom.byId("mapDiv_zoom_slider"),
		scaleBarLabels = dquery('.esriScalebarLabel'),
		lP = dom.byId("lP"),
		noClick = dom.byId("noClick"),
		dlLink = dom.byId("dlLink"),
		rP = dom.byId("rP"),
		dataNode = dom.byId("dataNode"),
		downloadNode = dom.byId('downloadNode'),
		ilP = dom.byId("ilP"),
		measureAnchor = dom.byId("mea"),
		identAnchor = dom.byId("ident"),
		tsNode = dom.byId("timeSlider"),
		linArr = dquery(".dijitRuleLabelH", tsNode),
		bmaps = dom.byId("bmaps"),
		shoP = dom.byId("shoP"),
		spl = dom.byId("lP_splitter"),
		fex = dom.byId("fex"),
		phys = dom.byId("phys"),
		imag = dom.byId("imag"),
		movers = dquery(".mov"),
		rpCon = dom.byId("rpCon");

		outlines = new FeatureLayer({layerDefinition:layDef, featureSet:fs}, {
		  	id:"out",
       	 	mode: 0,
       	 	outFields: ["*"]
  		});
		eventFeatures[eventFeatures.length]=outlines;
		tiout = new FeatureLayer("http://mrsbmapp00642/ArcGIS/rest/services/BATH/s_ti/MapServer/0",{
		  	id:"tiout",
       	 	mode: 0,
       	 	outFields: ["OBJECTID"],
       	 	maxAllowableOffset:MAP.extent.getWidth()/MAP.width
  		});
		window.tiout = tiout
  		tiload = DJ.connect(tiout, "onLoad", function(){
     		tiout.setRenderer(new E.renderer.SimpleRenderer(blank));
     		outlines.setRenderer(new E.renderer.SimpleRenderer(blank));
     		function addLays(){ //need a caching map service in first at this API version
     			if(imageryOn||topoOn){
					MAP.addLayer(tiout);
					MAP.addLayer(outlines);
					DJ.disconnect(tiload);
				}else{
				WIN.setTimeout(addLays, 50);
				}
			}
			addLays();
		});

		(function(){
			for(var i = 0, j = layerArray.length;i<j;i++){
				layerArray[i] = i;
				oidArray[i] = i+1;
				oidStore[i] = 0;
				outsideTimeBoundary[i] = 0;
				rastersShowing[i] = 0;
			}
		})();

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
	
		//*****initialize grid and attach all handlers*******\\

		gridObject =(function(){
			var fsFeats = fs.features, i = 0, j = fsFeats.length, gdata =[], gridCon, expandReady=1,
				intData, featureAttr, dte, dst, lastNodePos =[],nameSorted = 0, dateSorted = 1,
				adGr = declare([Grid, ColumnResizer]), gridHeader, headerNodes;

				grid = new adGr({columns:{
								Project:{label:"Project", sortable:false},
								Date:{label:"Date", sortable:false},
								OBJECTID:{label:"OBJECTID"},
								Editor:Editor({field: "Image", sortable:false}, "checkbox"),
								__Date:{label:"_Date"}
								},
							cellNavigation:0
							},
							ilP);
			for(;i<j;i++){
				intData ={};
				featureAttr = fsFeats[i].attributes;
				dte = new Date(featureAttr.Date);
				dst = dte.toUTCString();
				dst = dst.charAt(6)=== " "?dst.substring(0, 5)+"0"+dst.substring(5):dst; //ieFix
				intData.__Date = featureAttr.Date;
				intData.Date = dst.slice(12, 16)+"-"+((1+dte.getUTCMonth())<10?"0"+(1+dte.getUTCMonth()):(1+dte.getUTCMonth()))+"-"+dst.slice(5, 7);
				intData.Project =(featureAttr.Project.length<6?"Soil Sed. "+featureAttr.Project:featureAttr.Project);
				intData.OBJECTID = featureAttr.OBJECTID;
				gdata.push(intData);
			}
			gridLoaded = 1;
			grid.renderArray(gdata);
			gridHeader = dom.byId("ilP-header");
			if(IE)gridHeader = gridHeader.firstChild;
			headerNodes = gridHeader.childNodes;
			headerNodes[0].title = "Sort by Name"; //maybe pass these into constructor
			headerNodes[1].title = "Sort by Date";         
			headerNodes[3].title = "Turn images on or off";
			gridCon = dquery(".dgrid-content")[0];
			dScroll = dquery(".dgrid-scroller")[0];

			for(var i = 0, j = gdata.length;i<j;i++){
				lastNodePos[i] = i;
			}

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
				var i = 0, j = gdata.length, newCon, currentNodes = gCon.childNodes,
					nodeIndex, frag = DOC.createDocumentFragment();
				gdata.sort(sorter);
				for(var i = 0, j = gdata.length;i<j;i++){
					nodeIndex = gdata[i].OBJECTID-1;
					frag.appendChild(currentNodes[lastNodePos[nodeIndex]].cloneNode(true));
					lastNodePos[nodeIndex] = i;
				}
				newCon = gCon.cloneNode(false);
				newCon.appendChild(frag);
				gCon.parentNode.replaceChild(newCon, gridCon);
				gridCon = newCon;
				frag = null;
			}

			function oidToRow(oid){
				return gridCon.childNodes[lastNodePos[oid-1]];
			}

			function scrollToRow(oid){
				var scroTop = dScroll.scrollTop, newTop,
					row = oidToRow(oid);
					if(row.offsetTop>dScroll.clientHeight+scroTop||row.offsetTop<scroTop)
						dScroll.scrollTop = row.offsetTop-155;
			}

			function timeUpdate(e){
				var startTime = e.startTime, endTime = e.endTime, currentRasters = rasterLayer.visibleLayers,
				currTime, currOID, currGraphic, gridData = gdata, currentCount = selectedGraphicsCount,
				currRow, toBeHidden = timeUpdate.toBeHidden, oidRasterIndex,
				rastersAsOIDs = timeUpdate.rastersAsOIDs;
				for(var i = 0, j = gridData.length;i<j;i++){
					currOID = gridData[i].OBJECTID;
					if(oidStore[currOID])
						clearStoredOID(currOID, 1, 1);
					currGraphic = oidToGraphic(currOID);
					currRow = oidToRow(currOID);
					currTime =+gridData[i].__Date
					if(currTime<startTime||currTime>endTime){
						domClass.add(currRow, "hiddenRow");
						if(MAP.layerIds[2]){
							oidRasterIndex = currOID-1;
							toBeHidden[toBeHidden.length] = currOID;
							for(var k = 1;k<currentRasters.length;k++){
								if(currentRasters[k] === oidRasterIndex){
									splice(currentRasters, k);
									k--;
								}
							}
						}
						outsideTimeBoundary[currOID] = 1;
						currGraphic.setSymbol(blank);
					}else{
						if(domClass.contains(currRow, "hiddenRow")){
							domClass.remove(currRow, "hiddenRow");
							outsideTimeBoundary[currOID] = 0;
							caCh(currOID, "", 0);
						}
					}
				}
				if(MAP.layerIds[2]){
					uncheckImageInputs(toBeHidden);
					for(var i = 1;i<currentRasters.length;i++){
						rastersAsOIDs[rastersAsOIDs.length] = currentRasters[i]+1;
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
		    if(nameSorted === 0&&selectedGraphicsCount>1){
				  renderSort(nameSortSeq, gdata, gridCon);
					nameSorted = 1;
					nameSortEffects();
					return true;
				}
        return false;
      }

			on(headerNodes[0], "mousedown", function(){
				if(nameSorted>0){
					renderSort(nameSortInv, gdata, gridCon);
					nameSorted = -1;
				}else{
					renderSort(nameSortSeq, gdata, gridCon);
					nameSorted = 1;
				}
				nameSortEffects();
			});
			on(headerNodes[1], "mousedown", function(){
				if(dateSorted>0){
					renderSort(dateSortInv, gdata, gridCon);
					dateSorted = -1;
				}else{
					renderSort(dateSortSeq, gdata, gridCon);
					dateSorted = 1;
				}
				dateSortEffects();
			});
      
			function triggerExpand(e){
				if(expandReady){
					WIN.requestAnimationFrame(function(){expand(e)});
					expandReady = 0;
				}
			}

			function expand(e){
				gridCon.style.width = gridHeader.style.width;
				expandReady = 1;
			}

			on(spl, "mousedown", function(e){								//expand left pane

			  var mM = on(WIN, "mousemove", triggerExpand);

			  on.once(WIN,"mouseup", function(evt){
				  MAP.resize();
				  mM.remove();
			  });
			});


			grid.on(".dgrid-cell:mouseover", function(e){
				var oid = getOIDFromGrid(e);
				if(oid)caCh(oid,"hi", 0);	
			});


			grid.on(".dgrid-cell:mouseout", function(e){						//grid mouseout handler
				var oid = getOIDFromGrid(e);
				if(oidStore[oid])
					return;
				else
					caCh(oid,"", 0);
			});

			function clearAndSetOID(oid, attributes){
				clearAllStoredOIDs();
				storeOID(oid);
				geoSearch.prevArr.length = 1;
				geoSearch.prevArr[0] = oid;
				caCh(oid,"hi", 0);
				infoFunc(attributes);
			}
			grid.on(".dgrid-cell:mousedown", function(e){	//grid click handler
				var et = e.target, oid = getOIDFromGrid(e), attributes;
				if(!et.firstChild||				
					domClass.contains(et.firstChild,"dgrid-resize-header-container")||
					domClass.contains(et,"dgrid-resize-header-container")||
					domClass.contains(et,"field-Image")||
					domClass.contains(et,"dgrid-input"))
						return;
				if(et!== previousRecentTarget){ //prevent click before double click
					window.clearTimeout(mouseDownTimeout);
					previousRecentTarget = et;
					mouseDownTimeout = WIN.setTimeout(nullPrevious, 400);
					attributes = outlines.graphics[oid-1].attributes;
					if(oidStore[oid]&&selectedGraphicsCount === 1){ //target is sole open
						clearStoredOID(oid, 1, 1);
						toggleRightPane();
					}else{
						clearAndSetOID(oid, attributes);
					} 	
		 		}
			});
			
			function gridDbl(e){
				var inputBox, oid = getOIDFromGrid(e);
				if(oid){
					var graphic = oidToGraphic(oid);
					if(!graphic){
						return;
					}
					if(e.target.localName!== "div"){
						clearAndSetOID(oid, graphic.attributes)
						inputBox = getInputBox(oid);
						MAP.setExtent(graphic._extent.expand(1.3));
						if(!inputBox.checked){
							inputBox.checked = true;
							rastersShowing[oid-1] = 1;
							setVisibleRasters.reusableArray[0] = oid;
							setVisibleRasters(setVisibleRasters.reusableArray, 0);
						}
					}
				}
			}

			grid.on(".dgrid-cell:dblclick", gridDbl);

			setVisibleRasters.reusableArray =[];
			function setVisibleRasters(newOIDs, fromCheck){
				if(!MAP.layerIds[2]){ //if the raster has not been added, add it.
					MAP.addLayer(rasterLayer);
					legend.node.src = "images/leg.png";
					legend.show();
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
							if(!outsideTimeBoundary[newOIDs[i]]&&visibleRasterOIDs.indexOf(newOIDs[i]-1)===-1)
								visibleRasterOIDs[visibleRasterOIDs.length] = newOIDs[i]-1;
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
					legend.show();
				}

				if(visibleRasterOIDs.length === 1){
					rL.suspend();
					legend.hide();
				}
				setToolVisibility(visibleRasterOIDs);

			}

			function setToolVisibility(visibleRasterOIDs){
				if(visibleRasterOIDs.length>1){//working identify logic below
					domClass.replace(identAnchor,"clickable","unclick");
					domClass.replace(crossAnchor,"clickable","unclick");
				}else if(visibleRasterOIDs.length == 1&&identTool&&identTool.getNode().style.display == "block"){
					on.emit(identAnchor,"mousedown",{bubbles:true});
					domClass.replace(identAnchor,"unclick","clickable");
					domClass.replace(crossAnchor,"unclick","clickable");
				}else{
					domClass.replace(identAnchor,"unclick","clickable");
					domClass.replace(crossAnchor,"unclick","clickable");
				}
			}

			function checkImageInputs(oidArr){
				var curr;
				for(var i = 0, j = oidArr.length;i<j;i++){
					if(!outsideTimeBoundary[oidArr[i]]){
						curr = getInputBox(oidArr[i]);
						curr.checked = true;
						rastersShowing[oidArr[i]-1] = 1;
					}
				}
			}

			function uncheckImageInputs(oidArr){
				var curr;
				for(var i = 0, j = oidArr.length;i<j;i++){
						curr = getInputBox(oidArr[i]);
						curr.checked = false;
						rastersShowing[oidArr[i]-1] = 0;
					}
			}

			function clearImageInputs(){
				var inputArr = dquery(".dgrid-input", ilP);
					for(var i = 0, j = inputArr.length;i<j;i++){
						inputArr[i].checked = false;
						rastersShowing[i] = 0;
					}
			}

			on(grid,".dgrid-input:change", function(e){
					var oid =+e.target.parentNode.parentNode.childNodes[2].innerHTML;
					rastersShowing[oid-1]?rastersShowing[oid-1] = 0:rastersShowing[oid-1] = 1;        
					setVisibleRasters.reusableArray[0] = oid;
					setVisibleRasters(setVisibleRasters.reusableArray, 1);
			});


			on(headerNodes[3],"mousedown", function(e){      						//mass image display/clear
				var someChecked = 0;
				for(var i = 0, j = rastersShowing.length;i<j;i++){
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
			});

			return {timeUpdate:timeUpdate, oidToRow:oidToRow, scrollToRow:scrollToRow, setVisibleRasters:
					setVisibleRasters, checkImageInputs:checkImageInputs,clickSort:clickSort,expand:triggerExpand};

		})();

		function clearStoredOID(oid, doSplice, fromGrid){
			var oidIndex = geoSearch.prevArr.indexOf(oid);
			caCh(oid,"", 0);
			if(oidStore[oid]){
				oidStore[oid] = 0;
				if(fromGrid&&oidIndex>-1)splice(geoSearch.prevArr, oidIndex);
				selectedGraphicsCount--;
				if(doSplice)
					splice(selectedGraphics, selectedGraphics.indexOf(oid));
			}
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

		function splice(arr, index){
			for (var i = index, len = arr.length - 1; i < len; i++)
        		arr[i] = arr[i + 1];
			arr.length = len;
			return arr;
		}
		
		var simpleLine = Symbol.SimpleLineSymbol
			, simpleFill = Symbol.SimpleFillSymbol
			, solidLine = simpleLine.STYLE_SOLID
			, solidFill = simpleFill.STYLE_SOLID
			, DJColor = DJ.Color
			, blank = new simpleFill(solidFill, new simpleLine(solidLine, new DJColor([255, 255, 255, 0.001]), 1), new DJColor([0, 0, 0, 0.001]))
			, symbols = {
						gre: new simpleFill(solidFill, new simpleLine(solidLine, new DJColor([18, 160, 0]), 1.5), new DJColor([0, 0, 0, 0])),
						mag: new simpleFill(solidFill, new simpleLine(solidLine, new DJColor([221, 4, 178]), 1.5), new DJColor([0, 0, 0, 0])),
						blu: new simpleFill(solidFill, new simpleLine(solidLine, new DJColor([50, 84, 255]), 1.5), new DJColor([0, 0, 0, 0])),
						red: new simpleFill(solidFill, new simpleLine(solidLine, new DJColor([255, 0, 0]), 1.5), new DJColor([0, 0, 0, 0])),
						grehi: new simpleFill(solidFill, new simpleLine(solidLine, new DJColor([18, 160, 0]), 6), new DJColor([0, 0, 0, 0])),
						maghi: new simpleFill(solidFill, new simpleLine(solidLine, new DJColor([221, 4, 178]), 6), new DJColor([0, 0, 0, 0])),
						bluhi: new simpleFill(solidFill, new simpleLine(solidLine, new DJColor([50, 84, 255]), 6), new DJColor([0, 0, 0, 0])),
						redhi: new simpleFill(solidFill, new simpleLine(solidLine, new DJColor([255, 0, 0]), 6), new DJColor([0, 0, 0, 0]))
					}
			, imSym ={
					mag: new simpleFill(solidFill, new simpleLine(solidLine, new DJColor([252, 109, 224]), 1.5), new DJColor([0, 0, 0, 0])),
					blu: new simpleFill(solidFill, new simpleLine(solidLine, new DJColor([119, 173, 255]), 1.5), new DJColor([0, 0, 0, 0])),
					red: new simpleFill(solidFill, new simpleLine(solidLine, new DJColor([243, 63, 51]), 1.5), new DJColor([0, 0, 0, 0])),
					gre: new simpleFill(solidFill, new simpleLine(solidLine, new DJColor([24, 211, 48]), 1.5), new DJColor([0, 0, 0, 0])),
					maghi: new simpleFill(solidFill, new simpleLine(solidLine, new DJColor([252, 109, 224]), 6), new DJColor([0, 0, 0, 0])),
					bluhi: new simpleFill(solidFill, new simpleLine(solidLine, new DJColor([119, 173, 255]), 6), new DJColor([0, 0, 0, 0])),
					redhi: new simpleFill(solidFill, new simpleLine(solidLine, new DJColor([243, 63, 51]), 6), new DJColor([0, 0, 0, 0])),
					grehi: new simpleFill(solidFill, new simpleLine(solidLine, new DJColor([24, 211, 48]), 6), new DJColor([0, 0, 0, 0])),
			};

   		ie9 =(DOC.all&&DOC.addEventListener&&!window.atob)?true:false;
   		if(ie9) fx = require("dojo/_base/fx", function(fx){return fx});
		rpCon.style.height = rP.scrollHeight-32+"px";
    	
		function setLinkColor(){
			if(imageIsOn){
				linArr[0].style.cssText = "text-shadow:0 0 1px #73ef83;color:rgb(24, 211, 48);";
				linArr[3].style.cssText = "text-shadow:0 0 1px #faa9a3;color:rgb(243, 63, 51);";
				linArr[2].style.cssText = "text-shadow:0 0 1px #eef5ff;color:rgb(119, 173, 255);";
				linArr[1].style.cssText = "text-shadow:0 0 1px #fee1f9;color:rgb(252, 109, 224);";
				darr.forEach(scaleBarLabels, function(v){domClass.add(v,"whiteScaleLabels")});
			}else{
				linArr[0].style.cssText = "text-shadow:0 0 1px #0a5c00;color:rgb(18, 160, 0);";
				linArr[1].style.cssText = "text-shadow:0 0 1px #9a037c;color:rgb(221, 4, 178);";
				linArr[2].style.cssText = "text-shadow:0 0 1px #0027ed;color:rgb(50, 84, 255);";
				linArr[3].style.cssText = "text-shadow:0 0 1px #b00;color:rgb(255, 0, 0);";
				darr.forEach(scaleBarLabels, function(v){domClass.remove(v,"whiteScaleLabels")});
			}
		}
		setLinkColor();
		linArr[linArr.length-1].style.cssText = "text-shadow:1px 1px 1px #fff;color:rgb(0, 0, 0);";
		

		on(timeDiv, ".dijitRuleLabelH:mouseover", function(e){
			var ets = e.target.style, col = ets.color;
			ets.backgroundColor = col;
			ets.color = "#fff";
		});

		on(timeDiv, ".dijitRuleLabelH:mouseout", function(e){
			var ets = e.target.style, back = ets.backgroundColor;
			ets.color = back;
			ets.backgroundColor = "rgba(0, 0, 0, 0)";
		});

		on(timeDiv, ".dijitRuleLabelH:mousedown", function(e){  //timeslider quicklinks handler
			var yr = e.target.innerHTML;
			if(yr.charAt(0)=== "A")
				timeSlider.setThumbIndexes([0, timeSlider.timeStops.length]);
			else
				timeSlider.setThumbIndexes([6*(yr-2010), 6*(yr-2010)+6]);
		});

		DJ.connect(timeSlider, "onTimeExtentChange", gridObject.timeUpdate); //handle time extent change

		DJ.connect(tiout,"onUpdateEnd", function(e, f, g, h){ //called on every zoom (due to refresh). allows feature updating
   		redrawAllGraphics(tiout.graphics);							//setup an onupdatestart that sets the visibility to false to avoid _surface typeerrors if they come
    	});

		enableImagery = function(){										//turn on imagery
			mapIsOn = 0;
			imageIsOn = 1;
			basemapImagery.setVisibility(true);                     //there is crud here. 
			basemapTopo.setVisibility(false);					//the layers aren't defined
			domClass.remove(phys,"currentbmap");
			domClass.add(imag,"currentbmap");
			setLinkColor();
			redrawAllGraphics(tiout.graphics);
		};
		enableMap = function(){
			mapIsOn = 1;                                            //turn on he map
			imageIsOn = 0;
			basemapTopo.setVisibility(true);
			basemapImagery.setVisibility(false);
			domClass.remove(imag,"currentbmap");
			domClass.add(phys,"currentbmap");
				setLinkColor();
			redrawAllGraphics(tiout.graphics);
		};
		laOff = function(){
			mapIsOn = 0;
			imageIsOn = 0;                                          //turn off both
			basemapTopo.setVisibility(false);
			basemapImagery.setVisibility(false);
			domClass.remove(imag,"currentbmap");
			domClass.remove(phys,"currentbmap");
		};

		on(bmaps,"mousedown", function(e){                            //basemap handling
			var et = e.target, typ = et.innerHTML;
			if(typ == "Satellite"&&!imageIsOn){
				enableImagery();
				if(!zoomEnd)
				zoomEnd = DJ.connect(MAP,"onZoomEnd", adjustOnZoom);
			}else if(typ == "Map"&&!mapIsOn){
				enableMap();
				if(!zoomEnd)
				zoomEnd = DJ.connect(MAP,"onZoomEnd", adjustOnZoom);
			}
			else {
				laOff();
			}
		});

		adjustOnZoom = function(ext, zF, anc, lev){	//logic on ZoomEnd	
			if(basemapImagery&&basemapTopo){
				if(lev>= 15&&previousLevel<15&&mapIsOn)
					enableImagery();
				else if(lev<15&&previousLevel>= 15&&imageIsOn)
					enableMap();
			}
			previousLevel = lev;
			var offs = ext.getWidth()/MAP.width;
			offs = offs>10?offs:10;
			tiout.setMaxAllowableOffset(offs);
			tiout.refresh();
		}; 
   		zoomEnd = DJ.connect(MAP,"onZoomEnd", adjustOnZoom);

	toggleRightPane = function(e){
		if(rP.isShowing()){//close button logic
			rP.hidePane();
			if(typeof identTool === 'object'&&identTool.isShowing())
				tools.wipe(identTool, identAnchor);
			clearAllStoredOIDs();
			geoSearch.prevArr.length = 0;
		}else{
			dataNode.style.marginTop = 0;
			clearNode(dataNode);
			dataNode.innerHTML = toggleRightPane.introText;
			WIN.setTimeout(rP.showPane, 0);
		}
	};

		toggleRightPane.introText = "<p>The <strong>Delta Bathymetry Catalog</strong> houses the complete set of multibeam bathymetric data collected by the Bathymetry and Technical Support section of the California Department of Water Resources.</p> <p id = 'beta'><b>Note: </b>The Catalog is still in active development. Please report any bugs or usability issues to <a href = 'mailto:wyatt.pearsall@water.ca.gov?subject = Bathymetry Catalog Issue'>Wyatt Pearsall</a>.</p><p>Click on a feature in the map or table to bring up its <strong>description</strong>. Double-click to view the <strong>raster image</strong>.</p> <p><strong>Download</strong> data as text files from the descrption pane.</p> <p><strong>Measure</strong> distances, <strong>identify</strong> raster elevations, and draw <strong>profile graphs</strong> with the tools at the top-right.</p> <p>Change what displays by <strong>collection date</strong> with the slider at bottom-right. <strong>Sort</strong> by date and name with the table's column headers.</p> <p>See the <strong>help</strong> below for further information.</p>";

		function infoFunc(attributes){
			if(!attributes&&selectedGraphicsCount === 0)
				toggleRightPane();
			else{
				if(ie9){
					var fxArgs ={node:rpCon, duration:200, properties:{opacity:0},
								onEnd:function(){
									infoFunc.setHTML(attributes);
									fx.fadeIn({node:rpCon}).play();
									if(rpCon.positionIdentPane)rpCon.positionIdentPane();
								}};
					if(rP.isShowing()){
						fx.animateProperty(fxArgs).play();
					}else{
					infoFunc.setHTML(attributes);
					rP.showPane();
				}
				}else{
					if(rP.isShowing()){
						dataNode.style.opacity = 0;
						downloadNode.style.opacity = 0;
						WIN.setTimeout(function(){
							infoFunc.setHTML(attributes);
							dataNode.style.opacity = 1;
							downloadNode.style.opacity = 1;
							if(rpCon.positionIdentPane)rpCon.positionIdentPane();
						}, 225);
					}else{
						infoFunc.setHTML(attributes);
						rP.showPane();
					}
				}
			}
		}

		infoFunc.WWays = function(attr){
			switch(attr.Project.slice(0, 2)){
			   case "GL":
					return "Grant Line Canal";
				case "OR":
					return "Old River";
				case "DC":
					return "Doughty Cut";
			}
		};	

		infoFunc.setHTML = function(attr){
			if(!attr){
				if(selectedGraphicsCount === 1){
					var oid = selectedGraphics[0];
					infoFunc.parseAttributes(outlines.graphics[oid-1].attributes);
				}else{
					downloadNode.style.display = "none";
					dataNode.style.marginTop = rpCon.clientHeight/2-15+"px";
					dataNode.innerHTML = "<h2>"+selectedGraphicsCount+" projects selected</h2>"
				}
			}else{
				if(attr&&attr.Project)
					infoFunc.parseAttributes(attr);	
			}
		};

		infoFunc.parseAttributes = function(attr){
			dataNode.style.marginTop = "0";	
			dataNode.innerHTML = "<h2>"+(attr.Project.length<6?"Soil Sed. "+attr.Project:attr.Project)+"</h2>"+
			"<span class = 'spirp'><strong>Collection Date: </strong>"+(new Date(attr.Date)).toUTCString().slice(4, 16)+"</span>"+
			"<span class = 'spirp'><strong>Client: </strong>"+(attr.Client||"Groundwater Supply Assessment Section, DWR")+"</span>"+
			"<span class = 'spirp'><strong>Waterways Covered: </strong>"+(attr.Waterways||this.WWays(attr))+"</span>"+
			"<span class = 'spirp'><strong>Purpose: </strong>"+(attr.Purpose||"Data was collected to determine the sediment impacts of the agricultural barriers at Middle River, Grant Line Canal, and Old River near the Delta Mendota Canal. Measurements have been made since 1998 at nineteen stations. Multibeam/RTK bathymetry has been gathered since 2011. Four stations have monthly data, the rest are visited in the Fall and Spring.")+"</span>";
			downloadNode.style.display = "block";
		};

DJ.connect(MAP,'onClick',function(e){
	var point = new esri.geometry.Point(e.mapPoint);

	console.log(e.mapPoint,point)})

(function(){
	var helpText = "<strong id = 'infoPaneTitle'>Help</strong><p>Zoom in and out with the <b>Zoom buttons</b> or the mousewheel. Shift and drag on the map to zoom to a selected area.</p><p>Go to the full extent of the data with the <b>Globe</b>.</p><p>Select map or satellite view with the <b>Basemap buttons</b>.</p><p>Browse through projects in the table. Sort the table with the column headers and collapse it with the <b>Slider</b>.</p><p>Turn on a raster by double-clicking it in the table or map, or checking its checkbox in the table.</p><ul>When a raster is displayed:<br/><li>With the <b>Identify</b> tool, click to display NAVD88 elevation at any point.</li><li>Draw a cross-section graph with the <b>Profile tool</b>. Click the start and end points of the line to generate a graph in a draggable window. Hover over points to display elevation.</li></ul><p>Use the <b>Measure tool</b> to calculate distance, area, or geographic location.</p><p>Project information and Identify results are displayed in the right pane. Toggle this pane with the <b>Arrow button</b>.</p><p>Use the <b>Time slider</b> to filter the display of features by date. Drag the start and end thumbs or click a year to only display data from that year.</p>",
		termText = "<strong id = 'infoPaneTitle'>Terms of Use</strong><p>The data displayed in this application is for qualitative purposes only. Do not use the data as displayed in rigorous analyses. If downloading the data, familiarize yourself with the metadata before use. Not for use as a navigation aid. The data reflects measurements taken at specific time periods and the Department of Water Resources makes no claim as to the current state of these channels, nor to the accuracy of the data as displayed. Do not share or publish this data without including proper attribution.</p>",
		conText = "<strong id = 'infoPaneTitle'>Contact</strong><p>For information on scheduling new bathymetric surveys, contact  <a href = 'mailto:shawn.mayr@water.ca.gov?subject = Bathymetric Survey'>Shawn Mayr</a>, (916) 376-9664.</p><p>For information on this application or the data contained herein, contact  <a href = 'mailto:wyatt.pearsall@water.ca.gov?subject = Bathymetry Catalog'>Wyatt Pearsall</a>, (916) 376-9643.</p>",
		infoPane = dom.byId("infopane"), foot = dom.byId("foot"), lastButt;
		function clearHelp(){
   					clearNode(infoPane);
   					infoPaneOpen = 0;
   					rpCon.style.borderBottom = "none";
   	}

		function toggleHelpGlow(e){
			if(e.target.tagName === "B"){
   				var key = e.target.textContent.slice(0, 3);
   				switch (key){
		   			case "Zoo":
		   				domClass.toggle(zSlid,"helpglow");
		   				break;
		   			case "Glo":
		   				domClass.toggle(fex,"helpglow");
		   				break;
		   			case "Bas":
		   				domClass.toggle(phys,"helpglow");
		   				domClass.toggle(imag,"helpglow");
		   				break;
		   			case "Sli":
		   				//domClass.toggle(lP,"helpglow");
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
		   			case "Arr":
		   				domClass.toggle(shoP,"helpglow");
		   				break;
		   			case "Tim":
		   				domClass.toggle(tsNode,"helpglow");
		   				break;
   				}
   			}
		}

   		on(infoPane, "mouseover", function(e){
   			toggleHelpGlow(e);
   		});

   		on(infoPane, "mouseout", function(e){
   			toggleHelpGlow(e);
   		});

   		on(dlLink,"mouseover", function(e){  //remove spatial reference info from files
   			var pro =(dataNode.firstChild.textContent).split(" ").join(""),
   				dat = new Date(dataNode.firstChild.nextElementSibling.textContent.slice(-11)),
   				yea = dat.getFullYear(),
   				mo = dat.getMonth()+1,
   				dayy = dat.getDate();
   				mo = mo+'';
   				dayy = dayy+'';
   				mo = (mo.length === 1?"0"+mo:mo);
   				dayy = (dayy.length === 1?"0"+dayy:dayy);
   				dlLink.href = "zips/"+pro+"_"+yea+"_"+mo+"_"+dayy+".zip";
   		});

   		on(foot, "mousedown", setHelp);


   		function setHelp(e){
   			if(lastButt)
   					domClass.remove(lastButt,"activeFoot");
   			else{
   				infoPaneOpen = 1;
   				rpCon.style.borderBottom = "2px solid #99ceff";
   				rpCon.style.boxShadow="0 2px 3px -2px #bbf0ff";
   				if(ie9){
   					fx.animateProperty({node:infoPane, duration:200, properties:{height:242}}).play();
   					fx.animateProperty({node:rpCon, duration:200, properties:{height:rpCon.clientHeight-250}}).play();
   				}else{
   					infoPane.style.height = "242px";
   					rpCon.style.height = rpCon.clientHeight-250+"px";
   				}
   			}

   			if(lastButt === e.target){
   				WIN.setTimeout(clearHelp, 205);
   				if(ie9){
   					fx.animateProperty({node:infoPane, duration:200, properties:{height:0}}).play();
   					fx.animateProperty({node:rpCon, duration:200, properties:{height:rpCon.clientHeight+250}}).play();
   				}else{
   					infoPane.style.height = 0;
   					rpCon.style.height = rpCon.clientHeight+250+"px";
   				}
   				lastButt = null;
   				return;
   			}
   			lastButt = e.target;
   			var whichButt = lastButt.innerHTML.slice(0, 1);
   			whichButt === "H"?infoPane.innerHTML = helpText:whichButt === "T"?infoPane.innerHTML = termText:infoPane.innerHTML = conText;
   			domClass.add(lastButt,"activeFoot");
   		}
		})();

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

		on(fex,"mousedown", function(e){                  //go to initial extent
			MAP.setExtent(inExt);
		});



		on(WIN, "resize", function(e){			//resize map on browser resize
			var winHeight = WIN.innerHeight
				, oHeightAndMarginTop
				, idCon=identTool?identTool.getNode():null;
			MAP.resize();
			gridObject.expand();
			if(+dataNode.style.marginTop.slice(0, 1)) dataNode.style.marginTop =(winHeight-257)/2-15+"px";
			oHeightAndMarginTop =+dataNode.style.marginTop.slice(0,-2)+dataNode.offsetHeight+15;
			if(ie9){
				fx.animateProperty({node:rP, duration:300, properties:{height:winHeight-225}}).play();
				if(idCon)
				fx.animateProperty({node:idCon, duration:150, properties:{top:oHeightAndMarginTop+70}}).play();
				if(infoPaneOpen)
					fx.animateProperty({node:rpCon, duration:300, properties:{height:winHeight-506}}).play();
				else fx.animateProperty({node:rpCon, duration:300, properties:{height:winHeight-257}}).play();
			}else{
				rP.style.height = winHeight-225+"px";
				if(infoPaneOpen)
					rpCon.style.height = winHeight-507+"px";
				else rpCon.style.height = winHeight-257+"px";
				if(idCon){
					idCon.style["transform"] = "translate3d(0px,"+oHeightAndMarginTop+"px, 0)";
					idCon.style["-webkit-transform"] = "translate3d(0px,"+oHeightAndMarginTop+"px, 0)";
				}
			}
		});


  	rP.isShowing = function(){
    	return rP.showing;
    }

    rP.showPane = function(){
			var i = 0, j = movers.length;
			rP.showing = 1;
			arro.style.backgroundPosition = "-32px -16px";
			if(ie9){
				for(;i<j;i++){
				if(movers[i] === rP)
					fx.animateProperty({node:movers[i], duration:300, properties:{marginRight:0}}).play();
				else fx.animateProperty({node:movers[i], duration:300, properties:{marginRight:285}}).play();
				}
			}else{
				for(;i<j;i++)
					domClass.add(movers[i],"movd");
			}
		}

    rP.hidePane = function(){
			var i = 0, j = movers.length;
			rP.showing = 0;
			downloadNode.style.display="none";
			arro.style.backgroundPosition = "-96px -16px";
			if(ie9){
				for(;i<j;i++){
				if(movers[i] === rP)
					fx.animateProperty({node:movers[i], duration:250, properties:{marginRight:-285}}).play();
				else fx.animateProperty({node:movers[i], duration:250, properties:{marginRight:0}}).play();
				}
			}else{
				for(;i<j;i++)
					domClass.remove(movers[i],"movd");
			}
		}

    function makeIdentContainer(node,previous){
   		node.show = function(){
   			if(!rP.isShowing()){
   				clearNode(previous);
   				rP.showPane();
   			}
   			identTool.getNode().style.display="block";
   			node.positionIdentPane();
   		};
   		node.isDefault = function(){
   			if(previous.innerHTML.slice(0, 5)=== "<p>Th")
   				return true;
   			return false;
   		};
   		node.isClear = function(){
   			if(previous.innerHTML.slice(0, 5)=== "")
   				return true;
   			return false;
   		};
   		node.setDefault = function(){
   			previous.innerHTML = toggleRightPane.introText;
        previous.style.opacity = 1;
   		};
   		node.replaceDefault=function(){
   			if(rP.isShowing()){
   				previous.style.opacity=0;
   				WIN.setTimeout(node.performReplace, 100);
   			}else{
   				node.performReplace();
   				rP.showPane();
   			}
   		};
   		node.performReplace=function(){
   			clearNode(previous);
   			identTool.getNode().style.display="block";
   			node.positionIdentPane();
   		};
   		node.positionIdentPane = function(){
				if (typeof identTool === 'object'&&identTool.isShowing()){
					rpCon.scrollTop = 0;
					var oHeightAndMarginTop =+dataNode.style.marginTop.slice(0,-2)+dataNode.offsetHeight+15
						, idCon=identTool.getNode()
						;
					if(ie9){
						idCon.style.top = oHeightAndMarginTop+75+"px";
					}else{
						idCon.style["transform"] = "translate3d(0px,"+oHeightAndMarginTop+"px, 0)";
						idCon.style["-webkit-transform"] = "translate3d(0px,"+oHeightAndMarginTop+"px, 0)";
					}
				}
			};
   	return node;
   }       
/************TOOLS***************/
		tooltip = Tooltip(noClick);

		on.once(crossAnchor,"mousedown", function(e){
				var options = { map:MAP
											, dojo:DJ
											, esri:E
											, rastersShowing:rastersShowing
											, eventFeatures:eventFeatures
											, chartNames:outlines
											, tooltip:tooltip
										  };
				allowMM = 1;						  
				crossTool = CrossTool(Popup(), crossAnchor, rasterUrl, layerArray, options);
				crossTool.init(e);				
		});

		on.once (identAnchor,"mousedown", function(e){
				var options= { map: MAP
										 , dojo: DJ
										 , esri: E
										 , rastersShowing: rastersShowing
										 , eventFeatures:eventFeatures
										 , names:outlines
										 , tooltip:tooltip
									   };
				identTool = IdentTool(makeIdentContainer(rpCon,dataNode), identAnchor, rasterUrl, layerArray, options); 
				identTool.init(e);
		}); 

		meaTool = MeasureTool( measureAnchor
			                   , new simpleLine(solidLine, new DJColor([0, 0, 0]), 2)
												 , new Symbol.SimpleMarkerSymbol({"size":6,"color":new DJColor([0, 0, 0])})
												 , { map:MAP
												 	 , eventFeatures:eventFeatures
												 	 }
												 );

		on.once(measureAnchor,"mousedown", function(e){allowMM=1;meaTool.init(e)});


		on(shoP,"mousedown", toggleRightPane);//handle close button click


		DJ.connect(outlines, "onMouseOver", function(e) {//map mouseover handler
			DJ.disconnect(outlineMouseMove);
			outlineMouseMove = DJ.connect(outlines, "onMouseMove", mmManager);    	
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


		DJ.connect(outlines,"onMouseOut", function(e){		//map mouseout handler
				if(identOff)MAP.setMapCursor("default");
				DJ.disconnect(outlineMouseMove);
				geoSearch({mapPoint:{x:0, y:0}}, 0);

		});

		DJ.connect(outlines, "onMouseDown", function(e){mouseDownX = e.pageX;mouseDownY = e.pageY;});

		DJ.connect(outlines, "onMouseUp", function(e){            //map click handler
			if(e.pageX < mouseDownX+10&&e.pageX > mouseDownX-10&&e.pageY < mouseDownY+10&&e.pageY > mouseDownY-10){
				justMousedUp = true;
				var attributes = e.graphic.attributes, oid = attributes.OBJECTID;
				if(oid!== previousRecentTarget){//prevent click before double click
					WIN.clearTimeout(mouseDownTimeout);
					previousRecentTarget = oid;
					mouseDownTimeout = WIN.setTimeout(nullPrevious, 400);
					geoSearch(e, 1);				
					if(!gridObject.clickSort()) gridObject.scrollToRow(oid);
				}
			}
		});

		DJ.connect(outlines, "onDblClick", function(e){						//map dblclick handler
			var selected,
			oid = e.graphic.attributes.OBJECTID,
			reSearch = selectedGraphics.indexOf(oid)===-1; //might need to copy, not assign
			if(reSearch){
				geoSearch(e, 1);
				gridObject.scrollToRow(oid);
			}
			selected = geoSearch.prevArr;
			if(selected.length){
				if(MAP.getScale()>73000)                          
					MAP.setExtent(oidToGraphic(selected[0])._extent.expand(1.3));
				gridObject.setVisibleRasters(selected, 0);
				gridObject.checkImageInputs(selected);
			}
		});

		geoSearch.prevArr =[];
		geoSearch.currArr =[];
		geoSearch.binLength = geoBins.length;
		geoSearch.lastClickBin =[];
		function geoSearch(e, mouseDown){//think about using two sorted arrays, one mins one maxs
			var i = 0, j = geoSearch.binLength-1, curr, oid, temp, binTemp, prevArr = geoSearch.prevArr, currArr = geoSearch.currArr,
			mapX = e.mapPoint.x, mapY = e.mapPoint.y, breakMax = mapX+1000, binArr, someTargeted = 0;
				if(mapX!== 0){
					for(;i<j;i++){
						if(mapX<geoBins[i+1])
							break;
					}
					binArr = splitGeoArr[i]||splitGeoArr[i-1];
					geoSearch.lastMouseBin = binArr;
					i = 0;
				}else{
					binArr = geoSearch.lastMouseBin;
				}
				if(mouseDown&&binArr!== geoSearch.lastClickBin){
					binTemp = binArr;
					binArr = binArr.concat(geoSearch.lastClickBin);
					geoSearch.lastClickBin = binTemp;
					binTemp = null;
				}

			j = binArr.length;
			for(;i<j;i++){
				curr = binArr[i];
				oid = curr.oid;
				if(curr.xmin>breakMax&&!mouseDown)
					break;
				if(!outsideTimeBoundary[oid]){
					if(curr.xmax>= mapX&&curr.xmin<= mapX&&curr.ymin<= mapY&&curr.ymax>= mapY){
						someTargeted = 1;
						caCh(oid,"hi", 0);
						if(identOff)MAP.setMapCursor("pointer");
						if(mouseDown){
							if(currArr.indexOf(oid)==-1){
								currArr.push(oid);
								if(!oidStore[oid])
									storeOID(oid);
							}
						}	    	
					}else{										
						if(oidStore[oid]){
							if(mouseDown) clearStoredOID(oid, 1, 0);
							continue; //burned by return shortcircuit. Heh.
						}else{
							caCh(oid,"", 0);
						}
					}
				}
			}
			if(mouseDown&&someTargeted){
				if(selectedGraphicsCount>currArr.length){ //clear a previous click in grid
					clearStoredOID(selectedGraphics[0], 1, 0);
				}
				if(WIN.JSON.stringify(prevArr)=== WIN.JSON.stringify(currArr)){
					clearAllStoredOIDs();
					geoSearch.prevArr.length = 0;
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
					caCh(prevArr[i],"hi", 0);
					if(!oidStore[prevArr[i]])
						storeOID(prevArr[i]);
				}
			}
			binArr = null;
		}
		


																					//apply highlighting logic to an array
		function redrawAllGraphics(graphics){    
				darr.forEach(graphics, function(v){
					var oid = v.attributes.OBJECTID;
					if(oidStore[oid])
						caCh(oid,"hi", 1);
					else
						if(!outsideTimeBoundary[oid])
							caCh(oid,"", 1);
				});
		}
																//main highlighting logic, separated by year with different basemap
		function caCh(oid, hi, refresh){
			var symbo = basemapImagery&&basemapImagery.visible?imSym:symbols
				, date
			  , graphic
				,	row
				;
			if(fs.features[oid-1]){
				graphic = oidToGraphic(oid);
				if(!graphic) return;
				
				date = fs.features[oid-1].attributes.Date;
				color = getColor(date);
				row = gridObject.oidToRow(oid);
				graphic.setSymbol(symbo[color+hi]);
				if(!refresh){
					if (hi!== "")
						domClass.add(row,"highl"+color);
					else
						domClass.remove(row,"highl"+color);
				}
			}
		}

		function getColor(date){
			if (date < 1293840000000) return "gre";
			if (date < 1325376000000) return "mag";
			if (date < 1357027200000) return "blu";
			if (date < 1388563200000) return "red";
		}

		function oidToGraphic(oid){
			return tiout.graphics[oid-1];
		}

		function getOIDFromGrid(e){ //returns the gets an ObjectID from an event either on the grid or map
			var etP = e.target.parentNode;
			if(etP.childNodes[2])
				return +etP.childNodes[2].innerHTML;
			else if(e.target.className == "dgrid-input")
				return +etP.parentNode.childNodes[2].innerHTML;
		}

		function getInputBox(oid){
			var box;
			if(IE) box = gridObject.oidToRow(oid).childNodes[0].childNodes[0].childNodes[3].childNodes[0];
			else box = gridObject.oidToRow(oid).childNodes[0].childNodes[3].childNodes[0];
			return box;
		}

		function isNumber(n) {
  			return !isNaN(parseFloat(n)) && isFinite(n);
		}

		function nullPrevious(){
			previousRecentTarget = null;
		}

		(function checkRAF(W){
			if(!W.requestAnimationFrame)(function(W){var eaf = 'equestAnimationFrame', raf = 'r'+eaf, Raf = 'R'+eaf;W[raf] = W['webkit'+Raf]||W['moz'+Raf]||W[raf]||(function(callback){setTimeout(callback, 16)})})(W);
		})(WIN)
		
	WIN.setTimeout(toggleRightPane, 300);
	});

	});

//return from the require
});
		//,{plot: "default", stroke: {color:"blue"}, fill: "lightblue"});
			/*, styleFunc: function(item){
		 						  if(item.y < 10){
		    							  return { fontColor : "red" };
		   						 }else if(item.y > 60){
		    						  return { fill: "green" };
		    					}
		   						 return {};
		 						 }*/