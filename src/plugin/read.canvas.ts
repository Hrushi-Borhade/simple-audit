import { APCAcontrast, displayP3toY, sRGBtoY } from "apca-w3";

export type FigmaColorSpace = "DISPLAY_P3" | "LEGACY" | "SRGB";

export const calculateApcaScore = (
  fg: RGB,
  bg: RGB,
  colorSpace: FigmaColorSpace
): number => {
  try {
    if (colorSpace === "DISPLAY_P3") {
      const fgY = displayP3toY([fg.r, fg.g, fg.b]);
      const bgY = displayP3toY([bg.r, bg.g, bg.b]);
      const contrast = APCAcontrast(fgY, bgY);
      return Math.round(Number(contrast));
    } else {
      const fgDecimal = convertDecimalRGBto255Scale(fg);
      const bgDecimal = convertDecimalRGBto255Scale(bg);
      return Math.round(
        Number(
          APCAcontrast(
            sRGBtoY([fgDecimal.r, fgDecimal.g, fgDecimal.b]),
            sRGBtoY([bgDecimal.r, bgDecimal.g, bgDecimal.b])
          )
        )
      );
    }
  } catch (error) {
    console.error("Error calculating APCA score:", error);
    return 0;
  }
};

export const conclusions = {
  "Fluent Text": 90,
  "Body Text": 75,
  "Content Text": 60,
  "Large Text": 45,
  "Non-Text": 30,
  "Not Readable": 15,
  Invisible: 0
};

export const getConclusionByScore = (value: number): string => {
  try {
    const entries = Object.entries(conclusions);
    for (const [conclusion, conclusionValue] of entries) {
      if (value >= conclusionValue) {
        return conclusion;
      }
    }
    return "Invalid Value";
  } catch (error) {
    console.error("Error getting conclusion:", error);
    return "Error";
  }
};

export const convertDecimalRGBto255Scale = (color: {
  b: number;
  g: number;
  r: number;
}): { b: number; g: number; r: number } => {
  try {
    const { b, g, r } = color;
    return {
      b: Math.round(b * 255),
      g: Math.round(g * 255),
      r: Math.round(r * 255)
    };
  } catch (error) {
    console.error("Error converting RGB scale:", error);
    return { b: 0, g: 0, r: 0 };
  }
};

// Constants for supported node types
export const SUPPORTED_NODES = {
  fill: [
    "BooleanOperation",
    "Component",
    "ComponentSet",
    "Ellipse",
    "Frame",
    "Highlight",
    "Instance",
    "Line",
    "Polygon",
    "Rectangle",
    "Section",
    "ShapeWithText",
    "Stamp",
    "Star",
    "Sticky",
    "TableCell",
    "Table",
    "Text",
    "TextSublayer",
    "Vector",
    "WashiTape"
  ],
  stroke: [
    "BooleanOperation",
    "Component",
    "ComponentSet",
    "Connector",
    "Ellipse",
    "Frame",
    "Highlight",
    "Instance",
    "Line",
    "Polygon",
    "Rectangle",
    "ShapeWithText",
    "Stamp",
    "Star",
    "Text",
    "Vector",
    "WashiTape"
  ],
  spacing: [
    "Component",
    "ComponentSet",
    "Frame",
    "InferredAutoLayoutResult",
    "Instance"
  ],
  effect: [
    "BooleanOperation",
    "Component",
    "ComponentSet",
    "Ellipse",
    "Frame",
    "Group",
    "Highlight",
    "Instance",
    "Line",
    "Polygon",
    "Rectangle",
    "Stamp",
    "Star",
    "Text",
    "Vector",
    "WashiTape"
  ],
  cornerRadius: [
    "BooleanOperation",
    "Component",
    "ComponentSet",
    "Ellipse",
    "Frame",
    "Highlight",
    "Instance",
    "Polygon",
    "Rectangle",
    "Star",
    "Vector"
  ],
  grid: ["Component", "ComponentSet", "Frame", "Instance"],
  icon: ["Vector"],
  text: ["ShapeWithText", "Text", "TextSublayer"]
};

// Helper functions
export function normalizeColor(color, opacity = 1) {
  try {
    if (!color) return null;
    return `${color.r.toFixed(4)}-${color.g.toFixed(4)}-${color.b.toFixed(4)}-${opacity}`;
  } catch (error) {
    console.error("Error normalizing color:", error);
    return null;
  }
}

export async function getStyleById(styleId) {
  try {
    if (!styleId) return null;
    return await figma.getStyleByIdAsync(styleId);
  } catch (error) {
    console.error("Error fetching style:", error);
    return null;
  }
}

export function updateFrequencyMap(collection, key, value) {
  try {
    if (!collection || !key || value == null) return;

    const existingItem = collection.find((item) => item[key] === value);
    if (existingItem) {
      existingItem.frequency += 1;
    } else {
      collection.push({ [key]: value, frequency: 1 });
    }
  } catch (error) {
    console.error("Error updating frequency map:", error);
  }
}

export async function getAllChildren(node) {
  if (!node) {
    console.error("No node provided to getAllChildren");
    return null;
  }

  const result = {
    colors: {
      fills: [],
      strokes: [],
      text: [],
      icons: [],
      uniqueStyles: [],
      uniqueColors: []
    },
    spacing: {
      nodes: [],
      uniqueSpacing: []
    },
    effects: {
      effects: [],
      uniqueEffects: [],
      uniqueStyles: []
    },
    text: {
      nodes: [],
      uniqueText: [],
      uniqueStyles: []
    },
    grids: {
      grids: [],
      uniqueGrids: []
    },
    cornerRadius: {
      nodes: [],
      uniqueCornerRadius: []
    },
    components: {
      nodes: [],
      uniqueComponents: []
    },
    accessibility_issue: {
      textNodes: []
    }
  };

  async function processFills(node, nodeType) {
    try {
      if (!SUPPORTED_NODES?.fill?.find((n) => n?.toLowerCase() === nodeType))
        return;
      if (!node?.fills?.length) return;

      const fillStyle = await getStyleById(node?.fillStyleId);
      if (fillStyle) {
        // Handle unique styles frequency
        const existingStyle = result?.colors?.uniqueStyles?.find(
          (style) => style?.id === fillStyle?.id
        );
        if (existingStyle) {
          existingStyle.frequency = (existingStyle.frequency ?? 0) + 1;
          existingStyle.nodeIds?.push(node?.id);
        } else {
          result?.colors?.uniqueStyles?.push({
            ...fillStyle,
            frequency: 1,
            nodeIds: [node?.id]
          });
        }
      }

      const processedFills = fillStyle
        ? [{ ...node?.fills[0], fillStyle }]
        : node?.fills;

      if (SUPPORTED_NODES?.text?.find((n) => n?.toLowerCase() === nodeType)) {
        result?.colors?.text?.push(processedFills);
      } else if (
        SUPPORTED_NODES?.icon?.find((n) => n?.toLowerCase() === nodeType)
      ) {
        result?.colors?.icons?.push(processedFills);
      } else {
        result?.colors?.fills?.push(processedFills);
      }

      node?.fills?.forEach((fill) => {
        if (fill?.type === "SOLID") {
          const normalizedColor = normalizeColor(fill?.color, fill?.opacity);
          if (normalizedColor) {
            const existingColor = result?.colors?.uniqueColors?.find(
              (color) => color?.name === normalizedColor
            );
            if (existingColor) {
              existingColor.frequency = (existingColor.frequency ?? 0) + 1;
              existingColor.nodeIds?.push(node?.id);
            } else {
              result?.colors?.uniqueColors?.push({
                name: normalizedColor,
                color: { ...fill?.color },
                opacity: fill?.opacity,
                frequency: 1,
                nodeIds: [node?.id]
              });
            }
          }
        }
      });
    } catch (error) {
      console.error("Error processing fills:", error);
    }
  }
  // Process Strokes
  async function processStrokes(node, nodeType) {
    try {
      if (!SUPPORTED_NODES?.stroke?.find((n) => n?.toLowerCase() === nodeType))
        return;
      if (!node?.strokes?.length) return;

      const strokeStyle = await getStyleById(node?.strokeStyleId);
      if (strokeStyle) {
        const existingStyle = result?.colors?.uniqueStyles?.find(
          (style) => style?.id === strokeStyle?.id
        );
        if (existingStyle) {
          existingStyle.frequency = (existingStyle.frequency ?? 0) + 1;
          existingStyle.nodeIds?.push(node?.id);
        } else {
          result?.colors?.uniqueStyles?.push({
            ...strokeStyle,
            frequency: 1,
            nodeIds: [node?.id]
          });
        }
        result?.colors?.strokes?.push([{ ...node?.strokes[0], strokeStyle }]);
      } else {
        result?.colors?.strokes?.push(node?.strokes);
      }

      node?.strokes?.forEach((stroke) => {
        if (stroke?.type === "SOLID") {
          const normalizedColor = normalizeColor(
            stroke?.color,
            stroke?.opacity
          );
          if (normalizedColor) {
            const existingColor = result?.colors?.uniqueColors?.find(
              (color) => color?.name === normalizedColor
            );
            if (existingColor) {
              existingColor.frequency = (existingColor.frequency ?? 0) + 1;
              existingColor.nodeIds?.push(node?.id);
            } else {
              result?.colors?.uniqueColors?.push({
                name: normalizedColor,
                color: { ...stroke?.color },
                opacity: stroke?.opacity,
                frequency: 1,
                nodeIds: [node?.id]
              });
            }
          }
        }
      });
    } catch (error) {
      console.error("Error processing strokes:", error);
    }
  }
  // Process Effects
  // Helper function to normalize effect for comparison
  function normalizeEffect(effect) {
    const baseEffect = {
      type: effect?.type,
      visible: effect?.visible
    };

    switch (effect?.type) {
      case "DROP_SHADOW":
      case "INNER_SHADOW":
        return {
          ...baseEffect,
          color: `${effect?.color?.r}-${effect?.color?.g}-${effect?.color?.b}-${effect?.color?.a}`,
          offset: `${effect?.offset?.x}-${effect?.offset?.y}`,
          radius: effect?.radius,
          spread: effect?.spread || 0,
          blendMode: effect?.blendMode,
          showShadowBehindNode: effect?.showShadowBehindNode || false
        };
      case "LAYER_BLUR":
      case "BACKGROUND_BLUR":
        return {
          ...baseEffect,
          radius: effect?.radius
        };
      default:
        return baseEffect;
    }
  }

  // Helper function to generate a unique key for an entire effects array
  function getEffectsKey(effects) {
    const normalizedEffects = effects
      .filter((effect) => effect?.visible)
      .map((effect) => normalizeEffect(effect))
      .sort((a, b) => {
        // Sort by type first, then by other properties
        if (a?.type !== b?.type) return a?.type?.localeCompare(b?.type);
        return JSON.stringify(a)?.localeCompare(JSON.stringify(b));
      });
    return JSON.stringify(normalizedEffects);
  }

  async function processEffects(node, nodeType) {
    try {
      if (!SUPPORTED_NODES?.effect?.find((n) => n?.toLowerCase() === nodeType))
        return;
      if (!node?.effects?.length) return;

      const effectStyle = await getStyleById(node?.effectStyleId);

      // Process effects for uniqueStyles as before
      if (effectStyle) {
        const existingStyle = result?.effects?.uniqueStyles?.find(
          (style) => style?.id === effectStyle?.id
        );
        if (existingStyle) {
          existingStyle.frequency = (existingStyle.frequency ?? 0) + 1;
          existingStyle.nodeIds?.push(node?.id);
        } else {
          result?.effects?.uniqueStyles?.push({
            ...effectStyle,
            frequency: 1,
            nodeIds: [node?.id]
          });
        }
        result?.effects?.effects?.push([{ ...node?.effects[0], effectStyle }]);
      } else {
        result?.effects?.effects?.push(node?.effects);
      }

      // Process the entire effects array as one unit
      const effectsKey = getEffectsKey(node?.effects);

      const existingEffectGroup = result?.effects?.uniqueEffects?.find(
        (unique) => getEffectsKey(unique?.value) === effectsKey
      );

      if (existingEffectGroup) {
        if (!existingEffectGroup?.nodeIds?.includes(node?.id)) {
          existingEffectGroup?.nodeIds?.push(node?.id);
        }
      } else {
        result?.effects?.uniqueEffects?.push({
          value: [...node.effects], // Store the entire effects array
          nodeIds: [node?.id]
        });
      }
    } catch (error) {
      console.error("Error processing effects:", error);
    }
  }
  // Process Text/Typography
  // Helper function to normalize text properties for comparison
  function normalizeTextProperties(node) {
    return {
      fontSize: node?.fontSize,
      fontName:
        typeof node?.fontName === "object"
          ? `${node?.fontName?.family}-${node?.fontName?.style}`
          : node?.fontName,
      lineHeight:
        typeof node?.lineHeight === "object"
          ? `${node?.lineHeight?.value}-${node?.lineHeight?.unit}`
          : node?.lineHeight,
      letterSpacing:
        typeof node?.letterSpacing === "object"
          ? `${node?.letterSpacing?.value}-${node?.letterSpacing?.unit}`
          : node?.letterSpacing,
      textDecoration: node?.textDecoration || "NONE",
      textCase: node?.textCase || "ORIGINAL"
    };
  }

  // Helper function to generate a unique key for text properties
  function getTextPropertiesKey(node) {
    const normalized = normalizeTextProperties(node);
    return JSON.stringify(normalized);
  }

  function processText(node, nodeType) {
    try {
      if (!SUPPORTED_NODES?.text?.find((n) => n?.toLowerCase() === nodeType))
        return;

      // Process text style (existing logic)
      const textStyle = node?.textStyleId;
      if (textStyle) {
        const existingStyle = result?.text?.uniqueStyles?.find(
          (style) => style?.id === textStyle
        );
        if (existingStyle) {
          existingStyle.frequency = (existingStyle.frequency ?? 0) + 1;
          existingStyle.nodeIds?.push(node?.id);
        } else {
          result?.text?.uniqueStyles?.push({
            id: textStyle,
            nodeIds: [node?.id],
            fontSize: node?.fontSize,
            fontName: node?.fontName,
            lineHeight: node?.lineHeight,
            letterSpacing: node?.letterSpacing,
            textDecoration: node?.textDecoration,
            textCase: node?.textCase,
            frequency: 1
          });
        }
      }

      // Process unique text properties
      const textPropertiesKey = getTextPropertiesKey(node);

      const existingTextGroup = result?.text?.uniqueText?.find(
        (unique) => getTextPropertiesKey(unique?.value) === textPropertiesKey
      );

      if (existingTextGroup) {
        existingTextGroup.frequency = (existingTextGroup.frequency ?? 0) + 1;
        if (!existingTextGroup?.nodeIds?.includes(node?.id)) {
          existingTextGroup.nodeIds?.push(node?.id);
        }
      } else {
        result?.text?.uniqueText?.push({
          value: {
            fontSize: node?.fontSize,
            fontName: node?.fontName,
            lineHeight: node?.lineHeight,
            letterSpacing: node?.letterSpacing,
            textDecoration: node?.textDecoration,
            textCase: node?.textCase
          },
          nodeIds: [node?.id],
          frequency: 1
        });
      }

      result?.text?.nodes?.push(node);
    } catch (error) {
      console.error("Error processing text:", error);
    }
  }

  // Process Grids
  async function processGrids(node, nodeType) {
    try {
      if (!SUPPORTED_NODES?.grid?.find((n) => n?.toLowerCase() === nodeType))
        return;
      if (!node?.layoutGrids?.length) return;

      const gridStyle = await getStyleById(node?.gridStyleId);
      if (gridStyle) {
        const existingGrid = result?.grids?.uniqueGrids?.find(
          (grid) => grid?.id === gridStyle?.id
        );
        if (existingGrid) {
          existingGrid.frequency = (existingGrid.frequency ?? 0) + 1;
          existingGrid.nodeIds?.push(node?.id);
        } else {
          result?.grids?.uniqueGrids?.push({
            ...gridStyle,
            layoutGrids: node?.layoutGrids[0],
            frequency: 1,
            nodeIds: [node?.id]
          });
        }
        result?.grids?.grids?.push([{ ...node?.layoutGrids[0], gridStyle }]);
      } else {
        result?.grids?.grids?.push(node?.layoutGrids);
      }
    } catch (error) {
      console.error("Error processing grids:", error);
    }
  }

  // Process Spacing
  function processSpacing(node, nodeType) {
    try {
      if (!SUPPORTED_NODES?.spacing?.find((n) => n?.toLowerCase() === nodeType))
        return;

      const spacingData = {
        nodeId: node?.id,
        margin: {
          itemSpacing: node?.itemSpacing || null,
          counterAxisSpacing: node?.counterAxisSpacing || null,
          boundVariables: {
            itemSpacing: node?.boundVariables?.itemSpacing || null,
            counterAxisSpacing: node?.boundVariables?.counterAxisSpacing || null
          }
        },
        padding: {
          paddingTop: node?.paddingTop || null,
          paddingRight: node?.paddingRight || null,
          paddingBottom: node?.paddingBottom || null,
          paddingLeft: node?.paddingLeft || null,
          boundVariables: {
            paddingTop: node?.boundVariables?.paddingTop || null,
            paddingRight: node?.boundVariables?.paddingRight || null,
            paddingBottom: node?.boundVariables?.paddingBottom || null,
            paddingLeft: node?.boundVariables?.paddingLeft || null
          }
        }
      };

      const spacingValues = [
        node?.itemSpacing,
        node?.counterAxisSpacing,
        node?.paddingTop,
        node?.paddingRight,
        node?.paddingBottom,
        node?.paddingLeft
      ].filter((value) => value != null);

      spacingValues.forEach((value) => {
        const existingSpacing = result?.spacing?.uniqueSpacing?.find(
          (spacing) => spacing?.value === value
        );
        if (existingSpacing) {
          existingSpacing.frequency = (existingSpacing.frequency ?? 0) + 1;
          existingSpacing.nodeIds?.push(node?.id);
        } else {
          result?.spacing?.uniqueSpacing?.push({
            value,
            frequency: 1,
            nodeIds: [node?.id]
          });
        }
      });

      if (spacingValues.length > 0) {
        result?.spacing?.nodes?.push(spacingData);
      }
    } catch (error) {
      console.error("Error processing spacing:", error);
    }
  }

  // Process Corner Radius
  function processCornerRadius(node, nodeType) {
    try {
      if (
        !SUPPORTED_NODES?.cornerRadius?.find(
          (n) => n?.toLowerCase() === nodeType
        )
      )
        return;
      if (!node?.cornerRadius) return;

      if (node?.cornerRadius === figma.mixed) {
        [
          node?.topLeftRadius,
          node?.topRightRadius,
          node?.bottomLeftRadius,
          node?.bottomRightRadius
        ].forEach((radius) => {
          if (radius != null) {
            const existingRadius =
              result?.cornerRadius?.uniqueCornerRadius?.find(
                (r) => r?.value === radius
              );
            if (existingRadius) {
              existingRadius.frequency = (existingRadius.frequency ?? 0) + 1;
              existingRadius.nodeIds?.push(node?.id);
            } else {
              result?.cornerRadius?.uniqueCornerRadius?.push({
                value: radius,
                frequency: 1,
                nodeIds: [node?.id]
              });
            }
          }
        });
      } else {
        const existingRadius = result?.cornerRadius?.uniqueCornerRadius?.find(
          (r) => r?.value === node?.cornerRadius
        );
        if (existingRadius) {
          existingRadius.frequency = (existingRadius.frequency ?? 0) + 1;
          existingRadius.nodeIds?.push(node?.id);
        } else {
          result?.cornerRadius?.uniqueCornerRadius?.push({
            value: node?.cornerRadius,
            frequency: 1,
            nodeIds: [node?.id]
          });
        }
      }

      const cornerRadiusData = {
        nodeId: node?.id,
        value: node?.cornerRadius,
        boundVariables: {
          topLeftRadius: node?.boundVariables?.topLeftRadius || null,
          topRightRadius: node?.boundVariables?.topRightRadius || null,
          bottomLeftRadius: node?.boundVariables?.bottomLeftRadius || null,
          bottomRightRadius: node?.boundVariables?.bottomRightRadius || null
        }
      };

      result?.cornerRadius?.nodes?.push(cornerRadiusData);
    } catch (error) {
      console.error("Error processing corner radius:", error);
    }
  }

  // Process Components in traverse function
  async function processComponent(node, nodeType) {
    try {
      if (nodeType === "component" || nodeType === "instance") {
        const exists = result?.components?.nodes?.some(
          (existingNode) => existingNode?.id === node?.id
        );
        if (!exists) {
          result?.components?.nodes?.push(node);
        }

        if (nodeType === "instance") {
          const mainComponent = await node?.getMainComponentAsync();
          if (mainComponent) {
            const existingComponent =
              result?.components?.uniqueComponents?.find(
                (component) => component?.id === mainComponent?.id
              );
            if (existingComponent) {
              existingComponent.frequency =
                (existingComponent.frequency ?? 0) + 1;
              existingComponent.nodeIds?.push(node?.id);
            } else {
              result?.components?.uniqueComponents?.push({
                ...mainComponent,
                frequency: 1,
                nodeIds: [node?.id]
              });
            }
          }
        }
      }
    } catch (error) {
      console.error("Error processing component:", error);
    }
  }

  // Main traverse function that uses all process functions
  async function traverse(node) {
    try {
      const nodeType = node?.type?.toLowerCase();

      await processFills(node, nodeType);
      await processStrokes(node, nodeType);
      await processEffects(node, nodeType);
      await processGrids(node, nodeType);
      processText(node, nodeType);
      processSpacing(node, nodeType);
      processCornerRadius(node, nodeType);
      await processComponent(node, nodeType);

      // Process children recursively
      if ("children" in node) {
        try {
          for (const child of node?.children ?? []) {
            try {
              if (child?.type === "TEXT") {
                const parentNodeFill = node?.fills?.find(
                  (fill) =>
                    fill?.visible === true && fill?.opacity && fill?.opacity > 0
                );
                const textNodeFill = child?.fills?.find(
                  (fill) =>
                    fill?.visible === true && fill?.opacity && fill?.opacity > 0
                );

                if (
                  parentNodeFill &&
                  parentNodeFill?.color &&
                  "r" in parentNodeFill.color &&
                  "g" in parentNodeFill.color &&
                  "b" in parentNodeFill.color &&
                  textNodeFill &&
                  "r" in textNodeFill.color &&
                  "g" in textNodeFill.color &&
                  "b" in textNodeFill.color
                ) {
                  const apcaScore = calculateApcaScore(
                    {
                      r: textNodeFill?.color?.r,
                      g: textNodeFill?.color?.g,
                      b: textNodeFill?.color?.b
                    },
                    {
                      r: parentNodeFill?.color?.r,
                      g: parentNodeFill?.color?.g,
                      b: parentNodeFill?.color?.b
                    },
                    figma?.root?.documentColorProfile
                  );

                  if (apcaScore && Math.abs(apcaScore) <= 30) {
                    result?.accessibility_issue?.textNodes?.push({
                      nodeId: child?.id,
                      apca: Math.abs(apcaScore),
                      conclusion: getConclusionByScore(apcaScore)
                    });
                  }
                }
              }
            } catch (error) {
              console.error("Error processing apca score:", error);
            }
            try {
              await traverse(child);
            } catch (childError) {
              console.error("Error processing child node:", childError);
              continue;
            }
          }
        } catch (childrenError) {
          console.error("Error processing children:", childrenError);
        }
      }
    } catch (error) {
      console.error("Error in traverse function:", error);
    }
  }

  try {
    await traverse(node);
    return result;
  } catch (error) {
    console.error("Error in getAllChildren:", error);
    return result; // Return partial result even if there's an error
  }
}
