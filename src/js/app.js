/**
 * Main Application Controller & Router
 */
import { StorageService } from './storage.js';
import { Sound } from './sound.js';
import { MatchEngine } from './gameEngine.js';
import { AdminManager } from './admin.js';

class App {
  constructor() {
    this.currentMatch = null;
    this.adminManager = new AdminManager();
    this.activeScreenId = 'screen-home';
  }

  init() {
    this.setupNavigation();
    this.setupMatchForms();
    this.setupRefereeControls();
    this.setupSoundToggle();
    this.adminManager.init();

    if (window.lucide) window.lucide.createIcons();
  }

  // --- SPA SCREEN NAVIGATION ---
  showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(s => s.classList.remove('active'));

    const target = document.getElementById(screenId);
    if (target) {
      target.classList.add('active');
      this.activeScreenId = screenId;
    }

    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));

    if (screenId === 'screen-home') document.getElementById('nav-btn-home')?.classList.add('active');
    if (screenId === 'screen-guide') document.getElementById('nav-btn-guide')?.classList.add('active');
    if (screenId === 'screen-admin') document.getElementById('nav-btn-admin')?.classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.lucide) window.lucide.createIcons();
  }

  setupNavigation() {
    document.getElementById('btn-go-home')?.addEventListener('click', () => {
      Sound.playClick();
      this.showScreen('screen-home');
    });

    document.getElementById('nav-btn-home')?.addEventListener('click', () => {
      Sound.playClick();
      this.showScreen('screen-home');
    });

    document.getElementById('nav-btn-guide')?.addEventListener('click', () => {
      Sound.playClick();
      this.showScreen('screen-guide');
    });

    document.getElementById('nav-btn-admin')?.addEventListener('click', () => {
      Sound.playClick();
      this.adminManager.renderQuestionsTable();
      this.showScreen('screen-admin');
    });

    document.getElementById('btn-explore-guide')?.addEventListener('click', () => {
      Sound.playClick();
      this.showScreen('screen-guide');
    });

    document.getElementById('btn-start-match-config')?.addEventListener('click', () => {
      Sound.playClick();
      this.showScreen('screen-setup');
    });

    document.getElementById('btn-back-home')?.addEventListener('click', () => {
      Sound.playClick();
      this.showScreen('screen-home');
    });

    document.getElementById('btn-rematch')?.addEventListener('click', () => {
      Sound.playClick();
      this.showScreen('screen-setup');
    });

    document.getElementById('btn-results-to-admin')?.addEventListener('click', () => {
      Sound.playClick();
      this.showScreen('screen-admin');
    });
  }

  setupSoundToggle() {
    const soundBtn = document.getElementById('btn-sound-toggle');
    const soundIcon = document.getElementById('sound-icon');

    const updateIcon = () => {
      const enabled = StorageService.isSoundEnabled();
      if (soundIcon) {
        soundIcon.setAttribute('data-lucide', enabled ? 'volume-2' : 'volume-x');
        if (window.lucide) window.lucide.createIcons();
      }
    };

    updateIcon();

    soundBtn?.addEventListener('click', () => {
      const newState = !StorageService.isSoundEnabled();
      StorageService.setSoundEnabled(newState);
      updateIcon();
      if (newState) Sound.playClick();
    });
  }

  // --- MATCH CONFIGURATION & START ---
  setupMatchForms() {
    const setupForm = document.getElementById('form-match-setup');
    if (!setupForm) return;

    // Quick name chips click handlers
    const nameChips = document.querySelectorAll('.name-chip');
    nameChips.forEach(chip => {
      chip.addEventListener('click', () => {
        Sound.playClick();
        const targetInputId = chip.getAttribute('data-target') === 'p1' ? 'p1-name' : 'p2-name';
        const nameVal = chip.getAttribute('data-name');
        const inputEl = document.getElementById(targetInputId);
        if (inputEl) {
          inputEl.value = nameVal;
        }

        // Highlight active chip for that player group
        const container = chip.closest('.quick-names-pills');
        if (container) {
          container.querySelectorAll('.name-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
        }
      });
    });

    setupForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const player1Name = document.getElementById('p1-name').value.trim() || "Lucas Colombo Brittes";
      const player2Name = document.getElementById('p2-name').value.trim() || "Vitor Depra";
      const questionsCount = document.getElementById('select-questions-count').value;
      const timerDuration = document.getElementById('select-timer-mode').value;
      const categoryFilter = document.getElementById('select-category-filter').value;
      const gradingMode = document.getElementById('select-grading-mode').value;

      this.currentMatch = new MatchEngine({
        player1: player1Name,
        player2: player2Name,
        questionsCount,
        timerDuration,
        categoryFilter,
        gradingMode
      });

      this.currentMatch.init();
      this.startMatchUI();
    });
  }

  startMatchUI() {
    this.showScreen('screen-game');
    this.updateHUD();
    this.renderCurrentQuestion();
  }

  updateHUD() {
    if (!this.currentMatch) return;

    const p1Names = document.querySelectorAll('.p1-display-name');
    const p2Names = document.querySelectorAll('.p2-display-name');

    p1Names.forEach(el => el.textContent = this.currentMatch.player1);
    p2Names.forEach(el => el.textContent = this.currentMatch.player2);

    document.getElementById('p1-current-score').textContent = `${this.currentMatch.scores.p1} pts`;
    document.getElementById('p2-current-score').textContent = `${this.currentMatch.scores.p2} pts`;

    const currentNum = this.currentMatch.currentQuestionIndex + 1;
    const totalNum = this.currentMatch.totalQuestionsCount;
    document.getElementById('question-progress-label').textContent = `Pergunta ${currentNum} / ${totalNum}`;

    const progressPct = Math.round((currentNum / totalNum) * 100);
    document.getElementById('match-progress-bar').style.width = `${progressPct}%`;
  }

  renderCurrentQuestion() {
    if (!this.currentMatch) return;

    const q = this.currentMatch.getCurrentQuestion();
    if (!q) return;

    // Set phase 1 active, phase 2 hidden
    document.getElementById('phase-answering').classList.remove('hidden-phase');
    document.getElementById('phase-referee').classList.add('hidden-phase');

    // Update Question Card
    document.getElementById('q-category-tag').textContent = q.category;
    document.getElementById('q-type-tag').textContent = q.type === 'choice' ? 'Múltipla Escolha' : 'Resposta Direta';
    document.getElementById('q-prompt-text').textContent = q.prompt;

    // Reset Lock Overlays
    document.getElementById('p1-locked-view').classList.add('hidden');
    document.getElementById('p2-locked-view').classList.add('hidden');

    document.getElementById('p1-status-pill').textContent = "Pendente";
    document.getElementById('p1-status-pill').classList.remove('ready');
    document.getElementById('p2-status-pill').textContent = "Pendente";
    document.getElementById('p2-status-pill').classList.remove('ready');

    const btnReveal = document.getElementById('btn-reveal-referee');
    btnReveal.classList.add('hidden');
    btnReveal.disabled = true;

    // Render Input Areas for P1 and P2
    this.renderPlayerInputArea('p1', q);
    this.renderPlayerInputArea('p2', q);

    // Start Timer
    const timerWrapper = document.getElementById('timer-wrapper');
    const timerDisplay = document.getElementById('timer-seconds-display');

    if (this.currentMatch.timerDuration > 0) {
      timerWrapper.style.display = 'flex';
      timerWrapper.classList.remove('warning');

      this.currentMatch.startTimer(
        (sec) => {
          timerDisplay.textContent = sec;
          if (sec <= 5) timerWrapper.classList.add('warning');
        },
        () => {
          // Timer expired -> auto reveal answers to referee
          this.onBothAnswered();
        }
      );
    } else {
      timerWrapper.style.display = 'none';
    }

    if (window.lucide) window.lucide.createIcons();
  }

  renderPlayerInputArea(playerKey, question) {
    const inputArea = document.getElementById(`${playerKey}-input-area`);
    if (!inputArea) return;

    if (question.type === 'choice') {
      const keys = ['A', 'B', 'C', 'D'];
      inputArea.innerHTML = `
        <div class="options-choice-list">
          ${question.options.map((opt, idx) => `
            <button type="button" class="btn-choice-option" data-player="${playerKey}" data-val="${this.escapeHtml(opt)}">
              <span class="option-key">${keys[idx]}</span>
              <span>${this.escapeHtml(opt)}</span>
            </button>
          `).join('')}
        </div>
      `;

      // Attach click events
      inputArea.querySelectorAll('.btn-choice-option').forEach(btn => {
        btn.addEventListener('click', () => {
          inputArea.querySelectorAll('.btn-choice-option').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');

          const val = btn.getAttribute('data-val');
          this.handlePlayerSubmit(playerKey, val);
        });
      });

    } else {
      // Direct text answer
      inputArea.innerHTML = `
        <div class="form-group" style="margin-bottom: 12px;">
          <input type="text" id="${playerKey}-direct-input" class="form-control" placeholder="Digite sua resposta..." autocomplete="off">
        </div>
        <button type="button" class="btn btn-secondary btn-sm" id="btn-submit-${playerKey}-direct">
          Confirmar Resposta
        </button>
      `;

      const input = document.getElementById(`${playerKey}-direct-input`);
      const btn = document.getElementById(`btn-submit-${playerKey}-direct`);

      const submitAction = () => {
        const val = input.value.trim();
        if (val) {
          this.handlePlayerSubmit(playerKey, val);
        }
      };

      btn?.addEventListener('click', submitAction);
      input?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') submitAction();
      });
    }
  }

  handlePlayerSubmit(playerKey, answer) {
    const bothDone = this.currentMatch.submitPlayerAnswer(playerKey, answer);

    // Lock UI for this player
    document.getElementById(`${playerKey}-locked-view`).classList.remove('hidden');
    const statusPill = document.getElementById(`${playerKey}-status-pill`);
    statusPill.textContent = "Pronto ✔";
    statusPill.classList.add('ready');

    if (bothDone) {
      this.currentMatch.stopTimer();
      this.onBothAnswered();
    }
  }

  onBothAnswered() {
    const btnReveal = document.getElementById('btn-reveal-referee');
    btnReveal.classList.remove('hidden');
    btnReveal.disabled = false;
    btnReveal.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Auto-trigger reveal in auto mode, or prompt referee
    if (this.currentMatch.gradingMode === 'auto') {
      setTimeout(() => this.revealRefereePhase(), 600);
    }
  }

  setupRefereeControls() {
    document.getElementById('btn-reveal-referee')?.addEventListener('click', () => {
      Sound.playClick();
      this.revealRefereePhase();
    });

    const btnP1Correct = document.getElementById('btn-p1-mark-correct');
    const btnP1Wrong = document.getElementById('btn-p1-mark-wrong');
    const btnP2Correct = document.getElementById('btn-p2-mark-correct');
    const btnP2Wrong = document.getElementById('btn-p2-mark-wrong');
    const btnNextQ = document.getElementById('btn-confirm-next-question');

    btnP1Correct?.addEventListener('click', () => {
      btnP1Correct.classList.add('active-judge');
      btnP1Wrong.classList.remove('active-judge');
      this.currentMatch.p1Judged = true;
      document.getElementById('p1-judged-badge').textContent = "Decisão: Correto (+1)";
      document.getElementById('p1-judged-badge').style.color = "var(--success)";
      Sound.playCorrect();
      this.checkRefereeReadyToAdvance();
    });

    btnP1Wrong?.addEventListener('click', () => {
      btnP1Wrong.classList.add('active-judge');
      btnP1Correct.classList.remove('active-judge');
      this.currentMatch.p1Judged = false;
      document.getElementById('p1-judged-badge').textContent = "Decisão: Incorreto (0)";
      document.getElementById('p1-judged-badge').style.color = "var(--danger)";
      Sound.playWrong();
      this.checkRefereeReadyToAdvance();
    });

    btnP2Correct?.addEventListener('click', () => {
      btnP2Correct.classList.add('active-judge');
      btnP2Wrong.classList.remove('active-judge');
      this.currentMatch.p2Judged = true;
      document.getElementById('p2-judged-badge').textContent = "Decisão: Correto (+1)";
      document.getElementById('p2-judged-badge').style.color = "var(--success)";
      Sound.playCorrect();
      this.checkRefereeReadyToAdvance();
    });

    btnP2Wrong?.addEventListener('click', () => {
      btnP2Wrong.classList.add('active-judge');
      btnP2Correct.classList.remove('active-judge');
      this.currentMatch.p2Judged = false;
      document.getElementById('p2-judged-badge').textContent = "Decisão: Incorreto (0)";
      document.getElementById('p2-judged-badge').style.color = "var(--danger)";
      Sound.playWrong();
      this.checkRefereeReadyToAdvance();
    });

    btnNextQ?.addEventListener('click', () => {
      Sound.playClick();
      // Commit decision
      this.currentMatch.judgeQuestion(this.currentMatch.p1Judged, this.currentMatch.p2Judged);
      this.updateHUD();

      const hasMore = this.currentMatch.advanceToNextQuestion();
      if (hasMore) {
        this.renderCurrentQuestion();
      } else {
        this.showMatchResults();
      }
    });

    // Tie Breaker trigger button
    document.getElementById('btn-trigger-tie-breaker')?.addEventListener('click', () => {
      Sound.playClick();
      const suddenDeathQ = this.currentMatch.setupTieBreaker();
      if (suddenDeathQ) {
        this.showScreen('screen-game');
        this.updateHUD();
        this.renderCurrentQuestion();
      }
    });
  }

  revealRefereePhase() {
    document.getElementById('phase-answering').classList.add('hidden-phase');
    document.getElementById('phase-referee').classList.remove('hidden-phase');

    const q = this.currentMatch.getCurrentQuestion();
    document.getElementById('referee-official-answer-text').textContent = q.correctAnswer;
    document.getElementById('referee-explanation-text').innerHTML = `<strong>Explicação:</strong> ${this.escapeHtml(q.explanation || '')}`;

    // Reveal player answers
    document.getElementById('ref-p1-answer').textContent = this.currentMatch.currentP1Answer || "(Sem resposta)";
    document.getElementById('ref-p2-answer').textContent = this.currentMatch.currentP2Answer || "(Sem resposta)";

    // Reset judge buttons active state
    const btnP1C = document.getElementById('btn-p1-mark-correct');
    const btnP1W = document.getElementById('btn-p1-mark-wrong');
    const btnP2C = document.getElementById('btn-p2-mark-correct');
    const btnP2W = document.getElementById('btn-p2-mark-wrong');
    const btnNext = document.getElementById('btn-confirm-next-question');

    btnP1C.classList.remove('active-judge');
    btnP1W.classList.remove('active-judge');
    btnP2C.classList.remove('active-judge');
    btnP2W.classList.remove('active-judge');
    btnNext.disabled = true;

    // Auto grading suggestion / automatic selection
    const p1AutoCorrect = this.currentMatch.evaluateAutoGrading(q, this.currentMatch.currentP1Answer);
    const p2AutoCorrect = this.currentMatch.evaluateAutoGrading(q, this.currentMatch.currentP2Answer);

    if (p1AutoCorrect) {
      btnP1C.click();
    } else {
      btnP1W.click();
    }

    if (p2AutoCorrect) {
      btnP2C.click();
    } else {
      btnP2W.click();
    }

    document.getElementById('phase-referee').scrollIntoView({ behavior: 'smooth' });
    if (window.lucide) window.lucide.createIcons();
  }

  checkRefereeReadyToAdvance() {
    const p1Done = this.currentMatch.p1Judged !== null;
    const p2Done = this.currentMatch.p2Judged !== null;
    const btnNext = document.getElementById('btn-confirm-next-question');
    if (p1Done && p2Done) {
      btnNext.disabled = false;
    }
  }

  // --- VICTORY RESULTS DISPLAY ---
  showMatchResults() {
    const summary = this.currentMatch.getSummary();
    StorageService.saveMatchToHistory(summary);

    this.showScreen('screen-results');
    Sound.playFanfare();

    // Trigger Confetti Celebration
    if (window.confetti) {
      window.confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    }

    // Title & Winner Announcement
    const titleEl = document.getElementById('winner-announcement-title');
    const subEl = document.getElementById('winner-announcement-sub');
    const tieBox = document.getElementById('tie-breaker-box');

    if (summary.winner === 'tie') {
      titleEl.textContent = "🤝 Partida Empatada!";
      subEl.textContent = `Ambos os participantes atingiram ${summary.scores.p1} ponto(s)!`;
      tieBox.classList.remove('hidden');
    } else {
      titleEl.textContent = `🏆 ${summary.winnerName} Venceu o Duelo!`;
      subEl.textContent = `Domínio espetacular das figuras de linguagem!`;
      tieBox.classList.add('hidden');
    }

    // Player 1 Card
    document.getElementById('p1-final-score-val').textContent = `${summary.scores.p1} / ${summary.totalQuestions}`;
    document.getElementById('p1-hits-val').textContent = summary.hits.p1;
    document.getElementById('p1-misses-val').textContent = summary.misses.p1;
    document.getElementById('p1-pct-val').textContent = `${summary.percentages.p1}%`;
    document.getElementById('p1-pct-bar').style.width = `${summary.percentages.p1}%`;
    document.getElementById('p1-rank-tag').textContent = summary.winner === 'p1' ? 'Campeão 🥇' : (summary.winner === 'tie' ? 'Empatado 🤝' : '2º Lugar 🥈');

    // Player 2 Card
    document.getElementById('p2-final-score-val').textContent = `${summary.scores.p2} / ${summary.totalQuestions}`;
    document.getElementById('p2-hits-val').textContent = summary.hits.p2;
    document.getElementById('p2-misses-val').textContent = summary.misses.p2;
    document.getElementById('p2-pct-val').textContent = `${summary.percentages.p2}%`;
    document.getElementById('p2-pct-bar').style.width = `${summary.percentages.p2}%`;
    document.getElementById('p2-rank-tag').textContent = summary.winner === 'p2' ? 'Campeão 🥇' : (summary.winner === 'tie' ? 'Empatado 🤝' : '2º Lugar 🥈');

    // Review Table
    const tbody = document.getElementById('match-review-tbody');
    if (tbody) {
      tbody.innerHTML = summary.answersLog.map(item => `
        <tr>
          <td><strong>${item.questionIndex}</strong></td>
          <td><span class="category-badge">${item.category}</span></td>
          <td style="max-width: 320px;">${this.escapeHtml(item.prompt)}</td>
          <td>
            <span style="font-weight: 700; color: ${item.p1Correct ? 'var(--success)' : 'var(--danger)'};">
              ${item.p1Correct ? '✓' : '✗'} ${this.escapeHtml(item.p1Answer)}
            </span>
          </td>
          <td>
            <span style="font-weight: 700; color: ${item.p2Correct ? 'var(--success)' : 'var(--danger)'};">
              ${item.p2Correct ? '✓' : '✗'} ${this.escapeHtml(item.p2Answer)}
            </span>
          </td>
        </tr>
      `).join('');
    }

    if (window.lucide) window.lucide.createIcons();
  }

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}

// Initialize application on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new App();
  app.init();
});
