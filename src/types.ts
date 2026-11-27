/**
 * The public catalog model. It intentionally mirrors the stable concepts in
 * Discogs without coupling the UI to a raw API response.
 */
export type Format = 'LP' | '2×LP' | '7″' | '12″' | 'Box Set'
export type RecordCondition = 'Mint' | 'Near Mint' | 'Very Good Plus' | 'Very Good' | 'Good' | 'Not graded'
export type CoverCondition = RecordCondition

export interface PersonalRecordDetails {
  recordCondition: RecordCondition
  acquiredOn: string
  acquiredFrom: string
  favorite: boolean
  notes: string
}

export interface AlbumImage {
  uri: string
  width?: number
  height?: number
  source: 'discogs' | 'musicbrainz' | 'local' | 'generated'
}

export interface Album {
  /** Stable internal ID. Do not use array position as identity. */
  id: string
  artist: string
  title: string
  year: number
  releaseDate?: string
  genres: string[]
  styles: string[]
  label: string
  catalogNumber?: string
  country?: string
  format: Format
  pressing?: string
  recordCondition: RecordCondition
  coverCondition: CoverCondition
  acquiredOn?: string
  acquiredFrom?: string
  notes?: string
  tags: string[]
  favorite: boolean
  image?: AlbumImage
  /** Present after a future Discogs import. */
  discogs?: {
    releaseId: number
    masterId?: number
    collectionInstanceId?: number
    lastSyncedAt: string
  }
  musicbrainz?: {
    releaseGroupId: string
    lastVerifiedAt: string
  }
  /** Keeps demo records unmistakable in the UI and data layer. */
  isSample: boolean
  /** Palette drives the placeholder sleeve until real art is synced. */
  artwork: {
    palette: [string, string, string]
    motif: 'orbit' | 'strata' | 'sun' | 'grid' | 'wave' | 'type'
  }
}

export interface CatalogSnapshot {
  schemaVersion: 1
  generatedAt: string
  source: 'sample' | 'manual' | 'discogs-export'
  ownerDisplayName: string
  records: Album[]
}
