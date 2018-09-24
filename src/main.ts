import { clear, createCanvas, drawPixels } from "./draw";
import { fromEvent, interval, of, zip } from "rxjs";
import { Pixel } from "./types";
import { exhaustMap, filter, map, scan, startWith } from "rxjs/operators";
import { fromArray } from "rxjs/internal/observable/fromArray";

const canvas = createCanvas();
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

fromEvent(document, "keydown")
  .pipe(
    filter(e => e["keyCode"] === 38),
    exhaustMap(() => {
      return zip(
        fromArray([1, 1, 1, 1, 1, 1, -1, -1, -1, -1, -1, -1]),
        interval(50)
      ).pipe(
        map(([displace]) => displace),
        scan(
          (pixels: Pixel[], displace: number) => {
            return pixels.map(pixel => ({ ...pixel, y: pixel.y + displace }));
          },
          [
            { x: 2, y: 0, color: "black" },
            { x: 2, y: 1, color: "green" },
            { x: 2, y: 2, color: "blue" }
          ]
        )
      );
    }),
    startWith([
      { x: 2, y: 0, color: "black" },
      { x: 2, y: 1, color: "green" },
      { x: 2, y: 2, color: "blue" }
    ])
  )
  .subscribe(pixels => {
    clear(ctx); // Fills the entire scene with blue rectangle
    drawPixels(ctx, pixels);
  });
