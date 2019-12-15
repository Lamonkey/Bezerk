class map {
    constructor(local) {
        this.local = local;
        this.gameObjectLocation = this.constructGOLocation();
        this.world = null;
        this.long = 15
        this.height = 15
        //placeingWall();
    }
    /**
     * construct game object location
     */
    constructGOLocation(){
        var map = new Array(14);
        for (var i = 0; i < 15; i++) {
           map[i] = new Array(14);
           map[i].fill(true);
        }
        return map;
        
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
                    if (x == 0 || x == 5 || x == 9) {
                        this.world[x][y] = true;
                    }
                }
                 if (y == 8 || y == 14) {
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
    /**
     * return a scaleling matrix as floor
     */
    constructFloor(){
        var mMatrix = mat4.create();
        var negCtr = vec3.create();
        var center = [15/2,15/2];
        //move the model to the origin
        mat4.fromTranslation(mMatrix,vec3.negate(negCtr,center));
        mat4.fromScaling(mMatrix,vec3.fromValue(15,15,1));
        
        

    }
    getGOMap(){
        return this.gameObjectLocation;
    }
    printMap() {
       var map = "";
        for (var x = 0; x < 15; x++) {
            for (var y = 0; y < 15; y++) {
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
