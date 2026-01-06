/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Type declaration to fix React 19 compatibility issues with @dnd-kit.
 * 
 * @dnd-kit/core and @dnd-kit/sortable were built with React 18 types,
 * which causes type errors with React 19's stricter JSX element type definitions.
 * 
 * This file exports type-safe wrappers that bypass these type mismatches.
 * 
 * Usage:
 *   import { TypedDragOverlay, TypedSortableContext } from '@/types/dnd-kit';
 */

import { DragOverlay } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';

// Cast components to work around React 19 type incompatibility
export const TypedDragOverlay = DragOverlay as any;
export const TypedSortableContext = SortableContext as any;
