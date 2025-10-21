import * as components from './components/index.ts'

import type { App, Plugin } from "vue";
import "./assets/iconfont2.js";
import "./assets/iconfont.js";

type name = keyof typeof components;

interface options {
    prefix?: string;
}

const install: Plugin["install"] = function (app: App, opts: options = {}) {

    const { prefix = "Ea" } = opts;
    const arr = Object.keys(components) as name[];
    arr.forEach((key) => app.component(prefix + key, components[key]));

};

export default {
    install,
    ...components
};

export * from './components/index.ts'
