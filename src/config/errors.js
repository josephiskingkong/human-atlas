export class TooLargeError extends Error {
    constructor(message) {
        super(message);
        this.name = 'TooLargeError';
    }
}

