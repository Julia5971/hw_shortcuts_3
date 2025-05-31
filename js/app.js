// DOM 요소
const shortcutsContainer = document.getElementById('shortcutsContainer');
const searchInput = document.getElementById('search');
const categoryLinks = document.querySelectorAll('.category-list a');

// 현재 선택된 카테고리
let currentCategory = 'windows';

// 단축키 카드 생성
function createShortcutCard(shortcut) {
    const card = document.createElement('div');
    card.className = 'shortcut-card';
    card.innerHTML = `
        <div class="shortcut-header">
            <h3>${shortcut.shortcut}</h3>
            <label class="checkbox-container">
                <input type="checkbox" class="learned-checkbox" 
                    data-category="${shortcut.category}" 
                    data-id="${shortcut.id}"
                    ${shortcutData.getLearningState(shortcut.category, shortcut.id) ? 'checked' : ''}>
                <span class="checkmark"></span>
            </label>
        </div>
        <p class="description">${shortcut.description}</p>
    `;

    // 체크박스 이벤트 리스너
    const checkbox = card.querySelector('.learned-checkbox');
    checkbox.addEventListener('change', (e) => {
        const category = e.target.dataset.category;
        const id = e.target.dataset.id;
        const learned = e.target.checked;
        
        shortcutData.saveLearningState(category, id, learned);
        if (learned) {
            card.style.opacity = '0.5';
            setTimeout(() => card.remove(), 300);
        }
    });

    return card;
}

// 단축키 목록 표시
async function displayShortcuts(category) {
    try {
        const shortcuts = shortcutData.getShortcutsByCategory(category);
        shortcutsContainer.innerHTML = '';
        
        shortcuts.forEach(shortcut => {
            if (!shortcutData.getLearningState(shortcut.category, shortcut.id)) {
                const card = createShortcutCard(shortcut);
                shortcutsContainer.appendChild(card);
            }
        });
    } catch (error) {
        console.error('단축키 표시 실패:', error);
    }
}

// 검색 기능
function handleSearch() {
    const query = searchInput.value.trim();
    if (query === '') {
        displayShortcuts(currentCategory);
        return;
    }

    const results = shortcutData.searchShortcuts(query);
    shortcutsContainer.innerHTML = '';

    for (const category in results) {
        results[category].forEach(shortcut => {
            if (!shortcutData.getLearningState(shortcut.category, shortcut.id)) {
                const card = createShortcutCard(shortcut);
                shortcutsContainer.appendChild(card);
            }
        });
    }
}

// 이벤트 리스너 설정
categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        currentCategory = e.target.dataset.category;
        displayShortcuts(currentCategory);
    });
});

searchInput.addEventListener('input', handleSearch);

// 초기화
async function initialize() {
    try {
        await shortcutData.loadData();
        displayShortcuts(currentCategory);
    } catch (error) {
        console.error('초기화 실패:', error);
    }
}

// 앱 시작
initialize(); 