import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Cloudinary est optionnel
let cloudinaryService: any = null
try {
  const { CloudinaryService } = await import('@/lib/cloudinary')
  cloudinaryService = CloudinaryService
} catch (error) {
  console.log('Cloudinary non configuré - les fichiers ne seront pas uploadés')
}

export async function POST(request: NextRequest) {
  console.log('POST /api/test-upload - Starting test')
  
  try {
    const formData = await request.formData()
    console.log('FormData received successfully')
    
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const position = formData.get('position') as string
    const skills = formData.get('skills') as string
    const cvFile = formData.get('cvFile') as File | null

    console.log('Form data extracted:', { firstName, lastName, email, position, skills })
    console.log('File received:', cvFile ? { name: cvFile.name, size: cvFile.size, type: cvFile.type } : 'No file')

    let cvFileName: string | undefined
    let cvUrl: string | undefined
    let cvPublicId: string | undefined

    // Handle file upload with Cloudinary
    if (cvFile && cloudinaryService) {
      try {
        console.log('Uploading file to Cloudinary:', cvFile.name, 'Size:', cvFile.size, 'Type:', cvFile.type)
        const uploadResult = await cloudinaryService.uploadFile(cvFile, 'cv')
        
        cvFileName = cvFile.name
        cvUrl = uploadResult.secureUrl
        cvPublicId = uploadResult.publicId
        
        console.log('File uploaded successfully to Cloudinary:', cvUrl)
        console.log('Public ID:', cvPublicId)
      } catch (uploadError) {
        console.error('Cloudinary upload failed:', uploadError)
        cvFileName = cvFile.name
        console.log('Continuing without file upload, filename stored:', cvFileName)
      }
    } else if (cvFile) {
      cvFileName = cvFile.name
      console.log('Cloudinary not configured - storing filename only:', cvFileName)
    } else {
      console.log('No file uploaded')
    }

    console.log('Attempting to create candidate in database...')
    
    // Create candidate in database
    let candidate
    try {
      candidate = await prisma.candidate.create({
        data: {
          firstName,
          lastName,
          email,
          cvFileName: cvFileName || null,
          cvUrl: cvUrl || null,
          cvPublicId: cvPublicId || null,
          skills,
          position,
        },
      })
      console.log('Candidate created successfully:', candidate.id)
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde en base de données', details: dbError instanceof Error ? dbError.message : 'Unknown error' },
        { status: 500 }
      )
    }

    console.log('Sending success response')
    return NextResponse.json({
      status: 'success',
      message: 'Test upload completed successfully',
      candidate: {
        id: candidate.id,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        email: candidate.email,
        cvFileName: candidate.cvFileName,
        cvUrl: candidate.cvUrl,
        cvPublicId: candidate.cvPublicId,
        position: candidate.position,
        skills: candidate.skills
      },
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Unexpected error in POST /api/test-upload:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Test upload failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 