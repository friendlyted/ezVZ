import {COMPONENTS} from "./menu/Components.ts";
import {MenuModel} from "./menu/Menu.ts";
import {MenuItemModel} from "./menu/MenuItem.ts";
import {ObjectBindings} from "../core/binding/ObjectBindings.ts";
import {reactiveObject} from "../core/reactive/ObjectHandler.ts";

export function main() {
    const menu = new MenuModel();
    let item1 = reactiveObject(new MenuItemModel("item1"));
    let items = reactiveObject(new MenuItemModel("item2"));
    menu.items.push(
        item1,
        items,
    )

    const reactiveModel = reactiveObject(menu);
    const bindings = ObjectBindings.allFields(reactiveModel);
    const menuComponent = COMPONENTS.getComponent(menu);
    const menuInstance = menuComponent.createInstance(bindings);

    menuInstance.attachToContainer(
        document.getElementById("app")
    );

}