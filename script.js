// Matter.js module 
const { Engine, Render, Bodies, Composite, Body, Mouse, MouseConstraint } = Matter;

// Create an engine
const engine = Engine.create();

// Create a renderer
const render = Render.create({
    element: document.body,
    canvas: document.getElementById('world'),
    engine: engine,
    options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: '#f0f0f0'
    }
});

// Create the box boundaries
const boxWidth = 500;
const boxHeight = 300;
const boxX = (window.innerWidth - boxWidth) / 2;
const boxY = (window.innerHeight - boxHeight) / 2;
const thickness = 25;

let leftWall = Bodies.rectangle(boxX - thickness / 2, boxY + boxHeight / 2, thickness, boxHeight, { isStatic: true });
let rightWall = Bodies.rectangle(boxX + boxWidth + thickness / 2, boxY  + boxHeight / 2, thickness, boxHeight + 40, { isStatic: true });
let ground = Bodies.rectangle(boxX + boxWidth / 2, boxY + boxHeight + thickness / 2, boxWidth + 25 * thickness, thickness, { isStatic: true });
// Create the pressing wall
let pressingWall = Bodies.rectangle(boxX - 7 + thickness / 2, boxY - 15 + boxHeight / 2, thickness, boxHeight + 70, { 
    isStatic: true,
    render: {
        fillStyle: '#FF0000'
    }
});
Composite.add(engine.world, [leftWall, rightWall, ground, pressingWall]);

let pressingWallInterval;
let timerInterval;
let startTime = null;
const timerElement = document.getElementById('timer');

// Function to update the timer
function updateTimer() {
    const currentTime = new Date().getTime();
    const elapsedTime = (currentTime - startTime) / 1000;
    timerElement.textContent = `Time: ${elapsedTime.toFixed(2)}s`;
}

// Function to start the simulation
function startSimulation() {
    startTime = new Date().getTime();
    pressingWallInterval = setInterval(movePressingWall, 1000 / 60); // Move the wall every frame (60 FPS)
    timerInterval = setInterval(updateTimer, 100); // Update the timer every 100ms
}

// Function to pause the simulation
function pauseSimulation() {
    clearInterval(pressingWallInterval);
    clearInterval(timerInterval);
}

// Function to move the pressing wall
function movePressingWall() {
    Body.setPosition(pressingWall, {
        x: pressingWall.position.x + 1,
        y: pressingWall.position.y
    });

    // Reset position if it goes out of bounds
    if (pressingWall.position.x > boxX + boxWidth + thickness) {
        Body.setPosition(pressingWall, {
            x: boxX - thickness / 2,
            y: pressingWall.position.y
        });
    }   
}

// Create a mouse constraint
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
        render: { visible: false }
    }
});
Composite.add(engine.world, mouseConstraint);

// Function to get a random color
function getRandomColor() {
    const colors = ['#0000FF', '#FFA500']; // Blue and Orange
    return colors[Math.floor(Math.random() * colors.length)];
}

// Function to add a circle
function addCircle() {
    const sizeInput = document.getElementById('size');
    const ballRadius = parseInt(sizeInput.value);
    const colorPicker = document.getElementById('colorPicker');
    
    // Randomize x position within the box width
    const randomX = Math.random() * (boxWidth - 2 * ballRadius) + boxX + ballRadius;
    // Start the ball above the box
    const randomY = boxY - ballRadius;
    
    const ball = Bodies.circle(
        randomX,
        randomY,
        ballRadius,
        {
            restitution: 0.8,
            friction: 0.05,
            render: {
                fillStyle: colorPicker.value // Use color from color input
            }
        }
    );
    Composite.add(engine.world, ball);
}

// Function to add a rectangle
function addRectangle() {
    const sizeInput = document.getElementById('size');
    const rectSize = parseInt(sizeInput.value);
    const colorPicker = document.getElementById('colorPicker');
    
    // Randomize x position within the box width
    const randomX = Math.random() * (boxWidth - rectSize) + boxX + rectSize / 2;
    // Start the rectangle above the box
    const randomY = boxY - rectSize / 2;
    
    const rectangle = Bodies.rectangle(
        randomX,
        randomY,
        rectSize,
        rectSize,
        {
            restitution: 0.8,
            friction: 0.05,
            render: {
                fillStyle: colorPicker.value // Use color from color input
            }
        }
    );
    Composite.add(engine.world, rectangle);
}

// Add event listeners to buttons
document.getElementById('addCircle').addEventListener('click', addCircle);
document.getElementById('addRectangle').addEventListener('click', addRectangle);
document.getElementById('startButton').addEventListener('click', startSimulation);
document.getElementById('pauseButton').addEventListener('click', pauseSimulation);

// Run the engine
Engine.run(engine);

// Run the renderer
Render.run(render);

// Adjust canvas size on window resize
window.addEventListener('resize', () => {
    render.canvas.width = window.innerWidth;
    render.canvas.height = window.innerHeight;

    Composite.remove(engine.world, ground);
    Composite.remove(engine.world, leftWall);
    Composite.remove(engine.world, rightWall);
    Composite.remove(engine.world, pressingWall);

    ground = Bodies.rectangle(boxX + boxWidth / 2, boxY + boxHeight + thickness / 2, boxWidth, thickness, { isStatic: true });
    leftWall = Bodies.rectangle(boxX - thickness / 2, boxY + boxHeight / 2, thickness, boxHeight, { isStatic: true });
    rightWall = Bodies.rectangle(boxX + boxWidth + thickness / 2, boxY + boxHeight / 2, thickness, boxHeight, { isStatic: true });
    pressingWall = Bodies.rectangle(boxX + boxWidth + thickness / 2, boxY + boxHeight / 2, thickness, boxHeight, { isStatic: true, render: { fillStyle: '#FF0000' } });

    Composite.add(engine.world, [leftWall, rightWall, ground, pressingWall]);
});
