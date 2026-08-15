import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type OverlayMode = 'none' | 'esc' | 'backspace';

@Component({
  selector: 'app-easter-eggs',
  imports: [CommonModule],
  templateUrl: './easter-eggs.html',
  styleUrl: './easter-eggs.scss'
})
export class EasterEggs {

  overlayMode = signal<OverlayMode>('none');
  terminalLines = signal<string[]>([]);
  showConfusedKitty = signal(false);
  private escBusy = false;

  kittyX = signal(0);
  kittyY = signal(0);
  kittyVisible = signal(false);
  showExploringMsg = signal(false);
  private arrowPressCount = 0;
  private arrowHideTimeout: any;
  private arrowMsgTimeout: any;

  private backspaceBusy = false;
  private backspaceIdleTimeout: any;

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    const tag = (event.target as HTMLElement)?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    switch (event.key) {
      case 'Escape':
        this.handleEsc();
        break;
      case 'ArrowUp':
      case 'ArrowDown':
      case 'ArrowLeft':
      case 'ArrowRight':
        event.preventDefault();
        this.handleArrow(event.key);
        break;
      case 'Backspace':
        event.preventDefault();
        this.handleBackspace();
        break;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ---------------- ESC ----------------
  private async handleEsc(): Promise<void> {
    if (this.escBusy) return;
    this.escBusy = true;

    document.body.classList.add('shake-effect');
    setTimeout(() => document.body.classList.remove('shake-effect'), 400);

    this.showConfusedKitty.set(true);
    this.overlayMode.set('esc');
    this.terminalLines.set([]);

    await this.typeLine('> ESC detected...');
    await this.delay(400);
    await this.typeLine('> WAIT... WHERE ARE YOU GOING?');
    await this.delay(900);
    await this.typeLine('> Nice try. ♡');
    await this.delay(1400);

    this.overlayMode.set('none');
    this.showConfusedKitty.set(false);
    this.escBusy = false;
  }

  // ---------------- ARROWS ----------------
  private handleArrow(key: string): void {
    const step = 40;
    const maxX = 200;
    const maxY = 150;

    this.kittyVisible.set(true);

    let x = this.kittyX();
    let y = this.kittyY();

    if (key === 'ArrowUp')    y = Math.max(y - step, -maxY);
    if (key === 'ArrowDown')  y = Math.min(y + step, maxY);
    if (key === 'ArrowLeft')  x = Math.max(x - step, -maxX);
    if (key === 'ArrowRight') x = Math.min(x + step, maxX);

    this.kittyX.set(x);
    this.kittyY.set(y);

    this.arrowPressCount++;

    if (this.arrowPressCount === 5) {
      this.showExploringMsg.set(true);
      clearTimeout(this.arrowMsgTimeout);
      this.arrowMsgTimeout = setTimeout(() => this.showExploringMsg.set(false), 3000);
    }

    clearTimeout(this.arrowHideTimeout);
    this.arrowHideTimeout = setTimeout(() => {
      this.kittyVisible.set(false);
      this.kittyX.set(0);
      this.kittyY.set(0);
      this.arrowPressCount = 0;
    }, 4000);
  }

  // ---------------- BACKSPACE ----------------
  private async handleBackspace(): Promise<void> {
    clearTimeout(this.backspaceIdleTimeout);

    if (!this.backspaceBusy) {
      this.backspaceBusy = true;
      this.overlayMode.set('backspace');
      this.terminalLines.set([]);
      await this.typeLine('> BACKSPACE detected...');
      await this.delay(300);
      await this.typeLine('> WARNING ⚠');
      await this.delay(300);
      await this.typeLine("> PLEASE DON'T DELETE MY WEBSITE");
      await this.delay(300);
      await this.typeLine('> what are you doing??? 😭');
    } else {
      this.terminalLines.update(lines => [...lines, '> deleting...']);
    }

    this.backspaceIdleTimeout = setTimeout(async () => {
      await this.typeLine('> okay...');
      await this.delay(400);
      await this.typeLine("> i'll pretend that didn't happen ♡");
      await this.delay(1400);
      this.overlayMode.set('none');
      this.backspaceBusy = false;
    }, 1200);
  }

  private async typeLine(text: string): Promise<void> {
    const lines = this.terminalLines();
    const index = lines.length;
    this.terminalLines.set([...lines, '']);

    for (let i = 0; i < text.length; i++) {
      this.terminalLines.update(current => {
        const copy = [...current];
        copy[index] = text.slice(0, i + 1);
        return copy;
      });
      await this.delay(20 + Math.random() * 20);
    }
  }
}
