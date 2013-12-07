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
define("esri/tasks/LengthsParameters","dojo/_base/declare dojo/_base/lang dojo/_base/array dojo/_base/json dojo/has esri/kernel".split(" "),function(c,e,f,d,g,h){c=c(null,{declaredClass:"esri.tasks.LengthsParameters",polylines:null,lengthUnit:null,geodesic:null,calculationType:null,toJson:function(){var b=f.map(this.polylines,function(a){return a.toJson()}),a={};a.polylines=d.toJson(b);b=this.polylines[0].spatialReference;a.sr=b.wkid?b.wkid:d.toJson(b.toJson());this.lengthUnit&&(a.lengthUnit=this.lengthUnit);
this.geodesic&&(a.geodesic=this.geodesic);this.calculationType&&(a.calculationType=this.calculationType);return a}});g("extend-esri")&&e.setObject("tasks.LengthsParameters",c,h);return c});