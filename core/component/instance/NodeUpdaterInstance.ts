import {Destroyable} from "./Destroyable.ts";
import {ObjectBindings} from "../../binding/ObjectBindings.ts";
import {ReactiveObject} from "../../reactive/ReactiveObject.ts";
import {TextChunk} from "../TextChunk.ts";

export class NodeUpdaterInstance implements Destroyable {
    private readonly targetNode: Node;
    private readonly binding: ObjectBindings<never>;
    private readonly textChunks: TextChunk[];
    private readonly dependencies: Destroyable[] = [];
    // Если в одном текстовом куске изменились "одновременно" несколько переменных,
    // не надо планировать обновление несколько раз
    private updateScheduled = false;

    public constructor(targetNode: Node, bindings: ObjectBindings<never>, textChunks: TextChunk[], triggeredBy: string[]) {
        this.targetNode = targetNode;
        this.binding = bindings;
        this.textChunks = textChunks;

        for (let varName of triggeredBy) {
            const listenerRegistration = bindings.get(varName).addChangeListener(() => this.scheduleUpdate());
            this.dependencies.push(listenerRegistration);
            this.scheduleUpdate();
        }
    }

    private update(): void {
        const newValue = this.textChunks.map(tch => tch.getValue(this.binding)).join("");
        if (this.targetNode.textContent !== newValue) {
            this.targetNode.textContent = newValue;
        }
        this.updateScheduled = false;
    }

    scheduleUpdate() {
        if (!this.updateScheduled) {
            this.updateScheduled = true;
            this.scheduleUpdateWithMicros();
        }
    }

    private scheduleUpdateWithMicros() {
        queueMicrotask(() => this.update());
    }

    private scheduleUpdateBeforeFrame() {
        requestAnimationFrame(() => this.update());
    }

    destroy(): void {
        for (let dep of this.dependencies) {
            dep.destroy();
        }
    }
}
