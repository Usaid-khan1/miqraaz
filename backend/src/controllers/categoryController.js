import { Category } from '../models/Category.js'
import { Product } from '../models/Product.js'

export const getCategories = async (req, res, next) => {
  try {
    const { includeInactive } = req.query
    const query = includeInactive === 'true' ? {} : { isActive: true }
    const categories = await Category.find(query).sort({ order: 1, createdAt: -1 })

    res.json({
      success: true,
      categories,
    })
  } catch (error) {
    next(error)
  }
}

export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug })
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' })
    }

    res.json({
      success: true,
      category,
    })
  } catch (error) {
    next(error)
  }
}

export const createCategory = async (req, res, next) => {
  try {
    const { name, slug, description, image, order, isActive } = req.body

    if (!name) {
      return res.status(400).json({ success: false, message: 'Category name is required' })
    }

    const categorySlug = (slug || name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    const existing = await Category.findOne({ slug: categorySlug })
    if (existing) {
      return res.status(400).json({ success: false, message: 'A category with this slug already exists' })
    }

    const category = await Category.create({
      name,
      slug: categorySlug,
      description: description || '',
      image: image || '',
      order: Number(order) || 0,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    })

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      category,
    })
  } catch (error) {
    next(error)
  }
}

export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' })
    }

    const { name, slug, description, image, order, isActive } = req.body

    if (name) category.name = name
    if (description !== undefined) category.description = description
    if (image !== undefined) category.image = image
    if (order !== undefined) category.order = Number(order)
    if (isActive !== undefined) category.isActive = Boolean(isActive)

    if (slug && slug !== category.slug) {
      const cleanSlug = slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      const duplicate = await Category.findOne({ slug: cleanSlug, _id: { $ne: category._id } })
      if (duplicate) {
        return res.status(400).json({ success: false, message: 'Slug is already in use by another category' })
      }
      category.slug = cleanSlug
    }

    await category.save()

    res.json({
      success: true,
      message: 'Category updated successfully',
      category,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' })
    }

    // Check if products exist in category
    const productsCount = await Product.countDocuments({
      $or: [{ category: category._id }, { collectionSlug: category.slug }],
    })

    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. There are ${productsCount} products assigned to it. Please reassign or delete them first, or deactivate the category.`,
      })
    }

    await Category.findByIdAndDelete(category._id)

    res.json({
      success: true,
      message: 'Category deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}
