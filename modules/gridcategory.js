define(["dojo/dom-class"],function(domClass){
  var count = 0;
  return function (grid, gdata, position, keyField, testVal, containerNode, shuffleTracker){
    var gridToggle
      , scroller = containerNode.childNodes[1]
      , toggleCount = count++
      , showing=true
      , OIDs = {}
      , node = document.getElementById(containerNode.id+"-row-"+position)
      , row = node.firstChild.firstChild
      , data = row.firstChild
      ;

      row.removeChild(row.childNodes[3]);
      row.removeChild(row.childNodes[1]);
      domClass.add(data,"gridToggle");
      domClass.remove(data,'dgrid-cell');

      setNode();

      for(var i = 0, j = gdata.length;i<j;i++){
          var curr = gdata[i];
          if(curr[keyField].slice(0,9)=== testVal) OIDs[curr.OBJECTID]=1;
      }

      hide(data);

      grid.on(".gridToggle:mousedown",function(e){
        if(showing){
          hide();
        }else{
          show();
        }
      });

      function hide(){
        domClass.remove(gridToggle,"gridToggleX");
        for(var i = 0, j = gdata.length;i<j;i++){
          var currOID = gdata[i].OBJECTID;
          var currRow = getRow(currOID);
          if(OIDs[currOID]) domClass.add(currRow,"hiddenGridToggle") 
        }
        showing = false;
      }

    function show(node){
      if(!showing){
        domClass.add(gridToggle,"gridToggleX");
      for(var i = 0, j = gdata.length;i<j;i++){
        var currOID = gdata[i].OBJECTID;
        var currRow = getRow(currOID);
        if(OIDs[currOID]) domClass.remove(currRow,"hiddenGridToggle")
      }
        showing = true;
      }
    }

    function getRow(oid){
        return scroller.firstChild.childNodes[shuffleTracker[oid-1]];
    }

    function addHighlight(oid){
      if(OIDs[oid]) domClass.add(gridToggle,"gridHighlight")
    }

    function removeHighlight(oid){
      if(OIDs[oid]) domClass.remove(gridToggle,"gridHighlight")
    }

    function setNode(){
      gridToggle = scroller.getElementsByClassName('gridToggle')[toggleCount];
    }

    return { addHighlight:addHighlight
           , removeHighlight:removeHighlight
           , setNode:setNode
           };
  };
})