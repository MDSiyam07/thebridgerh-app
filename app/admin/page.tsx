'use client'

import { useState, useEffect } from 'react'
import { Candidate, Status } from '@/types'
import CandidateCard from '@/components/CandidateCard'
import Link from 'next/link'

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [filters, setFilters] = useState({
    position: '',
    status: '' as Status | '',
    skills: '',
  })

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchCandidates()
    }
  }, [isAuthenticated, filters])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/check')
      if (response.ok) {
        setIsAuthenticated(true)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCandidates = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.position) params.append('position', filters.position)
      if (filters.status) params.append('status', filters.status)
      if (filters.skills) params.append('skills', filters.skills)

      const response = await fetch(`/api/candidates?${params}`)
      if (response.ok) {
        const data = await response.json()
        setCandidates(data)
      }
    } catch (error) {
      console.error('Error fetching candidates:', error)
    }
  }

  const handleUpdateCandidate = async (id: string, updateData: any) => {
    try {
      const response = await fetch(`/api/candidates/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        // Refresh candidates list
        fetchCandidates()
      }
    } catch (error) {
      console.error('Error updating candidate:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-white">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={() => setIsAuthenticated(true)} />
  }

  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header avec bouton retour */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-[#FFD700] hover:text-[#FFD700]/80 transition-colors mb-4"
          >
            ← Retour à l'accueil
          </Link>
          
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Tableau de bord RH</h1>
            <p className="text-accent">
              {candidates.length} candidature{candidates.length !== 1 ? 's' : ''} au total
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-dark-400 rounded-[32px] shadow-md p-6 mb-8 border border-[#FFD700]">
          <h2 className="text-lg font-semibold mb-4 text-white">Filtres</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Poste recherché
              </label>
              <input
                type="text"
                value={filters.position}
                onChange={(e) => setFilters(prev => ({ ...prev, position: e.target.value }))}
                placeholder="Filtrer par poste..."
                className="w-full px-3 py-2 border border-dark-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-accent bg-dark-500 text-white placeholder-dark-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Statut
              </label>
              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as Status | '' }))}
                className="w-full px-3 py-2 border border-dark-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-accent bg-dark-500 text-white"
              >
                <option value="">Tous les statuts</option>
                <option value="PENDING">En attente</option>
                <option value="REVIEWING">En cours d'examen</option>
                <option value="INTERVIEW_SCHEDULED">Entretien programmé</option>
                <option value="REJECTED">Refusé</option>
                <option value="HIRED">Embauché</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Compétences
              </label>
              <select
                value={filters.skills}
                onChange={(e) => setFilters(prev => ({ ...prev, skills: e.target.value }))}
                className="w-full px-3 py-2 border border-dark-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-accent bg-dark-500 text-white"
              >
                <option value="">Toutes les compétences</option>
                <option value="make">Make</option>
                <option value="airtable">Airtable</option>
                <option value="react">React</option>
                <option value="vuejs">Vue.js</option>
                <option value="angular">Angular</option>
                <option value="webflow">Webflow</option>
                <option value="bubble">Bubble</option>
                <option value="softr">Softr</option>
              </select>
            </div>
          </div>
        </div>

        {/* Candidates list */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onUpdate={handleUpdateCandidate}
            />
          ))}
        </div>

        {candidates.length === 0 && (
          <div className="text-center py-12">
            <p className="text-dark-200">Aucune candidature trouvée</p>
          </div>
        )}
      </div>
    </div>
  )
}

function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      if (response.ok) {
        onLogin()
      } else {
        const data = await response.json()
        setError(data.error || 'Erreur de connexion')
      }
    } catch (error) {
      setError('Erreur de connexion')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center">
      <div className="max-w-md w-full bg-dark-400 rounded-[32px] shadow-md p-8 border border-[#FFD700]">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">Connexion Admin</h1>
        
        {error && (
          <div className="bg-red-900 text-red-100 p-3 rounded mb-4 border border-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-white mb-1">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              id="username"
              value={credentials.username}
              onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-dark-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-accent bg-dark-500 text-white placeholder-dark-200"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={credentials.password}
              onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-dark-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-accent bg-dark-500 text-white placeholder-dark-200"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#8D0000] text-white py-2 px-4 rounded-[12px] hover:bg-[#720000] focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
} 