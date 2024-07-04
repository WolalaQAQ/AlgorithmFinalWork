export interface RecursiveStackObject {
    low: number;
    high: number;
}

export class RecursiveStackClass {
    public stack_ : RecursiveStackObject[];

    constructor() {
        this.stack_ = [];
    }

    clone(): RecursiveStackClass {
        const newStack = new RecursiveStackClass();
        newStack.stack_ = [...this.stack_];
        return newStack;
    }

    push(value: RecursiveStackObject): void {
        this.stack_.push(value);
    }

    pop () {
        this.stack_.pop();
    }

    top (): RecursiveStackObject {
        return this.stack_[this.stack_.length - 1];
    }

    size (): number {
        return this.stack_.length;
    }

    empty (): boolean {
        return this.stack_.length === 0;
    }

    clear (): void {
        this.stack_ = [];
    }

}