// install
import express from 'express'
import * as pc from '../controllers/products.controllers.js';
// router call kar lia
const products = express.Router()
// route create kar lia
products.route("/")
       .get(pc.getproducts)
       .post(pc.addproduct)

// ✅ category route PEHLE
products.route("/category")
       .post(pc.addcategory)
       .get(pc.getcategories)

// ✅ phir id wala
products.route("/:id")
       .get(pc.getproduct)
       .put(pc.updateproduct)
       .delete(pc.deleteproduct)

// export
export default products;
