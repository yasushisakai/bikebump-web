/**
 * GeoLocationHelper class
 */
class GeoLocationHelper {

    /**
     * getGeoLocation()
     * uses the HTML5's GeoLocationAPI to get the latitude longitude value
     *
     * @returns {*} : a Promise type object having 'latitude' and 'longitude' values
     */
    static getGeoLocation() {

        // returns null if called by server
        if (typeof navigator == 'undefined') return null;

        return new Promise(function (resolve, reject) {

            navigator.geolocation.getCurrentPosition(
                (position)=> {
                    resolve(position.coords);
                },
                (error) => {
                    reject(error);
                },
                {enableHighAccuracy: true})
        });
    };

    /**
     * distFromLatLng
     * calculates the distance between two latlng values in Meters
     * ref:
     * http://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula
     *
     * @param lat1
     * @param lng1
     * @param lat2
     * @param lng2
     * @returns {number} : distance in METERS
     */
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

    /**
     * includingFences
     * gets a list of fences that includes the given LatLng location
     *
     * @param fences
     * @param lat
     * @param lng
     * @returns {*} : a Array of fences that includes the lat lng coordinates
     */
    static includingFences(fences, lat, lng) {

        return fences.filter((object)=> {
            let distance = GeoLocationHelper.distFromLatLng(
                object.coordinates.lat, object.coordinates.lng,
                lat, lng
            );
            return distance < object.radius;
        })
    }
}

module.exports = GeoLocationHelper;
