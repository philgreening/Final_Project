const express = require("express");
const router = express.Router();

const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

const upload = require("../middleware/middlewareFile");
const authenticate = require("../middleware/middlewareAuth");
const db = require("../config");
const logger = require("../logger");

///////////////Item Routes///////////////

/**
 * @swagger
 * '/api/v1/items':
 *  post:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *     - Items
 *     summary: Create an item
 *     requestBody:
 *      required: true
 *      content:
 *         multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/Item'
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ItemResponse'
 *       401:
 *        description: Unauthorised
 *       404:
 *        description: Bad request
 */

// Create an item
router.post("/", authenticate, (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.send({ msg: err });
      logger.error(err);
      return;
    }

    // Check if required data is present
    if (
      !req.body.item_name ||
      !req.body.item_type ||
      !req.body.description ||
      !req.body.status
    ) {
      return res.status(400).send({ msg: "Item name and type are required" });
    }

    try {
      // Proccess uploaded image file
      const file = req.file;
      const processImage = await sharp(file.path)
        .resize(250, 250)
        .jpeg()
        .toFile("./uploads/thumb_" + file.originalname);

      // Set the path for the processed image
      const image = "./uploads/thumb_" + file.originalname;

      // Upload the processed image file to google cloud storage bucket
      const storageFile = await db.bucket.upload(image, {
        destination: `images/${uuidv4()}`,
        metadata: {
          contentType: file.mimetype,
        },
      });
      // Delete the files from the server
      fs.unlinkSync(file.path);
      fs.unlinkSync(image);

      // Get the URL of the image
      const imageUrl = storageFile[0].metadata.mediaLink;

      const data = {
        item_name: req.body.item_name,
        item_type: req.body.item_type,
        description: req.body.description,
        status: req.body.status,
        imageUrl: imageUrl,
      };

      await db.Items.add(data);

      res.send({ msg: "Item Added" });
      logger.info("Item Added");
    } catch (error) {
      res.send({ msg: "" + error });
      logger.error(error);
    }
  });
});

/**
 * @swagger
 * '/api/v1/items':
 *  get:
 *     tags:
 *     - Items
 *     summary: Get all items
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ItemResponse'
 *       404:
 *        description: Items not found
 */

// Get all items
router.get("/", async (req, res) => {
  try {
    const response = await db.Items.get();
    let itemArray = [];

    response.forEach((doc) => {
      const items = {
        item_id: doc.id,
        item_name: doc.data().item_name,
        item_type: doc.data().item_type,
        description: doc.data().description,
        status: doc.data().status,
        imageUrl: doc.data().imageUrl,
      };
      itemArray.push(items);
    });

    res.send(itemArray);
  } catch (error) {
    res.send({ msg: "" + error });
    logger.error(error);
  }
});

/**
 * @swagger
 * '/api/v1/items/item/{item_id}':
 *  get:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *     - Items
 *     summary: Get a single item
 *     parameters:
 *      - name: item_id
 *        in: path
 *        description: The unique id of the item
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ItemResponse'
 *       401:
 *        description: Unauthorised
 *       404:
 *        description: Item not found
 */

//Get a single item
router.get("/item/:id", authenticate, async (req, res) => {
  try {
    const itemRef = db.Items.doc(req.params.id);
    const response = await itemRef.get();

    res.send(response.data());
  } catch (error) {
    res.send({ msg: "" + error });
    logger.error(error);
  }
});

/**
 * @swagger
 * '/api/v1/items/item/{item_id}':
 *  patch:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *     - Items
 *     summary: Update a single item
 *     requestBody:
 *      required: true
 *      content:
 *         multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/Item'
 *     parameters:
 *      - name: item_id
 *        in: path
 *        description: The unique id of the item
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ItemResponse'
 *       401:
 *        description: Unauthorised
 *       404:
 *        description: Item not found
 */

// Update an item
router.patch("/item/:id", authenticate, async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      res.send({ msg: err });
      logger.error(err);
      return;
    }

    try {
      let data = [];
      const itemRef = db.Items.doc(req.params.id);

      if (req.file) {
        // if file is uploaded, process it and upload to google cloud storage
        const file = req.file;

        const processImage = await sharp(file.path)
          .resize(250, 250)
          .jpeg()
          .toFile("./uploads/thumb_" + file.originalname);

        const image = "./uploads/thumb_" + file.originalname;

        const storageFile = await db.bucket.upload(image, {
          destination: `images/${uuidv4()}`,
          metadata: {
            contentType: file.mimetype,
          },
        });

        // Delete the files from the server
        fs.unlinkSync(file.path);
        fs.unlinkSync(image);

        const imageUrl = storageFile[0].metadata.mediaLink;

        data = {
          item_name: req.body.item_name,
          item_type: req.body.item_type,
          description: req.body.description,
          status: req.body.status,
          imageUrl: imageUrl,
        };
      } else {
        // if file is not uploaded, update only text data
        data = {
          item_name: req.body.item_name,
          item_type: req.body.item_type,
          description: req.body.description,
          status: req.body.status,
        };
      }
      // update the item data in the database
      await itemRef.update(data);

      res.send({ msg: "Item updated" });
      logger.info("Item updated");
    } catch (error) {
      res.send({ msg: "" + error });
      logger.error(err);
    }
  });
});

/**
 * @swagger
 * '/api/v1/items/item/{item_id}':
 *  delete:
 *     security:
 *      - bearerAuth: []
 *     tags:
 *     - Items
 *     summary: Delete a single item
 *     parameters:
 *      - name: item_id
 *        in: path
 *        description: The unique id of the item
 *     responses:
 *       200:
 *        description: Success
 *       401:
 *        description: Unauthorised
 *       404:
 *        description: Item not found
 */

// Delete an item
router.delete("/item/:id", authenticate, async (req, res) => {
  try {
    const itemRef = db.Items.doc(req.params.id);
    await itemRef.delete();

    res.send({ msg: "Item deleted" });
    logger.info(req.params.item_name + "deleted");
  } catch (error) {
    res.send({ msg: "" + error });
    logger.error(error);
  }
});

module.exports = router;
