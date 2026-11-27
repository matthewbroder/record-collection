import { useEffect, useMemo, useState } from 'react'
import { AlbumCard } from './components/AlbumCard'
import { AlbumDetail } from './components/AlbumDetail'
import { catalog } from './data/catalog'
import type { Album, PersonalRecordDetails } from './types'

type SortOption = 'artist' | 'title' | 'year-new' | 'year-old' | 'recent'

const albums = catalog.records
const genres = ['All genres', ...Array.from(new Set(albums.flatMap((album) => album.genres))).sort()]
const personalDetailsStorageKey = 'the-listening-room-personal-details-v1'

function albumIdFromHash(): string | null {
  const match = window.location.hash.match(/^#\/album\/(.+)$/)
  return match ? decodeURIComponent(match[1]) : null
}

function loadPersonalDetails(): Record<string, PersonalRecordDetails> {
  try {
    const stored = window.localStorage.getItem(personalDetailsStorageKey)
    return stored ? JSON.parse(stored) as Record<string, PersonalRecordDetails> : {}
  } catch {
    return {}
  }
}

export default function App() {
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState('All genres')
  const [sort, setSort] = useState<SortOption>('artist')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(() => albumIdFromHash())
  const [personalDetails, setPersonalDetails] = useState<Record<string, PersonalRecordDetails>>(loadPersonalDetails)

  useEffect(() => {
    const syncHash = () => setSelectedAlbumId(albumIdFromHash())
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [])

  const personalizedAlbums = useMemo(() => albums.map((album) => {
    const details = personalDetails[album.id]
    if (!details) return album
    return {
      ...album,
      recordCondition: details.recordCondition,
      acquiredOn: details.acquiredOn || undefined,
      acquiredFrom: details.acquiredFrom || undefined,
      favorite: details.favorite,
      notes: details.notes || undefined,
    }
  }), [personalDetails])

  const selectedAlbum = personalizedAlbums.find((album) => album.id === selectedAlbumId) ?? null

  const filteredAlbums = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase()
    return personalizedAlbums
      .filter((album) => {
        const searchable = [album.title, album.artist, album.label, album.year, ...album.genres, ...album.styles, ...album.tags]
          .join(' ')
          .toLocaleLowerCase()
        return (!needle || searchable.includes(needle))
          && (genre === 'All genres' || album.genres.includes(genre))
          && (!favoritesOnly || album.favorite)
      })
      .sort((a, b) => {
        if (sort === 'title') return a.title.localeCompare(b.title)
        if (sort === 'year-new') return b.year - a.year
        if (sort === 'year-old') return a.year - b.year
        if (sort === 'recent') return (b.acquiredOn ?? '').localeCompare(a.acquiredOn ?? '')
        return a.artist.localeCompare(b.artist)
      })
  }, [query, genre, sort, favoritesOnly, personalizedAlbums])

  const openAlbum = (album: Album) => {
    window.location.hash = `/album/${encodeURIComponent(album.id)}`
  }

  const closeAlbum = () => {
    if (window.location.hash.startsWith('#/album/')) history.pushState(null, '', `${window.location.pathname}${window.location.search}`)
    setSelectedAlbumId(null)
  }

  const savePersonalDetails = (albumId: string, details: PersonalRecordDetails) => {
    setPersonalDetails((current) => {
      const next = { ...current, [albumId]: details }
      window.localStorage.setItem(personalDetailsStorageKey, JSON.stringify(next))
      return next
    })
  }

  const resetFilters = () => {
    setQuery('')
    setGenre('All genres')
    setFavoritesOnly(false)
  }

  return (
    <>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="The Listening Room home">
          <span className="brand-mark" aria-hidden="true"><i /></span>
          <span>The Listening Room</span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#collection">Collection</a>
          <a href="#about">About</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="sample-pill">Personal collection · {albums.length} records</div>
            <p className="eyebrow">A personal vinyl archive</p>
            <h1 id="hero-title">Records worth<br /><em>remembering.</em></h1>
            <p className="hero-intro">A quiet place for the records, stories, and small details that make a collection personal.</p>
            <a className="text-link" href="#collection">Browse the collection</a>
          </div>
          <div className="turntable" aria-hidden="true">
            <div className="deck-controls"><span /><span /></div>
            <div className="platter"><div className="record"><div className="record-label">PLAY<br /><small>33⅓</small></div></div></div>
            <div className="tonearm"><span /></div>
            <div className="deck-wordmark">stereo transcription system</div>
          </div>
          <div className="hero-index" aria-hidden="true"><span>33</span><small>RPM</small></div>
        </section>

        <section className="collection-section" id="collection" aria-labelledby="collection-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">On the shelves</p>
              <h2 id="collection-title">The collection</h2>
            </div>
            <p className="collection-count"><strong>{filteredAlbums.length}</strong> of {albums.length} records</p>
          </div>

          <div className="catalog-tools" aria-label="Catalog filters">
            <label className="search-field">
              <span className="visually-hidden">Search the collection</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></svg>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search artist, album, label…" type="search" />
            </label>
            <label className="select-field">
              <span className="visually-hidden">Filter by genre</span>
              <select value={genre} onChange={(event) => setGenre(event.target.value)}>
                {genres.map((option) => <option key={option}>{option}</option>)}
              </select>
            </label>
            <label className="select-field sort-field">
              <span className="visually-hidden">Sort collection</span>
              <select value={sort} onChange={(event) => setSort(event.target.value as SortOption)}>
                <option value="artist">Artist A–Z</option>
                <option value="title">Album A–Z</option>
                <option value="year-new">Newest release</option>
                <option value="year-old">Oldest release</option>
                <option value="recent">Recently added</option>
              </select>
            </label>
            <button className={`favorite-filter${favoritesOnly ? ' active' : ''}`} onClick={() => setFavoritesOnly((value) => !value)} aria-pressed={favoritesOnly}>
              <span aria-hidden="true">★</span> Favorites
            </button>
          </div>

          {filteredAlbums.length > 0 ? (
            <div className="album-grid">
              {filteredAlbums.map((album) => <AlbumCard album={album} key={album.id} onOpen={openAlbum} />)}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-record" aria-hidden="true" />
              <h3>No records in this groove.</h3>
              <p>Try another search or clear the filters.</p>
              <button onClick={resetFilters}>Clear filters</button>
            </div>
          )}
        </section>

        <section className="about-section" id="about">
          <div className="about-number">33⅓</div>
          <div>
            <p className="eyebrow">About this room</p>
            <h2>Every sleeve has<br />a story to tell.</h2>
          </div>
          <div className="about-copy">
            <p>This collection keeps the essentials up front: cover, artist, title, release, genre, label, and format.</p>
            <p>Open any album to add condition, acquisition details, favorite status, and personal notes. Those details are saved privately in this browser.</p>
          </div>
        </section>
      </main>

      <footer>
        <div className="brand footer-brand"><span className="brand-mark" aria-hidden="true"><i /></span><span>The Listening Room</span></div>
        <p>Built for slow listening.</p>
        <p className="sample-footer">Personal details stay on this device.</p>
      </footer>

      {selectedAlbum && (
        <AlbumDetail
          album={selectedAlbum}
          details={personalDetails[selectedAlbum.id]}
          onClose={closeAlbum}
          onSave={savePersonalDetails}
        />
      )}
    </>
  )
}
