sap.ui.define([
	"sap/ui/core/Control",
	"sap/ui/core/ResizeHandler"
], function(Control, ResizeHandler) {
	
	var Arcgis = Control.extend("Arcgis.Map", {
	
		metadata: {
			defaultAggregation : "buttons",
			aggregations : {
		       "buttons": {type: "sap.m.Button", multiple: true, bindable: "bindable"}
			},
			properties: { // setters and getters are created by the UI5 framework
				"name": "string",
				"width": {
					type: "sap.ui.core.CSSSize",
					defaultValue: "100%"
				},
				"height": {
					type: "sap.ui.core.CSSSize",
					defaultValue: "100%"
				},
				"baseLayer": {
					type: "string",
					defaultValue: "https://services.arcgisonline.nl/arcgis/rest/services/Basiskaarten/Topo/MapServer"
				}
			},
            events: {
                'ready': {}
            }
		},
	
		renderer: function(oRm, oControl) { // the part creating the HTML
			oRm.write('<div');
			oRm.writeControlData(oControl);
			oRm.write(' data-dojo-type="dijit/layout/BorderContainer"' +
				'data-dojo-props="design:\'sidebar\', gutters:false"');
			oRm.addStyle("width", oControl.getWidth());
			oRm.addStyle("height", oControl.getHeight());
			oRm.writeStyles();
			oRm.write('>');
			oRm.write('<div class="map_buttons_container">');
			if (oControl.getAggregation("buttons")) {
				oRm.write('<div class="map_buttons">');
				oControl.getAggregation("buttons").forEach(function(oButton) {
					oRm.renderControl(oButton);
				});
				oRm.write('</div>');
			}
			oRm.write('</div>');
			oRm.renderControl(oControl._html);
			oRm.write('</div>');
		}
	
	});
		
	Arcgis.prototype.init = function() {
		this.mapId = this.getId() + "-map";
        this._html = new sap.ui.core.HTML({
            content: "<div id='" + this.mapId + "' class='map'" +
			"data-dojo-type='dijit/layout/ContentPane'" +
			"data-dojo-props=''>" +
			'</div>'
        });
	};
	
	Arcgis.prototype.onAfterRendering = function() {
		if (!this.initialized) {
			this.initialized = true;
			this.createMap();
		}
	};
	
	Arcgis.prototype.createMap = function() {
		var oControl = this;
		require([
			"esri/map", 
			"esri/basemaps",
	    	"dojo/dom-construct",
		    "dojo/dom",
		    "dojo/touch",
	    	"dojo/on",
			"dojo/domReady!"
		],function(
			Map,
			basemaps,
			domConstruct,
			dom,
			touch,
			on
		) {
			basemaps.baselayer = {
				baseMapLayers: [{url: oControl.getBaseLayer()}]
			};
			var oMap = new Map(oControl.mapId, {
				autoResize: false,
				basemap: "baselayer",
				showAttribution: false
			});
			oMap.on("load", function () {
	            oControl.fireReady({
	                arcgismap: oMap,
	                context: oControl.getBindingContext()
	            });
			});
	        
	        // Spinnertje tonen tijdens het laden van de kaart
			var oLoadingImage = domConstruct.create("img", {id:"loadingImg"}, oControl.mapId, "first");
			oMap.on("update-start", function() {
				window.esri.show(oLoadingImage);
			});
			oMap.on("update-end", function() {
				window.esri.hide(oLoadingImage);
			});
            
			// LvG (30-10-2015): toegevoegd omdat bij een SAPUI5 applicatie het probleem was dat
			// bij het weg- en vervolgens terugnavigeren de kaart niet goed werd weergegeven.
			// Deze fix zorgt ervoor dat de map alleen wordt geresized als deze op het moment zichtbaar is.
		    ResizeHandler.register(oControl.getDomRef(), mapResize);
			function mapResize() {
		    	if (dom.byId(oControl.mapId) && dom.byId(oControl.mapId).offsetHeight) {
		    		oMap.resize();
		    	}
			}
 
	        // LvG (15-10-2015): toegevoegd om te zorgen dat de muislocatie goed wordt gevonden in sommige situaties
	        // TODO: bij mobiel kantelen van scherm en vervolgens terugkeren naar kaart gaat het soms ook niet goed
	        oMap.on("mouse-over", $.proxy(oMap.reposition, oMap));
	        on(dom.byId(oControl.mapId), touch.press, $.proxy(oMap.reposition, oMap));
	        
			oControl.arcgismap = oMap;
		});
	};

    Arcgis.prototype.exit = function() {
    	// destroy all dijit widgets
		// TODO: not sure if this is still usefull, since we don't use dijit widgets anymore
    	var mapId = this.mapId;
    	require([
			"dojo/dom", 
			"dojo/domReady!"
		],function(
			dom
		) {
			if (dom.byId(mapId)) {
				var widgets = dijit.findWidgets(dom.byId(mapId));
				dojo.forEach(widgets, function(w) {
					w.destroyRecursive(true);
				});
			}
		});
    };
	
	return Arcgis;
});