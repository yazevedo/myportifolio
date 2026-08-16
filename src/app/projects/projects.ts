import { Component, ElementRef, HostListener, signal, viewChild, input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Project {
  name: string;
  description: string;
  tech: string[];
  github: string;
  demo: string;
  image: string;
}

type Phase = 'idle' | 'intro' | 'listing' | 'frontend' | 'backend';

@Component({
  selector: 'app-projects',
  imports: [CommonModule],
  templateUrl: './projects.html',
  styleUrl: './projects.scss'
})
export class Projects {

  sectionRef = viewChild<ElementRef<HTMLElement>>('projectsSection');

  phase = signal<Phase>('idle');
  introLines = signal<string[]>([]);
  folderLines = signal<string[]>([]);
  frontendLines = signal<string[]>([]);
  backendLines = signal<string[]>([]);

  currentIndex = signal(0);

  projects: Project[] = [
    {
      name: 'Portfólio Hello Kitty',
      description: 'Meu próprio portfólio, com terminal interativo, easter eggs e animações neon.',
      tech: ['Angular', 'TypeScript', 'SCSS'],
      github: '#',
      demo: '#',
      image: '/imagens/hello-kitty-rosto.jpeg'
    },
    {
      name: 'Projeto 02',
      description: 'Descrição curta do projeto — troque pelo texto real quando adicionar.',
      tech: ['HTML', 'CSS', 'JavaScript'],
      github: '#',
      demo: '#',
      image: '/imagens/laco-neon.jpeg'
    },
    {
      name: 'Projeto 03',
      description: 'Descrição curta do projeto — troque pelo texto real quando adicionar.',
      tech: ['Angular', 'CSS'],
      github: '#',
      demo: '#',
      image: '/imagens/flor-neon.jpeg'
    },
  ];

  private hasStarted = false;

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async appendTypedLine(list: ReturnType<typeof signal<string[]>>, text: string, speed = 45): Promise<void> {
    const index = list().length;
    list.update(l => [...l, '']);
    for (let i = 0; i < text.length; i++) {
      list.update(l => {
        const copy = [...l];
        copy[index] = text.slice(0, i + 1);
        return copy;
      });
      await this.delay(speed);
    }
  }

  private async appendInstantLine(list: ReturnType<typeof signal<string[]>>, text: string): Promise<void> {
    list.update(l => [...l, text]);
  }

  async start(): Promise<void> {
    if (this.hasStarted) return;
    this.hasStarted = true;

    this.phase.set('intro');

    await this.delay(300);
    setTimeout(() => {
      this.sectionRef()?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    await this.appendInstantLine(this.introLines, '~/portfolio');
    await this.delay(200);
    await this.appendInstantLine(this.introLines, '   |');
    await this.delay(200);
    await this.appendInstantLine(this.introLines, '   └── projects/');
    await this.delay(700);
    await this.appendTypedLine(this.introLines, '$ pwd', 45);
    await this.delay(400);
    await this.appendInstantLine(this.introLines, '/home/yasmin/portfolio/projects');
    await this.delay(800);
    await this.appendTypedLine(this.introLines, '> directory loaded successfully.', 45);

    await this.delay(700);
    this.phase.set('listing');

    await this.appendTypedLine(this.folderLines, '$ ls', 45);
    await this.delay(500);
    await this.appendInstantLine(this.folderLines, 'frontend/');
    await this.delay(250);
    await this.appendInstantLine(this.folderLines, 'backend/');
  }

  async openFrontend(): Promise<void> {
    if (this.phase() === 'frontend') return;
    this.phase.set('frontend');
    this.frontendLines.set([]);

    await this.appendTypedLine(this.frontendLines, '$ cd frontend', 45);
    await this.delay(500);
    await this.appendInstantLine(this.frontendLines, `> ${this.projects.length.toString().padStart(2, '0')} projects found.`);
  }

  async openBackend(): Promise<void> {
    if (this.phase() === 'backend') return;
    this.phase.set('backend');
    this.backendLines.set([]);

    await this.appendTypedLine(this.backendLines, '$ cd backend', 45);
    await this.delay(500);
    await this.appendTypedLine(this.backendLines, '> scanning directory...', 45);
    await this.delay(500);
    await this.appendInstantLine(this.backendLines, 'backend/');
    await this.delay(300);
    await this.appendInstantLine(this.backendLines, '> 0 projects found.');
    await this.delay(300);
    await this.appendInstantLine(this.backendLines, '> directory is currently under construction...');
  }

  next(): void {
    this.currentIndex.set((this.currentIndex() + 1) % this.projects.length);
  }

  prev(): void {
    this.currentIndex.set((this.currentIndex() - 1 + this.projects.length) % this.projects.length);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (this.phase() !== 'frontend') return;
    if (event.key === 'ArrowRight') this.next();
    if (event.key === 'ArrowLeft') this.prev();
  }

  getSlotClass(index: number): string {
    const total = this.projects.length;
    const current = this.currentIndex();
    if (index === current) return 'active';
    if (index === (current + 1) % total) return 'next';
    if (index === (current - 1 + total) % total) return 'prev';
    return 'hidden';
  }
}