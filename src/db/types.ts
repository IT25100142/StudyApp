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
  estimatedPomodoros: number
  actualPomodoros: number
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
  notes?: string
  mood?: string
}

export type SettingsKey = 'dailyGoalMinutes' | 'soundEnabled' | 'targetSessionsPerCycle' | 'longBreakDurationMinutes' | 'ambientTrack' | 'ambientVolume'

export interface SettingsRow {
  key: SettingsKey
  value: number | boolean | string
}
