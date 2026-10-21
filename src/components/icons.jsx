/* Garden / Flora icons for main content (color via currentColor). */

/**
 * Garden — Search (stroke).
 * Source: node_modules/@zendeskgarden/svg-icons/src/16/search-stroke.svg
 */
export function SearchIcon({ size = 16 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="6" cy="6" r="5.5" fill="none" stroke="currentColor" />
      <path stroke="currentColor" strokeLinecap="round" d="M15 15l-5-5" />
    </svg>
  )
}

/**
 * Garden — Chevron down (stroke).
 * Source: node_modules/@zendeskgarden/svg-icons/src/16/chevron-down-stroke.svg
 */
export function ChevronDownIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12.688 5.61a.5.5 0 01.69.718l-.066.062-5 4a.5.5 0 01-.542.054l-.082-.054-5-4a.5.5 0 01.55-.83l.074.05L8 9.359l4.688-3.75z"
      />
    </svg>
  )
}

/**
 * Garden — Chevron up (stroke).
 * Source: node_modules/@zendeskgarden/svg-icons/src/16/chevron-up-stroke.svg
 */
export function ChevronUpIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M3.312 10.39a.5.5 0 01-.69-.718l.066-.062 5-4a.5.5 0 01.542-.054l.082.054 5 4a.5.5 0 01-.55.83l-.074-.05L8 6.641l-4.688 3.75z"
      />
    </svg>
  )
}

/**
 * Garden — Chevron right (stroke).
 * Source: node_modules/@zendeskgarden/svg-icons/src/16/chevron-right-stroke.svg
 */
export function ChevronRightIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M5.61 3.312a.5.5 0 01.718-.69l.062.066 4 5a.5.5 0 01.054.542l-.054.082-4 5a.5.5 0 01-.83-.55l.05-.074L9.359 8l-3.75-4.688z"
      />
    </svg>
  )
}

/** Flora Icons — Chevron left. */
export function ChevronLeftIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        transform="translate(6.18 2.5)"
        d="M6.2202 0.243963C6.54565 -0.0812447 7.07355 -0.0813974 7.39891 0.243963C7.72403 0.5693 7.72393 1.0963 7.39891 1.4217L1.91062 6.90998C1.5852 7.23544 1.58538 7.76331 1.91062 8.08869L7.39891 13.577L7.45652 13.6404C7.72313 13.9677 7.70368 14.4507 7.39891 14.7557C7.09376 15.0606 6.61091 15.0793 6.28367 14.8123L6.2202 14.7557L0.731914 9.2674C-0.244113 8.29125 -0.243829 6.70855 0.731914 5.73224L6.2202 0.243963Z"
      />
    </svg>
  )
}

/** Flora Icons — Pencil (edit). */
export function PencilIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        transform="translate(1.86 1.86)"
        d="M9.82741 1.10679C11.3034 -0.368925 13.6965 -0.368938 15.1725 1.10679C16.6484 2.58274 16.6482 4.9758 15.1725 6.45185L6.80007 14.8242C6.47761 15.1466 6.0741 15.3743 5.63389 15.4834L5.44346 15.5225L0.96999 16.2679C0.704593 16.3121 0.434328 16.2254 0.244078 16.0352C0.0539295 15.8449 -0.0328959 15.5746 0.011331 15.3093L0.756774 10.8358C0.842502 10.322 1.08661 9.84752 1.45502 9.47919L9.82741 1.10679ZM2.6334 10.6576C2.5107 10.7803 2.42924 10.9388 2.40065 11.1101L1.84645 14.432L5.16921 13.8786C5.34061 13.85 5.49885 13.7687 5.62168 13.6459L12.1541 7.11265L9.16579 4.12437L2.6334 10.6576ZM13.9941 2.28518C13.169 1.46032 11.8309 1.46033 11.0058 2.28518L10.3442 2.94599L13.3325 5.93427L13.9941 5.27346C14.819 4.44829 14.8191 3.11026 13.9941 2.28518Z"
      />
    </svg>
  )
}

/** Flora Filter media icon — sliders / adjust (not funnel). */
export function FilterIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor">
        <circle cx="4.5" cy="6.5" r="2" />
        <circle cx="11.5" cy="9.5" r="2" />
        <path strokeLinecap="round" d="M4.5.5v2m0 8v5m7-15v5m0 8v2" />
      </g>
    </svg>
  )
}

/** Flora Icons — Dots grid 2x3 (grip / drag handle). */
export function GripIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <g transform="translate(5.833 2.5)" fill="currentColor">
        <path d="M1.66667 0C0.746192 0 0 0.746192 0 1.66667C0 2.58714 0.746192 3.33333 1.66667 3.33333C2.58717 3.33333 3.33333 2.58714 3.33333 1.66667C3.33333 0.746192 2.58717 0 1.66667 0Z" />
        <path d="M6.66667 0C5.74617 0 5 0.746192 5 1.66667C5 2.58714 5.74617 3.33333 6.66667 3.33333C7.58717 3.33333 8.33333 2.58714 8.33333 1.66667C8.33333 0.746192 7.58717 0 6.66667 0Z" />
        <path d="M1.66667 5.83333C0.746192 5.83333 0 6.5795 0 7.5C0 8.4205 0.746192 9.16667 1.66667 9.16667C2.58717 9.16667 3.33333 8.4205 3.33333 7.5C3.33333 6.5795 2.58717 5.83333 1.66667 5.83333Z" />
        <path d="M6.66667 5.83333C5.74617 5.83333 5 6.5795 5 7.5C5 8.4205 5.74617 9.16667 6.66667 9.16667C7.58717 9.16667 8.33333 8.4205 8.33333 7.5C8.33333 6.5795 7.58717 5.83333 6.66667 5.83333Z" />
        <path d="M1.66667 11.6667C0.746192 11.6667 0 12.4128 0 13.3333C0 14.2538 0.746192 15 1.66667 15C2.58717 15 3.33333 14.2538 3.33333 13.3333C3.33333 12.4128 2.58717 11.6667 1.66667 11.6667Z" />
        <path d="M6.66667 11.6667C5.74617 11.6667 5 12.4128 5 13.3333C5 14.2538 5.74617 15 6.66667 15C7.58717 15 8.33333 14.2538 8.33333 13.3333C8.33333 12.4128 7.58717 11.6667 6.66667 11.6667Z" />
      </g>
    </svg>
  )
}

export function OverflowIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <circle cx="8" cy="2.5" r="1.5" fill="currentColor" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
      <circle cx="8" cy="13.5" r="1.5" fill="currentColor" />
    </svg>
  )
}

/**
 * Garden / Flora — Lock locked (stroke).
 * Source: node_modules/@zendeskgarden/svg-icons/src/16/lock-locked-stroke.svg
 */
export function LockIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor">
        <rect width="11" height="8" x="2.5" y="7.5" rx=".5" ry=".5" />
        <path d="M4.5 7.5V4a3.5 3.5 0 017 0v3.5" />
      </g>
    </svg>
  )
}

/**
 * Garden — Text field type (T).
 * Source: node_modules/@zendeskgarden/svg-icons/src/16/text-stroke.svg
 */
export function TextFieldIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeLinecap="round" d="M2.5 1.5h10m-5 0v14" />
    </svg>
  )
}

/**
 * Garden — Multiline / textarea field type.
 * Source: node_modules/@zendeskgarden/svg-icons/src/16/multiline-stroke.svg
 */
export function MultilineFieldIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path fill="none" stroke="currentColor" strokeLinecap="round" d="M1.5 6.5h13m-13-4h13m-13 8h13m-13 4h6" />
    </svg>
  )
}

/**
 * Garden — Checkbox / dropdown-style field type (square + check).
 * Source: node_modules/@zendeskgarden/svg-icons/src/16/check-box-stroke.svg
 */
export function DropdownFieldIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <g fill="none" stroke="currentColor">
        <rect width="13" height="13" x="1.5" y="1.5" rx=".5" ry=".5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 8.5L7 11l5-5" />
      </g>
    </svg>
  )
}

/**
 * Garden — Boolean / checkmark field type.
 * Source: node_modules/@zendeskgarden/svg-icons/src/16/check-lg-stroke.svg
 */
export function BooleanFieldIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M1 9l4 4L15 3"
      />
    </svg>
  )
}

/** Map ticket field `kind` → verified Garden field-type icon. */
export function FieldTypeIcon({ kind, size = 16 }) {
  switch (kind) {
    case 'textarea':
      return <MultilineFieldIcon size={size} />
    case 'dropdown':
    case 'lookup':
      return <DropdownFieldIcon size={size} />
    case 'boolean':
      return <BooleanFieldIcon size={size} />
    case 'text':
    default:
      return <TextFieldIcon size={size} />
  }
}

/**
 * Garden — Plus (stroke).
 * Source: node_modules/@zendeskgarden/svg-icons/src/16/plus-stroke.svg
 */
export function PlusIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path stroke="currentColor" strokeLinecap="round" d="M7.5 2.5v12m6-6h-12" />
    </svg>
  )
}

/** Flora Icons — External link. */
export function ExternalLinkIcon({ size = 12 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
      <g transform="translate(2.5 2.5)" fill="currentColor">
        <path d="M5.08496 0.00390831C5.50514 0.046618 5.83301 0.401563 5.83301 0.83301C5.83276 1.26424 5.50498 1.61942 5.08496 1.66211L5 1.66602H3.5C3.01972 1.66602 2.70872 1.66724 2.47266 1.68653C2.24671 1.70503 2.16226 1.73586 2.1211 1.75684C1.96454 1.83673 1.83664 1.96449 1.75684 2.1211C1.73586 2.16246 1.70495 2.24738 1.68653 2.47266C1.66727 2.70871 1.66602 3.01989 1.66602 3.5V11.5C1.66602 11.9799 1.66725 12.2904 1.68653 12.5264C1.705 12.7521 1.73587 12.8367 1.75684 12.8779C1.81682 12.9955 1.90401 13.097 2.00977 13.1738L2.1211 13.2422L2.22754 13.2783C2.28191 13.2911 2.35958 13.3042 2.47266 13.3135C2.70872 13.3328 3.01972 13.333 3.5 13.333H11.5C11.9799 13.333 12.2904 13.3327 12.5264 13.3135C12.7519 13.2951 12.8366 13.2632 12.8779 13.2422C13.0345 13.1624 13.1623 13.0344 13.2422 12.8779C13.2632 12.8368 13.295 12.7523 13.3135 12.5264C13.3327 12.2904 13.333 11.9799 13.333 11.5V10C13.333 9.53998 13.7061 9.16636 14.166 9.16602C14.6263 9.16602 15 9.53976 15 10V11.5C15 11.9525 15.0007 12.3426 14.9746 12.6621C14.9477 12.9914 14.8881 13.3196 14.7275 13.6348C14.4879 14.105 14.105 14.488 13.6348 14.7275C13.3196 14.888 12.9914 14.9477 12.6621 14.9746C12.3425 15.0007 11.9526 15 11.5 15H3.5C3.04718 15 2.65657 15.0007 2.33692 14.9746C2.00762 14.9477 1.67943 14.8881 1.36426 14.7275C0.894057 14.4879 0.512081 14.1048 0.272463 13.6348C0.111861 13.3196 0.0523272 12.9914 0.0253926 12.6621C-0.000707949 12.3426 1.18619e-06 11.9526 2.00423e-06 11.5V3.5C2.00423e-06 3.04728 -0.000688342 2.65655 0.0253926 2.33692C0.0523057 2.00773 0.112034 1.67934 0.272463 1.36426C0.512001 0.89437 0.894425 0.51209 1.36426 0.272463C1.67939 0.111895 2.00766 0.0523337 2.33692 0.0253927C2.65657 -0.000724411 3.04718 1.73296e-06 3.5 2.06481e-06H5L5.08496 0.00390831Z" />
        <path d="M14.166 2.06481e-06C14.6263 2.06481e-06 15 0.372773 15 0.83301V5.83301C14.9997 6.29302 14.6261 6.66602 14.166 6.66602C13.7062 6.66567 13.3333 6.29281 13.333 5.83301V2.84473L7.25586 8.92188L7.19238 8.97949C6.86511 9.2461 6.38213 9.22677 6.07715 8.92188C5.75206 8.59661 5.75233 8.06957 6.07715 7.74414L12.1553 1.66602H9.16602C8.70623 1.66567 8.33327 1.29281 8.33301 0.83301C8.33301 0.372984 8.70607 0.000345251 9.16602 2.06481e-06H14.166Z" />
      </g>
    </svg>
  )
}

/**
 * Garden — X (stroke).
 * Source: node_modules/@zendeskgarden/svg-icons/src/16/x-stroke.svg
 */
export function XIcon({ size = 16 }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path stroke="currentColor" strokeLinecap="round" d="M3 13L13 3m0 10L3 3" />
    </svg>
  )
}
