require(['esri/tasks/identify'],function(identify){

   (function sendReq(i){
              var nextCall = i+20;
              if (nextCall>= pointsInProfile){
                makeReq(i, pointsInProfile);
              }else{
                W.setTimeout(sendReq, 150, nextCall)
                makeReq(i, nextCall);
              }
          })(0)

          
})