import {ReactiveObject} from "../../reactive/ReactiveObject.ts";
import {reactiveObject} from "../../reactive/ObjectHandler.ts";

export abstract class ComponentModel {
    protected constructor(
        private readonly _modelName: string
    ) {
        return this.reactive();
    }

    modelName() {
        return this._modelName;
    }

    reactive(): this & ReactiveObject<this> {
        return reactiveObject(this);
    }
}