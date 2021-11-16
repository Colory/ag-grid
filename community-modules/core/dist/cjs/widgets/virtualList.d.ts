// Type definitions for @ag-grid-community/core v26.2.0
// Project: http://www.ag-grid.com/
// Definitions by: Niall Crosby <https://github.com/ag-grid/>
import { Component } from './component';
import { TabGuardComp } from './tabGuardComp';
export interface VirtualListModel {
    getRowCount(): number;
    getRow(index: number): any;
    isRowSelected?(index: number): boolean | undefined;
}
export declare class VirtualList extends TabGuardComp {
    private readonly cssIdentifier;
    private readonly ariaRole;
    private listName?;
    private model;
    private renderedRows;
    private componentCreator;
    private rowHeight;
    private lastFocusedRowIndex;
    private isDestroyed;
    private readonly resizeObserverService;
    private readonly focusService;
    private readonly eContainer;
    constructor(cssIdentifier?: string, ariaRole?: string, listName?: string | undefined);
    private postConstruct;
    private setAriaProperties;
    private addResizeObserver;
    protected focusInnerElement(fromBottom: boolean): void;
    protected onFocusIn(e: FocusEvent): boolean;
    protected onFocusOut(e: FocusEvent): boolean;
    protected handleKeyDown(e: KeyboardEvent): void;
    protected onTabKeyDown(e: KeyboardEvent): void;
    private navigate;
    getLastFocusedRow(): number | null;
    focusRow(rowNumber: number): void;
    getComponentAt(rowIndex: number): Component | undefined;
    private static getTemplate;
    private getItemHeight;
    ensureIndexVisible(index: number): void;
    setComponentCreator(componentCreator: (value: any, listItemElement: HTMLElement) => Component): void;
    getRowHeight(): number;
    getScrollTop(): number;
    setRowHeight(rowHeight: number): void;
    refresh(): void;
    private clearVirtualRows;
    private drawVirtualRows;
    private ensureRowsRendered;
    private insertRow;
    private removeRow;
    private addScrollListener;
    setModel(model: VirtualListModel): void;
    destroy(): void;
}