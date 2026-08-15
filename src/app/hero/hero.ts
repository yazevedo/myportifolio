import { Component, OnDestroy, signal, computed, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class HeroComponent implements OnDestroy {

  private prefix = "HI! I'M ";
  private name = 'YASMIN';
  private fullText = this.prefix + this.name;

  displayedText = signal('');
  typingDone = signal(false);
  private charIndex = 0;
  private typingTimeout: any;

  displayedPrefix = computed(() => this.displayedText().slice(0, this.prefix.length));
  displayedName = computed(() => this.displayedText().slice(this.prefix.length));

  avatarOpen = '/imagens/avatar-animado-olho-aberto.jpeg';
  avatarClosed = '/imagens/avatar-animado-olho-fechado.jpeg';
  currentAvatar = signal(this.avatarOpen);

  constructor() {
    afterNextRender(() => {
      this.typeWriter();
    });
  }

  ngOnDestroy(): void {
    clearTimeout(this.typingTimeout);
  }

  private typeWriter(): void {
    if (this.charIndex < this.fullText.length) {
      this.displayedText.update(text => text + this.fullText.charAt(this.charIndex));
      this.charIndex++;
      const delay = 70 + Math.random() * 60;
      this.typingTimeout = setTimeout(() => this.typeWriter(), delay);
    } else {
      this.typingDone.set(true);
    }
  }

  onAvatarHover(hovering: boolean): void {
    this.currentAvatar.set(hovering ? this.avatarClosed : this.avatarOpen);
  }
}