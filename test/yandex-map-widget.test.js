import widget from '../src/yandex-map-widget';
import fileUrl from 'file-url';
import path from 'path';

describe('widget', () => {
  it('is an object with load method', () => {
    expect(widget).toMatchObject({
      load: expect.any(Function)
    });
  });

  describe('widget.load', () => {
    const src = fileUrl(
      path.resolve(__dirname, 'yandex-map-widget.vendor.mock.js')
    );

    beforeEach(() => {
      widget.promise = null;
      document.querySelectorAll('script').forEach(script => script.remove());
    });

    it('returns promise, that resolves to vendor widget object', () => {
      return expect(widget.load(src))
        .resolves
        .toMatchObject({
          ready: expect.any(Function)
        });
    });

    it(`appends script element to body
        with a given src and type "text/javascript"`, () => {
      return widget.load(src).then(() => {
        const script = document.querySelector('script');
        expect(script).toBeDefined();
        expect(script.src).toBe(src);
        expect(script.type).toBe('text/javascript');
      });
    });

    it(`doesn't append the script twice`, () => {
      return Promise
        .all([
          widget.load(src),
          widget.load(src)
        ])
        .then(() => {
          expect(document.querySelectorAll('script')).toHaveLength(1);
        });
    });

    it(`rejects if the script src is invalid`, () => {
      return expect(widget.load('wrong_url')).rejects.toBeDefined();
    });
  })
})
