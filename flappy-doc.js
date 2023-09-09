let frames = 0;
let score = 0;
let bestScore = 0;

const sprites = new Image();
sprites.src = './sprites.png';

const downEffect = new Audio();
downEffect.src = './effects/down.wav';

const hitEffect = new Audio();
hitEffect.src = './effects/hit.wav';

const jumpEffect = new Audio();
jumpEffect.src = './effects/jump.wav';

const scoreEffect = new Audio();
scoreEffect.src = './effects/score.wav';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

const globals = {}

const background = {
    sourceX: 390,
    sourceY: 0,
    width: 275,
    height: 204,
    x: 0,
    y: canvas.height - 204,
    draw() {
        context.fillStyle = '#70c5ce';
        context.fillRect(0,0, canvas.width, canvas.height);

        context.drawImage(
          sprites,
          background.sourceX, background.sourceY,
          background.width, background.height,
          background.x, background.y,
          background.width,background.height,  
        );

        context.drawImage(
            sprites,
            background.sourceX, background.sourceY,
            background.width, background.height,
            background.x + background.width, background.y,
            background.width,background.height,  
          );
    },
}

const getReady = {
    sourceX: 134,
    sourceY: 0,
    width: 174,
    height: 152,
    x: (canvas.width / 2) - (174 / 2),
    y: 50,
    draw() {
        context.drawImage(
            sprites,
            getReady.sourceX, getReady.sourceY,
            getReady.width, getReady.height,
            getReady.x, getReady.y,
            getReady.width,getReady.height
        );
    }
}

let activeScreen = {}

function bump(object1, object2) {
    const object1Y = object1.y + object1.height;
    const object2Y = object2.y;

    return object1Y >= object2Y;
}

function flappyDoc() {
    const flappyDoc = {
        sourceX: 0,
        sourceY: 0,
        width: 33,
        height: 24,
        x: 10,
        y: 50,
        gravity: 0.35,
        boost: 4.8,
        speed: 0,
        flapping: [
            { sourceX: 0, sourceY: 0 },
            { sourceX: 0, sourceY: 26 },
            { sourceX: 0, sourceY: 52 },
            { sourceX: 0, sourceY: 26 },
        ],
        flappingFrame: 0,
        setFlappingFrame() {
            const frameInterval = 10;
            if(frames % frameInterval == 0) {
                const flappingSpeed = 1;
                const increment = flappingSpeed + flappyDoc.flappingFrame;
                const flappingLength = flappyDoc.flapping.length;
                flappyDoc.flappingFrame = increment % flappingLength;
            }
        },
        draw() {
            flappyDoc.setFlappingFrame();
            const { sourceX, sourceY } = flappyDoc.flapping[flappyDoc.flappingFrame];
            context.drawImage(
                sprites,
                sourceX, sourceY,
                flappyDoc.width,flappyDoc.height,
                flappyDoc.x,flappyDoc.y,
                flappyDoc.width,flappyDoc.height,
            );
        },
        jump() {
            flappyDoc.speed =- flappyDoc.boost;
            jumpEffect.play();
        },
        refresh() {
            if(bump(flappyDoc, globals.ground)) {
                hitEffect.play();
                setTimeout(() => {
                    setActiveScreen(Screens.gameover);
                }, 500);
                return;
            }
            flappyDoc.speed = flappyDoc.speed + flappyDoc.gravity;
            flappyDoc.y = flappyDoc.y + flappyDoc.speed;
        },
    };

    return flappyDoc;
}

function ground() {
    const ground = {
        sourceX: 0,
        sourceY: 610,
        width: 224,
        height: 112,
        x: 0,
        y: canvas.height - 112,
        animate() {
            const groundStep = 1;
            const repeatAt = ground.width / 2;
            const groundMovement = ground.x - groundStep;
            ground.x = groundMovement % repeatAt;
        },
        draw() {
            context.drawImage(
                sprites,
                ground.sourceX, ground.sourceY,
                ground.width, ground.height,
                ground.x,ground.y,
                ground.width,ground.height,
            );
    
            context.drawImage(
                sprites,
                ground.sourceX, ground.sourceY,
                ground.width, ground.height,
                ground.x + ground.width, ground.y,
                ground.width, ground.height,
            );
        },
    }

    return ground;
}

function pipes() {
    const pipes = {
        width: 52,
        height: 400,
        ground: {
            sourceX: 0,
            sourceY: 169,
        },
        sky: {
            sourceX: 52,
            sourceY: 169,
        },
        gap: 150,
        bumpToFlappyDoc(pipe) {
            const flappyDocTop = globals.flappyDoc.y;
            const flappyDocBottom = globals.flappyDoc.y + globals.flappyDoc.height;

            if(globals.flappyDoc.x + globals.flappyDoc.width >= pipe.x) {
                if(flappyDocTop <= pipe.skyPipe.y) {
                    downEffect.play();
                    return true;
                }
    
                if(flappyDocBottom >= pipe.groundPipe.y) {
                    downEffect.play();
                    return true;
                }
            }

            return false;
        },
        draw() {
            pipes.doublePipes.forEach(function(pipe) {
                const yRandom = pipe.y;
                const verticalGap = 50;

                const skyPipeX = pipe.x;
                const skyPipeY = yRandom;

                context.drawImage(
                    sprites,
                    pipes.sky.sourceX, pipes.sky.sourceY,
                    pipes.width, pipes.height,
                    skyPipeX, skyPipeY,
                    pipes.width, pipes.height
                );
    
                const groundPipeX = pipe.x;
                const groundPipeY = pipes.height + verticalGap + yRandom;

                context.drawImage(
                    sprites,
                    pipes.ground.sourceX, pipes.ground.sourceY,
                    pipes.width, pipes.height,
                    groundPipeX, groundPipeY,
                    pipes.width, pipes.height
                );

                pipe.groundPipe = {
                    x: groundPipeX,
                    y: groundPipeY
                }

                pipe.skyPipe = {
                    x: skyPipeX,
                    y: pipes.height + skyPipeY
                }
            });

        },
        doublePipes: [],
        refresh() {
            const after100frames = frames % 100 === 0;
            if(after100frames) {
                pipes.doublePipes.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                });
            }

            pipes.doublePipes.forEach(function(pipe) {
                pipe.x = pipe.x - 2;

                if(pipes.bumpToFlappyDoc(pipe)) {
                    setActiveScreen(Screens.gameover);
                }

                if(pipe.x + pipes.width <= 0) {
                    pipes.doublePipes.shift();
                    score++;
                    if (bestScore < score) {
                        bestScore = score;
                    }
                    scoreEffect.play();
                }
            });

        }
    }
    return pipes;
}

function medal () {
    let medal = {
        getColor() {
            if (score < 5) {
                return { sourceX: 0, sourceY: 78 };
            } else if (score >= 5 && score < 10) {
                return { sourceX: 45, sourceY: 123 };
            } else if (score >= 10 && score < 20) {
                return { sourceX: 45, sourceY: 78 };
            } else {
                return { sourceX: 0, sourceY: 123 };
            }
        },
        width: 46,
        height: 46,
        x: 75,
        y: 185,
        draw() {
            context.drawImage(
                sprites,
                medal.getColor().sourceX, medal.getColor().sourceY,
                medal.width, medal.height,
                medal.x, medal.y,
                medal.width,medal.height
            );
        }
    }
    return medal;
}

const startButton = {
    sourceX: 205,
    sourceY: 325,
    width: 104,
    height: 56,
    x: 120,
    y: 280,
    draw() {
        context.drawImage(
            sprites,
            startButton.sourceX, startButton.sourceY,
            startButton.width, startButton.height,
            startButton.x, startButton.y,
            startButton.width,startButton.height
        );
    }
}

const gameOverMessage = {
    sourceX: 132,
    sourceY: 154,
    width: 228,
    height: 160,
    x: 46,
    y: 100,
    draw() {
        context.drawImage(
            sprites,
            gameOverMessage.sourceX, gameOverMessage.sourceY,
            gameOverMessage.width, gameOverMessage.height,
            gameOverMessage.x, gameOverMessage.y,
            gameOverMessage.width,gameOverMessage.height
        );
    }
}

function scoreDisplay() {
    const scoreDisplay = {
        draw() {
            const scoreText = 'Score: ' + score;
            context.fillStyle = '#000';
            context.font = 'bold 16px sans-serif';
            context.fillText(scoreText, 10, 25, 400);
        }
    }
    return scoreDisplay;
}

function finalScore() {
    const scoreDisplay = {
        draw() {
            context.fillStyle = '#000';
            context.font = 'bold 16px sans-serif';
            context.fillText(score, 225, 190, 50);
            context.fillText(bestScore, 225, 230, 50);
        }
    }
    return scoreDisplay;
}

function setActiveScreen(screen) {
    activeScreen = screen;

    if(activeScreen.init) {
        activeScreen.init();
    }
}

const Screens = {
    start: {
        init() {
            globals.flappyDoc = flappyDoc();
            globals.ground = ground();
            globals.pipes = pipes();
            globals.scoreDisplay = scoreDisplay();
            globals.finalScore = finalScore();
        },
        click() {
          setActiveScreen(Screens.game);
          score = 0;
        },
        draw() {
            background.draw();
            globals.ground.draw();
            globals.flappyDoc.draw();
            getReady.draw();
        },
        refresh() {
            globals.ground.animate();
        }
    }
}

Screens.game = {
    click() {
        globals.flappyDoc.jump();
    },
    draw() {
        background.draw();
        globals.pipes.draw();
        globals.ground.draw();
        globals.flappyDoc.draw();
        globals.scoreDisplay.draw();
    },
    refresh() {
        globals.pipes.refresh();
        globals.ground.animate();
        globals.flappyDoc.refresh();
        globals.scoreDisplay.draw();
    }
}

Screens.gameover = {
    init() {
        globals.medal = medal();
    },
    click() {
        globals.flappyDoc = flappyDoc();
        globals.ground = ground();
        globals.pipes = pipes();
        globals.scoreDisplay = scoreDisplay();
        globals.medal = undefined;
        setActiveScreen(Screens.game);
        score = 0;
    },
    draw() {
        background.draw();
        globals.pipes.draw();
        globals.ground.draw();
        globals.flappyDoc.draw();
        globals.scoreDisplay.draw();
        gameOverMessage.draw();
        startButton.draw();
        globals.medal.draw();
        globals.finalScore.draw();
    },
    refresh() {}

}

function loop() {
    activeScreen.draw();
    activeScreen.refresh();

    frames++;
    requestAnimationFrame(loop);
}

window.addEventListener('click', function() {
    if(activeScreen.click) {
        activeScreen.click();
    }
});

window.addEventListener('touchstart', function() {
    activeScreen.click();
});


setActiveScreen(Screens.start);
loop();
