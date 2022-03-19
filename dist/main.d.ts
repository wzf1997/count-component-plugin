import { Compiler } from 'webpack';
interface CountType {
    [key: string]: number;
}
export declare class CountComponentPlugin {
    opts: {
        pathname: string;
        startCount: boolean;
        isExportExcel: boolean;
    };
    total: {
        len: number;
        components: CountType;
    };
    constructor(opts?: {});
    sort(obj: CountType): void;
    toExcel(): void;
    toLog(): void;
    apply(compiler: Compiler): void;
}
export {};
//# sourceMappingURL=main.d.ts.map