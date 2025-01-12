// Simple example..
export default class EventEmitter {
  constructor() {
    this.events = new Map();
    this.eventQueue = [];
  }

  on(event, callback) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(callback);
  }

  emit(event, data) {
    this.eventQueue.push({ event, data });
  }

  processEvents() {
    while (this.eventQueue.length > 0) {
      const { event, data } = this.eventQueue.shift();
      if (this.events.has(event)) {
        for (const callback of this.events.get(event)) {
          callback(data);
        }
      }
    }
  }

  clearEvents() {
    this.eventQueue = [];
  }
}

