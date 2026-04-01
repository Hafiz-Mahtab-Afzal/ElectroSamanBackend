import { Schema,model } from 'mongoose'

const productSchema = new Schema({
      title:{
        type:String,
        require:true
      },
      subtitle:{
        type:String,
        require:true
      },
      category:{
        type:Schema.ObjectId,
        ref:"category"
      },
      brand:{
        type:String,
        require:true
      },
      description:{
        type:String,
        require:true
      },
      price:{
        type:Number,
        require:true
      },
      images: [{ type: String }],
      stock:{
        type:Number,
        default:0
      },
        
     rating: {
       type: Number,
       default: 0,
      },
      reviews: [],
      wishlist: [],
      sku: {
       type: Number,
       default: 0,
      },
      onsale: {
      type: Boolean,
      default: 0,
     },
    discount: {
     type: Number,
     default: 0,
    },
   warranty_information: {
    type: String,
    default: '1 year warranty',
   },
   dimension: {
    weight:{   
      type: Number,
     default: 0,
    },
    height:{   
      type: Number,
     default: 0,
    },
    width:{   
      type: Number,
     default: 0,
    },

   }
},{timestamps:true})


const product = model("product",productSchema)
export default product;