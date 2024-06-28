
import { useEffect } from 'react'
import wordchartsLogoUrl from '../assets/images/wordcharts-logo-white.svg'

function LeftColumn(): React.ReactElement {
  useEffect((): void => {
    // configure link list - on iOS, the navigation bar is dynamic. when it's expanded,
    // the link list would be below the fold or very close to the edge.
    // to handle this, we adjust the size of the column to the inner height of the window
    const leftColumn = document.getElementById('left-column')

    function setLeftColumnHeight(): void {
      leftColumn?.setAttribute('style', `height: ${window.innerHeight}px !important`)
    }
    // change the left column size whenever the window is resized
    window.addEventListener('resize', setLeftColumnHeight)

    // call initially:
    setLeftColumnHeight()
  })

  return (
    <div className="">
      <div className="d-lg-none">
        <div id="static-footer" className="footer fixed-bottom bg-gradient bg-gradient-primary">
          <div className="row">
            <div className="d-flex align-items-center">
              <div className="col-1 col-sm-2">
                <a href="">
                  <img id="static-footer-logo" src={wordchartsLogoUrl} className="img-fluid d-block"
                    width="100%" alt="wordcharts Logo" />
                </a>
              </div>
              <div className="col-11 col-sm-10 d-flex justify-content-end">
                <a href="https://github.com/kitsteam/wordcharts" className="text-white px-lg-2 p-2 text-decoration-none">GitHub</a>
                <a href="https://kits.blog/impressum/" className="text-white px-lg-2 p-2 text-decoration-none">Impressum</a>
                <a href="https://kits.blog/datenschutz/#wordcharts" className="text-white p-2 text-decoration-none">Datenschutz</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="d-none d-lg-block">

        <div id="left-column"
          className="order float-start position-fixed vh-100 bg-gradient bg-gradient-primary w-50 d-flex flex-column align-items-center justify-content-between">
          <div></div>
          <div>
            <a href="">
              <img src={wordchartsLogoUrl} className="img-fluid d-block" alt="wordcharts Logo" />
            </a>
          </div>
          <div id="footer-links" className="d-flex align-items-center mb-1">
            <a href="https://github.com/kitsteam/wordcharts" className="text-white px-lg-2 p-2 text-decoration-none">GitHub</a>
            <a href="https://kits.blog/impressum/" className="text-white px-lg-2 p-2 text-decoration-none">Impressum</a>
            <a href="https://kits.blog/datenschutz/#wordcharts" className="text-white p-2 text-decoration-none">Datenschutz</a>
          </div>
        </div>
      </div>
    </div>
  )
}
export default LeftColumn
