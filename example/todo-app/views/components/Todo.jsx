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

  return (
    <div className="todo-box">
      <div className="todo-row">
        <input
          className="todo-input"
          placeholder="Tambah tugas..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <button className="todo-add" onClick={addItem}>Tambah</button>
      </div>
      <div className="todo-list">
        {items.length === 0 ? (
          <p className="todo-empty">Belum ada tugas</p>
        ) : (
          items.map((i) => (
            <div key={i.id} className="todo-item">
              <div className="todo-left">
                <input type="checkbox" checked={i.done} onChange={() => toggleItem(i.id)} />
                <span className={i.done ? 'todo-text done' : 'todo-text'}>{i.text}</span>
              </div>
              <button className="todo-delete" onClick={() => removeItem(i.id)}>Hapus</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

module.exports = Todo;
