import { TestBed } from '@angular/core/testing';

import { ProductServicesService } from './product-services.service';

describe('ProductServicesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductServicesService = TestBed.get(ProductServicesService);
    expect(service).toBeTruthy();
  });
});
