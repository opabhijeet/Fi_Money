import mongoosePaginate from 'mongoose-paginate-v2';
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    text: true 
    },
  type: String,
  sku: { 
    type: String, 
    unique: true, 
    index: true 
    },
  imageUrl: String,
  description: String,
  quantity: { 
    type: Number, 
    default: 0 
    },
  price: { 
    type: Number, 
    required: true 
    }
}, { timestamps: true });

productSchema.plugin(mongoosePaginate);           // adds `.paginate()`

export default mongoose.model('Product', productSchema);