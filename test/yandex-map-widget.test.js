import widget from '../src/yandex-map-widget';
import fileUrl from 'file-url';
import path from 'path';

describe('widget', () => {
  it('is an object with load method', () => {
    expect(widget).toMatchObject({
      loadApi: expect.any(Function)
    });
  });

  describe('widget.loadApi', () => {
    const src = fileUrl(
      path.resolve(__dirname, 'yandex-map-widget.vendor.mock.js')
    );

    beforeEach(() => {
      widget.promise = null;
      document.querySelectorAll('script').forEach(script => script.remove());
    });

    it('returns promise, that resolves to vendor widget object', () => {
      return expect(widget.loadApi(src))
        .resolves
        .toMatchObject({
          ready: expect.any(Function)
        });
    });

    it(`appends script element to body
        with a given src and type "text/javascript"`, () => {
      return widget.loadApi(src).then(() => {
        const script = document.querySelector('script');
        expect(script).toBeDefined();
        expect(script.src).toBe(src);
        expect(script.type).toBe('text/javascript');
      });
    });

    it(`doesn't append the script twice`, () => {
      return Promise
        .all([
          widget.loadApi(src),
          widget.loadApi(src)
        ])
        .then(() => {
          expect(document.querySelectorAll('script')).toHaveLength(1);
        });
    });

    it(`rejects if the script src is invalid`, () => {
      return expect(widget.loadApi('wrong_url')).rejects.toBeDefined();
    });
  })
});
