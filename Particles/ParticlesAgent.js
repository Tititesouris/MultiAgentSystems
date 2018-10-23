class ParticlesAgent extends Agent {
    constructor(environment, position, color, indecisiveness, direction, bounceBehavior, hitColor) {
        super(environment, "Ball", position, color, indecisiveness);
        this.direction = direction;
        this.bounceBehavior = bounceBehavior;
        this.hitColor = hitColor;
    }

    decide() {
        super.decide();
        let [x, y] = this.position;
        let [dirX, dirY] = this.direction;
        let nextPosition = this.environment.convertLocation([x + dirX, y + dirY]);
        if (nextPosition) {
            let agent = this.environment.getAgentAt(nextPosition);
            if (agent !== null) {
                this.bounce(agent, true);
            }
            else {
                this.moveTo(nextPosition);
            }
        }
        else {
            if (x + dirX < 0)
                dirX = 1;
            else if (x + dirX >= this.environment.getWidth())
                dirX = -1;
            if (y + dirY < 0)
                dirY = 1;
            else if (y + dirY >= this.environment.getHeight())
                dirY = -1;
            this.direction = [dirX, dirY];
            this.moveTo([x + dirX, y + dirY]);
        }
    }

    bounce(target, origin) {
        let targetDir = target.getDirection();
        let [dirX, dirY] = this.direction;

        switch (this.bounceBehavior) {
            case "SWAP":
                if (origin)
                    target.bounce(this, false);
                this.direction = targetDir;
                break;
            case "REVERSE":
                this.direction = [-dirX, -dirY];
                break;
            case "WAIT":
                break;
        }

        this.color = this.hitColor;
    }

    hasCollided() {
        return this.color === this.hitColor;
    }

    getDirection() {
        return this.direction;
    }

}