const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/middlewareAuth");
const db = require("../config");

const logger = require("../logger");

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

// Create a reservation
router.post("/", authenticate, async (req, res) => {
  try {
    if (!req.body.item_id || !req.body.item_name || !req.body.user_id) {
      return res.status(400).json({ msg: "Missing required fields" });
    }

    const data = {
      item_id: req.body.item_id,
      item_name: req.body.item_name,
      user_id: req.body.user_id,
      res_date: db.CurrentTime,
    };

    await db.Reservations.add(data);

    res.send({ msg: "Reservation created" });
    logger.info("Reservation created");
  } catch (error) {
    res.send({ msg: error });
    logger.error(error);
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

// Get all reservations
router.get("/", authenticate, async (req, res) => {
  try {
    const response = await db.Reservations.get();
    let resArray = [];

    response.forEach((doc) => {
      const reservations = {
        res_id: doc.id,
        item_id: doc.data().item_id,
        item_name: doc.data().item_name,
        user_id: doc.data().user_id,
        res_date: doc.data().res_date,
      };
      resArray.push(reservations);
    });
    res.send(resArray);
  } catch (error) {
    res.send({ msg: "" + error });
    logger.error(error);
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

// Get a single reservation
router.get("/reservation/:id", authenticate, async (req, res) => {
  try {
    const resRef = db.Reservations.doc(req.params.id);
    const response = await resRef.get();

    res.send(response.data());
  } catch (error) {
    res.send({ msg: "" + error });
    logger.error(error);
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

// Delete a reservation
router.delete("/reservation/:id", authenticate, async (req, res) => {
  try {
    const resRef = db.Reservations.doc(req.params.id);
    await resRef.delete();

    res.send({ msg: "Reservation deleted" });
    logger.info("Reservation deleted");
  } catch (error) {
    res.send({ msg: "" + error });
    logger.error(error);
  }
});

module.exports = router;
