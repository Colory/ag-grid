var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { _ } from "@ag-grid-community/core";
import { CategoryAxis, getChartTheme, themes, } from "ag-charts-community";
import { deepMerge } from "../object";
import { getChartThemeOverridesObjectName } from "../chartThemeOverridesMapper";
var ChartProxy = /** @class */ (function () {
    function ChartProxy(chartProxyParams) {
        this.chartProxyParams = chartProxyParams;
        this.chartType = chartProxyParams.chartType;
        this.crossFiltering = chartProxyParams.crossFiltering;
        this.crossFilterCallback = chartProxyParams.crossFilterCallback;
        this.standaloneChartType = getChartThemeOverridesObjectName(this.chartType);
        if (this.chartProxyParams.chartOptionsToRestore) {
            this.chartOptions = this.chartProxyParams.chartOptionsToRestore;
            this.chartTheme = getChartTheme({ overrides: this.chartOptions });
            return;
        }
        this.chartTheme = this.createChartTheme();
        this.chartOptions = this.convertConfigToOverrides(this.chartTheme.config);
    }
    ChartProxy.prototype.createChart = function () {
        var _this = this;
        if (this.chart) {
            this.destroyChart();
        }
        this.chart = this.create();
        if (this.crossFiltering) {
            // add event listener to chart canvas to detect when user wishes to reset filters
            var resetFilters_1 = true;
            this.chart.addEventListener('click', function (e) { return _this.crossFilterCallback(e, resetFilters_1); });
        }
    };
    ChartProxy.prototype.createChartTheme = function () {
        var _this = this;
        var themeName = this.getSelectedTheme();
        var stockTheme = this.isStockTheme(themeName);
        var gridOptionsThemeOverrides = this.chartProxyParams.getGridOptionsChartThemeOverrides();
        var apiThemeOverrides = this.chartProxyParams.apiChartThemeOverrides;
        if (gridOptionsThemeOverrides || apiThemeOverrides) {
            var themeOverrides_1 = {
                overrides: ChartProxy.mergeThemeOverrides(gridOptionsThemeOverrides, apiThemeOverrides)
            };
            var getCustomTheme = function () { return deepMerge(_this.lookupCustomChartTheme(themeName), themeOverrides_1); };
            return getChartTheme(stockTheme ? __assign({ baseTheme: themeName }, themeOverrides_1) : getCustomTheme());
        }
        return getChartTheme(stockTheme ? themeName : this.lookupCustomChartTheme(themeName));
    };
    ChartProxy.prototype.isStockTheme = function (themeName) {
        return _.includes(Object.keys(themes), themeName);
    };
    ChartProxy.prototype.getSelectedTheme = function () {
        var chartThemeName = this.chartProxyParams.getChartThemeName();
        var availableThemes = this.chartProxyParams.getChartThemes();
        if (!_.includes(availableThemes, chartThemeName)) {
            chartThemeName = availableThemes[0];
        }
        return chartThemeName;
    };
    ChartProxy.prototype.lookupCustomChartTheme = function (name) {
        var customChartThemes = this.chartProxyParams.customChartThemes;
        var customChartTheme = customChartThemes && customChartThemes[name];
        if (!customChartTheme) {
            console.warn("AG Grid: no stock theme exists with the name '" + name + "' and no " +
                "custom chart theme with that name was supplied to 'customChartThemes'");
        }
        return customChartTheme;
    };
    ChartProxy.mergeThemeOverrides = function (gridOptionsThemeOverrides, apiThemeOverrides) {
        if (!gridOptionsThemeOverrides) {
            return apiThemeOverrides;
        }
        if (!apiThemeOverrides) {
            return gridOptionsThemeOverrides;
        }
        return deepMerge(gridOptionsThemeOverrides, apiThemeOverrides);
    };
    ChartProxy.prototype.downloadChart = function () {
        var chart = this.chart;
        var fileName = chart.title ? chart.title.text : 'chart';
        chart.scene.download(fileName);
    };
    ChartProxy.prototype.getChartImageDataURL = function (type) {
        return this.chart.scene.getDataURL(type);
    };
    ChartProxy.prototype.getChartOptions = function () {
        return this.chartOptions;
    };
    ChartProxy.prototype.getChart = function () {
        return this.chart;
    };
    ChartProxy.prototype.transformData = function (data, categoryKey) {
        if (this.chart.axes.filter(function (a) { return a instanceof CategoryAxis; }).length < 1) {
            return data;
        }
        // replace the values for the selected category with a complex object to allow for duplicated categories
        return data.map(function (d, index) {
            var value = d[categoryKey];
            var valueString = value && value.toString ? value.toString() : '';
            var datum = __assign({}, d);
            datum[categoryKey] = { id: index, value: value, toString: function () { return valueString; } };
            return datum;
        });
    };
    ChartProxy.prototype.convertConfigToOverrides = function (config) {
        var _a;
        var chartOverrides = deepMerge({}, config[this.standaloneChartType]);
        chartOverrides.series = chartOverrides.series[this.standaloneChartType];
        // special handing to add the scatter paired mode to the chart options
        if (this.standaloneChartType === 'scatter') {
            chartOverrides.paired = true;
        }
        return _a = {}, _a[this.standaloneChartType] = chartOverrides, _a;
    };
    ChartProxy.prototype.destroy = function () {
        this.destroyChart();
    };
    ChartProxy.prototype.destroyChart = function () {
        if (this.chart) {
            this.chart.destroy();
            this.chart = undefined;
        }
    };
    return ChartProxy;
}());
export { ChartProxy };