import {Destroyable} from "../component/instance/Destroyable.ts";

export interface InsertListener<T> {
    (index: number, value: T): void
}

export interface DeleteListener {
    (index: number): void
}

export interface ReplaceListener {
    (oldIndex: number, newIndex: number): void
}

export interface ReactiveArray<T> extends Array<T> {
    $__addInsertListener(l: InsertListener<T>): Destroyable;

    $__addDeleteListener(l: DeleteListener): Destroyable;

    $__addReplaceListener(l: ReplaceListener): Destroyable;

    $__hash(): number;

    $__isManaged(): boolean;
}