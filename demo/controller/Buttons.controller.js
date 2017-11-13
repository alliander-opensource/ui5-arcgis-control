sap.ui.define([
	"ArcgisDemo/controller/BaseController",
	"sap/m/MessageBox",
	"sap/m/Dialog",
	"sap/m/Input",
	"sap/m/Button"
], function(BaseController, MessageBox, Dialog, Input, Button) {
	"use strict";

	return BaseController.extend("ArcgisDemo.controller.Buttons", {
		
		onInit: function() {
	        
		},
		
		addLayerWeather1: function() {
			// Get the map object from the custom control
			var oArcgisMap = this.getView().byId("map").arcgismap;
			
			var weatherLayer = "https://services.arcgisonline.nl/arcgis/rest/services/Weer/Actuele_weersinformatie/MapServer";
			
			require(["esri/layers/FeatureLayer"], function(FeatureLayer) {
				
				// Add a layer to the basemap
				var oFeatureLayer = new FeatureLayer(weatherLayer + "/0");
				oFeatureLayer.on("click", function(oEvent) {
					getAllObjectsAtClick(oEvent.graphic._layer, oEvent.mapPoint).then(function(oResult) {
						if (oResult && oResult.featureSet && oResult.featureSet.features && oResult.featureSet.features.length > 0) {
							var sTemp = oResult.featureSet.features[0].attributes.temperatuurGC;
							MessageBox.alert("It's cold here: just " + sTemp + " degrees!");
						}
					});
				});
				oArcgisMap.addLayer(oFeatureLayer);
				
			});
		},
		
		addLayerWeather2: function() {
			// Get the map object from the custom control
			var oArcgisMap = this.getView().byId("map").arcgismap;
			
			var weatherLayer = "https://services.arcgisonline.nl/arcgis/rest/services/Weer/Actuele_weersinformatie/MapServer";
			
			require([
				"esri/layers/FeatureLayer",
				"esri/tasks/query",
				"esri/tasks/QueryTask",
				"esri/geometry/Extent",
				"esri/SpatialReference"
				], function(FeatureLayer, Query, QueryTask, Extent, SpatialReference) {
					
					// Add a layer to the basemap
					var oFeatureLayer = new FeatureLayer(weatherLayer + "/1");
						
					oFeatureLayer.on("click", function(oEvent) {
						var oQuery = new Query();
						var oQueryTask = new QueryTask(oFeatureLayer.url);
						var oExtent = new Extent(oEvent.mapPoint.x - 10000, oEvent.mapPoint.y - 10000, oEvent.mapPoint.x + 10000, oEvent.mapPoint.y + 10000, new SpatialReference({wkid: 28992}));
						oQuery.geometry = oExtent;
						oQuery.outFields = ["*"];
						oQueryTask.on("complete", function (oResult){
							console.log(oResult);
							if (oResult && oResult.featureSet && oResult.featureSet.features && oResult.featureSet.features.length > 0) {
								var sWindSpeedBF = oResult.featureSet.features[0].attributes.windsnelheidBF;
								MessageBox.alert("Wind speed is " + sWindSpeedBF + " beaufort.");
							}
						});
						oQueryTask.execute(oQuery);
					});
					
					oArcgisMap.addLayer(oFeatureLayer);
				
			});
		},
		
		findLocation: function() {
			// Get the map object from the custom control
			var oArcgisMap = this.getView().byId("map").arcgismap;
			
			var dialog = new Dialog({
				title: 'Enter an address or location',
				type: 'Message',
				content: [
					new Input('input', {
						width: '100%',
						placeholder: 'Location?'
					})
				],
				beginButton: new Button({
					text: 'Submit',
					press: function () {
						var sText = sap.ui.getCore().byId('input').getValue();
						$.getJSON("https://geodata.nationaalgeoregister.nl/locatieserver/v3/free?q=" + sText)
						.then(function(oResult) {
							if (oResult.response && oResult.response.docs && oResult.response.docs.length > 0) {
								var sLocRD = oResult.response.docs[0].centroide_rd;
								var rdX = Number(sLocRD.substring("POINT(".length, sLocRD.indexOf(" ")));
								var rdY = Number(sLocRD.substring(sLocRD.indexOf(" ") + 1, sLocRD.indexOf(")")));
								
								require([
									"esri/symbols/PictureMarkerSymbol",
									"esri/symbols/Font",
									"esri/Color",
									"esri/layers/GraphicsLayer",
									"esri/graphic",
									"esri/geometry/Point",
									"esri/SpatialReference",
									"esri/symbols/TextSymbol"
								], function(PictureMarkerSymbol, Font, Color, GraphicsLayer, Graphic, Point, SpatialReference, TextSymbol) {
									var graphic = new Graphic({
										geometry: new Point(rdX, rdY, new SpatialReference({
											wkid: 28992
										}))
									});
									graphic.symbol = new TextSymbol({
										text: "", // sap-icon://map
										font: new Font({
											family: "SAP-icons",
											size: 16
										}),
										color: new Color("#346187")
									});
									var graphicsLayer = null;
									if (!oArcgisMap.getLayer("location")) {
										graphicsLayer = new GraphicsLayer({
											id: "location"
										});
									} else {
										graphicsLayer = oArcgisMap.getLayer("location");
									}
									graphicsLayer.clear();
									graphicsLayer.add(graphic);
									oArcgisMap.addLayer(graphicsLayer);
								});
								
							}
							console.log(oResult);
						});
						dialog.close();
					}
				}),
				endButton: new Button({
					text: 'Cancel',
					press: function () {
						dialog.close();
					}
				}),
				afterClose: function() {
					dialog.destroy();
				}
			});
			dialog.open();
		}
		
	});

	function getAllObjectsAtClick (oFeatureLayer, oMapPoint) {
		return new Promise(function (resolve) {
			require([
				"esri/tasks/query",
				"esri/tasks/QueryTask",
				"esri/geometry/Extent",
				"esri/SpatialReference"
			],
			function (Query, QueryTask, Extent, SpatialReference) {
				var oQuery = new Query();
				var oQueryTask = new QueryTask(oFeatureLayer.url);
				oQuery.geometry = new Extent(oMapPoint.x - 10000, oMapPoint.y - 10000, oMapPoint.x + 10000, oMapPoint.y + 10000, new SpatialReference({
					wkid: 28992
				}));
				oQuery.outFields = ["*"];
				oQueryTask.on("complete", function (oRes){
					resolve(oRes);
				});
				oQueryTask.execute(oQuery);
			});
		});
	}

});