import {FieldBinding} from "./FieldBinding.ts";
import {RichObject} from "../data/RichObject.ts";

export class ObjectBindings<T extends RichObject<T>> {
    bindings: Map<string, FieldBinding> = new Map();

    private constructor(...values: (readonly [string, FieldBinding])[]) {
        values.forEach(([name, binding]) =>
            this.bindings.set(name, binding)
        );
    }

    public get(name: string): FieldBinding {
        if (!this.bindings.has(name)) {
            throw new Error(`There is no bindings for name '${name}'`)
        }
        return this.bindings.get(name);
    }

    static selectedFields<T extends RichObject<T>>(data: T, ...keys: (keyof T)[]): ObjectBindings<T> {
        const bindings = keys.map(key =>
            [String(key), FieldBinding.create<T>(data, key)] as const
        );
        return new ObjectBindings<T>(...bindings);
    }

    static allFields<T extends RichObject<T>>(data: T): ObjectBindings<T> {
        const bindings = Object.keys(data).map(key =>
            [String(key), FieldBinding.create<T>(data, key as keyof T)] as const
        );
        return new ObjectBindings<T>(...bindings);
    }

    static custom<T extends RichObject<T>>(
        data: T,
        ...bindingProviders: (readonly [keyof T, (data: T, F: keyof T) => FieldBinding])[]
    ): ObjectBindings<T> {
        const bindings = bindingProviders.map(([key, bindingProvider]) =>
            [String(key), bindingProvider.apply(data, key)] as const
        );
        return new ObjectBindings<T>(...bindings);
    }
}