import {TapeClass} from "../tape/TapeClass";
import {States} from "./States.tsx";

export interface FSMHistoryEntry {
    step: number;
    state: string;
    inputTape: TapeClass;
    workTape: TapeClass;
    resultTape: TapeClass;
}

export interface FSMHistory {
    [key: number]: FSMHistoryEntry;
}

export class BinarySearchFSMClass {
    private state_: string;
    private step_: number;
    private inputTape_: TapeClass;
    private inputArray_: number[];
    private targetValue_: number;
    private workTape_: TapeClass;
    private resultTape_: TapeClass;

    constructor() {
        this.state_ = States.START;
        this.step_ = 0;
        this.inputTape_ = new TapeClass();
        this.inputArray_ = [];
        this.targetValue_ = -1;
        this.workTape_ = new TapeClass();
        this.resultTape_ = new TapeClass();
    }

    configureTape(inputTape: TapeClass): void {
        this.inputTape_ = inputTape.clone();
        this.reset();
    }

    reset(): void {
        this.inputArray_ = this.inputTape_.content.slice(3);
        this.targetValue_ = this.inputTape_.content[2];
        this.workTape_ = new TapeClass([0, 0, 0]);
        this.resultTape_ = new TapeClass([0]);
        this.state_ = States.START;
        this.step_ = 0;
    }

    calcStep(): boolean {
        // 结束条件
        if (this.state_ === States.SUCCESS || this.state_ === States.FAIL) {
            return false;
        }

        // 初始化
        if (this.step_ <= 4) {
            switch (this.step_) {
                case 0:
                    this.state_ = States.READ_LOW;
                    this.inputTape_.heads = new Set([0]);
                    this.step_++;
                    break;
                case 1:
                    this.state_ = States.WRITE_LOW;
                    this.workTape_.heads = new Set([0]);
                    this.workTape_.content[0] = this.inputTape_.content[0];
                    this.step_++;
                    break;
                case 2:
                    this.state_ = States.READ_HIGH;
                    this.inputTape_.heads = new Set([1]);
                    this.step_++;
                    break;
                case 3:
                    this.state_ = States.WRITE_HIGH;
                    this.workTape_.heads = new Set([2]);
                    this.workTape_.content[2] = this.inputTape_.content[1];
                    this.step_++;
                    break;
                case 4:
                    this.state_ = States.READ_TARGET;
                    this.inputTape_.heads = new Set([2]);
                    this.step_++;
                    break;
                default:
                    break;
            }
            return true;
        }

        // 循环部分
        if (this.step_ === 5) {
            this.state_ = States.CALC_MID;
            this.workTape_.heads = new Set([1]);
            this.workTape_.content[1] = Math.floor((this.workTape_.content[0] + this.workTape_.content[2]) / 2);
            this.step_++;
            return true;
        } else if (this.state_ === States.CALC_MID) {
            this.state_ = States.COMPARE;
            this.workTape_.heads = new Set([1]);
            this.workTape_.content[1] = Math.floor((this.workTape_.content[0] + this.workTape_.content[2]) / 2);
            this.inputTape_.heads = new Set([this.workTape_.content[1] + 3]);
            this.step_++;
            return true;
        } else if (this.state_ === States.COMPARE) {
            const mid_value = this.inputArray_[this.workTape_.content[1]];
            if (mid_value === this.targetValue_) {
                this.state_ = States.SUCCESS;
            } else if (mid_value < this.targetValue_) {
                this.state_ = States.WRITE_LOW;
            } else if (mid_value > this.targetValue_){
                this.state_ = States.WRITE_HIGH;
            } else {
                this.state_ = States.FAIL;
            }
            this.step_++;
            return true;
        } else if (this.state_ === States.WRITE_LOW) {
            this.state_ = States.CALC_MID;
            this.workTape_.content[0] = this.workTape_.content[1] + 1;
            this.step_++;
            return true;
        } else if (this.state_ === States.WRITE_HIGH) {
            this.state_ = States.CALC_MID;
            this.workTape_.content[2] = this.workTape_.content[1] - 1;
            this.step_++;
            return true;
        } else if (this.state_ === States.FAIL) {
            this.resultTape_.content[0] = -1;
            this.step_++;
            return false;
        } else if (this.state_ === States.SUCCESS) {
            this.resultTape_.content[0] = this.workTape_.content[1];
            this.step_++;
            return false;
        }
        else {
            console.error('Unknown state:', this.state_);
            return false;
        }

    }

    calcHistory(): { [key: number]: FSMHistoryEntry } {
        const history: { [key: number]: FSMHistoryEntry } = {};

        history[this.step_] = {
            step: this.step_,
            state: this.state_,
            inputTape: this.inputTape_.clone(),
            workTape: this.workTape_.clone(),
            resultTape: this.resultTape_.clone()
        };

        while (this.calcStep()) {
            history[this.step_] = {
                step: this.step_,
                state: this.state_,
                inputTape: this.inputTape_.clone(),
                workTape: this.workTape_.clone(),
                resultTape: this.resultTape_.clone()
            };
        }

        return history;
    }
}
