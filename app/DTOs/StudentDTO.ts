export interface CreateStudentDTO {
  name: string
  email: string
  registration: string
  birth_date: string
}

export interface UpdateStudentDTO {
  name?: string
  email?: string
  registration?: string
  birth_date?: string
}

export interface StudentResponseDTO {
  id: number
  name: string
  email: string
  registration: string
  birth_date: string
  created_at: string
  updated_at: string
}

export interface PaginatedStudentsDTO {
  data: StudentResponseDTO[]
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

export interface AllocateStudentDTO {
  student_id: number
  room_id: number
}