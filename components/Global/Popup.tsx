import React, { FC, useEffect, useState } from 'react';

interface PopupProps {
  trigger: boolean;
  children: React.ReactNode;
  onClose?: () => void;
  onClick?: () => void;
}

const Popup: FC<PopupProps> = ({ trigger, children, onClose,onClick}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (trigger) {
      setIsVisible(true);
    } else {
      setTimeout(() => setIsVisible(false), 200);
    }
  }, [trigger]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-200">
      <div
        className={`bg-white p-6 rounded-lg shadow-md w-full max-w-lg ${
          trigger ? 'opacity-100' : 'opacity-0'
        } transition-opacity duration-200`}
        onClick={onClick}
      >
        {children}
      </div>
    </div>
  );
};

export default Popup;
