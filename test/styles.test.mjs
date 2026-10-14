import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const css = readFileSync(join(process.cwd(), 'styles.css'), 'utf8');

// Auton Knowledge defines --agent-border-hairline as a whole border shorthand
// (`border: var(--agent-border-hairline)`); `var(--agent-border-hairline) solid <color>`
// is invalid at computed-value time and the browser drops the border entirely.
describe('styles.css', () => {
  it('should use the host hairline token as a whole border value when drawing borders', () => {
    expect(css).not.toMatch(/var\(--agent-border-hairline[^)]*\)\s+solid/u);
    expect(css).toMatch(/var\(--agent-border-hairline, 1px solid /u);
  });
});
