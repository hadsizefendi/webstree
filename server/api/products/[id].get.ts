export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  
  try {
    const product = await Product.findById(id).populate('categories')
    if (!product) {
      throw createError({
        statusCode: 404,
        message: 'Ürün bulunamadı'
      })
    }
    return product
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Ürün getirilirken bir hata oluştu'
    })
  }
})
