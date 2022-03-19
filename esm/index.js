import fs from 'fs';
import { toExcel } from 'to-excel';
import chalk from 'chalk';

class CountComponentPlugin {
    constructor(opts = {}) {
        this.opts = Object.assign({ startCount: true, isExportExcel: false, pathname: '' }, opts);
        this.total = {
            len: 0,
            components: {}
        };
    }
    sort(obj) {
        this.total.components = Object.fromEntries(Object.entries(obj).sort(([, a], [, b]) => b - a));
    }
    toExcel() {
        const arr = [];
        Object.keys(this.total.components).forEach((key, index) => {
            const value = this.total.components[key];
            const data = {
                id: index + 1,
                component: key,
                count: value,
            };
            arr.push(data);
        });
        const headers = [
            { label: '名次', field: 'id' },
            { label: '组件', field: 'component' },
            { label: '次数', field: 'count' },
        ];
        const content = toExcel.exportXLS(headers, arr, 'filename');
        fs.writeFileSync('filename.xls', content);
    }
    toLog() {
        this.sort(this.total.components);
        Object.keys(this.total.components).forEach(key => {
            const value = this.total.components[key];
            const per = Number((value / this.total.len).toPrecision(3)) * 100;
            console.log(`\n${chalk.blue(key)} 组件引用次数 ${chalk.green(value)} 引用率 ${chalk.redBright(per)}%`);
        });
        console.log(`\n组件${chalk.blue('总共')}引用次数 ${chalk.green(this.total.len)}`);
    }
    apply(compiler) {
        const parser = (factory) => {
            if (!this.opts.startCount) {
                return;
            }
            factory.hooks.parser.for('javascript/auto').tap('count-webpack-plugin', (parser) => {
                parser.hooks.importSpecifier.tap('count-webpack-plugin', (_statement, source, _exportName, identifierName) => {
                    if (source.includes(this.opts.pathname)) {
                        this.total.len = this.total.len + 1;
                        const key = identifierName;
                        this.total.components[key] = this.total.components[key]
                            ? this.total.components[key] + 1
                            : 1;
                    }
                });
            });
        };
        const done = () => {
            if (!this.opts.startCount) {
                return;
            }
            this.sort(this.total.components);
            if (this.opts.isExportExcel) {
                this.toExcel();
            }
            else {
                this.toLog();
            }
        };
        compiler.hooks.normalModuleFactory.tap('count-webpack-plugin', parser);
        compiler.hooks.done.tap('count-webpack-plugin-done', done);
    }
}

export { CountComponentPlugin };
