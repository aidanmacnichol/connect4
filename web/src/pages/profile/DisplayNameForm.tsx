import { useState, type FormEvent } from 'react'
import { ClayButton } from '../../components/ClayButton'
import { updateDisplayName } from '../../shared/api/auth'
import type { User } from '../../shared/api/auth'

type DisplayNameFormProps = {
  initialValue?: string
  submitLabel?: string
  onSaved: (user: User) => void
}

export function DisplayNameForm({
  initialValue = '',
  submitLabel = 'Save display name',
  onSaved,
}: DisplayNameFormProps) {
  const [value, setValue] = useState(initialValue)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const user = await updateDisplayName(value.trim())
      onSaved(user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form className="display-name-form" onSubmit={(e) => void onSubmit(e)}>
      <label className="display-name-form__label" htmlFor="display-name">
        Display name
      </label>
      <input
        id="display-name"
        className="display-name-form__input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        autoComplete="nickname"
        autoFocus
        maxLength={24}
        minLength={2}
        required
        placeholder="e.g. DiscMaster"
        disabled={saving}
      />
      <p className="display-name-form__hint">2–24 characters. This is how other players see you.</p>
      {error ? <p className="display-name-form__error" role="alert">{error}</p> : null}
      <ClayButton type="submit" variant="primary" disabled={saving || value.trim().length < 2}>
        {saving ? 'Saving…' : submitLabel}
      </ClayButton>
    </form>
  )
}
