import logoWhite from './logo.png'
import logoBlack from './logo_black.png'

export const LOGO_WHITE = logoWhite
export const LOGO_BLACK = logoBlack
export const HERO_BANNER_IMG =
  'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.41_AM.jpg?v=1783500715&width=2000'

export const money = (n) =>
  'Rs.' +
  Number(n || 0).toLocaleString('en-PK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
