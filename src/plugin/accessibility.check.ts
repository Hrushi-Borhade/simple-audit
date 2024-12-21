import { type Oklch, formatHex } from "culori/fn";
import { converter } from "culori";
export interface UIColor {
  hex: string;
  oklch: Oklch;
}

export type FigmaPaint = Paint | (SolidPaint & UIColor);

export type FigmaColorSpace = "DISPLAY_P3" | "LEGACY" | "SRGB";

export enum SelectionMessageTypes {
  invalidBackground = "invalidBackground",
  unprocessedBlendModes = "unprocessedBlendModes"
}

export interface PolychromNode {
  blendMode: BlendMode;
  children: PolychromNode[];
  fills: FigmaPaint[];
  id: string;
  isSelected?: boolean;
  name: string;
  nestingLevel: number;
  opacity?: number;
  parents: readonly SceneNode[];
  visible?: boolean;
  zIndex?: number;
}

enum PairState {
  InvalidBackground = "Invalid background",
  InvalidBlendMode = "Has invalid blend mode"
}

export const getNodeFills = (
  node: PageNode | PolychromNode | SceneNode
): Paint[] => {
  if ("fills" in node) {
    return typeof node.fills === "symbol" ? [] : Array.from(node.fills);
  }

  if ("backgrounds" in node) {
    return typeof node.backgrounds === "symbol"
      ? []
      : Array.from(node.backgrounds);
  }

  return [];
};

export const notEmpty = <TValue>(
  value: null | TValue | undefined
): value is TValue => value !== null && value !== undefined;

export const isEmpty = <TValue>(
  value: null | TValue | undefined
): value is null | undefined => value === null || value === undefined;

export const getActualFill = (
  fills: FigmaPaint[] | readonly Paint[]
): Paint | undefined => {
  return Array.from(fills)
    .reverse()
    .find(
      (fill) =>
        fill.visible === true && notEmpty(fill.opacity) && fill.opacity > 0
    );
};

export const isValidForSelection = (node: SceneNode): boolean => {
  if (!node.visible) {
    return false;
  }

  if ("opacity" in node && node.opacity === 0) return false;

  if ("fills" in node) {
    if (typeof node.fills === "symbol") {
      return false;
    } else {
      const actualFill = getActualFill(node.fills);

      if (notEmpty(actualFill)) {
        return actualFill.type === "SOLID";
      } else {
        return false;
      }
    }
  }

  return false;
};

const isValidSelection = (
  pair: PairState | PolychromNode
): pair is PolychromNode => {
  return (
    notEmpty(pair) &&
    pair !== PairState.InvalidBackground &&
    pair !== PairState.InvalidBlendMode
  );
};

const convertToOklch = converter("oklch");
export const collectNodeParents = (
  node: PageNode | SceneNode,
  parents: SceneNode[] = []
): SceneNode[] => {
  if (notEmpty(node.parent)) {
    if (node.parent.type === "PAGE" || node.parent.type === "DOCUMENT")
      return parents;

    parents.push(node.parent);

    collectNodeParents(node.parent, parents);
  }
  return parents;
};

export const createPolychromNode = (
  node: PageNode | SceneNode,
  selectedNodeId?: string
): PolychromNode => {
  const fills = getNodeFills(node);
  const parents = collectNodeParents(node);

  return {
    blendMode: "blendMode" in node ? node.blendMode : "PASS_THROUGH",
    children: [],
    fills: fills.map((fill) => {
      if (fill.type === "SOLID") {
        return {
          ...fill,
          hex: formatHex({ ...fill.color, mode: "rgb" }),
          oklch: convertToOklch({ ...fill.color, mode: "rgb" }, "oklch")
        };
      } else {
        return fill;
      }
    }),
    id: node.id,
    isSelected: node.id === selectedNodeId,
    name: node.name,
    nestingLevel: parents.length,
    opacity: "opacity" in node ? node.opacity : 1,
    parents,
    visible: "visible" in node ? node.visible : true,
    zIndex: node.parent?.children.findIndex((child) => {
      return child.id === node.id;
    })
  };
};

export const getSiblingsThatAreBelowByZIndex = (
  targetNode: SceneNode,
  allNodes: readonly SceneNode[]
): SceneNode[] => {
  const targetIndex = allNodes.indexOf(targetNode);

  return targetIndex === -1 ? [] : allNodes.slice(0, targetIndex + 1);
};

export const areNodesIntersecting = (
  node: SceneNode,
  selectedNode: SceneNode
): boolean => {
  if (!hasBoundingBox(selectedNode)) return false;

  return (
    hasBoundingBox(node) &&
    isContainedIn(node.absoluteBoundingBox, selectedNode.absoluteBoundingBox) &&
    "visible" in node &&
    node.visible
  );
};

export const isContainedIn = (outer: Rect, inner: Rect): boolean =>
  inner.x >= outer.x &&
  inner.y >= outer.y &&
  inner.x + inner.width <= outer.x + outer.width &&
  inner.y + inner.height <= outer.y + outer.height;

export const hasBoundingBox = (
  node: SceneNode
): node is SceneNode & { absoluteBoundingBox: Rect } =>
  "absoluteBoundingBox" in node && notEmpty(node.absoluteBoundingBox);

const ifSelectedNodeIsChild = (
  node: SceneNode,
  selectedNode: SceneNode
): boolean => {
  return (
    "children" in node && node.children.some((n) => n.id === selectedNode.id)
  );
};

export const traverseAndCheckIntersections = (
  nodes: SceneNode[],
  selectedNode: SceneNode
): PolychromNode[] => {
  return nodes.reduce((accumulator: PolychromNode[], node) => {
    if (areNodesIntersecting(node, selectedNode)) {
      const polychromNode = createPolychromNode(node, selectedNode.id);

      if ("children" in node && node.children.length > 0) {
        const childrenNodes = ifSelectedNodeIsChild(node, selectedNode)
          ? getSiblingsThatAreBelowByZIndex(selectedNode, node.children)
          : Array.from(node.children);

        polychromNode.children = traverseAndCheckIntersections(
          childrenNodes,
          selectedNode
        );
      }

      accumulator.push(polychromNode);
    }

    return accumulator;
  }, []);
};

export const getIntersectingNodes = (
  selectedNode: SceneNode
): PolychromNode => {
  const currentPageNodes = Array.from(figma.currentPage.children);

  const isNodeInRoot = currentPageNodes.some(
    (node) => node.id === selectedNode.id
  );

  const lookUpNodes = isNodeInRoot
    ? getSiblingsThatAreBelowByZIndex(selectedNode, currentPageNodes)
    : currentPageNodes;

  const intersectingNodes = traverseAndCheckIntersections(
    lookUpNodes,
    selectedNode
  );

  const polychromPageNode = createPolychromNode(
    figma.currentPage,
    selectedNode.id
  );

  polychromPageNode.children = intersectingNodes;

  return polychromPageNode;
};
export const flattenPolychromNodesTree = (
  nodesTree: PolychromNode,
  parentNestingLevel = 0
): PolychromNode[] => {
  let flatNodes: PolychromNode[] = [nodesTree];

  nodesTree.children.forEach((node) => {
    const updatedNode = { ...node, nestingLevel: parentNestingLevel + 1 };

    flatNodes.push(updatedNode);

    if (node.children.length > 0) {
      flatNodes = flatNodes.concat(
        flattenPolychromNodesTree(node, updatedNode.nestingLevel)
      );
    }
  });

  return flatNodes;
};
const unprocessedBlendModes = ["LINEAR_BURN"];

const hasValidBlendMode = (fill: FigmaPaint): boolean => {
  if (isEmpty(fill.blendMode)) return true;

  return !unprocessedBlendModes.includes(fill.blendMode);
};

export const isVisibleSolidFill = (fill: FigmaPaint): boolean =>
  fill.visible === true &&
  (notEmpty(fill.opacity) ? fill.opacity > 0 : true) &&
  fill.type === "SOLID";

export const sortByDepthAndOrder = (
  flatNodesList: PolychromNode[]
): PolychromNode[] => {
  return flatNodesList.sort((a, b) => {
    const levelDifference = b.nestingLevel - a.nestingLevel;
    const zIndexDifference = Math.abs(b.zIndex ?? 0) - Math.abs(a.zIndex ?? 0);

    return levelDifference !== 0 ? levelDifference : zIndexDifference;
  });
};
export const getActualNode = (
  nodes: PolychromNode[]
): PolychromNode | undefined => {
  return nodes.find(
    (node) =>
      node.visible === true &&
      notEmpty(node.opacity) &&
      node.opacity > 0 &&
      node.fills.length > 0 &&
      node.fills.some(
        (fill) =>
          fill.visible === true && notEmpty(fill.opacity) && fill.opacity > 0
      )
  );
};

export const hasOnlyValidBlendModes = (nodes: PolychromNode): boolean =>
  flattenPolychromNodesTree(nodes).every(
    (node) =>
      node.fills
        .filter((fill) => isVisibleSolidFill(fill))
        .every(hasValidBlendMode) &&
      !unprocessedBlendModes.includes(node.blendMode)
  );
export const isValidForBackground = (nodesTree: PolychromNode): boolean => {
  const flattenNodesList = flattenPolychromNodesTree(nodesTree);

  const sortedFlattenNodesList = sortByDepthAndOrder(flattenNodesList);

  const sortedFlattenNodesWithoutSelected = sortedFlattenNodesList.filter(
    (node) => node.isSelected === false
  );

  const actualNode = getActualNode(sortedFlattenNodesWithoutSelected);

  if (isEmpty(actualNode)) return false;

  const actualFill = getActualFill(actualNode?.fills);

  if (isEmpty(actualFill)) return false;

  return actualFill.type === "SOLID";
};

export const buildGeneralSelectionPayload = (
  selection: readonly SceneNode[]
) => {
  const selectedNodePairs = selection
    .filter(isValidForSelection)
    .map((selectedNode) => {
      const intersectingNodesTree = getIntersectingNodes(selectedNode);

      if (!hasOnlyValidBlendModes(intersectingNodesTree)) {
        return PairState.InvalidBlendMode;
      }

      if (isValidForBackground(intersectingNodesTree)) {
        return intersectingNodesTree;
      } else {
        return PairState.InvalidBackground;
      }
    });

  const isSingleInvalidBackground =
    selectedNodePairs.some((pair) => pair === PairState.InvalidBackground) &&
    selectedNodePairs.length === 1;
  const areAllInvalidBackgrounds =
    selectedNodePairs.length > 1 &&
    selectedNodePairs.every((pair) => pair === PairState.InvalidBackground);

  if (isSingleInvalidBackground || areAllInvalidBackgrounds) {
    return {
      colorSpace: figma.root.documentColorProfile,
      text: SelectionMessageTypes.invalidBackground
    };
  }

  if (selectedNodePairs.some((pair) => pair === PairState.InvalidBlendMode)) {
    return {
      colorSpace: figma.root.documentColorProfile,
      text: SelectionMessageTypes.unprocessedBlendModes
    };
  }

  return {
    colorSpace: figma.root.documentColorProfile,
    selectedNodePairs: selectedNodePairs.filter(isValidSelection)
  };
};
