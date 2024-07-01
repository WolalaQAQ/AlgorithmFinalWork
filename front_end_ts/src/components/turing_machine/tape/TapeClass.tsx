export class TapeClass {
    private content_: number[];
    private heads_: Set<number>;

    constructor(content: number[] = [], heads: Set<number> = new Set([0])) {
        this.content_ = content;
        this.heads_ = heads;
    }

    clone() {
        return new TapeClass([...this.content_], new Set([...this.heads_]));
    }

    set content(value : number[]) {
        this.content_ = value;
    }

    set heads(value: Set<number>) {
        this.heads_ = value;
    }

    get content() : number[] {
        return this.content_;
    }

    get heads() : Set<number> {
        return this.heads_;
    }

}
