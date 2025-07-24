export interface Candidate {
  id: string
  firstName: string
  lastName: string
  email: string
  linkedinUrl?: string
  cvFileName?: string
  skills: string
  position: string
  status: Status
  comment?: string
  interviewDate?: Date
  createdAt: Date
  updatedAt: Date
}

export type Status = 'PENDING' | 'REVIEWING' | 'INTERVIEW_SCHEDULED' | 'REJECTED' | 'HIRED'

export interface CreateCandidateData {
  firstName: string
  lastName: string
  email: string
  linkedinUrl?: string
  cvFileName?: string
  skills: string
  position: string
}

export interface UpdateCandidateData {
  status?: Status
  comment?: string
  interviewDate?: Date
}

export interface CandidateFilters {
  position?: string
  status?: Status
  sortBy?: 'createdAt' | 'firstName' | 'lastName'
  sortOrder?: 'asc' | 'desc'
} 