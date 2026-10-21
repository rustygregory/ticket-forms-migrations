import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

/* Flora Typography Medium / Default — 14/20 */
const BreadcrumbContainer = styled.nav`
  display: flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 8px; /* 8px between breadcrumb and page title */
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
`

/* fg/primary — primaryHue.700 */
const BreadcrumbLink = styled.span`
  color: #406cc4;
  text-decoration: none;
  cursor: pointer;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;

  &:hover {
    color: #284173;
    text-decoration: underline;
  }
`

/* fg/subtle — neutralHue.700 */
const Separator = styled.span`
  color: #646864;
  margin: 0 2px;
`

const Subtle = styled.span`
  color: #646864;
`

export default function Breadcrumbs({ items }) {
  const navigate = useNavigate()

  return (
    <BreadcrumbContainer aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={`${item.label}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {i > 0 && <Separator aria-hidden="true">{'>'}</Separator>}
          {item.path ? (
            <BreadcrumbLink onClick={() => navigate(item.path)}>{item.label}</BreadcrumbLink>
          ) : (
            <Subtle>{item.label}</Subtle>
          )}
        </span>
      ))}
    </BreadcrumbContainer>
  )
}
