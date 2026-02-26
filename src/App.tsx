function App() {
  return (
    <div style={{
      padding: '40px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      color: 'white',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>
        MS2WM Migration Dashboard
      </h1>
      <p style={{ fontSize: '24px', opacity: 0.9 }}>
        System is loading...
      </p>
      <div style={{
        marginTop: '40px',
        padding: '30px',
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '12px'
      }}>
        <p style={{ fontSize: '18px' }}>
          If you can see this, React is working correctly.
        </p>
      </div>
    </div>
  );
}

export default App;
