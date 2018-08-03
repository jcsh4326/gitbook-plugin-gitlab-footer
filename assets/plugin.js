require(["gitbook", "jQuery"], function (gitbook, $) {
    gitlabConfig = {};
    gitbook.events.bind('start', function (e, config) {
        gitlabConfig = config['gitlab-footer'];
    })
    gitbook.events.bind('page.change', function () {

        var api = gitlabConfig['api'],
            pid = gitlabConfig['pid'],
            t = gitlabConfig['token'],
            git = gitlabConfig['git'];


        var add_comments_button = $('.hc__form__send');
        var textarea = $('.hc__reply__box__textarea');
        add_comments_button.on('click', function () {
            var desc = textarea.val();
            var title = desc.split('。')[0];
            $.ajax({
                type: 'post',
                // must join all the parameters into one url
                url: git + '/' + api + '/projects/' + pid + '/issues'+'?private_token='+decrypto(t, 0, 16)+'&title='+title+'&description='+desc,                
                async: false,
                success: function (data) {
                    location.reload();
                    // TODO: refresh issues pages after reload page                
                }
            });
        });

    });
    var decrypto = function (str, xor, hex) {
        if (typeof str !== 'string' || typeof xor !== 'number' || typeof hex !== 'number') {
            return;
        }
        let strCharList = [];
        let resultList = [];
        hex = hex <= 25 ? hex : hex % 25;
        // 解析出分割字符
        let splitStr = String.fromCharCode(hex + 97);
        // 分割出加密字符串的加密后的每个字符
        strCharList = str.split(splitStr);

        for (let i = 0; i < strCharList.length; i++) {
            // 将加密后的每个字符转成加密后的ascll码
            let charCode = parseInt(strCharList[i], hex);
            // 异或解密出原字符的ascll码
            charCode = (charCode * 1) ^ xor;
            let strChar = String.fromCharCode(charCode);
            resultList.push(strChar);
        }
        let resultStr = resultList.join('');
        return resultStr;
    }
})