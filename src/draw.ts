import { Pixel } from './types';

const PIXEL_SIZE = 10;

export const SCENE_WIDTH = 80;
export const SCENE_HEIGHT = 30;

const CANVAS_WIDTH = SCENE_WIDTH * PIXEL_SIZE;
const CANVAS_HEIGHT = SCENE_HEIGHT * PIXEL_SIZE;

export function createCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;

  return canvas;
}

export function clear(ctx) {
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

export function drawPixels(ctx: CanvasRenderingContext2D, pixels: Pixel[]) {
  pixels.forEach(pixel => {
    ctx.fillStyle = 'black';
    const x = pixel.x * PIXEL_SIZE;
    const y = CANVAS_HEIGHT - (pixel.y + 1) * PIXEL_SIZE;
    ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
  });
}

export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size = 15,
  textAlign = 'center',
  fillStyle = 'black',
  font = 'Arial'
) {
  ctx.fillStyle = fillStyle;
  ctx.font = `${size}px ${font}`;
  ctx.textAlign = textAlign;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x, y);
}

export function renderGameOver(ctx: CanvasRenderingContext2D) {
  clear(ctx);

  drawText(ctx, 'GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20, 24);
  drawText(
    ctx,
    'Press UP key to play again',
    CANVAS_WIDTH / 2,
    CANVAS_HEIGHT / 2 + 20,
    10
  );
}

export function renderScores(ctx: CanvasRenderingContext2D, scores: number) {
  drawText(ctx, 'Your scores', CANVAS_WIDTH - 20, 20, 10, 'right');
  drawText(ctx, scores.toString(), CANVAS_WIDTH - 20, 35, 10, 'right');
}
