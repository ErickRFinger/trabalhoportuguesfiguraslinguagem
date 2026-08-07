/**
 * Match Engine for 2-Player Competition
 */
import { StorageService } from './storage.js';
import { Sound } from './sound.js';

export class MatchEngine {
  constructor(config = {}) {
    this.player1 = config.player1 || "Lucas Colombo Brittes";
    this.player2 = config.player2 || "Vitor Depra";
    this.totalQuestionsCount = parseInt(config.questionsCount || 10, 10);
    this.timerDuration = parseInt(config.timerDuration || 20, 10);
    this.categoryFilter = config.categoryFilter || "ALL";
    this.gradingMode = config.gradingMode || "referee"; // 'referee' or 'auto'

    this.questionsPool = [];
    this.selectedQuestions = [];
    this.currentQuestionIndex = 0;
    
    this.scores = { p1: 0, p2: 0 };
    this.hits = { p1: 0, p2: 0 };
    this.misses = { p1: 0, p2: 0 };

    this.answersLog = []; // [{ question, p1Answer, p2Answer, p1Correct, p2Correct, refereeNote }]

    // State per question
    this.currentP1Answer = null;
    this.currentP2Answer = null;
    this.p1Judged = null; // true or false
    this.p2Judged = null; // true or false

    this.timerInterval = null;
    this.remainingSeconds = this.timerDuration;
    this.isTieBreaker = false;
  }

  init() {
    const allQuestions = StorageService.getQuestions();
    
    // Filter by category if requested
    let filtered = allQuestions;
    if (this.categoryFilter !== "ALL") {
      filtered = allQuestions.filter(q => q.category === this.categoryFilter);
      // Fallback if not enough questions in filtered category
      if (filtered.length < this.totalQuestionsCount) {
        filtered = allQuestions;
      }
    }

    // Shuffle pool without repeating
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    this.selectedQuestions = shuffled.slice(0, Math.min(this.totalQuestionsCount, shuffled.length));
    this.totalQuestionsCount = this.selectedQuestions.length;

    this.currentQuestionIndex = 0;
    this.scores = { p1: 0, p2: 0 };
    this.hits = { p1: 0, p2: 0 };
    this.misses = { p1: 0, p2: 0 };
    this.answersLog = [];
    this.isTieBreaker = false;

    this.resetQuestionState();
  }

  getCurrentQuestion() {
    return this.selectedQuestions[this.currentQuestionIndex] || null;
  }

  resetQuestionState() {
    this.currentP1Answer = null;
    this.currentP2Answer = null;
    this.p1Judged = null;
    this.p2Judged = null;
    this.remainingSeconds = this.timerDuration;
  }

  submitPlayerAnswer(player, answer) {
    if (player === 'p1') {
      this.currentP1Answer = answer;
    } else if (player === 'p2') {
      this.currentP2Answer = answer;
    }

    // Sound effect for recording answer
    Sound.playClick();

    // Check if both answered
    const bothAnswered = (this.currentP1Answer !== null && this.currentP2Answer !== null);
    return bothAnswered;
  }

  startTimer(onTick, onExpire) {
    this.stopTimer();
    if (this.timerDuration <= 0) return;

    this.remainingSeconds = this.timerDuration;
    onTick(this.remainingSeconds);

    this.timerInterval = setInterval(() => {
      this.remainingSeconds--;
      onTick(this.remainingSeconds);

      if (this.remainingSeconds <= 5 && this.remainingSeconds > 0) {
        Sound.playTimerTick();
      }

      if (this.remainingSeconds <= 0) {
        this.stopTimer();
        // Time expired: auto-fill missing answers as "(Tempo Esgotado)"
        if (this.currentP1Answer === null) this.currentP1Answer = "(Sem Resposta - Tempo Esgotado)";
        if (this.currentP2Answer === null) this.currentP2Answer = "(Sem Resposta - Tempo Esgotado)";
        onExpire();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Automatic grading helper for choice questions or exact matches
   */
  evaluateAutoGrading(question, answer) {
    if (!answer || answer.includes("Tempo Esgotado")) return false;
    const cleanAnswer = String(answer).trim().toLowerCase();
    const cleanCorrect = String(question.correctAnswer).trim().toLowerCase();
    return cleanAnswer === cleanCorrect;
  }

  /**
   * Record referee decision for current question
   */
  judgeQuestion(p1IsCorrect, p2IsCorrect) {
    this.p1Judged = p1IsCorrect;
    this.p2Judged = p2IsCorrect;

    const currentQ = this.getCurrentQuestion();

    // Update scores
    if (p1IsCorrect) {
      this.scores.p1++;
      this.hits.p1++;
    } else {
      this.misses.p1++;
    }

    if (p2IsCorrect) {
      this.scores.p2++;
      this.hits.p2++;
    } else {
      this.misses.p2++;
    }

    // Log detail
    this.answersLog.push({
      questionIndex: this.currentQuestionIndex + 1,
      questionId: currentQ.id,
      category: currentQ.category,
      prompt: currentQ.prompt,
      correctAnswer: currentQ.correctAnswer,
      p1Answer: this.currentP1Answer,
      p2Answer: this.currentP2Answer,
      p1Correct: p1IsCorrect,
      p2Correct: p2IsCorrect,
      isTieBreaker: this.isTieBreaker
    });
  }

  advanceToNextQuestion() {
    this.stopTimer();
    this.currentQuestionIndex++;
    this.resetQuestionState();

    const hasMore = this.currentQuestionIndex < this.selectedQuestions.length;
    return hasMore;
  }

  /**
   * Generates a Sudden Death Tie Breaker Question
   */
  setupTieBreaker() {
    this.isTieBreaker = true;
    const allQuestions = StorageService.getQuestions();
    // Pick a question not used in match
    const usedIds = new Set(this.selectedQuestions.map(q => q.id));
    const available = allQuestions.filter(q => !usedIds.has(q.id));

    const suddenDeathQ = available.length > 0
      ? available[Math.floor(Math.random() * available.length)]
      : allQuestions[Math.floor(Math.random() * allQuestions.length)];

    this.selectedQuestions.push(suddenDeathQ);
    // Move index to this tie breaker question
    this.currentQuestionIndex = this.selectedQuestions.length - 1;
    this.resetQuestionState();
    return suddenDeathQ;
  }

  getSummary() {
    const totalQ = this.answersLog.length;
    const p1Pct = totalQ > 0 ? Math.round((this.scores.p1 / totalQ) * 100) : 0;
    const p2Pct = totalQ > 0 ? Math.round((this.scores.p2 / totalQ) * 100) : 0;

    let winner = null; // 'p1', 'p2', or 'tie'
    if (this.scores.p1 > this.scores.p2) {
      winner = 'p1';
    } else if (this.scores.p2 > this.scores.p1) {
      winner = 'p2';
    } else {
      winner = 'tie';
    }

    return {
      player1: this.player1,
      player2: this.player2,
      scores: this.scores,
      hits: this.hits,
      misses: this.misses,
      percentages: { p1: p1Pct, p2: p2Pct },
      winner: winner,
      winnerName: winner === 'p1' ? this.player1 : (winner === 'p2' ? this.player2 : "Empate"),
      totalQuestions: totalQ,
      answersLog: this.answersLog
    };
  }
}
