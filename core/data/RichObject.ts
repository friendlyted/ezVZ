import {Destroyable} from "../component/instance/Destroyable.ts";

export type AttrKey = string | number | symbol;

export interface AttributeListener {
    (name: AttrKey, oldValue: any): void
}

export interface RichObject<T> {
    $__addFieldListener(attributeName: keyof T, listener: AttributeListener): Destroyable;

    $__removeFieldListener(attributeName: keyof T, listener: AttributeListener): void;

    $__merge(other: T): void;

    $__hash(): number;

    $__isManaged(): boolean;

    $__triggerUpdate(attributeName: keyof T): void;
}