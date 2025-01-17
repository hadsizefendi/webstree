import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { Product } from '~~/server/models/Product'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readFormData(event)
    if (!formData) throw new Error('Form data is required')

    const productData: any = {}
    let imageFile = null

    // Form verilerini işle
    for (const [key, value] of formData.entries()) {
      if (key === 'photo' && value instanceof File) {
        imageFile = value
      } else if (key === 'categories') {
        productData[key] = JSON.parse(value.toString())
      } else {
        productData[key] = value.toString()
      }
    }

    // Fiyat ve stok değerlerini sayıya çevir
    productData.price = Number(productData.price)
    productData.stock = Number(productData.stock)

    // Görsel varsa kaydet
    if (imageFile) {
      // Klasörü oluştur
      const uploadDir = join(process.cwd(), 'public', 'images', 'products')
      await mkdir(uploadDir, { recursive: true })

      const ext = imageFile.name?.split('.').pop() || 'webp'
      const fileName = `product-${Date.now()}.${ext}`
      const filePath = join(uploadDir, fileName)

      const buffer = Buffer.from(await imageFile.arrayBuffer())
      await writeFile(filePath, buffer)
      productData.imageUrl = `/images/products/${fileName}`
    }

    // Ürünü veritabanına kaydet
    const product = await Product.create(productData)

    return {
      _id: product._id,
      message: 'Ürün başarıyla eklendi'
    }
  } catch (error: any) {
    console.error('Ürün eklenirken hata:', error)
    throw createError({
      statusCode: 400,
      message: error.message || 'Ürün eklenirken bir hata oluştu'
    })
  }
})
