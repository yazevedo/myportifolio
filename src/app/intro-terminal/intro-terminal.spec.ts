import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroTerminal } from './intro-terminal';

describe('IntroTerminal', () => {
  let component: IntroTerminal;
  let fixture: ComponentFixture<IntroTerminal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntroTerminal],
    }).compileComponents();

    fixture = TestBed.createComponent(IntroTerminal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
