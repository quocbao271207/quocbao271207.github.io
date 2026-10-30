/* Portfolio content. Each project renders as a card + case-study modal (see main.js). */

const CATEGORIES = [
  { id: "all", label: "All work" },
  { id: "medical", label: "Medical AI" },
  { id: "research", label: "Research & competitions" },
  { id: "product", label: "Products" },
  { id: "speech", label: "Speech & NLP" },
  { id: "vision", label: "Computer vision" },
];

const PROJECTS = [
  {
    title: "OneVoice — MediVoice Edge",
    meta: "OneVoice AI Challenge 2026 · Solo build",
    badge: "Featured",
    featured: true,
    categories: ["medical", "speech", "research"],
    short:
      "Offline Vietnamese ⇄ English medical speech translation (ASR → MT → TTS) engineered to run on a Qualcomm QCS6490 edge device.",
    summary:
      "A hands-free interpreter for clinics where the internet is unreliable and hands are busy. I built the whole pipeline alone — data audit, LoRA fine-tuning on rented GPUs, clinical safety gates and an INT8 deployment path — with every result bound to verifiable evidence before it can be released.",
    highlights: [
      "Verified a 31,929-file FLAC corpus with strict data-leakage and manifest gates before any training.",
      "LoRA rank sweep on PhoWhisper-small cut evaluation WER from 43.2% (r8) to 28.6% (full fine-tune).",
      "M2M100 EN→VI adapter reached BLEU 31.9; NLLB-200 and M2M100 compared in a fair, resumable bake-off.",
      "Clinical safety layer for drug names, doses, numbers and negation — unsafe output is blocked, not spoken.",
      "Fail-closed runtime: crash-durable checkpoints, signed evidence bundles and a loopback-only web demo.",
    ],
    facts: [
      ["Role", "Sole developer (265 commits)"],
      ["Organisers", "Saigon AI Hub × Qualcomm"],
      ["Target hardware", "Qualcomm QCS6490 · QNN INT8"],
      ["Status", "Field-test phase, Oct 2026"],
    ],
    tags: ["PyTorch", "PEFT / LoRA", "PhoWhisper", "NLLB-200", "M2M100", "Piper TTS", "Qualcomm AI Hub"],
    images: [
      { src: "assets/img/onevoice-concept.jpg", alt: "MediVoice hardware concept: handheld VI⇄EN medical translator on a clinic desk" },
      { src: "assets/img/onevoice-cad.jpg", alt: "Exploded CAD view of the MediVoice device enclosure" },
      { src: "assets/img/onevoice-bench.jpg", alt: "Benchtop setup with the QCS6490 development kit" },
    ],
    links: [{ label: "View repository", href: "https://github.com/quocbao271207/Onevoice" }],
  },
  {
    title: "VieGrand — “Vy ơi” Wake Word",
    meta: "VieGrand · Elderly home-care",
    badge: "Product",
    categories: ["product", "speech", "medical"],
    short:
      "On-device Vietnamese wake-word engine for an elderly-care ecosystem of AI cameras, smartwatches and a family app.",
    summary:
      "VieGrand watches over older people at home: it detects falls and anomalies, alerts family and tracks health trends while keeping sensitive data local. I built the “Vy ơi” wake-word model that lets elders call the assistant hands-free, and prepared data for the health-risk models.",
    highlights: [
      "Voice-disjoint 5-fold evaluation: 97.44% precision, 86.77% recall at a 0.83% false-positive rate.",
      "0 / 128 false triggers on a stress set of everyday conversation.",
      "Trained on 3,136 clips across 13 voice domains; shipped as an ONNX Runtime model inside the Android app.",
      "Validated parquet datasets feeding the server-side health-risk models.",
    ],
    facts: [
      ["Role", "Wake-word engine & data pipeline"],
      ["Platform", "Android · Edge AI"],
      ["Organisation", "VIEGRAND-PRODUCT"],
      ["Year", "2026"],
    ],
    tags: ["Keyword spotting", "ONNX Runtime", "Android", "Python", "Data validation"],
    images: [
      { src: "assets/img/viegrand-family.jpg", alt: "VieGrand family dashboard showing an alert and recent health activity" },
      { src: "assets/img/viegrand-vy.jpg", alt: "“Vy” assistant ready to listen after the wake word" },
      { src: "assets/img/viegrand-health.jpg", alt: "Elder health overview screen" },
    ],
    links: [{ label: "VieGrand on GitHub", href: "https://github.com/VIEGRAND-PRODUCT" }],
  },
  {
    title: "ABC2027 TrackID3x3",
    meta: "9th ABC Challenge · Nagoya Univ. × Kyushu Tech",
    badge: "In progress",
    categories: ["research", "vision"],
    short:
      "Detect, track and identify all six players in 3x3 basketball footage and map them onto court coordinates.",
    summary:
      "A tracking-by-identity solver that went through seven versions: detector + court homography, Hungarian matching, tracklet voting with kinematic gates, bipartite tracklet stitching and a contrastive ReID network for jersey identity.",
    highlights: [
      "Solver v4 reaches 99.99% TI-HOTA in 8-fold leave-one-sequence-out validation with zero ID switches.",
      "97–98% TI-HOTA on the challenge audit sequences, 93.5% with a raw held-out detector.",
      "ResNet34 IDNet with contrastive ReID: 99.97% crop-level identity accuracy.",
      "Challenge videos kept strictly evaluation-only to avoid leakage into training.",
    ],
    facts: [
      ["Competition", "ABC2027 TrackID3x3"],
      ["Conference", "ABC 2027 · Sydney, Jan 2027"],
      ["Metric", "TI-HOTA"],
    ],
    tags: ["YOLO", "Multi-object tracking", "Homography", "ReID", "ResNet34"],
    images: [{ src: "assets/img/abc2027-cover.svg", alt: "Illustration: six tracked players on a 3x3 basketball half court" }],
    links: [],
  },
  {
    title: "ISAS 2026 — BLE Indoor Localisation",
    meta: "ISAS Challenge 2026 · Co-authored paper",
    badge: "Paper",
    featured: true,
    categories: ["research", "medical"],
    short:
      "Room-level localisation of caregivers in a nursing home from sparse, imbalanced BLE beacon signals.",
    summary:
      "25 fixed beacons, ~22 rooms and more than 90% missing readings per second. We built an auditable pipeline — class-balanced ExtraTrees plus an 11-second centred probability smoothing — and rejected heavier models (including a TCN hybrid) that did not transfer across days.",
    highlights: [
      "Temporal smoothing lifts mean Macro-F1 from 0.351 to 0.411 across cross-day folds.",
      "Strict forward-in-time validation (Apr 10 → 11, Apr 10–11 → 12) instead of random splits.",
      "Every rejected alternative is documented with its evidence, keeping the final pipeline auditable.",
      "Paper: “An Auditable BLE Indoor Location-Recognition Pipeline under Sparse, Imbalanced and Temporally Dependent RSSI”.",
    ],
    facts: [
      ["Role", "Co-author"],
      ["Venue", "ISAS 2026 · J. Phys.: Conf. Ser. (IOP)"],
      ["Organiser", "ABC Sozolab"],
      ["Data", "25 BLE beacons · nursing-home floor"],
    ],
    tags: ["scikit-learn", "ExtraTrees", "Time series", "pandas", "LaTeX"],
    images: [
      { src: "assets/img/isas-macro-f1.jpg", alt: "Macro-F1 per fold: raw argmax vs centred 11-second smoothing" },
      { src: "assets/img/isas-system.jpg", alt: "Challenge data-collection system: BLE beacons, Fonlog app and server" },
      { src: "assets/img/isas-floorplan.jpg", alt: "Floor plan of the facility with installed beacons" },
      { src: "assets/img/isas-per-room.jpg", alt: "Per-room F1 on fold 2" },
      { src: "assets/img/isas-confusion.jpg", alt: "Confusion matrices before and after smoothing" },
    ],
    links: [],
  },
  {
    title: "Hokkaido ES Coach",
    meta: "Research collaboration · Hokkaido University",
    categories: ["medical", "vision", "research"],
    short:
      "Real-time, local-first coaching for endotracheal-suction training using pose estimation and sequence models.",
    summary:
      "Trainees practise airway suctioning while the system tracks each step on camera, checks the 15-second-per-suction safety rule and produces an educator-reviewed report. Video never leaves the machine: only downscaled frames go to a loopback worker.",
    highlights: [
      "YOLOv8n-Pose → Pose LSTM/TCN → HMM pipeline exported to ONNX for real-time inference.",
      "Best hybrid TCN (VideoMAE + pose) reaches 71.2% accuracy over 7 activity classes.",
      "Timeline of coaching moments, safety warnings and an evidence-linked post-session review.",
      "Optional self-hosted LLM (Qwen2.5-7B via vLLM) for grounded, rubric-based feedback.",
    ],
    facts: [
      ["Type", "Team research project"],
      ["Domain", "Clinical skills training"],
      ["Deployment", "Local-first · Docker"],
    ],
    tags: ["YOLOv8-Pose", "LSTM / TCN", "HMM", "ONNX Runtime", "vLLM", "OpenCV"],
    images: [
      { src: "assets/img/hokkaido-report.jpg", alt: "Post-session review: video timeline, coaching moments and feedback" },
      { src: "assets/img/hokkaido-live.jpg", alt: "Live session view with the procedure step strip" },
      { src: "assets/img/hokkaido-setup.jpg", alt: "Session setup screen" },
    ],
    links: [],
  },
  {
    title: "Bone-Age X-ray",
    meta: "Medical imaging research",
    categories: ["medical", "vision", "research"],
    short:
      "Bone-age regression from hand X-rays with leakage-safe splits and external validation on hospital data.",
    summary:
      "Trained on the RSNA dataset, then validated on hospital DICOMs with fixed patient-level splits and paired comparisons — the goal being numbers that survive contact with a real hospital, not just a leaderboard.",
    highlights: [
      "6.64-month MAE on 12,609 RSNA images (EfficientNet-B0, 512 px, 5-fold).",
      "External hospital validation: 9.03-month MAE on standardised images (147 cases).",
      "Paired same-case comparison with 95% confidence intervals instead of single-number claims.",
      "Reproducible repo (uv, ruff, pytest) with a Streamlit research UI. Research use only.",
    ],
    facts: [
      ["Role", "Author"],
      ["Model", "EfficientNet-B0"],
      ["Validation", "External hospital cohort"],
    ],
    tags: ["PyTorch", "EfficientNet", "DICOM", "Streamlit", "pytest"],
    images: [
      { src: "assets/img/boneage-cover.svg", alt: "Illustration: hand X-ray scan with MAE badge" },
      { src: "assets/img/boneage-distributions.jpg", alt: "Image geometry and intensity distributions, train vs test" },
      { src: "assets/img/boneage-age.jpg", alt: "Bone-age distribution by sex" },
    ],
    links: [{ label: "View repository", href: "https://github.com/quocbao271207/boneage-xray" }],
  },
  {
    title: "Viettel AI Race 2026",
    meta: "Viettel AI Race · Medical NLP",
    categories: ["research", "speech", "medical"],
    short:
      "Offline extraction of drugs and diagnoses from Vietnamese clinical notes, linked to RxNorm and ICD-10-CM codes.",
    summary:
      "Track 2, “Ontological Reasoning in Medical Knowledge Retrieval”. A GPU-free, API-free pipeline: section parsing with exact character offsets, large offline gazetteers and a rebuilt local scorer to iterate on submissions quickly.",
    highlights: [
      "Offline gazetteers: 74,719 ICD-10-CM codes and ~42k RxNorm concepts (SCD, IN, SBD).",
      "Exact character offsets — 2,217 / 2,217 spans aligned with the source text.",
      "Runs in about one second per batch, no GPU and no external API calls.",
      "Local scorer reconstruction enabled dozens of controlled submission experiments.",
    ],
    facts: [
      ["Role", "Core developer"],
      ["Competition", "Viettel AI Race 2026 · Track 2"],
      ["Constraint", "Fully offline"],
    ],
    tags: ["Python", "NER", "Entity linking", "RxNorm", "ICD-10-CM", "SapBERT"],
    images: [{ src: "assets/img/viettel-cover.svg", alt: "Illustration: entity spans highlighted in clinical text" }],
    links: [{ label: "View repository", href: "https://github.com/quocbao271207/Viettel" }],
  },
  {
    title: "English House Learning Platform",
    meta: "English House (Ms. Van) · EdTech",
    badge: "Product",
    featured: true,
    categories: ["product"],
    short:
      "Full learning platform for an English centre: student and teacher portals, an exam bank, CEFR vocabulary and learning games.",
    summary:
      "A production platform with a student portal, a teacher/admin app and a shared API. It covers exam authoring in 12 formats with Paper, Quiz and IELTS modes, CEFR A1–C2 vocabulary with five study modes, and two games — Word Runner and Spelling Squadron.",
    highlights: [
      "Exam bank with 12 question formats and three delivery modes.",
      "CEFR A1–C2 vocabulary: 30 themed seed decks and 300 starter cards.",
      "Gamified practice with Spelling Squadron and Word Runner.",
      "Premium access-grant model and end-to-end tests ahead of release.",
    ],
    facts: [
      ["Role", "Team member · student web"],
      ["Organisation", "English-House-MsVan"],
      ["Year", "2026"],
    ],
    tags: ["Next.js", "React 19", "TypeScript", "Tailwind", "NestJS", "Prisma", "PostgreSQL"],
    images: [
      { src: "assets/img/englishhouse-spelling.jpg", alt: "Spelling Squadron vocabulary game" },
      { src: "assets/img/englishhouse-exam.jpg", alt: "Student exam runner" },
      { src: "assets/img/englishhouse-authoring.jpg", alt: "Teacher exam authoring screen" },
    ],
    links: [{ label: "Organisation on GitHub", href: "https://github.com/English-House-MsVan" }],
  },
  {
    title: "Hand-Hygiene Monitoring",
    meta: "ICU computer vision · Team research",
    categories: ["medical", "vision", "research"],
    short:
      "Camera-based monitoring of the WHO “5 Moments” hand-hygiene rules in intensive-care units.",
    summary:
      "A 30 FPS camera feeds three detection modules — person–person contact, person–equipment contact and hand-washing — whose events drive a sterile/unsterile state machine that flags WHO violations in real time.",
    highlights: [
      "Owned one of the three contact-detection modules (YOLO11-pose + BoT-SORT tracking).",
      "Design targets: ≥ 90% precision and ≥ 88% recall at ≥ 30 FPS for the module.",
      "Finite-state machine turns detections into compliance events and reports.",
    ],
    facts: [
      ["Type", "3-person research project"],
      ["Standard", "WHO 5 Moments"],
      ["Status", "Research prototype"],
    ],
    tags: ["YOLO11-pose", "BoT-SORT", "SAM", "ST-GCN", "State machine"],
    images: [{ src: "assets/img/handwash-concept.jpg", alt: "Concept illustration: hand-pose detection" }],
    links: [{ label: "View repository", href: "https://github.com/quocbao271207/handwash-master" }],
  },
  {
    title: "Multimodal HAR — ABC 2026",
    meta: "ABC Challenge 2026 · Wearables",
    categories: ["research"],
    short:
      "Disentangling confusable actions in multimodal human-activity recognition from inertial, EMG and EEG signals.",
    summary:
      "Work on the WEAR inertial dataset and NinaPro EMG bio-signals: visualising sensor streams, extracting TSFEL features and proposing a stability-driven feature-selection framework for actions that models routinely confuse.",
    highlights: [
      "Stability-driven feature selection to separate easily confused activities.",
      "Integrated EMG-IMU and EEG signals in one feature pipeline.",
      "Exploratory visualisation of arm / leg inertial sensors per subject.",
    ],
    facts: [
      ["Competition", "ABC Challenge 2026"],
      ["Data", "WEAR · NinaPro"],
    ],
    tags: ["Python", "TSFEL", "scikit-learn", "Signal processing", "Jupyter"],
    images: [
      { src: "assets/img/har-concept.jpg", alt: "Concept illustration: multimodal activity sensing" },
      { src: "assets/img/har-wear.jpg", alt: "WEAR inertial-sensor signals for one subject (arm)" },
    ],
    links: [],
  },
  {
    title: "Sankit",
    meta: "Backend & GPS modelling",
    categories: ["product"],
    short:
      "Backend infrastructure and GPS models that optimise tracking and routing.",
    summary:
      "I designed and implemented the backend and developed GPS-based predictive models to improve tracking accuracy and routing decisions.",
    highlights: [
      "Designed the backend services and data model.",
      "Built GPS / spatial predictive models for tracking and routing.",
    ],
    facts: [["Role", "Backend & GPS model developer"]],
    tags: ["FastAPI", "Spatial modelling", "SQL"],
    images: [{ src: "assets/img/sankit-concept.jpg", alt: "Concept illustration: GPS tracking and routing" }],
    links: [],
  },
  {
    title: "International Quant Competition",
    meta: "Quantitative research",
    categories: ["research"],
    short:
      "Financial modelling and machine-learning strategies for an international quantitative-research competition.",
    summary:
      "Developed predictive models and trading-signal research using statistical and machine-learning techniques under the competition's evaluation rules.",
    highlights: [
      "Statistical and ML-based predictive models for financial time series.",
      "Strategy research and backtesting discipline.",
    ],
    facts: [["Field", "Quantitative finance"]],
    tags: ["Python", "Time series", "XGBoost", "Backtesting"],
    images: [{ src: "assets/img/iqc-cover.svg", alt: "Illustration: candlestick chart with model signal" }],
    links: [],
  },
];
