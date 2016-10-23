import axios from 'axios';
import config from '../config'


export default class Helpers {


    static unique(arr) {
        let u = {};
        let a = [];

        for (let i = 0, l = arr.length; i < l; ++i) {
            if (!u.hasOwnProperty(arr[i])) {
                a.push(arr[i]);
                u[arr[i]] = 1;
            }
        }
        return a;
    }

    static toRadians(_deg) {
        return _deg * Math.PI / 180;
    }

    static toDegrees(_rad) {
        return _rad * 180 / Math.PI;
    }

    // static getColor(_t) {
    //
    //     const blue = 56;
    //
    //     let r = Helpers.convertColorValuesToHex((255 * _t).toFixed(0));
    //     let b = Helpers.convertColorValuesToHex(blue);
    //     let g = Helpers.convertColorValuesToHex((255 * (1.0 - _t)).toFixed(0));
    //
    //     return '#' + r + g + b;
    // }

    static convertColorValuesToHex(_num) {
        let hexString = Number(_num).toString(16);

        return hexString.length == 1 ? '0' + hexString : hexString;

    }

    //
    // http://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
    static hslToRgb(h, s, l) {
        let r, g, b;

        if (s == 0) {
            r = g = b = l; // achromatic
        } else {
            function hue2rgb(p, q, t) {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            }

            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return [r * 255, g * 255, b * 255];
    }

    static getColor(t) {

        let minHueValue = 0.0;
        let maxHueValue = 120.0 / 360.0;

        let H = (maxHueValue - minHueValue) * (1.0-t) + minHueValue;

        let minSatValue = 0.6;
        let maxSatValue = 0.85;

        let S = (maxSatValue-minSatValue) * (1.0-t) + minSatValue;

        let rgbArray = Helpers.hslToRgb(H,S,0.6);

        return '#'+ rgbArray.reduce((p,c)=>{

            return p+Helpers.convertColorValuesToHex(c.toFixed(0));

        },'');

    }

    static fade(element) {
        var op = element == null ? 1 : element.style.opacity;
        var timer = setInterval(function () {

            element.style.opacity = op;
            element.style.filter = 'alpha(opacity=' + op * 100 + ')';
            op -= op * 0.01;

            if (op <= 0.1) {
                clearInterval(timer);
                //element.style.display = 'none';
            }

        }, 50);
    }

    static show(element) {
        element.style.display = 'initial';
        element.style.opacity = 1;
        element.style.filter = 'alpha(opacity=100)';
    }

    static getFenceListFromAPI() {

        let path = config.api_root() + 'fences/';

        return axios.get(path).then((response)=> {
            return Promise.resolve(response.data);
        }).catch((err)=> {
            console.error(err);
        });

    }

    static checkFenceHash(hash) {

        let path = config.api_root() + 'fences/check?' + hash;

        return axios.get(path)
            .then((response)=> {
                return response.data.result
            })
            .catch((err)=> {
                console.error(err);
            });
    }

    static getQuestionListFromAPI(id) {

        let path = config.api_root() + 'questions/' + id;

        return axios.get(path)
            .then((response)=> {
                return response.data
            })
            .catch((err)=> {
                console.error(err);
            });
    }

    static getRoadsFromAPI() {
        let path = config.api_root() + 'roads/';

        return axios.get(path)
            .then((response)=> {
                return response.data
            })
            .catch((err)=> {
                console.error(err);
            });
    }

    static isMobile() {
        return (
            navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/webOS/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/BlackBerry/i)
            || navigator.userAgent.match(/Windows Phone/i)
        );
    }
}