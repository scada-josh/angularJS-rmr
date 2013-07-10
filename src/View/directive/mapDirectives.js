'use strict';

/* directives */
angular.module('myApp.mapDirectives', [])

/*
*	MainViewCtrl
*	Controller for the route #/a, and #/a/:city
*/
.directive('mapDirective', function() {
    return {
    	restrict: 'E',
    	template: '<div id="map" style="width: 100%; height: 650px"></div>',
    	link: function(scope, element, attrs) {

    		// watch the expression, and update the UI on change.
    		scope.$watch('zoomLevel', function () {
    			console.log("from watch : "+map.getZoom());
    		}, true);


			/* #################### Initial Map ########################## */
    		var map;

    		map = new OpenLayers.Map('map', {
	  		projection: 'EPSG:3857',
	  		layers: [
	  		// new OpenLayers.Layer.Google(
	  		// 	"Google Physical",
	  		// 	{type: google.maps.MapTypeId.TERRAIN}
	  		// 	),
	  		new OpenLayers.Layer.Google(
	                "Google Streets", // the default
	                {numZoomLevels: 20}
	                ),
	  		new OpenLayers.Layer.Google(
	  			"Google Hybrid",
	  			{type: google.maps.MapTypeId.HYBRID, numZoomLevels: 20}
	  			),
	  		// new OpenLayers.Layer.Google(
	  		// 	"Google Satellite",
	  		// 	{type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 22}
	  		// 	)
	  		],
	  		center: new OpenLayers.LonLat(100.538421, 13.766022)
	            // Google.v3 uses web mercator as projection, so we have to
	            // transform our coordinates
	            .transform('EPSG:4326', 'EPSG:3857'),
	            zoom: 9
	        });

    		map.addControl(new OpenLayers.Control.LayerSwitcher());

    		

    		/* ############################################################ */
    		/* #################### Vector Layer ########################## */
    		/* ############################################################ */
			var context2 = {
                getSize: function(feature) {
                    return 20 + Math.round(symbol.getSize(feature.attributes["population"]) * Math.pow(2,map.getZoom()-1));
                },
                getChartURL: function(feature) {
                    var values = feature.attributes["pop_0_14"] + ',' + feature.attributes["pop_15_59"] + ',' + feature.attributes["pop_60_above"];
                    var size = 20 + Math.round(symbol.getSize(feature.attributes["population"]) * Math.pow(2,map.getZoom()-1));
                    var charturl = 'http://chart.apis.google.com/chart?cht=p3&chd=t:' + values + '&chs=' + size + 'x' + size + '&chf=bg,s,ffffff00';
                    return charturl;
                },
                getBranchName: function(feature) {
                    return feature.attributes["name"];
                },
                getColor : function (feature) {
                    //console.log(feature.attributes.id);
                        return feature.attributes.id == 104 ? '#800026' :
                               feature.attributes.id == 105 ? '#BD0026' :
                               feature.attributes.id == 106 ? '#E31A1C' :
                               feature.attributes.id == 107 ? '#FC4E2A' :
                               feature.attributes.id == 108 ? '#FD8D3C' :
                               feature.attributes.id == 109 ? '#FEB24C' :
                               feature.attributes.id == 110  ? '#FC4E2A' :'#FFEDA0' ;
                    }
            };

            var template2 = {
                fillOpacity: 0.7,
                fillColor: "${getColor}",
                strokeColor: "ffeeff",
                graphicZIndex: 1,
                label: "${getBranchName}",
                fontSize: "9px",
                strokeWidth: 1
            };

    		var style2 = new OpenLayers.Style(template2, {context: context2});
    		var styleMap2 = new OpenLayers.StyleMap({'default': style2, 'select': {fillOpacity: 0.7}});

    		var vectors2 = new OpenLayers.Layer.Vector("GeoJSON ครับ", {
    			styleMap:styleMap2,
    			visibility:true,
    			projection: "EPSG:4326",
    			strategies: [new OpenLayers.Strategy.BBOX({
    				resFactor: 1
    			})],
    			protocol: new OpenLayers.Protocol.HTTP({
    				url: "./Model/RESTful/vector_query.php",
    				format: new OpenLayers.Format.GeoJSON()
    			})
    		});

    		//map.addLayers(vectors);
    		map.addLayer(vectors2);

    		/* ############################################################ */
    		/* #################### Chart Layer ########################### */
    		/* ############################################################ */

    		function Geometry(symbol, maxSize, maxValue){
    			this.symbol = symbol;
    			this.maxSize = maxSize;
    			this.maxValue = maxValue;

    			this.getSize = function(value){
    				switch(this.symbol) {
                            case 'circle': // Returns radius of the circle
                            case 'square': // Returns length of a side
                            return Math.sqrt(value/this.maxValue)*this.maxSize;
                            case 'bar': // Returns height of the bar
                            return (value/this.maxValue)*this.maxSize;
                            case 'sphere': // Returns radius of the sphere
                            case 'cube': // Returns length of a side
                            return Math.pow(value/this.maxValue, 1/3)*this.maxSize;
                        }
                    }
                } 

    		var symbol = new Geometry('circle', 20, 1312978855);

            var context = {
                getSize: function(feature) {
                	scope.$apply(function () {
                		scope.zoomLevel = map.getZoom();
                	});

                    console.log(map.getZoom());
                    return Math.round(map.getZoom()*10*feature.attributes["scale_factor"]);
                    
                },
                getChartURL: function(feature) {
                    var values = feature.attributes["pop_0_14"] + ',' + feature.attributes["pop_15_59"] + ',' + feature.attributes["pop_60_above"];
                    var size = 20 + Math.round(symbol.getSize(feature.attributes["population"]) * Math.pow(2,map.getZoom()-1));
                        size = Math.round(map.getZoom()*10*feature.attributes["scale_factor"]);
                    var charturl = 'http://chart.apis.google.com/chart?cht=p3&chd=t:' + values + '&chs=' + size + 'x' + size + '&chf=bg,s,ffffff00';
                    return charturl;
                },
                getBranchID: function(feature){
                    return feature.attributes["branch_id"];
                }
            };

            var template = {
                fillOpacity: 1.0,
                externalGraphic: "${getChartURL}",
                graphicWidth: "${getSize}",
                graphicHeight: "${getSize}",
                label: "${getBranchID}",
                fontColor: "#333333",
                fontFamily: "sans-serif",
                fontWeight: "bold",
                fontSize: "9px",
                strokeWidth: 0,
                graphicZIndex: 1
            };

            var style = new OpenLayers.Style(template, {context: context});
    		var styleMap = new OpenLayers.StyleMap({'default': style, 'select': {fillOpacity: 0.7}});

    		var vectors = new OpenLayers.Layer.Vector("GeoJSON ครับ", {
                    styleMap:styleMap,
                    projection: new OpenLayers.Projection("EPSG:4326"),
                    strategies: [new OpenLayers.Strategy.Fixed()],
                    protocol: new OpenLayers.Protocol.HTTP({
                      url: "./Model/RESTful/MWA_Branch_Summary.json",
                      format: new OpenLayers.Format.GeoJSON()
                  })
                });

    		map.addLayer(vectors);


    	}
	}
});




