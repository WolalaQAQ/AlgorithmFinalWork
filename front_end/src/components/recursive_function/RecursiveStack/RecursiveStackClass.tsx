export class RecursiveStackClass {
    private stack_ : string[];

    constructor() {
        this.stack_ = [];
    }

    push(value: string): void {
        this.stack_.push(value);
    }

    pop () {
        this.stack_.pop();
    }

    top (): string {
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