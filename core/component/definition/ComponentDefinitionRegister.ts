import {ComponentDefinition} from "./ComponentDefinition.ts";
import {ComponentModel} from "./ComponentModel.ts";
import {TemplateAnalyzer} from "../../parser/TemplateAnalyzer.ts";
import {TemplateAnalyzeResult} from "../../parser/TemplateAnalyzeResult.ts";

export class ComponentDefinitionRegister {
    private components: Map<string, ComponentDefinition> = new Map<string, ComponentDefinition>();
    private readonly analyzer: TemplateAnalyzer;

    constructor() {
        this.analyzer = new TemplateAnalyzer(this);
    }

    register(modelName: string, template: string, svg: boolean = false) {
        let templateRoot: Element;
        if (svg) {
            templateRoot = ComponentDefinitionRegister.parseSvg(template);
        } else {
            templateRoot = ComponentDefinitionRegister.parseTemplate(template);
        }
        const templateInfo: TemplateAnalyzeResult = this.analyzer.analyzeNode(templateRoot);
        const componentDefinition = new ComponentDefinition(
            templateRoot,
            templateInfo
        );
        this.components.set(modelName, componentDefinition);
    }

    getComponent(value: ComponentModel | string): ComponentDefinition {
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