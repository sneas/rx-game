import { clear, createCanvas, drawPixels } from "./draw";
import { fromEvent, interval, of } from "rxjs";
import { Pixel } from "./types";
import { filter, scan, startWith } from "rxjs/operators";
import { clean } from "./scene";

const canvas = createCanvas();
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

fromEvent(document, "keydown")
  .pipe(filter(e => e["keyCode"] === 38))
  .subscribe(event => {
    console.log(event);
  });

interval(50)
  .pipe(
    scan(
      (pixels: Pixel[], _: number) =>
        pixels.map(pixel => ({ ...pixel, y: pixel.y + 1 })),
      [
        { x: 2, y: 0, color: "black" },
        { x: 2, y: 1, color: "green" },
        { x: 2, y: 2, color: "blue" }
      ]
    )
  )
  .subscribe(pixels => {
    clear(ctx); // Fills the entire scene with blue rectangle
    drawPixels(ctx, pixels);
  });
