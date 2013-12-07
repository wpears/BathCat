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
define("esri/renderers/DotDensityRenderer","dojo/_base/declare dojo/_base/lang dojo/dom-construct dojo/has esri/kernel esri/renderers/Renderer esri/symbols/PictureFillSymbol esri/geometry/ScreenPoint esri/geometry/Point".split(" "),function(h,m,p,q,r,s,t,u,n){h=h(s,{declaredClass:"esri.renderer.DotDensityRenderer",constructor:function(a){this.dotSize=a.dotSize||3;this.dotValue=a.dotValue;this.fields=a.fields;this.outline=a.outline;this.backgroundColor=a.backgroundColor;this.exactCount=a.exactCount||
!0;this.dotShape=a.dotShape||"square";this._exactCountMinArea=1E4;this._currentMapScale=this._map=this._canvas=null;this._symbolMap={};this._currentGraphic=this._currentResolution=this._objectIdField=null;this._supportsCanvas=window.CanvasRenderingContext2D?!0:!1;window.CanvasRenderingContext2D||console.log("The DotDensityRenderer requires a Canvas enabled Browser.  IE8 and less does not support Canvas.")},getSymbol:function(a){var b,c;this._currentGraphic=a;if(!this._supportsCanvas)return null;this._map||
(this._map=a.getLayer()._map,this._objectIdField=a.getLayer().objectIdField,this._currentMapScale=this._map.getScale(),this._currentResolution=this._map.extent.getWidth()/this._map.width,this._map.on("zoom-end",m.hitch(this,function(a){this._currentMapScale=this._map.getScale();this._currentResolution=a.extent.getWidth()/this._map.width;this._symbolMap[this._currentMapScale]={}})));if(this._symbolMap[this._currentMapScale]&&this._symbolMap[this._currentMapScale][a.attributes[this._objectIdField]])return b=
this._symbolMap[this._currentMapScale][a.attributes[this._objectIdField]],c=this._getShapeProperties(a),b.setOffset(c.dx,c.dy),b;b=this._generateFieldsCount(this.fields,a.attributes,this.dotValue);c=this._getShapeProperties(a);b=new t(this._generateImageSrc(c.width,c.height,b,c.minXY,c.maxXY),this.outline,c.width,c.height);b.setOffset(c.dx,c.dy);this._symbolMap[this._currentMapScale]||(this._symbolMap[this._currentMapScale]={});return this._symbolMap[this._currentMapScale][a.attributes[this._objectIdField]]=
b},_generateFieldsCount:function(a,b,c){var e,d;for(d=a.length-1;0<=d;d--)e=b[a[d].name]/c,a[d].numPoints=Math.round(e);return a},_getShapeProperties:function(a){var b,c,e,d;b=a.geometry.getExtent();b.contains(this._map.extent)&&(b=this._map.extent);e=b.getWidth()/this._currentResolution;d=b.getHeight()/this._currentResolution;c=this._map.toScreen(new n(b.xmin,b.ymin,b.spatialReference));b=this._map.toScreen(new n(b.xmax,b.ymax,b.spatialReference));a=a.getLayer().getNode().getCTM();return{minXY:c,
maxXY:b,dx:(c.x-a.e)%e,dy:(b.y-a.f)%d,width:e,height:d}},_generateImageSrc:function(a,b,c,e,d){var f=this.dotSize,g,k,h,l;this._canvas?(this._canvas.width=a,this._canvas.height=b):this._canvas=this._initCanvas(a,b);g=this._canvas.getContext("2d");this.backgroundColor&&(g.fillStyle=this.backgroundColor.toCss(!0),g.fillRect(0,0,a,b),g.fill());for(k=c.length-1;0<=k;k--){g.fillStyle=c[k].color.toCss(!0);for(h=c[k].numPoints-1;0<=h;h--)l=this._getRandomPoint(a,b,e,d),"square"===this.dotShape?g.fillRect(l.x,
l.y,f,f):"circle"===this.dotShape&&(g.beginPath(),g.arc(l.x,l.y,f/2,0,2*Math.PI,!0)),g.fill()}return this._canvas.toDataURL()},_initCanvas:function(a,b){var c=p.create("canvas",{id:"canvas",width:a+"px",height:b+"px",style:"position: absolute; left: -10000px; top: 0px;"},null);document.body.appendChild(c);return c},_getRandomInt:function(a,b){return Math.floor(Math.random()*(b-a+1)+a)},_getRandomPoint:function(a,b,c,e){var d={},f=this.outline&&this.outline.width?this.outline.width:0;if(!0===this.exactCount&&
a*b>this._exactCountMinArea){do d.x=this._getRandomInt(c.x,e.x),d.y=this._getRandomInt(e.y,c.y),a=new u(d.x,d.y),a=this._checkPointShapeBounds(a,this.dotSize+f,this._currentGraphic.geometry),!0===a&&(d.x-=c.x,d.y-=e.y);while(!1===a)}else d.x=this._getRandomInt(0,a),d.y=this._getRandomInt(0,b);return d},_checkPointShapeBounds:function(a,b,c){var e=null,e=!1,d=!0,f=0;do{switch(f){case 1:a.x+=b;break;case 2:a.y+=b;break;case 3:a.x-=b}e=this._map.toMap(a);e=c.contains(e);!1===e&&(d=!1);f+=1}while(3>=
f&&!0===d);return e},setDotSize:function(a){0<a&&(this.dotSize=a)},setDotValue:function(a){0<a&&(this.dotValue=a)},setOutline:function(a){this.outline=a},setBackgroundColor:function(a){this.backgroundColor=a},toJson:function(){}});q("extend-esri")&&m.setObject("renderer.DotDensityRenderer",h,r);return h});