const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/middlewareAuth');
const db = require('../config');

///////////////Reservation Routes///////////////

/**
 * @swagger
 * '/api/v1/reservations':
 *  post:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *     - Reservations
 *     summary: Create a reservation
 *     requestBody:
 *      required: true
 *      content:
 *         application/json:
 *          schema:
 *            $ref: '#/components/schemas/Reservation'
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ReservationResponse'
 *       401:
 *        description: Unauthorised
 *       404:
 *        description: Bad request
 */

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

/**
 * @swagger
 * '/api/v1/reservations':
 *  get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *     - Reservations
 *     summary: Get all reservations
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ReservationResponse'
 *       401:
 *        description: Unauthorised
 *       404:
 *        description: Reservations not found
 */

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

/**
 * @swagger
 * '/api/v1/reservations/reservation/{res_id}':
 *  get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *     - Reservations
 *     summary: Get a single reservation
 *     parameters:
 *      - name: res_id
 *        in: path
 *        description: The unique reservation id
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ReservationResponse'
 *       401:
 *        description: Unauthorised
 *       404:
 *        description: User not found
 */

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

/**
 * @swagger
 * '/api/v1/reservations/reservation/{res_id}':
 *  delete:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *     - Reservations
 *     summary: Delete a reservation
 *     parameters:
 *      - name: res_id
 *        in: path
 *        description: The unique reservation id
 *     responses:
 *       200:
 *        description: Success
 *       401:
 *        description: Unauthorised
 *       404:
 *        description: User not found
 */

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