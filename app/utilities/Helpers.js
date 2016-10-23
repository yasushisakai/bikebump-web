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

    static getColor(_t) {

        const blue = 56;

        let r = Helpers.convertColorValuesToHex((255 * _t).toFixed(0));
        let b = Helpers.convertColorValuesToHex(blue);
        let g = Helpers.convertColorValuesToHex((255 * (1.0 - _t)).toFixed(0));

        return '#' + r + g + b;
    }

    static convertColorValuesToHex(_num) {
        let hexString = Number(_num).toString(16);

        return hexString.length == 1 ? '0' + hexString : hexString;

    }

    static fade(element) {
        var op = 1;
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
        
        return axios.get(path).then((response)=>{
            return Promise.resolve(response.data);
        }).catch((err)=>{
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