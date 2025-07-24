import CandidateForm from '@/components/CandidateForm'
import Link from 'next/link'

export default function CandidatPage() {
  return (
    <div className="min-h-screen bg-dark py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header avec bouton retour */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-[#FFD700] hover:text-[#FFD700]/80 transition-colors mb-4"
          >
            ← Retour à l'accueil
          </Link>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">
              TheBridge RH
            </h1>
            <p className="text-xl text-accent">
              Rejoignez notre équipe et développez votre carrière avec nous
            </p>
          </div>
        </div>
        
        <CandidateForm />
        
        <div className="mt-12 text-center">
          <p className="text-dark-200">
            Votre candidature sera examinée par notre équipe RH.
            <br />
            Nous vous contacterons dans les plus brefs délais.
          </p>
        </div>
      </div>
    </div>
  )
} 