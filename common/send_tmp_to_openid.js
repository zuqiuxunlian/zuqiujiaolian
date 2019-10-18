var $http = require("superagent");
var logger = require('../common/logger');

function wordlimit(cname = "", wordlength = 20) {
  let tmp = cname;
  if (cname.length > wordlength) {
    tmp = cname.substr(0, wordlength) + '...';
  }
  return tmp
}

module.exports = async function sendTmpToOpenid({
                                                  openid = '',
                                                  topic = {},
                                                  tmpId = "5ytfiXSkxlNAEbUtAdV4C_QU4-gDdihMYYFlQHfvs4E",
                                                  data = {}
                                                }) {
  const cloneData = JSON.parse(JSON.stringify(data))
  Object.keys(cloneData).forEach(key => {
    cloneData[key] = wordlimit(cloneData[key])
  });
  var {accessToken} = await wechatAPI.getAccessToken();
  const res = await $http.post(`https://api.weixin.qq.com/cgi-bin/message/subscribe/send?access_token=${accessToken}`)
      .send({
        touser: openid,
        template_id: tmpId,
        page: `article/detail?id=${topic._id}`,
        data: cloneData
      })
      .then(res => {
        let json = {}
        try {
          json = JSON.parse(res.body)
        } catch (e) {
          json = res.body
        }
        return json
      })
  if (res.errcode === 0) {
    logger.info(`调用发送模板成功`);
  } else {
    logger.error(`调用发送模板失败，返回${JSON.stringify(res)}`);
  }
};
