import mongoose from 'mongoose'

const orderItemSchema = new mongoose.Schema({
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
  price: {
    type: Number,
    required: true
  },
  variant: String,
  total: {
    type: Number,
    required: true
  }
})

// Pre-save hook'u güncelle
orderItemSchema.pre('save', function(next) {
  if (this.price && this.quantity) {
    this.total = this.price * this.quantity
  }
  next()
})

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true
  },
  sessionId: String, // Misafir siparişleri için
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  items: [orderItemSchema],
  shippingAddress: {
    title: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    city: String,
    district: String,
    neighborhood: String,
    address: String
  },
  billingAddress: {
    title: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    city: String,
    district: String,
    neighborhood: String,
    address: String
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'cashOnDelivery'],
    required: true
  },
  subtotal: Number,
  shippingCost: {
    type: Number,
    default: 0
  },
  totalAmount: Number,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Pre-save hook ile totals hesaplama
orderSchema.pre('save', function(next) {
  if (this.isModified('items')) {
    this.subtotal = this.items.reduce((total, item) => total + item.total, 0)
    this.totalAmount = this.subtotal + (this.shippingCost || 0)
  }
  next()
})

// Helper fonksiyon ekleyelim
orderSchema.statics.generateOrderNumber = async function() {
  const count = await this.countDocuments()
  return `WS${new Date().getFullYear()}${String(count + 1).padStart(6, '0')}`
}

export const Order = mongoose.model('Order', orderSchema)
