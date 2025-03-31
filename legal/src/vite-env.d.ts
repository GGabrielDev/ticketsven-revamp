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

type Roles = "operator" | "dispatcher" | "supervisor" | "legal" | "admin"

// Slice types
type GenericType = Record<"id" | "name", string>

type RoleType = GenericType & { name: Roles }

type UserType = Record<"id" | "username" | "fullname", string> & {
  roles: RoleType[]
}
