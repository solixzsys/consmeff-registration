import { TreeNode } from 'primeng/api';

export interface HierarchyLevel {
    level: number;
    levelName: string;
    totalItems: number;
    identifiers: string[];
    identifierType: string;
  }
  
  export interface HierarchyInfo {
    levels: HierarchyLevel[];
    hierarchyTree: Map<string, string[]>;
    summary: {
      totalLevels: number;
      deepestLevel: number;
      itemCount: number;
    };
  }
  
  export interface LevelInfo {
    level: number;
    levelName: string;
    totalItems: number;
    identifiers: string[];
    identifierType: string;
  }
  
  export interface HierarchySummary {
    totalLevels: number;
    deepestLevel: number;
    itemCount: number;
  }
  
  export interface SupplyChainHierarchy {
    levels: LevelInfo[];
    hierarchyTree: Record<string, string[]>;
    summary: HierarchySummary;
  }

  // export interface TreeNode {
  //   label: string;
  //   data: string;
  //   type: string;
  //   styleClass: string;
  //   expanded: boolean;
  //   children: TreeNode[];
  // }
  
  export interface TimelineEvent {
    level: number;
    levelName: string;
    totalItems: number;
    identifierType: string;
    icon: string;
    color: string;
    delay: number;
  }

  export interface HierarchyTreeNode extends TreeNode {
    label?: string;
    data?: any;
    type?: string;
    styleClass?: string;
    expanded?: boolean;
    children?: HierarchyTreeNode[];
  }