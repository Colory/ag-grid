/**
 * @ag-grid-enterprise/status-bar - Advanced Data Grid / Data Table supporting Javascript / React / AngularJS / Web Components * @version v26.0.1
 * @link http://www.ag-grid.com/
' * @license Commercial
 */

import { Bean, BeanStub, AgPromise, Autowired, RefSelector, PostConstruct, Component, Events, _, Optional, ModuleNames } from '@ag-grid-community/core';
import { EnterpriseCoreModule } from '@ag-grid-enterprise/core';

var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var StatusBarService = /** @class */ (function (_super) {
    __extends(StatusBarService, _super);
    // tslint:disable-next-line
    function StatusBarService() {
        var _this = _super.call(this) || this;
        _this.allComponents = {};
        return _this;
    }
    StatusBarService.prototype.registerStatusPanel = function (key, component) {
        this.allComponents[key] = component;
    };
    StatusBarService.prototype.getStatusPanel = function (key) {
        return this.allComponents[key];
    };
    StatusBarService = __decorate([
        Bean('statusBarService')
    ], StatusBarService);
    return StatusBarService;
}(BeanStub));

var __extends$1 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$1 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var StatusBar = /** @class */ (function (_super) {
    __extends$1(StatusBar, _super);
    function StatusBar() {
        return _super.call(this, StatusBar.TEMPLATE) || this;
    }
    StatusBar.prototype.postConstruct = function () {
        if (this.gridOptions.statusBar && this.gridOptions.statusBar.statusPanels) {
            var leftStatusPanelComponents = this.gridOptions.statusBar.statusPanels
                .filter(function (componentConfig) { return componentConfig.align === 'left'; });
            this.createAndRenderComponents(leftStatusPanelComponents, this.eStatusBarLeft);
            var centerStatusPanelComponents = this.gridOptions.statusBar.statusPanels
                .filter(function (componentConfig) { return componentConfig.align === 'center'; });
            this.createAndRenderComponents(centerStatusPanelComponents, this.eStatusBarCenter);
            var rightStatusPanelComponents = this.gridOptions.statusBar.statusPanels
                .filter(function (componentConfig) { return (!componentConfig.align || componentConfig.align === 'right'); });
            this.createAndRenderComponents(rightStatusPanelComponents, this.eStatusBarRight);
        }
        else {
            this.setDisplayed(false);
        }
    };
    StatusBar.prototype.createAndRenderComponents = function (statusBarComponents, ePanelComponent) {
        var _this = this;
        var componentDetails = [];
        statusBarComponents.forEach(function (componentConfig) {
            var params = {
                api: _this.gridOptionsWrapper.getApi(),
                columnApi: _this.gridOptionsWrapper.getColumnApi(),
                context: _this.gridOptionsWrapper.getContext()
            };
            var promise = _this.userComponentFactory.newStatusPanelComponent(componentConfig, params);
            if (!promise) {
                return;
            }
            componentDetails.push({
                // default to the component name if no key supplied
                key: componentConfig.key || componentConfig.statusPanel,
                promise: promise
            });
        });
        AgPromise.all(componentDetails.map(function (details) { return details.promise; }))
            .then(function () {
            componentDetails.forEach(function (componentDetail) {
                componentDetail.promise.then(function (component) {
                    var destroyFunc = function () {
                        _this.getContext().destroyBean(component);
                    };
                    if (_this.isAlive()) {
                        _this.statusBarService.registerStatusPanel(componentDetail.key, component);
                        ePanelComponent.appendChild(component.getGui());
                        _this.addDestroyFunc(destroyFunc);
                    }
                    else {
                        destroyFunc();
                    }
                });
            });
        });
    };
    StatusBar.TEMPLATE = "<div class=\"ag-status-bar\">\n            <div ref=\"eStatusBarLeft\" class=\"ag-status-bar-left\"></div>\n            <div ref=\"eStatusBarCenter\" class=\"ag-status-bar-center\"></div>\n            <div ref=\"eStatusBarRight\" class=\"ag-status-bar-right\"></div>\n        </div>";
    __decorate$1([
        Autowired('gridOptions')
    ], StatusBar.prototype, "gridOptions", void 0);
    __decorate$1([
        Autowired('userComponentFactory')
    ], StatusBar.prototype, "userComponentFactory", void 0);
    __decorate$1([
        Autowired('statusBarService')
    ], StatusBar.prototype, "statusBarService", void 0);
    __decorate$1([
        RefSelector('eStatusBarLeft')
    ], StatusBar.prototype, "eStatusBarLeft", void 0);
    __decorate$1([
        RefSelector('eStatusBarCenter')
    ], StatusBar.prototype, "eStatusBarCenter", void 0);
    __decorate$1([
        RefSelector('eStatusBarRight')
    ], StatusBar.prototype, "eStatusBarRight", void 0);
    __decorate$1([
        PostConstruct
    ], StatusBar.prototype, "postConstruct", null);
    return StatusBar;
}(Component));

var __extends$2 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$2 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var NameValueComp = /** @class */ (function (_super) {
    __extends$2(NameValueComp, _super);
    function NameValueComp() {
        return _super.call(this, NameValueComp.TEMPLATE) || this;
    }
    NameValueComp.prototype.setLabel = function (key, defaultValue) {
        // we want to hide until the first value comes in
        this.setDisplayed(false);
        var localeTextFunc = this.gridOptionsWrapper.getLocaleTextFunc();
        this.eLabel.innerHTML = localeTextFunc(key, defaultValue);
    };
    NameValueComp.prototype.setValue = function (value) {
        this.eValue.innerHTML = value;
    };
    NameValueComp.TEMPLATE = "<div class=\"ag-status-name-value\">\n            <span ref=\"eLabel\"></span>:&nbsp;\n            <span ref=\"eValue\" class=\"ag-status-name-value-value\"></span>\n        </div>";
    __decorate$2([
        RefSelector('eLabel')
    ], NameValueComp.prototype, "eLabel", void 0);
    __decorate$2([
        RefSelector('eValue')
    ], NameValueComp.prototype, "eValue", void 0);
    return NameValueComp;
}(Component));

var __extends$3 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$3 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TotalAndFilteredRowsComp = /** @class */ (function (_super) {
    __extends$3(TotalAndFilteredRowsComp, _super);
    function TotalAndFilteredRowsComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TotalAndFilteredRowsComp.prototype.postConstruct = function () {
        // this component is only really useful with client side row model
        if (this.gridApi.getModel().getType() !== 'clientSide') {
            console.warn("AG Grid: agTotalAndFilteredRowCountComponent should only be used with the client side row model.");
            return;
        }
        this.setLabel('totalAndFilteredRows', 'Rows');
        this.addCssClass('ag-status-panel');
        this.addCssClass('ag-status-panel-total-and-filtered-row-count');
        this.setDisplayed(true);
        this.addManagedListener(this.eventService, Events.EVENT_MODEL_UPDATED, this.onDataChanged.bind(this));
    };
    TotalAndFilteredRowsComp.prototype.onDataChanged = function () {
        var rowCount = _.formatNumberCommas(this.getFilteredRowCountValue());
        var totalRowCount = _.formatNumberCommas(this.getTotalRowCount());
        if (rowCount === totalRowCount) {
            this.setValue(rowCount);
        }
        else {
            var localeTextFunc = this.gridOptionsWrapper.getLocaleTextFunc();
            this.setValue(rowCount + " " + localeTextFunc('of', 'of') + " " + totalRowCount);
        }
    };
    TotalAndFilteredRowsComp.prototype.getFilteredRowCountValue = function () {
        var filteredRowCount = 0;
        this.gridApi.forEachNodeAfterFilter(function (node) {
            if (!node.group) {
                filteredRowCount++;
            }
        });
        return filteredRowCount;
    };
    TotalAndFilteredRowsComp.prototype.getTotalRowCount = function () {
        var totalRowCount = 0;
        this.gridApi.forEachNode(function (node) {
            if (!node.group) {
                totalRowCount++;
            }
        });
        return totalRowCount;
    };
    TotalAndFilteredRowsComp.prototype.init = function () { };
    // this is a user component, and IComponent has "public destroy()" as part of the interface.
    // so we need to override destroy() just to make the method public.
    TotalAndFilteredRowsComp.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    __decorate$3([
        Autowired('gridApi')
    ], TotalAndFilteredRowsComp.prototype, "gridApi", void 0);
    __decorate$3([
        PostConstruct
    ], TotalAndFilteredRowsComp.prototype, "postConstruct", null);
    return TotalAndFilteredRowsComp;
}(NameValueComp));

var __extends$4 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$4 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var FilteredRowsComp = /** @class */ (function (_super) {
    __extends$4(FilteredRowsComp, _super);
    function FilteredRowsComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FilteredRowsComp.prototype.postConstruct = function () {
        this.setLabel('filteredRows', 'Filtered');
        // this component is only really useful with client side row model
        if (this.gridApi.getModel().getType() !== 'clientSide') {
            console.warn("AG Grid: agFilteredRowCountComponent should only be used with the client side row model.");
            return;
        }
        this.addCssClass('ag-status-panel');
        this.addCssClass('ag-status-panel-filtered-row-count');
        this.setDisplayed(true);
        var listener = this.onDataChanged.bind(this);
        this.addManagedListener(this.eventService, Events.EVENT_MODEL_UPDATED, listener);
    };
    FilteredRowsComp.prototype.onDataChanged = function () {
        var totalRowCountValue = this.getTotalRowCountValue();
        var filteredRowCountValue = this.getFilteredRowCountValue();
        this.setValue(_.formatNumberCommas(filteredRowCountValue));
        this.setDisplayed(totalRowCountValue !== filteredRowCountValue);
    };
    FilteredRowsComp.prototype.getTotalRowCountValue = function () {
        var totalRowCount = 0;
        this.gridApi.forEachNode(function (node) { return totalRowCount += 1; });
        return totalRowCount;
    };
    FilteredRowsComp.prototype.getFilteredRowCountValue = function () {
        var filteredRowCount = 0;
        this.gridApi.forEachNodeAfterFilter(function (node) {
            if (!node.group) {
                filteredRowCount += 1;
            }
        });
        return filteredRowCount;
    };
    FilteredRowsComp.prototype.init = function () { };
    // this is a user component, and IComponent has "public destroy()" as part of the interface.
    // so we need to override destroy() just to make the method public.
    FilteredRowsComp.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    __decorate$4([
        Autowired('gridApi')
    ], FilteredRowsComp.prototype, "gridApi", void 0);
    __decorate$4([
        PostConstruct
    ], FilteredRowsComp.prototype, "postConstruct", null);
    return FilteredRowsComp;
}(NameValueComp));

var __extends$5 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$5 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TotalRowsComp = /** @class */ (function (_super) {
    __extends$5(TotalRowsComp, _super);
    function TotalRowsComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TotalRowsComp.prototype.postConstruct = function () {
        this.setLabel('totalRows', 'Total Rows');
        // this component is only really useful with client side row model
        if (this.gridApi.getModel().getType() !== 'clientSide') {
            console.warn("AG Grid: agTotalRowCountComponent should only be used with the client side row model.");
            return;
        }
        this.addCssClass('ag-status-panel');
        this.addCssClass('ag-status-panel-total-row-count');
        this.setDisplayed(true);
        this.addManagedListener(this.eventService, Events.EVENT_MODEL_UPDATED, this.onDataChanged.bind(this));
    };
    TotalRowsComp.prototype.onDataChanged = function () {
        this.setValue(_.formatNumberCommas(this.getRowCountValue()));
    };
    TotalRowsComp.prototype.getRowCountValue = function () {
        var totalRowCount = 0;
        this.gridApi.forEachLeafNode(function (node) { return totalRowCount += 1; });
        return totalRowCount;
    };
    TotalRowsComp.prototype.init = function () {
    };
    // this is a user component, and IComponent has "public destroy()" as part of the interface.
    // so we need to override destroy() just to make the method public.
    TotalRowsComp.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    __decorate$5([
        Autowired('gridApi')
    ], TotalRowsComp.prototype, "gridApi", void 0);
    __decorate$5([
        PostConstruct
    ], TotalRowsComp.prototype, "postConstruct", null);
    return TotalRowsComp;
}(NameValueComp));

var __extends$6 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$6 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SelectedRowsComp = /** @class */ (function (_super) {
    __extends$6(SelectedRowsComp, _super);
    function SelectedRowsComp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SelectedRowsComp.prototype.postConstruct = function () {
        if (!this.isValidRowModel()) {
            console.warn("AG Grid: agSelectedRowCountComponent should only be used with the client and server side row model.");
            return;
        }
        this.setLabel('selectedRows', 'Selected');
        this.addCssClass('ag-status-panel');
        this.addCssClass('ag-status-panel-selected-row-count');
        var selectedRowCount = this.gridApi.getSelectedRows().length;
        this.setValue(_.formatNumberCommas(selectedRowCount));
        this.setDisplayed(selectedRowCount > 0);
        var eventListener = this.onRowSelectionChanged.bind(this);
        this.addManagedListener(this.eventService, Events.EVENT_MODEL_UPDATED, eventListener);
        this.addManagedListener(this.eventService, Events.EVENT_SELECTION_CHANGED, eventListener);
    };
    SelectedRowsComp.prototype.isValidRowModel = function () {
        // this component is only really useful with client or server side rowmodels
        var rowModelType = this.gridApi.getModel().getType();
        return rowModelType === 'clientSide' || rowModelType === 'serverSide';
    };
    SelectedRowsComp.prototype.onRowSelectionChanged = function () {
        var selectedRowCount = this.gridApi.getSelectedRows().length;
        this.setValue(_.formatNumberCommas(selectedRowCount));
        this.setDisplayed(selectedRowCount > 0);
    };
    SelectedRowsComp.prototype.init = function () {
    };
    // this is a user component, and IComponent has "public destroy()" as part of the interface.
    // so we need to override destroy() just to make the method public.
    SelectedRowsComp.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    __decorate$6([
        Autowired('gridApi')
    ], SelectedRowsComp.prototype, "gridApi", void 0);
    __decorate$6([
        PostConstruct
    ], SelectedRowsComp.prototype, "postConstruct", null);
    return SelectedRowsComp;
}(NameValueComp));

var __extends$7 = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate$7 = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AggregationComp = /** @class */ (function (_super) {
    __extends$7(AggregationComp, _super);
    function AggregationComp() {
        return _super.call(this, AggregationComp.TEMPLATE) || this;
    }
    // this is a user component, and IComponent has "public destroy()" as part of the interface.
    // so we need to override destroy() just to make the method public.
    AggregationComp.prototype.destroy = function () {
        _super.prototype.destroy.call(this);
    };
    AggregationComp.prototype.postConstruct = function () {
        if (!this.isValidRowModel()) {
            console.warn("AG Grid: agAggregationComponent should only be used with the client and server side row model.");
            return;
        }
        this.avgAggregationComp.setLabel('avg', 'Average');
        this.countAggregationComp.setLabel('count', 'Count');
        this.minAggregationComp.setLabel('min', 'Min');
        this.maxAggregationComp.setLabel('max', 'Max');
        this.sumAggregationComp.setLabel('sum', 'Sum');
        this.addManagedListener(this.eventService, Events.EVENT_RANGE_SELECTION_CHANGED, this.onRangeSelectionChanged.bind(this));
        this.addManagedListener(this.eventService, Events.EVENT_MODEL_UPDATED, this.onRangeSelectionChanged.bind(this));
    };
    AggregationComp.prototype.isValidRowModel = function () {
        // this component is only really useful with client or server side rowmodels
        var rowModelType = this.gridApi.getModel().getType();
        return rowModelType === 'clientSide' || rowModelType === 'serverSide';
    };
    AggregationComp.prototype.init = function () {
    };
    AggregationComp.prototype.setAggregationComponentValue = function (aggFuncName, value, visible) {
        var statusBarValueComponent = this.getAggregationValueComponent(aggFuncName);
        if (_.exists(statusBarValueComponent) && statusBarValueComponent) {
            statusBarValueComponent.setValue(_.formatNumberTwoDecimalPlacesAndCommas(value));
            statusBarValueComponent.setDisplayed(visible);
        }
    };
    AggregationComp.prototype.getAggregationValueComponent = function (aggFuncName) {
        // converts user supplied agg name to our reference - eg: sum => sumAggregationComp
        var refComponentName = aggFuncName + "AggregationComp";
        // if the user has specified the agAggregationPanelComp but no aggFuncs we show the all
        // if the user has specified the agAggregationPanelComp and aggFuncs, then we only show the aggFuncs listed
        var statusBarValueComponent = null;
        var aggregationPanelConfig = _.exists(this.gridOptions.statusBar) && this.gridOptions.statusBar ? _.find(this.gridOptions.statusBar.statusPanels, function (panel) { return panel.statusPanel === 'agAggregationComponent'; }) : null;
        if (_.exists(aggregationPanelConfig) && aggregationPanelConfig) {
            // a little defensive here - if no statusPanelParams show it, if componentParams we also expect aggFuncs
            if (!_.exists(aggregationPanelConfig.statusPanelParams) ||
                (_.exists(aggregationPanelConfig.statusPanelParams) &&
                    _.exists(aggregationPanelConfig.statusPanelParams.aggFuncs) &&
                    _.exists(_.find(aggregationPanelConfig.statusPanelParams.aggFuncs, function (func) { return func === aggFuncName; })))) {
                statusBarValueComponent = this[refComponentName];
            }
        }
        else {
            // components not specified - assume we can show this component
            statusBarValueComponent = this[refComponentName];
        }
        // either we can't find it (which would indicate a typo or similar user side), or the user has deliberately
        // not listed the component in aggFuncs
        return statusBarValueComponent;
    };
    AggregationComp.prototype.onRangeSelectionChanged = function () {
        var _this = this;
        var cellRanges = this.rangeService ? this.rangeService.getCellRanges() : undefined;
        var sum = 0;
        var count = 0;
        var numberCount = 0;
        var min = null;
        var max = null;
        var cellsSoFar = {};
        if (cellRanges && !_.missingOrEmpty(cellRanges)) {
            cellRanges.forEach(function (cellRange) {
                var currentRow = _this.rangeService.getRangeStartRow(cellRange);
                var lastRow = _this.rangeService.getRangeEndRow(cellRange);
                while (true) {
                    var finishedAllRows = _.missing(currentRow) || !currentRow || _this.rowPositionUtils.before(lastRow, currentRow);
                    if (finishedAllRows || !currentRow || !cellRange.columns) {
                        break;
                    }
                    cellRange.columns.forEach(function (col) {
                        if (currentRow === null) {
                            return;
                        }
                        // we only want to include each cell once, in case a cell is in multiple ranges
                        var cellId = _this.cellPositionUtils.createId({
                            rowPinned: currentRow.rowPinned,
                            column: col,
                            rowIndex: currentRow.rowIndex
                        });
                        if (cellsSoFar[cellId]) {
                            return;
                        }
                        cellsSoFar[cellId] = true;
                        var rowNode = _this.rowRenderer.getRowNode(currentRow);
                        if (_.missing(rowNode)) {
                            return;
                        }
                        var value = _this.valueService.getValue(col, rowNode);
                        // if empty cell, skip it, doesn't impact count or anything
                        if (_.missing(value) || value === '') {
                            return;
                        }
                        // see if value is wrapped, can happen when doing count() or avg() functions
                        if (value.value) {
                            value = value.value;
                        }
                        if (typeof value === 'string') {
                            value = Number(value);
                        }
                        if (typeof value === 'number' && !isNaN(value)) {
                            sum += value;
                            if (max === null || value > max) {
                                max = value;
                            }
                            if (min === null || value < min) {
                                min = value;
                            }
                            numberCount++;
                        }
                        count++;
                    });
                    currentRow = _this.cellNavigationService.getRowBelow(currentRow);
                }
            });
        }
        var gotResult = count > 1;
        var gotNumberResult = numberCount > 1;
        // we show count even if no numbers
        this.setAggregationComponentValue('count', count, gotResult);
        // show if numbers found
        this.setAggregationComponentValue('sum', sum, gotNumberResult);
        this.setAggregationComponentValue('min', min, gotNumberResult);
        this.setAggregationComponentValue('max', max, gotNumberResult);
        this.setAggregationComponentValue('avg', (sum / numberCount), gotNumberResult);
    };
    AggregationComp.TEMPLATE = "<div class=\"ag-status-panel ag-status-panel-aggregations\">\n            <ag-name-value ref=\"avgAggregationComp\"></ag-name-value>\n            <ag-name-value ref=\"countAggregationComp\"></ag-name-value>\n            <ag-name-value ref=\"minAggregationComp\"></ag-name-value>\n            <ag-name-value ref=\"maxAggregationComp\"></ag-name-value>\n            <ag-name-value ref=\"sumAggregationComp\"></ag-name-value>\n        </div>";
    __decorate$7([
        Optional('rangeService')
    ], AggregationComp.prototype, "rangeService", void 0);
    __decorate$7([
        Autowired('valueService')
    ], AggregationComp.prototype, "valueService", void 0);
    __decorate$7([
        Autowired('cellNavigationService')
    ], AggregationComp.prototype, "cellNavigationService", void 0);
    __decorate$7([
        Autowired('rowRenderer')
    ], AggregationComp.prototype, "rowRenderer", void 0);
    __decorate$7([
        Autowired('gridOptions')
    ], AggregationComp.prototype, "gridOptions", void 0);
    __decorate$7([
        Autowired('gridApi')
    ], AggregationComp.prototype, "gridApi", void 0);
    __decorate$7([
        Autowired('cellPositionUtils')
    ], AggregationComp.prototype, "cellPositionUtils", void 0);
    __decorate$7([
        Autowired('rowPositionUtils')
    ], AggregationComp.prototype, "rowPositionUtils", void 0);
    __decorate$7([
        RefSelector('sumAggregationComp')
    ], AggregationComp.prototype, "sumAggregationComp", void 0);
    __decorate$7([
        RefSelector('countAggregationComp')
    ], AggregationComp.prototype, "countAggregationComp", void 0);
    __decorate$7([
        RefSelector('minAggregationComp')
    ], AggregationComp.prototype, "minAggregationComp", void 0);
    __decorate$7([
        RefSelector('maxAggregationComp')
    ], AggregationComp.prototype, "maxAggregationComp", void 0);
    __decorate$7([
        RefSelector('avgAggregationComp')
    ], AggregationComp.prototype, "avgAggregationComp", void 0);
    __decorate$7([
        PostConstruct
    ], AggregationComp.prototype, "postConstruct", null);
    return AggregationComp;
}(Component));

var StatusBarModule = {
    moduleName: ModuleNames.StatusBarModule,
    beans: [StatusBarService],
    agStackComponents: [
        { componentName: 'AgStatusBar', componentClass: StatusBar },
        { componentName: 'AgNameValue', componentClass: NameValueComp },
    ],
    userComponents: [
        { componentName: 'agAggregationComponent', componentClass: AggregationComp },
        { componentName: 'agSelectedRowCountComponent', componentClass: SelectedRowsComp },
        { componentName: 'agTotalRowCountComponent', componentClass: TotalRowsComp },
        { componentName: 'agFilteredRowCountComponent', componentClass: FilteredRowsComp },
        { componentName: 'agTotalAndFilteredRowCountComponent', componentClass: TotalAndFilteredRowsComp }
    ],
    dependantModules: [
        EnterpriseCoreModule
    ]
};

export { StatusBarModule };