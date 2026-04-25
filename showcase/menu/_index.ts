import {COMPONENTS} from "./Components.ts";
import {MenuModel} from "./Menu.ts";
import {MenuItemModel} from "./MenuItem.ts";
import {ObjectBindings} from "../../core/binding/ObjectBindings.ts";
import {reactiveObject} from "../../core/reactive/ObjectHandler.ts";

export function main() {
    const menu = reactiveObject(new MenuModel());

    const menuInstance = COMPONENTS.createComponent(menu);

    menu.items.push(
        reactiveObject(new MenuItemModel("item1")),
        reactiveObject(new MenuItemModel("item2")),
    )

    let root = document.getElementById("menu");
    root.innerHTML = "";
    menuInstance.attachToContainer(root);

}