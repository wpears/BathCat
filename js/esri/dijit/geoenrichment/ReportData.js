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
define("esri/dijit/geoenrichment/ReportData",["../../declare","dojo/number","./lang"],function(b,e,f){var c=b("esri.dijit.geoenrichment.ReportData",null,{title:null,_cols:null,_rows:null,_indexes:null,constructor:function(){this._cols=[];this._rows=[]},addCol:function(a){this._indexes=null;this._cols.push(a)},getColCount:function(){return this._cols.length},getCol:function(a){return this._cols[a]},addRow:function(a){this._rows.push(a)},getRow:function(a){return this._rows[a]},getRowCount:function(){return this._rows.length},
findField:function(a){if(!this._indexes){this._indexes={};for(var h=this._cols.length,b=0;b<h;b++)this._indexes[this._cols[b].name]=b}return this._indexes[a]},getValue:function(a,b){return f.isNumber(b)?this._rows[a][b]:this._rows[a][this.findField(b)]},formatValue:function(a,b){var c=f.isNumber(b)?b:this.findField(b);return this.getCol(c).format(this._rows[a][c])},clearRows:function(a){f.isNumber(a)?this._rows.splice(a,this._rows.length-a):this._rows=[]},clearCols:function(){this.clearRows();this._cols=
[];this._indexes=null}}),g=b(null,{name:null,alias:null,fullName:null,constructor:function(a){this.name=a.name;this.alias=a.alias||a.name;this.fullName=a.fullName||null}}),d=b([g],{decimals:0,constructor:function(a){this.decimals=a.decimals||0},format:function(a){return e.format(a,{places:this.decimals})}});c.NumericColumn=d;var k=b([d],{format:function(a){return e.format(a/100,{places:this.decimals,type:"percent"})}});c.PercentColumn=k;d=b([d],{constructor:function(a){this.symbol=a.symbol||"$"},
format:function(a){return e.format(a,{places:this.decimals,type:"currency",symbol:this.symbol})}});c.CurrencyColumn=d;b=b([g],{format:function(a){return a}});c.StringColumn=b;return c});