document.body.onselectstart=function(e){
  console.log("ieselectstart");
  if(e&&e.preventDefault){
    e.preventDefault();
    e.stopPropagation();
  }
  return false
};