import { useEffect, useMemo, useReducer } from 'react'
import { createId } from '../lib/id'
import { writeJSON } from '../lib/storage'
import { loadTasks, tasksReducer } from '../lib/tasks'
import type { Step, StepDraft } from '../types'

const STORAGE_KEY = 'todo:tasks'

const createStep = (text: string): Step => ({ id: createId(), text, done: false })

export function useTasks() {
  const [tasks, dispatch] = useReducer(tasksReducer, STORAGE_KEY, loadTasks)

  useEffect(() => {
    writeJSON(STORAGE_KEY, tasks)
  }, [tasks])

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === null) {
        dispatch({ type: 'replace', tasks: loadTasks(STORAGE_KEY) })
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const actions = useMemo(
    () => ({
      addTask: (title: string, steps: string[]) =>
        dispatch({
          type: 'addTask',
          task: { id: createId(), title, done: false, steps: steps.map(createStep) },
        }),
      editTask: (id: string, title: string, steps: StepDraft[]) =>
        dispatch({
          type: 'editTask',
          id,
          title,
          steps: steps.map((s) => ({ id: s.id || createId(), text: s.text })),
        }),
      toggleTask: (id: string) => dispatch({ type: 'toggleTask', id }),
      removeTask: (id: string) => dispatch({ type: 'removeTask', id }),
      addStep: (taskId: string, text: string) =>
        dispatch({ type: 'addStep', taskId, step: createStep(text) }),
      toggleStep: (taskId: string, stepId: string) =>
        dispatch({ type: 'toggleStep', taskId, stepId }),
      removeStep: (taskId: string, stepId: string) =>
        dispatch({ type: 'removeStep', taskId, stepId }),
    }),
    [],
  )

  return { tasks, actions }
}

export type TaskActions = ReturnType<typeof useTasks>['actions']
