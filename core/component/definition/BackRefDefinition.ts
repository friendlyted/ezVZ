import {ObjectBindings} from "../../binding/ObjectBindings.ts";
import {BackRefInstance} from "../instance/BackRefInstance.ts";

/**
 * Обеспечивает связь вложенных компонент из тегов с переменной модели.
 */
export class BackRefDefinition {
    private readonly nodePath: number[];
    private readonly bindingName: string;

    constructor(nodePath: number[], bindingName: string) {
        this.nodePath = nodePath;
        this.bindingName = bindingName;
    }

    createInstance(instanceRoot: Element, bindings: ObjectBindings): BackRefInstance {
        let targetNode: Element = instanceRoot;
        for (let i = 0; i < this.nodePath.length; i++) {
            targetNode = targetNode.childNodes.item(this.nodePath[i]) as Element;
        }
        let fieldBinding = bindings.get(this.bindingName);
        return new BackRefInstance(fieldBinding, targetNode);
    }
}