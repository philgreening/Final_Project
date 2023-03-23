const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/middlewareAuth');
const db = require('../config');

///////////////User Routes///////////////

/**
 * @swagger
 * '/api/v1/users':
 *  post:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *     - Users
 *     summary: Create a user
 *     requestBody:
 *      required: true
 *      content:
 *         application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserResponse'
 *       401:
 *        description: Unauthorised
 *       404:
 *        description: Bad request
 */

router.post("/", authenticate, async(req,res)=>{
    try{
    const data = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        address: req.body.address,
        admin: false,
    };
    const uid = req.body.id;
    // console.log("User data: ", data);
    await db.Users.doc(uid).set(data);
    res.send({msg:"User Added"});
}catch(error){
    console.log("" + error)
    res.send({msg: "Missing" + error});
}
});

/**
 * @swagger
 * '/api/v1/users':
 *  get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *     - Users
 *     summary: Get all users
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserResponse'
 *       401:
 *        description: Unauthorised
 *       404:
 *        description: User not found
 */

router.get("/", authenticate, async(req,res)=>{
    try {
        const response = await db.Users.get();
        let userArray = [];
        response.forEach(doc =>{

            const users = {
                user_id: doc.id,
                first_name: doc.data().first_name,
                last_name: doc.data().last_name,
                email: doc.data().email,
                address: doc.data().address,
                admin: doc.data().admin
            }
            userArray.push(users);
        });
        // console.log(userArray);
        res.send(userArray); 
    } catch (error) {
        res.send({msg: "" + error })
    }
});

/**
 * @swagger
 * '/api/v1/users/user/{user_id}':
 *  get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *     - Users
 *     summary: Get a single user
 *     parameters:
 *      - name: user_id
 *        in: path
 *        description: The unique id of the user
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserResponse'
 *       401:
 *        description: Unauthorised
 *       404:
 *        description: User not found
 */


router.get("/user/:id", authenticate, async(req,res)=>{
    try {
        const userRef = db.Users.doc(req.params.id);
        const response = await userRef.get();
    
        // console.log(response.data());
        res.send(response.data()); 
    } catch (error) {
        res.send({msg: "" + error })
    }
});

/**
 * @swagger
 * '/api/v1/users/user/{user_id}':
 *  patch:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *     - Users
 *     summary: Update a user
 *     requestBody:
 *      required: true
 *      content:
 *         application/json:
 *          schema:
 *            $ref: '#/components/schemas/User'
 *     parameters:
 *      - name: user_id
 *        in: path
 *        description: The unique id of the user
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/UserResponse'
 *       401:
 *        description: Unauthorised
 *       404:
 *        description: Bad request
 */

router.patch("/user/:id", authenticate, async(req,res)=>{
    try {
        const userRef = db.Users.doc(req.params.id);

        const data = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            address: req.body.address,
            admin: req.body.admin
        };

        await userRef.update(data);
    
        // console.dir(req.body);
        res.send({msg: "User updated"});
    } catch (error) {
        res.send({msg: "" + error })
    }
});

router.delete("/user/:id", authenticate, async(req,res)=>{
    try {
        const userRef = db.Users.doc(req.params.id);
        await userRef.delete();
    
        console.log("User deleted");
        res.send({msg: "User deleted"}); 
    } catch (error) {
        res.send({msg: "" + error })
    }
});

module.exports = router;