import logo1 from './logo1.png'

export const LOGO = logo1
export const LOGO_WHITE = logo1
export const LOGO_BLACK = logo1

export const money = (n) =>
  'Rs.' +
  Number(n || 0).toLocaleString('en-PK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
