
class enemy {
    constructor(x, y, moveX, local) {
        this.stop = false;
        this.direction;
        this.bullet = null;
        this.moveX = moveX;
        this.moveY = !moveX;
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
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            -1.0, 1.0, 1.0,

            // Back face
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,

            // Top face
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, -1.0,

            // Bottom face
            -1.0, -1.0, -1.0,
            1.0, -1.0, -1.0,
            1.0, -1.0, 1.0,
            -1.0, -1.0, 1.0,

            // Right face
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,

            // Left face
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0,
        ];

        this.faceColors = [
            [0.0, 1.0, 0.0, 1.0],    // Front face: white
            [0.0, 1.0, 0.0, 1.0],    // Top face: green
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
    stopRobot() {
        this.stop = true;
    }
    getBullet() {
        return this.bullet;
    }

    cleanBullet(goMap) {
        if (this.bullet) {
            if (this.bullet.isDead()) {
                goMap[this.bullet.getX()][this.bullet.getY()] = true;
                this.bullet = null;
            }
        }
    }

    fire() {
        if (!this.bullet) {
            this.bullet = new bullet(this.x, this.y, this.direction);
        }
    }
    
    seenPlayer(grid, player) {
        var deltaX = this.x - player.getX();
        var deltaY = this.y - player.getY();
        var mmdis = Math.abs(deltaX) + Math.abs(deltaY);
        if (mmdis == Math.abs(deltaX)) {
            //check if there is a way between 
            var sign = deltaX / Math.abs(deltaX);
            for (var i = player.getX(); i != this.x; i += sign) {
                if (grid[i][this.y]) {
                    return false;
                }
            }
            if (sign == -1) {
                this.direction = "right";
            }
            else {
                this.direction = "left";
            }
            return true;


        }
        else if (mmdis == Math.abs(deltaY)) {
            var sign = deltaY / Math.abs(deltaY);
            for (var i = player.getY(); i != this.y; i += sign) {
                if (grid[this.x][i]) {
                    return false;
                }
            }
            if (sign == -1) {
                this.direction = "down";
            }
            else {
                this.direction = "up";
            }
            return true;
        }


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

    checkCollision(grid, x, y, goMap, player) {
        if (!grid[x][y]) {
            if (!goMap[x][y]) {
                if (player.getX() == x && player.getY() == y) {
                    player.death = true;
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
        if (this.checkCollision(grid, this.x, this.y - 1, goMap, player)) {
            this.occupyP(goMap, this.x, this.y - 1);
            this.unOccupyP(goMap, this.x, this.y);
            this.y = this.y - 1;
        }
        else {
            this.turnY = !this.turnY;
        }

    }
    moveDown(grid, goMap, player) {
        if (this.checkCollision(grid, this.x, this.y + 1, goMap, player)) {
            this.occupyP(goMap, this.x, this.y + 1);
            this.unOccupyP(goMap, this.x, this.y);
            this.y = this.y + 1;
        }
        else {
            this.turnY = !this.turnY;
        }
    }
    moveLeft(grid, goMap, player) {
        if (this.checkCollision(grid, this.x - 1, this.y, goMap, player)) {
            this.occupyP(goMap, this.x - 1, this.y);
            this.unOccupyP(goMap, this.x, this.y);

            this.x = this.x - 1;

        }
        else {
            this.turnX = !this.turnX;
        }
    }
    moveRight(grid, goMap, player) {
        if (this.checkCollision(grid, this.x + 1, this.y, goMap, player)) {
            this.occupyP(goMap, this.x + 1, this.y);
            this.unOccupyP(goMap, this.x, this.y);

            this.x = this.x + 1;

        }
        else {
            this.turnX = !this.turnX;
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
        if (this.moveX && !this.stop) {
            if (this.turnX) {
                this.moveLeft(grid, goMap, player);
            }
            else {
                this.moveRight(grid, goMap, player);
            }
        }
    }
    autoMoveY(grid, goMap, player) {
        if (this.moveY && !this.stop) {
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