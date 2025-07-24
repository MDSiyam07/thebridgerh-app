'use client'

import { useState } from 'react'
import { Candidate, Status } from '@/types'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface CandidateCardProps {
  candidate: Candidate
  onUpdate: (id: string, data: { status?: Status; comment?: string; interviewDate?: Date }) => Promise<void>
}

const statusColors = {
  PENDING: 'bg-accent text-dark-800',
  REVIEWING: 'bg-primary-200 text-primary-800',
  INTERVIEW_SCHEDULED: 'bg-accent-200 text-dark-800',
  REJECTED: 'bg-red-900 text-red-100',
  HIRED: 'bg-green-900 text-green-100',
}

const statusLabels = {
  PENDING: 'En attente',
  REVIEWING: 'En cours d\'examen',
  INTERVIEW_SCHEDULED: 'Entretien programmé',
  REJECTED: 'Refusé',
  HIRED: 'Embauché',
}

export default function CandidateCard({ candidate, onUpdate }: CandidateCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [editData, setEditData] = useState({
    status: candidate.status,
    comment: candidate.comment || '',
    interviewDate: candidate.interviewDate ? format(new Date(candidate.interviewDate), 'yyyy-MM-dd\'T\'HH:mm') : '',
  })

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const updateData: any = {}
      if (editData.status !== candidate.status) updateData.status = editData.status
      if (editData.comment !== candidate.comment) updateData.comment = editData.comment
      if (editData.interviewDate !== (candidate.interviewDate ? format(new Date(candidate.interviewDate), 'yyyy-MM-dd\'T\'HH:mm') : '')) {
        updateData.interviewDate = editData.interviewDate ? new Date(editData.interviewDate) : null
      }

      if (Object.keys(updateData).length > 0) {
        await onUpdate(candidate.id, updateData)
      }
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating candidate:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-dark-400 rounded-[32px] shadow-md p-6 border border-[#FFD700]">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            {candidate.firstName} {candidate.lastName}
          </h3>
          <p className="text-sm text-dark-200">{candidate.email}</p>
          <p className="text-sm text-dark-200">{candidate.position}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[candidate.status]}`}>
          {statusLabels[candidate.status]}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        {candidate.linkedinUrl && (
          <div>
            <span className="text-sm font-medium text-white">LinkedIn:</span>
            <a href={candidate.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline ml-2">
              Voir le profil
            </a>
          </div>
        )}
        
        {(candidate.cvFileName || candidate.cvUrl) && (
          <div>
            <span className="text-sm font-medium text-white">CV:</span>
            {candidate.cvUrl ? (
              <a 
                href={candidate.cvUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-accent hover:underline ml-2"
              >
                {candidate.cvFileName || 'Voir le CV'}
              </a>
            ) : (
              <span className="text-dark-200 ml-2">{candidate.cvFileName}</span>
            )}
          </div>
        )}

        <div>
          <span className="text-sm font-medium text-white">Compétences:</span>
          <p className="text-sm text-dark-200 mt-1">
            {candidate.skills.split(',').map((skill, index) => {
              const trimmedSkill = skill.trim()
              const formattedSkill = trimmedSkill.charAt(0).toUpperCase() + trimmedSkill.slice(1).toLowerCase()
              return (
                <span key={index} className="inline-block bg-dark-500 px-2 py-1 rounded mr-2 mb-1">
                  {formattedSkill}
                </span>
              )
            })}
          </p>
        </div>

        {candidate.interviewDate && (
          <div>
            <span className="text-sm font-medium text-white">Entretien programmé:</span>
            <p className="text-sm text-dark-200 mt-1">
              {format(new Date(candidate.interviewDate), 'PPP \'à\' HH:mm', { locale: fr })}
            </p>
          </div>
        )}

        <div className="text-xs text-dark-300">
          Candidature reçue le {format(new Date(candidate.createdAt), 'PPP', { locale: fr })}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-white mb-1">Statut</label>
            <select
              value={editData.status}
              onChange={(e) => setEditData(prev => ({ ...prev, status: e.target.value as Status }))}
              className="w-full px-3 py-2 border border-dark-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-accent bg-dark-500 text-white"
            >
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Commentaires RH</label>
            <textarea
              value={editData.comment}
              onChange={(e) => setEditData(prev => ({ ...prev, comment: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-dark-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-accent bg-dark-500 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Date d'entretien</label>
            <input
              type="datetime-local"
              value={editData.interviewDate}
              onChange={(e) => setEditData(prev => ({ ...prev, interviewDate: e.target.value }))}
              className="w-full px-3 py-2 border border-dark-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-accent bg-dark-500 text-white"
            />
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="px-4 py-2 bg-[#8D0000] text-white rounded-[12px] hover:bg-[#720000] focus:outline-none focus:ring-2 focus:ring-accent disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-dark-300 text-white rounded-[12px] hover:bg-dark-200 focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {candidate.comment && (
            <div className="bg-dark-500 p-3 rounded border border-dark-300">
              <span className="text-sm font-medium text-white">Commentaires RH :</span>
              <p className="text-sm text-dark-200 mt-1">{candidate.comment}</p>
            </div>
          )}
          
          <button
            onClick={() => setIsEditing(true)}
            className="w-full px-4 py-2 bg-[#8D0000] text-white rounded-[12px] hover:bg-[#720000] focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
          >
            Modifier
          </button>
        </div>
      )}
    </div>
  )
} 