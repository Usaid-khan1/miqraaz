import { LOGO_BLACK } from '../data.js'

export function PageLoader({ fullScreen = false, text = 'LOADING' }) {
  return (
    <div className={`page-loader-screen ${fullScreen ? 'fullscreen' : ''}`}>
      <div className="page-loader-inner">
        <div className="page-loader-logo-wrap">
          <img src={LOGO_BLACK} alt="MIQRAAZ" className="page-loader-logo" />
        </div>
        <div className="page-loader-spinner" />
        {text && <div className="page-loader-text">{text}</div>}
      </div>
    </div>
  )
}
