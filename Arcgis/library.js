sap.ui.define(['jquery.sap.global', 'sap/ui/core/Core', 'sap/ui/core/library', 'jquery.sap.mobile'],
    function(jQuery) {
        "use strict";
        (function() {
			jQuery.sap.includeStyleSheet(jQuery.sap.getResourcePath("Arcgis") + '/library.css');
            // delegate further initialization of this library to the Core
            sap.ui.getCore().initLibrary({
                name: "Arcgis",
                dependencies: ["sap.ui.core"],
                types: [],
                interfaces: [],
                controls: [
                    "Arcgis.Map"
                ],
                elements: [],
                noLibraryCSS:true,
                version: "0.0.1"
            });
        })();
        return true;
    }, true);