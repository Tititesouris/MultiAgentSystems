class Layer {
    constructor(environment, x, y, width, height) {
        this.environment = environment;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.resetCells(null);
    }

    getValueAt([x, y]) {
        return this.cells[y][x];
    }

    resetCells(value) {
        this.cells = [];
        for (let y = 0; y < this.height; y++) {
            let row = [];
            for (let x = 0; x < this.width; x++) {
                row.push(value);
            }
            this.cells.push(row);
        }
    }
}

class DistanceToTargetLayer extends Layer {
    constructor(environment, x, y, width, height, target, obstacles) {
        super(environment, x, y, width, height);
        this.target = target;
        this.obstacles = obstacles;
        this.lastTargetPosition = null;
    }

    computeDistances() {
        this.resetCells(null);
        this.floodFill(this.target.getPosition());
        this.lastTargetPosition = this.target.position;
    }

    isBlockedAt([x, y]) {
        for (let i = 0; i < this.obstacles.length; i++) {
            let obstacle = this.obstacles[i];
            if (this.environment.getAgentAt([x, y]) instanceof obstacle) {
                return true;
            }
        }
        return false;
    }

    floodFill([startX, startY]) {
        let cellsToFill = [[startX, startY, 0]];
        while (cellsToFill.length > 0) {
            let [x, y, value] = cellsToFill.shift();
            if (this.isBlockedAt([x, y])) {
                this.cells[y][x] = null;
            }
            else if (this.cells[y][x] === null || this.cells[y][x] > value) {
                this.cells[y][x] = value;
                if (this.environment.isToric()) {
                    cellsToFill.push([(x - 1 + this.width) % this.width, y, value + 1]);
                    cellsToFill.push([x, (y - 1 + this.height) % this.height, value + 1]);
                    cellsToFill.push([(x + 1 + this.width) % this.width, y, value + 1]);
                    cellsToFill.push([x, (y + 1 + this.height) % this.height, value + 1]);
                }
                else {
                    if (x > 0)
                        cellsToFill.push([x - 1, y, value + 1]);
                    if (y > 0)
                        cellsToFill.push([x, y - 1, value + 1]);
                    if (x < this.width - 1)
                        cellsToFill.push([x + 1, y, value + 1]);
                    if (y < this.height - 1)
                        cellsToFill.push([x, y + 1, value + 1]);
                }
            }
        }
    }

    getTarget() {
        return this.target;
    }

    getLastTargetPosition() {
        return this.lastTargetPosition;
    }
}