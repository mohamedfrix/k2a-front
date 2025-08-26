'use client';

import React from 'react';
import { FilterActionsProps } from '@/types/FilterComponents';

export const FilterActions: React.FC<FilterActionsProps> = ({
  onClear,
  onApply,
  clearLabel,
  applyLabel
}) => {
  return (
    <div className="flex gap-3 pt-4 border-t border-outline-variant">
      <button
        onClick={onClear}
        className="flex-1 btn-outlined"
      >
        {clearLabel}
      </button>
      <button
        onClick={onApply}
        className="flex-1 btn-filled"
      >
        {applyLabel}
      </button>
    </div>
  );
};
