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
    upload(req, res, async (err) => {
      if (err) {
        console.log("error line 26 " + err);
        res.send({ msg: err });
        return;
      }
  
      try {
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