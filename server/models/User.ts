import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const addressSchema = new mongoose.Schema({
  title: String,
  fullName: String,
  phone: String,
  street: String,
  city: String,
  state: String,
  country: String,
  zipCode: String,
  isDefault: Boolean
})

const companySchema = new mongoose.Schema({
  name: String,
  taxNumber: String,
  taxOffice: String,
  email: String,
  phone: String,
  website: String
})

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  verificationTokenExpiry: Date,
  lastVerificationCodeSentAt: Date, // Yeni field ekle
  resetPasswordToken: String,
  resetPasswordExpiry: Date,

  name: String,
  surname: String,
  phone: String,

  shippingAddresses: [addressSchema],
  billingAddresses: [addressSchema],
  useShippingAsBilling: {
    type: Boolean,
    default: true
  },

  isCompany: {
    type: Boolean,
    default: false
  },
  company: companySchema,

  cart: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    quantity: Number,
    variant: String,
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  }],

  preferences: {
    newsletter: {
      type: Boolean,
      default: false
    },
    marketingEmails: {
      type: Boolean,
      default: false
    },
    language: {
      type: String,
      default: 'tr'
    },
    currency: {
      type: String,
      default: 'TRY'
    }
  },

  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

userSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(10)
      this.password = await bcrypt.hash(this.password, salt)
    }
    next()
  } catch (error) {
    next(error)
  }
})

userSchema.methods.comparePassword = async function (candidatePassword: string) {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    throw error
  }
}

userSchema.methods.addToCart = async function(productId, quantity = 1, variant = '') {
  const existingItem = this.cart.find(item => 
    item.productId.toString() === productId && item.variant === variant
  )

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    this.cart.push({ productId, quantity, variant })
  }
  return this.save()
}

userSchema.methods.removeFromCart = async function(productId, variant = '') {
  this.cart = this.cart.filter(item => 
    !(item.productId.toString() === productId && item.variant === variant)
  )
  return this.save()
}

userSchema.methods.clearCart = async function() {
  this.cart = []
  return this.save()
}

userSchema.methods.toggleFavorite = async function(productId) {
  const index = this.favorites.indexOf(productId)
  if (index > -1) {
    this.favorites.splice(index, 1)
  } else {
    this.favorites.push(productId)
  }
  return this.save()
}

userSchema.methods.addShippingAddress = async function(address) {
  if (address.isDefault) {
    this.shippingAddresses.forEach(addr => addr.isDefault = false)
  }
  this.shippingAddresses.push(address)
  return this.save()
}

userSchema.methods.addBillingAddress = async function(address) {
  if (address.isDefault) {
    this.billingAddresses.forEach(addr => addr.isDefault = false)
  }
  this.billingAddresses.push(address)
  return this.save()
}

userSchema.methods.getDefaultAddresses = function() {
  const defaultShipping = this.shippingAddresses.find(addr => addr.isDefault)
  const defaultBilling = this.useShippingAsBilling
    ? defaultShipping
    : this.billingAddresses.find(addr => addr.isDefault)

  return { shipping: defaultShipping, billing: defaultBilling }
}

userSchema.methods.setCompanyInfo = async function(companyInfo) {
  this.isCompany = true
  this.company = companyInfo
  return this.save()
}

export const User = mongoose.model('User', userSchema)
