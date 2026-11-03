import type { Step, StepDraft, Task } from '../types'
import { readJSON } from './storage'

export type TaskAction =
  | { type: 'replace'; tasks: Task[] }
  | { type: 'addTask'; task: Task }
  | { type: 'editTask'; id: string; title: string; steps: StepDraft[] }
  | { type: 'toggleTask'; id: string }
  | { type: 'removeTask'; id: string }
  | { type: 'addStep'; taskId: string; step: Step }
  | { type: 'toggleStep'; taskId: string; stepId: string }
  | { type: 'removeStep'; taskId: string; stepId: string }

function syncDone(task: Task): Task {
  return task.steps.length > 0 ? { ...task, done: task.steps.every((s) => s.done) } : task
}

function updateTask(tasks: Task[], id: string, update: (task: Task) => Task) {
  return tasks.map((task) => (task.id === id ? update(task) : task))
}

export function tasksReducer(tasks: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case 'replace':
      return action.tasks
    case 'addTask':
      return [action.task, ...tasks]
    case 'editTask':
      return updateTask(tasks, action.id, (task) => {
        const doneById = new Map(task.steps.map((s) => [s.id, s.done]))
        return syncDone({
          ...task,
          title: action.title,
          steps: action.steps.map((s) => ({ ...s, done: doneById.get(s.id) ?? false })),
        })
      })
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

export function loadTasks(key: string): Task[] {
  const data = readJSON<unknown>(key, [])
  return Array.isArray(data) ? data.filter(isTask) : []
}
