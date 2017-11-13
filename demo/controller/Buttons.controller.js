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
			
			require(["esri/layers/FeatureLayer"], function(FeatureLayer) {
				
				// Add a layer to the basemap
				oArcgisMap.addLayer(new FeatureLayer(weatherLayer + "/1"));
				
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