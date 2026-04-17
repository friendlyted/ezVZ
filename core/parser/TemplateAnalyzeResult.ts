import {NodeUpdaterDefinition} from "../component/definition/NodeUpdaterDefinition.ts";
import {InputDefinition} from "../component/definition/InputDefinition.ts";
import {SubComponentDefinition} from "../component/definition/SubComponentDefinition.ts";
import {BackRefDefinition} from "../component/definition/BackRefDefinition.ts";

export interface TemplateAnalyzeResult {
    nodeUpdaters: NodeUpdaterDefinition[];
    nodeInputs: InputDefinition[];
    nodeSubs?: SubComponentDefinition[];
    backrefs?: BackRefDefinition[];
}
