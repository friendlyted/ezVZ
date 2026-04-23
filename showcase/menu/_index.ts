import {COMPONENTS} from "./Components.ts";
import {MenuModel} from "./Menu.ts";
import {MenuItemModel} from "./MenuItem.ts";
import {ObjectBindings} from "../../core/binding/ObjectBindings.ts";
import {reactiveObject} from "../../core/reactive/ObjectHandler.ts";

export function main() {
    const menu = reactiveObject(new MenuModel());

    menu.items.push(
        reactiveObject(new MenuItemModel("item1")),
        reactiveObject(new MenuItemModel("item2")),
    )

    const bindings = ObjectBindings.allFields(menu);
    const menuComponent = COMPONENTS.getComponent(menu);
    const menuInstance = menuComponent.createInstance(bindings);

    let root = document.getElementById("menu");
    root.innerHTML = "";
    menuInstance.attachToContainer(root);

}