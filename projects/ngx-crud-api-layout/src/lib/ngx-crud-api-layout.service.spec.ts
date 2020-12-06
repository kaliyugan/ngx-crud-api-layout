import { TestBed } from '@angular/core/testing';

import { NgxCrudApiLayoutService } from './ngx-crud-api-layout.service';

describe('NgxCrudApiLayoutService', () => {
  let service: NgxCrudApiLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxCrudApiLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
