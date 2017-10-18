sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("ArcgisDemo.controller.App", {
		
		onInit: function() {
	        
		},

		getRouter : function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		}
		
	});

});