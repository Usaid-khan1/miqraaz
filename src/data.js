import logoWhite from './logo.png'
import logoBlack from './logo_black.png'

const CDN = 'https://keshkofficial.com/cdn/shop'
export const LOGO_WHITE = logoWhite
export const LOGO_BLACK = logoBlack
export const HERO_BANNER_IMG = 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.41_AM.jpg?v=1783500715&width=2000'

export const collections = [
  { slug: 'rang-xii', name: 'RANG XII', img: `${CDN}/collections/WhatsApp_Image_2026-07-08_at_11.11.44_AM_17c79acb-f5a2-41f9-b16f-59a089d7aee6.jpg?v=1783516093&width=800` },
  { slug: 'raanta-xi', name: 'RAABTA XI', img: `${CDN}/collections/44C74FD1-436B-4C87-AB56-4336F7E65CC8.jpg?v=1771529226&width=800` },
  { slug: 'chapter-x', name: 'GUZAR X', img: `${CDN}/collections/ABB78B6F-7118-42F2-8298-ABEB64131FE9.jpg?v=1759667019&width=800` },
  { slug: 'nadeedag-ix', name: 'NADEEDAG IX', img: `${CDN}/collections/069807FF-AAB9-4C17-B5F5-5909DDBB6246.jpg?v=1749027986&width=800` },
  { slug: 'aks-e-zindagi', name: 'AKS-E-ZINDAGI VIII', img: `${CDN}/collections/44891037-F489-4151-A955-B8C9CCEF73C8.jpg?v=1740741122&width=800` },
  { slug: 'yaksaan-vii', name: 'YAKSAANI VII', img: `${CDN}/collections/WhatsApp_Image_2024-10-12_at_11.34.42_PM.jpg?v=1728822412&width=800` },
  { slug: 'mehr-e-chiragh-vi', name: 'MEHR-E-CHIRAGH VI', img: `${CDN}/collections/WhatsApp-Image_2024-08-04_at_1.48.44_AM.jpg?v=1722792869&width=800` },
  { slug: 'sangat-v', name: 'SANGAT V', img: `${CDN}/collections/WhatsApp-Image_2024-08-04_at_2.29.06_PM.jpg?v=1722769687&width=800` },
  { slug: 'shohaaz-iv', name: 'SHOHAAZ IV', img: `${CDN}/collections/WhatsApp-Image_2024-08-04_at_2.30.18_PM_2.jpg?v=1722769670&width=800` },
  { slug: 'zarb-o-khayal-iii', name: 'ZARB-O-KHAYAL III', img: `${CDN}/collections/WhatsApp-Image_2024-08-04_at_2.30.18_PM_4.jpg?v=1722769651&width=800` },
  { slug: 'taghayur-ii', name: 'TAGHAYUR II', img: `${CDN}/collections/WhatsApp-Image_2024-08-04_at_2.30.18_PM.jpg?v=1722769631&width=800` },
  { slug: 'raah-chaar', name: 'RAAH CHAAR', img: `${CDN}/collections/FFAE46F2-C9CF-498B-A15A-992F95C3E05D.jpg?v=1754411860&width=800` },
  { slug: 'core-collection', name: 'CORE COLLECTION', img: `${CDN}/collections/FDA091BD-47C1-4510-B9BD-92C1FD4E0BEA.jpg?v=1754390066&width=800` },
]

export const SEARCH_RECOMMENDED = [
  {
    slug: 'aks',
    name: 'AKS',
    price: 6000,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/E2B7AED3-3900-4170-8E6D-0A14C8CBCA54.jpg?v=1759669904&width=800']
  },
  {
    slug: 'bahar-e-phool-1',
    name: 'BAHAR-E-PHOOL',
    price: 6000,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/9551896E-3B43-4B65-91EA-D4853D17482A.jpg?v=1740689575&width=800']
  },
  {
    slug: 'untitled-feb28_16-40',
    name: 'BASIC T-SHIRT',
    price: 4600,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/2EC490B0-CBFA-4CF5-941A-0E70D10ACFAB.png?v=1740743351&width=800']
  },
  {
    slug: 'basic-t-shirt',
    name: 'BASIC T-SHIRT',
    price: 4600,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/C5E2B1B5-BB49-46DE-9AF8-B377F7E767CF.jpg?v=1740743262&width=800']
  }
]

export const products = [
  ...SEARCH_RECOMMENDED,
  {
    slug: 'sabz-daftar-سبز-دفتر',
    name: 'Sabz Daftar (سبز دفتر)',
    price: 5880,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/67462BDE-0037-42C7-A553-62E9B53476EC.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/709CE45F-54EA-4FB0-8AC9-6DE57EAC7AA9.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/2BFF8BED-47A3-45BA-8EFB-885D55A08FF4.jpg?width=800']
  },
  {
    slug: 'دل-کی-باتیں',
    name: 'خواہشیں',
    price: 6200,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/0CF45BF3-2977-4D2A-887A-363AAC15A472.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/C47353C1-41F0-4CB7-92DC-5D0682C211EA.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/96DEC0D5-C449-401D-9C8E-8C264328E3F8.png?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/79D4A857-12DF-43B2-98A4-FD2D9A8F7F4C.jpg?width=800']
  },
  {
    slug: 'gidan-hoodie',
    name: 'Gidan - Hoodie',
    price: 9480,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/4DEF2426-9F6A-4CB8-807B-D00C248FB46C.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/A6E265AD-4EAC-4D18-A408-19CF4CB1BD41.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/F145E370-7973-4149-9E9C-38B092B681C6.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/3026F42E-F94A-43E4-BE64-C86AA4A3F2CF.jpg?width=800']
  },
  {
    slug: 'lavkash-t-shirt',
    name: 'Lavkash - T-shirt',
    price: 5680,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.34.45_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.34.46_PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.34.43_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.34.45_PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.34.48_PM.jpg?width=800']
  },
  {
    slug: 'doch',
    name: 'DOCH',
    price: 6000,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/9E0BACA5-3674-481D-8F7D-659B42D30EC6.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/DADC9C45-72AD-49B4-82E7-84E7D4977CBE.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/F052115D-3471-4704-AD84-30D67492A0C4.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/5543AD1F-90A8-4CA1-9EEB-FA039FC5F132.jpg?width=800']
  },
  {
    slug: 'pehle-sa-dil',
    name: 'PEHLE SA DIL',
    price: 11000,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/943B30C7-3F8A-48AC-A017-B4E00A311036.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/C2943A0F-683D-4CA2-A073-5BA46A880343.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/9026CC4B-85D1-41C7-AE0F-B34FC12C9CA2.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/FDAD741E-432C-4EF4-8B1D-0B5C7FE9CE19.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/38EE046B-A0F0-4C65-9437-292A77A752A3.jpg?width=800']
  },
  {
    slug: 'رابطے',
    name: 'رابطے',
    price: 6200,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/0232DDD7-C3AC-49CF-904D-2CC6CE29393E.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/1EEA2EE0-3AB3-4376-959D-93229FD103BC.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/C2EDD37E-D93D-401D-B487-E9DCDD21CE10.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/0157A71A-5994-4BAB-9F2E-9E64F3085589.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/67D499FE-3F97-4DBC-A1CC-B06E9DAB96B3.jpg?width=800']
  },
  {
    slug: 'gulbadan',
    name: 'Gulbadan (گلبدن )',
    price: 5880,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/6C62AA6E-E0A4-4008-96FA-A3583179BA5B.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/0BAF56F8-7DB9-4180-807B-34C7557BF695.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/546DC6A2-B078-4479-94AB-6E2C34940C30.jpg?width=800']
  },
  {
    slug: 'untitled-feb20_00-27',
    name: 'دل کی باتیں',
    price: 6200,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/4F9A2EBC-B068-4083-B51D-EC713C0057AE.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/097A164C-2710-49BF-98D8-3435DFFC6613.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/066437D3-7377-4A03-9986-CC34A12BFA3F.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/B831FF08-9940-454A-883B-5B8E448A723E.jpg?width=800']
  },
  {
    slug: 'نقش',
    name: 'پیوند',
    price: 6200,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/9E28D2F6-2D5C-4DFB-BB24-93D21557D60E.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/A6DDBC6B-E774-4024-ABCD-123F5239678F.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/048E88AD-C9F4-42C4-B41F-07CFC318BE64.jpg?width=800']
  },
  {
    slug: 'sabzaar',
    name: 'SABZAAR',
    price: 10480,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/196E1DF6-96E0-42D7-8AFE-74BC86A9468E.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/9278C4C5-DA25-49B4-B55C-0E9D1F00A257.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/693C99CC-5F47-4448-8A76-49228921AADD.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/DEB69816-B57C-4C94-927B-732DD600428C.jpg?width=800']
  },
  {
    slug: 'خواب-گھر',
    name: 'خواب گھر',
    price: 6000,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/6F543327-0A13-445A-A2F1-0AD51CFEB73B.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/9D1E02ED-4D79-449C-8BD2-D3D73D3139DD.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/F76E3DF7-F948-4760-AEAC-F83C0106BEFD.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/72A5FF92-9B41-4754-8F0E-90179BA84D28.jpg?width=800']
  },
  {
    slug: 'mystic',
    name: 'BLOCK CHARM T-SHIRT',
    price: 5480,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-03_at_7.46.28_PM_2.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-03_at_7.46.28_PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-03_at_7.46.29_PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-03_at_7.46.29_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-03_at_7.46.28_PM.jpg?width=800']
  },
  {
    slug: 'dune-sweatshirt',
    name: 'Dune - Sweatshirt',
    price: 7980,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/96A87914-EB06-46A5-9CA9-4AA4AA863AA8.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/521B916C-3411-4329-B6D6-4EDEFC902DB7.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/A594D382-FA25-48ED-A75A-666965D165C4.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/3E587E52-DDD7-4E24-AB3C-14F31A98FAF0.jpg?width=800']
  },
  {
    slug: 'dastaan-داستان',
    name: 'Dastaan (داستان)',
    price: 8000,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.44_AM_17c79acb-f5a2-41f9-b16f-59a089d7aee6.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.44_AM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.41_AM_2.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsAppImage2026-07-08at11.11.40AM_4.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.41_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.43_AM.jpg?width=800']
  },
  {
    slug: 'maazi',
    name: 'MAAZI',
    price: 6000,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/A09E1B63-D7C9-43C6-B46B-6E1B8E502C01.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/37378691-AE9A-4DFC-99DE-A2540A5F9109.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/F83EEF55-D175-4D76-A85D-E0843A172DBD.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/F46C290B-0127-4D44-98F9-CDE47EF47531.jpg?width=800']
  },
  {
    slug: 'rangzaar',
    name: 'Rangzaar ( رنگزار )',
    price: 6200,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.36_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.35_AM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.35_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_8.56.02_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsAppImage2026-07-08at8.55.48AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_8.55.49_AM.jpg?width=800']
  },
  {
    slug: 'black-basic-t-shirt',
    name: 'BASIC T-SHIRTS',
    price: 4500,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-07-01_at_7.41.49_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-07-01_at_7.41.48_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-07-01_at_7.41.48_PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-07-01_at_7.41.47_PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-07-01_at_7.41.50_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-07-01_at_7.41.49_PM_1.jpg?width=800']
  },
  {
    slug: 'bun-بُن',
    name: 'Bun (بُن)',
    price: 6500,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.51_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.51_AM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.39_AM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsAppImage2026-07-08at11.11.50AM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.39_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.40_AM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.50_AM.jpg?width=800']
  },
  {
    slug: 'lavender-sweatshirt',
    name: 'LAVENDER SWEATSHIRT',
    price: 6480,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-07-01_at_1.46.29_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsAppImage2024-06-30at9.30.56PM_2.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsAppImage2024-06-30at9.31.40PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-07-01_at_1.46.29_PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-07-01_at_1.46.30_PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-07-01_at_1.46.30_PM.jpg?width=800']
  },
  {
    slug: 'be-rang-na-tha',
    name: 'Berang Na Tha  (بے رنگ نہ تھا)',
    price: 6000,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/E3DC8830-E8B2-4875-B875-F3A0A4DC65F6.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/8E1FC0F1-EFD3-4EAD-829D-5E10AB163147.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/EBEAFFFE-CE0E-422C-A12C-2B8CA8CBF665.jpg?width=800']
  },
  {
    slug: 'sabaat-ثبات',
    name: 'Sabaat (ثبات)',
    price: 6200,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.31_AM_e3559264-7a8e-4d8e-ada4-913d3e7dea33.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.31_AM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.30_AM_3.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.30_AM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsAppImage2026-07-08at11.11.31AM_2.jpg?width=800']
  },
  {
    slug: 'chocolate-brown',
    name: 'Core - Chocolate Brown',
    price: 5000,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/0394C166-6233-4E30-9327-8421B9B8B2B9.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/D4FDF111-0789-4B85-A8A6-3613A13470AC.png?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/85A5A466-210E-4605-A47F-FE71931E1F47.jpg?width=800']
  },
  {
    slug: 'the-core',
    name: 'Core - Olive Green',
    price: 5000,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/A5F26C63-3F1C-47B0-852B-99F185A669A1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/C25CEF52-98C2-4B9B-99B8-3E0505AC91F9.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/82CEAB69-6183-4BF9-BC58-2627F68CAAC4.jpg?width=800']
  },
  {
    slug: 'core-shorts',
    name: 'Core Shorts',
    price: 3500,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/016D7170-692D-4EB2-AB33-FD5155A6713F.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/F004D7CB-04A5-4EEE-8284-6F6B2101B156.jpg?width=800']
  },
  {
    slug: 'core-grey',
    name: 'Core - Grey',
    price: 5000,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/3887F8EB-447E-42C4-8EF9-7E297C9A8A51.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/39723960-FB82-4EC3-8D2D-CE355E147DCC.jpg?width=800']
  },
  {
    slug: 'siahgir-سیاہ-گیر',
    name: 'Siahgir (سیاہ گیر)',
    price: 6200,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.38_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsAppImage2026-07-08at11.11.36AM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.37_AM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.38_AM_2.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.38_AM_1.jpg?width=800']
  },
  {
    slug: 'jarr-جڑ',
    name: 'Jarr (جڑ)',
    price: 6200,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.33_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsAppImage2026-07-08at11.11.34AM_2.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.34_AM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.32_AM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.33_AM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.31_AM_3.jpg?width=800']
  },
  {
    slug: 'shorts-grey',
    name: 'Core Shorts',
    price: 3500,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/69547F05-433F-4E2E-AA8E-707009BBEA14.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/16110C92-6B82-46C0-98AC-79B0C388A7BD.jpg?width=800']
  },
  {
    slug: 'core-pink',
    name: 'Core - Pink',
    price: 5000,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/9C9DD53C-06D8-452A-A6F0-73A9E8941766.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/390F0EB0-DEE7-498C-A6F0-14BAE3035678.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/C001334A-EA5B-4B1F-BBA3-17B0A30A6188.jpg?width=800']
  },
  {
    slug: 'trousers-grey',
    name: 'Trouser',
    price: 4500,
    soldOut: false,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/16110C92-6B82-46C0-98AC-79B0C388A7BD.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/A99AB9ED-1E3B-456A-9765-4D1A7802CF67.png?width=800']
  },
  {
    slug: 'ruzan-رُزان',
    name: 'Ruzan (رُزان)',
    price: 6500,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.48_AM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.45_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.46_AM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.47_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2026-07-08_at_11.11.47_AM_1.jpg?width=800']
  },
  {
    slug: 'پیوند',
    name: 'نقش',
    price: 6200,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/B8238BB2-A75F-4745-A98B-05A60A7EBD9D.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/0994AB49-355F-497A-BCEA-324ADFB41B89.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/F4C3B4C2-58C6-4D49-BD45-0DB517CE7FB5.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/246E46F5-3A21-41FA-AED0-C9DBBE2F95F1.jpg?width=800']
  },
  {
    slug: 'توار',
    name: 'توار',
    price: 6500,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/04E160E4-C179-4CA7-B4E8-11E4AF2D3F9D.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/1671AF5C-F92F-4AD3-B78A-F9017545B51A.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/85264DCA-774D-4CB7-B480-424713052BFE.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/E342C9AB-27CF-4412-A87E-11C57952A8A6.jpg?width=800']
  },
  {
    slug: 'phil',
    name: 'PEHRAN',
    price: 10000,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/F9203764-BC1E-4D38-B909-959E5B3457E0.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/340B9CED-DEFD-477D-930E-45D412E4AC5C.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/F0063FE1-9750-45DC-BF78-7AF8F34A6C5E.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/A323CDCF-9E45-47A1-957C-D16F404D28B3.jpg?width=800']
  },
  {
    slug: 'kham',
    name: 'KHAM',
    price: 9980,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/1DBB797E-B9E1-4DE3-905E-680552A3CFCE.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/4BBFCC14-E4B5-4B35-8FDC-4DB713325EEC.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/49CC24D2-5184-40D8-BAB7-BD0A6F09FB2E.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/54BF9D96-507E-43A5-94E2-5357D048D64B.jpg?width=800']
  },
  {
    slug: 'aks',
    name: 'AKS',
    price: 6000,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/E2B7AED3-3900-4170-8E6D-0A14C8CBCA54.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/C1A8FBE0-76C9-4D6E-8284-0D9F6C98C8FA.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/403A5531-3591-47F0-9294-CA176D95691A.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/8223FA97-578A-4434-864E-BD139447AE3E.jpg?width=800']
  },
  {
    slug: 'mukhtasir',
    name: 'MUKHTASIR',
    price: 10480,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/411E03F0-A89F-4F75-B103-2C13329F8D96.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/1B5E28B2-8B78-4D54-8A3D-66ED5BAB90FA.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/6719766A-8DCF-4E8E-8CB0-824F420CF6BD.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/8F98E2BF-FBE4-4EE9-B90A-5F511893363F.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/93D7CAC5-857F-490A-8B46-F77FCB68956A.jpg?width=800']
  },
  {
    slug: 'rahchar',
    name: 'RAHCHAR',
    price: 10880,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/071DDE0C-51A9-4E16-AE06-EA47D580A834.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/CFDC6256-B657-452C-924E-3B9AC8B8FE1D.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/71669E02-84DE-42D2-8CA2-A21BED2AE357.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/7A342879-9427-489D-B146-833395E13DCF.jpg?width=800']
  },
  {
    slug: 'hayaat',
    name: 'HAYAAT',
    price: 17000,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/D6A20F3F-1AA7-4253-AEE0-E0EE760116C9.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/32E2007E-35C6-49A0-A5E4-59BB1D6E2FC0.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/FFD8607C-E5B9-4FC9-AB9A-6AF24953245A.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/239BB90F-2AE5-430A-9661-121C3394D674.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/6A3886E6-1021-4946-A458-6E045F6EAE9D.jpg?width=800']
  },
  {
    slug: 'dasht',
    name: 'DASHT',
    price: 10880,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/261E9005-3B41-4596-A014-5D9B6B2E410E.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/8C072ECF-F39C-47D4-8FCB-51634372BE73.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/06235896-B86B-458F-AC9C-D66770D882A1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/85E45525-F840-4E1C-94D4-99451281F88F.jpg?width=800']
  },
  {
    slug: 'تلاش',
    name: 'تلاش',
    price: 6000,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/EDB08810-9F18-41BD-9052-C567781E9169.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/6FED8C49-9C06-4D34-A7B0-66BB998897E7.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/C54E6D25-7CB7-43BD-8458-2A7420811842.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/AA4D455D-101D-428A-8A5E-5DE1DF75EDD5.jpg?width=800']
  },
  {
    slug: 'trouser',
    name: 'Trouser',
    price: 4500,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/4AC02EE9-2921-4880-BBD4-67BAFA590B10.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/D678200C-4E86-4283-85DD-2C009E412D43.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/D10805B0-B05E-4FAA-B7EE-2A3CDEDCA86E.jpg?width=800']
  },
  {
    slug: 'r',
    name: 'Sachi Baat ( سچی بات)',
    price: 5480,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/E3DBF035-F7BA-4ECE-ADDB-ED0ED6AC870B.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/CEBE07F5-16AA-4F64-A02B-A5FD8FD89C04.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/897F1DE7-8A27-479F-87FE-B3444F241015.jpg?width=800']
  },
  {
    slug: 'q',
    name: 'Bismil (بسمل)',
    price: 6000,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/7C4B6799-6B4F-49F2-BF84-CB3CC1980B56.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/46CC7658-8872-4331-917A-537BA0666C9B.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/35B225AE-0B39-45F7-82AF-6888D3DA3545.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/252BB9DC-701D-4622-980F-4D04EB190B1E.jpg?width=800']
  },
  {
    slug: 'chaap-چھاپ',
    name: 'Chaap (چھاپ )',
    price: 6000,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/84BE352D-A757-47C5-BE97-B344969FAA3C.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/33197F53-413C-438E-AABB-702190D73EF7.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/8A9BBC36-96D5-4A5F-AD6D-054417F92E85.jpg?width=800']
  },
  {
    slug: 'basic-t-shirt-1',
    name: 'BASIC T-SHIRT',
    price: 4600,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/D19FAF5C-68C5-4097-A5E9-B52B85D1CF23.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/42021A7C-17D4-409A-8156-1468124076BD.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/9C769ACB-57FA-423A-B434-02128C30292C.jpg?width=800']
  },
  {
    slug: 'basic-t-shirt',
    name: 'BASIC T-SHIRT',
    price: 4600,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/C5E2B1B5-BB49-46DE-9AF8-B377F7E767CF.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/FE284684-0840-40C6-B7D4-C1DD4955DFB7.jpg?width=800']
  },
  {
    slug: 'untitled-feb28_16-40',
    name: 'BASIC T-SHIRT',
    price: 4600,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/2EC490B0-CBFA-4CF5-941A-0E70D10ACFAB.png?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/0061AD50-1685-4A82-83F2-62B28DAE908D.jpg?width=800']
  },
  {
    slug: 'befikr-1',
    name: 'BEFIKR',
    price: 5880,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/2B4E1439-D6DF-4918-94DF-766496312E24.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/74559178-B8D3-4BA1-BCC0-539E39E3A034.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/3A97EABB-E3E7-4341-B94B-1F1023EFB576.jpg?width=800']
  },
  {
    slug: 'nedarag',
    name: 'NEDARAG',
    price: 5880,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/872B9D3F-38DD-4AD9-95A2-593343A6E7BC.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/1370C4D1-8DE6-441A-B902-59899D59DFD2.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/E24DF52B-98D4-4D71-81D9-96F4DD2404FA.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/69239F53-1EFA-45C8-9C4C-4C69114FF177.jpg?width=800']
  },
  {
    slug: 'bahar-e-phool-1',
    name: 'BAHAR-E-PHOOL',
    price: 6000,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/9551896E-3B43-4B65-91EA-D4853D17482A.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/92CD4BC5-51DF-4942-B780-9EED3526B00C.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/91478EAE-A421-4688-9B8B-E0061CDBAC4B.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/A6DDB939-4453-4C01-B1C9-8B6F9787AB52.jpg?width=800']
  },
  {
    slug: 'befikr',
    name: 'SABR LAZIM',
    price: 5880,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/2BD44838-72E1-4DDE-9893-84674765F6E4.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/2F43F5BC-24CA-4404-96DD-160330DE16B1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/EA834502-3102-4EDB-B2C6-11E8AEDD05BF.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/96AD4AB3-E44C-4497-8215-F8D64AEA53FE.jpg?width=800']
  },
  {
    slug: 'bahar-e-phool',
    name: 'SAAHIG',
    price: 6000,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/63BEE9F3-E850-4497-B96A-CCE8D3BBEE32.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/BF2CEE14-191A-4851-B8BB-C8869F33898C.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/C9EFA998-5589-495A-8078-BD47C1FF6167.jpg?width=800']
  },
  {
    slug: 'aks-e-zindagi',
    name: 'KASANI',
    price: 5880,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/418DD1E0-D5C2-4A05-9A40-A3AAE30F219E.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/975D4F42-82FF-4716-A2AB-B17B6670B1E9.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/45756980-7243-4425-8F76-2A814241136F.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/3884EAF4-61F9-47F1-BB50-A0A521C1C7EF.jpg?width=800']
  },
  {
    slug: 'sabz-aura-hoodie',
    name: 'Sabz Aura - Hoodie',
    price: 8980,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/70C5BD62-436A-4CA4-939E-51F9F5165E5F.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/4085FC1D-C0BD-4EEB-A4E7-3A7A2164C52B.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/F58C6D7A-72D8-4E00-ADF8-B5D3D5DC6267.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/2508DCB8-B36D-4465-B039-055D30B98C80.jpg?width=800']
  },
  {
    slug: 't-shirt-1',
    name: 'Bayaan - T-shirt',
    price: 5680,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.37.29_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.37.17_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.37.18_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.37.18_PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/IMG_4879.jpg?width=800']
  },
  {
    slug: 'kahani-hoodie',
    name: 'Kahani - Hoodie',
    price: 9480,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.36.04_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.35.38_PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.35.38_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.35.39_PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.35.42_PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.35.39_PM.jpg?width=800']
  },
  {
    slug: 'safar-t-shirt',
    name: 'Safar - T-shirt',
    price: 5680,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.35.33_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.35.28_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.35.19_PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.35.19_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.35.21_PM.jpg?width=800']
  },
  {
    slug: 'yaqeen-hoodie',
    name: 'Yaqeen - Hoodie',
    price: 7480,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.36.06_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.36.09_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.36.05_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.36.10_PM.jpg?width=800']
  },
  {
    slug: 'siyyah-bagh-hoodie',
    name: 'Siyyah Bagh - Hoodie',
    price: 8880,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.35.12_PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.34.57_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.34.50_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.35.10_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.35.14_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-10-12_at_11.35.12_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/IMG_4880.jpg?width=800']
  },
  {
    slug: 'black-trouser',
    name: 'BLACK TROUSER',
    price: 5500,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_1.50.54_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_1.50.57_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_1.50.53_AM.jpg?width=800']
  },
  {
    slug: 't-shirt',
    name: 'PYAR KI RAAH T-SHIRT',
    price: 5480,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_1.35.04_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_1.35.00_AM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_1.34.59_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_1.35.01_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_1.35.03_AM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_1.35.05_AM.jpg?width=800']
  },
  {
    slug: 'mulaqaat-t-shirt',
    name: 'MULAQAAT T-SHIRT',
    price: 5480,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_1.21.08_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_1.21.12_AM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_1.21.13_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_1.21.11_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_1.21.10_AM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_1.21.11_AM_1.jpg?width=800']
  },
  {
    slug: 'farq-t-shirt',
    name: 'FARQ T-SHIRT',
    price: 5480,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_12.45.14_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_12.45.12_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_12.45.15_AM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_12.45.15_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_12.45.17_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_12.45.18_AM.jpg?width=800']
  },
  {
    slug: 'mukhtasir-t-shirt',
    name: 'MUKHTASIR T-SHIRT',
    price: 5999,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_12.30.54_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_12.30.55_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_12.30.51_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_12.30.52_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_12.30.54_AM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_12.30.55_AM_1.jpg?width=800']
  },
  {
    slug: 'manzil-t-shirt',
    name: 'MANZIL T-SHIRT',
    price: 5999,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_1.12.17_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_1.12.31_AM_2.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_1.12.30_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_1.12.31_AM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-08-04_at_1.12.32_AM.jpg?width=800']
  },
  {
    slug: 'grey-t-shirt',
    name: 'GREY T-SHIRT',
    price: 4500,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_10.17.15_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_10.17.12_PM.jpg?width=800']
  },
  {
    slug: 'white-t-shirt',
    name: 'WHITE T-SHIRT',
    price: 5480,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_10.17.13_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_7.21.16_PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_10.17.15_PM_2.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_10.17.15_PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_7.21.17_PM.jpg?width=800']
  },
  {
    slug: 'black-t-shirt',
    name: 'BLACK T-SHIRT',
    price: 5480,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_10.17.17_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_7.21.13_PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_10.17.14_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_10.17.11_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_7.21.14_PM_2.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsAppImage2024-06-30at7.21.13PM.jpg?width=800']
  },
  {
    slug: 'time-pass-t-shirt',
    name: 'TIME PASS T-SHIRT',
    price: 5480,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-07-01_at_7.41.35_PM_2.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-07-01_at_7.41.33_PM_2.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-07-01_at_7.41.33_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-07-01_at_7.41.33_PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-07-01_at_7.41.32_PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-07-01_at_7.41.38_PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-07-01_at_7.41.32_PM.jpg?width=800']
  },
  {
    slug: 'muntazir-t-shirt',
    name: 'MUNTAZIR T-SHIRT',
    price: 5480,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-07-01_at_7.41.37_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-07-01_at_7.41.35_PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-07-01_at_7.41.34_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-07-01_at_7.41.37_PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-07-01_at_7.41.35_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-07-01_at_7.41.31_PM.jpg?width=800']
  },
  {
    slug: 'block-print',
    name: 'BLOCK PRINT',
    price: 5480,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_9.32.48_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_9.32.51_PM_ba96e0d1-8cc0-45d6-8a1e-c5b362c24d46.jpg?width=800']
  },
  {
    slug: 'not-your-business',
    name: 'NOT YOUR BUSINESS',
    price: 5480,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_9.32.54_PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_9.32.55_PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_9.32.55_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_9.32.55_PM_1_-_Copy.jpg?width=800']
  },
  {
    slug: 'oman',
    name: 'OMAN',
    price: 5480,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_9.32.40_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_9.32.41_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_9.32.42_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_9.32.40_PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_9.32.39_PM_1.jpg?width=800']
  },
  {
    slug: 'turn-your-life-t-shirt',
    name: 'TURN YOUR LIFE',
    price: 5480,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_9.32.52_PM_2_0c10d690-ff2e-48ac-88ea-4dae827ddb37.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_9.32.52_PM_1_cebb10cd-a8d0-4d48-903c-661776b0a385.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_9.32.53_PM_a8700002-2120-4ca4-b07c-aef22e28d752.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_9.32.52_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_9.32.54_PM.jpg?width=800']
  },
  {
    slug: 'hayal-sweatshirt',
    name: 'HAYAL SWEATSHIRT',
    price: 6480,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsAppImage2024-06-30at9.30.56PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsAppImage2024-06-30at9.30.56PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsAppImage2024-06-30at9.31.40PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-07-01_at_1.31.52_PM.jpg?width=800']
  },
  {
    slug: 'wadaar',
    name: 'WADAAR',
    price: 5480,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsAppImage2024-06-30at9.30.57PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsAppImage2024-06-30at9.30.52PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsAppImage2024-06-30at9.31.00PM.jpg?width=800']
  },
  {
    slug: 'siyya-doch',
    name: 'SIYYA DOCH',
    price: 5480,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsAppImage2024-06-30at9.31.01PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsAppImage2024-06-30at9.31.01PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsAppImage2024-06-30at9.31.00PM_1.jpg?width=800']
  },
  {
    slug: 'neela-kinara',
    name: 'NEELA KINARA',
    price: 6480,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_8.28.19_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_8.28.18_PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/IMG_0374_4.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_8.28.03_PM.jpg?width=800']
  },
  {
    slug: 'sot-o-soorat',
    name: 'SOT O SOORAT',
    price: 5480,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_8.28.17_PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_8.28.05_PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_8.28.05_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsApp_Image_2024-06-30_at_8.28.04_PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/IMG_0372_4219ad76-59a9-45fd-af91-0278dc054f18.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/IMG_0359_1_ce7876c2-877f-4413-89e4-8a7413975cec.jpg?width=800']
  },
  {
    slug: 'zeba',
    name: 'ZEBA',
    price: 8880,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/IMG_0398.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/IMG_9819.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/IMG_9820_1.jpg?width=800']
  },
  {
    slug: 'good-life-tshirts',
    name: 'GOOD LIFE',
    price: 5480,
    soldOut: true,
    images: ['https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsAppImage2024-06-12at4.24.30PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsAppImage2024-06-12at4.24.29PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsAppImage2024-06-12at4.24.29PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsAppImage2024-06-12at4.24.30PM_1.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsAppImage2024-06-12at4.24.31PM.jpg?width=800', 'https://cdn.shopify.com/s/files/1/0877/8635/7016/files/WhatsAppImage2024-06-12at4.24.32PM.jpg?width=800']
  },
]

export const money = (n) => 'Rs.' + Number(n).toLocaleString('en-PK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
