//Instantiates grid and binds grid logic with map logic.
//Has primary responsibility to managing the raster layer

define( ["dgrid/Grid"
        ,"dgrid/editor"

        ,"dojo/query"
        ,"dojo/dom-class"
        ,"dojo/on"

        ,"modules/gridcategory.js"
        ,"modules/gridsorter.js"
        ,"modules/splice.js"
        ,"modules/settoolvisibility.js"
        ],
function( Grid
        , Editor

        , dquery
        , domClass
        , on

        , gridCategory
        , GridSorter
        , splice
        , setToolVisibility
        ){
  return function( gridData
                 , gridNode
                 , gridPane
                 , spl
                 , rasterLayer
                 , insideTimeBoundary
                 , rastersShowing
                 , oidToGraphic
                 , legend
                 , phasingTools
                 , placeMap
                 , map
                 ){
    var W = window
      , headerNodes
      , gridContent
      , scroller
      , toggleCount = 0
      , gridLength = gridData.length + 1
      , lastNodePos =new Array(gridLength)
      , gridSorter
      ;



    grid = new Grid({bufferRows:Infinity,
        columns:{
          Project:{label:"Project", sortable:false},
          Date:{label:"Date", sortable:false},
          OBJECTID:{label:"OBJECTID"},
          Editor:Editor({field: "Image", sortable:false}, "checkbox"),
          __Date:{label:"_Date"}
        },
        cellNavigation:0
        },
      gridNode
    );



    //add collapsing row tab to data
    gridData.unshift({"__Date":1315008000000,Date:"Various",Project:"Soil Sedimentation",OBJECTID:gridData.length+1});
    
    grid.renderArray(gridData);

    headerNodes = document.getElementById("gridNode-header").firstChild.children;
    gridContent = dquery(".dgrid-content")[0];
    scroller = dquery(".dgrid-scroller")[0];

    headerNodes[0].title = "Sort by Name"; //maybe pass these into constructor
    headerNodes[1].title = "Sort by Date";         
    headerNodes[3].title = "Turn images on or off";
    scroller.style.overflowY="scroll";
    


    //lastNodePos tracks objectIds when sorting the grid
    for(var i = 0, j = gridLength;i<j;i++){
      lastNodePos[i] = i+1;
    }
    lastNodePos[gridLength-1]=0;

    // initialize collapsing row tab
    sedToggle = gridCategory(grid, gridData, "Project","Soil Sed.", gridNode, lastNodePos);
    toggleCount++;


    gridSorter = GridSorter(renderSort);

    //O(1) object id lookup
    function oidToRow(oid){
      return gridContent.children[lastNodePos[oid-1]];
    }



    function scrollToRow(oid){
      var row = oidToRow(oid);
      var offset = row.offsetTop;
      if (!offset&&(domClass.contains(row,"hiddenRow")||domClass.contains(row,"hiddenGridToggle")))
        return;
      var scrollTop = scroller.scrollTop;
      if(offset>scroller.clientHeight+scrollTop-55||offset<scrollTop)
          scroller.scrollTop = offset-95;
    }

    function renderSort(sorter){
      var currentNodes = gridContent.children
        , nodeIndex
        , newContent
        , frag = document.createDocumentFragment()
        , toggleRow = gridData.shift()
        ; 
         
      gridData.sort(sorter);
      gridData.unshift(toggleRow);

      for(var i = 0; i<gridLength; i++){
        nodeIndex = gridData[i].OBJECTID-1;
        frag.appendChild(currentNodes[lastNodePos[nodeIndex]].cloneNode(true));
        lastNodePos[nodeIndex] = i;
      }
      newContent = gridContent.cloneNode(false);
      newContent.appendChild(frag);
      gridContent.parentNode.replaceChild(newContent, gridContent);
      gridContent = newContent;
      frag = null;
      sedToggle.setNode();
    }



    function timeUpdate(timeExtent){
      var currOID
        , shape
        , rawGraphic
        , currRow
        , currTime
        , startTime = +timeExtent.startTime
        , endTime = +timeExtent.endTime
        , currentRasters = rasterLayer.visibleLayers
        , oidRasterIndex
        , toBeHidden = timeUpdate.toBeHidden
        , rastersAsOIDs = timeUpdate.rastersAsOIDs
        ;

      //Hide grid rows outside of the current time extent, propagate this change to the map layers
      for(var i = toggleCount; i<gridLength; i++){
        currOID = gridData[i].OBJECTID;
        if(currOID === gridLength) continue;

        shape = oidToGraphic(currOID)._shape;
        if(shape) rawGraphic = shape.rawNode;

        currRow = oidToRow(currOID);
        currTime =+gridData[i].__Date;

        if(currTime<startTime||currTime>endTime){
          domClass.add(currRow, "hiddenRow");
          insideTimeBoundary[currOID] = 0;

          if(map.layerIds[2]){
            oidRasterIndex = currOID-1;
            toBeHidden.push(currOID);

            //remove any rasters that are out of the current time extent
            for(var k = 1;k<currentRasters.length;k++){
              if(currentRasters[k] === oidRasterIndex){
                splice(currentRasters, k);
                k--;
              }
            }
          }

          //setting the class on the svg shape is much faster than redrawing with esri methods
          if(shape){
            rawGraphic.setAttribute("class","hiddenPath")
          }
        }else{
          if(insideTimeBoundary[currOID] === 0){
            domClass.remove(currRow, "hiddenRow");
            insideTimeBoundary[currOID] = 1;
            if(shape)
              rawGraphic.setAttribute("class","")
          }
        }
      }

      if(map.layerIds[2]){
        uncheckImageInputs(toBeHidden);
        for(var i = 1;i<currentRasters.length;i++){
          rastersAsOIDs.push(currentRasters[i]+1);
        }
        setVisibleRasters(rastersAsOIDs, 0);
      }

      rastersAsOIDs.length = 0;
      toBeHidden.length = 0;
    }

    timeUpdate.rastersAsOIDs =[];
    timeUpdate.toBeHidden =[];




    function showAllImages(){                 //mass image display/clear
      var someChecked = 0;
      for(var i = 1, j = layerArray.length;i<=j;i++){
        if(rastersShowing[i]){
          someChecked = 1;
          break;
        }
      }
      if(someChecked){
        setVisibleRasters.reusableArray.length = 0;
        setVisibleRasters(setVisibleRasters.reusableArray, 0);
        clearImageInputs();
      }else{
        setVisibleRasters(oidArray, 0);
        checkImageInputs(oidArray);
      }
    }



    function makeViewable(oid, level, center){
      var mapX=center.x;
      var mapY=center.y;
      var ex1=oidToGraphic(oid)._extent;

      if(ex1.xmax>= mapX&&ex1.xmin<= mapX&&ex1.ymin<= mapY&&ex1.ymax>= mapY&&level>=14) return;
      
      var ex=ex1.expand(1.3);
      if(ex.xmax-ex.xmin > makeViewable.xcutoff || ex.ymax-ex.ymin > makeViewable.ycutoff){
        map.setExtent(ex);
      }else{
        map.setLevel(15);
        map.centerAt(ex1.getCenter());
      }
    }
    makeViewable.xcutoff=6500;
    makeViewable.ycutoff=4500;


    setVisibleRasters.reusableArray =[];
    function setVisibleRasters(newOIDs, fromCheck){
      if(!map.layerIds[2]){ //if the raster has not been added, add it.
        map.addLayer(rasterLayer);
        if(!touch){
          legend.node.src = "images/leg.png";
          legend.show();
        }
      }
      var rL = rasterLayer,
        visibleRasterOIDs = rL.visibleLayers,
        i,
        j = visibleRasterOIDs.length,
        splicedIfPresent,
        rasterIndex;
      if(newOIDs.length>1){
        (function(){
          for(var i = 0, j = newOIDs.length;i<j;i++){
            if(insideTimeBoundary[newOIDs[i]]&&visibleRasterOIDs.indexOf(newOIDs[i]-1)===-1)
              visibleRasterOIDs.push(newOIDs[i]-1);
          }
        })();
      }
      if(newOIDs.length === 1&&newOIDs[0]!==-1){
        rasterIndex = newOIDs[0]-1;
        while(j--){
          if(rasterIndex === visibleRasterOIDs[j]&&fromCheck){//splice this number out of visible layers if it is there
            splicedIfPresent = visibleRasterOIDs.splice(j, 1)[0]; 
            break;
          }
        }
        if(rasterIndex!== splicedIfPresent)
          visibleRasterOIDs.push(rasterIndex)
      }

      if(newOIDs.length === 0){
        visibleRasterOIDs =[-1];
      }

      rL.setVisibleLayers(visibleRasterOIDs);

      if(rL.suspended){                     
        rL.resume();
        if(!touch) legend.show();
      }

      if(visibleRasterOIDs.length === 1){
        rL.suspend();
        if(!touch)legend.hide();
      }
      setToolVisibility(phasingTools,visibleRasterOIDs.length <= 1);
    }

    function getInputBox(oid){
      return oidToRow(oid).firstChild.firstChild.children[3].firstChild;
    }

    function checkImageInputs(oidArr){
      var curr;
      for(var i = 0, j = oidArr.length;i<j;i++){
        if(insideTimeBoundary[oidArr[i]]){
          curr = getInputBox(oidArr[i]);
          curr.checked = true;
          rastersShowing[oidArr[i]] = 1;
        }
      }
    }


    function uncheckImageInputs(oidArr){
      var curr;
      for(var i = 0, j = oidArr.length;i<j;i++){
          curr = getInputBox(oidArr[i]);
          curr.checked = false;
          rastersShowing[oidArr[i]] = 0;
        }
    }


    function clearImageInputs(){
      var inputArr = dquery(".dgrid-input", gridNode);
        for(var i = 0, j = inputArr.length;i<j;i++){
          inputArr[i].checked = false;
          rastersShowing[i+1] = 0;
        }
    }

    var triggerExpand = function(){
      var expandReady = 1;

      function expand(e){
        gridPane.style.width = e.x+"px";
        placeMap();
        expandReady = 1;
      }
    
      return function (e){
        if(expandReady){
          W.requestAnimationFrame(function(){expand(e)});
          expandReady = 0;
        }
      }
    }()


    on(grid,".dgrid-input:change", function(e){
        var oid =+e.target.parentNode.parentNode.children[2].innerHTML;
        if(rastersShowing[oid]){
          rastersShowing[oid] = 0;
        }else{
          rastersShowing[oid] = 1;
          makeViewable(oid,map.getLevel(),map.extent.getCenter());
        }       
        setVisibleRasters.reusableArray[0] = oid;
        setVisibleRasters(setVisibleRasters.reusableArray, 1);
    });


    on(headerNodes[3],"mousedown", showAllImages);

    on(spl, "mousedown", function(e){               //expand left pane
      gridPane.style.minWidth = 0;
      var mM = on(W, "mousemove", triggerExpand);
      on.once(W,"mouseup", function(evt){
        map.resize();
        mM.remove();
      });
    });

    return { grid: grid
           , gridSorter: gridSorter
           , timeUpdate:timeUpdate
           , oidToRow:oidToRow
           , getInputBox:getInputBox
           , scrollToRow:scrollToRow
           , setVisibleRasters:setVisibleRasters
           , checkImageInputs:checkImageInputs
           , expand:triggerExpand
           , sedToggle:sedToggle
           };
  }
});