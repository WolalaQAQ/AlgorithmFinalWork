import { TapeClass } from '@class/tape/TapeClass';
import { StatesKP } from "@class/fsm/knapsack/StatesKP.tsx";
import { KnapsackFSM, KPFSMStateEntry } from "@class/fsm/knapsack/KnapsackFSM.tsx";

export interface IterativeKPFSMStateEntry {
    KPFSMHistoryEntry: KPFSMStateEntry;
}

export class KnapsackDPSim {
    private fsm_: KnapsackFSM;
    private capacity_: number;
    private currentItemIndex_: number;
    private items_: Array<{ weight: number, value: number }>;

    private fsmHistory_: IterativeKPFSMStateEntry[] = [];

    constructor(capacityTape: TapeClass, itemsTape: TapeClass) {
        this.fsm_ = new KnapsackFSM(capacityTape, itemsTape);
        this.capacity_ = capacityTape.content[0];
        this.items_ = [];
        for (let i = 0; i < itemsTape.content.length / 2; i++) {
            this.items_.push({
                weight: itemsTape.content[i * 2],
                value: itemsTape.content[i * 2 + 1]
            });
        }
        this.currentItemIndex_ = 0;
    }

    run() {
        // Start
        this.fsm_.setStateAndSave(StatesKP.START);
        // Read Capacity
        this.fsm_.setStateAndSave(StatesKP.READ_CAPACITY);

        // Iterative Dynamic Programming for Knapsack
        const res = this.iterativeDP();
        // Finish
        this.fsm_.setStateAndSave(StatesKP.FINISH, res);
    }

    iterativeDP() {
        for (let i = 0; i < this.items_.length; i++) {
            this.currentItemIndex_ = i;
            this.fsm_.setStateAndSave(StatesKP.READ_ITEM_WEIGHT, this.currentItemIndex_);
            this.fsm_.setStateAndSave(StatesKP.READ_ITEM_VALUE, this.currentItemIndex_);
            this.fsm_.setStateAndSave(StatesKP.UPDATE_DP, this.currentItemIndex_);
        }
        return this.fsm_.dpTape_.content[this.capacity_];
    }

    getHistory(): IterativeKPFSMStateEntry[] {
        const history = this.fsm_.getHistory();
        for (let i = 0; i < history.length; i++) {
            this.fsmHistory_.push({ KPFSMHistoryEntry: history[i] });
        }
        return this.fsmHistory_;
    }
}
