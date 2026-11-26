import type { Album } from '../types'

interface AlbumArtworkProps {
  album: Album
  large?: boolean
}

export function AlbumArtwork({ album, large = false }: AlbumArtworkProps) {
  if (album.image?.uri) {
    return <img className="album-artwork image-artwork" src={album.image.uri} alt={`${album.title} cover`} />
  }

  const [first, second, accent] = album.artwork.palette
  return (
    <div
      className={`album-artwork generated-artwork motif-${album.artwork.motif}${large ? ' artwork-large' : ''}`}
      style={{ '--art-1': first, '--art-2': second, '--art-3': accent } as React.CSSProperties}
      role="img"
      aria-label={`Abstract placeholder artwork for ${album.title}`}
    >
      <span className="art-shape" />
      <span className="art-line" />
      <span className="art-copy">
        <strong>{album.title}</strong>
        <small>{album.artist}</small>
      </span>
    </div>
  )
}
