import Composite from './composite'
import {State} from "../state";

export default class Sequence extends Composite {
    /**
     * A SEQUENCE node.
     * The child nodes are executed in Sequence until one fails or all succeed.
     * @param decorators The node decorators.
     * @param children The child nodes.
     */
    constructor(decorators, children) {
        super("sequence", decorators, children);

        this._children = children;
    }

    getName() {
        return "SEQUENCE";
    }

    onUpdate(board) {
        // Iterate over all of the children of this node.
        for (const child of this._children) {
            // If the child has never been updated or is running then we will need to update it now.
            if (child.getState() === State.READY || child.getState() === State.RUNNING) {
                // Update the child of this node.
                child.update(board);
            }

            // If the current child has a state of 'SUCCEEDED' then we should move on to the next child.
            if (child.getState() === State.SUCCEEDED) {
                // Find out if the current child is the last one in the Sequence.
                // If it is then this Sequence node has also succeeded.
                if (this._children.indexOf(child) === this._children.length - 1) {
                    // This node is a 'SUCCEEDED' node.
                    this.setState(State.SUCCEEDED);

                    // There is no need to check the rest of the Sequence as we have completed it.
                    return;
                } else {
                    // The child node succeeded, but we have not finished the Sequence yet.
                    continue;
                }
            }

            // If the current child has a state of 'FAILED' then this node is also a 'FAILED' node.
            if (child.getState() === State.FAILED) {
                // This node is a 'FAILED' node.
                this.setState(State.FAILED);

                // There is no need to check the rest of the Sequence.
                return;
            }

            // The node should be in the 'RUNNING' state.
            if (child.getState() === State.RUNNING) {
                // This node is a 'RUNNING' node.
                this.setState(State.RUNNING);

                // There is no need to check the rest of the Sequence as the current child is still running.
                return;
            }

            // The child node was not in an expected state.
            throw "Error: child node was not in an expected state.";
        }
    }

    toJSON() {
        return {
            hooks: this.getDecorators(),
            $type: "$$.Sequence",
            children: this._children,
            collapsed: this.collapsed,
            state: this.getStateAsString()
        }
    }

    static schema = {
        "nodeType": "$$.Sequence",
        "comment": "Invoke all children in Sequence (the first one that fails stops the chain)",
        "fields": [
            {
                "name": "hooks",
                "valueType": "$$.Hook",
                "isArray": true
            },
            {
                "name": "children",
                "valueType": "$$.Item",
                "isArray": true
            }
        ]
    }
};

