class EventQueue {
    constructor(nbMaxEvents) {
        this.nbMaxEvents = nbMaxEvents;
        this.events = [];
    }

    pushEvent(event) {
        if (this.events.length < this.nbMaxEvents)
            this.events.push(event);
    }

    shiftEvent() {
        return this.events.shift();
    }
}