import { CSSProperties } from 'react'

export default function AppLogo(
  props: {
    className?: string
    style?: CSSProperties
  } & any
) {
  const { className, style, ...rest } = props
  return (
    <svg
      width="170"
      height="155"
      viewBox="0 0 170 155"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      {...rest}
    >
      <path
        d="M166 74.8676C166 122.138 125.302 150.943 87 150.943C67.9311 150.943 47.0781 143.74 31.0405 130.553C15.0689 117.42 4.00001 98.4782 4 74.8676C3.99999 50.8467 15.0299 33.272 30.875 21.5803C46.8365 9.80256 67.7206 4 87 4C106.283 4 126.118 9.67066 141.039 21.3165C155.84 32.8693 166 50.4335 166 74.8676Z"
        fill="white"
        stroke="url(#paint0_linear_12_42)"
        stroke-width="8"
      />
      <g filter="url(#filter0_d_12_42)">
        <rect
          x="20"
          y="36"
          width="129"
          height="68"
          rx="32"
          fill="url(#paint1_linear_12_42)"
          fill-opacity="0.2"
          shape-rendering="crispEdges"
        />
      </g>
      <g filter="url(#filter1_d_12_42)">
        <rect x="25" y="41" width="119" height="58" rx="29" fill="#2B2B2B" />
      </g>
      <g filter="url(#filter2_f_12_42)">
        <ellipse
          cx="114"
          cy="70"
          rx="16"
          ry="11"
          fill="#06FEA5"
          fill-opacity="0.5"
        />
      </g>
      <g filter="url(#filter3_b_12_42)">
        <path d="M114 62L128 74H100L114 62Z" fill="#06FEA5" />
      </g>
      <g filter="url(#filter4_f_12_42)">
        <ellipse
          cx="56"
          cy="70"
          rx="16"
          ry="11"
          fill="#06FEA5"
          fill-opacity="0.5"
        />
      </g>
      <path d="M56 62L70 74H42L56 62Z" fill="#06FEA5" />
      <defs>
        <filter
          id="filter0_d_12_42"
          x="6"
          y="22"
          width="157"
          height="96"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="4"
            operator="dilate"
            in="SourceAlpha"
            result="effect1_dropShadow_12_42"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_12_42"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_12_42"
            result="shape"
          />
        </filter>
        <filter
          id="filter1_d_12_42"
          x="11"
          y="27"
          width="147"
          height="86"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feMorphology
            radius="4"
            operator="dilate"
            in="SourceAlpha"
            result="effect1_dropShadow_12_42"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_12_42"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_12_42"
            result="shape"
          />
        </filter>
        <filter
          id="filter2_f_12_42"
          x="88"
          y="49"
          width="52"
          height="42"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="5"
            result="effect1_foregroundBlur_12_42"
          />
        </filter>
        <filter
          id="filter3_b_12_42"
          x="80"
          y="42"
          width="68"
          height="52"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="10" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_12_42"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_backgroundBlur_12_42"
            result="shape"
          />
        </filter>
        <filter
          id="filter4_f_12_42"
          x="30"
          y="49"
          width="52"
          height="42"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="5"
            result="effect1_foregroundBlur_12_42"
          />
        </filter>
        <linearGradient
          id="paint0_linear_12_42"
          x1="85"
          y1="0"
          x2="85"
          y2="154.943"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#5B76FF" />
          <stop offset="1" stop-color="#00E96B" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_12_42"
          x1="21.084"
          y1="60.0345"
          x2="142.799"
          y2="85.2676"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#151515" stop-opacity="0.77" />
          <stop offset="0.24939" stop-color="#202020" stop-opacity="0.73" />
          <stop offset="0.796582" stop-color="#202020" stop-opacity="0.73" />
          <stop offset="0.989583" stop-color="#151515" stop-opacity="0.67" />
        </linearGradient>
      </defs>
    </svg>
  )
}
