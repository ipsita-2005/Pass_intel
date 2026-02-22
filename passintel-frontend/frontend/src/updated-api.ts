import axios from 'axios'

const api = axios.create({
  baseURL: 'https://pass-intel.onrender.com',
  timeout: 30_000,
})

export interface AnalysisResult {
  strength: 'Weak' | 'Medium' | 'Strong'
  score: number
  entropy: number
  breached: boolean
  reasons: string[]
  suggested_password: string
}

export interface HistoryRecord {
  id: number
  strength: string
  score: number
  entropy: number
  breached: boolean
  created_at: string
}

export interface HistoryResponse {
  records: HistoryRecord[]
  total: number
  page: number
  page_size: number
}

export async function analyzePassword(password: string): Promise<AnalysisResult> {
  const { data } = await api.post<AnalysisResult>('/analyze', { password })
  return data
}

export async function getHistory(
  page = 1,
  pageSize = 10,
  sortBy: 'date' | 'strength' | 'score' = 'date'
): Promise<HistoryResponse> {
  const { data } = await api.get<HistoryResponse>('/history', {
    params: { page, page_size: pageSize, sort_by: sortBy },
  })
  return data
}
