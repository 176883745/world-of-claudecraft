// Guard an external avatar <img> (a Discord CDN profile picture) against a failed
// load. When the CDN image cannot be fetched (an ad-blocker or privacy extension
// blocking cdn.discordapp.com, a stale or deleted avatar hash, a transient network
// error, or a reverse-proxy CSP), the browser paints its own broken-image
// placeholder in place of the picture: a jarring generic icon on an in-world
// nameplate or unit frame. Every OTHER image on those surfaces is a locally
// generated data-URL (tier badge, raid marker) that cannot fail; the linked-Discord
// avatar is the one external source, so it is the one that needs a fallback.
//
// On failure this swaps to a local fallback image when one is given (a generated
// data-URL badge, which cannot itself fail), otherwise it hides the element so
// nothing broken shows. The handler attaches once; a fallback that also fails just
// hides. Safe on a reused element (nameplate) and on a throwaway one (a window that
// re-renders its innerHTML): the listener lives and dies with the node.

export function attachAvatarFallback(img: HTMLImageElement, fallbackSrc?: string): void {
  img.addEventListener('error', () => {
    if (fallbackSrc && img.getAttribute('src') !== fallbackSrc) {
      img.src = fallbackSrc;
      return;
    }
    img.style.display = 'none';
  });
}
