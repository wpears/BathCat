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
  return function( container, anchor, url, layerArray, options ){
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
        , idCount = 0
        , self
        , mouseDownX
        , mouseDownY
        , idCon
        , resCon
        ;

      function buildPane(){
        idCon = DOC.createElement('div');
        resCon = DOC.createElement('div');
        var idRes = DOC.createElement('strong');
        idCon.id='idCon';
        domClass.add(idCon, "atop selectable");
        idRes.id='idRes';
        idRes.title='NAVD 88 Elevation';
        idRes.textContent='Identify Results:';
        resCon.id='resCon';
        idCon.appendChild(idRes);
        idCon.appendChild(DOC.createElement('br'));
        idCon.appendChild(resCon);
        container.appendChild(idCon);
      }

      function addIdentGraphic(point){
        idCount++;
        addSymbol(map, point, dataPointSymbol, self.graphics);
        textLabel = addTextSymbol(map, idCount, point, 0, self.labels, self.handlers);
      }
      function setNoData(frag){
        var sp=DOC.createElement('span');
        sp.innerHTML=idCount+".&nbsp;"+"No Data";
        textLabel.setColor(new Color([180, 180, 180]));
        frag.appendChild(sp);
        self.graphics[self.graphics.length-1].setSymbol(noDataPointSymbol);
        self.labels[self.labels.length-1].setSymbol(textLabel);
      } 
      function renderIdent(idArr, idCount){
        if(idArr){
          resCon.appendChild(DOC.createElement('p')); //separate items with empty p
          var frag=DOC.createDocumentFragment();

          if(idArr[0]!==undefined){
            idArr.forEach(function(v, i){
              if(v.value === "NoData")
                setNoData(frag);
              else{
                var sp = DOC.createElement('span');
                sp.innerHTML=idCount+".&nbsp;"+names.graphics[v.layerId].attributes.Project+": "+Math.round(v.value*10)/10+ " ft<br/>";
                frag.appendChild(sp);
              }
            });
          }else{
            setNoData(frag);
          }
          resCon.appendChild(frag);
          frag=null;   
          rpCon.scrollTop = rpCon.scrollHeight;
        }
      }
      function clickCallback(point){
        addIdentGraphic(point);
        var identCount = idCount;
        identify(point).then(function(idArr){
          renderIdent(idArr, identCount);
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
          if(container.isDefault&&container.isDefault()){//container has start text
            container.replaceDefault();
          }else{
            container.show();
          }
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
            clickCallback(e.mapPoint)});
          identOff = 0;
        },
        stop:function(){
          this.idle();
          idCon.style.display = "none";
          clearNode(resCon);
          clearGraphics(map,this.graphics);
          clearGraphics(map,this.labels);
          this.graphics.length = 0;
          this.labels.length = 0;
          idCount = 0;
          if(container.isClear&&container.isClear()){
            container.setDefault();
          }
        },
        isShowing:function(){return DOC.getElementsByClassName("activeTool")[0] === ident||DOC.getElementsByClassName("idle")[0] === ident},
        getNode:function(){return idCon}
      };  
    }
});