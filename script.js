document.addEventListener('DOMContentLoaded', () => {
    // State
    const initialSeed = [
        { url: "https://chatgpt.com/", title: "ChatGPT", category: "AI" },
        { url: "https://chat.deepseek.com/", title: "DeepSeek", category: "AI" },
        { url: "https://www.kimi.com/", title: "Kimi AI", category: "AI" },
        { url: "https://ideogram.ai/", title: "Ideogram", category: "Design" },
        { url: "https://app.youlearn.ai/", title: "YouLearn", category: "Study" },
        { url: "https://app.napkin.ai/", title: "Napkin AI", category: "AI" },
        { url: "https://www.perplexity.ai/", title: "Perplexity", category: "AI" },
        { url: "https://gemini.google.com/", title: "Google Gemini", category: "AI" },
        { url: "https://replit.com/", title: "Replit Workspace", category: "Code" },
        { url: "https://grok.com/", title: "Grok AI", category: "AI" },
        { url: "https://huggingface.co/", title: "Hugging Face", category: "AI" },
        { url: "https://github.com/MIHMahmudEli/PasswordVault", title: "PasswordVault Repo", category: "Code" },
        { url: "https://app.diagrams.net/", title: "Diagrams.net", category: "Design" },
        { url: "https://www.figma.com/", title: "Figma Design", category: "Design" },
        { url: "https://dash.infinityfree.com/", title: "InfinityFree", category: "Hosting" },
        { url: "https://www.duckdns.org/", title: "DuckDNS", category: "Network" },
        { url: "https://portal.aiub.edu/", title: "AIUB Portal", category: "University" },
        { url: "https://www.youtube.com/", title: "YouTube", category: "Media" },
        { url: "https://9animetv.to/", title: "9Anime", category: "Media" },
        { url: "https://rra.onukrom.xyz/", title: "RRA Onukrom", category: "General" },
        { url: "https://wokwi.com/", title: "Wokwi Arduino", category: "Code" },
        { url: "https://excalidraw.com/", title: "Excalidraw", category: "Design" },
        { url: "https://notepad.pw/mih22", title: "Shared Notepad", category: "Tool" },
        { url: "https://www.gatevidyalay.com/", title: "Gate Vidyalay", category: "Study" },
        { url: "https://vercel.com/", title: "Vercel Dash", category: "Hosting" },
        { url: "https://analytics.google.com/", title: "Google Analytics", category: "Tool" },
        { url: "https://app.emergent.sh/", title: "Emergent", category: "General" },
        { url: "https://www.tutorialspoint.com/compilers/", title: "Assembly Compiler", category: "Code" }
    ];

    let bookmarks = JSON.parse(localStorage.getItem('myBookmarkHub_pins')) || initialSeed;
    let currentCategory = 'all';
    let draggedItem = null;

    // Elements
    const grid = document.getElementById('pin-grid');
    const syncInput = document.getElementById('auto-pin-input');
    const syncBtn = document.getElementById('sync-btn');
    const searchInput = document.getElementById('search-proxy');
    const sidebarCategories = document.getElementById('sidebar-categories');
    const themeSwitcher = document.getElementById('theme-switcher');
    
    // Header Elements
    const greetingText = document.getElementById('greeting-text');

    // Init Lucide
    lucide.createIcons();

    // Theme Logic
    const initTheme = () => {
        const savedTheme = localStorage.getItem('myBookmarkHub_theme') || 'midnight';
        document.body.setAttribute('data-theme', savedTheme);
        document.querySelectorAll('.theme-swatch').forEach(sw => {
            sw.classList.toggle('active', sw.dataset.theme === savedTheme);
        });
    };

    themeSwitcher.addEventListener('click', (e) => {
        const swatch = e.target.closest('.theme-swatch');
        if (!swatch) return;
        const theme = swatch.dataset.theme;
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('myBookmarkHub_theme', theme);
        document.querySelectorAll('.theme-swatch').forEach(sw => sw.classList.remove('active'));
        swatch.classList.add('active');
        renderSidebar();
        renderPins();
    });

    const updateGreeting = () => {
        const hour = new Date().getHours();
        const user = "Mohsin";
        if (hour < 12) greetingText.innerText = `Morning, ${user}`;
        else if (hour < 18) greetingText.innerText = `Afternoon, ${user}`;
        else greetingText.innerText = `Evening, ${user}`;
    };

    const saveAndSync = () => {
        localStorage.setItem('myBookmarkHub_pins', JSON.stringify(bookmarks));
    };

    const getFaviconUrl = (url) => {
        try {
            const domain = new URL(url).hostname;
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
        } catch (e) { return 'https://lucide.dev/favicon.ico'; }
    };

    const renderSidebar = () => {
        const cats = ['all', ...new Set(bookmarks.map(b => b.category))];
        sidebarCategories.innerHTML = '';
        
        cats.forEach(cat => {
            const count = cat === 'all' ? bookmarks.length : bookmarks.filter(b => b.category === cat).length;
            const div = document.createElement('div');
            div.className = `category-item ${cat.toLowerCase() === currentCategory.toLowerCase() ? 'active' : ''}`;
            
            const iconMap = { all: 'layout-grid', code: 'code', study: 'book-open', design: 'pen-tool', ai: 'cpu', media: 'play', hosting: 'server', university: 'graduation-cap', general: 'globe', tool: 'wrench', network: 'share-2' };
            const iconName = iconMap[cat.toLowerCase()] || 'folder';
            
            div.innerHTML = `
                <div style="display: flex; align-items: center; gap: 12px;">
                    <i data-lucide="${iconName}" style="width: 16px; height: 16px;"></i>
                    <span>${cat === 'all' ? 'All Modules' : cat}</span>
                </div>
                <span class="item-count">${count}</span>
            `;
            div.onclick = () => {
                currentCategory = cat.toLowerCase();
                renderSidebar();
                renderPins();
            };
            sidebarCategories.appendChild(div);
        });
        lucide.createIcons();
    };

    const renderPins = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filtered = bookmarks.filter(b => {
            const matchesSearch = b.title.toLowerCase().includes(searchTerm) || b.url.toLowerCase().includes(searchTerm);
            const matchesCat = currentCategory === 'all' || b.category.toLowerCase() === currentCategory;
            return matchesSearch && matchesCat;
        });

        grid.innerHTML = '';
        if (filtered.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 4rem; color: var(--text-dim);">No synchronization nodes found.</div>';
            return;
        }

        filtered.forEach((b, index) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style = `--order: ${index}`;
            card.draggable = true;
            card.innerHTML = `
                <div class="card-top">
                    <div class="icon-wrapper">
                        <img src="${getFaviconUrl(b.url)}" alt="">
                    </div>
                    <button class="remove-pin" title="Remove Link">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="card-info" onclick="window.open('${b.url}', '_blank')">
                    <h3>${b.title}</h3>
                    <p>${b.url}</p>
                </div>
                <div class="card-footer">
                    <span class="badge">${b.category}</span>
                    <a href="${b.url}" target="_blank" class="visit-link">
                        <span>EXECUTE</span>
                        <i data-lucide="chevron-right"></i>
                    </a>
                </div>
            `;

            // Delete Event
            const deleteBtn = card.querySelector('.remove-pin');
            deleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                deletePin(b.url);
            });

            // Drag and Drop Events
            card.addEventListener('dragstart', (e) => {
                draggedItem = b;
                card.classList.add('dragging');
            });

            card.addEventListener('dragend', () => {
                card.classList.remove('dragging');
                document.querySelectorAll('.card').forEach(c => c.classList.remove('drag-over'));
            });

            card.addEventListener('dragover', (e) => {
                e.preventDefault();
                card.classList.add('drag-over');
            });

            card.addEventListener('dragleave', () => {
                card.classList.remove('drag-over');
            });

            card.addEventListener('drop', (e) => {
                e.preventDefault();
                if (draggedItem && draggedItem.url !== b.url) {
                    const fromIndex = bookmarks.indexOf(draggedItem);
                    const toIndex = bookmarks.indexOf(b);
                    bookmarks.splice(fromIndex, 1);
                    bookmarks.splice(toIndex, 0, draggedItem);
                    saveAndSync();
                    renderPins();
                }
            });

            grid.appendChild(card);
        });
        lucide.createIcons();
    };

    window.deletePin = (url) => {
        bookmarks = bookmarks.filter(b => b.url !== url);
        saveAndSync();
        renderSidebar();
        renderPins();
    };

    syncBtn.onclick = () => {
        const url = syncInput.value.trim();
        if (!url) return;
        const fixedUrl = url.startsWith('http') ? url : `https://${url}`;
        try {
            const domain = new URL(fixedUrl).hostname.replace('www.', '').split('.')[0];
            bookmarks.unshift({ 
                title: domain.charAt(0).toUpperCase() + domain.slice(1), 
                url: fixedUrl, 
                category: 'General', 
                timestamp: Date.now() 
            });
            saveAndSync();
            renderSidebar();
            renderPins();
            syncInput.value = '';
        } catch(e) {}
    };

    syncInput.onkeydown = (e) => { if (e.key === 'Enter') syncBtn.click(); };
    searchInput.oninput = renderPins;

    initTheme();
    updateGreeting();
    renderSidebar();
    renderPins();
});
