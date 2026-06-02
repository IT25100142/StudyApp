import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './db'
import type { HistoryEntry, SettingsKey } from './types'

export function useTasks() {
  const tasks = useLiveQuery(() => db.tasks.orderBy('id').reverse().toArray())

  const addTask = async (text: string) => {
    await db.tasks.add({ text, completed: false, createdAt: Date.now() })
  }

  const toggleTask = async (id: number) => {
    const task = await db.tasks.get(id)
    if (task) {
      await db.tasks.update(id, { completed: !task.completed })
    }
  }

  return {
    tasks: tasks ?? [],
    addTask,
    toggleTask,
    isLoading: tasks === undefined,
  }
}

export function useHistory() {
  const history = useLiveQuery(() => db.history.orderBy('id').reverse().toArray())

  const addEntry = async (entry: Omit<HistoryEntry, 'id'>) => {
    await db.history.add(entry)
  }

  const clearHistory = async () => {
    await db.history.clear()
  }

  return {
    history: history ?? [],
    addEntry,
    clearHistory,
    isLoading: history === undefined,
  }
}

export function useSettings() {
  const rows = useLiveQuery(() => db.settings.toArray())

  const dailyGoalMinutes = (rows?.find(r => r.key === 'dailyGoalMinutes')?.value as number) ?? 480
  const soundEnabled = (rows?.find(r => r.key === 'soundEnabled')?.value as boolean) ?? true

  const updateSetting = async (key: SettingsKey, value: number | boolean) => {
    await db.settings.put({ key, value })
  }

  return {
    dailyGoalMinutes,
    soundEnabled,
    updateSetting,
    isLoading: rows === undefined,
  }
}

function todayDateString(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function useTodayLog() {
  const dateString = todayDateString()
  const log = useLiveQuery(() => db.daily_logs.get(dateString))

  const incrementStudy = async () => {
    const existing = await db.daily_logs.get(dateString)
    if (existing) {
      await db.daily_logs.update(dateString, { studyMinutes: existing.studyMinutes + 1 })
    } else {
      await db.daily_logs.add({ dateString, studyMinutes: 1, breakMinutes: 0 })
    }
  }

  const incrementBreak = async () => {
    const existing = await db.daily_logs.get(dateString)
    if (existing) {
      await db.daily_logs.update(dateString, { breakMinutes: existing.breakMinutes + 1 })
    } else {
      await db.daily_logs.add({ dateString, studyMinutes: 0, breakMinutes: 1 })
    }
  }

  return {
    studyMinutes: log?.studyMinutes ?? 0,
    breakMinutes: log?.breakMinutes ?? 0,
    incrementStudy,
    incrementBreak,
    isLoading: log === undefined,
  }
}

export function useMonthLogs(month: number, year: number) {
  const logs = useLiveQuery(
    () => db.daily_logs
      .where('dateString')
      .between(
        `${year}-${String(month + 1).padStart(2, '0')}-`,
        `${year}-${String(month + 1).padStart(2, '0')}-\uffff`,
      )
      .toArray(),
    [month, year],
  )

  const totalMonthHours = (logs ?? []).reduce((sum, l) => sum + l.studyMinutes / 60, 0)
  const totalMonthSessions = logs?.reduce((sum, l) => sum + Math.floor(l.studyMinutes / 25), 0) ?? 0

  return {
    monthLogs: logs ?? [],
    totalMonthHours,
    totalMonthSessions,
    isLoading: logs === undefined,
  }
}
