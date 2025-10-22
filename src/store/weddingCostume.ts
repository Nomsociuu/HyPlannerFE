export interface Style {
  _id: string;
  name: string;
  image: string;
  description?: string;
}

export interface Material {
  _id: string;
  name: string;
  image: string;
  description?: string;
}

export interface Neckline {
  _id: string;
  name: string;
  image: string;
  description?: string;
}

export interface Detail {
  _id: string;
  name: string;
  image: string;
  description?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
