(function($) {
/**
 * @file
 * JS Implementation of OpenLayers behavior.
 */

/**
 * OpenLayers behavior for clicking
 */
Drupal.openlayers.addBehavior('openlayers_behavior_entsorgung_click', function (data, options) {

  var targets = [], map = data.openlayers;
  if (!Drupal.waste) Drupal.waste = {};

  OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {                
    defaultHandlerOptions: {
        'single': true,
        'double': false,
        'pixelTolerance': 0,
        'stopSingle': false,
        'stopDouble': false
    },

    initialize: function(options) {
        this.handlerOptions = OpenLayers.Util.extend(
            {}, this.defaultHandlerOptions
        );
        OpenLayers.Control.prototype.initialize.apply(
            this, arguments
        ); 
        this.handler = new OpenLayers.Handler.Click(
            this, {
                'click': this.trigger
            }, this.handlerOptions
        );

        var geolocate = new OpenLayers.Control.Geolocate({
            bind: false,
            geolocationOptions: {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 7000
            }
        });

        map.addControl(geolocate);
        geolocate.activate();
        geolocate.events.register("locationupdated", geolocate, function(e) {
            map.setCenter(new OpenLayers.LonLat(e.point.x, e.point.y));
        });

        var sm = new OpenLayers.StyleMap({
            'default': new OpenLayers.Style({
                fillColor: '#0c0',
                fillOpacity: 0.8,
                strokeColor: '#ff4a4a',
                strokeWidth: 4,
                graphicZIndex: 1,
                pointRadius: 5
            })
        });

        Drupal.waste.map = map;
        Drupal.waste.features = new OpenLayers.Layer.Vector("entsorgungs_features", {styleMap: sm, visible: true});
        Drupal.waste.map.addLayers([Drupal.waste.features]);
        Drupal.waste.features.setVisibility(true);
    }, 

    trigger: function(e) {
        var lonlat = map.getLonLatFromPixel(e.xy);
        var point = new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat);       
        OpenLayers.Projection.transform(point, e.object.projection, e.object.displayProjection);        

        window.GEOLOC.update({
          'latlng' : [point.x, point.y]
        });
    }
  });
  
  var click = new OpenLayers.Control.Click();
  map.addControl(click);
  click.activate();
});

})(jQuery); 