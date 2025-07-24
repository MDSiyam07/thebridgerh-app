import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// SendGrid est optionnel
let sendGridService: any = null
try {
  const { SendGridService } = await import('@/lib/sendgrid')
  sendGridService = new SendGridService()
} catch (error) {
  console.log('SendGrid non configuré - les emails ne seront pas envoyés')
}

// Cloudinary est optionnel
let cloudinaryService: any = null
try {
  const { CloudinaryService } = await import('@/lib/cloudinary')
  cloudinaryService = CloudinaryService
} catch (error) {
  console.log('Cloudinary non configuré - les fichiers ne seront pas uploadés')
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const position = searchParams.get('position')
    const status = searchParams.get('status') as any
    const skills = searchParams.get('skills')

    const where: any = {}
    if (position) where.position = { contains: position, mode: 'insensitive' }
    if (status) where.status = status
    if (skills) where.skills = { contains: skills, mode: 'insensitive' }

    const candidates = await prisma.candidate.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(candidates)
  } catch (error) {
    console.error('Error fetching candidates:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des candidatures' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  console.log('POST /api/candidates - Starting request')
  try {
    const formData = await request.formData()
    console.log('FormData received successfully')
    
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const linkedinUrl = formData.get('linkedinUrl') as string
    const skills = formData.get('skills') as string
    const position = formData.get('position') as string
    const cvFile = formData.get('cvFile') as File | null

    console.log('Form data extracted:', { firstName, lastName, email, position, skills })

    // Validation
    if (!firstName || !lastName || !email || !skills || !position) {
      console.log('Validation failed - missing required fields')
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      )
    }

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
        // Continue without file upload
        cvFileName = cvFile.name
        console.log('Continuing without file upload, filename stored:', cvFileName)
      }
    } else if (cvFile) {
      // Fallback: just store filename if Cloudinary not configured
      cvFileName = cvFile.name
      console.log('Cloudinary not configured - storing filename only:', cvFileName)
    } else {
      console.log('No file uploaded')
    }

    console.log('Attempting to create candidate in database...')
    
    // Create candidate in database
    let candidate
    try {
      // Essayer de créer un nouveau candidat
      candidate = await prisma.candidate.create({
        data: {
          firstName,
          lastName,
          email,
          linkedinUrl: linkedinUrl || null,
          cvFileName: cvFileName || null,
          cvUrl: cvUrl || null,
          cvPublicId: cvPublicId || null,
          skills,
          position,
        },
      })
      console.log('Candidate created successfully:', candidate.id)
    } catch (dbError: any) {
      console.error('Database error:', dbError)
      
      // Gérer spécifiquement l'erreur de doublon d'email
      if (dbError.code === 'P2002' && dbError.meta?.target?.includes('email')) {
        console.log('Email already exists, updating existing candidate...')
        
        try {
          // Mettre à jour le candidat existant
          candidate = await prisma.candidate.update({
            where: { email },
            data: {
              firstName,
              lastName,
              linkedinUrl: linkedinUrl || null,
              cvFileName: cvFileName || null,
              cvUrl: cvUrl || null,
              cvPublicId: cvPublicId || null,
              skills,
              position,
              updatedAt: new Date(),
            },
          })
          console.log('Existing candidate updated successfully:', candidate.id)
        } catch (updateError) {
          console.error('Error updating existing candidate:', updateError)
          return NextResponse.json(
            { error: 'Erreur lors de la mise à jour de la candidature existante' },
            { status: 500 }
          )
        }
      } else {
        return NextResponse.json(
          { error: 'Erreur lors de la sauvegarde en base de données', details: dbError instanceof Error ? dbError.message : 'Unknown error' },
          { status: 500 }
        )
      }
    }

    // Send emails (optional) - DISABLED FOR DEBUGGING
    console.log('SendGrid disabled for debugging - skipping emails')
    /*
    if (sendGridService) {
      try {
        console.log('Sending confirmation email to candidate...')
        // Email de confirmation au candidat
        await sendGridService.sendCandidateConfirmation({
          firstName,
          lastName,
          email,
          position,
        })
        console.log('Confirmation email sent successfully')

        console.log('Sending notification email to admin...')
        // Email de notification à l'admin
        await sendGridService.sendAdminNotification({
          firstName,
          lastName,
          email,
          position,
          skills,
        })
        console.log('Admin notification email sent successfully')
      } catch (emailError) {
        console.error('Error sending email notifications:', emailError)
        // Don't fail the request if email fails
      }
    } else {
      console.log('SendGrid not configured - skipping emails')
    }
    */

    console.log('Sending success response')
    return NextResponse.json(
      { message: 'Candidature envoyée avec succès', candidate },
      { status: 201 }
    )
  } catch (error) {
    console.error('Unexpected error in POST /api/candidates:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la candidature', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 