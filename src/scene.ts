import { Pixel } from './types';
import { SCENE_WIDTH } from './draw';
import { last } from 'lodash-es';

export const MIN_DISTANCE_BETWEEN_OBSTACLES = 15;

export function generateActor(displace = 0): Pixel[] {
    return [
        {x: 2, y: 0 + displace},
        {x: 2, y: 1 + displace},
        {x: 2, y: 2 + displace},
    ];
}

export function generateObstacle(): Pixel[] {
    return [
        {x: SCENE_WIDTH, y: 0},
        {x: SCENE_WIDTH, y: 1},
        {x: SCENE_WIDTH, y: 2},
    ];
}

export function displace(obstacles: Pixel[][]): Pixel[][] {
    return obstacles.map(obstacle => obstacle.map(pixel => ({...pixel, x: pixel.x - 1})));
}

export function clean(obstacles: Pixel[][]): Pixel[][] {
    return obstacles.filter(obstacle => obstacle.find(pixel => pixel.y >= 0));
}

export function generate(obstacles: Pixel[][]): Pixel[][] {
    if (!(last(obstacles) || []).find(pixel => SCENE_WIDTH - pixel.x <= MIN_DISTANCE_BETWEEN_OBSTACLES) && Math.random() > 0.9) {
        return [
            ...obstacles,
            generateObstacle(),
        ];
    }

    return obstacles;
}
