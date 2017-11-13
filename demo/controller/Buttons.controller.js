sap.ui.define([
	"ArcgisDemo/controller/BaseController",
	"sap/m/MessageBox"
], function(BaseController, MessageBox) {
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