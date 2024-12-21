import { TokenHierarchy } from "@/functions";
import { ReactNode } from "react";
import {
  ComponentTokenItem,
  ComponentTokenType,
  HydratedDocument,
  TokenDocument
} from "./model";
import {
  ColourData,
  EffectData,
  RadiusData,
  SpacingData,
  StrokeData,
  TypographyData
} from "./figma-types";

export type ComponentVisualizationPayload = {
  previewKey: string;
  componentTokens: {
    [K in ComponentTokenType]: ComponentTokenItem<K>[];
  };
};

export type ProjectDataResponse<T extends TokenType = TokenType.TYPOGRAPHY> = {
  _id: T;
  tokens: TokenDocument[];
  generativeOptions: GenerativeOptionsMetadata[T];
};

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export const enum SocketTypes {
  TOKEN = "TOKEN",
  COMPONENT = "COMPONENT",
  AUTH = "AUTH"
}

export enum ColorPositionFunctionName {
  LinearPosition = "linearPosition",
  // ExponentialPosition = "exponentialPosition",
  // QuadraticPosition = "quadraticPosition",
  // CubicPosition = "cubicPosition",
  // QuarticPosition = "quarticPosition",
  SinusoidalPosition = "sinusoidalPosition",
  // AsinusoidalPosition = "asinusoidalPosition",
  // ArcPosition = "arcPosition",
  SmoothStepPosition = "smoothStepPosition"
}

export enum ColorInfoEnum {
  PRIMARY = "Primary",
  SECONDARY = "Secondary",
  ACCENT = "Accent",
  NEUTRAL = "Neutral",
  ERROR = "Error",
  WARNING = "Warning",
  SUCCESS = "Success",
  TERTIARY = "Tertiary"
}

export type ColorGenerativeOptionsType = {
  name: string;
  anchors: string[];
  alphaShadeCount: number;
  normalShadeCount: number;
  positionFunction: ColorPositionFunctionName;
  colorInfo: ColorInfoEnum;
};

export enum EditorMode {
  ADD = "Add",
  EDIT = "Edit"
}
export enum ShadeTypeEnum {
  ALPHA = "Alpha",
  NORMAL = "Normal"
}

export const enum VariationSizing {
  TSHIRT = "TSHIRT",
  NUMBERED = "NUMBERED"
}

export enum EffectsStyleVariation {
  SOFT_DIFFUSION = "Soft diffusion",
  NEOBRUTALISM = "Neobrutalism",
  SIMPLE_SHADOW = "Simple Shadow",
  HARD_DIFFUSION = "Hard diffusion",
  SUNKEN = "Sunken",
  SUBTLE_STROKE = "Subtle Stroke"
}

export type TypographyGenerativeOptionsFontType = {
  value: string;
  styles: string[];
};

export type ColorGenerativeOptions = {
  [TokenType.COLORS]: {
    isGenerated?: boolean;
    feedbackColors: ColorGenerativeOptionsType[];
    baseColors: ColorGenerativeOptionsType[];
  };
};

export type TypographyGenerativeOptions = {
  [TokenType.TYPOGRAPHY]: {
    isGenerated?: boolean;
    baseSize: number;
    scale: number;
    headingFontIndex: number;
    bodyFontIndex: number;
    headingCount: number;
    bodyCount: number;
    fonts: TypographyGenerativeOptionsFontType[];
  };
};

export type SpacingGenerativeOptions = {
  [TokenType.SPACING]: {
    isGenerated?: boolean;
    baseSize: number;
    variationSizingStyle: VariationSizing;
    variationCount: number;
  };
};

export type StrokeGenerativeOptions = {
  [TokenType.STROKE]: {
    isGenerated?: boolean;
    baseSize: number;
    variationSizingStyle: VariationSizing;
    variationCount: number;
  };
};

export type RadiusGenerativeOptions = {
  [TokenType.RADIUS]: {
    isGenerated?: boolean;
    baseSize: number;
    variationSizingStyle: VariationSizing;
    variationCount: number;
  };
};

export type EffectsGenerativeOptions = {
  [TokenType.EFFECTS]: {
    isGenerated?: boolean;
    effect: EffectsStyleVariation;
    variationCount: number;
  };
};

export const enum GridLayoutEnum {
  COLUMN = "column",
  ROW = "row",
  GRID = "grid"
}

export enum GridStyleVariation {
  NONE = "none",
  COMPACT = "compact",
  BALANCED = "balanced",
  EXPANDED = "expanded"
}

export type GridGenerativeOptions = {
  [TokenType.GRID]: {
    isGenerated?: boolean;
    grids: Record<GridLayoutEnum, GridStyleVariation>;
  };
};

export type GenerativeOptionsMetadata = TypographyGenerativeOptions &
  ColorGenerativeOptions &
  SpacingGenerativeOptions &
  StrokeGenerativeOptions &
  RadiusGenerativeOptions &
  EffectsGenerativeOptions &
  GridGenerativeOptions & { _id: string };

export type TokenEditor = {
  isEditing: boolean;
  editorJSX: ReactNode | null;
};

export type SidebarType = {
  isExpanded: boolean;
  tokenHierarchyByTokenType: TokenHierarchyByTokenType;
};

type TokenHierarchyByTokenType = {
  [K in TokenType]: {
    tokenHierarchy: TokenHierarchy;
    selectedGroup: string[];
  };
};

export type PluginSize = {
  isMaximised: boolean;
  dimensions?: {
    width: number;
    height: number;
  };
};

export type UserLocation = {
  status: string;
  country: string;
  countryCode: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  org: string;
  as: string;
  query: string;
};

export type UserSession = {
  projectId: string;
  setId: string;
  userId: string;
  location: UserLocation;
  pro: boolean;
};

export const enum RouteTab {
  TOKENS = "/project/:projectId/tokens",
  COMPONENTS = "/project/:projectId/components",
  PROFILE = "/profile",
  USER_PROFILE = "/profile/user-profile",
  ALL_PROJECTS = "/profile/all-projects",
  MANAGE_SUBSCRIPTION = "/profile/manage-subscription",
  DOCS = "/profile/docs"
}

export type AsyncOrSyncFunction<T> = () => T | Promise<T>;

export type ClientStoreDataType = {
  did: string;
  isFirstPluginVisit: boolean;
  user: UserStateType;
};

type BaseUser = {
  _id: string;
  name: string;
  photoUrl: string | null;
};

export type IFigmaUser = {
  color: string;
  sessionId: number;
  proStatus?: boolean;
} & BaseUser;

export type UserStateType = {
  _id: string;
  email: string;
  did: string;
  firebaseUserId: string;
  name: string;
  isOnboardingDone: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  figmaUser?: any;
};

export type LayoutStateType = {
  isSidebarOpen: boolean;
  isPluginMaximized: boolean;
  editorJSX: ReactNode;
  isEditorOpen: boolean;
};

export type Token = {
  name: string;
  isGenValue: boolean;
  tokenType: TokenType;
  valuesByMode: TokenValuesByMode | TokenStyleValue;
  setId: string;
  projectId: string;
};

export type HierarchyNode = {
  _id?: string;
  name: string;
  isEndNode: boolean;
  children?: HierarchyNode[];
  isGenValue?: boolean;
  tokenType?: TokenType;
  valuesByMode?: TokenValuesByMode | TokenStyleValue;
  setId?: string | HydratedDocument<IProject> | undefined;
  projectId?: string | HydratedDocument<IProject> | undefined;
};

export enum TokenType {
  COLORS = "COLORS",
  TYPOGRAPHY = "TYPOGRAPHY",
  SPACING = "SPACING",
  GRID = "GRID",
  RADIUS = "RADIUS",
  STROKE = "STROKE",
  EFFECTS = "EFFECTS"
}

export const enum TokenVariableAcceptedTokenTypes {
  BOOLEAN = "BOOLEAN",
  COLOR = "COLOR",
  FLOAT = "FLOAT",
  STRING = "STRING",
  VARIABLE_ALIAS = "VARIABLE_ALIAS"
}

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export const enum TokenStyleAcceptedTokenTypes {
  TEXT = "TEXT",
  EFFECT = "EFFECT",
  GRID = "GRID"
}

export type TokenBooleanValueByMode = {
  type: TokenVariableAcceptedTokenTypes.BOOLEAN;
  value: boolean;
};

export type TokenStringValueByMode = {
  type: TokenVariableAcceptedTokenTypes.STRING;
  value: string;
};

export type TokenFloatValueByMode = {
  type: TokenVariableAcceptedTokenTypes.FLOAT;
  value: number;
};

export type TokenAliasValueByMode = {
  type: TokenVariableAcceptedTokenTypes.VARIABLE_ALIAS;
  value: FigmaVariableAlias;
};

export type TokenColorValueByMode = {
  type: TokenVariableAcceptedTokenTypes.COLOR;
  value: FigmaRGB | FigmaRGBA;
};

export type TokenTextStyleValue = {
  type: TokenStyleAcceptedTokenTypes.TEXT;
  value: TextStyle;
};

export type TokenGridStyleValue = {
  type: TokenStyleAcceptedTokenTypes.GRID;
  value: GridStyle;
};

export type TokenEffectsStyleValue = {
  type: TokenStyleAcceptedTokenTypes.EFFECT;
  value: EffectStyle;
};

export type TokenStyleValue =
  | TokenTextStyleValue
  | TokenGridStyleValue
  | TokenEffectsStyleValue;

export type TokenValuesByModeType =
  | TokenBooleanValueByMode
  | TokenStringValueByMode
  | TokenFloatValueByMode
  | TokenAliasValueByMode
  | TokenColorValueByMode;

export type TokenValuesByMode = {
  [K in Exclude<string, keyof TokenStyleValue>]: TokenValuesByModeType;
};

export type FigmaVariableResolvedDataType =
  | "BOOLEAN"
  | "COLOR"
  | "FLOAT"
  | "STRING"
  | "VARIABLE_ALIAS";

export type FigmaResolvableType = "BOOLEAN" | "COLOR" | "FLOAT" | "STRING";

export type FigmaVariableAlias = {
  type: "VARIABLE_ALIAS";
  id: string;
};

export type FigmaRGBA = {
  // "Red"
  r: number;
  // "Green"
  g: number;
  // "Blue"
  b: number;
  // "Alpha" or "opacity"
  a: number;
};

export type FigmaRGB = {
  r: number;
  g: number;
  b: number;
};

export type TextDecoration = "NONE" | "UNDERLINE" | "STRIKETHROUGH";

export type FontName = {
  family: string;
  style: string;
};

export type LetterSpacing = {
  value: number;
  unit: "PIXELS" | "PERCENT";
};

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

export type RowsColsLayoutGrid = {
  pattern: "ROWS" | "COLUMNS";
  alignment: "MIN" | "MAX" | "STRETCH" | "CENTER";
  gutterSize: number;
  count: number;
  sectionSize?: number;
  offset: number;
  visible?: boolean;
  color?: FigmaRGBA;
  boundVariables?: {
    [field in VariableBindableLayoutGridField]?: FigmaVariableAlias;
  };
};

export type GridLayoutGrid = {
  pattern: "GRID";
  sectionSize: number;
  visible?: boolean;
  color?: FigmaRGBA;
  boundVariables?: {
    ["sectionSize"]?: FigmaVariableAlias;
  };
};

export type Vector = {
  x: number;
  y: number;
};

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

export type DropShadowEffect = {
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
};

export type VariableBindableGridStyleField = "layoutGrids";

export type InnerShadowEffect = {
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
};

export type BlurEffect = {
  type: "LAYER_BLUR" | "BACKGROUND_BLUR";
  radius: number;
  visible: boolean;
  boundVariables?: {
    ["radius"]?: FigmaVariableAlias;
  };
};

export type Effect = DropShadowEffect | InnerShadowEffect | BlurEffect;

export type VariableBindableEffectStyleField = "effects";

export type EffectStyle = {
  type: "EFFECT";
  effects: Effect[];
  boundVariables?: {
    [field in VariableBindableEffectStyleField]?: FigmaVariableAlias[];
  };
};

export type GridStyle = {
  layoutGrids: LayoutGrid[];
  boundVariables?: {
    [field in VariableBindableGridStyleField]?: FigmaVariableAlias[];
  };
};

export type TextStyle = {
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
};

export type FigmaVariableValueType =
  | string
  | number
  | boolean
  | FigmaRGB
  | FigmaRGBA
  | FigmaVariableAlias;

export type IProjectMetadata = {
  description?: string;
};

export type ISetMode = {
  _id: string;
  name: string;
};

export type IProject = {
  _id: string;
  name: string;
  createdByUserId: string;
  setIds: string[];
  collaboratorIds?: string[];
  projectMetadata?: IProjectMetadata;
  createdAt: string;
};

export type ISet = {
  _id: string;
  name: string;
  isGlobal: boolean;
  projectId: string;
  generativeOptionsId: string;
  modes: ISetMode[];
};

export type ExportTokenPayload = {
  projectId: string;
  projectName: string;
  supportsModes: boolean;
  tokenTypes: TokenType[];
  sets: {
    id: string;
    name: string;
    modes: Mode[];
  }[];
  tokens?: TokenDocument[];
  styles?: TokenDocument[];
};

type Mode = {
  id: string;
  name: string;
};

export type ComponentUpdateEvent<
  T extends ComponentTokenType = ComponentTokenType.TYPOGRAPHY
> = {
  componentId: string;
  componentTokenType: T;
  componentTokenId: string;
  boundVariable: ComponentTokenItem<T>["boundVariable"];
};

export type ExportSheetsPayload = {
  tokenTypes: TokenType[];
  data: {
    [TokenType.COLORS]?: ColourData;
    [TokenType.TYPOGRAPHY]?: TypographyData;
    [TokenType.SPACING]?: SpacingData;
    [TokenType.STROKE]?: StrokeData;
    [TokenType.RADIUS]?: RadiusData;
    [TokenType.EFFECTS]?: EffectData;
  };
};

export enum SubscriptionType {
  ANNUAL = "annual",
  QUARTERLY = "quarterly"
}

export type OnboardingState = {
  run: boolean;
  stepIndex: number;
  tourActive: boolean;
};

export enum ComponentFilter {
  ALL = "ALL",
  UNLINKED = "UNLINKED",
  LINKED = "LINKED"
}
