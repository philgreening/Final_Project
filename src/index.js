const express = require('express');
const cors = require('cors');

const db = require('./config');

const app = express()
const port = 4000;

const bodyParser = require("body-parser");
const authenticate = require('./middleware/middlewareAuth');

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// app.use(middleware.decodeToken);

///////////////Item Routes///////////////

app.post("/create-item", async(req,res)=>{
    try{
    const data = {
        item_name: req.body.item_name,
        item_type: req.body.item_type,
        description: req.body.description,
        status: req.body.status
    };
    console.log("Item data ", data);
    await db.Items.add(data);
    res.send({msg:"Item Added"});
}catch(error){
    console.log("" + error)
    res.send({msg: "" + error});
}
});

app.get("/item/all", authenticate, async(req,res)=>{
    try {
        const response = await db.Items.get();
        let itemArray = [];
        response.forEach(doc =>{
            const items = {
                item_id: doc.id,
                item_name: doc.data().item_name,
                item_type: doc.data().item_type,
                description: doc.data().description,
                status: doc.data().status
            }
            itemArray.push(items);
        });
        console.log(itemArray);
        res.send(itemArray); 
    } catch (error) {
        res.send({msg: "" + error })
    }
});

app.get("/item/:id", async(req,res)=>{
    try {
        const itemRef = db.Items.doc(req.params.id);
        const response = await itemRef.get();
    
        console.log(response.data());
        res.send(response.data()); 
    } catch (error) {
        res.send({msg: "" + error })
    }
});

app.patch("/update-item/:id", async(req,res)=>{
    try {
        const itemRef = db.Items.doc(req.params.id);

        const data = {
            item_name: req.body.item_name,
            item_type: req.body.item_type,
            description: req.body.description,
            status: req.body.status
        };

        await itemRef.update(data);
    
        console.dir(req.body);
        res.send({msg: "Item updated" }); 
    } catch (error) {
        res.send({msg: "" + error })
    }
});

app.delete("/delete-item/:id", async(req,res)=>{
    try {
        const itemRef = db.Items.doc(req.params.id);
        await itemRef.delete();
    
        console.log("Item deleted");
        res.send({msg: "Item deleted"}); 
    } catch (error) {
        res.send({msg: "" + error })
    }
});

///////////////User Routes///////////////

app.post("/create-user", async(req,res)=>{
    try{
    const data = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        address: req.body.address,
        admin: false,
    };
    const uid = req.body.id;
    console.log("User data: ", data);
    await db.Users.doc(uid).set(data);
    res.send({msg:"User Added"});
}catch(error){
    console.log("" + error)
    res.send({msg: "" + error});
}
});

app.get("/User/all", async(req,res)=>{
    try {
        const response = await db.Users.get();
        let userArray = [];
        response.forEach(doc =>{

            const users = {
                user_id: doc.id,
                first_name: doc.data().first_name,
                last_name: doc.data().last_name,
                email: doc.data().email,
                address: doc.data().address
            }
            userArray.push(users);
        });
        console.log(userArray);
        res.send(userArray); 
    } catch (error) {
        res.send({msg: "" + error })
    }
});

app.get("/User/:id", async(req,res)=>{
    try {
        const userRef = db.Users.doc(req.params.id);
        const response = await userRef.get();
    
        console.log(response.data());
        res.send(response.data()); 
    } catch (error) {
        res.send({msg: "" + error })
    }
});

app.patch("/update-user/:id", async(req,res)=>{
    try {
        const userRef = db.Users.doc(req.params.id);

        const data = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            address: req.body.address
        };

        await userRef.update(data);
    
        console.dir(req.body);
        res.send({msg: "User updated"});
    } catch (error) {
        res.send({msg: "" + error })
    }
});

app.delete("/delete-user/:id", async(req,res)=>{
    try {
        const userRef = db.Users.doc(req.params.id);
        await userRef.delete();
    
        console.log("User deleted");
        res.send({msg: "User deleted"}); 
    } catch (error) {
        res.send({msg: "" + error })
    }
});

///////////////Reservation Routes///////////////

app.post("/create-reservation", async(req,res)=>{
    try{
    const data = {
        item_id: req.body.item_id,
        item_name: req.body.item_name,
        user_id: req.body.user_id,
        res_date: db.CurrentTime
    };
    console.log("Reservation data: ", data);
    await db.Reservations.add(data);
    res.send({msg:"Reservation created"});
}catch(error){
    console.log("" + error)
    res.send({msg: "" + error});
}
});

app.get("/Reservation/all", authenticate, async(req,res)=>{
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
        console.log(resArray);
        res.send(resArray); 
    } catch (error) {
        res.send({msg: "" + error })
    }
});

app.get("/Reservation/:id", async(req,res)=>{
    try {
        const resRef = db.Reservations.doc(req.params.id);
        const response = await resRef.get();
    
        console.log(response.data());
        res.send(response.data()); 
    } catch (error) {
        res.send({msg: "" + error })
    }
});

app.delete("/delete-reservation/:id", async(req,res)=>{
    try {
        const resRef = db.Reservations.doc(req.params.id);
        await resRef.delete();
    
        console.log("Reservation deleted");
        res.send({msg: "Reservation deleted"}); 
    } catch (error) {
        res.send({msg: "" + error })
    }
});


///////////////Transaction Routes///////////////

app.post("/create-transaction", async(req,res)=>{
    try{
    const data = {
        item_id: req.body.item_id,
        item_name: req.body.item_name,
        user_id: req.body.user_id,
        transaction_status: req.body.transaction_status,
        loan_date: db.CurrentTime,
        due_date: db.FutureTime,
        returned_date: ""
        
    };
    console.log("Transaction data: ", data);
    await db.Transactions.add(data);
    res.send({msg:"Transaction created"});
}catch(error){
    console.log("" + error)
    res.send({msg: "" + error});
}
});

app.get("/Transaction/all", authenticate, async(req,res)=>{
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
        console.log(transactionArray);
        res.send(transactionArray); 
    } catch (error) {
        res.send({msg: "" + error })
    }
});

app.get("/Transaction/:id", async(req,res)=>{
    try {
        const transactionRef = db.Transactions.doc(req.params.id);
        const response = await transactionRef.get();
    
        console.log(response.data());
        res.send(response.data()); 
    } catch (error) {
        res.send({msg: "" + error })
    }
});


app.patch("/update-transaction/:id", async(req,res)=>{
    try {
        const transactionRef = db.Transactions.doc(req.params.id);

        const data = {
            transaction_status: req.body.transaction_status,
            returned_date: db.CurrentTime,
        };

        await transactionRef.update(data);
    
        console.dir(req.body);
        res.send({msg: "Transaction updated"});
    } catch (error) {
        res.send({msg: "" + error })
    }
});


app.listen(port, ()=>console.log("Up & running on port " + port));