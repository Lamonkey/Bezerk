var cubeRotation = 0.0;
var gameObjects = [];
var gl;
var canvas;
var programInfo;
const defultEye = vec3.fromValues(1.0, 1.0, -40.0);
var inc = 0;
const defultCenter = vec3.fromValues(inc, 1.0, 0.0);
const defultUp = vec3.fromValues(0, 1, 0);
var virtualTimeLine = 0
var eye = vec3.clone(defultEye);
var center = vec3.clone(defultCenter);
var up = vec3.clone(defultCenter);
var view2 = 90 * 3.14 / 180;
var view1 = 14 * 3.14 / 180;
var view = view1;
var toggleView = false;
var world_floor = new floor();
var world = new map();
var player_1 = new player(2.0, 4.0);
gameObjects.push(player_1);
var world_floor = new floor(5.0, 5.0);
var bullet_1 = new bullet(5.0, 5.0, false);
var enemies = createEnemies([
    3.0, 2.0, true,
    9.0, 4.0, false,
    2.0, 10.0, true,
    13.0, 10.0, true,
    ]);
var count = 0;
var pause = true;
var globalTime = new Date().getTime();
var movingTic = 600;
var bulletTic = 120;
var virtualTime = globalTime;
var robotFTic = 0;
var movingF = incTic(virtualTime, movingTic);
var robotFireF = incTic(virtualTime,robotFTic);
var bulletF = incTic(virtualTime,bulletTic);
//var animationF = incTic(virtualTime,100);
world.constructGrid();
world.placeingWall();
world.printMap();
//world.constructGOLocation();
var grid = world.getMap();
var gameObjectMap = world.getGOMap();
main();
function incTic(vt, deltaTime) {

    return vt + deltaTime;
}
function incTime() {
    var ct = new Date().getTime();
    deltaTime = ct - globalTime;
    if (!pause)
        virtualTime += deltaTime;
    globalTime = ct;
    //console.log(vt)

}
function createEnemies(position) {
    num = position.length / 3;
    var list = [];
    for (var i = 0; i < num; i++) {
        list[i] = new enemy(position[i * 3], position[i * 3 + 1], position[i * 3 + 2])
        gameObjects.push(list[i]);
    }
    return list;
}

function handleKeyDown(event) {
    if(!player_1.isDead()){
    pause = false;
    }
    switch (event.code) {
        case "KeyW":
            player_1.moveUp(grid, gameObjectMap);
            break;
        case "KeyS":
            player_1.moveDown(grid, gameObjectMap);
            break;
        case "KeyA":
            player_1.moveLeft(grid, gameObjectMap);
            break;
        case "KeyD":
            player_1.moveRight(grid, gameObjectMap);
            break;
        case "Space":
            player_1.fire();
            console.log("fire");
            break;






    }
}

function createBuffer(gl, gameObject) {
    if (!gameObject) {
        return null;
    }
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = gameObject.getPosition();
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    const faceColors = gameObject.getFaceColor();
    // Convert the array of colors into a table for all the vertices.

    var colors = [];

    for (var j = 0; j < faceColors.length; ++j) {
        const c = faceColors[j];

        // Repeat each color four times for the four vertices of the face
        colors = colors.concat(c, c, c, c);
    }
    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);


    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    indices = gameObject.getIndices();
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices), gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        color: colorBuffer,
        indices: indexBuffer,
    }

}
function display(gl, programInfo, buffers, deltaTime, gameObject, location) {
    // gl.enable(gl.DEPTH_TEST);
    //gl.depthFunc(gl.LEQUAL);
    if (!gameObject) {
        return null;
    }
    const projectionMatrix = mat4.create();
    {
        const fieldOfView = 45 * Math.PI / 180;   // in radians
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const zNear = 0.1;
        const zFar = 100.0;
        mat4.perspective(projectionMatrix,
            fieldOfView,
            aspect,
            zNear,
            zFar);



    }
    //compute a matrix for the camera
    var mMatrix = moveLeft(location[0], location[1], location[2]);
    // mat4.fromYRotation(cameraMatrix, 45 * Math.PI / 180);
    // {
    //     var radius = 200;
    //     cameraMatrix = mat4.translate(cameraMatrix, 0, 0, radius * 1.5);
    // }

    // Now move the drawing position a bit to where we want to
    // start drawing the square.
    const modelViewMatrix = mat4.create();
    //eye[1] +=0.05;
    //mat4.invert(modelViewMatrix, cameraMatrix);
    //mat4.translate(modelViewMatrix, modelViewMatrix, location);
    {

        var cameraMatrix = mat4.create();



        // if(toggleView){
        //     view = view1;
        //     while(view + 0.7<view2){
        //         view=+0.7;
        //     }
        //     toggleView = false;
        // }
        mat4.fromYRotation(cameraMatrix, view);
        cameraMatrix = mat4.translate(cameraMatrix, cameraMatrix, vec3.fromValues(0, 0, 60));
        var cameraPosition = vec3.fromValues(cameraMatrix[12], cameraMatrix[13], cameraMatrix[14]);
        vec3.negate(cameraPosition, cameraPosition);
        mat4.lookAt(modelViewMatrix, cameraPosition, vec3.fromValues(-14, -12, 0.0), up);

        // mat4.translate(modelViewMatrix,     // destination matrix
        //     modelViewMatrix,     // matrix to translate
        //     location);  // amount to translate
        // mat4.rotate(modelViewMatrix,  // destination matrix
        //     modelViewMatrix,  // matrix to rotate
        //     cubeRotation,     // amount to rotate in radians
        //     [0, 0, 1]);       // axis to rotate around (Z)

        //change zAix

        // mat4.rotate(modelViewMatrix,  // destination matrix
        //     modelViewMatrix,  // matrix to rotate
        //     cubeRotation * .7,// amount to rotate in radians
        //     [0, 1, 0]);       // axis to rotate around (X)}

    }
    mat4.multiply(modelViewMatrix, modelViewMatrix, mMatrix);
    gameObject.setvmatrix(modelViewMatrix);

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute
    {
        const numComponents = gameObject.getNumComponents();
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexPosition);
    }

    {
        const numComponents = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexColor,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(
            programInfo.attribLocations.vertexColor);
    }
    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    gl.useProgram(programInfo.program);

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);
    {
        const vertexCount = 36;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
    // Update the rotation for the next draw
    //view += 0.4;
    if (toggleView) {
        if (view + 0.003 < toggleView) {
            view += 0.003;
        }
        else {
            view = toggleView;
        }
    }
}
// Start here
//
// set up the webGL environment
function setupWebGL() {
    // Set up keys
    document.onkeydown = handleKeyDown; // call this when key pressed

    canvas = document.querySelector('#glcanvas');
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    // If we don't have a GL context, give up now

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }
} // end setupWebGL

function setupShader() {
    const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying lowp vec4 vColor;
    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

    // Fragment shader program

    const fsSource = `
    varying lowp vec4 vColor;
    void main(void) {
      gl_FragColor = vColor;
    }
  `;

    // Collect all the info needed to use the shader program.
    // Look up which attributes our shader program is using
    // for aVertexPosition, aVevrtexColor and also
    // look up uniform locations.
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
            vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
        },
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        },
    };
    // Initialize a shader program; this is where all the lighting
    // for the vertices and so forth is established.

}
function main() {
    document.onkeydown = handleKeyDown;
    setupWebGL();
    setupShader();

    // Here's where we call the routine that builds all the
    // objects we'll be drawing.
    //const buffers = initBuffers(gl);
    gameObject = new wall();

    var then = 0;

    // Draw the scene repeatedly


    function render(now) {

        now *= 0.001;  // convert to seconds
        const deltaTime = now - then;
        then = now;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
        gl.clearDepth(1.0);                 // Clear everything
        gl.enable(gl.DEPTH_TEST);           // Enable depth testing
        gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

        // Clear the canvas before we start drawing on it.

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        //render map
        for (var x = 0; x < grid.length; x++) {
            for (var y = 0; y < grid[x].length; y++) {
                if (grid[y][x]) {
                    const buffers = createBuffer(gl, gameObject);
                    display(gl, programInfo, buffers, deltaTime, gameObject, [y * 2, x * 2, -0.0]);

                }
            }
        }
        //render robots

        for (var i = 0; i < enemies.length; i++) {
            var robot = enemies[i];
            if(!robot.isDead()){
            // var buffers1 = createBuffer(gl, robot);
            // display(gl, programInfo, buffers1, deltaTime, robot, [robot.getX() * 2, robot.getY() * 2, 0]);
            
            
             
            if (movingF <= virtualTime) {
               // if(robotFireF <= virtualTime){
                    if(robot.seenPlayer(grid,player_1)){
                        robot.stopRobot();
                    robot.fire();
               // }
            }
            
            else{
                robot.stop = false;
            }
                robot.autoMoveX(grid, gameObjectMap, player_1);
                robot.autoMoveY(grid, gameObjectMap, player_1);

            }
        }
        }

        //display(gl, programInfo, buffers, deltaTime, world_floor, [15, 15, -21.0]);

        if (player_1.isDead()) {
            pause = true;
            player_1.deathAnimation();
        }
        //var buffers = createBuffer(gl, player_1);
        //display(gl, programInfo, buffers, deltaTime, player_1, [player_1.getX() * 2, player_1.getY() * 2, 0.0]);
        // display(gl, programInfo, buffers, deltaTime, gameObject,[0.0,0.0,-20.0]);
        inc += 0.1;
        //display object
        for (var i = 0; i < gameObjects.length; i++) {
            if(!gameObjects[i].isDead() || i==0){
            var buffers = createBuffer(gl, gameObjects[i]);
            display(gl, programInfo, buffers, deltaTime, gameObjects[i], [gameObjects[i].getX() * 2, gameObjects[i].getY() * 2, 0]);
            }
        }
        
        //display and render bullet
        for (var i = 0; i < gameObjects.length; i++) {
            var bullet = gameObjects[i].getBullet();
            if(bullet){
                var buffers = createBuffer(gl, bullet);
                display(gl, programInfo, buffers, deltaTime, bullet, [bullet.getX() * 2, bullet.getY() * 2, 0]);
                if(bulletF <= virtualTime){
                    bullet.move(grid, gameObjectMap, gameObjects);
                  gameObjects[i].cleanBullet(gameObjectMap);
                }
            }
        }
        //var bullet_1 = new bullet(4.0, 4.0, true);
        // bullet_1 = null;
        //bullet_1.moveLeft(grid,gameObjectMap,player);
        
        // bullet_1.autoMoveY(grid, gameObjectMap, player_1);
        // bullet_1.autoMoveX(grid, gameObjectMap, player_1);
        // buffers1 = createBuffer(gl, bullet_1);
        // display(gl, programInfo, buffers1, deltaTime, bullet_1, [bullet_1.getX(), bullet_1.getY(),0.0]);
        
        if (movingF <= virtualTime) {
            movingF = incTic(virtualTime, movingTic);
        }
        
        if (bulletF <= virtualTime) {
            bulletF = incTic(virtualTime, bulletTic);
        }
        if (robotFireF <= virtualTime) {
            robotFireF = incTic(virtualTime, robotFTic);
        }
        incTime(globalTime, virtualTime);
        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}





//
// Initialize a shader program, so WebGL knows how to draw our data
//
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // Send the source to the shader object

    gl.shaderSource(shader, source);

    // Compile the shader program

    gl.compileShader(shader);

    // See if it compiled successfully

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function moveLeft(x, y, z) {
    var mMatrix = mat4.create();
    var center = vec3.fromValues(x, y, z);
    var negCtr = vec3.create();
    var movement = vec3.fromValues(x, y, z);
    //move to orgin
    // mat4.fromTranslation(mMatrix,vec3.negate(negCtr,center));
    mat4.translate(mMatrix, mMatrix, vec3.negate(movement, movement));
    //   mat4.fromTranslation(mMatrix,vec3.negate(negCtr,center));
    return mMatrix;
}
