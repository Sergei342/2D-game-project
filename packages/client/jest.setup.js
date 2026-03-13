Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

if (typeof globalThis.MessageChannel === 'undefined') {
  globalThis.MessageChannel = class MessageChannel {
    constructor() {
      const listeners = { port1: null, port2: null };

      this.port1 = {
        onmessage: null,
        postMessage(data) {
          if (listeners.port2) {
            Promise.resolve().then(() =>
              listeners.port2({ data })
            );
          }
        },
        close() {},
      };

      this.port2 = {
        onmessage: null,
        postMessage(data) {
          if (listeners.port1) {
            Promise.resolve().then(() =>
              listeners.port1({ data })
            );
          }
        },
        close() {},
      };

      Object.defineProperty(this.port1, 'onmessage', {
        set(fn) { listeners.port1 = fn; },
        get()   { return listeners.port1; },
      });
      Object.defineProperty(this.port2, 'onmessage', {
        set(fn) { listeners.port2 = fn; },
        get()   { return listeners.port2; },
      });
    }
  };
}