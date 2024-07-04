import {StatesBS} from "@class/fsm/binary_search/StatesBS.tsx";
import {TapeClass} from "@class/tape/TapeClass.tsx";

export interface BSFSMStateEntry {
    state: string;
    step: number;
    inputTape: TapeClass;
    workTape: TapeClass;
    resultTape: TapeClass;
}

export class BinarySearchFSM {
    public state_: string;
    public step_: number;
    public inputTape_: TapeClass;
    public workTape_: TapeClass;
    public resultTape_: TapeClass;
    public inputArray_: number[];
    private history_: BSFSMStateEntry[] = [];

    constructor(inputTape: TapeClass) {
        this.state_ = StatesBS.START;
        this.step_ = 0;
        this.inputTape_ = inputTape.clone();
        this.inputArray_ = this.inputTape_.content.slice(3, this.inputTape_.content.length);
        this.workTape_ = new TapeClass([0, 0, 0]);
        this.resultTape_ = new TapeClass([0]);
    }

    setStateAndSave(newState: string, value : number = -1) {
        this.state_ = newState;
        switch (newState) {
            case StatesBS.START:
                break;
            case StatesBS.READ_TARGET:
                this.inputTape_.heads = new Set([2]);
                break;
            case StatesBS.READ_INIT_LOW:
                this.inputTape_.heads = new Set([0]);
                break;
            case StatesBS.READ_INIT_HIGH:
                this.inputTape_.heads = new Set([1]);
                break;
            case StatesBS.READ_LOW:
                this.workTape_.heads = new Set([0]);
                break;
            case StatesBS.READ_HIGH:
                this.workTape_.heads = new Set([2]);
                break;
            case StatesBS.WRITE_LOW:
                this.workTape_.heads = new Set([0]);
                this.workTape_.content[0] = value;
                break;
            case StatesBS.WRITE_HIGH:
                this.workTape_.heads = new Set([2]);
                this.workTape_.content[2] = value;
                break;
            case StatesBS.CALC_MID:
                this.workTape_.heads = new Set([1]);
                this.workTape_.content[1] = value;
                break;
            case StatesBS.COMPARE:
                this.inputTape_.heads = new Set([value + 3]);
                break;
            case StatesBS.SUCCESS:
                break;
            case StatesBS.FAIL:
                break;
            case StatesBS.FINISH:
                this.resultTape_.heads = new Set([0]);
                this.resultTape_.content[0] = value;
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
            inputTape: this.inputTape_.clone(),
            workTape: this.workTape_.clone(),
            resultTape: this.resultTape_.clone()
        });
    }

    getHistory() {
        return this.history_;
    }
}