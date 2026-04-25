import {ReactiveObject} from "../../reactive/ReactiveObject.ts";

export interface ComponentModel {
    modelName(): string;
    reactive(): this & ReactiveObject<this>;
}