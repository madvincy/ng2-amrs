import { TestBed, inject } from '@angular/core/testing';

import { OrderSentenceGeneratorService } from './order-sentence-generator.service';

describe('OrderSentenceGeneratorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderSentenceGeneratorService]
    });
  });

  it('should be created', inject([OrderSentenceGeneratorService], (service: OrderSentenceGeneratorService) => {
    expect(service).toBeTruthy();
  }));
});
