export function collisionLeftBorder(ball){
    return ball.pos.x  <= ball.radius;
}

export function collisionRightBorder(ball){
    return ball.pos.x+ball.radius >= main_window.width;
}

export function collisionTopBorder(ball){
    return ball.pos.y <= ball.radius;
}

export function collisionBottomBorder(ball){
    return ball.pos.y+ball.radius >= main_window.height;
}

export function collisionBalls(b1, b2){
    return Math.pow(b1.pos.x-b2.pos.x,2)+Math.pow(b1.pos.y-b2.pos.y,2) <= Math.pow(b1.radius + b2.radius,2);
}

export function collisionBallPoint(b1, x, y) {
    return Math.pow(b1.pos.x - x, 2) + Math.pow(b1.pos.y - y, 2) < Math.pow(b1.radius, 2);
}

export function collisionBallPaddle(ball, paddle) {
    let hitPosition = 0;
    let tmp = paddle.width / 6;

    if (
        ball.pos.y + ball.radius >= paddle.pos.y &&
        ball.pos.x + ball.radius >= paddle.pos.x &&
        ball.pos.x - ball.radius <= paddle.pos.x + paddle.width
    ) {
        hitPosition = ball.pos.x - paddle.pos.x;
        if (hitPosition <= tmp) {
        return 1;
        } else if (hitPosition > tmp && hitPosition <= tmp * 2) {
        return 2;
        } else if ((hitPosition > tmp * 2 && hitPosition <= tmp * 3) || (hitPosition > tmp * 3 && hitPosition <= tmp * 4)) {
        return 3;
        } else if (hitPosition > tmp * 4 && hitPosition <= tmp * 5) {
        return 4;
        } else if (hitPosition >= tmp * 5) {
        return 5;
        }
    }
}

export function noCollisionBallPaddle(ball, paddle) {
    return ball.pos.y + ball.radius > paddle.pos.y && (
        ball.pos.x + ball.radius < paddle.pos.x ||
        ball.pos.x - ball.radius > paddle.pos.x + paddle.width
    );
}

export function collisionBallBrick(ball, brick) {
    let bottomOfBall = ball.pos.y + ball.radius;
    let topOfBall = ball.pos.y - ball.radius;
    let leftSideOfBall = ball.pos.x - ball.radius;
    let rightSideOfBall = ball.pos.x + ball.radius;

    let topOfBrick = brick.pos.y;
    let leftSideOfBrick = brick.pos.x;
    let rightSideOfBrick = brick.pos.x + brick.width;
    let bottomOfBrick = brick.pos.y + brick.height;

    if (collisionBallPoint(ball, leftSideOfBrick, topOfBrick)) {
        return 5;
    } else if (collisionBallPoint(ball, rightSideOfBrick, topOfBrick)) {
        return 6;
    } else if (collisionBallPoint(ball, leftSideOfBrick, bottomOfBrick)) {
        return 7;
    } else if (collisionBallPoint(ball, rightSideOfBrick, bottomOfBrick)) {
        return 8;
    } else if (ball.speed.y > 0 && bottomOfBall >= topOfBrick && topOfBall <= bottomOfBrick && ball.pos.x <= rightSideOfBrick && ball.pos.x >= leftSideOfBrick) {
        return 1;
    } else if (ball.speed.y < 0 && bottomOfBall >= topOfBrick && topOfBall <= bottomOfBrick && ball.pos.x <= rightSideOfBrick && ball.pos.x >= leftSideOfBrick) {
        return 3;
    } else if (ball.speed.x > 0 && leftSideOfBall <= rightSideOfBrick && rightSideOfBall >= leftSideOfBrick && ball.pos.y >= topOfBrick && ball.pos.y <= bottomOfBrick) {
        return 2;
    } else if (ball.speed.x < 0 && leftSideOfBall <= rightSideOfBrick && rightSideOfBall >= leftSideOfBrick && ball.pos.y >= topOfBrick && ball.pos.y <= bottomOfBrick) {
        return 4;
    }
    return

    if (
        bottomOfBall >= topOfBrick &&
        topOfBall <= bottomOfBrick &&
        rightSideOfBall >= leftSideOfBrick &&
        leftSideOfBall <= rightSideOfBrick
    ) {
        if (
            (ball.speed.x >= 0 &&
            ball.speed.y > 0 &&
            bottomOfBall - topOfBrick < rightSideOfBall - leftSideOfBrick) ||
            (ball.speed.x <= 0 &&
            ball.speed.y > 0 &&
            bottomOfBall - topOfBrick < rightSideOfBrick - leftSideOfBall)
        ) {
            console.log(`Collision avec la brique => x : ${brick.pos.x}
            , y : ${brick.pos.y} avec comme valeur de retour de la fonction
            collisionBallBrick : 1`);
            return 1;
        } else if (
            (ball.speed.x > 0 &&
            ball.speed.y <= 0 &&
            bottomOfBrick - topOfBall > rightSideOfBall - leftSideOfBrick) ||
            (ball.speed.x > 0 &&
            ball.speed.y >= 0 &&
            bottomOfBall - topOfBrick > rightSideOfBall - leftSideOfBrick)
        ) {
            console.log(`Collision avec la brique => x : ${brick.pos.x}
            , y : ${brick.pos.y} avec comme valeur de retour de la fonction
            collisionBallBrick : 2`);
            return 2;
        } else if (
            (ball.speed.x >= 0 &&
            ball.speed.y < 0 &&
            bottomOfBrick - topOfBall < rightSideOfBall - leftSideOfBrick) ||
            (ball.speed.x <= 0 &&
            ball.speed.y < 0 &&
            bottomOfBrick - topOfBall < rightSideOfBrick - leftSideOfBall)
        ) {
            console.log(`Collision avec la brique => x : ${brick.pos.x}
            , y : ${brick.pos.y} avec comme valeur de retour de la fonction
            collisionBallBrick : 3`);
            return 3;
        } else if (
            (ball.speed.x < 0 &&
            ball.speed.y >= 0 &&
            bottomOfBall - topOfBrick > rightSideOfBrick - leftSideOfBall) ||
            (ball.speed.x < 0 &&
            ball.speed.y <= 0 &&
            bottomOfBrick - topOfBall > rightSideOfBrick - leftSideOfBall)
        ) {
            console.log(`Collision avec la brique => x : ${brick.pos.x}
            , y : ${brick.pos.y} avec comme valeur de retour de la fonction
            collisionBallBrick : 4`);
            return 4;
        }
    }
  }


export function collisionBallBrickLeftBorder(ball, brick) {
    let leftSideOfBall = ball.pos.x - ball.radius;
    let rightSideOfBall = ball.pos.x + ball.radius;

    let topOfBrick = brick.pos.y;
    let leftSideOfBrick = brick.pos.x;
    let rightSideOfBrick = brick.pos.x + brick.width;
    let bottomOfBrick = brick.pos.y + brick.height;

    return leftSideOfBall <= rightSideOfBrick && rightSideOfBall >= leftSideOfBrick && ball.pos.y >= topOfBrick && ball.pos.y <= bottomOfBrick
}

export function collisionBallBrickRightBorder(ball, brick) {
    let bottomOfBall = ball.pos.y + ball.radius;
    let topOfBall = ball.pos.y - ball.radius;
    let leftSideOfBall = ball.pos.x - ball.radius;
    let rightSideOfBall = ball.pos.x + ball.radius;

    let topOfBrick = brick.pos.y;
    let leftSideOfBrick = brick.pos.x;
    let rightSideOfBrick = brick.pos.x + brick.width;
    let bottomOfBrick = brick.pos.y + brick.height;

    return leftSideOfBall <= rightSideOfBrick && rightSideOfBall >= leftSideOfBrick && ball.pos.y >= topOfBrick && ball.pos.y <= bottomOfBrick
}

export function collisionBallBrickTopBorder(ball, brick) {
    let bottomOfBall = ball.pos.y + ball.radius;
    let topOfBall = ball.pos.y - ball.radius;
    let leftSideOfBall = ball.pos.x - ball.radius;
    let rightSideOfBall = ball.pos.x + ball.radius;

    let topOfBrick = brick.pos.y;
    let leftSideOfBrick = brick.pos.x;
    let rightSideOfBrick = brick.pos.x + brick.width;
    let bottomOfBrick = brick.pos.y + brick.height;

    return bottomOfBall >= topOfBrick && topOfBall <= bottomOfBrick && ball.pos.x <= rightSideOfBrick && ball.pos.x >= leftSideOfBrick;
}

export function collisionBallBrickBottomBorder(ball, brick) {
    let bottomOfBall = ball.pos.y + ball.radius;
    let topOfBall = ball.pos.y - ball.radius;
    let leftSideOfBall = ball.pos.x - ball.radius;
    let rightSideOfBall = ball.pos.x + ball.radius;

    let topOfBrick = brick.pos.y;
    let leftSideOfBrick = brick.pos.x;
    let rightSideOfBrick = brick.pos.x + brick.width;
    let bottomOfBrick = brick.pos.y + brick.height;

    return bottomOfBall >= topOfBrick && topOfBall <= bottomOfBrick && ball.pos.x <= rightSideOfBrick && ball.pos.x >= leftSideOfBrick;
}

export function collisionBallBrickAngle(ball, brick) {
    let bottomOfBall = ball.pos.y + ball.radius;
    let topOfBall = ball.pos.y - ball.radius;
    let leftSideOfBall = ball.pos.x - ball.radius;
    let rightSideOfBall = ball.pos.x + ball.radius;

    let topOfBrick = brick.pos.y;
    let leftSideOfBrick = brick.pos.x;
    let rightSideOfBrick = brick.pos.x + brick.width;
    let bottomOfBrick = brick.pos.y + brick.height;

    if (collisionBallPoint(ball, leftSideOfBrick, topOfBrick)) {
        return 5;
    } else if (collisionBallPoint(ball, rightSideOfBrick, topOfBrick)) {
        return 6;
    } else if (collisionBallPoint(ball, leftSideOfBrick, bottomOfBrick)) {
        return 7;
    } else if (collisionBallPoint(ball, rightSideOfBrick, bottomOfBrick)) {
        return 8;
    }

    return 0;
}

