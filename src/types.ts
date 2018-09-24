export type Pixel = {
  x: number;
  y: number;
  color: string;
};

export type Scene = {
  actor: Pixel[];
  obstacles: Pixel[][];
  scores: number;
};
