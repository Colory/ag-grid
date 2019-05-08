import {FilterModel, IDoesFilterPassParams} from "../../interfaces/iFilter";
import {RefSelector} from "../../widgets/componentAnnotations";
import {OptionsFactory} from "./optionsFactory";
import {AbstractProvidedFilter, IAbstractProvidedFilterParams} from "./abstractProvidedFilter";
import {_} from "../../utils";

export interface IAbstractSimpleFilterParams extends IAbstractProvidedFilterParams {
    suppressAndOrCondition: boolean;
}

export interface IAbstractSimpleModel extends FilterModel {
    type: string;
}

export interface ICombinedSimpleModel<M extends IAbstractSimpleModel> extends FilterModel {
    operator: string;
    condition1: M;
    condition2: M;
}

export enum FilterPosition {One, Two}

const DEFAULT_TRANSLATIONS: {[name: string]: string} = {
    loadingOoo:'Loading...',
    empty: 'Choose One',
    equals:'Equals',
    notEqual:'Not equal',
    lessThan:'Less than',
    greaterThan:'Greater than',
    inRange:'In range',
    lessThanOrEqual:'Less than or equals',
    greaterThanOrEqual:'Greater than or equals',
    filterOoo:'Filter...',
    contains:'Contains',
    notContains:'Not contains',
    startsWith: 'Starts with',
    endsWith: 'Ends with',
    searchOoo: 'Search...',
    selectAll: 'Select All',
    applyFilter: 'Apply Filter',
    clearFilter: 'Clear Filter',
    andCondition: 'AND',
    orCondition: 'OR'
};

/**
 * Every filter with a dropdown where the user can specify a comparing type against the filter values
 */
export abstract class AbstractSimpleFilter<M extends IAbstractSimpleModel> extends AbstractProvidedFilter {

    public static EMPTY = 'empty';
    public static EQUALS = 'equals';
    public static NOT_EQUAL = 'notEqual';
    public static LESS_THAN = 'lessThan';
    public static LESS_THAN_OR_EQUAL = 'lessThanOrEqual';
    public static GREATER_THAN = 'greaterThan';
    public static GREATER_THAN_OR_EQUAL = 'greaterThanOrEqual';
    public static IN_RANGE = 'inRange';

    public static CONTAINS = 'contains'; //1;
    public static NOT_CONTAINS = 'notContains'; //1;
    public static STARTS_WITH = 'startsWith'; //4;
    public static ENDS_WITH = 'endsWith'; //5;

    @RefSelector('eOptions1')
    private eType1: HTMLSelectElement;

    @RefSelector('eOptions2')
    private eType2: HTMLSelectElement;

    @RefSelector('eJoinOperatorAnd')
    private eJoinOperatorAnd: HTMLInputElement;

    @RefSelector('eJoinOperatorOr')
    private eJoinOperatorOr: HTMLInputElement;

    @RefSelector('eCondition2Body')
    private eCondition2Body: HTMLElement;

    @RefSelector('eJoinOperatorPanel')
    private eJoinOperatorPanel: HTMLElement;

    private allowTwoConditions: boolean;

    protected optionsFactory: OptionsFactory;

    private simpleFilterParams: IAbstractSimpleFilterParams;

    protected abstract getDefaultFilterOptions(): string[];

    protected abstract individualFilterPasses(params: IDoesFilterPassParams, type:IAbstractSimpleModel): boolean;
    protected abstract createValueTemplate(position: FilterPosition): string;
    protected abstract isFilterUiComplete(position: FilterPosition): boolean;
    protected abstract areSimpleModelsEqual(a: M, b: M): boolean;
    protected abstract getFilterType(): string;
    protected abstract setValueFromFloatingFilter(value: string): void;

    protected abstract createCondition(position: FilterPosition): M;

    protected abstract setConditionIntoUi(model: M, position: FilterPosition): void;

    protected showValueFrom(type: string): boolean {
        return !this.doesFilterHaveHiddenInput(type) && type !== AbstractSimpleFilter.EMPTY;
    }

    protected showValueTo(type: string): boolean {
        return type === AbstractSimpleFilter.IN_RANGE;
    }

    public onFloatingFilterChanged(type: string, value: any): void {
        this.setValueFromFloatingFilter(value);
        this.setTypeFromFloatingFilter(type);
        this.onUiChanged(true);
    }

    protected setTypeFromFloatingFilter(type: string): void {
        this.eType1.value = type;
        this.eType2.value = null;
        this.eJoinOperatorAnd.checked = true;
    }

    protected getModelFromUi(): M | ICombinedSimpleModel<M> {
        if (!this.isFilterUiComplete(FilterPosition.One)) { return null; }

        if (this.isAllowTwoConditions() && this.isFilterUiComplete(FilterPosition.Two)) {
            const res: ICombinedSimpleModel<M> = {
                filterType: this.getFilterType(),
                operator: this.getJoinOperator(),
                condition1: this.createCondition(FilterPosition.One),
                condition2: this.createCondition(FilterPosition.Two)
            };
            return res;
        } else {
            const res: M = this.createCondition(FilterPosition.One);
            return res;
        }
    }

    protected getType1(): string {
        return this.eType1.value;
    }

    protected getType2(): string {
        return this.eType2.value;
    }

    protected getJoinOperator(): string {
        return this.eJoinOperatorOr.checked ? 'OR' : 'AND';
    }

    protected areModelsEqual(a: M | ICombinedSimpleModel<M>, b: M | ICombinedSimpleModel<M>): boolean {
        // both are missing
        if (!a && !b) { return true; }

        // one is missing, other present
        if ((!a && b) || (a && !b)) { return false; }

        // one is combined, the other is not
        const aIsSimple = !(<any>a).operator;
        const bIsSimple = !(<any>b).operator;
        const oneSimpleOneCombined = (!aIsSimple && bIsSimple) || (aIsSimple && !bIsSimple);
        if (oneSimpleOneCombined) { return false; }

        let res: boolean;

        // otherwise both present, so compare
        if (aIsSimple) {
            const aSimple = <M> a;
            const bSimple = <M> b;

            res = this.areSimpleModelsEqual(aSimple, bSimple);
        } else {
            const aCombined = <ICombinedSimpleModel<M>> a;
            const bCombined = <ICombinedSimpleModel<M>> b;

            res = aCombined.operator === bCombined.operator
                && this.areSimpleModelsEqual(aCombined.condition1, bCombined.condition1)
                && this.areSimpleModelsEqual(aCombined.condition2, bCombined.condition2);
        }

        return res;
    }

    protected setModelIntoUi(model: IAbstractSimpleModel | ICombinedSimpleModel<M>): void {

        const isCombined = (<any>model).operator;

        if (isCombined) {
            const combinedModel = <ICombinedSimpleModel<M>> model;

            const orChecked = combinedModel.operator === 'OR';
            this.eJoinOperatorAnd.checked = !orChecked;
            this.eJoinOperatorOr.checked = orChecked;

            this.eType1.value = combinedModel.condition1.type;
            this.eType2.value = combinedModel.condition2.type;

            this.setConditionIntoUi(combinedModel.condition1, FilterPosition.One);
            this.setConditionIntoUi(combinedModel.condition2, FilterPosition.Two);

        } else {
            const simpleModel = <IAbstractSimpleModel> model;

            this.eJoinOperatorAnd.checked = true;
            this.eJoinOperatorOr.checked = false;

            this.eType1.value = simpleModel.type;
            this.eType2.value = this.optionsFactory.getDefaultOption();

            this.setConditionIntoUi(<M>simpleModel, FilterPosition.One);
            this.setConditionIntoUi(null, FilterPosition.Two);
        }

    }

    public doesFilterPass(params: IDoesFilterPassParams): boolean {
        const model = this.getModel();

        const isCombined = (<any>model).operator;

        if (isCombined) {
            const combinedModel = <ICombinedSimpleModel<M>> model;

            const firstResult = this.individualFilterPasses(params, combinedModel.condition1);
            const secondResult = this.individualFilterPasses(params, combinedModel.condition2);

            if (combinedModel.operator === 'AND') {
                return firstResult && secondResult;
            } else {
                return firstResult || secondResult;
            }

        } else {
            const simpleModel = <IAbstractSimpleModel> model;
            const result = this.individualFilterPasses(params, simpleModel);
            return result;
        }
    }

    protected setParams(params: IAbstractSimpleFilterParams): void {
        super.setParams(params);

        this.simpleFilterParams = params;

        this.optionsFactory = new OptionsFactory();
        this.optionsFactory.init(params, this.getDefaultFilterOptions());

        this.allowTwoConditions = !params.suppressAndOrCondition;

        this.putOptionsIntoDropdown();
        this.addChangedListeners();
    }

    private putOptionsIntoDropdown(): void {
        const filterOptions = this.optionsFactory.getFilterOptions();

        filterOptions.forEach( option => {
            const createOption = ()=> {
                const key = (typeof option === 'string') ? option : option.displayKey;
                const localName = this.translate(key);

                const eOption = document.createElement(`option`);
                eOption.text = localName;
                eOption.value = key;

                return eOption;
            };
            this.eType1.add(createOption());
            this.eType2.add(createOption());
        });

        const readOnly = filterOptions.length <= 1;
        this.eType1.disabled = readOnly;
        this.eType2.disabled = readOnly;
    }

    public isAllowTwoConditions(): boolean {
        return this.allowTwoConditions;
    }

    protected createBodyTemplate(): string {
        const optionsTemplate1 = `<select class="ag-filter-select" ref="eOptions1"></select>`;
        const valueTemplate1 = this.createValueTemplate(FilterPosition.One);

        const optionsTemplate2 = `<select class="ag-filter-select" ref="eOptions2"></select>`;
        const valueTemplate2 = this.createValueTemplate(FilterPosition.Two);

        const uniqueGroupId = 'ag-simple-filter-and-or-' + this.getCompId();

        const translate = this.gridOptionsWrapper.getLocaleTextFunc();

        const andOrTemplate =
            `<div class="ag-filter-condition" ref="eJoinOperatorPanel">
                    <label>
                        <input ref="eJoinOperatorAnd" type="radio" class="and" name="${uniqueGroupId}" value="AND")} checked="checked" />
                        ${translate('andCondition','AND')}
                    </label>
                    <label>
                        <input ref="eJoinOperatorOr" type="radio" class="or" name="${uniqueGroupId}" value="OR" />
                        ${translate('orCondition', 'OR')}
                    </label>
                </div>`;

        const template =
               `${optionsTemplate1}
                ${valueTemplate1}
                ${andOrTemplate}
                ${optionsTemplate2}
                ${valueTemplate2}`;

        return template;
    }

    protected updateUiVisibility(): void {
        const showSecondFilter = this.allowTwoConditions && this.isFilterUiComplete(FilterPosition.One);
        _.setVisible(this.eCondition2Body, showSecondFilter);
        _.setVisible(this.eType2, showSecondFilter);
        _.setVisible(this.eJoinOperatorPanel, showSecondFilter);
    }

    protected resetUiToDefaults(): void {
        this.eJoinOperatorAnd.checked = true;

        const defaultOption = this.optionsFactory.getDefaultOption();
        this.eType1.value = defaultOption;
        this.eType2.value = defaultOption;
    }

    public translate(toTranslate: string): string {
        const translate = this.gridOptionsWrapper.getLocaleTextFunc();

        let defaultTranslation = DEFAULT_TRANSLATIONS[toTranslate];

        if (!defaultTranslation && this.optionsFactory.getCustomOption(toTranslate)) {
            defaultTranslation = this.optionsFactory.getCustomOption(toTranslate).displayName;
        }

        return translate(toTranslate, defaultTranslation);
    }

    public addChangedListeners() {
        const listener = ()=> this.onUiChanged();
        this.addDestroyableEventListener(this.eType1, "change", listener);
        this.addDestroyableEventListener(this.eType2, "change", listener);
        this.addDestroyableEventListener(this.eJoinOperatorOr, "change", listener);
        this.addDestroyableEventListener(this.eJoinOperatorAnd, "change", listener);
    }

    protected doesFilterHaveHiddenInput(filterType: string) {
        const customFilterOption = this.optionsFactory.getCustomOption(filterType);
        return customFilterOption && customFilterOption.hideFilterInput;
    }

}
