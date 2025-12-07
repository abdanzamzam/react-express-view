const React = require('react');
const { useState } = require('react');

function Todo() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');

  const addItem = () => {
    const text = input.trim();
    if (!text) return;
    setItems([{ id: Date.now(), text, done: false }, ...items]);
    setInput('');
  };

  const toggleItem = (id) => {
    setItems(items.map((i) => (i.id === id ? { ...i, done: !i.done } : i)));
  };

  const removeItem = (id) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') addItem();
  };

  const box = {
    border: '1px solid #e5e7eb',
    borderRadius: '14px',
    padding: '16px',
    background: '#fafafa'
  };
  const row = {
    display: 'flex',
    gap: '10px',
    alignItems: 'center'
  };
  const inputStyle = {
    flex: 1,
    padding: '12px 14px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    background: '#f9fafb',
    outline: 'none',
    fontSize: '14px',
    color: '#0f172a'
  };
  const addBtn = {
    padding: '10px 14px',
    borderRadius: '12px',
    border: 'none',
    background: '#111827',
    color: '#ffffff',
    fontWeight: 600,
    cursor: 'pointer'
  };
  const list = {
    marginTop: '14px'
  };
  const item = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    borderRadius: '12px',
    background: '#ffffff',
    border: '1px solid #e5e7eb',
    marginBottom: '10px'
  };
  const left = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  };
  const text = (done) => ({
    fontSize: '14px',
    color: done ? '#94a3b8' : '#0f172a',
    textDecoration: done ? 'line-through' : 'none'
  });
  const delBtn = {
    padding: '8px 10px',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
    background: '#ffffff',
    color: '#ef4444',
    cursor: 'pointer'
  };

  return (
    React.createElement('div', { style: box },
      React.createElement('div', { style: row },
        React.createElement('input', {
          style: inputStyle,
          placeholder: 'Tambah tugas...',
          value: input,
          onChange: (e) => setInput(e.target.value),
          onKeyDown
        }),
        React.createElement('button', { style: addBtn, onClick: addItem }, 'Tambah')
      ),
      React.createElement('div', { style: list },
        items.length === 0
          ? React.createElement('p', { style: { color: '#94a3b8', fontSize: '14px', margin: 0 } }, 'Belum ada tugas')
          : items.map((i) => (
              React.createElement('div', { key: i.id, style: item },
                React.createElement('div', { style: left },
                  React.createElement('input', { type: 'checkbox', checked: i.done, onChange: () => toggleItem(i.id) }),
                  React.createElement('span', { style: text(i.done) }, i.text)
                ),
                React.createElement('button', { style: delBtn, onClick: () => removeItem(i.id) }, 'Hapus')
              )
            ))
      )
    )
  );
}

module.exports = Todo;
