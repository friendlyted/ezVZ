import {ObjectBindings} from "../../binding/ObjectBindings.ts";
import {ComponentInstance} from "../instance/ComponentInstance.ts";
import {ComponentDefinitionRegister} from "./ComponentDefinitionRegister.ts";
import {ComponentModel} from "./ComponentModel.ts";


export class SubComponentDefinition {
    private readonly nodePath: number[];
    private readonly bindingName: string;
    private readonly componentRegister: ComponentDefinitionRegister;

    constructor(nodePath: number[], bindingName: string, componentRegister: ComponentDefinitionRegister) {
        this.nodePath = nodePath;
        this.bindingName = bindingName;
        this.componentRegister = componentRegister;
    }

    createInstance(instanceRoot: Element, bindings: ObjectBindings<never>): ComponentInstance[] {
        const data = bindings.get(this.bindingName)?.getValue?.() || null;
        if (data === null) {
            throw new Error("SubComponent requires ComponentModel in a 'data' attribute")
        }

        let targetNode: Element = instanceRoot;
        for (let i = 0; i < this.nodePath.length; i++) {
            targetNode = targetNode.childNodes.item(this.nodePath[i]) as Element;
        }

        let isList = data instanceof Array;
        if (!isList) {
            let modelName = data?.modelName?.();
            if (typeof (modelName) === "undefined") {
                console.error("Skipping SubComponent rendering due to data is not a ComponentModel type");
                return [];
            }

            const componentDefinitionInfo = this.componentRegister.getComponent(modelName) || null;
            if (componentDefinitionInfo === null) {
                throw new Error(`Cannot found a component for name ${modelName}`);
            }

            let subBinding = componentDefinitionInfo.bindingProvider(data);
            const subInstance = componentDefinitionInfo.definition.createInstance(subBinding);
            subInstance.replaceElement(targetNode);
            return [subInstance];
        }

        if (typeof data?.$__addInsertListener === "function") {
            const fragment = new DocumentFragment();
            const instances = data.map((value: any) => this.createListElement(value, fragment));
            targetNode.append(fragment);

            data.$__addInsertListener((index: number, value: any) => {
                this.createListElement(value, targetNode);
            });

            return instances;
        }

        return data.map((it: any) => this.createListElement(it, targetNode));
    }

    createListElement(data: any, container: ParentNode): ComponentInstance {
        const componentInfo = this.componentRegister
            .getComponent(data as ComponentModel);
        const binding = componentInfo.bindingProvider(data);
        const instance = componentInfo.definition.createInstance(binding);
        instance.attachToContainer(container);
        return instance;
    }
}

