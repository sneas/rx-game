import { Pixel } from './types';

export function generateActor(displace = 0): Pixel[] {
    return [{x: 2, y: 0 + displace}, {x: 2, y: 1 + displace}, {x: 2, y: 2 + displace}];
}
