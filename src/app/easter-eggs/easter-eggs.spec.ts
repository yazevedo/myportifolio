import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EasterEggs } from './easter-eggs';

describe('EasterEggs', () => {
  let component: EasterEggs;
  let fixture: ComponentFixture<EasterEggs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EasterEggs],
    }).compileComponents();

    fixture = TestBed.createComponent(EasterEggs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
