export type Province = {
  id: number;
  code?: string;
  designation: string;
};

export type Commune = {
  id: number;
  code: string;
  designation: string;
  province: Province;
};

export type Severity = "success" | "error" | "warning" | "info";