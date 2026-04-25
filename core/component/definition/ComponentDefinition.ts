import {TemplateAnalyzeResult} from "../../parser/TemplateAnalyzeResult.ts";
import {ObjectBindings} from "../../binding/ObjectBindings.ts";
import {Destroyable} from "../instance/Destroyable.ts";
import {ComponentInstance} from "../instance/ComponentInstance.ts";
import {ReactiveObject} from "../../reactive/ReactiveObject.ts";

export class ComponentDefinition {
    private readonly templateRoot: Element;
    private readonly templateInfo: TemplateAnalyzeResult;

    constructor(
        templateRoot: Element,
        templateInfo: TemplateAnalyzeResult
    ) {
        this.templateRoot = templateRoot;
        this.templateInfo = templateInfo;

        this.cleanupFtdData();
    }


    private cleanupFtdData() {
        this.cleanupAttributes(this.templateRoot);
        const elements = Array.from(this.templateRoot.querySelectorAll("*"));
        for (const el of elements) {
            if (el.localName === ("ftd")) {
                el.remove();
            } else {
                this.cleanupAttributes(el);
            }
        }
    }

    private cleanupAttributes(el: Element) {
        const attrNames = el.getAttributeNames();
        for (const attrName of attrNames) {
            if (attrName.startsWith("ftd:")) {
                el.removeAttribute(attrName);
            }
        }
    }

    createInstance<T extends ReactiveObject<T>>(bindings: ObjectBindings<T>, resources: Destroyable[] = []): ComponentInstance {
        const instanceRoot = this.templateRoot.cloneNode(true) as Element;

        const updaters = this.templateInfo.nodeUpdaters
            .map(it => it.createInstance(instanceRoot, bindings));

        const inputs = this.templateInfo.nodeInputs
            .map(it => it.createInstance(instanceRoot, bindings));

        const subs = this.templateInfo.nodeSubs
            .flatMap(it => it.createInstance(instanceRoot, bindings));

        const backRefs = this.templateInfo.backrefs
            .map(it => it.createInstance(instanceRoot, bindings));

        let componentInstance = new ComponentInstance(instanceRoot, ...updaters, ...inputs, ...subs, ...backRefs, ...resources);

        const afterBindingTo = bindings.get("afterBindingTo").getValue();
        if (typeof (afterBindingTo) === "function") {
            afterBindingTo(componentInstance);
        }

        return componentInstance;
    }

}