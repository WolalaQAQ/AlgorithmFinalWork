// 解空间树节点类，用于表示一个状态
export class TreeNode {
    level: number;  // 当前节点所处的层级
    profit: number; // 当前节点的利润
    weight: number; // 当前节点的重量
    bound: number;  // 当前节点的上界

    constructor(level: number, profit: number, weight: number, bound: number) {
        this.level = level;
        this.profit = profit;
        this.weight = weight;
        this.bound = bound;
    }
}

