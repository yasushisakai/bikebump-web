var Config;

Config = {
    isRemote:function(){

        return false;
    },
    api_root:function(){

        let api_root = '/api/';

        if(this.isRemote()){
            api_root = 'https://bikebump.yasushisakai.com'+api_root;
        }else{
            api_root = 'http://localhost:8080'+api_root;
        }

        return api_root;
    }
};

module.exports = Config;

