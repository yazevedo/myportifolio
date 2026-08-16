import { Component, ElementRef, HostListener, signal, viewChild, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Tech {
  name: string;
  description: string;
  angle: number;
  radius: number;
  x: number;
  y: number;
}

interface StrengthItem {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-skills',
  imports: [CommonModule],
  templateUrl: './skills.html',
  styleUrl: './skills.scss'
})
export class Skills {

  sectionRef = viewChild<ElementRef<HTMLElement>>('skillsSection');

  sectionVisible = signal(false);
  titleText = signal('');
  titleDone = signal(false);
  techsVisible = signal(false);
  panelsVisible = signal(false);

  scrollProgress = signal(0);

  catStage = signal<'idle' | 'booting' | 'loading' | 'creating' | 'log' | 'mini'>('idle');
  catProgress = signal(0);
  catAscii = signal('');
  catLogLines = signal<string[]>([]);

  techs = signal<Tech[]>([
    { name: 'HTML', description: 'Estrutura semântica', angle: 270, radius: 190, x: 0, y: 0 },
    { name: 'CSS', description: 'Estilo e animações', angle: 330, radius: 190, x: 0, y: 0 },
    { name: 'JavaScript', description: 'Interatividade', angle: 30, radius: 190, x: 0, y: 0 },
    { name: 'Angular', description: 'Framework principal', angle: 90, radius: 190, x: 0, y: 0 },
    { name: 'Node.js', description: 'Back-end em JS', angle: 150, radius: 190, x: 0, y: 0 },
    { name: 'MySQL / MariaDB', description: 'Banco de dados', angle: 210, radius: 190, x: 0, y: 0 },
  ]);

  strengths: StrengthItem[] = [
    { icon: '✨', title: 'Criatividade', description: 'Gosto de transformar ideias em experiências digitais diferentes.' },
    { icon: '🧩', title: 'Resolução de problemas', description: 'Busco entender a causa do problema antes de simplesmente corrigir o erro.' },
    { icon: '📚', title: 'Facilidade para aprender', description: 'Tenho interesse em aprender novas tecnologias e expandir meus conhecimentos.' },
    { icon: '🎨', title: 'Atenção aos detalhes', description: 'Me preocupo com a experiência visual e os pequenos detalhes das interfaces.' },
    { icon: '💡', title: 'Curiosidade', description: 'Gosto de entender como as coisas funcionam e experimentar novas possibilidades.' },
  ];

  improvements: StrengthItem[] = [
    { icon: '🔹', title: 'Aprofundar back-end', description: 'Buscando evoluir cada vez mais na construção de APIs e aplicações.' },
    { icon: '🔹', title: 'Arquitetura de software', description: 'Aprimorando meus conhecimentos sobre organização e estruturação de aplicações.' },
    { icon: '🔹', title: 'Testes automatizados', description: 'Estudando melhores práticas para criar aplicações mais confiáveis.' },
    { icon: '🔹', title: 'Inglês técnico', description: 'Continuando a desenvolver minha comunicação e compreensão no contexto profissional.' },
  ];

  private fullTitle = 'SKILLS';
  private fullCatAscii = ' /\\_/\\\n( o.o )\n > ^ <';
  private fullCatAsciiLog = ' /\\_/\\\n( •.• )\n > ^ <';
  private hasTriggered = false;
  private orbitInterval: any;

  constructor() {
    this.updateTechPositions();
    afterNextRender(() => {
      this.setupObserver();
    });
  }

  private updateTechPositions(): void {
    this.techs.update(list =>
      list.map(t => ({
        ...t,
        x: Math.cos((t.angle * Math.PI) / 180) * t.radius,
        y: Math.sin((t.angle * Math.PI) / 180) * t.radius * 0.62
      }))
    );
  }

  private setupObserver(): void {
    const el = this.sectionRef()?.nativeElement;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.hasTriggered) {
            this.hasTriggered = true;
            this.sectionVisible.set(true);
            this.runSequence();
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(el);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const el = this.sectionRef()?.nativeElement;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const windowH = window.innerHeight;

    const raw = 1 - (rect.top + rect.height / 2) / (windowH + rect.height);
    const clamped = Math.min(Math.max(raw, 0), 1);
    this.scrollProgress.set(clamped);
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async appendTypedLine(list: ReturnType<typeof signal<string[]>>, text: string, speed = 25): Promise<void> {
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

  private async runSequence(): Promise<void> {
    for (let i = 0; i < this.fullTitle.length; i++) {
      this.titleText.update(t => t + this.fullTitle.charAt(i));
      await this.delay(100);
    }
    this.titleDone.set(true);

    await this.delay(300);
    this.techsVisible.set(true);

    await this.delay(600);
    this.panelsVisible.set(true);

    await this.delay(1000);
    this.startOrbit();

    await this.delay(500);
    this.runCatSequence();
  }

  private startOrbit(): void {
    const speed = 0.06;
    this.orbitInterval = setInterval(() => {
      this.techs.update(list =>
        list.map(t => ({ ...t, angle: t.angle + speed }))
      );
      this.updateTechPositions();
    }, 30);
  }

  private async runCatSequence(): Promise<void> {
    this.catStage.set('booting');
    await this.delay(700);

    this.catStage.set('loading');
    for (let p = 0; p <= 100; p += 4) {
      this.catProgress.set(p);
      await this.delay(25);
    }

    await this.delay(300);
    this.catStage.set('creating');

    for (let i = 0; i < this.fullCatAscii.length; i++) {
      this.catAscii.update(t => t + this.fullCatAscii.charAt(i));
      await this.delay(25);
    }

    await this.delay(1200);

    // segunda etapa: "cat developer.log"
    this.catStage.set('log');
    await this.appendTypedLine(this.catLogLines, '$ cat developer.log', 30);
    await this.delay(300);
    await this.appendInstantLine(this.catLogLines, '> strengths detected ✓');
    await this.delay(250);
    await this.appendInstantLine(this.catLogLines, '> weaknesses detected ✓');
    await this.delay(250);
    await this.appendInstantLine(this.catLogLines, '> potential detected ✓');
    await this.delay(250);
    await this.appendInstantLine(this.catLogLines, '> developer is still under development...');

    this.catAscii.set(this.fullCatAsciiLog);

    await this.delay(2200);

    // encolhe para uma "assinatura" no canto
    this.catStage.set('mini');
  }
}