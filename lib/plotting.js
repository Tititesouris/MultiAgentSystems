class Plot {
    constructor(view, x, y, width, height) {
        this.view = view;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}

class PopulationGrowthPlot extends Plot {
    constructor(view, x, y, width, height, colors, download) {
        super(view, x, y, width, height);
        this.colors = colors;
        this.download = download;
        this.populationTypes = [];
        this.maxAmount = 0;
        this.history = new Array(this.width).fill({total: 0, amounts: []});
        this.uploadCounter = 0;
    }

    update(population, populationTypes) {
        this.populationTypes = populationTypes;
        let slice = {total: population.length, amounts: []};
        for (let i = 0; i < this.populationTypes.length; i++) {
            let amount = population.filter(individual => individual instanceof this.populationTypes[i]).length;
            slice.amounts.push(amount);
            if (amount > this.maxAmount)
                this.maxAmount = amount;
        }
        this.history.shift();
        this.history.push(slice);
    }

    draw() {
        this.view.fillStyle = this.colors.background;
        this.view.fillRect(this.x, this.y, this.width, this.height);
        this.view.font = "10px Arial";
        for (let y = 0; y < this.maxAmount; y += 500) {
            this.view.fillStyle = this.colors.text;
            this.view.fillText("" + y, this.x, this.y + this.height * (1 - y / parseFloat(this.maxAmount)));
            this.view.fillStyle = this.colors.helperLines;
            this.view.fillRect(this.x, this.y + this.height * (1 - y / parseFloat(this.maxAmount)), this.width, 1);
        }
        for (let x = 0; x < this.width - 1; x++) {
            for (let i = 0; i < this.populationTypes.length; i++) {
                this.view.strokeStyle = this.colors.lines[i];
                this.view.beginPath();
                this.view.moveTo(this.x + x, this.y + this.height * (1 - this.history[x].amounts[i] / parseFloat(this.maxAmount)));
                this.view.lineTo(this.x + x + 1, this.y + this.height * (1 - this.history[x + 1].amounts[i] / parseFloat(this.maxAmount)));
                this.view.stroke();
            }
        }
        if (this.download && ++this.uploadCounter > this.width) {
            ReImg.fromCanvas(this.view.canvas).downloadPng();
            this.uploadCounter = 0;
        }
    }

}

class PopulationPyramidPlot extends Plot {
    constructor(view, x, y, width, height, colors) {
        super(view, x, y, width, height);
        this.colors = colors;
        this.ages = {};
        this.oldests = [0, 0];
        this.widest = 0;
    }

    update(population, populationTypes) {
        this.ages = {};
        this.oldests = [0, 0];
        this.widest = 0;
        for (let i = 0; i < population.length; i++) {
            let individual = population[i];
            let agentType = (individual instanceof populationTypes[0]) ? 0 : 1;
            if (!(individual.age in this.ages))
                this.ages[individual.age] = [0, 0];
            this.ages[individual.age][agentType]++;
            if (individual.age > this.oldests[agentType])
                this.oldests[agentType] = individual.age;
            let width = Math.max(this.ages[individual.age][0], this.ages[individual.age][1]);
            if (width > this.widest)
                this.widest = width;
        }
    }

    draw() {
        this.view.font = "10px Arial";
        this.view.fillStyle = this.colors.background;
        this.view.fillRect(this.x, this.y, this.width, this.height);
        let oldest = Math.max(this.oldests[0], this.oldests[1]);
        let barHeight = Math.floor(parseFloat(this.height) / oldest);
        for (let age = 0; age < oldest; age++) {
            if (!(age in this.ages))
                this.ages[age] = [0, 0];
            let barWidth = parseFloat(this.width / 2) / this.widest;
            let barOffset = this.ages[age][0] * barWidth;
            this.view.fillStyle = this.colors.left;
            this.view.fillRect(this.x + this.width / 2 - barOffset, this.y + age * barHeight, barOffset, barHeight - 1);
            this.view.fillStyle = this.colors.right;
            this.view.fillRect(this.x + this.width / 2, age * barHeight, this.y + this.ages[age][1] * barWidth, barHeight - 1);
            this.view.fillStyle = this.colors.text;
            if (age % 5 === 0)
                this.view.fillText("" + age, this.x + this.width / 2, this.y + age * barHeight);
        }
        this.view.font = "20px Arial";
        this.view.fillText("" + this.oldests[0], this.x + this.width / 4, this.y + 20);
        this.view.fillText("" + this.oldests[1], this.x + 3 * this.width / 4, this.y + 20);
    }
}
