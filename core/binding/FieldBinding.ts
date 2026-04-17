import {RichObject} from "../data/RichObject.ts";
import {Destroyable} from "../component/instance/Destroyable.ts";

export interface ChangeCallback {
    (): void;
}

export class FieldBinding {
    private readonly object: RichObject<unknown>;
    private readonly field: any;

    private constructor(object: RichObject<unknown>, field: any) {
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

    static create<T extends RichObject<T>>(object: T, field: keyof T): FieldBinding {
        return new FieldBinding(object, field);
    }
}
