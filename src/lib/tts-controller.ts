/** Sentinel id for any content before the first heading — always highlightable/readable, never jumpable. */
export const TTS_INTRO_ID = '__tts-intro__';

export interface TTSSection {
  id: string;
  title: string;
  elements: HTMLElement[];
}

interface QueueItem {
  sectionId: string;
  text: string;
}

type Listener = () => void;

const MAX_CHUNK_LEN = 200;

function chunkText(text: string, maxLen = MAX_CHUNK_LEN): string[] {
  const sentences = text.split(/(?<=[.!?])\s+/).filter(Boolean);
  const chunks: string[] = [];
  let current = '';
  for (const sentence of sentences) {
    if (current && current.length + sentence.length + 1 > maxLen) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

function extractSectionText(section: TTSSection): string {
  const parts: string[] = [];
  for (const el of section.elements) {
    const clone = el.cloneNode(true) as HTMLElement;
    clone.querySelectorAll('pre, button, .mermaid-fallback').forEach((n) => n.remove());
    const text = (clone.textContent || '').replace(/\s+/g, ' ').trim();
    if (text) parts.push(text);
  }
  return parts.join('. ');
}

function headingTitle(heading: HTMLElement): string {
  const clone = heading.cloneNode(true) as HTMLElement;
  clone.querySelectorAll('button').forEach((n) => n.remove());
  return (clone.textContent || '').trim();
}

function buildSections(root: HTMLElement): TTSSection[] {
  const sections: TTSSection[] = [];
  let current: TTSSection = { id: TTS_INTRO_ID, title: 'introduction', elements: [] };
  for (const child of Array.from(root.children)) {
    const el = child as HTMLElement;
    const isHeading = /^H[2-4]$/.test(el.tagName) && el.id.length > 0;
    if (isHeading) {
      if (current.elements.length > 0) sections.push(current);
      current = { id: el.id, title: headingTitle(el), elements: [el] };
    } else {
      current.elements.push(el);
    }
  }
  if (current.elements.length > 0) sections.push(current);
  return sections;
}

class TTSController {
  private sections: TTSSection[] = [];
  private queue: QueueItem[] = [];
  private queueIndex = -1;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners = new Set<Listener>();

  isPlaying = false;
  isPaused = false;
  currentSectionId: string | null = null;

  get isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  }

  private notify() {
    for (const fn of this.listeners) fn();
  }

  scan(root: HTMLElement) {
    this.stop();
    this.sections = buildSections(root);
    this.notify();
  }

  getSections(): TTSSection[] {
    return this.sections;
  }

  playAll() {
    this.playFrom(0, true);
  }

  /** Continues reading forward through the rest of the page after this section. */
  playSection(id: string) {
    const idx = this.sections.findIndex((s) => s.id === id);
    if (idx !== -1) this.playFrom(idx, true);
  }

  /** Reads only this one section, then stops. */
  playSectionOnly(id: string) {
    const idx = this.sections.findIndex((s) => s.id === id);
    if (idx !== -1) this.playFrom(idx, false);
  }

  jumpTo(id: string) {
    this.playSection(id);
  }

  next() {
    const idx = this.sections.findIndex((s) => s.id === this.currentSectionId);
    if (idx !== -1 && idx + 1 < this.sections.length) this.playFrom(idx + 1, true);
  }

  prev() {
    const idx = this.sections.findIndex((s) => s.id === this.currentSectionId);
    if (idx > 0) this.playFrom(idx - 1, true);
  }

  pause() {
    if (!this.isSupported || !this.isPlaying || this.isPaused) return;
    window.speechSynthesis.pause();
    this.isPaused = true;
    this.notify();
  }

  resume() {
    if (!this.isSupported || !this.isPaused) return;
    window.speechSynthesis.resume();
    this.isPaused = false;
    this.notify();
  }

  stop() {
    if (this.isSupported) window.speechSynthesis.cancel();
    this.currentUtterance = null;
    this.queue = [];
    this.queueIndex = -1;
    this.isPlaying = false;
    this.isPaused = false;
    this.setActiveSection(null);
    this.notify();
  }

  private playFrom(sectionIndex: number, continuous: boolean) {
    if (!this.isSupported) return;
    window.speechSynthesis.cancel();

    const items: QueueItem[] = [];
    const end = continuous ? this.sections.length : sectionIndex + 1;
    for (let i = sectionIndex; i < end; i++) {
      const section = this.sections[i];
      const text = extractSectionText(section);
      for (const chunk of chunkText(text)) {
        items.push({ sectionId: section.id, text: chunk });
      }
    }

    this.queue = items;
    this.queueIndex = -1;
    this.isPlaying = true;
    this.isPaused = false;
    this.speakNext();
  }

  private speakNext() {
    this.queueIndex += 1;
    const item = this.queue[this.queueIndex];
    if (!item) {
      this.finish();
      return;
    }
    if (item.sectionId !== this.currentSectionId) {
      this.setActiveSection(item.sectionId);
      this.scrollToSection(item.sectionId);
    }

    const utterance = new SpeechSynthesisUtterance(item.text);
    utterance.onend = () => {
      if (this.currentUtterance === utterance) this.speakNext();
    };
    utterance.onerror = () => {
      if (this.currentUtterance === utterance) this.speakNext();
    };
    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    this.notify();
  }

  private finish() {
    this.currentUtterance = null;
    this.isPlaying = false;
    this.isPaused = false;
    this.setActiveSection(null);
    this.notify();
  }

  private setActiveSection(id: string | null) {
    if (this.currentSectionId === id) return;
    if (this.currentSectionId) {
      this.sections
        .find((s) => s.id === this.currentSectionId)
        ?.elements.forEach((el) => el.classList.remove('tts-active-section'));
    }
    this.currentSectionId = id;
    if (id) {
      this.sections
        .find((s) => s.id === id)
        ?.elements.forEach((el) => el.classList.add('tts-active-section'));
    }
    this.notify();
  }

  private scrollToSection(id: string | null) {
    if (!id) return;
    const heading = document.getElementById(id);
    if (!heading) return;
    const header = document.querySelector('header');
    const offset = (header?.getBoundingClientRect().height ?? 64) + 16;
    const top = heading.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

let instance: TTSController | null = null;

export function getTTSController(): TTSController {
  if (!instance) instance = new TTSController();
  return instance;
}

export type { TTSController };
