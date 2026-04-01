import Category from "../models/category.model.js"
import product from "../models/product.model.js"


// fetch all teh products from database /api/v1/products GET (1)
const getproducts = async (req,res) => {
  const products = await product.find()
  const length   = products.length

  try{
       if(length==0){
          return res.json({
              display:"no product"
          })
       }
       {
        res.json({
          display:`we have ${length} products in our array`,
          products:products
        })
       }
  }
  catch(err){
    return res.json({
    error:err.message
  })
  }  
}

// add new product into database /api/v1/products POST (2)
const addproduct = async (req,res) => {
  try{
        // take input from user (1)
        const {title,subtitle,category,description,brand,price,images} = req.body
        // all fields are required (2)
        if(!title || !subtitle || !category || !description || !brand || !price || !images){
         return res.json({
            error:"All fields are required"
          })
        }
        // add new product into database
        await new product({
             title,subtitle,category,description,brand,price,images
        }).save()

      res.json({
        success:"product inserted successfully"
      })

  }
  catch(err){
    res.json({
      error:err.message
    })
  }
}

// fetch single product from database /api/v1/products/id GET (3)
const getproduct = async (req,res) => {
     try{
         const  id = req.params.id
         const singleproduct = await product.findById(id)
         if(!singleproduct){
            return res.json({
                error:`product not found of this id ${singleproduct}`
            })
          }
          {
            res.json({
              singleproduct
            })
          }

     }
     catch(err){
      res.json({
        error:err.message
      })
     }
}

// update existing product from database /api/v1/products/id PUT (4)
const updateproduct = async (req,res) => {
  try{
      const id = req.params.id
      const body = req.body
      await product.findByIdAndUpdate(id,body,{new:true})
      res.json({
        success:"product updated successfully"
      })
  }
  catch(err){
    res.json({
      error:err.message
    })
  }
}

// delete existing product from database /api/v1/products/id DELETE (5)
const deleteproduct = async (req,res ) => {
  try{
      const id = req.params.id
      await product.findByIdAndDelete(id)
      res.json({
        success:"product deleted successfully"
      })
  }
  catch(err){
    res.json({
      error:err.message
    })
  }
}

// yahan par ham nayi category add kar sakta han (6)
const addcategory = async (req,res) => {
  try{
        // take input from user (1)
        console.log(req.body.category)

        // all fields are required (2)
        if(!req.body.category ){
         return res.json({
            error:"Category required"
          })
        }
        
        const category_name = req.body.category

        // add new product into database
        await new Category({category_name}).save()

      res.json({
        success:"category inserted successfully"
      })

  }
  catch(err){
    res.json({
      error:err.message
    })
  }
}

// get all the categories from database (7)
const getcategories = async (req,res) => {
  const categories = await Category.find()
  const length   = categories.length

  try{
       if(length==0){
          return res.json({
              display:"no product"
          })
       }
       {
        res.json({
          display:`No category fiund please add one`,
          categories:categories
        })
       }
  }
  catch(err){
    return res.json({
    error:err.message
  })
  }  
}

export {
  getproducts,
  addproduct,
  getproduct,
  updateproduct,
  deleteproduct,
  addcategory,
  getcategories
}