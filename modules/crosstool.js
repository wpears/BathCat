define( ['modules/addsymbol'
        ,'modules/addtextsymbol'
        ,'modules/tools'
        ,'modules/clearnode'
        ,'modules/cleargraphics'
        ,'modules/featureevents'
        ,'modules/canvasidentify'

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

        ,'esri/tasks/geometry'
        ,'esri/geometry/Polyline'
        ,'esri/geometry/Point'
        ,'esri/symbols/SimpleLineSymbol'
        ,'esri/symbols/SimpleMarkerSymbol'

        ],
function( addSymbol
        , addTextSymbol
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

        , geo
        , Polyline
        , Point
        , SimpleLine
        , SimpleMarker

        ){
  /* Provide a rasterLayer to query
   * A container to put the profiles in
   * An anchor on which clicking activates the tool
   * And an geoSearch instance, to provide quick layer identification
   */
  return function ( rasterLayer, container, anchor, geoSearch, options) {
    options=options?options:{};

    /* The crossTool implements the tool interface from modules/tools.
     * This module is initalized by calling the tool's init method.
     * The listeners/fns herein are coordinated around the tool's start/stop/revive/idle methods
     * See the creation of the crossTool object at the bottom of this module for more info
     */
    var crossTool
      , self
      , W = window
      , DOC = document

      , map = options.map||W.esri.map||W.map
        /*Use rastersShowing to toggle rasters on and off*/
      , rastersShowing = options.rastersShowing||null
      , eventFeatures = options.eventFeatures||[]
      , chartNames = options.chartNames||null
      , chartDates = options.chartDates||null
      , tooltip = options.tooltip||null

      , canvasIdentify = CanvasId(rasterLayer, map)
      , spatialRef = map.spatialReference
      , mapGfx = map.graphics
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
                CIRCLE:           "m-3, 0 c0,-5 7,-5 7, 0 m-7, 0 c0, 5 7, 5 7, 0",
                SQUARE:           "m-3,-3 l0, 7 7, 0 0,-7 z",
                DIAMOND:          "m0,-3 l3, 3 -3, 3 -3,-3 z",
                CROSS:            "m0,-3 l0, 7 m-3,-3 l7, 0",
                X:                "m-3,-3 l7, 7 m0,-7 l-7, 7",
                TRIANGLE:         "m-3, 3 l3,-7 3, 7 z",
                TRIANGLE_INVERTED:"m-3,-3 l3, 7 3,-7 z"}
    

      /*Profile constructor. Quite a bit of state managed herein*/
      /*Note the creation of a canvasid task when called*/
      , Profile = function(e1){
        this.e1 = e1;
        this.e2 = null;
        this.task = new canvasIdentify.task();
        this.results  =null;
        this.seriesCount = 0;
        this.pointObj =null;
        this.graphics = [];
        this.legend = null
        this.swellOver = null;
        this.swellOut = null;
        this.chart = null;
        this.charted = 0;
        this.chartContainer = null;
        this.chartNumber = currentNumber++;
        this.chartName = '';
        this.prepared = [];
    
    }



    /*
     * Functions for creating the points and line of each profile on the map
     * Also, functions that manage handlers and prepare/execute the canvas identify task
     */


    /*Track location of mousedowns to differentiate between clicks and pans*/
    , mouseCoords = function(){
      var mouseDownX, mouseDownY;

      return {
        set: function (e){
          mouseDownX = e.pageX;
          mouseDownY = e.pageY;
        },
        isNear: function(e){
          if(  e.pageX < mouseDownX+10
            && e.pageX > mouseDownX-10
            && e.pageY < mouseDownY+10
            && e.pageY > mouseDownY-10
            ) return 1;
          else return 0;
        }
      };  
    }()



    /*Create a new profile, add the first point, attach line movement and second point handlers*/
    , addFirstPoint = function(e1){
        if(e1.button == 2 || !mouseCoords.isNear(e1)) return;

        var profile = new Profile(e1)
          , mapPoint = e1.mapPoint
          , idArray
          ;

        profiles.push(profile);

        addSymbol(map, mapPoint, dataPointSymbol, profile.graphics);
        mouseLine = addSymbol(map, null, lineSymbol, profile.graphics);

        self.handlers[1].remove();
        self.handlers[2] = map.on("mouse-move", function(e){
          moveLine(mapPoint, e.mapPoint)
        });

        self.handlers[3] = map.on("mouse-up", function(e2){
          if(e2.button == 2){
            on.once(DOC.body,"contextmenu",blockEvent);
            return cancelProfile();
          }
          if(mouseCoords.isNear(e2))
            addSecondPoint(e1, e2, profile);
        });

        self.handlers[4] = map.on("zoom-start", cancelProfile);
        self.handlers[5] = map.on("pan-start", cancelProfile);

        idArray = findLayerIds(mapPoint,profile);
        profile.task.prepare(idArray);
        profile.chartName = chartNames[idArray[0]];
        profile.prepared = idArray;

    }



    /*Stop current profile*/
    , cancelProfile = function(){
      removeProfile();
      resetHandlers();
    }



    /*Remove saved profile and any graphics/charts it references*/
    , removeProfile = function (){
      var profile = profiles.pop();
      removeChartAndGraphics(profile);
      currentNumber--;
    }



    /*Reset handlers to inital state*/
    , resetHandlers = function(){
        self.handlers[2].remove();
        self.handlers[3].remove();
        self.handlers[4].remove();
        self.handlers[5].remove();
        self.handlers[1] = map.on("mouse-up", addFirstPoint);
    }



    /*Prevent an event from firing/propagating*/
    , blockEvent = function(evt){
        evt.stopPropagation();
        evt.preventDefault();
        return false;
    }



    /*Trigger a line update after the last update has completed*/
    , moveLine = function(p1, p2){
        if(updateReady){
          updateReady = 0;
          update(p1, p2)
        }
    }



    /*Update line geometry, mark readiness for next update*/
    , update = function(p1, p2){
        lineGeometry = new Polyline(spatialRef);
        lineGeometry.addPath([p1, p2]);
        mouseLine.setGeometry(lineGeometry);
        updateReady = 1;  
      }



    /*
     * Get the layers likely effected by the first point
     * Generate points in a square around the actual event point and look for effected
     * layers with geoSearch.
     * These layers get are fed to the canvas id task to be prepared for queries
     */
    , findLayerIds = function(mapPoint,profile){
      var mapX = mapPoint.x
        , mapY = mapPoint.y
        , d = 50
        , ids = []
        , idObj = {}
        ;

      for(var x=-d; x<=d; x+=d){
        for(var y=-d; y<=d; y+=d){
          
          var pnt = new Point({x:mapX+x, y:mapY+y, spatialReference:spatialRef});
          var result = geoSearch({mapPoint:pnt},0,1)

          for(var j=0; j<result.length;j++){
            idObj[result[j]] = 1;
          }
        }
      }

      for(var item in idObj){
        if(!rastersShowing||rastersShowing[item])
          ids.push(+item - 1);
      }

      return ids;
    }



    /*
     * Add the second point and the profile label. Reset the handlers to allow for the next profile
     * Build points of interest and execute the canvas id with them,
     * provding buildGraph to be called with the results when finished
     */
    , addSecondPoint = function(e1, e2, profile){
        var mp1 = e1.mapPoint
          , mp2 = e2.mapPoint
          ;
        profile.e2 = e2;

        moveLine(mp1, mp2);
        if(mp2.x === mp1.x&&mp2.y === mp1.y)return;

        addSymbol(map, mp2, dataPointSymbol, profile.graphics);
        
        resetHandlers();

        profile.pointObj = generatePoints(profile);
        addTextSymbol(map
                     ,profile.chartNumber
                     ,profile.e1.mapPoint
                     ,profile.pointObj.ang
                     ,0
                     ,profile.graphics
                     ,self.handlers
                     );
        setTimeout(function(){
          profile.task.execute(profile.prepared,profile.pointObj,buildGraph(profile));
        },10);
    }



    /*
     * Get difference in pixels and difference in feet between points 1 and 2
     * Find the distance between points in feet (3,6,9, etc)
     * Convert this into pixels.
     * Get the rise/run in pixels (gapInFt*M.sin(ang))
     * Return object containing generated points and info on the profile's angle and point spacing
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

          /*meters per web mercator meter can be approximated by the cosine of the current latitude*/
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

        /*Account for profiles drawn in any direction*/
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

        /*both x and y screen componented are flattened into the points array*/
        for(var i=0, len=points.length; i<len; i+=2){
          points[i]= M.round(initialX);
          points[i+1]=M.round(initialY);
          initialX += xGapPx;
          initialY += yGapPx;
        }

        return { points:points
               , xGap:xGapWmm
               , yGap:yGapWmm
               , ftGap:gapInFt
               , dist:distInFt
               , ang:ang
               };
    }



    /*After a successful canvas identify is executed, the following functions will be called*/



    /*Get a fn with the appropriate profile in its closure and build a chart for this profile*/
    , buildGraph = function(profile){
          var chart = createChart(profile)
            , min = 0
            ;

        return function(results){
          if(!results){removeProfile(); return}

          /*Release the event loop, needed if imgs are already cached*/
          setTimeout(function(){
            profile.results = results;

            /*Add each layer and get the lowest elevation from each result*/
            for (var layer in results){
              var series = results[layer];

              for(var i=0, len=series.length; i<len; i++){
                if (series[i].y < min) min = series[i].y;
              }

              chart.addSeries(chartDates[layer], series);
              profile.seriesCount++;
            }

            /*Finalize and display chart, attach chart to graphic handlers*/
            chart.addAxis("y", {vertical:true, min:min-5, max:5, title:"(ft)", titleGap:8});
            new Tooltip(chart, "default");
            new Magnify(chart, "default");
            chart.render();
            addLegend(profile);
            connectChartToGraphics(profile);
            profile.charted = 1;
          },0)
        };
    }



    /*Create a dojox chart. Height is based on the container height*/
    , createChart = function(profile){
        var conHeight = containerNode.clientHeight -70 + 'px'
          , chartContainer = construct.create("div", {style:{height:conHeight}}, containerNode)
          , chartDiv = construct.create("div", {style:{height:conHeight}}, chartContainer)
          , chart = new Chart(chartDiv)
          ;

        containerNode.scrollTop = containerNode.scrollHeight;

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
        chart.setTheme(chartTheme);

        profile.chart = chart;
        profile.chartContainer = chartContainer;
        
        addExportLink(profile);
        addCloseBox(profile);

        chart.render();
        return chart
    }



    /*Allow exporting of profile points as XYZs in Web Mercator*/
    , addExportLink = function(profile){
        var dlFileName = profile.chartName+'_Profile'+profile.chartNumber+'_'+'WebMercator.txt'
          , exLink = DOC.createElement("a")
          ;

        exLink.textContent = "Export";
        exLink.className = "export";

        if(W.Blob){
          /*IE10+*/
          if(W.navigator.msSaveBlob){
            exLink.onclick = function(){
              W.navigator.msSaveBlob(new W.Blob([generateString(profile)]), dlFileName)
            };
          }else{
            exLink.download = dlFileName;
            exLink.onmousedown = function(){
              exLink.href=W.URL.createObjectURL(new W.Blob([generateString(profile)]));
            };
          }
        }else{
          /*IE9, can't download dynamic profiles*/
          exLink.onclick = function(e){
            var noEx = construct.create("div",{class:"ie9noexport"}, exLink);
            noEx.textContent = "Exporting is only supported in modern browsers."
            W.setTimeout(function(){exLink.removeChild(noEx)}, 1500);
          }
        }

        if(ie9)exLink.style.color = "#FF0000";
        profile.chartContainer.appendChild(exLink);
    }



    /*Include per-profile closeboxes. Often users want to close just one graph*/
    , addCloseBox = function(profile){
        var box = DOC.createElement('div');
        box.className = "closebox graphclose";
        profile.chartContainer.appendChild(box);
        on.once(box, "click", function(){removeChartAndGraphics(profile,1);});
    }



    /*Make the XYZ contents for the export link*/
    , generateString = function(profile){
        var linkString = "x,y,z\n"
          , xGap = round(profile.pointObj.xGap, 2)
          , yGap = round(profile.pointObj.yGap, 2)
          , initialX = round(profile.e1.mapPoint.x, 2)
          , initialY = round(profile.e1.mapPoint.y, 2)
          , x
          , y

          /*advance x,y based on their geographic positions*/
          , buildString = function(pnt){
              var z = pnt.y;
              linkString+= x +','+ y +',' + z +'\n';
              x = round(x + xGap,2);
              y = round(y + yGap,2);
            }
          ;

        /*reset x,y to their initial values (the x,y coords of the first point)*/
        for (var dataset in profile.results){
          x = initialX;
          y = initialY;
          profile.results[dataset].forEach(buildString);
        }

        return linkString;
    }



    /*Round a number to a certain number of decimal places*/
    , round = function(numb, decimalPlaces){
        var M = Math
          , offset = M.pow(10,decimalPlaces)
          ;
        return M.round(numb*offset)/offset;
    }



    /*Make legend to differentiate overlapping datasets*/
    , addLegend = function(profile){
      var legendDiv = DOC.createElement('div');
      profile.chartContainer.appendChild(legendDiv);
      profile.legend = new Legend({chart:profile.chart, outline:false},legendDiv);
    }



    /*Add handlers that show graphics on the map when mousing over points on the profile*/
    , connectChartToGraphics = function(profile){
      /*arguments allocates context if nonstrict*/
      "use strict";
        var currNum
          , pathObj = {}
          , graph = profile.chartContainer.querySelector('g>g')
          , paths = graph.firstChild.childNodes
          , graphics = profile.graphics
          ;
        
        /*Get distance from left edge of the chart*/
        for(var i = 0; i < paths.length; i+= 2){
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



    /*Get a geographic point given a point's index*/
    , getPointFromProfile = function(index, profile){
        var obj = profile.pointObj
          , e1 = profile.e1
          , x = e1.mapPoint.x
          , y = e1.mapPoint.y
          , xDist = index*obj.xGap
          , yDist = index*obj.yGap
          ;
          return new Point({x:x+xDist,y:y+yDist,spatialReference:spatialRef})
    }


    
    /*Remove the UI, graphics, and handlers of a profile*/
    , removeChartAndGraphics = function(profile,single){
        if(single){
          if(profile.chartNumber === currentNumber-1)currentNumber--;

          for(var i = 0; i< profiles.length; i++){
            if (profiles[i] === profile){
              profiles.splice(i,1);
              break;
            }
          }

        }

        var chartCon = profile.chartContainer;

        if(chartCon){
          if(profile.charted){
            disconnectChartAndGraphics(profile);
            profile.legend.destroy();
          }
          profile.chart.destroy();
          clearNode(chartCon);
          containerNode.removeChild(chartCon);
        }

        clearGraphics(map,profile.graphics)
    }



    /*Remove mouseover handlers that create/remove graphics*/
    , disconnectChartAndGraphics = function(profile){
          profile.swellOver.remove();
          profile.swellOver = null;
          profile.swellOut.remove();
          profile.swellOut = null;
    }
     


    /*Connect every profile to its graphics (called after disconnecting them when resizing)*/
    , reattachGraphs = function(profiles){
        for (var i = 0, len = profiles.length; i < len; i++){
          connectChartToGraphics(profiles[i]);
          profiles[i].legend.refresh();
        }
    }



    /*Resize all the charts when the container has been resized. This is pretty slow and hard to optimize*/
    /*dojo needs the charts in the DOM to layout properly.. meaning we're deluging the page with reflows*/
    , resizeCharts = function(profiles){

        for(var i = 0, len = profiles.length;i<len;i++){
          disconnectChartAndGraphics(profiles[i]);
        }

        on.once(W,"mouseup", function(e){
          containerNode.style.visibility = "hidden";
          for(var i = 0, len = profiles.length; i < len ;i++){
            profiles[i].chart.resize();
          }
          containerNode.style.visibility = "visible";
          reattachGraphs(profiles);
        });
    };



    /*Implements the tool interface through which calling code triggers the module's functionality*/ 
    crossTool={

      handlers:[],

      /*Initialize the container, apply module-wide, long-lived handlers, save 'this' value*/
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
          if(dim === "width"&&profiles.length)
            resizeCharts(profiles);
          }, true);

        on(anchor, "mousedown", handleClick);

        on(container.getClose(),"click", function(){
            tools.wipe(crossTool, anchor, eventFeatures);
        });

        chartTheme.chart.fill="rgba(0,0,0,0)"
        chartTheme.plotarea.fill="rgba(0,0,0,0)"
        chartTheme.setMarkers(chartMarkers); 
      },

      /*Display the container and trigger revive*/
      start:function(){
        container.show();
        containerNode = container.getContainer();
        this.revive();
      },

      /*Remove handlers and reenable esri feature events*/
      idle:function(){
        for(var i = 0;i < self.handlers.length;i++){
          self.handlers[i].remove();
        }

        self.handlers.length = 0;   
        featureEvents.enable(eventFeatures)
      },

      /*Attach handlers and pause esri events on features*/
      revive:function(){
        featureEvents.disable(eventFeatures)
        self.handlers[0] = map.on("mouse-down", mouseCoords.set);
        self.handlers[1] = map.on("mouse-up", addFirstPoint);
      },

      /*After removing handlers, remove UI and graphics, then hide the container*/
      stop:function(){
        this.idle();
        currentNumber = 1;

        for(var i = 0, j = profiles.length;i < j;i++){
          removeChartAndGraphics(profiles[i]); 
        }

        clearNode(containerNode);
        container.hide();
        profiles.length = 0;
      } 
    };



    return crossTool;
  };
});