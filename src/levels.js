import Brick from "./brick.js";
import Position from "./position.js";
import { BRICK_HEIGHT, BRICK_WIDTH } from "./conf.js";

export function buildLevel(level) {
    let bricks = [];

    level.forEach((row, rowIndex) => {
        row.forEach((brick, brickIndex) => {
            let position = new Position(BRICK_WIDTH * brickIndex, 24 + BRICK_HEIGHT * rowIndex);
            switch (brick) {
                case 1:
                    bricks.push(new Brick(position, 1, 0));
                    break;
                case 2:
                    bricks.push(new Brick(position, 2, 0));
                    break;
                case 3:
                    bricks.push(new Brick(position, 3, 0));
                    break;
                case 4:
                    bricks.push(new Brick(position, 1, 1));
            }
        });
    });
    return bricks;
}

export const level1 = [
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [2, 2, 4, 2, 2, 2, 2, 4, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
  
export const level2 = [
    [4, 0, 0, 2, 2, 2, 2, 0, 0, 4],
    [1, 3, 0, 0, 2, 2, 0, 0, 3, 1],
    [1, 1, 3, 0, 0, 0, 0, 3, 1, 1],
    [1, 1, 1, 3, 0, 0, 3, 1, 1, 1],
    [1, 1, 1, 4, 0, 0, 4, 1, 1, 1],
    [1, 1, 1, 3, 0, 0, 3, 1, 1, 1],
    [1, 1, 3, 0, 0, 0, 0, 3, 1, 1],
    [1, 3, 0, 0, 2, 2, 0, 0, 3, 1],
    [4, 0, 0, 2, 2, 2, 2, 0, 0, 4]
];