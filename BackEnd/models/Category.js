import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  categoryId: {
    type: Number,
    required: true,
    unique: true
  },
  categoryName: {
    type: String,
    required: true,
    trim: true,
    unique: true
  }
}, {
  timestamps: true,
  _id: false // Disable default _id
});

const Category = mongoose.model('Category', categorySchema);

export default Category;