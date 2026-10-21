import { useState } from 'react'
import { HashRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { ThemeProvider } from './flora-theme/elements/ThemeProvider'
import PrototypeBar from './prototype-bar/PrototypeBar'
import InspectLayer from './inspect/InspectLayer'
import CommentLayer from './comments/CommentLayer'
import TopBar from './components/TopBar'
import MainNav from './components/MainNav'
import AdminCenterNav from './components/AdminCenterNav'
import FormsList from './components/FormsList'
import AddForm from './components/AddForm'
import { INITIAL_FORMS } from './data/forms'
import { VERSIONS } from './data/versions'
import './App.css'

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
  background-color: #f7f7f7;
  overflow: hidden;
`

const ContentRow = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow: hidden;
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
  const [version, setVersion] = useState('v2')
  const [inspectSlot, setInspectSlot] = useState(null)
  const [inspectActive, setInspectActive] = useState(false)
  const [commentSlot, setCommentSlot] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <Shell>
      <PrototypeBar
        title="Ticket forms migrations"
        meta="Started Oct 2026"
        versions={VERSIONS}
        versionId={version}
        onVersionChange={setVersion}
        inspectSlotRef={setInspectSlot}
        commentSlotRef={setCommentSlot}
        inspectActive={inspectActive}
      />
      <PageContainer>
        <TopBar />
        <ContentRow>
          <MainNav />
          <AdminCenterNav />
          <WorkArea data-comment-root="true" data-inspect-root="true">
            <Routes>
              <Route path="/" element={<Navigate to="/forms" replace />} />
              <Route
                path="/forms"
                element={<FormsList version={version} forms={forms} setForms={setForms} />}
              />
              <Route
                path="/forms/new"
                element={
                  <AddForm
                    version={version}
                    forms={forms}
                    onSave={form => setForms(current => [form, ...current])}
                  />
                }
              />
              <Route
                path="/forms/:id"
                element={
                  <AddForm
                    key={location.pathname}
                    version={version}
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
        </ContentRow>
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
      <HashRouter>
        <Prototype />
      </HashRouter>
    </ThemeProvider>
  )
}
