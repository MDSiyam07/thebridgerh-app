import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SendGridService } from '@/lib/sendgrid'
import { writeFile } from 'fs/promises'
import { join } from 'path'

const sendGridService = new SendGridService()

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
    const cvUrl = formData.get('cvUrl') as string
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

    // Handle file upload
    if (cvFile) {
      const bytes = await cvFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      
      // Create unique filename
      const timestamp = Date.now()
      const originalName = cvFile.name
      const extension = originalName.split('.').pop()
      cvFileName = `${timestamp}-${originalName}`
      
      // Save file to public/uploads directory
      const uploadsDir = join(process.cwd(), 'public', 'uploads')
      cvFilePath = join(uploadsDir, cvFileName)
      
      try {
        await writeFile(cvFilePath, buffer)
      } catch (error) {
        console.error('Error saving file:', error)
        return NextResponse.json(
          { error: 'Erreur lors du téléchargement du fichier' },
          { status: 500 }
        )
      }
    }

    // Create candidate in database
    const candidate = await prisma.candidate.create({
      data: {
        firstName,
        lastName,
        email,
        linkedinUrl: linkedinUrl || null,
        cvUrl: cvUrl || null,
        cvFileName: cvFileName || null,
        skills,
        position,
      },
    })

    // Send email notification
    try {
      await sendGridService.sendNewCandidateNotification({
        firstName,
        lastName,
        email,
        position,
        skills,
      })
    } catch (emailError) {
      console.error('Error sending email notification:', emailError)
      // Don't fail the request if email fails
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