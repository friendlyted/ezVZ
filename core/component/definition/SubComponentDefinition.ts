import {ObjectBindings} from "../../binding/ObjectBindings.ts";
import {ComponentInstance} from "../instance/ComponentInstance.ts";
import {ComponentDefinitionRegister} from "./ComponentDefinitionRegister.ts";
import {Destroyable} from "../instance/Destroyable.ts";


export class SubComponentDefinition {
    private readonly nodePath: number[];
    private readonly bindingName: string;
    private readonly componentRegister: ComponentDefinitionRegister;

    constructor(nodePath: number[], bindingName: string, componentRegister: ComponentDefinitionRegister) {
        this.nodePath = nodePath;
        this.bindingName = bindingName;
        this.componentRegister = componentRegister;
    }

    createInstance(instanceRoot: Element, bindings: ObjectBindings): Destroyable {
        const dependencies: Destroyable[] = [];
        const result: Destroyable = {
            destroy() {
                dependencies.forEach(d => d.destroy());
            }
        };

        const data = bindings.get(this.bindingName)?.getValue?.() || null;
        if (data === null) {
            throw new Error("SubComponent requires ComponentModel in a 'data' attribute")
        }
        if (!data.$__isManaged?.()) {
            throw new Error("SubComponent requires reactive model");
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
                return result;
            }

            const subInstance = this.componentRegister.createComponent(data);
            dependencies.push(subInstance);

            subInstance.replaceElement(targetNode);
            return result;
        }


        const fragment = new DocumentFragment();
        const instances = data.map((value: any) => this.createListElement(value, fragment));
        dependencies.push(...instances);

        targetNode.append(fragment);

        data.$__addInsertListener((index: number, value: any) => {
            const newInstance = this.createListElement(value, targetNode, index);
            dependencies.splice(index, 0, newInstance);
        });

        data.$__addDeleteListener((index: number) => {
            targetNode.children.item(index).remove();
            dependencies.splice(index, 1)
                .forEach(i => i.destroy());
        });

        return result;
    }

    createListElement(data: any, container: ParentNode, index: number = -1): ComponentInstance {
        const instance = this.componentRegister.createComponent(data);
        instance.attachToContainer(container, index);
        return instance;
    }
}

