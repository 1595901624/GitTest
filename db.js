const sqlite3 = require("sqlite3"); // 引入 sqlite3 模块
// 引入路径处理模块
const path = require("path");
// 获取当前运行目录下的 data.db 文件
const dbName = path.join("test.db");

async function exec(db, sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        console.log(err);
      }
      resolve(this);
    });
  });
}

function createDatabase() {
  const db = new sqlite3.Database(dbName, (err) => {
    if (err) {
    } else {
    }
  });
  return db;
}

async function createVodTable(db) {
  const sql = `
  CREATE TABLE IF NOT EXISTS VODTable (
    vod_id INT,
    type_id INT,
    type_id_1 INT,
    group_id INT,
    vod_name TEXT,
    vod_sub TEXT,
    vod_en TEXT,
    vod_status INT,
    vod_letter TEXT,
    vod_color TEXT,
    vod_tag TEXT,
    vod_class TEXT,
    vod_pic TEXT,
    vod_pic_thumb TEXT,
    vod_pic_slide TEXT,
    vod_pic_screenshot TEXT,
    vod_actor TEXT,
    vod_director TEXT,
    vod_writer TEXT,
    vod_behind TEXT,
    vod_blurb TEXT,
    vod_remarks TEXT,
    vod_pubdate TEXT,
    vod_total INT,
    vod_serial TEXT,
    vod_tv TEXT,
    vod_weekday TEXT,
    vod_area TEXT,
    vod_lang TEXT,
    vod_year TEXT,
    vod_version TEXT,
    vod_state TEXT,
    vod_author TEXT,
    vod_jumpurl TEXT,
    vod_tpl TEXT,
    vod_tpl_play TEXT,
    vod_tpl_down TEXT,
    vod_isend INT,
    vod_lock INT,
    vod_level INT,
    vod_copyright INT,
    vod_points INT,
    vod_points_play INT,
    vod_points_down INT,
    vod_hits INT,
    vod_hits_day INT,
    vod_hits_week INT,
    vod_hits_month INT,
    vod_duration TEXT,
    vod_up INT,
    vod_down INT,
    vod_score TEXT,
    vod_score_all INT,
    vod_score_num INT,
    vod_time DATETIME,
    vod_time_add INT,
    vod_time_hits INT,
    vod_time_make INT,
    vod_trysee INT,
    vod_douban_id INT,
    vod_douban_score TEXT,
    vod_reurl TEXT,
    vod_rel_vod TEXT,
    vod_rel_art TEXT,
    vod_pwd TEXT,
    vod_pwd_url TEXT,
    vod_pwd_play TEXT,
    vod_pwd_play_url TEXT,
    vod_pwd_down TEXT,
    vod_pwd_down_url TEXT,
    vod_content TEXT,
    vod_play_from TEXT,
    vod_play_server TEXT,
    vod_play_note TEXT,
    vod_play_url TEXT,
    vod_down_from TEXT,
    vod_down_server TEXT,
    vod_down_note TEXT,
    vod_down_url TEXT,
    vod_plot INT,
    vod_plot_name TEXT,
    vod_plot_detail TEXT,
    type_name TEXT
);`;
  return exec(db, sql);
}

/**
 * 插入数据
 * @param {sqlite3.Database} db
 * @param {Vod} vod
 */
async function insertVod(db, vod) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO VODTable (vod_id, type_id, type_id_1, group_id, vod_name, vod_sub, vod_en, vod_status, vod_letter, vod_color, vod_tag, vod_class, vod_pic, vod_pic_thumb, vod_pic_slide, vod_pic_screenshot, vod_actor, vod_director, vod_writer, vod_behind, vod_blurb, vod_remarks, vod_pubdate, vod_total, vod_serial, vod_tv, vod_weekday, vod_area, vod_lang, vod_year, vod_version, vod_state, vod_author, vod_jumpurl, vod_tpl, vod_tpl_play, vod_tpl_down, vod_isend, vod_lock, vod_level, vod_copyright, vod_points, vod_points_play, vod_points_down, vod_hits, vod_hits_day, vod_hits_week, vod_hits_month, vod_duration, vod_up, vod_down, vod_score, vod_score_all, vod_score_num, vod_time, vod_time_add, vod_time_hits, vod_time_make, vod_trysee, vod_douban_id, vod_douban_score, vod_reurl, vod_rel_vod, vod_rel_art, vod_pwd, vod_pwd_url, vod_pwd_play, vod_pwd_play_url, vod_pwd_down, vod_pwd_down_url, vod_content, vod_play_from, vod_play_server, vod_play_note, vod_play_url, vod_down_from, vod_down_server, vod_down_note, vod_down_url, vod_plot, vod_plot_name, vod_plot_detail, type_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?)`,
      [
        vod.vod_id,
        vod.type_id,
        vod.type_id_1,
        vod.group_id,
        vod.vod_name,
        vod.vod_sub,
        vod.vod_en,
        vod.vod_status,
        vod.vod_letter,
        vod.vod_color,
        vod.vod_tag,
        vod.vod_class,
        vod.vod_pic,
        vod.vod_pic_thumb,
        vod.vod_pic_slide,
        vod.vod_pic_screenshot,
        vod.vod_actor,
        vod.vod_director,
        vod.vod_writer,
        vod.vod_behind,
        vod.vod_blurb,
        vod.vod_remarks,
        vod.vod_pubdate,
        vod.vod_total,
        vod.vod_serial,
        vod.vod_tv,
        vod.vod_weekday,
        vod.vod_area,
        vod.vod_lang,
        vod.vod_year,
        vod.vod_version,
        vod.vod_state,
        vod.vod_author,
        vod.vod_jumpurl,
        vod.vod_tpl,
        vod.vod_tpl_play,
        vod.vod_tpl_down,
        vod.vod_isend,
        vod.vod_lock,
        vod.vod_level,
        vod.vod_copyright,
        vod.vod_points,
        vod.vod_points_play,
        vod.vod_points_down,
        vod.vod_hits,
        vod.vod_hits_day,
        vod.vod_hits_week,
        vod.vod_hits_month,
        vod.vod_duration,
        vod.vod_up,
        vod.vod_down,
        vod.vod_score,
        vod.vod_score_all,
        vod.vod_score_num,
        vod.vod_time,
        vod.vod_time_add,
        vod.vod_time_hits,
        vod.vod_time_make,
        vod.vod_trysee,
        vod.vod_douban_id,
        vod.vod_douban_score,
        vod.vod_reurl,
        vod.vod_rel_vod,
        vod.vod_rel_art,
        vod.vod_pwd,
        vod.vod_pwd_url,
        vod.vod_pwd_play,
        vod.vod_pwd_play_url,
        vod.vod_pwd_down,
        vod.vod_pwd_down_url,
        vod.vod_content,
        vod.vod_play_from,
        vod.vod_play_server,
        vod.vod_play_note,
        vod.vod_play_url,
        vod.vod_down_from,
        vod.vod_down_server,
        vod.vod_down_note,
        vod.vod_down_url,
        vod.vod_plot,
        vod.vod_plot_name,
        vod.vod_plot_detail,
        vod.type_name,
      ],
      (err) => {
        if (err) {
          console.error(err.message);
        }
        return resolve();
      }
    );
  });
}

// export defa { createDatabase, createDatabase, insertVod, exec };
module.exports = { createDatabase, createVodTable, insertVod, exec };
