document.addEventListener('DOMContentLoaded', () => {
  const listDiv = document.getElementById('extension-list');
  const searchInput = document.getElementById('search');
  const bulkBtn = document.getElementById('bulk-action-btn');
  const bulkLabel = document.getElementById('bulk-action-label');
  const statusText = document.getElementById('status-text');

  let allExtensions = [];
  let didLoad = false;

  function loadExtensions() {
    if (!chrome || !chrome.management || typeof chrome.management.getAll !== 'function') {
      finishLoading([]);
      return;
    }

    let settled = false;
    const timeoutId = setTimeout(() => {
      if (!settled) {
        settled = true;
        finishLoading([]);
      }
    }, 4000);

    try {
      chrome.management.getAll((items) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutId);

        if (chrome.runtime.lastError || !Array.isArray(items)) {
          finishLoading([]);
          return;
        }

        const exts = items.filter(
          (item) => item && item.type === 'extension' && item.id !== chrome.runtime.id
        );
        finishLoading(exts);
      });
    } catch (err) {
      if (!settled) {
        settled = true;
        clearTimeout(timeoutId);
        finishLoading([]);
      }
    }
  }

  function finishLoading(items) {
    allExtensions = items.slice();
    allExtensions.sort((a, b) => a.name.localeCompare(b.name));
    didLoad = true;
    updateBulkButton();
    renderList();
  }

  loadExtensions();

  function createExtItem(ext) {
    const item = document.createElement('div');
    item.className = 'ext-item';
    item.setAttribute('role', 'listitem');

    const info = document.createElement('div');
    info.className = 'ext-info';

    const icon = document.createElement('img');
    icon.className = 'ext-icon';
    icon.alt = '';
    icon.src =
      ext.icons && ext.icons.length > 0
        ? ext.icons[ext.icons.length - 1].url
        : 'data:image/svg+xml;base64,' + btoa(blobSvg());
    icon.onerror = () => {
      icon.src = 'data:image/svg+xml;base64,' + btoa(blobSvg());
    };

    const name = document.createElement('span');
    name.className = 'ext-name';
    name.textContent = ext.name;
    name.title = ext.name;

    info.appendChild(icon);
    info.appendChild(name);

    const toggleLabel = document.createElement('label');
    toggleLabel.className = 'switch';
    toggleLabel.setAttribute('aria-label', `Toggle ${ext.name}`);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = ext.enabled;
    checkbox.setAttribute(
      'aria-label',
      `${ext.name} is ${ext.enabled ? 'enabled' : 'disabled'}`
    );
    checkbox.addEventListener('change', () => {
      handleToggle(ext, checkbox);
    });

    const slider = document.createElement('span');
    slider.className = 'slider';

    toggleLabel.appendChild(checkbox);
    toggleLabel.appendChild(slider);

    item.appendChild(info);
    item.appendChild(toggleLabel);
    return item;
  }

  function handleToggle(ext, checkbox) {
    const wanted = checkbox.checked;
    checkbox.disabled = true;

    chrome.management.setEnabled(ext.id, wanted, () => {
      if (chrome.runtime.lastError) {
        checkbox.checked = ext.enabled;
        showToast('Could not update extension');
      } else {
        ext.enabled = wanted;
        updateBulkButton();
        renderList();
      }
      checkbox.disabled = false;
    });
  }

  function renderList() {
    if (!didLoad) return;

    const term = searchInput.value.trim().toLowerCase();
    const filtered = term
      ? allExtensions.filter((e) => e.name.toLowerCase().includes(term))
      : allExtensions.slice();

    listDiv.innerHTML = '';
    listDiv.removeAttribute('aria-busy');

    if (allExtensions.length === 0) {
      renderEmpty('No extensions installed', 'Install extensions from the Chrome Web Store to manage them here.');
      return;
    }

    if (filtered.length === 0) {
      renderEmpty('No matches found', `No extensions match "${term}". Try a different search.`);
      return;
    }

    const enabled = filtered.filter((e) => e.enabled);
    const disabled = filtered.filter((e) => !e.enabled);

    if (enabled.length > 0) {
      listDiv.appendChild(buildCategoryHeader('enabled', 'Active', enabled.length));
      enabled.forEach((ext) => listDiv.appendChild(createExtItem(ext)));
    }

    if (disabled.length > 0) {
      listDiv.appendChild(buildCategoryHeader('disabled', 'Inactive', disabled.length));
      disabled.forEach((ext) => listDiv.appendChild(createExtItem(ext)));
    }
  }

  function buildCategoryHeader(kind, label, count) {
    const header = document.createElement('div');
    header.className = `category-header ${kind}`;
    header.setAttribute('role', 'presentation');

    const labelEl = document.createElement('span');
    labelEl.textContent = label;

    const countEl = document.createElement('span');
    countEl.className = 'category-count';
    countEl.textContent = count;

    header.appendChild(labelEl);
    header.appendChild(countEl);
    return header;
  }

  function renderEmpty(title, desc) {
    listDiv.innerHTML = '';
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.innerHTML = `
      <svg class="empty-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="11" cy="11" r="7" stroke="currentColor" stroke-width="2"/>
        <path d="m21 21-4.3-4.3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      <h3 class="empty-title">${escapeHtml(title)}</h3>
      <p class="empty-desc">${escapeHtml(desc)}</p>
    `;
    listDiv.appendChild(empty);
  }

  function updateBulkButton() {
    const enabledCount = allExtensions.filter((e) => e.enabled).length;
    const total = allExtensions.length;
    statusText.textContent = total === 0
      ? 'No extensions'
      : `${enabledCount} active of ${total}`;

    if (enabledCount === 0 || total === 0) {
      bulkLabel.textContent = 'Enable All';
      bulkBtn.setAttribute('aria-label', 'Enable all disabled extensions');
      bulkBtn.dataset.mode = 'enable';
    } else {
      bulkLabel.textContent = 'Disable All';
      bulkBtn.setAttribute('aria-label', 'Disable all enabled extensions');
      bulkBtn.dataset.mode = 'disable';
    }
  }

  bulkBtn.addEventListener('click', () => {
    const mode = bulkBtn.dataset.mode === 'enable' ? true : false;
    const targets = allExtensions.filter((e) => e.enabled !== mode);

    if (targets.length === 0) return;

    if (!confirm(`Are you sure you want to ${mode ? 'enable' : 'disable'} ${targets.length} extension${targets.length === 1 ? '' : 's'}?`)) {
      return;
    }

    bulkBtn.disabled = true;
    let completed = 0;
    let failed = 0;

    targets.forEach((ext) => {
      chrome.management.setEnabled(ext.id, mode, () => {
        if (chrome.runtime.lastError) {
          failed++;
        } else {
          ext.enabled = mode;
        }
        completed++;
        if (completed === targets.length) {
          bulkBtn.disabled = false;
          updateBulkButton();
          renderList();
          if (failed > 0) {
            showToast(`Updated ${completed - failed}, failed ${failed}`);
          }
        }
      });
    });
  });

  searchInput.addEventListener('input', () => {
    renderList();
  });

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      switch (c) {
        case '&': return '&';
        case '<': return '<';
        case '>': return '>';
        case '"': return '"';
        case "'": return "'";
      }
    });
  }

  function blobSvg() {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18"><rect width="18" height="18" rx="4" fill="#CBD5E1"/><path d="M5 9h8M9 5v8" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`;
  }

  let toastTimer = null;
  function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.style.cssText = `
        position: fixed;
        top: 8px;
        left: 50%;
        transform: translateX(-50%) translateY(-10px);
        z-index: 9999;
        padding: 8px 14px;
        font-size: 12px;
        font-weight: 500;
        color: #fff;
        background: #0F172A;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        opacity: 0;
        transition: opacity 180ms ease, transform 180ms ease;
        pointer-events: none;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(-10px)';
    }, 2200);
  }
});
