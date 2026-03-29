export type Banner = {
  id: number
  name: string
  image_filename_horizontal: string | null
  image_filename_vertical: string | null
  image_url_horizontal: string | null
  image_url_vertical: string | null
  link: string | null
  contact: string | null
  created_at: string | null
  updated_at: string | null
}

export type Sponsor = {
  id: number
  name: string
  image_filename: string
  image_url: string
  link: string | null
  contact: string | null
  created_at: string | null
  updated_at: string | null
}
