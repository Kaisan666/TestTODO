import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { cleanSteps, titleRules, type TaskFormValues } from '../lib/taskForm'
import type { StepDraft, Task } from '../types'
import { StepFields } from './StepFields'

interface EditTaskFormProps {
  task: Task
  onSave: (title: string, steps: StepDraft[]) => void
  onCancel: () => void
}

export function EditTaskForm({ task, onSave, onCancel }: EditTaskFormProps) {
  const {
    register,
    control,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<TaskFormValues>({
    defaultValues: {
      title: task.title,
      steps: task.steps.map((s) => ({ stepId: s.id, text: s.text })),
    },
  })

  useEffect(() => {
    setFocus('title', { shouldSelect: true })
  }, [setFocus])

  const onSubmit = handleSubmit(({ title, steps }) => onSave(title.trim(), cleanSteps(steps)))

  return (
    <form
      className="task-edit"
      onSubmit={onSubmit}
      onKeyDown={(e) => e.key === 'Escape' && onCancel()}
      noValidate
    >
      <input
        className="field"
        autoComplete="off"
        aria-label="Название задачи"
        aria-invalid={errors.title ? 'true' : 'false'}
        {...register('title', titleRules)}
      />

      {errors.title && (
        <p className="form-error" role="alert">
          {errors.title.message}
        </p>
      )}

      <StepFields control={control} register={register} />

      <div className="task-edit__actions">
        <button type="button" className="btn btn--plain btn--sm" onClick={onCancel}>
          Отмена
        </button>
        <button type="submit" className="btn btn--primary btn--sm">
          Сохранить
        </button>
      </div>
    </form>
  )
}
