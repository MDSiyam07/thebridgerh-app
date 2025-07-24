import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  console.log('Testing database connection...')
  
  try {
    // Test 1: Connection
    console.log('1. Testing connection...')
    await prisma.$connect()
    console.log('✅ Connection successful')
    
    // Test 2: Simple query
    console.log('2. Testing simple query...')
    const count = await prisma.candidate.count()
    console.log('✅ Count query successful:', count)
    
    // Test 3: Environment variables
    console.log('3. Checking environment variables...')
    const hasDbUrl = !!process.env.DATABASE_URL
    console.log('✅ DATABASE_URL exists:', hasDbUrl)
    
    // Test 4: Create a test candidate
    console.log('4. Testing candidate creation...')
    const testCandidate = await prisma.candidate.create({
      data: {
        firstName: 'Test',
        lastName: 'User',
        email: `test-${Date.now()}@example.com`,
        position: 'Test Position',
        skills: 'test',
      },
    })
    console.log('✅ Test candidate created:', testCandidate.id)
    
    // Clean up
    await prisma.candidate.delete({
      where: { id: testCandidate.id }
    })
    console.log('✅ Test candidate cleaned up')
    
    return NextResponse.json({
      status: 'success',
      message: 'All database tests passed',
      candidateCount: count,
      hasDatabaseUrl: hasDbUrl,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Database test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 })
    
  } finally {
    await prisma.$disconnect()
  }
} 