
var Config;

Config = {
    isRemote:function(){
        return __dirname.startsWith('/home')
    },
    api_root:function(){
        let api_root = '/api/';
        if(Config.isRemote()){
            api_root = 'https://bikebump.yasushisakai.com'+api_root;
        }else{
            api_root = 'http://localhost:8080'+api_root;
        }

        // TODO: reconsider.. well actually maybe not?
        api_root = 'https://bikebump.yasushisakai.com/api';

        return api_root;
    }
};


module.exports = Config;

