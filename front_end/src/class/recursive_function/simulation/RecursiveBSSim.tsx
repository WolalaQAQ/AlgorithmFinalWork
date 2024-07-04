import {RecursiveStackClass} from "@class/recursive_function/recursive_stack/RecursiveStackClass.tsx";
import {TapeClass} from "@class/tape/TapeClass.tsx";
import {StatesBS} from "@class/fsm/binary_search/StatesBS.tsx";
import {BinarySearchFSM, BSFSMStateEntry} from "@class/fsm/binary_search/BinarySearchFSM.tsx";

export interface RecursiveBSSimStateEntry {
    BSFSMStateEntry: BSFSMStateEntry;
    stack: RecursiveStackClass<RecursiveBSStackObject>;
}

export interface RecursiveBSStackObject {
    low: number;
    high: number;
}

export class RecursiveBSSim {
    private fsm_: BinarySearchFSM;
    private history_: RecursiveBSSimStateEntry[] = [];
    private stack_: RecursiveStackClass<RecursiveBSStackObject>;
    private stack_history_: RecursiveStackClass<RecursiveBSStackObject>[] = [];
    private midIndex_: number;

    constructor(inputTape: TapeClass) {
        this.fsm_ = new BinarySearchFSM(inputTape);
        this.stack_ = new RecursiveStackClass();
        this.midIndex_ = -1;
    }

    setStateAndSaveAll(newState: string, value: number = -1) {
        this.fsm_.setStateAndSave(newState, value);
        this.stack_history_.push(this.stack_.clone());
    }

    run() {
        // Start
        this.setStateAndSaveAll(StatesBS.START);
        // Read Initial Low
        this.setStateAndSaveAll(StatesBS.READ_INIT_LOW);
        // Write Low
        this.setStateAndSaveAll(StatesBS.WRITE_LOW, this.fsm_.inputTape_.content[0]);
        // Read Initial High
        this.setStateAndSaveAll(StatesBS.READ_INIT_HIGH);
        // Write High
        this.setStateAndSaveAll(StatesBS.WRITE_HIGH, this.fsm_.inputTape_.content[1]);
        // Start the recursive binary search
        const result = this.recursiveBinarySearch(this.fsm_.inputArray_, this.fsm_.inputTape_.content[2], this.fsm_.inputTape_.content[0], this.fsm_.inputTape_.content[1]);
        // Finish
        this.setStateAndSaveAll(StatesBS.FINISH, result);
    }

    recursiveBinarySearch(inputArray: number[], target: number, left: number, right: number): number {
        this.setStateAndSaveAll(StatesBS.READ_LOW);
        this.setStateAndSaveAll(StatesBS.READ_HIGH);
        this.stack_.push({low: left, high: right});

        if (right >= left) {
            this.midIndex_ = Math.floor(left + (right - left) / 2);
            this.setStateAndSaveAll(StatesBS.CALC_MID, this.midIndex_);
            this.setStateAndSaveAll(StatesBS.READ_TARGET);
            this.setStateAndSaveAll(StatesBS.COMPARE, this.midIndex_);
            if (inputArray[this.midIndex_] === target) {
                this.stack_.pop();
                this.setStateAndSaveAll(StatesBS.SUCCESS);
                return this.midIndex_;
            }

            if (inputArray[this.midIndex_] > target) {
                this.setStateAndSaveAll(StatesBS.WRITE_HIGH, this.midIndex_ - 1);
                const result = this.recursiveBinarySearch(inputArray, target, left, this.midIndex_ - 1);
                this.stack_.pop();
                return result;
            }

            this.setStateAndSaveAll(StatesBS.WRITE_LOW, this.midIndex_ + 1);
            const result = this.recursiveBinarySearch(inputArray, target, this.midIndex_ + 1, right);
            this.stack_.pop();
            return result;
        }

        this.stack_.pop();
        this.setStateAndSaveAll(StatesBS.FAIL);
        return -1;
    }

    // Method to get the stack history
    getHistory() {
        const fsmHistory = this.fsm_.getHistory();
        for (let i = 0; i < fsmHistory.length; i++) {
            this.history_.push({BSFSMStateEntry: fsmHistory[i], stack: this.stack_history_[i]});
        }
        return this.history_;
    }
}