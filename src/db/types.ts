export interface CategoryItem {
  id?: number
  name: string
  color: string
}

export interface TaskItem {
  id?: number
  text: string
  completed: boolean
  createdAt: number
  categoryId?: number
}

export interface HistoryEntry {
  id?: number
  timestamp: string
  type: 'study' | 'break'
  durationMinutes: number
  categoryId?: number
}

export interface DailyLog {
  dateString: string
  studyMinutes: number
  breakMinutes: number
}

export type SettingsKey = 'dailyGoalMinutes' | 'soundEnabled'

export interface SettingsRow {
  key: SettingsKey
  value: number | boolean
}
