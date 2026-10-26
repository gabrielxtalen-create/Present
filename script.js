const firstVisit = document.getElementById('first-visit');
const firstVisitClose = document.getElementById('first-visit-close');
const firstVisitKey = 'beca-first-visit-read';
if (firstVisit && firstVisitClose) {
  try {
    if (localStorage.getItem(firstVisitKey) === 'yes') {
      firstVisit.hidden = true;
    } else {
      firstVisit.hidden = false;
    }
  } catch (_) {
    firstVisit.hidden = false;
  }
  firstVisitClose.addEventListener('click', () => {
    firstVisit.hidden = true;
    try { localStorage.setItem(firstVisitKey, 'yes'); } catch (_) {}
  });
}

const startButton = document.getElementById('start-button');
const startScreen = document.getElementById('screen-start');
const nextScreen = document.getElementById('screen-next');
const loveButton = document.getElementById('love-button');
const littleNote = document.getElementById('little-note');
const modal = document.getElementById('modal-backdrop');
const modalTitle = document.getElementById('modal-title');
const modalCopy = document.getElementById('modal-copy');
const modalClose = document.getElementById('modal-close');
const modalOk = document.getElementById('modal-ok');
const toast = document.getElementById('toast');
const photoPicker = document.getElementById('photo-picker');
const backgroundMusic = document.getElementById('background-music');
const buttonSound = document.getElementById('button-sound');
backgroundMusic.volume = 0.18;
buttonSound.volume = 0.24;
let toastTimer;
let selectedPhotos = [];

function playButtonSound() {
  // Reinicia o efeito para que cliques rápidos também tenham som.
  const sound = buttonSound.cloneNode();
  sound.volume = buttonSound.volume;
  sound.play().catch(() => {});
}

function startBackgroundMusic() {
  backgroundMusic.volume = 0.18; // volume baixo, ajustável entre 0 e 1
  backgroundMusic.play().catch(() => {
    showToast('Toque no botão ♫ para iniciar a música.');
  });
}

document.addEventListener('click', (event) => {
  if (event.target.closest('button')) playButtonSound();
}, true);

function showSecondScreen() {
  if (document.body.classList.contains('entered')) return;
  startBackgroundMusic();
  startButton.classList.remove('jelly');
  void startButton.offsetWidth;
  startButton.classList.add('jelly');
  window.setTimeout(() => {
    document.body.classList.add('entered');
    startScreen.setAttribute('aria-hidden', 'true');
    nextScreen.setAttribute('aria-hidden', 'false');
    nextScreen.inert = false;
  }, 210);
}
startButton.addEventListener('click', showSecondScreen);
startButton.addEventListener('animationend', () => startButton.classList.remove('jelly'));

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2800);
}
function openModal(title, message) {
  modalTitle.textContent = title;
  modalCopy.textContent = message;
  modal.hidden = false;
  modalClose.focus();
}
function closeModal() { modal.hidden = true; }
modalClose.addEventListener('click', closeModal);
modalOk.addEventListener('click', closeModal);
modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });

loveButton.addEventListener('click', () => {
  littleNote.textContent = 'eu também escolheria você, de novo e de novo ♡';
  showToast('Um abraço apertado, mesmo de longe. ♥');
  loveButton.animate([{transform:'scale(1)'},{transform:'scale(1.07)'},{transform:'scale(1)'}], {duration:380, easing:'ease-out'});
});

document.querySelectorAll('[data-action]').forEach((button) => {
  button.addEventListener('click', () => {
    switch (button.dataset.action) {
      case 'heart':
        openModal('Uma surpresa pra você ♡', 'Se eu pudesse escolher de novo, ainda escolheria você. Nos dias bons e nos difíceis também. Obrigado por fazer parte da minha vida. 💗');
        break;
      case 'photos':
        if (selectedPhotos.length) {
          openModal('Nossas lembranças ♡', `Você selecionou ${selectedPhotos.length} ${selectedPhotos.length === 1 ? 'foto' : 'fotos'}. A galeria está pronta para receber as imagens que você escolher.`);
        } else {
          photoPicker.click();
        }
        break;
      case 'music':
        if (backgroundMusic.paused) {
          backgroundMusic.play().then(() => showToast('Música tocando ♫')).catch(() => showToast('Toque novamente para iniciar a música.'));
        } else {
          backgroundMusic.pause();
          showToast('Música pausada ♡');
        }
        break;
      case 'message':
        openModal('Lembra disso? 💌', 'Você não precisa ser perfeita, nem estar bem o tempo todo. Eu gosto de você por ser você, inclusive nos dias bagunçados. ♡');
        break;
      case 'home':
        closeModal();
        document.body.classList.remove('entered');
        startScreen.setAttribute('aria-hidden', 'false');
        nextScreen.setAttribute('aria-hidden', 'true');
        nextScreen.inert = true;
        break;
    }
  });
});

photoPicker.addEventListener('change', () => {
  selectedPhotos = Array.from(photoPicker.files || []);
  if (selectedPhotos.length) {
    showToast(`${selectedPhotos.length} ${selectedPhotos.length === 1 ? 'foto selecionada' : 'fotos selecionadas'} ♡`);
    openModal('Fotos escolhidas ♡', 'As fotos foram selecionadas neste navegador. Esta versão ainda não salva nem publica as imagens no site.');
  }
});
