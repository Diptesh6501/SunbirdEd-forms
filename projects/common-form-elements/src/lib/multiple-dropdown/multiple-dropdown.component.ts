import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable, Subject, Subscription} from 'rxjs';
import {FieldConfigOption, FieldConfigOptionsBuilder} from '../common-form-config';
import {tap} from 'rxjs/operators';


@Component({
  selector: 'sb-multiple-dropdown',
  templateUrl: './multiple-dropdown.component.html',
  styleUrls: ['./multiple-dropdown.component.css']
})
export class MultipleDropdownComponent implements OnInit, OnChanges {

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
  values = new Set<FieldConfigOption<any>>();
  showModal = false;
  showValues = false;
  valuesLabel = '';
  options$?: Observable<FieldConfigOption<any>[]>;
  contextValueChangesSubscription?: Subscription;
  optionsType: 'ARRAY' | 'CLOSURE' | 'MAP';

  constructor() {
  }

  ngOnInit() {
    if (this.context) {
      this.contextValueChangesSubscription = this.context.valueChanges.pipe(
        tap(() => {
          this.formControlRef.patchValue(null);
        })
      ).subscribe();
    }
    this.getDefaultValues();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['options'] || !changes['options'].currentValue) {
      return;
    }

    if (!this.options) {
      this.options = [];
    }

    if (this.isOptionsArray()) {
      this.optionsType = 'ARRAY';
    } else if (this.isOptionsMap()) {
      this.optionsType = 'MAP';
    } else if (this.isOptionsClosure()) {
      this.optionsType = 'CLOSURE';

      this.options$ = (this.options as FieldConfigOptionsBuilder<any>)(
        this.formControlRef,
        this.context,
        () => this.dataLoadStatusDelegate.next('LOADING'),
        () => this.dataLoadStatusDelegate.next('LOADED')
      ) as any;
    }
  }

  getDefaultValues() {
    if (Array.isArray(this.default) && this.isMultiple) {
      this.default.forEach((ele) => {
        this.values.add(ele);
      });
    } else if (this.default) {
      this.values.add(this.default);
    }
  }

  openModal() {
    this.showModal = true;
    this.showValues = false;
  }

  async addSelected(option: FieldConfigOption<any>) {
    if (this.values.has(option)) {
      this.values.delete(option);
    } else {
      if (!this.isMultiple) {
        this.values.clear();
      }
      this.values.add(option);
    }
    this.valuesLabel = Array.from(this.values).map((v) => v.label).join(', ');
  }

  onSubmit() {
    if (this.isMultiple) {
      this.formControlRef.patchValue(Array.from(this.values).map((v) => v.value));
    } else {
      this.formControlRef.patchValue((Array.from(this.values)[0] && Array.from(this.values)[0].value) || null);
    }
    this.showModal = !this.showModal;
    this.showValues = true;
    this.formControlRef.markAsDirty();
  }

  onCancel() {
    this.values.clear();
    if (this.isMultiple) {
      this.formControlRef.patchValue([]);
    } else {
      this.formControlRef.patchValue(null);
    }
    this.formControlRef.markAsDirty();
    this.showModal = false;
    this.showValues = false;
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
}
