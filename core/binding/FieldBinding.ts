import {ReactiveObject} from "../reactive/ReactiveObject.ts";
import {Destroyable} from "../component/instance/Destroyable.ts";

export interface ChangeCallback {
    (): void;
}

export class FieldBinding {
    private readonly object: ReactiveObject<unknown>;
    private readonly field: any;

    private constructor(object: ReactiveObject<unknown>, field: any) {
        this.object = object;
        this.field = field;
    }

    addChangeListener(callback: ChangeCallback): Destroyable {
        return this.object.$__addFieldListener(this.field as never, callback);
    }

    getValue(): any {
        return this.object[this.field];
    }

    setValue(value: any) {
        (this.object as any)[this.field] = value;
    }

    static create<T extends ReactiveObject<T>>(object: T, field: keyof T): FieldBinding {
        return new FieldBinding(object, field);
    }
}
