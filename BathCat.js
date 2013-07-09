require(["dijit/layout/BorderContainer","dijit/layout/ContentPane","dgrid/Grid",
		"dgrid/editor","dgrid/extensions/ColumnResizer","dojo/_base/declare","dojo/parser","dojo/dom-construct","dojo/dom","dojo/query",
		"dojo/dom-class","esri/layers/FeatureLayer","dojo/_base/array","esri/tasks/query","esri/tasks/geometry","dojox/charting/action2d/Magnify",
		"dojox/charting/Chart","dojox/charting/themes/PurpleRain","dojox/charting/axis2d/Default", "dojox/charting/plot2d/MarkersOnly","dojox/charting/action2d/Tooltip",
		"dojo/on","esri/dijit/TimeSlider","dojo/ready","esri/dijit/Scalebar","esri/dijit/Measurement","dojo/aspect","require","dojo/NodeList-fx"],
		function(BorderContainer,CP,Grid,edi,ColRe,dec,parser,dCon,dom,dque,
				 domcl,FL,darr,qr,geom,Mag,Chrt,chThem,chAx,chLin,Ttip,O,tts,ready,sB,MT,asp,require){
	//esri.map,	esri.utils, alt infowin included compact
  	parser.parse(); //parse widgets
  	var allowMM=0;  // An absolutely obscene amount of event handlers. And TONS of triggered body/map mm events
  	(function(){
		var eael=HTMLElement.prototype.addEventListener;
		HTMLElement.prototype.addEventListener=function(){
 			if(arguments[0]!=="mousemove"||allowMM){
    			eael.apply(this,arguments);
      		}
		}
	})();
   ready(function(){ //wait for the dom
   	dom.byId("rP").style.height=window.innerHeight-225+"px";
   	document.body.style.visibility="visible"; //show the page on load.. no unstyled content
   	esri.config.defaults.io.corsDetection=false;
   	esri.config.defaults.io.corsEnabledServers.push("mrsbmapp00642");//enable cors for quicker queries
   	esri.config.defaults.geometryService = new esri.tasks.GeometryService("http://sampleserver3.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer");
   	var E=esri,eL=E.layers,url ="http://mrsbmapp00642/ArcGIS/rest/services/BATH/s_out2/MapServer/0?f=json",
		eT=E.tasks,qt=new eT.QueryTask(url),qry= new eT.Query(),loadIt=dom.byId("loadingg"),dots=".",gridLoaded,
   		sr= new E.SpatialReference({wkid:102100}),timeDiv=dom.byId('timeDiv'),timeSlider,
		inExt = new E.geometry.Extent(-13612000,4519000,-13405000,4662600,sr),
        map = new E.Map("mapDiv", {extent:inExt}),
        rasterLayer = new eL.ArcGISDynamicMapServiceLayer("http://mrsbmapp00642/ArcGIS/rest/services/BATH/Web_Rr/MapServer",{id:"raster"}),
        basemapImagery =new eL.ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",{id:"imagery"}),
     	basemapTopo = new eL.ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer",{id:"topo"}),
		imageryOn,topoOn,imageryLayer,topoLayer,
		imageryLoader=dojo.connect(basemapImagery,"onLoad",function(){
			map.addLayer(basemapImagery);
			imageryLayer=map.getLayer("imagery");
			imageryLayer.hide();
			imageryOn=true;
			dojo.disconnect(imageryLoader);
			imageryLoader=null;
		}),
		topoLoader=dojo.connect(basemapTopo,"onLoad",function(){
			map.addLayer(basemapTopo);
			topoLayer=map.getLayer("topo");
			topoOn=true;
			dojo.disconnect(topoLoader);
			topoLoader=null;
		});
	/*	dojo.connect(basemapImagery,"onError",function(e){
			console.log("Rerequesting Imagery");
			basemapTopo = new eL.ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",{id:"imagery"});
		});
		dojo.connect(basemapTopo,"onError",function(e){
			console.log("Rerequesting Map");
			basemapTopo = new eL.ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer",{id:"topo"});
		});*/
		rasterLayer.setVisibleLayers([-1]);
			
		(function loadDots(){
			if(!gridLoaded){
				loadIt.textContent="Loading"+dots;
				dots=dots==="..."?"":dots+".";
				window.setTimeout(loadDots,200);
			}else
			loadIt.textContent="";
		})();

		qry.returnGeometry=true;
		qry.outFields=["*"];
		qry.outSpatialReference=sr;
		qry.where="1=1";
		qt.execute(qry);
		var layDef={"geometryType":"esriGeometryPolygon","spatialReference":sr,"displayFieldName": "OBJECTID", "fields" : [
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

	timeSlider=(function(){
		new sB({map:map});
		var tCount,timeSlider,
			timeExtent = new E.TimeExtent(new Date("01/01/2010 UTC"),new Date("12/31/2013 UTC"));
		map.setTimeExtent(timeExtent);
		timeSlider = new tts({                                            //create TimeSlider
			style:"width:300px;",
			id: "timeSlider",
			intermediateChanges: true},
			dCon.create("div", null, timeDiv)
			);
		timeSlider.setThumbCount(2);
		timeSlider.createTimeStopsByTimeInterval(timeExtent, 2, "esriTimeUnitsMonths");
		timeSlider.setLabels([2010,2011,2012,2013,"All"]);
		tCount = timeSlider.timeStops.length;
		timeSlider.setThumbIndexes([0,tCount]);
		timeSlider.setTickCount(Math.ceil(tCount/2));
		timeSlider.startup();
		map.setTimeSlider(timeSlider);
		return timeSlider;	  
	})();

	dojo.connect(qt,"onComplete",function(fs){ //declare most variables upfront for fewer vars/hoisting trouble
	var WIN=window, DOC=document, DJ=dojo, MAP=map, fsFeat=fs.features, IE=!!document.all, ie9, fx,
		outlines, grid, dScroll, eS=E.symbol, outlineMouseMove, outlineTimeout, on=O,
		mouseDownTimeout, previousRecentTarget, justMousedDown=false,
	 	Popup, identHandle, identifyUp, identOff=1, runIT, crossHandle, mmt, currentMeaTool,
	 	crossTool, identTool, meaTool, lastActive=null,
		geoArr, splitGeoArr, geoBins, selectedGraphics=[], selectedGraphicsCount=0, markedGraphic,
		infoPaneOpen=0, legend, paneIsShowing=0, toggleRightPane,
		zoomEnd, adjustOnZoom, enableImagery, enableMap, imageIsOn=0, mapIsOn=1, laOff, previousLevel=8,
		processTimeUpdate,
		tiout, tiload,
		layerArray=new Array(fsFeat.length),
		oidArray=new Array(fsFeat.length),
		oidStore=new Array(fsFeat.length),
		outsideTimeBoundary=new Array(fsFeat.length),
		checkTrack=new Array(fsFeat.length),
		cros=dom.byId("cros"),
		arro=dom.byId("arro"),
		zSlid=dom.byId("mapDiv_zoom_slider"),
		scaleBarLabels=dque('.esriScalebarLabel'),
		selectableNodes=dque('.selectable'),
		lP=dom.byId("lP"),
		noClick=dom.byId("noClick"),
		dlLink=dom.byId("dlLink"),
		rP=dom.byId("rP"),
		idCon=dom.byId("idCon"),
		irP=dom.byId("irP"),
		ilP=dom.byId("ilP"),
		resCon=dom.byId("resCon"),
		measur=dom.byId("measur"),
		mea=dom.byId("mea"),
		ident=dom.byId("ident"),
		tsNode=dom.byId("timeSlider"),
		linArr=dque(".dijitRuleLabelH",tsNode),
		bmaps=dom.byId("bmaps"),
		shoP=dom.byId("shoP"),
		spl=dom.byId("lP_splitter"),
		mdLink=dom.byId("mdLink"),
		fex=dom.byId("fex"),
		phys=dom.byId("phys"),
		imag=dom.byId("imag"),
		movers=dque(".mov"),
		rpCon=dom.byId("rpCon");
		outlines = new FL({layerDefinition:layDef,featureSet:fs}, {
		  	id:"out",
       	 	mode: 0,
       	 	outFields: ["*"]
  		});
		tiout = new FL("http://mrsbmapp00642/ArcGIS/rest/services/BATH/s_ti/MapServer/0",{
		  	id:"tiout",
       	 	mode: 0,
       	 	outFields: ["OBJECTID"],
       	 	maxAllowableOffset:MAP.extent.getWidth()/map.width
  		});
  		tiload=DJ.connect(tiout,"onLoad",function(){
     		tiout.setRenderer(new E.renderer.SimpleRenderer(blank));
     		outlines.setRenderer(new E.renderer.SimpleRenderer(blank));
     		function addLays(){ //need a caching map service in first at this API version
     			if(imageryOn||topoOn){
					MAP.addLayer(tiout);
					MAP.addLayer(outlines);
					DJ.disconnect(tiload);
				}else{
				WIN.setTimeout(addLays,50);
				}
			}
			addLays();
		});

		(function(){
			for(var i=0,j=layerArray.length;i<j;i++){
				layerArray[i]=i;
				oidArray[i]=i+1;
				oidStore[i]=0;
				outsideTimeBoundary[i]=0;
				checkTrack[i]=0;
			}
		})();

  		(function(){
  			var i=0,outG=outlines.graphics,j=outG.length,curr,k,l,currGeo;
  			geoArr=new Array(j);
  			geoBins=new Array(Math.ceil(j/10));
  			splitGeoArr=new Array(geoBins.length);
  			for(;i<j;i++){
  				curr=outG[i]._extent;
  				geoArr[i]={oid:outG[i].attributes.OBJECTID,
  						   xmin:curr.xmin,
  						   xmax:curr.xmax,
  						   ymin:curr.ymin,
  						   ymax:curr.ymax
  						 }
  			}
  			geoArr.sort(function(a,b){return a.xmin-b.xmin})

  			for(k=0,l=geoBins.length-1;k<l;k++){
  				geoBins[k]=geoArr[k*j/10>>0].xmin;
  				splitGeoArr[k]=[];
  			}
  			geoBins[l]=geoArr[j-1].xmin;
  			for(i=0;i<j;i++){
  				currGeo=geoArr[i];
  				for(k=0;k<l;k++){
  					if(currGeo.xmin<=geoBins[k+1]&&currGeo.xmax>=geoBins[k])
  						splitGeoArr[k].push(currGeo);

  				}
  			}
  		})();
	
		//*****initialize grid and attach all handlers*******\\

		gridObject=(function(){
			var fsFeats=fs.features,i=0,j=fsFeats.length,gdata=[],gridCon,
				intData,featureAttr,dte,dst,nameSorted=0,dateSorted=1,lastNodePos=[],
				adGr=dec([Grid,ColRe]),gridHeader,headerNodes;

				grid= new adGr({columns:{
								Project:{label:"Project",sortable:false},
								Date:{label:"Date",sortable:false},
								OBJECTID:{label:"OBJECTID"},
								Editor:edi({field: "Image",sortable:false}, "checkbox"),
								__Date:{label:"_Date"}
								},
							cellNavigation:0
							},
							"ilP");
			for(;i<j;i++){
				intData={};
				featureAttr=fsFeats[i].attributes;
				dte=new Date(featureAttr["Date"]);
				dst=dte.toUTCString();
				dst=dst.charAt(6)===" "?dst.substring(0,5)+"0"+dst.substring(5):dst; //ieFix
				intData["__Date"]=featureAttr["Date"];
				intData["Date"]=dst.slice(12,16)+"-"+((1+dte.getUTCMonth())<10?"0"+(1+dte.getUTCMonth()):(1+dte.getUTCMonth()))+"-"+dst.slice(5,7);
				intData["Project"]=(featureAttr["Project"].length<6?"Soil Sed. "+featureAttr.Project:featureAttr.Project);
				intData["OBJECTID"]=featureAttr["OBJECTID"];
				gdata.push(intData);
			}
			gridLoaded=1;
			grid.renderArray(gdata);
			gridHeader=dom.byId("ilP-header");
			if(IE)gridHeader=gridHeader.firstChild;
			headerNodes=gridHeader.childNodes;
			headerNodes[0].title="Sort by Name"; //maybe pass these into constructor
			headerNodes[1].title="Sort by Date";         
			headerNodes[3].title="Turn images on or off";
			gridCon=dque(".dgrid-content")[0];
			dScroll=dque(".dgrid-scroller")[0];

			for(var i=0,j=gdata.length;i<j;i++){
				lastNodePos[i]=i;
			}


			function dateSortSeq(a,b){
				return a["__Date"]-b["__Date"]
			}
			function dateSortInv(a,b){
				return b["__Date"]-a["__Date"]
			}
			function nameSortSeq(a,b){
				return a["Project"]>b["Project"]?1:-1;
			}
			function nameSortInv(a,b){
				return a["Project"]>b["Project"]?-1:1;
			}
			function renderSort(sorter,gdata,gCon){
				var i=0,j=gdata.length,newCon,currentNodes=gCon.childNodes,
					nodeIndex,frag=DOC.createDocumentFragment();
				gdata.sort(sorter);
				for(var i=0,j=gdata.length;i<j;i++){
					nodeIndex=gdata[i]["OBJECTID"]-1;
					frag.appendChild(currentNodes[lastNodePos[nodeIndex]].cloneNode(true));
					lastNodePos[nodeIndex]=i;
				}
				newCon=gCon.cloneNode(false);
				newCon.appendChild(frag);
				gCon.parentNode.replaceChild(newCon,gridCon);
				gridCon=newCon;
			}

			function oidToRow(oid){
				return gridCon.childNodes[lastNodePos[oid-1]];
			}

			function scrollToRow(oid){
				var scroTop=dScroll.scrollTop,
					row=oidToRow(oid);
					if(row.offsetTop>dScroll.clientHeight+scroTop||row.offsetTop<scroTop)
						dScroll.scrollTop=row.offsetTop-155;
			}

			function timeUpdate(e){
				var startTime=e.startTime,endTime=e.endTime,currentRasters=rasterLayer.visibleLayers,
				currTime,currOID,currGraphic,gridData=gdata,currentCount=selectedGraphicsCount,
				currRow,toBeHidden=timeUpdate.toBeHidden,oidRasterIndex,
				rastersAsOIDs=timeUpdate.rastersAsOIDs;
				for(var i=0,j=gridData.length;i<j;i++){
					currOID=gridData[i].OBJECTID;
					currGraphic=oidToGraphic(currOID);
					currRow=oidToRow(currOID);
					currTime=+gridData[i]["__Date"]
					if(currTime<startTime||currTime>endTime){
						domcl.add(currRow,"hiddenRow");
						if(MAP.layerIds[2]){
							oidRasterIndex=currOID-1;
							toBeHidden[toBeHidden.length]=currOID;
							for(var k=1;k<currentRasters.length;k++){
								if(currentRasters[k]===oidRasterIndex){
									splice(currentRasters,k);
									k--;
								}
							}
						}
						if(oidStore[currOID])
							clearStoredOID(currOID,1,1);
						outsideTimeBoundary[currOID]=1;
						currGraphic.setSymbol(blank);
					}else{
						if(domcl.contains(currRow,"hiddenRow")){
							domcl.remove(currRow,"hiddenRow");
							outsideTimeBoundary[currOID]=0;
							caCh(currOID,"",0);
						}
					}
				}
				if(MAP.layerIds[2]){
					uncheckImageInputs(toBeHidden);
					for(var i=1;i<currentRasters.length;i++){
						rastersAsOIDs[rastersAsOIDs.length]=currentRasters[i]+1;
					}
					setVisibleRasters(rastersAsOIDs,0);
				}
				if(currentCount!==selectedGraphicsCount)//make rP reflect possible change
					infoFunc(null)
				rastersAsOIDs.length=0;
				toBeHidden.length=0;
			}
			timeUpdate.rastersAsOIDs=[];
			timeUpdate.toBeHidden=[];

			renderSort(dateSortSeq,gdata,gridCon);



			on(headerNodes[0],"mousedown",function(){
				if(nameSorted){
					renderSort(nameSortInv,gdata,gridCon);
					nameSorted=0;
				}else{
					renderSort(nameSortSeq,gdata,gridCon)
					nameSorted=1;
				}
				if(selectedGraphicsCount)scrollToRow(selectedGraphics[0])
			});
			on(headerNodes[1],"mousedown",function(){
				if(dateSorted){
					renderSort(dateSortInv,gdata,gridCon);
					dateSorted=0;
				}else{
					renderSort(dateSortSeq,gdata,gridCon);
					dateSorted=1;
				}
				if(selectedGraphicsCount)scrollToRow(selectedGraphics[0])
			});

			on(spl, "mousedown",function(e){								//expand left pane
			var expandReady=1,mM,W=WIN;
			checkRAF(W);
			mM=on(W,"mousemove",triggerExpand);

			on.once(W,"mouseup",function(evt){
				MAP.resize();
				mM.remove();
			});
			function expand(e){
				gridCon.style.width=gridHeader.style.width;
				expandReady=1;
			}
			function triggerExpand(e){
				if(expandReady){
					W.requestAnimationFrame(function(){expand(e)});
					expandReady=0;
				}
			}
			});


			grid.on(".dgrid-cell:mouseover",function(e){
				var oid=getOIDFromGrid(e);
				if(oid)caCh(oid,"hi",0);	
			});


			grid.on(".dgrid-cell:mouseout",function(e){						//grid mouseout handler
				var oid=getOIDFromGrid(e);
				if(oidStore[oid])
					return;
				else
					caCh(oid,"",0);
			});

			function clearAndSetOID(oid,attributes){
				clearAllStoredOIDs();
				storeOID(oid);
				geoSearch.prevArr.length=1;
				geoSearch.prevArr[0]=oid;
				caCh(oid,"hi",0);
				infoFunc(attributes);
			}
			grid.on(".dgrid-cell:mousedown",function(e){	//grid click handler
				var et=e.target,oid=getOIDFromGrid(e),attributes;
				if(!et.firstChild||				
					domcl.contains(et.firstChild,"dgrid-resize-header-container")||
					domcl.contains(et,"dgrid-resize-header-container")||
					domcl.contains(et,"field-Image")||
					domcl.contains(et,"dgrid-input"))
						return;
				if(et!==previousRecentTarget){ //prevent click before double click
					window.clearTimeout(mouseDownTimeout);
					previousRecentTarget=et;
					mouseDownTimeout=WIN.setTimeout(function(){previousRecentTarget=null;},400);
					attributes=outlines.graphics[oid-1].attributes;
					if(oidStore[oid]&&selectedGraphicsCount===1){ //target is sole open
						clearStoredOID(oid,1,1);
						toggleRightPane();
					}else if(oidStore[oid]&&selectedGraphicsCount>1){ //target is one of several selected
						if(markedGraphic===oid){
							clearStoredOID(oid,1,1);
							infoFunc(null);
						}else{
							markedGraphic=oid;
							infoFunc(attributes);
						}
					}else{
						clearAndSetOID(oid,attributes);
					} 	
		 		}
			});
			
			function gridDbl(e){
				var inputBox,oid=getOIDFromGrid(e);
				if(oid){
					var graphic=oidToGraphic(oid);
					if(!graphic){
						return;
					}
					if(e.target.localName!=="div"){
						clearAndSetOID(oid,graphic.attributes)
						inputBox=getInputBox(oid);
						MAP.setExtent(graphic._extent.expand(1.3));
						if(!inputBox.checked){
							inputBox.checked=true;
							checkTrack[oid-1]=1;
							setVisibleRasters.reusableArray[0]=oid;
							setVisibleRasters(setVisibleRasters.reusableArray,0);
						}
					}
				}
			}

			grid.on(".dgrid-cell:dblclick",gridDbl);

			setVisibleRasters.reusableArray=[];
			function setVisibleRasters(newOIDs,fromCheck){
				if(!MAP.layerIds[2]){ //if the raster has not been added, add it.
					MAP.addLayer(rasterLayer);
					legend.node.src="images/leg_img.png";
					legend.show();
				}
				var rL=rasterLayer,
					visibleRasterOIDs=rL.visibleLayers,
					i,
					j=visibleRasterOIDs.length,
					splicedIfPresent,
					rasterIndex;
				if(newOIDs.length>1){
					(function(){
						for(var i=0,j=newOIDs.length;i<j;i++){
							if(!outsideTimeBoundary[newOIDs[i]]&&visibleRasterOIDs.indexOf(newOIDs[i]-1)===-1)
								visibleRasterOIDs[visibleRasterOIDs.length]=newOIDs[i]-1;
						}
					})();
				}
				if(newOIDs.length===1&&newOIDs[0]!==-1){
					rasterIndex=newOIDs[0]-1;
					while(j--){
						if(rasterIndex===visibleRasterOIDs[j]&&fromCheck){//splice this number out of visible layers if it is there
							splicedIfPresent=visibleRasterOIDs.splice(j,1)[0]; 
							break;
						}
					}
					if(rasterIndex!==splicedIfPresent)
						visibleRasterOIDs.push(rasterIndex)
				}

				if(newOIDs.length===0){
					visibleRasterOIDs=[-1];
				}

				rL.setVisibleLayers(visibleRasterOIDs);

				if(rL.suspended){											
					rL.resume();
					legend.show();
				}

				if(visibleRasterOIDs.length===1){
					rL.suspend();
					legend.hide();
				}
				setToolVisibility(visibleRasterOIDs);

			}

			function setToolVisibility(visibleRasterOIDs){
				if(visibleRasterOIDs.length>1){//working identify logic below
					domcl.replace(ident,"clickable","unclick");
					domcl.replace(cros,"clickable","unclick");
				}else if(visibleRasterOIDs.length==1&&idCon.style.display=="block"){
					on.emit(ident,"mousedown",{bubbles:true});
					domcl.replace(ident,"unclick","clickable");
					domcl.replace(cros,"unclick","clickable");
				}else{
					domcl.replace(ident,"unclick","clickable");
					domcl.replace(cros,"unclick","clickable");
				}
			}

			function checkImageInputs(oidArr){
				var curr;
				for(var i=0,j=oidArr.length;i<j;i++){
					if(!outsideTimeBoundary[oidArr[i]]){
						curr=getInputBox(oidArr[i]);
						curr.checked=true;
						checkTrack[oidArr[i]-1]=1;
					}
				}
			}

			function uncheckImageInputs(oidArr){
				var curr;
				for(var i=0,j=oidArr.length;i<j;i++){
						curr=getInputBox(oidArr[i]);
						curr.checked=false;
						checkTrack[oidArr[i]-1]=0;
					}
			}

			function clearImageInputs(){
				var inputArr=dque(".dgrid-input",ilP);
					for(var i=0,j=inputArr.length;i<j;i++){
						inputArr[i].checked=false;
						checkTrack[i]=0;
					}
			}

			on(grid,".dgrid-input:change",function(e){
					var oid=+e.target.parentNode.parentNode.childNodes[2].innerHTML;
					checkTrack[oid-1]?checkTrack[oid-1]=0:checkTrack[oid-1]=1;        
					setVisibleRasters.reusableArray[0]=oid;
					setVisibleRasters(setVisibleRasters.reusableArray,1);
			});


			on(headerNodes[3],"mousedown",function(e){      						//mass image display/clear
				var someChecked=0;
				for(var i=0,j=checkTrack.length;i<j;i++){
					if(checkTrack[i]){
						someChecked=1;
						break;
					}
				}
				if(someChecked){
					setVisibleRasters.reusableArray.length=0;
					setVisibleRasters(setVisibleRasters.reusableArray,0);
					clearImageInputs();
				}else{
					setVisibleRasters(oidArray,0);
					checkImageInputs(oidArray);
				}
			});

			return {timeUpdate:timeUpdate, oidToRow:oidToRow,scrollToRow:scrollToRow,setVisibleRasters:
					setVisibleRasters,checkImageInputs:checkImageInputs};

		})();

		function clearStoredOID(oid,doSplice,fromGrid){
			var oidIndex=geoSearch.prevArr.indexOf(oid);
			caCh(oid,"",0);
			if(oidStore[oid]){
				oidStore[oid]=0;
				if(fromGrid&&oidIndex>-1)splice(geoSearch.prevArr,oidIndex);
				selectedGraphicsCount--;
				if(doSplice)
					splice(selectedGraphics,selectedGraphics.indexOf(oid));
			}
		}

		function storeOID(oid){
			if(!oidStore[oid]){
				oidStore[oid]=1;
				selectedGraphics[selectedGraphicsCount]=oid;
				selectedGraphicsCount++;
			}
		}

		function clearAllStoredOIDs(){
			for(var i=0,j=selectedGraphicsCount;i<j;i++)
					clearStoredOID(selectedGraphics[i],0,0);
			selectedGraphics.length=0;
			geoSearch.prevArr.length=0;
		}

		function splice(arr,index){
			for (var i = index, len = arr.length - 1; i < len; i++)
        		arr[i] = arr[i + 1];
			arr.length = len;
			return arr;
		}
		
		var sls=eS.SimpleLineSymbol.STYLE_SOLID,
			sfs=eS.SimpleFillSymbol.STYLE_SOLID,//define map symbols
			blank= new eS.SimpleFillSymbol(sfs,new eS.SimpleLineSymbol(sls,new DJ.Color([255,255,255,0.001]),1),new DJ.Color([0,0,0,0.001])),
			symbols = {
						gre: new eS.SimpleFillSymbol(sfs,new eS.SimpleLineSymbol(sls,new DJ.Color([18,160,0]),1.5),new DJ.Color([0,0,0,0])),
						mag: new eS.SimpleFillSymbol(sfs,new eS.SimpleLineSymbol(sls,new DJ.Color([221,4,178]),1.5),new DJ.Color([0,0,0,0])),
						blu: new eS.SimpleFillSymbol(sfs,new eS.SimpleLineSymbol(sls,new DJ.Color([50,84,255]),1.5),new DJ.Color([0,0,0,0])),
						red: new eS.SimpleFillSymbol(sfs,new eS.SimpleLineSymbol(sls,new DJ.Color([255,0,0]),1.5),new DJ.Color([0,0,0,0])),
						grehi: new eS.SimpleFillSymbol(sfs,new eS.SimpleLineSymbol(sls,new DJ.Color([18,160,0]),6),new DJ.Color([0,0,0,0])),
						maghi: new eS.SimpleFillSymbol(sfs,new eS.SimpleLineSymbol(sls,new DJ.Color([221,4,178]),6),new DJ.Color([0,0,0,0])),
						bluhi: new eS.SimpleFillSymbol(sfs,new eS.SimpleLineSymbol(sls,new DJ.Color([50,84,255]),6),new DJ.Color([0,0,0,0])),
						redhi: new eS.SimpleFillSymbol(sfs,new eS.SimpleLineSymbol(sls,new DJ.Color([255,0,0]),6),new DJ.Color([0,0,0,0]))
					},
			imSym={
					mag: new eS.SimpleFillSymbol(sfs,new eS.SimpleLineSymbol(sls,new DJ.Color([252,109,224]),1.5),new DJ.Color([0,0,0,0])),
					blu: new eS.SimpleFillSymbol(sfs,new eS.SimpleLineSymbol(sls,new DJ.Color([119,173,255]),1.5),new DJ.Color([0,0,0,0])),
					red: new eS.SimpleFillSymbol(sfs,new eS.SimpleLineSymbol(sls,new DJ.Color([243,63,51]),1.5),new DJ.Color([0,0,0,0])),
					gre: new eS.SimpleFillSymbol(sfs,new eS.SimpleLineSymbol(sls,new DJ.Color([24,211,48]),1.5),new DJ.Color([0,0,0,0])),
					maghi: new eS.SimpleFillSymbol(sfs,new eS.SimpleLineSymbol(sls,new DJ.Color([252,109,224]),6),new DJ.Color([0,0,0,0])),
					bluhi: new eS.SimpleFillSymbol(sfs,new eS.SimpleLineSymbol(sls,new DJ.Color([119,173,255]),6),new DJ.Color([0,0,0,0])),
					redhi: new eS.SimpleFillSymbol(sfs,new eS.SimpleLineSymbol(sls,new DJ.Color([243,63,51]),6),new DJ.Color([0,0,0,0])),
					grehi: new eS.SimpleFillSymbol(sfs,new eS.SimpleLineSymbol(sls,new DJ.Color([24,211,48]),6),new DJ.Color([0,0,0,0])),
			};

   		ie9=(DOC.all&&DOC.addEventListener&&!window.atob)?true:false;
   		if(ie9) fx=require("dojo/_base/fx",function(fx){return fx});
		rpCon.style.height=rP.scrollHeight-32+"px";
    	
		function setLinkColor(){
			if(imageIsOn){
				linArr[0].style.cssText="text-shadow:0 0 1px #73ef83;color:rgb(24,211,48);";
				linArr[3].style.cssText="text-shadow:0 0 1px #faa9a3;color:rgb(243,63,51);";
				linArr[2].style.cssText="text-shadow:0 0 1px #eef5ff;color:rgb(119,173,255);";
				linArr[1].style.cssText="text-shadow:0 0 1px #fee1f9;color:rgb(252,109,224);";
				darr.forEach(scaleBarLabels,function(v){domcl.add(v,"whiteScaleLabels")});
			}else{
				linArr[0].style.cssText="text-shadow:0 0 1px #0a5c00;color:rgb(18,160,0);";
				linArr[1].style.cssText="text-shadow:0 0 1px #9a037c;color:rgb(221,4,178);";
				linArr[2].style.cssText="text-shadow:0 0 1px #0027ed;color:rgb(50,84,255);";
				linArr[3].style.cssText="text-shadow:0 0 1px #b00;color:rgb(255,0,0);";
				darr.forEach(scaleBarLabels,function(v){domcl.remove(v,"whiteScaleLabels")});
			}
		}
		setLinkColor();
		linArr[linArr.length-1].style.cssText="text-shadow:1px 1px 1px #fff;color:rgb(0,0,0);";
		

		on(timeDiv, ".dijitRuleLabelH:mouseover",function(e){
			var ets=e.target.style,col=ets.color;
			ets.backgroundColor=col;
			ets.color="#fff";
		});

		on(timeDiv, ".dijitRuleLabelH:mouseout",function(e){
			var ets=e.target.style,back=ets.backgroundColor;
			ets.color=back;
			ets.backgroundColor="rgba(0,0,0,0)";
		});

		on(timeDiv, ".dijitRuleLabelH:mousedown", function(e){  //timeslider quicklinks handler
			var yr=e.target.innerHTML;
			if(yr.charAt(0)==="A")
				timeSlider.setThumbIndexes([0,timeSlider.timeStops.length]);
			else
				timeSlider.setThumbIndexes([6*(yr-2010),6*(yr-2010)+6]);
		});

		DJ.connect(timeSlider, "onTimeExtentChange",gridObject.timeUpdate); //handle time extent change

		DJ.connect(tiout,"onUpdateEnd",function(e,f,g,h){ //called on every zoom (due to refresh). allows feature updating
   		redrawAllGraphics(tiout.graphics);							//setup an onupdatestart that sets the visibility to false to avoid _surface typeerrors if they come
    	});

		enableImagery=function(){										//turn on imagery
			mapIsOn=0;
			imageIsOn=1;
			imageryLayer.setVisibility(true);                     //there is crud here. 
			topoLayer.setVisibility(false);					//the layers aren't defined
			domcl.remove(phys,"currentbmap");
			domcl.add(imag,"currentbmap");
			setLinkColor();
			redrawAllGraphics(tiout.graphics);
		};
		enableMap=function(){
			mapIsOn=1;                                            //turn on he map
			imageIsOn=0;
			topoLayer.setVisibility(true);
			imageryLayer.setVisibility(false);
			domcl.remove(imag,"currentbmap");
			domcl.add(phys,"currentbmap");
				setLinkColor();
			redrawAllGraphics(tiout.graphics);
		};
		laOff=function(){
			mapIsOn=0;
			imageIsOn=0;                                          //turn off both
			topoLayer.setVisibility(false);
			imageryLayer.setVisibility(false);
			domcl.remove(imag,"currentbmap");
			domcl.remove(phys,"currentbmap");
		};

		adjustOnZoom= function(ext,zF,anc,lev){	//logic on ZoomEnd	
			if(imageryLayer&&topoLayer){
				if(lev>=15&&previousLevel<15)
					enableImagery();
				else if(lev<15&&previousLevel>=15)
					enableMap();
				else if(!topoLayer.visible&&!imageryLayer.visible){
					if(lev>=15)
						enableImagery();
					else
						enableMap();
				}
			}
			previousLevel=lev;
			var offs=MAP.extent.getWidth()/MAP.width;
			offs=offs>10?offs:10;
			tiout.setMaxAllowableOffset(offs);
			tiout.refresh();
		}; 
   		zoomEnd=DJ.connect(MAP,"onZoomEnd",adjustOnZoom);
	/*	DJ.connect(MAP,"onMouseDragEnd",function(e){
			var currImg=dque("#mapDiv_basemapImagery img")[0];
			console.log(e,currImg);
			if(currImg){
				on(currImg,"click",function(e){console.log(e,"currImg")});
			}
	Looks like I'd need to ax click blockers..?
	})*/
/********Popup and cross*********************************************/
		Popup=function(){
			var popupHandlers=[],popUp,popStyle,popHeader,headStyle,popContainer,conStyle,
				popSplitterV,splitStyleV,popSplitterH,splitStyleH,popClose,self,
				popHeight=400,popWidth=600,edges={left:60,right:660,top:100,bottom:500},
				W=WIN,BS=DOC.body.style,px="px",innerWidth=W.innerWidth,innerHeight=W.innerHeight,
				docked={width:null,height:null},
			show=function(){
				if(!popUp){
					dCon.place('<link rel="stylesheet" href="popup.css">',dque('head')[0]);
					popUp=dCon.place('<div id="popUp"><div id="popHeader"class="panehead"><span id="popTitle">Profile Tool</span><div id="popClose"class="closebox">X</div></div><div id="popContainer"></div><div id="popSplitterV"><div id="popLineV"></div></div><div id="popSplitterH"><div id="popLineH"></div></div></div>',DOC.body);
					popStyle=popUp.style;
					popHeader=dom.byId("popHeader");
					headStyle=popHeader.style;
					popContainer=dom.byId("popContainer");
					conStyle=popContainer.style;
					popSplitterV=dom.byId("popSplitterV");
					splitStyleV=popSplitterV.style;
					popSplitterH=dom.byId("popSplitterH");
					splitStyleH=popSplitterH.style;
					popClose=dom.byId("popClose");
					conStyle.width="593px";
					self=this;
					checkRAF(W);
				}
				if(ie9){
					popStyle.left=edges.left+px;
					popStyle.top=edges.top+px;
				}else{
					popStyle["transform"]="translate3d("+edges.left+"px,"+edges.top+"px,0)";
					popStyle["-webkit-transform"]="translate3d("+edges.left+"px,"+edges.top+"px,0)";
				}	
				attachHandlers();
			},

			hide=function(){
				if(ie9){
					popStyle.left="10000px"
					popStyle.top="10000px"
				}else{
					popStyle["transform"]="translate3d(10000px,10000px,0)";
					popStyle["-webkit-transform"]="translate3d(10000px,10000px,0)";
				}
				removeHandlers();
			},

			attachHandlers=function(){
				if(!popupHandlers[0]){
					popupHandlers=[
					on(popClose,"mousedown",function(){
						toolWipe(crossTool,cros);
					}),
					on(popHeader,"mousedown",move),             //e,dim,pageDim,max,otherSplitStyle,edgeTracker,oppositeEdge
					on(popSplitterV,"mousedown",function(e){self.resize(e,"width","pageX",innerWidth,edges.left,"right")}),
					on(popSplitterH,"mousedown",function(e){self.resize(e,"height","pageY",innerHeight,edges.top,"bottom")})
					];
				}
			},

			removeHandlers=function(){
				darr.forEach(popupHandlers,function(v){
					v.remove();
				});
				popupHandlers.length=0;
			},

			freezeSelectable=function(selectable){
				for(var i=0;i<selectable.length;i++)
					domcl.replace(selectable[i],"unselectable","selectable");
			},

			unfreezeSelectable=function(selectable){
				for(var i=0;i<selectable.length;i++)
					domcl.replace(selectable[i],"selectable","unselectable");
			},

			move=function(e){//adjustable graph popup
			var et=e.target,offsetX=e.offsetX||e.layerX,offsetY=e.offsetY||e.layerY,minSize=120,moveReady=1,IE9=ie9;

			BS["-webkit-user-select"]="none";//when the width is collapsed, the offset changes according to the
			BS["-moz-user-select"]="none";	//the direction of collapse
			conStyle.display="none";
			popStyle.boxShadow="0 0 0";
			popStyle.opacity="0.7";
			splitStyleH.display="none";
			splitStyleV.display="none";
			headStyle.boxShadow="0 0 0";
			if(et.id!=="popHeader")
				offsetX+=et.offsetLeft,offsetY+=et.offsetTop; //adjust offset if on title div
			freezeSelectable(selectableNodes);

			var mM=on(W,"mousemove",triggerMove);

			on.once(W,"mouseup",function(e){
				mM.remove();
				BS["-webkit-user-select"]="text";
				BS["-moz-user-select"]="text";
				popStyle.opacity="1";
				popStyle.boxShadow="0 1px 2px 1px #a5b6e0,0px 0px 2px 0 #a5b6e0";
				headStyle.boxShadow="0px 2px 2px -1px #a5b6e0";
				conStyle.display="block";
				splitStyleV.display="block";
				splitStyleH.display="block";

				unfreezeSelectable(selectableNodes);
			});

			function triggerMove(e){
				if(moveReady){
					W.requestAnimationFrame(function(){movePopup(e)});//<1ms to run on chrome
					moveReady=0; //debounce mousemove
				}
			}
			function movePopup(e){
				var newLeftEdge=e.pageX-offsetX,newRightEdge=newLeftEdge+popWidth,
					newTopEdge=e.pageY-offsetY,newBottomEdge=newTopEdge+popHeight,nWid,nHei;
				if(newLeftEdge<0){       //left width shrink setup and docking
					newLeftEdge=0;
					offsetX=e.pageX;
					if(!docked.width)
						docked.width=popWidth;
				}else if(newRightEdge>innerWidth){ //right width shrink setup and docking
					newRightEdge=innerWidth;
					if(!docked.width)
						docked.width=popWidth;
				}
				if(docked.width){                                     
					if(newRightEdge<innerWidth-newLeftEdge){     //left width growth setup
						nWid=newRightEdge;
						newLeftEdge=0;
						offsetX=e.pageX;
					}else{                               //right width growth setup
						newRightEdge=innerWidth;
						nWid=newRightEdge-newLeftEdge;
					}
					if(nWid>=docked.width){				//undocking width
						nWid=docked.width;
						docked.width=null;
					}
				}          

				if(newTopEdge<0){                //top height shrink setup and docking
					newTopEdge=0;
					if(!docked.height)
						docked.height=popHeight;
				}else if(newBottomEdge>innerHeight){ //bottom height shrink setup and docking
					newBottomEdge=innerHeight;
					if(!docked.height)
						docked.height=popHeight;
				}
				if(docked.height){
					if(newBottomEdge<innerHeight-newTopEdge){           //top height growth setup
						newTopEdge=0;
						nHei=newBottomEdge;
					}else{                                      //bottom height growth setup
						newBottomEdge=innerHeight;
						nHei=newBottomEdge-newTopEdge;
					}
					if(nHei>=docked.height){                  //undocking height
						nHei=docked.height;
						docked.height=null;
					}
				}

				if(popWidth!==nWid&&nWid>=minSize){    //actual width shrinking/growing
					popStyle.width=nWid+px;
					conStyle.width=nWid-7+px;
					popWidth=nWid;
				}
				if(popHeight!==nHei&&nHei>=minSize){	//actual height shrinking/growing limited to 120
					popStyle.height=nHei+px;
					conStyle.height=nHei-34+px;
					popHeight=nHei;	
				}
				if(newTopEdge>innerHeight-minSize)newTopEdge=innerHeight-minSize; //limit translate to
				if(newLeftEdge>innerWidth-minSize)newLeftEdge=innerWidth-minSize; //minSize from edge
				//move via translate3d then update edges
				if(IE9){
					popStyle.left=newLeftEdge+px;
					popStyle.top=newTopEdge+px;
				}else{
					popStyle["transform"]="translate3d("+newLeftEdge+"px,"+newTopEdge+"px,0)";
					popStyle["-webkit-transform"]="translate3d("+newLeftEdge+"px,"+newTopEdge+"px,0)";
				}
				edges.left=newLeftEdge;
				edges.right=newRightEdge;
				edges.top=newTopEdge;
				edges.bottom=newBottomEdge;
				moveReady=1;
			}

			},
			resize=function(e,dim,pageDim,max,edgeTracker,oppositeEdge){
				BS["-webkit-user-select"]="none";
				BS["-moz-user-select"]="none";	
				var popconDiff=(dim==="width"?7:34),resizeReady=1,min=120,
					mM=on(W,"mousemove",triggerResize);

					on.once(W,"mouseup",function(e){
						mM.remove();
						if(docked[dim])
							docked[dim]=(dim==="width"?popWidth:popHeight);
						BS["-webkit-user-select"]="text";
						BS["-moz-user-select"]="text";
					});

					function resizePopup(e){
						var moveLocation=e[pageDim],newDim;
						if(moveLocation<=max){
							newDim=moveLocation-edgeTracker;
							if(newDim>=120){
								popStyle[dim]=newDim+px;
								conStyle[dim]=newDim-popconDiff+px;
								dim==="width"?popWidth=newDim:popHeight=newDim;
								edges[oppositeEdge]=moveLocation;
							}
						}
						resizeReady=1;
					};
					function triggerResize(e){
						if(resizeReady){
							W.requestAnimationFrame(function(){resizePopup(e)});
							resizeReady=0;
						}
					}
					
			},
			getContainer=function(){
				return popContainer;
			};

			return{
				show:show,
				hide:hide,
				move:move,
				resize:resize,
				getContainer:getContainer
			}
		};


		crossTool=function(container){						//cross section function!
			var self, inMap=MAP, inE=E, inD=dojo, inEG=inE.geometry, W=WIN,
			sR=inMap.spatialReference, graphics=[[]], mapGfx=inMap.graphics,offsetStep=0,
			gOffset=-1, gfxOffset=4, graphHandlers=[],graphList=[],mouseDownY,mouseDownX,
			charts=[], charDivs=[],chartId, chartCount=1, crossCount=0,reqQueue=[],freeToReq=1,
			updateReady=1, tls, tlin, containerNode,layerIdsFound,exportHandlers=[],chartArray=[],
			lSy=new eS.SimpleLineSymbol(sls,new inD.Color([0,0,0]),2),
			pSy=new eS.SimpleMarkerSymbol({"size":6,"color":new DJ.Color([0,0,0])}),
			graylSy=new eS.SimpleLineSymbol(sls,new inD.Color([180,180,180]),2),
			graylSyOut=new eS.SimpleLineSymbol(sls,new inD.Color([180,180,180]),1),
			graySy=new eS.SimpleMarkerSymbol({"size":6,"color":new DJ.Color([140,140,140]),"outline":graylSyOut}),
			hovSy=new eS.SimpleMarkerSymbol(eS.SimpleMarkerSymbol.STYLE_CIRCLE,15,lSy,new inD.Color('#4879bc')),
			
			update= function(p1,p2){
					tlin=new inEG.Polyline(sR);
					tlin.addPath([p1, p2]);
					tls.setGeometry(tlin);
					updateReady=1;	
			},
			moveLine=function(p1,p2){
				if(updateReady){
					updateReady=0;
					update(p1,p2)						
				}
			},
			reqWhenAble=function(p1,p2,chCount,crCount){
				if(freeToReq){
					rendGr(pSy,p1,p2,chCount,crCount);
				}else{
					reqQueue.push({p1:p1,p2:p2,chCount:chCount,crCount:crCount});
				}
			},
			addSecondPoint=function(p1,p2,chCount,crCount){
				moveLine(p1,p2);
				if(p2.x===p1.x&&p2.y===p1.y)return;
				addSymbol(p2,pSy,graphics[crCount]);
				inD.disconnect(self.handlers[2]);
				inD.disconnect(self.handlers[3]);
				self.handlers[2]=null;
				self.handlers[3]=null;
				self.handlers[1]=inD.connect(inMap,"onMouseUp",function(e){
					if(e.pageX<mouseDownX+10&&e.pageX>mouseDownX-10&&e.pageY<mouseDownY+10&&e.pageY>mouseDownY-10)
						addFirstPoint(e.mapPoint)});
				if(!layerIdsFound)
					findLayerIds(p2,p1,chCount,crCount);
				else reqWhenAble(p1,p2,chCount,crCount);
			},

			addFirstPoint=function(point){
				var chCount=chartCount,crCount=crossCount;
				chartCount++;
				crossCount++;
				layerIdsFound=0;
				graphics[crCount]=graphics[crCount]===undefined?[]:graphics[crCount];
				findLayerIds(point,null,chCount,crCount);
				addSymbol(point,pSy,graphics[crCount]);
				tls=addSymbol(null,lSy,graphics[crCount]);
				inD.disconnect(self.handlers[1]);
				self.handlers[1]=null;
				self.handlers[2]=inD.connect(inMap,"onMouseMove",function(e){moveLine(point,e.mapPoint)});
				self.handlers[3]=inD.connect(inMap,"onMouseUp",function(e){
					if(e.pageX<mouseDownX+10&&e.pageX>mouseDownX-10&&e.pageY<mouseDownY+10&&e.pageY>mouseDownY-10)
						addSecondPoint(point,e.mapPoint,chCount,crCount);
				});
			},
			findLayerIds=function(mapPoint,point1ForReq,chCount,crCount){
				runIT(mapPoint,true).then(function(v){ //v is an array with an layerIds and one of values
						if(v[0].length){
							offsetStep=v[0].length-1;
							layerIdsFound=1;
							v[2].layerIds=v[0];
							chartId=outlines.graphics[v[0][0]].attributes.Project;
							if(point1ForReq) reqWhenAble(point1ForReq,mapPoint,chCount,crCount);
					    }else{
					    	if(!point1ForReq){
								graphics[crCount][0].setSymbol(graySy);
								graphics[crCount][1].setSymbol(graylSy);
							}else{
								graphics[crCount][2].setSymbol(graySy);
							}
						}
				});					
			},
			execNextReq=function(rq){
					var next=rq.shift();
					rendGr(pSy,next.p1,next.p2,next.chCount,next.crCount);
			},
			createChart=function(xmax,ymin,chartCount){
				gOffset+=4; //gOffset gets parent of current graph points, offset to skip axes, labels
				charDivs[charDivs.length]=dCon.create("div", {height:"350px"}, containerNode);
				var chart = new Chrt(charDivs[charDivs.length-1]);
				chart.addPlot("default", {type: chLin});
				chart.addAxis("x",{min:-1,max:Math.ceil(xmax),title:"(ft)",titleGap:8,titleOrientation:"away"});
				chart.addAxis("y", {vertical: true,min:ymin,max:5,title:"(ft)",titleGap:8});
			    chart.title="Profile "+chartCount+": "+chartId;
			    chart.titleFont="italic bold normal 24px Harabara";
			    chart.titleFontColor="#99ceff"
			    chThem.setMarkers({ CIRCLE:        "m-3,0 c0,-5 7,-5 7,0 m-7,0 c0,5 7,5 7,0",
									SQUARE:        "m-3,-3 l0,7 7,0 0,-7 z",
									DIAMOND:    "m0,-3 l3,3 -3,3 -3,-3 z",
									CROSS:        "m0,-3 l0,7 m-3,-3 l7,0",
									X:        "m-3,-3 l7,7 m0,-7 l-7,7",
									TRIANGLE:    "m-3,3 l3,-7 3,7 z",
									TRIANGLE_INVERTED:"m-3,-3 l3,7 3,-7 z"}); 
			    chart.setTheme(chThem);
			    chart.render();
			    charts[charts.length]=chart;
			    containerNode.scrollTop=containerNode.scrollHeight;
			    return chart;
			},
			rendGr=function(sy,p1,p2,chartCount,crossCount){ 
				var M=Math,
					p1x=p1.x, //in web mercator meters
					p1y=p1.y,
					dx=p1x-p2.x,
					dy=p1y-p2.y,
					xng,
					yng,
					ang=M.atan(dy/dx),
					fromWmm=0.3048*1.272,// 0.3048 meters in a foot 1.272 WM meters for normal meters at this latitude
					ftlen=M.sqrt(dx*dx+dy*dy)/fromWmm,        //increase distance between points starting
					maxPointsCorrection=M.ceil(ftlen/600)*3,  //at 600 in multiples of 3ft
					pointsInProfile=M.ceil(ftlen/maxPointsCorrection),
					chart,
					chartMin=-30,
					exLink,
					dlString="x,y,z\r\n",
					dlFileName=chartId+'_Profile'+chartCount+'_'+'WebMercator.txt',
					deferredCount=0,
					resultCount=0,
					chartArr=chartArray,
					ii=0,
					requestStep=15,
					curP=new inEG.Point(p1.x,p1.y,sR),
					addSymb=addSymbol,
					makeReq;
				freeToReq=0;
				addTextSymbol(chartCount,p1,10*M.cos(0.87+ang),10*M.sin(0.87+ang),graphics[crossCount]);
				chartArr.length=0;
				if(dx<0){
					xng=maxPointsCorrection*fromWmm*M.cos(ang);
					yng=maxPointsCorrection*fromWmm*M.sin(ang);
				}else if(dx>0){
					xng=-maxPointsCorrection*fromWmm*M.cos(ang);
					yng=-maxPointsCorrection*fromWmm*M.sin(ang);
				}else{
					yng=-maxPointsCorrection*fromWmm*M.sin(ang);
					xng=0;
				}
				chart=createChart(ftlen,chartMin,chartCount);

				exLink=DOC.createElement("a");
			    exLink.textContent="Export";
			    exLink.download=dlFileName;
			    if(ie9)exLink.style.color="#FF0000";
			    containerNode.appendChild(exLink);

			    makeReq=function(start,end){
			    var gfx=graphics[crossCount],sy=pSy;
				for(;start<end;start++){
					var def=runIT(curP);
					deferredCount++;
					def.then(function(v){ //returning geometry to put in proper order on the graph
						if(v[0]){
						var i=0,j=v.length,symCreated,
							inPoi=v[0].feature.geometry,
							xdiff=p1x-inPoi.x,
							lengthForChart=xng?M.abs(M.round(xdiff/xng)):M.abs(M.round((p1y-inPoi.y)/yng));
						//build chartArr from result data
						if(!chartArr[j-1])for(;ii<j;ii++)chartArr[ii]=[]; //build array if not built
						for (;i<j;i++){ //logic for multiple layers
							if(v[i].value!=="NoData"){ //for each layer add the corrected x value and 
								dlString+=M.round(inPoi.x*10)/10+","+M.round(inPoi.y*10)/10+','+M.round(v[i].value*10)/10+"\r\n";
								chartArr[i].push({x:lengthForChart*maxPointsCorrection, //depth to 
												  y:M.round(v[i].value*10)/10});       //tenths place
								if(v[i].value<chartMin)chartMin=(v[i].value-10)>>0; //adjust chart height
								if(!symCreated)symCreated=!!W.requestAnimationFrame(function(){addSymb(inPoi,sy,gfx)});//add once (for multiple)
							}										
						}

						resultCount++;
						if(chartArr[0].length>0){
							i=0;
						    if(resultCount>requestStep){ //add data from chartArr structure to chart
								for(;i<j;i++)chart.addSeries(i,chartArr[i]);
		    					chart.addAxis("y", {vertical:true,min:chartMin,max:5,title:"(ft)",titleGap:8});
						    	W.requestAnimationFrame(function(){chart.render()});
						    	requestStep+=15;
					    	} 
						}
					}else resultCount++;
					if(deferredCount===resultCount&&chartArr[0].length>0){
				    	for(;i<j;i++)chart.addSeries(i, chartArr[i]);
				    	chart.addAxis("y", {vertical:true,min:chartMin,max:5,title:"(ft)",titleGap:8});
    					new Ttip(chart, "default"); //edits in the module for positioning/height tooltip.js
    					new Mag(chart, "default");
    					if(W.Blob){
    						if(W.navigator.msSaveBlob){
    							exLink.onclick=function(){
    								W.navigator.msSaveBlob(new W.Blob([dlString]),dlFileName)};
    						}else
    							exLink.href=W.URL.createObjectURL(new W.Blob([dlString]));
    					}else{
    						exLink.onclick=function(e){
    							var noEx=dCon.create("div",{class:"ie9noexport"},exLink);
    							noEx.textContent="Exporting is only supported in modern browsers."
    							W.setTimeout(function(){exLink.removeChild(noEx)},1500);
    						}
    					}
				    	chart.render();
				    	addSwellHandlers(graphics[crossCount],gOffset,hovSy);
				    	chartArr.length=0;
				    	if(reqQueue.length)
				    		execNextReq(reqQueue);
				    	else freeToReq=1;
				    }
					});
					curP.x+=xng;
					curP.y+=yng;
					}
				};
				(function sendReq(i){
						var nextCall=i+20;
						if (nextCall>=pointsInProfile){
							makeReq(i,pointsInProfile);
						}else{
							W.setTimeout(sendReq,150,nextCall)
							makeReq(i,nextCall);
						}
				})(0);
			},
			exportImage=function(){
				//var sv=document.getElementsByTagName('svg')[1]
				//sv.setAttribute("xlmns", "http://www.w3.org/1999/xhtml");
				//var serialized = new XMLSerializer().serializeToString(sv);
				//lin.href="data:application/octet-stream;base64," + btoa(serialized)
				//
			},
			addSwellHandlers=function(gfxArr,gOff,hovSy){
				var currNum,gTags=DOC.getElementsByTagName("g"),
				graphh=gTags[gOff],pathss,pathObj={};
				if(graphh){
					pathss=graphh.firstChild.childNodes;
					for(var i=1;i<pathss.length;i+=2){ //below is distance from left edge
						pathObj[pathss[i].getAttribute("path").slice(1,6)]=(i/2>>0)+gfxOffset;
					}
					graphHandlers.push(on(graphh,"mouseover",function(e){
			    		var et=e.target.getAttribute("path").slice(1,6);
			    		if(pathObj[et]!==undefined){
			    				currNum=pathObj[et];
			    		}
			    		if(currNum!==undefined) //used to be setSymbol ->hovSy ->pSy
			    			addSymbol(gfxArr[currNum].geometry,hovSy,gfxArr);
			    	}));
			    	graphHandlers.push(on(graphh,"mouseout",function(e){
			    		if(currNum!==undefined){ //there may be brittleness here. ie no hovered
			    			mapGfx.remove(gfxArr[gfxArr.length-1]);
			    			gfxArr.length=gfxArr.length-1;
			    		}
			    	}));
			    	graphList.unshift(arguments);
			    	gOffset+=offsetStep; //accomodate overlapping rasters
			    	offsetStep=0;
		    	}
		    },
			clearGraphHandlers=function(arr){
				for(var i=arr.length-1;i>=0;i--){
					arr[i].remove();
					arr[i]=null;
					arr.length=i;
				}
			},
			reattachGraph=function(gList){
				var len=gList.length,i=len-1,twolen=len*2;
				while(len<twolen){
					var curr=gList[i];
					addSwellHandlers.apply(null,curr);
					len++;
				}
				gList.length=i+1;
			},
			resizeCharts=function(charts,con){
				clearGraphHandlers(graphHandlers);
				var charDivNumb=con.childNodes.length,conStyle=con.style,
				mup=on(W,"mouseup",function(e){
					conStyle.visibility="hidden";
					for(var i=0;i<charDivNumb;i+=2){
						charts[i/2].resize();
					}
					conStyle.visibility="visible";
					reattachGraph(graphList);
					mup.remove();
				});
			};
		
		return{
			handlers:[],
			init:function(e){
				if(!identifyUp)
					initId();
				self=this;
				toolToggle(e,self);
				asp.after(container,"resize",function(e,dim){
					if(dim==="width"&&charts.length)
						resizeCharts(charts,containerNode);
					},true);
				on(cros,"mousedown",function(e){
						if(domcl.contains(cros,"clickable"))
							return toolToggle(e,self);
						else whyNoClick();
				});		

			},
			start:function(){
				container.show();
				containerNode=container.getContainer();
				this.revive();
			},
			idle:function(){
				for(var i=0;i<self.handlers.length;i++){
					inD.disconnect(self.handlers[i]);
				}
				self.handlers.length=0;		
				outlines.enableMouseEvents();
			},
			revive:function(){
				outlines.disableMouseEvents();
				self.handlers[0]=inD.connect(inMap, "onMouseDown", function(e){allowMM=1;mouseDownX=e.pageX;mouseDownY=e.pageY;});
				self.handlers[1]=inD.connect(inMap,"onMouseUp",function(e){
				if(e.pageX<mouseDownX+10&&e.pageX>mouseDownX-10&&e.pageY<mouseDownY+10&&e.pageY>mouseDownY-10)
					addFirstPoint(e.mapPoint)});
			},
			stop:function(){
				this.idle();
				gOffset=-1;
				chartCount=1;
				crossCount=0;
				clearGraphHandlers[graphHandlers];
				graphList.length=0;
				for(var i=0,j=charts.length;i<j;i++){
					charts[i].destroy();
					charts[i]=null;
					clearNode(charDivs[i])
				}
				charts.length=0;
				charDivs.length=0;
				reqQueue.length=0;
				chartArray.length=0;
				clearNode(containerNode);
				container.hide();
				for(var i=0,j=graphics.length;i<j;i++){  
					for(var ii=0;ii<graphics[i].length;ii++)
						mapGfx.remove(graphics[i][ii]);
					graphics[i].length=0;
				}
			}
		};
	};
	crossHandle=on(cros,"mousedown",function(e){
		if (domcl.contains(cros,"clickable")){
			crossHandle.remove();
			crossHandle=null;
			crossTool=crossTool(Popup=Popup());
			crossTool.init(e);
		}else
			whyNoClick();					
	});

	//rightPane=function(){
		toggleRightPane=function(e){
			if(paneIsShowing){//close button logic
				hidePane();
				if(typeof identTool==='object'&&identTool.isShowing())
					toolWipe(identTool,ident);
				clearAllStoredOIDs();
				geoSearch.prevArr.length=[];
			}else{
				irP.style.marginTop=0;
				clearNode(irP);
				irP.innerHTML=toggleRightPane.introText;
				showPane();
			}
			dlLink.style.display="none";
			mdLink.style.display="none";
		};

		toggleRightPane.introText="<p>The <strong>Delta Bathymetry Catalog</strong> houses the complete set of multibeam bathymetric data collected by the Bathymetry and Technical Support section of the California Department of Water Resources.</p> <p id='beta'><b>Note: </b>The Catalog is still in active development. Please report any bugs or usability issues to <a href='mailto:wyatt.pearsall@water.ca.gov?subject=Bathymetry Catalog Issue'>Wyatt Pearsall</a>.</p><p>Click on a feature in the map or table to bring up its <strong>description</strong>. Double-click to view the <strong>raster image</strong>.</p> <p><strong>Download</strong> data as text files from the descrption pane.</p> <p><strong>Measure</strong> distances, <strong>identify</strong> raster elevations, and draw <strong>profile graphs</strong> with the tools at the top-right.</p> <p>Change what displays by <strong>collection date</strong> with the slider at bottom-right. <strong>Sort</strong> by date and name with the table's column headers.</p> <p>See the <strong>help</strong> below for further information.</p>";


		function infoFunc(attributes){
			if(!attributes&&selectedGraphicsCount===0)
				toggleRightPane();
			else{
				if(ie9){
					var fxArgs={node:rpCon,duration:200,properties:{opacity:0},
								onEnd:function(){
									infoFunc.setHTML(attributes);
									fx.fadeIn({node:rpCon}).play();
									infoFunc.positionIdentPane();	
								}};
					if(paneIsShowing){
						fx.animateProperty(fxArgs).play();
					}else{
					infoFunc.setHTML(attributes);
					showPane();
				}
				}else{
					if(paneIsShowing){
						rpCon.style.opacity=0;
						WIN.setTimeout(function(){
							infoFunc.setHTML(attributes);
							rpCon.style.opacity=1;
							infoFunc.positionIdentPane();
						},225);
					}else{
						infoFunc.setHTML(attributes);
						showPane();
					}
				}
			}
		};
		infoFunc.positionIdentPane=function(){
			if (typeof identTool==='object'&&identTool.isShowing()){
				rpCon.scrollTop=0;
				var oHeightAndMarginTop=+irP.style.marginTop.slice(0,-2)+irP.offsetHeight;
				if(ie9){
					idCon.style.top=oHeightAndMarginTop+60+"px";
				}else{
					idCon.style["transform"]="translate3d(0px,"+oHeightAndMarginTop+"px,0)";
					idCon.style["-webkit-transform"]="translate3d(0px,"+oHeightAndMarginTop+"px,0)";
				}
		/*		if(rpCon.clientHeight>irP.offsetHeight){
					console.log("flashing")
					WIN.setTimeout(function(){
						idCon.style.display="none";
						idCon.style.display="block"},215);
				}*/

			};
		};
		infoFunc.WWays=function(attr){
						switch(attr.Project.slice(0,2)){
						   case "GL":
								return "Grant Line Canal";
							case "OR":
								return "Old River";
							case "DC":
								return "Doughty Cut";
						}
				};	
		infoFunc.setHTML=function(attr){
					if(!attr){
						if(selectedGraphicsCount===1){
							var oid=selectedGraphics[0];
							infoFunc.parseAttributes(outlines.graphics[oid-1].attributes);
							gridObject.scrollToRow(oid);
							markedGraphic=null;
						}else{
							dlLink.style.display="none";
							mdLink.style.display="none";
							irP.style.marginTop=rpCon.clientHeight/2-15+"px";
							irP.innerHTML="<h2>"+selectedGraphicsCount+" projects selected</h2>"
						}
					}else{
						if(attr&&attr.Project)
							infoFunc.parseAttributes(attr);	
					}
				};
				infoFunc.parseAttributes=function(attr){
					irP.style.marginTop="0";	
					irP.innerHTML="<h2>"+(attr.Project.length<6?"Soil Sed. "+attr.Project:attr.Project)+"</h2>"+
					"<span class='spirp'><strong>Collection Date: </strong>"+(new Date(attr.Date)).toUTCString().slice(4,16)+"</span>"+
					"<span class='spirp'><strong>Client: </strong>"+(attr.Client||"Groundwater Supply Assessment Section, DWR")+"</span>"+
					"<span class='spirp'><strong>Waterways Covered: </strong>"+(attr.Waterways||this.WWays(attr))+"</span>"+
					"<span class='spirp'><strong>Purpose: </strong>"+(attr.Purpose||"Data was collected to determine the sediment impacts of the agricultural barriers at Middle River, Grant Line Canal, and Old River near the Delta Mendota Canal. Measurements have been made since 1998 at nineteen stations. Multibeam/RTK bathymetry has been gathered since 2011. Four stations have monthly data, the rest are visited in the Fall and Spring.")+"</span>";
					dlLink.style.display="block";
					mdLink.style.display="block";
				};
		function showPane(){
			var i=0,j=movers.length;
			paneIsShowing=1;
			arro.style.backgroundPosition="-32px -16px";
			if(ie9){
				for(;i<j;i++){
				if(movers[i]===rP)
					fx.animateProperty({node:movers[i],duration:300,properties:{marginRight:0}}).play();
				else fx.animateProperty({node:movers[i],duration:300,properties:{marginRight:285}}).play();
				}
			}else{
				for(;i<j;i++)
					domcl.add(movers[i],"movd");
			}
		}

		function hidePane(){
			var i=0,j=movers.length;
			paneIsShowing=0;
			arro.style.backgroundPosition="-96px -16px";
			if(ie9){
				for(;i<j;i++){
				if(movers[i]===rP)
					fx.animateProperty({node:movers[i],duration:250,properties:{marginRight:-285}}).play();
				else fx.animateProperty({node:movers[i],duration:250,properties:{marginRight:0}}).play();
				}
			}else{
				for(;i<j;i++)
					domcl.remove(movers[i],"movd");
			}
		}

(function(){
	var helpText="<strong id='infoPaneTitle'>Help</strong><p>Zoom in and out with the <b>Zoom buttons</b> or the mousewheel. Shift and drag on the map to zoom to a selected area.</p><p>Go to the full extent of the data with the <b>Globe</b>.</p><p>Select map or satellite view with the <b>Basemap buttons</b>.</p><p>Browse through projects in the table. Sort the table with the column headers and collapse it with the <b>Slider</b>.</p><p>Turn on a raster by double-clicking it in the table or map, or checking its checkbox in the table.</p><ul>When a raster is displayed:<br/><li>With the <b>Identify</b> tool, click to display NAVD88 elevation at any point.</li><li>Draw a cross-section graph with the <b>Profile tool</b>. Click the start and end points of the line to generate a graph in a draggable window. Hover over points to display elevation.</li></ul><p>Use the <b>Measure tool</b> to calculate distance, area, or geographic location.</p><p>Project information and Identify results are displayed in the right pane. Toggle this pane with the <b>Arrow button</b>.</p><p>Use the <b>Time slider</b> to filter the display of features by date. Drag the start and end thumbs or click a year to only display data from that year.</p>",
		termText="<strong id='infoPaneTitle'>Terms of Use</strong><p>The data displayed in this application is for qualitative purposes only. Do not use the data as displayed in rigorous analyses. If downloading the data, familiarize yourself with the metadata before use. Not for use as a navigation aid. The data reflects measurements taken at specific time periods and the Department of Water Resources makes no claim as to the current state of these channels, nor to the accuracy of the data as displayed. Do not share or publish this data without including proper attribution.</p>",
		conText="<strong id='infoPaneTitle'>Contact</strong><p>For information on scheduling new bathymetric surveys, contact  <a href='mailto:shawn.mayr@water.ca.gov?subject=Bathymetric Survey'>Shawn Mayr</a>, (916) 376-9664.</p><p>For information on this application or the data contained herein, contact  <a href='mailto:wyatt.pearsall@water.ca.gov?subject=Bathymetry Catalog'>Wyatt Pearsall</a>, (916) 376-9643.</p>",
		infoPane=dom.byId("infopane"),foot=dom.byId("foot"),lastButt;

		function toggleHelpGlow(e){
			if(e.target.tagName==="B"){
   				var key=e.target.textContent.slice(0,3);
   				switch (key){
		   			case "Zoo":
		   				domcl.toggle(zSlid,"helpglow");
		   				break;
		   			case "Glo":
		   				domcl.toggle(fex,"helpglow");
		   				break;
		   			case "Bas":
		   				domcl.toggle(phys,"helpglow");
		   				domcl.toggle(imag,"helpglow");
		   				break;
		   			case "Sli":
		   				//domcl.toggle(lP,"helpglow");
		   				domcl.toggle(spl,"helpglow");
		   				break;
		   			case "Ide":
		   				domcl.toggle(ident,"helpglow");
		   				break;
		   			case "Pro":
		   				domcl.toggle(cros,"helpglow");
		   				break;
		   			case "Mea":
		   				domcl.toggle(mea,"helpglow");
		   				break;
		   			case "Arr":
		   				domcl.toggle(shoP,"helpglow");
		   				break;
		   			case "Tim":
		   				domcl.toggle(tsNode,"helpglow");
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

   		on(dlLink,"mouseover",function(e){  //remove spatial reference info from files
   			var pro=(irP.firstChild.textContent).split(" ").join(""),
   				dat=new Date(irP.firstChild.nextElementSibling.textContent.slice(-11)),
   				yea=dat.getFullYear(),
   				mo=dat.getMonth()+1,
   				dayy=dat.getDate();
   				mo=mo+'';
   				dayy=dayy+'';
   				mo=(mo.length===1?"0"+mo:mo);
   				dayy=(dayy.length===1?"0"+dayy:dayy);
   				dlLink.href="zips/"+pro+"_"+yea+"_"+mo+"_"+dayy+".zip";
   		});

   		on(foot, "mousedown", setHelp);


   		function setHelp(e){
   			if(lastButt)
   					domcl.remove(lastButt,"activeFoot");
   			else{
   				infoPaneOpen=1;
   				rpCon.style.borderBottom="3px dotted #99ceff";
   				if(ie9){
   					fx.animateProperty({node:infoPane,duration:200,properties:{height:242}}).play();
   					fx.animateProperty({node:rpCon,duration:200,properties:{height:rpCon.clientHeight-250}}).play();
   				}else{
   					infoPane.style.height="242px";
   					rpCon.style.height=rpCon.clientHeight-250+"px";
   				}
   			}

   			if(lastButt===e.target){
   				WIN.setTimeout(function(){
   					clearNode(infoPane);
   					infoPaneOpen=0;
   					rpCon.style.borderBottom="none";
   				},205);
   				if(ie9){
   					fx.animateProperty({node:infoPane,duration:200,properties:{height:0}}).play();
   					fx.animateProperty({node:rpCon,duration:200,properties:{height:rpCon.clientHeight+250}}).play();
   				}else{
   					infoPane.style.height=0;
   					rpCon.style.height=rpCon.clientHeight+250+"px";
   				}
   				lastButt=null;
   				return;
   			}
   			lastButt=e.target;
   			var whichButt=lastButt.innerHTML.slice(0,1);
   			whichButt==="H"?infoPane.innerHTML=helpText:whichButt==="T"?infoPane.innerHTML=termText:infoPane.innerHTML=conText;
   			domcl.add(lastButt,"activeFoot");
   		}
		})();

		legend=function(){
			var leg=dom.byId("legend");

		function showLegend(){
			if(ie9){
				fx.animateProperty({node:leg,duration:200,properties:{right:30}}).play();
			}else
			domcl.replace(leg,"movd","legend")
		}
		function hideLegend(){
			if(ie9){
				fx.animateProperty({node:leg,duration:200,properties:{right:-255}}).play();
			}else
			domcl.replace(leg,"legend","movd");
		}
		return{
			node:leg,
			show:showLegend,
			hide:hideLegend
		}
	}();

		on(fex,"mousedown",function(e){                  //go to initial extent
			MAP.setExtent(inExt);
		});


		on(bmaps,"mousedown",function(e){                            //basemap handling
			var et=e.target,typ=et.innerHTML;
			if(typ=="Satellite"&&!imageIsOn){
				enableImagery();
				if(!zoomEnd)
				zoomEnd=DJ.connect(MAP,"onZoomEnd",adjustOnZoom);
			}else if(typ=="Map"&&!mapIsOn){
				enableMap();
				if(!zoomEnd)
				zoomEnd=DJ.connect(MAP,"onZoomEnd",adjustOnZoom);
			}
			else {
				DJ.disconnect(zoomEnd);
				zoomEnd=null;
				laOff();
			}
		});



		on(WIN, "resize",function(e){			//resize map on browser resize
			var winHeight=WIN.innerHeight,oHeightAndMarginTop;
			MAP.resize();
			grid.resize();
			if(+irP.style.marginTop.slice(0,1)) irP.style.marginTop=(winHeight-257)/2-15+"px";
			on.emit(dque(".dgrid-resize-handle")[0],'click',{bubbles:true});
			oHeightAndMarginTop=+irP.style.marginTop.slice(0,-2)+irP.offsetHeight;
			if(ie9){
				fx.animateProperty({node:rP,duration:300,properties:{height:winHeight-225}}).play();
				fx.animateProperty({node:idCon,duration:150,properties:{top:oHeightAndMarginTop+60}}).play();
				if(infoPaneOpen)
					fx.animateProperty({node:rpCon,duration:300,properties:{height:winHeight-506}}).play();
				else fx.animateProperty({node:rpCon,duration:300,properties:{height:winHeight-257}}).play();
			}else{
				rP.style.height=winHeight-225+"px";
				if(infoPaneOpen)
					rpCon.style.height=winHeight-507+"px";
				else rpCon.style.height=winHeight-257+"px";
				idCon.style["transform"]="translate3d(0px,"+oHeightAndMarginTop+"px,0)";
				idCon.style["-webkit-transform"]="translate3d(0px,"+oHeightAndMarginTop+"px,0)";
			}

		});
		function toolWipe(tool,node){
				tool.stop();
				if(domcl.contains(node,"idle")){
					domcl.remove(node,"idle");
					if(dque(".activeTool")[0])
						outlines.disableMouseEvents(); //because another tool is still alive
				}else if(domcl.contains(node,"activeTool"))
					domcl.remove(node,"activeTool");
		}
		function toolToggle(e,tool){
			var active=dque(".activeTool")[0],targ=e.target;
			if(targ===active){
				domcl.remove(targ,"activeTool");
				tool.stop();
				lastActive=null;
			}else{
				if(active){
					domcl.replace(active,"idle","activeTool"); //swap in idle
					lastActive.tool.idle();
				}
				if(domcl.contains(targ,"idle")){
					domcl.replace(targ,"activeTool","idle"); //activate
					tool.revive();
				}else{
					domcl.add(targ,"activeTool");
					tool.start();
				}
				lastActive={node:targ,tool:tool};
			}
		}//ToolToggle
		meaTool={
			init:function (e){           //start the measurement tool lazily when first clicked, less to load at once
				measur.style.display="block";
				var ismov,
					lSy=new eS.SimpleLineSymbol(sls,new DJ.Color([0,0,0]),2),
					pSy=new eS.SimpleMarkerSymbol({"size":6,"color":new DJ.Color([0,0,0])});
					mmt= new MT({
						 map:MAP, lineSymbol: lSy, pointSymbol: pSy},measur);
			        mmt.startup();
					measur=dom.byId("measur");
					domcl.add(measur,"atop selectable");
					selectableNodes=dque(".selectable");
					toolToggle(e,meaTool);
					allowMM=1;
					on(mea,"mousedown",function(e){toolToggle(e,meaTool)});
					asp.after(mmt,"setTool",function(tool,flag){
											if(flag!==false){
											currentMeaTool=tool;
											outlines.disableMouseEvents();
											if(domcl.contains(mea,"idle")){
												domcl.replace(mea,"activeTool","idle");
												meaTool.revive();
											}
										}
										},true);
			},
			start:function(){
					mmt.show();
			},
			idle:function(){
				outlines.enableMouseEvents();
				if(currentMeaTool)
					mmt.setTool(currentMeaTool,false);
			},
			revive:function(){
				if(currentMeaTool)
					mmt.setTool(currentMeaTool,true);
			},
			stop:function(){
				this.idle();
				mmt.clearResult();
				currentMeaTool=null;
				mmt.hide();
			}
		};
		O.once(mea,"mousedown",meaTool.init);

		function clearGraphics(arr){
			var mg=MAP.graphics;
			for(var i=0,j=arr.length;i<j;i++)
						mg.remove(arr[i]);
		}//meaTool

		identTool=function(){
			var lSy=new eS.SimpleLineSymbol(sls,new DJ.Color([180,180,180]),1),
				pSy=new eS.SimpleMarkerSymbol({"size":6,"color":new DJ.Color([0,0,0])}),
				graySy=new eS.SimpleMarkerSymbol({"size":6,"color":new DJ.Color([140,140,140]),"outline":lSy}),
				grayText,idCount=0,mouseDownX,mouseDownY,self;

			function addIdentGraphic(point){
				idCount++;
				addSymbol(point,pSy,self.graphics);
				grayText=addTextSymbol(idCount,point,12,12,self.labels);
			}
			function setNoData(){
				grayText.setColor(new DJ.Color([180,180,180]));
				resCon.innerHTML=resCon.innerHTML+idCount+".&nbsp;"+"No Data<br/>";
				self.graphics[self.graphics.length-1].setSymbol(graySy);
				self.labels[self.labels.length-1].setSymbol(grayText);
			}	
			function renderIdent(idArr,idCount){
				if(idArr){
					resCon.innerHTML=resCon.innerHTML+"<p></p>";
					if(idArr[0][0]){
					darr.forEach(idArr[0],function(v,i){
					if(idArr[1][i].value==="NoData")
						setNoData();
					else
						resCon.innerHTML=resCon.innerHTML+idCount+".&nbsp;"+outlines.graphics[v].attributes.Project+": "+Math.round(idArr[1][i].value*10)/10+ " ft<br/>";
					});
					}else{
						setNoData();
					}		
					rpCon.scrollTop=rpCon.scrollHeight;
				}
			}
			function clickCallback(point){
				addIdentGraphic(point);
				var identCount=idCount;
				runIT(point,true).then(function(idArr){
					renderIdent(idArr,identCount);
				});
			}

			return {
				handlers:[],
				graphics:[],
				labels:[],
				init:function(e){
					if(!identifyUp)
						initId();
					self=this;
					toolToggle(e,self);
					on(ident,"mousedown",function(e){
						if(domcl.contains(ident,"clickable"))
							return toolToggle(e,self);
						else whyNoClick();
					});		
				},							
				start:function(){
					this.revive();
					if(!paneIsShowing){
						clearNode(irP);
						showPane();
					}
					idCon.style.display="block";
					infoFunc.positionIdentPane();
				},
				idle:function(){
					outlines.enableMouseEvents();
					MAP.setMapCursor("default");
					DJ.disconnect(this.handlers[0]);
					DJ.disconnect(this.handlers[1]);
					identOff=1;
				},
				revive:function(){
					outlines.disableMouseEvents();
					MAP.setMapCursor("help");
					this.handlers[0]=DJ.connect(MAP, "onMouseDown", function(evt){mouseDownX=evt.pageX;mouseDownY=evt.pageY;});
					this.handlers[1]=DJ.connect(MAP,"onMouseUp",function(e){
					if(e.pageX<mouseDownX+10&&e.pageX>mouseDownX-10&&e.pageY<mouseDownY+10&&e.pageY>mouseDownY-10)
						clickCallback(e.mapPoint)});
					identOff=0;
				},
				stop:function(){
					this.idle();
					idCon.style.display="none";
					clearNode(resCon);
					clearGraphics(this.graphics);
					clearGraphics(this.labels);
					this.graphics=[];
					this.labels=[];
					idCount=0;
				},
				isShowing:function(){return dque(".activeTool")[0]===ident||dque(".idle")[0]===ident}
			};	
		};

		identHandle=on(ident,"mousedown",function(e){
			if(domcl.contains(ident,"clickable")){
				identHandle.remove();
				identHandle=null;
				identTool=identTool();
				identTool.init(e);
			}else
				whyNoClick();
		}); 
		on(shoP,"mousedown",toggleRightPane);//handle close button click

		DJ.connect(outlines, "onMouseOver", function(e) {//map mouseover handler
			function mmManager(e){
				DJ.disconnect(outlineMouseMove);
				if(justMousedDown)justMousedDown=false; //mousemove triggered by click
				else geoSearch(e,0);
				outlineTimeout=WIN.setTimeout(function(){
					outlineMouseMove=DJ.connect(outlines, "onMouseMove",mmManager);
				},100)
			}
			outlineMouseMove=DJ.connect(outlines, "onMouseMove",mmManager);    	
		});

		DJ.connect(outlines,"onMouseOut", function(e){		//map mouseout handler
				if(identOff)MAP.setMapCursor("default");
				WIN.clearTimeout(outlineTimeout);
				DJ.disconnect(outlineMouseMove);
				geoSearch({mapPoint:{x:0,y:0}},0);
		});

		DJ.connect(outlines, "onMouseDown", function(e){            //map click handler
			justMousedDown=true;
			var attributes=e.graphic.attributes,oid=attributes.OBJECTID;
			if(oid!==previousRecentTarget){//prevent click before double click
				WIN.clearTimeout(mouseDownTimeout);
				previousRecentTarget=oid;
				mouseDownTimeout=WIN.setTimeout(function(){previousRecentTarget=null;},400);
				geoSearch(e,1);
				gridObject.scrollToRow(oid);
			}
		});

		DJ.connect(outlines, "onDblClick", function(e){						//map dblclick handler
			var selected,
			oid=e.graphic.attributes.OBJECTID,
			reSearch=selectedGraphics.indexOf(oid)===-1; //might need to copy, not assign
			if(reSearch){
				geoSearch(e,1);
				gridObject.scrollToRow(oid);
			}
			selected=geoSearch.prevArr;
			if(selected.length){
				if(MAP.getScale()>73000)                          
					MAP.setExtent(oidToGraphic(selected[0])._extent.expand(1.3));
				gridObject.setVisibleRasters(selected,0);
				gridObject.checkImageInputs(selected);
			}
		});

		geoSearch.prevArr=[];
		geoSearch.currArr=[];
		geoSearch.binLength=geoBins.length;
		function geoSearch(e,mouseDown){//think about using two sorted arrays, one mins one maxs
			var i=0,j=geoSearch.binLength-1,curr,oid,temp,prevArr=geoSearch.prevArr,currArr=geoSearch.currArr,
			mapX=e.mapPoint.x,mapY=e.mapPoint.y,breakMax=mapX+1000,binArr,someTargeted=0;
			if(!mouseDown&&mapX!==0){
				for(;i<j;i++){
					if(mapX<geoBins[i+1])
						break;
				}
				binArr=splitGeoArr[i]||splitGeoArr[i-1];
				i=0;
			}else{
				binArr=geoArr;
			}
			j=binArr.length;
			for(;i<j;i++){
				curr=binArr[i];
				oid=curr.oid;
				if(curr.xmin>breakMax&&!mouseDown)
					break;
				if(!outsideTimeBoundary[oid]){
					if(curr.xmin<=mapX&&curr.xmax>=mapX&&curr.ymin<=mapY&&curr.ymax>=mapY){
						someTargeted=1;
						caCh(oid,"hi",0);
						if(identOff)MAP.setMapCursor("pointer");
						if(mouseDown){
							currArr.push(oid);
							if(!oidStore[oid])
								storeOID(oid);
						}	    	
					}else{										
						if(oidStore[oid]){
							if(mouseDown) clearStoredOID(oid,1,0);
							continue; //burned by return shortcircuit. Heh.
						}else{
							caCh(oid,"",0);
						}
					}
				}
			}
			if(mouseDown&&someTargeted){
				if(WIN.JSON.stringify(prevArr)===WIN.JSON.stringify(currArr)){
					clearAllStoredOIDs();
					geoSearch.prevArr.length=0;
					geoSearch.currArr.length=0;
				}else{
					temp=prevArr;
					geoSearch.prevArr=currArr;
					temp.length=0;
					geoSearch.currArr=temp;
				}
				infoFunc(null);
			}
			if(!someTargeted&&mouseDown&&prevArr){ //rehighlight true selections when clicking on
				for(var i=0;i<prevArr.length;i++){ // TS hidden stuff
					caCh(prevArr[i],"hi",0);
					if(!oidStore[prevArr[i]])
						storeOID(prevArr[i]);
				}
			}
		}

		function whyNoClick(){
			if(!whyNoClick.timeout){
				whyNoClick.zTimeout=function(){noClick.style.zIndex="-100"};
				whyNoClick.timeout=function(){
					noClick.style.opacity=0;
					whyNoClick.currTimeouts[1]=WIN.setTimeout(whyNoClick.zTimeout,105);
				};
				whyNoClick.ieTimeout=function(){fx.animateProperty({node:noClick,duration:150,properties:{opacity:0},
					onEnd:whyNoClick.zTimeout}).play()};
				whyNoClick.currTimeouts=[];
			}
			noClick.style.zIndex="400";
			WIN.clearTimeout(whyNoClick.currTimeouts[0]);
			if(ie9){
				fx.animateProperty({node:noClick,duration:75,properties:{opacity:1}}).play();
				whyNoClick.currTimeouts[0]=WIN.setTimeout(whyNoClick.ieTimeOut,2000);
			}else{
				WIN.clearTimeout(whyNoClick.currTimeouts[1]);
				noClick.style.opacity=1;
				whyNoClick.currTimeouts[0]=WIN.setTimeout(whyNoClick.timeout,2000);
			}
		}

		function redrawAllGraphics(graphics){      //apply highlighting logic to an array
				darr.forEach(graphics,function(v){
					var oid=v.attributes.OBJECTID;
					if(oidStore[oid])
						caCh(oid,"hi",1);
					else
						if(!outsideTimeBoundary[oid])
							caCh(oid,"",1);
				});
		}
		function doHighlight(oid,hi,refresh){
			var symbo=imageryLayer&&imageryLayer.visible?imSym:symbols,
			chk=fs.features[oid-1]?fs.features[oid-1].attributes.Date:null,
			graphic=oidToGraphic(oid),
			row=gridObject.oidToRow(oid);
					//2012:1325404800000 2011:1293868800000 2009:1230796800000
					// 2013: 1357027200000 2010:1262332800000
			if(graphic){
			if(chk>=1262304000000&&chk<1293840000000){
				graphic.setSymbol(symbo["gre"+hi]);
				if(!refresh){
					if (hi!=="")
						domcl.add(row,"highlgre");
					else
						domcl.remove(row,"highlgre");
				}
			
			}
			else if(chk>=1293840000000&&chk<1325376000000){
				graphic.setSymbol(symbo["mag"+hi]);
				if(!refresh){
					if (hi!=="")
						domcl.add(row,"highlmag");
					else
						domcl.remove(row,"highlmag");
				}
			
			}
			else if(chk>=1325376000000&&chk<1357027200000){
				graphic.setSymbol(symbo["blu"+hi]);
				if(!refresh){
					if (hi!=="")
						domcl.add(row,"highlblu");
					else						
						domcl.remove(row,"highlblu");
				}
			}
			else if(chk>=1357027200000&&chk<1388563200000){            
				graphic.setSymbol(symbo["red"+hi]);
				if(!refresh){
					if (hi!=="")
						domcl.add(row,"highlred");
					else
						domcl.remove(row,"highlred");
				}
			}
			}
		}

		function caCh(oid,hi,refresh){ //main highlighting logic, separated by year with different basemap
			WIN.requestAnimationFrame(function(){doHighlight(oid,hi,refresh)});
		}

		function oidToGraphic(oid){
			return tiout.graphics[oid-1];
		}

		function getOIDFromGrid(e){ //returns the gets an ObjectID from an event either on the grid or map
			var etP=e.target.parentNode;
			if(etP.childNodes[2])
				return +etP.childNodes[2].innerHTML;
			else if(e.target.className=="dgrid-input")
				return +etP.parentNode.childNodes[2].innerHTML;
		}
		function getInputBox(oid){
			var box;
			if(IE) box=gridObject.oidToRow(oid).childNodes[0].childNodes[0].childNodes[3].childNodes[0];
			else box=gridObject.oidToRow(oid).childNodes[0].childNodes[3].childNodes[0];
			return box;
		}
		function isNumber(n) {
  			return !isNaN(parseFloat(n)) && isFinite(n);
		}

		function clearNode(node){
			while(node.hasChildNodes()){
				node.firstChild=null;
				node.removeChild(node.firstChild);
			}
		}
		function addSymbol(geom,sy,trackingArr){
			var sym=new E.Graphic(geom,sy);
				MAP.graphics.add(sym);
				trackingArr.push(sym);
				return sym;
		}
		function addTextSymbol(text,geom,x,y,trackingArr){
			var txtsym=new E.symbol.TextSymbol(text),gra;
			txtsym.setOffset(x,y);
			txtsym.setFont=addTextSymbol.font;
			gra=new E.Graphic(geom,txtsym);
			MAP.graphics.add(gra);
			trackingArr.push(gra);
			return txtsym;
		}
		addTextSymbol.font=new E.symbol.Font("14px","STYLE_NORMAL","VARIANT_NORMAL","WEIGHT_BOLDER");

		function checkRAF(W){
			if(!W.requestAnimationFrame)(function(W){var eaf='equestAnimationFrame',raf='r'+eaf,Raf='R'+eaf;W[raf]=W['webkit'+Raf]||W['moz'+Raf]||W[raf]||(function(callback){setTimeout(callback,16)})})(W);
		}

		function processId(tA,pA){
			var def=tA.execute(pA);
			return def.then(function(v){
				var output=processId.output,
					lids=processId.lids;
				output[0].length=0;
				output[1].length=0;
				output[2]=pA;
				lids.length=0;
				if(v.length>0){
					for (var i=0,j=v.length;i<j;i++){ //logic for multiple layers
						processId.lids[i]={lI:v[i].layerId,v:v[i]};//array of objects with OBJECTID and it's ident data
					}
					for(var oi=0,oj=checkTrack.length;oi<oj;oi++){
						if(checkTrack[oi]){
							for(var i=0,j=lids.length;i<j;i++){
								if(oi===lids[i].lI){
									processId.output[0].push(lids[i].lI);
									processId.output[1].push(lids[i].v);
								}
							}			
						}	
					}	
				}
				return output;
			});
		}
		processId.output=[[],[],null];
		processId.lids=[];
		function initId(e){ //id logic... cross section tool feeds here as well.. this gets set up lazily also
			require(["esri/tasks/identify"],function(ide){
				idT= new eT.IdentifyTask("http://mrsbmapp00642/ArcGIS/rest/services/BATH/Web_Rr/MapServer"),
				idP= new eT.IdentifyParameters();
				idP.layerOption=eT.IdentifyParameters.LAYER_OPTION_VISIBLE;
				idP.layerIds=layerArray;
				idP.tolerance=1;
				idP.returnGeometry=true;
				idP.mapExtent=MAP.extent;
				identifyUp=true;
				runIT=function(geom,query){
					idP.geometry=geom;
					if(query){
						idP.height = MAP.height;
						idP.width  = MAP.width;
						idP.layerIds=layerArray;
						return processId(idT,idP,geom);
					}
					return idT.execute(idP);
				};
			});
		}
	WIN.setTimeout(toggleRightPane,300);
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