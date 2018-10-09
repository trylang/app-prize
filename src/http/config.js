let config = {
    methods: 'post',
    baseURL: '', //基础URL前缀
    headers: { //请求头信息
        'Content-Type': 'application/json;charset=UTF-8'
    },
    data: {}, //参数
    timeout: 10000, //设置超时时间
    withCredentials: false, //携带凭证
    responseType: 'JSON'
}

let domain = document.domain ; 
switch(domain){
    case '127.0.0.1':
    case '10.10.10.141':
        config.baseURL = 'http://10.10.11.166:8091/app-coupon-luck';
        // config.baseURL = '/app-discovery/';
        break;
    case '59.110.106.142':
    case '47.93.174.52':
    case 'app-coupon-luck.rtmap.com':
        config.baseURL = 'https://coupon-luck.rtmap.com/app-coupon-luck';
        // config.baseURL = '/app-discovery/';
        break;
    default : 
        // config.baseURL = '/app-discovery/';
        break;
}



export default config
