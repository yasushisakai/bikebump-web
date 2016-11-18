export default class Config{
    constructor() {
        this.isRemote = window.location.href.startsWith('https');

        if(this.isRemote) {
            this.url_root = this.isRemote ? 'https://bikebump.yasushisakai.com/' : 'http://localhost:8080/'
        }

        this.img_root = this.url_root + 'static/img/';
        this.api_root = this.url_root + 'api/';
    }
};

