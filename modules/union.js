define([],function(){

  function union(a1,a2){
    var unArr=[];
    for(var i=0,len1=a1.length;i<len1;i++){
      unArr[i]=a1[i];
    }
    for(var j=0,len2=a2.length;j<len2;j++){
      for(i=0,len1=a1.length;i<len1;i++){
        if (a2[j]===a1[i]){
          break;
        }
      }
      if(i===len1) unArr[unArr.length]=a2[j];
    }
    return unArr;
  }
return union;
});