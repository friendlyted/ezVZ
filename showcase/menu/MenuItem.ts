import {ComponentModel} from "../../core/component/definition/ComponentModel.ts";
import {COMPONENTS} from "./Components.ts";
import {ReactiveObject} from "../../core/reactive/ReactiveObject.ts";

const TEMPLATE = `
    <li class="menu_item">{{name}}</li>
`;

export type RichMenuItemModel = MenuItemModel & ReactiveObject<MenuItemModel>;

export class MenuItemModel extends ComponentModel {
    public static NAME = "menuItem";

    public constructor(
        public readonly name: String
    ) {
        super();
    }

    modelName(): string {
        return MenuItemModel.NAME;
    }
}

COMPONENTS.register({
    modelName: MenuItemModel.NAME,
    template: TEMPLATE
})