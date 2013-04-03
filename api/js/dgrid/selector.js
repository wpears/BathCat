//>>built
define("dgrid/selector",["dojo/_base/kernel","dojo/on","dojo/aspect","dojo/_base/sniff","put-selector/put"],function(_1,on,_2,_3,_4){dojo.getObject("dgrid.selector",true);return (dgrid.selector=function(_5,_6){if(_5.type){_5.selectorType=_5.type;_1.deprecated("columndef.type","use columndef.selectorType instead","dgrid 1.0");}_5.selectorType=_6=_6||_5.selectorType||"checkbox";_5.sortable=false;var _7,_8,_9,_a;function _b(_c){return function(_d){var _e=_d.rows,_f=_e.length,_10,_11,i;for(i=0;i<_f;i++){var _12=_7.cell(_e[i],_5.id).element;if(!_12){continue;}_12=(_12.contents||_12).input;if(!_12.disabled){_12.checked=_c;}}if(_a.type=="checkbox"){_10=_7.selection;_11=false;for(i in _10){if(_10[i]!=_7.allSelected){_11=true;break;}}_a.indeterminate=_11;_a.checked=_7.allSelected;}};};function _13(_14){if(_14.type=="click"||_14.keyCode==32||_14.keyCode==0){var row=_7.row(_14),_15=_7._lastSelected&&_7.row(_7._lastSelected);if(_6=="radio"){if(!_15||_15.id!=row.id){_7.clearSelection();_7.select(row,null,true);_7._lastSelected=row.element;}}else{if(row){if(_14.shiftKey){_b(true)({rows:[row]});}else{_15=null;}_15=_14.shiftKey?_15:null;_7.select(_15||row,row,_15?undefined:null);_7._lastSelected=row.element;}else{_4(this,(_7.allSelected?"!":".")+"dgrid-select-all");_7[_7.allSelected?"clearSelection":"selectAll"]();}}}};function _16(){_7._hasSelectorInputListener=true;_2.before(_7,"_initSelectionEvents",function(){this.on(".dgrid-selector:click,.dgrid-selector:keydown",_13);});var _17=_7._handleSelect;_7._handleSelect=function(_18){if(this.cell(_18).column!=_5){_17.apply(this,arguments);}};if(typeof _5.disabled=="function"){var _19=_7.allowSelect;_7.allowSelect=function(row){return _19.call(this,row)&&!_5.disabled(row.data);};}_7.on("dgrid-select",_b(true));_7.on("dgrid-deselect",_b(false));};var _1a=_5.disabled;var _1b=typeof _6=="function"?_6:function(_1c,_1d,_1e){var _1f=_1d.parentNode;_4(_1f&&_1f.contents?_1f:_1d,".dgrid-selector");var _20=_1d.input||(_1d.input=_4(_1d,"input[type="+_6+"]",{tabIndex:isNaN(_5.tabIndex)?-1:_5.tabIndex,disabled:_1a&&(typeof _1a=="function"?_1a(_1e):_1a),checked:_1c}));if(!_7._hasSelectorInputListener){_16();}return _20;};_5.renderCell=function(_21,_22,_23,_24,_25){if(!_7){_7=_5.grid;}var row=_21&&_7.row(_21);_22=row&&_7.selection[row.id];if(_25&&(_6=="radio"||typeof _21=="string"||!_7.allowSelectAll)){_23.appendChild(document.createTextNode(_21||""));if(!_7._hasSelectorInputListener){_16();}}else{_1b(_22,_23,_21);}};_5.renderHeaderCell=function(th){_5.renderCell(_5.label||{},null,th,null,true);_a=th.lastChild;};return _5;});});