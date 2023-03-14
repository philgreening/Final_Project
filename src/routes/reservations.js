const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/middlewareAuth');
const db = require('../config');

///////////////Reservation Routes///////////////

router.post("/", authenticate, async(req,res)=>{
    try{
    
    if (!req.body.item_id || !req.body.item_name || !req.body.user_id) {
        return res.status(400).json({ msg: "Missing required fields" });
        }
    
    const data = {
        item_id: req.body.item_id,
        item_name: req.body.item_name,
        user_id: req.body.user_id,
        res_date: db.CurrentTime
    };
    // console.log("Reservation data: ", data);
    await db.Reservations.add(data);
    res.send({msg:"Reservation created"});
}catch(error){
    console.log(error)
    res.send({msg: error});
}
});

router.get("/", authenticate, async(req,res)=>{
    try {
        const response = await db.Reservations.get();
        let resArray = [];
        response.forEach(doc =>{

            const reservations = {
                res_id: doc.id,
                item_id: doc.data().item_id,
                item_name: doc.data().item_name,
                user_id: doc.data().user_id,
                res_date: doc.data().res_date
            }
            resArray.push(reservations);
        });
        // console.log(resArray);
        res.send(resArray); 
    } catch (error) {
        res.send({msg: "" + error })
    }
});

router.get("/reservation/:id", authenticate, async(req,res)=>{
    try {
        const resRef = db.Reservations.doc(req.params.id);
        const response = await resRef.get();
    
        // console.log(response.data());
        res.send(response.data()); 
    } catch (error) {
        res.send({msg: "" + error })
    }
});

router.delete("/reservation/:id", authenticate, async(req,res)=>{
    try {
        const resRef = db.Reservations.doc(req.params.id);
        await resRef.delete();
    
        // console.log("Reservation deleted");
        res.send({msg: "Reservation deleted"}); 
    } catch (error) {
        res.send({msg: "" + error })
    }
});

module.exports = router;