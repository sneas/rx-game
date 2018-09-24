import { createCanvas, drawPixels } from "./draw";
import { fromEvent, of } from "rxjs";
import { Pixel } from "./types";
import { filter } from "rxjs/operators";

const canvas = createCanvas();
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

fromEvent(document, "keydown")
  .pipe(filter(e => e["keyCode"] === 38))
  .subscribe(event => {
    console.log(event);
  });

of<Pixel[]>([
  { x: 2, y: 0, color: "black" },
  { x: 2, y: 1, color: "green" },
  { x: 2, y: 2, color: "blue" }
]).subscribe(pixels => {
  drawPixels(ctx, pixels);
});
