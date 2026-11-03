import { useEffect, useMemo, useReducer } from 'react'
import { readJSON, writeJSON } from '../lib/storage'
import type { Step, Task } from '../types'

const STORAGE_KEY = 'todo:tasks'

type Action =
  | { type: 'addTask'; task: Task }
  | { type: 'toggleTask'; id: string }
  | { type: 'removeTask'; id: string }
  | { type: 'addStep'; taskId: string; step: Step }
  | { type: 'toggleStep'; taskId: string; stepId: string }
  | { type: 'removeStep'; taskId: string; stepId: string }

// Задача с пунктами считается выполненной, когда выполнены все её пункты
function syncDone(task: Task): Task {
  return task.steps.length > 0 ? { ...task, done: task.steps.every((s) => s.done) } : task
}

function updateTask(tasks: Task[], id: string, update: (task: Task) => Task) {
  return tasks.map((task) => (task.id === id ? update(task) : task))
}

function reducer(tasks: Task[], action: Action): Task[] {
  switch (action.type) {
    case 'addTask':
      return [action.task, ...tasks]
    case 'toggleTask':
      return updateTask(tasks, action.id, (task) => {
        const done = !task.done
        return { ...task, done, steps: task.steps.map((s) => ({ ...s, done })) }
      })
    case 'removeTask':
      return tasks.filter((task) => task.id !== action.id)
    case 'addStep':
      return updateTask(tasks, action.taskId, (task) =>
        syncDone({ ...task, steps: [...task.steps, action.step] }),
      )
    case 'toggleStep':
      return updateTask(tasks, action.taskId, (task) =>
        syncDone({
          ...task,
          steps: task.steps.map((s) => (s.id === action.stepId ? { ...s, done: !s.done } : s)),
        }),
      )
    case 'removeStep':
      return updateTask(tasks, action.taskId, (task) =>
        syncDone({ ...task, steps: task.steps.filter((s) => s.id !== action.stepId) }),
      )
  }
}

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isStep = (value: unknown): value is Step =>
  isObject(value) &&
  typeof value.id === 'string' &&
  typeof value.text === 'string' &&
  typeof value.done === 'boolean'

const isTask = (value: unknown): value is Task =>
  isObject(value) &&
  typeof value.id === 'string' &&
  typeof value.title === 'string' &&
  typeof value.done === 'boolean' &&
  Array.isArray(value.steps) &&
  value.steps.every(isStep)

// В localStorage могут лежать устаревшие или повреждённые данные — берём только валидные задачи
function loadTasks(key: string): Task[] {
  const data = readJSON<unknown>(key, [])
  return Array.isArray(data) ? data.filter(isTask) : []
}

const createStep = (text: string): Step => ({ id: crypto.randomUUID(), text, done: false })

export function useTasks() {
  const [tasks, dispatch] = useReducer(reducer, STORAGE_KEY, loadTasks)

  useEffect(() => {
    writeJSON(STORAGE_KEY, tasks)
  }, [tasks])

  const actions = useMemo(
    () => ({
      addTask: (title: string, steps: string[]) =>
        dispatch({
          type: 'addTask',
          task: { id: crypto.randomUUID(), title, done: false, steps: steps.map(createStep) },
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
