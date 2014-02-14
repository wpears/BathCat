define(['modules/addsymbol.js'
       ,'modules/addtextsymbol.js'
       ,'modules/identify.js'
       ,'modules/tools.js'
       ,'modules/featureevents.js'
       ,'modules/clearnode.js'
       ,'modules/cleargraphics.js'

        ,"esri/symbols/SimpleLineSymbol"
        ,"esri/symbols/SimpleMarkerSymbol"

       ,'dojo/on'
       ,'dojo/dom-class'
       ,'dojo/_base/Color'
       ],
function( addSymbol
        , addTextSymbol
        , Identify
        , tools
        , FeatureEvents
        , clearNode
        , clearGraphics

        , SimpleLine
        , SimpleMarker

        , on
        , domClass
        , Color
        ){    
  return function( anchor, url, layerArray, options ){
      var W = window
        , DOC = document
        , map = options.map||W.esri.map||W.map
        , rastersShowing = options.rastersShowing||null
        , eventFeatures = options.eventFeatures||[]
        , names = options.names
        , tooltip = options.tooltip||null
        , identify = Identify(url, map, layerArray, rastersShowing)
        , solidLine = SimpleLine.STYLE_SOLID
        , lineSymbol = new SimpleLine(solidLine, new Color([0, 0, 0]), 2)
        , dataPointSymbol = new SimpleMarker({"size":6,"color":new Color([0, 0, 0])})
        , noDataPointSymbol = new SimpleMarker(SimpleMarker.STYLE_CIRCLE, 6, new SimpleLine(solidLine, new Color([180, 180, 180]), 1), new Color([140, 140, 140]))
        , textLabel
        , self
        , mouseDownX
        , mouseDownY
        , listeners = []
        ;

   
//console.log(pass symbol to renderIdent)
// get point, add to graphic.
// on ident callback
//create a custom tooltip (just div with project name etc)
//attach handlers
// add textLabel with name

      function createTooltip(screenPoint){
        //NAVD88 Elevation
      }

      function setNoData(frag){
        var sp=DOC.createElement('span');
        sp.innerHTML=idCount+".&nbsp;"+"No Data";
        textLabel.setColor(new Color([180, 180, 180]));
        frag.appendChild(sp);
        self.graphics[self.graphics.length-1].setSymbol(noDataPointSymbol);
        self.labels[self.labels.length-1].setSymbol(textLabel);
      } 
      function renderIdent(idArr, sym, screenPoint){
          var noData = 1;
        if(idArr){
           var tooltip = createTooltip(screenPoint);
          idArr.forEach(function(v, i){
            if(noData && v.value !== "NoData")
              noData = 0;
            sp.innerHTML=idCount+".&nbsp;"+names.graphics[v.layerId].attributes.Project+": "+Math.round(v.value*10)/10+ " ft<br/>";
            frag.appendChild(sp);
            });
        }else{
          setNoData(frag);
        }
        textLabel = addTextSymbol(map, Math.round(idArr[0].value*10)/10, sym.geometry, 0, self.labels, self.handlers);
      }
        

      function clickCallback(e){
        var mapPoint = e.mapPoint;
        var screenPoint = e.screenPoint;
        var sym = addSymbol(map, mapPoint, dataPointSymbol, self.graphics);
        identify(mapPoint).then(function(idArr){
          renderIdent(idArr, sym, screenPoint);
        });
      }

      return {
        handlers:[],
        graphics:[],
        labels:[],
        init:function(e){
          self = this;
          buildPane();
          function handleClick(e){
            if(domClass.contains(ident,"clickable"))
              return tools.toggle(e, self);
            else 
              if (tooltip) tooltip(e);
          }
          handleClick(e);
          on(ident,"mousedown", handleClick);   
        },              
        start:function(){
          this.revive();
        },
        idle:function(){
          FeatureEvents.enable(eventFeatures)
          map.setMapCursor("default");
          this.handlers[0].remove();
          this.handlers[1].remove();
          if(this.handlers[2]) this.handlers[2].remove();
          this.handlers.length = 0;
          identOff = 1;
        },
        revive:function(){
          FeatureEvents.disable(eventFeatures)
          map.setMapCursor("help");
          this.handlers[0] = map.on("mouse-down", function(evt){mouseDownX = evt.pageX;mouseDownY = evt.pageY;});
          this.handlers[1] = map.on("mouse-up", function(e){
          if(e.pageX<mouseDownX+10&&e.pageX>mouseDownX-10&&e.pageY<mouseDownY+10&&e.pageY>mouseDownY-10)
            clickCallback(e)});
          identOff = 0;
        },
        stop:function(){
          if(DOC.getElementsByClassName("idle")[0] !== ident) this.idle();
          clearNode(resCon);
          clearGraphics(map,this.graphics);
          clearGraphics(map,this.labels);
          this.graphics.length = 0;
          this.labels.length = 0;
          
        },
        isShowing:function(){return DOC.getElementsByClassName("activeTool")[0] === ident||DOC.getElementsByClassName("idle")[0] === ident},
      };  
    }
});