import mongoose from 'mongoose'

const inventoryLogSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      default: '',
    },
    changeType: {
      type: String,
      enum: ['restock', 'adjustment', 'order_deduct', 'order_cancel_restore'],
      required: true,
    },
    quantityChange: {
      type: Number,
      required: true,
    },
    previousStock: {
      type: Number,
      required: true,
    },
    newStock: {
      type: Number,
      required: true,
    },
    reason: {
      type: String,
      default: '',
    },
    orderNumber: {
      type: String,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

inventoryLogSchema.index({ product: 1, createdAt: -1 })

export const InventoryLog = mongoose.model('InventoryLog', inventoryLogSchema)
