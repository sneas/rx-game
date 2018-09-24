import { clear, createCanvas, drawPixels } from "./draw";
import { combineLatest, fromEvent, interval, of, zip } from "rxjs";
import { Pixel } from "./types";
import { exhaustMap, filter, map, scan, startWith } from "rxjs/operators";
import { fromArray } from "rxjs/internal/observable/fromArray";

const canvas = createCanvas();
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

const STILL = [
  { x: 2, y: 0, color: "black" },
  { x: 2, y: 1, color: "green" },
  { x: 2, y: 2, color: "blue" }
];

combineLatest(
  of(STILL),
  fromEvent(document, "keydown").pipe(
    filter(e => e["keyCode"] === 38),
    exhaustMap(() => {
      return zip(
        fromArray([1, 2, 3, 4, 5, 5, 4, 3, 2, 1, 0]),
        interval(50)
      ).pipe(map(([displace]) => displace));
    }),
    startWith(0)
  )
)
  .pipe(
    map(([pixels, displace]) =>
      pixels.map(pixel => ({ ...pixel, y: pixel.y + displace }))
    )
  )
  .subscribe(pixels => {
    clear(ctx); // Fills the entire scene with blue rectangle
    drawPixels(ctx, pixels);
  });
