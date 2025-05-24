import React from 'react';
import { RefreshCw } from 'lucide-react';
import '../CustomCSS/RetryButton.css';

interface RetryButtonProps {
  onClick: () => void;
}

const RetryButton: React.FC<RetryButtonProps> = ({ onClick }) => {
  return (
    <button className="button" onClick={onClick}>
      <RefreshCw size={18} className="mr-2" />
      Retry
    </button>
  );
};

export default RetryButton;