import { Product } from '~~/server/models/Product'

export default defineEventHandler(async (event) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 })
    return products
  } catch (error: any) {
    console.error('Ürünler getirilirken hata:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Ürünler getirilirken bir hata oluştu'
    })
  }
})
