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

export type StepDraft = Pick<Step, 'id' | 'text'>
