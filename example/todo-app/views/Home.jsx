const React = require('react');
const Todo = require('./components/Todo');

function Home(props) {
  const page = {
    minHeight: '100vh',
    background: '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px'
  };
  const card = {
    width: '100%',
    maxWidth: '640px',
    background: '#ffffff',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    padding: '28px',
    color: '#0f172a',
    fontFamily: 'Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif'
  };
  const header = {
    marginBottom: '18px'
  };
  const title = {
    fontSize: '28px',
    fontWeight: 700,
    letterSpacing: '0.2px',
    margin: 0
  };
  const subtitle = {
    margin: '6px 0 0',
    color: '#64748b',
    fontSize: '14px'
  };

  return (
    React.createElement('div', { style: page },
      React.createElement('div', { style: card },
        React.createElement('div', { style: header },
          React.createElement('h1', { style: title }, props.title),
          React.createElement('p', { style: subtitle }, props.message || 'Kelola kegiatan harian Anda.')
        ),
        React.createElement(Todo)
      )
    )
  );
}

module.exports = Home;
