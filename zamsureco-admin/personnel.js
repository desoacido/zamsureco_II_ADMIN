(function () {
  let cache = null;

  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  async function load(client) {
    if (cache) return cache;
    const { data, error } = await client.from('linemen').select('name, team, role, status');
    cache = error ? [] : (data || []);
    return cache;
  }

  function choicesFor(list, role) {
    const active = list.filter(p => (p.status || 'active') === 'active' && (p.role || 'Line Crew') === role);
    const names = role === 'Engineer'
      ? active.map(p => (p.name || '').trim())
      : active.map(p => (p.team || '').trim() || (p.name || '').trim());
    return [...new Set(names.filter(Boolean))].sort((a, b) => a.localeCompare(b));
  }

  window.fillPersonnel = async function (client, root) {
    const scope = root || document;
    const selects = scope.querySelectorAll('select[data-personnel]');
    if (!selects.length) return;
    const list = await load(client);

    selects.forEach(sel => {
      const role = sel.dataset.personnel;
      const current = sel.dataset.current || '';
      const choices = choicesFor(list, role);
      if (current && !choices.includes(current)) choices.unshift(current);

      const noun = role === 'Engineer' ? 'engineer' : 'line crew';
      const first = choices.length
        ? `<option value="">Select ${noun}</option>`
        : `<option value="">No active ${noun} yet. Add one in Field Personnel.</option>`;

      sel.innerHTML = first + choices.map(c => `<option value="${esc(c)}"${c === current ? ' selected' : ''}>${esc(c)}</option>`).join('');
    });
  };

  window.resetPersonnel = function () { cache = null; };
})();
