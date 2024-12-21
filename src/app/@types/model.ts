// import { HydratedDocument, Types } from "mongoose";
import {
  FigmaRGB,
  FigmaRGBA,
  FigmaResolvableType,
  TokenStyleValue,
  TokenType,
  TokenValuesByMode
} from ".";
import { Effect, TextStyle } from "./figma-types";

export type TokenForVisualisation = Pick<IToken, "valuesByMode" | "name"> & {
  resolvedType?: FigmaResolvableType;
};

export type HydratedDocument<T> = T & {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};

export const enum GenerativeOptionsType {
  SET = "SET",
  TOKEN = "TOKEN"
}

type IGenerativeOptionsColorOption = {
  name: string;
  value: FigmaRGBA | FigmaRGB;
};

export type IGenerativeOptionsColorMetadata = {
  [TokenType.COLORS]: {
    colors: IGenerativeOptionsColorOption[];
  };
};

export type TokenTypeOtherThanColor = Exclude<TokenType, TokenType.COLORS>;

export type IGenerativeOptionsGenericMetadata = {
  [K in TokenTypeOtherThanColor]: {
    baseValue: number;
  };
};

export type IGenerativeOptionsMetadata =
  | IGenerativeOptionsGenericMetadata
  | IGenerativeOptionsColorMetadata;

export interface IGenerativeOptions {
  type: GenerativeOptionsType;
  metadata: IGenerativeOptionsMetadata;
}
export type GenerativeOptionsDocument = HydratedDocument<IGenerativeOptions>;

interface BaseUser {
  _id: string;
  name: string;
  photoUrl: string | null;
}

export interface IFigmaUser extends BaseUser {
  color: string;
  sessionId: number;
  proStatus?: boolean;
}
export type FigmaUserDocument = HydratedDocument<IFigmaUser>;

export interface IUser {
  name?: string;
  email: string;
  did: string;
  firebaseUserId: string;
  figmaUser?: string | FigmaUserDocument;
  onboarding?: Record<string, string>;
  // paymentDetails?: object;
  // pro?: boolean;
}
export type UserDocument = HydratedDocument<IUser>;

export interface ISet {
  name: string;
  isGlobal: boolean;
  tokenIds: TokenDocument[];
  projectId: string | ProjectDocument;
  generativeOptionsId: string | GenerativeOptionsDocument;
  modes: ISetMode[];
}
export type SetDocument = HydratedDocument<ISet>;

export type ISetMode = {
  id: string;
  name: string;
};

export interface IToken {
  name: string;
  isGenValue: boolean;
  tokenType: TokenType;
  resolvedType: FigmaResolvableType;
  valuesByMode: TokenValuesByMode | TokenStyleValue;
  setId: string | HydratedDocument<ISet>;
  projectId: string | HydratedDocument<IProject>;
}
export type TokenDocument = HydratedDocument<IToken>;

export type IProjectMetadata = {
  description?: string;
};

export interface IProject {
  name: string;
  createdByUserId: string | UserDocument;
  collaboratorIds?: UserDocument[];
  setIds: (string | SetDocument)[];
  projectMetadata?: IProjectMetadata;
}
export type ProjectDocument = HydratedDocument<IProject>;

export enum ComponentType {
  FUNDAMENTALS = "FUNDAMENTALS",
  ATOM = "ATOM",
  MOLECULE = "MOLECULE",
  ORGANISM = "ORGANISM"
}
export enum ComponentTokenType {
  COLORS = "COLORS",
  TYPOGRAPHY = "TYPOGRAPHY",
  SPACING = "SPACING",
  RADIUS = "RADIUS",
  STROKE = "STROKE",
  EFFECTS = "EFFECTS"
}
export interface IRequiredDefaultComponent {
  _id: string | DefaultComponentDocument;
  type: ComponentType;
}

export interface IComponentMetadata {
  description: string;
  variants: number;
  properties: number;
  booleans: number;
  gifLink: string;
}

export interface IRequiredComponent {
  _id: string | ComponentDocument;
  type: ComponentType;
}

export type IComponentTokens = {
  [K in ComponentTokenType]: ComponentTokenItem<K>[];
};
export interface IDefaultComponent {
  name: string;
  type: ComponentType;
  metadata: IComponentMetadata;
  publishedKey?: string;
  previewKey?: string;
  exportSheets?: string[];
  componentTokens?: IComponentTokens;
  requiredComponents: IRequiredDefaultComponent[];
  fundamentals: IFundamentalDefaultComponent[];
}

export type DefaultComponentDocument = HydratedDocument<IDefaultComponent>;
export interface IComponent {
  // name: string;
  defaultComponentId: string | DefaultComponentDocument;
  projectId: string | ProjectDocument;
  exportMetadata: object;
  componentTokens: IComponentTokens;
  requiredComponents: IRequiredComponent[];
  fundamentals: IFundamentalComponent[];
}
export type ComponentDocument = HydratedDocument<IComponent>;

export interface ComponentTokenValueBase {
  id: string;
  name: string;
}

export interface TextComponentTokenValue extends ComponentTokenValueBase {
  value: Omit<TextStyle, "type">;
}
export interface EffectComponentTokenValue extends ComponentTokenValueBase {
  value: Effect[];
}

export interface ColorComponentTokenValue extends ComponentTokenValueBase {
  value: FigmaRGBA;
}
export interface FloatComponentTokenValue extends ComponentTokenValueBase {
  value: number;
}
export interface ComponentTokenBase {
  property?: string;
  _id: string;
  id: string;
  name: string;
  count: number;
}

export enum ComponentTokenValueType {
  EFFECT = "EFFECT",
  COLOR = "COLOR",
  TEXT = "TEXT",
  FLOAT = "FLOAT"
}

export interface TextComponentToken extends ComponentTokenBase {
  type: ComponentTokenValueType.TEXT;
  token?: TextComponentTokenValue;
  exportValue: TextComponentTokenValue;
  boundVariable?: TextComponentTokenValue;
}

export interface FloatComponentToken extends ComponentTokenBase {
  type: ComponentTokenValueType.FLOAT;
  token?: FloatComponentTokenValue;
  exportValue: FloatComponentTokenValue;
  boundVariable?: FloatComponentTokenValue;
}
export interface ColorComponentToken extends ComponentTokenBase {
  type: ComponentTokenValueType.COLOR;
  token?: ColorComponentTokenValue;
  exportValue: ColorComponentTokenValue;
  boundVariable?: ColorComponentTokenValue;
}
export interface EffectComponentToken extends ComponentTokenBase {
  type: ComponentTokenValueType.EFFECT;
  token?: EffectComponentTokenValue;
  exportValue: EffectComponentTokenValue;
  boundVariable?: EffectComponentTokenValue;
}

export type ComponentTokenItem<T extends ComponentTokenType> =
  ComponentTokenBase &
    (T extends ComponentTokenType.TYPOGRAPHY
      ? TextComponentToken
      : T extends ComponentTokenType.EFFECTS
        ? EffectComponentToken
        : T extends ComponentTokenType.COLORS
          ? ColorComponentToken
          : FloatComponentToken);

export type ComponentVisualizationPayload = {
  previewKey: string;
  componentTokens: IComponent["componentTokens"];
};

export interface IFundamentalDefaultComponent {
  _id: string | DefaultComponentDocument;
}

export interface IFundamentalComponent {
  _id: string | ComponentDocument;
}

export interface IRequiedComponent {
  id: string;
  name: string;
}

export type ComponentExportPayload = {
  id: string;
  name: string;
  publishedKey: string;
  previewKey: string;
  exportSheets: string[];
  type: string;
  componentTokens: IComponent["componentTokens"];
  fundamentals: {
    id: string;
    name: string;
    publishedKey: string;
  }[];
  requiredComponents: IRequiedComponent[];
};
