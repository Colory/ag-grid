// Type definitions for @ag-grid-community/core v26.2.0
// Project: http://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { GridApi } from "../gridApi";
import { ColumnApi } from "../columns/columnApi";
import { IComponent } from "./iComponent";
export interface StatusPanelDef {
    statusPanel?: {
        new (): IStatusPanelComp;
    } | string;
    statusPanelFramework?: any;
    align?: string;
    key?: string;
    statusPanelParams?: any;
}
export interface IStatusPanelParams {
    api: GridApi;
    columnApi: ColumnApi;
    /** The context as provided on `gridOptions.context` */
    context: any;
}
export interface IStatusPanel {
    /** If using a framework, returns the underlying component instance, so you can call methods
    * on it if you want. */
    getFrameworkComponentInstance?(): any;
}
export interface IStatusPanelComp extends IStatusPanel, IComponent<IStatusPanelParams> {
}