class PacmanAgent extends Agent {
    constructor(environment, name, position, color, indecisiveness, eventQueue) {
        super(environment, name, position, color, indecisiveness, eventQueue);
    }

    decide() {
        super.decide();
    }
}

class PacmanWallAgent extends PacmanAgent {
    constructor(environment, position, color) {
        super(environment, "Wall", position, color, -1, null);
    }
}

class PacmanGhostAgent extends PacmanAgent {
    constructor(environment, position, color, speed, eventQueue) {
        let indecisiveness = Math.max(0, 100 - speed);
        super(environment, "Ghost", position, color, indecisiveness, eventQueue);
    }

    decide() {
        super.decide();
        let event = this.eventQueue.shiftEvent();
        switch (event) {
            case "slowing":
                this.indecisiveness = Math.min(100, this.indecisiveness + 1);
                break;
            case "speeding":
                this.indecisiveness = Math.max(1, this.indecisiveness - 1);
                break;
        }
        let nextPosition = this.environment.getBestStepOnDistanceLayerAt(this.position);
        if (nextPosition) {
            let agent = this.environment.getAgentAt(nextPosition);
            if (agent === null) {
                this.moveTo(nextPosition);
            }
            else if (agent instanceof PacmanPlayerAgent) {
                agent.eaten();
            }
        }
    }
}

class PacmanPlayerAgent extends PacmanAgent {
    constructor(environment, position, color, invincibilityColor, invincibilityWearOffColor, exitColor, speed, overload, eventQueue) {
        let indecisiveness = Math.max(0, 100 - speed);
        super(environment, "Player", position, color, indecisiveness, eventQueue);
        this.baseColor = color;
        this.invincibilityColor = invincibilityColor;
        this.invincibilityWearOffColor = invincibilityWearOffColor;
        this.exitColor = exitColor;
        this.direction = [0, 0];
        this.energy = 0;
        this.boosted = 0;
        this.overload = overload;
    }

    decide() {
        super.decide();
        let color = this.baseColor;
        if (this.energy > 0) {
            if (this.energy <= 10 && this.energy % 2 === 0)
                color = this.invincibilityWearOffColor;
            else
                color = this.invincibilityColor;
            this.energy--;
        }
        this.color = color;


        let event = this.eventQueue.shiftEvent();
        switch (event) {
            case "up":
                this.direction = [0, -1];
                break;
            case "down":
                this.direction = [0, 1];
                break;
            case "left":
                this.direction = [-1, 0];
                break;
            case "right":
                this.direction = [1, 0];
                break;
            case "slowing":
                this.slowDown();
                break;
            case "speeding":
                this.speedUp();
                break;
        }

        let [x, y] = this.position;
        let [dirX, dirY] = this.direction;
        let nextPosition = this.environment.convertLocation([x + dirX, y + dirY]);
        if (nextPosition === false) {
            this.direction = [0, 0];
            nextPosition = this.position;
        } else {
            let agent = this.environment.getAgentAt(nextPosition);
            if (agent instanceof PacmanWallAgent) {
                this.direction = [0, 0];
                nextPosition = this.position;
            }
            else if (agent instanceof PacmanPowerpelletAgent) {
                this.energy = agent.getStrength();
                this.boosted++;
                agent.consume();
                if (this.boosted >= this.overload) {
                    let winner = new PacmanExitAgent(this.environment, this.environment.getRandomFreeCellPosition(), this.exitColor);
                    this.environment.addAgent(winner, winner.position);
                }
            }
            else if (agent instanceof PacmanGhostAgent) {
                if (this.isInvincible()) {
                    this.environment.removeAgent(agent);
                }
                else {
                    this.eaten();
                }
            }
            else if (agent instanceof PacmanExitAgent) {
                this.environment.removeAgent(this);
                this.environment.win();
            }
        }

        this.moveTo(nextPosition);
    }

    speedUp() {
        this.indecisiveness = Math.max(0, this.indecisiveness - 1);
    }

    slowDown() {
        this.indecisiveness = Math.min(100, this.indecisiveness + 1);
    }

    isInvincible() {
        return this.energy > 0;
    }

    eaten() {
        this.environment.removeAgent(this);
        this.environment.lose();
    }
}

class PacmanPowerpelletAgent extends PacmanAgent {
    constructor(environment, position, color, durationFactor, powerpelletStrength) {
        super(environment, "Powerpellet", position, color, 0, null);
        this.durationFactor = durationFactor;
        this.powerpelletStrength = powerpelletStrength;
        this.life = durationFactor * (this.environment.width + this.environment.height);
    }

    decide() {
        super.decide();
        if (this.life <= 0) {
            this.consume();
        }
        this.life--;
    }

    consume() {
        let agent = new PacmanPowerpelletAgent(this.environment, this.environment.getRandomFreeCellPosition(), this.color, this.durationFactor, this.powerpelletStrength);
        this.environment.addAgent(agent, agent.position);
        this.environment.removeAgent(this);
    }

    getStrength() {
        return this.powerpelletStrength;
    }

}

class PacmanExitAgent extends PacmanAgent {
    constructor(environment, position, color) {
        super(environment, "Exit", position, color, -1, null);
    }
}