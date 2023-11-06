import { RequestEventBase } from "@builder.io/qwik-city";
import exp from "constants";

export type RunResult = {
    type: string;
    success: boolean;
    data: any;
};

export type Passes = string[]

export type Query = {
    description: string;
    framework: string;
    components: string;
    component?: {
        name: string;
        description: string;
        code: string;
    };
    json?: string;
    // icons: string;
};

export type RunOptions = {
    query: Query;   
    stream: TransformStream<string, string>['writable'];
    pipeline: Pipeline
}

export type RunFunction = (options: RunOptions, req?: RequestEventBase) => Promise<RunResult>;

export type ExecutionPass ={index: number, response: RunResult}

export type Pipeline = {
    passes: Record<string, ExecutionPass>;
    stages: Record<string, Omit<RunResult, 'type'>>;
};
