import { CarinsurescannerPage } from './app.po';

describe('carinsurescanner App', function() {
  let page: CarinsurescannerPage;

  beforeEach(() => {
    page = new CarinsurescannerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
