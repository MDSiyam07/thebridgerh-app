import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/auth'
import { cookies } from 'next/headers'
import { sign } from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    const isValid = await AuthService.verifyCredentials({ username, password })

    if (!isValid) {
      return NextResponse.json(
        { error: 'Identifiants invalides' },
        { status: 401 }
      )
    }

    // Create a simple session token
    const token = sign(
      { username, role: 'admin' },
      process.env.NEXTAUTH_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    )

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    )
  }
} 