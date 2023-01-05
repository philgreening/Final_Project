const express = require('express')
const app = express()
const port = 3000
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//require("./routes/main")(app);

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.engine("html", require("ejs").renderFile);

// app.get('/', (req, res) => {
//   res.render('pages/index')
// })


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const mariadb = require('mariadb');
const pool = mariadb.createPool({
  user:'test',
  password:'12345',
  database: 'db_fp',
  connectionLimit: 5
});

global.pool = pool;


asyncFunction();

async function asyncFunction() {
  let conn;
  try {
    console.log('establishing connection')
    conn = await pool.getConnection();
    console.log('established')
    const rows = await conn.query("SHOW TABLES");
    console.log(rows);

  } catch (err) {
    console.log(err)
      throw err;
  } finally {
      if (conn) return conn.end();
  }
}

