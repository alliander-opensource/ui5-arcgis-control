sap.ui.define([
	"ArcgisDemo/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("ArcgisDemo.controller.Layers", {
		
		onInit: function() {
	        
		},
		
		onMapReady: function(oEvent) {
			// The Arcgis map object can be found in the event parameters
			var oArcgisMap = oEvent.getParameter("arcgismap");
			
			// Alternatively, the Arcgis map object can be found in the SAPUI5 control
			// var oArcgisMap = this.getView().byId("map").arcgismap;
			
			var weatherLayer = "https://services.arcgisonline.nl/arcgis/rest/services/Weer/Actuele_weersinformatie/MapServer";
			
			require(["esri/layers/ArcGISDynamicMapServiceLayer"], function(ArcGISDynamicMapServiceLayer) {
				
				// Add a layer to the basemap
				oArcgisMap.addLayer(new ArcGISDynamicMapServiceLayer(weatherLayer));
				
			});
		}
		
	});

});