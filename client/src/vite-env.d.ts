/// <reference types="vite/client" />

// Enviromental Variables
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Error type handled in the slices
type ErrorType = {
  status: number;
  message: string;
};

// Slice types
type GenericType = {
  id: number;
  name: string;
};

type MunicipalityType = GenericType & {
  parishes: GenericType[];
};

type ParishType = GenericType & {
  municipality: GenericType;
  ccps: GenericType[];
};

type CCPType = GenericType & {
  parish: GenericType;
  quadrants: GenericType[];
};

type QuadrantType = GenericType & {
  ccp: GenericType;
};

type ReasonType = GenericType & {
  priority: number;
};

type RoleType = GenericType;

type UserType = Record<"id" | "username" | "fullname", string> & {
  role: RoleType;
};

type TicketType = {
  id: string;
  phone_number?: string;
  caller_name: string;
  id_number?: number;
  id_type: "V" | "E" | "J"; // enum type
  address: string;
  reference_point: string;
  details: string;
  call_started: Date;
  call_ended: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};
