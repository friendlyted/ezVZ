import {NodeUpdaterDefinition} from "../component/definition/NodeUpdaterDefinition.ts";
import {InputDefinition} from "../component/definition/InputDefinition.ts";
import {TemplateAnalyzeResult} from "./TemplateAnalyzeResult.ts";
import {BackRefDefinition} from "../component/definition/BackRefDefinition.ts";
import {SubComponentDefinition} from "../component/definition/SubComponentDefinition.ts";
import {VariableParser} from "./VariableParser.ts";
import {ConstTextChunk, FunctionTextChunk, TextChunk, VariableTextChunk} from "../component/TextChunk.ts";
import {ComponentDefinitionRegister} from "../component/definition/ComponentDefinitionRegister.ts";

export class TemplateAnalyzer {
    private static MOUSE_EVENTS = [
        "click", "dblclick", "mousedown", "mouseup", "mousemove", "mouseover", "mouseout", "mouseenter", "mouseleave"
    ];
    private static KB_EVENTS = [
        "keydown", "keyup", "keypress"
    ];
    private static TOUCH_EVENTS = [
        "touchstart", "touchend", "touchmove", "touchcancel"
    ];
    private static EVENTS = [
        ...TemplateAnalyzer.MOUSE_EVENTS,
        ...TemplateAnalyzer.KB_EVENTS,
        ...TemplateAnalyzer.TOUCH_EVENTS
    ];

    private static readonly BINDING_PATTERN = /\{\{.+}}/;
    private readonly componentRegister: ComponentDefinitionRegister;

    constructor(componentRegister: ComponentDefinitionRegister) {
        this.componentRegister = componentRegister;
    }

    public analyzeNode(element: Element, currentPath: number[] = []): TemplateAnalyzeResult {
        const nodeUpdaters: NodeUpdaterDefinition[] = [];
        const nodeInputs: InputDefinition[] = [];
        const nodeSubs: SubComponentDefinition[] = [];
        const backrefs: BackRefDefinition[] = [];
        const result = {nodeUpdaters, nodeInputs, nodeSubs, backrefs};

        if (element.localName === ("template")) {
            let bindingName = element.getAttribute("ftd:include");

            if (bindingName != null){
                const sub = new SubComponentDefinition(
                    currentPath,
                    bindingName,
                    this.componentRegister
                );
                nodeSubs.push(sub);
            }

            return result;
        }

        let attrsResult = this.analyzeAttributes(element, currentPath);
        nodeUpdaters.push(...attrsResult.nodeUpdaters);
        nodeInputs.push(...attrsResult.nodeInputs);
        nodeSubs.push(...attrsResult.nodeSubs);
        backrefs.push(...attrsResult.backrefs);

        element.childNodes.forEach((node: Node, i) => {
            if (node.nodeType === Node.TEXT_NODE) {
                let text = this.analyzeTextNode(node as Text, [...currentPath, i]);
                if (text) nodeUpdaters.push(text);
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                let childResult = this.analyzeNode(node as Element, [...currentPath, i]);
                nodeUpdaters.push(...childResult.nodeUpdaters);
                nodeInputs.push(...childResult.nodeInputs);
                nodeSubs.push(...childResult.nodeSubs);
                backrefs.push(...childResult.backrefs);
            }
        })

        return result;
    }

    public analyzeTextNode(textNode: Text, currentPath: number[]): NodeUpdaterDefinition {
        let value = textNode.textContent;
        if (!value.match(TemplateAnalyzer.BINDING_PATTERN)) return null;

        const [textChunks, variables] = this.analyzeValuedText(value);

        return new NodeUpdaterDefinition(currentPath, textChunks, variables);
    }

    public analyzeAttributes(element: Element, currentPath: number[]): TemplateAnalyzeResult {
        const nodeUpdaters: NodeUpdaterDefinition[] = [];
        const nodeInputs: InputDefinition[] = [];
        const nodeSubs: SubComponentDefinition[] = [];
        const backrefs: BackRefDefinition[] = [];
        const result = {nodeUpdaters, nodeInputs, nodeSubs, backrefs};

        let attrs = element.attributes;
        for (let i = 0; i < attrs?.length; i++) {
            const attr = attrs.item(i);
            let name = attr.name;

            if (!name.startsWith("ftd:")) {
                const updater = this.analyzeAttribute(attr, currentPath);
                if (updater) nodeUpdaters.push(updater);
                continue;
            }

            const ftdName = name.substring(4).toLowerCase();

            if (ftdName === "backref") {
                backrefs.push(new BackRefDefinition(currentPath, attr.value));
                continue;
            }

            if (ftdName === "list") {
                let bindingName = attr.value;
                const sub = new SubComponentDefinition(
                    currentPath,
                    bindingName,
                    this.componentRegister
                );
                nodeSubs.push(sub);
                continue;
            }

            if (TemplateAnalyzer.EVENTS.includes(ftdName)) {
                const input = new InputDefinition(currentPath, ftdName, attr.value);
                nodeInputs.push(input);
                continue;
            }

            throw new Error(`Unsupported ftd attribute: ${name}`);
        }
        return result;
    }

    public analyzeAttribute(attr: Attr, currentPath: number[]): NodeUpdaterDefinition {
        const name = attr.localName;
        const value = attr.value;

        if (!value.match(TemplateAnalyzer.BINDING_PATTERN)) return null;

        const [textChunks, triggeredBy] = this.analyzeValuedText(value);
        return new NodeUpdaterDefinition(currentPath, textChunks, triggeredBy, name);
    }

    public analyzeValuedText(text: string): [TextChunk[], string[]] {
        const triggeredBy: string[] = [];
        const chunks = VariableParser.parse<TextChunk>(
            text,
            value => new ConstTextChunk(value),
            varName => {
                triggeredBy.push(varName);
                return new VariableTextChunk(varName)
            },
            (fnName, fnParams) => {
                triggeredBy.push(...fnParams);
                return new FunctionTextChunk(fnName, fnParams);
            }
        );

        return [chunks, triggeredBy];
    }
}