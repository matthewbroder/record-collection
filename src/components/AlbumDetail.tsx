import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import type { Album, PersonalRecordDetails, RecordCondition } from '../types'
import { AlbumArtwork } from './AlbumArtwork'

interface AlbumDetailProps {
  album: Album
  details?: PersonalRecordDetails
  onClose: () => void
  onSave: (albumId: string, details: PersonalRecordDetails) => void
}

const conditions: RecordCondition[] = ['Not graded', 'Mint', 'Near Mint', 'Very Good Plus', 'Very Good', 'Good']

function initialDetails(album: Album, details?: PersonalRecordDetails): PersonalRecordDetails {
  return details ?? {
    recordCondition: album.recordCondition,
    acquiredOn: album.acquiredOn ?? '',
    acquiredFrom: album.acquiredFrom ?? '',
    favorite: album.favorite,
    notes: '',
  }
}

export function AlbumDetail({ album, details, onClose, onSave }: AlbumDetailProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const [draft, setDraft] = useState<PersonalRecordDetails>(() => initialDetails(album, details))
  const [saved, setSaved] = useState(false)
  const releaseDisplay = album.releaseDate
    ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' })
        .format(new Date(`${album.releaseDate}T00:00:00Z`))
    : album.year.toString()

  useEffect(() => {
    setDraft(initialDetails(album, details))
    setSaved(false)
  }, [album.id])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [onClose])

  const update = <Key extends keyof PersonalRecordDetails>(key: Key, value: PersonalRecordDetails[Key]) => {
    setDraft((current) => ({ ...current, [key]: value }))
    setSaved(false)
  }

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSave(album.id, draft)
    setSaved(true)
  }

  return (
    <div className="detail-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="album-detail" role="dialog" aria-modal="true" aria-labelledby="album-detail-title">
        <button ref={closeRef} className="close-button" onClick={onClose} aria-label="Close album details">
          <span aria-hidden="true">×</span>
        </button>
        <div className="detail-art-column">
          <AlbumArtwork album={album} large />
          <div className="sample-stamp">From the collection</div>
        </div>
        <div className="detail-copy">
          <h2 id="album-detail-title">{album.title}</h2>
          <p className="detail-artist">{album.artist}</p>

          <dl className="detail-facts essential-facts">
            <div><dt>Released</dt><dd>{releaseDisplay}</dd></div>
            <div><dt>Genre</dt><dd>{album.genres.join(', ')}</dd></div>
            <div><dt>Style</dt><dd>{album.styles.join(', ')}</dd></div>
            <div><dt>Label</dt><dd>{album.label}</dd></div>
            <div><dt>Format</dt><dd>{album.format}</dd></div>
          </dl>

          <form className="personal-form" onSubmit={save}>
            <div className="personal-form-heading">
              <div>
                <p className="eyebrow">My copy</p>
                <h3>Personal details</h3>
              </div>
              <label className="favorite-toggle">
                <input
                  type="checkbox"
                  checked={draft.favorite}
                  onChange={(event) => update('favorite', event.target.checked)}
                />
                <span aria-hidden="true">★</span>
                Favorite
              </label>
            </div>

            <div className="personal-fields">
              <label>
                <span>Vinyl condition</span>
                <select
                  value={draft.recordCondition}
                  onChange={(event) => update('recordCondition', event.target.value as RecordCondition)}
                >
                  {conditions.map((condition) => <option key={condition}>{condition}</option>)}
                </select>
              </label>
              <label>
                <span>Acquired on</span>
                <input
                  type="date"
                  value={draft.acquiredOn}
                  onChange={(event) => update('acquiredOn', event.target.value)}
                />
              </label>
              <label className="wide-field">
                <span>Acquired from</span>
                <input
                  type="text"
                  value={draft.acquiredFrom}
                  onChange={(event) => update('acquiredFrom', event.target.value)}
                  placeholder="Record shop, gift, flea market…"
                />
              </label>
              <label className="wide-field">
                <span>Notes</span>
                <textarea
                  value={draft.notes}
                  onChange={(event) => update('notes', event.target.value)}
                  placeholder="Memories, favorite tracks, or anything worth remembering…"
                  rows={3}
                />
              </label>
            </div>

            <div className="personal-form-actions">
              <button type="submit">Save details</button>
              <p aria-live="polite">{saved ? 'Saved on this device.' : 'Private to this browser.'}</p>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
