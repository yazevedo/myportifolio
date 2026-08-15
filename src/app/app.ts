import { Component, signal } from '@angular/core';
import { HeroComponent } from './hero/hero';
import { IntroTerminal } from './intro-terminal/intro-terminal';

@Component({
  selector: 'app-root',
  imports: [HeroComponent, IntroTerminal],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('portifolio');

  introDone = signal(false);

  onIntroFinished(): void {
    this.introDone.set(true);
  }
}