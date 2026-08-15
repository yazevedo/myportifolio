import { Component, EventEmitter, Output, signal, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Star {
  id: number;
  top: string;
  left: string;
  size: number;
}

@Component({
  selector: 'app-intro-terminal',
  imports: [CommonModule],
  templateUrl: './intro-terminal.html',
  styleUrl: './intro-terminal.scss',
})
export class IntroTerminal {

  @Output() finished = new EventEmitter<void>();

  phase = signal<'stars' | 'terminal' | 'gathering' | 'loading' | 'done'>('stars');

  stars = signal<Star[]>([]);

  line1 = signal('');
  line2 = signal('');
  line1Done = signal(false);
  line2Done = signal(false);

  progress = signal(0);
  loadingMessage = signal('');

  private fullLine1 = "Oh... you're inspecting my code?";
  private fullLine2 = 'I see you. 👀';

  private loadingSteps = [
    { pct: 12, msg: 'initializing interface...' },
    { pct: 28, msg: 'loading creativity...' },
    { pct: 43, msg: 'importing coffee...' },
    { pct: 61, msg: 'compiling ideas...' },
    { pct: 78, msg: 'searching for bugs...' },
    { pct: 94, msg: 'hiding easter eggs...' },
    { pct: 100, msg: 'portfolio initialized successfully.' },
  ];

  constructor() {
    afterNextRender(() => {
      this.runSequence();
    });
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async runSequence(): Promise<void> {
    // ---------- FASE 1: estrelinhas ----------
    const starCount = 16;
    for (let i = 0; i < starCount; i++) {
      const star: Star = {
        id: i,
        top: `${Math.random() * 90 + 5}%`,
        left: `${Math.random() * 90 + 5}%`,
        size: Math.random() * 8 + 6
      };
      this.stars.update(list => [...list, star]);
      await this.delay(90 + Math.random() * 60);
    }

    await this.delay(400);

    // ---------- FASE 2: terminal ----------
    this.phase.set('terminal');
    await this.typeText(this.fullLine1, this.line1);
    this.line1Done.set(true);

    await this.delay(500);

    await this.typeText(this.fullLine2, this.line2);
    this.line2Done.set(true);

    await this.delay(1200);

    // ---------- FASE 3: transição ----------
    this.phase.set('gathering');
    await this.delay(900);

    // ---------- FASE 4: loading bar ----------
    this.phase.set('loading');
    for (const step of this.loadingSteps) {
      this.loadingMessage.set(step.msg);
      await this.animateProgressTo(step.pct);
      await this.delay(350);
    }

    await this.delay(600);

    // ---------- FASE 5: fim ----------
    this.phase.set('done');
    await this.delay(500);
    this.finished.emit();
  }

  private async typeText(fullText: string, target: ReturnType<typeof signal<string>>): Promise<void> {
    for (let i = 0; i < fullText.length; i++) {
      target.update(text => text + fullText.charAt(i));
      await this.delay(35 + Math.random() * 45);
    }
  }

  private async animateProgressTo(target: number): Promise<void> {
    const steps = target - this.progress();
    for (let i = 0; i < steps; i++) {
      this.progress.update(p => p + 1);
      await this.delay(15 + Math.random() * 20);
    }
  }
}
