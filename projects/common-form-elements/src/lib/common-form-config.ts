import {Observable} from 'rxjs';
import {AsyncValidatorFn, FormControl} from '@angular/forms';
import {QueryList} from '@angular/core';

export enum FieldConfigInputType {
  INPUT = 'input',
  CHECKBOX = 'checkbox',
  SELECT = 'select',
  LABEL = 'label',
  TEXTAREA = 'textarea',
  NESTED_SELECT = 'nested_select',
  NESTED_GROUP = 'nested_group'
}

export enum FieldConfigValidationType {
  REQUIRED = 'required',
  MAXLENGTH = 'maxLength',
  REQUIRED_TRUE = 'required_true',
  MINLENGTH = 'minLength',
  PATTERN = 'pattern'
}

export type FieldConfigOptionsBuilder<T> =
  (control: FormControl, context?: FormControl, notifyLoading?: () => void, notifyLoaded?: () => void) => Observable<FieldConfigOption<T>[]> | Promise<FieldConfigOption<T>[]>;
export type AsyncValidatorFactory = (marker: string, triggers: QueryList<HTMLElement>) => AsyncValidatorFn;
export interface FieldConfigOption<T> {
  label: string;
  value: T;
  extras?: T;
}
export interface FieldConfigOptionAssociations<T> {
  [key: string]: FieldConfigOption<T>[];
}
export interface FieldConfig<T> {
  code: string;
  type: FieldConfigInputType;
  default?: any;
  context?: string;
  children?: { [key: string]: FieldConfig<T>[] };
  templateOptions: {
    type?: string,
    label?: string,
    placeHolder?: string,
    prefix?: string,
    multiple?: boolean,
    hidden?: boolean,
    disabled?: boolean,
    options?: FieldConfigOption<T>[] | FieldConfigOptionsBuilder<T> | FieldConfigOptionAssociations<T>,
    labelHtml?: {
      contents: string,
      values: { [key: string]: string }
    }
  };
  validations?: {
    type: FieldConfigValidationType,
    value?: string | boolean | number | RegExp,
    message?: string
  }[];
  asyncValidation?: { marker: string, trigger?: string };
}
