// 단축키 데이터 관리 모듈
class ShortcutData {
    constructor() {
        this.shortcuts = null;
        this.loaded = false;
    }

    // 데이터 로드
    async loadData() {
        try {
            const response = await fetch('data/shortcuts.json');
            this.shortcuts = await response.json();
            this.loaded = true;
            return this.shortcuts;
        } catch (error) {
            console.error('데이터 로드 실패:', error);
            throw error;
        }
    }

    // 카테고리별 단축키 가져오기
    getShortcutsByCategory(category) {
        if (!this.loaded) {
            throw new Error('데이터가 로드되지 않았습니다.');
        }
        return this.shortcuts[category]?.items || [];
    }

    // 검색어로 단축키 검색
    searchShortcuts(query) {
        if (!this.loaded) {
            throw new Error('데이터가 로드되지 않았습니다.');
        }

        query = query.toLowerCase();
        const results = {};

        for (const category in this.shortcuts) {
            const categoryData = this.shortcuts[category];
            results[category] = categoryData.items.filter(shortcut => 
                shortcut.shortcut.toLowerCase().includes(query) ||
                shortcut.description.toLowerCase().includes(query)
            );
        }

        return results;
    }

    // 학습 상태 저장
    saveLearningState(categoryId, shortcutId, learned) {
        const key = `shortcut_${categoryId}_${shortcutId}`;
        localStorage.setItem(key, learned);
    }

    // 학습 상태 불러오기
    getLearningState(categoryId, shortcutId) {
        const key = `shortcut_${categoryId}_${shortcutId}`;
        return localStorage.getItem(key) === 'true';
    }

    // 카테고리 정보 가져오기
    getCategoryInfo(category) {
        if (!this.loaded) {
            throw new Error('데이터가 로드되지 않았습니다.');
        }
        return this.shortcuts[category] || null;
    }

    // 모든 카테고리 정보 가져오기
    getAllCategories() {
        if (!this.loaded) {
            throw new Error('데이터가 로드되지 않았습니다.');
        }
        return Object.values(this.shortcuts).map(category => ({
            id: category.id,
            name: category.name
        }));
    }
}

// 전역 인스턴스 생성
const shortcutData = new ShortcutData(); 