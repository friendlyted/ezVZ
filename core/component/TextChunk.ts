import {ObjectBindings} from "../binding/ObjectBindings.ts";

export interface TextChunk {
    getValue(bindings: ObjectBindings<never>): string;
}

export class ConstTextChunk implements TextChunk {
    private readonly value: string;

    constructor(value: string) {
        this.value = value;
    }

    getValue(bindings: ObjectBindings<never>): string {
        return this.value;
    }
}

export class VariableTextChunk implements TextChunk {
    private readonly varName: string;

    constructor(varName: string) {
        this.varName = varName;
    }

    getValue(bindings: ObjectBindings<never>): string {
        return bindings.get(this.varName).getValue();
    }
}

export class FunctionTextChunk implements TextChunk {

    constructor(
        private readonly fnName: string,
        private readonly fnParams: string[]
    ) {
    }

    getValue(bindings: ObjectBindings<never>): string {
        const fn = bindings.get(this.fnName).getValue();
        if (typeof fn !== "function") {
            throw Error("Binding '" + this.fnName + "' is not a function");
        }

        const args = this.fnParams.map(p => bindings.get(p).getValue());
        return fn(...args);
    }
}