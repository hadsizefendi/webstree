import fs from 'fs/promises'
import path from 'path'
import formidable from 'formidable'
import sharp from 'sharp'
import { Product } from '~~/server/models/Product'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Ürün ID eksik.'
    })
  }

  try {
    // GET: Ürünü getir
    if (event.node.req.method === 'GET') {
      const product = await Product.findById(id)
      if (!product) {
        throw createError({
          statusCode: 404,
          message: 'Ürün bulunamadı.'
        })
      }
      return product
    }

    // DELETE: Ürünü sil
    if (event.node.req.method === 'DELETE') {
      const product = await Product.findByIdAndDelete(id)
      if (!product) {
        throw createError({
          statusCode: 404,
          message: 'Ürün bulunamadı.'
        })
      }
      return { success: true, message: 'Ürün başarıyla silindi.' }
    }

    // PUT: Ürünü güncelle
    if (event.node.req.method === 'PUT') {
      const body = await readBody(event)

      // Validate required fields
      if (!body.name || !body.categories?.length) {
        throw createError({
          statusCode: 400,
          message: 'Ürün adı ve en az bir kategori zorunludur'
        })
      }

      const updateData = {
        name: body.name,
        description: body.description,
        price: body.price || undefined,
        imageUrl: body.imageUrl,
        categories: body.categories,
        media: body.media || [],
        updatedBy: body.createdBy // güncellemeyi yapan kullanıcı
      }

      const product = await Product.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      )

      if (!product) {
        throw createError({
          statusCode: 404,
          message: 'Ürün bulunamadı'
        })
      }

      return { message: 'Ürün başarıyla güncellendi', product }
    }

    // Desteklenmeyen yöntem
    throw createError({
      statusCode: 405,
      message: 'Bu yöntem desteklenmiyor.'
    })
  } catch (error: any) {
    console.error('Ürün işleminde hata:', error)
    throw createError({
      statusCode: 500,
      message: 'Bir hata oluştu.',
      cause: error
    })
  }
})
