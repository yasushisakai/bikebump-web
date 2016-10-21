var Config;

Config = {
    isRemote:function(){

        return window.location.href.startsWith('https');
    },

    url_root:function(){

        if(this.isRemote()){
            return 'https://bikebump.yasushisakai.com/';
        }else{
            return 'http://localhost:8080/';
        }

    },

    img_root:function(){
        return this.url_root()+'static/img/'
    },

    api_root:function(){

        return this.url_root()+'api/'
    }
};

module.exports = Config;

