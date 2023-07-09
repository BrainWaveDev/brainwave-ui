'use client';
import React, { ButtonHTMLAttributes, CSSProperties } from 'react';

export default function Button(
  props: {
    className?: string;
    style?: CSSProperties;
  } & ButtonHTMLAttributes<HTMLButtonElement> & {
      children?: React.ReactNode;
    }
) {
  const { className = '', style, children, ...rest } = props;
  return (
    <button className={className} style={style} {...rest}>
      {children}
    </button>
  );
}
