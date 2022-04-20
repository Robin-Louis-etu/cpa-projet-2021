import Brick from "./brick.js";
import Position from "./position.js";

export function buildLevel(level) {
    let bricks = [];

    level.forEach((row, rowIndex) => {
        row.forEach((brick, brickIndex) => {
            let position;
            switch (brick) {
                case 1:
                    position = new Position(80 * brickIndex, 75 + 24 * rowIndex);
                    bricks.push(new Brick(position, 1));
                    break;

                case 2:
                    position = new Position(80 * brickIndex, 75 + 24 * rowIndex);
                    bricks.push(new Brick(position, 2));
                    break;

                case 3:
                    position = new Position(80 * brickIndex, 75 + 24 * rowIndex);
                    bricks.push(new Brick(position, 3));
                    break;
            }
        });
    });
    return bricks;
}

export const level1 = [
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];
  
export const level2 = [
    [3, 0, 0, 2, 2, 2, 2, 0, 0, 3],
    [1, 3, 0, 0, 2, 2, 0, 0, 3, 1],
    [1, 1, 3, 0, 0, 0, 0, 3, 1, 1],
    [1, 1, 1, 3, 0, 0, 3, 1, 1, 1],
    [1, 1, 1, 3, 0, 0, 3, 1, 1, 1],
    [1, 1, 1, 3, 0, 0, 3, 1, 1, 1],
    [1, 1, 3, 0, 0, 0, 0, 3, 1, 1],
    [1, 3, 0, 0, 2, 2, 0, 0, 3, 1],
    [3, 0, 0, 2, 2, 2, 2, 0, 0, 3]
];