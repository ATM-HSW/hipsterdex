export enum Type {
  Grass = 'grass',
  Poison = 'poison',
}

type Name = {
  de: string;
  en: string;
  fr: string;
  ja: string;
  kr: string;
  zh: string;
};

export type Pokemon = {
  dex: number;
  name: Name;
  types: Type[];
  shiny_released: boolean;
  family: string;
};
