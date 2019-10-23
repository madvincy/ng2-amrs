import { TestBed, inject } from '@angular/core/testing';

import { DqaChartAbstractionService } from './dqa-chart-abstraction.service';

describe('DqaChartAbstractionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DqaChartAbstractionService]
    });
  });

  it('should be created', inject([DqaChartAbstractionService], (service: DqaChartAbstractionService) => {
    expect(service).toBeTruthy();
  }));
});
