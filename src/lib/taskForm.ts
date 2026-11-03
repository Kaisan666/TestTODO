import type { RegisterOptions } from 'react-hook-form'

export interface TaskFormValues {
  title: string
  steps: { stepId: string; text: string }[]
}

export const titleRules = {
  validate: (value: string) => value.trim().length > 0 || 'Введите название задачи',
  maxLength: { value: 120, message: 'Название не длиннее 120 символов' },
} satisfies RegisterOptions<TaskFormValues, 'title'>

export const cleanSteps = (steps: TaskFormValues['steps']) =>
  steps.map((s) => ({ id: s.stepId, text: s.text.trim() })).filter((s) => s.text)
