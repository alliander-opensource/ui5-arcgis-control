sap.ui.define([
	"ArcgisDemo/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("ArcgisDemo.controller.App", {
		
		onInit: function() {
	        
		},
		
		goToSimpleMap: function() {
			this.getRouter().navTo("SimpleMap");
		},
		
		goToButtons: function() {
			this.getRouter().navTo("Buttons");
		}
		
	});

});