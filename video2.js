// 引入 sqlite3 模块
const sqlite3 = require("sqlite3");
const { createDatabase, insertVod, createVodTable } = require("./db");
const axios = require("axios");

(async () => {
  const db = createDatabase();
  await createVodTable(db);
  const result = await axios.get(
    "https://ikunzyapi.com/api.php/provide/vod?ac=videolist"
  );
  if (result.data == null || result.data.list == null) {
    return;
  }

  for (let i = 0; i < result.data.total / 20; i++) {
    console.log("正在采集第" + i + "頁");
    await process(db, i);
  }
  console.log("結束");
})();

async function process(db, page) {
  const result = await axios.get(
    `https://ikunzyapi.com/api.php/provide/vod?ac=videolist&pg=${page}`
  );
  if (result.data == null || result.data.list == null) {
    return;
  }

  for (const iterator of result.data.list) {
    await insertVod(db, iterator);
  }
}
