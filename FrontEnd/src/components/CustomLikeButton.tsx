import React from 'react';
import '../CustomCSS/CustomLikeButton.css';

interface CustomLikeButtonProps {
  type: 'like' | 'dislike';
  checked: boolean;
  onClick: () => void;
  count: number;
  disabled?: boolean; // Retain disabled prop for loading state
}

const CustomLikeButton: React.FC<CustomLikeButtonProps> = ({ type, checked, onClick, count, disabled }) => {
  return (
    <div className="flex items-center space-x-2">
      <label className="container">
        <input
          type="checkbox"
          checked={checked}
          onChange={onClick}
          disabled={disabled} // Add disabled prop to input
        />
        <div className={`checkmark ${type}`}>
          <svg fill="none" viewBox="0 0 24 24">
            <path
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="1.3"
              stroke="#6B7280"
              d={
                type === 'like'
                  ? 'M8 10V20M8 10L4 9.99998V20L8 20M8 10L13.1956 3.93847C13.6886 3.3633 14.4642 3.11604 15.1992 3.29977L15.2467 3.31166C16.5885 3.64711 17.1929 5.21057 16.4258 6.36135L14 9.99998H18.5604C19.8225 9.99998 20.7691 11.1546 20.5216 12.3922L19.3216 18.3922C19.1346 19.3271 18.3138 20 17.3604 20L8 20'
                  : 'M16 14V4M16 14L20 14.00002V4L16 4M16 14L10.8044 20.0615C10.3114 20.6367 9.5358 20.884 8.8008 20.7002L8.7533 20.6883C7.4115 20.3529 6.8071 18.7894 7.5742 17.6386L10 14.00002H5.4396C4.1775 14.00002 3.2309 12.8454 3.4784 11.6078L4.6784 5.6078C4.8654 4.6729 5.6862 4 6.6396 4L16 4'
              }
            />
          </svg>
        </div>
      </label>
      <span className={`text-sm ${disabled ? 'text-gray-400' : 'text-gray-600'}`}>
        {count}
      </span>
    </div>
  );
};

export default React.memo(CustomLikeButton);