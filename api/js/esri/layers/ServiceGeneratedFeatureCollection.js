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
define("esri/layers/ServiceGeneratedFeatureCollection",["dijit","dojo","dojox","dojo/require!esri/utils,esri/layers/layer,esri/layers/FeatureLayer,esri/dijit/Popup,esri/renderer"],function(_1,_2,_3){_2.provide("esri.layers.ServiceGeneratedFeatureCollection");_2.require("esri.utils");_2.require("esri.layers.layer");_2.require("esri.layers.FeatureLayer");_2.require("esri.dijit.Popup");_2.require("esri.renderer");_2.declare("esri.layers._ServiceGeneratedFeatureCollection",[esri.layers.Layer],{constructor:function(_4,_5){this.pointSymbol=_5&&_5.pointSymbol;this.polylineSymbol=_5&&_5.polylineSymbol;this.polygonSymbol=_5&&_5.polygonSymbol;this._outSR=(_5&&(_5.outSpatialReference||_5.outSR))||new esri.SpatialReference({wkid:4326});this._options=_5;},parse:function(){console.error("parse function has not been implemented");},getFeatureLayers:function(){var _6=[];if(this._fLayers){_6=_6.concat(this._fLayers);}return _6;},onRefresh:function(){},refresh:function(){if(!this.loaded||!this._map||this._io){return;}this._createLayer();},_createLayer:function(_7){var _8=this;this._fireUpdateStart();var _9=this.parse(_7);_9.addCallback(function(_a){_8._io=null;_8._initLayer(_a);});_9.addErrback(function(_b){_8._io=null;_b=_2.mixin(new Error(),_b);_b.message="Unable to load resource: "+_8.url+" "+(_b.message||"");_8._fireUpdateEnd(_b);_8.onError(_b);});},_initLayer:function(_c){if(this.loaded){this._removeInternalLayers();}this.name=_c.name;this.description=_c.description;this.snippet=_c.snippet;if(_c.visibility!==undefined){this.defaultVisibility=this.visible=_c.visibility;}else{this.defaultVisibility=this.visible=true;}this.featureInfos=_c.featureInfos;this.fullExtent=this.initialExtent=new esri.geometry.Extent(_c.lookAtExtent);this.copyright=_c.author||_c.copyright;var _d;var _e=_2.getObject("featureCollection.layers",false,_c);if(_e&&_e.length>0){this._fLayers=[];_2.forEach(_e,function(_f,i){var _10=_2.getObject("featureSet.features",false,_f),_11;if(_10&&_10.length>0){_d=_2.mixin({outFields:["*"],infoTemplate:_f.popupInfo?new esri.dijit.PopupTemplate(_f.popupInfo):null,editable:false},this._options);if(_d.id){_d.id=_d.id+"_"+i;}_f.layerDefinition.capabilities="Query,Data";_11=new esri.layers.FeatureLayer(_f,_d);if(_11.geometryType){this["_"+_11.geometryType]=_11;}this._fLayers.push(_11);}},this);if(this._fLayers.length===0){delete this._fLayers;}}this.items=[];if(this._esriGeometryPoint){this.items=this.items.concat(this._esriGeometryPoint.graphics);if(this.pointSymbol){var _12=new esri.renderer.SimpleRenderer(this.pointSymbol);this._esriGeometryPoint.setRenderer(_12);}}if(this._esriGeometryPolyline){this.items=this.items.concat(this._esriGeometryPolyline.graphics);if(this.polylineSymbol){var _13=new esri.renderer.SimpleRenderer(this.polylineSymbol);this._esriGeometryPolyline.setRenderer(_13);}}if(this._esriGeometryPolygon){this.items=this.items.concat(this._esriGeometryPolygon.graphics);if(this.polygonSymbol){var _14=new esri.renderer.SimpleRenderer(this.polygonSymbol);this._esriGeometryPolygon.setRenderer(_14);}}this._fireUpdateEnd();if(this.loaded){this._addInternalLayers();this.onRefresh();}},_addInternalLayers:function(){var map=this._map;this._fireUpdateStart();var _15=map.spatialReference,_16=this._outSR,_17;if(_15.wkid){_17=(_15._isWebMercator()&&_16._isWebMercator())||(_15.wkid===_16.wkid);}else{if(_15.wkt){_17=(_15.wkt===_16.wkt);}else{console.log("_setMap - map has invalid spatial reference");return;}}if(!_17){if(_15._isWebMercator()&&_16.wkid===4326){this._converter=esri.geometry.geographicToWebMercator;}else{if(_16._isWebMercator()&&_15.wkid===4326){this._converter=esri.geometry.webMercatorToGeographic;}else{console.log("_setMap - unsupported workflow. Spatial reference of the map and layer do not match, and the conversion cannot be done on the client.");return;}}}var _18=this._fLayers;if(_18&&_18.length>0){_2.forEach(_18,function(_19){if(this._converter){var _1a=_19.graphics,i,_1b,len=_1a?_1a.length:0;for(i=0;i<len;i++){_1b=_1a[i].geometry;if(_1b){_1a[i].setGeometry(this._converter(_1b));}}}map.addLayer(_19);},this);}this.setVisibility(this.visible);},_removeInternalLayers:function(){var map=this._map;if(map){_2.forEach(this.getFeatureLayers(),map.removeLayer,map);}},onVisibilityChange:function(_1c){this._fireUpdateStart();_2.forEach(this.getFeatureLayers(),function(_1d){_1d.setVisibility(_1c);});this._fireUpdateEnd();},_setMap:function(map,_1e){this.inherited(arguments);this._map=map;var div=this._div=_2.create("div",null,_1e);_2.style(div,"position","absolute");this._addInternalLayers();this.evaluateSuspension();return div;},_unsetMap:function(map,_1f){if(this._io){this._io.cancel();}_2.disconnect(this._extChgHandle);delete this._extChgHandle;this._removeInternalLayers();var div=this._div;if(div){_1f.removeChild(div);_2.destroy(div);}this._div=null;this.inherited(arguments);}});});