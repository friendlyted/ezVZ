import {Destroyable} from "./Destroyable.ts";

export class ComponentInstance implements Destroyable {
    private readonly rootElement: Element;
    private readonly dependencies: Destroyable[];

    constructor(rootElement: Element, ...dependencies: Destroyable[]) {
        this.rootElement = rootElement;
        this.dependencies = dependencies;
    }

    attachToContainer(domContainer: ParentNode, index: number = -1) {
        this.detach();
        const targetChild = domContainer.children.item(index);
        if (targetChild === null) {
            domContainer.append(this.rootElement);
        } else {
            targetChild.before(this.rootElement);
        }
    }

    replaceElement(element: Element) {
        this.detach();
        element.parentElement.insertBefore(this.rootElement, element);
        element.remove();
    }

    detach() {
        this.rootElement.remove();
    }

    destroy() {
        this.detach();
        this.dependencies.forEach(it => it.destroy());
    }
}
