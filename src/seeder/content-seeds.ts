/**
 * Datos de seeds fundamentales para ContentItem.
 * Usados tanto por `prisma/seed.ts` (CLI) como por `SeederService` (bootstrap en producción).
 * Cada entrada usa un ID fijo con prefijo "seed-" para que los upserts sean idempotentes.
 */
export const CONTENT_SEEDS = [
  {
    id: 'seed-gad2',
    type: 'test',
    title: 'GAD-2',
    description:
      'Escala ultra breve (2 ítems) autoadministrada para tamizaje de ansiedad generalizada en las últimas 2 semanas.',
    topic: 'ansiedad',
    body: {
      id: 'gad2',
      slug: 'gad-2',
      language: 'es-MX',
      timeframe: { label: 'Últimas 2 semanas', days: 14 },
      instructions:
        'Durante las últimas 2 semanas, ¿con qué frecuencia te han molestado los siguientes problemas?',
      responseType: 'single_choice_per_question',
      options: [
        { value: 0, label: 'Nada en absoluto' },
        { value: 1, label: 'Varios días' },
        { value: 2, label: 'Más de la mitad de los días' },
        { value: 3, label: 'Casi todos los días' },
      ],
      questions: [
        {
          id: 'gad2_q1',
          order: 1,
          prompt: 'Sentirte nervioso(a), ansioso(a) o al límite',
          required: true,
        },
        {
          id: 'gad2_q2',
          order: 2,
          prompt: 'No poder parar o controlar tu preocupación',
          required: true,
        },
      ],
      scoring: {
        method: 'sum',
        minScore: 0,
        maxScore: 6,
        cutoff: { positiveScreenGTE: 3 },
      },
      interpretation: [
        {
          range: { min: 0, max: 2 },
          label: 'Tamizaje negativo / síntomas bajos',
          message:
            'Tu puntuación sugiere síntomas bajos de ansiedad generalizada en este tamizaje. Si aun así sientes malestar, puedes explorar herramientas de respiración, relajación y manejo de preocupaciones.',
        },
        {
          range: { min: 3, max: 6 },
          label: 'Tamizaje positivo',
          message:
            'Tu puntuación sugiere ansiedad clínicamente relevante en este tamizaje. Se recomienda una evaluación más completa (por ejemplo, GAD-7) y considerar apoyo profesional si interfiere con tu vida diaria.',
        },
      ],
      followUps: [
        {
          when: { scoreGTE: 3 },
          recommend: [
            {
              type: 'test',
              id: 'gad7',
              reason:
                'Confirmar y estimar severidad con una escala más completa.',
            },
          ],
        },
      ],
      clinicalDisclaimer:
        'Este test es solo un tamizaje y no equivale a un diagnóstico. Si tus síntomas son intensos, empeoran, o afectan tu seguridad, busca ayuda profesional o servicios de emergencia.',
    },
    sources: [
      'https://pubmed.ncbi.nlm.nih.gov/17339617/',
      'https://pubmed.ncbi.nlm.nih.gov/16717171/',
      'https://www.hiv.uw.edu/page/mental-health-screening/gad-2',
      'https://www.cochrane.org/evidence/CD015455_how-accurate-are-gad-7-and-gad-2-questionnaires-detecting-anxiety-disorders',
    ],
    isPremium: false,
    isPublished: true,
  },
  {
    id: 'seed-gad7',
    type: 'test',
    title: 'GAD-7',
    description:
      'Cuestionario autoadministrado de 7 ítems para tamizaje y estimación de severidad de síntomas de ansiedad generalizada durante las últimas 2 semanas.',
    topic: 'ansiedad',
    body: {
      id: 'gad7',
      slug: 'gad-7',
      language: 'es-MX',
      timeframe: { label: 'Últimas 2 semanas', days: 14 },
      instructions:
        'Durante las últimas 2 semanas, ¿con qué frecuencia te han molestado los siguientes problemas?',
      responseType: 'single_choice_per_question',
      options: [
        { value: 0, label: 'Nada en absoluto' },
        { value: 1, label: 'Varios días' },
        { value: 2, label: 'Más de la mitad de los días' },
        { value: 3, label: 'Casi todos los días' },
      ],
      questions: [
        {
          id: 'gad7_q1',
          order: 1,
          prompt:
            'Sentirte nervioso(a), intranquilo(a) o con los nervios de punta',
          required: true,
        },
        {
          id: 'gad7_q2',
          order: 2,
          prompt:
            'No poder dejar de preocuparte o no poder controlar la preocupación',
          required: true,
        },
        {
          id: 'gad7_q3',
          order: 3,
          prompt: 'Preocuparte demasiado por diferentes cosas',
          required: true,
        },
        {
          id: 'gad7_q4',
          order: 4,
          prompt: 'Dificultad para relajarte',
          required: true,
        },
        {
          id: 'gad7_q5',
          order: 5,
          prompt:
            'Estar tan inquieto(a) que es difícil permanecer sentado(a) tranquilamente',
          required: true,
        },
        {
          id: 'gad7_q6',
          order: 6,
          prompt: 'Molestarte o ponerte irritable fácilmente',
          required: true,
        },
        {
          id: 'gad7_q7',
          order: 7,
          prompt: 'Sentir miedo como si algo terrible pudiera pasar',
          required: true,
        },
      ],
      additionalItem: {
        id: 'gad7_impairment',
        type: 'functional_impact',
        title: 'Impacto en el funcionamiento',
        prompt:
          'Si marcaste algún problema, ¿qué tan difícil te ha hecho esto hacer tu trabajo, atender tu casa o llevarte bien con otras personas?',
        required: false,
        isScored: false,
        options: [
          { value: 0, label: 'Nada difícil' },
          { value: 1, label: 'Algo difícil' },
          { value: 2, label: 'Muy difícil' },
          { value: 3, label: 'Extremadamente difícil' },
        ],
      },
      scoring: {
        method: 'sum',
        minScore: 0,
        maxScore: 21,
        severityCutpoints: [
          { min: 0, max: 4, label: 'Mínima' },
          { min: 5, max: 9, label: 'Leve' },
          { min: 10, max: 14, label: 'Moderada' },
          { min: 15, max: 21, label: 'Severa' },
        ],
        screeningRecommendation: {
          furtherEvaluationGTE: 10,
          note: 'Cuando se usa como tamizaje, se recomienda evaluación adicional si la puntuación es 10 o mayor.',
        },
      },
      interpretation: [
        {
          range: { min: 0, max: 4 },
          label: 'Síntomas mínimos',
          message:
            'Tu puntuación sugiere síntomas mínimos de ansiedad en las últimas 2 semanas. Si aun así hay malestar, puedes explorar herramientas preventivas (higiene del sueño, respiración, manejo de preocupaciones).',
        },
        {
          range: { min: 5, max: 9 },
          label: 'Ansiedad leve',
          message:
            'Tu puntuación sugiere ansiedad leve. Suele ayudar iniciar herramientas básicas (respiración diafragmática, relajación muscular, registro de preocupaciones, límites de cafeína) y dar seguimiento.',
        },
        {
          range: { min: 10, max: 14 },
          label: 'Ansiedad moderada',
          message:
            'Tu puntuación sugiere ansiedad moderada. Considera un plan estructurado (p. ej., técnicas tipo CBT: reestructuración de pensamientos, exposición gradual, manejo de evitación) y, si interfiere con tu vida, apoyo profesional.',
        },
        {
          range: { min: 15, max: 21 },
          label: 'Ansiedad severa',
          message:
            'Tu puntuación sugiere ansiedad severa. Se recomienda apoyo profesional. Si sientes que estás en riesgo o no estás seguro(a), busca ayuda inmediata (en México, 911 o servicios de urgencias).',
        },
      ],
      followUps: [
        {
          when: { scoreBetween: [5, 9] },
          recommend: [
            {
              type: 'route',
              id: 'ansiedad-basica',
              reason: 'Herramientas iniciales para ansiedad leve.',
            },
          ],
        },
        {
          when: { scoreGTE: 10 },
          recommend: [
            {
              type: 'route',
              id: 'ansiedad-cbt',
              reason:
                'Plan estructurado con técnicas basadas en evidencia para ansiedad moderada/severa.',
            },
            {
              type: 'article',
              id: 'cuando-buscar-ayuda-profesional-ansiedad',
              reason:
                'Orientación para escalar a evaluación clínica si hay interferencia funcional.',
            },
          ],
        },
      ],
      clinicalDisclaimer:
        'Este cuestionario es una herramienta de tamizaje y seguimiento, no un diagnóstico. Si tus síntomas son intensos, empeoran o afectan tu seguridad, busca ayuda profesional o servicios de emergencia.',
    },
    sources: [
      'https://europepmc.org/abstract/MED/16717171',
      'https://integrationacademy.ahrq.gov/sites/default/files/2020-07/GAD-7.pdf',
      'https://www.dartmouth-hitchcock.org/sites/default/files/2021-02/gad-7-anxiety-scale.pdf',
      'https://didihirsch.org/wp-content/uploads/GAD-7-Generalized-Anxiety-Disorder-Spanish.pdf',
      'https://cks.nice.org.uk/topics/generalized-anxiety-disorder/diagnosis/generalized-anxiety-disorder-questionnaire/',
    ],
    isPremium: false,
    isPublished: true,
  },
  {
    id: 'seed-phq2',
    type: 'test',
    title: 'PHQ-2',
    description:
      'Cuestionario breve (2 ítems) autoadministrado para tamizaje de depresión (ánimo bajo y anhedonia) durante las últimas 2 semanas. Si el tamizaje es positivo, se recomienda aplicar PHQ-9 para evaluación más completa.',
    topic: 'ánimo bajo',
    body: {
      id: 'phq2',
      slug: 'phq-2',
      language: 'es-MX',
      timeframe: { label: 'Últimas 2 semanas', days: 14 },
      instructions:
        'Durante las últimas 2 semanas, ¿qué tan seguido ha tenido molestias debido a los siguientes problemas?',
      responseType: 'single_choice_per_question',
      options: [
        { value: 0, label: 'Ningún día' },
        { value: 1, label: 'Varios días' },
        { value: 2, label: 'Más de la mitad de los días' },
        { value: 3, label: 'Casi todos los días' },
      ],
      questions: [
        {
          id: 'phq2_q1',
          order: 1,
          prompt: 'Poco interés o placer en hacer cosas',
          required: true,
        },
        {
          id: 'phq2_q2',
          order: 2,
          prompt: 'Sentirse decaído(a), deprimido(a) o sin esperanzas',
          required: true,
        },
      ],
      scoring: {
        method: 'sum',
        minScore: 0,
        maxScore: 6,
        cutoff: { positiveScreenGTE: 3 },
      },
      interpretation: [
        {
          range: { min: 0, max: 2 },
          label: 'Tamizaje negativo / síntomas bajos',
          message:
            'Tu puntuación sugiere síntomas bajos en este tamizaje. Si aun así hay malestar, puedes explorar herramientas de activación conductual (retomar actividades), autocuidado y apoyo social.',
        },
        {
          range: { min: 3, max: 6 },
          label: 'Tamizaje positivo',
          message:
            'Tu puntuación sugiere posible depresión clínicamente relevante en este tamizaje. Se recomienda completar PHQ-9 y considerar apoyo profesional, especialmente si hay afectación en tu vida diaria.',
        },
      ],
      followUps: [
        {
          when: { scoreGTE: 3 },
          recommend: [
            {
              type: 'test',
              id: 'phq9',
              reason:
                'Evaluación más completa de síntomas depresivos y severidad.',
            },
          ],
        },
      ],
      safetyNote:
        'Si en algún momento presentas pensamientos de hacerte daño o sientes que no estás a salvo, busca ayuda inmediata. En México: 911 o acude a urgencias.',
      clinicalDisclaimer:
        'Este cuestionario es una herramienta de tamizaje y no equivale a un diagnóstico. Los resultados deben interpretarse con contexto clínico.',
    },
    sources: [
      'https://integrationacademy.ahrq.gov/sites/default/files/2020-07/PHQ-2.pdf',
      'https://europepmc.org/article/MED/14583691',
      'https://med.stanford.edu/content/dam/sm/ppc/documents/Mental_Health/PHQ-2_Spanish.pdf',
      'https://cde.nlm.nih.gov/formView?tinyId=XJzVz1TZDe',
    ],
    isPremium: false,
    isPublished: true,
  },
  {
    id: 'seed-phq9',
    type: 'test',
    title: 'PHQ-9',
    description:
      'Cuestionario autoadministrado de 9 ítems para tamizaje, seguimiento y estimación de severidad de síntomas depresivos durante las últimas 2 semanas. Incluye un ítem de ideación suicida que requiere manejo cuidadoso.',
    topic: 'ánimo bajo',
    body: {
      id: 'phq9',
      slug: 'phq-9',
      language: 'es-MX',
      timeframe: { label: 'Últimas 2 semanas', days: 14 },
      instructions:
        'Durante las últimas 2 semanas, ¿qué tan seguido ha tenido molestias debido a los siguientes problemas?',
      responseType: 'single_choice_per_question',
      options: [
        { value: 0, label: 'Ningún día' },
        { value: 1, label: 'Varios días' },
        { value: 2, label: 'Más de la mitad de los días' },
        { value: 3, label: 'Casi todos los días' },
      ],
      questions: [
        {
          id: 'phq9_q1',
          order: 1,
          prompt: 'Poco interés o placer en hacer cosas',
          required: true,
        },
        {
          id: 'phq9_q2',
          order: 2,
          prompt: 'Sentirse decaído(a), deprimido(a) o sin esperanzas',
          required: true,
        },
        {
          id: 'phq9_q3',
          order: 3,
          prompt:
            'Dificultad para dormir o permanecer dormido(a), o dormir demasiado',
          required: true,
        },
        {
          id: 'phq9_q4',
          order: 4,
          prompt: 'Sentirse cansado(a) o con poca energía',
          required: true,
        },
        {
          id: 'phq9_q5',
          order: 5,
          prompt: 'Poco apetito o comer en exceso',
          required: true,
        },
        {
          id: 'phq9_q6',
          order: 6,
          prompt:
            'Sentirse mal consigo mismo(a) — o que es un fracaso o que ha quedado mal con usted mismo(a) o con su familia',
          required: true,
        },
        {
          id: 'phq9_q7',
          order: 7,
          prompt:
            'Dificultad para concentrarse en cosas, como leer el periódico o ver televisión',
          required: true,
        },
        {
          id: 'phq9_q8',
          order: 8,
          prompt:
            'Moverse o hablar tan lento que otras personas lo han notado; o lo contrario: estar tan inquieto(a) o agitado(a) que se ha estado moviendo mucho más de lo habitual',
          required: true,
        },
        {
          id: 'phq9_q9',
          order: 9,
          prompt:
            'Pensamientos de que estaría mejor muerto(a) o de hacerse daño de alguna manera',
          required: true,
          riskFlag: {
            type: 'self_harm_ideation',
            severity: 'high',
            triggerIfAnswerValueGTE: 1,
            message:
              'Detectamos una respuesta que sugiere posible riesgo. Si estás en peligro inmediato o sientes que no estás a salvo, busca ayuda ahora: en México marca 911 o acude a urgencias. Si puedes, contacta a alguien de confianza y busca apoyo profesional.',
          },
        },
      ],
      additionalItem: {
        id: 'phq9_impairment',
        type: 'functional_impact',
        title: 'Impacto en el funcionamiento',
        prompt:
          'Si marcaste algún problema, ¿qué tan difícil te ha hecho esto hacer tu trabajo, atender tu casa o llevarte bien con otras personas?',
        required: false,
        isScored: false,
        options: [
          { value: 0, label: 'Nada difícil' },
          { value: 1, label: 'Algo difícil' },
          { value: 2, label: 'Muy difícil' },
          { value: 3, label: 'Extremadamente difícil' },
        ],
      },
      scoring: {
        method: 'sum',
        minScore: 0,
        maxScore: 27,
        severityCutpoints: [
          { min: 0, max: 4, label: 'Mínima' },
          { min: 5, max: 9, label: 'Leve' },
          { min: 10, max: 14, label: 'Moderada' },
          { min: 15, max: 19, label: 'Moderadamente severa' },
          { min: 20, max: 27, label: 'Severa' },
        ],
        screeningRecommendation: {
          furtherEvaluationGTE: 10,
          note: 'Puntuaciones de 10 o más suelen considerarse clínicamente relevantes y ameritan evaluación adicional, especialmente si hay afectación funcional.',
        },
      },
      interpretation: [
        {
          range: { min: 0, max: 4 },
          label: 'Síntomas mínimos',
          message:
            'Tu puntuación sugiere síntomas mínimos. Si hay malestar, enfócate en autocuidado y rutinas básicas (sueño, alimentación, movimiento) y monitorea cambios.',
        },
        {
          range: { min: 5, max: 9 },
          label: 'Depresión leve',
          message:
            'Tu puntuación sugiere depresión leve. Puede ayudar un plan de activación conductual (retomar actividades gradualmente) y estrategias de manejo de pensamientos, con seguimiento.',
        },
        {
          range: { min: 10, max: 14 },
          label: 'Depresión moderada',
          message:
            'Tu puntuación sugiere depresión moderada. Considera un programa estructurado (p. ej., técnicas tipo CBT/activación conductual) y apoyo profesional si hay interferencia significativa.',
        },
        {
          range: { min: 15, max: 19 },
          label: 'Depresión moderadamente severa',
          message:
            'Tu puntuación sugiere depresión moderadamente severa. Se recomienda apoyo profesional. Si hay deterioro funcional marcado o síntomas persistentes, busca evaluación clínica.',
        },
        {
          range: { min: 20, max: 27 },
          label: 'Depresión severa',
          message:
            'Tu puntuación sugiere depresión severa. Se recomienda atención profesional lo antes posible. Si hay riesgo inmediato, busca ayuda de emergencia.',
        },
      ],
      followUps: [
        {
          when: { scoreBetween: [5, 9] },
          recommend: [
            {
              type: 'route',
              id: 'animo-bajo-activacion-conductual',
              reason:
                'Plan inicial de activación conductual para síntomas leves.',
            },
          ],
        },
        {
          when: { scoreGTE: 10 },
          recommend: [
            {
              type: 'route',
              id: 'depresion-programa-estructurado',
              reason:
                'Programa estructurado con técnicas basadas en evidencia.',
            },
            {
              type: 'article',
              id: 'cuando-buscar-ayuda-profesional-depresion',
              reason:
                'Guía para escalar a evaluación clínica y señales de alarma.',
            },
          ],
        },
        {
          when: { itemIdEquals: 'phq9_q9', answerValueGTE: 1 },
          recommend: [
            {
              type: 'article',
              id: 'plan-de-seguridad',
              reason:
                'Pasos concretos para aumentar seguridad y buscar apoyo.',
            },
          ],
        },
      ],
      safetyNote:
        "Si respondiste algo distinto de 'Ningún día' en la pregunta 9, toma en serio esa señal: busca apoyo hoy mismo. En México: 911 o urgencias. Si puedes, no te quedes solo(a) y contacta a alguien de confianza.",
      clinicalDisclaimer:
        'Este cuestionario es una herramienta de tamizaje y seguimiento; no es un diagnóstico. Un profesional de salud debe interpretar los resultados en contexto.',
    },
    sources: [
      'https://pubmed.ncbi.nlm.nih.gov/11556941/',
      'https://cde.nlm.nih.gov/formView?tinyId=yRkVYb2n0',
      'https://integrationacademy.ahrq.gov/sites/default/files/2020-07/PHQ-9.pdf',
      'https://med.stanford.edu/content/dam/sm/ppc/documents/Mental_Health/PHQ-9_Spanish.pdf',
      'https://www.apa.org/depression-guideline/patient-health-questionnaire',
    ],
    isPremium: false,
    isPublished: true,
  },
];
