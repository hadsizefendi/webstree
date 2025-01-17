import mongoose from 'mongoose'

interface ISetting extends mongoose.Document {
  key: string
  value: any
  type: string
  label: string
  description?: string
  group: string
  createdBy: mongoose.Types.ObjectId
  updatedBy?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const SettingSchema = new mongoose.Schema<ISetting>({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  type: { type: String, required: true }, // 'string', 'number', 'boolean', 'object', 'array'
  label: { type: String, required: true },
  description: String,
  group: { type: String, required: true }, // 'slider', 'general', 'social' gibi gruplar
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

export const Setting = mongoose.model<ISetting>('Setting', SettingSchema)
