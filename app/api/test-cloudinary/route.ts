import { NextResponse } from 'next/server'

export async function GET() {
  console.log('Testing Cloudinary configuration...')
  
  try {
    // Test 1: Environment variables
    console.log('1. Checking environment variables...')
    const hasCloudName = !!process.env.CLOUDINARY_CLOUD_NAME
    const hasApiKey = !!process.env.CLOUDINARY_API_KEY
    const hasApiSecret = !!process.env.CLOUDINARY_API_SECRET
    
    console.log('✅ CLOUDINARY_CLOUD_NAME exists:', hasCloudName)
    console.log('✅ CLOUDINARY_API_KEY exists:', hasApiKey)
    console.log('✅ CLOUDINARY_API_SECRET exists:', hasApiSecret)
    
    // Test 2: Import Cloudinary
    console.log('2. Testing Cloudinary import...')
    const { CloudinaryService } = await import('@/lib/cloudinary')
    console.log('✅ CloudinaryService imported successfully')
    
    return NextResponse.json({
      status: 'success',
      message: 'Cloudinary configuration test passed',
      hasCloudName,
      hasApiKey,
      hasApiSecret,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('❌ Cloudinary test failed:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Cloudinary configuration test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 