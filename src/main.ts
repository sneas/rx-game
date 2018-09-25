import { clear, createCanvas, drawPixels } from "./draw";
import { combineLatest, fromEvent, interval, of, zip } from "rxjs";
import { Pixel } from "./types";
import { exhaustMap, filter, map, scan, startWith } from "rxjs/operators";
import { fromArray } from "rxjs/internal/observable/fromArray";
import {
  clean,
  displaceObstacles,
  generate,
  generateActor,
  generateJump
} from "./scene";
import { flatten } from "lodash-es";

const canvas = createCanvas();
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

const STILL = generateActor();

fromEvent(document, "keydown")
  .pipe(
    filter(e => e["keyCode"] === 38),
    exhaustMap(() => {
      return zip(fromArray(generateJump()), interval(50)).pipe(
        map(([displace]) => displace),
        scan((pixels: Pixel[], displace: number) => {
          return pixels.map(pixel => ({ ...pixel, y: pixel.y + displace }));
        }, STILL)
      );
    }),
    startWith(STILL)
  )
  .subscribe(pixels => {
    clear(ctx); // Fills the entire scene with blue rectangle
    drawPixels(ctx, pixels);
  });

interval(50)
  .pipe(
    scan(
      (obstacles: Pixel[][], _: number) => {
        return generate(clean(displaceObstacles(obstacles)));
      },
      <Pixel[][]>[]
    )
  )
  .subscribe((pixels: Pixel[][]) => {
    clear(ctx);
    drawPixels(ctx, flatten(pixels));
  });
