import styled from 'styled-components'
import { Avatar } from '@zendeskgarden/react-avatars'
import { Field, Label, MediaInput } from '@zendeskgarden/react-forms'
import { ChevronDownIcon, SearchIcon } from './icons'

/* Flora Global Nav — Header approximation */
const Bar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 12px 0 8px;
  background: #f7f7f7;
  flex-shrink: 0;
  gap: 12px;
  box-sizing: border-box;
`

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`

const LogoMark = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: #2f3130;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: -0.02em;
  flex-shrink: 0;
`

const ProductTray = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  color: #2f3130;
  cursor: pointer;

  &:hover {
    background: #eae9e8;
  }

  svg {
    color: #646864;
  }
`

const Separator = styled.span`
  width: 1px;
  height: 20px;
  background: #dcdcda;
  flex-shrink: 0;
`

const Environment = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  padding: 0 8px;
  border: none;
  border-radius: 6px;
  background: transparent;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  color: #646864;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;

  &:hover {
    background: #eae9e8;
    color: #2f3130;
  }

  svg {
    flex-shrink: 0;
    color: #646864;
  }
`

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`

const SearchWrap = styled.div`
  width: 280px;

  [data-garden-id='forms.faux_input'] {
    align-items: center;
    box-sizing: border-box;
    height: 36px;
    padding: 6px 12px;
    background: #fff;
    border-color: #dcdcda;
  }

  [data-garden-id='forms.faux_input'] > svg {
    width: 16px !important;
    height: 16px !important;
    margin: 0 8px 0 0 !important;
    color: #646864 !important;
  }
`

export default function TopBar({ accountName = 'z3n-michalg-998-forms' }) {
  return (
    <Bar>
      <Left>
        <LogoMark aria-hidden="true">Z</LogoMark>
        <ProductTray type="button">
          Admin center
          <ChevronDownIcon size={12} />
        </ProductTray>
        <Separator aria-hidden="true" />
        <Environment type="button">
          {accountName}
          <ChevronDownIcon size={12} />
        </Environment>
      </Left>
      <Right>
        <SearchWrap>
          <Field>
            <Label hidden>Search admin center</Label>
            <MediaInput
              start={<SearchIcon size={16} />}
              placeholder="Search admin center"
            />
          </Field>
        </SearchWrap>
        <Avatar size="small" backgroundColor="#646864">
          <Avatar.Text>RG</Avatar.Text>
        </Avatar>
      </Right>
    </Bar>
  )
}
