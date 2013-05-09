/*
	Copyright (c) 2004-2011, The Dojo Foundation All Rights Reserved.
	Available via Academic Free License >= 2.1 OR the modified BSD license.
	see: http://dojotoolkit.org/license for details
*/

//>>built
define("dojo/_base/loader",["./kernel","../has","require","module","./json","./lang","./array"],function(_1,_2,_3,_4,_5,_6,_7){if(!1){console.error("cannot load the Dojo v1.x loader with a foreign loader");return 0;}var _8=function(id){return {src:_4.id,id:id};},_9=function(_a){return _a.replace(/\./g,"/");},_b=/\/\/>>built/,_c=[],_d=[],_e=function(_f,_10,_11){_c.push(_11);_7.forEach(_f.split(","),function(mid){var _12=_13(mid,_10.module);_d.push(_12);_14(_12);});_15();},_16,_17=function(m){var _18;if(_16[m.mid]===1||/loadInit\!/.test(m.mid)||/require\!/.test(m.mid)){_16[m.mid]=1;return true;}if(_16[m.mid]===0||(m.injected!==_19&&!m.executed)){_16[m.mid]=0;return false;}_16[m.mid]=1;for(var _1a=m.deps||[],i=0;i<_1a.length;i++){_18=_1a[i];if(!_16[_18.mid]&&!_18.executed&&!_17(_18)){_16[m.mid]=0;return false;}}return true;},_15=function(){var _1b;_16={};for(var i=0,end=_d.length;i<end;i++){_1b=_d[i];if(!_16[_1b.mid]&&!_1b.executed&&!_17(_1b)){return;}}_1c.holdIdle();var _1d=_c;_c=[];_7.forEach(_1d,function(cb){cb(1);});_1c.releaseIdle();},_1e=function(mid,_1f,_20){_1f([mid],function(_21){_1f(_21.names,function(){for(var _22="",_23=[],i=0;i<arguments.length;i++){_22+="var "+_21.names[i]+"= arguments["+i+"]; ";_23.push(arguments[i]);}eval(_22);var _24=_1f.module,_25=[],_26={},_27=[],p,_28={provide:function(_29){_29=_9(_29);var _2a=_13(_29,_24);if(_2a!==_24){_53(_2a);}},require:function(_2b,_2c){_2b=_9(_2b);_2c&&(_13(_2b,_24).result=_4d);_27.push(_2b);},requireLocalization:function(_2d,_2e,_2f){_25.length||(_25=["dojo/i18n"]);_2f=(_2f||_1.locale).toLowerCase();_2d=_9(_2d)+"/nls/"+(/root/i.test(_2f)?"":_2f+"/")+_9(_2e);if(_13(_2d,_24).isXd){_25.push("dojo/i18n!"+_2d);}},loadInit:function(f){f();}};try{for(p in _28){_26[p]=_1[p];_1[p]=_28[p];}_21.def.apply(null,_23);}catch(e){_54("error",[_8("failedDojoLoadInit"),e]);}finally{for(p in _28){_1[p]=_26[p];}}_27.length&&_25.push("dojo/require!"+_27.join(","));_c.push(_20);_7.forEach(_27,function(mid){var _30=_13(mid,_1f.module);_d.push(_30);_14(_30);});_15();});});},_31=function(_32,_33,_34){var _35=/\(|\)/g,_36=1,_37;_35.lastIndex=_33;while((_37=_35.exec(_32))){if(_37[0]==")"){_36-=1;}else{_36+=1;}if(_36==0){break;}}if(_36!=0){throw "unmatched paren around character "+_35.lastIndex+" in: "+_32;}return [_1.trim(_32.substring(_34,_35.lastIndex))+";\n",_35.lastIndex];},_38=/(\/\*([\s\S]*?)\*\/|\/\/(.*)$)/mg,_39=/(^|\s)dojo\.(loadInit|require|provide|requireLocalization|requireIf|requireAfterIf|platformRequire)\s*\(/mg,_3a=/(^|\s)(require|define)\s*\(/m,_3b=function(_3c,_3d){var _3e,_3f,_40,_41,_42=[],_43=[],_44=[];_3d=_3d||_3c.replace(_38,function(_45){_39.lastIndex=_3a.lastIndex=0;return (_39.test(_45)||_3a.test(_45))?"":_45;});while((_3e=_39.exec(_3d))){_3f=_39.lastIndex;_40=_3f-_3e[0].length;_41=_31(_3d,_3f,_40);if(_3e[2]=="loadInit"){_42.push(_41[0]);}else{_43.push(_41[0]);}_39.lastIndex=_41[1];}_44=_42.concat(_43);if(_44.length||!_3a.test(_3d)){return [_3c.replace(/(^|\s)dojo\.loadInit\s*\(/g,"\n0 && dojo.loadInit("),_44.join(""),_44];}else{return 0;}},_46=function(_47,_48){var _49,id,_4a=[],_4b=[];if(_b.test(_48)||!(_49=_3b(_48))){return 0;}id=_47.mid+"-*loadInit";for(var p in _13("dojo",_47).result.scopeMap){_4a.push(p);_4b.push("\""+p+"\"");}return "// xdomain rewrite of "+_47.path+"\n"+"define('"+id+"',{\n"+"\tnames:"+_1.toJson(_4a)+",\n"+"\tdef:function("+_4a.join(",")+"){"+_49[1]+"}"+"});\n\n"+"define("+_1.toJson(_4a.concat(["dojo/loadInit!"+id]))+", function("+_4a.join(",")+"){\n"+_49[0]+"});";},_1c=_3.initSyncLoader(_e,_15,_46),_4c=_1c.sync,xd=_1c.xd,_19=_1c.arrived,_4d=_1c.nonmodule,_4e=_1c.executing,_4f=_1c.executed,_50=_1c.syncExecStack,_51=_1c.modules,_52=_1c.execQ,_13=_1c.getModule,_14=_1c.injectModule,_53=_1c.setArrived,_54=_1c.signal,_55=_1c.finishExec,_56=_1c.execModule,_57=_1c.getLegacyMode;_1.provide=function(mid){var _58=_50[0],_59=_6.mixin(_13(_9(mid),_3.module),{executed:_4e,result:_6.getObject(mid,true)});_53(_59);if(_58){(_58.provides||(_58.provides=[])).push(function(){_59.result=_6.getObject(mid);delete _59.provides;_59.executed!==_4f&&_55(_59);});}return _59.result;};_2.add("config-publishRequireResult",1,0,0);_1.require=function(_5a,_5b){function _5c(mid,_5d){var _5e=_13(_9(mid),_3.module);if(_50.length&&_50[0].finish){_50[0].finish.push(mid);return undefined;}if(_5e.executed){return _5e.result;}_5d&&(_5e.result=_4d);var _5f=_57();_14(_5e);_5f=_57();if(_5e.executed!==_4f&&_5e.injected===_19){_1c.holdIdle();_56(_5e);_1c.releaseIdle();}if(_5e.executed){return _5e.result;}if(_5f==_4c){if(_5e.cjs){_52.unshift(_5e);}else{_50.length&&(_50[0].finish=[mid]);}}else{_52.push(_5e);}return undefined;};var _60=_5c(_5a,_5b);if(_2("config-publishRequireResult")&&!_6.exists(_5a)&&_60!==undefined){_6.setObject(_5a,_60);}return _60;};_1.loadInit=function(f){f();};_1.registerModulePath=function(_61,_62){var _63={};_63[_61.replace(/\./g,"/")]=_62;_3({paths:_63});};_1.platformRequire=function(_64){var _65=(_64.common||[]).concat(_64[_1._name]||_64["default"]||[]),_66;while(_65.length){if(_6.isArray(_66=_65.shift())){_1.require.apply(_1,_66);}else{_1.require(_66);}}};_1.requireIf=_1.requireAfterIf=function(_67,_68,_69){if(_67){_1.require(_68,_69);}};_1.requireLocalization=function(_6a,_6b,_6c){_3(["../i18n"],function(_6d){_6d.getLocalization(_6a,_6b,_6c);});};return {extractLegacyApiApplications:_3b,require:_1c.dojoRequirePlugin,loadInit:_1e};});