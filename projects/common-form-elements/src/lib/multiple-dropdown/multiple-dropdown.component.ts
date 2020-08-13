import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {FormControl} from '@angular/forms';
import {from, Subject} from 'rxjs';
import {FieldConfigOption, FieldConfigOptionsBuilder} from '../common-form-config';
import {takeUntil, tap} from 'rxjs/operators';
@Component({
  selector: 'sb-multiple-dropdown',
  templateUrl: './multiple-dropdown.component.html',
  styleUrls: ['./multiple-dropdown.component.css']
})
export class MultipleDropdownComponent implements OnInit, OnChanges, OnDestroy {
  @Input() disabled?: boolean;
  @Input() options: any;
  @Input() label?: string;
  @Input() placeHolder?: string;
  @Input() isMultiple?: boolean;
  @Input() context?: FormControl;
  @Input() formControlRef?: FormControl;
  @Input() default?: any;
  @Input() contextData: any;
  @Input() dataLoadStatusDelegate: Subject<'LOADING' | 'LOADED'>;
  showModal = false;
  tempValue: any;
  resolvedOptions: FieldConfigOption<any>[] = [];
  optionValueToOptionLabelMap = new Map();
  private dispose$ = new Subject<undefined>();
  constructor() {
  }
  ngOnInit() {
    if (this.context) {
      this.context.valueChanges.pipe(
        tap(() => {
          this.formControlRef.patchValue(null);
          this.setupOptions();
        }),
        takeUntil(this.dispose$)
      ).subscribe();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['options'] || !changes['options'].currentValue) {
      return;
    }
    this.setupOptions();
  }
  private setupOptions() {
    if (!this.options) {
      this.options = [];
    }
    if (this.isOptionsArray()) {
      this.resolvedOptions = this.options;
    } else if (this.isOptionsMap()) {
      this.resolvedOptions = (this.context && this.context.value)  ? this.options[this.context.value] : this.context.value;
    } else if (this.isOptionsClosure()) {
      from((this.options as FieldConfigOptionsBuilder<any>)(
        this.formControlRef,
        this.context,
        () => this.dataLoadStatusDelegate.next('LOADING'),
        () => this.dataLoadStatusDelegate.next('LOADED')
      )).pipe(
        tap((options) => this.resolvedOptions = options),
        takeUntil(this.dispose$)
      ).subscribe();
    }
    this.resolvedOptions.forEach((option) => {
      this.optionValueToOptionLabelMap.set(option.value, option.label);
    });
    this.tempValue = this.default ? this.default : this.tempValue;
  }
  openModal() {
    this.showModal = true;
  }
  onSubmit() {
    this.formControlRef.patchValue(this.tempValue);
    this.formControlRef.markAsDirty();
    this.showModal = !this.showModal;
  }
  onCancel() {
    this.formControlRef.markAsDirty();
    this.showModal = false;
  }
  addSelected(option: FieldConfigOption<any>) {
    if (this.isMultiple) {
      if (Array.isArray(this.tempValue)) {
        if (this.tempValue.includes(option.value)) {
          this.tempValue = this.tempValue.splice(this.tempValue.indexOf(option.value), 1);
        } else {
          this.tempValue = [
            ...this.tempValue,
            option.value
          ];
        }
      } else {
        this.tempValue = [option.value];
      }
    } else {
      this.tempValue = option.value;
    }
  }
  private isOptionsArray() {
    return Array.isArray(this.options);
  }
  private isOptionsClosure() {
    return typeof this.options === 'function';
  }
  private isOptionsMap() {
    return !Array.isArray(this.options) && typeof this.options === 'object';
  }
  ngOnDestroy(): void {
    this.dispose$.next(null);
    this.dispose$.complete();
  }
}