define( ["dgrid/Grid"
        ,"dgrid/editor"
        ,"dojo/query"
        ],
function( Grid
        , Editor
        , dquery
        ){
  return function(gridData, gridNode, featureCount){
    var headerNodes
      , gridContent
      , scroller
      , toggleCount = 0
      , lastNodePos =new Array(gridData.length+1)
      , nameSorted = 0
      , dateSorted = 1
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

    headerNodes = dom.byId("gridNode-header").firstChild.children;
    gridContent = dquery(".dgrid-content")[0];
    scroller = dquery(".dgrid-scroller")[0];

    headerNodes[0].title = "Sort by Name"; //maybe pass these into constructor
    headerNodes[1].title = "Sort by Date";         
    headerNodes[3].title = "Turn images on or off";
    scroller.style.overflowY="scroll";
    
    for(var i = 0, j = gridData.length;i<j;i++){
      lastNodePos[i] = i+1;
    }
    lastNodePos[gridData.length-1]=0;

    sedToggle = GridCategory(grid, gridData, "Project","Soil Sed.", gridNode, lastNodePos);
    toggleCount++;

    function dateSortSeq(a, b){
      return a.__Date-b.__Date
    }
    function dateSortInv(a, b){
      return b.__Date-a.__Date
    }
    function nameSortSeq(a, b){
      if(a.Project===b.Project)return dateSortSeq(a,b);
      return a.Project>b.Project?1:-1
    }
    function nameSortInv(a, b){
      if(a.Project===b.Project)return dateSortSeq(a,b);
      return a.Project>b.Project?-1:1
    }
    function renderSort(sorter, gridData, gCon){
      var i = 0, j = gridData.length, newCon, currentNodes = gCon.children,
        nodeIndex, node, frag = DOC.createDocumentFragment(), togId = sedToggle.getRow().id,
      tog = gridData.shift();  
      gridData.sort(sorter);
      gridData.unshift(tog);
      for(var i = 0, j = gridData.length;i<j;i++){
        nodeIndex = gridData[i].OBJECTID-1;
        node = currentNodes[lastNodePos[nodeIndex]].cloneNode(true);
        frag.appendChild(node);
        lastNodePos[nodeIndex] = i;
      }
      newCon = gCon.cloneNode(false);
      newCon.appendChild(frag);
      gCon.parentNode.replaceChild(newCon, gridContent);
      gridContent = newCon;
      frag = null;
      sedToggle.setNode();
    }

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

    function timeUpdate(e){
      var startTime = +e.startTime, endTime = +e.endTime, currentRasters = rasterLayer.visibleLayers,
      currTime, currOID, rawGraphic, gridData = gridData, currentCount = selectedGraphicsCount,
      currRow, toBeHidden = timeUpdate.toBeHidden, oidRasterIndex, shape,
      rastersAsOIDs = timeUpdate.rastersAsOIDs;
      for(var i = toggleCount, j = gridData.length;i<j;i++){
        currOID = gridData[i].OBJECTID;
        if(currOID === j) continue;
        shape = oidToGraphic(currOID)._shape

        if(shape) rawGraphic = shape.rawNode;
        currRow = oidToRow(currOID);
        currTime =+gridData[i].__Date

        if(currTime<startTime||currTime>endTime){
      //    if(oidStore[currOID]) deselect a project if it outside the current time extent
      //      clearStoredOID(currOID, 1, 1);
          domClass.add(currRow, "hiddenRow");
          if(map.layerIds[2]){
            oidRasterIndex = currOID-1;
            toBeHidden.push(currOID);
            for(var k = 1;k<currentRasters.length;k++){
              if(currentRasters[k] === oidRasterIndex){
                splice(currentRasters, k);
                k--;
              }
            }
          }
          insideTimeBoundary[currOID] = 0;
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
      if(currentCount!== selectedGraphicsCount)//make rP reflect possible change
        infoFunc(null)
      rastersAsOIDs.length = 0;
      toBeHidden.length = 0;
    }

    timeUpdate.rastersAsOIDs =[];
    timeUpdate.toBeHidden =[];

    timeSlider.on("time-extent-change", timeUpdate);

    renderSort(dateSortSeq, gridData, gridContent);
    domClass.add(headerNodes[1], "sortTarget");

    function nameSortEffects(){
      dateSorted = 0;
      domClass.add(headerNodes[0], "sortTarget");
      domClass.remove(headerNodes[1], "sortTarget");
      if(selectedGraphicsCount)scrollToRow(selectedGraphics[0])
    }

    function dateSortEffects(){
      nameSorted = 0;
      domClass.add(headerNodes[1], "sortTarget");
      domClass.remove(headerNodes[0], "sortTarget");
      if(selectedGraphicsCount)scrollToRow(selectedGraphics[0])
    }
    function clickSort(){
      if(nameSorted === 0 && selectedGraphicsCount>1){
        renderSort(nameSortSeq, gridData, gridContent);
        nameSorted = 1;
        nameSortEffects();
        return true;
      }
      return false;
    }

    function runNameSort(){
      if(nameSorted>0){
        renderSort(nameSortInv, gridData, gridContent);
        nameSorted = -1;
      }else{
        renderSort(nameSortSeq, gridData, gridContent);
        nameSorted = 1;
      }
      nameSortEffects();
    }

    function runDateSort(){
      if(dateSorted>0){
        renderSort(dateSortInv, gridData, gridContent);
        dateSorted = -1;
      }else{
        renderSort(dateSortSeq, gridData, gridContent);
        dateSorted = 1;
      }
      dateSortEffects();
    }


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


    function cellClick(e){  //grid click handler
      var et = e.target, oid = getOIDFromGrid(e), attributes;
      if(!oid)return;
      if(!oidStore[oid]&&et.tagName=="INPUT"&&et.checked)return
      highlighter(oid,"hi", 1);
      if(et!== previousRecentTarget){ //prevent click before double click
        window.clearTimeout(mouseDownTimeout);
        previousRecentTarget = et;
        mouseDownTimeout = W.setTimeout(nullPrevious, 400);
        attributes = outlines.graphics[oid-1].attributes;
        if(oidStore[oid]&&selectedGraphicsCount === 1){ //target is sole open
          clearStoredOID(oid, 1, 1);
          infoFunc(null);
        }else{
          clearAndSetOID(oid);
        }   
      }
    }


    
    function gridDbl(e){
      var inputBox, oid = getOIDFromGrid(e);
      if(oid){
        var graphic = oidToGraphic(oid);
        if(!graphic){
          return;
        }
        if(e.target.localName!== "div"){
          clearAndSetOID(oid)
          inputBox = getInputBox(oid);
          setExtent(graphic._extent.expand(1.3));
          if(!inputBox.checked){
            inputBox.checked = true;
            rastersShowing[oid] = 1;
            setVisibleRasters.reusableArray[0] = oid;
            setVisibleRasters(setVisibleRasters.reusableArray, 0);
          }
        }
      }
    }

    function makeViewable(oid, level, center){
      var mapX=center.x;
      var mapY=center.y;
      var ex1=oidToGraphic(oid)._extent;

      if(ex1.xmax>= mapX&&ex1.xmin<= mapX&&ex1.ymin<= mapY&&ex1.ymax>= mapY&&level>=14) return;
      
      var ex=ex1.expand(1.3);
      if(ex.xmax-ex.xmin > makeViewable.xcutoff || ex.ymax-ex.ymin > makeViewable.ycutoff){
        setExtent(ex);
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
      setToolVisibility(visibleRasterOIDs);
    }


    function setToolVisibility(visibleRasterOIDs){
      if(visibleRasterOIDs.length>1){
        domClass.replace(identAnchor,"clickable","unclick");
        domClass.replace(crossAnchor,"clickable","unclick");
      }else{
        if(identTool)tools.wipe(identTool,identAnchor,eventFeatures)
        if(crossTool)tools.wipe(crossTool,crossAnchor,eventFeatures)
        domClass.replace(identAnchor,"unclick","clickable");
        domClass.replace(crossAnchor,"unclick","clickable");
      }
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

    if(touch){

    }else{
      grid.on(".dgrid-cell:mousedown", cellClick);
      grid.on(".dgrid-cell:dblclick", gridDbl);
      grid.on(".dgrid-cell:mouseover", function(e){
        var oid = getOIDFromGrid(e);
        if(oid)highlighter(oid,"hi", 1);  
      });
      grid.on(".dgrid-cell:mouseout", function(e){
        var oid = getOIDFromGrid(e);
        if(oidStore[oid])
          return;
        else
          highlighter(oid,"", 1);
      });

      on(headerNodes[0], "mousedown", runNameSort);
      on(headerNodes[1], "mousedown", runDateSort);
      on(headerNodes[3],"mousedown", showAllImages);

      on(spl, "mousedown", function(e){               //expand left pane
        gridPane.style.minWidth = 0;
        var mM = on(W, "mousemove", triggerExpand);
        on.once(W,"mouseup", function(evt){
          map.resize();
          mM.remove();
        });
      });
    }
    return { timeUpdate:timeUpdate
           , oidToRow:oidToRow
           , scrollToRow:scrollToRow
           , setVisibleRasters:setVisibleRasters
           , checkImageInputs:checkImageInputs
           , clickSort:clickSort
           , expand:triggerExpand
           , sedToggle:sedToggle
           };
  }
});