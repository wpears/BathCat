define( ['modules/colorrampobject.js'
        ,'modules/addsymbol.js'
        ,'modules/addtextsymbol.js'
        ,'modules/identify.js'
        ,'modules/tools.js'
        ,'modules/clearnode.js'
        ,'modules/cleargraphics.js'
        ,'modules/featureevents.js'
        ,'modules/canvasidentify.js'
        ,'dojo/aspect'
        ,'dojo/on'
        ,'dojo/dom-class'
        ,'dojo/dom-construct'
        ,'esri/tasks/geometry'
        ,'dojox/charting/Chart'
        ,'dojox/charting/themes/PurpleRain'
        ,'dojox/charting/axis2d/Default'
        ,'dojox/charting/plot2d/MarkersOnly'
        ,'dojox/charting/action2d/Tooltip'
        ,'dojox/charting/action2d/Magnify'
        ],
function( rampObject
        , addSymbol
        , addTextSymbol
        , Identify
        , tools
        , clearNode
        , clearGraphics
        , featureEvents
        , CanvasId
        , aspect
        , on
        , domClass
        , construct
        , geo
        , Chart
        , chartTheme
        , axis2d
        , plot2dMarkers
        , Tooltip
        , Magnify
        ){  
  return function ( container, anchor, url, layerArray, options) {

      options=options?options:{};
      var crossTool
        , self
        , W = window
        , DOC = document
        , identify = Identify(url)
        , map = options.map||W.esri.map
        , rastersShowing = options.rastersShowing||layerArray //Use rastersShowing if you turn off rasters
        , eventFeatures = options.eventFeatures||[]
        , chartNames = options.chartNames||null
        , tooltip = options.tooltip||null
        , Symbol = esri.symbol //note this stuff isn't AMD. Esri's old requires used to just add 
        , geometry = esri.geometry //to their esri namespace. FIXME   
        , spatialRef = map.spatialReference
        , mapGfx = map.graphics
        , graphics = [[]]
        , gfxOffset = 4
        , graphHandlers =[]
        , graphList =[]
        , mouseDownY
        , mouseDownX
        , charts = []
        , charDivs = []
        , chartArray = []
        , chartId
        , chartCount = 1
        , crossCount = 0
        , reqQueue = []
        , freeToReq = 1
        , updateReady = 1
        , mouseLine
        , lineGeometry
        , containerNode
        , point1Found = 0
        , ie9 = (DOC.all&&DOC.addEventListener&&!window.atob)?true:false

        , simpleLine = Symbol.SimpleLineSymbol
        , simpleMarker = Symbol.SimpleMarkerSymbol
        , DJColor = dojo.Color
        , solidLine = Symbol.SimpleLineSymbol.STYLE_SOLID
        , lineSymbol = new simpleLine(solidLine, new dojo.Color([0, 0, 0]), 2)
        , dataPointSymbol = new simpleMarker({"size":6,"color":new dojo.Color([0, 0, 0])})
        , noDataLineSymbol = new simpleLine(solidLine, new dojo.Color([180, 180, 180]), 2)
        , noDataPointSymbol = new simpleMarker(simpleMarker.STYLE_CIRCLE, 6, new simpleLine(solidLine, new dojo.Color([180, 180, 180]), 1), new DJColor([140, 140, 140]))
        , hoverPointSymbol = new simpleMarker(simpleMarker.STYLE_CIRCLE, 15, lineSymbol, new dojo.Color('#4879bc'))
      

      , update = function(p1, p2){
          lineGeometry = new geometry.Polyline(spatialRef);
          lineGeometry.addPath([p1, p2]);
          mouseLine.setGeometry(lineGeometry);
          updateReady = 1;  
        }

      , moveLine = function(p1, p2){
          if(updateReady){
            updateReady = 0;
            update(p1, p2)            
          }
        }

      , reqWhenAble = function(p1, p2, chCount, crCount){
          if(freeToReq){
            rendGr(dataPointSymbol, p1, p2, chCount, crCount);
          }else{
            reqQueue.push({p1:p1, p2:p2, chCount:chCount, crCount:crCount});
          }
        }

      , secondMouseUp = function(e){
          if(e.pageX < mouseDownX+10&&e.pageX > mouseDownX-10&&e.pageY < mouseDownY+10&&e.pageY > mouseDownY-10)
            addFirstPoint(e.mapPoint)
        }

      , addSecondPoint = function(p1, p2, chCount, crCount){
          moveLine(p1, p2);
          if(p2.x === p1.x&&p2.y === p1.y)return;
          addSymbol(map, p2, dataPointSymbol, graphics[crCount]);
          dojo.disconnect(self.handlers[2]);
          dojo.disconnect(self.handlers[3]);
          self.handlers[2] = null;
          self.handlers[3] = null;
          self.handlers[1] = dojo.connect(map,"onMouseUp", secondMouseUp);
          findLayerIds(p2, p1, chCount, crCount);
        }

      , addFirstPoint = function(point){
          var chCount = chartCount, crCount = crossCount;
          chartCount++;
          crossCount++;
          point1Found = 0;
          graphics[crCount] = graphics[crCount] === undefined?[]:graphics[crCount];

          findLayerIds(point, null, chCount, crCount);

          addSymbol(map, point, dataPointSymbol, graphics[crCount]);
          mouseLine = addSymbol(map, null, lineSymbol, graphics[crCount]);

          dojo.disconnect(self.handlers[1]);
          self.handlers[1] = null;
          self.handlers[2] = dojo.connect(map, "onMouseMove", function(e){
            moveLine(point, e.mapPoint)
          });
          self.handlers[3] = dojo.connect(map,"onMouseUp", function(e){
            if(e.pageX < mouseDownX+10&&e.pageX > mouseDownX-10&&e.pageY < mouseDownY+10&&e.pageY > mouseDownY-10)
              addSecondPoint(point, e.mapPoint, chCount, crCount);
          });
        }

      , getPointAngle = function(p1, p2){
          return Math.atan((p1.y-p2.y)/(p1.x-p2.x));
        }

      , findLayerIds = function(mapPoint, p1ForReq2, chCount, crCount){
        console.log(arguments);
          if(!p1ForReq2){
            identify(mapPoint, true, layerArray, rastersShowing, map).then(function(v){ //v is an array with an array of layerIds and one of values
              console.log(v);
              if(v[0].length > 1||v[1][0].value!== "NoData"){
                offsetStep = v[0].length-1;
                point1Found = 1;
                v[2].layerIds = v[0];
                if(chartNames)
                  chartId = chartNames.graphics[v[0][0]].attributes.Project;//FIXME Service names
                else
                  chartId = v[1][0].layerName;
              }else{                                                          
                graphics[crCount][0].setSymbol(noDataPointSymbol);
                graphics[crCount][1].setSymbol(noDataLineSymbol);
              }
            });
          }else{
            if(point1Found){
              reqWhenAble(p1ForReq2, mapPoint, chCount, crCount);
            }else{
              identify(mapPoint, true, layerArray, rastersShowing, map).then(function(v){
                if(v[0].length > 1||v[1][0].value!== "NoData"){
                  offsetStep = v[0].length-1;
                  point1Found = 1;
                  v[2].layerIds = v[0];
                  if(chartNames)
                    chartId = chartNames.graphics[v[0][0]].attributes.Project;//FIXME Service names
                  else
                    chartId = v[1][0].layerName;
                  reqWhenAble(p1ForReq2, mapPoint, chCount, crCount);
                  }else{
                  graphics[crCount][2].setSymbol(noDataPointSymbol);
                }
              });
            }
          }         
        }

      , execNextReq = function(rq){
          var next = rq.shift();
          rendGr(dataPointSymbol, next.p1, next.p2, next.chCount, next.crCount);
      }

      , createChart = function(xmax, ymin, chartCount){
          charDivs[charDivs.length] = construct.create("div", {height:"350px"}, containerNode);
          var chart = new Chart(charDivs[charDivs.length-1]);
          chart.addPlot("default", {type: plot2dMarkers});
          chart.addAxis("x",{min:-1, max:Math.ceil(xmax), title:"(ft)", titleGap:8, titleOrientation:"away"});
          chart.addAxis("y", {vertical: true, min:ymin, max:5, title:"(ft)", titleGap:8});
            chart.title = "Profile "+chartCount+ ": "+ chartId;
            chart.titleFont = "italic bold normal 24px Harabara";
            chart.titleFontColor = "#99ceff"
            chartTheme.setMarkers({ CIRCLE:        "m-3, 0 c0,-5 7,-5 7, 0 m-7, 0 c0, 5 7, 5 7, 0",
                    SQUARE:        "m-3,-3 l0, 7 7, 0 0,-7 z",
                    DIAMOND:    "m0,-3 l3, 3 -3, 3 -3,-3 z",
                    CROSS:        "m0,-3 l0, 7 m-3,-3 l7, 0",
                    X:        "m-3,-3 l7, 7 m0,-7 l-7, 7",
                    TRIANGLE:    "m-3, 3 l3,-7 3, 7 z",
                    TRIANGLE_INVERTED:"m-3,-3 l3, 7 3,-7 z"}); 
            chart.setTheme(chartTheme);
            chart.render();
            charts[charts.length] = chart;
            containerNode.scrollTop = containerNode.scrollHeight;
            return chart;
        }

      , rendGr = function(sy, p1, p2, chartCount, crossCount){ 
          var M = Math,
            p1x = p1.x, //in web mercator meters
            p1y = p1.y,
            dx = p1x-p2.x,
            dy = p1y-p2.y,
            xng,
            yng,
            ang = M.atan(dy/dx),
            fromWmm = 0.3048*1.272,// 0.3048 meters in a foot 1.272 WM meters for normal meters at this latitude
            ftlen = M.sqrt(dx*dx+dy*dy)/fromWmm,        //increase distance between points starting
            maxPointsCorrection = M.ceil(ftlen/600)*3,  //at 600 in multiples of 3ft
            pointsInProfile = M.ceil(ftlen/maxPointsCorrection),
            chart,
            chartMin =-30,
            exLink,
            dlString = "x, y, z\r\n",
            dlFileName = chartId+'_Profile'+chartCount+'_'+'WebMercator.txt',
            deferredCount = 0,
            resultCount = 0,
            chartArr = chartArray,
            ii = 0,
            requestStep = 15,
            curP = new geometry.Point(p1.x, p1.y, spatialRef),
            addSymb = addSymbol,
            makeReq;
          freeToReq = 0;
          addTextSymbol(map, chartCount, p1, 10*M.cos(0.87+ang), 10*M.sin(0.87+ang), graphics[crossCount]);
          chartArr.length = 0;
          if(dx < 0){
            xng = maxPointsCorrection*fromWmm*M.cos(ang);
            yng = maxPointsCorrection*fromWmm*M.sin(ang);
          }else if(dx > 0){
            xng =-maxPointsCorrection*fromWmm*M.cos(ang);
            yng =-maxPointsCorrection*fromWmm*M.sin(ang);
          }else{
            yng =-maxPointsCorrection*fromWmm*M.sin(ang);
            xng = 0;
          }
          chart = createChart(ftlen, chartMin, chartCount);

          exLink = DOC.createElement("a");
            exLink.textContent = "Export";
            exLink.download = dlFileName;
            if(ie9)exLink.style.color = "#FF0000";
            containerNode.appendChild(exLink);

          makeReq = function(start, end){
            var gfx = graphics[crossCount], sy = dataPointSymbol;
            function parseResults (v){ //returning geometry to put in proper order on the graph
              if(v[0]){
              var i = 0, j = v.length, symCreated,
                inPoi = v[0].feature.geometry,
                xdiff = p1x-inPoi.x,
                lengthForChart = xng?M.abs(M.round(xdiff/xng)):M.abs(M.round((p1y-inPoi.y)/yng));
              //build chartArr from result data
              if(!chartArr[j-1])for(;ii < j;ii++)chartArr[ii] =[]; //build array if not built
              for (;i < j;i++){ //logic for multiple layers
                if(v[i].value!== "NoData"){ //for each layer add the corrected x value and 
                  dlString+= M.round(inPoi.x*10)/10+","+M.round(inPoi.y*10)/10+','+M.round(v[i].value*10)/10+"\r\n";
                  chartArr[i].push({x:lengthForChart*maxPointsCorrection, //depth to 
                            y:M.round(v[i].value*10)/10});       //tenths place
                  if(v[i].value < chartMin)chartMin =(v[i].value-10)>>0; //adjust chart height
                  if(!symCreated)symCreated =!!addSymb(map, inPoi, sy, gfx);//add once (for multiple)
                }                   
              }

              resultCount++;
              if(chartArr[0].length > 0){
                i = 0;
                  if(resultCount > requestStep){ //add data from chartArr structure to chart
                  for(;i < j;i++)chart.addSeries(i, chartArr[i]);
                    chart.addAxis("y", {vertical:true, min:chartMin, max:5, title:"(ft)", titleGap:8});
                    W.requestAnimationFrame(function(){chart.render()});
                    requestStep+= 15;
                  } 
              }
            }else resultCount++;
            if(deferredCount === resultCount&&chartArr[0].length > 0){
                for(;i < j;i++)chart.addSeries(i, chartArr[i]);
                chart.addAxis("y", {vertical:true, min:chartMin, max:5, title:"(ft)", titleGap:8});
                new Tooltip(chart, "default"); //edits in the module for positioning/height tooltip.js
                new Magnify(chart, "default");
                if(W.Blob){
                  if(W.navigator.msSaveBlob){
                    exLink.onclick = function(){
                      W.navigator.msSaveBlob(new W.Blob([dlString]), dlFileName)};
                  }else
                    exLink.href = W.URL.createObjectURL(new W.Blob([dlString]));
                }else{
                  exLink.onclick = function(e){
                    var noEx = construct.create("div",{class:"ie9noexport"}, exLink);
                    noEx.textContent = "Exporting is only supported in modern browsers."
                    W.setTimeout(function(){exLink.removeChild(noEx)}, 1500);
                  }
                }
                chart.render();
                addSwellHandlers(graphics[crossCount], getOffset(), hoverPointSymbol);
                chartArr.length = 0;
                if(reqQueue.length)
                  execNextReq(reqQueue);
                else freeToReq = 1;
              }
            }

            for(;start < end;start++){
            deferredCount++;
            identify(curP).then(parseResults);
            curP.x+= xng;
            curP.y+= yng;
            }
          };

          (function sendReq(i){
              var nextCall = i+180;
              if (nextCall>= pointsInProfile){
                makeReq(i, pointsInProfile);
              }else{
                W.setTimeout(sendReq, 150, nextCall)
                makeReq(i, nextCall);
              }
          })(0);
        }

      , exportImage = function(){
          //var sv = document.getElementsByTagName('svg')[1]
          //sv.setAttribute("xlmns", "http://www.w3.org/1999/xhtml");
          //var serialized = new XMLSerializer().serializeToString(sv);
          //lin.href = "data:application/octet-stream;base64," + btoa(serialized)
          //
        }

      , clearGraphHandlers = function(arr){
          for(var i = arr.length-1;i>= 0;i--){
            arr[i].remove();
            arr[i] = null;
            arr.length = i;
          }
        }

      , reattachGraph = function(gList){
          var len = gList.length, i = len-1, twolen = len*2;
            while(len < twolen){
              var curr = gList[i];
              addSwellHandlers.apply(null, curr);
              len++;
            }
          gList.length = i+1;
        }

      , resizeCharts = function(charts, con){
          clearGraphHandlers(graphHandlers);
          var charDivNumb = con.childNodes.length, conStyle = con.style,
          mup = on(W,"mouseup", function(e){
            conStyle.visibility = "hidden";
            for(var i = 0;i < charDivNumb;i+= 2){
              charts[i/2].resize();
            }
            conStyle.visibility = "visible";
            reattachGraph(graphList);
            mup.remove();
            mup = null;
          });
        }

      , getOffset = function(){
          var gs=DOC.getElementsByTagName("g")
            , offset = gs.length-4
            ;
            gs = null;
            return offset;
        }

      , addSwellHandlers = function(gfxArr, offset, hoverPointSymbol){
        "use strict"; //arguments allocates context if nonstrict
          var currNum
            , pathss
            , pathObj = {}
            , gs = DOC.getElementsByTagName("g")
            , graphh = gs[offset]
            ;
          gs = null;
            
          if(graphh){
            pathss = graphh.firstChild.childNodes;
            for(var i = 1;i < pathss.length;i+= 2){ //below is distance from left edge
              pathObj[pathss[i].getAttribute("path").slice(1, 6)] =(i/2>>0)+gfxOffset;
            }
            pathss = null;
            graphHandlers.push(on(graphh,"mouseover", function(e){
                var et = e.target.getAttribute("path").slice(1, 6);
                if(pathObj[et]!== undefined){
                    currNum = pathObj[et];
                }
                if(currNum!== undefined) //used to be setSymbol ->hoverPointSymbol ->dataPointSymbol
                  addSymbol(map, gfxArr[currNum].geometry, hoverPointSymbol, gfxArr);
            }));
            graphHandlers.push(on(graphh,"mouseout", function(){
              if(currNum!== undefined){ //there may be brittleness here. ie no hovered
                mapGfx.remove(gfxArr[gfxArr.length-1]);
                gfxArr.length = gfxArr.length-1;
              }
            }));
            graphList.unshift(arguments);
            gOffset+= offsetStep; //accomodate overlapping rasters
            offsetStep = 0;
          }
        };


    crossTool={
      handlers:[],
      init:function(e){
        function handleClick (e){
          if(domClass.contains(anchor,"clickable")){
            if(freeToReq) tools.toggle(e, self);
          }else{
            if (tooltip) tooltip(e);
          }
        }
        self = this;
        container.init();
        handleClick(e);

        aspect.after(container,"resize", function(e, dim){
          if(dim === "width"&&charts.length)
            resizeCharts(charts, containerNode);
          }, true);

        on(anchor, "mousedown", handleClick);

        on(container.getClose(),"mousedown", function(){
          if(freeToReq)
            tools.wipe(crossTool, anchor, eventFeatures);
        }); 
      },
      start:function(){
        container.show();
        containerNode = container.getContainer();
        this.revive();
      },
      idle:function(){
        for(var i = 0;i < self.handlers.length;i++){
          dojo.disconnect(self.handlers[i]);
          self.handlers[i] = null;
        }
        self.handlers.length = 0;   
        featureEvents.enable(eventFeatures)
      },
      revive:function(){
        featureEvents.disable(eventFeatures)
        self.handlers[0] = dojo.connect(map, "onMouseDown", function(e){mouseDownX = e.pageX;mouseDownY = e.pageY;});
        self.handlers[1] = dojo.connect(map,"onMouseUp", function(e){
        if(e.pageX < mouseDownX+10&&e.pageX > mouseDownX-10&&e.pageY < mouseDownY+10&&e.pageY > mouseDownY-10)
          addFirstPoint(e.mapPoint)});
      },
      stop:function(){
        this.idle();
        chartCount = 1;
        crossCount = 0;
        clearGraphHandlers(graphHandlers);
        graphList.length = 0;
        for(var i = 0, j = charts.length;i < j;i++){
          charts[i].destroy();
          charts[i] = null;
          clearNode(charDivs[i])
        }
        charts.length = 0;
        charDivs.length = 0;
        reqQueue.length = 0;
        chartArray.length = 0;
        clearNode(containerNode);
        container.hide();
        for(var i = 0, j = graphics.length;i < j;i++){  
          clearGraphics(map,graphics[i]);
          graphics[i].length = 0;
        }
      }
    };
    return crossTool;
  };
});