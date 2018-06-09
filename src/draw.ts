import { Pixel } from './types';

const PIXEL_SIZE = 10;

export const SCENE_WIDTH = 80;
export const SCENE_HEIGHT = 60;

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

export function renderGameOver(ctx: CanvasRenderingContext2D) {
  clear(ctx);

  ctx.fillStyle = 'black';
  ctx.font = '15px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
}
