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
define("esri/tasks/geoenrichment/SubGeographyQuery",["../../declare","./GeographyQueryBase"],function(b,c){return b("esri.tasks.geoenrichment.SubGeographyQuery",[c],{filterGeographyLayerID:null,filterGeographyIDs:null,filterGeographyWhere:null,subGeographyLayerID:null,subGeographyWhere:null,constructor:function(a){a&&(a.geographyLayers&&(this.filterGeographyLayerID=a.geographyLayers),a.geographyIDs&&(this.filterGeographyIDs=a.geographyIDs),a.geographyQuery&&(this.filterGeographyWhere=a.geographyQuery),
a.subGeographyLayer&&(this.subGeographyLayerID=a.subGeographyLayer),a.subGeographyQuery&&(this.subGeographyWhere=a.subGeographyQuery))},toJson:function(){var a=this.inherited(arguments);a.returnSubGeographyLayer=!0;this.filterGeographyLayerID&&(a.geographyLayers=this.filterGeographyLayerID);this.filterGeographyIDs&&(a.geographyIDs=this.filterGeographyIDs);this.filterGeographyWhere&&(a.geographyQuery=this.filterGeographyWhere);this.subGeographyLayerID&&(a.subGeographyLayer=this.subGeographyLayerID);
this.subGeographyWhere&&(a.subGeographyQuery=this.subGeographyWhere);return a}})});