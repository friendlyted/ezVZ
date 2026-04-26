import {ComponentModel} from "../../core/component/definition/ComponentModel.ts";
import {COMPONENTS} from "./Components.ts";

const TEMPLATE = `
    <li class="menu_item">{{name}}</li>
`;

export class MenuItemModel extends ComponentModel {
    public static NAME = "menuItem";

    public constructor(
        public name: String
    ) {
        super(MenuItemModel.NAME);
    }
}

COMPONENTS.register({
    modelName: MenuItemModel.NAME,
    template: TEMPLATE
})