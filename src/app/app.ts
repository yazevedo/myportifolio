import { Component, signal } from '@angular/core';
import { HeroComponent } from './hero/hero';
import { IntroTerminal } from './intro-terminal/intro-terminal';
import { EasterEggs } from './easter-eggs/easter-eggs';
import { Skills } from './skills/skills';
import { AboutMe } from './about-me/about-me';

@Component({
  selector: 'app-root',
  imports: [HeroComponent, IntroTerminal, EasterEggs, Skills, AboutMe],
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