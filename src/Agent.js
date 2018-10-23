class Agent {
    /**
     *
     * @param environment
     * @param name
     * @param position
     * @param color
     * @param indecisiveness    -1 = Never decide; 0 = Decide every tick; N = decide every N ticks
     * @param eventQueue
     */
    constructor(environment, name, position, color, indecisiveness, eventQueue) {
        this.environment = environment;
        this.name = name;
        this.position = position;
        this.color = color;
        this.indecisiveness = indecisiveness;
        this.eventQueue = eventQueue;
        this.lastPosition = position;
        this.decision = 0;
        this.age = 0;
        this.born = false;
        this.dead = false;
        this.visible = true;
        this.neighborhood = [];
        this.emptyNeighborhood = [];
        this.agentsNeighborhood = [];
        this.specificNeighborhood = {};
    }

    /**
     * Method called by the scheduler. If returns true decide() is called.
     */
    think() {
        if (this.indecisiveness > -1) {
            if (this.decision <= 0) {
                this.decision = this.indecisiveness;
                return true;
            }
            else {
                this.decision--;
            }
        }
        return false;
    }

    /**
     * Where all the agent logic goes.
     */
    decide() {
        this.age++;
    }

    /**
     * Updates the neighborhood information fields.
     * @param method    8 = Look through all neighbors; 4 = Look through non-diagonal adjacent neighbors
     * @param range     How far away from the agent starts the neighborhood
     * @param empty     Whether or not to update the empty neighborhood information
     * @param agents    Whether or not to update the non-empty neighborhood information
     * @param types     List of classes corresponding to the specific neighborhood information to update
     * @returns {boolean}
     */
    updateNeighborhood(method, range, empty, agents, types) {
        let neighborhood = this.environment.getNeighborhood(this.position, method, range);
        if (neighborhood === false)
            return false;

        this.neighborhood = neighborhood;

        if (empty)
            this.emptyNeighborhood = this.neighborhood.filter(neighbor => neighbor.agent === null);

        if (agents)
            this.agentsNeighborhood = this.neighborhood.filter(neighbor => neighbor.agent !== null);

        if (types !== undefined) {
            this.specificNeighborhood = {};
            for (let i = 0; i < types.length; i++) {
                let type = types[i];
                this.specificNeighborhood[type] = this.neighborhood.filter(neighbor => neighbor.agent instanceof type);
            }
        }

        return true;
    }

    moveTo([x, y]) {
        this.lastPosition = this.position;
        this.position = [x, y];
        this.environment.moveAgent(this, this.lastPosition, this.position);
    }

    moveRandomlyIfPossible() {
        if (this.emptyNeighborhood.length <= 0)
            return false;
        this.moveTo(RNG.randElem(this.emptyNeighborhood).position);
        return true;
    }

    birth() {
        this.born = true;
    }

    live() {
        this.born = false;
    }

    die() {
        this.dead = true;
    }

    isBorn() {
        return this.born;
    }

    isDead() {
        return this.dead;
    }

    getName() {
        return this.name;
    }

    getAge() {
        return this.age;
    }

    getPosition() {
        return this.position;
    }

    getColor() {
        return this.color;
    }

    isActive() {
        return !this.born && !this.dead;
    }

    isVisible() {
        return this.visible;
    }
}