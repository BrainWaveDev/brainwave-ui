import React, { CSSProperties, HTMLAttributes, memo } from 'react';

const Span = (
  props: {
    className?: string;
    style?: CSSProperties;
  } & HTMLAttributes<HTMLSpanElement> & {
      children?: React.ReactNode;
    }
) => {
  const { className, style, children } = props;
  return (
    <span className={className ?? 'text-gray-300 font-bold'} style={style}>
      {children}
    </span>
  );
};

export default memo(Span);
