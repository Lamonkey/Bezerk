
class player {
    constructor(x, y, local) {
        this.direction = "down";
        this.bullet = null;
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
            [1.0, 1.0, 1.0, 1.0],    // Front face: white
            [1.0, 1.0, 1.0, 1.0],    // Top face: green
            [0.0, 0.0, 0.0, 1.0],    // Back face: red
            [1.0, 1.0, 1.0, 1.0],    // Bottom face: blue
            [1.0, 1.0, 1.0, 1.0],    // Right face: yellow
            [1.0, 1.0, 1.0, 1.0],    // Left face: purple
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

    checkCollision(grid, x, y, goMap) {
        if (grid[x][y] || !goMap[x][y]) {
            this.death = true;
        }
        return (!grid[x][y] && goMap[x][y])
    }
    unOccupyP(goMap, x, y) {
        goMap[x][y] = true;
    }
    occupyP(goMap, x, y) {
        goMap[x][y] = false;
    }
    moveUp(grid, goMap) {
        if (this.checkCollision(grid, this.x, this.y - 1, goMap)) {
            this.occupyP(goMap, this.x, this.y - 1);
            this.unOccupyP(goMap, this.x, this.y);
            this.y = this.y - 1;
            this.direction = "up";
        }

    }
    moveDown(grid, goMap) {
        if (this.checkCollision(grid, this.x, this.y + 1, goMap)) {
            this.occupyP(goMap, this.x, this.y + 1);
            this.unOccupyP(goMap, this.x, this.y);
            this.direction = "down";
            this.y = this.y + 1;
        }
    }
    moveLeft(grid, goMap) {
        if (this.checkCollision(grid, this.x - 1, this.y, goMap)) {
            this.occupyP(goMap, this.x - 1, this.y);
            this.unOccupyP(goMap, this.x, this.y);
            this.direction = "left";
            this.x = this.x - 1;

        }
    }
    moveRight(grid, goMap) {
        if (this.checkCollision(grid, this.x + 1, this.y, goMap)) {
            this.occupyP(goMap, this.x + 1, this.y);
            this.unOccupyP(goMap, this.x, this.y);
            this.direction = "right";
            this.x = this.x + 1;

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