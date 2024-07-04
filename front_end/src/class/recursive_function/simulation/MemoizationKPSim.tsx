import {MemoizationKPFSM, MemoizationKPFSMStateEntry} from "@class/fsm/knapsack/recursive/MemoizationKPFSM.tsx";
import {RecursiveStackClass} from "@class/recursive_function/recursive_stack/RecursiveStackClass.tsx";
import {TapeClass} from "@class/tape/TapeClass.tsx";
import {StatesMemoizationKP} from "@class/fsm/knapsack/recursive/StatesMemoizationKP.tsx";

export interface MemoizationKPSimStateEntry {
    stack: RecursiveStackClass<MemoizationKPStackObject>;
    MemoizationKPFSMStateEntry: MemoizationKPFSMStateEntry;
}

export interface MemoizationKPStackObject {
    index: number;
    remainingCapacity: number;
}

export class MemoizationKPSim {
    private fsm_: MemoizationKPFSM;
    private capacity_: number;
    private items_: { weight: number; value: number }[];
    private memo_: number[];

    private stack_: RecursiveStackClass<MemoizationKPStackObject>;
    private stack_history_: RecursiveStackClass<MemoizationKPStackObject>[] = [];
    private history_: MemoizationKPSimStateEntry[] = [];

    constructor(capacityTape: TapeClass, itemsTape: TapeClass) {
        this.fsm_ = new MemoizationKPFSM(capacityTape, itemsTape);
        this.capacity_ = capacityTape.content[0];
        this.items_ = [];
        for (let i = 0; i < itemsTape.content.length / 2; i++) {
            this.items_.push({
                weight: itemsTape.content[i * 2],
                value: itemsTape.content[i * 2 + 1]
            });
        }
        this.memo_ = Array(this.capacity_ + 1).fill(-1);
        this.stack_ = new RecursiveStackClass();
    }
    setStateAndSaveAll(newState: string, value: number = -1, anotherValue: number = -1) {
        this.fsm_.setStateAndSave(newState, value, anotherValue);
        this.stack_history_.push(this.stack_.clone());
    }

    recursiveHelper(index: number, remainingCapacity: number): number {
        this.stack_.push({index: index, remainingCapacity: remainingCapacity});
        // 基本情况：所有物品都考虑过
        if (index === this.items_.length) {
            this.setStateAndSaveAll(StatesMemoizationKP.NO_MORE_ITEMS);
            this.stack_.pop();
            return 0;
        }
        // 基本情况：背包容量不足以放下当前物品
        if (remainingCapacity === 0) {
            this.setStateAndSaveAll(StatesMemoizationKP.KNAPSACK_FULL);
            this.stack_.pop();
            return 0;
        }

        // 如果已经计算过这个状态，直接返回其值
        if (this.memo_[remainingCapacity] !== -1) {
            this.setStateAndSaveAll(StatesMemoizationKP.CALCULATED);
            this.stack_.pop();
            return this.memo_[remainingCapacity];
        }

        // 选项1：不选择当前物品
        this.setStateAndSaveAll(StatesMemoizationKP.TRY_EXCLUDE);
        let result = this.recursiveHelper(index + 1, remainingCapacity);

        // 选项2：选择当前物品（如果它适合背包）
        this.setStateAndSaveAll(StatesMemoizationKP.READ_ITEM_WEIGHT, index);
        if (this.items_[index].weight <= remainingCapacity) {
            this.setStateAndSaveAll(StatesMemoizationKP.TRY_INCLUDE);
            this.setStateAndSaveAll(StatesMemoizationKP.READ_ITEM_VALUE, index);
            result = Math.max(
                result,
                this.items_[index].value + this.recursiveHelper(index + 1, remainingCapacity - this.items_[index].weight)
            );
        }

        // 存储计算结果到备忘录中
        this.setStateAndSaveAll(StatesMemoizationKP.UPDATE_MEMO, remainingCapacity, result);
        this.memo_[remainingCapacity] = result;

        this.stack_.pop();
        return result;
    }

    run() {
        // Start
        this.setStateAndSaveAll(StatesMemoizationKP.START);
        // Read Capacity
        this.setStateAndSaveAll(StatesMemoizationKP.READ_CAPACITY);
        // Recursive
        const res = this.recursiveHelper(0, this.capacity_);
        // Write Result
        this.setStateAndSaveAll(StatesMemoizationKP.WRITE_RESULT, res);
        // Finish
        this.setStateAndSaveAll(StatesMemoizationKP.FINISH);
    }

    getHistory(): MemoizationKPSimStateEntry[] {
        const history = this.fsm_.getHistory();
        for (let i = 0; i < history.length; i++) {
            this.history_.push({stack: this.stack_history_[i], MemoizationKPFSMStateEntry: history[i]});
        }
        return this.history_;
    }
}