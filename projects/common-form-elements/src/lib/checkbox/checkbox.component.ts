import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'sb-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.css']
})
export class CheckboxComponent implements OnInit {
  @Input() label: any;
  @Input() code: any;
  @Input() value?: any;
  @Input() formControlRef?: FormControl;

  constructor() { }

  ngOnInit() {
  }

}
