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
define(["dijit","dojo","dojox","dojo/require!dojo/_base/Color,dojox/gfx/_base,esri/utils"],function(_1,_2,_3){_2.provide("esri.symbol");_2.require("dojo._base.Color");_2.require("dojox.gfx._base");_2.require("esri.utils");_2.mixin(esri.symbol,{toDojoColor:function(_4){return _4&&new _2.Color([_4[0],_4[1],_4[2],_4[3]/255]);},toJsonColor:function(_5){return _5&&[_5.r,_5.g,_5.b,Math.round(_5.a*255)];},fromJson:function(_6){var _7=_6.type,_8=null;switch(_7.substring(0,"esriXX".length)){case "esriSM":_8=new esri.symbol.SimpleMarkerSymbol(_6);break;case "esriPM":_8=new esri.symbol.PictureMarkerSymbol(_6);break;case "esriTS":_8=new esri.symbol.TextSymbol(_6);break;case "esriSL":if(_6.cap!==undefined){_8=new esri.symbol.CartographicLineSymbol(_6);}else{_8=new esri.symbol.SimpleLineSymbol(_6);}break;case "esriSF":_8=new esri.symbol.SimpleFillSymbol(_6);break;case "esriPF":_8=new esri.symbol.PictureFillSymbol(_6);break;}return _8;}});_2.declare("esri.symbol.Symbol",null,{color:new _2.Color([0,0,0,1]),type:null,_stroke:null,_fill:null,constructor:function(_9){if(_9&&_2.isObject(_9)){_2.mixin(this,_9);if(this.color&&esri._isDefined(this.color[0])){this.color=esri.symbol.toDojoColor(this.color);}var _a=this.type;if(_a&&_a.indexOf("esri")===0){this.type={"esriSMS":"simplemarkersymbol","esriPMS":"picturemarkersymbol","esriSLS":"simplelinesymbol","esriCLS":"cartographiclinesymbol","esriSFS":"simplefillsymbol","esriPFS":"picturefillsymbol","esriTS":"textsymbol"}[_a];}}},setColor:function(_b){this.color=_b;return this;},toJson:function(){return {color:esri.symbol.toJsonColor(this.color)};}});_2.declare("esri.symbol.MarkerSymbol",esri.symbol.Symbol,{constructor:function(_c){if(_c&&_2.isObject(_c)){this.size=_3.gfx.pt2px(this.size);this.xoffset=_3.gfx.pt2px(this.xoffset);this.yoffset=_3.gfx.pt2px(this.yoffset);}},setAngle:function(_d){this.angle=_d;return this;},setSize:function(_e){this.size=_e;return this;},setOffset:function(x,y){this.xoffset=x;this.yoffset=y;return this;},toJson:function(){var _f=_3.gfx.px2pt(this.size);_f=isNaN(_f)?undefined:_f;var _10=_3.gfx.px2pt(this.xoffset);_10=isNaN(_10)?undefined:_10;var _11=_3.gfx.px2pt(this.yoffset);_11=isNaN(_11)?undefined:_11;return _2.mixin(this.inherited("toJson",arguments),{size:_f,angle:this.angle,xoffset:_10,yoffset:_11});},angle:0,xoffset:0,yoffset:0,size:12});_2.declare("esri.symbol.SimpleMarkerSymbol",esri.symbol.MarkerSymbol,{constructor:function(_12,_13,_14,_15){if(_12){if(_2.isString(_12)){this.style=_12;if(_13){this.size=_13;}if(_14){this.outline=_14;}if(_15){this.color=_15;}}else{this.style=esri.valueOf(this._styles,this.style);if(_12.outline){this.outline=new esri.symbol.SimpleLineSymbol(_12.outline);}}}else{_2.mixin(this,esri.symbol.defaultSimpleMarkerSymbol);this.size=_3.gfx.pt2px(this.size);this.outline=new esri.symbol.SimpleLineSymbol(this.outline);this.color=new _2.Color(this.color);}if(!this.style){this.style=esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE;}},type:"simplemarkersymbol",setStyle:function(_16){this.style=_16;return this;},setOutline:function(_17){this.outline=_17;return this;},getStroke:function(){return this.outline&&this.outline.getStroke();},getFill:function(){return this.color;},_setDim:function(_18,_19,_1a){this._targetWidth=_18;this._targetHeight=_19;this._spikeSize=_1a;},toJson:function(){var _1b=_2.mixin(this.inherited("toJson",arguments),{type:"esriSMS",style:this._styles[this.style]}),_1c=this.outline;if(_1c){_1b.outline=_1c.toJson();}return esri._sanitize(_1b);},_styles:{circle:"esriSMSCircle",square:"esriSMSSquare",cross:"esriSMSCross",x:"esriSMSX",diamond:"esriSMSDiamond"}});_2.mixin(esri.symbol.SimpleMarkerSymbol,{STYLE_CIRCLE:"circle",STYLE_SQUARE:"square",STYLE_CROSS:"cross",STYLE_X:"x",STYLE_DIAMOND:"diamond",STYLE_TARGET:"target"});_2.declare("esri.symbol.PictureMarkerSymbol",esri.symbol.MarkerSymbol,{constructor:function(_1d,_1e,_1f){if(_1d){if(_2.isString(_1d)){this.url=_1d;if(_1e){this.width=_1e;}if(_1f){this.height=_1f;}}else{this.width=_3.gfx.pt2px(_1d.width);this.height=_3.gfx.pt2px(_1d.height);var _20=_1d.imageData;if((!(_2.isIE<9))&&_20){var _21=this.url;this.url="data:"+(_1d.contentType||"image")+";base64,"+_20;this.imageData=_21;}}}else{_2.mixin(this,esri.symbol.defaultPictureMarkerSymbol);this.width=_3.gfx.pt2px(this.width);this.height=_3.gfx.pt2px(this.height);}},type:"picturemarkersymbol",getStroke:function(){return null;},getFill:function(){return null;},setWidth:function(_22){this.width=_22;return this;},setHeight:function(_23){this.height=_23;return this;},setUrl:function(url){if(url!==this.url){delete this.imageData;delete this.contentType;}this.url=url;return this;},toJson:function(){var url=this.url,_24=this.imageData;if(url.indexOf("data:")===0){var _25=url;url=_24;var _26=_25.indexOf(";base64,")+8;_24=_25.substr(_26);}url=esri._getAbsoluteUrl(url);var _27=_3.gfx.px2pt(this.width);_27=isNaN(_27)?undefined:_27;var _28=_3.gfx.px2pt(this.height);_28=isNaN(_28)?undefined:_28;var _29=esri._sanitize(_2.mixin(this.inherited("toJson",arguments),{type:"esriPMS",url:url,imageData:_24,contentType:this.contentType,width:_27,height:_28}));delete _29.color;delete _29.size;if(!_29.imageData){delete _29.imageData;}return _29;}});_2.declare("esri.symbol.LineSymbol",esri.symbol.Symbol,{constructor:function(_2a){if(_2.isObject(_2a)){this.width=_3.gfx.pt2px(this.width);}else{this.width=12;}},setWidth:function(_2b){this.width=_2b;return this;},toJson:function(){var _2c=_3.gfx.px2pt(this.width);_2c=isNaN(_2c)?undefined:_2c;return _2.mixin(this.inherited("toJson",arguments),{width:_2c});}});_2.declare("esri.symbol.SimpleLineSymbol",esri.symbol.LineSymbol,{constructor:function(_2d,_2e,_2f){if(_2d){if(_2.isString(_2d)){this.style=_2d;if(_2e){this.color=_2e;}if(_2f){this.width=_2f;}}else{this.style=esri.valueOf(this._styles,_2d.style)||esri.symbol.SimpleLineSymbol.STYLE_SOLID;}}else{_2.mixin(this,esri.symbol.defaultSimpleLineSymbol);this.color=new _2.Color(this.color);this.width=_3.gfx.pt2px(this.width);}},type:"simplelinesymbol",setStyle:function(_30){this.style=_30;return this;},getStroke:function(){return (this.style===esri.symbol.SimpleLineSymbol.STYLE_NULL||this.width===0)?null:{color:this.color,style:this.style,width:this.width};},getFill:function(){return null;},toJson:function(){return esri._sanitize(_2.mixin(this.inherited("toJson",arguments),{type:"esriSLS",style:this._styles[this.style]}));},_styles:{solid:"esriSLSSolid",dash:"esriSLSDash",dot:"esriSLSDot",dashdot:"esriSLSDashDot",longdashdotdot:"esriSLSDashDotDot",none:"esriSLSNull",insideframe:"esriSLSInsideFrame"}});_2.mixin(esri.symbol.SimpleLineSymbol,{STYLE_SOLID:"solid",STYLE_DASH:"dash",STYLE_DOT:"dot",STYLE_DASHDOT:"dashdot",STYLE_DASHDOTDOT:"longdashdotdot",STYLE_NULL:"none"});_2.declare("esri.symbol.CartographicLineSymbol",esri.symbol.SimpleLineSymbol,{constructor:function(_31,_32,_33,cap,_34,_35){if(_31){if(_2.isString(_31)){this.style=_31;if(_32){this.color=_32;}if(_33!==undefined){this.width=_33;}if(cap){this.cap=cap;}if(_34){this.join=_34;}if(_35!==undefined){this.miterLimit=_35;}}else{this.cap=esri.valueOf(this._caps,_31.cap);this.join=esri.valueOf(this._joins,_31.join);this.width=_3.gfx.pt2px(_31.width);this.miterLimit=_3.gfx.pt2px(_31.miterLimit);}}else{_2.mixin(this,esri.symbol.defaultCartographicLineSymbol);this.color=new _2.Color(this.color);this.width=_3.gfx.pt2px(this.width);this.miterLimit=_3.gfx.pt2px(this.miterLimit);}},type:"cartographiclinesymbol",setCap:function(cap){this.cap=cap;return this;},setJoin:function(_36){this.join=_36;return this;},setMiterLimit:function(_37){this.miterLimit=_37;return this;},getStroke:function(){return _2.mixin(this.inherited("getStroke",arguments),{cap:this.cap,join:(this.join===esri.symbol.CartographicLineSymbol.JOIN_MITER?this.miterLimit:this.join)});},getFill:function(){return null;},toJson:function(){var _38=_3.gfx.px2pt(this.miterLimit);_38=isNaN(_38)?undefined:_38;return esri._sanitize(_2.mixin(this.inherited("toJson",arguments),{type:"esriCLS",cap:this._caps[this.cap],join:this._joins[this.join],miterLimit:_38}));},_caps:{butt:"esriLCSButt",round:"esriLCSRound",square:"esriLCSSquare"},_joins:{miter:"esriLJSMiter",round:"esriLJSRound",bevel:"esriLJSBevel"}});_2.mixin(esri.symbol.CartographicLineSymbol,{STYLE_SOLID:"solid",STYLE_DASH:"dash",STYLE_DOT:"dot",STYLE_DASHDOT:"dashdot",STYLE_DASHDOTDOT:"longdashdotdot",STYLE_NULL:"none",STYLE_INSIDE_FRAME:"insideframe",CAP_BUTT:"butt",CAP_ROUND:"round",CAP_SQUARE:"square",JOIN_MITER:"miter",JOIN_ROUND:"round",JOIN_BEVEL:"bevel"});_2.declare("esri.symbol.FillSymbol",esri.symbol.Symbol,{constructor:function(_39){if(_39&&_2.isObject(_39)&&_39.outline){this.outline=new esri.symbol.SimpleLineSymbol(_39.outline);}},setOutline:function(_3a){this.outline=_3a;return this;},toJson:function(){var _3b=this.inherited("toJson",arguments);if(this.outline){_3b.outline=this.outline.toJson();}return _3b;}});_2.declare("esri.symbol.SimpleFillSymbol",esri.symbol.FillSymbol,{constructor:function(_3c,_3d,_3e){if(_3c){if(_2.isString(_3c)){this.style=_3c;if(_3d!==undefined){this.outline=_3d;}if(_3e!==undefined){this.color=_3e;}}else{this.style=esri.valueOf(this._styles,_3c.style);}}else{_2.mixin(this,esri.symbol.defaultSimpleFillSymbol);this.outline=new esri.symbol.SimpleLineSymbol(this.outline);this.color=new _2.Color(this.color);}var _3f=this.style;if(_3f!=="solid"&&_3f!=="none"){this._src=_2.moduleUrl("esri")+"../../images/symbol/sfs/"+_3f+".png";}},type:"simplefillsymbol",setStyle:function(_40){this.style=_40;return this;},getStroke:function(){return this.outline&&this.outline.getStroke();},getFill:function(){var _41=this.style;if(_41===esri.symbol.SimpleFillSymbol.STYLE_NULL){return null;}else{if(_41===esri.symbol.SimpleFillSymbol.STYLE_SOLID){return this.color;}else{return _2.mixin(_2.mixin({},_3.gfx.defaultPattern),{src:this._src,width:10,height:10});}}},toJson:function(){return esri._sanitize(_2.mixin(this.inherited("toJson",arguments),{type:"esriSFS",style:this._styles[this.style]}));},_styles:{solid:"esriSFSSolid",none:"esriSFSNull",horizontal:"esriSFSHorizontal",vertical:"esriSFSVertical",forwarddiagonal:"esriSFSForwardDiagonal",backwarddiagonal:"esriSFSBackwardDiagonal",cross:"esriSFSCross",diagonalcross:"esriSFSDiagonalCross"}});_2.mixin(esri.symbol.SimpleFillSymbol,{STYLE_SOLID:"solid",STYLE_NULL:"none",STYLE_HORIZONTAL:"horizontal",STYLE_VERTICAL:"vertical",STYLE_FORWARD_DIAGONAL:"forwarddiagonal",STYLE_BACKWARD_DIAGONAL:"backwarddiagonal",STYLE_CROSS:"cross",STYLE_DIAGONAL_CROSS:"diagonalcross",STYLE_FORWARDDIAGONAL:"forwarddiagonal",STYLE_BACKWARDDIAGONAL:"backwarddiagonal",STYLE_DIAGONALCROSS:"diagonalcross"});_2.declare("esri.symbol.PictureFillSymbol",esri.symbol.FillSymbol,{constructor:function(_42,_43,_44,_45){if(_42){if(_2.isString(_42)){this.url=_42;if(_43!==undefined){this.outline=_43;}if(_44!==undefined){this.width=_44;}if(_45!==undefined){this.height=_45;}}else{this.xoffset=_3.gfx.pt2px(_42.xoffset);this.yoffset=_3.gfx.pt2px(_42.yoffset);this.width=_3.gfx.pt2px(_42.width);this.height=_3.gfx.pt2px(_42.height);var _46=_42.imageData;if((!(_2.isIE<9))&&_46){var _47=this.url;this.url="data:"+(_42.contentType||"image")+";base64,"+_46;this.imageData=_47;}}}else{_2.mixin(this,esri.symbol.defaultPictureFillSymbol);this.width=_3.gfx.pt2px(this.width);this.height=_3.gfx.pt2px(this.height);}},type:"picturefillsymbol",xscale:1,yscale:1,xoffset:0,yoffset:0,setWidth:function(_48){this.width=_48;return this;},setHeight:function(_49){this.height=_49;return this;},setOffset:function(x,y){this.xoffset=x;this.yoffset=y;return this;},setUrl:function(url){if(url!==this.url){delete this.imageData;delete this.contentType;}this.url=url;return this;},setXScale:function(_4a){this.xscale=_4a;return this;},setYScale:function(_4b){this.yscale=_4b;return this;},getStroke:function(){return this.outline&&this.outline.getStroke();},getFill:function(){return _2.mixin({},_3.gfx.defaultPattern,{src:this.url,width:(this.width*this.xscale),height:(this.height*this.yscale),x:this.xoffset,y:this.yoffset});},toJson:function(){var url=this.url,_4c=this.imageData;if(url.indexOf("data:")===0){var _4d=url;url=_4c;var _4e=_4d.indexOf(";base64,")+8;_4c=_4d.substr(_4e);}url=esri._getAbsoluteUrl(url);var _4f=_3.gfx.px2pt(this.width);_4f=isNaN(_4f)?undefined:_4f;var _50=_3.gfx.px2pt(this.height);_50=isNaN(_50)?undefined:_50;var _51=_3.gfx.px2pt(this.xoffset);_51=isNaN(_51)?undefined:_51;var _52=_3.gfx.px2pt(this.yoffset);_52=isNaN(_52)?undefined:_52;var _53=esri._sanitize(_2.mixin(this.inherited("toJson",arguments),{type:"esriPFS",url:url,imageData:_4c,contentType:this.contentType,width:_4f,height:_50,xoffset:_51,yoffset:_52,xscale:this.xscale,yscale:this.yscale}));if(!_53.imageData){delete _53.imageData;}return _53;}});_2.declare("esri.symbol.Font",null,{constructor:function(_54,_55,_56,_57,_58){if(_54){if(_2.isObject(_54)){_2.mixin(this,_54);}else{this.size=_54;if(_55!==undefined){this.style=_55;}if(_56!==undefined){this.variant=_56;}if(_57!==undefined){this.weight=_57;}if(_58!==undefined){this.family=_58;}}}else{_2.mixin(this,_3.gfx.defaultFont);}},setSize:function(_59){this.size=_59;return this;},setStyle:function(_5a){this.style=_5a;return this;},setVariant:function(_5b){this.variant=_5b;return this;},setWeight:function(_5c){this.weight=_5c;return this;},setFamily:function(_5d){this.family=_5d;return this;},toJson:function(){return esri._sanitize({size:this.size,style:this.style,variant:this.variant,decoration:this.decoration,weight:this.weight,family:this.family});}});_2.mixin(esri.symbol.Font,{STYLE_NORMAL:"normal",STYLE_ITALIC:"italic",STYLE_OBLIQUE:"oblique",VARIANT_NORMAL:"normal",VARIANT_SMALLCAPS:"small-caps",WEIGHT_NORMAL:"normal",WEIGHT_BOLD:"bold",WEIGHT_BOLDER:"bolder",WEIGHT_LIGHTER:"lighter"});_2.declare("esri.symbol.TextSymbol",esri.symbol.Symbol,{constructor:function(_5e,_5f,_60){_2.mixin(this,esri.symbol.defaultTextSymbol);this.font=new esri.symbol.Font(this.font);this.color=new _2.Color(this.color);if(_5e){if(_2.isObject(_5e)){_2.mixin(this,_5e);if(this.color&&esri._isDefined(this.color[0])){this.color=esri.symbol.toDojoColor(this.color);}this.type="textsymbol";this.font=new esri.symbol.Font(this.font);this.xoffset=_3.gfx.pt2px(this.xoffset);this.yoffset=_3.gfx.pt2px(this.yoffset);}else{this.text=_5e;if(_5f){this.font=_5f;}if(_60){this.color=_60;}}}},angle:0,xoffset:0,yoffset:0,setFont:function(_61){this.font=_61;return this;},setAngle:function(_62){this.angle=_62;return this;},setOffset:function(x,y){this.xoffset=x;this.yoffset=y;return this;},setAlign:function(_63){this.align=_63;return this;},setDecoration:function(_64){this.decoration=_64;return this;},setRotated:function(_65){this.rotated=_65;return this;},setKerning:function(_66){this.kerning=_66;return this;},setText:function(_67){this.text=_67;return this;},getStroke:function(){return null;},getFill:function(){return this.color;},toJson:function(){var _68=_3.gfx.px2pt(this.xoffset);_68=isNaN(_68)?undefined:_68;var _69=_3.gfx.px2pt(this.yoffset);_69=isNaN(_69)?undefined:_69;return esri._sanitize(_2.mixin(this.inherited("toJson",arguments),{type:"esriTS",backgroundColor:this.backgroundColor,borderLineColor:this.borderLineColor,verticalAlignment:this.verticalAlignment,horizontalAlignment:this.horizontalAlignment,rightToLeft:this.rightToLeft,width:this.width,angle:this.angle,xoffset:_68,yoffset:_69,text:this.text,align:this.align,decoration:this.decoration,rotated:this.rotated,kerning:this.kerning,font:this.font.toJson()}));}});_2.mixin(esri.symbol.TextSymbol,{ALIGN_START:"start",ALIGN_MIDDLE:"middle",ALIGN_END:"end",DECORATION_NONE:"none",DECORATION_UNDERLINE:"underline",DECORATION_OVERLINE:"overline",DECORATION_LINETHROUGH:"line-through"});_2.mixin(esri.symbol,{defaultSimpleLineSymbol:{color:[0,0,0,1],style:esri.symbol.SimpleLineSymbol.STYLE_SOLID,width:1},defaultSimpleMarkerSymbol:{style:esri.symbol.SimpleMarkerSymbol.STYLE_CIRCLE,color:[255,255,255,0.25],outline:esri.symbol.defaultSimpleLineSymbol,size:12,angle:0,xoffset:0,yoffset:0},defaultPictureMarkerSymbol:{url:"",width:12,height:12,angle:0,xoffset:0,yoffset:0},defaultCartographicLineSymbol:{color:[0,0,0,1],style:esri.symbol.CartographicLineSymbol.STYLE_SOLID,width:1,cap:esri.symbol.CartographicLineSymbol.CAP_BUTT,join:esri.symbol.CartographicLineSymbol.JOIN_MITER,miterLimit:10},defaultSimpleFillSymbol:{style:esri.symbol.SimpleFillSymbol.STYLE_SOLID,color:[0,0,0,0.25],outline:esri.symbol.defaultSimpleLineSymbol},defaultPictureFillSymbol:{xoffset:0,yoffset:0,width:12,height:12},defaultTextSymbol:{color:[0,0,0,1],font:_3.gfx.defaultFont,angle:0,xoffset:0,yoffset:0},getShapeDescriptors:function(_6a){var _6b,_6c,_6d;var _6e=_6a.type;switch(_6e){case "simplemarkersymbol":var _6f=_6a.style,SMS=esri.symbol.SimpleMarkerSymbol;var _70=_6a.size||_3.gfx.pt2px(esri.symbol.defaultSimpleMarkerSymbol.size),cx=0,cy=0,_71=_70/2;var _72=cx-_71,_73=cx+_71,top=cy-_71,_74=cy+_71;switch(_6f){case SMS.STYLE_CIRCLE:_6b={type:"circle",cx:cx,cy:cy,r:_71};_6c=_6a.getFill();_6d=_6a.getStroke();if(_6d){_6d.style=_6d.style||"Solid";}break;case SMS.STYLE_CROSS:_6b={type:"path",path:"M "+_72+",0 L "+_73+",0 M 0,"+top+" L 0,"+_74+" E"};_6c=null;_6d=_6a.getStroke();break;case SMS.STYLE_DIAMOND:_6b={type:"path",path:"M "+_72+",0 L 0,"+top+" L "+_73+",0 L 0,"+_74+" L "+_72+",0 E"};_6c=_6a.getFill();_6d=_6a.getStroke();break;case SMS.STYLE_SQUARE:_6b={type:"path",path:"M "+_72+","+_74+" L "+_72+","+top+" L "+_73+","+top+" L "+_73+","+_74+" L "+_72+","+_74+" E"};_6c=_6a.getFill();_6d=_6a.getStroke();break;case SMS.STYLE_X:_6b={type:"path",path:"M "+_72+","+_74+" L "+_73+","+top+" M "+_72+","+top+" L "+_73+","+_74+" E"};_6c=null;_6d=_6a.getStroke();break;}break;case "picturemarkersymbol":_6b={type:"image",x:0,y:0,width:16,height:16,src:""};_6b.x=_6b.x-Math.round(_6a.width/2);_6b.y=_6b.y-Math.round(_6a.height/2);_6b.width=_6a.width;_6b.height=_6a.height;_6b.src=_6a.url;break;case "simplelinesymbol":case "cartographiclinesymbol":_6b={type:"path",path:"M -15,0 L 15,0 E"};_6c=null;_6d=_6a.getStroke();break;case "simplefillsymbol":case "picturefillsymbol":_6b={type:"path",path:"M -10,-10 L 10,0 L 10,10 L -10,10 L -10,-10 E"};_6c=_6a.getFill();_6d=_6a.getStroke();break;}return {defaultShape:_6b,fill:_6c,stroke:_6d};}});_2.mixin(esri.symbol.defaultTextSymbol,_3.gfx.defaultText,{type:"textsymbol",align:"middle"});});