import { TapeClass } from '@class/tape/TapeClass';
import { StatesKPDP } from "@class/fsm/knapsack/StatesKPDP.tsx";
import {KnapsackDPFSM, KPDPFSMStateEntry} from "@class/fsm/knapsack/KnapsackDPFSM.tsx";

export interface KnapsackDPFSMStateEntry {
    KPFSMHistoryEntry: KPDPFSMStateEntry;
}

export class KnapsackDPSim {
    private fsm_: KnapsackDPFSM;
    private capacity_: number;
    private currentItemIndex_: number;
    private items_: Array<{ weight: number, value: number }>;

    private fsmHistory_: KnapsackDPFSMStateEntry[] = [];

    constructor(capacityTape: TapeClass, itemsTape: TapeClass) {
        this.fsm_ = new KnapsackDPFSM(capacityTape, itemsTape);
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
        this.fsm_.setStateAndSave(StatesKPDP.START);
        // Read Capacity
        this.fsm_.setStateAndSave(StatesKPDP.READ_CAPACITY);

        // Iterative Dynamic Programming for Knapsack
        const res = this.iterativeDP();
        // Finish
        this.fsm_.setStateAndSave(StatesKPDP.FINISH, res);
    }

    iterativeDP() {
        for (let i = 0; i < this.items_.length; i++) {
            this.currentItemIndex_ = i;
            this.fsm_.setStateAndSave(StatesKPDP.READ_ITEM_WEIGHT, this.currentItemIndex_);
            this.fsm_.setStateAndSave(StatesKPDP.READ_ITEM_VALUE, this.currentItemIndex_);
            this.fsm_.setStateAndSave(StatesKPDP.UPDATE_DP, this.currentItemIndex_);
        }
        return this.fsm_.dpTape_.content[this.capacity_];
    }

    getHistory(): KnapsackDPFSMStateEntry[] {
        const history = this.fsm_.getHistory();
        for (let i = 0; i < history.length; i++) {
            this.fsmHistory_.push({ KPFSMHistoryEntry: history[i] });
        }
        return this.fsmHistory_;
    }
}
