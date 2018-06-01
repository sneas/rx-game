import { Pixel } from './types';

const PIXEL_SIZE = 10;

const SCENE_WIDTH = 80;
const SCENE_HEIGHT = 60;

export function createCanvas()  {
    const canvas = document.createElement('canvas');
    canvas.width = SCENE_WIDTH * PIXEL_SIZE;
    canvas.height = SCENE_HEIGHT * PIXEL_SIZE;

    return canvas;
}

export function drawPixels(ctx: CanvasRenderingContext2D, pixels: Pixel[]) {
    pixels.forEach(pixel => {
        ctx.fillStyle = 'black';
        const x = pixel.x * PIXEL_SIZE;
        const y = SCENE_HEIGHT * PIXEL_SIZE - pixel.y * PIXEL_SIZE;
        ctx.fillRect(x, y, PIXEL_SIZE, PIXEL_SIZE);
    });
}
