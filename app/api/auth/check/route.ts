import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verify } from 'jsonwebtoken'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    try {
      const decoded = verify(token.value, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any
      
      if (decoded.role === 'admin') {
        return NextResponse.json({ authenticated: true })
      } else {
        return NextResponse.json({ authenticated: false }, { status: 401 })
      }
    } catch (jwtError) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }
  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ authenticated: false }, { status: 500 })
  }
} 