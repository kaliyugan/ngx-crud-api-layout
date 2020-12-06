import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxCrudApiLayoutComponent } from './ngx-crud-api-layout.component';

describe('NgxCrudApiLayoutComponent', () => {
  let component: NgxCrudApiLayoutComponent;
  let fixture: ComponentFixture<NgxCrudApiLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxCrudApiLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxCrudApiLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
