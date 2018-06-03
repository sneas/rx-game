import { clear, createCanvas, drawPixels } from './draw';
import { fromEvent, interval, of } from 'rxjs/index';
import { generateActor } from './scene';
import { concatMap, exhaustMap, filter, map, share, startWith, take } from 'rxjs/internal/operators';
import { range } from 'lodash-es';

const canvas = createCanvas();
const ctx = canvas.getContext('2d');

document.body.appendChild(canvas);

const ticks$ = interval(50)
    .pipe(
        share(),
    );

console.log([...range(1, 7), ...range(5, -1)]);

fromEvent(document, 'keyup').pipe(
    filter(e => e['keyCode'] === 38),
    exhaustMap(() => {
        const max = 5;
        return of(...[...range(1, max + 1), ...range(max - 1, -1)]).pipe(
                concatMap((displace) => {
                    return ticks$.pipe(
                        take(1),
                        map(() => generateActor(displace)),
                    );
                }),
            );
    }),
    startWith(generateActor()),
).subscribe(actor => {
    clear(ctx);
    drawPixels(ctx, actor);
});
