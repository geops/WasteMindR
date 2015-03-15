(function($) {

    window.GEOLOC = {};
    if (!Drupal.waste) Drupal.waste = {};
    Drupal.waste.mq = window.matchMedia("screen and (min-width: 768px)");

    window.GEOLOC.update = function(e) {
        var url = '/entsorgung/json/' + e.latlng[1] + '/' + e.latlng[0];
        var icalurl = '/entsorgung/ical/' + e.latlng[1] + '/' + e.latlng[0] + '/wastereminder.ical';
        $('#spinner').show();
        $.getJSON(url, function(data) {
            $('#spinner').hide();
            Drupal.waste.renderEvents(data, icalurl);            
        }, function() {
            $('#spinner').hide();       
        });
    }

    function entsorgung_update_map_size() {
        var footerH = $('footer').css('display') == "block" ? $('footer').outerHeight() : 0;
        var h = $(window).height() - $('#openlayers-map').offset().top - footerH;
        $('#map').css('height', h + "px");
        $('#openlayers-map').css('height', h + "px");   
        var map = jQuery('.openlayers-map').data('openlayers').openlayers;
        map.events.fallThrough = false;
        map.updateSize();
    }

    $(document).ready(function() {
        entsorgung_update_map_size();
        $("#citysearch").geocomplete().bind('geocode:result', function(event, result) {
            window.GEOLOC.update({
                    'address' : result.address_components,
                    'latlng' : [result.geometry.location.D, result.geometry.location.k]
                });
        });

        $('#closebut').click(function() {
            $('#results').hide();
            $('#citysearch').val('');
            Drupal.waste.features.removeAllFeatures();
        });
    });

    $(window).resize(function() {
        entsorgung_update_map_size();
    });

    Drupal.waste.renderEvents = function(d, icalurl) {    
        if (!d.location) return;
        var feature = new OpenLayers.Feature.Vector(
            OpenLayers.Geometry.fromWKT(
                d.location.geometry
            )
        );

        $('#citysearch').val(d.location.name);

        var center = new OpenLayers.LonLat(feature.geometry.getCentroid(true).x, feature.geometry.getCentroid(true).y).transform(
                Drupal.waste.map.displayProjection,
                Drupal.waste.map.projection);

        var mapCent = new OpenLayers.Geometry.Point(Drupal.waste.map.getCenter().lon, Drupal.waste.map.getCenter().lat);
        var centroid = feature.geometry.getCentroid().transform(Drupal.waste.map.displayProjection, Drupal.waste.features.projection);
        var dist = centroid.distanceTo(mapCent);

        Drupal.waste.features.removeAllFeatures();
        feature.geometry = feature.geometry.transform(Drupal.waste.map.displayProjection, Drupal.waste.features.projection);
        Drupal.waste.features.addFeatures([feature]);

        var resview = $('#results');
        resview.show();

        $('.loctitle', resview).html(d.location.name + '<a class="icalbut" href = "' + icalurl + '"></a>');
        $('#results .events').html('');
        for (var i in d.events) {
            var e = d.events[i];
            var m = new Date(Date.parse(e.date));
            var formatted = m.getDate() +"."+ (m.getMonth()+1) + "." + m.getFullYear();
            $('<li><span class="date">'+formatted+'</span><span class="type">'+e.type+'</span></li>').appendTo($('#results .events'));
        }
    }
})(jQuery); 