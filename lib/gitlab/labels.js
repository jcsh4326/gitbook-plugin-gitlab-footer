// https://gitlab.example.com/api/v4/projects/1/labels
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
const labelsCache = new nodeCache({});
const compile = require('./../compile.js');

const labels = module.exports = {
    labels : function(host, token, api) {
        var that = this;
        token = compile.decrypto(token, 0, 16);
        that.config = {
            host: host,
            token: 'private_token=' + token,
            api: api || 'api/v4'
        }
        
        that.url = '';
        
        that.withProject = function (projectId) {
            var params = that.url.split('?');
            params[0] = that.config.host + '/' + that.config.api + '/projects/' + projectId + '/labels';
            that.url = params.join('?');
            return this;
        }

        var getUrl = function () {
            var params = that.url.split('?');
            params[1] = params.length > 1 ? params[1] + '&' + that.config.token : that.config.token;
            return params.join('?');            
        }

        var filter = {};

        var _request = function () {
            var _res = '[]';
            if(that.url) {
                if (labelsCache.get('cleared') != 'true') {
                    labelsCache.del('labels');
                    labelsCache.set('cleared', 'true');
                    console.log('clear successfully');
                }    
                var res = syncReq('GET', getUrl(), {
                    'headers': {
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36'
                    }
                });
                if (res.statusCode != '200') {
                    console.log('failed to get issues with url: ' + that.url);                             
                    _res = '{"message":"' + res.statusCode +'"}'
                } else {
                    _res = res.getBody().toString();
                }
                
            }else {
                console.log('failed to link to url: ' + that.url)
            }
            labelsCache.set('labels', _res)          
        }

        that.withName = function (name) {
            filter['name'] = name;
            return that;
        }

        that.with = function (param, value) {
            filter[param] = value;
            return that;
        }

        that.withs = function (pairs) {
            for(var key in pairs) {
                that.with(key, pairs[key]);
            }
            return that;
        }

        that.request = function() {
            _request();
            var json = JSON.parse( labelsCache.get('labels') );
            var _labels = [];
            if(!json['message']){
                for(var index in json) {                    
                    var fit = true, arr = json[index];
                    for(var key in filter) {
                        if (!arr[key] || arr[key] !== filter[key]) {
                            fit = false;
                            break;
                        }
                    }
                    if(fit) {
                        _labels.push(arr);
                    }
                }                
            }
            return _labels;
        }

        return that;
    }
}
