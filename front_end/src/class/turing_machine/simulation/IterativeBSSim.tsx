import {TapeClass} from '@class/tape/TapeClass';
import {StatesBN} from "@class/fsm/binary_search/StatesBN.tsx";
import {BinarySearchFSM, BSFSMStateEntry} from "@class/fsm/binary_search/BinarySearchFSM.tsx";

export interface IterativeBSFSMStateEntry {
    BSFSMHistoryEntry: BSFSMStateEntry;
}

export class IterativeBSSim {
    private fsm_: BinarySearchFSM;
    private targetValue_: number;
    private midValue_: number;
    private midIndex_: number;

    private fsmHistory_: IterativeBSFSMStateEntry[] = [];

    constructor(inputTape: TapeClass) {
        this.fsm_ = new BinarySearchFSM(inputTape);
        this.targetValue_ = -1;
        this.midValue_ = -1;
        this.midIndex_ = -1;
    }

    run() {
        // Start
        this.fsm_.setStateAndSave(StatesBN.START);
        // Read Initial Low
        this.fsm_.setStateAndSave(StatesBN.READ_INIT_LOW);
        // Write Low
        this.fsm_.setStateAndSave(StatesBN.WRITE_LOW, this.fsm_.inputTape_.content[0]);
        // Read Initial High
        this.fsm_.setStateAndSave(StatesBN.READ_INIT_HIGH);
        // Write High
        this.fsm_.setStateAndSave(StatesBN.WRITE_HIGH, this.fsm_.inputTape_.content[1]);
        // Iterative Binary Search
        const res = this.iterativeBS();
        // Finish
        this.fsm_.setStateAndSave(StatesBN.FINISH, res);
    }

    iterativeBS() {
        this.fsm_.setStateAndSave(StatesBN.READ_LOW);
        let low = this.fsm_.workTape_.content[0];
        this.fsm_.setStateAndSave(StatesBN.READ_HIGH);
        let high = this.fsm_.workTape_.content[2];

        while (low <= high) {
            this.midIndex_ = Math.floor((low + high) / 2);
            this.fsm_.setStateAndSave(StatesBN.CALC_MID, this.midIndex_);
            this.midValue_ = this.fsm_.inputArray_[this.midIndex_];
            this.fsm_.setStateAndSave(StatesBN.READ_TARGET);
            this.targetValue_ = this.fsm_.inputTape_.content[2];
            this.fsm_.setStateAndSave(StatesBN.COMPARE, this.midIndex_);
            if (this.midValue_ === this.targetValue_) {
                this.fsm_.setStateAndSave(StatesBN.SUCCESS);
                return this.midIndex_;
            } else if (this.midValue_ < this.targetValue_) {
                low = this.midIndex_ + 1;
                this.fsm_.setStateAndSave(StatesBN.WRITE_LOW, low);
            } else {
                high = this.midIndex_ - 1;
                this.fsm_.setStateAndSave(StatesBN.WRITE_HIGH, high);
            }
        }

        this.fsm_.setStateAndSave(StatesBN.FAIL);
        return -1;
    }

    getHistory(): IterativeBSFSMStateEntry[] {
        const history = this.fsm_.getHistory();
        for (let i = 0; i < history.length; i++) {
            this.fsmHistory_.push({BSFSMHistoryEntry: history[i]});
        }
        return this.fsmHistory_;
    }

}
