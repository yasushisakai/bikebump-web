import axios from 'axios';
import config from '../config'


export default class Helpers {


    static getFenceListFromAPI() {

        let path = config.api_root() + 'fences/';

        return axios.get(path)
            .then((response)=> {
                return response.data
            })
            .catch((err)=> {
                console.error(err);
                return []
            });
    }

    static getQuestionListFromAPI(id) {

        if (typeof(id) == 'undefined') {
            console.error('QuestionContainer.getQuestionFromAPI: question id undefined');
        }

        let path = config.api_root() + 'questions/' + id;

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