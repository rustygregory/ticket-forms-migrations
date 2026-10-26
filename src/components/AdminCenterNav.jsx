import styled from 'styled-components'
import { useLocation, useNavigate } from 'react-router-dom'
import { MD, SM } from '@zendeskgarden/react-typography'

/* Flora Global Nav — Subnav (Objects & rules), 240px */
const NavPanel = styled.nav`
  width: 240px;
  min-width: 240px;
  background: #f7f7f7; /* bg/subtle — matches Global Nav canvas */
  overflow-y: auto;
  padding: 8px;
  height: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
`

const Heading = styled(MD)`
  margin: 0 8px 12px;
  padding: 4px 4px 8px;
  color: #2f3130; /* fg/default */
`

const Group = styled.div`
  margin-top: 8px;

  &:first-of-type {
    margin-top: 0;
  }
`

const GroupLabel = styled(SM)`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 8px 4px;
  padding: 8px 4px 4px;
  color: #646864; /* fg/subtle */

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #eae9e8; /* grey.200 */
  }
`

const NavItem = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 32px;
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  background: ${p => (p.$active ? '#2f3130' : 'transparent')};
  color: ${p => (p.$active ? '#fff' : '#2f3130')};
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  font-weight: 400;
  text-align: left;
  cursor: ${p => (p.$clickable ? 'pointer' : 'default')};
  opacity: ${p => (p.$clickable ? 1 : 0.72)};

  &:hover {
    background: ${p =>
      p.$clickable ? (p.$active ? '#2f3130' : '#eae9e8') : 'transparent'};
  }
`

const NavItemLabel = styled(MD)`
  color: inherit;
`

function Item({ active, clickable, onClick, children }) {
  return (
    <NavItem
      type="button"
      $active={active}
      $clickable={clickable}
      onClick={clickable ? onClick : undefined}
      aria-current={active ? 'page' : undefined}
    >
      <NavItemLabel tag="span">{children}</NavItemLabel>
    </NavItem>
  )
}

export default function AdminCenterNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const isForms = location.pathname.startsWith('/forms')

  return (
    <NavPanel aria-label="Objects and rules">
      <Heading tag="h2" isBold>
        Objects and rules
      </Heading>

      <Group>
        <GroupLabel tag="div" isBold>
          Tickets
        </GroupLabel>
        <Item active={isForms} clickable onClick={() => navigate('/forms')}>
          Forms
        </Item>
        <Item>Fields</Item>
        <Item>Tags</Item>
        <Item>Ticket statuses</Item>
        <Item>Settings</Item>
        <Item>Sharing</Item>
      </Group>

      <Group>
        <GroupLabel tag="div" isBold>
          Custom objects
        </GroupLabel>
        <Item>Templates</Item>
        <Item>Objects</Item>
      </Group>

      <Group>
        <GroupLabel tag="div" isBold>
          Omnichannel routing
        </GroupLabel>
        <Item>Routing configuration</Item>
        <Item>Queues</Item>
        <Item>Capacity rules</Item>
        <Item>Agent statuses</Item>
        <Item>Status timeout</Item>
      </Group>

      <Group>
        <GroupLabel tag="div" isBold>
          Business rules
        </GroupLabel>
        <Item>Triggers</Item>
        <Item>Automations</Item>
        <Item>Skills</Item>
        <Item>Service level agreements</Item>
        <Item>Schedules</Item>
      </Group>
    </NavPanel>
  )
}
