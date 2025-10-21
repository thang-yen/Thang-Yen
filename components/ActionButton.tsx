
import React from 'react';
import Loader from './Loader';

interface ActionButtonProps {
  onClick: () => void;
  text: string;
  iconClass: string;
  isLoading: boolean;
  disabled?: boolean;
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, text, iconClass, isLoading, disabled = false, className = '' }) => {
  const isDisabled = isLoading || disabled;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={`relative flex items-center justify-center w-full px-6 py-3 text-base font-semibold text-white transition-all duration-200 bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <i className={`${iconClass} mr-3`}></i>
          <span>{text}</span>
        </>
      )}
    </button>
  );
};

export default ActionButton;
