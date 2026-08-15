import { Component, signal } from '@angular/core';
import { HeroComponent } from './hero/hero';

@Component({
  selector: 'app-root',
  imports: [HeroComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('portifolio');
}
