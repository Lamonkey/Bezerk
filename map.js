class map {
    constructor(local) {
        this.local = local;
        this.world = null;
        //placeingWall();
    }
    constructGrid() {
         this.world = new Array(14);
        for (var i = 0; i < 15; i++) {
            this.world[i] = new Array(14);
        }


    }
    placeingWall() {
        for (var x = 0; x < 15; x++) {
            for (var y = 0; y < 15; y++) {
                if (x == 0 || x == 14) {
                    this.world[x][y] = true;
                }
                 if (y == 0) {
                    this.world[x][y] = true;
                }
                 if (y == 1 || y == 2 || y == 3) {
                    if (x == 0 || x == 4 || x == 7 || x == 10) {
                        this.world[x][y] = true;
                    }
                }
                 if (y == 6 || y == 10 || y == 14) {
                    if (x != 5 && x != 6 && x != 8 && x != 7) {
                        this.world[x][y] = true;
                    }
                }
                if(!this.world[x][y]) {
                    this.world[x][y] = false;
                }
            }
        }
    }
    getMap(){
        return this.world;
    }
    printMap() {
       var map = "";
        for (var x = 0; x < 10; x++) {
            for (var y = 0; y < 10; y++) {
                if (this.world[y][x]) {
                  map = map.concat("x");
                    
                }
                else {
                   map = map.concat(" ");
                }
            }
           map = map.concat("\n");
        }
        console.log(map);
    }
}
