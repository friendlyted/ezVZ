import {Destroyable} from "./Destroyable.ts";
import {FieldBinding} from "../../binding/FieldBinding.ts";

export class InputInstance implements Destroyable {
    private readonly targetNode: Node;
    private readonly eventType: string;
    private readonly listener: (event: Event) => void;

    constructor(targetNode: Node, eventType: string, binding: FieldBinding) {
        this.targetNode = targetNode;
        this.eventType = eventType;
        this.listener = event => {
            const value = binding.getValue();
            if (typeof value === "function") {
                value(event);
                return;
            }

            if (event.type === "input") {
                const element = event.target as HTMLInputElement;
                binding.setValue(element.value);
            } else if (event.type === "keydown") {
                const inputEvent = (event as KeyboardEvent);
                binding.setValue(inputEvent.key);
            } else {
                binding.setValue(event);
            }
        }
        this.targetNode.addEventListener(eventType, this.listener, {passive: false});
    }

    destroy() {
        this.targetNode.removeEventListener(this.eventType, this.listener);
    }
}