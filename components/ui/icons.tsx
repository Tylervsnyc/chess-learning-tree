import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export function CrownIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
    </svg>
  );
}

export function LockIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  );
}

export function StarIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

export function CheckIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

export function PlayIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function ChevronDownIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>
  );
}

export function ChessKnightIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M19 22H5v-2h14v2M13 2c-1.25 0-2.42.62-3.11 1.66L7 8l2 2 2.06-1.37c.44-.29.94-.41 1.44-.41.47 0 .94.11 1.37.32l.07.04c.91.47 1.56 1.36 1.7 2.39L16 20h-2l-.34-6.41c-.03-.54-.35-1.02-.84-1.25l-.07-.03c-.26-.13-.54-.19-.82-.19-.36 0-.71.11-1.01.32L7 15V9.59l1-1L6.5 4C6.22 3.4 5.61 3 4.96 3H3v2h1.96l1.5 3.5L5 10l-2-2 1-1 .96.96V3h2c1.03 0 1.97.55 2.47 1.44l2 3.36c.38.64 1.06 1.09 1.83 1.17L13 9c1.1 0 2 .9 2 2 0 .55-.22 1.05-.59 1.41L13 14l.34 6H16l-.36-6.77c.6-.55.96-1.34.96-2.23 0-1.66-1.34-3-3-3-.27 0-.54.04-.8.11l-.07-.04c-.34-.17-.73-.28-1.13-.28-.57 0-1.1.18-1.54.49L9 9.59V7.41l3.11-2.08C12.7 5.12 13.35 5 14 5c.5 0 1 .07 1.47.21l.05.02c.86.25 1.6.78 2.12 1.5l1.36 1.77v4l-1 1v1l1-1h.5c.28 0 .5.22.5.5v.5l-.5.5-.5-.5v-.5c0-.28-.22-.5-.5-.5H18v-1l1-1v-4l-1.34-1.74c-.39-.54-.93-.95-1.56-1.17l-.05-.02C15.68 3.1 15.1 3 14.5 3c-.41 0-.81.04-1.2.12-.21.04-.41.1-.61.18l-.19.08C11.93 3.59 11.43 4 11 4.5l-1 1.32L8.5 5C8.78 4.4 9.39 4 10.04 4H11c.55 0 1.05-.22 1.41-.59.37-.36.59-.86.59-1.41H13z" />
    </svg>
  );
}
