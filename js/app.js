// DOM 요소
const shortcutsContainer = document.getElementById('shortcutsContainer');
const searchInput = document.getElementById('search');
const categoryLinks = document.querySelectorAll('.category-list a');
const settingsBtn = document.getElementById('settingsBtn');

// 현재 선택된 카테고리
let currentCategory = 'windows';

// 학습 통계 데이터
class LearningStats {
    constructor() {
        this.stats = JSON.parse(localStorage.getItem('learningStats')) || {
            total: 0,
            learned: 0,
            dailyGoal: 5,
            lastUpdated: new Date().toDateString()
        };
    }

    // 학습 상태 업데이트
    updateStats(learned) {
        const today = new Date().toDateString();
        
        // 날짜가 바뀌었으면 일일 목표 초기화
        if (today !== this.stats.lastUpdated) {
            this.stats.learned = 0;
            this.stats.lastUpdated = today;
        }

        if (learned) {
            this.stats.learned++;
        }
        
        this.saveStats();
    }

    // 통계 저장
    saveStats() {
        localStorage.setItem('learningStats', JSON.stringify(this.stats));
    }

    // 일일 목표 설정
    setDailyGoal(goal) {
        this.stats.dailyGoal = goal;
        this.saveStats();
    }

    // 진행률 계산
    getProgress() {
        return {
            percentage: Math.min(100, (this.stats.learned / this.stats.dailyGoal) * 100),
            learned: this.stats.learned,
            goal: this.stats.dailyGoal
        };
    }
}

// 통계 인스턴스 생성
const learningStats = new LearningStats();

// 통계 표시 업데이트
function updateStatsDisplay() {
    const progress = learningStats.getProgress();
    const statsElement = document.querySelector('.stats-container');
    
    if (statsElement) {
        statsElement.innerHTML = `
            <div class="progress-bar">
                <div class="progress" style="width: ${progress.percentage}%"></div>
            </div>
            <div class="stats-info">
                <span>오늘의 목표: ${progress.learned}/${progress.goal}</span>
                <span>달성률: ${Math.round(progress.percentage)}%</span>
            </div>
        `;
    }
}

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
        learningStats.updateStats(learned);
        updateStatsDisplay();
        
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
            
            // 활성 카테고리 표시
            categoryLinks.forEach(link => link.classList.remove('active'));
            e.target.classList.add('active');
        });
        li.appendChild(a);
        categoryList.appendChild(li);
    });
}

// 설정 모달 표시
function showSettingsModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>설정</h2>
            <div class="setting-item">
                <label>일일 학습 목표</label>
                <input type="number" id="dailyGoal" min="1" max="50" value="${learningStats.stats.dailyGoal}">
            </div>
            <div class="modal-buttons">
                <button id="saveSettings">저장</button>
                <button id="closeModal">닫기</button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // 이벤트 리스너
    document.getElementById('saveSettings').addEventListener('click', () => {
        const goal = parseInt(document.getElementById('dailyGoal').value);
        if (goal > 0) {
            learningStats.setDailyGoal(goal);
            updateStatsDisplay();
        }
        modal.remove();
    });

    document.getElementById('closeModal').addEventListener('click', () => {
        modal.remove();
    });
}

// 이벤트 리스너 설정
searchInput.addEventListener('input', handleSearch);
settingsBtn.addEventListener('click', showSettingsModal);

// 초기화
async function initialize() {
    try {
        await shortcutData.loadData();
        updateCategoryMenu();
        displayShortcuts(currentCategory);
        updateStatsDisplay();
    } catch (error) {
        console.error('초기화 실패:', error);
    }
}

// 앱 시작
initialize(); 