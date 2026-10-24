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

export const sendPasswordResetEmail = async (toEmail, resetUrl, userName = 'Customer') => {
  const subject = 'Reset Your Password — Miqraaz'
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111; line-height: 1.6; border: 1px solid #eee; border-radius: 6px;">
      <h2 style="letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px;">مِقْرَاض MIQRAAZ</h2>
      <p style="color: #666; font-size: 14px; margin-top: 0;">Password Reset Request</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p>Hello <strong>${userName}</strong>,</p>
      <p>We received a request to reset the password for your Miqraaz account.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 14px 28px; text-decoration: none; font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: bold; border-radius: 4px; display: inline-block;">
          Reset My Password
        </a>
      </div>
      <p style="font-size: 13px; color: #666;">This link is valid for <strong>30 minutes</strong>. If you did not request this, please ignore this email and your password will remain unchanged.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 11px; color: #999; text-align: center;">© 2026 Miqraaz. EST. in Lyari. All rights reserved.</p>
    </div>
  `
  return sendMail({ to: toEmail, subject, html })
}

export const sendOrderConfirmationEmail = async (order, toEmail, customerName = 'Customer') => {
  const subject = `Order Confirmed #${order.orderNumber} — Miqraaz`
  const itemsList = (order.items || [])
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
          <strong>${item.name || item.product?.name || 'Product'}</strong><br />
          <span style="font-size: 12px; color: #777;">Size: ${item.size} × Qty: ${item.qty}</span>
        </td>
        <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; text-align: right;">
          Rs. ${(item.price * item.qty).toLocaleString()}
        </td>
      </tr>
    `
    )
    .join('')

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; color: #111; line-height: 1.6; border: 1px solid #eee; border-radius: 6px;">
      <h2 style="letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px;">مِقْرَاض MIQRAAZ</h2>
      <p style="color: #666; font-size: 14px; margin-top: 0;">Order Confirmation</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p>Thank you for your order, <strong>${customerName}</strong>!</p>
      <p>Your order has been received and is currently being processed. Here is your summary:</p>
      
      <div style="background-color: #fafafa; padding: 16px; border-radius: 4px; margin: 20px 0;">
        <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p style="margin: 0 0 6px 0; font-size: 14px;"><strong>Payment Method:</strong> ${order.paymentMethod?.toUpperCase() || 'COD'}</p>
        <p style="margin: 0; font-size: 14px;"><strong>Shipping Address:</strong> ${order.shippingAddress?.address}, ${order.shippingAddress?.city}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <thead>
          <tr style="text-align: left; font-size: 12px; color: #888; border-bottom: 2px solid #ddd;">
            <th style="padding-bottom: 8px;">ITEM</th>
            <th style="padding-bottom: 8px; text-align: right;">PRICE</th>
          </tr>
        </thead>
        <tbody>
          ${itemsList}
        </tbody>
        <tfoot>
          <tr>
            <td style="padding-top: 12px; font-size: 13px; color: #666;">Subtotal</td>
            <td style="padding-top: 12px; text-align: right; font-size: 13px;">Rs. ${(order.subtotal || 0).toLocaleString()}</td>
          </tr>
          ${
            order.discount > 0
              ? `<tr>
                  <td style="font-size: 13px; color: #16a34a;">Discount</td>
                  <td style="text-align: right; font-size: 13px; color: #16a34a;">-Rs. ${order.discount.toLocaleString()}</td>
                </tr>`
              : ''
          }
          <tr>
            <td style="font-size: 13px; color: #666;">Shipping Fee</td>
            <td style="text-align: right; font-size: 13px;">${order.shippingFee === 0 ? 'FREE' : 'Rs. ' + order.shippingFee}</td>
          </tr>
          <tr>
            <td style="padding-top: 12px; font-weight: bold; font-size: 16px;">Grand Total</td>
            <td style="padding-top: 12px; font-weight: bold; font-size: 16px; text-align: right;">Rs. ${(order.total || 0).toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>

      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888; text-align: center;">Questions? Reply directly to this email or reach us at <a href="mailto:miqraaz.official@gmail.com" style="color: #000;">miqraaz.official@gmail.com</a>.</p>
    </div>
  `
  return sendMail({ to: toEmail, subject, html })
}
