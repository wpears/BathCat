define(["dojo/dom-class","modules/tools.js"],function(domClass,Tools){
    return function (tools, hideTools){
      for(var i=0; i < tools.length; i++){
        if(hideTools){
          domClass.replace(tools[i].anchor,"unclick","clickable");
        }else{
          if(tools[i].tool)Tools.wipe(tools[i].tool,tools[i].anchor,tools[i].eventFeatures)
          domClass.replace(tools[i].anchor,"clickable","unclick");
        }
      }
    }
});