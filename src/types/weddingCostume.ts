export interface Style {
  id: string;
  name: string;
  image: string;
  description?: string;
}

export interface Material {
  id: string;
  name: string;
  image: string;
  description?: string;
}

export interface Neckline {
  id: string;
  name: string;
  image: string;
  description?: string;
}

export interface Flower {
  id: string;
  name: string;
  image: string;
  description?: string;
}

export interface WeddingDress {
  id: string;
  style?: Style;
  material?: Material;
  neckline?: Neckline;
  flowers?: Flower[];
  price?: number;
  image?: string;
  description?: string;
}
