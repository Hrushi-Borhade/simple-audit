// import { buildGeneralSelectionPayload } from "./accessibility.check";
import { Oklch } from "culori";
import { buildGeneralSelectionPayload } from "./accessibility.check";
import { getAllChildren } from "./read.canvas";
import { receive } from "figma-await-ipc";
const pluginDimensions = {
  width: 400,
  height: 600,
  minimizedWidth: 400,
  minimizedHeight: 50,
  padding: 20
};

const figmaMessageTypes = {
  createRectangle: "create-rectangle",
  successMessage: "success-message",
  readFromFile: "read-from-file",
  selectionChange: "selection-change",
  sendBlendRes: "send-blend-res"
};

figma.showUI(__html__, { themeColors: true, height: 300 });
figma.ui.resize(pluginDimensions.width, pluginDimensions.height);

figma.on("run", async () => {
  figma.loadAllPagesAsync();
});

export const getCurrentPageSelection = (): readonly SceneNode[] => {
  try {
    return figma.currentPage.selection;
  } catch (error) {
    console.log("Error getting current page selection", error);
    return [];
  }
};
export interface ContrastConclusion {
  apca: number;
  bg: { hex: string; isBlended: boolean; oklch: Oklch };
  fg: { hex: string; isBlended: boolean; oklch: Oklch };
  id: string;
}
export type ContrastConclusionList = ContrastConclusion[];

figma.on("selectionchange", async () => {
  try {
    const currentSelection = getCurrentPageSelection();
    console.log("currentSelection", currentSelection);
    const messagePayload = buildGeneralSelectionPayload(currentSelection);
    console.log("message payload from plugin to ui", messagePayload);

    figma.ui.postMessage({
      payload: messagePayload,
      type: figmaMessageTypes.selectionChange
    });
  } catch (error) {
    console.log("Error on selection change", error);
    figma.ui.postMessage({
      payload: {
        colorSpace: figma.root.documentColorProfile,
        selectedNodePairs: []
      },
      type: figmaMessageTypes.selectionChange
    });
  }
});

receive(figmaMessageTypes.createRectangle, async (numberOfRectangles = 5) => {
  try {
    const nodes: SceneNode[] = [];
    for (let i = 0; i < numberOfRectangles; i++) {
      const rect = figma.createRectangle();
      rect.x = i * 150;
      rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
      figma.currentPage.appendChild(rect);
      nodes.push(rect);
    }
    figma.currentPage.selection = nodes;
    figma.viewport.scrollAndZoomIntoView(nodes);
    return {
      success: true,
      message: "Rectangles created successfully"
    };
  } catch (error: unknown) {
    return {
      success: false,
      error: error
    };
  }
});

receive(figmaMessageTypes.readFromFile, async () => {
  const page = figma.currentPage;
  console.log("in progress...");
  const res = await getAllChildren(page);
  console.log("function execution is done", res);

  console.log("accessibility_issue", res.accessibility_issue);

  console.log("components", res.components);

  console.log("spacing", res.spacing);

  console.log("cornerRadius", res.cornerRadius);

  console.log("colors", res.colors);

  console.log("effects", res.effects);

  console.log("text", res.text);

  console.log("grids", res.grids);

  console.log("end of function");

  const data = {
    uniqueColors: res.colors?.uniqueColors,
    uniqueSpacing: res.spacing?.uniqueSpacing,
    uniqueCornerRadius: res.cornerRadius?.uniqueCornerRadius
  };

  return {
    success: true,
    message: "Read from file",
    data
  };
});

// import { Oklch } from "culori";
// import { buildGeneralSelectionPayload } from "./accessibility.check";
// import { getAllChildren, getComponentInstances } from "./read.canvas";
// import { receive } from "figma-await-ipc";

// // Constants
// const UI_DIMENSIONS = {
//   width: 400,
//   height: 600,
//   minimizedWidth: 400,
//   minimizedHeight: 50,
//   padding: 20
// } as const;

// const MESSAGE_TYPES = {
//   createRectangle: "create-rectangle",
//   successMessage: "success-message",
//   readFromFile: "read-from-file",
//   selectionChange: "selection-change",
//   sendBlendRes: "send-blend-res"
// } as const;

// // Types
// export interface ContrastConclusion {
//   apca: number;
//   bg: { hex: string; isBlended: boolean; oklch: Oklch };
//   fg: { hex: string; isBlended: boolean; oklch: Oklch };
//   id: string;
// }
// export type ContrastConclusionList = ContrastConclusion[];

// // Initialize UI
// figma?.showUI?.(__html__, { themeColors: true, height: 300 });
// figma?.ui?.resize?.(UI_DIMENSIONS?.width, UI_DIMENSIONS?.height);

// // Utility Functions
// const logError = (context: string, error: unknown) => {
//   console?.error?.(
//     `Error in ${context}:`,
//     error instanceof Error ? error?.message : "Unknown error"
//   );
// };

// const getCurrentPageSelection = (): readonly SceneNode[] => {
//   try {
//     return figma?.currentPage?.selection ?? [];
//   } catch (error) {
//     logError("getCurrentPageSelection", error);
//     return [];
//   }
// };

// // Event Handlers
// figma?.on?.("run", async () => {
//   try {
//     await figma?.loadAllPagesAsync?.();
//   } catch (error) {
//     logError("plugin initialization", error);
//   }
// });

// figma?.on?.("selectionchange", async () => {
//   try {
//     const currentSelection = getCurrentPageSelection();
//     const messagePayload = buildGeneralSelectionPayload?.(currentSelection);

//     figma?.ui?.postMessage?.({
//       payload: messagePayload,
//       type: MESSAGE_TYPES?.selectionChange
//     });
//   } catch (error) {
//     logError("selectionchange event", error);
//     // Fallback message with empty selection
//     figma?.ui?.postMessage?.({
//       payload: {
//         colorSpace: figma?.root?.documentColorProfile,
//         selectedNodePairs: []
//       },
//       type: MESSAGE_TYPES?.selectionChange
//     });
//   }
// });

// // Message Handlers
// receive?.(MESSAGE_TYPES?.createRectangle, async (numberOfRectangles = 5) => {
//   try {
//     const nodes: SceneNode[] = [];

//     for (let i = 0; i < numberOfRectangles; i++) {
//       try {
//         const rect = figma?.createRectangle?.();
//         if (rect) {
//           rect.x = i * 150;
//           rect.fills = [{ type: "SOLID", color: { r: 1, g: 0.5, b: 0 } }];
//           figma?.currentPage?.appendChild?.(rect);
//           nodes.push(rect);
//         }
//       } catch (error) {
//         logError(`creating rectangle ${i + 1}`, error);
//         continue;
//       }
//     }

//     if (nodes?.length > 0) {
//       figma.currentPage && (figma.currentPage.selection = nodes);
//       figma?.viewport?.scrollAndZoomIntoView?.(nodes);
//     }

//     return {
//       success: nodes?.length === numberOfRectangles,
//       message: `Created ${nodes?.length} out of ${numberOfRectangles} rectangles`
//     };
//   } catch (error) {
//     logError("createRectangle handler", error);
//     return {
//       success: false,
//       error: error instanceof Error ? error?.message : "Unknown error"
//     };
//   }
// });

// receive?.(MESSAGE_TYPES?.readFromFile, async () => {
//   try {
//     const page = figma?.currentPage;
//     const results: Record<string, unknown> = {};

//     // Get all children with error handling for each operation
//     try {
//       const {
//         colors,
//         spacing,
//         cornerRadius,
//         componentSupportedNodes,
//         effects,
//         text,
//         grids
//       } = await getAllChildren(page);

//       results.colors = colors;
//       results.spacing = spacing;
//       results.cornerRadius = cornerRadius;
//       results.componentSupportedNodes = componentSupportedNodes;
//       results.effects = effects;
//       results.text = text;
//       results.grids = grids;
//     } catch (error) {
//       logError("getAllChildren", error);
//     }

//     // Process text nodes if available
//     if (results?.text?.nodes) {
//       const { styledNodes, rawNodes } = results?.text?.nodes?.reduce?.(
//         (acc, node) => {
//           try {
//             if (
//               (node?.boundVariables &&
//                 Object.keys(node?.boundVariables)?.length > 0) ||
//               node?.textStyleId
//             ) {
//               acc.styledNodes.push(node);
//             } else {
//               acc.rawNodes.push(node);
//             }
//           } catch (error) {
//             logError(`processing text node ${node?.id}`, error);
//           }
//           return acc;
//         },
//         { styledNodes: [], rawNodes: [] }
//       ) ?? { styledNodes: [], rawNodes: [] };

//       results.styledTextNodes = styledNodes;
//       results.rawTextNodes = rawNodes;
//     }

//     // Process component instances if available
//     if (results?.componentSupportedNodes?.[0]) {
//       try {
//         await getComponentInstances?.(results?.componentSupportedNodes?.[0]);
//       } catch (error) {
//         logError("getComponentInstances", error);
//       }
//     }

//     // Attempt to focus on first raw text node
//     try {
//       if (results?.rawTextNodes?.[0]?.id) {
//         const node = await figma?.getNodeByIdAsync?.(
//           results?.rawTextNodes?.[0]?.id
//         );
//         if (node) {
//           figma?.viewport?.scrollAndZoomIntoView?.([node]);
//           figma?.currentPage && (figma.currentPage.selection = [node]);
//         }
//       }
//     } catch (error) {
//       logError("focusing on text node", error);
//     }

//     return {
//       success: true,
//       message: "File processing completed",
//       results
//     };
//   } catch (error) {
//     logError("readFromFile handler", error);
//     return {
//       success: false,
//       error: error instanceof Error ? error?.message : "Unknown error",
//       results: {}
//     };
//   }
// });
