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

export function collisionBallbrick(ball,brick){
    let right = ball.pos.x + ball.radius;
    let bottom = ball.pos.y + ball.radius;
    let top = ball.pos.y - ball.radius;
    let left = ball.pos.x - ball.radius;
        
    if(ball.pos.y >= brick.pos.y && ball.pos.y <= brick.pos.y+brick.pos.height){
        return right >= brick.x && left <= brick.x+brick.width;
    }
        
    if (ball.x >= brick.x && ball.x <= brick.x+brick.width){
        return top <= brick.y+brick.height && bottom >= brick.y;
    }
        
    return Math.pow(ball.x-brick.x,2)+Math.pow(ball.y-brick.y,2)<= ball.radius*ball.radius ||
    Math.pow(ball.x-brick.x,2)+Math.pow(ball.y-(brick.y+brick.height),2)<= ball.radius*ball.radius ||
    Math.pow(ball.x-(brick.x+brick.width),2)+Math.pow(ball.y-brick.y,2)<= ball.radius*ball.radius ||
    Math.pow(ball.x-(brick.x+brick.width),2)+Math.pow(ball.y-(brick.y+brick.height),2)<= ball.radius*ball.radius;
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