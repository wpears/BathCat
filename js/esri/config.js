/*
 COPYRIGHT 2009 ESRI

 TRADE SECRETS: ESRI PROPRIETARY AND CONFIDENTIAL
 Unpublished material - all rights reserved under the
 Copyright Laws of the United States and applicable international
 laws, treaties, and conventions.

 For additional information, contact:
 Environmental Systems Research Institute, Inc.
 Attn: Contracts and Legal Services Department
 380 New York Street
 Redlands, California, 92373
 USA

 email: contracts@esri.com
 */
//>>built
define("esri/config",["dojo/_base/config","dojo/topic","dojo/has","esri/kernel"],function(b,c,d,e){var a={defaults:{screenDPI:96,geometryService:null,kmlService:null,map:{width:400,height:400,layerNamePrefix:"layer",graphicsLayerNamePrefix:"graphicsLayer",slider:{left:"30px",top:"30px",width:null,height:"200px"},sliderLabel:{tick:5,labels:null,style:"width:2em; font-family:Verdana; font-size:75%;"},sliderChangeImmediate:!0,zoomSymbol:{color:[0,0,0,64],outline:{color:[255,0,0,255],width:1.25,style:"esriSLSSolid"},
style:"esriSFSSolid"},zoomDuration:500,zoomRate:25,panDuration:350,panRate:25,logoLink:"http://www.esri.com",basemaps:{streets:{title:"Streets",baseMapLayers:[{url:"http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer"}]},satellite:{title:"Satellite",baseMapLayers:[{url:"http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"}]},hybrid:{title:"Imagery with Labels",baseMapLayers:[{url:"http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer"},
{url:"http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer",isReference:!0}]},topo:{title:"Topographic",baseMapLayers:[{url:"http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer"}]},gray:{title:"Light Gray Canvas",baseMapLayers:[{url:"http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer"},{url:"http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer",
isReference:!0}]},oceans:{title:"Oceans",baseMapLayers:[{url:"http://services.arcgisonline.com/ArcGIS/rest/services/Ocean_Basemap/MapServer"}]},"national-geographic":{title:"National Geographic",baseMapLayers:[{url:"http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer"}]},osm:{title:"OpenStreetMap",baseMapLayers:[{type:"OpenStreetMap"}]}}},io:{errorHandler:function(a,b){c.publish("esri.Error",[a])},proxyUrl:null,alwaysUseProxy:!1,useCors:!0,corsEnabledServers:"www.arcgis.com tiles.arcgis.com services.arcgis.com services1.arcgis.com services2.arcgis.com services3.arcgis.com static.arcgis.com utility.arcgisonline.com geocode.arcgis.com geoenrich.arcgis.com qaext.arcgis.com tilesqa.arcgis.com servicesqa.arcgis.com servicesqa1.arcgis.com servicesqa2.arcgis.com servicesqa3.arcgis.com geocodeqa.arcgis.com geoenrichqa.arcgis.com dev.arcgis.com devext.arcgis.com tilesdevext.arcgis.com servicesdev.arcgis.com servicesdev1.arcgis.com servicesdev2.arcgis.com servicesdev3.arcgis.com geocodedev.arcgis.com geoenrichdev.arcgis.com".split(" "),
corsDetection:!0,_processedCorsServers:{},webTierAuthServers:[],proxyRules:[],postLength:2E3,timeout:6E4,useWorkers:!1}}};d("extend-esri")&&(e.config=a);b.noGlobals||(window.esriConfig=a);return a});