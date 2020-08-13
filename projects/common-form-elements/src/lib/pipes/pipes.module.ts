
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { TranslateHtmlPipe } from './translate-html/translate-html';

@NgModule({
  declarations: [TranslateHtmlPipe],
  imports: [CommonModule],
  exports: [TranslateHtmlPipe],
  providers: [DatePipe]
})
export class PipesModule {
}
