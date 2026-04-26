import {ComponentDefinition} from "./ComponentDefinition.ts";
import {TemplateAnalyzer} from "../../parser/TemplateAnalyzer.ts";
import {TemplateAnalyzeResult} from "../../parser/TemplateAnalyzeResult.ts";
import {ObjectBindings} from "../../binding/ObjectBindings.ts";
import {ComponentInstance} from "../instance/ComponentInstance.ts";
import {ComponentModel} from "./ComponentModel.ts";

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

    createComponent(data: ComponentModel): ComponentInstance {
        const entry = this.components.get(data.modelName());
        const binding = entry.bindingProvider(data);
        return entry.definition.createInstance(binding);
    }

    getComponent(value: string): ComponentDefinitionRegisterEntry {
        return this.components.get(value);
    }

    private static parseSvg(content: string): Element {
        const doc = new DOMParser().parseFromString(content, "image/svg+xml");
        return doc.firstElementChild;
    }

    private static parseTemplate(content: string): Element {
        const doc = new DOMParser().parseFromString(`<template id="$$parser$$">${content}</template>`, "text/html");
        const template = doc.getElementById("$$parser$$") as HTMLTemplateElement;
        return template.content.firstElementChild;
    }
}