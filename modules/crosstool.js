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
        ,'dojo/_base/Color'

        ,'dojox/charting/Chart'
        ,'dojox/charting/themes/PurpleRain'
        ,'dojox/charting/axis2d/Default'
        ,'dojox/charting/plot2d/MarkersOnly'
        ,'dojox/charting/action2d/Tooltip'
        ,'dojox/charting/action2d/Magnify'
        ,'dojox/charting/widget/SelectableLegend'
    //    ,'dojox/fx/scroll'

        ,'esri/tasks/geometry'
        ,'esri/geometry/Polyline'
        ,'esri/geometry/Point'
        ,'esri/symbols/SimpleLineSymbol'
        ,'esri/symbols/SimpleMarkerSymbol'

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
        , Color

        , Chart
        , chartTheme
        , axis2d
        , plot2dMarkers
        , Tooltip
        , Magnify
        , Legend
  //      , fx

        , geo
        , Polyline
        , Point
        , SimpleLine
        , SimpleMarker

        ){  
  return function ( rasterLayer, container, anchor, url, layerArray, options) {
console.log(options.chartNames)
      options=options?options:{};
      var crossTool
        , self
        , W = window
        , DOC = document
        , identify = Identify(url)
        , map = options.map||W.esri.map||W.map
        , rastersShowing = options.rastersShowing||layerArray //Use rastersShowing if you turn off rasters
        , eventFeatures = options.eventFeatures||[]
        , chartNames = options.chartNames||null
        , tooltip = options.tooltip||null
        , canId = CanvasId(rasterLayer, map)
        , spatialRef = map.spatialReference
        , mapGfx = map.graphics
        , mouseDownY
        , mouseDownX
        , profiles = []
        , currentNumber = 1
        , mouseLine
        , lineGeometry
        , updateReady = 1
        , containerNode
        , ie9 = (DOC.all&&DOC.addEventListener&&!window.atob)?true:false

        , solidLine = SimpleLine.STYLE_SOLID
        , lineSymbol = new SimpleLine(solidLine, new Color([0, 0, 0]), 2)
        , dataPointSymbol = new SimpleMarker({"size":6,"color":new Color([0, 0, 0])})
        , noDataLineSymbol = new SimpleLine(solidLine, new Color([180, 180, 180]), 2)
        , noDataPointSymbol = new SimpleMarker(SimpleMarker.STYLE_CIRCLE, 6, new SimpleLine(solidLine, new Color([180, 180, 180]), 1), new Color([140, 140, 140]))
        , hoverPointSymbol = new SimpleMarker(SimpleMarker.STYLE_CIRCLE, 10, lineSymbol, new Color('#4879bc'))

        , chartMarkers ={
                  CIRCLE:        "m-3, 0 c0,-5 7,-5 7, 0 m-7, 0 c0, 5 7, 5 7, 0",
                  SQUARE:        "m-3,-3 l0, 7 7, 0 0,-7 z",
                  DIAMOND:    "m0,-3 l3, 3 -3, 3 -3,-3 z",
                  CROSS:        "m0,-3 l0, 7 m-3,-3 l7, 0",
                  X:        "m-3,-3 l7, 7 m0,-7 l-7, 7",
                  TRIANGLE:    "m-3, 3 l3,-7 3, 7 z",
                  TRIANGLE_INVERTED:"m-3,-3 l3, 7 3,-7 z"}
      
      , round = function(numb, deci){
          var M = Math
            , offset = M.pow(10,deci)
            ;
          return M.round(numb*offset)/offset;
      }
      , update = function(p1, p2){
          lineGeometry = new Polyline(spatialRef);
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

      , startNewLine = function(e){
          if(e.pageX < mouseDownX+10&&e.pageX > mouseDownX-10&&e.pageY < mouseDownY+10&&e.pageY > mouseDownY-10)
            addFirstPoint(e)
        }

      , Profile = function(e1){
          this.e1 = e1;
          this.e2 = null;
          this.task = new canId.task();
          this.results  =null;
          this.pointObj =null;
          this.graphics = [];
          this.legend = null
          this.swellOver = null;
          this.swellOut = null;
          this.chart = null;
          this.chartContainer = null;
          this.chartNumber = currentNumber++;
          this.chartName = '';
          this.prepared = null;
      
      }

      , addFirstPoint = function(e1){
          var profile = new Profile(e1)
            , mapPoint = e1.mapPoint
            ;

          findLayerIds(mapPoint).then(function(v){
            profile.task.prepare(v[0]);
            profile.chartName = chartNames[v[0][0]].attributes.Project
            profile.prepared = v[0];
          });

          addSymbol(map, mapPoint, dataPointSymbol, profile.graphics);
          mouseLine = addSymbol(map, null, lineSymbol, profile.graphics);

          self.handlers[1].remove();
          self.handlers[2] = map.on("mouse-move", function(e){
            moveLine(mapPoint, e.mapPoint)
          });

          self.handlers[3] = map.on("mouse-up", function(e2){
            if(e2.pageX < mouseDownX+10&&e2.pageX > mouseDownX-10&&e2.pageY < mouseDownY+10&&e2.pageY > mouseDownY-10)
              addSecondPoint(e1, e2, profile);
          });
        }


      , findLayerIds = function(mapPoint){
          return identify(mapPoint, true, layerArray, rastersShowing, map)
      }  


      , addSecondPoint = function(e1, e2, profile){
          var mp1 = e1.mapPoint
            , mp2 = e2.mapPoint
            ;
          profile.e2 = e2;

          moveLine(mp1, mp2);
          if(mp2.x === mp1.x&&mp2.y === mp1.y)return;

          addSymbol(map, mp2, dataPointSymbol, profile.graphics);

          self.handlers[2].remove();
          self.handlers[3].remove();
          self.handlers[1] = map.on("mouse-up", startNewLine);

     //     findLayerIds(mp2).then(function(v){
      //      console.log(v,"about to execute");
       //     profile.task.execute(v[0],profile.pointObj,buildGraph(profile));
       //   });

          profile.pointObj = generatePoints(profile);
          console.log(profile.pointObj)
          addTextSymbol(map
                       ,profile.chartNumber
                       ,profile.e1.mapPoint
                       ,profile.pointObj.ang
                       ,profile.graphics
                       ,self.handlers
                       );
          setTimeout(function(){
            profile.task.execute(profile.prepared,profile.pointObj,buildGraph(profile));
          },10);
        }

      /*
       * Get difference in pixels and difference in feet.
       * Find the distance between points in feet (3,6,9, etc)
       * Convert this into pixels.
       * Get the rise/run in px (gapInFt*M.sin(ang))
       */
      , generatePoints = function(profile){
          var M = Math
            , mp1 = profile.e1.mapPoint
            , mp2 = profile.e2.mapPoint
            , sp1 = profile.e1.screenPoint
            , sp2 = profile.e2.screenPoint
            , initialX = sp1.x
            , initialY = sp1.y
            , mpdx = mp1.x-mp2.x
            , mpdy = mp1.y-mp2.y
            , spdx = initialX-sp2.x
            , spdy = initialY-sp2.y
            , ang = M.atan(mpdy/mpdx)
            , mPerWmm = M.cos((mp1.getLatitude()+mp2.getLatitude())/360*M.PI)
            , ftPerM = 3.28084
            , distInFt = M.sqrt(mpdx*mpdx+mpdy*mpdy)*mPerWmm*ftPerM
            , distInPx = M.sqrt(spdx*spdx+spdy*spdy)
            , gapInFt = M.ceil(distInFt/600)*3
            , gapInWmm = gapInFt/ftPerM/mPerWmm
            , gapInPx = gapInFt*distInPx/distInFt
            , pointsInProfile = M.ceil(distInFt/gapInFt + 1)
            , points = new Array(pointsInProfile*2)
            , xComponent = M.cos(ang)
            , yComponent = M.sin(ang)
            , xGapPx = gapInPx*xComponent
            , yGapPx = gapInPx*yComponent
            , xGapWmm = gapInWmm*xComponent
            , yGapWmm = gapInWmm*yComponent
            ;
          console.log("distInFt",distInFt,"points",pointsInProfile)
          if(spdx < 0){
            yGapPx = -yGapPx;
          }else if(spdx > 0){
            xGapPx = -xGapPx;
            xGapWmm = -xGapWmm;
            yGapWmm = -yGapWmm;
          }else{
            xGapPx = 0;
            yGapWmm = -yGapWmm;
            xGapWmm = 0;
          }

          for(var i=0, len=points.length; i<len; i+=2){
            points[i]= M.round(initialX);
            points[i+1]=M.round(initialY);
            initialX+= xGapPx;
            initialY+= yGapPx;
          }
          return { points:points
                 , xGap:xGapWmm
                 , yGap:yGapWmm
                 , ftGap:gapInFt
                 , dist:distInFt
                 , ang:ang
                 };
      }


      , buildGraph = function(profile){
            var chart = createChart(profile)
              , min = 0
              ;


          return function(results){
            setTimeout(function(){ //If cached, there is no release of the event loop
            profile.results = results;
            for (var layer in results){
              var series = results[layer];
              for(var i=0, len=series.length; i<len; i++){
                if (series[i].y < min) min = series[i].y;
              }
              chart.addSeries(layer, series);
            }

            chart.addAxis("y", {vertical:true, min:min-5, max:5, title:"(ft)", titleGap:8});
            new Tooltip(chart, "default"); //edits in the module for positioning/height tooltip.js
            new Magnify(chart, "default");
            chart.render();
          
            addSwellHandlers(profile);

            console.log(results);
          },0)                          //Build dlstring on click, utilizing args from closure.
          };                       //Create chart goes here. With some other stuff from late in
                                  // renderG.. since we know it is finished
        }


      , createChart = function(profile){
          var chartContainer = construct.create("div", {height:300}, containerNode)
            , chartDiv = construct.create("div", {height:300}, chartContainer)
            , chart = new Chart(chartDiv)
            ;
            containerNode.scrollTop = containerNode.scrollHeight;

        //   new fx({node:chartContainer,win:containerNode,duration:600}).play();

          chart.addPlot("default", {type: plot2dMarkers});
          chart.addAxis("x",{min:-1
                           , max:Math.ceil(profile.pointObj.dist)
                           , title:"(ft)"
                           , titleGap:8
                           , titleOrientation:"away"
                        });
          chart.addAxis("y", {vertical: true, min:-30, max:5, title:"(ft)", titleGap:8});
          chart.title = "Profile "+profile.chartNumber+ ": "+ profile.chartName;
          chart.titleFont = "italic bold normal 24px Harabara";
          chart.titleFontColor = "#99ceff"
          chartTheme.setMarkers(chartMarkers); 
          chart.setTheme(chartTheme);

          profile.chart = chart;
          profile.chartContainer = chartContainer;
          
          addExportLink(profile);
          addCloseBox(profile);

          chart.render();
          return chart
      }

      , generateString = function(profile){
          var linkString = "x,y,z\n"
            , xGap = round(profile.pointObj.xGap,2)
            , yGap = round(profile.pointObj.yGap,2)
            , initialX = round(profile.e1.mapPoint.x,2)
            , initialY = round(profile.e1.mapPoint.y,2)
            , x
            , y
            , buildString = function(pnt){
                var z = pnt.y;
                linkString+= x +','+ y +',' + z +'\n';
                x = round(x + xGap,2);
                y = round(y + yGap,2);
              }
            ;
          for (var dataset in profile.results){
            x = initialX;
            y = initialY;
            profile.results[dataset].forEach(buildString);
          }
          console.log(linkString)
          return linkString;
      }

      , addExportLink = function(profile){
          var dlFileName = profile.chartName+'_Profile'+profile.chartNumber+'_'+'WebMercator.txt'
            , exLink = DOC.createElement("a")
            ;
          exLink.textContent = "Export";
          exLink.className = "export";

          if(W.Blob){
            if(W.navigator.msSaveBlob){
              exLink.onclick = function(){
                W.navigator.msSaveBlob(new W.Blob([generateString(profile)]), dlFileName)};
            }else
              exLink.download = dlFileName;
              exLink.onmousedown = function(){
                exLink.href=W.URL.createObjectURL(new W.Blob([generateString(profile)]));
              }
          }else{
            exLink.onclick = function(e){
              var noEx = construct.create("div",{class:"ie9noexport"}, exLink);
              noEx.textContent = "Exporting is only supported in modern browsers."
              W.setTimeout(function(){exLink.removeChild(noEx)}, 1500);
            }
          }
          if(ie9)exLink.style.color = "#FF0000";
          profile.chartContainer.appendChild(exLink);
      }

      , addCloseBox = function(profile){
          var box = DOC.createElement('div');
          box.textContent = "X";
          box.className = "closebox graphclose";
          profile.chartContainer.appendChild(box);
          on.once(box, "mousedown", function(){removeChart(profile);});
      }

      , addLegend = function(profile){
        var legendDiv = DOC.createElement('div');
        legendDiv.className = "chartLegend";
        profile.chartContainer.appendChild(legendDiv);
        profile.legend = new Legend({chart:profile.chart, outline:true},legendDiv);
      }

      , exportImage = function(){
          //var sv = document.getElementsByTagName('svg')[1]
          //sv.setAttribute("xlmns", "http://www.w3.org/1999/xhtml");
          //var serialized = new XMLSerializer().serializeToString(sv);
          //lin.href = "data:application/octet-stream;base64," + btoa(serialized)
          //
        }
      
      , removeChart = function(profile){
          var chartCon = profile.chartContainer;
          clearSwellHandlers(profile);
          profile.chart.destroy();
          clearNode(chartCon);
          containerNode.removeChild(chartCon);
          clearGraphics(map,profile.graphics)
        }

      , clearSwellHandlers = function(profile){
            profile.swellOver.remove();
            profile.swellOver = null;
            profile.swellOut.remove();
            profile.swellOut = null;
        }
       
      , reattachGraph = function(profiles){
          for (var i = 0, len = profiles.length; i < len; i++){
            addSwellHandlers(profiles[i]);
          }
        }

      , resizeCharts = function(profiles){
        //maybe var frag = DOC.createDocumentFragment();
        //container node display none to prevent reflows
        //attach each graph to frag, remove from doc
        //append Child will do
        //This is a pain point. It takes a while.
          for(var i = 0, len = profiles.length;i<len;i++){
            clearSwellHandlers(profiles[i]);
          }
          on.once(W,"mouseup", function(e){
            containerNode.style.visibility = "hidden";
            for(var i = 0, len = profiles.length; i < len ;i++){
              profiles[i].chart.resize();
            }
            conStyle.visibility = "visible";
            reattachGraph(profiles);
          });
        }

      

      , addSwellHandlers = function(profile){
        "use strict"; //arguments allocates context if nonstrict
          var currNum
            , pathObj = {}
            , graph = profile.chartContainer.querySelector('g>g')
            , paths = graph.firstChild.childNodes
            , graphics = profile.graphics
            ;
          
          for(var i = 0; i < paths.length; i+= 2){ //below is distance from left edge
            pathObj[paths[i].getAttribute("path").slice(1, 6)] = i/2;
          }

          paths = null;

          profile.swellOver = on(graph,"mouseover", function(e){
              var et = e.target.getAttribute("path").slice(1, 6);
              if(pathObj[et]!== undefined){
                currNum = pathObj[et];
              }
              if(currNum!== undefined)
                addSymbol(map, getPointFromProfile(currNum,profile), hoverPointSymbol, graphics);
          });
          profile.swellOut= on(graph,"mouseout", function(){
            if(currNum!== undefined){
              mapGfx.remove(graphics[graphics.length-1]);
              graphics.length = graphics.length-1;
            }
          });
        }

      , getPointFromProfile = function(numb, profile){
          var obj = profile.pointObj
            , e1 = profile.e1
            , x = e1.mapPoint.x
            , y = e1.mapPoint.y
            , xDist = numb*obj.xGap
            , yDist = numb*obj.yGap
            ;
            return new Point({x:x+xDist,y:y+yDist,spatialReference:spatialRef})


        }
      ;



    crossTool={
      handlers:[],
      init:function(e){
        function handleClick (e){
          if(domClass.contains(anchor,"clickable")){
            tools.toggle(e, self);
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
          self.handlers[i].remove();
        }
        self.handlers.length = 0;   
        featureEvents.enable(eventFeatures)
      },
      revive:function(){
        featureEvents.disable(eventFeatures)
        self.handlers[0] = map.on("mouse-down", function(e){mouseDownX = e.pageX;mouseDownY = e.pageY;});
        self.handlers[1] = map.on("mouse-up", addFirstPoint);
      },
      stop:function(){
        this.idle();
        currentNumber = 1;
        
        for(var i = 0, j = profiles.length;i < j;i++){
          removeChart(profiles[i]); 
        } 
        clearNode(containerNode);
        container.hide();
        profiles.length = 0;
      } 
    };
    return crossTool;
  };
});
