import Decorator from './decorator'

/**
 * A STEP decorator which defines a blackboard function to call when the decorated node is updated.
 * @param functionName The name of the blackboard function to call.
 */
export default class Step extends Decorator {
    private readonly functionName : any;
    private _fnData: any;

    constructor(functionName, fnData) {
        super();
        this._fnData = fnData;
        this.functionName = functionName;
    }
    /**
     * Gets the function name.
     */
    getFunctionName = () => this.functionName;

    /**
     * Gets the decorator details.
     */
    getDetails = () => {
        return {
            type: this.getType(),
            isGuard: this.isGuard(),
            functionName: this.getFunctionName()
        };
    };

    /**
     * Attempt to call the blackboard function that this decorator refers to.
     * @param board The board.
     */
    callBlackboardFunction = (board) => {
        // Call the blackboard function if it exists.
        if (typeof board[this.functionName] === "function") {
            board[this.functionName].call(board, board, this._fnData);
        } else {
            throw `cannot call entry decorator function '${this.functionName}' is not defined in the blackboard`;
        }
    };

    static schema = {
        "nodeType": "$$.Hooks.Step",
        "fields": [
            {
                "name": "action",
                "valueType": "$$.Action",
                "isArray": false
            }
        ]
    }
};
