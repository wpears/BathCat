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
define("esri/layout",["dijit","dojo","dojox","dojo/require!dojo/dnd/AutoSource,dojo/dnd/Target,dijit/form/RadioButton,dijit/form/CheckBox,dijit/form/TextBox,dijit/form/Button,dijit/form/Slider,dijit/Menu,dijit/MenuItem,dijit/popup,dijit/PopupMenuItem,dijit/Dialog,dijit/TooltipDialog,dijit/MenuSeparator,dijit/layout/BorderContainer,dijit/layout/StackContainer,dijit/layout/StackController,dijit/layout/ContentPane,dijit/layout/TabContainer,dijit/layout/TabController,dijit/layout/AccordionPane,dijit/layout/AccordionContainer,dojox/fx,dojox/form/Rating,dojox/NodeList/delegate,dojox/charting/Chart2D,dojox/charting/themes/ThreeD,dojox/charting/themes/PrimaryColors,dojox/charting/themes/gradientGenerator,dojox/layout/ExpandoPane,dojox/layout/FloatingPane,dojox/layout/ResizeHandle"],function(_1,_2,_3){_2.provide("esri.layout");_2.require("dojo.dnd.AutoSource");_2.require("dojo.dnd.Target");_2.require("dijit.form.RadioButton");_2.require("dijit.form.CheckBox");_2.require("dijit.form.TextBox");_2.require("dijit.form.Button");_2.require("dijit.form.Slider");_2.require("dijit.Menu");_2.require("dijit.MenuItem");_2.require("dijit.popup");_2.require("dijit.PopupMenuItem");_2.require("dijit.Dialog");_2.require("dijit.TooltipDialog");_2.require("dijit.MenuSeparator");_2.require("dijit.layout.BorderContainer");_2.require("dijit.layout.StackContainer");_2.require("dijit.layout.StackController");_2.require("dijit.layout.ContentPane");_2.require("dijit.layout.TabContainer");_2.require("dijit.layout.TabController");_2.require("dijit.layout.AccordionPane");_2.require("dijit.layout.AccordionContainer");_2.require("dojox.fx");_2.require("dojox.form.Rating");_2.require("dojox.NodeList.delegate");_2.require("dojox.charting.Chart2D");_2.require("dojox.charting.themes.ThreeD");_2.require("dojox.charting.themes.PrimaryColors");_2.require("dojox.charting.themes.gradientGenerator");_2.require("dojox.layout.ExpandoPane");_2.require("dojox.layout.FloatingPane");_2.require("dojox.layout.ResizeHandle");});