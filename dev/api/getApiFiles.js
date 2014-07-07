copy(Array.prototype.filter.call($$('head script'),function(v){
  return v.src.match('api/js')
}).map(function(v){
    return v.src.split('api/js/')[1]
  }))