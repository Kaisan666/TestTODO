import { useForm } from 'react-hook-form'
import { PlusIcon } from './icons'

interface FormValues {
  text: string
}

interface AddStepFormProps {
  onAdd: (text: string) => void
}

export function AddStepForm({ onAdd }: AddStepFormProps) {
  const { register, handleSubmit, reset } = useForm<FormValues>({ defaultValues: { text: '' } })

  const onSubmit = handleSubmit(({ text }) => {
    onAdd(text.trim())
    reset()
  })

  return (
    <form className="step-form" onSubmit={onSubmit} noValidate>
      <input
        className="field field--sm"
        placeholder="Новый пункт…"
        autoComplete="off"
        aria-label="Новый пункт"
        {...register('text', { validate: (value) => value.trim().length > 0 })}
      />
      <button type="submit" className="btn btn--soft btn--square" aria-label="Добавить пункт">
        <PlusIcon />
      </button>
    </form>
  )
}
