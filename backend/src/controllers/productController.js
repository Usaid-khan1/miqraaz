import { Product } from '../models/Product.js'
import { Category } from '../models/Category.js'
import { InventoryLog } from '../models/InventoryLog.js'

export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      collection,
      category,
      minPrice,
      maxPrice,
      inStock,
      outOfStock,
      featured,
      sort,
      page = 1,
      limit = 24,
      includeUnpublished = 'false',
    } = req.query

    const filter = {}

    // Public only sees published products
    if (includeUnpublished !== 'true') {
      filter.isPublished = true
    }

    // Collection or category slug
    if (collection && collection !== 'all' && collection !== 'all-products') {
      const cat = await Category.findOne({ slug: collection.toLowerCase() }).select('_id')
      if (cat) {
        filter.$or = [
          { collectionSlug: collection.toLowerCase() },
          { category: cat._id },
        ]
      } else {
        filter.collectionSlug = collection.toLowerCase()
      }
    }

    if (category) {
      filter.category = category
    }

    // Search by name or description
    if (search && search.trim()) {
      const searchOr = [
        { name: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } },
        { sku: { $regex: search.trim(), $options: 'i' } },
      ]
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchOr }]
        delete filter.$or
      } else {
        filter.$or = searchOr
      }
    }

    // Price filtering
    if (minPrice || maxPrice) {
      filter.price = {}
      if (minPrice) filter.price.$gte = Number(minPrice)
      if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    // Stock availability filtering
    if (inStock === 'true' && outOfStock !== 'true') {
      filter.totalStock = { $gt: 0 }
    } else if (outOfStock === 'true' && inStock !== 'true') {
      filter.totalStock = { $lte: 0 }
    }

    // Featured filter
    if (featured === 'true') {
      filter.isFeatured = true
    }

    // Sorting
    let sortOptions = { createdAt: -1 }
    if (sort === 'az') sortOptions = { name: 1 }
    else if (sort === 'za') sortOptions = { name: -1 }
    else if (sort === 'lh') sortOptions = { price: 1 }
    else if (sort === 'hl') sortOptions = { price: -1 }
    else if (sort === 'newest') sortOptions = { createdAt: -1 }
    else if (sort === 'featured') sortOptions = { isFeatured: -1, createdAt: -1 }

    const pageNum = Math.max(1, Number(page))
    const limitNum = Math.max(1, Number(limit))
    const skip = (pageNum - 1) * limitNum

    const [products, totalCount] = await Promise.all([
      Product.find(filter)
        .populate('category', 'name slug')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum),
      Product.countDocuments(filter),
    ])

    res.json({
      success: true,
      products,
      pagination: {
        total: totalCount,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(totalCount / limitNum) || 1,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getProductBySlugOrId = async (req, res, next) => {
  try {
    const { identifier } = req.params
    let product

    if (identifier.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(identifier).populate('category', 'name slug')
    } else {
      product = await Product.findOne({ slug: identifier }).populate('category', 'name slug')
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    // Get related products from the same collection
    const relatedProducts = await Product.find({
      _id: { $ne: product._id },
      collectionSlug: product.collectionSlug,
      isPublished: true,
    })
      .limit(4)
      .select('name slug price images totalStock isFeatured')

    res.json({
      success: true,
      product,
      relatedProducts,
    })
  } catch (error) {
    next(error)
  }
}

export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isFeatured: true, isPublished: true })
      .limit(8)
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      products,
    })
  } catch (error) {
    next(error)
  }
}

export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      salePrice,
      sku,
      category,
      collectionSlug,
      images,
      sizeChart,
      sizes,
      lowStockThreshold,
      isFeatured,
      isPublished,
    } = req.body

    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Product name and price are required' })
    }

    const productSlug = (slug || name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
      .replace(/(^-|-$)+/g, '')

    const existingSlug = await Product.findOne({ slug: productSlug })
    if (existingSlug) {
      return res.status(400).json({ success: false, message: 'Product with this slug already exists' })
    }

    const sizesArr = Array.isArray(sizes) && sizes.length > 0
      ? sizes
      : [
          { size: 'S', stock: 10 },
          { size: 'M', stock: 15 },
          { size: 'L', stock: 15 },
          { size: 'XL', stock: 10 },
        ]

    const totalStock = sizesArr.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0)

    const product = await Product.create({
      name,
      slug: productSlug,
      description: description || '',
      price: Number(price),
      salePrice: salePrice ? Number(salePrice) : null,
      sku: sku || `MK-${Math.floor(100000 + Math.random() * 900000)}`,
      category: category || null,
      collectionSlug: collectionSlug ? collectionSlug.toLowerCase().trim() : '',
      images: Array.isArray(images) ? images : [],
      sizeChart: sizeChart || '',
      sizes: sizesArr,
      totalStock,
      lowStockThreshold: Number(lowStockThreshold) || 5,
      isFeatured: Boolean(isFeatured),
      isPublished: isPublished !== undefined ? Boolean(isPublished) : true,
    })

    // Log initial inventory
    if (totalStock > 0) {
      await InventoryLog.create({
        product: product._id,
        productName: product.name,
        changeType: 'restock',
        quantityChange: totalStock,
        previousStock: 0,
        newStock: totalStock,
        reason: 'Initial product stock creation',
        createdBy: req.user._id,
      })
    }

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product,
    })
  } catch (error) {
    next(error)
  }
}

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    const prevStock = product.totalStock
    const {
      name,
      slug,
      description,
      price,
      salePrice,
      sku,
      category,
      collectionSlug,
      images,
      sizeChart,
      sizes,
      lowStockThreshold,
      isFeatured,
      isPublished,
    } = req.body

    if (name) product.name = name
    if (description !== undefined) product.description = description
    if (price !== undefined) product.price = Number(price)
    if (salePrice !== undefined) product.salePrice = salePrice ? Number(salePrice) : null
    if (sku !== undefined) product.sku = sku
    if (category !== undefined) product.category = category || null
    if (collectionSlug !== undefined) product.collectionSlug = collectionSlug.toLowerCase().trim()
    if (images !== undefined) product.images = images
    if (sizeChart !== undefined) product.sizeChart = sizeChart
    if (lowStockThreshold !== undefined) product.lowStockThreshold = Number(lowStockThreshold)
    if (isFeatured !== undefined) product.isFeatured = Boolean(isFeatured)
    if (isPublished !== undefined) product.isPublished = Boolean(isPublished)

    if (sizes && Array.isArray(sizes)) {
      product.sizes = sizes
      product.totalStock = sizes.reduce((acc, curr) => acc + (Number(curr.stock) || 0), 0)
    }

    if (slug && slug !== product.slug) {
      const cleanSlug = slug
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
        .replace(/(^-|-$)+/g, '')

      const duplicate = await Product.findOne({ slug: cleanSlug, _id: { $ne: product._id } })
      if (duplicate) {
        return res.status(400).json({ success: false, message: 'Slug already taken by another product' })
      }
      product.slug = cleanSlug
    }

    await product.save()

    // If stock changed, record log
    if (product.totalStock !== prevStock) {
      await InventoryLog.create({
        product: product._id,
        productName: product.name,
        changeType: 'adjustment',
        quantityChange: product.totalStock - prevStock,
        previousStock: prevStock,
        newStock: product.totalStock,
        reason: 'Manual stock adjustment by administrator',
        createdBy: req.user._id,
      })
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' })
    }

    await Product.findByIdAndDelete(product._id)

    res.json({
      success: true,
      message: 'Product deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}
