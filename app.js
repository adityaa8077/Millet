/**
 * MILLET MARG - 3D Interactive Web Experience
 * Netflix-Style Dynamic Navigation, 3D Grain Inspector, Mobile Drawer,
 * Wheat-to-Millet Transformation Matrix, Video Reel & Ambient Sound Synthesizer
 */

// ==========================================================================
// Grain Data Definition (Wheat vs Ancient Millets)
// ==========================================================================
const GRAIN_DATA = {
  wheat: {
    name: "Conventional Wheat",
    botanical: "Triticum aestivum",
    type: "wheat",
    color: 0xd99b42,
    roughness: 0.65,
    metalness: 0.1,
    scale: [1.1, 2.2, 1.1],
    description: "The modern agricultural staple. While versatile, excessive consumption of polished wheat flour (Maida/Atta) spikes blood glucose rapidly, stresses insulin production, and contains dense gluten polymers that trigger digestive inflammation.",
    gi: 74,
    fiber: 2.7,
    protein: 11.8,
    calcium: 34,
    waterLiters: 1827,
    gluten: "High (Gluten Present)",
    badge: "Conventional Baseline",
    verdict: "High Glycemic Load & Industrial Irrigation Dependent"
  },
  foxtail: {
    name: "Foxtail Millet (Kangni)",
    botanical: "Setaria italica",
    type: "foxtail",
    color: 0xf5b041,
    roughness: 0.35,
    metalness: 0.25,
    scale: [1.3, 1.5, 1.3],
    description: "Prized since the Vedic era. Foxtail millet releases glucose steadily into the bloodstream, making it a miraculous dietary replacement for wheat dalia, rice, and suji. Loaded with nerve-calming magnesium and dietary fiber.",
    gi: 54,
    fiber: 8.0,
    protein: 12.3,
    calcium: 31,
    waterLiters: 350,
    gluten: "100% Gluten-Free",
    badge: "Diabetic Gold Standard",
    verdict: "70% Lower Insulin Spike vs Wheat"
  },
  bajra: {
    name: "Pearl Millet (Bajra)",
    botanical: "Pennisetum glaucum",
    type: "bajra",
    color: 0x8a9a86,
    roughness: 0.5,
    metalness: 0.15,
    scale: [1.4, 1.6, 1.3],
    description: "The Iron Fortress of grains. Thrives in scorching arid soils with virtually zero chemical fertilizers. Bajra packs 8x more iron than refined wheat and provides long-lasting thermogenic warmth and satiety.",
    gi: 55,
    fiber: 11.5,
    protein: 11.6,
    calcium: 42,
    waterLiters: 280,
    gluten: "100% Gluten-Free",
    badge: "Iron Powerhouse",
    verdict: "8x Iron & 4x Fiber of Refined Wheat"
  },
  ragi: {
    name: "Finger Millet (Ragi)",
    botanical: "Eleusine coracana",
    type: "ragi",
    color: 0x7c3a27,
    roughness: 0.6,
    metalness: 0.1,
    scale: [1.2, 1.25, 1.2],
    description: "The supreme calcium king among all cereals. Delivering 344mg of bioavailable calcium per 100g—surpassing cow milk and 10x that of wheat. Ideal for bone density, athletes, and growing children.",
    gi: 52,
    fiber: 11.1,
    protein: 7.3,
    calcium: 344,
    waterLiters: 310,
    gluten: "100% Gluten-Free",
    badge: "Calcium Champion",
    verdict: "10x More Calcium than Wheat"
  },
  little: {
    name: "Little Millet (Samai)",
    botanical: "Panicum sumatrense",
    type: "little",
    color: 0xf1e7c4,
    roughness: 0.3,
    metalness: 0.3,
    scale: [1.1, 1.3, 1.1],
    description: "Ultra-light, fluffy, and rapid cooking. Little millet is celebrated in Ayurvedic detoxes for gently regulating cholesterol and restoring gut motility while substituting wheat semolina (suji) effortlessly in upma.",
    gi: 52,
    fiber: 7.6,
    protein: 10.1,
    calcium: 17,
    waterLiters: 260,
    gluten: "100% Gluten-Free",
    badge: "Ayurvedic Digestif",
    verdict: "Light on Digestion & High Polyphenols"
  }
};

// ==========================================================================
// Substitution Matrix Data
// ==========================================================================
const SUBSTITUTIONS = {
  roti: {
    oldName: "Wheat Phulka / Roti",
    newName: "Jowar & Bajra Flame Rotla",
    desc: "Replaces high-gluten refined wheat with slow-digesting pearl millet, curbing post-meal lethargy and bloated digestion.",
    giWheat: 75,
    giMillet: 52,
    fiberWheat: 2.5,
    fiberMillet: 10.5,
    satietyGain: "+3.5 Hours Energy",
    waterSaved: "1,400 L/kg"
  },
  upma: {
    oldName: "Wheat Suji / Rava Upma",
    newName: "Millet Marg Golden Upma (User Recipe)",
    desc: "Swaps stripped wheat endosperm (suji) for whole-grain foxtail and little millet tempered with curry leaves and mustard seeds.",
    giWheat: 72,
    giMillet: 50,
    fiberWheat: 1.8,
    fiberMillet: 8.2,
    satietyGain: "+4.0 Hours Energy",
    waterSaved: "1,550 L/kg"
  },
  dalia: {
    oldName: "Wheat Broken Dalia",
    newName: "Spiced Foxtail & Mung Khichdi",
    desc: "A nutrient-rich Ayurvedic powerhouse replacing heavy broken wheat with probiotic-friendly fermented millet and ghee.",
    giWheat: 68,
    giMillet: 48,
    fiberWheat: 3.2,
    fiberMillet: 9.8,
    satietyGain: "+4.2 Hours Energy",
    waterSaved: "1,380 L/kg"
  },
  pasta: {
    oldName: "Maida & Wheat Noodles",
    newName: "100% Ragi & Foxtail Wok Noodles",
    desc: "Wok-tossed over blazing kitchen flames without bleaching agents, artificial gums, or synthetic preservatives.",
    giWheat: 78,
    giMillet: 54,
    fiberWheat: 1.2,
    fiberMillet: 7.5,
    satietyGain: "+3.0 Hours Energy",
    waterSaved: "1,600 L/kg"
  }
};

// ==========================================================================
// 1. Background Ambient 3D Three.js Particles
// ==========================================================================
let bgScene, bgCamera, bgRenderer, bgParticles;
let mouseX = 0, mouseY = 0;
let targetMouseX = 0, targetMouseY = 0;

function initBackground3D() {
  const container = document.getElementById('webgl-canvas-container');
  if (!container) return;

  bgScene = new THREE.Scene();
  bgCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  bgCamera.position.z = 50;

  bgRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  bgRenderer.setSize(window.innerWidth, window.innerHeight);
  bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  container.appendChild(bgRenderer.domElement);

  const particleCount = window.innerWidth < 768 ? 140 : 260;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const scales = new Float32Array(particleCount);
  const colors = new Float32Array(particleCount * 3);

  const goldColor = new THREE.Color(0xf3c469);
  const flameColor = new THREE.Color(0xe50914);
  const jadeColor = new THREE.Color(0x34d399);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 120;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

    scales[i] = Math.random() * 2.5 + 1;

    let c = Math.random() > 0.45 ? goldColor : (Math.random() > 0.5 ? flameColor : jadeColor);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.4, 'rgba(255,230,150,0.8)');
  grad.addColorStop(1, 'rgba(255,200,80,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(16, 16, 16, 0, Math.PI * 2);
  ctx.fill();

  const particleTexture = new THREE.CanvasTexture(canvas);

  const material = new THREE.PointsMaterial({
    size: 2.2,
    map: particleTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  bgParticles = new THREE.Points(geometry, material);
  bgScene.add(bgParticles);

  window.addEventListener('resize', onWindowResize);
  document.addEventListener('mousemove', onMouseMove);

  animateBackground3D();
}

function onWindowResize() {
  if (bgCamera && bgRenderer) {
    bgCamera.aspect = window.innerWidth / window.innerHeight;
    bgCamera.updateProjectionMatrix();
    bgRenderer.setSize(window.innerWidth, window.innerHeight);
  }
}

function onMouseMove(e) {
  targetMouseX = (e.clientX - window.innerWidth / 2) * 0.03;
  targetMouseY = (e.clientY - window.innerHeight / 2) * 0.03;
}

function animateBackground3D() {
  requestAnimationFrame(animateBackground3D);

  mouseX += (targetMouseX - mouseX) * 0.05;
  mouseY += (targetMouseY - mouseY) * 0.05;

  if (bgParticles) {
    bgParticles.rotation.y += 0.0006;
    bgParticles.rotation.x = mouseY * 0.005;
    bgParticles.position.x = mouseX * 0.15;

    const pos = bgParticles.geometry.attributes.position.array;
    for (let i = 1; i < pos.length; i += 3) {
      pos[i] += 0.035;
      if (pos[i] > 60) pos[i] = -60;
    }
    bgParticles.geometry.attributes.position.needsUpdate = true;
  }

  if (bgRenderer && bgScene && bgCamera) {
    bgRenderer.render(bgScene, bgCamera);
  }
}

// ==========================================================================
// 2. Interactive 3D Grain Inspector
// ==========================================================================
let grainScene, grainCamera, grainRenderer, grainMesh, grainHalo, grainCrease;
let grainControls = { isDragging: false, prevX: 0, prevY: 0, rotX: 0.2, rotY: 0.4 };
let currentGrainKey = 'wheat';

function initGrainInspector3D() {
  const canvas = document.getElementById('grain-3d-canvas');
  if (!canvas) return;

  const width = canvas.parentElement.clientWidth;
  const height = canvas.parentElement.clientHeight || 420;

  grainScene = new THREE.Scene();
  grainCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  grainCamera.position.set(0, 0, 7.5);

  grainRenderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  grainRenderer.setSize(width, height);
  grainRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  grainRenderer.toneMapping = THREE.ACESFilmicToneMapping;
  grainRenderer.toneMappingExposure = 1.25;

  const keyLight = new THREE.DirectionalLight(0xfffaed, 2.8);
  keyLight.position.set(5, 6, 5);
  grainScene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xf97316, 2.2);
  rimLight.position.set(-6, 3, -4);
  grainScene.add(rimLight);

  const fillLight = new THREE.PointLight(0x34d399, 1.2, 20);
  fillLight.position.set(0, -4, 4);
  grainScene.add(fillLight);

  const ambientLight = new THREE.AmbientLight(0x1a2420, 1.5);
  grainScene.add(ambientLight);

  const haloGeo = new THREE.TorusGeometry(2.4, 0.015, 16, 100);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xf3c469,
    transparent: true,
    opacity: 0.45
  });
  grainHalo = new THREE.Mesh(haloGeo, haloMat);
  grainHalo.rotation.x = Math.PI / 2.2;
  grainScene.add(grainHalo);

  buildGrainModel('wheat');

  // Mouse drag
  canvas.addEventListener('mousedown', (e) => {
    grainControls.isDragging = true;
    grainControls.prevX = e.clientX;
    grainControls.prevY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    grainControls.isDragging = false;
  });

  window.addEventListener('mousemove', (e) => {
    if (!grainControls.isDragging) return;
    const dx = e.clientX - grainControls.prevX;
    const dy = e.clientY - grainControls.prevY;
    grainControls.rotY += dx * 0.008;
    grainControls.rotX += dy * 0.008;
    grainControls.prevX = e.clientX;
    grainControls.prevY = e.clientY;
  });

  // Mobile Touch Support
  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      grainControls.isDragging = true;
      grainControls.prevX = e.touches[0].clientX;
      grainControls.prevY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    grainControls.isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!grainControls.isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - grainControls.prevX;
    const dy = e.touches[0].clientY - grainControls.prevY;
    grainControls.rotY += dx * 0.01;
    grainControls.rotX += dy * 0.01;
    grainControls.prevX = e.touches[0].clientX;
    grainControls.prevY = e.touches[0].clientY;
  }, { passive: true });

  window.addEventListener('resize', () => {
    if (!canvas || !canvas.parentElement) return;
    const w = canvas.parentElement.clientWidth;
    const h = canvas.parentElement.clientHeight || 420;
    grainCamera.aspect = w / h;
    grainCamera.updateProjectionMatrix();
    grainRenderer.setSize(w, h);
  });

  animateGrainInspector3D();
}

function buildGrainModel(grainKey) {
  const data = GRAIN_DATA[grainKey];
  if (!data) return;

  if (grainMesh) grainScene.remove(grainMesh);
  if (grainCrease) grainScene.remove(grainCrease);

  let geometry;
  if (grainKey === 'wheat') {
    geometry = new THREE.CylinderGeometry(0.85, 0.95, 3.2, 32, 16);
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);
      let factor = 1 - Math.pow(y / 1.7, 2) * 0.75;
      x *= factor;
      z *= factor * 0.72;
      if (z > 0 && Math.abs(x) < 0.25) {
        z -= (0.25 - Math.abs(x)) * 0.8;
      }
      pos.setXYZ(i, x, y, z);
    }
    geometry.computeVertexNormals();

    const creaseGeo = new THREE.BoxGeometry(0.06, 2.7, 0.2);
    const creaseMat = new THREE.MeshBasicMaterial({ color: 0x5a3b10 });
    grainCrease = new THREE.Mesh(creaseGeo, creaseMat);
    grainCrease.position.z = 0.55;
    grainScene.add(grainCrease);

  } else if (grainKey === 'ragi') {
    geometry = new THREE.DodecahedronGeometry(1.6, 5);
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);
      let noise = (Math.sin(x * 6) + Math.cos(y * 6)) * 0.04;
      pos.setXYZ(i, x + noise, y + noise, z + noise);
    }
    geometry.computeVertexNormals();

  } else {
    geometry = new THREE.SphereGeometry(1.5, 48, 48);
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);
      let t = (y + 1.5) / 3.0;
      let widthFactor = 0.85 + 0.3 * Math.sin(t * Math.PI);
      pos.setXYZ(i, x * widthFactor, y * (data.scale[1] / 1.5), z * widthFactor);
    }
    geometry.computeVertexNormals();
  }

  const material = new THREE.MeshStandardMaterial({
    color: data.color,
    roughness: data.roughness,
    metalness: data.metalness,
    bumpScale: 0.05
  });

  grainMesh = new THREE.Mesh(geometry, material);
  grainScene.add(grainMesh);

  if (grainHalo) {
    grainHalo.material.color.setHex(data.color);
  }
}

function animateGrainInspector3D() {
  requestAnimationFrame(animateGrainInspector3D);

  if (!grainControls.isDragging) {
    grainControls.rotY += 0.007;
  }

  if (grainMesh) {
    grainMesh.rotation.y = grainControls.rotY;
    grainMesh.rotation.x = grainControls.rotX;

    if (grainCrease) {
      grainCrease.rotation.y = grainControls.rotY;
      grainCrease.rotation.x = grainControls.rotX;
    }
  }

  if (grainHalo) {
    grainHalo.rotation.z += 0.004;
    grainHalo.scale.setScalar(1 + Math.sin(Date.now() * 0.002) * 0.04);
  }

  if (grainRenderer && grainScene && grainCamera) {
    grainRenderer.render(grainScene, grainCamera);
  }
}

function selectGrain(grainKey) {
  currentGrainKey = grainKey;
  const data = GRAIN_DATA[grainKey];
  if (!data) return;

  buildGrainModel(grainKey);

  document.querySelectorAll('.grain-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.grain === grainKey);
  });

  document.getElementById('grain-name').textContent = data.name;
  document.getElementById('grain-botanical').textContent = data.botanical;
  document.getElementById('grain-desc').textContent = data.description;
  document.getElementById('grain-badge-status').textContent = data.badge;

  updateMetricBar('metric-gi', data.gi, 100, data.gi > 60 ? '#ef4444' : '#10b981', `${data.gi} (Low is better)`);
  updateMetricBar('metric-fiber', data.fiber, 15, '#f3c469', `${data.fiber}g / 100g`);
  updateMetricBar('metric-protein', data.protein, 15, '#e69c3a', `${data.protein}g / 100g`);
  updateMetricBar('metric-calcium', data.calcium, 360, '#34d399', `${data.calcium}mg / 100g`);
}

function updateMetricBar(id, val, max, color, labelText) {
  const el = document.getElementById(id);
  const label = document.getElementById(id + '-val');
  if (!el) return;

  const pct = Math.min(100, Math.round((val / max) * 100));
  el.style.width = pct + '%';
  el.style.background = color;
  if (label) label.textContent = labelText;
}

// ==========================================================================
// 3. Substitution Simulator Interactivity
// ==========================================================================
function selectSubstitution(key) {
  const item = SUBSTITUTIONS[key];
  if (!item) return;

  document.querySelectorAll('.swap-box').forEach(box => {
    box.classList.toggle('active', box.dataset.swap === key);
  });

  const titleEl = document.getElementById('sub-title');
  const descEl = document.getElementById('sub-desc');
  const energyEl = document.getElementById('sub-satiety');
  const waterEl = document.getElementById('sub-water');

  if (titleEl) titleEl.textContent = `${item.oldName} ➔ ${item.newName}`;
  if (descEl) descEl.textContent = item.desc;
  if (energyEl) energyEl.textContent = item.satietyGain;
  if (waterEl) waterEl.textContent = item.waterSaved;

  const fillGi = document.getElementById('gauge-gi-fill');
  const giMilletVal = document.getElementById('gauge-millet-gi-val');
  const giWheatVal = document.getElementById('gauge-wheat-gi-val');
  if (fillGi) fillGi.style.width = `${(item.giMillet / item.giWheat) * 100}%`;
  if (giMilletVal) giMilletVal.textContent = `Millet GI: ${item.giMillet}`;
  if (giWheatVal) giWheatVal.textContent = `Wheat GI: ${item.giWheat}`;

  const fillFiber = document.getElementById('gauge-fiber-fill');
  const fiberMilletVal = document.getElementById('gauge-millet-fiber-val');
  const fiberWheatVal = document.getElementById('gauge-wheat-fiber-val');
  if (fillFiber) fillFiber.style.width = `${Math.min(100, (item.fiberMillet / (item.fiberWheat + item.fiberMillet)) * 100)}%`;
  if (fiberMilletVal) fiberMilletVal.textContent = `Millet Fiber: ${item.fiberMillet}g`;
  if (fiberWheatVal) fiberWheatVal.textContent = `Wheat Fiber: ${item.fiberWheat}g`;
}

// ==========================================================================
// 4. Video Reel Modal Player
// ==========================================================================
const VIDEO_DETAILS = {
  'flambe-1': {
    title: "High-Flame Wok Alchemy",
    chefNote: "Live wok flambe tempering aromatics at 450°F to unlock caramelized toasted nutty nuances in whole millets without scorching nutrient bonds.",
    src: "assets/video-flambe-1.mp4"
  },
  'plating': {
    title: "Signature Plating: Millet Marg Bowl",
    chefNote: "Ladle presentation of freshly steamed herbal foxtail millet paired seamlessly with spiced golden chickpea stew, topped with micro-cilantro.",
    src: "assets/video-plating.mp4"
  },
  'tadka': {
    title: "Artisanal Tempering (Chhonk)",
    chefNote: "Mustard seeds, green chilies, and fresh curry leaves sizzling in pure cold-pressed oil, providing digestive essential oils and carminative spices.",
    src: "assets/video-tadka.mp4"
  },
  'curry': {
    title: "Slow-Simmered Chana Gravy",
    chefNote: "Chickpeas simmered with roasted cumin, turmeric, and ripe tomato reduction—crafted specifically to complement the soft texture of millets.",
    src: "assets/video-curry-simmer.mp4"
  },
  'flambe-2': {
    title: "Wok Toss & Flame Sealing",
    chefNote: "High heat flash-cooking traps moisture inside each grain while keeping grains individual and fluffy, completely avoiding the gluey gluten texture of wheat.",
    src: "assets/video-flambe-2.mp4"
  },
  'spices': {
    title: "Hand-Ground Spice Infusion",
    chefNote: "Fresh coriander, roasted fenugreek, and black pepper infused directly into the simmer pan, accelerating gut bio-availability.",
    src: "assets/video-spices.mp4"
  }
};

function openVideoModal(videoId) {
  const modal = document.getElementById('video-modal');
  const videoEl = document.getElementById('modal-video-player');
  const titleEl = document.getElementById('modal-video-title');
  const noteEl = document.getElementById('modal-video-note');
  const details = VIDEO_DETAILS[videoId];

  if (!details || !modal || !videoEl) return;

  titleEl.textContent = details.title;
  noteEl.textContent = details.chefNote;
  videoEl.src = details.src;
  modal.classList.add('open');
  videoEl.play().catch(() => {});
}

function closeVideoModal() {
  const modal = document.getElementById('video-modal');
  const videoEl = document.getElementById('modal-video-player');
  if (modal) modal.classList.remove('open');
  if (videoEl) {
    videoEl.pause();
    videoEl.src = '';
  }
}

// ==========================================================================
// 5. Web Audio Ambient Synthesizer
// ==========================================================================
let audioCtx = null;
let isAudioPlaying = false;
let noiseNode = null;
let gainNode = null;

function toggleAmbientSound() {
  const btn = document.getElementById('sound-toggle');
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  if (!isAudioPlaying) {
    const bufferSize = audioCtx.sampleRate * 2;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.08;
    }

    noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = buffer;
    noiseNode.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, audioCtx.currentTime);

    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);

    noiseNode.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    noiseNode.start();
    isAudioPlaying = true;
    if (btn) {
      btn.classList.add('active');
      btn.innerHTML = `<i data-lucide="volume-2"></i>`;
      lucide.createIcons();
    }
    showToast("Culinary flame ambiance enabled");
  } else {
    if (noiseNode) {
      noiseNode.stop();
      noiseNode.disconnect();
    }
    isAudioPlaying = false;
    if (btn) {
      btn.classList.remove('active');
      btn.innerHTML = `<i data-lucide="volume-x"></i>`;
      lucide.createIcons();
    }
    showToast("Ambient audio muted");
  }
}

// ==========================================================================
// 6. Toast Notification Helper
// ==========================================================================
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast-notice');
  const toastMsg = document.getElementById('toast-msg');
  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// ==========================================================================
// 7. Order Cart System
// ==========================================================================
let cartCount = 0;
function addToCart(dishName, price) {
  cartCount++;
  const badge = document.getElementById('cart-badge');
  const profileCount = document.getElementById('profile-cart-count');
  if (badge) {
    badge.textContent = cartCount;
    badge.style.display = 'inline-flex';
  }
  if (profileCount) profileCount.textContent = cartCount;

  showToast(`Added ${dishName} (₹${price}) to your order!`);

  if (window.confetti) {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#e50914', '#f3c469', '#34d399']
    });
  }
}

// ==========================================================================
// 8. Netflix Navbar Interactivity & Mobile Drawer
// ==========================================================================
function initNetflixNavbar() {
  const navbar = document.getElementById('main-navbar');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileClose = document.getElementById('mobile-drawer-close');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');

  // Search input expansion
  const searchBtn = document.getElementById('search-btn');
  const searchWrap = document.querySelector('.nav-search-wrap');
  const searchInput = document.getElementById('nav-search-input');

  if (searchBtn && searchWrap) {
    searchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      searchWrap.classList.toggle('expanded');
      if (searchWrap.classList.contains('expanded') && searchInput) {
        searchInput.focus();
      }
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length > 2) {
          showToast(`Searching "${query}" in grains & menu...`);
        }
      });
    }
  }

  // Notification dropdown
  const notifBtn = document.getElementById('notif-btn');
  const notifDropdown = document.getElementById('notif-dropdown');
  if (notifBtn && notifDropdown) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifDropdown.classList.toggle('open');
      if (profileDropdown) profileDropdown.classList.remove('open');
    });
  }

  // Profile dropdown
  const profileBtn = document.getElementById('profile-btn');
  const profileDropdown = document.getElementById('profile-dropdown');
  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('open');
      if (notifDropdown) notifDropdown.classList.remove('open');
    });
  }

  // Close dropdowns on click outside
  document.addEventListener('click', () => {
    if (notifDropdown) notifDropdown.classList.remove('open');
    if (profileDropdown) profileDropdown.classList.remove('open');
    if (searchWrap && searchInput && !searchInput.value) {
      searchWrap.classList.remove('expanded');
    }
  });

  // Mobile Drawer Toggle
  function openMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('open');
    if (drawerBackdrop) drawerBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (drawerBackdrop) drawerBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileDrawer);
  if (mobileClose) mobileClose.addEventListener('click', closeMobileDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeMobileDrawer);

  // Close drawer when any mobile nav item is tapped
  document.querySelectorAll('.mobile-nav-item').forEach(item => {
    item.addEventListener('click', () => {
      closeMobileDrawer();
    });
  });

  // Netflix Navbar Scroll Styling
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Update active nav link on scroll
    updateActiveNavLink();
  });
}

function updateActiveNavLink() {
  const sections = ['hero', 'inspector', 'journey', 'reel', 'nutrition', 'menu'];
  const scrollPos = window.scrollY + 200;

  for (let id of sections) {
    const el = document.getElementById(id);
    if (el) {
      const top = el.offsetTop;
      const height = el.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.netflix-link').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
        document.querySelectorAll('.mobile-nav-item').forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
        break;
      }
    }
  }
}

// ==========================================================================
// DOM Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  initNetflixNavbar();
  initBackground3D();
  initGrainInspector3D();
  selectGrain('wheat');
  selectSubstitution('roti');

  const soundBtn = document.getElementById('sound-toggle');
  if (soundBtn) {
    soundBtn.addEventListener('click', toggleAmbientSound);
  }

  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modal = document.getElementById('video-modal');
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeVideoModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeVideoModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeVideoModal();
  });

  document.querySelectorAll('.video-reel-card').forEach(card => {
    const video = card.querySelector('video');
    card.addEventListener('mouseenter', () => {
      if (video) video.play().catch(() => {});
    });
    card.addEventListener('mouseleave', () => {
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const el = document.querySelector(targetId);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
});
