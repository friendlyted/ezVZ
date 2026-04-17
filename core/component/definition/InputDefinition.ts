import {ObjectBindings} from "../../binding/ObjectBindings.ts";
import {InputInstance} from "../instance/InputInstance.ts";

export class InputDefinition {
    private readonly nodePath: number[];
    private readonly eventType: string;
    private readonly bindingName: string;

    constructor(nodePath: number[], eventType: string, bindingName: string) {
        this.nodePath = nodePath;
        this.eventType = eventType;
        this.bindingName = bindingName;
    }

    createInstance(instanceRoot: Element, bindings: ObjectBindings<never>): InputInstance {
        let targetNode: Node = instanceRoot;
        for (let i = 0; i < this.nodePath.length; i++) {
            targetNode = targetNode.childNodes.item(this.nodePath[i]);
        }
        return new InputInstance(targetNode, this.eventType, bindings.get(this.bindingName));
    }
}

