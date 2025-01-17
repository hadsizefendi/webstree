import { Blog } from '~~/server/models/Blog'
import formidable from 'formidable'
import path from 'path'
import fs from 'fs/promises'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Blog ID eksik.'
    })
  }

  try {
    if (event.node.req.method === 'DELETE') {
      // Blog'u sil
      const deletedBlog = await Blog.findByIdAndDelete(id)
      if (!deletedBlog) {
        throw createError({
          statusCode: 404,
          message: 'Blog bulunamadı.'
        })
      }
      return { message: 'Blog başarıyla silindi.' }
    }

    if (event.node.req.method === 'GET') {
      // Blog'u getir
      const blog = await Blog.findById(id)
      if (!blog) {
        throw createError({
          statusCode: 404,
          message: 'Blog bulunamadı.'
        })
      }
      return blog
    }

    if (event.node.req.method === 'PUT') {
      const form = formidable({
        multiples: false,
        keepExtensions: true,
        maxFileSize: 5 * 1024 * 1024, // 5MB
      })

      const { fields } = await new Promise((resolve, reject) => {
        form.parse(event.node.req, (err, fields, files) => {
          if (err) reject(err)
          resolve({ fields, files })
        })
      })

      const updateData: any = {}

      // Form alanlarını kontrol et ve updateData'ya ekle
      if (fields.title?.[0]) updateData.title = fields.title[0]
      if (fields.content?.[0]) updateData.content = fields.content[0]
      if (fields.description?.[0]) updateData.description = fields.description[0]
      if (fields.slug?.[0]) updateData.slug = fields.slug[0]
      if (fields.category?.[0]) updateData.category = fields.category[0]

      const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        { ...updateData, updatedAt: new Date() },
        { new: true }
      )
      
      if (!updatedBlog) {
        throw createError({
          statusCode: 404,
          message: 'Güncellenecek blog bulunamadı.'
        })
      }
      
      return {
        message: 'Blog başarıyla güncellendi',
        blog: updatedBlog
      }
    }

    // Desteklenmeyen yöntem
    throw createError({
      statusCode: 405,
      message: 'Bu yöntem desteklenmiyor.'
    })
  } catch (error) {
    console.error('Blog işleminde hata:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Bir hata oluştu.'
    })
  }
})
