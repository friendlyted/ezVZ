import {ComponentModel} from "../../core/component/definition/ComponentModel.ts";
import {COMPONENTS} from "./Components.ts";
import {MenuItemModel} from "./MenuItem.ts";
import {reactiveArray} from "../../core/reactive/ArrayHandler.ts";

const TEMPLATE = `
    <ul class="menu" ftd:list="items" />
`;

export class MenuModel extends ComponentModel {
    public static NAME = "menu";

    public constructor(
        public readonly items: MenuItemModel[] = reactiveArray([]),
    ) {
        super(MenuModel.NAME);
    }
}

COMPONENTS.register({
    modelName: MenuModel.NAME,
    template: TEMPLATE
})