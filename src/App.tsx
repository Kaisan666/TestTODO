import { AddTaskForm } from './components/AddTaskForm'
import { ListIcon } from './components/icons'
import { TaskItem } from './components/TaskItem'
import { useTasks } from './hooks/useTasks'
import './App.css'

const today = new Intl.DateTimeFormat('ru-RU', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
}).format(new Date())

export default function App() {
  const { tasks, actions } = useTasks()

  const doneCount = tasks.filter((t) => t.done).length

  return (
    <main className="app">
      <header className="hero">
        <div>
          <p className="hero__date">{today}</p>
          <h1 className="hero__title">
            Мои <span className="hero__mark">задачи</span>
          </h1>
        </div>
        <div className="hero__stats">
          <span className="stat">
            <b>{tasks.length - doneCount}</b> в работе
          </span>
          <span className="stat stat--accent">
            <b>{doneCount}</b> готово
          </span>
        </div>
      </header>

      <AddTaskForm onAdd={actions.addTask} />

      {tasks.length > 0 ? (
        <ul className="task-list">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} actions={actions} />
          ))}
        </ul>
      ) : (
        <div className="empty">
          <span className="empty__icon">
            <ListIcon />
          </span>
          <p className="empty__title">Задач пока нет</p>
          <p className="empty__text">Добавьте первую — и разбейте её на пункты</p>
        </div>
      )}
    </main>
  )
}
