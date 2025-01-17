import mongoose from 'mongoose'

interface IVariation {
  name: string          // Örn: "Renk", "Beden"
  options: string[]     // Örn: ["Kırmızı", "Mavi"] veya ["S", "M", "L"]
  prices?: number[]     // Opsiyonel: Her opsiyon için farklı fiyat
  stocks?: number[]     // Opsiyonel: Her opsiyon için farklı stok
}

interface IProduct extends mongoose.Document {
  name: string
  description?: string  // Made optional
  price?: number       // Made optional
  imageUrl?: string
  media?: Array<{          // Yeni eklenen alan
    type: string          // 'image' veya 'video'
    url: string
    order: number
  }>
  categories: Array<{
    _id: string
    title: string
    description: string
    image?: string
  }>
  variations?: IVariation[]
  createdBy: mongoose.Types.ObjectId
  updatedBy?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const VariationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  options: { type: [String], required: true },
  prices: [Number],
  stocks: [Number]
})

const ProductSchema = new mongoose.Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, required: false },  // Made optional
  price: { type: Number, required: false },        // Made optional
  imageUrl: { type: String, required: false },     // Changed from required: true to false
  media: [{                // Yeni eklenen alan
    type: { type: String, enum: ['image', 'video'], required: true },
    url: { type: String, required: true },
    order: { type: Number, default: 0 }
  }],
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true  // Made required
  }],
  variations: [VariationSchema],
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  updatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  }
}, {
  timestamps: true // createdAt ve updatedAt otomatik olarak eklenir
})

export const Product = mongoose.model<IProduct>('Product', ProductSchema)
