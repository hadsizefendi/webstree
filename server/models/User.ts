import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
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
  name: {
    type: String,
    required: false,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Password hashing middleware
userSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      console.log('Şifre değişikliği tespit edildi, hashleniyor...')
      console.log('Hash öncesi şifre uzunluğu:', this.password.length)

      const salt = await bcrypt.genSalt(10)
      this.password = await bcrypt.hash(this.password, salt)

      console.log('Hash sonrası şifre uzunluğu:', this.password.length)
    }
    next()
  } catch (error) {
    console.error('Şifre hashleme hatası:', error)
    next(error)
  }
})

// Şifre karşılaştırma metodu
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  try {
    console.log('Şifre karşılaştırılıyor:', {
      candidateLength: candidatePassword.length,
      hashedLength: this.password.length
    })
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    console.error('Şifre karşılaştırma hatası:', error)
    throw error
  }
}

export const User = mongoose.model('User', userSchema)
