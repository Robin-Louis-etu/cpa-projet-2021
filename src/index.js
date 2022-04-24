import Game, { GAMESTATE } from "./game.js";

var ctx = main_window.getContext('2d');
var width = main_window.width;
var height = main_window.height;

var game = new Game();

// ------ INPUT CONFIGURATION ------
document.addEventListener("keydown", event => {
    switch (event.keyCode) {
        case 32: // touche espace pour lancer la balle
            game.balls[0].go();
            break;

        case 13: // touche entrée pour relancer une partie lorsqu'on a perdu
            game.reset();
            break;

        case 27: // touche echap pour faire pause ou reprendre la partie
            game.togglePause();
            break;
    }
});

var mouseControl = false;

document.addEventListener("mousemove", event => {
    if (mouseControl) {
        if (game.gamestate === GAMESTATE.RUNNING) {
            // Pour tester les collisions :
            game.balls[0].pos.x = event.clientX - game.balls[0].radius;
            game.balls[0].pos.y = event.clientY - game.balls[0].radius;
            game.balls[0].speed.x = 5;
            game.balls[0].speed.y = 0;
        }
    }
    else {
        if (game.gamestate === GAMESTATE.RUNNING) {
            var relativeX = event.clientX - main_window.offsetLeft;
            if (relativeX > 0 && relativeX < width) {
                game.paddle.pos.x = relativeX - game.paddle.width / 2;
                if (game.paddle.pos.x < 0) {
                    game.paddle.pos.x = 0;
                } else if (game.paddle.pos.x + game.paddle.width > width) {
                    game.paddle.pos.x = width - game.paddle.width;
                }
                if (game.balls[0].state === 0) {
                    game.balls[0].pos.x = game.paddle.pos.x + game.paddle.width / 2;
                    console.log(`Balle : x = ${game.balls[0].pos.x} y : ${game.balls[0].pos.y}`);
                    console.log(`Paddle : x = ${game.paddle.pos.x} y = ${game.paddle.pos.y}`);
                }
            }
        }
    }
});

document.addEventListener("mousedown", e => {
    if (e.button === 1) mouseControl = !mouseControl;
});


// ------ SLIDERS VALUE DISPLAY ------
const allRanges = document.querySelectorAll(".range-wrap");
allRanges.forEach(wrap => {
    const range = wrap.querySelector(".range");
    const bubble = wrap.querySelector(".bubble");

    range.addEventListener("input", () => {
        setBubble(range, bubble);
    });
    setBubble(range, bubble);
});

function setBubble(range, bubble) {
    const val = range.value;
    const min = range.min ? range.min : 0;
    const max = range.max ? range.max : 100;
    const newVal = Number(((val - min) * 100) / (max - min));
    bubble.innerHTML = val;
    bubble.style.left = `calc(${newVal}% + (${8 - newVal * 0.15}px))`;
}


// ------------------------------

game.start();

function loop() {
    ctx.clearRect(0, 0, width, height);
    game.update();
    game.draw(ctx);

    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);