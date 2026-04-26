import {FieldBinding} from "./FieldBinding.ts";
import {ReactiveObject} from "../reactive/ReactiveObject.ts";

export class ObjectBindings {
    bindings: Map<string, FieldBinding> = new Map();

    private constructor(...values: (readonly [string, FieldBinding])[]) {
        values.forEach(([name, binding]) =>
            this.bindings.set(name, binding)
        );
    }

    public has(name: string): boolean {
        return this.bindings.has(name);
    }

    public get(name: string): FieldBinding {
        if (!this.has(name)) {
            throw new Error(`There is no bindings for name '${name}'`)
        }
        return this.bindings.get(name);
    }

    public add(name: string, binding: FieldBinding) {
        this.bindings.set(name, binding);
    }

    static selectedFields<T extends ReactiveObject<T>>(data: T, ...keys: (keyof T)[]): ObjectBindings {
        const bindings = keys.map(key =>
            [String(key), FieldBinding.create<T>(data, key)] as const
        );
        return new ObjectBindings(...bindings);
    }

    static allFields<T extends ReactiveObject<T>>(data: T): ObjectBindings {
        const bindings = Object.keys(data).map(key =>
            [String(key), FieldBinding.create<T>(data, key as keyof T)] as const
        );
        return new ObjectBindings(...bindings);
    }

    static custom<T>(
        data: T,
        ...bindingProviders: (readonly [string, (data: T, field: string) => FieldBinding])[]
    ): ObjectBindings {
        const bindings = bindingProviders.map(([key, bindingProvider]) =>
            [String(key), bindingProvider.apply(data, key)] as const
        );
        return new ObjectBindings(...bindings);
    }
}