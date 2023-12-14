import type { KVNamespace } from "@cloudflare/workers-types";

export let namespace: KVNamespace;

export function getKV() {
  return namespace;
}

export function setKV(ns: KVNamespace) {
  namespace = ns;
}

type Project = {
  description: string;
  lastUpdate: string;
  code: string;
  author: string;
};

export async function getProject(key: string): Promise<Project | null> {
  return JSON.parse((await namespace.get(key)) ?? "null");
}

export async function addProject(key: string, project: Project) {
  const hasProject = !!(await namespace.get(key));
  if (hasProject) {
    return null;
  }
  return namespace.put(key, JSON.stringify(project));
}

export async function updateProject(
  key: string,
  description: string,
  code: string
) {
  const project = await namespace.get(key);
  if (project === null) {
    return null;
  }
  const parsed = JSON.parse(project) as Project;
  parsed.code = code;
  parsed.lastUpdate = description;
  return namespace.put(key, JSON.stringify(parsed));
}

export async function forkProject(key: string, author: string) {
  const project = await namespace.get(key);
  if (project === null) {
    return null;
  }
  const parsed = JSON.parse(project) as Project;
  parsed.author = author;

  const newKey = crypto.randomUUID();
  await namespace.put(newKey, JSON.stringify(parsed));
  return newKey;
}
