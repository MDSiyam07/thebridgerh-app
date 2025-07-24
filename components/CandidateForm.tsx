'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CreateCandidateData } from '@/types'

export default function CandidateForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<CreateCandidateData>({
    firstName: '',
    lastName: '',
    email: '',
    linkedinUrl: '',
    skills: '',
    position: '',
  })
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target
    setFormData(prev => {
      const currentSkills = prev.skills ? prev.skills.split(',').map(s => s.trim()).filter(s => s) : []
      
      if (checked) {
        // Add skill if not already present
        if (!currentSkills.includes(value)) {
          currentSkills.push(value)
        }
      } else {
        // Remove skill
        const index = currentSkills.indexOf(value)
        if (index > -1) {
          currentSkills.splice(index, 1)
        }
      }
      
      return { ...prev, skills: currentSkills.join(', ') }
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCvFile(file)
      setFormData(prev => ({ ...prev, cvFileName: file.name }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const formDataToSend = new FormData()
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value)
      })

      // Add file if selected
      if (cvFile) {
        formDataToSend.append('cvFile', cvFile)
      }

      const response = await fetch('/api/candidates', {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        setMessage({ type: 'success', text: 'Candidature envoyée avec succès ! Redirection...' })
        
        // Redirection vers la page d'accueil après 2 secondes
        setTimeout(() => {
          router.push('/')
        }, 2000)
        
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          linkedinUrl: '',
          skills: '',
          position: '',
        })
        setCvFile(null)
      } else {
        const error = await response.json()
        setMessage({ type: 'error', text: error.message || 'Erreur lors de l\'envoi' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-dark-400 rounded-[32px] shadow-lg border border-[#FFD700]">
      {/* <h2 className="text-2xl font-bold mb-6 text-white">Postuler chez TheBridge RH</h2> */}
      
      {message && (
        <div className={`p-4 mb-4 rounded ${
          message.type === 'success' ? 'bg-green-900 text-green-100 border border-green-700' : 'bg-red-900 text-red-100 border border-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-white mb-1">
              Prénom *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              placeholder="Votre prénom"
              className="w-full px-3 py-2 border border-[#FFD700] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-accent bg-dark-500 text-white placeholder-gray-400"
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-white mb-1">
              Nom *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              placeholder="Votre nom"
              className="w-full px-3 py-2 border border-[#FFD700] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-accent bg-dark-500 text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="votre.email@exemple.com"
            className="w-full px-3 py-2 border border-[#FFD700] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-accent bg-dark-500 text-white placeholder-gray-400"
          />
        </div>

        <div>
          <label htmlFor="linkedinUrl" className="block text-sm font-medium text-white mb-1">
            Lien LinkedIn
          </label>
          <input
            type="url"
            id="linkedinUrl"
            name="linkedinUrl"
            value={formData.linkedinUrl}
            onChange={handleInputChange}
            placeholder="https://linkedin.com/in/votre-profil"
            className="w-full px-3 py-2 border border-[#FFD700] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-accent bg-dark-500 text-white placeholder-gray-400"
          />
        </div>

        <div>
          <label htmlFor="position" className="block text-sm font-medium text-white mb-1">
            Poste recherché *
          </label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            required
            placeholder="ex: Développeur Full Stack, Designer UX/UI, Chef de projet..."
            className="w-full px-3 py-2 border border-[#FFD700] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-accent bg-dark-500 text-white placeholder-gray-400"
          />
        </div>

        <div>
          <label htmlFor="skills" className="block text-sm font-medium text-white mb-1">
            Compétences techniques *
          </label>
          <div className="grid grid-cols-2 gap-2 p-3 border border-[#FFD700] rounded-[12px] bg-dark-500">
            {['make', 'airtable', 'react', 'vuejs', 'angular', 'webflow', 'bubble', 'softr'].map((skill) => (
              <label key={skill} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="skills"
                  value={skill}
                  checked={formData.skills.includes(skill)}
                  onChange={handleSkillsChange}
                  className="w-4 h-4 text-[#8D0000] bg-dark-500 border-[#FFD700] rounded focus:ring-[#FFD700] focus:ring-2"
                />
                <span className="text-white capitalize">{skill}</span>
              </label>
            ))}
          </div>
        </div>



        <div>
          <label htmlFor="cvFile" className="block text-sm font-medium text-white mb-1">
            Télécharger votre CV
          </label>
          <input
            type="file"
            id="cvFile"
            name="cvFile"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className="w-full px-3 py-2 border border-[#FFD700] rounded-[12px] focus:outline-none focus:ring-2 focus:ring-accent bg-dark-500 text-white file:bg-[#8D0000] file:text-white file:border-0 file:px-4 file:py-2 file:rounded-[12px] file:cursor-pointer"
          />
          <p className="text-xs text-dark-200 mt-1">Formats acceptés: PDF, DOC, DOCX (max 5MB)</p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#8D0000] text-white py-3 px-4 rounded-[12px] hover:bg-[#720000] focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Envoi en cours...
            </>
          ) : (
            <>
              Envoyer ma candidature
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12L18 12M18 12L13 7M18 12L13 17" />
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  )
} 