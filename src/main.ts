import { clear, createCanvas, drawPixels } from "./draw";
import { fromEvent, of } from "rxjs";
import { Pixel } from "./types";
import { filter, scan, startWith } from "rxjs/operators";
import { clean } from "./scene";

const canvas = createCanvas();
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

fromEvent(document, "keydown")
  .pipe(
    filter(e => e["keyCode"] === 38),
    scan(
      (pixels: Pixel[], _: Event) =>
        pixels.map(pixel => ({ ...pixel, y: pixel.y + 1 })),
      [
        { x: 2, y: 0, color: "black" },
        { x: 2, y: 1, color: "green" },
        { x: 2, y: 2, color: "blue" }
      ]
    )
  )
  .subscribe(pixels => {
    clear(ctx);
    drawPixels(ctx, pixels);
  });
