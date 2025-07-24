import { v2 as cloudinary } from 'cloudinary'

// Configuration Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface UploadResult {
  url: string
  publicId: string
  secureUrl: string
}

export class CloudinaryService {
  /**
   * Upload un fichier vers Cloudinary
   */
  static async uploadFile(file: File, folder: string = 'cv'): Promise<UploadResult> {
    try {
      // Convertir le fichier en buffer
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      // Créer un nom unique pour le fichier
      const timestamp = Date.now()
      const originalName = file.name.replace(/\.[^/.]+$/, '') // Enlever l'extension
      const extension = file.name.split('.').pop()
      const publicId = `${folder}/${timestamp}-${originalName}`
      
      // Upload vers Cloudinary
      const result = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            public_id: publicId,
            folder: folder,
            allowed_formats: ['pdf', 'doc', 'docx'],
            transformation: [
              { quality: 'auto' },
              { fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) {
              reject(error)
            } else {
              resolve(result)
            }
          }
        )
        
        uploadStream.end(buffer)
      })
      
      return {
        url: result.secure_url,
        publicId: result.public_id,
        secureUrl: result.secure_url
      }
    } catch (error) {
      console.error('Cloudinary upload error:', error)
      throw new Error('Erreur lors de l\'upload du fichier')
    }
  }
  
  /**
   * Supprimer un fichier de Cloudinary
   */
  static async deleteFile(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId)
    } catch (error) {
      console.error('Cloudinary delete error:', error)
      // Ne pas faire échouer l'application si la suppression échoue
    }
  }
  
  /**
   * Générer une URL signée temporaire
   */
  static generateSignedUrl(publicId: string, expiresIn: number = 3600): string {
    try {
      return cloudinary.url(publicId, {
        sign_url: true,
        type: 'private',
        expires_at: Math.floor(Date.now() / 1000) + expiresIn
      })
    } catch (error) {
      console.error('Error generating signed URL:', error)
      return ''
    }
  }
} 