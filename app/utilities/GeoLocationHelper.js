// created at 2016.10.02
// by yasushisakai


//
// GeoLocationHelper class
//
export default class GeoLocationHelper {

    //
    // gets the lat lng coordinates asking the browser
    // returns a "Promise"
    //
    static getGeoLocation(){
        return new Promise(function(resolve,reject){
            navigator.geolocation.getCurrentPosition(
                (position)=>{resolve(position.coords);},
                (error) =>{reject(error);},
                {enableHighAccuracy:true})
        });
    };

    //
    // calculates the distance between two latlng values in meters
    // http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
    //
    static distFromLatLng(lat1, lng1, lat2, lng2) {

        var R = 6378.137 * 1000; // Radius of the earth in m
        var dLat = (lat2 - lat1) * (Math.PI / 180.0);
        var dLon = (lng2 - lng1) * (Math.PI / 180.0);
        var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * (Math.PI / 180.0)) * Math.cos(lat2 * (Math.PI / 180.0)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2)
            ;
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c; // Distance in meters

        return d;
    }

    //
    // gets a list of fences that includes a latLng
    //
    static includingFences(fences,lat,lng){

        console.log(fences);

        return fences.filter((object)=>{
            let distance = GeoLocationHelper.distFromLatLng(object.coordinates.lat,object.coordinates.lng,lat,lng);
            return distance < object.radius;
        })
    }
}
