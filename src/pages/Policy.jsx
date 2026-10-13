import { useParams, Link } from 'react-router-dom'

const POLICIES = {
  'privacy-policy': {
    title: 'Privacy Policy',
    content: (
      <>
        <p>At Keshk, we respect and prioritize your privacy. This policy explains how we collect, store, and protect your personal information.</p>
        <h3>Information We Collect</h3>
        <p>When you place an order, create an account, or browse our website, we collect your name, email address, shipping address, contact phone number, and order history.</p>
        <h3>How We Use Your Data</h3>
        <p>Your data is used solely to process your orders, arrange delivery, provide customer support, and inform you of order updates. We do not sell or rent your personal data to third parties.</p>
        <h3>Security</h3>
        <p>All passwords are encrypted with bcrypt. Sessions and checkout requests are protected with standard encryption protocols.</p>
      </>
    ),
  },
  'terms-of-service': {
    title: 'Terms of Service',
    content: (
      <>
        <p>Welcome to Keshk. By visiting our site and purchasing our handcrafted products, you engage in our service and agree to be bound by the following terms.</p>
        <h3>Pricing &amp; Availability</h3>
        <p>All prices are listed in Pakistani Rupees (PKR). Products and pricing are subject to change without notice. We reserve the right to limit the sales of our products to any person or geographic region.</p>
        <h3>Accuracy of Information</h3>
        <p>We make every effort to display the colors, fabrics, and designs of our apparel accurately. However, slight natural variations may occur due to photography and handcrafted artisan processes.</p>
      </>
    ),
  },
  'shipping-policy': {
    title: 'Shipping Policy',
    content: (
      <>
        <p>We deliver nationwide across Pakistan via trusted courier partners.</p>
        <h3>Delivery Timelines</h3>
        <p>Orders are dispatched within 2-3 business days. Delivery typically takes 3-5 business days depending on your city.</p>
        <h3>Shipping Charges</h3>
        <p>Standard shipping fee is Rs. 250 across Pakistan. Orders with a subtotal of Rs. 8,000 or above qualify for <strong>FREE SHIPPING</strong>.</p>
        <h3>Order Tracking</h3>
        <p>Once your order is shipped, you will receive a tracking reference number in your account dashboard to track your package in real time.</p>
      </>
    ),
  },
  'return-exchange-policy': {
    title: 'Return & Exchange Policy',
    content: (
      <>
        <p>We take pride in the craftsmanship of every garment. If you are not completely satisfied with your purchase, we are here to help.</p>
        <h3>Eligibility</h3>
        <p>Items may be exchanged within 7 days of delivery, provided they are unwashed, unworn, and have all original tags intact.</p>
        <h3>Damaged or Defective Items</h3>
        <p>If you receive a defective or damaged product, contact our support team within 48 hours of delivery and we will arrange a replacement promptly.</p>
      </>
    ),
  },
}

export function Policy() {
  const { slug } = useParams()
  const policy = POLICIES[slug]

  if (!policy) {
    const formattedTitle = (slug || '')
      .replace(/-/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())

    return (
      <section className="section narrow">
        <h1 className="page-title">{formattedTitle || 'Store Policy'}</h1>
        <p className="muted center">
          Please contact our team via the{' '}
          <Link to="/pages/contact" style={{ textDecoration: 'underline' }}>
            Contact Page
          </Link>{' '}
          for additional questions regarding this policy.
        </p>
      </section>
    )
  }

  return (
    <section className="section narrow policy-page">
      <h1 className="page-title">{policy.title}</h1>
      <div className="policy-content">{policy.content}</div>
    </section>
  )
}
