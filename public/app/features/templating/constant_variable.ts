import { Variable, assignModelProperties, variableTypes, VariableBase } from './variable';

export class ConstantVariable extends VariableBase implements Variable {
  query: string;
  options: any[];
  current: any;
  skipUrlSync: boolean;

  defaults = {
    type: 'constant',
    name: '',
    hide: 2,
    label: '',
    query: '',
    current: {},
    options: [],
    skipUrlSync: false,
    globalModel: null,
  };

  /** @ngInject */
  constructor(private model, private variableSrv) {
    super();
    assignModelProperties(this, model, this.defaults);
  }

  getSaveModel() {
    if (this.globalModel) {
      this.globalModel.current = this.current;
      return this.globalModel;
    }

    assignModelProperties(this.model, this, this.defaults);
    return this.model;
  }

  setValue(option) {
    this.variableSrv.setOptionAsCurrent(this, option);
  }

  updateOptions() {
    this.options = [{ text: this.query.trim(), value: this.query.trim() }];
    this.setValue(this.options[0]);
    return Promise.resolve();
  }

  dependsOn(variable) {
    return false;
  }

  setValueFromUrl(urlValue) {
    return this.variableSrv.setOptionFromUrl(this, urlValue);
  }

  getValueForUrl() {
    return this.current.value;
  }
}

variableTypes['constant'] = {
  name: 'Constant',
  ctor: ConstantVariable,
  description: 'Define a hidden constant variable, useful for metric prefixes in dashboards you want to share',
};
