export class RecursiveStackClass<T> {
    public stack_ : T[];

    constructor() {
        this.stack_ = [];
    }

    clone(): RecursiveStackClass<T> {
        const newStack = new RecursiveStackClass<T>();
        newStack.stack_ = [...this.stack_];
        return newStack;
    }

    push(value: T): void {
        this.stack_.push(value);
    }

    pop () {
        this.stack_.pop();
    }

    top (): T {
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