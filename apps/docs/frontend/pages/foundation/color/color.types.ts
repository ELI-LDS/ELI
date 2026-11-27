export interface ColorToken {
  name: string;
  label: string;
  value: string;
  reference: string;
  opacity: string | null;
  light: boolean;
}
export interface PaletteGroup { name: string; tokens: ColorToken[] }
export interface SemanticToken extends ColorToken { description: string }
export interface SemanticGroup { name: string; tokens: SemanticToken[] }
export type ColorTab = 'primitive' | 'semantic';
