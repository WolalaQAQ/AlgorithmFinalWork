import {TapeClass} from "@class/tape/TapeClass.tsx";
import {StatesBacktrackKP} from "@class/fsm/knapsack/recursive/StatesBacktrackKP.tsx";

export interface BacktrackKPFSMStateEntry {
    state: string;
    step: number;
    capacityTape: TapeClass;
    itemsTape: TapeClass;
    resultTape: TapeClass;
}

export class BacktrackKPFSM {
    public state_: string;
    public step_: number;
    public capacityTape_: TapeClass;
    public itemsTape_: TapeClass;
    public memoTape_: TapeClass;
    public resultTape_: TapeClass;
    private history_: BacktrackKPFSMStateEntry[] = [];

    constructor(capacityTape: TapeClass, itemsTape: TapeClass) {
        this.state_ = StatesBacktrackKP.START;
        this.step_ = 0;
        this.capacityTape_ = capacityTape.clone();
        this.itemsTape_ = itemsTape.clone();
        this.memoTape_ = new TapeClass(Array(capacityTape.content[0] + 1).fill(-1)); // Initialize DP table
        this.resultTape_ = new TapeClass([0]);
    }

    setStateAndSave(newState: string, content: number = -1, anotherContent: number = -1) {
        this.state_ = newState;
        switch (newState) {
            case StatesBacktrackKP.START:
                break;
            case StatesBacktrackKP.READ_CAPACITY:
                this.capacityTape_.heads = new Set([0]);
                break;
            case StatesBacktrackKP.READ_ITEM_WEIGHT:
                this.itemsTape_.heads = new Set([content * 2]);
                break;
            case StatesBacktrackKP.READ_ITEM_VALUE:
                this.itemsTape_.heads = new Set([content * 2 + 1]);
                break;
            case StatesBacktrackKP.TRY_INCLUDE:
                break;
            case StatesBacktrackKP.TRY_EXCLUDE:
                break;
            case StatesBacktrackKP.NO_MORE_ITEMS:
                break;
            case StatesBacktrackKP.KNAPSACK_FULL:
                break;
            case StatesBacktrackKP.WRITE_RESULT:
                this.resultTape_.heads = new Set([0]);
                this.resultTape_.content[0] = content;
                break;
            case StatesBacktrackKP.OVER_WEIGHT:
                break;
            case StatesBacktrackKP.CALC_MAX:
            case StatesBacktrackKP.FINISH:
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
            resultTape: this.resultTape_.clone()
        });
    }

    getHistory() {
        return this.history_;
    }
}