import styled from 'styled-components'

/* Flora Global Nav — Main navigation (icon rail) approximation */
const Rail = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  width: 48px;
  min-width: 48px;
  padding: 8px 0 12px;
  box-sizing: border-box;
  background: #f7f7f7;
  flex-shrink: 0;
`

const NavButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: ${p => (p.$active ? '#2f3130' : 'transparent')};
  color: ${p => (p.$active ? '#fff' : '#646864')};
  cursor: pointer;
  padding: 0;

  &:hover {
    background: ${p => (p.$active ? '#2f3130' : '#eae9e8')};
    color: ${p => (p.$active ? '#fff' : '#2f3130')};
  }
`

const Spacer = styled.span`
  flex: 1;
`

/** Simple geometric icons — stand-ins for Flora product nav metaphors */
function GridIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <rect x="3" y="3" width="6" height="6" rx="1.5" />
      <rect x="11" y="3" width="6" height="6" rx="1.5" />
      <rect x="3" y="11" width="6" height="6" rx="1.5" />
      <rect x="11" y="11" width="6" height="6" rx="1.5" />
    </svg>
  )
}

function TicketIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        fill="currentColor"
        d="M3.5 5.5A1.5 1.5 0 015 4h10a1.5 1.5 0 011.5 1.5v2a1.5 1.5 0 100 3v4A1.5 1.5 0 0115 16H5a1.5 1.5 0 01-1.5-1.5v-4a1.5 1.5 0 100-3v-2z"
      />
    </svg>
  )
}

function PeopleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <circle cx="7" cy="7" r="2.5" />
      <circle cx="13.5" cy="7.5" r="2" />
      <path d="M2.5 15c0-2.2 2-3.5 4.5-3.5s4.5 1.3 4.5 3.5v.5h-9V15z" />
      <path d="M12 12.2c1.7.2 3.5 1.1 3.5 2.8v.5H12v-.5c0-.9-.2-1.7-.5-2.3z" opacity="0.85" />
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path d="M10 7.25a2.75 2.75 0 100 5.5 2.75 2.75 0 000-5.5zM8.1 3.2l-.3 1.6a5.7 5.7 0 00-1.2.7l-1.5-.6-.9 1.5 1.2 1.1a5.6 5.6 0 000 1.4l-1.2 1.1.9 1.5 1.5-.6c.37.28.77.5 1.2.7l.3 1.6h1.8l.3-1.6c.43-.2.83-.42 1.2-.7l1.5.6.9-1.5-1.2-1.1a5.6 5.6 0 000-1.4l1.2-1.1-.9-1.5-1.5.6a5.7 5.7 0 00-1.2-.7l-.3-1.6H8.1z" />
    </svg>
  )
}

export default function MainNav() {
  return (
    <Rail aria-label="Main navigation">
      <NavButton type="button" $active aria-current="page" aria-label="Objects and rules">
        <GridIcon />
      </NavButton>
      <NavButton type="button" aria-label="Tickets">
        <TicketIcon />
      </NavButton>
      <NavButton type="button" aria-label="People">
        <PeopleIcon />
      </NavButton>
      <Spacer />
      <NavButton type="button" aria-label="Settings">
        <SettingsIcon />
      </NavButton>
    </Rail>
  )
}
