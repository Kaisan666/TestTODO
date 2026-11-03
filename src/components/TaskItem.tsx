import { useId, useState } from 'react'
import type { TaskActions } from '../hooks/useTasks'
import { cn } from '../lib/cn'
import type { Task } from '../types'
import { AddStepForm } from './AddStepForm'
import { Checkbox } from './Checkbox'
import { ChevronIcon, CloseIcon, TrashIcon } from './icons'

interface TaskItemProps {
  task: Task
  actions: TaskActions
}

export function TaskItem({ task, actions }: TaskItemProps) {
  const [open, setOpen] = useState(false)
  const bodyId = useId()

  const total = task.steps.length
  const doneCount = task.steps.filter((s) => s.done).length

  return (
    <li className={cn('task card', task.done && 'is-done', open && 'is-open')}>
      <div className="task__header">
        <Checkbox
          checked={task.done}
          onChange={() => actions.toggleTask(task.id)}
          label={`Выполнено: ${task.title}`}
        />

        <button
          type="button"
          className="task__toggle"
          aria-expanded={open}
          aria-controls={bodyId}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="task__title">{task.title}</span>
          {total > 0 && (
            <span className="task__meta" aria-label={`Выполнено пунктов: ${doneCount} из ${total}`}>
              {doneCount}/{total}
            </span>
          )}
          <span className="task__arrow" aria-hidden="true">
            <ChevronIcon />
          </span>
        </button>

        <button
          type="button"
          className="icon-btn icon-btn--danger"
          aria-label={`Удалить задачу «${task.title}»`}
          onClick={() => actions.removeTask(task.id)}
        >
          <TrashIcon />
        </button>
      </div>

      {total > 0 && (
        <span
          className="task__progress"
          style={{ width: `${(doneCount / total) * 100}%` }}
          aria-hidden="true"
        />
      )}

      <div className="task__body" id={bodyId} inert={!open}>
        <div className="task__body-inner">
          <div className="task__content">
            {total > 0 ? (
              <ol className="steps">
                {task.steps.map((step, index) => (
                  <li key={step.id} className={cn('step', step.done && 'is-done')}>
                    <Checkbox
                      size="sm"
                      checked={step.done}
                      onChange={() => actions.toggleStep(task.id, step.id)}
                    >
                      <span className="step__num">{index + 1})</span>
                      {step.text}
                    </Checkbox>
                    <button
                      type="button"
                      className="icon-btn icon-btn--sm icon-btn--danger step__remove"
                      aria-label={`Удалить пункт «${step.text}»`}
                      onClick={() => actions.removeStep(task.id, step.id)}
                    >
                      <CloseIcon />
                    </button>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="steps-empty">Пунктов пока нет — разбейте задачу на шаги</p>
            )}

            <AddStepForm onAdd={(text) => actions.addStep(task.id, text)} />
          </div>
        </div>
      </div>
    </li>
  )
}
