import type { TemplateName, TemplateTokens } from '../tokens';
import { electronics } from './electronics';
import { fashion } from './fashion';
import { grocery } from './grocery';

/**
 * Registry of shipped templates. Adding a template is one new file plus one
 * line here; nothing in `app/` or `components/` changes.
 */
export const templates: Partial<Record<TemplateName, TemplateTokens>> = {
  fashion,
  grocery,
  electronics,
};

/** Template names that ship with skosh, used by the skosh CLI. */
export const availableTemplates = Object.keys(templates) as TemplateName[];
