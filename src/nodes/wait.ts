import Leaf from './leaf'
import {State} from "../state";

/**
 * The time in milliseconds at which this node was first updated.
 */
let initialUpdateTime;

/**
 * The duration in milliseconds that this node will be waiting for.
 */
let waitDuration;
export default class Wait extends Leaf {
    private readonly _duration: any;
    private readonly _longestDuration: any;
    private initialUpdateTime: number;
    private waitDuration: any;
    /**
     * A WAIT node.
     * The state of this node will change to SUCCEEDED after a duration of time.
     * @param decorators The node decorators.
     * @param duration The duration that this node will Wait to succeed in milliseconds, or the earliest if longestDuration is defined.
     * @param longestDuration The longest possible duration in milliseconds that this node will Wait to succeed.
     */
    constructor(decorators, duration, longestDuration) {
        super("wait", decorators);



        this._duration = duration;
        this._longestDuration = longestDuration;
    }

    getName() {
        return `WAIT ${this._longestDuration ? this._duration + "ms-" + this._longestDuration + "ms" : this._duration + "ms"}`;
    }

    onUpdate(board) {
        console.log(this.getState());
        // If this node is in the READY state then we need to set the initial update time.
        if (this.is(State.READY) || initialUpdateTime === null) {
            // Set the initial update time.
            initialUpdateTime = new Date().getTime();

            // If a longestDuration value was defined then we will be randomly picking a duration between the
            // shortest and longest duration. If it was not defined, then we will be just using the duration.
            // this.waitDuration = this._longestDuration ? Math.floor(Math.random() * (this._longestDuration - this._duration + 1) + this._duration) :
            //waitDuration =  this._duration;

            // The node is now running until we finish waiting.
            this.setState(State.RUNNING);
        }

        // Have we waited long enough?
        if (new Date().getTime() >= (initialUpdateTime + this._duration)) {
            // We have finished waiting!
            this.setState(State.SUCCEEDED);
            initialUpdateTime = null;
        }
    }

    toJSON() {
        return {
            hooks: this.getDecorators(),
            $type: "$$.Wait",
            "$data.duration": this._duration,
            collapsed: this.collapsed,
            state: this.getStateAsString()
        }
    }

    static schema = {
        "nodeType": "$$.Wait",
        "comment": "",
        "fields": [
            {
                "name": "hooks",
                "valueType": "$$.Hook",
                "isArray": true
            },
            {
                "name": "$data.duration",
                "valueType": "number"
            }
        ]
    }
};

