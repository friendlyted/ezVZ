import {ReactiveObject} from "../../reactive/ReactiveObject.ts";
import {reactiveObject} from "../../reactive/ObjectHandler.ts";

export abstract class ComponentModel {
    abstract modelName(): string;

    reactive(): this & ReactiveObject<this> {
        return reactiveObject(this);
    }
}