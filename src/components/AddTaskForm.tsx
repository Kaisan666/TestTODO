import { useFieldArray, useForm } from 'react-hook-form'
import { CloseIcon, PlusIcon } from './icons'

interface FormValues {
  title: string
  steps: { text: string }[]
}

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
  } = useForm<FormValues>({ defaultValues: { title: '', steps: [] } })
  const { fields, append, remove } = useFieldArray({ control, name: 'steps' })

  const onSubmit = handleSubmit(({ title, steps }) => {
    // Пустые пункты молча отбрасываем, чтобы не ругаться на случайно добавленное поле
    onAdd(
      title.trim(),
      steps.map((s) => s.text.trim()).filter(Boolean),
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
          {...register('title', {
            validate: (value) => value.trim().length > 0 || 'Введите название задачи',
            maxLength: { value: 120, message: 'Название не длиннее 120 символов' },
          })}
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

      {fields.length > 0 && (
        <ol className="composer__steps">
          {fields.map((field, index) => (
            <li key={field.id} className="composer__step">
              <span className="composer__num">{index + 1})</span>
              <input
                className="field field--sm"
                placeholder={`Пункт ${index + 1}`}
                autoComplete="off"
                aria-label={`Пункт ${index + 1}`}
                {...register(`steps.${index}.text` as const)}
              />
              <button
                type="button"
                className="icon-btn"
                aria-label={`Убрать пункт ${index + 1}`}
                onClick={() => remove(index)}
              >
                <CloseIcon />
              </button>
            </li>
          ))}
        </ol>
      )}

      <button
        type="button"
        className="btn btn--ghost btn--sm composer__add-step"
        onClick={() => append({ text: '' })}
      >
        <PlusIcon />
        Добавить пункт
      </button>
    </form>
  )
}
