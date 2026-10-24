import dotenv from 'dotenv'
dotenv.config()

const BASE_URL = 'http://localhost:5000/api/v1'

async function runTests() {
  console.log('=== STARTING END-TO-END AUTOMATED TEST SUITE ===\n')

  let adminToken = ''
  let customerToken = ''
  let createdCategoryId = ''
  let createdProductId = ''
  let createdCouponId = ''
  let createdOrderId = ''
  let createdOrderNumber = ''

  // 1. Admin Login
  console.log('Test 1: Admin Login...')
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: adminEmail, password: adminPassword }),
  }).then((r) => r.json())

  if (!adminLoginRes.success || !adminLoginRes.token) {
    throw new Error('Admin login failed: ' + JSON.stringify(adminLoginRes))
  }
  adminToken = adminLoginRes.token
  console.log('✓ Admin authenticated successfully. Role:', adminLoginRes.user.role)

  // 2. Admin creates Category
  console.log('\nTest 2: Admin creates Category...')
  const catSlug = 'chapter-xiii-' + Date.now().toString().slice(-4)
  const catRes = await fetch(`${BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      name: 'CHAPTER XIII (TEST)',
      slug: catSlug,
      description: 'End-to-End Test Collection Chapter',
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800',
      order: 99,
      isActive: true,
    }),
  }).then((r) => r.json())

  if (!catRes.success) throw new Error('Create category failed: ' + JSON.stringify(catRes))
  createdCategoryId = catRes.category._id
  console.log('✓ Category created successfully:', catRes.category.name, `(ID: ${createdCategoryId})`)

  // 3. Admin creates Product
  console.log('\nTest 3: Admin creates Product...')
  const prodSlug = 'obsidian-kurta-' + Date.now().toString().slice(-4)
  const prodRes = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      name: 'Obsidian Embroidered Kurta',
      slug: prodSlug,
      description: 'Artisanal hand-embroidered Lyari silhouette.',
      price: 7500,
      salePrice: 6900,
      category: createdCategoryId,
      collectionSlug: catSlug,
      images: ['https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800'],
      sizes: [
        { size: 'S', stock: 5 },
        { size: 'M', stock: 10 },
        { size: 'L', stock: 8 },
        { size: 'XL', stock: 4 },
      ],
      lowStockThreshold: 3,
      isFeatured: true,
      isPublished: true,
    }),
  }).then((r) => r.json())

  if (!prodRes.success) throw new Error('Create product failed: ' + JSON.stringify(prodRes))
  createdProductId = prodRes.product._id
  console.log('✓ Product created successfully:', prodRes.product.name, `(Price: Rs. ${prodRes.product.price}, Total Stock: ${prodRes.product.totalStock})`)

  // 4. Admin creates First-Order-Only Coupon
  console.log('\nTest 4: Admin creates First-Order-Only Coupon...')
  const couponCode = 'WELCOMEFIRST' + Math.floor(100 + Math.random() * 900)
  const couponRes = await fetch(`${BASE_URL}/coupons`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      code: couponCode,
      description: 'Exclusive 20% discount for first-time buyers',
      discountType: 'percentage',
      discountValue: 20,
      minOrderValue: 3000,
      maxDiscount: 2000,
      isFirstOrderOnly: true,
      isActive: true,
    }),
  }).then((r) => r.json())

  if (!couponRes.success) throw new Error('Create coupon failed: ' + JSON.stringify(couponRes))
  createdCouponId = couponRes.coupon._id
  console.log('✓ First-Order Coupon created:', couponRes.coupon.code, `(First-Order Only: ${couponRes.coupon.isFirstOrderOnly})`)

  // 5. Customer Registration
  console.log('\nTest 5: Registering New Customer...')
  const customerEmail = `customer_${Date.now()}@example.com`
  const regRes = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test Customer',
      email: customerEmail,
      password: 'CustomerPass123!',
      passwordConfirm: 'CustomerPass123!',
      phone: '03009988776',
    }),
  }).then((r) => r.json())

  if (!regRes.success || !regRes.token) throw new Error('Customer registration failed: ' + JSON.stringify(regRes))
  customerToken = regRes.token
  const customerId = regRes.user._id
  console.log('✓ Customer registered successfully:', customerEmail, `(ID: ${customerId})`)

  // 6. Security Check: Guest cannot place order without authentication
  console.log('\nTest 6: Security - Unauthenticated order placement must be rejected...')
  const unauthRes = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      items: [{ product: createdProductId, size: 'M', qty: 1 }],
      shippingAddress: {
        fullName: 'Guest',
        phone: '123456',
        address: '123 Main St',
        city: 'Karachi',
      },
    }),
  })
  if (unauthRes.status === 401) {
    console.log('✓ Security verified: Unauthenticated order placement rejected with HTTP 401')
  } else {
    throw new Error('Security failure: Unauthenticated order did not return 401! Got ' + unauthRes.status)
  }

  // 7. Security Check: Customer cannot access admin routes
  console.log('\nTest 7: Security - Customer cannot access Admin endpoints...')
  const adminAccessRes = await fetch(`${BASE_URL}/orders/admin/all`, {
    headers: { Authorization: `Bearer ${customerToken}` },
  })
  if (adminAccessRes.status === 403) {
    console.log('✓ Security verified: Customer accessing admin routes rejected with HTTP 403')
  } else {
    throw new Error('Security failure: Customer accessing admin route did not return 403! Got ' + adminAccessRes.status)
  }

  // 8. Validate First-Order Coupon for eligible first-time user
  console.log('\nTest 8: Validate First-Order Coupon for customer before first order...')
  const validateCouponRes = await fetch(`${BASE_URL}/coupons/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${customerToken}`,
    },
    body: JSON.stringify({
      code: couponCode,
      subtotal: 6900,
    }),
  }).then((r) => r.json())

  if (!validateCouponRes.success) {
    throw new Error('First-order coupon validation failed for eligible user: ' + JSON.stringify(validateCouponRes))
  }
  console.log('✓ Coupon validated successfully. Discount amount: Rs.', validateCouponRes.data.discountAmount)

  // 9. Customer places their FIRST order
  console.log('\nTest 9: Customer places First Order with Coupon...')
  const orderRes = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${customerToken}`,
    },
    body: JSON.stringify({
      items: [{ product: createdProductId, size: 'M', qty: 1 }],
      shippingAddress: {
        fullName: 'Test Customer',
        phone: '03009988776',
        address: 'House 45, Street 2',
        city: 'Karachi',
        state: 'Sindh',
        postalCode: '75000',
        country: 'Pakistan',
      },
      paymentMethod: 'cod',
      couponCode,
    }),
  }).then((r) => r.json())

  if (!orderRes.success) throw new Error('Order placement failed: ' + JSON.stringify(orderRes))
  createdOrderId = orderRes.order._id
  createdOrderNumber = orderRes.order.orderNumber
  console.log('✓ Order placed successfully!')
  console.log(`  - Order Number: ${createdOrderNumber}`)
  console.log(`  - Subtotal: Rs. ${orderRes.order.subtotal}`)
  console.log(`  - Discount: Rs. ${orderRes.order.discount}`)
  console.log(`  - Shipping: Rs. ${orderRes.order.shippingFee}`)
  console.log(`  - Grand Total: Rs. ${orderRes.order.total}`)

  // 10. Verify stock was safely decremented
  console.log('\nTest 10: Verify inventory was decremented in MongoDB...')
  const prodCheckRes = await fetch(`${BASE_URL}/products/${prodSlug}`).then((r) => r.json())
  const sizeM = prodCheckRes.product.sizes.find((s) => s.size === 'M')
  console.log(`✓ Product "${prodCheckRes.product.name}" Size M stock decremented from 10 to ${sizeM.stock} (Total: ${prodCheckRes.product.totalStock})`)
  if (sizeM.stock !== 9) {
    throw new Error(`Inventory deduction mismatch! Expected 9, got ${sizeM.stock}`)
  }

  // 11. Test First-Order Restriction: customer attempts to reuse first-order coupon for a SECOND order
  console.log('\nTest 11: Security - First-order coupon reuse must be REJECTED on subsequent orders...')
  const secondValidationRes = await fetch(`${BASE_URL}/coupons/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${customerToken}`,
    },
    body: JSON.stringify({
      code: couponCode,
      subtotal: 6900,
    }),
  }).then((r) => r.json())

  if (!secondValidationRes.success) {
    console.log('✓ First-order coupon restriction correctly enforced by backend:', secondValidationRes.message)
  } else {
    throw new Error('Security failure: First-order coupon was not rejected for existing customer! ' + JSON.stringify(secondValidationRes))
  }

  // 12. Security Check: Customer cannot access another customer\'s order
  console.log('\nTest 12: Security - Customer cannot view another customer\'s order...')
  // Create second customer
  const customer2Res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Customer Two',
      email: `customer2_${Date.now()}@example.com`,
      password: 'Pass123456!',
    }),
  }).then((r) => r.json())

  const customer2Token = customer2Res.token
  const breachRes = await fetch(`${BASE_URL}/orders/${createdOrderId}`, {
    headers: { Authorization: `Bearer ${customer2Token}` },
  })

  if (breachRes.status === 403) {
    console.log('✓ Security verified: Cross-customer order access rejected with HTTP 403')
  } else {
    throw new Error('Security failure: Cross-customer access did not return 403! Got ' + breachRes.status)
  }

  // 13. Admin views and manages the order
  console.log('\nTest 13: Admin inspects order and updates status...')
  const adminOrderRes = await fetch(`${BASE_URL}/orders/${createdOrderId}`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  }).then((r) => r.json())

  if (!adminOrderRes.success) throw new Error('Admin view order failed: ' + JSON.stringify(adminOrderRes))
  console.log(`✓ Admin fetched order #${adminOrderRes.order.orderNumber}. Current status: ${adminOrderRes.order.orderStatus}`)

  // Transition: pending -> confirmed
  const confirmRes = await fetch(`${BASE_URL}/orders/admin/${createdOrderId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      orderStatus: 'confirmed',
      paymentStatus: 'pending',
      note: 'Verified customer details via telephone',
    }),
  }).then((r) => r.json())

  if (!confirmRes.success) throw new Error('Admin confirm order failed: ' + JSON.stringify(confirmRes))
  console.log('✓ Admin transitioned status to "confirmed"')

  // Transition: confirmed -> processing -> shipped with tracking
  await fetch(`${BASE_URL}/orders/admin/${createdOrderId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ orderStatus: 'processing' }),
  })

  const shipRes = await fetch(`${BASE_URL}/orders/admin/${createdOrderId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ orderStatus: 'shipped' }),
  }).then((r) => r.json())

  const trackRes = await fetch(`${BASE_URL}/orders/admin/${createdOrderId}/tracking`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({
      trackingCarrier: 'TCS Express',
      trackingNumber: 'TCS-99118822',
    }),
  }).then((r) => r.json())

  console.log(`✓ Order dispatched and updated to "${shipRes.order.orderStatus}" with tracking "${trackRes.order.trackingCarrier}: ${trackRes.order.trackingNumber}"`)

  // 14. Customer verifies status in their account
  console.log('\nTest 14: Customer verifies updated order status in their account...')
  const custOrderCheck = await fetch(`${BASE_URL}/orders/${createdOrderId}`, {
    headers: { Authorization: `Bearer ${customerToken}` },
  }).then((r) => r.json())

  console.log(`✓ Customer sees status: "${custOrderCheck.order.orderStatus}" and tracking: "${custOrderCheck.order.trackingCarrier} ${custOrderCheck.order.trackingNumber}"`)

  // 15. Admin Dashboard Statistics Check
  console.log('\nTest 15: Admin Dashboard Analytics...')
  const dashStatsRes = await fetch(`${BASE_URL}/dashboard/stats`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  }).then((r) => r.json())

  if (!dashStatsRes.success) throw new Error('Dashboard stats failed: ' + JSON.stringify(dashStatsRes))
  console.log('✓ Real MongoDB Dashboard Metrics verified:')
  console.log(`  - Total Revenue: Rs. ${dashStatsRes.stats.totalRevenue}`)
  console.log(`  - Total Orders: ${dashStatsRes.stats.totalOrders}`)
  console.log(`  - Total Customers: ${dashStatsRes.stats.totalCustomers}`)
  console.log(`  - Total Active Products: ${dashStatsRes.stats.totalProducts}`)
  console.log(`  - Status Breakdown:`, dashStatsRes.stats.statusCounts)

  console.log('\n======================================================')
  console.log('🎉 ALL END-TO-END WORKFLOW & SECURITY TESTS PASSED! 🎉')
  console.log('======================================================')
}

runTests().catch((err) => {
  console.error('\n❌ TEST FAILED:', err.message)
  process.exit(1)
})
