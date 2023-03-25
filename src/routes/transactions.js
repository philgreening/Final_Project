const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/middlewareAuth");
const db = require("../config");
const logger = require("../logger");

///////////////Transaction Routes///////////////

/**
 * @swagger
 * '/api/v1/transactions':
 *  post:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *     - Transactions
 *     summary: Create a transaction
 *     requestBody:
 *      required: true
 *      content:
 *         application/json:
 *          schema:
 *            $ref: '#/components/schemas/Transaction'
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TransactionResponse'
 *       401:
 *        description: Unauthorised
 *       404:
 *        description: Bad request
 */

// Creat a transaction
router.post("/", authenticate, async (req, res) => {
  try {
    if (
      !req.body.item_id ||
      !req.body.item_name ||
      !req.body.user_id ||
      !req.body.transaction_status
    ) {
      return res.status(400).json({ msg: "Missing required fields" });
    }
    const data = {
      item_id: req.body.item_id,
      item_name: req.body.item_name,
      user_id: req.body.user_id,
      transaction_status: req.body.transaction_status,
      loan_date: db.CurrentTime,
      due_date: db.FutureTime,
      returned_date: "",
    };
    await db.Transactions.add(data);

    res.send({ msg: "Transaction created" });
    logger.info("Transaction created");
  } catch (error) {
    res.send({ msg: "" + error });
    logger.error(error);
  }
});

/**
 * @swagger
 * '/api/v1/transactions':
 *  get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *     - Transactions
 *     summary: Get all transactions
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TransactionResponse'
 *       401:
 *        description: Unauthorised
 *       404:
 *        description: Transactions not found
 */

// Get all transactions
router.get("/", authenticate, async (req, res) => {
  try {
    const response = await db.Transactions.get();
    let transactionArray = [];

    response.forEach((doc) => {
      const transactions = {
        transaction_id: doc.id,
        item_id: doc.data().item_id,
        item_name: doc.data().item_name,
        user_id: doc.data().user_id,
        transaction_status: doc.data().transaction_status,
        loan_date: doc.data().loan_date,
        due_date: doc.data().due_date,
        returned_date: doc.data().returned_date,
      };
      transactionArray.push(transactions);
    });
    res.send(transactionArray);
  } catch (error) {
    res.send({ msg: "" + error });
    logger.error(error);
  }
});

/**
 * @swagger
 * '/api/v1/transactions/transaction/{transaction_id}':
 *  get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *     - Transactions
 *     summary: Get a single transaction
 *     parameters:
 *      - name: res_id
 *        in: path
 *        description: The unique transaction id
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TransactionResponse'
 *       401:
 *        description: Unauthorised
 *       404:
 *        description: Transaction not found
 */

// Get a single transaction
router.get("/transaction/:id", authenticate, async (req, res) => {
  try {
    const transactionRef = db.Transactions.doc(req.params.id);
    const response = await transactionRef.get();

    res.send(response.data());
  } catch (error) {
    res.send({ msg: "" + error });
    logger.error(error);
  }
});

/**
 * @swagger
 * '/api/v1/transactions/transaction/{transaction_id}':
 *  patch:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *     - Transactions
 *     summary: Update a transaction
 *     requestBody:
 *      required: true
 *      content:
 *         application/json:
 *          schema:
 *            $ref: '#/components/schemas/Transaction'
 *     parameters:
 *      - name: user_id
 *        in: path
 *        description: The unique transaction id
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/TransactionResponse'
 *       401:
 *        description: Unauthorised
 *       404:
 *        description: Bad request
 */

// Update a transaction
router.patch("/transaction/:id", authenticate, async (req, res) => {
  try {
    const transactionRef = db.Transactions.doc(req.params.id);

    const data = {
      transaction_status: req.body.transaction_status,
      returned_date: db.CurrentTime,
    };

    await transactionRef.update(data);

    res.send({ msg: "Transaction updated" });
    logger.info("Transaction updated");
  } catch (error) {
    res.send({ msg: "" + error });
    logger.error(error);
  }
});

module.exports = router;
