export type SafeQuizQuestion = {
  id: string;
  semester: string;
  theme: string;
  prompt: string;
  choices: string[];
  answer: number;
  explanation: string;
  reference: string;
  tags: string[];
};

export const safeQuizQuestionBank: SafeQuizQuestion[] = [
  {
    id: "med-safety-01",
    semester: "S1-S2",
    theme: "Sécurité médicamenteuse",
    prompt: "Avant d'administrer un traitement, quelle vérification est prioritaire ?",
    choices: [
      "La couleur du pilulier",
      "La prescription, l'identité, les allergies et les droits du médicament",
      "Le planning du service"
    ],
    answer: 1,
    explanation:
      "La sécurité médicamenteuse repose sur la prescription, l'identitovigilance, la recherche d'allergies et les droits du médicament.",
    reference: "Sécurité des soins - principes IFSI",
    tags: ["traitement", "sécurité", "stage"]
  },
  {
    id: "rgpd-01",
    semester: "Tous semestres",
    theme: "RGPD et secret professionnel",
    prompt: "Quelle information ne doit pas apparaître dans une fiche de révision partageable ?",
    choices: [
      "Une définition de pathologie",
      "Un schéma refait par l'étudiant",
      "Le nom, la date de naissance ou la chambre d'un patient"
    ],
    answer: 2,
    explanation:
      "Les données directement identifiantes sont à exclure. Une fiche pédagogique doit rester anonymisée.",
    reference: "Données de santé et anonymisation",
    tags: ["rgpd", "secret", "données"]
  },
  {
    id: "ai-ethics-01",
    semester: "Tous semestres",
    theme: "Usage responsable de l'IA",
    prompt: "Tu utilises l'IA pour travailler une situation de stage. Quel réflexe est indispensable ?",
    choices: [
      "Mettre le nom complet du patient pour plus de précision",
      "Anonymiser les données et faire valider le raisonnement",
      "Copier la réponse telle quelle dans le dossier"
    ],
    answer: 1,
    explanation:
      "L'IA doit rester un outil de travail. Les données patient doivent être anonymisées et les conclusions sensibles vérifiées avec l'encadrement.",
    reference: "IA pédagogique et confidentialité",
    tags: ["ia", "rgpd", "raisonnement"]
  },
  {
    id: "dose-01",
    semester: "S1-S3",
    theme: "Calcul de dose",
    prompt: "Dans un calcul de dose, pourquoi faut-il écrire les unités à chaque étape ?",
    choices: [
      "Pour rendre la feuille plus longue",
      "Pour repérer les incohérences et éviter une erreur d'administration",
      "Parce que l'application le demande seulement"
    ],
    answer: 1,
    explanation:
      "Les unités permettent de vérifier que le résultat correspond à une quantité administrable et cohérente avec la prescription.",
    reference: "Calculs de dose - raisonnement et unités",
    tags: ["dose", "calcul", "sécurité"]
  },
  {
    id: "transmission-01",
    semester: "Stage",
    theme: "Transmissions ciblées",
    prompt: "Dans une transmission ciblée, que représente le modèle DAR ?",
    choices: ["Diagnostic, Administration, Rangement", "Données, Actions, Résultats", "Dose, Allergie, Route"],
    answer: 1,
    explanation:
      "DAR structure la transmission : données observées, actions réalisées, résultats ou évolution.",
    reference: "Transmissions ciblées - modèle DAR",
    tags: ["transmission", "dar", "stage"]
  },
  {
    id: "cardio-01",
    semester: "Stage",
    theme: "Cardiologie",
    prompt: "En stage de cardiologie, quel signe doit faire alerter rapidement l'équipe ?",
    choices: [
      "Douleur thoracique persistante avec dyspnée, sueurs ou malaise",
      "Envie de dormir après le repas",
      "Demande d'un verre d'eau"
    ],
    answer: 0,
    explanation:
      "Une douleur thoracique persistante associée à des signes de gravité impose d'alerter rapidement l'équipe.",
    reference: "Surveillances cardio - signes d'alerte",
    tags: ["cardiologie", "surveillance", "alerte"]
  },
  {
    id: "stage-01",
    semester: "Stage",
    theme: "Posture étudiante",
    prompt: "Face à une prescription que tu ne comprends pas, quelle conduite est adaptée ?",
    choices: [
      "Administrer puis demander après",
      "Chercher, questionner l'encadrant et vérifier avant toute action",
      "Ignorer la prescription"
    ],
    answer: 1,
    explanation:
      "L'étudiant doit sécuriser l'action : comprendre, vérifier, questionner et respecter son niveau de responsabilité.",
    reference: "Posture professionnelle en stage",
    tags: ["stage", "prescription", "sécurité"]
  },
  {
    id: "technique-01",
    semester: "S1-S3",
    theme: "Gestes techniques",
    prompt: "Quel élément rend une fiche de geste technique réellement utile ?",
    choices: [
      "Matériel, préparation, points de vigilance, surveillance et traçabilité",
      "Uniquement une phrase de conclusion",
      "Des données nominatives de patient"
    ],
    answer: 0,
    explanation:
      "Une fiche efficace aide à préparer le soin : matériel, hygiène, identité, surveillance, risques et traçabilité.",
    reference: "Méthodologie des fiches techniques",
    tags: ["geste", "fiche", "stage"]
  },
  {
    id: "secret-01",
    semester: "Tous semestres",
    theme: "Secret professionnel",
    prompt: "Quel comportement respecte le secret professionnel ?",
    choices: [
      "Raconter une situation reconnaissable en groupe privé",
      "Partager seulement des éléments anonymisés et nécessaires à l'apprentissage",
      "Envoyer une photo du dossier patient pour gagner du temps"
    ],
    answer: 1,
    explanation:
      "Le secret professionnel impose de limiter les informations partagées et d'anonymiser les situations pédagogiques.",
    reference: "Secret professionnel et données de santé",
    tags: ["secret", "rgpd", "stage"]
  },
  {
    id: "reasoning-01",
    semester: "Tous semestres",
    theme: "Raisonnement clinique",
    prompt: "Pourquoi NurseAI laisse des questions à chercher au lieu de donner tout le devoir ?",
    choices: [
      "Pour bloquer l'étudiant",
      "Pour développer le raisonnement clinique et l'autonomie",
      "Pour éviter les calculs"
    ],
    answer: 1,
    explanation:
      "L'objectif est d'aider l'étudiant à comprendre, chercher et justifier, pas à recopier une solution toute faite.",
    reference: "Méthodologie IFSI - autonomie de raisonnement",
    tags: ["raisonnement", "pédagogie", "stage"]
  },
  {
    id: "diabete-01",
    semester: "S2-S4",
    theme: "Diabète",
    prompt: "Quel ensemble de signes doit faire penser à une hypoglycémie possible ?",
    choices: [
      "Sueurs, tremblements, faim, malaise ou troubles du comportement",
      "Cheveux secs uniquement",
      "Vision nette et confort complet"
    ],
    answer: 0,
    explanation:
      "Ces signes doivent faire vérifier la glycémie selon le contexte et les protocoles du service, puis alerter si nécessaire.",
    reference: "Surveillances diabète - signes d'alerte",
    tags: ["diabète", "surveillance", "stage"]
  },
  {
    id: "infection-01",
    semester: "S1-S4",
    theme: "Hygiène et infection",
    prompt: "Quel réflexe est prioritaire avant et après un soin ?",
    choices: [
      "Consulter son téléphone",
      "Réaliser l'hygiène des mains selon la situation",
      "Ranger le chariot sans vérifier"
    ],
    answer: 1,
    explanation:
      "L'hygiène des mains est une mesure centrale de prévention des infections associées aux soins.",
    reference: "Hygiène des mains - prévention du risque infectieux",
    tags: ["hygiène", "infection", "sécurité"]
  }
];

export function selectFallbackQuiz(focus: string, count: number) {
  const normalizedFocus = focus.toLowerCase();
  const preferred = safeQuizQuestionBank.filter((question) =>
    question.tags.some((tag) => normalizedFocus.includes(tag)) ||
    normalizedFocus.includes(question.theme.toLowerCase())
  );

  const pool = [...preferred, ...safeQuizQuestionBank.filter((question) => !preferred.includes(question))];
  return pool.slice(0, count);
}
