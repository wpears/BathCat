({
    baseUrl: ".",
    name: "modules.js",
    out: "built-modules.js",
    paths:{
      dojo:"../api/js/dojo/dojo",
      dijit:"../api/js/dojo/dijit",
      dojox:"../api/js/dojo/dojox",
      dgrid:"../api/js/dgrid",
      esri:"../api/js/esri",
    'dojo/has':'empty:',
    'dojo/on':'empty:'
    
    },
    excludeShallow:'../api/js/esri/tasks/geometry'
})