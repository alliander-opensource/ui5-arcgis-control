sap.ui.define([
	"sap/ui/core/UIComponent"
], function (UIComponent) {
	"use strict";

	return UIComponent.extend("ArcgisDemo.Component", {

		metadata : {
			manifest: "json"
		},

		init : function () {
			
	    	sap.ui.getCore().loadLibrary("Arcgis", jQuery.sap.getModulePath("ArcgisDemo") + "/../Arcgis");
			
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);
			
			// create the views based on the url/hash
            this.getRouter().initialize();
			
		}
		
	});

});