import {TapeClass} from "@class/tape/TapeClass.tsx";
import {StatesMemoizationKP} from "@class/fsm/knapsack/recursive/StatesMemoizationKP.tsx";

export interface MemoizationKPFSMStateEntry {
    state: string;
    step: number;
    capacityTape: TapeClass;
    itemsTape: TapeClass;
    memoTape: TapeClass;
    resultTape: TapeClass;
}

export class MemoizationKPFSM {
    public state_: string;
    public step_: number;
    public capacityTape_: TapeClass;
    public itemsTape_: TapeClass;
    public memoTape_: TapeClass;
    public resultTape_: TapeClass;
    private history_: MemoizationKPFSMStateEntry[] = [];

    constructor(capacityTape: TapeClass, itemsTape: TapeClass) {
        this.state_ = StatesMemoizationKP.START;
        this.step_ = 0;
        this.capacityTape_ = capacityTape.clone();
        this.itemsTape_ = itemsTape.clone();
        this.memoTape_ = new TapeClass(Array(capacityTape.content[0] + 1).fill(-1)); // Initialize DP table
        this.resultTape_ = new TapeClass([0]);
    }

    setStateAndSave(newState: string, content: number = -1, anotherContent: number = -1) {
        this.state_ = newState;
        switch (newState) {
            case StatesMemoizationKP.START:
                break;
            case StatesMemoizationKP.READ_CAPACITY:
                this.capacityTape_.heads = new Set([0]);
                break;
            case StatesMemoizationKP.READ_ITEM_WEIGHT:
                this.itemsTape_.heads = new Set([content * 2]);
                break;
            case StatesMemoizationKP.READ_ITEM_VALUE:
                this.itemsTape_.heads = new Set([content * 2 + 1]);
                break;
            case StatesMemoizationKP.TRY_INCLUDE:
                break;
            case StatesMemoizationKP.TRY_EXCLUDE:
                break;
            case StatesMemoizationKP.NO_MORE_ITEMS:
                break;
            case StatesMemoizationKP.KNAPSACK_FULL:
                break;
            case StatesMemoizationKP.CALCULATED:
                break;
            case StatesMemoizationKP.UPDATE_MEMO:
                this.memoTape_.heads = new Set([content]);
                this.memoTape_.content[content] = anotherContent;
                break;
            case StatesMemoizationKP.WRITE_RESULT:
                this.resultTape_.heads = new Set([0]);
                this.resultTape_.content[0] = content;
                break;
            case StatesMemoizationKP.FINISH:
                break;
            default:
                console.error('Unknown state:', newState);
        }
        this.saveState();
        this.step_++;
    }

    private saveState() {
        this.history_.push({
            step: this.step_,
            state: this.state_,
            capacityTape: this.capacityTape_.clone(),
            itemsTape: this.itemsTape_.clone(),
            memoTape: this.memoTape_.clone(),
            resultTape: this.resultTape_.clone()
        });
    }

    getHistory() {
        return this.history_;
    }
}