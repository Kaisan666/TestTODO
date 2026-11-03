import { useFieldArray, type Control, type UseFormRegister } from 'react-hook-form'
import type { TaskFormValues } from '../lib/taskForm'
import { CloseIcon, PlusIcon } from './icons'

interface StepFieldsProps {
  control: Control<TaskFormValues>
  register: UseFormRegister<TaskFormValues>
}

export function StepFields({ control, register }: StepFieldsProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'steps' })

  return (
    <>
      {fields.length > 0 && (
        <ol className="step-fields">
          {fields.map((field, index) => (
            <li key={field.id} className="step-fields__item">
              <span className="step-fields__num">{index + 1})</span>
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
        className="btn btn--ghost btn--sm step-fields__add"
        onClick={() => append({ stepId: '', text: '' })}
      >
        <PlusIcon />
        Добавить пункт
      </button>
    </>
  )
}
