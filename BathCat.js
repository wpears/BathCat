require(["dijit/dijit","dijit/layout/BorderContainer","dijit/layout/ContentPane","dgrid/Grid","dojo/_base/fx","dojo/fx/easing",
		"dgrid/Keyboard", "dgrid/editor","dgrid/extensions/ColumnResizer","dojo/_base/declare","dojo/parser","dojo/dom-construct","dojo/dom","dojo/query",
		"dojo/dom-class","esri/layers/FeatureLayer","dojo/_base/array","esri/tasks/query","esri/tasks/geometry","dojox/charting/action2d/Magnify",
		"dojox/charting/Chart","dojox/charting/themes/PurpleRain","dojox/charting/axis2d/Default", "dojox/charting/plot2d/MarkersOnly","dojox/charting/action2d/Tooltip",
		"dojo/on","esri/dijit/TimeSlider","dojo/ready","esri/dijit/Scalebar","esri/dijit/Measurement","dojo/aspect","require","dojo/NodeList-fx"],
		function(dijit,BorderContainer,CP,Grid,fx,easing,Keyb,edi,ColRe,dec,parser,dCon,dom,dque,
				 domcl,FL,darr,qr,geom,Mag,Chrt,chThem,chAx,chLin,Ttip,O,tts,ready,sB,MT,asp,require){
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
	var WIN=window,grStore=null, rowStore,erow,mmt,identifyUp,eS=E.symbol,eD=E.dijit,on=O,runIT,ghd,IE=!!document.all,
	lph,cros=dom.byId("cros"),arro=dom.byId("arro"),cross,Popup,ie9,DOC=document,mouseDownTimeout,previousRecentTarget,
	pst=dom.byId("pst"),dockedx="",dockedy="", DJ=dojo,zSlid=dom.byId("mapDiv_zoom_slider"),scaleBarLabels,
		stopCroClick,identOff=1,meC=null,lP=dom.byId("lP"),linArr,imHead,currentOID=null,MAP=map,noClick=dom.byId("noClick"),cHead,boxSave,dScroll,dlLink=dom.byId("dlLink"),
		rP=dom.byId("rP"),idCon=dom.byId("idCon"),grid,irP=dom.byId("irP"),ilP=dom.byId("ilP"),drP=dijit.byId("rP"),resCon=dom.byId("resCon"), checkTrack=[],
		measur=dom.byId("measur"),mea=dom.byId("mea"),ident=dom.byId("ident"),identHandle,zoomEnd,grCon,croClick,lPar,tsNode,timeDiv=dom.byId('timeDiv'),paneIsShowing=0,
		bmaps=dom.byId("bmaps"),shoP=dom.byId("shoP"),outlines,spl=dom.byId("lP_splitter"),clSh,mdLink=dom.byId("mdLink"),currentMeaTool,
		fex=dom.byId("fex"),imOn=0,maOn=1,zFun,imON,maON,laOff,phys=dom.byId("phys"),imag=dom.byId("imag"),lC,processTimeUpdate,daGrid,sLev=8,geoSer,crossTool={},identTool={},meaTool={},
		movers=dque(".mov"),tiout,esav,firstHan,rpCon=dom.byId("rpCon"),tiload,outBounds=[],crossOpen=0,crossHandle,runIdent,runMea,lastActive=null,
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
		(function(){ //ALL KINDS OF SLOP, FIX ME
		var i=0,fsFeats=fs.features,j=fsFeats.length;
		for(;i<j;i++){
			var intData={},gpr=fsFeats[i].attributes;
			intData["__Date"]=gpr["Date"];	
			var dte=new Date(gpr["Date"]),
			dst=dte.toUTCString();
			dst=dst.charAt(6)===" "?dst.substring(0,5)+"0"+dst.substring(5):dst; //ieFix
			intData["Date"]=dst.slice(12,16)+"-"+((1+dte.getUTCMonth())<10?"0"+(1+dte.getUTCMonth()):(1+dte.getUTCMonth()))+"-"+dst.slice(5,7);
			intData["Project"]=(gpr["Project"].length<6?"Soil Sed. "+gpr.Project:gpr.Project);
			intData["OBJECTID"]=gpr["OBJECTID"];
			gdata.push(intData);
		}
	})();
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
	//	gdata=null;
		lC=copColl(grid);
		scal= new sB({map:MAP});
		scaleBarLabels=dque('.esriScalebarLabel');
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
				WIN.setTimeout(addLays,50);
				}
			}
			addLays();
		});
    	rpCon.style.cssText="width:100%;height:"+(rP.scrollHeight-60)+"px;";
    	helpPane.style.opacity=0;

   	DJ.connect(tiout,"onUpdateEnd",function(e,f,g,h){ //called on every zoom (due to refresh). allows feature updating
   		creCov(tiout.graphics);							//setup an onupdatestart that sets the visibility to false to avoid _surface typeerrors if they come
    	});
   		ie9=(DOC.all&&DOC.addEventListener&&!window.atob)?true:false;
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
		imHead=dque(".dgrid-resize-header-container",lph)[3];

		var tCount, timeSlider, sliderDiv, timeExtent = new E.TimeExtent();
		timeExtent.startTime = new Date("01/01/2010 UTC");
		timeExtent.endTime = new Date("12/31/2013 UTC");
		MAP.setTimeExtent(timeExtent);
		sliderDiv = dCon.create("div", null, timeDiv);
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
				linArr[0].style.cssText="text-shadow:0 0 1px #73ef83;color:rgb(24,211,48);";
				linArr[3].style.cssText="text-shadow:0 0 1px #faa9a3;color:rgb(243,63,51);";
				linArr[2].style.cssText="text-shadow:0 0 1px #eef5ff;color:rgb(119,173,255);";
				linArr[1].style.cssText="text-shadow:0 0 1px #fee1f9;color:rgb(252,109,224);";
				scaleBarLabels.forEach(function(v){domcl.add(v,"whiteScaleLabels")});
			}else{
				linArr[0].style.cssText="text-shadow:0 0 1px #0a5c00;color:rgb(18,160,0);";
				linArr[1].style.cssText="text-shadow:0 0 1px #9a037c;color:rgb(221,4,178);";
				linArr[2].style.cssText="text-shadow:0 0 1px #0027ed;color:rgb(50,84,255);";
				linArr[3].style.cssText="text-shadow:0 0 1px #b00;color:rgb(255,0,0);";
				scaleBarLabels.forEach(function(v){domcl.remove(v,"whiteScaleLabels")});
			}
		}
		setLinkColor();
		linArr[linArr.length-1].style.cssText="text-shadow:1px 1px 1px #fff;color:rgb(0,0,0);";
		phys.style.cssText=cTex;

	/*	DJ.connect(MAP,"onMouseDragEnd",function(e){
			var currImg=dque("#mapDiv_layer0 img")[0];
			console.log(e,currImg);
			if(currImg){
				O(currImg,"click",function(e){console.log(e,"currImg")});
			}
	Looks like I'd need to ax click blockers..?
		})*/

		Popup=function(){
			var popupHandlers=[],popUp,popStyle,popHeader,headStyle,popContainer,conStyle,
				popSplitterV,splitStyleV,popSplitterH,splitStyleH,popClose,self,
				popHeight=400,popWidth=600,edges={left:60,right:660,top:100,bottom:500},
				W=WIN,BS=body.style,px="px",innerWidth=W.innerWidth,innerHeight=W.innerHeight,
				docked={width:null,height:null},
			show=function(){
				console.log("showing");
				if(!popUp){
					console.log("popup doesn't exist")
					dCon.place('<link rel="stylesheet" href="popup.css">',dque('head')[0]);
					console.log("placed");
					popUp=dCon.place('<div id="popUp"><div id="popHeader"class="panehead"><span id="popTitle">Profile Tool</span><div id="popClose"class="closebox">X</div></div><div id="popContainer"></div><div id="popSplitterV"><div id="popLineV"></div></div><div id="popSplitterH"><div id="popLineH"></div></div></div>',body);
					console.log("popUp made",popUp);
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
					if(!W.requestAnimationFrame)(function(W){var eaf='equestAnimationFrame',raf='r'+eaf,Raf='R'+eaf;W[raf]=W['webkit'+Raf]||W['moz'+Raf]||W[raf]||(function(callback){setTimeout(callback,16)})})(W);
				}
				if(ie9){
					console.log("ie9");
					popStyle.left=edges.left+px;
					popStyle.top=edges.top+px;
				}else{
					console.log("not ie9");
					console.log(popUp.style.transform);
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
					O(popClose,"mousedown",function(){
						crossTool.stop();
						if(domcl.contains(cros,"idle")){
							domcl.remove(cros,"idle");
							outlines.disableMouseEvents();
					    }else if(domcl.contains(cros,"activeTool"))
							domcl.remove(cros,"activeTool");
					}),
					O(popHeader,"mousedown",move),             //e,dim,pageDim,max,otherSplitStyle,edgeTracker,oppositeEdge
					O(popSplitterV,"mousedown",function(e){self.resize(e,"width","pageX",innerWidth,splitStyleH,edges.left,"right")}),
					O(popSplitterH,"mousedown",function(e){self.resize(e,"height","pageY",innerHeight,splitStyleV,edges.top,"bottom")})
					];
				}
			},

			removeHandlers=function(){
				darr.forEach(popupHandlers,function(v){
					v.remove();
				});
				popupHandlers=[];
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

			var mM=O(W,"mousemove",triggerMove);

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
					splitStyleH.width=nWid-2+px;
					popWidth=nWid;
				}
				if(popHeight!==nHei&&nHei>=minSize){	//actual height shrinking/growing limited to 120
					popStyle.height=nHei+px;
					splitStyleV.height=nHei-2+px;
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
			resize=function(e,dim,pageDim,max,otherSplitStyle,edgeTracker,oppositeEdge){
				BS["-webkit-user-select"]="none";
				BS["-moz-user-select"]="none";	
				var popconDiff=(dim==="width"?7:34),resizeReady=1,min=120,
					mM=O(W,"mousemove",triggerResize);

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
								otherSplitStyle[dim]=newDim-2+px;
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
			charts=[], chartId, chartCount=1, crossCount=0,p1, p2,reqQueue=[],freeToReq=1,
			updateReady=1, tls, tlin, containerNode,layerIdsFound,exportHandlers=[],
			lSy=new eS.SimpleLineSymbol(sls,new inD.Color([0,0,0]),2),
			pSy=new eS.SimpleMarkerSymbol({"size":6,"color":new DJ.Color([0,0,0])}),
			graylSy=new eS.SimpleLineSymbol(sls,new inD.Color([180,180,180]),2),
			graylSyOut=new eS.SimpleLineSymbol(sls,new inD.Color([180,180,180]),1),
			graySy=new eS.SimpleMarkerSymbol({"size":6,"color":new DJ.Color([140,140,140]),"outline":graylSyOut}),
			hovSy=new eS.SimpleMarkerSymbol(eS.SimpleMarkerSymbol.STYLE_CIRCLE,15,lSy,new inD.Color('#4879bc')),
			
			update= function(point){
					tlin=new inEG.Polyline(sR)
					tlin.addPath([p1, point]);
					tls.setGeometry(tlin);
					updateReady=1;	
			},
			moveLine=function(e){
				if(updateReady){							
					W.requestAnimationFrame(function(){update(e.mapPoint)});
					updateReady=0;
				}
			},
			reqWhenAble=function(){
				if(freeToReq)
					rendGr(pSy,p1,p2,chartCount,crossCount);
				else
					reqQueue.push({p1:p1,p2:p2,chartCount:chartCount,crossCount:crossCount});
				chartCount++;
				crossCount++;
			},
			addSecondPoint=function(point){
				update(point);
				p2=point;
				addSymbol(p2,pSy,graphics[crossCount]);
				inD.disconnect(self.handlers[2]);
				inD.disconnect(self.handlers[3]);
				self.handlers[2]=null;
				self.handlers[3]=null;
				self.handlers[1]=inD.connect(inMap,"onMouseUp",function(e){
					if(e.pageX<mouseDownX+10&&e.pageX>mouseDownX-10&&e.pageY<mouseDownY+10&&e.pageY>mouseDownY-10)
						addFirstPoint(e.mapPoint)});
				if(!layerIdsFound)
					findLayerIds(p2,true);
				else reqWhenAble();
			},
			addFirstPoint=function(point){
				console.log("fired");
				layerIdsFound=0;
				p1=point;
				graphics[crossCount]=[];
				if(freeToReq)
					findLayerIds(p1);
				addSymbol(p1,pSy,graphics[crossCount]);
				tls=addSymbol(null,lSy,graphics[crossCount]);
				inD.disconnect(self.handlers[1]);
				self.handlers[1]=null;
				self.handlers[2]=inD.connect(inMap,"onMouseMove",moveLine);
				self.handlers[3]=inD.connect(inMap,"onMouseUp",function(e){
					if(e.pageX<mouseDownX+10&&e.pageX>mouseDownX-10&&e.pageY<mouseDownY+10&&e.pageY>mouseDownY-10)
						addSecondPoint(e.mapPoint)
				});
			},
			findLayerIds=function(mapPoint,point2){
				var lids=[],
				lDef=runIT(mapPoint,true).then(function(v){ //v is an array with an layerIds and one of values
						if(v[0].length){
							offsetStep=v[0].length-1;
							layerIdsFound=1;
							v[2].layerIds=v[0];
							chartId=outlines.graphics[v[0][0]].attributes.Project;
							if(point2) reqWhenAble();
					    }else{
					    	if(!point2){
								graphics[crossCount][0].setSymbol(graySy);
								graphics[crossCount][1].setSymbol(graylSy);
							}else{
								graphics[crossCount][2].setSymbol(graySy);
								crossCount++
							}
						}
				});					
			},
			execNextReq=function(rq){
					var next=rq.shift();
					rendGr(pSy,next.p1,next.p2,next.chartCount,crossCount);
			},
			createChart=function(xmax,ymin,chartCount){
				gOffset+=4; //gOffset gets parent of current graph points, offset to skip axes, labels
				var charDiv=dCon.create("div", {height:"350px"}, containerNode),
					chart = new Chrt(charDiv);
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

			    //exportLink=DOC.getElementsByClassName('exportChart')[0];
			  //  exportLink.textContent="ALALALALALALALALA";
			  //if window.navigator.saveAsBlob... (blob,name)
			  //if ie9 sorry bro
			  //check if image or xyz
			  //if so, dom to canvas, by creating a blob with ?svg+xml? type
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
					chartArr=[],
					ii=0,
					requestStep=15,
					curP=new inEG.Point(p1.x,p1.y,sR),
					addSymb=addSymbol,
					makeReq;
				freeToReq=0;
				addTextSymbol(chartCount,p1,10*M.cos(0.87+ang),10*M.sin(0.87+ang),graphics[crossCount]);

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
								if(!symCreated)symCreated=addSymb(inPoi,sy,gfx);//add once (for multiple)
							}										
						}

						resultCount++;
						if(chartArr[0].length>0){
							i=0;
						    if(resultCount>requestStep){ //add data from chartArr structure to chart
								for(;i<j;i++)chart.addSeries(i,chartArr[i]);
		    					chart.addAxis("y", {vertical:true,min:chartMin,max:5,title:"(ft)",titleGap:8});
						    	chart.render();
						    	requestStep+=15;
					    	} 
						}
					}else resultCount++;
					if(deferredCount===resultCount&&chartArr[0].length>0){
				    	for(;i<j;i++)chart.addSeries(i, chartArr[i]);
				    	chart.addAxis("y", {vertical:true,min:chartMin,max:5,title:"(ft)",titleGap:8});
    					var tip = new Ttip(chart, "default"); //edits in the module for positioning/height tooltip.js
    					var mag = new Mag(chart, "default");
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
				    	console.log(chart);
				    	addSwellHandlers(graphics[crossCount],gOffset,hovSy);
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
			addSwellHandlers=function(gfxArr,gOff,hovSy){
				var currNum,gTags=DOC.getElementsByTagName("g"),
				graphh=gTags[gOff],pathss,pathObj={};
				if(graphh){
					pathss=graphh.firstChild.childNodes;
					for(var i=1;i<pathss.length;i+=2){ //below is distance from left edge
						pathObj[pathss[i].getAttribute("path").slice(1,6)]=(i/2>>0)+gfxOffset;
					}
					graphHandlers.push(O(graphh,"mouseover",function(e){
			    		var et=e.target.getAttribute("path").slice(1,6);
			    		if(pathObj[et]!==undefined){
			    				currNum=pathObj[et];
			    		}
			    		if(currNum!==undefined) //used to be setSymbol ->hovSy ->pSy
			    			addSymbol(gfxArr[currNum].geometry,hovSy,gfxArr);
			    	}));
			    	graphHandlers.push(O(graphh,"mouseout",function(e){
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
				var conStyle=con.style,charDivs=con.childNodes,
				mup=O(W,"mouseup",function(e){
					var nextWid=conStyle.width.slice(0,-2)-18+"px";
					conStyle.visibility="hidden";
					for(var i=0;i<charDivs.length;i+=2){
						charDivs[i].style.width=nextWid;
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
				O(cros,"mousedown",function(e){
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
				self.handlers.forEach(function(v,i){
							inD.disconnect(v);
							self.handlers[i]=null;

					});
				outlines.enableMouseEvents();
			},
			revive:function(){
				outlines.disableMouseEvents();
				self.handlers[0]=inD.connect(inMap, "onMouseDown", function(e){mouseDownX=e.pageX;mouseDownY=e.pageY;});
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
				graphList=[];
				charts.forEach(function(v){v.destroy();});
				charts=[];
				clearNode(containerNode);
				container.hide();
				for(var i=0,j=graphics.length;i<j;i++){  
					for(var ii=0;ii<graphics[i].length;ii++)
						mapGfx.remove(graphics[i][ii]);
					graphics[i]=[];
				}
			}
		};
	};
	crossHandle=O(cros,"mousedown",function(e){
		if (domcl.contains(cros,"clickable")){
			crossHandle.remove();
			crossHandle=null;
			crossTool=crossTool(Popup=Popup());
			crossTool.init(e);
		}else
			whyNoClick();					
	});

		

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
			var idPos=irP.offsetHeight+35,i=0,j=movers.length;
			paneIsShowing=1;
			arro.style.backgroundPosition="-32px -16px";
			if(ie9){
				fx.animateProperty({node:idCon,duration:150,properties:{top:idPos}}).play();
				for(;i<j;i++){
				if(movers[i]===rP)
					fx.animateProperty({node:movers[i],duration:300,easing:easing.quadOut,properties:{marginRight:0}}).play();
				else fx.animateProperty({node:movers[i],duration:300,easing:easing.quadOut,properties:{marginRight:285}}).play();
				}
			}else{
				for(;i<j;i++)
					domcl.add(movers[i],"movd");
			}
		}

		function hidePane(){
			var idPos=irP.offsetHeight+35,i=0,j=movers.length;
			paneIsShowing=0;
			arro.style.backgroundPosition="-96px -16px";
			if(ie9){
				fx.animateProperty({node:idCon,duration:150,properties:{top:idPos}}).play();
				for(;i<j;i++){
				if(movers[i]===rP)
					fx.animateProperty({node:movers[i],duration:250,easing:easing.quadIn,properties:{marginRight:-285}}).play();
				else fx.animateProperty({node:movers[i],duration:250,easing:easing.quadIn,properties:{marginRight:0}}).play();
				}
			}else{
				for(;i<j;i++)
					domcl.remove(movers[i],"movd");
			}
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
			var offs=MAP.extent.getWidth()/MAP.width,currTime=timeSlider.getCurrentTimeExtent();
			offs=offs>10?offs:10;
			tiout.setMaxAllowableOffset(offs);
			tiout.refresh();
			console.log(currTime);
			processTimeUpdate(currTime);
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
			var expandReady=1,mM,W=WIN;
			if(!W.requestAnimationFrame)(function(W){var eaf='equestAnimationFrame',raf='r'+eaf,Raf='R'+eaf;W[raf]=W['webkit'+Raf]||W['moz'+Raf]||W[raf]||(function(callback){setTimeout(callback,16)})})(W);

			mM=O(W,"mousemove",triggerExpand);

			on.once(W,"mouseup",function(evt){
				MAP.resize();
				mM.remove();
			});
			function expand(e){
				grCon.style.width= lHead.style.width;
				expandReady=1;
			}
			function triggerExpand(e){
				if(expandReady){
					W.requestAnimationFrame(function(){expand(e)});
					expandReady=0;
				}
			}
		});


		O(WIN, "resize",function(e){			//resize map on browser resize
			MAP.resize();
			grid.resize();
			rpCon.style.cssText="width:100%;height:"+(rP.scrollHeight-60)+"px;";
			fx.animateProperty({node:idCon,duration:150,properties:{top:irP.offsetHeight+35}}).play();

		});

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
		}
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
					var openTest=dque(".movd").length;
					if(openTest)
						domcl.add(measur,"mov movd");
					else domcl.add(measur,"mov");
					movers=dque(".mov")
					toolToggle(e,meaTool)
					O(mea,"mousedown",function(e){toolToggle(e,meaTool)});
					asp.after(mmt,"setTool",function(tool,flag){
						console.log(tool,flag);
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
		}


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
			function renderIdent(idArr){
				if(idArr){
					resCon.innerHTML=resCon.innerHTML+"<p></p>";
					if(idArr[0][0]){
					idArr[0].forEach(function(v,i){
					if(idArr[1][i].value==="NoData")
						setNoData();
					else
						resCon.innerHTML=resCon.innerHTML+idCount+".&nbsp;"+outlines.graphics[v].attributes.Project+": "+Math.round(idArr[1][i].value*10)/10+ " ft<br/>";
					});
					}else{
						setNoData();
					}		
					rpCon.scrollTop=rpCon.scrollHeight;
					idCon.style.top=irP.offsetHeight+35+"px";
				}
			}
			function clickCallback(point){
				addIdentGraphic(point);
				runIT(point,true).then(function(idArr){
					renderIdent(idArr);
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
					O(ident,"mousedown",function(e){
						if(domcl.contains(ident,"clickable"))
							return toolToggle(e,self);
						else whyNoClick();
					});		
				},							
				start:function(){
					this.revive();
					rpCon.scrollTop=rpCon.scrollHeight;
					idCon.style.top=irP.offsetHeight+35+"px";
					idCon.style.display="block";
					if(rP.style.marginRight=="-16.9%")
						clSh();
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
				}
			};	
		};

		identHandle=O(ident,"mousedown",function(e){
			if(domcl.contains(ident,"clickable")){
				identHandle.remove();
				identHandle=null;
				identTool=identTool();
				identTool.init(e);
			}else
				whyNoClick();
		});

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
			var et=e.target;
			if(!et.firstChild||				
				domcl.contains(et.firstChild,"dgrid-resize-header-container")||
				domcl.contains(et,"dgrid-resize-header-container")||
				domcl.contains(et,"field-Image")||
				domcl.contains(et,"dgrid-input"))
					return;
			if(et!==previousRecentTarget){
				window.clearTimeout(mouseDownTimeout);
				previousRecentTarget=et;
				mouseDownTimeout=WIN.setTimeout(function(){previousRecentTarget=null;},400);
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
		 }
		});

		grid.on(".dgrid-cell:dblclick",function(e){                 //grid dblclick handler
			var iSt=e.target, inpz,oid=getOBJECTID(e);
			if(oid){
				var eg=outlines.graphics[oid-1],
					gOe=otg(oid);
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
				var ega=e.graphic.attributes,oid=ega.OBJECTID,scroT=dScroll.scrollTop;
				if(oid!==previousRecentTarget){
				window.clearTimeout(mouseDownTimeout);
				previousRecentTarget=oid;
				mouseDownTimeout=WIN.setTimeout(function(){previousRecentTarget=null;},400);
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
			}
		});

		DJ.connect(outlines, "onDblClick", function(e){						//map dblclick handler
			var inpz,ega=e.graphic.attributes,oid=ega.OBJECTID,er=getGrid(e);
			if(!outBounds[oid]){
			grStore=oid;                                    
			rowStore=er;
			currentOID=oid;
			inpz=rowStore.childNodes[0].childNodes[3].childNodes[0];
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
				dL.setVisibleLayers(["-1",13, 1, 11, 15, 0, 3, 77, 80, 83, 86, 26, 97, 91, 88, 74, 103, 71, 66, 65, 54, 44, 34, 32, 29, 100, 6, 5, 2, 12, 61, 62, 79, 53, 82, 76, 43, 25, 85, 90, 93, 96, 33, 99, 31, 28, 73, 102, 4, 14, 7,17, 55, 45, 46, 37, 56, 18, 78, 75, 95, 98, 92, 87, 70, 72, 67, 94, 69, 47, 57, 19, 81, 84, 89, 101, 35, 36, 30, 27, 8, 106, 20, 58, 38, 48, 10, 9, 16, 21, 59, 49, 39, 104, 40, 22, 50, 60, 63, 23, 51, 41, 52, 24, 42, 64, 68, 107, 105]);
				if(!MAP.layerIds[2]){
					MAP.addLayer(dL);
				}


			}
		});

		O(grid,".dgrid-input:change",function(e){                             //actual display/clear logic	
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
		processTimeUpdate=function(e){  //grid logic on timechange INEFFICIENT Use hash. Sorting at end is poor
			console.log(e);
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

		DJ.connect(timeSlider, "onTimeExtentChange",processTimeUpdate); //handle time extent change

		function whyNoClick(){
			noClick.style.zIndex="100";
			fx.animateProperty({node:noClick,duration:75,properties:{opacity:1}}).play();

			WIN.setTimeout(function(){fx.animateProperty({node:noClick,duration:150,properties:{opacity:0},
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

		function processId(tA,pA){
			var def=tA.execute(pA);
				return def.then(function(v){
					var output=[[],[],pA],lids=[],inpArr;
					if(v.length>0){
					lids=[],inpArr=dque(".field-Image",ilP);
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
				}
				return output;
				});
		}
		function initId(e){ //id logic... cross section tool feeds here as well.. this gets set up lazily also
			require(["esri/tasks/identify"],function(ide){
				var lotsOfLayers=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106],
				idT= new eT.IdentifyTask("http://mrsbmapp00642/ArcGIS/rest/services/BATH/Web_Rr/MapServer"),
				idP= new eT.IdentifyParameters();
				idP.layerOption=eT.IdentifyParameters.LAYER_OPTION_VISIBLE;
				idP.layerIds=lotsOfLayers;
				idP.tolerance=1;
				idP.returnGeometry=true;
				idP.mapExtent=MAP.extent;
				identifyUp=true;
				runIT=function(geom,query){
					idP.height = MAP.height;
					idP.width  = MAP.width;
					idP.geometry=geom;
					if(query){
						idP.layerIds=lotsOfLayers;
						return processId(idT,idP,geom);
					}
					return idT.execute(idP);
				};
			});
		}
	WIN.setTimeout(clSh,300);
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