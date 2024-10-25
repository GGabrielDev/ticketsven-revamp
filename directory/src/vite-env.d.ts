/// <reference types="vite/client" />
///// <reference types="vite/client" />

// Enviromental Variables
interface ImportMetaEnv {
  readonly VITE_API_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Error type handled in the slices
type ErrorType = {
  status: number
  message: string
}

// Slice types
type GenericType = Record<"id" | "name", string>

type RoleType = GenericType

type UserType = Record<"id" | "username" | "fullname", string> & {
  roles: RoleType[]
}
