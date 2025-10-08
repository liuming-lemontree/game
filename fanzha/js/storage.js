class StorageManager {
  constructor() {
    // 不再在构造函数中调用init
  }

  init() {
    // 初始化场景数据（如果尚未存在）
    if (!localStorage.getItem('scenarios')) {
      // 注意：这里不再尝试设置scenarios到localStorage
      // 因为在游戏逻辑中我们会直接使用window.scenarios
    }
  }

  saveProgress(progress) {
    try {
      localStorage.setItem('gameProgress', JSON.stringify(progress));
      return true;
    } catch (error) {
      console.error('保存进度失败:', error);
      return false;
    }
  }

  loadProgress() {
    try {
      const progress = localStorage.getItem('gameProgress');
      return progress ? JSON.parse(progress) : null;
    } catch (error) {
      console.error('加载进度失败:', error);
      return null;
    }
  }

  clearProgress() {
    try {
      localStorage.removeItem('gameProgress');
      return true;
    } catch (error) {
      console.error('清除进度失败:', error);
      return false;
    }
  }

  saveTutorialProgress(progress) {
    try {
      localStorage.setItem('tutorialProgress', JSON.stringify(progress));
      return true;
    } catch (error) {
      console.error('保存教程进度失败:', error);
      return false;
    }
  }

  loadTutorialProgress() {
    try {
      const progress = localStorage.getItem('tutorialProgress');
      return progress ? JSON.parse(progress) : null;
    } catch (error) {
      console.error('加载教程进度失败:', error);
      return null;
    }
  }

  saveAchievementProgress(progress) {
    try {
      localStorage.setItem('achievementProgress', JSON.stringify(progress));
      return true;
    } catch (error) {
      console.error('保存成就进度失败:', error);
      return false;
    }
  }

  loadAchievementProgress() {
    try {
      const progress = localStorage.getItem('achievementProgress');
      return progress ? JSON.parse(progress) : null;
    } catch (error) {
      console.error('加载成就进度失败:', error);
      return null;
    }
  }

  // 获取所有进度数据
  getAllProgress() {
    return {
      game: this.loadProgress(),
      tutorial: this.loadTutorialProgress(),
      achievements: this.loadAchievementProgress()
    };
  }
}

// 初始化存储管理器
window.storageManager = new StorageManager();