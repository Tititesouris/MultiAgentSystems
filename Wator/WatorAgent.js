class WatorAgent extends Agent {
    constructor(environment, name, position, babyColor, adultColor, gestation, explosivePregnancy, oneActionPerTurn) {
        super(environment, name, position, babyColor, 0, null);
        this.babyColor = babyColor;
        this.adultColor = adultColor;
        this.gestationLength = gestation;
        this.gestation = 0;
        this.explosivePregnancy = explosivePregnancy;
        this.oneActionPerTurn = oneActionPerTurn;
        this.action = 0;
    }

    decide() {
        super.decide();
        this.gestate();
    }

    gestate() {
        this.gestation++;
    }

    canReproduce() {
        return this.gestation >= this.gestationLength;
    }

    reproduce(baby) {
        this.environment.addAgent(baby, baby.getPosition());
        this.gestation = 0;
    }

}

class WatorSharkAgent extends WatorAgent {
    constructor(environment, position, babyColor, adultColor, gestation, explosivePregnancy, oneActionPerTurn, starvation, babyFood, reproduceWhenEating, reproduceWhenMoving, gestateOnlyWhenEating, moveWhenEating) {
        super(environment, "Shark", position, babyColor, adultColor, gestation, explosivePregnancy, oneActionPerTurn);
        this.starvationLength = starvation;
        this.babyFood = babyFood;
        this.food = this.babyFood;
        this.reproduceWhenEating = reproduceWhenEating;
        this.reproduceWhenMoving = reproduceWhenMoving;
        this.gestateOnlyWhenEating = gestateOnlyWhenEating;
        this.moveWhenEating = moveWhenEating;
    }

    decide() {
        super.decide();
        this.updateNeighborhood("8", 1, true, false, [WatorFishAgent]);
        if (this.food > 0) {
            if (this.oneActionPerTurn) {
                this.oneActionPerTurnBehavior();
            }
            else {
                this.normalBehavior();
            }
        }
        else {
            this.environment.removeAgent(this);
        }

        this.color = this.adultColor;
    }

    normalBehavior() {
        let moved = false;
        let ate = false;
        if (this.eat()) {
            ate = true;
        }
        else {
            moved = this.moveRandomlyIfPossible();
            this.food--;
        }

        if (this.canReproduce()) {
            if (ate && this.reproduceWhenEating || moved && this.reproduceWhenMoving) {
                if (this.moveWhenEating)
                    this.makeBaby(this.lastPosition);
                else
                    this.makeRandomBaby();
            }
            else if (this.explosivePregnancy)
                this.environment.removeAgent(this);
        }
    }

    oneActionPerTurnBehavior() {
        let ate = false;

        switch (this.action) {
            case 0: // Eat
                ate = this.eat();
                break;
            case 1: // Move
                this.moveRandomlyIfPossible();
                break;
            case 2: // Reproduce
                if (this.canReproduce()) {
                    this.makeRandomBaby();
                }
                break;
        }
        if (!ate)
            this.food--;
        this.action = (this.action + 1) % 3;
    }

    eat() {
        let fishNeighborhood = this.specificNeighborhood[WatorFishAgent];
        if (fishNeighborhood.length > 0) {
            let target = RNG.randElem(fishNeighborhood);
            this.environment.removeAgent(target.agent);
            if (this.moveWhenEating)
                this.moveTo(target.position);
            this.food = this.starvationLength;
            if (this.gestateOnlyWhenEating)
                this.gestation++;
            return true;
        }
        return false;
    }

    gestate() {
        if (!this.gestateOnlyWhenEating) {
            super.gestate();
        }
    }

    makeRandomBaby() {
        if (this.emptyNeighborhood.length > 0) {
            this.makeBaby(RNG.randElem(this.emptyNeighborhood).position);
        }
        else if (this.explosivePregnancy)
            this.environment.removeAgent(this);
    }

    makeBaby(position) {
        this.reproduce(new WatorSharkAgent(this.environment, position, this.babyColor, this.adultColor, this.gestationLength, this.explosivePregnancy, this.oneActionPerTurn, this.starvationLength, this.babyFood, this.reproduceWhenEating, this.reproduceWhenMoving, this.gestateOnlyWhenEating, this.moveWhenEating));
    }

}

class WatorFishAgent extends WatorAgent {
    constructor(environment, position, babyColor, adultColor, gestation, explosivePregnancy, oneActionPerTurn, suffocate, breath) {
        super(environment, "Fish", position, babyColor, adultColor, gestation, explosivePregnancy, oneActionPerTurn);
        this.suffocate = suffocate;
        this.breath = breath;
    }

    decide() {
        super.decide();
        this.updateNeighborhood("8", 1, true, false);

        // If the fish is suffocating
        if (this.suffocate && (this.emptyNeighborhood.length < this.breath)) {
            this.environment.removeAgent(this);
        }
        else {
            if (this.oneActionPerTurn) {
                this.oneActionPerTurnBehavior();
            }
            else {
                this.normalBehavior();
            }
        }

        this.color = this.adultColor;
    }

    normalBehavior() {
        if (this.moveRandomlyIfPossible()) {
            if (this.canReproduce()) {
                this.makeBaby(this.lastPosition);
            }
        }
        else if (this.explosivePregnancy && this.canReproduce()) {
            this.environment.removeAgent(this);
        }
    }

    oneActionPerTurnBehavior() {
        switch (this.action) {
            case 0: // Move
                this.moveRandomlyIfPossible();
                break;
            case 1: // Reproduce
                if (this.canReproduce()) {
                    if (this.emptyNeighborhood.length > 0) {
                        this.makeBaby(RNG.randElem(this.emptyNeighborhood).position);
                    }
                    else if (this.explosivePregnancy)
                        this.environment.removeAgent(this);
                }
                break;
        }
        this.action = (this.action + 1) % 2;
    }

    makeBaby(position) {
        this.reproduce(new WatorFishAgent(this.environment, position, this.babyColor, this.adultColor, this.gestationLength, this.explosivePregnancy, this.oneActionPerTurn, this.suffocate, this.breath));
    }

}