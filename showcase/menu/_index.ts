import {COMPONENTS} from "./Components.ts";
import {MenuModel} from "./Menu.ts";
import {MenuItemModel} from "./MenuItem.ts";

export function main() {
    const menu = new MenuModel();

    const menuInstance = COMPONENTS.createComponent(menu);

    menu.items.push(
        new MenuItemModel("item1"),
        new MenuItemModel("item2"),
        new MenuItemModel("item3"),
        new MenuItemModel("item4"),
    )

    let root = document.getElementById("menu");
    root.innerHTML = "";
    menuInstance.attachToContainer(root);
    //
    // setTimeout(()=>{
    //     menu.items.shift()
    // }, 2000)


    setTimeout(()=>{
        menu.items.splice(2, 1)
    }, 2000)

    setTimeout(()=>{
        const item5 = new MenuItemModel("item5");
        menu.items.splice(1, 0, item5);
    }, 4000)
}