import { useState } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ToastProvider } from '@zendeskgarden/react-notifications'
import { TopBar, MainNav } from 'zendesk-globalnav-template/chrome'
import { ThemeProvider } from './flora-theme/elements/ThemeProvider'
import PrototypeBar, { BAR_HEIGHT } from './prototype-bar/PrototypeBar'
import InspectLayer from './inspect/InspectLayer'
import CommentLayer from './comments/CommentLayer'
import AdminCenterNav from './components/AdminCenterNav'
import FormsList from './components/FormsList'
import FormsListV3 from './components/FormsList.v3'
import AddForm from './components/AddForm'
import AddFormV3 from './components/AddForm.v3'
import { INITIAL_FORMS } from './data/forms'
import { VERSIONS } from './data/versions'
import './App.css'

/* Objects & rules in Admin Center MainNav (zendesk-globalnav-template) */
const OBJECTS_AND_RULES_NAV_ID = 6

/* Flora Global Nav Overview: Notifications sit 16px top + 16px side from main content.
   Fixed toasts clear PrototypeBar + TopBar (48px), then apply the 16px inset. */
const TOP_BAR_HEIGHT = 48
const toastPlacementProps = {
  'top-end': {
    style: {
      top: BAR_HEIGHT + TOP_BAR_HEIGHT + 16,
      right: 16,
    },
  },
}

const Shell = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: 100%;
  background-color: #f7f7f7; /* bg/subtle — Global Nav canvas */
  overflow: hidden;
  position: relative;
  isolation: isolate;
`

const Workspace = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow: hidden;
  z-index: 1;
`

const NavRails = styled.div`
  display: flex;
  flex-shrink: 0;
  min-height: 0;
`

const WorkArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  margin-top: 4px;
  background: #fff;
  border-top-left-radius: 8px;
  box-shadow: 0 0 4px rgba(10, 13, 14, 0.12);
`

function Prototype() {
  const [forms, setForms] = useState(INITIAL_FORMS)
  /* Default V3 = Flora audit applied. V1/V2 live under Archive in the switcher. */
  const [version, setVersion] = useState('v3')
  const [inspectSlot, setInspectSlot] = useState(null)
  const [inspectActive, setInspectActive] = useState(false)
  const [commentSlot, setCommentSlot] = useState(null)
  const [activeNavItem, setActiveNavItem] = useState(OBJECTS_AND_RULES_NAV_ID)
  const [isSubnavExpanded, setIsSubnavExpanded] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const isV3 = version === 'v3'
  const List = isV3 ? FormsListV3 : FormsList
  const FormScreen = isV3 ? AddFormV3 : AddForm
  /* V3 keeps V2 filter-drawer behavior; only Flora visual/component fixes differ. */
  const listVersion = isV3 ? 'v2' : version

  return (
    <Shell>
      <PrototypeBar
        title="Ticket forms migration"
        meta="Started Oct 2026"
        versions={VERSIONS}
        versionId={version}
        onVersionChange={setVersion}
        inspectSlotRef={setInspectSlot}
        commentSlotRef={setCommentSlot}
        inspectActive={inspectActive}
      />
      <PageContainer>
        <TopBar currentProduct="admin-center" onProductChange={() => {}} />
        <Workspace>
          <NavRails>
            <MainNav
              currentProduct="admin-center"
              activeNavItem={activeNavItem}
              setActiveNavItem={setActiveNavItem}
              isSubnavExpanded={isSubnavExpanded}
              setIsSubnavExpanded={setIsSubnavExpanded}
            />
            {isSubnavExpanded && <AdminCenterNav />}
          </NavRails>
          <WorkArea data-comment-root="true" data-inspect-root="true">
            <Routes>
              <Route path="/" element={<Navigate to="/forms" replace />} />
              <Route
                path="/forms"
                element={<List version={listVersion} forms={forms} setForms={setForms} />}
              />
              <Route
                path="/forms/new"
                element={
                  <FormScreen
                    forms={forms}
                    onSave={form => setForms(current => [form, ...current])}
                  />
                }
              />
              <Route
                path="/forms/:id"
                element={
                  <FormScreen
                    key={location.pathname}
                    forms={forms}
                    onUpdate={(formId, updates) =>
                      setForms(current =>
                        current.map(form => (form.id === formId ? { ...form, ...updates } : form)),
                      )
                    }
                    onDelete={formId =>
                      setForms(current => current.filter(form => form.id !== formId))
                    }
                  />
                }
              />
            </Routes>
          </WorkArea>
        </Workspace>
      </PageContainer>

      <InspectLayer
        toggleContainer={inspectSlot}
        onActiveChange={setInspectActive}
      />
      <CommentLayer
        toggleContainer={commentSlot}
        context={{ version, route: location.pathname }}
        onRestoreContext={saved => {
          if (VERSIONS.some(v => v.id === saved.version)) setVersion(saved.version)
          if (saved.route) navigate(saved.route)
        }}
      />
    </Shell>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider placementProps={toastPlacementProps} zIndex={10000}>
        <HashRouter>
          <Prototype />
        </HashRouter>
      </ToastProvider>
    </ThemeProvider>
  )
}
