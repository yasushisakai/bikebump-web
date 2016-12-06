/**
 * Config class
 */

// FIXME: duplicate across multiple Containers should be a singleton
class Config {
    constructor(window) {
        let location = window.location;

        this.isRemote = location.protocol == 'https:';
        this.url_root = location.protocol + '//' + location.hostname;

        if(!this.isRemote) this.url_root += ':8080';

        this.img_root = this.url_root + '/static/img/';
        this.api_root = this.url_root + '/api/';


    }
}

module.exports = Config;
