/**
 *  NodeJS will ignore the host's expired certificate if you include this line at the top of your file
 *  Sinece we are use a illegal certificate
 **/
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

/**
 * [request: the request module]
 * @type {[type]}
 */
const syncReq = require('sync-request');
/**
 * [request: the request module]
 * @type {[type]}
 */
const nodeCache = require('node-cache');
const localCache = new nodeCache({});

const issues = module.exports = {
    issues: function (host, token, api) {
        var that = this;
        
        that.config = {
            host: host,
            token: 'private_token=' + token,
            api: api || 'api/v4'
        }
        
        that.url = '';
        
        that.withProject = function (projectId) {
            var params = that.url.split('?');
            params[0] = that.config.host + '/' + that.config.api + '/projects/' + projectId + '/issues';
            that.url = params.join('?');
            return this;
        }
        
        that.withState = function (state) {
            var params = that.url.split('?');
            params[1] = params.length > 1 ? params[1] + '&state=' + state : 'state=' + state;
            that.url = params.join('?');
            return this;
        }
        that.with = function (param, value) {
            var params = that.url.split('?');
            params[1] = params.length > 1 ? params[1] + '&' + param + '=' + value : param + '=' + value;
            that.url = params.join('?');
            return this;
        }

        /**
         * 
         * @param {*} pairs , such as {{state: 'opened'}}
         */
        that.withs = function (pairs) {
            for(key in pairs) {
                that.with(key, pairs[key]);
            }
            return that;
        }

        var getUrl = function () {
            var params = that.url.split('?');
            params[1] = params.length > 1 ? params[1] + '&' + that.config.token : that.config.token;
            return params.join('?');            
        }

        that.request = function () {
            var _issues = '[]';
            if(that.url) {
                if (localCache.get('cleared') != 'true') {
                    localCache.del('issues');
                    localCache.set('cleared', 'true');
                    console.log('clear successfully');
                }    

                var res = syncReq('GET', getUrl(), {
                    'headers': {
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36'
                    }
                });
                if (res.statusCode != '200') {
                    console.log('failed to get issues with url: ' + that.url);                             
                    _issues = '{"message":"' + res.statusCode +'"}'
                } else {
                    _issues = res.getBody().toString();
                }
                
            }else {
                console.log('failed to link to url: ' + that.url)
            }
            localCache.set('issues', _issues)
            return localCache;            
        }
        return that;
    }
}