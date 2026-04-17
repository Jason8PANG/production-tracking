declare module 'sql.js' {
  export interface SqlJsStatic {
    Database: new (data?: ArrayLike<number> | Buffer | null) => Database;
  }

  export interface Database {
    run(sql: string, params?: any[]): void;
    exec(sql: string): QueryExecResult[];
    each(sql: string, callback: (row: any) => void, done: () => void): void;
    prepare(sql: string): Statement;
    export(): Uint8Array;
    close(): void;
  }

  export interface Statement {
    bind(params?: any[]): boolean;
    step(): boolean;
    getAsObject(): any;
    get(): any[];
    free(): boolean;
    reset(): void;
    run(params?: any[]): void;
  }

  export interface QueryExecResult {
    columns: string[];
    values: any[][];
  }

  function initSqlJs(options?: { locateFile?: (file: string) => string }): Promise<SqlJsStatic>;
  export default initSqlJs;
}
