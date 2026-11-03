export interface Step {
  id: string
  text: string
  done: boolean
}

export interface Task {
  id: string
  title: string
  done: boolean
  steps: Step[]
}

/** Пункт из формы редактирования: пустой id — новый пункт */
export type StepDraft = Pick<Step, 'id' | 'text'>
