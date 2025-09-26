export interface CreateTeacherDTO {
  name: string
  email: string
  registration: string
  birth_date: string
}

export interface UpdateTeacherDTO {
  name?: string
  email?: string
  registration?: string
  birth_date?: string
}

export interface TeacherResponseDTO {
  id: number
  name: string
  email: string
  registration: string
  birth_date: string
  created_at: string
  updated_at: string
}

export interface PaginatedTeachersDTO {
  data: TeacherResponseDTO[]
  meta: {
    total: number
    per_page: number
    current_page: number
    last_page: number
    first_page: number
    first_page_url: string
    last_page_url: string
    next_page_url: string | null
    previous_page_url: string | null
  }
}