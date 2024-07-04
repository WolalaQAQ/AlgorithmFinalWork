// 引入必要的类和接口
import { TapeClass } from '@class/tape/TapeClass';
import { StatesKPBB } from "@class/fsm/knapsack/iterative/StatesKPBB.tsx";
import { KnapsackBBFSM, KPBBFSMStateEntry } from "@class/fsm/knapsack/iterative/KnapsackBBFSM.tsx";
import { TreeNode } from "@class/fsm/knapsack/iterative/DataStructureKPBB.tsx";

// 定义背包分支限界模拟状态条目的接口
export interface KnapsackBBSimStateEntry {
    KPBBFSMStateEntry: KPBBFSMStateEntry;
}

// 实现分支限界算法解决背包问题的类
export class KnapsackBBSim {
    private fsm_: KnapsackBBFSM; // 背包分支限界的有限状态机
    private capacity_: number; // 背包的容量
    private items_: Array<{ weight: number, value: number }>; // 物品的重量和价值列表

    private fsmHistory_: KnapsackBBSimStateEntry[] = []; // FSM状态的历史记录

    // 构造函数，初始化FSM、容量和物品
    constructor(capacityTape: TapeClass, itemsTape: TapeClass) {
        this.fsm_ = new KnapsackBBFSM(capacityTape, itemsTape);
        this.capacity_ = capacityTape.content[0]; // capacityTape的第一个元素是背包容量
        this.items_ = [];
        // 从itemsTape中提取物品的重量和价值对，并填充items_数组
        for (let i = 0; i < itemsTape.content.length / 2; i++) {
            this.items_.push({
                weight: itemsTape.content[i * 2],
                value: itemsTape.content[i * 2 + 1]
            });
        }
    }

    // 计算当前节点的上界（bound），用于判断是否继续搜索该分支
    bound(node: TreeNode, n: number, capacity: number, weights: number[], profits: number[]): number {
        // 如果重量超过容量，返回0（不可行）
        if (node.weight >= capacity) {
            return 0;
        }

        let profitBound = node.profit; // 用当前节点的利润初始化利润上界
        let j = node.level + 1; // 下一个级别
        let totalWeight = node.weight; // 包括当前节点重量的总重量

        // 在容量范围内将物品添加到背包中
        while (j < n && totalWeight + weights[j] <= capacity) {
            totalWeight += weights[j];
            profitBound += profits[j];
            j++;
        }

        // 如果还有剩余物品，添加分数部分到上界
        if (j < n) {
            profitBound += (capacity - totalWeight) * (profits[j] / weights[j]);
        }

        return profitBound; // 返回计算的上界
    }

    // 用分支限界法解决0/1背包问题
    knapsackBranchAndBound(weights: number[], profits: number[], capacity: number): number {
        const n = profits.length; // 物品数量
        // 按照利润重量比降序排列物品
        const items = Array.from({ length: n }, (_, i) => i).sort((i, j) => profits[j] / weights[j] - profits[i] / weights[i]);
        weights = items.map(i => weights[i]);
        profits = items.map(i => profits[i]);

        const queue: TreeNode[] = []; // 用于广度优先搜索的队列
        const rootNode = new TreeNode(-1, 0, 0, 0); // 根节点
        const nextNode = new TreeNode(0, 0, 0, 0); // 下一个节点

        let maxProfit = 0; // 记录最大利润
        this.fsm_.setStateAndSave(StatesKPBB.WRITE_RESULT, maxProfit); // 写入最大利润（初始为0）

        queue.push(rootNode); // 从根节点开始
        this.fsm_.setStateAndSave(StatesKPBB.QUEUE_PUSH, rootNode.bound); // 将根节点加入队列

        // 广度优先搜索以探索节点
        while (queue.length > 0) {
            const currentNode = queue.shift(); // 出列当前节点
            if (!currentNode) {
                continue;
            }
            this.fsm_.setStateAndSave(StatesKPBB.QUEUE_POP, currentNode.bound); // 将当前节点出列

            // 设置下一个节点的级别
            if (currentNode.level === -1) {
                nextNode.level = 0;
            } else if (currentNode.level === n - 1) {
                continue;
            } else {
                nextNode.level = currentNode.level + 1;
            }

            // 将当前物品包含在背包中
            nextNode.weight = currentNode.weight + weights[nextNode.level];
            nextNode.profit = currentNode.profit + profits[nextNode.level];
            this.fsm_.setStateAndSave(StatesKPBB.TRY_INCLUDE); // 尝试将物品包含在背包中

            // 如果该节点的利润大于当前最大利润且重量在容量范围内，更新最大利润
            if (nextNode.weight <= capacity && nextNode.profit > maxProfit) {
                maxProfit = nextNode.profit;
                this.fsm_.setStateAndSave(StatesKPBB.WRITE_RESULT, maxProfit); // 写入最大利润
            }

            // 计算下一个节点的上界
            nextNode.bound = this.bound(nextNode, n, capacity, weights, profits);
            this.fsm_.setStateAndSave(StatesKPBB.CALC_BOUND); // 计算上界

            // 如果上界大于当前最大利润，将此节点加入队列
            if (nextNode.bound > maxProfit) {
                queue.push(new TreeNode(nextNode.level, nextNode.profit, nextNode.weight, nextNode.bound));
                this.fsm_.setStateAndSave(StatesKPBB.QUEUE_PUSH, nextNode.bound); // 将节点加入队列
            }

            // 不将当前物品包含在背包中并计算上界
            nextNode.weight = currentNode.weight;
            nextNode.profit = currentNode.profit;
            this.fsm_.setStateAndSave(StatesKPBB.TRY_EXCLUDE, nextNode.profit); // 尝试不将物品包含在背包中
            nextNode.bound = this.bound(nextNode, n, capacity, weights, profits);
            this.fsm_.setStateAndSave(StatesKPBB.CALC_BOUND); // 计算上界


            // 如果上界大于当前最大利润，将此节点加入队列
            if (nextNode.bound > maxProfit) {
                queue.push(new TreeNode(nextNode.level, nextNode.profit, nextNode.weight, nextNode.bound));
                this.fsm_.setStateAndSave(StatesKPBB.QUEUE_PUSH, nextNode.bound); // 将节点加入队列
            }
        }

        return maxProfit; // 返回找到的最大利润
    }

    run() {
        // Start
        this.fsm_.setStateAndSave(StatesKPBB.START);
        // Read Capacity
        this.fsm_.setStateAndSave(StatesKPBB.READ_CAPACITY);
        // Read All Items
        for (let i = 0; i < this.items_.length; i++) {
            this.fsm_.setStateAndSave(StatesKPBB.READ_ITEM_WEIGHT, i);
            this.fsm_.setStateAndSave(StatesKPBB.READ_ITEM_VALUE, i);
        }
        // Solve the Knapsack problem using Branch and Bound
        const res = this.knapsackBranchAndBound(this.items_.map(item => item.weight), this.items_.map(item => item.value), this.capacity_);
        // Write Result
        this.fsm_.setStateAndSave(StatesKPBB.WRITE_RESULT, res);
        // Finish
        this.fsm_.setStateAndSave(StatesKPBB.FINISH);
    }

    getHistory(): KnapsackBBSimStateEntry[] {
        const history = this.fsm_.getHistory();
        for (let i = 0; i < history.length; i++) {
            this.fsmHistory_.push({ KPBBFSMStateEntry: history[i] });
        }
        return this.fsmHistory_;
    }
}