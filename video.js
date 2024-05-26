const sqlite3 = require("sqlite3"); // 引入 sqlite3 模块
const path = require("path"); // 引入路径处理模块
const { createVodTable } = require("./db");
const dbName = path.join("test.db"); // 获取当前运行目录下的 data.db 文件
// 打开数据库
const db = new sqlite3.Database(dbName, (err) => {
  if (err !== null) return console.log(err); // 输出错误信息

  const test = {
    vod_id: 28650,
    type_id: 7,
    type_id_1: 1,
    group_id: 0,
    vod_name: "唐人街探案3",
    vod_sub: "",
    vod_en: "tangrenjietanan3",
    vod_status: 1,
    vod_letter: "T",
    vod_color: "",
    vod_tag: "唐人街探案3,探案,ccc,2020,陈思诚,野田昊,透露",
    vod_class: "喜剧",
    vod_pic:
      "https://www.imgikzy.com/upload/vod/20221106-11/9835acd5f80eb2076368600cb2210916.jpg",
    vod_pic_thumb: "",
    vod_pic_slide: "",
    vod_pic_screenshot: "",
    vod_actor:
      "王宝强,刘昊然,妻夫木聪,托尼·贾,长泽雅美,染谷将太,铃木保奈美,浅野忠信,三浦友和,尚语贤,肖央,张子枫,邱泽,张钧甯,马伯骞,程潇,陈哲远,李明轩,崔雨鑫,张一白,文咏珊,张熙然,克拉拉,树林伸,刘德华,陈思诚,平山日和,奥田瑛二,六平直政,酒向芳,秋山成勋,桥本爱实,长井短,宇治清高,张国强,大鹏,陈祉希,林沐然",
    vod_director: "陈思诚",
    vod_writer: "",
    vod_behind: "",
    vod_blurb:
      "继曼谷、纽约之后，东京再出大案。唐人街神探唐仁（王宝强 饰）、秦风（刘昊然 饰）受侦探野田昊（妻夫木聪 饰）的邀请前往破案。“CRIMASTER世界侦探排行榜”中的侦探们闻讯后也齐聚东京，加入挑战，而排名第一Q的现身，让这个大案更加扑朔迷离，一场亚洲最强神探之间的较量即将爆笑展开……",
    vod_remarks: "正片",
    vod_pubdate: "",
    vod_total: 0,
    vod_serial: "0",
    vod_tv: "",
    vod_weekday: "",
    vod_area: "内地",
    vod_lang: "普通话",
    vod_year: "2021",
    vod_version: "",
    vod_state: "",
    vod_author: "",
    vod_jumpurl: "",
    vod_tpl: "",
    vod_tpl_play: "",
    vod_tpl_down: "",
    vod_isend: 1,
    vod_lock: 0,
    vod_level: 0,
    vod_copyright: 0,
    vod_points: 0,
    vod_points_play: 0,
    vod_points_down: 0,
    vod_hits: 2574,
    vod_hits_day: 902,
    vod_hits_week: 846,
    vod_hits_month: 276,
    vod_duration: "",
    vod_up: 102,
    vod_down: 549,
    vod_score: "6.0",
    vod_score_all: 4320,
    vod_score_num: 720,
    vod_time: "2022-11-06 14:54:19",
    vod_time_add: 1663751556,
    vod_time_hits: 0,
    vod_time_make: 0,
    vod_trysee: 0,
    vod_douban_id: 0,
    vod_douban_score: "0.0",
    vod_reurl: "",
    vod_rel_vod: "",
    vod_rel_art: "",
    vod_pwd: "",
    vod_pwd_url: "",
    vod_pwd_play: "",
    vod_pwd_play_url: "",
    vod_pwd_down: "",
    vod_pwd_down_url: "",
    vod_content:
      "继曼谷、纽约之后，东京再出大案。唐人街神探唐仁（王宝强 饰）、秦风（刘昊然 饰）受侦探野田昊（妻夫木聪 饰）的邀请前往破案。“CRIMASTER世界侦探排行榜”中的侦探们闻讯后也齐聚东京，加入挑战，而排名第一Q的现身，让这个大案更加扑朔迷离，一场亚洲最强神探之间的较量即将爆笑展开……",
    vod_play_from: "ikm3u8",
    vod_play_server: "no",
    vod_play_note: "",
    vod_play_url:
      "正片$https://ikcdn01.ikzybf.com/20221105/bpjYVMDr/index.m3u8",
    vod_down_from: "",
    vod_down_server: "",
    vod_down_note: "",
    vod_down_url: "",
    vod_plot: 0,
    vod_plot_name: "",
    vod_plot_detail: "",
    type_name: "喜剧片",
  };

  createVodTable()

  // 创建表格;
//   db.run(sql, function (err, res) {
//     if (err) {
//       console.log(err); // 如果出现错误就输出错误信息
//     } else {
//       console.log(res);
//       insert(db, test);
//     }
//   });

  //   db.run(
  //     "INSERT INTO user (user_name, age) VALUES (?, ?)",
  //     ["Mark", 28],
  //     function (err) {
  //       if (err) console.log(err); // 如果有错误就输出错误信息
  //       console.log(this.changes); // 输出受影响的行数
  //       console.log(this.lastID); // 输出 lastID
  //     }
  //   );

  //   db.all("SELECT id, user_name, age FROM user", (err, rows) => {
  //     if (err) console.log(err); // 如果出现错误就输出错误信息
  //     console.log(rows); // 输出查询结果
  //   });
});

db.close((err) => {
  if (err) console.log(err);
});

class Vod {
  vod_id = 0;
  type_id = 0;
  type_id_1 = 0;
  group_id = 0;
  vod_name = "";
  vod_sub = "";
  vod_en = "";
  vod_status = 0;
  vod_letter = "";
  vod_color = "";
  vod_tag = "";
  vod_class = "";
  vod_pic = "";
  vod_pic_thumb = "";
  vod_pic_slide = "";
  vod_pic_screenshot = "";
  vod_actor = "";
  vod_director = "";
  vod_writer = "";
  vod_behind = "";
  vod_blurb = "";
  vod_remarks = "";
  vod_pubdate = "";
  vod_total = 0;
  vod_serial = "";
  vod_tv = "";
  vod_weekday = "";
  vod_area = "";
  vod_lang = "";
  vod_year = "";
  vod_version = "";
  vod_state = "";
  vod_author = "";
  vod_jumpurl = "";
  vod_tpl = "";
  vod_tpl_play = "";
  vod_tpl_down = "";
  vod_isend = 0;
  vod_lock = 0;
  vod_level = 0;
  vod_copyright = 0;
  vod_points = 0;
  vod_points_play = 0;
  vod_points_down = 0;
  vod_hits = 0;
  vod_hits_day = 0;
  vod_hits_week = 0;
  vod_hits_month = 0;
  vod_duration = "";
  vod_up = 0;
  vod_down = 0;
  vod_score = "";
  vod_score_all = 0;
  vod_score_num = 0;
  vod_time = "";
  vod_time_add = 0;
  vod_time_hits = 0;
  vod_time_make = 0;
  vod_trysee = 0;
  vod_douban_id = 0;
  vod_douban_score = "";
  vod_reurl = "";
  vod_rel_vod = "";
  vod_rel_art = "";
  vod_pwd = "";
  vod_pwd_url = "";
  vod_pwd_play = "";
  vod_pwd_play_url = "";
  vod_pwd_down = "";
  vod_pwd_down_url = "";
  vod_content = "";
  vod_play_from = "";
  vod_play_server = "";
  vod_play_note = "";
  vod_play_url = "";
  vod_down_from = "";
  vod_down_server = "";
  vod_down_note = "";
  vod_down_url = "";
  vod_plot = 0;
  vod_plot_name = "";
  vod_plot_detail = "";
  type_name = "";
}

