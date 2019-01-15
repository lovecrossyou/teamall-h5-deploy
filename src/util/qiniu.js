'use strict';

const qiniu = require('qiniu');

const config = new qiniu.conf.Config();
// 空间对应的机房
config.zone = qiniu.zone.Zone_z1;

const accessKey = 'yhuw0VUpiGS1FRLdu5wEMhTFdbh3yUXjL5Dl54Aw';
const secretKey = 'rxrZ_PWfNcLfkmaK725dJAH9ScGcomcoD127DPYf';

const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const bucket = 'xiteng';

const options = {
  scope: bucket,
  returnBody: '{"imgName":"$(key)","fsize":$(fsize)}',
  expires: 7200,
};

const getUploadToken = async () => {
  const putPolicy = new qiniu.rs.PutPolicy(options);
  return putPolicy.uploadToken(mac);
};


const upload = async (file, prefix = '') => {
  const uploadToken = await getUploadToken();
  const localFile = file.filepath;
  const formUploader = new qiniu.form_up.FormUploader(config);
  const putExtra = new qiniu.form_up.PutExtra();
  const fileName = prefix + new Date().getTime() + Math.ceil(Math.random(1000));
  return new Promise((resolve, reject) => {
    formUploader.putFile(uploadToken, fileName, localFile, putExtra, function(respErr,
      respBody, respInfo) {
      if (respErr) {
        throw respErr;
      }
      if (respInfo.statusCode === 200) {
        resolve(respBody);
      } else {
        reject(respBody);
      }
    });
  });
};

module.exports = {
  upload,
};
