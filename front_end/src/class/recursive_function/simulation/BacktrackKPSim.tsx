import {BacktrackKPFSM, BacktrackKPFSMStateEntry} from "@class/fsm/knapsack/recursive/BacktrackKPFSM.tsx";
import {RecursiveStackClass} from "@class/recursive_function/recursive_stack/RecursiveStackClass.tsx";
import {TapeClass} from "@class/tape/TapeClass.tsx";
import {StatesBacktrackKP} from "@class/fsm/knapsack/recursive/StatesBacktrackKP.tsx";

export interface BacktrackKPSimStateEntry {
    stack: RecursiveStackClass<BacktrackKPStackObject>;
    BacktrackKPFSMStateEntry: BacktrackKPFSMStateEntry;
}

export interface BacktrackKPStackObject {
    index: number;
    remainingCapacity: number;
}

export class BacktrackKPSim {
    private fsm_: BacktrackKPFSM;
    private capacity_: number;
    private items_: { weight: number; value: number }[];

    private stack_: RecursiveStackClass<BacktrackKPStackObject>;
    private stack_history_: RecursiveStackClass<BacktrackKPStackObject>[] = [];
    private history_: BacktrackKPSimStateEntry[] = [];

    constructor(capacityTape: TapeClass, itemsTape: TapeClass) {
        this.fsm_ = new BacktrackKPFSM(capacityTape, itemsTape);
        this.capacity_ = capacityTape.content[0];
        this.items_ = [];
        for (let i = 0; i < itemsTape.content.length / 2; i++) {
            this.items_.push({
                weight: itemsTape.content[i * 2],
                value: itemsTape.content[i * 2 + 1]
            });
        }
        this.stack_ = new RecursiveStackClass();
    }
    setStateAndSaveAll(newState: string, value: number = -1, anotherValue: number = -1) {
        this.fsm_.setStateAndSave(newState, value, anotherValue);
        this.stack_history_.push(this.stack_.clone());
    }

    recursiveHelper(index: number, remainingCapacity: number): number {
        this.stack_.push({index: index, remainingCapacity: remainingCapacity});
        // 基本情况：没有剩余物品
        if (index < 0) {
            this.setStateAndSaveAll(StatesBacktrackKP.NO_MORE_ITEMS);
            this.stack_.pop();
            return 0;
        }
        // 基本情况：背包容量为0
        if (remainingCapacity === 0) {
            this.setStateAndSaveAll(StatesBacktrackKP.KNAPSACK_FULL);
            this.stack_.pop();
            return 0;
        }

        // 如果当前物品的重量超过剩余容量，跳过此物品
        this.setStateAndSaveAll(StatesBacktrackKP.READ_ITEM_WEIGHT, index);
        if (this.items_[index].weight > remainingCapacity) {
            const result = this.recursiveHelper(index - 1, remainingCapacity);
            this.setStateAndSaveAll(StatesBacktrackKP.OVER_WEIGHT);
            this.stack_.pop();
            return result;
        } else {
            // 情况1：不包括当前物品
            this.setStateAndSaveAll(StatesBacktrackKP.TRY_EXCLUDE);
            const exclude = this.recursiveHelper(index - 1, remainingCapacity);
            // 情况2：包括当前物品
            this.setStateAndSaveAll(StatesBacktrackKP.TRY_INCLUDE);
            this.setStateAndSaveAll(StatesBacktrackKP.READ_ITEM_VALUE, index)
            const include = this.items_[index].value + this.recursiveHelper(index - 1, remainingCapacity - this.items_[index].weight);
            // 返回包括或不包括当前物品的最大值
            this.setStateAndSaveAll(StatesBacktrackKP.CALC_MAX);
            this.stack_.pop();
            return Math.max(exclude, include);
        }
    }

    run() {
        // Start
        this.setStateAndSaveAll(StatesBacktrackKP.START);
        // Read Capacity
        this.setStateAndSaveAll(StatesBacktrackKP.READ_CAPACITY);
        // Recursive
        const res = this.recursiveHelper(this.items_.length - 1, this.capacity_);
        // Write Result
        this.setStateAndSaveAll(StatesBacktrackKP.WRITE_RESULT, res);
        // Finish
        this.setStateAndSaveAll(StatesBacktrackKP.FINISH);
    }

    getHistory(): BacktrackKPSimStateEntry[] {
        const history = this.fsm_.getHistory();
        for (let i = 0; i < history.length; i++) {
            this.history_.push({stack: this.stack_history_[i], BacktrackKPFSMStateEntry: history[i]});
        }
        return this.history_;
    }
}