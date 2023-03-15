const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/middlewareAuth');
const db = require('../config');


///////////////Transaction Routes///////////////

router.post("/", authenticate, async(req,res)=>{
    try{
        if (!req.body.item_id || !req.body.item_name || !req.body.user_id
            || !req.body.transaction_status || !req.body.loan_date
            || !req.body.due_date ) {
            return res.status(400).json({ msg: "Missing required fields" });
            }
    const data = {
        item_id: req.body.item_id,
        item_name: req.body.item_name,
        user_id: req.body.user_id,
        transaction_status: req.body.transaction_status,
        loan_date: db.CurrentTime,
        due_date: db.FutureTime,
        returned_date: ""
        
    };
    // console.log("Transaction data: ", data);
    await db.Transactions.add(data);
    res.send({msg:"Transaction created"});
}catch(error){
    // console.log("" + error)
    res.send({msg: "" + error});
}
});

router.get("/", authenticate, async(req,res)=>{
    try {
        const response = await db.Transactions.get();
        let transactionArray = [];
        response.forEach(doc =>{

            const transactions = {
                transaction_id: doc.id,
                item_id: doc.data().item_id,
                item_name: doc.data().item_name,
                user_id: doc.data().user_id,
                transaction_status: doc.data().transaction_status,
                loan_date: doc.data().loan_date,
                due_date: doc.data().due_date,
                returned_date: doc.data().returned_date
            }
            transactionArray.push(transactions);
        });
        // console.log(transactionArray);
        res.send(transactionArray); 
    } catch (error) {
        res.send({msg: "" + error })
    }
});

router.get("/transaction/:id", authenticate, async(req,res)=>{
    try {
        const transactionRef = db.Transactions.doc(req.params.id);
        const response = await transactionRef.get();
    
        // console.log(response.data());
        res.send(response.data()); 
    } catch (error) {
        res.send({msg: "" + error })
    }
});


router.patch("/transaction/:id", authenticate, async(req,res)=>{
    try {
        const transactionRef = db.Transactions.doc(req.params.id);

        const data = {
            transaction_status: req.body.transaction_status,
            returned_date: db.CurrentTime,
        };

        await transactionRef.update(data);
    
        // console.dir(req.body);
        res.send({msg: "Transaction updated"});
    } catch (error) {
        res.send({msg: "" + error })
    }
});

module.exports = router;