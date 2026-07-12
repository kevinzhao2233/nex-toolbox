import { parseDocument } from 'yaml';
import type { Document } from 'yaml';
import { Diagnostic, linter, lintGutter } from '@codemirror/lint';
import { EditorView } from 'codemirror';
import { Extension } from '@codemirror/state';

function jsonLinter() {
  return (view: EditorView) => {
    const diagnostics: Diagnostic[] = [];
    try {
      JSON.parse(view.state.doc.toString());
    } catch (e: any) {
      // 从错误信息里解析出位置
      const message = e.message;
      const posMatch = message.match(/position (\d+)/);
      if (posMatch) {
        const pos = Number(posMatch[1]);
        diagnostics.push({
          from: pos,
          to: pos + 1,
          severity: 'error',
          message: e.message,
        });
      } else {
        diagnostics.push({
          from: 0,
          to: view.state.doc.length,
          severity: 'error',
          message: e.message,
        });
      }
    }
    return diagnostics;
  };
}

function yamlLinter() {
  return (view: EditorView): Diagnostic[] => {
    const diagnostics: Diagnostic[] = [];
    try {
      const doc: Document.Parsed = parseDocument(view.state.doc.toString());
      if (doc.errors.length) {
        for (const err of doc.errors) {
          diagnostics.push({
            from: err.pos[0],
            to: err.pos[1] ?? err.pos[0] + 1,
            severity: 'error',
            message: err.message,
          });
        }
      }
    } catch (e: any) {
      diagnostics.push({
        from: 0,
        to: view.state.doc.length,
        severity: 'error',
        message: e.message,
      });
    }
    return diagnostics;
  };
}

export const linterMap: Record<string, () => Extension[]> = {
  json: () => [lintGutter(), linter(jsonLinter())],
  yaml: () => [lintGutter(), linter(yamlLinter())],
};
