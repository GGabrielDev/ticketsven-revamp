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
