import styled from 'styled-components'

/**
 * The "Version notes" document — a living changelog for the version switcher.
 * Reads as a doc (light, not the bar's dark chrome): version name, date
 * created, a one-line summary, then a concise bullet list of changes,
 * optionally split into sections (e.g. by page). Each entry has a button
 * that jumps the prototype to that version and closes the panel.
 *
 * Host-agnostic: `entries` come from the host's version-notes data, `versions`
 * supplies the display label for each id (matching the dropdown's label).
 */

const Panel = styled.div`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  z-index: 9500;
  width: 420px;
  max-height: min(70vh, 640px);
  overflow-y: auto;
  background: #ffffff;
  border: 1px solid #d8dcde;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  color: #2f3941;
`

const PanelHeader = styled.div`
  position: sticky;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: #ffffff;
  border-bottom: 1px solid #e9ebed;
`

const PanelTitle = styled.h2`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #2f3941;
`

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  background: none;
  color: #68737d;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background: #f8f9f9;
    color: #2f3941;
  }
`

const EntryList = styled.div`
  padding: 4px 16px 16px;
`

const Entry = styled.div`
  padding: 16px 0;

  & + & {
    border-top: 1px solid #e9ebed;
  }
`

const EntryHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 4px;
`

const EntryName = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #2f3941;
`

const EntryDate = styled.span`
  flex-shrink: 0;
  font-size: 12px;
  color: #87929d;
`

const EntrySummary = styled.p`
  margin: 0 0 12px;
  font-size: 13px;
  line-height: 1.5;
  color: #49545c;
`

const Section = styled.div`
  margin-bottom: 10px;

  &:last-of-type {
    margin-bottom: 0;
  }
`

const SectionTitle = styled.h3`
  margin: 0 0 4px;
  font-size: 12px;
  font-weight: 600;
  color: #68737d;
`

const BulletList = styled.ul`
  margin: 0;
  padding-left: 18px;
  font-size: 13px;
  line-height: 1.5;
  color: #2f3941;

  li + li {
    margin-top: 4px;
  }
`

const GoToButton = styled.button`
  margin-top: 12px;
  border: 1px solid #d8dcde;
  border-radius: 4px;
  background: #fff;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  color: ${(p) => (p.disabled ? '#a4a9ac' : '#1f73b7')};
  cursor: ${(p) => (p.disabled ? 'default' : 'pointer')};

  &:hover {
    background: ${(p) => (p.disabled ? '#fff' : '#f8f9f9')};
    border-color: ${(p) => (p.disabled ? '#d8dcde' : '#1f73b7')};
  }
`

export default function VersionNotesPanel({ entries, versions, activeVersionId, onGoToVersion, onClose }) {
  const labelFor = (versionId) => versions?.find((v) => v.id === versionId)?.label ?? versionId

  return (
    <Panel role="dialog" aria-label="Version notes">
      <PanelHeader>
        <PanelTitle>Version notes</PanelTitle>
        <CloseButton type="button" onClick={onClose} aria-label="Close version notes">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false">
            <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </CloseButton>
      </PanelHeader>

      <EntryList>
        {entries?.map((entry) => {
          const isActive = entry.versionId === activeVersionId
          return (
            <Entry key={entry.versionId}>
              <EntryHeader>
                <EntryName>{labelFor(entry.versionId)}</EntryName>
                <EntryDate>{entry.date}</EntryDate>
              </EntryHeader>
              <EntrySummary>{entry.summary}</EntrySummary>

              {entry.sections?.map((section, i) => (
                <Section key={i}>
                  {section.title && <SectionTitle>{section.title}</SectionTitle>}
                  <BulletList>
                    {section.bullets.map((bullet, bi) => (
                      <li key={bi}>{bullet}</li>
                    ))}
                  </BulletList>
                </Section>
              ))}

              <GoToButton
                type="button"
                disabled={isActive}
                onClick={() => !isActive && onGoToVersion?.(entry.versionId)}
              >
                {isActive ? 'Currently viewing' : `Go to ${labelFor(entry.versionId)} →`}
              </GoToButton>
            </Entry>
          )
        })}
      </EntryList>
    </Panel>
  )
}
