import {ComponentModel} from "../../core/component/definition/ComponentModel.ts";
import {COMPONENTS} from "./Components.ts";
import {MenuItemModel} from "./MenuItem.ts";
import {ArrayHandler} from "../../core/reactive/ArrayHandler.ts";
import {ReactiveObject} from "../../core/reactive/ReactiveObject.ts";
import {ObjectBindings} from "../../core/binding/ObjectBindings.ts";

const TEMPLATE = `
    <ul class="menu" ftd:list_data="items" />
`;

export type ReactiveMenuModel = MenuModel & ReactiveObject<MenuModel>;

export class MenuModel implements ComponentModel {
    public static NAME = "menu";

    public constructor(
        public readonly items: MenuItemModel[] = ArrayHandler.create([]),
    ) {
    }

    modelName(): string {
        return MenuModel.NAME;
    }
}

COMPONENTS.register({
    modelName: MenuModel.NAME,
    template: TEMPLATE
})