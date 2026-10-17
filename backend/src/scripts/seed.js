import mongoose from 'mongoose'
import { connectDB } from '../config/database.js'
import { ENV } from '../config/env.js'
import { User } from '../models/User.js'
import { Category } from '../models/Category.js'
import { Product } from '../models/Product.js'
import { Coupon } from '../models/Coupon.js'
import { Setting } from '../models/Setting.js'
import { Order } from '../models/Order.js'

const CDN = 'https://keshkofficial.com/cdn/shop'

const seedCategories = [
  { slug: 'rang-xii', name: 'RANG XII', img: `${CDN}/collections/WhatsApp_Image_2026-07-08_at_11.11.44_AM_17c79acb-f5a2-41f9-b16f-59a089d7aee6.jpg?v=1783516093&width=800`, order: 1 },
  { slug: 'raabta-xi', name: 'RAABTA XI', img: `${CDN}/collections/44C74FD1-436B-4C87-AB56-4336F7E65CC8.jpg?v=1771529226&width=800`, order: 2 },
  { slug: 'chapter-x', name: 'GUZAR X', img: `${CDN}/collections/ABB78B6F-7118-42F2-8298-ABEB64131FE9.jpg?v=1759667019&width=800`, order: 3 },
  { slug: 'nadeedag-ix', name: 'NADEEDAG IX', img: `${CDN}/collections/069807FF-AAB9-4C17-B5F5-5909DDBB6246.jpg?v=1749027986&width=800`, order: 4 },
  { slug: 'aks-e-zindagi', name: 'AKS-E-ZINDAGI VIII', img: `${CDN}/collections/44891037-F489-4151-A955-B8C9CCEF73C8.jpg?v=1740741122&width=800`, order: 5 },
  { slug: 'yaksaan-vii', name: 'YAKSAANI VII', img: `${CDN}/collections/WhatsApp_Image_2024-10-12_at_11.34.42_PM.jpg?v=1728822412&width=800`, order: 6 },
  { slug: 'mehr-e-chiragh-vi', name: 'MEHR-E-CHIRAGH VI', img: `${CDN}/collections/WhatsApp-Image_2024-08-04_at_1.48.44_AM.jpg?v=1722792869&width=800`, order: 7 },
  { slug: 'sangat-v', name: 'SANGAT V', img: `${CDN}/collections/WhatsApp-Image_2024-08-04_at_2.29.06_PM.jpg?v=1722769687&width=800`, order: 8 },
  { slug: 'shohaaz-iv', name: 'SHOHAAZ IV', img: `${CDN}/collections/WhatsApp-Image_2024-08-04_at_2.30.18_PM_2.jpg?v=1722769670&width=800`, order: 9 },
  { slug: 'zarb-o-khayal-iii', name: 'ZARB-O-KHAYAL III', img: `${CDN}/collections/WhatsApp-Image_2024-08-04_at_2.30.18_PM_4.jpg?v=1722769651&width=800`, order: 10 },
  { slug: 'taghayur-ii', name: 'TAGHAYUR II', img: `${CDN}/collections/WhatsApp-Image_2024-08-04_at_2.30.18_PM.jpg?v=1722769631&width=800`, order: 11 },
  { slug: 'raah-chaar', name: 'RAAH CHAAR', img: `${CDN}/collections/FFAE46F2-C9CF-498B-A15A-992F95C3E05D.jpg?v=1754411860&width=800`, order: 12 },
  { slug: 'core-collection', name: 'CORE COLLECTION', img: `${CDN}/collections/FDA091BD-47C1-4510-B9BD-92C1FD4E0BEA.jpg?v=1754390066&width=800`, order: 13 },
]

const seedProducts = [
  {
    slug: 'aks',
    name: 'AKS',
    price: 6000,
    collectionSlug: 'chapter-x',
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/E2B7AED3-3900-4170-8E6D-0A14C8CBCA54.jpg?v=1759669904&width=800'],
    sizes: [{ size: 'S', stock: 5 }, { size: 'M', stock: 8 }, { size: 'L', stock: 6 }, { size: 'XL', stock: 4 }],
    isFeatured: true,
  },
  {
    slug: 'bahar-e-phool-1',
    name: 'BAHAR-E-PHOOL',
    price: 6000,
    collectionSlug: 'aks-e-zindagi',
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/9551896E-3B43-4B65-91EA-D4853D17482A.jpg?v=1740689575&width=800'],
    sizes: [{ size: 'S', stock: 4 }, { size: 'M', stock: 6 }, { size: 'L', stock: 5 }, { size: 'XL', stock: 3 }],
    isFeatured: true,
  },
  {
    slug: 'untitled-feb28-16-40',
    name: 'BASIC T-SHIRT (DARK)',
    price: 4600,
    collectionSlug: 'core-collection',
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/2EC490B0-CBFA-4CF5-941A-0E70D10ACFAB.png?v=1740743351&width=800'],
    sizes: [{ size: 'S', stock: 8 }, { size: 'M', stock: 12 }, { size: 'L', stock: 10 }, { size: 'XL', stock: 6 }],
    isFeatured: true,
  },
  {
    slug: 'basic-t-shirt',
    name: 'BASIC T-SHIRT (LIGHT)',
    price: 4600,
    collectionSlug: 'core-collection',
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/C5E2B1B5-BB49-46DE-9AF8-B377F7E767CF.jpg?v=1740743262&width=800'],
    sizes: [{ size: 'S', stock: 7 }, { size: 'M', stock: 10 }, { size: 'L', stock: 8 }, { size: 'XL', stock: 5 }],
    isFeatured: true,
  },
  {
    slug: 'sabz-daftar',
    name: 'Sabz Daftar (سبز دفتر)',
    price: 5880,
    collectionSlug: 'rang-xii',
    images: [
      'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/67462BDE-0037-42C7-A553-62E9B53476EC.jpg?width=800',
      'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/709CE45F-54EA-4FB0-8AC9-6DE57EAC7AA9.jpg?width=800',
      'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/2BFF8BED-47A3-45BA-8EFB-885D55A08FF4.jpg?width=800',
    ],
    sizes: [{ size: 'S', stock: 10 }, { size: 'M', stock: 15 }, { size: 'L', stock: 12 }, { size: 'XL', stock: 8 }],
    isFeatured: true,
  },
  {
    slug: 'khwahishen',
    name: 'Khwahishen (خواہشیں)',
    price: 6200,
    collectionSlug: 'rang-xii',
    images: [
      'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/0CF45BF3-2977-4D2A-887A-363AAC15A472.jpg?width=800',
      'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/C47353C1-41F0-4CB7-92DC-5D0682C211EA.jpg?width=800',
    ],
    sizes: [{ size: 'S', stock: 8 }, { size: 'M', stock: 12 }, { size: 'L', stock: 10 }, { size: 'XL', stock: 5 }],
    isFeatured: true,
  },
  {
    slug: 'gidan-hoodie',
    name: 'Gidan - Hoodie',
    price: 9480,
    collectionSlug: 'rang-xii',
    images: [
      'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/4DEF2426-9F6A-4CB8-807B-D00C248FB46C.jpg?width=800',
      'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/A6E265AD-4EAC-4D18-A408-19CF4CB1BD41.jpg?width=800',
    ],
    sizes: [{ size: 'S', stock: 6 }, { size: 'M', stock: 10 }, { size: 'L', stock: 8 }, { size: 'XL', stock: 4 }],
    isFeatured: true,
  },
  {
    slug: 'lavkash-t-shirt',
    name: 'Lavkash - T-shirt',
    price: 5680,
    collectionSlug: 'rang-xii',
    images: [
      'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.34.45_PM.jpg?width=800',
      'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.34.46_PM_1.jpg?width=800',
    ],
    sizes: [{ size: 'S', stock: 12 }, { size: 'M', stock: 15 }, { size: 'L', stock: 12 }, { size: 'XL', stock: 6 }],
    isFeatured: true,
  },
  {
    slug: 'doch',
    name: 'DOCH',
    price: 6000,
    collectionSlug: 'rang-xii',
    images: [
      'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/9E0BACA5-3674-481D-8F7D-659B42D30EC6.jpg?width=800',
      'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/DADC9C45-72AD-49B4-82E7-84E7D4977CBE.jpg?width=800',
    ],
    sizes: [{ size: 'S', stock: 5 }, { size: 'M', stock: 8 }, { size: 'L', stock: 6 }, { size: 'XL', stock: 4 }],
    isFeatured: true,
  },
  {
    slug: 'pehle-sa-dil',
    name: 'PEHLE SA DIL',
    price: 11000,
    collectionSlug: 'raabta-xi',
    images: [
      'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/943B30C7-3F8A-48AC-A017-B4E00A311036.jpg?width=800',
      'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/C2943A0F-683D-4CA2-A073-5BA46A880343.jpg?width=800',
    ],
    sizes: [{ size: 'S', stock: 4 }, { size: 'M', stock: 7 }, { size: 'L', stock: 5 }, { size: 'XL', stock: 2 }],
    isFeatured: true,
  },
  {
    slug: 'zeba',
    name: 'ZEBA',
    price: 8880,
    collectionSlug: 'chapter-x',
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/IMG_0398.jpg?width=800'],
    sizes: [{ size: 'S', stock: 3 }, { size: 'M', stock: 6 }, { size: 'L', stock: 4 }, { size: 'XL', stock: 2 }],
    isFeatured: false,
  },
  {
    slug: 'good-life-tshirts',
    name: 'GOOD LIFE',
    price: 5480,
    collectionSlug: 'core-collection',
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsAppImage2024-06-12at4.24.30PM.jpg?width=800'],
    sizes: [{ size: 'S', stock: 10 }, { size: 'M', stock: 14 }, { size: 'L', stock: 10 }, { size: 'XL', stock: 6 }],
    isFeatured: false,
  },
]

export const seedDatabase = async ({ exitOnComplete = true } = {}) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB()
    }
    console.log('[Seed] Seeding database...')

    // 1. Store settings
    await Setting.findOneAndUpdate(
      {},
      {
        storeName: 'Keshk',
        brandNameUrdu: 'مِقْرَاض',
        tagline: 'Unisex fashion with traditional and street fusion. EST. in Lyari',
        contactEmail: 'support@keshk.com',
        contactPhone: '+92 300 1234567',
        currencySymbol: 'Rs.',
        currencyCode: 'PKR',
        standardShippingFee: 250,
        freeShippingThreshold: 8000,
        taxRatePercent: 0,
        codEnabled: true,
        address: 'Lyari, Karachi, Pakistan',
        announcementText: 'A LANGUAGE BEYOND FABRIC — SOME STORIES ARE WRITTEN IN INK, OTHERS ARE WORN.',
      },
      { upsert: true, new: true }
    )
    console.log('[Seed] Settings configured.')

    // 2. Admin account
    let admin = await User.findOne({ email: ENV.ADMIN_EMAIL })
    if (!admin) {
      admin = await User.create({
        name: ENV.ADMIN_NAME,
        email: ENV.ADMIN_EMAIL,
        password: ENV.ADMIN_PASSWORD,
        role: 'admin',
        phone: '+92 300 0000000',
      })
      console.log(`[Seed] Created initial Admin: ${ENV.ADMIN_EMAIL} (Password: ${ENV.ADMIN_PASSWORD})`)
    } else {
      console.log(`[Seed] Admin already exists: ${ENV.ADMIN_EMAIL}`)
    }

    // 3. Test customer account
    const testCustomerEmail = 'customer@example.com'
    let customer = await User.findOne({ email: testCustomerEmail })
    if (!customer) {
      customer = await User.create({
        name: 'Usaid Khan',
        email: testCustomerEmail,
        password: 'CustomerPassword123!',
        role: 'user',
        phone: '+92 321 9876543',
        addresses: [
          {
            fullName: 'Usaid Khan',
            phone: '+92 321 9876543',
            address: 'House 14, Street 7, Block B, Clifton',
            city: 'Karachi',
            state: 'Sindh',
            postalCode: '75600',
            country: 'Pakistan',
            isDefault: true,
          },
        ],
      })
      console.log(`[Seed] Created test customer: ${testCustomerEmail} (Password: CustomerPassword123!)`)
    }

    // 4. Categories
    const categoryDocs = {}
    for (const cat of seedCategories) {
      let doc = await Category.findOne({ slug: cat.slug })
      if (!doc) {
        doc = await Category.create({
          name: cat.name,
          slug: cat.slug,
          image: cat.img,
          order: cat.order,
          isActive: true,
        })
      }
      categoryDocs[cat.slug] = doc
    }
    console.log(`[Seed] ${seedCategories.length} categories verified.`)

    // 5. Products
    for (const prod of seedProducts) {
      const existing = await Product.findOne({ slug: prod.slug })
      const catDoc = categoryDocs[prod.collectionSlug]
      const totalStock = prod.sizes.reduce((acc, curr) => acc + curr.stock, 0)

      if (!existing) {
        await Product.create({
          name: prod.name,
          slug: prod.slug,
          price: prod.price,
          category: catDoc ? catDoc._id : null,
          collectionSlug: prod.collectionSlug,
          images: prod.images,
          sizes: prod.sizes,
          totalStock,
          sku: `MK-${Math.floor(100000 + Math.random() * 900000)}`,
          isFeatured: prod.isFeatured,
          isPublished: true,
        })
      }
    }
    console.log(`[Seed] Products seeded and stock assigned.`)

    // 6. Coupons
    const seedCoupons = [
      {
        code: 'FIRST10',
        description: '10% discount for first-time customers',
        discountType: 'percentage',
        discountValue: 10,
        minOrderValue: 3000,
        maxDiscount: 1500,
        isFirstOrderOnly: true,
        isActive: true,
      },
      {
        code: 'KESHK500',
        description: 'Flat Rs. 500 off on orders over Rs. 5,000',
        discountType: 'fixed',
        discountValue: 500,
        minOrderValue: 5000,
        isFirstOrderOnly: false,
        isActive: true,
      },
      {
        code: 'RANG15',
        description: '15% off season collection',
        discountType: 'percentage',
        discountValue: 15,
        minOrderValue: 7000,
        maxDiscount: 2000,
        isFirstOrderOnly: false,
        isActive: true,
      },
    ]

    for (const c of seedCoupons) {
      const exists = await Coupon.findOne({ code: c.code })
      if (!exists) {
        await Coupon.create(c)
      }
    }
    console.log(`[Seed] Coupons (including FIRST-ORDER-ONLY coupon) seeded.`)

    console.log('[Seed] Database seeding completed successfully!')
    if (exitOnComplete) {
      process.exit(0)
    }
  } catch (error) {
    console.error(`[Seed] Error: ${error.message}`)
    if (exitOnComplete) {
      process.exit(1)
    }
    throw error
  }
}

if (process.argv[1] && (process.argv[1].endsWith('seed.js') || process.argv[1].includes('seed'))) {
  seedDatabase({ exitOnComplete: true })
}
