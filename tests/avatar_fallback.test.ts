import { describe, expect, it } from 'vitest';
import { attachAvatarFallback } from '../src/ui/avatar_fallback';

// The vitest env has no DOM (this repo models DOM wiring with a hand-rolled fake,
// see focus_manager.test.ts), so model the minimal HTMLImageElement surface the
// helper touches: src get/set (mirrored into the src attribute so getAttribute
// tracks it, like a real element), getAttribute, style.display, and an
// addEventListener('error') we fire on demand.
class FakeImg {
  private handlers: Array<() => void> = [];
  private attrs: Record<string, string | undefined> = {};
  style = { display: '' };
  set src(v: string) {
    this.attrs.src = v;
  }
  get src(): string {
    return this.attrs.src ?? '';
  }
  getAttribute(name: string): string | null {
    return this.attrs[name] ?? null;
  }
  addEventListener(type: string, cb: () => void): void {
    if (type === 'error') this.handlers.push(cb);
  }
  fireError(): void {
    for (const cb of this.handlers) cb();
  }
}

const asImg = (f: FakeImg): HTMLImageElement => f as unknown as HTMLImageElement;
const CDN = 'https://cdn.discordapp.com/avatars/1/abc.png?size=64';
const BADGE = 'data:image/png;base64,BADGE';

describe('attachAvatarFallback', () => {
  it('leaves the image untouched until an error fires', () => {
    const img = new FakeImg();
    img.src = CDN;
    attachAvatarFallback(asImg(img), BADGE);
    expect(img.src).toBe(CDN);
    expect(img.style.display).toBe('');
  });

  it('hides the image when the load fails and no fallback is given', () => {
    const img = new FakeImg();
    img.src = CDN;
    attachAvatarFallback(asImg(img));
    img.fireError();
    expect(img.style.display).toBe('none');
  });

  it('swaps to the fallback source on failure, keeping the image visible', () => {
    const img = new FakeImg();
    img.src = CDN;
    attachAvatarFallback(asImg(img), BADGE);
    img.fireError();
    expect(img.src).toBe(BADGE);
    expect(img.style.display).toBe('');
  });

  it('hides the image if the fallback source also fails', () => {
    const img = new FakeImg();
    img.src = CDN;
    attachAvatarFallback(asImg(img), BADGE);
    img.fireError(); // CDN fails -> swap to badge
    img.fireError(); // badge also fails -> hide
    expect(img.style.display).toBe('none');
  });
});
