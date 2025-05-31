// 단축키 데이터 관리 모듈
class ShortcutData {
    constructor() {
        this.shortcuts = null;
        this.loaded = false;
    }

    // 데이터 로드
    async loadData() {
        try {
            const response = await fetch('../data/shortcuts.json');
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
        return this.shortcuts[category] || [];
    }

    // 검색어로 단축키 검색
    searchShortcuts(query) {
        if (!this.loaded) {
            throw new Error('데이터가 로드되지 않았습니다.');
        }

        query = query.toLowerCase();
        const results = {};

        for (const category in this.shortcuts) {
            results[category] = this.shortcuts[category].filter(shortcut => 
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
}

// 전역 인스턴스 생성
const shortcutData = new ShortcutData(); 