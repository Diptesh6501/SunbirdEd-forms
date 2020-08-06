import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonFormElementsComponent } from './common-form-elements.component';
import { DropdownComponent } from './dropdown/dropdown.component';
import { TextboxComponent } from './textbox/textbox.component';
import { TextareaComponent } from './textarea/textarea.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { FormComponent } from './form/form.component';
import { OptionGroupComponent } from './option-group/option-group.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { DropdownIconComponent } from './icon/dropdown/dropdownIcon.component';
import { MultipleDropdownComponent } from './multiple-dropdown/multiple-dropdown.component';
import { CaretDownComponent } from './icon/caret-down/caret-down.component';

@NgModule({
   declarations: [CommonFormElementsComponent, DropdownComponent, TextboxComponent,
      TextareaComponent, CheckboxComponent, FormComponent,
      OptionGroupComponent, DropdownIconComponent, MultipleDropdownComponent, CaretDownComponent],
   imports: [CommonModule, ReactiveFormsModule, FormsModule
   ],
   exports: [CommonFormElementsComponent, DropdownComponent, CaretDownComponent,
      TextboxComponent, TextareaComponent, CheckboxComponent, FormComponent, OptionGroupComponent, DropdownIconComponent]
})
export class CommonFormElementsModule { }
