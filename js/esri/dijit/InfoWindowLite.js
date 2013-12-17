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
define("esri/dijit/InfoWindowLite","dojo/_base/declare dojo/_base/lang dojo/_base/connect dojo/_base/array dojo/_base/html dojo/has dojo/dom dojo/dom-class dojo/dom-construct dojo/dom-geometry dojo/dom-style dijit/registry esri/kernel esri/domUtils esri/InfoWindowBase".split(" "),function(s,l,n,p,m,t,u,e,f,q,h,v,w,r,x){var d=s([x],{declaredClass:"esri.dijit.InfoWindowLite",constructor:function(a,b){l.mixin(this,a);var c=this.domNode=u.byId(b);c.id=this.id||v.getUniqueId(this.declaredClass);e.add(c,
"simpleInfoWindow");this._title=f.create("div",{"class":"title"},c);this._content=f.create("div",{"class":"content"},c);this._close=f.create("div",{"class":"close"},c)},domNode:null,anchor:"upperright",fixedAnchor:null,coords:null,isShowing:!0,width:250,height:150,title:"Info Window",_bufferWidth:10,_bufferHeight:10,startup:function(){this._anchors=[d.ANCHOR_UPPERRIGHT,d.ANCHOR_LOWERRIGHT,d.ANCHOR_LOWERLEFT,d.ANCHOR_UPPERLEFT];this.resize(this.width,this.height);this.hide();this._closeConnect=n.connect(this._close,
"onclick",this,this.hide)},destroy:function(){this.isShowing&&this.hide();this.destroyDijits(this._title);this.destroyDijits(this._content);n.disconnect(this._closeConnect);f.destroy(this.domNode);this.domNode=this._title=this._content=this._anchors=this._closeConnect=null},setTitle:function(a){a?e.remove(this._title,"empty"):e.add(this._title,"empty");this.destroyDijits(this._title);this.__setValue("_title",a);return this},setContent:function(a){a?e.remove(this._title,"empty"):e.add(this._title,
"empty");this.destroyDijits(this._content);this.__setValue("_content",a);return this},setFixedAnchor:function(a){a&&-1===p.indexOf(this._anchors,a)||(this.fixedAnchor=a,this.isShowing&&this.show(this.mapCoords||this.coords,a),this.onAnchorChange(a))},show:function(a,b,c){if(a){a.spatialReference?(this.mapCoords=a,a=this.coords=this.map.toScreen(a,!0)):(this.mapCoords=null,this.coords=a);if(!b||-1===p.indexOf(this._anchors,b))b=this._getAnchor(a);b=this.anchor=this.fixedAnchor||b;r.show(this.domNode);
this._adjustContentArea();this._adjustPosition(a,b);this.isShowing=!0;if(!c)this.onShow()}},hide:function(a,b){r.hide(this.domNode);this.isShowing=!1;if(!b)this.onHide()},move:function(a,b){b?a=this.coords.offset(a.x,a.y):(this.coords=a,this.mapCoords&&(this.mapCoords=this.map.toMap(a)));this._adjustPosition(a,this.anchor)},resize:function(a,b){this.width=a;this.height=b;h.set(this.domNode,{width:a+"px",height:b+"px"});h.set(this._close,{left:a-2+"px",top:"-12px"});this._adjustContentArea();this.coords&&
this._adjustPosition(this.coords,this.anchor);this.onResize(a,b)},onShow:function(){this.__registerMapListeners();this.startupDijits(this._title);this.startupDijits(this._content)},onHide:function(){this.__unregisterMapListeners()},onResize:function(){},onAnchorChange:function(){},setMap:function(a){this.inherited(arguments);f.place(this.domNode,a.root)},_adjustContentArea:function(){var a=q.getContentBox(this.domNode),b=m.coords(this._title),c=m.coords(this._content),d=q.getContentBox(this._content);
h.set(this._content,{height:a.h-b.h-(c.h-d.h)+"px"})},_getAnchor:function(a){var b=this.map;return b&&a?(a.y<b.height/2?"lower":"upper")+(a.x<b.width/2?"right":"left"):"upperright"},_adjustPosition:function(a,b){var c=Math.round(a.x),g=Math.round(a.y),e=this._bufferWidth,f=this._bufferHeight,k=m.coords(this.domNode);switch(b){case d.ANCHOR_UPPERLEFT:c-=k.w+e;g-=k.h+f;break;case d.ANCHOR_UPPERRIGHT:c+=e;g-=k.h+f;break;case d.ANCHOR_LOWERRIGHT:c+=e;g+=f;break;case d.ANCHOR_LOWERLEFT:c-=k.w+e,g+=f}h.set(this.domNode,
{left:c+"px",top:g+"px"})}});l.mixin(d,{ANCHOR_UPPERRIGHT:"upperright",ANCHOR_LOWERRIGHT:"lowerright",ANCHOR_LOWERLEFT:"lowerleft",ANCHOR_UPPERLEFT:"upperleft"});t("extend-esri")&&l.setObject("dijit.InfoWindowLite",d,w);return d});