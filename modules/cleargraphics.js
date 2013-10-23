define([],function(){  
  return function (arr){
    var mg = esri.map.graphics;
    for(var i = 0, j = arr.length;i<j;i++)
      mg.remove(arr[i]);
  }
});