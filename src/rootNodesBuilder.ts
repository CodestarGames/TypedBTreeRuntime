import {ASTNodeFactories, DecoratorFactories} from "./rootASTNodesBuilder";
import Decorator from "./decorators/decorator";

export class RootNodesBuilder {
    //used for reference storage
    stack = [[]];

    TraverseContent(contentItem: Array<any>) {
        contentItem.forEach((item, index, array) => {

            let node;

            if (item['$type'] === "$$.Root") {
                node = ASTNodeFactories.ROOT();
                node.collapsed = false;

                this.stack[this.stack.length - 1].push(node);

                this.stack.push(node.children);

                // Try to pick any decorators off of the token stack.
                //node.decorators = this.getDecorators(item.hooks);
                node.decorators = this.getDecorators(item.hooks);

                // recursively process nested objects
                if (item.children) {
                    this.TraverseContent([item.children]);
                    this.stack.pop();
                }

                return;
            }

            if (item['$type'] === "$$.Selector") {
                node = ASTNodeFactories.SELECTOR();
                node.collapsed = item['collapsed'] ?? true;
                this.handleChildren(node, item);
                node.decorators = this.getDecorators(item.hooks);
                return;
            }

            if (item['$type'] === "$$.Sequence") {
                node = ASTNodeFactories.SEQUENCE();
                node.collapsed = item['collapsed'] ?? true;
                this.handleChildren(node, item);
                node.decorators = this.getDecorators(item.hooks);
                return;
            }

            if (item['$type'] === "$$.Repeat") {
                node = ASTNodeFactories.REPEAT();
                node.collapsed = item['collapsed'] ?? true;
                //TODO: set props
                node.iterations = item[`$data.times`];
                this.handleChildren(node, item);
                node.decorators = this.getDecorators(item.hooks);
                return;
            }

            if (item['$type'] === "$$.Lotto") {
                node = ASTNodeFactories.LOTTO();
                node.collapsed = item['collapsed'] ?? true;
                //TODO: set props
                node.props = {tickets: item[`$data.tickets`].split(",")};
                this.handleChildren(node, item);
                node.decorators = this.getDecorators(item.hooks);
                return;
            }

            if (item['$type'] === "$$.Flip") {
                node = ASTNodeFactories.FLIP();
                node.collapsed = item['collapsed'] ?? true;

                this.handleChildren(node, item);
                node.decorators = this.getDecorators(item.hooks);

                return;
            }

            if (item['$type'] === "$$.Parallel") {
                node = ASTNodeFactories.PARALLEL();
                node.collapsed = item['collapsed'] ?? true;

                this.handleChildren(node, item);
                node.decorators = this.getDecorators(item.hooks);
                return;
            }

            if (item['$type'].indexOf('$$.Actions')  > -1) {
                node = ASTNodeFactories.ACTION();
                node.collapsed = item['collapsed'] ?? true;
                this.stack[this.stack.length-1].push(node);

                node.actionName = item['$type'];//.split(".").reverse()[0];
                let {$type, ...theRest} = item;
                node.props = theRest;

                // Try to pick any decorators off of the token stack.
                node.decorators = this.getDecorators(item.hooks);

            }

            if (item['$type'].indexOf('$$.Condition')  > -1) {
                node = ASTNodeFactories.CONDITION();
                node.collapsed = item['collapsed'] ?? true;
                this.stack[this.stack.length-1].push(node);

                node.conditionFunction = item['$condition'];

                // Try to pick any decorators off of the token stack.
                node.decorators = this.getDecorators(item.hooks);

            }

            if (item['$type'].indexOf('$$.Wait')  > -1) {
                node = ASTNodeFactories.WAIT();
                node.collapsed = item['collapsed'] ?? true;
                this.stack[this.stack.length-1].push(node);
                node.duration = item[`$data.duration`];
                // Try to pick any decorators off of the token stack.
                node.decorators = this.getDecorators(item.hooks);

            }


        });

        return this.stack[0];
    }

    private handleChildren(node: any, item: any) {
        this.stack[this.stack.length - 1].push(node);

        if(typeof item.children === 'object' && Array.isArray(item.children) === false){
            item.children = [item.children];
        }

        this.stack.push(node.children);

        // Try to pick any decorators off of the token stack.
        //node.decorators = this.getDecorators(item.hooks);

        // recursively process nested objects
        if (item.children && item.children.length > 0) {
            this.TraverseContent(item.children);
            this.stack.pop();
        }
    }

    private getDecorators(hooks: Array<any>) {
        let decorators: Decorator[] = [];
        hooks && hooks.forEach(hook => {
            let decorator;
            switch (hook.$type) {
                case "$$.Hooks.Until":
                    decorator = DecoratorFactories.UNTIL(hook.$condition);
                    decorators.push(decorator);
                    break;
                case "$$.Hooks.While":
                    decorator = DecoratorFactories.WHILE(hook.$condition);
                    decorators.push(decorator);
                    break;
                case "$$.Hooks.Entry":
                    var {$type, ...theRest} = hook.action;
                    decorator = DecoratorFactories.ENTRY($type, theRest);
                    decorators.push(decorator);
                    break;
                case "$$.Hooks.Step":
                    var {$type, ...theRest} = hook.action;
                    decorator = DecoratorFactories.STEP($type, theRest);
                    decorators.push(decorator);
                    break;
                case "$$.Hooks.Exit":
                    var {$type, ...theRest} = hook.action;
                    decorator = DecoratorFactories.EXIT($type, theRest);
                    decorators.push(decorator);
                    break;
                }

        })
        return decorators;
    }

}
