const express = require('express');
const router = express.Router();

const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');

const upload = require('../middleware/middlewareFile');
const authenticate = require('../middleware/middlewareAuth');
const db = require('../config');



///////////////Item Routes///////////////

router.post("/", authenticate, (req, res) => {

    // Check if required data is present
    if (!req.body.item_name || !req.body.item_type || !req.body.description || !req.body.status) {
      return res.status(400).send({ msg: "Item name and type are required" });
    }
    upload(req, res, async (err) => {
      if (err) {
        console.log("error line 26 " + err);
        res.send({ msg: err });
        return;
      }
  
      try {
        const file = req.file;
        // const bucket = db.admin.storage().bucket();
        // console.log("file: ", file.path);
  
        const processImage = await sharp(file.path)
          .resize(250, 250)
          .jpeg()
          .toFile('./uploads/thumb_'+ file.originalname)
        //   .toBuffer();

        const image = ('./uploads/thumb_'+ file.originalname);
  
        const storageFile = await db.bucket.upload(image, {
          destination: `images/${uuidv4()}`,
          metadata: {
            contentType: file.mimetype,
          },
        });
        console.log("Deleting files:", file.path, image);

        // Delete the files from the server
        fs.unlinkSync(file.path);
        fs.unlinkSync(image);
  
        const imageUrl = storageFile[0].metadata.mediaLink;
  
        const data = {
          item_name: req.body.item_name,
          item_type: req.body.item_type,
          description: req.body.description,
          status: req.body.status,
          imageUrl: imageUrl,
        };
  
        console.log("Item data ", data);
        await db.Items.add(data);
        res.send({ msg: "Item Added" });
      } catch (error) {
        console.log("error line 70 " + error);
        res.send({ msg: "" + error });
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
   *              type: object
   *              properties:
   *                item_id:
   *                  type: string
   *                  descriptiom: Unique user id
   *                  example: AbT5rsv67hwbaf
   *                item_name:
   *                  type: string
   *                  descriptiom: Name of the item
   *                  example: Hammer
   *                item_type:
   *                  type: string
   *                  descriptiom: Type of item
   *                  example: DIY
   *                description:
   *                  type: string
   *                  descriptiom: Item description
   *                  example: For hitting nails
   *                status:
   *                  type: string
   *                  descriptiom: Status of the item
   *                  example: On Loan
   *                imageUrl:
   *                  type: string
   *                  descriptiom: Unique user id
   *                  example: https://example.com/image.jpg
   *       404:
   *        description: Items not found
   */

router.get("/", async(req,res)=>{
    try {
        const response = await db.Items.get();
        let itemArray = [];
        response.forEach(doc =>{
            const items = {
                item_id: doc.id,
                item_name: doc.data().item_name,
                item_type: doc.data().item_type,
                description: doc.data().description,
                status: doc.data().status,
                imageUrl: doc.data().imageUrl
            }
            itemArray.push(items);
        });
        console.log(itemArray);
        res.send(itemArray); 
    } catch (error) {
        res.send({msg: "" + error })
    }

});


router.get("/item/:id", authenticate, async(req,res)=>{
    try {
        const itemRef = db.Items.doc(req.params.id);
        const response = await itemRef.get();
    
        console.log(response.data());
        res.send(response.data()); 
    } catch (error) {
        res.send({msg: "" + error })
    }
});

router.patch("/item/:id", authenticate, async(req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        console.log("error line 141 " + err);
        res.send({ msg: err });
        return;
      }
  
      try {

        let data = [];
        const itemRef = db.Items.doc(req.params.id);

        if(req.file){
        const file = req.file;
        // const bucket = db.admin.storage().bucket();
        console.log("file: ", file.path);
  
        const processImage = await sharp(file.path)
          .resize(250, 250)
          .jpeg()
          .toFile('./uploads/thumb_'+ file.originalname)
        //   .toBuffer();

        const image = ('./uploads/thumb_'+ file.originalname);

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
        data = {
            item_name: req.body.item_name,
            item_type: req.body.item_type,
            description: req.body.description,
            status: req.body.status,
          };
    }
  
        console.log("Item data ", data);
        // await db.Items.add(data);
        await itemRef.update(data);
        res.send({ msg: "Item updated" });
      } catch (error) {
        console.log("error line 186 " + error);
        res.send({ msg: "" + error });
      }
    });
  });

router.delete("/item/:id", authenticate, async(req,res)=>{
    try {
        const itemRef = db.Items.doc(req.params.id);
        await itemRef.delete();
    
        console.log("Item deleted");
        res.send({msg: "Item deleted"}); 
    } catch (error) {
        res.send({msg: "" + error })
    }
});

module.exports = router;