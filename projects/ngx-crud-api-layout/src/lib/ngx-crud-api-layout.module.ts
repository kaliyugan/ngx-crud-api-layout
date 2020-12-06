import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NotifierModule, NotifierOptions } from 'angular-notifier';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrderModule } from 'ngx-order-pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { DateFormatPipe, DateTimeFormatPipe, KeysPipe, NgxCrudApiLayoutComponent } from './ngx-crud-api-layout.component';

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'left',
      distance: 12
    },
    vertical: {
      position: 'bottom',
      distance: 12,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};



@NgModule({
  declarations: [
    NgxCrudApiLayoutComponent,
    DateTimeFormatPipe,
    DateFormatPipe,
    KeysPipe
  ],
  imports: [
    CommonModule,
    NgxPaginationModule,
    Ng2SearchPipeModule,
    OrderModule,
    NotifierModule.withConfig(customNotifierOptions),

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  exports: [NgxCrudApiLayoutComponent]
})
export class NgxCrudApiLayoutModule { }
