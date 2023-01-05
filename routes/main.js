module.exports = function (app) {
    // app.get("/task",  function (req, res) {
    //     let sqlquery = "SELECT * FROM Item";

    //      pool.query(sqlquery, (err, result) => {
    //         if (err) {
    //             return console.error("No devices " +  "error: " + err.message);
    //         }
    //         console.log(result)
    //        // res.render('pages/index', { item: result });
    //       res.status(200);
    //     });
    // });
    // app.get('/', (req, res) => {
    //     res.render('pages/index')
    //   })

      app.get("/",  function (req, res) {
        // let sqlquery = "SELECT * FROM Item";
         let sqlquery = "SELECT Item.name, Item_status.status FROM Item INNER JOIN Item_status ON Item_status.status_id=Item.status_id;";
      
        // pool.query(sqlquery, (err, result) => {
        //     if (err) {
        //         return console.error("No devices " +  "error: " + err.message);
        //     }
        //     console.log(result)
        //    //res.render('pages/index', { item: result });
        //    res.status(200).json(result);
        // });
      
        // pool
        //  .query(sqlquery)
        //  .then(result => {
        //   console.log(result); //[ { 'NOW()': 2018-07-02T17:06:38.000Z }, meta: [ ... ] ]
        //     res.status(200).json(result)
        //   //res.render('pages/index', { item: 'Something' });
        //  })
        //  .catch(err => {
        //   //handle error
        //   console.log('error');
        //   res.status(400).send('error');
        //  });
        pool.query(sqlquery, (err, res) => {
            if (err) {
              //handle error
                console.log('error');
                res.status(400).send('error');
            }
            pool.end();
            res.render('pages/index', { item: res.rows });
          });
      });
}