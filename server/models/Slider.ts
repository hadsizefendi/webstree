import mongoose from 'mongoose'

interface ISlideItem {
  type: 'image' | 'video'
  url: string
  title: string
  subtitle?: string
  description?: string
  order: number
}

interface ISlider extends mongoose.Document {
  title: string
  description?: string
  items: ISlideItem[]
  createdBy: mongoose.Types.ObjectId
  updatedBy?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const SlideItemSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['image', 'video'] },
  url: { type: String, required: true },
  title: String,
  subtitle: String,
  description: String,
  order: { type: Number, required: true }
})

const SliderSchema = new mongoose.Schema<ISlider>({
  title: { type: String, required: true },
  description: String,
  items: [SlideItemSchema],
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
  timestamps: true
})

export const Slider = mongoose.model<ISlider>('Slider', SliderSchema)
