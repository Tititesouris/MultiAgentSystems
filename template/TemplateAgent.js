class TemplateAgent extends Agent {
    constructor(environment, position, property) {
        super(environment, "Agent", position, "#ff0000", 0);
        this.property = property;
    }

    decide() {
        super.decide();
        let [x, y] = this.position;
        if ((x + y) % this.property === 0) {
            this.color = "#00ff00"
        }
    }

    getProperty() {
        return this.property;
    }

}