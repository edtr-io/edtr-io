import { Editor, EditorProps, useScopedDispatch } from '@edtr-io/core'
import { Renderer, RendererProps } from '@edtr-io/renderer'
import { persist, reset } from '@edtr-io/store'
import { createStoreDevtoolsEnhancer } from '@edtr-io/store-devtools'
import * as React from 'react'

import { useEditable, useLogState } from '../hooks'

export function SerloRendererContainer(props: RendererProps) {
  return (
    <SerloContainerInner editable={false}>
      <Renderer {...props} createStoreEnhancer={createStoreDevtoolsEnhancer} />
    </SerloContainerInner>
  )
}

export function SerloEditorContainer(props: EditorProps) {
  const [editable, setEditable] = useEditable(props.editable)
  const children = React.useCallback(
    document => {
      return (
        <SerloEditorContainerInner
          editable={editable}
          setEditable={setEditable}
        >
          {document}
        </SerloEditorContainerInner>
      )
    },
    [editable, setEditable]
  )

  return (
    <Editor
      {...props}
      editable={editable}
      createStoreEnhancer={createStoreDevtoolsEnhancer}
    >
      {children}
    </Editor>
  )
}

export function SerloEditorContainerInner({
  editable,
  setEditable,
  children
}: {
  children: React.ReactNode
  editable: boolean
  setEditable: (value: boolean) => void
}) {
  const dispatch = useScopedDispatch()
  const logState = useLogState()

  return (
    <SerloContainerInner
      editable={editable}
      onSave={() => {
        if (confirm('Are you sure you want to save?')) {
          dispatch(persist())
          setEditable(false)
          logState()
        }
      }}
      onAbort={() => {
        if (
          confirm(
            'Are you sure you want to abort editing? All of your unsaved changes will be lost!'
          )
        ) {
          dispatch(reset())
          setEditable(false)
        }
      }}
      onEdit={() => {
        setEditable(true)
      }}
    >
      {children}
    </SerloContainerInner>
  )
}

export function SerloContainerInner({
  editable,
  onSave,
  onAbort,
  onEdit,
  children
}: {
  children: React.ReactNode
  editable: boolean
  onSave?: () => void
  onAbort?: () => void
  onEdit?: () => void
}) {
  return (
    <React.Fragment>
      <link
        href="https://packages.serlo.org/athene2-assets@a/main.css"
        rel="stylesheet"
      />
      <div>
        <div
          className="wrap has-navigation has-context"
          style={{
            marginBottom: '-183px'
          }}
        >
          <header id="header">
            <nav
              id="serlo-menu"
              className="navbar navbar-default"
              role="navigation"
            >
              <div className="container-fluid">
                <div className="collapse navbar-collapse" id="top-bar-collapse">
                  <nav className="navbar-inner">
                    <ul className="nav navbar-nav">
                      <li>
                        <a href="#" className="">
                          <span className="fa fa-home" />
                        </a>
                      </li>
                      <li className="dropdown">
                        <a className="primary" href="#" data-toggle="dropdown">
                          Fächer <b className="caret" />
                        </a>
                        <ul className="dropdown-menu">
                          <li>
                            <a href="#"> Mathematik </a>
                          </li>
                          <li>
                            <a href="#"> Biologie </a>
                          </li>
                          <li>
                            <a href="#"> Angewandte Nachhaltigkeit </a>
                          </li>
                          <li>
                            <a href="#"> Schulfächer im Aufbau </a>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <a href="#" className="">
                          Mitmachen
                        </a>
                      </li>
                      <li>
                        <a href="#" className="">
                          Spenden
                        </a>
                      </li>
                      <li>
                        <a href="#" className="">
                          Über Serlo
                        </a>
                      </li>
                      <li>
                        <a href="#" className="">
                          Blog
                        </a>
                      </li>
                    </ul>
                    <ul className="nav navbar-nav navbar-right authentication">
                      <li>
                        <a href="#" className="">
                          Registrieren
                        </a>
                      </li>
                      <li>
                        <a href="#" className="">
                          <span className="fa fa-user" /> Anmelden
                        </a>
                      </li>
                    </ul>
                    <ul className="nav navbar-nav pull-right notifications hidden-xs" />
                    <ul className="nav navbar-nav navbar-right">
                      <li>
                        <a href="#" className="">
                          Community
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </nav>
            <div className="container">
              <nav id="header-nav">
                <div id="mobile-nav-toggle">
                  <button>
                    <span className="sr-only">Navigation ein-/ausblenden</span>
                    <i className="fa fa-fw fa-bars" />
                  </button>
                  <a className="main-headline-link" href="#">
                    <span className="serlo-logo">V</span>
                  </a>
                  <div className="serlo-brand">Serlo</div>
                  <span className="subject-title hidden-xs">
                    <a className="main-headline-link" href="#">
                      Mathematik
                    </a>
                  </span>
                </div>
                <div id="mobile-nav-right">
                  <ul className="authentification nav navbar-nav">
                    <li className="dropdown">
                      <a
                        data-toggle="dropdown"
                        className="dropdown-toggle"
                        href="#"
                        aria-expanded="false"
                      >
                        <span className="fa fa-user" />
                      </a>
                      <ul className="dropdown-menu dropdown-menu-right">
                        <li>
                          <a href="#" className="">
                            Registrieren
                          </a>
                        </li>
                        <li>
                          <a href="#" className="">
                            <span className="fa fa-user" /> Anmelden
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <ul className="notifications nav navbar-nav" />
                </div>
              </nav>
              <div id="mobile-nav">
                <ul id="mobile-serlo-nav" className="nav">
                  <li className="dropdown">
                    <a href="#" data-toggle="dropdown">
                      Serlo <b className="caret" />
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a href="#" className="">
                          <span className="fa fa-home" />
                        </a>
                      </li>
                      <li>
                        <a href="#" className="">
                          Mitmachen
                        </a>
                      </li>
                      <li>
                        <a href="#" className="">
                          Spenden
                        </a>
                      </li>
                      <li>
                        <a href="#" className="">
                          Über Serlo
                        </a>
                      </li>
                      <li>
                        <a href="#" className="">
                          Blog
                        </a>
                      </li>
                      <li>
                        <a href="#" className="">
                          Community
                        </a>
                      </li>
                      <li>
                        <a href="#" className="">
                          Newsletter
                        </a>
                      </li>
                      <li>
                        <a href="#" className="">
                          <span className="fa fa-facebook-square" />
                          <span className="sr-only">Facebook</span>
                        </a>
                      </li>
                      <li>
                        <a href="#" className="">
                          <span className="fa fa-twitter-square" />
                          <span className="sr-only">Twitter</span>
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
                <ul id="mobile-primary-nav" className="nav">
                  <li className="dropdown">
                    <a className="primary" href="#" data-toggle="dropdown">
                      Fächer <b className="caret" />
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a href="#"> Mathematik </a>
                      </li>
                      <li>
                        <a href="#"> Biologie </a>
                      </li>
                      <li>
                        <a href="#"> Angewandte Nachhaltigkeit </a>
                      </li>
                      <li>
                        <a href="#"> Schulfächer im Aufbau </a>
                      </li>
                    </ul>
                  </li>
                </ul>
                <ul id="mobile-main-nav" className="nav">
                  <li className="mobile-nav-header">
                    <a className="is-hidden" href="#" itemProp="url">
                      <span itemProp="title">Informatik</span>
                    </a>
                  </li>
                  <li
                    data-needs-fetching="true"
                    data-sidenav="false"
                    itemProp="child"
                    itemScope
                    itemType="http://data-vocabulary.org/Breadcrumb"
                    className="active"
                    data-identifier="8399af0083b7e80e408bd8e93554eb56"
                  >
                    <a href="#" itemProp="url">
                      <span itemProp="title">Alle Themen</span>
                    </a>
                  </li>
                  <li data-identifier="82a831faa7f516125a8c4accd0e6bbe7">
                    <a href="#">
                      <span>Gymnasium</span>
                    </a>
                  </li>
                  <li
                    data-needs-fetching="true"
                    className="is-community dropdown"
                    data-identifier="b8b03f26f366eab97bef52ddd36637a1"
                  >
                    <a href="#" data-toggle="dropdown">
                      <span>Bei Serlo-Mathematik mitarbeiten</span>
                      <b className="caret" />
                    </a>
                    <ul className="dropdown-menu">
                      <li
                        data-needs-fetching="false"
                        data-identifier="824a5560d7d4b2153fbf7dbc8af5d6bc"
                      >
                        <a href="#">Neu hier?</a>
                      </li>
                      <li
                        data-needs-fetching="false"
                        data-identifier="e2a2fee756302401bad18e807a8d9e9b"
                      >
                        <a href="#">Ungeprüfte Bearbeitungen</a>
                      </li>
                      <li
                        data-needs-fetching="false"
                        data-identifier="6274acc4e9ffdcfa46f003de82dbf1fe"
                      >
                        <a href="#">Papierkorb</a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
              <div
                id="subject-nav-sticky-wrapper"
                className="sticky-wrapper"
                style={{
                  height: '45px'
                }}
              >
                <nav id="subject-nav">
                  <div id="subject-nav-wrapper">
                    <div className="subject-nav-center">
                      <div className="pull-right controls">
                        {editable ? (
                          <div className="btn-group">
                            <button
                              id="ory-editor-save"
                              className="btn btn-success"
                              onClick={onSave}
                            >
                              <span className="fa fa-save" /> Save
                            </button>
                            <button
                              id="ory-editor-abort"
                              className="btn btn-danger"
                              onClick={onAbort}
                            >
                              <span className="fa fa-times" /> Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="btn-group btn-group-community">
                            <button
                              className="btn btn-success"
                              onClick={onEdit}
                            >
                              <span className="fa fa-pencil" />
                            </button>
                            <button
                              type="button"
                              className="btn btn-success dropdown-toggle"
                              data-toggle="dropdown"
                              aria-expanded="false"
                            >
                              <span className="fa fa-cog" />
                              <span className="sr-only">
                                Dropdown ein-/ausklappen
                              </span>
                            </button>
                            <ul
                              className="dropdown-menu pull-right"
                              role="menu"
                            >
                              <li className="dropdown-submenu">
                                <a rel="nofollow" tabIndex={-1} href="#">
                                  <span className="fa fa-volume-up" />{' '}
                                  Abonnieren
                                </a>
                                <ul className="dropdown-menu left">
                                  <li>
                                    <a rel="nofollow" href="#">
                                      <span className="fa fa-volume-down" />
                                      Benachrichtigungen empfangen
                                    </a>
                                  </li>
                                  <li>
                                    <a rel="nofollow" href="#">
                                      <span className="fa fa-volume-up" />
                                      Benachrichtigungen und E-Mails erhalten
                                    </a>
                                  </li>
                                </ul>
                              </li>
                              <li>
                                <a rel="nofollow" href="#">
                                  <span className="fa fa-clock-o" />
                                  Bearbeitungsverlauf
                                </a>
                              </li>
                              <li>
                                <a
                                  href="#"
                                  data-title="Diesen Inhalt teilen"
                                  data-type="info"
                                  data-cancel="false"
                                >
                                  <span className="fa fa-link" /> Teilen
                                </a>
                              </li>
                              <li>
                                <a rel="nofollow" href="#">
                                  <span className="fa fa-link" />
                                  Zugehörige Inhalte verwalten
                                </a>
                              </li>
                              <li>
                                <a rel="nofollow" href="#">
                                  <span className="fa fa-heartbeat" />
                                  Verlauf
                                </a>
                              </li>
                            </ul>
                          </div>
                        )}
                      </div>
                      <ol id="breadcrumbs" />
                    </div>
                    <div id="search-content">
                      <form
                        method="get"
                        className="form-search inline"
                        role="search"
                        action="#"
                      >
                        <div className="form-group">
                          <div className="input-group">
                            <input
                              id="search-input"
                              placeholder="Suchen"
                              tabIndex={-1}
                              name="q"
                              type="search"
                            />
                            <div className="input-group-addon">
                              <button type="submit" className="btn">
                                <i className="fa fa-lg fa-search" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </header>
          <div id="page" className="container clearfix has-sidebar">
            <aside className="side-navigation side-element">
              <div className="layout-toggle">
                <i className="fa fa-bars" />
                <i className="fa fa-times" />
              </div>
              <div className="side-element-inner">
                <nav>
                  <div id="navigation-content">
                    <ul
                      id="main-nav"
                      className="nav"
                      itemScope
                      itemType="http://data-vocabulary.org/Breadcrumb"
                    >
                      <li data-identifier="82a831faa7f516125a8c4accd0e6bbe7">
                        <a href="#">
                          <span>Gymnasium</span>
                        </a>
                      </li>
                      <li
                        data-needs-fetching="true"
                        className="is-community"
                        data-identifier="b8b03f26f366eab97bef52ddd36637a1"
                      >
                        <a href="#">
                          <span>Bei Serlo-Mathematik mitarbeiten</span>
                        </a>
                        <ul> </ul>
                      </li>
                    </ul>
                  </div>
                </nav>
                <ul id="side-navigation-social">
                  <li>
                    <a href="#" className="">
                      Newsletter
                    </a>
                  </li>
                  <li>
                    <a href="#" className="">
                      <span className="fa fa-facebook-square" />
                      <span className="sr-only">Facebook</span>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="">
                      <span className="fa fa-twitter-square" />
                      <span className="sr-only">Twitter</span>
                    </a>
                  </li>
                </ul>
              </div>
            </aside>
            <section className="main clearfix">
              <div id="content-layout" className="content clearfix">
                <div className="flasher" />
                <div itemScope itemType="http://schema.org/Article">
                  <div itemProp="articleBody">
                    <article>
                      <div className="page-header">
                        <h1>
                          <span itemProp="name">Artikel schreiben</span>
                        </h1>
                      </div>
                      <section>
                        <div className="editable">{children}</div>
                      </section>
                      <div className="separator" />
                      <section>
                        <div className="row">
                          <div className="col-xs-12">
                            <a
                              href="https://creativecommons.org/licenses/by-sa/4.0/"
                              rel="license nofollow"
                            >
                              Dieses Werk steht unter der freien Lizenz
                              cc-by-sa-4.0
                            </a>
                            <sub>
                              <a href="#">Information</a>
                            </sub>
                          </div>
                        </div>
                      </section>
                      <section id="discussion-65056">
                        <div className="h2 heading-content">
                          <a
                            className="discussion-start btn btn-success pull-right"
                            href="#"
                          >
                            <span className="fa fa-comments" /> Kommentieren
                          </a>
                          <span>Kommentare</span>
                        </div>
                        <div className="discussions" />
                      </section>
                    </article>
                  </div>
                </div>
              </div>
              <aside className="side-element side-context  ">
                <div id="sidebar-toggle" className="layout-toggle">
                  <i className="fa fa-bars" />
                  <i className="fa fa-times" />
                </div>
                <div className="side-element-inner">
                  <i className="fa fa-asterisk" />
                  <div className="sidebar-content-group">
                    <ul className="nav nav-aside">
                      <li className="nav-aside-header">
                        <h4>Zugehörige Themen</h4>
                      </li>
                      <li itemProp="relatedLink">
                        <a href="#">Konstruktion von geometrischen Objekten</a>
                      </li>
                    </ul>
                  </div>
                </div>
              </aside>
              <div id="horizon" />
            </section>
          </div>
        </div>
        <script
          type="text/javascript"
          src="https://packages.serlo.org/athene2-assets@a/main.js"
        />
      </div>
    </React.Fragment>
  )
}
