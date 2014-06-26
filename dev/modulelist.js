define([
'../api/js/dgrid/editor.js',
'../api/js/dgrid/extensions/ColumnResizer.js',
'../api/js/dgrid/Grid.js',
'../api/js/dgrid/List.js',
'../api/js/dgrid/util/misc.js',
'../api/js/dojo/dijit/_AttachMixin.js',
'../api/js/dojo/dijit/_base/manager.js',
'../api/js/dojo/dijit/_Contained.js',
'../api/js/dojo/dijit/_Container.js',
'../api/js/dojo/dijit/_CssStateMixin.js',
'../api/js/dojo/dijit/_FocusMixin.js',
'../api/js/dojo/dijit/_HasDropDown.js',
'../api/js/dojo/dijit/_KeyNavContainer.js',
'../api/js/dojo/dijit/_KeyNavMixin.js',
'../api/js/dojo/dijit/_MenuBase.js',
'../api/js/dojo/dijit/_OnDijitClickMixin.js',
'../api/js/dojo/dijit/_Templated.js',
'../api/js/dojo/dijit/_TemplatedMixin.js',
'../api/js/dojo/dijit/_Widget.js',
'../api/js/dojo/dijit/_WidgetBase.js',
'../api/js/dojo/dijit/_WidgetsInTemplateMixin.js',
'../api/js/dojo/dijit/a11y.js',
'../api/js/dojo/dijit/a11yclick.js',
'../api/js/dojo/dijit/BackgroundIframe.js',
'../api/js/dojo/dijit/Destroyable.js',
'../api/js/dojo/dijit/DropDownMenu.js',
'../api/js/dojo/dijit/focus.js',
'../api/js/dojo/dijit/form/_ButtonMixin.js',
'../api/js/dojo/dijit/form/_CheckBoxMixin.js',
'../api/js/dojo/dijit/form/_FormValueMixin.js',
'../api/js/dojo/dijit/form/_FormValueWidget.js',
'../api/js/dojo/dijit/form/_FormWidget.js',
'../api/js/dojo/dijit/form/_FormWidgetMixin.js',
'../api/js/dojo/dijit/form/_ToggleButtonMixin.js',
'../api/js/dojo/dijit/form/Button.js',
'../api/js/dojo/dijit/form/CheckBox.js',
'../api/js/dojo/dijit/form/DropDownButton.js',
'../api/js/dojo/dijit/form/HorizontalRule.js',
'../api/js/dojo/dijit/form/HorizontalRuleLabels.js',
'../api/js/dojo/dijit/form/HorizontalSlider.js',
'../api/js/dojo/dijit/form/ToggleButton.js',
'../api/js/dojo/dijit/form/VerticalSlider.js',
'../api/js/dojo/dijit/hccss.js',
'../api/js/dojo/dijit/layout/_ContentPaneResizeMixin.js',
'../api/js/dojo/dijit/layout/_LayoutWidget.js',
'../api/js/dojo/dijit/layout/BorderContainer.js',
'../api/js/dojo/dijit/layout/ContentPane.js',
'../api/js/dojo/dijit/layout/LayoutContainer.js',
'../api/js/dojo/dijit/layout/utils.js',
'../api/js/dojo/dijit/main.js',
'../api/js/dojo/dijit/Menu.js',
'../api/js/dojo/dijit/MenuItem.js',
'../api/js/dojo/dijit/nls/loading.js',
'../api/js/dojo/dijit/place.js',
'../api/js/dojo/dijit/popup.js',
'../api/js/dojo/dijit/registry.js',
'../api/js/dojo/dijit/Tooltip.js',
'../api/js/dojo/dijit/typematic.js',
'../api/js/dojo/dijit/Viewport.js',
'../api/js/dojo/dojo/_base/url.js',
'../api/js/dojo/dojo/cache.js',
'../api/js/dojo/dojo/cldr/nls/en/gregorian.js',
'../api/js/dojo/dojo/cldr/nls/en/number.js',
'../api/js/dojo/dojo/cldr/nls/gregorian.js',
'../api/js/dojo/dojo/cldr/nls/number.js',
'../api/js/dojo/dojo/cldr/supplemental.js',
'../api/js/dojo/dojo/colors.js',
'../api/js/dojo/dojo/cookie.js',
'../api/js/dojo/dojo/date.js',
'../api/js/dojo/dojo/date/locale.js',
'../api/js/dojo/dojo/date/stamp.js',
'../api/js/dojo/dojo/dnd/autoscroll.js',
'../api/js/dojo/dojo/dnd/common.js',
'../api/js/dojo/dojo/dnd/move.js',
'../api/js/dojo/dojo/dnd/Moveable.js',
'../api/js/dojo/dojo/dnd/Mover.js',
'../api/js/dojo/dojo/fx.js',
'../api/js/dojo/dojo/fx/easing.js',
'../api/js/dojo/dojo/hccss.js',
'../api/js/dojo/dojo/html.js',
'../api/js/dojo/dojo/io/iframe.js',
'../api/js/dojo/dojo/io/script.js',
'../api/js/dojo/dojo/number.js',
'../api/js/dojo/dojo/parser.js',
'../api/js/dojo/dojo/promise/all.js',
'../api/js/dojo/dojo/regexp.js',
'../api/js/dojo/dojo/request/iframe.js',
'../api/js/dojo/dojo/request/script.js',
'../api/js/dojo/dojo/Stateful.js',
'../api/js/dojo/dojo/string.js',
'../api/js/dojo/dojo/touch.js',
'../api/js/dojo/dojo/uacss.js',
'../api/js/dojo/dojo/window.js',
'../api/js/dojo/dojox/charting/action2d/Base.js',
'../api/js/dojo/dojox/charting/action2d/Highlight.js',
'../api/js/dojo/dojox/charting/action2d/Magnify.js',
'../api/js/dojo/dojox/charting/action2d/PlotAction.js',
'../api/js/dojo/dojox/charting/action2d/Tooltip.js',
'../api/js/dojo/dojox/charting/axis2d/Base.js',
'../api/js/dojo/dojox/charting/axis2d/common.js',
'../api/js/dojo/dojox/charting/axis2d/Default.js',
'../api/js/dojo/dojox/charting/axis2d/Invisible.js',
'../api/js/dojo/dojox/charting/Chart.js',
'../api/js/dojo/dojox/charting/Element.js',
'../api/js/dojo/dojox/charting/plot2d/_PlotEvents.js',
'../api/js/dojo/dojox/charting/plot2d/Base.js',
'../api/js/dojo/dojox/charting/plot2d/CartesianBase.js',
'../api/js/dojo/dojox/charting/plot2d/common.js',
'../api/js/dojo/dojox/charting/plot2d/Default.js',
'../api/js/dojo/dojox/charting/plot2d/MarkersOnly.js',
'../api/js/dojo/dojox/charting/scaler/common.js',
'../api/js/dojo/dojox/charting/scaler/linear.js',
'../api/js/dojo/dojox/charting/scaler/primitive.js',
'../api/js/dojo/dojox/charting/Series.js',
'../api/js/dojo/dojox/charting/SimpleTheme.js',
'../api/js/dojo/dojox/charting/themes/common.js',
'../api/js/dojo/dojox/charting/themes/PurpleRain.js',
'../api/js/dojo/dojox/charting/widget/Legend.js',
'../api/js/dojo/dojox/charting/widget/SelectableLegend.js',
'../api/js/dojo/dojox/collections/_base.js',
'../api/js/dojo/dojox/collections/ArrayList.js',
'../api/js/dojo/dojox/color/_base.js',
'../api/js/dojo/dojox/form/RangeSlider.js',
'../api/js/dojo/dojox/fx.js',
'../api/js/dojo/dojox/fx/_base.js',
'../api/js/dojo/dojox/gfx.js',
'../api/js/dojo/dojox/gfx/_base.js',
'../api/js/dojo/dojox/gfx/fx.js',
'../api/js/dojo/dojox/gfx/gradutils.js',
'../api/js/dojo/dojox/gfx/matrix.js',
'../api/js/dojo/dojox/gfx/renderer.js',
'../api/js/dojo/dojox/gfx/shape.js',
'../api/js/dojo/dojox/gfx/svg.js',
'../api/js/dojo/dojox/lang/functional.js',
'../api/js/dojo/dojox/lang/functional/array.js',
'../api/js/dojo/dojox/lang/functional/fold.js',
'../api/js/dojo/dojox/lang/functional/lambda.js',
'../api/js/dojo/dojox/lang/functional/object.js',
'../api/js/dojo/dojox/lang/functional/reversed.js',
'../api/js/dojo/dojox/lang/functional/scan.js',
'../api/js/dojo/dojox/lang/utils.js',
'../api/js/dojo/dojox/main.js',
'../api/js/dojo/dojox/timing/_base.js',
'../api/js/dojo/dojox/xml/parser.js',
'../api/js/esri/_coremap.js',
'../api/js/esri/config.js',
'../api/js/esri/deferredUtils.js',
'../api/js/esri/dijit/_EventedWidget.js',
'../api/js/esri/dijit/Attribution.js',
'../api/js/esri/dijit/Measurement.js',
'../api/js/esri/dijit/Popup.js',
'../api/js/esri/dijit/PopupRenderer.js',
'../api/js/esri/dijit/PopupTemplate.js',
'../api/js/esri/dijit/Scalebar.js',
'../api/js/esri/dijit/TimeSlider.js',
'../api/js/esri/domUtils.js',
'../api/js/esri/Evented.js',
'../api/js/esri/fx.js',
'../api/js/esri/geometry.js',
'../api/js/esri/geometry/Extent.js',
'../api/js/esri/geometry/geodesicUtils.js',
'../api/js/esri/geometry/Geometry.js',
'../api/js/esri/geometry/jsonUtils.js',
'../api/js/esri/geometry/mathUtils.js',
'../api/js/esri/geometry/Multipoint.js',
'../api/js/esri/geometry/normalizeUtils.js',
'../api/js/esri/geometry/Point.js',
'../api/js/esri/geometry/Polygon.js',
'../api/js/esri/geometry/Polyline.js',
'../api/js/esri/geometry/Rect.js',
'../api/js/esri/geometry/scaleUtils.js',
'../api/js/esri/geometry/ScreenPoint.js',
'../api/js/esri/geometry/screenUtils.js',
'../api/js/esri/geometry/webMercatorUtils.js',
'../api/js/esri/graphic.js',
'../api/js/esri/graphicsUtils.js',
'../api/js/esri/InfoTemplate.js',
'../api/js/esri/InfoWindowBase.js',
'../api/js/esri/kernel.js',
'../api/js/esri/lang.js',
'../api/js/esri/layers/agscommon.js',
'../api/js/esri/layers/ArcGISDynamicMapServiceLayer.js',
'../api/js/esri/layers/ArcGISMapServiceLayer.js',
'../api/js/esri/layers/ArcGISTiledMapServiceLayer.js',
'../api/js/esri/layers/CodedValueDomain.js',
'../api/js/esri/layers/DataSource.js',
'../api/js/esri/layers/Domain.js',
'../api/js/esri/layers/DynamicLayerInfo.js',
'../api/js/esri/layers/DynamicMapServiceLayer.js',
'../api/js/esri/layers/FeatureEditResult.js',
'../api/js/esri/layers/FeatureLayer.js',
'../api/js/esri/layers/FeatureTemplate.js',
'../api/js/esri/layers/FeatureType.js',
'../api/js/esri/layers/Field.js',
'../api/js/esri/layers/GraphicsLayer.js',
'../api/js/esri/layers/GridLayout.js',
'../api/js/esri/layers/ImageParameters.js',
'../api/js/esri/layers/InheritedDomain.js',
'../api/js/esri/layers/JoinDataSource.js',
'../api/js/esri/layers/LabelClass.js',
'../api/js/esri/layers/layer.js',
'../api/js/esri/layers/LayerDataSource.js',
'../api/js/esri/layers/LayerDrawingOptions.js',
'../api/js/esri/layers/LayerInfo.js',
'../api/js/esri/layers/LayerMapSource.js',
'../api/js/esri/layers/LayerSource.js',
'../api/js/esri/layers/LayerTimeOptions.js',
'../api/js/esri/layers/LOD.js',
'../api/js/esri/layers/MapImage.js',
'../api/js/esri/layers/OnDemandMode.js',
'../api/js/esri/layers/OpenStreetMapLayer.js',
'../api/js/esri/layers/QueryDataSource.js',
'../api/js/esri/layers/RangeDomain.js',
'../api/js/esri/layers/RasterDataSource.js',
'../api/js/esri/layers/RenderMode.js',
'../api/js/esri/layers/SelectionMode.js',
'../api/js/esri/layers/SnapshotMode.js',
'../api/js/esri/layers/TableDataSource.js',
'../api/js/esri/layers/TiledMapServiceLayer.js',
'../api/js/esri/layers/TileInfo.js',
'../api/js/esri/layers/TimeInfo.js',
'../api/js/esri/layers/TimeReference.js',
'../api/js/esri/layers/TrackManager.js',
'../api/js/esri/layerUtils.js',
'../api/js/esri/map.js',
'../api/js/esri/MapNavigationManager.js',
'../api/js/esri/MouseEvents.js',
'../api/js/esri/nls/jsapi.js',
'../api/js/esri/PointerEvents.js',
'../api/js/esri/PopupBase.js',
'../api/js/esri/PopupInfo.js',
'../api/js/esri/renderers/ClassBreaksRenderer.js',
'../api/js/esri/renderers/jsonUtils.js',
'../api/js/esri/renderers/Renderer.js',
'../api/js/esri/renderers/SimpleRenderer.js',
'../api/js/esri/renderers/UniqueValueRenderer.js',
'../api/js/esri/request.js',
'../api/js/esri/sniff.js',
'../api/js/esri/SpatialReference.js',
'../api/js/esri/symbols/CartographicLineSymbol.js',
'../api/js/esri/symbols/FillSymbol.js',
'../api/js/esri/symbols/Font.js',
'../api/js/esri/symbols/jsonUtils.js',
'../api/js/esri/symbols/LineSymbol.js',
'../api/js/esri/symbols/MarkerSymbol.js',
'../api/js/esri/symbols/PictureFillSymbol.js',
'../api/js/esri/symbols/PictureMarkerSymbol.js',
'../api/js/esri/symbols/SimpleFillSymbol.js',
'../api/js/esri/symbols/SimpleLineSymbol.js',
'../api/js/esri/symbols/SimpleMarkerSymbol.js',
'../api/js/esri/symbols/Symbol.js',
'../api/js/esri/symbols/TextSymbol.js',
'../api/js/esri/tasks/AreasAndLengthsParameters.js',
'../api/js/esri/tasks/BufferParameters.js',
'../api/js/esri/tasks/DensifyParameters.js',
'../api/js/esri/tasks/DistanceParameters.js',
'../api/js/esri/tasks/FeatureSet.js',
'../api/js/esri/tasks/GeneralizeParameters.js',
'../api/js/esri/tasks/geometry.js',
'../api/js/esri/tasks/GeometryService.js',
'../api/js/esri/tasks/identify.js',
'../api/js/esri/tasks/IdentifyParameters.js',
'../api/js/esri/tasks/IdentifyResult.js',
'../api/js/esri/tasks/IdentifyTask.js',
'../api/js/esri/tasks/LengthsParameters.js',
'../api/js/esri/tasks/OffsetParameters.js',
'../api/js/esri/tasks/ProjectParameters.js',
'../api/js/esri/tasks/query.js',
'../api/js/esri/tasks/QueryTask.js',
'../api/js/esri/tasks/RelationParameters.js',
'../api/js/esri/tasks/RelationshipQuery.js',
'../api/js/esri/tasks/SpatialRelationship.js',
'../api/js/esri/tasks/StatisticDefinition.js',
'../api/js/esri/tasks/Task.js',
'../api/js/esri/tasks/TrimExtendParameters.js',
'../api/js/esri/tileUtils.js',
'../api/js/esri/TimeExtent.js',
'../api/js/esri/TouchEvents.js',
'../api/js/esri/units.js',
'../api/js/esri/urlUtils.js',
'../api/js/esri/utils.js',
'../api/js/esri/WKIDUnitConversion.js',
'../api/js/put-selector/put.js',
'../api/js/xstyle/css.js',
'../api/js/xstyle/has-class.js',
'../api/js/xstyle/load-css.js',
'../bathcat/modules/addsymbol.js',
'../bathcat/modules/addtextsymbol.js',
'../bathcat/modules/canvasidentify.js',
'../bathcat/modules/cleargraphics.js',
'../bathcat/modules/clearnode.js',
'../bathcat/modules/colorrampobject.js',
'../bathcat/modules/crosstool.js',
'../bathcat/modules/elementcache.js',
'../bathcat/modules/featureevents.js',
'../bathcat/modules/getdate.js',
'../bathcat/modules/gridcategory.js',
'../bathcat/modules/identify.js',
'../bathcat/modules/identtool.js',
'../bathcat/modules/measuretool.js',
'../bathcat/modules/popup.js',
'../bathcat/modules/tools.js',
'../bathcat/modules/tooltip.js'],function(){
    return function(){}
})