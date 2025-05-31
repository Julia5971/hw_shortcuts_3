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
        const categoryInfo = shortcutData.getCategoryInfo(category);
        
        // 카테고리 제목 추가
        const categoryTitle = document.createElement('h2');
        categoryTitle.className = 'category-title';
        categoryTitle.textContent = categoryInfo.name;
        
        shortcutsContainer.innerHTML = '';
        shortcutsContainer.appendChild(categoryTitle);
        
        // 단축키 카드 추가
        shortcuts.forEach(shortcut => {
            if (!shortcutData.getLearningState(shortcut.category, shortcut.id)) {
                const card = createShortcutCard(shortcut);
                shortcutsContainer.appendChild(card);
            }
        });

        // 학습된 단축키가 없는 경우 메시지 표시
        if (shortcutsContainer.children.length === 1) {
            const message = document.createElement('p');
            message.className = 'no-shortcuts';
            message.textContent = '모든 단축키를 학습했습니다!';
            shortcutsContainer.appendChild(message);
        }
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

    let hasResults = false;
    for (const category in results) {
        if (results[category].length > 0) {
            const categoryInfo = shortcutData.getCategoryInfo(category);
            const categoryTitle = document.createElement('h2');
            categoryTitle.className = 'category-title';
            categoryTitle.textContent = categoryInfo.name;
            shortcutsContainer.appendChild(categoryTitle);

            results[category].forEach(shortcut => {
                if (!shortcutData.getLearningState(shortcut.category, shortcut.id)) {
                    const card = createShortcutCard(shortcut);
                    shortcutsContainer.appendChild(card);
                    hasResults = true;
                }
            });
        }
    }

    if (!hasResults) {
        const message = document.createElement('p');
        message.className = 'no-results';
        message.textContent = '검색 결과가 없습니다.';
        shortcutsContainer.appendChild(message);
    }
}

// 카테고리 메뉴 업데이트
function updateCategoryMenu() {
    const categories = shortcutData.getAllCategories();
    const categoryList = document.querySelector('.category-list');
    categoryList.innerHTML = '';

    categories.forEach(category => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.dataset.category = category.id;
        a.textContent = category.name;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            currentCategory = category.id;
            displayShortcuts(currentCategory);
        });
        li.appendChild(a);
        categoryList.appendChild(li);
    });
}

// 이벤트 리스너 설정
searchInput.addEventListener('input', handleSearch);

// 초기화
async function initialize() {
    try {
        await shortcutData.loadData();
        updateCategoryMenu();
        displayShortcuts(currentCategory);
    } catch (error) {
        console.error('초기화 실패:', error);
    }
}

// 앱 시작
initialize(); 