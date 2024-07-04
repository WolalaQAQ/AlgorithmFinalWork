import { StatesKPDP } from "@class/fsm/knapsack/StatesKPDP.tsx";
import { TapeClass } from "@class/tape/TapeClass.tsx";

export interface KPDPFSMStateEntry {
    state: string;
    step: number;
    capacityTape: TapeClass;
    itemsTape: TapeClass;
    dpTape: TapeClass;
    resultTape: TapeClass;
}

export class KnapsackDPFSM {
    public state_: string;
    public step_: number;
    public capacityTape_: TapeClass;
    public itemsTape_: TapeClass;
    public dpTape_: TapeClass;
    public resultTape_: TapeClass;
    private history_: KPDPFSMStateEntry[] = [];

    constructor(capacityTape: TapeClass, itemsTape: TapeClass) {
        this.state_ = StatesKPDP.START;
        this.step_ = 0;
        this.capacityTape_ = capacityTape.clone();
        this.itemsTape_ = itemsTape.clone();
        this.dpTape_ = new TapeClass(Array(capacityTape.content[0] + 1).fill(0)); // Initialize DP table
        this.resultTape_ = new TapeClass([0]);
    }

    setStateAndSave(newState: string, itemIndex: number = -1) {
        this.state_ = newState;
        switch (newState) {
            case StatesKPDP.START:
                break;
            case StatesKPDP.READ_CAPACITY:
                this.capacityTape_.heads = new Set([0]);
                break;
            case StatesKPDP.READ_ITEM_WEIGHT:
                this.itemsTape_.heads = new Set([itemIndex * 2]);
                break;
            case StatesKPDP.READ_ITEM_VALUE:
                this.itemsTape_.heads = new Set([itemIndex * 2 + 1]);
                break;
            case StatesKPDP.UPDATE_DP:
                for (let w = this.capacityTape_.content[0]; w >= this.itemsTape_.content[itemIndex * 2]; w--) {
                    this.dpTape_.heads = new Set([w]);
                    this.dpTape_.content[w] = Math.max(this.dpTape_.content[w], this.dpTape_.content[w - this.itemsTape_.content[itemIndex * 2]] + this.itemsTape_.content[itemIndex * 2 + 1]);
                    this.saveState();
                    this.step_++;
                }
                break;
            case StatesKPDP.FINISH:
                this.resultTape_.heads = new Set([0]);
                this.resultTape_.content[0] = this.dpTape_.content[this.capacityTape_.content[0]];
                break;
            default:
                console.error('Unknown state:', newState);
                break;
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
            dpTape: this.dpTape_.clone(),
            resultTape: this.resultTape_.clone()
        });
    }

    getHistory() {
        return this.history_;
    }
}
