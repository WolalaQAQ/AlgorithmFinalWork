export const StatesBacktrackKP = Object.freeze({
    START: 'qStart',
    READ_CAPACITY: 'qReadCapacity',
    READ_ITEM_WEIGHT: 'qReadItemWeight',
    READ_ITEM_VALUE: 'qReadItemValue',
    KNAPSACK_FULL: 'qKnapsackFull',
    NO_MORE_ITEMS: 'qNoMoreItems',
    OVER_WEIGHT: 'qOverWeight',
    TRY_INCLUDE: 'qTryInclude',
    TRY_EXCLUDE: 'qTryExclude',
    CALC_MAX: 'qCalcMax',
    WRITE_RESULT: 'qWriteResult',
    FINISH: 'qFinish'
});