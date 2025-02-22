import { expect, fixture, html } from '@open-wc/testing';
import type SlAvatar from './avatar';

describe('<sl-avatar>', () => {
  let el: SlAvatar;

  describe('when provided no parameters', () => {
    before(async () => {
      el = await fixture<SlAvatar>(html` <sl-avatar label="Avatar"></sl-avatar> `);
    });

    it('passes accessibility test', async () => {
      await expect(el).to.be.accessible();
    });

    it('should default to circle styling', () => {
      const part = el.shadowRoot!.querySelector('[part="base"]')!;
      expect(el.getAttribute('shape')).to.eq('circle');
      expect(part.classList.value.trim()).to.eq('avatar avatar--circle');
    });
  });

  describe('when provided an image and label parameter', () => {
    const image = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    const label = 'Small transparent square';
    before(async () => {
      el = await fixture<SlAvatar>(html`<sl-avatar image="${image}" label="${label}"></sl-avatar>`);
    });

    it('passes accessibility test', async () => {
      /**
       * The image element itself is ancillary, because it's parent container contains the
       * aria-label which dictates what "sl-avatar" is. This also implies that label text will
       * resolve to "" when not provided and ignored by readers. This is why we use alt="" on
       * the image element to pass accessibility.
       * https://html.spec.whatwg.org/multipage/images.html#ancillary-images
       */
      await expect(el).to.be.accessible();
    });

    it('renders "image" part, with src and a role of presentation', () => {
      const part = el.shadowRoot!.querySelector('[part="image"]')!;

      expect(part.getAttribute('src')).to.eq(image);
    });

    it('renders the label attribute in the "base" part', () => {
      const part = el.shadowRoot!.querySelector('[part="base"]')!;

      expect(part.getAttribute('aria-label')).to.eq(label);
    });
  });

  describe('when provided initials parameter', () => {
    const initials = 'SL';
    before(async () => {
      el = await fixture<SlAvatar>(html`<sl-avatar initials="${initials}" label="Avatar"></sl-avatar>`);
    });

    it('passes accessibility test', async () => {
      await expect(el).to.be.accessible();
    });

    it('renders "initials" part, with initials as the text node', () => {
      const part = el.shadowRoot!.querySelector<HTMLElement>('[part="initials"]')!;

      expect(part.innerText).to.eq(initials);
    });
  });

  ['square', 'rounded', 'circle'].forEach(shape => {
    describe(`when passed a shape attribute ${shape}`, () => {
      before(async () => {
        el = await fixture<SlAvatar>(html`<sl-avatar shape="${shape}" label="Shaped avatar"></sl-avatar>`);
      });

      it('passes accessibility test', async () => {
        await expect(el).to.be.accessible();
      });

      it('appends the appropriate class on the "base" part', () => {
        const part = el.shadowRoot!.querySelector('[part="base"]')!;

        expect(el.getAttribute('shape')).to.eq(shape);
        expect(part.classList.value.trim()).to.eq(`avatar avatar--${shape}`);
      });
    });
  });

  describe('when passed a <span>, on slot "icon"', () => {
    before(async () => {
      el = await fixture<SlAvatar>(html`<sl-avatar label="Avatar"><span slot="icon">random content</span></sl-avatar>`);
    });

    it('passes accessibility test', async () => {
      await expect(el).to.be.accessible();
    });

    it('should accept as an assigned child in the shadow root', () => {
      const slot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name=icon]')!;
      const childNodes = slot.assignedNodes({ flatten: true }) as HTMLElement[];

      expect(childNodes.length).to.eq(1);

      const span = childNodes[0];
      expect(span.innerHTML).to.eq('random content');
    });
  });
});
