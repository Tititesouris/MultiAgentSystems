class PacmanEnvironment extends Environment {
    constructor(torus, width, height) {
        super(torus, width, height);
        this.won = false;
        this.lost = false;
    }

    /**
     * Gets the best next position to be at according to the distance layer from a location converted into the corresponding position in the environment.
     * If the position doesn't exist in the environment, returns false.
     * If no best step can be found, returns null
     * @param location
     * @returns {*}
     */
    getBestStepOnDistanceLayerAt(location) {
        let position = this.convertLocation(location);
        if (!position)
            return false;

        let layer = this.getLayer("distance");
        // Compute the grid if necessary
        if (layer.getLastTargetPosition() === null || this.getAgentAt(layer.getLastTargetPosition()) !== layer.getTarget()) {
            layer.computeDistances();
        }

        let [x, y] = position;
        let bestVal = layer.getValueAt(position);
        let bestPosition = null;
        let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        // If 2 directions are equivalent, pick one at random to look more natural
        RNG.shuffle(directions);
        for (let i = 0; i < directions.length; i++) {
            let [dirX, dirY] = directions[i];
            let newPosition = this.convertLocation([x + dirX, y + dirY]);
            if (newPosition) {
                let value = layer.getValueAt(newPosition);
                if (value !== null) {
                    if (layer.getTarget().isInvincible() ? (value > bestVal) : (value < bestVal)) {
                        bestVal = value;
                        bestPosition = newPosition;
                    }
                }
            }
        }
        return bestPosition;
    }

    win() {
        this.won = true;
    }

    lose() {
        this.lost = true;
    }

    checkWinCondition() {
        return this.won;
    }

    checkLoseCondition() {
        return this.lost;
    }

}