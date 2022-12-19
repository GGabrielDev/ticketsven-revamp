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
type MunicipalityType = {
  id: number;
  name: string;
  parishes: {
    id: number;
    name: string;
  }[];
};

type ParishType = {
  id: number;
  name: string;
  municipality: {
    id: number;
    name: string;
  };
  ccps: {
    id: number;
    name: string;
  }[];
};

type CCPType = {
  id: number;
  name: string;
  parish: {
    id: number;
    name: string;
  };
  quadrants: {
    id: number;
    name: string;
  }[];
};
