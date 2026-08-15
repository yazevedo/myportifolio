import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'   // <-- aqui está o problema
})
export class HeroComponent implements OnInit, OnDestroy {

  // --- Efeito de digitação ---
  private prefix = "HI! I'M ";
  private name = 'YASMIN';
  private fullText = this.prefix + this.name;

  displayedText = '';
  private charIndex = 0;
  private typingTimeout: any;

  get displayedPrefix(): string {
    return this.displayedText.slice(0, this.prefix.length);
  }

  get displayedName(): string {
    return this.displayedText.slice(this.prefix.length);
  }

  // --- Avatar com troca no hover ---
 avatarOpen = '/imagens/avatar-animado-olho-aberto.jpeg';
 avatarClosed = '/imagens/avatar-animado-olho-fechado.jpeg';
  currentAvatar = this.avatarOpen;

  ngOnInit(): void {
    this.typeWriter();
  }

  ngOnDestroy(): void {
    clearTimeout(this.typingTimeout);
  }

  private typeWriter(): void {
    if (this.charIndex < this.fullText.length) {
      this.displayedText += this.fullText.charAt(this.charIndex);
      this.charIndex++;
      // velocidade "natural" de digitação (varia um pouco)
      const delay = 70 + Math.random() * 60;
      this.typingTimeout = setTimeout(() => this.typeWriter(), delay);
    }
  }

  onAvatarHover(hovering: boolean): void {
    this.currentAvatar = hovering ? this.avatarClosed : this.avatarOpen;
  }
}