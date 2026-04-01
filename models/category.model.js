import { model, Schema } from 'mongoose';

const categorySchema = new Schema(
  {
    category_name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Category = model('category', categorySchema);
export default Category;
