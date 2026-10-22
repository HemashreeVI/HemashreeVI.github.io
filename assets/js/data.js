/* =====================================================================
   All site content lives here. Edit this file to update the portfolio.
   Image paths are relative to index.html.
   ===================================================================== */
window.SITE = {
  name: "HEMASHREE",
  fullName: "Hemashree Venugopal Indrajith",
  title: "Software Engineer",
  degree: "B.Tech Computer Science Engineering",
  college: "VIT Chennai",
  since: "2023",
  location: "Chennai, India",
  email: "shreejith2005@gmail.com",
  links: {
    github: "https://github.com/HemashreeVI",
    linkedin: "https://www.linkedin.com/in/hema-shree-373622289",
    leetcode: "https://leetcode.com/u/hemashree_272005/",
    resume: "./resume.pdf"
  },
  heroImage: "./assets/img/hero.jpg",
  tagline: "Building systems that see, decide and keep people safe.",

  /* "Who's watching?" profiles. Each one reorders the rows and changes the billboard copy. */
  profiles: [
    { id: "recruiter", label: "Recruiter", color: "#E50914", photo: "./assets/img/avatar.jpg",
      pitch: "A software engineer who ships end to end: vision models at ~97% accuracy, a patent-pending smart walker, and backend platforms that diagnose their own failures. Open to opportunities.",
      rows: ["picks", "experience", "top10", "skills", "certs", "building", "singapore", "play", "facts"] },
    { id: "engineer", label: "Engineer", color: "#2F80ED", glyph: "</>",
      pitch: "YOLOv9 pipelines with Grad-CAM, LIDAR SLAM on a Raspberry Pi 5, Kafka + local-LLM triage, and FastAPI microservices that rank their own root causes. Pull up a chair.",
      rows: ["top10", "building", "skills", "picks", "experience", "certs", "play", "singapore", "facts"] },
    { id: "explorer", label: "Explorer", color: "#27AE60", glyph: "✈",
      pitch: "From Chennai to Singapore: NUS Industry 4.0, a visit to NTU, SuperAI at Marina Bay Sands, four spoken languages and an F1 habit. The story behind the code.",
      rows: ["singapore", "facts", "experience", "picks", "certs", "top10", "skills", "building", "play"] },
    { id: "gamer", label: "Gamer", color: "#F2C94C", glyph: "▶",
      pitch: "Four mini-games built from real projects: stop a fall, save a mango, hunt a broken microservice, sprint through hiragana. Press play.",
      rows: ["play", "top10", "picks", "building", "facts", "singapore", "skills", "experience", "certs"] }
  ],

  rowTitles: {
    picks: "Top Picks for {profile}",
    top10: "Top 10 Projects in Chennai Today",
    building: "Continue Watching for {profile}",
    experience: "Experience & Milestones",
    skills: "Skills: The Full Cast",
    certs: "Certifications",
    singapore: "Singapore 2025: Behind the Scenes",
    play: "Play Something",
    facts: "Things You Won't Find on My Résumé"
  },

  /* ------------------------------------------------------------------ projects */
  projects: [
    {
      id: "walker", title: "Smart Walker", genre: "IoT · Healthcare · Patent", year: "2025–26",
      badge: "PATENT PENDING", match: 99, color: ["#3a0a12", "#E50914"], art: "walker",
      logline: "A walker that predicts a fall before it happens.",
      synopsis: "Co-invented an Arduino Uno smart walker that fuses dual MPU6050 IMUs, dual HX711 load cells and dual HC-SR04 ultrasonic sensors for real-time bilateral fall detection, weight-asymmetry monitoring and obstacle avoidance. It runs fully standalone with no cloud dependency, for under USD 30 in hardware.",
      cast: ["Arduino Uno", "MPU6050 ×2", "HX711 ×2", "HC-SR04 ×2", "16×2 I2C LCD", "Buzzer", "C++"],
      episodes: [
        ["Sensor fusion", "Tilt, weight imbalance and obstacle proximity combined into one Fall Risk Prediction engine."],
        ["Dynamic Stability Reserve", "A metric that flags deteriorating stability before a fall occurs."],
        ["Near-fall detection", "Catches the stumbles that don't end on the floor."],
        ["Gait Symmetry Index", "Tracks rehabilitation progress over time."],
        ["The patent", "Inventive disclosure filed with IIPRD (Khurana & Khurana). Filing in progress."]
      ],
      repo: "", game: "walker",
      image: "./assets/img/walker.jpg",
      imageTall: "./assets/img/walker.jpg",
      gallery: [
        ["./assets/img/walker.jpg", "The prototype: ultrasonic sensors on the front bar, IMUs and load cells on the frame"],
        ["./assets/img/walker-circuit.jpg", "Circuit: Arduino Uno, dual MPU6050, dual HX711 load cells, dual HC-SR04, buzzer and a 16×2 I2C LCD", "contain"]
      ]
    },
    {
      id: "rover", title: "Hazard Rover", genre: "Robotics · Reinforcement Learning", year: "2026",
      badge: "NEW SEASON", match: 98, color: ["#0b2a1f", "#27AE60"], art: "rover",
      logline: "An autonomous rover that maps a disaster zone and guides people out.",
      synopsis: "An autonomous ground rover for disaster-response reconnaissance. It runs LIDAR SLAM on a self-upgraded Raspberry Pi 5, overlays a live risk heatmap of hazards, detects victims with a modified YOLOv8n, and computes the safest way out with a modified A* search.",
      cast: ["Python", "Raspberry Pi 5", "BreezySLAM", "YOLOv8n / YOLOv9t", "A*", "Flask", "PyTorch"],
      episodes: [
        ["Mapping the unknown", "LIDAR-based SLAM (BreezySLAM) builds a real-time map with a hazard heatmap."],
        ["Finding people", "YOLOv8n modified with a multi-task risk-score head and a loss reweighted to prioritise humans."],
        ["Smoke and gas", "A camera-based YOLOv9t plus an MQ-2 gas sensor for fire, smoke and gas hazards."],
        ["The way out", "Modified A* over the live map finds the safest, shortest evacuation path, with spoken guidance."],
        ["Learning to sweep", "RL navigation adapts the sweep around new hazards; a simulated version compares tabular Q-learning + CNN across a 4-way reward ablation."],
        ["Mission control", "Live position, sensors and detections stream to a Flask telemetry dashboard."]
      ],
      repo: "https://github.com/HemashreeVI/Rover",
      image: "./assets/img/rover-side.jpg",
      imageTall: "./assets/img/rover-field.jpg",
      gallery: [
        ["./assets/img/rover-side.jpg", "Six wheels, suspension on every corner, LIDAR up front"],
        ["./assets/img/rover-top.jpg", "Top view: Raspberry Pi 5, motor driver, MQ-2 gas sensor and LIDAR"],
        ["./assets/img/rover-field.jpg", "Field test: watching the live camera feed while the rover drives"]
      ]
    },
    {
      id: "dental", title: "Dental X-Ray AI", genre: "Computer Vision · Healthcare", year: "2025",
      badge: "~97% ACCURACY", match: 97, color: ["#0d1b3a", "#56CCF2"], art: "xray",
      logline: "Reads dental X-rays and explains what it sees.",
      synopsis: "A YOLOv9 pipeline that detects 31 dental conditions and analyses teeth alignment from X-rays, reaching ~97% accuracy on a 13,000+ image dataset. Grad-CAM shows which regions drove each prediction, supporting clinical interpretability.",
      cast: ["Python", "YOLOv9", "PyTorch", "OpenCV", "Grad-CAM", "Gradio", "Jupyter"],
      episodes: [
        ["31 conditions", "Detection across 31 dental conditions plus teeth-alignment analysis."],
        ["13,000+ X-rays", "Trained and evaluated on a 13,000+ image dataset at ~97% accuracy."],
        ["Show your work", "Grad-CAM heatmaps highlight what the model looked at."],
        ["FDI mapping", "Findings mapped to standard FDI tooth numbers."],
        ["Triage by colour", "Every finding is graded Critical, Orthodontic, Restorative, Existing work or Normal, and mapped onto an FDI tooth chart by severity."],
        ["In the clinic", "A Gradio app: upload a panoramic X-ray, get annotations, a Grad-CAM heatmap and a PDF report."],
        ["Beyond detection", "A cost estimator, an Ask-AI chat about your results, and a guide to reading them."]
      ],
      repo: "https://github.com/HemashreeVI/AI_Malocclusion_Detection",
      image: "./assets/img/dental-results.jpg",
      imageTall: "./assets/img/dental-annotated.jpg",
      gallery: [
        ["./assets/img/dental-results.jpg", "Results: annotated X-ray with FDI tooth numbers, next to the Grad-CAM heatmap of where the model looks"],
        ["./assets/img/dental-fdi.jpg", "FDI tooth chart: detected issues highlighted by severity", "contain"],
        ["./assets/img/dental-app.jpg", "The app: upload a panoramic X-ray, then explore the cost estimator and Ask-AI tabs"],
        ["./assets/img/dental-confusion.jpg", "Confusion matrix: most classes reach 0.91–1.00 recall", "contain"]
      ]
    },
    {
      id: "rootlens", title: "RootLens", genre: "Reliability · AIOps", year: "2026",
      badge: "TRENDING", match: 96, color: ["#2a1240", "#9B51E0"], art: "graph",
      logline: "When a microservice breaks, it finds out why and fixes it.",
      synopsis: "A reliability control room for FastAPI microservices. It watches live order traffic, and when something breaks it runs five steps on its own: detect, investigate and rank likely causes, decide within safety rules, act by rolling back or restarting, then verify customers are OK again.",
      cast: ["Python", "FastAPI", "Docker", "Prometheus", "Grafana", "SQLite", "GitHub Actions"],
      episodes: [
        ["Detect", "Notices the moment customer orders start failing."],
        ["Investigate", "Collects evidence and ranks the likely causes."],
        ["Decide", "Checks the safety rules and picks a fix."],
        ["Act", "Rolls back or restarts, but only if the rules allow it (robot mode: enforce)."],
        ["Verify", "Confirms customers are OK again before closing the incident."],
        ["Control room", "Live success rate, orders per second, p95 response time and open incidents, plus a map of how an order moves through the services."],
        ["Release history", "Every release and rollback recorded, including the ones RootLens did on its own."]
      ],
      repo: "https://github.com/HemashreeVI/rootlens", game: "incident",
      image: "./assets/img/rootlens-deploys.jpg",
      imageTall: "./assets/img/rootlens-tall.jpg",
      gallery: [
        ["./assets/img/rootlens-overview.jpg", "Overview: live health, the five-step loop, and how an order flows through the services", "contain"],
        ["./assets/img/rootlens-deploys.jpg", "Deployments: 20 releases recorded, 10 rollbacks, 3 done automatically by RootLens", "contain"]
      ]
    },
    {
      id: "triage", title: "TriageIQ", genre: "LLM · Streaming", year: "2026",
      badge: "TRENDING", match: 95, color: ["#3a2205", "#F2994A"], art: "stream",
      logline: "Support tickets, triaged the moment they arrive.",
      synopsis: "Tickets stream through Kafka, a local LLM classifies and prioritises them, and RAG over past tickets drafts the reply, all on a live dashboard.",
      cast: ["Python", "Kafka", "FastAPI", "Docker", "Ollama", "Qdrant"],
      episodes: [
        ["The stream", "Tickets flow in real time through Kafka."],
        ["The judge", "A local LLM via Ollama classifies and prioritises each one."],
        ["The memory", "RAG over past tickets in Qdrant drafts a grounded reply."],
        ["The board", "A live dashboard shows the queue as it moves."]
      ],
      repo: "https://github.com/HemashreeVI/TriageIQ"
    },
    {
      id: "grocer", title: "Smart Grocer", genre: "Multimodal AI · Retail", year: "In development",
      badge: "COMING SOON", match: 94, color: ["#14300a", "#6FCF97"], art: "fresh",
      logline: "Knows which mango will spoil first.",
      synopsis: "A multimodal system for fresh-produce spoilage detection, item localization and expiry-aware retail inventory, combining computer-vision freshness classification with gas/VOC sensor fusion.",
      cast: ["Python", "YOLO", "OpenCV", "ESP32", "Raspberry Pi", "Firebase", "Flutter"],
      episodes: [
        ["Four stages", "YOLO classifies each item as fresh, ripening, at-risk or spoiled."],
        ["Smell test", "Gas/VOC sampling targeted at the coordinates the camera detected."],
        ["One score", "Visual, gas and environmental confidence fused into a spoilage-risk score."],
        ["Something's off", "Rack-level anomaly detection (rolling stats, z-scores) flags abnormal spoilage."],
        ["Next season", "Barcode/OCR expiry tracking and a Firebase + Flutter app."]
      ],
      repo: "https://github.com/HemashreeVI/smart-grocer", game: "grocer"
    },
    {
      id: "ids", title: "Intrusion Detection", genre: "Cybersecurity", year: "2025",
      badge: "", match: 93, color: ["#2b0a0a", "#EB5757"], art: "shield",
      logline: "A bank that notices when something's not right.",
      synopsis: "A behavioral intrusion detection system for a simulated bank: risk scoring across login, access and transactions, automated responses and audit logs, built around a threat model.",
      cast: ["Python", "IDS", "Threat Modeling", "Risk Scoring"],
      episodes: [
        ["Threat model", "Mapping who attacks a bank, and how."],
        ["Risk scoring", "Behavioral scores across login, access and transactions."],
        ["Respond", "Automated responses when risk crosses a line."],
        ["Audit trail", "Every decision logged for review."]
      ],
      repo: ""
    },
    {
      id: "jarvis", title: "Jarvis", genre: "Voice Assistant", year: "2024",
      badge: "AT YOUR SERVICE", match: 92, color: ["#4a0b0e", "#F2C94C"], art: "jarvis",
      logline: "A voice assistant that never phones home.",
      synopsis: "An offline, privacy-friendly voice assistant: it opens apps, controls the system, reads battery/status and sends stock notifications.",
      cast: ["Python", "SpeechRecognition"],
      episodes: [
        ["Offline first", "Runs locally; nothing leaves the machine."],
        ["Hands free", "Opens apps and handles system controls by voice."],
        ["Status", "Battery, system status and stock notifications."]
      ],
      repo: "https://github.com/HemashreeVI/JarvisAI"
    }
  ],

  /* "Continue watching": progress 0–1 */
  building: [
    { title: "Pulse", note: "A free status page that runs entirely on GitHub Actions + Pages", status: "Step 1 of 5", progress: 0.2, color: ["#0b2a1f", "#27AE60"], repo: "https://github.com/HemashreeVI/pulse" },
    { title: "PortPilot", note: "Find what's using a port (even Docker containers) and free it with one key", status: "Planned", progress: 0.06, color: ["#0d1b3a", "#2F80ED"], repo: "https://github.com/HemashreeVI/portpilot" },
    { title: "BST Playground", note: "Watch binary search tree operations animate, step by step", status: "Planned", progress: 0.06, color: ["#3a2205", "#F2C94C"], repo: "https://github.com/HemashreeVI/bst-playground" },
    { title: "Pit Wall", note: "Replay real F1 races with a GPS track map and live leaderboard", status: "Planned", progress: 0.04, color: ["#3a0a12", "#E50914"], repo: "https://github.com/HemashreeVI/pit-wall" },
    { title: "LeetCode Solutions", note: "Clean, commented Java solutions, intuition first", status: "Daily", progress: 0.55, color: ["#2a1a05", "#FFA116"], repo: "https://github.com/HemashreeVI/leetcode-solutions" }
  ],

  experience: [
    { kicker: "PATENT", title: "Smart Walker Co-Inventor", when: "2025–26", text: "IoT-Enabled Smart Walker with Sensor-Fusion Fall Risk Prediction and Adaptive Mobility Assistance. Inventive disclosure filed with IIPRD; filing in progress.", color: ["#3a0a12", "#E50914"] },
    { kicker: "INTERNSHIP", title: "Research Intern, VIT Chennai", when: "May–Jul 2025", text: "Human pose estimation using heatmaps with MMPose, validated against Kinovea ground truth under Prof. Pavithra.", color: ["#0d1b3a", "#2F80ED"] },
    { kicker: "SINGAPORE", title: "NUS Industry 4.0 Programme", when: "Jun 2025", text: "National University of Singapore, via SCALE and the College of Design and Engineering. Team final project on digital transformation using the Business Model Canvas.", color: ["#2a1a05", "#F2994A"], image: "./assets/img/nus-sign.jpg" },
    { kicker: "CONFERENCE", title: "SuperAI 2025", when: "Jun 2025", text: "Marina Bay Sands, Singapore. Asia's largest AI conference: 7,000+ innovators and 1,000+ AI companies.", color: ["#2a1240", "#9B51E0"] },
    { kicker: "CERTIFIED", title: "IBM Generative AI", when: "Jun 2025", text: "Gen AI Using IBM watsonx, IBM Career Education Program via IBM Developer Skills Network.", color: ["#0d1b3a", "#56CCF2"] },
    { kicker: "LEADERSHIP", title: "Team Leader, CodeYGen Club", when: "VIT Chennai", text: "Led a student team through coding and design-based projects, coordinating development and presentations.", color: ["#0b2a1f", "#27AE60"] },
    { kicker: "DESIGN", title: "Design Lead, Fitness Club", when: "VIT Chennai", text: "Posters, creatives and digital content for fitness events and member engagement.", color: ["#3a2205", "#F2C94C"] },
    { kicker: "日本語", title: "Japanese", when: "VIT Chennai", text: "Studied Japanese as a subject at VIT Chennai. I can read hiragana, and the Hiragana Sprint game is built from it.", color: ["#2a1a05", "#F2C94C"] },
    { kicker: "EDUCATION", title: "B.Tech CSE, VIT Chennai", when: "2023 – present", text: "Computer Science Engineering with a specialisation in Cyber Physical Systems.", color: ["#2b0a0a", "#EB5757"] }
  ],

  skills: [
    { title: "Languages", items: ["Python", "Java", "C++", "JavaScript", "HTML", "CSS"] },
    { title: "AI & Vision", items: ["PyTorch", "TensorFlow", "OpenCV", "YOLOv8/v9", "Grad-CAM", "MMPose", "RAG", "Ollama", "IBM watsonx"] },
    { title: "Robotics & IoT", items: ["Arduino", "Raspberry Pi", "ESP32", "Sensor fusion", "LIDAR SLAM", "A*", "Q-learning"] },
    { title: "Backend & DevOps", items: ["FastAPI", "Flask", "Docker", "Kafka", "Prometheus", "Grafana", "GitHub Actions"] },
    { title: "Data", items: ["MySQL", "SQLite", "Firebase", "Qdrant"] },
    { title: "Security", items: ["Intrusion detection", "Threat modeling", "Risk analysis"] },
    { title: "Tools", items: ["Git", "VS Code", "Linux", "Jupyter", "Colab", "Kaggle", "Roboflow", "Gradio"] },
    { title: "Spoken", items: ["Tamil · native", "English · fluent", "Hindi · intermediate", "日本語 · basic"] }
  ],

  certs: [
    { title: "Industry 4.0 Immersion", issuer: "President Education × NUS · June 2025 cohort", image: "./assets/img/nus-cert-completion.jpg" },
    { title: "Introduction to Industry 4.0", issuer: "NUS SCALE · 24 June 2025", image: "./assets/img/nus-letter.jpg" },
    { title: "Gen AI Using IBM watsonx", issuer: "IBM Career Education Program · 19 June 2025", image: "./assets/img/ibm-cert.jpg" }
  ],

  singapore: [
    { title: "#NUS", caption: "National University of Singapore, Industry 4.0 Programme", image: "./assets/img/nus-sign.jpg" },
    { title: "NTU Singapore", caption: "Visiting Nanyang Business School, Nanyang Technological University", image: "./assets/img/ntu.jpg" },
    { title: "Certificate of Completion", caption: "Industry 4.0 immersion programme with NUS, June 2025 cohort", image: "./assets/img/nus-cert-completion.jpg" },
    { title: "SuperAI 2025", caption: "Marina Bay Sands: 7,000+ innovators, 1,000+ AI companies", image: "" }
  ],

  games: [
    { id: "walker", title: "Keep Them Standing", note: "Stop a fall before it happens", color: ["#3a0a12", "#E50914"] },
    { id: "grocer", title: "Freshness Check", note: "Save a mango from spoiling", color: ["#14300a", "#6FCF97"] },
    { id: "incident", title: "Incident Hunt", note: "Find the broken microservice", color: ["#2a1240", "#9B51E0"] },
    { id: "kana", title: "Hiragana Sprint", note: "Test your Japanese", color: ["#2a1a05", "#F2C94C"] }
  ],

  facts: [
    { title: "F1 Fan", text: "Which is why I'm building a race-replay app on real GPS data.", glyph: "🏎️" },
    { title: "Design Lead by Night", text: "I care how things look, not just how they work.", glyph: "🎨" },
    { title: "よろしくお願いします", text: "I can say it, and mean it.", glyph: "🗾" },
    { title: "Port 9092", text: "A Kafka container once stole my port. That's why PortPilot exists.", glyph: "🛠️" },
    { title: "Four Languages", text: "Tamil, English, Hindi and 日本語.", glyph: "🗣️" }
  ]
};
