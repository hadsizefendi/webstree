import { Product } from '~~/server/models/Product'

export default defineEventHandler(async (event) => {
  try {
    // Read the JSON body directly
    const body = await readBody(event)

    // Validate required fields
    if (!body.name || !body.categories?.length || !body.createdBy) {
      throw createError({
        statusCode: 400,
        message: 'Ürün adı, oluşturan ve en az bir kategori zorunludur'
      })
    }

    // Create new product with the provided data
    const product = await new Product({
      name: body.name,
      description: body.description,
      price: body.price,
      imageUrl: body.imageUrl,
      categories: body.categories,
      media: body.media || [],
      createdBy: body.createdBy
    }).save()

    return { 
      message: 'Ürün başarıyla eklendi', 
      product 
    }

  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Ürün eklenirken bir hata oluştu'
    })
  }
})
