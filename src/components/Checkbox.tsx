import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import { CheckIcon } from './icons'

interface CheckboxProps {
  checked: boolean
  onChange: () => void
  /** Подпись для скринридеров, если видимого текста рядом нет */
  label?: string
  size?: 'md' | 'sm'
  children?: ReactNode
}

export function Checkbox({ checked, onChange, label, size = 'md', children }: CheckboxProps) {
  return (
    <label className={cn('check', size === 'sm' && 'check--sm')}>
      <input
        type="checkbox"
        className="check__input"
        checked={checked}
        onChange={onChange}
        aria-label={label}
      />
      <span className="check__box" aria-hidden="true">
        <CheckIcon />
      </span>
      {children && <span className="check__label">{children}</span>}
    </label>
  )
}
