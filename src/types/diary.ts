export interface Diary {
  id: string
  user_id: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

export interface CreateDiaryData {
  title: string
  content: string
}

export interface UpdateDiaryData {
  title?: string
  content?: string
} 