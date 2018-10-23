class Environment {
    constructor(torus, width, height) {
        this.torus = torus;
        this.width = width;
        this.height = height;
        this.logger = null;
        this.agents = [];
        this.cells = [];
        this.layers = {};
        this.resetCells();
    }

    setLogger(logger) {
        this.logger = logger;
    }

    /**
     * Converts any [x, y] location into the corresponding position in the environment.
     * If such position doesn't exist in the environment, returns false.
     * @param x
     * @param y
     * @returns {*}
     */
    convertLocation([x, y]) {
        if (this.torus) {
            return [(x + this.width) % this.width, (y + this.height) % this.height];
        }
        if (0 <= x && x < this.width && 0 <= y && y < this.height) {
            return [x, y];
        }
        return false;
    }

    setLayer(name, layer) {
        this.layers[name] = layer;
    }

    /**
     * Adds an agent at the [x, y] location converted into the corresponding position in the environment.
     * If the position doesn't exist in the environment, returns false.
     * The agent is marked as born until the end of the tick.
     * @param agent
     * @param location
     */
    addAgent(agent, location) {
        let position = this.convertLocation(location);
        if (!position)
            return false;

        let [x, y] = position;
        agent.birth();
        this.agents.push(agent);
        this.cells[y][x] = agent;
        this.log(["ADD_AGENT", agent.getName(), x, y]);
    }

    /**
     * Removes an agent from the environment.
     * The agent is marked as dead until the end of the tick.
     * @param agent
     * @returns {boolean}
     */
    removeAgent(agent) {
        let [x, y] = agent.getPosition();
        agent.die();
        this.cells[y][x] = null;
        this.log(["REMOVE_AGENT", agent.getName(), agent.getAge(), x, y]);
    }

    /**
     * Moves an agent from a location to another, converted into the corresponding positions in the environment.
     * If either position doesn't exist in the environment, returns false.
     * @param agent
     * @param oldLocation
     * @param newLocation
     * @returns {boolean}
     */
    moveAgent(agent, oldLocation, newLocation) {
        let oldPosition = this.convertLocation(oldLocation);
        let newPosition = this.convertLocation(newLocation);
        if (!oldPosition || !newPosition)
            return false;

        let [oldX, oldY] = oldPosition;
        let [newX, newY] = newPosition;
        this.cells[oldY][oldX] = null;
        this.cells[newY][newX] = agent;
        this.log(["MOVE_AGENT", agent.getName(), agent.getAge(), oldX, oldY, newX, newY]);
    }

    /**
     * Goes through every agent, permanently deletes dead agents and unmarks newly born agents.
     */
    updateAgentsState() {
        for (let i = 0; i < this.agents.length; i++) {
            let agent = this.agents[i];
            if (agent.isDead()) {
                this.agents.splice(this.agents.indexOf(agent), 1);
            }
            if (agent.isBorn()) {
                agent.live();
            }
        }
    }

    /**
     * Returns a random position in the environment which doesn't contain any agent.
     * @returns {number[]}
     */
    getRandomFreeCellPosition() {
        let [x, y] = [0, 0];
        do {
            [x, y] = [RNG.randInt(this.width), RNG.randInt(this.height)]
        }
        while (this.cells[y][x] !== null);
        return [x, y];
    }

    /**
     * Returns the neighborhood information around the location converted into the corresponding position in the environment.
     * If the position doesn't exist in the environment, returns false.
     * The MultiAgentSystems agent is marked as born until the end of the tick.
     * @param location
     * @param method    8 = Look through all neighbors; 4 = Look through non-diagonal adjacent neighbors
     * @param range     How far away from the agent starts the neighborhood
     * @returns {*}
     */
    getNeighborhood(location, method, range) {
        let position = this.convertLocation(location);
        if (!position)
            return false;

        let [x, y] = position;
        let neighborhood = [];
        for (let j = -range; j <= range; j++) {
            for (let i = -range; i <= range; i++) {
                if ((method === "8" && (i !== 0 || j !== 0)) || (method === "4" && ((i === 0 || j === 0) && i !== j))) {
                    let neighborPosition = this.convertLocation([x + i, y + j]);
                    if (neighborPosition) {
                        let agent = this.getAgentAt(neighborPosition);
                        if (agent !== false) {
                            let neighbor = {direction: [i, j], position: neighborPosition, agent: agent};
                            neighborhood.push(neighbor);
                        }
                    }
                }
            }
        }
        return neighborhood;
    }

    getWidth() {
        return this.width;
    }

    getHeight() {
        return this.height;
    }

    getLayers() {
        return this.layers;
    }

    getLayer(name) {
        return this.layers[name];
    }

    getAgents() {
        return this.agents;
    }

    isToric() {
        return this.torus;
    }

    /**
     * Returns the agent at the [x, y] location converted into the corresponding position in the environment.
     * If the position doesn't exist in the environment, returns false.
     * @param location
     * @returns {*}
     */
    getAgentAt(location) {
        let position = this.convertLocation(location);
        if (!position)
            return false;

        let [x, y] = position;
        return this.cells[y][x];
    }

    resetCells() {
        this.cells = [];
        for (let y = 0; y < this.height; y++) {
            let row = [];
            for (let x = 0; x < this.width; x++) {
                row.push(null);
            }
            this.cells.push(row);
        }
    }

    log(log) {
        if (this.logger !== null)
            this.logger.log(log);
    }
}