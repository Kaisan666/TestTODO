import { useForm } from 'react-hook-form'
import { cleanSteps, titleRules, type TaskFormValues } from '../lib/taskForm'
import { PlusIcon } from './icons'
import { StepFields } from './StepFields'

interface AddTaskFormProps {
  onAdd: (title: string, steps: string[]) => void
}

export function AddTaskForm({ onAdd }: AddTaskFormProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<TaskFormValues>({ defaultValues: { title: '', steps: [] } })

  const onSubmit = handleSubmit(({ title, steps }) => {
    onAdd(
      title.trim(),
      cleanSteps(steps).map((s) => s.text),
    )
    reset()
    setFocus('title')
  })

  return (
    <form className="composer card" onSubmit={onSubmit} noValidate>
      <div className="composer__row">
        <input
          className="field"
          placeholder="Что нужно сделать?"
          autoComplete="off"
          aria-label="Название задачи"
          aria-invalid={errors.title ? 'true' : 'false'}
          {...register('title', titleRules)}
        />
        <button type="submit" className="btn btn--primary">
          <PlusIcon />
          <span className="btn__text">Добавить</span>
        </button>
      </div>

      {errors.title && (
        <p className="form-error" role="alert">
          {errors.title.message}
        </p>
      )}

      <StepFields control={control} register={register} />
    </form>
  )
}
