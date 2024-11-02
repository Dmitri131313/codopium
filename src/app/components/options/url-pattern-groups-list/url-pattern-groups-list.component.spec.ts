import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlPatternGroupsListComponent } from './url-pattern-groups-list.component';

describe('UrlPatternGroupListComponent', () => {
  let component: UrlPatternGroupsListComponent;
  let fixture: ComponentFixture<UrlPatternGroupsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrlPatternGroupsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UrlPatternGroupsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
