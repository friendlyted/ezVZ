import {Destroyable} from "./Destroyable.ts";
import {FieldBinding} from "../../binding/FieldBinding.ts";

export class BackRefInstance implements Destroyable {

    private readonly fieldBinding: FieldBinding;

    constructor(fieldBinding: FieldBinding, targetNode: Element) {
        this.fieldBinding = fieldBinding;
        this.fieldBinding.setValue(targetNode);
    }

    destroy(): void {
        this.fieldBinding.setValue(null)
    }

}