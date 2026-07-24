/**
 * Admin Panel Manager: Questions CRUD & Match History
 */
import { StorageService } from './storage.js';
import { Sound } from './sound.js';

export class AdminManager {
  constructor() {
    this.tbodyQuestions = document.getElementById('admin-questions-tbody');
    this.searchInput = document.getElementById('admin-search-input');
    this.filterCategory = document.getElementById('admin-filter-category');
    this.filterType = document.getElementById('admin-filter-type');
    this.totalQCountSpan = document.getElementById('total-q-count');

    this.modalQuestion = document.getElementById('modal-question');
    this.formQuestion = document.getElementById('form-question-crud');
    this.editQIdInput = document.getElementById('edit-q-id');

    this.modalCategorySelect = document.getElementById('modal-q-category');
    this.modalTypeSelect = document.getElementById('modal-q-type');
    this.modalPromptTextarea = document.getElementById('modal-q-prompt');
    this.modalCorrectInput = document.getElementById('modal-q-correct');
    this.modalExplanationTextarea = document.getElementById('modal-q-explanation');
    this.choiceOptionsGroup = document.getElementById('modal-choice-options-group');

    this.optAInput = document.getElementById('opt-a');
    this.optBInput = document.getElementById('opt-b');
    this.optCInput = document.getElementById('opt-c');
    this.optDInput = document.getElementById('opt-d');

    this.historyGrid = document.getElementById('history-cards-list');
  }

  init() {
    this.setupEventListeners();
    this.renderQuestionsTable();
    this.renderMatchHistory();
  }

  setupEventListeners() {
    // Search and filter listeners
    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => this.renderQuestionsTable());
    }
    if (this.filterCategory) {
      this.filterCategory.addEventListener('change', () => this.renderQuestionsTable());
    }
    if (this.filterType) {
      this.filterType.addEventListener('change', () => this.renderQuestionsTable());
    }

    // Modal open/close
    document.getElementById('btn-open-add-modal')?.addEventListener('click', () => {
      Sound.playClick();
      this.openQuestionModal();
    });

    document.getElementById('btn-close-q-modal')?.addEventListener('click', () => {
      this.closeQuestionModal();
    });

    document.getElementById('btn-cancel-q-modal')?.addEventListener('click', () => {
      this.closeQuestionModal();
    });

    // Toggle choices vs direct answer in modal
    if (this.modalTypeSelect) {
      this.modalTypeSelect.addEventListener('change', (e) => {
        if (e.target.value === 'choice') {
          this.choiceOptionsGroup.classList.remove('hidden');
        } else {
          this.choiceOptionsGroup.classList.add('hidden');
        }
      });
    }

    // Form submit for CRUD
    if (this.formQuestion) {
      this.formQuestion.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveQuestionFromModal();
      });
    }

    // Reset database
    document.getElementById('btn-reset-db')?.addEventListener('click', () => {
      if (confirm("Deseja restaurar o Banco de Perguntas para o estado inicial padrão? Perguntas customizadas adicionadas serão redefinidas.")) {
        StorageService.resetQuestionsToDefault();
        this.renderQuestionsTable();
        alert("Banco de Perguntas restaurado com sucesso!");
      }
    });

    // Clear history
    document.getElementById('btn-clear-history')?.addEventListener('click', () => {
      if (confirm("Deseja limpar todo o histórico de partidas realizadas?")) {
        StorageService.clearMatchHistory();
        this.renderMatchHistory();
      }
    });

    // Admin Tabs
    const tabButtons = document.querySelectorAll('.admin-tab-btn');
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        document.querySelectorAll('.admin-tab-content').forEach(tab => {
          tab.classList.remove('active-tab');
        });
        document.getElementById(targetTab)?.classList.add('active-tab');

        if (targetTab === 'tab-history') {
          this.renderMatchHistory();
        }
      });
    });
  }

  renderQuestionsTable() {
    if (!this.tbodyQuestions) return;

    const questions = StorageService.getQuestions();
    const query = (this.searchInput?.value || '').toLowerCase();
    const cat = this.filterCategory?.value || 'ALL';
    const type = this.filterType?.value || 'ALL';

    const filtered = questions.filter(q => {
      const matchQuery = q.prompt.toLowerCase().includes(query) || q.category.toLowerCase().includes(query) || (q.correctAnswer && q.correctAnswer.toLowerCase().includes(query));
      const matchCat = cat === 'ALL' || q.category === cat;
      const matchType = type === 'ALL' || q.type === type;
      return matchQuery && matchCat && matchType;
    });

    if (this.totalQCountSpan) {
      this.totalQCountSpan.textContent = questions.length;
    }

    if (filtered.length === 0) {
      this.tbodyQuestions.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; color: var(--text-muted); padding: 24px;">
            Nenhuma pergunta encontrada com os filtros selecionados.
          </td>
        </tr>
      `;
      return;
    }

    this.tbodyQuestions.innerHTML = filtered.map(q => `
      <tr>
        <td style="font-family: monospace; font-size: 0.8rem; color: var(--text-muted);">${q.id}</td>
        <td><span class="category-badge">${q.category}</span></td>
        <td><span class="question-type-badge">${q.type === 'choice' ? 'Múltipla Escolha' : 'Resposta Direta'}</span></td>
        <td style="max-width: 350px; font-weight: 500;">${this.escapeHtml(q.prompt)}</td>
        <td style="color: var(--success); font-weight: 700;">${this.escapeHtml(q.correctAnswer)}</td>
        <td>
          <div style="display: flex; gap: 8px;">
            <button class="btn-table-action btn-edit-q" data-id="${q.id}" title="Editar Pergunta">
              <i data-lucide="edit-3"></i>
            </button>
            <button class="btn-table-action delete btn-delete-q" data-id="${q.id}" title="Excluir Pergunta">
              <i data-lucide="trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `).join('');

    if (window.lucide) window.lucide.createIcons();

    // Attach edit and delete click handlers
    this.tbodyQuestions.querySelectorAll('.btn-edit-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.openQuestionModal(id);
      });
    });

    this.tbodyQuestions.querySelectorAll('.btn-delete-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        if (confirm("Deseja realmente excluir esta pergunta do banco?")) {
          StorageService.deleteQuestion(id);
          this.renderQuestionsTable();
        }
      });
    });
  }

  openQuestionModal(editId = null) {
    if (!this.modalQuestion) return;

    this.formQuestion.reset();
    if (editId) {
      document.getElementById('modal-q-title').innerHTML = `<i data-lucide="edit-3"></i> Editar Pergunta (${editId})`;
      const questions = StorageService.getQuestions();
      const q = questions.find(item => item.id === editId);

      if (q) {
        this.editQIdInput.value = q.id;
        this.modalCategorySelect.value = q.category;
        this.modalTypeSelect.value = q.type;
        this.modalPromptTextarea.value = q.prompt;
        this.modalCorrectInput.value = q.correctAnswer;
        this.modalExplanationTextarea.value = q.explanation || '';

        if (q.type === 'choice' && q.options && q.options.length >= 4) {
          this.choiceOptionsGroup.classList.remove('hidden');
          this.optAInput.value = q.options[0] || '';
          this.optBInput.value = q.options[1] || '';
          this.optCInput.value = q.options[2] || '';
          this.optDInput.value = q.options[3] || '';
        } else {
          this.choiceOptionsGroup.classList.add('hidden');
        }
      }
    } else {
      document.getElementById('modal-q-title').innerHTML = `<i data-lucide="plus-circle"></i> Cadastrar Nova Pergunta`;
      this.editQIdInput.value = '';
      this.choiceOptionsGroup.classList.remove('hidden');
    }

    this.modalQuestion.classList.remove('hidden');
    if (window.lucide) window.lucide.createIcons();
  }

  closeQuestionModal() {
    if (this.modalQuestion) {
      this.modalQuestion.classList.add('hidden');
    }
  }

  saveQuestionFromModal() {
    const editId = this.editQIdInput.value;
    const category = this.modalCategorySelect.value;
    const type = this.modalTypeSelect.value;
    const prompt = this.modalPromptTextarea.value.trim();
    const correctAnswer = this.modalCorrectInput.value.trim();
    const explanation = this.modalExplanationTextarea.value.trim();

    let options = [];
    if (type === 'choice') {
      options = [
        this.optAInput.value.trim() || "Opção A",
        this.optBInput.value.trim() || "Opção B",
        this.optCInput.value.trim() || "Opção C",
        this.optDInput.value.trim() || "Opção D"
      ];
    }

    const questionData = {
      category,
      type,
      prompt,
      options,
      correctAnswer,
      explanation
    };

    if (editId) {
      StorageService.updateQuestion(editId, questionData);
    } else {
      StorageService.addQuestion(questionData);
    }

    this.closeQuestionModal();
    this.renderQuestionsTable();
    Sound.playCorrect();
  }

  renderMatchHistory() {
    if (!this.historyGrid) return;

    const history = StorageService.getMatchHistory();
    if (history.length === 0) {
      this.historyGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; color: var(--text-muted); padding: 40px;" class="card">
          <i data-lucide="history" style="width: 48px; height: 48px; margin-bottom: 12px;"></i>
          <p>Nenhuma partida registrada no histórico até o momento.</p>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    this.historyGrid.innerHTML = history.map(item => {
      const dateStr = new Date(item.timestamp).toLocaleString('pt-BR');
      return `
        <div class="history-card">
          <div class="history-card-header">
            <span><i data-lucide="calendar"></i> ${dateStr}</span>
            <span>${item.totalQuestions} Pergunta(s)</span>
          </div>
          <div class="history-match-versus">
            <span style="color: #38bdf8;">${this.escapeHtml(item.player1)}</span> (${item.scores.p1}) vs 
            <span style="color: #c084fc;">${this.escapeHtml(item.player2)}</span> (${item.scores.p2})
          </div>
          <div class="history-match-result">
            🏆 Vencedor: <strong>${this.escapeHtml(item.winnerName)}</strong>
          </div>
        </div>
      `;
    }).join('');

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
