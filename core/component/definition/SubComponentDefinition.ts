import {ObjectBindings} from "../../binding/ObjectBindings.ts";
import {ComponentInstance} from "../instance/ComponentInstance.ts";
import {ComponentDefinitionRegister} from "./ComponentDefinitionRegister.ts";
import {ComponentDefinition} from "./ComponentDefinition.ts";


export class SubComponentDefinition {
    private readonly nodePath: number[];
    private readonly bindingName: string;
    private readonly componentRegister: ComponentDefinitionRegister;
    private componentDef: ComponentDefinition = null;

    constructor(nodePath: number[], bindingName: string, componentRegister: ComponentDefinitionRegister) {
        this.nodePath = nodePath;
        this.bindingName = bindingName;
        this.componentRegister = componentRegister;
    }

    createInstance(instanceRoot: Element, bindings: ObjectBindings<never>): ComponentInstance[] {
        const data = bindings.get(this.bindingName).getValue();
        // TODO check if data is a model

        const componentDefinition =
            this.componentDef =
                this.componentDef === null ? this.componentRegister.getComponent(data?.modelName()) : this.componentDef;

        let targetNode: Element = instanceRoot;
        for (let i = 0; i < this.nodePath.length; i++) {
            targetNode = targetNode.childNodes.item(this.nodePath[i]) as Element;
        }

        if (typeof data?.$__addInsertListener === "function") {
            const fragment = new DocumentFragment();
            const instances = data.map((value: any) => this.createListElement(value, fragment));
            targetNode.append(fragment);

            data.$__addInsertListener((index: number, value: any) => {
                this.createListElement(value, targetNode);
            });

            return instances;
        } else {
            const instance = componentDefinition.createInstance(data);
            instance.replaceElement(targetNode);
            return [instance];
        }
    }

    createListElement(data: any, container: ParentNode) {
        const instance = this.componentDef.createInstance(data);
        instance.attachToContainer(container);
        return instance;
    }
}

