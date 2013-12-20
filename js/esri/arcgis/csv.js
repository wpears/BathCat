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
define("esri/arcgis/csv","dojo/_base/lang dojo/_base/array dojo/_base/Deferred dojo/sniff dojo/number dojox/data/CsvStore esri/kernel esri/config esri/request esri/SpatialReference esri/geometry/Point esri/geometry/jsonUtils esri/geometry/webMercatorUtils".split(" "),function(h,c,w,r,J,K,L,y,M,z,N,O,A){function B(a){var b=0,d="";c.forEach([","," ",";","|","\t"],function(e){var c=a.split(e).length;c>b&&(b=c,d=e)});return d}function C(a,b){if(!a||"[object Date]"!==Object.prototype.toString.call(a)||
isNaN(a.getTime()))return!1;var d=!0;if(r("chrome")&&/\d+\W*$/.test(b)){var e=b.match(/[a-zA-Z]{2,}/);if(e){for(var d=!1,c=0,l=e.length,u=/^((jan(uary)?)|(feb(ruary)?)|(mar(ch)?)|(apr(il)?)|(may)|(jun(e)?)|(jul(y)?)|(aug(ust)?)|(sep(tember)?)|(oct(ober)?)|(nov(ember)?)|(dec(ember)?)|(am)|(pm)|(gmt)|(utc))$/i;!d&&c<=l&&!(d=!u.test(e[c]));)c++;d=!d}}return d}function D(a,b,d){var e=a.indexOf("\n"),e=h.trim(a.substr(0,e)),g=b.columnDelimiter;g||(g=B(e));var l=new K({data:a,separator:g});a=9>r("ie")?
750:1001;l.fetch({start:0,count:a,onComplete:function(a,e){var f=0,n={layerDefinition:b.layerDefinition,featureSet:{features:[],geometryType:"esriGeometryPoint"}},k=n.layerDefinition.objectIdField;!k&&!c.some(n.layerDefinition.fields,function(a){return"esriFieldTypeOID"==a.type?(k=a.name,!0):!1})&&(n.layerDefinition.fields.push({name:"__OBJECTID",alias:"__OBJECTID",type:"esriFieldTypeOID",editable:!1,domain:null}),k="__OBJECTID");var g,h,s=l._attributes,r=[],t=[];c.forEach(n.layerDefinition.fields,
function(a,f){"esriFieldTypeDate"===a.type?r.push(a.name):("esriFieldTypeDouble"===a.type||"esriFieldTypeInteger"===a.type)&&t.push(a.name)});b.locationInfo&&"coordinates"===b.locationInfo.locationType?(g=b.locationInfo.latitudeFieldName,h=b.locationInfo.longitudeFieldName):c.forEach(s,function(a){var f;f=c.indexOf(E,a.toLowerCase());-1!==f&&(g=a);f=c.indexOf(F,a.toLowerCase());-1!==f&&(h=a)},this);if(!g||!h)setTimeout(function(){console.error("File does not seem to contain fields with point coordinates.")},
1);else{var s=0,w=a.length;for(s;s<w;s++){if(1E3<=n.featureSet.features.length){setTimeout(function(){console.error("1000 feature limit reached. Unable to load any more data.")},1);break}var v=a[s],q=l.getAttributes(v),p={};c.forEach(q,function(a,f){if(a){var k=a;0===a.length&&c.forEach(n.layerDefinition.fields,function(f,k){f.name==="attribute_"+(k-1)&&(a="attribute_"+(k-1))});if(c.some(r,function(f){return f===a})){var k=l.getValue(v,k),b=new Date(k);p[a]=C(b,k)?b.getTime():null}else if(c.some(t,
function(f){return f===a})){b=J.parse(l.getValue(v,k));if((a==g||a==h)&&(isNaN(b)||181<Math.abs(b)))b=parseFloat(l.getValue(v,k));isNaN(b)?p[a]=null:p[a]=b}else p[a]=l.getValue(v,k)}});p[k]=f;f++;var q=p[g],x=p[h];null==x||(null==q||isNaN(q)||isNaN(x))||(q={geometry:(new N(x,q,new z({wkid:4326}))).toJson(),attributes:p},n.featureSet.features.push(q))}n.layerDefinition.name="csv";d&&d(n)}},onError:function(a){console.error("Error fetching items from CSV store: ",a)}});return!0}function t(a,b,d,e,g,
l){0===a.length&&g(null);var u=O.getGeometryType(b),m=[];c.forEach(a,function(a){a=new u(a);a.spatialReference=d;m.push(a)},this);b=[102113,102100,3857];d.wkid&&4326===d.wkid&&e.wkid&&-1<c.indexOf(b,e.wkid)?(c.forEach(m,function(a){a.xmin?(a.xmin=Math.max(a.xmin,-180),a.xmax=Math.min(a.xmax,180),a.ymin=Math.max(a.ymin,-89.99),a.ymax=Math.min(a.ymax,89.99)):a.rings?c.forEach(a.rings,function(a){c.forEach(a,function(a){a[0]=Math.min(Math.max(a[0],-180),180);a[1]=Math.min(Math.max(a[1],-89.99),89.99)},
this)},this):a.paths?c.forEach(a.paths,function(a){c.forEach(a,function(a){a[0]=Math.min(Math.max(a[0],-180),180);a[1]=Math.min(Math.max(a[1],-89.99),89.99)},this)},this):a.x&&(a.x=Math.min(Math.max(a.x,-180),180),a.y=Math.min(Math.max(a.y,-89.99),89.99))},this),a=[],c.forEach(m,function(b){b=A.geographicToWebMercator(b);102100!==e.wkid&&(b.spatialReference=e);a.push(b.toJson())},this),g(a)):null!==d.wkid&&-1<c.indexOf(b,d.wkid)&&null!==e.wkid&&4326===e.wkid?(a=[],c.forEach(m,function(b){a.push(A.webMercatorToGeographic(b).toJson())},
this),g(a)):(b=function(b,e){b&&b.length===a.length?(a=[],c.forEach(b,function(b){b&&(b.rings&&0<b.rings.length&&0<b.rings[0].length&&0<b.rings[0][0].length&&!isNaN(b.rings[0][0][0])&&!isNaN(b.rings[0][0][1])||b.paths&&0<b.paths.length&&0<b.paths[0].length&&0<b.paths[0][0].length&&!isNaN(b.paths[0][0][0])&&!isNaN(b.paths[0][0][1])||b.xmin&&!isNaN(b.xmin)&&b.ymin&&!isNaN(b.ymin)||b.x&&!isNaN(b.x)&&b.y&&!isNaN(b.y))?a.push(b.toJson()):a.push(null)},this),g(a)):l(b,e)},y.defaults.geometryService?y.defaults.geometryService.project(m,
e,h.hitch(this,b),l):g(null))}function G(a,b){var d=[102113,102100,3857];return a&&b&&a.wkid===b.wkid&&a.wkt===b.wkt||a&&b&&a.wkid&&b.wkid&&-1<c.indexOf(d,a.wkid)&&-1<c.indexOf(d,b.wkid)?!0:!1}function H(a,b,d,e){if(a.featureSet&&0!==a.featureSet.length)if(G(d,b))e(a);else{var g=function(b){var d=[];c.forEach(a.featureSet.features,function(a,e){b[e]&&(a.geometry=b[e],d.push(a))},this);e(a)},l=function(b,d){console.error("error projecting featureSet ("+a.layerDefinition.name+"). Final try.");e(a)},
u=function(e,c){console.error("error projecting featureSet ("+a.layerDefinition.name+"). Try one more time.");t(m,a.featureSet.geometryType,b,d,h.hitch(this,g),h.hitch(this,l))};if(a.featureSet.features&&0<a.featureSet.features.length){var m=[];c.forEach(a.featureSet.features,function(a){m.push(a.geometry)});t(m,a.featureSet.geometryType,b,d,h.hitch(this,g),h.hitch(this,u))}else e(a)}}var E="lat latitude y ycenter latitude83 latdecdeg POINT-Y".split(" "),F="lon lng long longitude x xcenter longitude83 longdecdeg POINT-X".split(" "),
I={latFieldStrings:E,longFieldStrings:F,buildCSVFeatureCollection:function(a){var b=new w,d=function(a){b.callback(a)};M({url:a.url,handleAs:"text",load:function(b){D(b,a,h.hitch(this,d))},error:function(a){console.error("error: "+a)}},{usePost:!1});return b},projectFeatureCollection:function(a,b){var d=new w;H(a,new z({wkid:4326}),b,h.hitch(this,function(a){d.callback(a)}));return d},generateDefaultPopupInfo:function(a){var b={esriFieldTypeDouble:1,esriFieldTypeSingle:1},d={esriFieldTypeInteger:1,
esriFieldTypeSmallInteger:1},e={esriFieldTypeDate:1},g=null;a=c.map(a.layerDefinition.fields,h.hitch(this,function(a){"NAME"===a.name.toUpperCase()&&(g=a.name);var c="esriFieldTypeOID"!==a.type&&"esriFieldTypeGlobalID"!==a.type&&"esriFieldTypeGeometry"!==a.type,m=null;if(c){var f=a.name.toLowerCase();if(-1<",stretched value,fnode_,tnode_,lpoly_,rpoly_,poly_,subclass,subclass_,rings_ok,rings_nok,".indexOf(","+f+",")||-1<f.indexOf("area")||-1<f.indexOf("length")||-1<f.indexOf("shape")||-1<f.indexOf("perimeter")||
-1<f.indexOf("objectid")||f.indexOf("_")===f.length-1||f.indexOf("_i")===f.length-2&&1<f.length)c=!1;a.type in d?m={places:0,digitSeparator:!0}:a.type in b?m={places:2,digitSeparator:!0}:a.type in e&&(m={dateFormat:"shortDateShortTime"})}return h.mixin({},{fieldName:a.name,label:a.alias,isEditable:!0,tooltip:"",visible:c,format:m,stringFieldOption:"textbox"})}));return{title:g?"{"+g+"}":"",fieldInfos:a,description:null,showAttachments:!1,mediaInfos:[]}},_getSeparator:B,_isValidDate:C,_processCsvData:D,
_projectGeometries:t,_sameSpatialReference:G,_projectFeatureSet:H};r("extend-esri")&&h.setObject("arcgis.csv",I,L);return I});