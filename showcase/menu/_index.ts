import {COMPONENTS} from "./Components.ts";
import {MenuModel} from "./Menu.ts";
import {MenuItemModel} from "./MenuItem.ts";

export function main() {
    const menu = new MenuModel();

    const menuInstance = COMPONENTS.createComponent(menu);

    menu.items.push(
        new MenuItemModel("item1"),
        new MenuItemModel("item2"),
    )

    let root = document.getElementById("menu");
    root.innerHTML = "";
    menuInstance.attachToContainer(root);
}