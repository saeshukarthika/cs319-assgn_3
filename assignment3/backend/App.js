/**
 * Author: Saeshu Karthika
 * ISU Netid : saeshu03@iastate.edu
 * Date :  4/27/2024
 */


var express = require("express");
var cors = require("cors");
var app = express();
var fs = require("fs");
var bodyParser = require("body-parser");
app.use(cors());
app.use(bodyParser.json());
const port = "8081";
const host = "localhost";

app.listen(port, () => {
  console.log("App listening at http://%s:%s", host, port);
});

const { MongoClient } = require("mongodb");

// MongoDB
const url = "mongodb://127.0.0.1:27017";
const dbName = "react";

const client = new MongoClient(url);
const db = client.db('react');

// Connect to MongoDB
client.connect();


// Read all products
// app.get("/listProducts", async (req, res) => {
//     try {
//       const db = client.db('react');
//       const query = {};
//       const results = await db.collection("products").find(query).toArray();
//       res.status(200).send(results);
//     } catch (error) {
//       console.error("An error occurred:", error);
//       res.status(500).send({ error: 'An internal server error occurred' });
//     }
//   });
  
  app.get("/listProducts", async (req, res) => {
    await client.connect();
    console.log("Node connected successfully to GET MongoDB");
    const query = {};
    const results = await db.collection("fakestore_catalog").find(query).limit(100).toArray();
    console.log(results);
    res.status(200);
    res.send(results);
  });

  app.get("/listProducts/:id", async (req, res) => {
    try {
        await client.connect();
        const productId = Number(req.params.id);
        console.log(productId);
       
        console.log("Node connected successfully to GET-id MongoDB");
        const query = {"id": productId};
        const result = await db.collection("fakestore_catalog").find(query).toArray();
        console.log("Result :", result);
        if (!result) {
            res.send("Not Found").status(404);
        } else {
            res.status(200).send(result);
        }
        } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send({ error: 'An internal server error occurred' });
    }
  });

  // Create a new product
  app.post("/addProduct", async (req, res) => {
    try {
            await client.connect();
            const newProduct = req.body;
            const result = await db.collection("fakestore_catalog").insertOne(newProduct);
            // if (result.insertedCount === 1) {
            // res.status(201).send(result.ops[0]);
            // } else {
            // console.error("Error: Insertion failed");
            // res.status(500).send({ error: 'An internal server error in status occurred' });
            // }
        } catch (error) {
            console.error("An error occurred:", error);
            res.status(500).send({ error: 'An internal server error occurred' });
        }
    });
  
  // Update a product
  app.put("/updateProduct/:id", async (req, res) => {
    try {
        await client.connect();
        const productId = Number(req.params.id);
        const query = { id: productId };
        const updateData = { $set: {"price": Number(req.body.price)}};
        const result = await db.collection("fakestore_catalog").updateOne(query, updateData);
        if (result.matchedCount === 0) {
            res.status(404).send({ message: 'Product not found' });
        } else {
            res.status(200).send({ message: 'Product updated successfully' });
        }
        } catch (error) {
        console.error("An error occurred:", error);
        res.status(500).send({ error: 'An internal server error occurred' });
        }
         });
  
  // Delete a product
  app.delete("/deleteProduct/:id", async (req, res) => {
    try {
      await client.connect();
      const productId = Number(req.params.id);
      const query = { id: productId };
      const result = await db.collection("fakestore_catalog").deleteOne(query);
      if (result.deletedCount === 0) {
        res.status(404).send({ message: 'Product not found' });
      } else {
        res.status(200).send({ message: 'Product deleted successfully' });
      }
    } catch (error) {
      console.error("An error occurred:", error);
      res.status(500).send({ error: 'An internal server error occurred' });
    }
  });
  