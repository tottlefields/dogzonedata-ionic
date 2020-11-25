import { TestBed } from '@angular/core/testing';

import { SplitPaneService } from './split-pane.service';

describe('SplitPaneService', () => {
  let service: SplitPaneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SplitPaneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
