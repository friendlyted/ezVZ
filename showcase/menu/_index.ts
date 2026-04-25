import {COMPONENTS} from "./Components.ts";
import {MenuModel} from "./Menu.ts";
import {MenuItemModel} from "./MenuItem.ts";

export function main() {
    const menu = new MenuModel().reactive();

    const menuInstance = COMPONENTS.createComponent(menu);

    menu.items.push(
        new MenuItemModel("item1").reactive(),
        new MenuItemModel("item2").reactive(),
    )

    let root = document.getElementById("menu");
    root.innerHTML = "";
    menuInstance.attachToContainer(root);

}