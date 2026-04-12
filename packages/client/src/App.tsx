import './App.css'

const App = () => {
  return (
    <main className="ssr-page">
      <section className="ssr-card">
        <p className="ssr-eyebrow">Express + React</p>
        <h1>Server Side Rendering</h1>
        <p className="ssr-description">
          This React page is rendered on the Express server with{' '}
          <code>renderToString()</code>, then hydrated in the browser.
        </p>
        <ul className="ssr-list">
          <li>Express handles the page request.</li>
          <li>ReactDOMServer creates the HTML string on the server.</li>
          <li>The client bundle connects interactivity through hydration.</li>
        </ul>
      </section>
    </main>
  )
}

export default App
