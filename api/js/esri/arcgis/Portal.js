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
define(["dijit","dojo","dojox","dojo/require!dojox/socket,dojox/socket/Reconnect,dojo/DeferredList,esri/IdentityManager"],function(_1,_2,_3){_2.provide("esri.arcgis.Portal");_2.require("dojox.socket");_2.require("dojox.socket.Reconnect");_2.require("dojo.DeferredList");_2.require("esri.IdentityManager");(function(){var _4={"options":{"disableIdentityLookup":true},"requestParams":{"f":"json"}};_2.declare("esri.arcgis.Portal",null,{onLoad:function(){},constructor:function(_5){_2.mixin(this,{"url":_5});this.init(_5).then(_2.hitch(this,"onLoad",this));},init:function(_6,_7){_6=(_6||this.portalUrl).replace(/\/+$/,"");var _8=_6.indexOf("/sharing");this.portalUrl=(_8!==-1?(_6+"/"):(_6+"/sharing/rest/"));return this._getSelf(this.portalUrl).then(_2.hitch(this,function(_9){var _a=_9;var _b=_9.user;if(_b){_b.portal=this;_b=new esri.arcgis.PortalUser(_b);}_4.self=_2.mixin({},_a);if(_4.self.id&&_4.self.canSearchPublic===false){_4.extraQuery=" AND orgid:"+_a.id;}_2.mixin(this,_4.self);_4.loggedInUser=_2.mixin({},_2.mixin(_b,{"credential":_7}));this.thumbnailUrl=esri.arcgis.PortalUtil.formatUrl(this.portalUrl+"accounts/self/resources/"+this.thumbnail);this.isOrganization=(this.access&&this.access.length)||false;this.created=new Date(this.created);this.modified=new Date(this.modified);this.defaultExtent=this.defaultExtent;return this;}));},signIn:function(){_4.options.disableIdentityLookup=false;return esri.id.getCredential(this.url).then(_2.hitch(this,"init",this.url)).then(function(){return _4.loggedInUser;},function(_c){_4.options.disableIdentityLookup=true;throw _c;});},signOut:function(){_4.loggedInUser.credential&&_4.loggedInUser.credential.destroy();_4.loggedInUser=null;_4.options.disableIdentityLookup=true;esri.arcgis.PortalUtil.clearFieldsFromObject(_4.self,this);_4.self=null;return this.init(this.url);},queryGroups:function(_d){return this._queryPortal(this.portalUrl+"community/groups",esri.arcgis.PortalUtil.formatQueryParams({},_d),esri.arcgis.PortalGroup);},queryItems:function(_e){return this._queryPortal(this.portalUrl+"search",esri.arcgis.PortalUtil.formatQueryParams({},_e),esri.arcgis.PortalItem);},queryUsers:function(_f){return this._queryPortal(this.portalUrl+"community/users",esri.arcgis.PortalUtil.formatQueryParams({"sortField":"username"},_f),esri.arcgis.PortalUser);},_getSelf:function(url){var _10=url+"accounts/self?"+"culture="+_2.locale;return esri.arcgis.PortalUtil.request(_10);},_queryPortal:function(url,_11,_12){var _13=_2.mixin({"num":10,"start":0,"sortField":"title","sortOrder":"asc"},_11),_14=["start","query","num","nextStart"],dfd=esri.arcgis.PortalUtil.request(url,_13).then(_2.hitch(this,function(_15){_15.results=esri.arcgis.PortalUtil.resultsToTypedArray(_12,{"portal":this},_15.results);_15.queryParams=_2.mixin({},_13);_15.nextQueryParams=_2.mixin(_13,{"start":_15.nextStart});return esri.arcgis.PortalUtil.clearFieldsFromObject(_14,_15);}));dfd=_2.delegate(dfd);dfd.queryParams=_2.mixin({},_13);dfd.nextQueryParams=_2.when(dfd,function(_16){return _16.nextQueryParams;});return esri.arcgis.PortalResult(dfd);}});esri.arcgis.PortalResult=function(_17){if(!_17){return _17;}if(_17.then){_17=_2.delegate(_17);}if(!_17.total){_17.total=_2.when(_17,function(_18){return esri._isDefined(_18.total)?_18.total:(_18.length||0);});}function _19(_1a){if(!_17[_1a]){_17[_1a]=function(){var _1b=arguments;return _2.when(_17,function(_1c){Array.prototype.unshift.call(_1b,(_1c.results||_1c));return esri.arcgis.PortalResult(_2[_1a].apply(_2,_1b));});};}};_19("forEach");_19("filter");_19("map");_19("some");_19("every");return _17;};_2.declare("esri.arcgis.PortalFolder",null,{constructor:function(_1d){_2.mixin(this,_1d);this.url=(this.portal&&this.portal.portalUrl)+"content/users/"+this.username+"/"+this.id;this.created=new Date(this.created);},getItems:function(){return esri.arcgis.PortalUtil.requestToTypedArray(this.url,null,null,esri.arcgis.PortalItem,{"portal":this.portal,"folderId":this.id});}});_2.declare("esri.arcgis.PortalGroup",null,{constructor:function(_1e){_2.mixin(this,_1e);this.url=(this.portal&&this.portal.portalUrl)+"community/groups/"+this.id;this.thumbnailUrl=esri.arcgis.PortalUtil.formatUrl(this.url+"/info/"+this.thumbnail);this.modified=new Date(this.modified);this.created=new Date(this.created);},getMembers:function(){return esri.arcgis.PortalUtil.request(this.url+"/users");},queryItems:function(_1f){_1f=esri.arcgis.PortalUtil.formatQueryParams({},_1f);_1f.q="group:"+this.id+(_1f.q?(" "+_1f.q):"");return this.portal.queryItems(_1f);}});_2.declare("esri.arcgis.PortalItem",null,{constructor:function(_20){_2.mixin(this,_20);this.itemUrl=(this.portal&&this.portal.portalUrl)+"content/items/"+this.id;this.userItemUrl=esri.arcgis.PortalUtil.formatUrl(this.itemUrl.replace("content",("content/users/"+this.owner)+(this.folderId?"/"+this.folderId:"")));this.itemDataUrl=esri.arcgis.PortalUtil.formatUrl(this.itemUrl+"/data");this.thumbnailUrl=esri.arcgis.PortalUtil.formatUrl(this.itemUrl+"/info/"+this.thumbnail);this.extent=this.extent;this.spatialReference=this.spatialReference;this.created=new Date(this.created);this.uploaded=new Date(this.uploaded);this.modified=new Date(this.modified);},addComment:function(_21){var _22=_2.isString(_21)?{"comment":_21}:_21;return esri.arcgis.PortalUtil.request(this.itemUrl+"/addComment",_22,{"usePost":true}).then(_2.hitch(this,function(_23){return new esri.arcgis.PortalComment(_2.mixin(_22,{"id":_23.commentId,"item":this}));}));},updateComment:function(_24){if(_24&&_24.url&&_24.comment){var _25={"comment":_24.comment};return esri.arcgis.PortalUtil.request(_24.url+"/update",_25,{"usePost":true}).then(function(_26){_24.id=_26.commentId;return _24;});}else{throw new Error();}},getComments:function(){return esri.arcgis.PortalUtil.requestToTypedArray(this.itemUrl+"/comments",null,null,esri.arcgis.PortalComment,{"item":this});},deleteComment:function(_27){if(_27&&_27.url){return esri.arcgis.PortalUtil.request(_27.url+"/delete",null,{"usePost":true});}else{throw new Error();}},addRating:function(_28){var _29=_2.isObject(_28)?_28:{"rating":parseFloat(_28)};return esri.arcgis.PortalUtil.request(this.itemUrl+"/addRating",_29,{"usePost":true}).then(_2.hitch(this,function(_2a){return new esri.arcgis.PortalRating(_2.mixin(_29,{"id":_2a.ratingId,"item":this}));}));},getRating:function(){return esri.arcgis.PortalUtil.request(this.itemUrl+"/rating").then(_2.hitch(this,function(_2b){return new esri.arcgis.PortalRating(_2.mixin(_2b,{"item":this}));}));},deleteRating:function(){return esri.arcgis.PortalUtil.request(this.itemUrl+"/deleteRating",null,{"usePost":true});}});_2.declare("esri.arcgis.PortalComment",null,{constructor:function(_2c){_2.mixin(this,_2c);this.url=this.item.itemUrl+"/comments/"+this.id;this.created=new Date(this.created);}});_2.declare("esri.arcgis.PortalRating",null,{constructor:function(_2d){_2.mixin(this,_2d);this.url=this.item.itemUrl+"/rating";this.created=new Date(this.created);}});_2.declare("esri.arcgis.PortalUser",null,{constructor:function(_2e){_2.mixin(this,_2e);this.url=(this.portal&&this.portal.portalUrl)+"community/users/"+this.username;this.userContentUrl=(this.portal&&this.portalUrl)+"content/users/"+this.username;this.thumbnailUrl=esri.arcgis.PortalUtil.formatUrl(this.url+"/info/"+this.thumbnail);this.extent=this.extent;this.modified=new Date(this.modified);this.created=new Date(this.created);},getGroups:function(){return esri.arcgis.PortalResult(esri.arcgis.PortalUtil.request(this.url).then(function(_2f){return esri.arcgis.PortalUtil.resultsToTypedArray(esri.arcgis.PortalGroup,{"portal":this.portal},_2f.groups);}));},getNotifications:function(){return esri.arcgis.PortalUtil.requestToTypedArray(this.url+"/notifications",null,null,null,{"portal":this.portal});},getGroupInvitations:function(){return esri.arcgis.PortalUtil.requestToTypedArray(this.url+"/invitations",null,null,null,{"portal":this.portal});},getTags:function(){return esri.arcgis.PortalUtil.requestToTypedArray(this.url+"/tags",null,null,null,{"portal":this.portal});},getFolders:function(){return esri.arcgis.PortalResult(this.getContent().then(function(_30){return _30.folders;}));},getItems:function(_31){return esri.arcgis.PortalResult(this.getContent(_31).then(function(_32){return _32.items;}));},getContent:function(_33){var url=(this.url.replace("community","content"))+(_33?("/"+_33):"");return esri.arcgis.PortalUtil.request(url).then(_2.hitch(this,function(_34){_34.folders=esri.arcgis.PortalUtil.resultsToTypedArray(esri.arcgis.PortalFolder,{"portal":this.portal},_34.folders);_34.items=esri.arcgis.PortalUtil.resultsToTypedArray(esri.arcgis.PortalItem,{"portal":this.portal,"folderId":_33},_34.items);return _34;}));}});esri.arcgis.PortalUtil={useSSL:function(_35,url){return (_35.indexOf("https:")!==-1||(_4.self&&_4.self.allSSL))?url.replace("http:","https:"):url;},formatUrl:function(url){var _36=_4.loggedInUser&&_4.loggedInUser.credential&&_4.loggedInUser.credential.token;return url.indexOf("null")!==-1?null:(_36?url+(url.indexOf("?")!==-1?"&":"?")+("token="+_36):url);},resultsToTypedArray:function(_37,_38,_39){_39=_39?(_39.notifications||_39.userInvitations||_39.tags||_39.items||_39.groups||_39.comments||_39.results||_39):[];return _2.map(_39,function(_3a){_3a=_2.mixin(_3a,_38||{});return _37?new _37(_3a):_3a;});},clearFieldsFromObject:function(_3b,obj){if(!_2.isArray(_3b)){for(var fld in _3b){delete obj[fld];}}else{for(var i=0,l=_3b.length;i<l;i++){delete obj[_3b[i]];}}return obj;},getSocket:function(url,_3c){_3c=_3c||{};var _3d=_3.socket({url:url,transport:_3c.transport||esri.arcgis.PortalUtil.request,interval:_3c.interval||60000});if(!_3c.reconnect===false){_3d=_3.socket.Reconnect(_3d);}return _3d;},requestToTypedArray:function(url,_3e,_3f,_40,_41){return esri.arcgis.PortalResult(esri.arcgis.PortalUtil.request(url,_3e,_3f).then(_2.partial(esri.arcgis.PortalUtil.resultsToTypedArray,_40,_41)));},request:function(url,_42,_43){_42&&_42.portal&&delete _42.portal;var _44=_2.mixin(_2.mixin({},_42||{}),_4.requestParams);var _45=_2.mixin(_43||{},_4.options);return esri.request({url:esri.arcgis.PortalUtil.useSSL(window.location.protocol,(url.url||url)),content:_44,callbackParamName:"callback",timeout:(_45&&_45.timeout)||0},_45);},formatQueryParams:function(_46,_47){var qp=_2.mixin(_2.mixin({},_46),(_2.isString(_47)?{"q":_47}:(_47||{})));qp.q=_4.extraQuery?"("+qp.q+")"+_4.extraQuery:qp.q;return qp;}};})();});