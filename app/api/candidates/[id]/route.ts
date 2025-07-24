import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    const { status, comment, interviewDate } = body

    const updateData: any = {}
    if (status !== undefined) updateData.status = status
    if (comment !== undefined) updateData.comment = comment
    if (interviewDate !== undefined) {
      updateData.interviewDate = interviewDate ? new Date(interviewDate) : null
    }

    const candidate = await prisma.candidate.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json(candidate)
  } catch (error) {
    console.error('Error updating candidate:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la candidature' },
      { status: 500 }
    )
  }
} 