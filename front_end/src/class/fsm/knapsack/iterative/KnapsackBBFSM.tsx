// KnapsackBBFSM.tsx
import {StatesKPBB} from "@class/fsm/knapsack/iterative/StatesKPBB.tsx";
import {TapeClass} from "@class/tape/TapeClass.tsx";
import {TreeNode} from "./DataStructureKPBB.tsx";

export interface KPBBFSMStateEntry {
    state: string;
    step: number;
    capacityTape: TapeClass;
    itemsTape: TapeClass;
    queueTape: TapeClass;
    resultTape: TapeClass;
}

export class KnapsackBBFSM {
    public state_: string;
    public step_: number;
    public capacityTape_: TapeClass;
    public itemsTape_: TapeClass;
    public queueTape_: TapeClass;
    public resultTape_: TapeClass;
    private history_: KPBBFSMStateEntry[] = [];

    constructor(capacityTape: TapeClass, itemsTape: TapeClass) {
        this.state_ = StatesKPBB.START;
        this.step_ = 0;
        this.capacityTape_ = capacityTape.clone();
        this.itemsTape_ = itemsTape.clone();
        this.queueTape_ = new TapeClass();
        this.resultTape_ = new TapeClass([0]);
    }

    setStateAndSave(newState: string, content: number = -1) {
        this.state_ = newState;

        switch (newState) {
            case StatesKPBB.START:
                break;
            case StatesKPBB.READ_CAPACITY:
                this.capacityTape_.heads = new Set([0]);
                break;
            case StatesKPBB.READ_ITEM_WEIGHT:
                this.itemsTape_.heads = new Set([content * 2]);
                break;
            case StatesKPBB.READ_ITEM_VALUE:
                this.itemsTape_.heads = new Set([content * 2 + 1]);
                break;
            case StatesKPBB.WRITE_RESULT:
                this.resultTape_.heads = new Set([0]);
                this.resultTape_.content[0] = content;
                break;

            case StatesKPBB.QUEUE_PUSH:
                this.queueTape_.content.push(content);
                break;
            case StatesKPBB.QUEUE_POP:
                this.queueTape_.content.shift();
                break;
            case StatesKPBB.TRY_INCLUDE:
                break;
            case StatesKPBB.TRY_EXCLUDE:
                break;
            case StatesKPBB.CALC_BOUND:
                break;
            case StatesKPBB.FINISH:
                this.resultTape_.heads = new Set([0]);
                this.resultTape_.content[0] = content;
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
            queueTape: this.queueTape_.clone(),
            resultTape: this.resultTape_.clone(),
        });
    }

    getHistory() {
        return this.history_;
    }
}
