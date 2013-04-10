require(["dijit/dijit","dijit/layout/BorderContainer","dijit/layout/ContentPane","dgrid/Grid","dojo/_base/fx","dojo/fx/easing",
		"dgrid/Keyboard", "dgrid/editor","dgrid/extensions/ColumnResizer","dojo/_base/declare","dojo/parser","dojo/dom-construct","dojo/dom","dojo/query",
		"dojo/dom-class","esri/layers/FeatureLayer","dojo/_base/array","esri/tasks/query","esri/tasks/geometry","dojox/charting/action2d/Magnify",
		"dojox/charting/Chart","dojox/charting/themes/PurpleRain","dojox/charting/axis2d/Default", "dojox/charting/plot2d/MarkersOnly","dojox/charting/action2d/Tooltip",
		"dojo/on","esri/dijit/TimeSlider","dojo/ready","esri/dijit/Scalebar","dojo/_base/lang","dojo/aspect","require","dojo/NodeList-fx"],
		function(dijit,BorderContainer,CP,Grid,fx,easing,Keyb,edi,ColRe,dec,parser,dCon,dom,dque,
				 domcl,FL,darr,qr,geom,Mag,Chrt,chThem,chAx,chLin,Ttip,O,tts,ready,sB,lang,asp,reqq){

	//esri.map,	esri.utils, alt infowin included compact

  var parsedd= parser.parse(); //parse widgets
   ready(function(){ //wait for the dom
   	var body=dom.byId("body");
   	body.style.visibility="visible"; //show the page on load.. no unstyle content
   	esri.config.defaults.io.corsDetection=false;
   	esri.config.defaults.io.corsEnabledServers.push("mrsbmapp00642");//enable cors for quicker queries
   	esri.config.defaults.geometryService = new esri.tasks.GeometryService("http://sampleserver3.arcgisonline.com/arcgis/rest/services/Geometry/GeometryServer");
   	var gdata=[], grid, E=esri,eL=E.layers,url ="http://mrsbmapp00642/ArcGIS/rest/services/BATH/s_out2/MapServer/0?f=json",
		eT=E.tasks,qt=new eT.QueryTask(url),qry= new eT.Query(),loadIt=dom.byId("loadingg"),dots=".",gridLoaded,
   		sr= new E.SpatialReference({wkid:102100}),
		inExt = new E.geometry.Extent(-13612000,4519000,-13405000,4662600,sr),
        map = new E.Map("mapDiv", {extent:inExt}),
        dynamicLayer = new eL.ArcGISDynamicMapServiceLayer("http://mrsbmapp00642/ArcGIS/rest/services/BATH/Web_Rr/MapServer"),
        layer0 =new eL.ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",{id:"l0"}),
     	layer1 = new eL.ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer",{id:"l1"}),
		l0on,l1on,liZ,liO,
		lload=dojo.connect(layer0,"onLoad",function(){
			map.addLayer(layer0);
			liZ=map.getLayer("l0");
			liZ.hide();
			if(!liZ)
				console.log("LIZ IS BROKEN");
			console.log("l0 on");
			l0on=true;
			dojo.disconnect(lload);
		}),
		l1load=dojo.connect(layer1,"onLoad",function(){
			map.addLayer(layer1);
			liO=map.getLayer("l1");
			if(!liO)
				console.log("LIO IS BROKEN");
			console.log("l1 on");
			l1on=true;
			dojo.disconnect(l1load);
		});
		dojo.connect(layer0,"onError",function(e){
			console.log("Rerequesting Imagery");
			layer1 = new eL.ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",{id:"l0"});
		});
		dojo.connect(layer1,"onError",function(e){
			console.log("Rerequesting Map");
			layer1 = new eL.ArcGISTiledMapServiceLayer("http://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer",{id:"l1"});
		});
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

	dojo.connect(qt,"onComplete",function(fs){ //declare most variables upfront for fewer vars/hoisting trouble
	var grStore=null, rowStore, erow, i=0, W=fs.features,j=W.length,idT,idP, mmt,eS=E.symbol,eD=E.dijit,on=O,runIT,ghd,mGrphs=[],graphHandlers=[],gOffset,identGfx=[],
	lph,cros=dom.byId("cros"),phsp=dom.byId("pohsplit"),popu=dom.byId("popu"),arro=dom.byId("arro"),poH=dom.byId("pohead"),cross,graphList=[],hovSy,pSy,lSy,
	pst=dom.byId("pst"),dockedx="",dockedy="",poS=dom.byId("posplit"),poCon=dom.byId("pocon"), DJ=dojo,poClo=dom.byId("poclo"),zSlid=dom.byId("mapDiv_zoom_slider"),
		dHan,stopCroClick,identOff=1,meC=null,lP=dom.byId("lP"),linArr,imHead,currentOID=null,MAP=map,noClick=dom.byId("noClick"),cHead,boxSave,dScroll,dlLink=dom.byId("dlLink"),
		rP=dom.byId("rP"),idCon=dom.byId("idCon"),grid,irP=dom.byId("irP"),ilP=dom.byId("ilP"),drP=dijit.byId("rP"),resCon=dom.byId("resCon"), checkTrack=[],
		measur=dom.byId("measur"),mea=dom.byId("mea"),ident=dom.byId("ident"),zoomEnd,grCon,croClick,lPar,tsNode,timeDiv=dom.byId('timeDiv'),paneIsShowing=0,
		BC=dijit.byId("mainWindow"),bmaps=dom.byId("bmaps"),shoP=dom.byId("shoP"),outlines,spl=dom.byId("lP_splitter"),clSh,idCount=0,mdLink=dom.byId("mdLink"),currentMeaTool,
		fex=dom.byId("fex"),imOn=0,maOn=1,zFun,imON,maON,laOff,phys=dom.byId("phys"),imag=dom.byId("imag"),lC,cGr,daGrid,sLev=8,geoSer,crossTool={},identTool={},meaTool={},
		movers=dque(".mov"),tiout,esav,firstHan,rpCon=dom.byId("rpCon"),tiload,outBounds=[],crossOpen=0,reqqing=0,croMove,crossHandler,runIdent,runMea,lastActiveNode,lastActiveTool,
		helpBod=dom.byId("helpbod"),helpPane=dom.byId("helppane"),helpHead=dom.byId("helphead"),foot=dom.byId("foot"),currButt,helpClo=dom.byId("helpclo"),
		cTex="padding:5px 4px 3px 4px;color:#111;box-shadow: inset 0 1px 2px 0 #857ca5;background-image:-webkit-linear-gradient(top,#a0bce5,#f0f5fd);background-image:-moz-linear-gradient(top,#a0bce5,#f0f5fd);",
		helpText="<p>Zoom in and out with the <b>Zoom buttons</b> or the mousewheel. Shift and drag on the map to zoom to a selected area.</p><p>Go to the full extent of the data with the <b>Globe</b>.</p><p>Select map or satellite view with the <b>Basemap buttons</b>.</p><p>Browse through projects in the table. Sort the table with the column headers and collapse it with the <b>Slider</b>.</p><p>Turn on a raster by double-clicking it in the table or map, or checking its checkbox in the table.</p><ul>When a raster is displayed:<br/><li>With the <b>Identify</b> tool, click to display NAVD88 elevation at any point.</li><li>Draw a cross-section graph with the <b>Profile tool</b>. Click the start and end points of the line to generate a graph in a draggable window. Hover over points to display elevation.</li></ul><p>Use the <b>Measure tool</b> to calculate distance, area, or geographic location.</p><p>Project information and Identify results are displayed in the right pane. Toggle this pane with the <b>Arrow button</b>.</p><p>Use the <b>Time slider</b> to filter the display of features by date. Drag the start and end thumbs or click a year to only display data from that year.</p>",
		termText="<p>The data displayed in this application is for qualitative purposes only. Do not use the data as displayed in rigorous analyses. If downloading the data, familiarize yourself with the metadata before use. Not for use as a navigation aid. The data reflects measurements taken at specific time periods and the Department of Water Resources makes no claim as to the current state of these channels, nor to the accuracy of the data as displayed. Do not share or publish this data without including proper attribution.</p>",
		conText="<p>For information on scheduling new bathymetric surveys, contact  <a href='mailto:shawn.mayr@water.ca.gov?subject=Bathymetric Survey'>Shawn Mayr</a>, (916) 376-9664.</p><p>For information on this application or the data contained herein, contact  <a href='mailto:wyatt.pearsall@water.ca.gov?subject=Bathymetry Catalog'>Wyatt Pearsall</a>, (916) 376-9643.</p>",
		infoFunc=function(e){
				function setHTML(e){
				function wWays(e){
						switch(e.Project.slice(0,2)){
						   case "GL":
								return "Grant Line Canal";
							case "OR":
								return "Old River";
							case "DC":
								return "Doughty Cut";
						}
				}		
					if(e&&e.Project){
						irP.innerHTML="<h2>"+(e.Project.length<6?"Soil Sed. "+e.Project:e.Project)+"</h2>"+
						"<span class='spirp'><strong>Collection Date: </strong>"+(new Date(e.Date)).toUTCString().slice(4,16)+"</span>"+
						"<span class='spirp'><strong>Client: </strong>"+(e.Client||"Groundwater Supply Assessment Section, DWR")+"</span>"+
						"<span class='spirp'><strong>Waterways Covered: </strong>"+(e.Waterways||wWays(e))+"</span>"+
						"<span class='spirp'><strong>Purpose: </strong>"+(e.Purpose||"Data was collected to determine the sediment impacts of the agricultural barriers at Middle River, Grant Line Canal, and Old River near the Delta Mendota Canal. Measurements have been made since 1998 at nineteen stations. Multibeam/RTK bathymetry has been gathered since 2011. Four stations have monthly data, the rest are visited in the Fall and Spring.")+"</span>";
						dlLink.style.display="block";
						mdLink.style.display="block";
					}
				}
			var fxArgs={node:irP,duration:200,properties:{opacity:0},
			onEnd:function(){
				setHTML(e);
				fx.fadeIn({node:irP}).play();	
			}};
			if(paneIsShowing){
				fx.animateProperty(fxArgs).play();
			}else{
				setHTML(e);
				showPane();
		}
		};
		var feaColl={layerDefinition:layDef,featureSet:fs};
		for(;i<j;i++){
			var intData={},gpr=W[i].attributes;
			intData["__Date"]=gpr["Date"];	
			var dte=new Date(gpr["Date"]),
			dst=dte.toUTCString();
			dst=dst.charAt(6)===" "?dst.substring(0,5)+"0"+dst.substring(5):dst; //ieFix
			intData["Date"]=dst.slice(12,16)+"-"+((1+dte.getUTCMonth())<10?"0"+(1+dte.getUTCMonth()):(1+dte.getUTCMonth()))+"-"+dst.slice(5,7);
			intData["Project"]=(gpr["Project"].length<6?"Soil Sed. "+gpr.Project:gpr.Project);
			intData["OBJECTID"]=gpr["OBJECTID"];
			gdata.push(intData);
		}
		var adGr= dec([Grid,Keyb,ColRe]);
		grid= new adGr({
			columns:{
				Project:{label:"Project"},
				Date:{label:"Date"},
				OBJECTID:{label:"OBJECTID"},
				Editor:edi({field: "Image",sortable:false}, "checkbox"),
				__Date:{label:"_Date"}
			},cellNavigation:0
		},"ilP");
		gridLoaded=1;
		grid.renderArray(gdata); //create grid
		lC=copColl(grid);
		scal= new sB({map:MAP});
		console.log("query completes");
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

		outlines = new FL(feaColl, {
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

  		tiload=dojo.connect(tiout,"onLoad",function(){
     		tiout.setRenderer(new E.renderer.SimpleRenderer(blank));
     		outlines.setRenderer(new E.renderer.SimpleRenderer(blank));
     		function addLays(){
     			if(l0on||l1on){
					MAP.addLayer(tiout);
					MAP.addLayer(outlines);
					console.log("ti on");
					dojo.disconnect(tiload);
				}else{
				window.setTimeout(addLays,50);
				}
			}
			addLays();
		});
    	rpCon.style.cssText="width:100%;height:"+(rP.scrollHeight-60)+"px;";
    	helpPane.style.opacity=0;

   	DJ.connect(tiout,"onUpdateEnd",function(e,f,g,h){ //called on every zoom (due to refresh). allows feature updating
   		creCov(tiout.graphics);							//setup an onupdatestart that sets the visibility to false to avoid _surface typeerrors if they come
    	});

		lph=dom.byId("lP-header");
		cHead=dom.byId("ilP-header");
		ghd=dque("th",lph);
		ghd[0].title="Sort by Name";
		ghd[1].title="Sort by Date";             //do some style adjustments/variable creation
		ghd[3].title="Turn images on or off";
		O.emit(ghd[1],"click",{bubbles:true});
		O.emit(ghd[1],"click",{bubbles:true});
		lHead=dque(".dgrid-header")[0];
		grCon=dque(".dgrid-content")[0];
		dScroll=dque(".dgrid-scroller")[0];
		popu.style.top="50px";
		popu.style.left="50px";
		popu.style.width="600px";
		popu.style.height="400px";
		imHead=dque(".dgrid-resize-header-container",lph)[3];

		var tCount, timeSlider, sliderDiv, timeExtent = new E.TimeExtent();
		timeExtent.startTime = new Date("01/01/2010 UTC");
		timeExtent.endTime = new Date("12/31/2013 UTC");
		MAP.setTimeExtent(timeExtent);
		sliderDiv = DJ.create("div", null, timeDiv);
		timeSlider = new tts({                                            //create TimeSlider
			style:"width:300px;",
			id: "timeSlider",
			intermediateChanges: true},
			sliderDiv);
		timeSlider.setThumbCount(2);
		timeSlider.createTimeStopsByTimeInterval(timeExtent, 2, "esriTimeUnitsMonths");
		timeSlider.setLabels([2010,2011,2012,2013,"All"]);
		tCount = timeSlider.timeStops.length;
		timeSlider.setThumbIndexes([0,tCount]);
		timeSlider.setTickCount(Math.ceil(tCount/2));
		timeSlider.startup();
		MAP.setTimeSlider(timeSlider);
		tsNode=dom.byId("timeSlider");
		linArr=dque(".dijitRuleLabelH",tsNode);
		function setLinkColor(){
			if(imOn){
				linArr[0].style.cssText="text-shadow:0 0 1px rgb(24,211,48);color:rgb(24,211,48);";
				linArr[3].style.cssText="text-shadow:0 0 1px rgb(243,63,51);color:rgb(243,63,51);";
				linArr[2].style.cssText="text-shadow:0 0 1px rgb(119,173,255);color:rgb(119,173,255);";
				linArr[1].style.cssText="text-shadow:0 0 1px rgb(252,109,224);color:rgb(252,109,224);";
			}else{
				linArr[3].style.cssText="text-shadow:0 0 1px rgb(255,0,0);color:rgb(255,0,0);";
				linArr[0].style.cssText="text-shadow:0 0 1px rgb(18,160,0);color:rgb(18,160,0);";
				linArr[1].style.cssText="text-shadow:0 0 1px rgb(221,4,178);color:rgb(221,4,178);";
				linArr[2].style.cssText="text-shadow:0 0 1px rgb(50,84,255);color:rgb(50,84,255);";
			}
		}
		setLinkColor();
		linArr[linArr.length-1].style.cssText="text-shadow:0 0 1px #fff;color:rgb(0,0,0);";
		phys.style.cssText=cTex;


			cross=function(evt){						//cross section function!
				if (domcl.contains(cros,"clickable")){ //if a raster is showing
				if(!idT)                               //create the idtask if needed
					initId();

				var inMap=MAP,inE=E, inD=dojo,inEG=inE.geometry,croClo,unGraph,W=window,ang,chartId,posMd,currentHandlers=[],charts=[];
				
				
				function unAttach(){
					for(var i=0,j=mGrphs.length;i<j;i++){    //wipe any cross gfx/lbls    //functions that connect/disconnect
						inMap.graphics.remove(mGrphs[i]);
					}
					charts.forEach(function(v){v.destroy();});
					clearNode(poCon);
					popu.style.zIndex=-100;
					popu.style.opacity=0;
				}
				function crossWipe(e){
					unAttach();
					inD.disconnect(croClick);
					inD.disconnect(croMove);
					if(posMd)
						posMd.remove();
					if(croClo){
						croClo.remove();
						unGraph.remove();
					}
					outlines.enableMouseEvents();
					crossHandler.resume(); 
				}
				crossTool.idle=unAttach;
				crossTool.stop=crossWipe;
				crossTool.revive=function(){
					for(var i=0,len=currentHandlers.length;i<len;i++){
						DJ.connect(inMap,currentHandlers[i].type,currentHandlers[i].func);
					}
				}

				mGrphs=[];
				popu.style.zIndex=200;
				popu.style.opacity=1;
		
				inMap.setMapCursor("default");
				outlines.disableMouseEvents();

					lSy=new eS.SimpleLineSymbol(sls,new inD.Color([0,0,0]),2);
					pSy=new eS.SimpleMarkerSymbol(eS.SimpleMarkerSymbol.STYLE_CIRCLE,5,lSy,new inD.Color([0,0,0]));
					hovSy=new eS.SimpleMarkerSymbol(eS.SimpleMarkerSymbol.STYLE_CIRCLE,15,lSy,new inD.Color([0,0,0]));
					gOffset=3;
					var p1,p2,croMov,croInClick,chCo=0,gfxArr=inMap.graphics.graphics,gfxOffset=gfxArr.length+4,
					crosscount=1,tls,updateReady=1,sR=inMap.spatialReference,tlin,
					update= function(e){
							tlin=new inEG.Polyline(sR)
							tlin.addPath([p1, e.mapPoint]);
							tls.setGeometry(tlin);
							updateReady=0;
							window.setTimeout(function(){//limit requests to framerate
								updateReady=1;
								},16);
					},
					inMov=function(e){
						if(updateReady){
							console.log("reqqing")
								update(e);	}
					},
					inClick=function(evt){
						update(evt);
						addSymbol(pSy,evt.mapPoint,mGrphs);
						p2=evt.mapPoint;
						console.log(p2);
						inD.disconnect(croMove);
						inD.disconnect(croInClick);
						croClick=inD.connect(inMap,"onMouseDown",conFun);
						findLayerIds();
					},
					conFun=function(e){
							console.log("fired");
							gfxOffset=gfxArr.length+4;
							p1=e.mapPoint;
							addSymbol(pSy,p1,mGrphs);
							tls=addSymbol(lSy,null,mGrphs);
							croMove=inD.connect(inMap,"onMouseMove",inMov);
							if(!currentHandlers[1])
								currentHandlers[1]={type:"onMouseMove",func:inMov};
							inD.disconnect(croClick);
							croInClick=inD.connect(inMap,"onMouseDown",inClick);
							if(!currentHandlers[2])
								currentHandlers[2]={type:"onMouseDown",func:inClick};
					},
			//		do below on first click
					findLayerIds=function(e){
						var sR=inMap.spatialReference,curP= new inEG.Point(p1.x,p1.y,sR),lids=[],
						lDef=runIT(curP,true);
						lDef.then(function(v){
						if(v){
							chartId=outlines.graphics[v[0]].attributes.Project;
							croClo.pause();
							unGraph.pause();
							rendGr(pSy);
						}else{
							for(var i=mGrphs.length-1,j=mGrphs.length-4;i>j;i--){
								inMap.graphics.remove(mGrphs[i]);
								mGrphs.pop();
							}

							
						}
						});
					}
					rendGr=function(sy){                					// 0.3048 meters in a foot 1.272 WM meters for normal meters at this latitude
						var p1x=p1.x,p1y=p1.y,dx=p1x-p2.x,dy=p1y-p2.y,M=Math,wmm=0.3048*1.272,len=M.sqrt(dx*dx+dy*dy),ftlen=len/wmm,rateLimitCorrection=Math.ceil(ftlen/600)*3,ftlCorr=Math.ceil(ftlen/rateLimitCorrection),
						sym,defCo=0,resCo=0,rCou=15,char,graphMin=-30,sR=inMap.spatialReference,
						grArr=[],ii=0,curP= new inEG.Point(p1x,p1y,sR),makeReq,xng,yng,
						charDiv=DJ.create("div", null, poCon);
						console.log(rateLimitCorrection);
						ang=M.atan(dy/dx);
						if(dx<0){
							xng=rateLimitCorrection*wmm*M.cos(ang);
							yng=rateLimitCorrection*wmm*M.sin(ang);
						}else if(dx>0){
							xng=-rateLimitCorrection*wmm*M.cos(ang);
							yng=-rateLimitCorrection*wmm*M.sin(ang);
						}else{
							yng=-rateLimitCorrection*wmm*M.sin(ang);
							xng=0;
						}
						char = new Chrt(charDiv);
						char.addPlot("default", {type: chLin});
						char.addAxis("x",{min:-1,max:M.ceil(ftlen),title:"(ft)",titleGap:8,titleOrientation:"away"});
						char.addAxis("y", {vertical: true,min:graphMin,max:5,title:"(ft)",titleGap:8});
					    char.title="Profile "+crosscount+++": "+chartId;
					    char.titleFont="normal normal normal 16pt SSP";
					    chThem.setMarkers({ CIRCLE:        "m-4,0 c0,-6 9,-6 9,0 m-9,0 c0,6 9,6 9,0",
											SQUARE:        "m-4,-4 l0,9 9,0 0,-9 z",
											DIAMOND:    "m0,-4 l4,4 -4,4 -4,-4 z",
											CROSS:        "m0,-4 l0,9 m-4,-4 l9,0",
											X:        "m-4,-4 l9,9 m0,-9 l-9,9",
											TRIANGLE:    "m-4,4 l4,-9 4,9 z",
											TRIANGLE_INVERTED:"m-4,-4 l4,9 4,-9 z"}); 
					    char.setTheme(chThem);
					    char.render();
					    poCon.scrollTop=poCon.scrollHeight;
					    charts[charts.length]=char; 
					    makeReq=function(st,en){
						for(var i=st;i<en;i++){
							var def=runIT(curP);
							defCo++;
							def.then(function(v){ //returning geometry to put in proper order on the graph.. need to pass something to the deferred to get the xy points
								var inPoi=v[0].feature.geometry,
									xdiff=p1x-inPoi.x,ind;
									ind=xng?M.abs(M.round(xdiff/xng)):M.abs(M.round((p1y-inPoi.y)/yng))
								var k=0,j=v.length;
								if(!grArr[j-1]){
									for(;ii<j;ii++){//build array if not around
										grArr[ii]=[];
									}
								}
								for (;k<j;k++){ //logic for multiple layers
									if(v[k].value!=="NoData"){
										grArr[k].push({y:M.round(v[k].value*10)/10,x:ind*rateLimitCorrection});
										if(v[k].value<graphMin){
											graphMin=(v[k].value-10)>>0;
										}
									}										
								}
								resCo++; //rescount bug fixed by findlayerids&geometry fix
								if(v[0].value!=="NoData")
									createSymbol(inPoi);
								if(grArr[0].length>0){
									var i=0,j=grArr.length;
								    if(resCo>rCou){
										for(;i<j;i++){
											char.addSeries(i, grArr[i]);
				    					}
				    					char.addAxis("y", {vertical:true,min:graphMin,max:5,title:"(ft)",titleGap:8});
								    	char.render();
								    	rCou+=15;
							    	}
								    if(defCo==resCo){
								    	console.log(currentHandlers);
								    	poCon.scrollTop=poCon.scrollHeight;
								    	for(;i<j;i++){
				    						char.addSeries(i, grArr[i]);
				    					}
				    					var tip = new Ttip(char, "default"); //edits in the module for positioning/height tooltip.js
				    					var mag = new Mag(char, "default");
								    	char.render();
								    	console.log(char);
								    	addSwellHandlers(gOffset,gfxOffset,gfxArr,hovSy,pSy);
								    	croClo.resume();
								    	unGraph.resume();
								    }
								}
							});
							curP.x+=xng;
							curP.y+=yng;
						}
					}
					//git is amazing

					function createSymbol(poi){
						sym=new inE.Graphic();
							sym.setSymbol(sy);
							sym.setGeometry(new inEG.Point(poi.x,poi.y,sR));
							inMap.graphics.add(sym);
							mGrphs.push(sym);
					}
					var txtsym=new inE.symbol.TextSymbol(crosscount-1),//0.87 radians = ~50degrees
					sympoi=new inEG.Point(curP.x+10*M.cos(0.87+ang),curP.y+10*M.sin(0.87+ang),sR),
					gra=new E.Graphic(sympoi,txtsym);
					inMap.graphics.add(gra);
					mGrphs.push(gra);

					(function sendReq(){
					if(reqqing){					//prevent simultaneous requests
						W.setTimeout(sendReq,250);
					}else{
						reqqing=1;
						for(var wy=0;wy<ftlCorr;wy+=20){ //send out deferreds in groups of 20, every 100ms
							if (wy+20>=ftlCorr){
								W.setTimeout(makeReq,100,wy,ftlCorr)
								reqqing=0;
								continue;
							}
							W.setTimeout(makeReq,100,wy,wy+20)
						}
					}
					})();

					
					//,{plot: "default", stroke: {color:"blue"}, fill: "lightblue"});
					/*, styleFunc: function(item){
				 						  if(item.y < 10){
				    							  return { fontColor : "red" };
				   						 }else if(item.y > 60){
				    						  return { fill: "green" };
				    					}
				   						 return {};
				 						 }*/
			};
				posMd=O(poS,"mousedown",function(e){mdToSlide(poCon,charts,W)});
				crossHandler.pause();
				croClick=inD.connect(inMap,"onMouseDown",conFun);
				if(!currentHandlers[0])
					currentHandlers[0]={type:"onMouseDown",func:conFun};
				croClo=O.pausable(poClo,"click",crossWipe);
				unGraph=O.pausable(cros,"mousedown",crossWipe);
			}else{
				whyNoClick();
			}
		};
		crossTool.start=cross;
		crossHandler=O.pausable(cros,"mousedown",cross);


		function addSwellHandlers(gOff,inGfx,gfxArr,hovSy,pSy){
			var currNum,gTags=document.getElementsByTagName("g"),
			graphh=gTags[gOff],pathArr=[],pathss,pathObj={};
			if(graphh){
				pathss=graphh.firstChild.childNodes;
				for(var i=1;i<pathss.length;i+=2){
					pathArr[pathArr.length]=pathss[i].getAttribute("path").slice(1,6);
				}
				for(var pa=0;pa<pathArr.length;pa++){
					pathObj[pathArr[pa]]=pa;
				}
				graphHandlers.push(O(graphh,"mouseover",function(e){
		    		var et=e.target.getAttribute("path").slice(1,6);
		    		if(pathObj[et]!==undefined){
		    				currNum=pathObj[et];
		    		}
		    		if(currNum!==undefined)
		    			gfxArr[inGfx+currNum].setSymbol(hovSy);

		    	}));
		    	graphHandlers.push(O(graphh,"mouseout",function(e){
		    		if(currNum!==undefined)
		    			gfxArr[inGfx+currNum].setSymbol(pSy);
		    	}));
		    	graphList.unshift(arguments);
		    	gOffset=gTags.length;
	    	}
		}

		function clearGraphHandlers(arr){
			for(var i=arr.length-1;i>=0;i--){
				arr[i].remove();
				arr.length=i;
			}
		}
		function reAttachGraph(gList){
			var len=gList.length,i=len-1,twolen=len*2;
			while(len<twolen){
				var curr=gList[i];
				addSwellHandlers.apply(null,curr);
				len++;
			}
			gList.length=i+1;
		}

		function mdToSlide(con,chars,W){      //make sure to check ordering.. graph to symbol tie in seems off
			clearGraphHandlers(graphHandlers);
			var mup=O(W,"mouseup",function(e){
				var charDivs=con.childNodes;
				for(var i=0;i<charDivs.length;i++){
					charDivs[i].style.width=poCon.style.width.slice(0,-2)-25+"px";
						chars[i].resize();
				}
				reAttachGraph(graphList);
				mup.remove();
			});
		}

		clSh=function(e){
			if(paneIsShowing){//close button logic
				hidePane();
				if(grStore&&rowStore){
					var inp;
					if(rowStore.firstChild.childNodes[3])
						inp=rowStore.firstChild.childNodes[3].firstChild;
					else
						inp=inp=rowStore.firstChild.firstChild.childNodes[3].firstChild;
					caCh(otg(grStore),rowStore,"");
					if(inp.checked==true){
						O.emit(inp,"change",{bubbles:true});
						inp.checked=false;
					}
					grStore=null;
					rowStore=null;
					currentOID=null;
				}
			}else{
			irP.innerHTML="<p>The <strong>Delta Bathymetry Catalog</strong> houses the complete set of multibeam bathymetric data collected by the Bathymetry and Technical Support section of the California Department of Water Resources.</p> <p id='beta'><b>Note: </b>The Catalog is still in active development. Please report any bugs or usability issues to <a href='mailto:wyatt.pearsall@water.ca.gov?subject=Bathymetry Catalog Issue'>Wyatt Pearsall</a>.</p><p>Click on a feature in the map or table to bring up its <strong>description</strong>. Double-click to view the <strong>raster image</strong>.</p> <p><strong>Download</strong> data as text files from the descrption pane.</p> <p><strong>Measure</strong> distances, <strong>identify</strong> raster elevations, and draw <strong>profile graphs</strong> with the tools at the top-right.</p> <p>Change what displays by <strong>collection date</strong> with the slider at bottom-right. <strong>Sort</strong> by date and name with the table's column headers.</p> <p>See the <strong>help</strong> below for further information.</p>";
			dlLink.style.display="none";
			mdLink.style.display="none";
			showPane();
			}
		};

		function showPane(){
			paneIsShowing=1;
			fx.animateProperty({node:idCon,duration:150,properties:{top:irP.offsetHeight+35}}).play();
			fx.animateProperty({node:rP,duration:300,easing:easing.quadOut,properties:{marginRight:0}}).play();
			fx.animateProperty({node:shoP,duration:300,easing:easing.quadOut,properties:{right:285}}).play();
			arro.style.backgroundPosition="-32px -16px";
			movers.animateProperty({duration:300,easing:easing.quadOut,properties:{marginRight:285}}).play();
		}

		function hidePane(){
			paneIsShowing=0;
			fx.animateProperty({node:idCon,duration:150,properties:{top:irP.offsetHeight+35}}).play();
			movers.animateProperty({duration:250,easing:easing.quadIn,properties:{marginRight:"0"}}).play();
			fx.animateProperty({node:rP,duration:250,easing:easing.quadIn,properties:{marginRight:-285}}).play();
			fx.animateProperty({node:shoP,duration:250,easing:easing.quadIn,properties:{right:8}}).play();
			arro.style.backgroundPosition="-96px -16px";
		}

		imON=function(){										//turn on imagery
			maOn=0;
			imOn=1;
			liZ.setVisibility(true);                     //there is crud here. it is worked around at 1071 and 1097
			liO.setVisibility(false);					//the layers aren't defined
			phys.style.cssText="";
			imag.style.cssText=cTex;
			setLinkColor();
			covZ();
		};

		maON=function(){
			maOn=1;                                            //turn on he map
			imOn=0;
			liO.setVisibility(true);
			liZ.setVisibility(false);
			imag.style.cssText="";
			phys.style.cssText=cTex;
				setLinkColor();
			covZ();
		};
		laOff=function(){
			maOn=0;
			imOn=0;                                          //turn off both
			liO.setVisibility(false);
			liZ.setVisibility(false);
			imag.style.cssText="";
			phys.style.cssText="";
		};

		zFun= function(ext,zF,anc,lev){	//logic on ZoomEnd	
			console.log(MAP.getScale());
			if(liZ&&liO){
			if(lev>=15&&sLev<15)
				imON();
			else if(lev<15&&sLev>=15)
				maON();
			else if(!liO.visible&&!liZ.visible){
				if(lev>=15)
					imON();
				else
					maON();
			}
		}
			sLev=lev;
			var offs=MAP.extent.getWidth()/MAP.width;
			offs=offs>10?offs:10;
			tiout.setMaxAllowableOffset(offs);
			tiout.refresh();
		}; 

   		zoomEnd=DJ.connect(MAP,"onZoomEnd",zFun);

   		O(helpBod, "mouseover", function(e){
   			if(e.target.tagName==="B"){
   				var key=e.target.textContent.slice(0,3);
   				switch (key){
		   			case "Zoo":
		   				domcl.add(zSlid,"helpglow");
		   				break;
		   			case "Glo":
		   				domcl.add(fex,"helpglow");
		   				break;
		   			case "Bas":
		   				domcl.add(phys,"helpglow");
		   				domcl.add(imag,"helpglow");
		   				break;
		   			case "Sli":
		   				domcl.add(lP,"helpglow");
		   				domcl.add(spl,"helpglow");
		   				break;
		   			case "Ide":
		   				domcl.add(ident,"helpglow");
		   				break;
		   			case "Pro":
		   				domcl.add(cros,"helpglow");
		   				break;
		   			case "Mea":
		   				domcl.add(mea,"helpglow");
		   				break;
		   			case "Arr":
		   				domcl.add(shoP,"helpglow");
		   				break;
		   			case "Tim":
		   				domcl.add(tsNode,"helpglow");
		   				break;
   				}
   			}
   		});

   		O(helpBod, "mouseout", function(e){
   			if(e.target.tagName==="B"){
   				var key=e.target.textContent.slice(0,3);
   				switch (key){
		   			case "Zoo":
		   				domcl.remove(zSlid,"helpglow");
		   				break;
		   			case "Glo":
		   				domcl.remove(fex,"helpglow");
		   				break;
		   			case "Bas":
		   				domcl.remove(phys,"helpglow");
		   				domcl.remove(imag,"helpglow");
		   				break;
		   			case "Sli":
		   				domcl.remove(lP,"helpglow");
		   				domcl.remove(spl,"helpglow");
		   				break;
		   			case "Ide":
		   				domcl.remove(ident,"helpglow");
		   				break;
		   			case "Pro":
		   				domcl.remove(cros,"helpglow");
		   				break;
		   			case "Mea":
		   				domcl.remove(mea,"helpglow");
		   				break;
		   			case "Arr":
		   				domcl.remove(shoP,"helpglow");
		   				break;
		   			case "Tim":
		   				domcl.remove(tsNode,"helpglow");
		   				break;
   				}
   			}
   		});

   		O(dlLink,"mouseover",function(e){  //remove spatial reference info from files
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

   		O(foot, "mousedown", function(e){
   			var offs=Math.abs(e.target.offsetLeft-200+35);
   			if(helpPane.style.opacity==0){
   				fx.fadeIn({node:helpPane,duration:150}).play();
   				helpPane.style.zIndex="300"
   			}
   			if(currButt==e.target){
   				closePane();
   				return;
   			}else{
   				if(currButt){
   					currButt.style.cssText="";
   				}
   			}
   			currButt=e.target;
   			var whichButt=currButt.innerHTML.slice(0,1),hei;
   			whichButt==="H"?(helpBod.innerHTML=helpText,hei=458,helpHead.textContent="Help"):whichButt==="T"?(helpBod.innerHTML=termText,hei=300,helpHead.textContent="Terms of Use"):(helpBod.innerHTML=conText,hei=250,helpHead.textContent="Contact");
   			offs<50?offs=2:offs;
   			fx.animateProperty({node:helpPane,duration:200,properties:{right:offs,height:hei}}).play();
   			helpBod.style.height=hei-30+"px";
   			currButt.style.cssText="background-color:rgba(243,243,243,0.8);background-image:-webkit-linear-gradient(top,#a0bce5,#f0f5fd);background-image:-moz-linear-gradient(top,#a0bce5,#f0f5fd);"
   		});

   		function closePane(){
   			fx.fadeOut({node:helpPane,duration:150}).play();
   			currButt.style.cssText="";
   			currButt=null;
   			helpPane.style.zIndex="-1";
   		}

   		O(helpClo,"click",closePane);


		O(fex,"mousedown",function(e){                  //go to initial extent
			MAP.setExtent(inExt);
		});

		O(poH,"mousedown",function(e){//adjustable graph popup.. a thing of beauty
			var pS=popu.style,W=window,inH=W.innerHeight,inW=W.innerWidth,pSs=poS.style,pHs=phsp.style,pxx="px",pohS=poH.style,
			rMax=inW-75,pSH=+pS.height.slice(0,-2),pSW=+pS.width.slice(0,-2),pcS=poCon.style,bMax=inH-75,
			et=e.target,oxL=e.offsetX,oyT=e.offsetY;
			body.style["-webkit-user-select"]="none";//when the width is collapsed, the offset changes according to the
			body.style["-moz-user-select"]="none";	//the direction of collapse
			poCon.style.display="none";
			pS.boxShadow="0 0 0";
			pS.opacity="0.7";
			pSs.display="none";
			pHs.display="none";
			pohS.boxShadow="0 0 0";
			if(et.id!="pohead")
				oxL+=et.offsetLeft,oyT+=et.offsetTop;
			var mM=O(W,"mousemove",function(evt){
				var exx=evt.pageX,eyy=evt.pageY,exL=exx-oxL,exR=exL+pSW,eyT=eyy-oyT,eyB=eyT+pSH,nWid,nHe;
				if(exL<=0){//if left corner is offscreen
					if(exR>=75){//if right corner is over 75px away from left
						if(!dockedx)
							dockedx=pSW; //set pre-docked width if not already docked
						pS.left="0";
						pS.width=exR+pxx;
						pcS.width=exR-7+pxx;
						pHs.width=exR-2+pxx;      //exx=eventx leftpoint= event minus the offset exR is this point
						pSW=exR;				//plus the width if the left corner moves offscreen, and the box is
						exx<0?oxL=0:oxL=exx;	//wider than 75, set the undocked width at the original width
					}							//reset the left corner at 0, set the width to be the value of the
				}else if(exR>=inW){				//right point, reset the width tracker, reset the offset(spanfix)
					if(exL<=rMax){
						if(!dockedx)
							dockedx=pSW;
						nWid=pSW-exR+inW;
						pS.left=inW-nWid+pxx;
						pS.width=nWid+pxx;
						pcS.width=nWid-7+pxx;
						pHs.width=nWid-2+pxx;
						pSW=nWid;
					}
				}else{
					if(dockedx){
						if(exR<=dockedx){
							pS.left="0";
							pS.width=exR+pxx;
							pcS.width=exR-7+pxx;
							pHs.width=exR-2+pxx;
							pSW=exR;
							oxL=exx;
						}else if(exL>=inW-dockedx){
							var rdoc=inW-exL;
							pS.left=exL+pxx;
							pS.width=rdoc+pxx;
							pcS.width=rdoc-7+pxx;
							pHs.width=rdoc-2+pxx;
							pSW=rdoc;		
						}else{
							pS.left=exL+pxx;
							pS.width=dockedx+pxx;
							pcS.width=dockedx-7+pxx;
							pHs.width=dockedx-2+pxx;
							pSW=dockedx;
							dockedx="";
						}
					}else{
						pS.left=exL+pxx;
					}
				}
				if(eyT<=0){
					if(eyB>=75){
						if(!dockedy)
							dockedy=pSH;
						pS.top="0";
						pS.height=eyB+pxx;
						pSs.height=eyB-2+pxx;
						pcS.height=eyB-34+pxx;
						pSH=eyB;
						eyy<0?oyT=0:oyT=eyy;
					}
				}else if(eyB>=inH){
					if(eyT<=bMax){
						if(!dockedy)
							dockedy=pSH;
						nHe=pSH-eyB+inH;
						pS.height=nHe+pxx;
						pSs.height=nHe-2+pxx;
						pcS.height=nHe-34+pxx;
						pS.top=eyT+pxx;
						pSH=nHe;
					}
				}else{
					if(dockedy){
						if(eyB<=dockedy){
							pS.top="0";
							pS.height=eyB+pxx;
							pcS.height=eyB-34+pxx;
							pSs.height=eyB-2+pxx;
							pSH=eyB;
							oyT=eyy;
						}else if(eyT>=inH-dockedy){
							var bdoc=inH-eyT;
							pS.top=eyT+pxx;
							pS.height=bdoc+pxx;
							pcS.height=bdoc-34+pxx;
							pSs.height=bdoc-2+pxx;
							pSH=bdoc;		
						}else{
							pS.top=eyT+pxx;
							pS.height=dockedy+pxx;
							pcS.height=dockedy-34+pxx;
							pSs.height=dockedy-2+pxx;
							pSH=dockedy;
							dockedy="";
						}
					}else{
						pS.top=eyT+pxx;
					}
				}
			});
			on.once(W,"mouseup",function(e){
				mM.remove();
				poCon.style.display="block";
				body.style["-webkit-user-select"]="text";
				body.style["-moz-user-select"]="text";
				pS.boxShadow="0 1px 2px 1px #a5b6e0,0px 0px 2px 0 #a5b6e0";
				pohS.boxShadow="0px 2px 2px -1px #a5b6e0";
				pSs.display="block";
				pHs.display="block";
				pS.opacity="1";
			});
		});
		O(poS,"mousedown",function(e){
			for(var i in e)
				console.log(i,e[i]);
			body.style["-webkit-user-select"]="none";
			body.style["-moz-user-select"]="none";
			var pS=popu.style,pSW=+pS.width.slice(0,-2),pcS=poCon.style,pxx="px",
				oX=e.pageX-e.offsetX+5-pSW,W=window,xMax=W.innerWidth,psP=phsp.style;
				console.log(pSW," ",oX," ",xMax," e.pageX = ",e.pageX," e.offsetX= ",e.offsetX);
				var mM=O(W,"mousemove",function(e){
					var ex=e.pageX;
					console.log(ex);
					if(ex<=xMax){
						var wid=ex-oX//batch update?
						pS.width=wid+pxx;
						pcS.width=wid-7+pxx;
						psP.width=wid-2+pxx;
					}
				});
			on.once(W,"mouseup",function(e){
				mM.remove();
				if(dockedx)
					dockedx=+pS.width.slice(0,-2);
				body.style["-webkit-user-select"]="text";
				body.style["-moz-user-select"]="text";
			});
		});
		O(phsp,"mousedown",function(e){
			body.style["-webkit-user-select"]="none";
			body.style["-moz-user-select"]="none";
			var pS=popu.style,pSH=+pS.height.slice(0,-2),pcS=poCon.style,pxx="px",
				oY=e.pageY-e.offsetY+5-pSH,W=window,yMax=W.innerHeight,psP=poS.style,
				mM=O(W,"mousemove",function(e){
					var ey=e.pageY;
					if(ey<=yMax){
						var hei=ey-oY;
						pS.height=hei+pxx;
						pcS.height=hei-34+pxx;
						psP.height=hei-2+pxx;
					}
				});
			on.once(W,"mouseup",function(e){
				mM.remove();
				if(dockedy)
					dockedy=+pS.height.slice(0,-2);
				body.style["-webkit-user-select"]="text";
				body.style["-moz-user-select"]="text";
			});
		});
		O(bmaps,"mousedown",function(e){                            //basemap handling
			var et=e.target,typ=et.innerHTML;
			if(typ=="Satellite"&&!imOn){
				imON();
				et.previousElementSibling.style.cssText="";
				et.style.cssText=cTex;
				if(!zoomEnd)
				zoomEnd=DJ.connect(MAP,"onZoomEnd",zFun);
			}else if(typ=="Map"&&!maOn){
				maON();
				et.nextElementSibling.style.cssText="";
				et.style.cssText=cTex;
				if(!zoomEnd)
				zoomEnd=DJ.connect(MAP,"onZoomEnd",zFun);
			}
			else {
				et.style.cssText="";
				DJ.disconnect(zoomEnd);
				zoomEnd=null;
				laOff();
			}
		});

		O(spl, "mousedown",function(e){								//expand left pane
			var mm=O(window,"mousemove",function(e){
				grCon.style.width= lHead.style.width;
			});
			on.once(window,"mouseup",function(evt){
				MAP.resize();
				mm.remove();
			});

		});


		O(window, "resize",function(e){			//resize map on browser resize
			MAP.resize();
			grid.resize();
			rpCon.style.cssText="width:100%;height:"+(rP.scrollHeight-60)+"px;";
			fx.animateProperty({node:idCon,duration:150,properties:{top:irP.offsetHeight+35}}).play();

		});

		function toolToggle(e,tool){
			var active=dque(".activeTool")[0],targ=e.target;
			if(targ===active){
				tool.stop();
				domcl.remove(targ,"activeTool");
				if (lastActiveNode){
					domcl.add(lastActiveNode,"activeTool");
					lastActiveTool.revive();
				}
			}else{
				if(active){
					domcl.replace(active,"idle","activeTool"); //swap in idle
					lastActiveTool.idle();
				}
				if(domcl.contains(targ,"idle")){
					domcl.replace(targ,"activeTool","idle"); //activate
					tool.revive();
				}else{
					domcl.add(targ,"activeTool");
					tool.start();
				}
				lastActiveNode=targ;
				lastActiveTool=tool;
			}
		}
		
		meaTool={
			init:function (e){           //start the measurement tool lazily when first clicked, less to load at once
				measur.style.display="block";
				var ismov;
				reqq(["esri/dijit/Measurement"],function(mt){
					var lSy=new eS.SimpleLineSymbol(sls,new DJ.Color([0,0,0]),3),
						pSy=new eS.SimpleMarkerSymbol(eS.SimpleMarkerSymbol.STYLE_CIRCLE,8,lSy,new DJ.Color([0,0,0]));
					mmt= new mt({
						 map:MAP, lineSymbol: lSy, pointSymbol: pSy},measur);
			        mmt.startup();
					measur=dom.byId("measur");
					domcl.add(measur,"mov");
					movers=dque(".mov")
					measur.style.marginRight=mea.style.marginRight;
					mmt.show();
					outlines.disableMouseEvents();
					DJ.connect(mmt,"onMeasureEnd",function(e){currentMeaTool=e;});
					O(mea,"mousedown",function(e){toolToggle(e,meaTool)});
				});
			},
			start:function(){
					mmt.show();
					outlines.disableMouseEvents();
			},
			idle:function(){
				outlines.enableMouseEvents();
				if(currentMeaTool)
					mmt.setTool(currentMeaTool,false);
			},
			revive:function(){
				mmt.setTool(currentMeaTool,true);
				outlines.disableMouseEvents();
			},
			stop:function(){
				this.idle();
				mmt.clearResult();
				mmt.hide();
			}
		};
		O.once(mea,"mousedown",meaTool.init);

		runIdent=function(e){ 										//id handling, when initialized
			if(domcl.contains(ident,"clickable")){
				

				start
					outlines.disableMouseEvents();
					MAP.setMapCursor("help");
					idCon.style.top=irP.offsetHeight+35+"px";
					idCon.style.display="block";
					rpCon.scrollTop=rpCon.scrollHeight;
					if(rP.style.marginRight=="-16.9%")
						clSh();
					dHan=DJ.connect(MAP, "onMouseDown", runIT);
					identOff=0;

				stop
					outlines.enableMouseEvents();
					MAP.setMapCursor("default");
					idCon.style.display="none";
					DJ.disconnect(dHan);
					identOff=1;
					clearNode(resCon);
					for(var i=0,j=identGfx.length;i<j;i++){
						MAP.graphics.remove(identGfx[i]);
					}
					idCount=0;
				
			}else{
				whyNoClick();
			}
		};
		DJ.connect(MAP,"onMouseDragEnd",function(e){console.log("DRAG ENDS")});
		O(mapDiv,"mousedown",function(){
			var d1=+(new Date());
			console.log("mousedown. CYCLE START");
			var mm=O(mapDiv,"mousemove",function(){console.log("MOUSEMOVE")});
			O.once(mapDiv,"mouseup",function(){var d2=(new Date())-d1;console.log("mouseup. CYCLE COMPLETE in",d2,"ms.");mm.remove();});
		})

	/*	O(ident,"mousedown",
			function(e){
				if(domcl.contains(ident,"clickable")){
					return toolToggle(e,identTool);
				}else{
					whyNoClick();
				}
		});*/
		O(ident,"mousedown",runIdent);

		asp.after(grid,"set",function(gr){     //maintain state after grid update INEFFICIENT! USE HASH
			var inGrid=gr.bodyNode.firstChild.childNodes;
			for(var i=0;i<inGrid.length;i++){                  
				var chil=inGrid[i].firstChild,ieF=chil.childNodes[3]?chil:chil.firstChild,inp=ieF.childNodes[3].firstChild,oid=+ieF.childNodes[2].innerHTML;
				if(checkTrack[oid-1])
					inp.checked=true;
				if(currentOID&&currentOID===oid){
					grStore=null;
					O.emit(ieF.firstChild,"mouseover",{bubbles:true});
					O.emit(ieF.firstChild,"mousedown",{bubbles:true});
					dScroll.scrollTop=rowStore.offsetTop-155;
				}
			}
		});


		grid.on(".dgrid-cell:mouseover",function(e){                       //grid mouseover handler
			var thGr=otg(getOBJECTID(e));
			if(thGr){
				erow=grid.row(e);
				if(erow)
					caCh(thGr,erow.element,"hi");	
			}
		});


		grid.on(".dgrid-cell:mouseout",function(e){						//grid mouseout handler
			if(erow){
			if(rowStore==erow.element){
				return;
			}else{
				var thGr=otg(getOBJECTID(e));
				if(thGr)
					caCh(thGr,erow.element,"");
			}
		}
		});


		O(shoP,"mousedown",clSh);//handle close button click

		grid.on(".dgrid-cell:mousedown",function(e){	//grid click handler
			if(!e.target.firstChild)
				return;					
			if(domcl.contains(e.target.firstChild,"dgrid-resize-header-container"))
				return;
			if(domcl.contains(e.target,"dgrid-resize-header-container"))
				return;
			if(domcl.contains(e.target,"field-Image"))
				return;
			if(domcl.contains(e.target,"dgrid-input"))
				return;
			var oid=getOBJECTID(e),
				grPr=otg(oid),
				eg=outlines.graphics[oid-1];
				erow=grid.row(e);
			if(grStore){
				if(grStore===oid){
					clSh();
					return;
				}else{
					caCh(otg(grStore),rowStore,"");
					infoFunc(eg.attributes);
				}
			}else{
				infoFunc(eg.attributes);
				caCh(grPr,erow.element,"hi");
			}
		 	grStore=oid; 	
		 	rowStore=erow.element;
		 	currentOID=oid;
			
		});

		grid.on(".dgrid-cell:dblclick",function(e){                 //grid dblclick handler
			var iSt=e.target, inpz,oid=getOBJECTID(e);
			if(oid){
				var eg=outlines.graphics[oid-1],
					gOe=otg(oid);
				infoFunc(eg.attributes);
				grStore=oid;
				rowStore=erow.element;
				currentOID=oid;
				caCh(gOe,rowStore,"hi");
				if(iSt.localName!="div"){
					iSt.localName=="input"?inpz=iSt:inpz=iSt.parentNode.childNodes[3].childNodes[0];
						MAP.setExtent(gOe._extent.expand(1.3));
					if(!inpz.checked){
						inpz.checked=true;
						O.emit(inpz,"change",{bubbles:true});
					}
				}
			}
		});
	
		O(timeDiv, ".dijitRuleLabelH:mouseover",function(e){
			var ets=e.target.style,col=ets.color;
			ets.backgroundColor=col;
			ets.color="#fff";
		});

		O(timeDiv, ".dijitRuleLabelH:mouseout",function(e){
			var ets=e.target.style,back=ets.backgroundColor;
			ets.color=back;
			ets.backgroundColor="rgba(0,0,0,0)";
		});

		O(timeDiv, ".dijitRuleLabelH:mousedown", function(e){  //timeslider quicklinks handler
			var yr=e.target.innerHTML;
			if(yr.charAt(0)==="A")
				timeSlider.setThumbIndexes([0,tCount]);
			else
				timeSlider.setThumbIndexes([6*(yr-2010),6*(yr-2010)+6]);
		});


		DJ.connect(outlines, "onMouseOver", function(e) {//map mouseover handler
		var oid=e.graphic.attributes.OBJECTID;
		if(!outBounds[oid]){
				identOff?MAP.setMapCursor("pointer"):MAP.setMapCursor("help");
				var teg=otg(oid),er=getGrid(e),scroT=dScroll.scrollTop;
				if(teg&&grStore!=oid){
					caCh(teg,er,"hi");
					if(er.offsetTop>dScroll.clientHeight+scroT||er.offsetTop<scroT)
						dScroll.scrollTop=er.offsetTop-155;
				}
			}		    	
		});


		DJ.connect(outlines,"onMouseOut", function(e){		//map mouseout handler
			var oid=e.graphic.attributes.OBJECTID;
			if(!outBounds[oid]){												
			identOff?MAP.setMapCursor("default"):MAP.setMapCursor("help");
				var teg=otg(oid);
					if(grStore==oid){
						return;
					}else{
						if(teg)
						caCh(teg,getGrid(e),"");
					}
				}
		});

		DJ.connect(outlines, "onMouseDown", function(e){            //map click handler
				var ega=e.graphic.attributes,oid=ega.OBJECTID,scroT=dScroll.scrollTop;;
				if(!outBounds[oid]){
					var teg=otg(oid),er=getGrid(e);
					if(grStore&&MAP.getScale()>73000){ //don't clear when zoomed in
						if(grStore===oid){
							clSh();
							return;
						}else{
							caCh(otg(grStore),rowStore,""); //clear stored graphic
							infoFunc(ega);     //this graphic is already highlighted by the mouseover
						}
					}else{
						infoFunc(ega);
						caCh(teg,er,"hi");
					}
					if(er.offsetTop>dScroll.clientHeight+scroT||er.offsetTop<scroT)
						dScroll.scrollTop=er.offsetTop-155;
					grStore=oid;
					rowStore=er;
					currentOID=oid;
				}
		});

		DJ.connect(outlines, "onDblClick", function(e){						//map dblclick handler
			var inpz,ega=e.graphic.attributes,oid=ega.OBJECTID,er=getGrid(e);
			if(!outBounds[oid]){
			grStore=oid;                                    
			rowStore=er;
			currentOID=oid;
			inpz=rowStore.childNodes[0].childNodes[3].childNodes[0];
			infoFunc(ega);
			if(MAP.getScale()>73000)
				MAP.setExtent(e.graphic._extent.expand(1.3));
			if(!inpz.checked){
				inpz.checked=true;
				O.emit(inpz,"change",{bubbles:true});
			}
		}
		});

		O(imHead,"mousedown",function(e){      						//mass image display/clear
			var inpArr=dque(".field-Image",ilP), somChk=0,dL=dynamicLayer;
				darr.forEach(inpArr, function(v){
					if(v.firstChild.checked){
						somChk=1;
						v.firstChild.checked=false;
					}
				});
			if(somChk){
				checkTrack=[];
				dL.setVisibleLayers(["-1"]);
				dL.suspend();
			}	
			if(!somChk){
				if(dL.suspended)
					dL.resume();
				darr.forEach(inpArr,function(v,i){
					v.firstChild.checked=true;
					checkTrack[i]=true;
				});
				if(!idT){
					initId();
				}
				dL.setVisibleLayers(["-1",13, 1, 11, 15, 0, 3, 77, 80, 83, 86, 26, 97, 91, 88, 74, 103, 71, 66, 65, 54, 44, 34, 32, 29, 100, 6, 5, 2, 12, 61, 62, 79, 53, 82, 76, 43, 25, 85, 90, 93, 96, 33, 99, 31, 28, 73, 102, 4, 14, 7,17, 55, 45, 46, 37, 56, 18, 78, 75, 95, 98, 92, 87, 70, 72, 67, 94, 69, 47, 57, 19, 81, 84, 89, 101, 35, 36, 30, 27, 8, 106, 20, 58, 38, 48, 10, 9, 16, 21, 59, 49, 39, 104, 40, 22, 50, 60, 63, 23, 51, 41, 52, 24, 42, 64, 68, 107, 105]);
				if(!MAP.layerIds[2]){
					MAP.addLayer(dL);
				}


			}
		});

		O(grid,".dgrid-input:change",function(e){                             //actual display/clear logic
			if(!idT){ //initialize the id task
				initId();
			}			
			if(!MAP.layerIds[2]){ //if the raster has not been added, add it.
				dynamicLayer.setVisibleLayers(["-1"]);
				MAP.addLayer(dynamicLayer);
			}
			
			var dL=dynamicLayer,dLvis=dL.visibleLayers,i=dLvis.length,spli,
			dLoid=+e.target.parentNode.parentNode.childNodes[2].innerHTML-1; ///get oid-1 to set layer visibility
			if(dL.suspended) 												//attempt to prevent layer drawing might be a failure
				dL.resume();
			checkTrack[dLoid]===true?checkTrack[dLoid]=null:checkTrack[dLoid]=true; //if some array index is true,set it to null/ otherwise set it to true
			while(i--){
				if(dLoid==dLvis[i]){
					spli=dLvis.splice(i,1)[0]; //splice this number out of visible layers if it is there
					break;
				}
			}
			if(dLoid!==spli)
				dLvis.push(dLoid) //otherwise add it
			dL.setVisibleLayers(dLvis); //and set the visibile layers
			if(dLvis.length==1){
						dL.suspend();
					}
			if(dLvis.length>1){//working identify logic below
				domcl.replace(ident,"clickable","unclick");
				domcl.replace(cros,"clickable","unclick");
			}else if(dLvis.length==1&&idCon.style.display=="block"){
				O.emit(ident,"mousedown",{bubbles:true});
				domcl.replace(ident,"unclick","clickable");
				domcl.replace(cros,"unclick","clickable");
			}else{
				domcl.replace(ident,"unclick","clickable");
				domcl.replace(cros,"unclick","clickable");
			}
		});

		daGrid=(function(){	//make a copy of the initial grid for use in grid logic,cloning the domnodes
			var gr=[],j=grid.bodyNode.firstChild.childNodes;
			darr.forEach(j,function(v,i){
				var par=v.firstChild,ieFix=par.childNodes[2]?par:par.firstChild,yO=ieFix.childNodes[2].innerHTML-1,
				vD=ieFix.childNodes[4];
				gr[yO]=+vD.innerHTML;
				outBounds[i+1]=null;
			});
			return gr;
		})();
		cGr=function(e){  //grid logic on timechange INEFFICIENT Use hash. Sorting at end is poor
			var yoSt;	//somewhat convoluted due to sorting/highlighting/checkboxes
			grid._lastCollection=[];
			darr.forEach(daGrid,function(v,i){
				var yOyO=otg(i+1);
				if(v<e.startTime||v>e.endTime){ //prepare to cut
					outBounds[i+1]=true;
					yOyO.setSymbol(blank);
				}else{								//prepare to rerender	
					outBounds[i+1]=null;
					caCh(yOyO,null,"");
					grid._lastCollection.push(lC[i]);  
				}                                               					
			});
			if(grid.bodyNode.firstChild.childNodes[0])
				var aGrid=grid.bodyNode.firstChild.childNodes;

			darr.forEach(aGrid,function(v,i){
				var par=v.firstChild,ieFix=par.childNodes[2]?par:par.firstChild,yO=ieFix.childNodes[2].innerHTML-1,
				inp=ieFix.childNodes[3].firstChild;
				if(inp.checked){
					O.emit(inp, "change",{bubbles:true});  //save the check and remove the raster
					checkTrack[yO]=true;
				}
			});
				grStore=null;										 //wipe stores
				rowStore=null;					//leave currentOID incase no selections made
				grid.refresh();                                       //remove grid and rerender
				grid.renderArray(grid._lastCollection);

			if(grid.bodyNode.firstChild.childNodes[0])
				var bGrid=grid.bodyNode.firstChild.childNodes;

			darr.forEach(bGrid,function(v,i){
				var par=v.firstChild,ieFix=par.childNodes[2]?par:par.firstChild,yO=ieFix.childNodes[2].innerHTML-1,
				inp=ieFix.childNodes[3].firstChild;
				if(checkTrack[yO]&&!inp.checked){
					O.emit(inp, "change",{bubbles:true});
					inp.checked=true; 
					checkTrack[yO]=true; //flip it back due to input:change handler
				}	
			});
			O.emit(ghd[1],"click",{bubbles:true}); //sort
			O.emit(ghd[1],"click",{bubbles:true});
		};

		DJ.connect(timeSlider, "onTimeExtentChange",cGr); //handle time extent change

		function whyNoClick(){
			noClick.style.zIndex="100";
			fx.animateProperty({node:noClick,duration:75,properties:{opacity:1}}).play();

			window.setTimeout(function(){fx.animateProperty({node:noClick,duration:150,properties:{opacity:0},
				onEnd:function(){noClick.style.zIndex="-100"}}).play()},2000);
		}

		function copColl(g){    							//make a copy of the grid's internal _lastCollection
			var lC=g._lastCollection,i=0,j=lC.length,cop=[];
			for(;i<j;i++){
				cop[i]=lC[i];
			}
			return cop;
		}

		function creCov(targ,Z){      //apply highlighting logic to an array
			if(Z){
				darr.forEach(targ,function(val,ind){
					if (val.swi&&val.swi.attributes.OBJECTID==grStore){
						caCh(val.swi,val.gr,"hi");
						rowStore=val.gr;
					}else
						caCh(val.swi,val.gr,"");
				});
			}else{
				darr.forEach(targ,function(val,ind){
					if(val.attributes.OBJECTID==grStore)
						caCh(val,rowStore,"hi");
					else
					caCh(val,null,"");
				});
			}
		}										//#####FIX MEborkin the grid and rerendering for noooo reason. (besides ie)
		function covZ(){         //special instance of highlighting an array to be used with basemap switching
			var colArr=[],curEnt;
			for (var i=0;i<grid._lastCollection.length;i++){
				curEnt=grid._lastCollection[i];
				colArr.push({swi:otg(curEnt.OBJECTID),gr:getGrid(curEnt.OBJECTID)}); //seems like I'm accessing stale grid
			}
			creCov(colArr,true);
		}
		function caCh(swiTar,grTar,hi){ //main highlighting logic, separated by year with different basemap
			var symbo=liZ&&liZ.visible?imSym:symbols;   //colors handled automatically
			//pass in the graphic, the row object, and optional highlight
			//this is just to change color. rows are handled seperately
			var oid=swiTar?swiTar.attributes.OBJECTID:null,
				chk=fs.features[oid-1]?fs.features[oid-1].attributes.Date:null;
					//2012:1325404800000 2011:1293868800000 2009:1230796800000
					// 2013: 1357027200000 2010:1262332800000
			if(chk>=1262304000000&&chk<1293840000000){
				swiTar.setSymbol(symbo["gre"+hi]);
				if(grTar){   ///////this is a workaround for how I onUpdateEnd into crecov
					if (hi!=="")
						domcl.add(grTar,"highlgre");
					else
						domcl.remove(grTar,"highlgre");
				}
			
			}
			else if(chk>=1293840000000&&chk<1325376000000){
				swiTar.setSymbol(symbo["mag"+hi]);
				if(grTar){
					if (hi!=="")
						domcl.add(grTar,"highlmag");
					else
						domcl.remove(grTar,"highlmag");
				}
			
			}
			else if(chk>=1325376000000&&chk<1357027200000){
				swiTar.setSymbol(symbo["blu"+hi]);
				if(grTar){
					if (hi!=="")
						domcl.add(grTar,"highlblu");
					else						
						domcl.remove(grTar,"highlblu");
				}
			}
			else if(chk>=1357027200000&&chk<1388563200000){            
				swiTar.setSymbol(symbo["red"+hi]);
				if(grTar){
					if (hi!=="")
						domcl.add(grTar,"highlred");
					else
						domcl.remove(grTar,"highlred");
				}
			}
			

		}
		function otg(oid){
			return tiout.graphics[oid-1];
		}

		function getOBJECTID(e){ //returns the gets an ObjectID from an event either on the grid or map
			var et=e.target,etP=et.parentNode;
			if(e.rows)
				return +e.rows[0].data.OBJECTID;
			else if(etP.childNodes[2])
				return +etP.childNodes[2].innerHTML;
			else if(et.className=="dgrid-input")
				return +etP.parentNode.childNodes[2].innerHTML;
		}
		
		function getGrid(e){					//gets a reference to a grid row when passed a graphic, etc
			var oidM,cV;
			if(isNumber(e))
				oidM=e;
			else
				oidM=e.OBJECTID||+e.graphic.attributes.OBJECTID;
			darr.forEach(dque(".dgrid-column-OBJECTID",ilP),function(v,i){
				if(v.innerHTML==oidM){
					cV=v;
				}
			});
			if(cV){
			if(domcl.contains(cV.parentNode,"dgrid-row"))
				return cV.parentNode;
			else
				return cV.parentNode.parentNode;
			}
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
		function addSymbol(sy,geom,trackingArr){
			var sym=new E.Graphic();
				sym.setSymbol(sy);
				sym.setGeometry(geom);
				MAP.graphics.add(sym);
				trackingArr.push(sym);
				return sym;
		}
		function processId(tA,pA){
			var def=tA.execute(pA);
				return def.then(function(v){
					if(v.length>0){
					var lids=[],inpArr=dque(".field-Image",ilP),output=[[],[]];
					for (var i=0,j=v.length;i<j;i++){ //logic for multiple layers
						lids[i]={lI:v[i].layerId,v:v[i]};//array of objects with OBJECTID and it's ident data
					}
					darr.forEach(inpArr,function(val){
						var chlo=val.firstChild;
						if(chlo.checked){
							for(var i=0,j=lids.length;i<j;i++){
								if(+val.previousSibling.innerHTML==lids[i].lI+1){
									output[0].push(lids[i].lI);
									output[1].push(lids[i].v);
								}
							}			
						}		
					});
					return output;
				}
				});
		}
		function initId(e){ //id logic... cross section tool feeds here as well.. this gets set up lazily also
			reqq(["esri/tasks/identify"],function(ide){
				var lSy=new eS.SimpleLineSymbol(sls,new DJ.Color([0,0,0]),2),
					pSy=new eS.SimpleMarkerSymbol(eS.SimpleMarkerSymbol.STYLE_CIRCLE,5,lSy,new DJ.Color([0,0,0])),
					lotsOfLayers=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106];
				idT= new eT.IdentifyTask("http://mrsbmapp00642/ArcGIS/rest/services/BATH/Web_Rr/MapServer");
				idP= new eT.IdentifyParameters();
				idP.layerOption=eT.IdentifyParameters.LAYER_OPTION_VISIBLE;
				idP.layerIds=lotsOfLayers;
				idP.tolerance=1;
				idP.returnGeometry=true;
				idP.mapExtent=MAP.extent;
				runIT=makeIT(idT,idP);

				function renderIdent(pr){
					if(pr&&pr[0]){
						addSymbol(pSy,mPoint,identGfx);
						var txtsym=new eS.TextSymbol(idCount),
						sympoi=new E.geometry.Point(mPoint.x+10,mPoint.y+10,MAP.spatialReference),
						gra=new E.Graphic(sympoi,txtsym);
						MAP.graphics.add(gra);
						identGfx.push(gra);

					pr[0].forEach(function(v,i){
					resCon.innerHTML=resCon.innerHTML+idCount+".&nbsp;"+outlines.graphics[v].attributes.Project+": "+(pr[1][i].value!=="NoData"?Math.round(pr[1][i].value*10)/10+ " ft<br/>":"No Data<br/>");
					});		
					rpCon.scrollTop=rpCon.scrollHeight;
					idCon.style.top=irP.offsetHeight+35+"px";
					}
					}
										//structured with closure for lazy load pass in id and execute the task
				function makeIT(tA,pA){//if cross section, return, otherwise handle and display
					return function (e,queryy){
						pA.height = MAP.height;
						pA.width  = MAP.width;
						if(e.mapPoint){
							var mPoint=e.mapPoint;
							pA.geometry=mPoint;
						}else{
							pA.geometry=e;
							if(queryy){
								pA.layerIds=lotsOfLayers;
								var lays=processId(tA,pA);
								return lays.then(function(v){ //v is an array with an layerIds and one of values
										if(v){
											pA.layerIds=v[0];
											return v[0];
										}
									   });
							}
							return tA.execute(pA);
						}
						idCount++;
						var pro=processId(tA,pA);
						pro.then(renderIdent);
					};
				}
			});
		}
		window.setTimeout(clSh,300);
	});

	});

//return from the require
});
