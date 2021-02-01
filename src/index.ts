import BehaviourTree from './behaviourtree';
import {State} from './state';
import {schemas, baseItemAliases, rootAlias} from './schemas'

globalThis.TypedBTree = { BehaviourTree, State };

export { BehaviourTree, State, schemas, baseItemAliases, rootAlias }
