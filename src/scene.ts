import { Pixel } from './types';
import { SCENE_WIDTH } from './draw';
import { last, random } from 'lodash-es';

export const MIN_DISTANCE_BETWEEN_OBSTACLES = 15;
export const GROUND_HEIGHT = 1;
export const MAX_OBSTACLE_HEIGHT = 5;

export function generateActor(displace = 0): Pixel[] {
  return [
    { x: 2, y: 0 + GROUND_HEIGHT + displace, color: '#00007d' },
    { x: 2, y: 1 + GROUND_HEIGHT + displace, color: '#00007d' },
    { x: 2, y: 2 + GROUND_HEIGHT + displace, color: '#000000' }
  ];
}

const availableObstacleColors = ['#018500', '#014c00', '#6ba62b'];

function generateObstacleColor(): string {
  return availableObstacleColors[random(availableObstacleColors.length - 1)];
}

export function generateObstacle(): Pixel[] {
  return Array.from(Array(random(1, MAX_OBSTACLE_HEIGHT)).keys()).map(
    pixelDisplacement => ({
      x: SCENE_WIDTH,
      y: pixelDisplacement + GROUND_HEIGHT,
      color: generateObstacleColor()
    })
  );
}

export function displace(obstacles: Pixel[][]): Pixel[][] {
  return obstacles.map(obstacle =>
    obstacle.map(pixel => ({ ...pixel, x: pixel.x - 1 }))
  );
}

export function clean(obstacles: Pixel[][]): Pixel[][] {
  return obstacles.filter(obstacle => obstacle.find(pixel => pixel.y >= 0));
}

export function generate(obstacles: Pixel[][]): Pixel[][] {
  if (
    !(last(obstacles) || []).find(
      pixel => SCENE_WIDTH - pixel.x <= MIN_DISTANCE_BETWEEN_OBSTACLES
    ) &&
    Math.random() > 0.9
  ) {
    return [...obstacles, generateObstacle()];
  }

  return obstacles;
}

export function isCollided(actor: Pixel[], obstacles: Pixel[][]) {
  return !!obstacles.find(
    obstacle =>
      !!obstacle.find(
        obstaclePixel =>
          !!actor.find(
            actorPixel =>
              actorPixel.x === obstaclePixel.x &&
              actorPixel.y === obstaclePixel.y
          )
      )
  );
}
