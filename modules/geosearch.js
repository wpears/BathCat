define (["modules/splice.js"
        ],
function( splice
        ){
  return function(features, insideTimeBoundary, highlighter, showData){
    var graphics = features.graphics
      , featureCount = graphics.length
      , oidStore = new Array(featureCount + 1)
      , geoArr = new Array(featureCount)
      , geoBins = new Array(Math.ceil(featureCount/10))
      , splitGeoArr = new Array(geoBins.length)

      , selectedOIDs = []
      , prevArr = []
      , currArr = []
      , binLength = geoBins.length
      , lastClickBin = []
      , lastMouseBin = null
      ;


    //initialize geographic bins used to speed up geoSearch
    (function(){
      for(var i=0; i<featureCount; i++){
        var currExtent = graphics[i]._extent;

        geoArr[i] = { oid:graphics[i].attributes.OBJECTID,
                      xmin:currExtent.xmin,
                      xmax:currExtent.xmax,
                      ymin:currExtent.ymin,
                      ymax:currExtent.ymax
                    }
        oidStore[i] = 0;     
      }
      oidStore[featureCount] = 0;

      geoArr.sort(function(a, b){return a.xmin-b.xmin})


      for(var k = 0, l = geoBins.length-1; k<l; k++){
        geoBins[k] = geoArr[k*featureCount/10>>0].xmin;
        splitGeoArr[k] =[];
      }
      geoBins[l] = geoArr[featureCount-1].xmin;


      for(i = 0; i<featureCount; i++){
        var currGeo = geoArr[i];
        for(k = 0; k<l; k++){
          if(currGeo.xmin<= geoBins[k+1]&&currGeo.xmax>= geoBins[k])
            splitGeoArr[k].push(currGeo);
        }
      }
    })();



/************OID management functions****************/



    function clearStoredOID(oid, doSplice, fromGrid){
      var oidIndex = prevArr.indexOf(oid);
      highlighter(oid,"", 1);
      if(oidStore[oid]){
        oidStore[oid] = 0;
        if(fromGrid&&oidIndex>-1)splice(prevArr, oidIndex);
        if(doSplice)
          splice(selectedOIDs, selectedOIDs.indexOf(oid));
      }
    }

    function storeOID(oid){
      if(!oidStore[oid]){
        oidStore[oid] = 1;
        selectedOIDs.push(oid);
      }
    }

    function isStored(oid){
      return oidStore[oid]
    }

    function clearAllStoredOIDs(){
      for(var i = 0, j = selectedOIDs.length;i<j;i++)
          clearStoredOID(selectedOIDs[i], 0, 0);
      selectedOIDs.length = 0;
      prevArr.length = 0;
    }

    function clearAndSetOID(oid, attributes){
      clearAllStoredOIDs();
      storeOID(oid);
      prevArr.length = 1;
      prevArr[0] = oid;
      highlighter(oid,"hi", 1);
      showData(attributes);
    }


    function geoSearch(e, mouseDown){//think about using two sorted arrays, one mins one maxs
      var i, j, curr, oid, temp, binTemp, 
      mapX, mapY, breakMax, binArr, someTargeted = 0;

      if(e === null) binArr = lastMouseBin;
      else{
        mapX = e.mapPoint.x;
        mapY = e.mapPoint.y;
        breakMax = mapX+1000;

        for(i = 0, j = binLength-1; i<j; i++){ //find the right bin
          if(mapX<geoBins[i+1])
            break;
        }
        binArr = splitGeoArr[i]||splitGeoArr[i-1];
        lastMouseBin = binArr;
      }

      if(mouseDown&&binArr!== lastClickBin){
        clearAllStoredOIDs(); //clear other bin
        lastClickBin = binArr;
      }

      if (binArr)
        j = binArr.length;
      else
        j = 0;

      for(i = 0; i<j; i++){
        curr = binArr[i];
        oid = curr.oid;
        if(curr.xmin>breakMax&&!mouseDown){
          break;
        }
        if(insideTimeBoundary[oid]){
          if(curr.xmax>= mapX&&curr.xmin<= mapX&&curr.ymin<= mapY&&curr.ymax>= mapY){
            someTargeted = 1;
            highlighter(oid,"hi", 1);
        //    if(cursor){
          //    map.setMapCursor("pointer");
        //      cursor = 0;
     //       }
            if(mouseDown){
                currArr.push(oid);
                if(!oidStore[oid])
                  storeOID(oid);
            }
          }else{
            if(oidStore[oid]){
              //clear unclicked from this bin
              if(mouseDown)clearStoredOID(oid, 1, 0);
              continue;
            }else{
              //clear mouseover highlight. Have to do whole bin since might be multiple hl
              highlighter(oid,"", 1);
            }
          }
        }
      }
      
      if(mouseDown&&someTargeted){
        if(prevArr.length===currArr.length&&W.JSON.stringify(prevArr)=== W.JSON.stringify(currArr)){
          clearAllStoredOIDs();
          currArr.length = 0;
        }else{
          temp = prevArr;
          prevArr = currArr;
          temp.length = 0;
          currArr = temp;
        }
        showData(null);
      }

      if(!someTargeted&&mouseDown&&prevArr){ //rehighlight true selections when clicking on
        for(i = 0; i<prevArr.length; i++){ // things hidden by the timeslider
          highlighter(prevArr[i],"hi", 1);
          if(!oidStore[prevArr[i]])
            storeOID(prevArr[i]);
        }
      }
      binArr = null;

    }

    geoSearch.clearAll = clearAllStoredOIDs;
    geoSearch.clear = clearStoredOID;
    geoSearch.clearAndSet = clearAndSetOID;
    geoSearch.store = storeOID;
    geoSearch.isStored = isStored;
    geoSearch.selected = selectedOIDs;

    return geoSearch;
  
  }
});