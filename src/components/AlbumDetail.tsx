import { useEffect, useRef } from 'react'
import type { Album } from '../types'
import { AlbumArtwork } from './AlbumArtwork'

interface AlbumDetailProps {
  album: Album
  onClose: () => void
}

export function AlbumDetail({ album, onClose }: AlbumDetailProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

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

  return (
    <div className="detail-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="album-detail" role="dialog" aria-modal="true" aria-labelledby="album-detail-title">
        <button ref={closeRef} className="close-button" onClick={onClose} aria-label="Close album details">
          <span aria-hidden="true">×</span>
        </button>
        <div className="detail-art-column">
          <AlbumArtwork album={album} large />
          <div className="sample-stamp">Sample catalog entry</div>
        </div>
        <div className="detail-copy">
          <p className="eyebrow">{album.label} · {album.catalogNumber}</p>
          <h2 id="album-detail-title">{album.title}</h2>
          <p className="detail-artist">{album.artist}</p>
          <p className="detail-notes">{album.notes ?? 'A sample record ready for your own listening notes.'}</p>
          <dl className="detail-facts">
            <div><dt>Released</dt><dd>{album.year}{album.country ? ` · ${album.country}` : ''}</dd></div>
            <div><dt>Format</dt><dd>{album.format}{album.pressing ? ` · ${album.pressing}` : ''}</dd></div>
            <div><dt>Style</dt><dd>{album.styles.join(', ')}</dd></div>
            <div><dt>Media</dt><dd>{album.recordCondition}</dd></div>
            <div><dt>Sleeve</dt><dd>{album.coverCondition}</dd></div>
            {album.acquiredFrom && <div><dt>Found at</dt><dd>{album.acquiredFrom}</dd></div>}
          </dl>
          <div className="tag-row" aria-label="Tags">
            {album.tags.map((tag) => <span key={tag}>{tag}</span>)}
          </div>
        </div>
      </section>
    </div>
  )
}
