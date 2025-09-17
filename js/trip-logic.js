(function () {
  const tripEl = document.getElementById('trip');
  if (!tripEl) {
    return;
  }

  const parseDate = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  };

  const tripId = tripEl.dataset.tripId || 'trip';
  const departAt = parseDate(tripEl.dataset.departAt);
  const arriveEta = parseDate(tripEl.dataset.arriveEta);
  const completedAt = parseDate(tripEl.dataset.completedAt);
  const status = tripEl.dataset.status || 'upcoming';

  const key = (suffix) => `rn:trip:${tripId}:${suffix}`;
  const wasDone = (suffix) => localStorage.getItem(key(suffix)) === '1';
  const markDone = (suffix) => localStorage.setItem(key(suffix), '1');

  const toast = document.getElementById('tripToast');
  const showToast = (message, delay = 2000) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    setTimeout(() => toast.classList.remove('is-visible'), delay);
  };

  const now = () => Date.now();

  // Boarding prompt
  const boardingBlock = document.getElementById('boardingPrompt');
  const issueModal = document.getElementById('issueModal');
  const issueForm = document.getElementById('issueForm');
  const closeIssueBtn = issueModal ? issueModal.querySelector('[data-action="close-issue"]') : null;

  const openModal = () => {
    if (!issueModal) return;
    issueModal.classList.add('is-open');
    issueModal.setAttribute('aria-hidden', 'false');
  };

  const closeModal = () => {
    if (!issueModal) return;
    issueModal.classList.remove('is-open');
    issueModal.setAttribute('aria-hidden', 'true');
  };

  const schedule = (fn, timestamp) => {
    const delay = Math.max(0, timestamp - now());
    setTimeout(fn, delay);
  };

  const minutes = (value) => value * 60 * 1000;

  if (boardingBlock && !wasDone('boarding') && status !== 'completed' && status !== 'canceled' && departAt) {
    const yesBtn = boardingBlock.querySelector('[data-action="board-yes"]');
    const noBtn = boardingBlock.querySelector('[data-action="board-no"]');
    const showBoarding = () => {
      if (wasDone('boarding')) return;
      if (arriveEta && arriveEta.getTime() - now() < minutes(10)) return;
      boardingBlock.classList.remove('hidden');
    };

    const triggerAt = departAt.getTime() + minutes(30);
    if (triggerAt <= now()) {
      showBoarding();
    } else {
      schedule(showBoarding, triggerAt);
    }

    if (yesBtn) {
      yesBtn.addEventListener('click', () => {
        boardingBlock.classList.add('hidden');
        markDone('boarding');
        showToast('Отличной поездки!');
      });
    }

    if (noBtn) {
      noBtn.addEventListener('click', openModal);
    }

    if (closeIssueBtn) {
      closeIssueBtn.addEventListener('click', closeModal);
    }

    if (issueForm) {
      issueForm.addEventListener('submit', (event) => {
        event.preventDefault();
        markDone('boarding');
        boardingBlock.classList.add('hidden');
        closeModal();
        showToast('Мы передали информацию в поддержку.');
        setTimeout(() => {
          window.location.href = 'passenger-home.html';
        }, 1600);
      });
    }
  }

  // Receipt reminder
  const receiptBlock = document.getElementById('receiptReminder');
  const receiptLink = receiptBlock ? receiptBlock.querySelector('a') : null;
  const durationMs = departAt && arriveEta ? arriveEta.getTime() - departAt.getTime() : null;
  const shortTrip = durationMs !== null && durationMs < minutes(15);
  const showReceiptReminder = () => {
    if (!receiptBlock || wasDone('receipt')) return;
    receiptBlock.classList.remove('hidden');
  };

  if (receiptBlock && !wasDone('receipt')) {
    if (!shortTrip && arriveEta) {
      let lead = minutes(30);
      if (durationMs !== null && durationMs < minutes(45)) {
        lead = minutes(15);
      }
      const trigger = arriveEta.getTime() - lead;
      if (trigger <= now()) {
        showReceiptReminder();
      } else {
        schedule(() => {
          if (status === 'completed' && wasDone('post-actions')) {
            return; // actions already visible, skip extra prompt
          }
          showReceiptReminder();
        }, trigger);
      }
    }

    if (receiptLink) {
      receiptLink.addEventListener('click', () => {
        markDone('receipt');
        receiptBlock.classList.add('hidden');
      });
    }
  }

  // Post actions
  const postActions = document.getElementById('postActions');
  const showPostActions = () => {
    if (!postActions) return;
    postActions.classList.remove('hidden');
    markDone('post-actions');
    if (shortTrip && !wasDone('receipt')) {
      showReceiptReminder();
    }
  };

  const completedReady = status === 'completed' || (completedAt && completedAt.getTime() <= now());
  if (postActions && completedReady) {
    if (completedAt) {
      const trigger = completedAt.getTime() + minutes(30);
      if (trigger <= now()) {
        showPostActions();
      } else {
        schedule(showPostActions, trigger);
      }
    } else {
      showPostActions();
    }
  }

  // If receipt should only appear after completion (duration < 15)
  if (shortTrip && status === 'completed' && !wasDone('receipt')) {
    if (completedAt) {
      const trigger = completedAt.getTime() + minutes(30);
      if (trigger <= now()) {
        showReceiptReminder();
      } else {
        schedule(showReceiptReminder, trigger);
      }
    } else {
      showReceiptReminder();
    }
  }
})();
