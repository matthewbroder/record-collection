import type { Album } from '../types'
import { AlbumArtwork } from './AlbumArtwork'

interface AlbumCardProps {
  album: Album
  onOpen: (album: Album) => void
}

export function AlbumCard({ album, onOpen }: AlbumCardProps) {
  return (
    <article className="album-card">
      <button className="album-card-button" onClick={() => onOpen(album)} aria-label={`View ${album.title} by ${album.artist}`}>
        <div className="sleeve-wrap">
          <AlbumArtwork album={album} />
          <span className="vinyl-peek" aria-hidden="true" />
          {album.favorite && <span className="favorite-mark" aria-label="Favorite">★</span>}
        </div>
        <div className="album-card-copy">
          <h3>{album.title}</h3>
          <p>{album.artist}</p>
          <div className="album-meta">
            <span>{album.year}</span>
            <span>{album.format}</span>
            <span>{album.genres[0]}</span>
          </div>
        </div>
      </button>
    </article>
  )
}
