import React from 'react'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import kitsLogoUrl from '../../assets/images/kits-logo.svg'
import wordchartsLogoUrl from '../../assets/images/wordcharts-logo-dark.svg'
import { NavItem } from 'react-bootstrap'

const Layout = ({ children }: { children: React.ReactNode }): React.ReactElement => {
  //  /*"mb-3 sticky-top navbar-expand-lg navbar-light bg-white border-bottom">
  return (
    <div className="bg-light">
      <Navbar bg="white" className="border-bottom" >
        <Container>
          <Navbar.Brand>
            <a className="text-decoration-none fw-semibold" href="/" title="wordcharts">
              <img src={wordchartsLogoUrl} className="d-inline-block align-text-top me-1" height="24" width="30" alt="wordcharts Logo" />
              WordCharts
            </a>
          </Navbar.Brand>
          <NavItem>
            <a href="https://kits.blog/tools/"><img src={kitsLogoUrl} className="d-inline-block align-text-top mb-2" height="24" alt="kits Logo" /></a>
          </NavItem>
        </Container>

      </Navbar>
      <Container>
        {children}
      </Container>
    </div>
  )
}

export { Layout }
