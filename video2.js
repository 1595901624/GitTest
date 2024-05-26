// 引入 sqlite3 模块
const sqlite3 = require("sqlite3");
const { createDatabase } = require("./db");
const axios = require("axios");

(async () => {
  const db = await createDatabase();

  const result = await axios.get(
    "https://ikunzyapi.com/api.php/provide/vod?ac=videolist"
  );
  if (result.data == null || result.data.list == null) {
    return;
  }

  console.log(result.data);
})();
