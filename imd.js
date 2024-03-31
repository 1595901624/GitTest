const Tesseract = require('tesseract.js');
const path = require("path");
const axios = require("axios");
const fs = require("fs");

// const worker = createWorker({
//   langPath: path.join(__dirname, "..", "lang-data"),
//   logger: (m) => console.log(m),
// });

(async () => {
  let res = await axios.get(
    "https://api.mdkpbk.xyz/33bf094a-2b18-4b25-99cb-cc3d928a3715/api/v3/passport/auth/captcha"
  ); // 发送请求获取验证码
  let base64 = res.data.data.base_img.encoded;
  console.log("base64 = ", base64);
  base64 = base64.replace(/^data:image\/\w+;base64,/, ""); // 去除base64前面的 data:image/jpg;base64
  const dataBuffer = Buffer.from(base64, "base64"); // 将base64转成 Buffer
  fs.writeFile("./aaaa.jpg", dataBuffer, async function (err) {
    //用fs写入文件
    if (err) {
      console.log(err);
    } else {
      const {
        data: { text },
      } = await Tesseract.recognize(path.join(__dirname, "./aaaa.jpg"), 'eng'); // 识别图片
      console.log(text); // 打印读取结果
    }
  });
})();
