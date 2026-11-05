import mongoose from 'mongoose'

const sizeStockSchema = new mongoose.Schema(
  {
    size: { type: String, required: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
  },
  { _id: false }
)

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      default: 'Unisex fashion with traditional and street fusion. Designed in Lyari.',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    salePrice: {
      type: Number,
      default: null,
    },
    sku: {
      type: String,
      trim: true,
      sparse: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
    },
    collectionSlug: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },
    images: {
      type: [String],
      default: [],
    },
    sizeChart: {
      type: String,
      default: '',
    },
    sizes: {
      type: [sizeStockSchema],
      default: [
        { size: 'S', stock: 10 },
        { size: 'M', stock: 15 },
        { size: 'L', stock: 15 },
        { size: 'XL', stock: 10 },
      ],
    },
    totalStock: {
      type: Number,
      default: 50,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    tags: [String],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

productSchema.virtual('soldOut').get(function () {
  return (this.totalStock ?? 0) <= 0
})

productSchema.pre('save', function (next) {
  if (this.sizes && this.sizes.length > 0) {
    this.totalStock = this.sizes.reduce((acc, curr) => acc + (curr.stock || 0), 0)
  }
  next()
})

productSchema.index({ name: 'text', description: 'text' })
productSchema.index({ collectionSlug: 1, isPublished: 1 })
productSchema.index({ price: 1 })
productSchema.index({ createdAt: -1 })

export const Product = mongoose.model('Product', productSchema)
