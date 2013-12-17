define( ["esri/tasks/identify"
        ,"esri/tasks/IdentifyTask"
        ,"esri/tasks/IdentifyParameters"
        ],
function( ident
        , IdentifyTask
        , IdentifyParameters
         ){
  return function(url){
    var idT = new IdentifyTask(url)
      , idP = new IdentifyParameters()
      , currentRasters
      ;
    idP.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;
    idP.tolerance = 1;
    idP.returnGeometry = true;
    
    function parsePromise(v){
      var output = processId.output
        , lids = processId.lids
        , rastersShowing = currentRasters
        ;
      output[0].length = 0;
      output[1].length = 0;
      output[2] = idP;
      lids.length = 0;
      if(v.length>0){
        for (var i = 0, j = v.length;i<j;i++){ //logic for multiple layers
          processId.lids[i]=v[i];//array of objects with OBJECTID and it's ident data
        }
        for(var oi = 0, oj = rastersShowing.length;oi<oj;oi++){
          if(rastersShowing[oi]){
            for(var i = 0, j = lids.length;i<j;i++){
              if(oi === lids[i].layerId){
                processId.output[0].push(lids[i].layerId);
                processId.output[1].push(lids[i]);
              }
            }     
          } 
        } 
      }
      return output;
    }

    function processId(tA, pA, rastersShowing){
      var def = tA.execute(pA);
      currentRasters=rastersShowing;
      return def.then(parsePromise);
    }

    processId.output =[[],[], null];
    processId.lids =[];

    return function(geom, query, layerArray, rastersShowing, map){
      idP.geometry = geom;
      if(query){
        idP.mapExtent=map.extent;
        idP.height=map.height;
        idP.width=map.width;
        idP.layerIds = layerArray;
        return processId(idT, idP, rastersShowing);
      }
      return idT.execute(idP);
    };
  };
});
