import mongoose from 'mongoose'

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  variant: String,
  addedAt: {
    type: Date,
    default: Date.now
  }
})

const cartSchema = new mongoose.Schema({
  sessionId: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true
  },
  items: [cartItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 180 * 24 * 60 * 60 * 1000) // 180 gün
  }
})

export const Cart = mongoose.model('Cart', cartSchema)
