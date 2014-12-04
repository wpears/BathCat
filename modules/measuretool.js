define(['esri/dijit/Measurement'
       ,'esri/units'
       ,'dojo/aspect'
       ,'dojo/dom-class'
       ,'dojo/on'
       ,'modules/tools'
       ,'modules/featureevents'
       ], function( Measurement, Units, aspect, domClass, on, tools, featureEvents){

return function(anchor, line, point, options){
  
  options=options?options:{};

  var measure
    , currentMeaTool = 'distance'
    , lastUnits={}
    , map = options.map||window.esri.map
    , eventFeatures=options.eventFeatures||[]
    , meaTool={
        init:function (e){           //start the measurement tool lazily when first clicked, less to load at once
          var DOC=document
            , container = DOC.createElement("div")
            ;
          container.id="measur";
          DOC.body.appendChild(container);
          measure = new Measurement({ map:map
                                    , lineSymbol: line
                                    , pointSymbol: point
                                    , defaultLengthUnit:Units.FEET
                                    , defaultAreaUnit:Units.SQUARE_MILES
                                    }, container);
          measure.startup();
          container = DOC.getElementById("measur"); //retain reference
          domClass.add(container,"atop selectable");

          tools.toggle(e, meaTool);

          on(anchor,"mousedown", function(e){tools.toggle(e, meaTool)});

          aspect.after(measure, "setTool", function(tool, flag){
            if(flag!== false){
              currentMeaTool = tool;
              if(lastUnits[tool]) measure._switchUnit(lastUnits[tool]);
              featureEvents.disable(eventFeatures);
              if(domClass.contains(anchor,"idle")){
                domClass.replace(anchor,"activeTool","idle");
                meaTool.revive();
              }
            }
          }, true);

          aspect.after(measure, "_switchUnit", function(unit){
            lastUnits[currentMeaTool]=unit;
          },true);

        },

        start:function(){
          measure.show();
          measure.setTool(currentMeaTool, true);
        },

        idle:function(){
          featureEvents.enable(eventFeatures);
          measure.setTool(currentMeaTool, false);
        },

        revive:function(){
          measure.setTool(currentMeaTool, true);
        },

        stop:function(){
          this.idle();
          measure.clearResult();
          measure.hide();
        }
      }
  return meaTool;
 }
});