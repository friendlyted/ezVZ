import {FieldBinding} from "./FieldBinding.ts";
import {ReactiveObject} from "../reactive/ReactiveObject.ts";

export class ObjectBindings<T extends ReactiveObject<T>> {
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

    static selectedFields<T extends ReactiveObject<T>>(data: T, ...keys: (keyof T)[]): ObjectBindings<T> {
        const bindings = keys.map(key =>
            [String(key), FieldBinding.create<T>(data, key)] as const
        );
        return new ObjectBindings<T>(...bindings);
    }

    static allFields<T extends ReactiveObject<T>>(data: T): ObjectBindings<T> {
        const bindings = Object.keys(data).map(key =>
            [String(key), FieldBinding.create<T>(data, key as keyof T)] as const
        );
        return new ObjectBindings<T>(...bindings);
    }

    static custom<T extends ReactiveObject<T>>(
        data: T,
        ...bindingProviders: (readonly [keyof T, (data: T, F: keyof T) => FieldBinding])[]
    ): ObjectBindings<T> {
        const bindings = bindingProviders.map(([key, bindingProvider]) =>
            [String(key), bindingProvider.apply(data, key)] as const
        );
        return new ObjectBindings<T>(...bindings);
    }
}