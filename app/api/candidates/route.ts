import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import { join } from 'path'

// SendGrid est optionnel
let sendGridService: any = null
try {
  const { SendGridService } = await import('@/lib/sendgrid')
  sendGridService = new SendGridService()
} catch (error) {
  console.log('SendGrid non configuré - les emails ne seront pas envoyés')
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
  try {
    const formData = await request.formData()
    
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const linkedinUrl = formData.get('linkedinUrl') as string
    const skills = formData.get('skills') as string
    const position = formData.get('position') as string
    const cvFile = formData.get('cvFile') as File | null

    // Validation
    if (!firstName || !lastName || !email || !skills || !position) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires doivent être remplis' },
        { status: 400 }
      )
    }

    let cvFileName: string | undefined
    let cvFilePath: string | undefined

    // Handle file upload (disabled on Vercel)
    if (cvFile) {
      // On Vercel, we can't write files to the filesystem
      // So we just store the filename for reference
      const timestamp = Date.now()
      const originalName = cvFile.name
      cvFileName = `${timestamp}-${originalName}`
      
      console.log('File upload disabled on Vercel - filename stored:', cvFileName)
    }

    // Create candidate in database
    let candidate
    try {
      candidate = await prisma.candidate.create({
        data: {
          firstName,
          lastName,
          email,
          linkedinUrl: linkedinUrl || null,
          cvFileName: cvFileName || null,
          skills,
          position,
        },
      })
    } catch (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde en base de données' },
        { status: 500 }
      )
    }

    // Send emails (optional)
    if (sendGridService) {
      try {
        // Email de confirmation au candidat
        await sendGridService.sendCandidateConfirmation({
          firstName,
          lastName,
          email,
          position,
        })

        // Email de notification à l'admin
        await sendGridService.sendAdminNotification({
          firstName,
          lastName,
          email,
          position,
          skills,
        })
      } catch (emailError) {
        console.error('Error sending email notifications:', emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json(
      { message: 'Candidature envoyée avec succès', candidate },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating candidate:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la candidature' },
      { status: 500 }
    )
  }
} 