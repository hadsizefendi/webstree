import fs from 'fs/promises'
import path from 'path'
import formidable from 'formidable'
import sharp from 'sharp'
import { Blog } from '~~/server/models/Blog'

export default defineEventHandler(async (event) => {
  try {
    const form = await readMultipartFormData(event)
    if (!form) {
      throw createError({
        statusCode: 400,
        message: 'Form verisi bulunamadı'
      })
    }

    // Form verilerini al
    const title = form.find(f => f.name === 'title')?.data.toString()
    const description = form.find(f => f.name === 'description')?.data.toString()
    const imageUrl = form.find(f => f.name === 'imageUrl')?.data.toString()
    const videoUrl = form.find(f => f.name === 'videoUrl')?.data.toString()

    // Zorunlu alanları kontrol et
    if (!title || !description) {
      throw createError({
        statusCode: 400,
        message: 'Başlık ve açıklama zorunludur'
      })
    }

    // Blog nesnesini oluştur ve kaydet
    const blog = new Blog({
      title,
      description,
      imageUrl: imageUrl || undefined,
      videoUrl: videoUrl || undefined,
      createdAt: new Date()
    })

    await blog.save()

    return { 
      success: true,
      message: 'Blog başarıyla eklendi', 
      blog 
    }

  } catch (error) {
    console.error('Blog ekleme hatası:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Blog eklenirken bir hata oluştu'
    })
  }
})
