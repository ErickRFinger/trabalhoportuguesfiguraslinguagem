/**
 * LocalStorage Service for Arena das Figuras de Linguagem
 */
import { INITIAL_QUESTIONS } from '../data/questionsSeed.js';

const STORAGE_KEYS = {
  QUESTIONS: 'arena_figuras_questions_v1',
  HISTORY: 'arena_figuras_history_v1',
  SOUND_ENABLED: 'arena_figuras_sound_v1'
};

export const StorageService = {
  /**
   * Get all questions from LocalStorage (or initialize with seeds if empty)
   */
  getQuestions() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (!data) {
        this.saveQuestions(INITIAL_QUESTIONS);
        return INITIAL_QUESTIONS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error("Erro ao carregar perguntas:", e);
      return INITIAL_QUESTIONS;
    }
  },

  /**
   * Save questions array to LocalStorage
   */
  saveQuestions(questions) {
    try {
      localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    } catch (e) {
      console.error("Erro ao salvar perguntas:", e);
    }
  },

  /**
   * Add a new question to the bank
   */
  addQuestion(questionData) {
    const questions = this.getQuestions();
    const newQuestion = {
      ...questionData,
      id: `q-custom-${Date.now()}`
    };
    questions.push(newQuestion);
    this.saveQuestions(questions);
    return newQuestion;
  },

  /**
   * Update an existing question
   */
  updateQuestion(id, updatedData) {
    const questions = this.getQuestions();
    const index = questions.findIndex(q => q.id === id);
    if (index !== -1) {
      questions[index] = { ...questions[index], ...updatedData };
      this.saveQuestions(questions);
      return true;
    }
    return false;
  },

  /**
   * Delete a question by ID
   */
  deleteQuestion(id) {
    let questions = this.getQuestions();
    questions = questions.filter(q => q.id !== id);
    this.saveQuestions(questions);
  },

  /**
   * Reset database back to default initial seed questions
   */
  resetQuestionsToDefault() {
    this.saveQuestions(INITIAL_QUESTIONS);
    return INITIAL_QUESTIONS;
  },

  /**
   * Get match history
   */
  getMatchHistory() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Erro ao ler histórico:", e);
      return [];
    }
  },

  /**
   * Save a completed match into history
   */
  saveMatchToHistory(matchRecord) {
    try {
      const history = this.getMatchHistory();
      history.unshift({
        ...matchRecord,
        id: `match-${Date.now()}`,
        timestamp: new Date().toISOString()
      });
      // Keep last 50 matches
      if (history.length > 50) history.pop();
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.error("Erro ao salvar histórico de partida:", e);
    }
  },

  /**
   * Clear history
   */
  clearMatchHistory() {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  },

  /**
   * Sound setting toggle
   */
  isSoundEnabled() {
    return localStorage.getItem(STORAGE_KEYS.SOUND_ENABLED) !== 'false';
  },

  setSoundEnabled(enabled) {
    localStorage.setItem(STORAGE_KEYS.SOUND_ENABLED, enabled ? 'true' : 'false');
  }
};
