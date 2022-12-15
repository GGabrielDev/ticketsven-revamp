/// <reference types="vite/client" />

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
