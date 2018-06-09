import { clear, createCanvas, drawPixels } from './draw';
import { combineLatest, fromEvent, interval, Observable, of } from 'rxjs/index';
import { clean, displace, generate, generateActor, isCollided } from './scene';
import {
  concatMap,
  exhaustMap,
  filter,
  map,
  share,
  startWith,
  take,
  scan,
  takeWhile
} from 'rxjs/internal/operators';
import { range, flatten } from 'lodash-es';
import { Pixel } from './types';

const canvas = createCanvas();
const ctx = canvas.getContext('2d');

document.body.appendChild(canvas);

const ticks$ = interval(50).pipe(share());

const actor$: Observable<Pixel[]> = fromEvent(document, 'keyup').pipe(
  filter(e => e['keyCode'] === 38),
  exhaustMap(() => {
    const max = 7;
    return of(...[...range(1, max + 1), ...range(max - 1, -1)]).pipe(
      concatMap(displace => {
        return ticks$.pipe(
          take(1),
          map(() => generateActor(displace))
        );
      })
    );
  }),
  startWith(generateActor())
);

const obstacles$ = ticks$.pipe(
  scan(
    (obstacles: Pixel[][], _: number) => {
      return generate(clean(displace(obstacles)));
    },
    <Pixel[][]>[]
  )
);

combineLatest(actor$, obstacles$)
  .pipe(takeWhile(([actor, obstacles]) => !isCollided(actor, obstacles)))
  .subscribe(([actor, obstacles]) => {
    clear(ctx);
    drawPixels(ctx, actor);
    drawPixels(ctx, flatten(obstacles));
  });
