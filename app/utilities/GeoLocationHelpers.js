var geoLocationHelpers = {};


//
// gets the lat lng coordinates asking the browser
//
geoLocationHelpers.getLatLng = function (component) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position)=> {
                component.setLatLng(position);
            },
            (error)=> {
                console.error(error.message)
            }
        )
    } else {
        console.error('browser does not know how to obtain latlng');
    }
};


//
// calculates the distance between two latlng values in meters
// http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
//
geoLocationHelpers.distFromLatLng = function (lat1,lng1,lat2,lng2){
        var R = 6378.137*1000; // Radius of the earth in m
        var dLat = (lat2-lat1) * (Math.PI/180.0);
        var dLon = (lng2-lng1) * (Math.PI/180.0);
        var a =
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1*(Math.PI/180.0)) * Math.cos(lat2*(Math.PI/180.0)) *
                Math.sin(dLon/2) * Math.sin(dLon/2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c; // Distance in meters
        return d;

};

//
// 
//


module.exports = geoLocationHelpers;
