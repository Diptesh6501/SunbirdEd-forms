import { Component, OnInit, Input, SimpleChanges, OnChanges, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, Observable, Subject } from 'rxjs';
import { FieldConfigOption, FieldConfigOptionsBuilder, FieldConfigOptionAssociations } from '../common-form-config';
import { tap } from 'rxjs/operators';


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
  @ViewChild('checkBoxContainer') checkBoxContainer: ElementRef;
  showList = false;
  values = [];
  singleValue: any;
  showModal: boolean;
  showValues: Boolean = false;
  currentOptions: any;
  options$?: Observable<FieldConfigOption<any>[]>;
  contextValueChangesSubscription?: Subscription;
  constructor() {
  }

  ngOnInit() {
    this.getDefaultValues();
    if (this.context) {
      this.contextValueChangesSubscription = this.context.valueChanges.pipe(
        tap(() => {
          this.formControlRef.patchValue(null);
        })
      ).subscribe();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.options) {
      this.options = [];
    }

    if (this.isOptionsClosure(this.options)) {
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
        this.values.push(ele);
      });
    } else if (this.default) {
      this.values.push(this.default);
    }
  }

  openModal() {
    this.showModal = true;
    this.showValues = false;
    this.storeMutationState();
  }

  async addSelected(checkBoxContainer: HTMLUListElement, options: FieldConfigOption<any>[],
    option: FieldConfigOption<any>, index: number) {
    this.currentOptions = options;
    const inputs = checkBoxContainer.getElementsByTagName('input');
    if (this.isMultiple) {
      if (!inputs[index]['checked']) {
        inputs[index]['checked'] = true;
        if (!Boolean(this.values.indexOf(option) > -1)) {
          this.values.push(option);
        }
      } else if (inputs[index]['checked']) {
        inputs[index]['checked'] = false;
        const id = this.values.indexOf(option);
        if (id !== -1) {
          this.values.splice(id, 1);
        }
      }
    } else if (!this.isMultiple) {
      this.values = [];
      options.forEach((ele, i) => {
        if (ele.value !== option.value) {
          inputs[i]['checked'] = false;
        } else {
          inputs[i]['checked'] = true;
          this.values.push(option);
          this.singleValue = option.value;
        }
      });

    }
  }

  onSubmit() {
    if (this.isMultiple) {
      this.formControlRef.patchValue(this.values.map(v => v.value));
    } else {
      this.formControlRef.patchValue(this.singleValue);
    }
    this.showModal = !this.showModal;
    this.showValues = true;
    this.formControlRef.markAsDirty();
  }


  storeMutationState() {
    if (this.values && this.values.length) {
      let inputs;
      const getInputs = setInterval(() => {
        inputs = this.checkBoxContainer.nativeElement.getElementsByTagName('input');
        if (inputs && inputs.length) {
          console.log('======', inputs);
          clearInterval(getInputs);
          if (this.values && this.values.length) {
            this.values.forEach((v) => {
              this.currentOptions.forEach((o, index) => {
                if (Boolean(v.label === o.label)) {
                  inputs[index]['checked'] = true;
                }
              });
            });
          }
        }
      }, 50);
    }
  }

  async valueDoesExsists(option) {
    for (let i = 0; i < this.values.length; i++) {
      if (this.values[i].value.code === option.value.code) {
        this.values.push(option);
      }
    }
  }

  cancel() {
    this.values = [];
    this.formControlRef.patchValue([]);
    this.formControlRef.markAsDirty();
    this.showModal = false;
    this.showValues = false;
  }

  isOptionsArray(options: any) {
    return Array.isArray(options);

  }

  isOptionsClosure(options: any) {
    return typeof options === 'function';
  }

  isOptionsMap(input: any) {
    return !Array.isArray(input) && typeof input === 'object';
  }

}
