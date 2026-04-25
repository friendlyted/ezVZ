declare module "https://friendlyted.github.io/ezVZ/core/component/instance/Destroyable.ts" {
    export interface Destroyable {
        destroy(): void;
    }
}
declare module "https://friendlyted.github.io/ezVZ/core/reactive/ReactiveObject.ts" {
    import { Destroyable } from "https://friendlyted.github.io/ezVZ/core/component/instance/Destroyable.ts";
    export type AttrKey = string | number | symbol;
    export interface AttributeListener {
        (name: AttrKey, oldValue: any): void;
    }
    export interface ReactiveObject<T> {
        $__addFieldListener(attributeName: keyof T, listener: AttributeListener): Destroyable;
        $__removeFieldListener(attributeName: keyof T, listener: AttributeListener): void;
        $__merge(other: T): void;
        $__hash(): number;
        $__isManaged(): boolean;
        $__triggerUpdate(attributeName: keyof T): void;
        $__unwrap(): T;
    }
}
declare module "https://friendlyted.github.io/ezVZ/core/binding/FieldBinding.ts" {
    import { ReactiveObject } from "https://friendlyted.github.io/ezVZ/core/reactive/ReactiveObject.ts";
    import { Destroyable } from "https://friendlyted.github.io/ezVZ/core/component/instance/Destroyable.ts";
    export interface ChangeCallback {
        (): void;
    }
    export class FieldBinding {
        private readonly object;
        private readonly field;
        private constructor();
        addChangeListener(callback: ChangeCallback): Destroyable;
        getValue(): any;
        setValue(value: any): void;
        static create<T extends ReactiveObject<T>>(object: T, field: keyof T): FieldBinding;
    }
}
declare module "https://friendlyted.github.io/ezVZ/core/binding/ObjectBindings.ts" {
    import { FieldBinding } from "https://friendlyted.github.io/ezVZ/core/binding/FieldBinding.ts";
    import { ReactiveObject } from "https://friendlyted.github.io/ezVZ/core/reactive/ReactiveObject.ts";
    export class ObjectBindings<T extends ReactiveObject<T>> {
        bindings: Map<string, FieldBinding>;
        private constructor();
        get(name: string): FieldBinding;
        static selectedFields<T extends ReactiveObject<T>>(data: T, ...keys: (keyof T)[]): ObjectBindings<T>;
        static allFields<T extends ReactiveObject<T>>(data: T): ObjectBindings<T>;
        static custom<T extends ReactiveObject<T>>(data: T, ...bindingProviders: (readonly [keyof T, (data: T, F: keyof T) => FieldBinding])[]): ObjectBindings<T>;
    }
}
declare module "https://friendlyted.github.io/ezVZ/core/component/instance/BackRefInstance.ts" {
    import { Destroyable } from "https://friendlyted.github.io/ezVZ/core/component/instance/Destroyable.ts";
    import { FieldBinding } from "https://friendlyted.github.io/ezVZ/core/binding/FieldBinding.ts";
    export class BackRefInstance implements Destroyable {
        private readonly fieldBinding;
        constructor(fieldBinding: FieldBinding, targetNode: Element);
        destroy(): void;
    }
}
declare module "https://friendlyted.github.io/ezVZ/core/component/definition/BackRefDefinition.ts" {
    import { ObjectBindings } from "https://friendlyted.github.io/ezVZ/core/binding/ObjectBindings.ts";
    import { BackRefInstance } from "https://friendlyted.github.io/ezVZ/core/component/instance/BackRefInstance.ts";
    /**
     * Обеспечивает связь вложенных компонент из тегов с переменной модели.
     */
    export class BackRefDefinition {
        private readonly nodePath;
        private readonly bindingName;
        constructor(nodePath: number[], bindingName: string);
        createInstance(instanceRoot: Element, bindings: ObjectBindings<never>): BackRefInstance;
    }
}
declare module "https://friendlyted.github.io/ezVZ/core/component/TextChunk.ts" {
    import { ObjectBindings } from "https://friendlyted.github.io/ezVZ/core/binding/ObjectBindings.ts";
    export interface TextChunk {
        getValue(bindings: ObjectBindings<never>): string;
    }
    export class ConstTextChunk implements TextChunk {
        private readonly value;
        constructor(value: string);
        getValue(bindings: ObjectBindings<never>): string;
    }
    export class VariableTextChunk implements TextChunk {
        private readonly varName;
        constructor(varName: string);
        getValue(bindings: ObjectBindings<never>): string;
    }
    export class FunctionTextChunk implements TextChunk {
        private readonly fnName;
        private readonly fnParams;
        constructor(fnName: string, fnParams: string[]);
        getValue(bindings: ObjectBindings<never>): string;
    }
}
declare module "https://friendlyted.github.io/ezVZ/core/component/instance/NodeUpdaterInstance.ts" {
    import { Destroyable } from "https://friendlyted.github.io/ezVZ/core/component/instance/Destroyable.ts";
    import { ObjectBindings } from "https://friendlyted.github.io/ezVZ/core/binding/ObjectBindings.ts";
    import { TextChunk } from "https://friendlyted.github.io/ezVZ/core/component/TextChunk.ts";
    export class NodeUpdaterInstance implements Destroyable {
        private readonly targetNode;
        private readonly binding;
        private readonly textChunks;
        private readonly dependencies;
        private updateScheduled;
        constructor(targetNode: Node, bindings: ObjectBindings<never>, textChunks: TextChunk[], triggeredBy: string[]);
        private update;
        scheduleUpdate(): void;
        private scheduleUpdateWithMicros;
        private scheduleUpdateBeforeFrame;
        destroy(): void;
    }
}
declare module "https://friendlyted.github.io/ezVZ/core/component/definition/NodeUpdaterDefinition.ts" {
    import { NodeUpdaterInstance } from "https://friendlyted.github.io/ezVZ/core/component/instance/NodeUpdaterInstance.ts";
    import { TextChunk } from "https://friendlyted.github.io/ezVZ/core/component/TextChunk.ts";
    import { ObjectBindings } from "https://friendlyted.github.io/ezVZ/core/binding/ObjectBindings.ts";
    export class NodeUpdaterDefinition {
        private readonly nodePath;
        private readonly textChunks;
        private readonly attribute;
        private readonly triggeredBy;
        constructor(nodePath: number[], textChunks: TextChunk[], triggeredBy: string[], attribute?: string);
        createInstance(instanceRoot: Element, bindings: ObjectBindings<never>): NodeUpdaterInstance;
    }
}
declare module "https://friendlyted.github.io/ezVZ/core/component/instance/InputInstance.ts" {
    import { Destroyable } from "https://friendlyted.github.io/ezVZ/core/component/instance/Destroyable.ts";
    import { FieldBinding } from "https://friendlyted.github.io/ezVZ/core/binding/FieldBinding.ts";
    export class InputInstance implements Destroyable {
        private readonly targetNode;
        private readonly eventType;
        private readonly listener;
        constructor(targetNode: Node, eventType: string, binding: FieldBinding);
        destroy(): void;
    }
}
declare module "https://friendlyted.github.io/ezVZ/core/component/definition/InputDefinition.ts" {
    import { ObjectBindings } from "https://friendlyted.github.io/ezVZ/core/binding/ObjectBindings.ts";
    import { InputInstance } from "https://friendlyted.github.io/ezVZ/core/component/instance/InputInstance.ts";
    export class InputDefinition {
        private readonly nodePath;
        private readonly eventType;
        private readonly bindingName;
        constructor(nodePath: number[], eventType: string, bindingName: string);
        createInstance(instanceRoot: Element, bindings: ObjectBindings<never>): InputInstance;
    }
}
declare module "https://friendlyted.github.io/ezVZ/core/component/instance/ComponentInstance.ts" {
    import { Destroyable } from "https://friendlyted.github.io/ezVZ/core/component/instance/Destroyable.ts";
    export class ComponentInstance implements Destroyable {
        private readonly rootElement;
        private readonly dependencies;
        constructor(rootElement: Element, ...dependencies: Destroyable[]);
        attachToContainer(domContainer: ParentNode): void;
        replaceElement(element: Element): void;
        detach(): void;
        destroy(): void;
    }
}
declare module "https://friendlyted.github.io/ezVZ/core/component/definition/ComponentModel.ts" {
    import { ReactiveObject } from "https://friendlyted.github.io/ezVZ/core/reactive/ReactiveObject.ts";
    export abstract class ComponentModel {
        abstract modelName(): string;
        reactive(): this & ReactiveObject<this>;
    }
}
declare module "https://friendlyted.github.io/ezVZ/core/parser/VariableParser.ts" {
    export class VariableParser {
        static readonly VAR_REGEX: RegExp;
        static parse<T>(text: string, constProvider: (text: string) => T, dataProvider: (varName: string) => T, fnProvider: (fnName: string, fnParams: string[]) => T): T[];
    }
}
declare module "https://friendlyted.github.io/ezVZ/core/parser/TemplateAnalyzer.ts" {
    import { NodeUpdaterDefinition } from "https://friendlyted.github.io/ezVZ/core/component/definition/NodeUpdaterDefinition.ts";
    import { TemplateAnalyzeResult } from "https://friendlyted.github.io/ezVZ/core/parser/TemplateAnalyzeResult.ts";
    import { TextChunk } from "https://friendlyted.github.io/ezVZ/core/component/TextChunk.ts";
    import { ComponentDefinitionRegister } from "https://friendlyted.github.io/ezVZ/core/component/definition/ComponentDefinitionRegister.ts";
    export class TemplateAnalyzer {
        private static MOUSE_EVENTS;
        private static KB_EVENTS;
        private static TOUCH_EVENTS;
        private static EVENTS;
        private static readonly BINDING_PATTERN;
        private readonly componentRegister;
        constructor(componentRegister: ComponentDefinitionRegister);
        analyzeNode(element: Element, currentPath?: number[]): TemplateAnalyzeResult;
        analyzeTextNode(textNode: Text, currentPath: number[]): NodeUpdaterDefinition;
        analyzeAttributes(element: Element, currentPath: number[]): TemplateAnalyzeResult;
        analyzeAttribute(attr: Attr, currentPath: number[]): NodeUpdaterDefinition;
        analyzeValuedText(text: string): [TextChunk[], string[]];
    }
}
declare module "https://friendlyted.github.io/ezVZ/core/component/definition/ComponentDefinitionRegister.ts" {
    import { ComponentDefinition } from "https://friendlyted.github.io/ezVZ/core/component/definition/ComponentDefinition.ts";
    import { ComponentModel } from "https://friendlyted.github.io/ezVZ/core/component/definition/ComponentModel.ts";
    import { ObjectBindings } from "https://friendlyted.github.io/ezVZ/core/binding/ObjectBindings.ts";
    import { ComponentInstance } from "https://friendlyted.github.io/ezVZ/core/component/instance/ComponentInstance.ts";
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
        private components;
        private readonly analyzer;
        constructor();
        register(input: ComponentDefinitionRegisterInput): void;
        createComponent(data: ComponentModel): ComponentInstance;
        getComponent(value: ComponentModel | string): ComponentDefinitionRegisterEntry;
        private static parseSvg;
        private static parseTemplate;
    }
}
declare module "https://friendlyted.github.io/ezVZ/core/component/definition/SubComponentDefinition.ts" {
    import { ObjectBindings } from "https://friendlyted.github.io/ezVZ/core/binding/ObjectBindings.ts";
    import { ComponentInstance } from "https://friendlyted.github.io/ezVZ/core/component/instance/ComponentInstance.ts";
    import { ComponentDefinitionRegister } from "https://friendlyted.github.io/ezVZ/core/component/definition/ComponentDefinitionRegister.ts";
    export class SubComponentDefinition {
        private readonly nodePath;
        private readonly bindingName;
        private readonly componentRegister;
        constructor(nodePath: number[], bindingName: string, componentRegister: ComponentDefinitionRegister);
        createInstance(instanceRoot: Element, bindings: ObjectBindings<never>): ComponentInstance[];
        createListElement(data: any, container: ParentNode): ComponentInstance;
    }
}
declare module "https://friendlyted.github.io/ezVZ/core/parser/TemplateAnalyzeResult.ts" {
    import { NodeUpdaterDefinition } from "https://friendlyted.github.io/ezVZ/core/component/definition/NodeUpdaterDefinition.ts";
    import { InputDefinition } from "https://friendlyted.github.io/ezVZ/core/component/definition/InputDefinition.ts";
    import { SubComponentDefinition } from "https://friendlyted.github.io/ezVZ/core/component/definition/SubComponentDefinition.ts";
    import { BackRefDefinition } from "https://friendlyted.github.io/ezVZ/core/component/definition/BackRefDefinition.ts";
    export interface TemplateAnalyzeResult {
        nodeUpdaters: NodeUpdaterDefinition[];
        nodeInputs: InputDefinition[];
        nodeSubs?: SubComponentDefinition[];
        backrefs?: BackRefDefinition[];
    }
}
declare module "https://friendlyted.github.io/ezVZ/core/component/definition/ComponentDefinition.ts" {
    import { TemplateAnalyzeResult } from "https://friendlyted.github.io/ezVZ/core/parser/TemplateAnalyzeResult.ts";
    import { ObjectBindings } from "https://friendlyted.github.io/ezVZ/core/binding/ObjectBindings.ts";
    import { Destroyable } from "https://friendlyted.github.io/ezVZ/core/component/instance/Destroyable.ts";
    import { ComponentInstance } from "https://friendlyted.github.io/ezVZ/core/component/instance/ComponentInstance.ts";
    import { ReactiveObject } from "https://friendlyted.github.io/ezVZ/core/reactive/ReactiveObject.ts";
    export class ComponentDefinition {
        private readonly templateRoot;
        private readonly templateInfo;
        constructor(templateRoot: Element, templateInfo: TemplateAnalyzeResult);
        private cleanupFtdData;
        private cleanupAttributes;
        createInstance<T extends ReactiveObject<T>>(bindings: ObjectBindings<T>, resources?: Destroyable[]): ComponentInstance;
    }
}
declare module "https://friendlyted.github.io/ezVZ/core/reactive/Utils.ts" {
    export function hash(value: any): any;
    export function equals<T extends any>(a: T, b: T): boolean;
}
declare module "https://friendlyted.github.io/ezVZ/core/reactive/ReactiveArray.ts" {
    import { Destroyable } from "https://friendlyted.github.io/ezVZ/core/component/instance/Destroyable.ts";
    export interface InsertListener<T> {
        (index: number, value: T): void;
    }
    export interface DeleteListener {
        (index: number): void;
    }
    export interface ReplaceListener {
        (oldIndex: number, newIndex: number): void;
    }
    export interface ReactiveArray<T> extends Array<T> {
        $__addInsertListener(l: InsertListener<T>): Destroyable;
        $__addDeleteListener(l: DeleteListener): Destroyable;
        $__addReplaceListener(l: ReplaceListener): Destroyable;
        $__hash(): number;
        $__isManaged(): boolean;
    }
}
declare module "https://friendlyted.github.io/ezVZ/core/reactive/ArrayHandler.ts" {
    import { DeleteListener, InsertListener, ReactiveArray, ReplaceListener } from "https://friendlyted.github.io/ezVZ/core/reactive/ReactiveArray.ts";
    type AttrKey = string | number | symbol;
    export function reactiveArray<T extends object>(source?: T[]): T[] & ReactiveArray<T>;
    export class ArrayHandler<T> implements ProxyHandler<T[]> {
        private readonly replaceListeners;
        private readonly insertListeners;
        private readonly deleteListeners;
        static create<T>(source?: T[]): ReactiveArray<T>;
        private constructor();
        get(target: T[], prop: AttrKey, receiver: any): any;
        set(target: T[], prop: AttrKey, value: any): boolean;
        deleteProperty(target: T[], prop: AttrKey): boolean;
        isManaged(target: T[]): () => boolean;
        hash(target: T[]): () => any;
        shift(target: T[]): () => T;
        unshift(target: T[]): (value: T) => number;
        splice(target: T[], receiver: any): (start: number, deleteCount: number, ...items: T[]) => T[];
        addInsertListener(target: T[]): (l: InsertListener<T>) => () => void;
        addDeleteListener(target: T[]): (l: DeleteListener) => () => void;
        addReplaceListener(target: T[]): (l: ReplaceListener) => () => void;
        private static addListener;
    }
}
declare module "https://friendlyted.github.io/ezVZ/core/reactive/ObjectHandler.ts" {
    import { AttributeListener, AttrKey, ReactiveObject } from "https://friendlyted.github.io/ezVZ/core/reactive/ReactiveObject.ts";
    import { Destroyable } from "https://friendlyted.github.io/ezVZ/core/component/instance/Destroyable.ts";
    export function createReactiveVoid(): ReactiveObject<{}>;
    export function reactiveObject<T extends object>(source?: T, rawFields?: (keyof T)[]): T & ReactiveObject<T>;
    export class ObjectHandler<T extends object> implements ProxyHandler<T> {
        private readonly attributeListeners;
        private readonly rawFields;
        static create<T extends object>(source?: T, rawFields?: (keyof T)[]): T & ReactiveObject<T>;
        private constructor();
        set(target: T, key: AttrKey, newValue: any): boolean;
        get(target: T, key: AttrKey, receiver: any): any;
        triggerUpdate(target: T): (key: AttrKey) => void;
        addFieldListener(target: T): (attributeName: keyof T, listener: AttributeListener) => Destroyable;
        removeFieldListener(target: T): (attributeName: keyof T, listener: AttributeListener) => void;
        merge(target: T): (other: T) => void;
        isManaged(target: T): () => boolean;
        hash(target: T): () => any;
    }
}
