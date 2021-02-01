import Entry from "./decorators/entry";
import Exit from "./decorators/exit";
import Step from "./decorators/step";
import While from "./decorators/guards/while";
import Until from "./decorators/guards/until";
import Lotto from "./nodes/lotto";
import Condition from "./nodes/condition";
import Flip from "./nodes/flip";
import Parallel from "./nodes/parallel";
import Repeat from "./nodes/repeat";
import Root from "./nodes/root";
import Selector from "./nodes/selector";
import Sequence from "./nodes/sequence";
import Wait from "./nodes/wait";

export const schemas = {
    "lotto": Lotto.schema,
    "condition": Condition.schema,
    "flip": Flip.schema,
    "parallel": Parallel.schema,
    "repeat": Repeat.schema,
    "root": Root.schema,
    "selector": Selector.schema,
    "sequence": Sequence.schema,
    "wait": Wait.schema,
    "entry":Entry.schema,
    "exit":Exit.schema,
    "step":Step.schema,
    "while":While.schema,
    "until":Until.schema
};

export const rootAlias = {"rootAlias": "$$.Root"};

export const baseItemAliases = [
    {
        "identifier": "$$.Root",
        "values": [
            "$$.Root"
        ]
    },
    {
        "identifier": "$$.Item",
        "values": [
            "$$.Selector",
            "$$.Sequence",
            "$$.Parallel",
            "$$.Wait",
            "$$.Flip",
            "$$.Lotto",
            "$$.Condition",
            "$$.Repeat"
        ]
    },
    {
        "identifier": "$$.Action",
        "values": []
    },
    {
        "identifier": "$$.Hook",
        "values": [
            "$$.Hooks.Entry",
            "$$.Hooks.Exit",
            "$$.Hooks.Step",
            "$$.Hooks.While",
            "$$.Hooks.Until"
        ]
    }
]
