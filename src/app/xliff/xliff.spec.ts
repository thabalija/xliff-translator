import { SEGMENT_ATTRIBUTE_NAME } from '../core/constants';
import { parseXliff } from './parse';
import { serializeSourceFile, serializeTranslationFile } from './serialize';

const SAMPLE = `<?xml version="1.0"?>
<xliff xmlns="urn:oasis:names:tc:xliff:document:2.0" version="2.0" srcLang="en-US">
  <file id="testFile">
    <unit id="unit1">
      <segment state="initial">
        <source>Hello</source>
      </segment>
    </unit>
  </file>
</xliff>`;

describe('parseXliff', () => {
  it('parses units and stamps a runtime id', () => {
    const parsed = parseXliff(SAMPLE, 'test.xlf');
    expect(parsed.units).toHaveLength(1);
    expect(parsed.units[0]?.source).toBe('Hello');
    expect(parsed.fileInfo.sourceLang).toBe('en-US');
    expect(parsed.fileInfo.totalUnits).toBe(1);
    expect(parsed.xml).toContain(SEGMENT_ATTRIBUTE_NAME);
  });

  it('rejects XLIFF 1.2', () => {
    const xliff12 = `<?xml version="1.0"?><xliff version="1.2"><file></file></xliff>`;
    expect(() => parseXliff(xliff12, 'old.xlf')).toThrow(/XLIFF 1.2/);
  });
});

describe('serialize', () => {
  it('writes target text and language without leaking the runtime id', () => {
    const parsed = parseXliff(SAMPLE, 'test.xlf');
    const unit = parsed.units[0];
    if (!unit) {
      throw new Error('expected a unit');
    }
    const xml = serializeTranslationFile(
      parsed.xml,
      [{ ...unit, target: 'Hallo', targetState: 'translated' }],
      'de',
    );
    expect(xml).toContain('Hallo');
    expect(xml).toContain('trgLang="de"');
    expect(xml).not.toContain(SEGMENT_ATTRIBUTE_NAME);
  });

  it('updates source text', () => {
    const parsed = parseXliff(SAMPLE, 'test.xlf');
    const unit = parsed.units[0];
    if (!unit) {
      throw new Error('expected a unit');
    }
    const xml = serializeSourceFile(parsed.xml, [{ ...unit, source: 'Hi' }]);
    expect(xml).toContain('Hi');
    expect(xml).not.toContain(SEGMENT_ATTRIBUTE_NAME);
  });
});
