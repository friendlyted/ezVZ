import {NodeUpdaterInstance} from "../instance/NodeUpdaterInstance.ts";
import {TextChunk} from "../TextChunk.ts";
import {ObjectBindings} from "../../binding/ObjectBindings.ts";

export class NodeUpdaterDefinition {
    private readonly nodePath: number[];
    private readonly textChunks: TextChunk[];
    private readonly attribute: string;
    private readonly triggeredBy: string[];

    constructor(nodePath: number[], textChunks: TextChunk[], triggeredBy: string[], attribute: string = null) {
        this.nodePath = nodePath;
        this.textChunks = textChunks;
        this.triggeredBy = triggeredBy;
        this.attribute = attribute;
    }

    createInstance(instanceRoot: Element, bindings: ObjectBindings<never>): NodeUpdaterInstance {
        let targetNode: Node = instanceRoot;
        for (let i = 0; i < this.nodePath.length; i++) {
            targetNode = targetNode.childNodes.item(this.nodePath[i]);
        }
        if (this.attribute) {
            targetNode = (targetNode as Element).getAttributeNode(this.attribute);
        }
        return new NodeUpdaterInstance(targetNode, bindings, this.textChunks, this.triggeredBy);
    }
}

