import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import {
  Archive,
  BookOpen,
  Code,
  Compass,
  CreditCard,
  Download,
  Library,
  Lightbulb,
  List,
  MessageCircle,
  Package,
  PenLine,
  Plug,
  Rocket,
  Tag,
  Terminal,
  Workflow,
} from 'lucide-react';

// lucide icons registered into the MDX scope so content pages can use them
// directly — e.g. <Card icon={<Terminal />} ... /> — without per-file imports.
const icons = {
  Archive,
  BookOpen,
  Code,
  Compass,
  CreditCard,
  Download,
  Library,
  Lightbulb,
  List,
  MessageCircle,
  Package,
  PenLine,
  Plug,
  Rocket,
  Tag,
  Terminal,
  Workflow,
};

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ...icons,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
