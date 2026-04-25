import {ComponentDefinition} from "./ComponentDefinition.ts";
import {ComponentModel} from "./ComponentModel.ts";
import {TemplateAnalyzer} from "../../parser/TemplateAnalyzer.ts";
import {TemplateAnalyzeResult} from "../../parser/TemplateAnalyzeResult.ts";
import {ObjectBindings} from "../../binding/ObjectBindings.ts";

export interface ComponentDefinitionRegisterEntry {
    definition: ComponentDefinition,

    bindingProvider(data: any): ObjectBindings<any>
}

export interface ComponentDefinitionRegisterInput {
    modelName: string;
    template: string;
    svg?: boolean;

    bindingProvider?(data: any): ObjectBindings<any>;
}

export class ComponentDefinitionRegister {
    private components = new Map<string, ComponentDefinitionRegisterEntry>();
    private readonly analyzer: TemplateAnalyzer;

    constructor() {
        this.analyzer = new TemplateAnalyzer(this);
    }

    register(entry: ComponentDefinitionRegisterInput) {
        let templateRoot: Element;
        if (entry.svg) {
            templateRoot = ComponentDefinitionRegister.parseSvg(entry.template);
        } else {
            templateRoot = ComponentDefinitionRegister.parseTemplate(entry.template);
        }
        const templateInfo: TemplateAnalyzeResult = this.analyzer.analyzeNode(templateRoot);
        const componentDefinition = new ComponentDefinition(
            templateRoot,
            templateInfo
        );

        this.components.set(entry.modelName, {
            definition: componentDefinition,
            bindingProvider: entry.bindingProvider || ObjectBindings.allFields
        });
    }

    getComponent(value: ComponentModel | string): ComponentDefinitionRegisterEntry {
        if (typeof (value) === "string") {
            return this.components.get(value);
        }
        return this.components.get(value?.modelName?.());
    }

    private static parseSvg(content: string) {
        const doc = new DOMParser().parseFromString(content, "image/svg+xml");
        return doc.firstElementChild;
    }

    private static parseTemplate(content: string) {
        const doc = new DOMParser().parseFromString(content, "text/html");
        return doc.body.firstElementChild;
    }
}