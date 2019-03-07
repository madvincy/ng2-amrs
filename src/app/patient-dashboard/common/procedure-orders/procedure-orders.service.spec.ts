import { TestBed, inject } from '@angular/core/testing';

import { ProcedureOrdersService } from './procedure-orders.service';

describe('ProcedureOrdersService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProcedureOrdersService]
    });
  });

  it('should be created', inject([ProcedureOrdersService], (service: ProcedureOrdersService) => {
    expect(service).toBeTruthy();
  }));
});
