import { createCanvas, drawPixels } from "./draw";
import { of } from "rxjs";
import { Pixel } from "./types";

const canvas = createCanvas();
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

of<Pixel[]>([
  { x: 2, y: 0, color: "black" },
  { x: 2, y: 1, color: "green" },
  { x: 2, y: 2, color: "blue" }
]).subscribe(pixels => {
  drawPixels(ctx, pixels);
});
