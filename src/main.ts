import {
  clear,
  createCanvas,
  drawGround,
  drawPixels,
  renderGameOver,
  renderScores
} from "./draw";
import { combineLatest, fromEvent, interval, of, zip } from "rxjs";
import { Pixel } from "./types";
import {
  exhaustMap,
  filter,
  map,
  scan,
  share,
  startWith,
  take,
  takeWhile
} from "rxjs/operators";
import { fromArray } from "rxjs/internal/observable/fromArray";
import {
  clean,
  displaceObstacles,
  generate,
  generateActor,
  generateJump,
  isCollided
} from "./scene";
import { flatten } from "lodash-es";

const canvas = createCanvas();
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

const STILL = generateActor();

const ticks$ = interval(50).pipe(share());

const up$ = fromEvent(document, "keydown").pipe(
  filter(e => e["keyCode"] === 38)
);

const actor$ = up$.pipe(
  exhaustMap(() => {
    return zip(fromArray(generateJump()), ticks$).pipe(
      map(([displace]) => displace),
      scan((pixels: Pixel[], displace: number) => {
        return pixels.map(pixel => ({ ...pixel, y: pixel.y + displace }));
      }, STILL)
    );
  }),
  startWith(STILL)
);

const obstacles$ = ticks$.pipe(
  scan(
    (obstacles: Pixel[][], _: number) => {
      return generate(clean(displaceObstacles(obstacles)));
    },
    <Pixel[][]>[]
  )
);

const scores$ = ticks$.pipe(
  scan(total => total + 1, 0),
  startWith(0)
);

const game$ = combineLatest(actor$, obstacles$, scores$).pipe(
  takeWhile(([actor, obstacles]) => !isCollided(actor, obstacles))
);

function play() {
  let finalScore = 0;
  game$.subscribe({
    next: ([actor, obstacles, score]) => {
      finalScore = score;
      clear(ctx); // Fills the entire scene with blue rectangle
      drawPixels(ctx, actor);
      drawPixels(ctx, flatten(obstacles));
      renderScores(ctx, score);
      drawGround(ctx);
    },
    complete: () => {
      renderGameOver(ctx, finalScore);
      up$.pipe(take(1)).subscribe({
        complete: () => {
          play();
        }
      });
    }
  });
}

play();
