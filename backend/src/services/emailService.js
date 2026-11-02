import nodemailer from 'nodemailer'
import { ENV } from '../config/env.js'

let transporter = null

export const getTransporter = () => {
  if (!transporter && ENV.SMTP_USER && ENV.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: ENV.SMTP_HOST || 'smtp.gmail.com',
      port: Number(ENV.SMTP_PORT) || 465,
      secure: Boolean(ENV.SMTP_SECURE),
      auth: {
        user: ENV.SMTP_USER,
        pass: ENV.SMTP_PASS,
      },
    })
  }
  return transporter
}

export const sendMail = async ({ to, subject, html, text }) => {
  try {
    const transport = getTransporter()
    if (!transport) {
      console.warn('[EmailService] SMTP not configured. Skipping email dispatch.')
      return { success: false, message: 'SMTP not configured' }
    }

    const info = await transport.sendMail({
      from: ENV.EMAIL_FROM || `Miqraaz <${ENV.SMTP_USER}>`,
      to,
      subject,
      text: text || subject,
      html,
    })

    console.log(`[EmailService] Email sent successfully to ${to}. MessageId: ${info.messageId}`)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error(`[EmailService] Failed to send email to ${to}: ${error.message}`)
    return { success: false, error: error.message }
  }
}

// Reusable Luxury Brand Email Shell
const renderEmailShell = ({ title, preheader = '', content }) => {
  const clientUrl = ENV.CLIENT_URL || 'https://miqraaz.vercel.app'
  const instagramUrl = 'https://www.instagram.com/miqraaz.official?srtk=aDJ3NDk5c3cwZXVr'
  const facebookUrl = 'https://www.facebook.com/share/1F8Kgzwh3S/'
  const whatsappUrl = 'https://wa.me/923397837586'
  const supportPhone = '0339 7837586'

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td, p, a { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #18181b;">
  ${preheader ? `<div style="display: none; max-height: 0px; overflow: hidden; mso-hide: all;">${preheader}</div>` : ''}

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f5; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.05); border: 1px solid #e4e4e7;">
          
          <!-- Brand Header -->
          <tr>
            <td align="center" style="background-color: #09090b; padding: 32px 24px 28px; border-bottom: 2px solid #27272a;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #ffffff; font-family: 'Times New Roman', Times, serif;">مِقْرَاض</h1>
                    <div style="font-size: 11px; letter-spacing: 0.32em; text-transform: uppercase; color: #a1a1aa; margin-top: 6px; font-weight: 600;">MIQRAAZ • EST. IN LYARI</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Dynamic Content Body -->
          <tr>
            <td style="padding: 36px 32px 32px;">
              ${content}
            </td>
          </tr>

          <!-- Brand Perks Bar -->
          <tr>
            <td style="background-color: #fafafa; border-top: 1px solid #f0f0f2; padding: 20px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="font-size: 11px; color: #71717a; letter-spacing: 0.06em; text-transform: uppercase; font-weight: 600;">
                    Artisanal Silhouettes &bull; Street Fusion &bull; Handcrafted in Karachi
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td style="background-color: #09090b; padding: 32px 24px 28px; color: #a1a1aa; text-align: center;">
              
              <!-- Social Links -->
              <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin-bottom: 20px;">
                <tr>
                  <td style="padding: 0 10px;">
                    <a href="${instagramUrl}" target="_blank" style="color: #ffffff; text-decoration: none; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600;">Instagram ↗</a>
                  </td>
                  <td style="color: #52525b;">&bull;</td>
                  <td style="padding: 0 10px;">
                    <a href="${facebookUrl}" target="_blank" style="color: #ffffff; text-decoration: none; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600;">Facebook ↗</a>
                  </td>
                  <td style="color: #52525b;">&bull;</td>
                  <td style="padding: 0 10px;">
                    <a href="${whatsappUrl}" target="_blank" style="color: #25d366; text-decoration: none; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600;">WhatsApp Support</a>
                  </td>
                </tr>
              </table>

              <!-- Customer Care -->
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #d4d4d8;">
                Need help or have questions? WhatsApp us at <a href="${whatsappUrl}" style="color: #25d366; text-decoration: none; font-weight: 600;">${supportPhone}</a>
              </p>
              <p style="margin: 0 0 18px 0; font-size: 12px; color: #71717a;">
                Or email <a href="mailto:miqraaz.official@gmail.com" style="color: #e4e4e7; text-decoration: underline;">miqraaz.official@gmail.com</a>
              </p>

              <!-- Copyright -->
              <p style="margin: 0; font-size: 11px; color: #52525b; letter-spacing: 0.04em;">
                &copy; ${new Date().getFullYear()} MIQRAAZ. All rights reserved.<br>
                Lyari, Karachi, Pakistan.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}

// 1. WELCOME EMAIL (On Registration)
export const sendWelcomeEmail = async (user) => {
  const customerName = user.name || 'Friend'
  const customerEmail = user.email
  const clientUrl = ENV.CLIENT_URL || 'https://miqraaz.vercel.app'
  const shopUrl = `${clientUrl}/collections/all`

  const subject = `Welcome to Miqraaz — Artisanal Silhouettes & Street Fusion`
  const preheader = `Assalam-o-Alaikum ${customerName}, welcome to Miqraaz. Enjoy 10% off with code WELCOME10.`

  const content = `
    <!-- Welcome Header -->
    <div style="text-align: center; margin-bottom: 28px;">
      <span style="display: inline-block; background-color: #f4f4f5; color: #18181b; font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; padding: 6px 14px; border-radius: 20px; border: 1px solid #e4e4e7;">
        WELCOME TO THE CIRCLE
      </span>
      <h2 style="font-size: 24px; font-weight: 700; color: #09090b; margin: 16px 0 8px; letter-spacing: -0.02em;">
        Assalam-o-Alaikum, ${customerName}!
      </h2>
      <p style="font-size: 15px; color: #52525b; line-height: 1.6; margin: 0 auto; max-width: 480px;">
        Thank you for creating an account with <strong>Miqraaz</strong>. You have entered a space where authentic Lyari craftsmanship merges with modern street silhouettes.
      </p>
    </div>

    <!-- Welcome Gift / Coupon Privilege Box -->
    <div style="background: linear-gradient(135deg, #09090b 0%, #18181b 100%); color: #ffffff; padding: 26px 22px; border-radius: 8px; text-align: center; margin: 28px 0; border: 1px solid #27272a;">
      <div style="font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #fbbf24; font-weight: 700; margin-bottom: 6px;">
        INCEPTION PRIVILEGE
      </div>
      <div style="font-size: 18px; font-weight: 700; margin-bottom: 8px; letter-spacing: 0.02em;">
        Enjoy 10% Off Your First Order
      </div>
      <p style="font-size: 13px; color: #d4d4d8; margin: 0 0 16px 0; line-height: 1.5;">
        Apply this promotional voucher at checkout to claim your inaugural discount:
      </p>
      <div style="display: inline-block; background-color: #ffffff; color: #09090b; padding: 10px 22px; font-size: 18px; font-weight: 800; font-family: monospace; letter-spacing: 0.18em; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.2);">
        WELCOME10
      </div>
    </div>

    <!-- Shop Now CTA Button -->
    <div style="text-align: center; margin: 32px 0 28px;">
      <a href="${shopUrl}" target="_blank" style="display: inline-block; background-color: #09090b; color: #ffffff; text-decoration: none; padding: 16px 36px; font-size: 13px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; border-radius: 6px; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);">
        Explore New Arrivals ➔
      </a>
    </div>

    <!-- 3 Pillars Grid -->
    <div style="border-top: 1px solid #f4f4f5; padding-top: 24px; margin-top: 24px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="33%" style="padding: 10px; text-align: center; vertical-align: top;">
            <div style="font-size: 20px; margin-bottom: 6px;">🧵</div>
            <div style="font-size: 12px; font-weight: 700; color: #09090b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Artisanal Cuts</div>
            <div style="font-size: 11px; color: #71717a; line-height: 1.4;">Tailored in Lyari with premium fabrics.</div>
          </td>
          <td width="33%" style="padding: 10px; text-align: center; vertical-align: top;">
            <div style="font-size: 20px; margin-bottom: 6px;">🚚</div>
            <div style="font-size: 12px; font-weight: 700; color: #09090b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">Nationwide</div>
            <div style="font-size: 11px; color: #71717a; line-height: 1.4;">Swift delivery across all cities of Pakistan.</div>
          </td>
          <td width="33%" style="padding: 10px; text-align: center; vertical-align: top;">
            <div style="font-size: 20px; margin-bottom: 6px;">💬</div>
            <div style="font-size: 12px; font-weight: 700; color: #09090b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">WhatsApp Help</div>
            <div style="font-size: 11px; color: #71717a; line-height: 1.4;">Direct concierge support on 0339 7837586.</div>
          </td>
        </tr>
      </table>
    </div>
  `

  const html = renderEmailShell({
    title: subject,
    preheader,
    content,
  })

  return sendMail({
    to: customerEmail,
    subject,
    html,
    text: `Assalam-o-Alaikum ${customerName}! Welcome to Miqraaz. Use coupon code WELCOME10 for 10% off your first order: ${shopUrl}`,
  })
}

// 2. ORDER CONFIRMATION EMAIL (On Order Placed)
export const sendOrderConfirmationEmail = async (order, toEmail, customerName = 'Customer') => {
  const clientUrl = ENV.CLIENT_URL || 'https://miqraaz.vercel.app'
  const accountUrl = `${clientUrl}/account`
  const orderNumber = order.orderNumber || 'MK-ORDER'
  const orderDate = new Date(order.createdAt || Date.now()).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  const subject = `Order Confirmed #${orderNumber} — Miqraaz`
  const preheader = `Thank you ${customerName}! We have received your order #${orderNumber} (Rs. ${(order.total || 0).toLocaleString()}).`

  // Build items rows
  const itemsHtml = (order.items || [])
    .map((item) => {
      const itemTotal = (Number(item.price) || 0) * (Number(item.qty) || 1)
      const imageUrl = item.image
        ? item.image.startsWith('http')
          ? item.image
          : `${clientUrl}${item.image}`
        : ''

      return `
        <tr>
          <td style="padding: 14px 0; border-bottom: 1px solid #f0f0f2; vertical-align: top;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                ${
                  imageUrl
                    ? `<td width="58" style="vertical-align: top; padding-right: 14px;">
                        <img src="${imageUrl}" alt="${item.name}" width="54" height="68" style="object-fit: cover; border-radius: 4px; border: 1px solid #e4e4e7; display: block;" onerror="this.style.display='none'" />
                      </td>`
                    : ''
                }
                <td style="vertical-align: top;">
                  <div style="font-size: 14px; font-weight: 700; color: #09090b; margin-bottom: 4px;">
                    ${item.name || 'Miqraaz Article'}
                  </div>
                  <div style="font-size: 12px; color: #71717a; margin-bottom: 2px;">
                    <span style="display: inline-block; background: #f4f4f5; padding: 2px 7px; border-radius: 3px; font-weight: 600; color: #18181b;">Size: ${item.size || 'Standard'}</span>
                    &bull; Qty: <strong>${item.qty}</strong>
                  </div>
                  <div style="font-size: 12px; color: #71717a;">
                    Unit: Rs. ${(Number(item.price) || 0).toLocaleString()}
                  </div>
                </td>
                <td align="right" style="vertical-align: top; font-size: 14px; font-weight: 700; color: #09090b; white-space: nowrap;">
                  Rs. ${itemTotal.toLocaleString()}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `
    })
    .join('')

  const shippingAddr = order.shippingAddress || {}
  const paymentMethodLabel = order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : order.paymentMethod?.toUpperCase() || 'COD'

  const content = `
    <!-- Order Banner -->
    <div style="text-align: center; margin-bottom: 28px;">
      <span style="display: inline-block; background-color: #ecfdf5; color: #059669; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; padding: 6px 14px; border-radius: 20px; border: 1px solid #a7f3d0;">
        &#10003; ORDER CONFIRMED
      </span>
      <h2 style="font-size: 24px; font-weight: 700; color: #09090b; margin: 14px 0 6px; letter-spacing: -0.02em;">
        Thank You For Your Order!
      </h2>
      <p style="font-size: 14px; color: #52525b; margin: 0; line-height: 1.5;">
        Assalam-o-Alaikum <strong>${customerName}</strong>, we have received your order and our workshop is carefully preparing it for dispatch.
      </p>
    </div>

    <!-- Order Overview Card -->
    <div style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 8px; padding: 18px 20px; margin-bottom: 28px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="50%" style="vertical-align: top; padding-right: 10px;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #71717a; font-weight: 600; margin-bottom: 4px;">Order Number</div>
            <div style="font-size: 15px; font-weight: 700; color: #09090b; font-family: monospace;">#${orderNumber}</div>
            <div style="font-size: 12px; color: #71717a; margin-top: 4px;">Placed on: ${orderDate}</div>
          </td>
          <td width="50%" style="vertical-align: top; padding-left: 10px; border-left: 1px solid #e4e4e7;">
            <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #71717a; font-weight: 600; margin-bottom: 4px;">Payment Method</div>
            <div style="font-size: 14px; font-weight: 700; color: #09090b;">${paymentMethodLabel}</div>
            <div style="font-size: 12px; color: #059669; margin-top: 4px; font-weight: 600;">Status: Pending Dispatch</div>
          </td>
        </tr>
      </table>
    </div>

    <!-- Shipping Address Summary -->
    <div style="background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 8px; padding: 16px 20px; margin-bottom: 28px;">
      <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #71717a; font-weight: 600; margin-bottom: 6px;">
        Shipping Destination
      </div>
      <div style="font-size: 14px; font-weight: 700; color: #09090b; margin-bottom: 4px;">
        ${shippingAddr.fullName || customerName}
      </div>
      <div style="font-size: 13px; color: #52525b; line-height: 1.5;">
        ${shippingAddr.address || ''}<br>
        ${shippingAddr.city || ''} ${shippingAddr.postalCode ? '- ' + shippingAddr.postalCode : ''}, ${shippingAddr.country || 'Pakistan'}<br>
        <strong>Phone:</strong> ${shippingAddr.phone || '—'}
      </div>
    </div>

    <!-- Items List -->
    <div style="margin-bottom: 28px;">
      <div style="font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #09090b; padding-bottom: 10px; border-bottom: 2px solid #09090b;">
        Ordered Items
      </div>
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        ${itemsHtml}
      </table>
    </div>

    <!-- Financial Totals -->
    <div style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 8px; padding: 18px 20px; margin-bottom: 28px;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="font-size: 13px; color: #71717a; padding: 4px 0;">Subtotal</td>
          <td align="right" style="font-size: 13px; color: #09090b; font-weight: 600; padding: 4px 0;">
            Rs. ${(order.subtotal || 0).toLocaleString()}
          </td>
        </tr>
        ${
          order.discount > 0
            ? `<tr>
                <td style="font-size: 13px; color: #059669; padding: 4px 0;">Promotional Discount</td>
                <td align="right" style="font-size: 13px; color: #059669; font-weight: 700; padding: 4px 0;">
                  -Rs. ${order.discount.toLocaleString()}
                </td>
              </tr>`
            : ''
        }
        <tr>
          <td style="font-size: 13px; color: #71717a; padding: 4px 0;">Shipping Fee</td>
          <td align="right" style="font-size: 13px; color: #09090b; font-weight: 600; padding: 4px 0;">
            ${order.shippingFee === 0 ? '<span style="color: #059669;">FREE</span>' : 'Rs. ' + order.shippingFee}
          </td>
        </tr>
        <tr>
          <td style="border-top: 1px solid #e4e4e7; padding-top: 12px; margin-top: 8px; font-size: 15px; font-weight: 800; color: #09090b; text-transform: uppercase; letter-spacing: 0.04em;">
            Grand Total
          </td>
          <td align="right" style="border-top: 1px solid #e4e4e7; padding-top: 12px; margin-top: 8px; font-size: 18px; font-weight: 800; color: #09090b;">
            Rs. ${(order.total || 0).toLocaleString()}
          </td>
        </tr>
      </table>
    </div>

    <!-- Track Order Action Button -->
    <div style="text-align: center; margin: 32px 0 20px;">
      <a href="${accountUrl}" target="_blank" style="display: inline-block; background-color: #09090b; color: #ffffff; text-decoration: none; padding: 15px 36px; font-size: 13px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; border-radius: 6px; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);">
        Track Your Order ➔
      </a>
    </div>

    <div style="text-align: center; font-size: 12px; color: #71717a; line-height: 1.5;">
      Estimated delivery time is <strong>3 to 5 business days</strong>.<br>
      You will receive a call / SMS from the courier prior to delivery.
    </div>
  `

  const html = renderEmailShell({
    title: subject,
    preheader,
    content,
  })

  return sendMail({
    to: toEmail,
    subject,
    html,
    text: `Thank you for your order #${orderNumber}! Total: Rs. ${(order.total || 0).toLocaleString()}. Shipping to ${shippingAddr.address}, ${shippingAddr.city}. Track your order at: ${accountUrl}`,
  })
}

// 3. PASSWORD RESET EMAIL
export const sendPasswordResetEmail = async (toEmail, resetUrl, userName = 'Customer') => {
  const subject = 'Reset Your Password — Miqraaz'
  const preheader = `Password reset request for your Miqraaz account.`

  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="display: inline-block; background-color: #fef2f2; color: #dc2626; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; padding: 6px 14px; border-radius: 20px; border: 1px solid #fecaca;">
        SECURITY NOTICE
      </span>
      <h2 style="font-size: 22px; font-weight: 700; color: #09090b; margin: 14px 0 6px;">
        Password Reset Request
      </h2>
      <p style="font-size: 14px; color: #52525b; margin: 0; line-height: 1.5;">
        Assalam-o-Alaikum <strong>${userName}</strong>, we received a request to reset your password.
      </p>
    </div>

    <p style="font-size: 14px; color: #3f3f46; line-height: 1.6; text-align: center;">
      Click the button below to choose a new password. This secure link is valid for <strong>30 minutes</strong>.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" target="_blank" style="display: inline-block; background-color: #09090b; color: #ffffff; text-decoration: none; padding: 15px 36px; font-size: 13px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; border-radius: 6px; box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);">
        Reset Password ➔
      </a>
    </div>

    <p style="font-size: 12px; color: #71717a; line-height: 1.5; text-align: center; margin-top: 24px;">
      If you did not request a password reset, please ignore this email. Your account remains secure and no changes have been made.
    </p>
  `

  const html = renderEmailShell({
    title: subject,
    preheader,
    content,
  })

  return sendMail({
    to: toEmail,
    subject,
    html,
    text: `Hello ${userName}, reset your password using this link: ${resetUrl}. Link valid for 30 minutes.`,
  })
}
