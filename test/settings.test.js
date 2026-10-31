import { describe, it, expect } from 'vitest';
import { entityFrom, ENTITY_FIELDS } from '../src/settings.js';
describe('site settings', () => {
  it('sends only the entity fields, trimmed, empty when unset', () => {
    const e = entityFrom({ fieldData: { 'legal-name': '  Example ApS ', secret: 'x' } });
    expect(Object.keys(e)).toEqual(ENTITY_FIELDS);
    expect(e['legal-name']).toBe('Example ApS');
    expect(e['registration-number']).toBe('');
    expect(entityFrom(null)['legal-name']).toBe('');
  });
});
