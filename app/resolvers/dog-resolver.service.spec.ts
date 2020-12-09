import { TestBed } from '@angular/core/testing';

import { DogResolverService } from './dog-resolver.service';

describe('DogResolverService', () => {
  let service: DogResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DogResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
