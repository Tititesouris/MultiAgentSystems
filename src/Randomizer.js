class Randomizer {
    constructor(seed) {
        this.seed = seed;
        this.rng = seed;
    }

    rand() {
        if (this.seed === -1)
            return Math.random();
        let x = Math.sin(this.rng++) * 10000;
        return x - Math.floor(x);
    }

    randInt(max) {
        return Math.floor(this.rand() * Math.floor(max));
    }

    randElem(list) {
        return list[this.randInt(list.length)];
    }

    shuffle(list) {
        for (let i = list.length - 1; i > 0; i--) {
            let j = this.randInt(i + 1);
            let temp = list[i];
            list[i] = list[j];
            list[j] = temp;
        }
        return list;
    }

    reset() {
        this.rng = this.seed;
    }
}

let RNG = new Randomizer(-1);