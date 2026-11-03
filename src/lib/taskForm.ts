import type { RegisterOptions } from 'react-hook-form'

// Общая форма задачи: и для создания, и для редактирования
export interface TaskFormValues {
  title: string
  // Пустой stepId — новый пункт. Поле не называем id: его занимает useFieldArray
  steps: { stepId: string; text: string }[]
}

export const titleRules = {
  validate: (value: string) => value.trim().length > 0 || 'Введите название задачи',
  maxLength: { value: 120, message: 'Название не длиннее 120 символов' },
} satisfies RegisterOptions<TaskFormValues, 'title'>

// Пустые пункты молча отбрасываем, чтобы не ругаться на случайно добавленное поле
export const cleanSteps = (steps: TaskFormValues['steps']) =>
  steps.map((s) => ({ id: s.stepId, text: s.text.trim() })).filter((s) => s.text)
