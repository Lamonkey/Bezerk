
class bullet {
    constructor(x, y, direction, local) {
        //this.count = 0;
        this.originX = x;
        this.originY = y;
        this.direction = direction;
        this.turnX = false;
        this.turnY = false;
        this.death = false;
        this.toggle = 0;
        this.x = x;
        this.y = y;
        this.vmatrix = mat4.create();
        this.numComponents = 3;
        this.positions = [
            // Front face
            -0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,
            0.5, 0.5, 0.5,
            -0.5, 0.5, 0.5,

            // Back face
            -0.5, -0.5, -0.5,
            -0.5, 0.5, -0.5,
            0.5, 0.5, -0.5,
            0.5, -0.5, -0.5,

            // Top face
            -0.5, 0.5, -0.5,
            -0.5, 0.5, 0.5,
            0.5, 0.5, 0.5,
            0.5, 0.5, -0.5,

            // Bottom face
            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,
            0.5, -0.5, 0.5,
            -0.5, -0.5, 0.5,

            // Right face
            0.5, -0.5, -0.5,
            0.5, 0.5, -0.5,
            0.5, 0.5, 0.5,
            0.5, -0.5, 0.5,

            // Left face
            -0.5, -0.5, -0.5,
            -0.5, -0.5, 0.5,
            -0.5, 0.5, 0.5,
            -0.5, 0.5, -0.5,
        ];
        this.faceColors = [
            [0.0, 1.0, 0.0, 1.0],    // Front face: white
            [1.0, 0.0, 0.0, 1.0],    // Top face: red
            [0.0, 1.0, 0.0, 1.0],    // Back face: red
            [0.0, 1.0, 0.0, 1.0],    // Bottom face: blue
            [0.0, 1.0, 0.0, 1.0],    // Right face: yellow
            [0.0, 1.0, 0.0, 1.0],    // Left face: purple
        ];

        this.indices = [
            0, 1, 2, 0, 2, 3,    // front
            4, 5, 6, 4, 6, 7,    // back
            8, 9, 10, 8, 10, 11,   // top
            12, 13, 14, 12, 14, 15,   // bottom
            16, 17, 18, 16, 18, 19,   // right
            20, 21, 22, 20, 22, 23,   // left
        ];
        this.local = local;
    }
    getPosition() {
        return this.positions;
    }
    getNumComponents() {
        return this.numComponents;
    }
    getPosition() {
        return this.positions;
    }

    getFaceColor() {
        return this.faceColors;
    }
    getIndices() {
        return this.indices;
    }
    setvmatrix(vmatrix) {
        this.vmatrix = vmatrix;
    }
    getvmatrix() {
        return this.vmatrix;
    }
    getCenter() {
        return null;
    }
    move(grid, goMap, gos) {
        //this.count++;
        switch (this.direction) {
            case "up":
                this.moveUp(grid, goMap, gos);
                break;
            case "down":
                this.moveDown(grid, goMap, gos);
                break;
            case "left":
                this.moveLeft(grid, goMap, gos);
                break;
            case "right":
                this.moveRight(grid, goMap, gos);
                break;

        }

       
    }
    checkCollision(grid, x, y, goMap, gos) {
        if (!grid[x][y]) {
            if (!goMap[x][y]) {
                for(var i = 0; i < gos.length;i++ ){
                    player = gos[i];
                    if (player.getX() == x && player.getY() == y) {
                        player.death = true;
                        this.death = true;
                        this.unOccupyP(goMap,x,y);
                    }
                }
                return false;
            }
        }
        return !grid[x][y];
    }

    unOccupyP(goMap, x, y) {
        goMap[x][y] = true;
    }
    occupyP(goMap, x, y) {
        goMap[x][y] = false;
    }
    moveUp(grid, goMap, player) {
        if (this.checkCollision(grid, this.x, this.y - 1, goMap, player) ) {
            this.occupyP(goMap, this.x, this.y - 1);
            if(!(this.x == this.originX && this.y == this.originY)){
                this.unOccupyP(goMap, this.x, this.y);
            }
            
            this.y = this.y - 1;
        }
        else {
            this.death = true;
        }

    }
    moveDown(grid, goMap, player) {
        if (this.checkCollision(grid, this.x, this.y + 1, goMap, player)) {
            this.occupyP(goMap, this.x, this.y + 1);
            if(!(this.x == this.originX && this.y == this.originY)){
                this.unOccupyP(goMap, this.x, this.y);
            }
            this.y = this.y + 1;
        }
        else {
            this.death = true;
        }
    }
    moveLeft(grid, goMap, player) {
        if (this.checkCollision(grid, this.x - 1, this.y, goMap, player)) {
            this.occupyP(goMap, this.x - 1, this.y);
            if(!(this.x == this.originX && this.y == this.originY)){
                this.unOccupyP(goMap, this.x, this.y);
            }

            this.x = this.x - 1;

        }
        else {
            this.death = true;
            
        }
    }
    moveRight(grid, goMap, player) {
        if (this.checkCollision(grid, this.x + 1, this.y, goMap, player)) {
            this.occupyP(goMap, this.x + 1, this.y);
            if(!(this.x == this.originX && this.y == this.originY)){
                this.unOccupyP(goMap, this.x, this.y);
            }
            this.x = this.x + 1;

        }
        else {
            this.death = true;
        }
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    isDead() {
        return this.death;
    }
    autoMoveX(grid, goMap, player) {
        if (this.moveX) {
            if (this.turnX) {
                this.moveLeft(grid, goMap, player);
            }
            else {
                this.moveRight(grid, goMap, player);
            }
        }
    }
    autoMoveY(grid, goMap, player) {
        if (this.moveY) {
            if (this.turnY) {
                this.moveUp(grid, goMap, player);
            }
            else {
                this.moveDown(grid, goMap, player);
            }
        }
    }
    deathAnimation() {

        if (this.toggle <= 10) {
            this.faceColors = [
                [1.0, 1.0, 1.0, 1.0],    // Front face: white
                [1.0, 0.0, 0.0, 1.0],    // Top face: green
                [0.0, 0.0, 0.0, 1.0],    // Back face: red
                [1.0, 1.0, 1.0, 1.0],    // Bottom face: blue
                [1.0, 1.0, 1.0, 1.0],    // Right face: yellow
                [1.0, 1.0, 1.0, 1.0],    // Left face: purple
            ];
        }
        else if (this.toggle <= 20) {
            this.faceColors = [
                [1.0, 1.0, 1.0, 1.0],    // Front face: white
                [1.0, 1.0, 1.0, 1.0],    // Top face: green
                [0.0, 0.0, 0.0, 1.0],    // Back face: red
                [1.0, 1.0, 1.0, 1.0],    // Bottom face: blue
                [1.0, 1.0, 1.0, 1.0],    // Right face: yellow
                [1.0, 1.0, 1.0, 1.0],    // Left face: purple
            ];

        }
        else {
            //reset
            this.toggle = -1;
        }
        this.toggle++;

    }
}