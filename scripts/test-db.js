const { PrismaClient } = require('@prisma/client')

async function testConnection() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔌 Test de connexion à la base de données...')
    
    // Test de connexion simple
    await prisma.$connect()
    console.log('✅ Connexion réussie !')
    
    // Test de requête simple
    const candidateCount = await prisma.candidate.count()
    console.log(`📊 Nombre de candidats dans la base : ${candidateCount}`)
    
    console.log('🎉 Tous les tests sont passés !')
  } catch (error) {
    console.error('❌ Erreur de connexion :', error.message)
    console.log('\n💡 Vérifiez que :')
    console.log('1. Votre URL Neon est correcte dans .env.local')
    console.log('2. Votre base de données Neon est active')
    console.log('3. Vous avez exécuté "npx prisma db push"')
  } finally {
    await prisma.$disconnect()
  }
}

testConnection() 