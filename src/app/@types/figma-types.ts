import { TokenType, TypographyGenerativeOptions } from ".";
import { TokenForVisualisation } from "./model";
export type FigmaFont = {
  family: string;
  styles: string[];
};

export enum Set {
  globalTokens = "globalTokens",
  Alias = "Alias"
}

export type ColourData = {
  id?: string;
  name: string;
  shades: Shade[];
}[];

export type Shade = {
  id?: string;
  name: string;
  value: FigmaRGBA;
};

export type Font = {
  id?: string;
  value: string;
  description?: string;
  styles: string[];
};

export enum TypographyModeEnum {
  edit = "edit",
  preview = "preview"
}

export type TypoStyle = {
  name: string;
  valuesByMode: {
    value: {
      fontSize: number;
      textDecoration: TextDecoration;
      fontName: FontName;
      letterSpacing: LetterSpacing;
      lineHeight: LineHeight;
      leadingTrim: LeadingTrim;
      paragraphIndent: number;
      paragraphSpacing: number;
      listSpacing: number;
      hangingPunctuation: boolean;
      hangingList: boolean;
      textCase: TextCase;
    };
  };
};

export type TypographyData = {
  generativeOptions?: TypographyGenerativeOptions;
  fonts: Font[];
  variations: TokenForVisualisation[];
};

export type RadiusData = {
  id?: string;
  name: string;
  valuesByMode: {
    value: number;
  };
}[];

export type StrokeData = {
  id?: string;
  name: string;
  valuesByMode: {
    value: number;
  };
}[];

export type SpacingData = {
  id?: string;
  name: string;
  valuesByMode: {
    value: number;
  };
}[];

export type EffectData = {
  name: string;
  id?: string;
  valuesByMode: {
    value: {
      effects: Effect[];
    };
  };
}[];

export type TokenVisualizationPayload = {
  setType: Set;
  tokenType: TokenType;
  data: {
    [TokenType.COLORS]?: ColourData;
    [TokenType.TYPOGRAPHY]?: TypographyData;
    [TokenType.RADIUS]?: RadiusData;
    [TokenType.STROKE]?: StrokeData;
    [TokenType.SPACING]?: SpacingData;
    [TokenType.EFFECTS]?: EffectData;
  };
  mode?: TypographyModeEnum;
  currentToken?: string;
};

export type FigmaVariableResolvedDataType =
  | "BOOLEAN"
  | "COLOR"
  | "FLOAT"
  | "STRING"
  | "VARIABLE_ALIAS";

export interface FigmaVariableAlias {
  type: "VARIABLE_ALIAS";
  id: string;
}

export interface FigmaRGBA {
  // "Red"
  r: number;
  // "Green"
  g: number;
  // "Blue"
  b: number;
  // "Alpha" or "opacity"
  a: number;
}

export interface FigmaRGB {
  r: number;
  g: number;
  b: number;
}

export type TextDecoration = "NONE" | "UNDERLINE" | "STRIKETHROUGH";

export interface FontName {
  family: string;
  style: string;
}

export interface LetterSpacing {
  value: number;
  unit: "PIXELS" | "PERCENT";
}

export type LineHeight =
  | {
      value: number;
      unit: "PIXELS" | "PERCENT";
    }
  | {
      unit: "AUTO";
    };

export type LeadingTrim = "CAP_HEIGHT" | "NONE";

export type TextCase =
  | "ORIGINAL"
  | "UPPER"
  | "LOWER"
  | "TITLE"
  | "SMALL_CAPS"
  | "SMALL_CAPS_FORCED";

export type VariableBindableTextField =
  | "fontFamily"
  | "fontSize"
  | "fontStyle"
  | "fontWeight"
  | "letterSpacing"
  | "lineHeight"
  | "paragraphSpacing"
  | "paragraphIndent";

export type LayoutGrid = RowsColsLayoutGrid | GridLayoutGrid;

export type VariableBindableLayoutGridField =
  | "sectionSize"
  | "count"
  | "offset"
  | "gutterSize";

export interface RowsColsLayoutGrid {
  pattern: "ROWS" | "COLUMNS";
  alignment: "MIN" | "MAX" | "STRETCH" | "CENTER";
  gutterSize: number;
  count: number;
  sectionSize?: number;
  offset?: number;
  visible?: boolean;
  color?: FigmaRGBA;
  boundVariables?: {
    [field in VariableBindableLayoutGridField]?: FigmaVariableAlias;
  };
}

export interface GridLayoutGrid {
  pattern: "GRID";
  sectionSize: number;
  visible?: boolean;
  color?: FigmaRGBA;
  boundVariables?: {
    ["sectionSize"]?: FigmaVariableAlias;
  };
}

export interface Vector {
  x: number;
  y: number;
}

export type BlendMode =
  | "PASS_THROUGH"
  | "NORMAL"
  | "DARKEN"
  | "MULTIPLY"
  | "LINEAR_BURN"
  | "COLOR_BURN"
  | "LIGHTEN"
  | "SCREEN"
  | "LINEAR_DODGE"
  | "COLOR_DODGE"
  | "OVERLAY"
  | "SOFT_LIGHT"
  | "HARD_LIGHT"
  | "DIFFERENCE"
  | "EXCLUSION"
  | "HUE"
  | "SATURATION"
  | "COLOR"
  | "LUMINOSITY";

export type VariableBindableEffectField =
  | "color"
  | "radius"
  | "spread"
  | "offsetX"
  | "offsetY";

export interface DropShadowEffect {
  type: "DROP_SHADOW";
  color: FigmaRGBA;
  offset: Vector;
  radius: number;
  spread?: number;
  visible: boolean;
  blendMode: BlendMode;
  showShadowBehindNode?: boolean;
  boundVariables?: {
    [field in VariableBindableEffectField]?: FigmaVariableAlias;
  };
}

export type VariableBindableGridStyleField = "layoutGrids";

export interface InnerShadowEffect {
  type: "INNER_SHADOW";
  color: FigmaRGBA;
  offset: Vector;
  radius: number;
  spread?: number;
  visible: boolean;
  blendMode: BlendMode;
  boundVariables?: {
    [field in VariableBindableEffectField]?: FigmaVariableAlias;
  };
}

export interface BlurEffect {
  type: "LAYER_BLUR" | "BACKGROUND_BLUR";
  radius: number;
  visible: boolean;
  boundVariables?: {
    ["radius"]?: FigmaVariableAlias;
  };
}

export type Effect = DropShadowEffect | InnerShadowEffect | BlurEffect;

export type VariableBindableEffectStyleField = "effects";

export interface EffectStyle {
  type: "EFFECT";
  effects: Effect[];
  boundVariables?: {
    [field in VariableBindableEffectStyleField]?: FigmaVariableAlias[];
  };
}

export interface GridStyle {
  layoutGrids: LayoutGrid[];
  boundVariables?: {
    [field in VariableBindableGridStyleField]?: FigmaVariableAlias[];
  };
}

export interface TextStyle {
  fontSize: number;
  textDecoration: TextDecoration;
  fontName: FontName;
  letterSpacing: LetterSpacing;
  lineHeight: LineHeight;
  leadingTrim: LeadingTrim;
  paragraphIndent: number;
  paragraphSpacing: number;
  listSpacing: number;
  hangingPunctuation: boolean;
  hangingList: boolean;
  textCase: TextCase;
  boundVariables?: {
    [field in VariableBindableTextField]?: FigmaVariableAlias;
  };
}

export type FigmaVariableValueType =
  | string
  | number
  | boolean
  | FigmaRGB
  | FigmaRGBA
  | FigmaVariableAlias;
