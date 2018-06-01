import { createCanvas, drawPixels } from './draw';
import { of } from 'rxjs/index';
import { Pixel } from './types';

const canvas = createCanvas();
const ctx = canvas.getContext('2d');

document.body.appendChild(canvas);

of<Pixel[]>([{x: 2, y: 0}, {x: 2, y: 1}, {x: 2, y: 2}])
    .subscribe((pixels) => {
        drawPixels(ctx, pixels);
    });
