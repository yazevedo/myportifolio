import { Component, ElementRef, HostListener, signal, viewChild, afterNextRender, output } from '@angular/core';
import { CommonModule } from '@angular/common';

type Phase = 'idle' | 'boot' | 'window' | 'files' | 'closing' | 'done';

@Component({
  selector: 'app-about-me',
  imports: [CommonModule],
  templateUrl: './about-me.html',
  styleUrl: './about-me.scss'
})
export class AboutMe {

  sectionRef = viewChild<ElementRef<HTMLElement>>('aboutSection');

  finished = output<void>();

  phase = signal<Phase>('idle');

  // --- controle de velocidade e replay ---
  speedMultiplier = signal(1);
  isRunning = signal(false);

  // --- parallax de fundo ---
  scrollOffset = signal(0);

  // --- boot terminal ---
  bootLines = signal<string[]>([]);
  bootCursorOnly = signal(true);
  bootProgress = signal(0);
  bootDone = signal(false);

  // --- janela about_me.exe ---
  windowVisible = signal(false);
  introLines = signal<string[]>([]);

  // --- arquivos ---
  lsLines = signal<string[]>([]);
  currentFile = signal<string>('');
  aboutTxtLines = signal<string[]>([]);
  jsonLines = signal<string[]>([]);
  howLines = signal<string[]>([]);

  // --- easter egg do bug ---
  bugProgress = signal(0);
  bugStage = signal<'idle' | 'compiling' | 'error' | 'fixing' | 'fixed'>('idle');
  bugGlitch = signal(false);

  // --- fechamento e prompt "cd projects" ---
  closingLines = signal<string[]>([]);
  cdCursorOnly = signal(false);
  cdLines = signal<string[]>([]);
  cdReady = signal(false);
  navigating = signal(false);
  navLines = signal<string[]>([]);

  // --- mini janelas decorativas ---
  systemLogLines = ['> booting...', '> developer found', '> profile loaded'];
  giantCode = [
    'const developer = new Developer();',
    'developer.learn();',
    'developer.build();',
    'developer.debug();',
    'developer.create();',
    '',
    'while (true) {',
    '    developer.keepLearning();',
    '}',
  ];

  private hasTriggered = false;

  private keyboardTypos: Record<string, string> = {
    a: 's', e: 'r', i: 'o', o: 'i', u: 'y', s: 'a', r: 'e', t: 'y',
    n: 'm', m: 'n', c: 'v', v: 'c', d: 'f', f: 'd', l: 'k', k: 'l'
  };

  constructor() {
    afterNextRender(() => this.setupObserver());
  }

  private setupObserver(): void {
    const el = this.sectionRef()?.nativeElement;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.hasTriggered) {
            this.hasTriggered = true;
            this.runSequence();
          }
        });
      },
      { threshold: 0.2 }
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
    this.scrollOffset.set(clamped);
  }

  toggleSpeed(): void {
    this.speedMultiplier.set(this.speedMultiplier() === 1 ? 2.5 : 1);
  }

  replay(): void {
    if (this.isRunning()) return;

    this.phase.set('idle');
    this.bootLines.set([]);
    this.bootCursorOnly.set(true);
    this.bootProgress.set(0);
    this.bootDone.set(false);
    this.windowVisible.set(false);
    this.introLines.set([]);
    this.lsLines.set([]);
    this.currentFile.set('');
    this.aboutTxtLines.set([]);
    this.jsonLines.set([]);
    this.howLines.set([]);
    this.bugProgress.set(0);
    this.bugStage.set('idle');
    this.bugGlitch.set(false);
    this.closingLines.set([]);
    this.cdCursorOnly.set(false);
    this.cdLines.set([]);
    this.cdReady.set(false);
    this.navigating.set(false);
    this.navLines.set([]);

    this.runSequence();
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms / this.speedMultiplier()));
  }

  private readingPause(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private randomTypo(correct: string): string {
    const lower = correct.toLowerCase();
    return this.keyboardTypos[lower] || 'x';
  }

  private async appendTypedLine(
    list: ReturnType<typeof signal<string[]>>,
    text: string,
    speed = 55,
    typoChance = 0.02
  ): Promise<void> {
    const index = list().length;
    list.update(l => [...l, '']);
    let current = '';

    const setLine = (value: string) => {
      list.update(l => {
        const copy = [...l];
        copy[index] = value;
        return copy;
      });
    };

    for (let i = 0; i < text.length; i++) {
      const char = text.charAt(i);

      if (char !== ' ' && typoChance > 0 && Math.random() < typoChance) {
        const wrong = this.randomTypo(char);
        current += wrong;
        setLine(current);
        await this.delay(speed + 30 + Math.random() * 50);

        await this.delay(300 + Math.random() * 200);

        current = current.slice(0, -1);
        setLine(current);
        await this.delay(160 + Math.random() * 100);
      }

      current += char;
      setLine(current);
      await this.delay(speed + Math.random() * 40);
    }
  }

  private async appendInstantLine(list: ReturnType<typeof signal<string[]>>, text: string): Promise<void> {
    list.update(l => [...l, text]);
  }

  // ------------------------------------------------------------
  private async runSequence(): Promise<void> {
    this.isRunning.set(true);
    this.phase.set('boot');
    await this.readingPause(900);
    this.bootCursorOnly.set(false);

    await this.appendTypedLine(this.bootLines, '$ ./about-me', 55, 0);
    await this.readingPause(900);
    await this.appendTypedLine(this.bootLines, 'Searching for developer...', 55, 0);
    await this.readingPause(1300);
    await this.appendInstantLine(this.bootLines, '✓ developer found');
    await this.readingPause(1000);
    await this.appendTypedLine(this.bootLines, 'Loading developer_profile...', 55, 0);

    for (let p = 0; p <= 100; p += 3) {
      this.bootProgress.set(p);
      await this.delay(45);
    }

    await this.readingPause(700);
    await this.appendInstantLine(this.bootLines, '✓ profile loaded');
    await this.readingPause(500);
    await this.appendInstantLine(this.bootLines, '✓ experience loaded');
    await this.readingPause(500);
    await this.appendInstantLine(this.bootLines, '✓ skills loaded');
    await this.readingPause(500);
    await this.appendInstantLine(this.bootLines, '✓ personality loaded');
    await this.readingPause(1100);
    await this.appendTypedLine(this.bootLines, '> opening about_me.exe', 55, 0);

    this.bootDone.set(true);
    await this.readingPause(1800);

    this.phase.set('window');
    await this.readingPause(400);
    this.windowVisible.set(true);
    await this.readingPause(900);

    await this.appendTypedLine(this.introLines, '> identifying developer...', 55, 0);
    await this.readingPause(700);
    await this.appendTypedLine(this.introLines, '> name: Yasmin', 55, 0.02);
    await this.readingPause(400);
    await this.appendTypedLine(this.introLines, '> role: Desenvolvedora Full Stack Júnior', 55, 0.02);
    await this.readingPause(1000);
    await this.appendTypedLine(
      this.introLines,
      'Tenho 18 anos e estou cursando Desenvolvimento de Sistemas na FIAP, unindo teoria e prática desde o início da minha formação. Atuo com desenvolvimento front-end com foco em criar interfaces bonitas e funcionais, e venho me aprofundando em back-end para me tornar uma desenvolvedora full stack completa. Tenho inglês intermediário e busco uma oportunidade onde possa aplicar meu conhecimento técnico, aprender continuamente e entregar resultados reais para o time ou negócio que eu atender.',
      42,
      0.02
    );

    await this.readingPause(3200);
    this.phase.set('files');
    await this.runFilesSequence();
  }

  private async runFilesSequence(): Promise<void> {
    await this.appendTypedLine(this.lsLines, '$ ls', 55, 0);
    await this.readingPause(800);
    const files = ['about_me.txt', 'developer_profile.json', 'what_i_build.md', 'how_i_think.txt', 'personality.exe'];
    for (const f of files) {
      await this.appendInstantLine(this.lsLines, f);
      await this.readingPause(380);
    }

    await this.readingPause(1600);

    this.currentFile.set('about_me.txt');
    await this.appendTypedLine(this.aboutTxtLines, '> opening about_me.txt', 55, 0);
    await this.readingPause(900);
    await this.appendTypedLine(
      this.aboutTxtLines,
      'Comecei minha jornada na programação no SENAI, onde descobri o gosto por transformar ideias em interfaces reais. De lá para cá, venho me dedicando ao desenvolvimento web de forma consistente, unindo o aprendizado técnico da FIAP à experiência prática de construir projetos completos: interfaces responsivas, integração com APIs e estruturação de bancos de dados. Também já atuei como assistente administrativa, o que me deu uma visão prática de como um negócio funciona por dentro — e é exatamente essa visão que trago para cada projeto que desenvolvo: tecnologia a serviço de um resultado real.',
      40,
      0.02
    );
    await this.readingPause(3600);

    this.currentFile.set('developer_profile.json');
    const jsonSteps = [
      '{',
      '  "role": "Desenvolvedora Full Stack Júnior",',
      '  "focus": [',
      '    "Frontend",',
      '    "Backend",',
      '    "Web Development"',
      '  ],',
      '  "technologies": [',
      '    "Angular",',
      '    "JavaScript",',
      '    "HTML",',
      '    "CSS",',
      '    "Node.js"',
      '  ],',
      '  "database": [',
      '    "MySQL",',
      '    "MariaDB"',
      '  ],',
      '  "languages": ["Português", "Inglês Intermediário B2"]',
      '}',
    ];
    for (const line of jsonSteps) {
      await this.appendInstantLine(this.jsonLines, line);
      await this.readingPause(320);
    }
    await this.readingPause(3200);

    this.currentFile.set('how_i_think.txt');
    await this.appendTypedLine(this.howLines, '$ cat how_i_think.txt', 55, 0);
    await this.readingPause(900);
    await this.appendInstantLine(this.howLines, 'Problem detected.');
    await this.readingPause(900);
    await this.appendInstantLine(this.howLines, 'Analyzing...');
    await this.readingPause(900);
    const steps = [
      '> understand the problem',
      '> break it into smaller pieces',
      '> research',
      '> implement',
      '> test',
      '> debug',
      '> improve',
    ];
    for (const s of steps) {
      await this.appendInstantLine(this.howLines, s);
      await this.readingPause(600);
    }
    await this.readingPause(900);
    await this.appendInstantLine(this.howLines, '✓ solution found');
    await this.readingPause(900);
    await this.appendTypedLine(
      this.howLines,
      'Antes de escrever qualquer linha de código, procuro entender o problema por completo. Pesquiso, divido em partes menores, implemento aos poucos e testo constantemente — para mim, errar faz parte do processo de aprender e de entregar um trabalho cada vez melhor.',
      40,
      0.02
    );

    await this.readingPause(3600);
    await this.runBugEasterEgg();
  }

  private async runBugEasterEgg(): Promise<void> {
    this.bugStage.set('compiling');
    for (let p = 0; p <= 72; p += 3) {
      this.bugProgress.set(p);
      await this.delay(50);
    }

    await this.readingPause(700);
    this.bugGlitch.set(true);
    await this.readingPause(500);
    this.bugGlitch.set(false);
    this.bugStage.set('error');

    await this.readingPause(2200);
    this.bugStage.set('fixing');
    for (let p = 0; p <= 100; p += 3) {
      this.bugProgress.set(p);
      await this.delay(45);
    }

    await this.readingPause(800);
    this.bugStage.set('fixed');
    await this.readingPause(1600);

    await this.runClosingSequence();
  }

  private async runClosingSequence(): Promise<void> {
    this.phase.set('closing');
    await this.appendTypedLine(this.closingLines, '> profile loaded successfully.', 55, 0);
    await this.readingPause(500);
    await this.appendInstantLine(this.closingLines, 'developer verified ✓');
    await this.readingPause(600);
    await this.appendTypedLine(this.closingLines, '> closing about_me.exe...', 55, 0);
    await this.readingPause(1200);

    this.windowVisible.set(false);
    await this.readingPause(1000);

    this.cdCursorOnly.set(true);
    await this.readingPause(1300);
    this.cdCursorOnly.set(false);

    await this.appendTypedLine(this.cdLines, '$ cd projects', 60, 0);
    this.cdReady.set(true);

    this.isRunning.set(false);
  }

  async onCdProjectsClick(): Promise<void> {
    if (!this.cdReady() || this.navigating()) return;

    this.cdReady.set(false);
    this.navigating.set(true);

    await this.appendTypedLine(this.navLines, '> changing directory...', 50, 0);
    await this.readingPause(600);
    await this.appendTypedLine(this.navLines, '> accessing /projects...', 50, 0);
    await this.readingPause(500);
    await this.appendTypedLine(this.navLines, '> loading projects...', 50, 0);
    await this.readingPause(700);

    this.finished.emit();
  }
}