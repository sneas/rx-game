import {
  clear,
  createCanvas,
  drawGround,
  drawPixels,
  renderGameOver,
  renderScores
} from './draw';
import {
  combineLatest,
  fromEvent,
  interval,
  Observable,
  of,
  Subject,
  zip
} from 'rxjs/index';
import {
  clean,
  displaceActor,
  displaceObstacles,
  generate,
  generateActor,
  isCollided,
  MAX_JUMP
} from './scene';
import {
  concatMap,
  exhaustMap,
  filter,
  map,
  share,
  startWith,
  take,
  scan,
  takeWhile,
  withLatestFrom,
  tap
} from 'rxjs/internal/operators';
import { range, flatten } from 'lodash-es';
import { Pixel, Scene } from './types';
import { animationFrame } from 'rxjs/internal/scheduler/animationFrame';

const canvas = createCanvas();
const ctx = canvas.getContext('2d');

document.body.appendChild(canvas);

const FPS = 60;

const ticks$ = interval(50).pipe(share());

const keyDown$ = fromEvent(document, 'keydown').pipe(
  filter(e => e['keyCode'] === 38)
);

const jump$ = zip(
  of(...new Array(MAX_JUMP).fill(1), ...new Array(MAX_JUMP).fill(-1)),
  ticks$
).pipe(
  map(([displace]) => displace),
  scan((actor: Pixel[], displace: number) => {
    return displaceActor(actor, displace);
  }, generateActor())
);

const actor$: Observable<Pixel[]> = keyDown$.pipe(
  exhaustMap(() => jump$),
  startWith(generateActor())
);

const obstacles$ = ticks$.pipe(
  scan(
    (obstacles: Pixel[][], _: number) => {
      return generate(clean(displaceObstacles(obstacles)));
    },
    <Pixel[][]>[]
  )
);

const $scores = ticks$.pipe(
  scan((total: number) => {
    return total + 1;
  }, 0)
);

const scene$: Observable<Scene> = combineLatest(
  actor$,
  obstacles$,
  $scores
).pipe(
  map(([actor, obstacles, scores]) => ({
    actor,
    obstacles,
    scores
  }))
);

const $game = interval(1000 / FPS, animationFrame).pipe(
  withLatestFrom(scene$, (_, scene) => scene),
  takeWhile(scene => !isCollided(scene.actor, scene.obstacles))
);

const play = () => {
  let finalScore = 0;
  $game
    .pipe(
      tap(scene => {
        finalScore = scene.scores;
      })
    )
    .subscribe({
      next: scene => {
        clear(ctx);
        drawPixels(ctx, scene.actor);
        drawPixels(ctx, flatten(scene.obstacles));
        drawGround(ctx);
        renderScores(ctx, scene.scores);
      },
      complete: () => {
        renderGameOver(ctx, finalScore);

        keyDown$.pipe(take(1)).subscribe({
          complete: play
        });
      }
    });
};

play();
