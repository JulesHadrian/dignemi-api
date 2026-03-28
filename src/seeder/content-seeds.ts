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
  {
    id: 'seed-respiracion-diafragmatica',
    type: 'exercise',
    title: 'Respiración diafragmática',
    description:
      'Ejercicio guiado de respiración lenta y abdominal para reducir activación física, tensión y sensación de ansiedad.',
    topic: 'ansiedad',
    body: {
      id: 'respiracion-diafragmatica',
      slug: 'respiracion-diafragmatica',
      language: 'es-MX',
      category: 'breathing',
      subCategory: 'regulacion-fisiologica',
      difficulty: 'beginner',
      estimatedDurationMinutes: 5,
      durationRangeMinutes: {
        min: 3,
        max: 10,
      },
      recommendedFor: {
        testId: 'gad2',
        testTitle: 'GAD-2',
        scoreRanges: [
          {
            range: { min: 0, max: 2 },
            label: 'Tamizaje negativo / síntomas bajos',
            priority: 1,
            reason:
              'Ayuda como herramienta preventiva y de autorregulación ligera cuando hay tensión, inquietud o estrés puntual.',
          },
          {
            range: { min: 3, max: 6 },
            label: 'Tamizaje positivo',
            priority: 1,
            reason:
              'Ayuda a disminuir activación física y recuperar sensación de control mientras el usuario completa una evaluación más amplia o inicia otras herramientas.',
          },
        ],
      },
      goal: 'Reducir la activación del cuerpo, hacer más lenta la respiración y llevar la atención al abdomen para favorecer calma física y mental.',
      whenToUse: [
        'Cuando notes respiración rápida o superficial',
        'Cuando sientas nervios, tensión o inquietud',
        'Antes de dormir si te cuesta relajarte',
        'Antes de una situación que te genera ansiedad',
        'Como práctica diaria para prevenir escalamiento',
      ],
      avoidOrModifyIf: [
        'Si sientes mareo, reduce la velocidad y vuelve a respirar normal por unos segundos',
        'Si tienes congestión nasal fuerte, respira con suavidad por la boca durante la exhalación',
        'Si retener aire te incomoda, no hagas pausas; solo inhala y exhala',
        'Si tienes una condición respiratoria o cardiovascular y este ejercicio te incomoda, úsalo con un ritmo más natural',
      ],
      benefits: [
        'Disminuye la respiración superficial del pecho',
        'Ayuda a bajar la tensión corporal',
        'Favorece sensación de control',
        'Puede reducir la intensidad de la ansiedad en pocos minutos',
        'Sirve como base para otros ejercicios de relajación',
      ],
      preparation: {
        environment: [
          'Busca un lugar tranquilo o con la menor cantidad posible de distractores',
          'Si no puedes estar en silencio, también puedes hacerlo sentado(a) en cualquier lugar seguro',
        ],
        postureOptions: [
          {
            id: 'sentado',
            label: 'Sentado(a)',
            instruction:
              'Siéntate con la espalda cómoda pero relativamente recta. Apoya ambos pies en el suelo.',
          },
          {
            id: 'acostado',
            label: 'Acostado(a)',
            instruction:
              'Acuéstate boca arriba con las rodillas ligeramente flexionadas si eso te resulta más cómodo.',
          },
        ],
        handPlacement:
          'Coloca una mano sobre el pecho y otra sobre el abdomen para notar que el abdomen se mueve más que el pecho.',
        beforeStartMessage:
          'No necesitas hacerlo perfecto. Solo busca respirar más lento y llevar el aire hacia el abdomen.',
      },
      defaultProtocol: {
        inhaleSeconds: 4,
        holdSeconds: 0,
        exhaleSeconds: 6,
        cycles: 10,
        breathingRoute: {
          inhale: 'nariz',
          exhale: 'boca o nariz',
        },
      },
      alternativeProtocols: [
        {
          id: 'suave',
          label: 'Ritmo suave',
          inhaleSeconds: 3,
          holdSeconds: 0,
          exhaleSeconds: 4,
          cycles: 8,
          useWhen:
            'Cuando el usuario está muy activado, se marea o le cuesta seguir un ritmo largo.',
        },
        {
          id: 'profundo',
          label: 'Ritmo profundo',
          inhaleSeconds: 4,
          holdSeconds: 0,
          exhaleSeconds: 6,
          cycles: 12,
          useWhen:
            'Cuando el usuario ya se siente cómodo con el ejercicio y quiere una sesión un poco más larga.',
        },
      ],
      steps: [
        {
          id: 'step_1',
          order: 1,
          title: 'Prepárate',
          type: 'setup',
          durationSeconds: 20,
          instruction:
            'Siéntate o recuéstate en una posición cómoda. Relaja hombros, mandíbula y manos.',
          uiHint:
            'Mostrar ilustración o animación de postura estable y cómoda.',
        },
        {
          id: 'step_2',
          order: 2,
          title: 'Coloca tus manos',
          type: 'setup',
          durationSeconds: 20,
          instruction:
            'Pon una mano sobre tu pecho y otra sobre tu abdomen. La idea es que al inhalar se eleve más la mano del abdomen que la del pecho.',
          uiHint:
            'Mostrar foco visual en abdomen y pecho para reforzar el objetivo.',
        },
        {
          id: 'step_3',
          order: 3,
          title: 'Exhala primero',
          type: 'transition',
          durationSeconds: 6,
          instruction:
            'Suelta el aire lentamente para vaciar un poco los pulmones y comenzar desde un punto más relajado.',
          uiHint: 'Animación de exhalación lenta.',
        },
        {
          id: 'step_4',
          order: 4,
          title: 'Inhala hacia el abdomen',
          type: 'breath_in',
          durationSeconds: 4,
          instruction:
            'Inhala por la nariz contando 1, 2, 3, 4. Lleva el aire hacia el abdomen. Intenta que el pecho se mueva lo menos posible.',
          uiHint: 'Animación expandiéndose durante 4 segundos.',
        },
        {
          id: 'step_5',
          order: 5,
          title: 'Exhala más lento',
          type: 'breath_out',
          durationSeconds: 6,
          instruction:
            'Exhala lentamente por la boca o por la nariz contando 1, 2, 3, 4, 5, 6. Deja que el abdomen baje poco a poco.',
          uiHint: 'Animación contrayéndose durante 6 segundos.',
        },
        {
          id: 'step_6',
          order: 6,
          title: 'Repite el ciclo',
          type: 'repeat',
          repeatFromStepId: 'step_4',
          repeatCount: 10,
          instruction:
            'Repite el ciclo de inhalar 4 segundos y exhalar 6 segundos. Mantén el ritmo cómodo, sin forzar.',
          uiHint:
            'Mostrar contador de ciclos completados y botón de pausar.',
        },
        {
          id: 'step_7',
          order: 7,
          title: 'Cierra el ejercicio',
          type: 'closing',
          durationSeconds: 20,
          instruction:
            'Al terminar, vuelve a respirar normal. Observa si tu cuerpo se siente un poco más suelto, más lento o más estable.',
          uiHint: 'Pantalla de cierre con transición suave.',
        },
      ],
      guidedExperience: {
        introText:
          'Vamos a respirar de forma lenta y profunda. Lleva el aire al abdomen y exhala un poco más largo de lo que inhalas.',
        cyclePrompts: {
          inhale: 'Inhala por la nariz y lleva el aire al abdomen',
          exhale: 'Exhala lento y suelta la tensión',
        },
        midExercisePrompts: [
          'No busques perfección, solo un ritmo más calmado',
          'Si te distraes, vuelve al movimiento del abdomen',
          'Afloja hombros y mandíbula',
        ],
        completionText:
          'Bien hecho. Aunque el cambio sea pequeño, practicar esto con frecuencia ayuda a que tu cuerpo aprenda a regularse mejor.',
      },
      scoreSpecificMessages: [
        {
          range: { min: 0, max: 2 },
          message:
            'Este ejercicio puede ayudarte a mantenerte en equilibrio y a cortar tensión antes de que aumente.',
        },
        {
          range: { min: 3, max: 6 },
          message:
            'Este ejercicio puede servirte como primera herramienta para bajar activación física mientras avanzas con otras recomendaciones para ansiedad.',
        },
      ],
      progressTracking: {
        completionDefinition:
          'Completar al menos 6 ciclos de respiración guiada',
        track: [
          'cyclesCompleted',
          'protocolUsed',
          'durationSeconds',
          'completed',
          'selfReportedCalmBefore',
          'selfReportedCalmAfter',
        ],
        optionalCheckIn: {
          beforePrompt:
            'Antes de empezar, ¿qué tan activado(a) te sientes?',
          afterPrompt:
            'Ahora, ¿qué tan activado(a) te sientes?',
          scaleMin: 0,
          scaleMax: 10,
          scaleLabels: {
            min: 'Muy en calma',
            max: 'Muy activado(a)',
          },
        },
      },
      completionCriteria: {
        minimumCycles: 6,
        recommendedCycles: 10,
      },
      nextStepSuggestions: [
        {
          when: { scoreBetween: [0, 2] },
          recommend: [
            {
              type: 'exercise',
              id: 'mindfulness-respiratorio-breve',
              reason:
                'Complementa esta práctica con atención al presente.',
            },
          ],
        },
        {
          when: { scoreBetween: [3, 6] },
          recommend: [
            {
              type: 'exercise',
              id: 'relajacion-muscular-progresiva',
              reason:
                'Complementa la respiración con liberación de tensión corporal.',
            },
            {
              type: 'test',
              id: 'gad7',
              reason:
                'Ayuda a estimar mejor la severidad de los síntomas.',
            },
          ],
        },
      ],
      clinicalDisclaimer:
        'Este ejercicio es una herramienta de apoyo y no sustituye atención profesional. Si tu ansiedad se intensifica, interfiere mucho con tu vida diaria o sientes que estás en riesgo, busca ayuda profesional o servicios de emergencia.',
    },
    sources: [],
    isPremium: false,
    isPublished: true,
  },
  {
    id: 'seed-mindfulness-respiratorio-breve',
    type: 'exercise',
    title: 'Mindfulness respiratorio breve',
    description:
      'Ejercicio corto de atención plena centrado en la respiración para ayudar al usuario a volver al presente, reducir distracción mental y regular ansiedad leve.',
    topic: 'ansiedad',
    body: {
      id: 'mindfulness-respiratorio-breve',
      slug: 'mindfulness-respiratorio-breve',
      language: 'es-MX',
      category: 'mindfulness',
      subCategory: 'atencion-al-presente',
      difficulty: 'beginner',
      estimatedDurationMinutes: 3,
      durationRangeMinutes: {
        min: 2,
        max: 5,
      },
      recommendedFor: {
        testId: 'gad2',
        testTitle: 'GAD-2',
        scoreRanges: [
          {
            range: { min: 0, max: 2 },
            label: 'Tamizaje negativo / síntomas bajos',
            priority: 2,
            reason:
              'Es útil como práctica preventiva y de regulación suave cuando el usuario presenta malestar leve, estrés puntual o mente acelerada sin alta activación.',
          },
        ],
      },
      goal: 'Ayudar al usuario a salir del piloto automático, observar su respiración sin juzgarse y recuperar presencia mental en pocos minutos.',
      therapeuticIntent: [
        'Anclar la atención al momento presente',
        'Reducir ruido mental y rumiación ligera',
        'Mejorar conciencia corporal y respiratoria',
        'Favorecer autorregulación emocional temprana',
      ],
      whenToUse: [
        'Cuando la mente está acelerada pero el usuario aún puede concentrarse',
        'Al iniciar el día para sentirse más centrado(a)',
        'Después de una situación estresante leve',
        'Cuando el usuario detecta preocupación repetitiva leve',
        'Antes de dormir o antes de una actividad importante',
      ],
      avoidOrModifyIf: [
        'Si cerrar los ojos aumenta incomodidad, el ejercicio debe hacerse con ojos abiertos y mirada fija en un punto',
        'Si el usuario se siente muy activado(a), primero conviene usar respiración diafragmática antes de este ejercicio',
        'Si el usuario se frustra al distraerse, recordarle que notar la distracción también cuenta como parte del ejercicio',
      ],
      benefits: [
        'Ayuda a pausar la mente por unos minutos',
        'Entrena atención consciente sin exigir perfección',
        'Puede disminuir tensión mental leve',
        'Es rápido y fácil de repetir varias veces al día',
        'Sirve como puerta de entrada a otras prácticas de mindfulness',
      ],
      preparation: {
        environment: [
          'Busca un lugar cómodo donde puedas permanecer quieto(a) unos minutos',
          'No es necesario estar en silencio absoluto; basta con que sea un espacio razonablemente seguro y estable',
        ],
        postureOptions: [
          {
            id: 'sentado',
            label: 'Sentado(a)',
            instruction:
              'Siéntate con espalda cómoda y relativamente recta. Descansa las manos sobre piernas o regazo.',
          },
          {
            id: 'de-pie',
            label: 'De pie',
            instruction:
              'Colócate con ambos pies apoyados firmemente en el suelo y hombros relajados.',
          },
        ],
        eyesOptions: [
          {
            id: 'closed',
            label: 'Ojos cerrados',
            instruction:
              'Cierra los ojos si eso te ayuda a concentrarte y te sientes cómodo(a).',
          },
          {
            id: 'soft-gaze',
            label: 'Mirada suave',
            instruction:
              'Mantén la mirada baja o fija en un punto frente a ti si prefieres no cerrar los ojos.',
          },
        ],
        beforeStartMessage:
          'No tienes que dejar la mente en blanco. Solo vas a notar la respiración y volver a ella cada vez que te distraigas.',
      },
      defaultProtocol: {
        totalDurationSeconds: 180,
        mode: 'timed_observation',
        attentionAnchor: 'respiracion',
        breathingInstruction: 'natural',
      },
      alternativeProtocols: [
        {
          id: 'micro',
          label: 'Versión rápida',
          totalDurationSeconds: 120,
          useWhen:
            'Cuando el usuario tiene poco tiempo o apenas está comenzando.',
        },
        {
          id: 'extendida',
          label: 'Versión extendida',
          totalDurationSeconds: 300,
          useWhen:
            'Cuando el usuario ya conoce el ejercicio y quiere una práctica más larga.',
        },
      ],
      steps: [
        {
          id: 'step_1',
          order: 1,
          title: 'Haz una pausa',
          type: 'setup',
          durationSeconds: 15,
          instruction:
            'Detén por un momento lo que estés haciendo. Busca una postura cómoda y estable.',
          uiHint:
            "Pantalla de inicio con mensaje calmado y botón 'Comenzar'.",
        },
        {
          id: 'step_2',
          order: 2,
          title: 'Lleva atención al cuerpo',
          type: 'body_awareness',
          durationSeconds: 20,
          instruction:
            'Nota el contacto de tu cuerpo con la silla, el suelo o el lugar donde estás. Suelta un poco hombros, mandíbula y manos.',
          uiHint:
            'Mostrar ilustración de cuerpo relajando hombros y mandíbula.',
        },
        {
          id: 'step_3',
          order: 3,
          title: 'Observa tu respiración',
          type: 'observe_breath',
          durationSeconds: 30,
          instruction:
            'Empieza a notar tu respiración tal como está. No intentes cambiarla. Solo observa si entra y sale por la nariz, el pecho o el abdomen.',
          uiHint:
            'Animación suave de respiración natural, sin conteo forzado.',
        },
        {
          id: 'step_4',
          order: 4,
          title: 'Elige un punto de enfoque',
          type: 'attention_anchor',
          durationSeconds: 15,
          instruction:
            'Elige un solo punto para seguir la respiración: la nariz, el pecho o el abdomen. Mantén tu atención ahí.',
          uiHint:
            'Permitir seleccionar visualmente nariz, pecho o abdomen.',
        },
        {
          id: 'step_5',
          order: 5,
          title: 'Sigue 10 respiraciones',
          type: 'guided_observation',
          durationSeconds: 60,
          instruction:
            'Sigue cada inhalación y cada exhalación. Puedes contar mentalmente 1 al inhalar y 1 al exhalar, luego 2 y 2, hasta llegar a 10.',
          uiHint:
            'Mostrar contador opcional de respiraciones del 1 al 10.',
        },
        {
          id: 'step_6',
          order: 6,
          title: 'Si te distraes, vuelve',
          type: 'refocus',
          durationSeconds: 30,
          instruction:
            'Si aparece un pensamiento, ruido o preocupación, obsérvalo sin pelearte con él y vuelve con suavidad a la respiración.',
          uiHint: "Mensaje breve: 'Notar y volver también cuenta'.",
        },
        {
          id: 'step_7',
          order: 7,
          title: 'Respira y cierra',
          type: 'closing',
          durationSeconds: 10,
          instruction:
            'Haz una última inhalación lenta y una exhalación larga. Nota cómo te sientes ahora antes de terminar.',
          uiHint:
            'Pantalla final con transición suave y check-in opcional.',
        },
      ],
      guidedExperience: {
        introText:
          'Durante unos minutos solo vamos a notar la respiración. No necesitas cambiar nada, solo observar y regresar cada vez que tu mente se vaya.',
        stepPrompts: [
          'Haz una pausa',
          'Siente el contacto de tu cuerpo con el lugar donde estás',
          'Observa tu respiración tal como es',
          'Elige un punto de enfoque',
          'Sigue la respiración una a una',
          'Si te distraes, vuelve con amabilidad',
        ],
        midExercisePrompts: [
          'No necesitas hacerlo perfecto',
          'Tu mente puede distraerse; eso es normal',
          'Cada vez que vuelves, estás practicando',
          'Solo observa y regresa',
        ],
        completionText:
          'Bien hecho. Aunque hayan aparecido distracciones, regresar a tu respiración ya fue parte del ejercicio.',
      },
      interactionModel: {
        primaryAction: 'start_exercise',
        secondaryActions: [
          'pause_exercise',
          'restart_exercise',
          'skip_step',
          'switch_to_short_version',
        ],
        userInputs: [
          {
            id: 'posture_choice',
            type: 'single_choice',
            label: '¿Cómo quieres hacerlo?',
            options: ['Sentado(a)', 'De pie'],
          },
          {
            id: 'eyes_choice',
            type: 'single_choice',
            label: '¿Cómo prefieres enfocar tu atención?',
            options: ['Ojos cerrados', 'Mirada suave'],
          },
          {
            id: 'anchor_choice',
            type: 'single_choice',
            label: 'Elige un punto para seguir tu respiración',
            options: ['Nariz', 'Pecho', 'Abdomen'],
          },
        ],
      },
      scoreSpecificMessages: [
        {
          range: { min: 0, max: 2 },
          message:
            'Este ejercicio está pensado para ayudarte a mantener equilibrio emocional, bajar ruido mental y prevenir que la preocupación aumente.',
        },
      ],
      progressTracking: {
        completionDefinition:
          'Completar al menos 2 minutos de observación consciente de la respiración',
        track: [
          'durationSeconds',
          'completed',
          'protocolUsed',
          'anchorChoice',
          'selfReportedPresenceBefore',
          'selfReportedPresenceAfter',
        ],
        optionalCheckIn: {
          beforePrompt:
            'Antes de empezar, ¿qué tan acelerada sientes tu mente?',
          afterPrompt:
            'Ahora, ¿qué tan acelerada sientes tu mente?',
          scaleMin: 0,
          scaleMax: 10,
          scaleLabels: {
            min: 'Muy tranquila',
            max: 'Muy acelerada',
          },
        },
      },
      completionCriteria: {
        minimumDurationSeconds: 120,
        recommendedDurationSeconds: 180,
      },
      commonDifficulties: [
        {
          issue: 'La mente no deja de pensar',
          response:
            'Eso no significa que salió mal. El objetivo no es vaciar la mente, sino notar que se fue y volver a la respiración.',
        },
        {
          issue: 'El usuario se desespera',
          response:
            'Reducir la práctica a 2 minutos y usar mensajes más breves y cálidos.',
        },
        {
          issue: 'Se siente demasiado inquieto(a)',
          response:
            'Cambiar a postura de pie o usar antes un ejercicio de respiración guiada.',
        },
      ],
      nextStepSuggestions: [
        {
          when: { scoreBetween: [0, 2] },
          recommend: [
            {
              type: 'exercise',
              id: 'caminata-consciente',
              reason:
                'Ayuda a complementar atención plena con movimiento suave.',
            },
            {
              type: 'exercise',
              id: 'relajacion-nocturna-breve',
              reason:
                'Útil si el usuario quiere cerrar el día con menos tensión.',
            },
          ],
        },
      ],
      clinicalDisclaimer:
        'Este ejercicio es una herramienta de apoyo y no sustituye atención profesional. Si la ansiedad aumenta, interfiere con tu vida diaria o sientes que estás en riesgo, busca ayuda profesional o servicios de emergencia.',
    },
    sources: [],
    isPremium: false,
    isPublished: true,
  },
  {
    id: 'seed-caminata-consciente',
    type: 'exercise',
    title: 'Caminata consciente',
    description:
      'Ejercicio guiado de atención plena en movimiento para ayudar al usuario a regular ansiedad leve, bajar aceleración mental y volver al presente mientras camina.',
    topic: 'ansiedad',
    body: {
      id: 'caminata-consciente',
      slug: 'caminata-consciente',
      language: 'es-MX',
      category: 'movement',
      subCategory: 'mindfulness-en-movimiento',
      difficulty: 'beginner',
      estimatedDurationMinutes: 10,
      durationRangeMinutes: {
        min: 5,
        max: 15,
      },
      recommendedFor: {
        testId: 'gad2',
        testTitle: 'GAD-2',
        scoreRanges: [
          {
            range: { min: 0, max: 2 },
            label: 'Tamizaje negativo / síntomas bajos',
            priority: 3,
            reason:
              'Es útil para usuarios con ansiedad leve o tensión mental baja que se benefician de combinar movimiento suave con atención al presente.',
          },
        ],
      },
      goal: 'Ayudar al usuario a salir de la rumiación leve, reconectar con su cuerpo y enfocar su atención en el presente a través de una caminata guiada y consciente.',
      therapeuticIntent: [
        'Reducir aceleración mental leve',
        'Favorecer regulación a través del movimiento',
        'Aumentar conexión con el cuerpo',
        'Entrenar atención al presente sin exigir quietud',
      ],
      whenToUse: [
        'Cuando el usuario se sienta mentalmente saturado(a) o disperso(a)',
        'Cuando quiera bajar tensión sin quedarse quieto(a)',
        'Después de una situación estresante leve',
        'Como pausa reguladora durante el día',
        'Cuando note demasiados pensamientos al mismo tiempo',
      ],
      avoidOrModifyIf: [
        'Si el usuario se siente mareado(a), inestable o físicamente mal, debe detenerse',
        'Si el entorno no es seguro para caminar, hacer la versión en interiores o en un espacio muy corto',
        'Si el usuario está muy activado(a), conviene primero hacer respiración diafragmática y después esta caminata',
        'Si existe dolor físico o movilidad reducida, adaptar el ritmo, la distancia o hacer una versión de pasos suaves en el mismo lugar',
      ],
      benefits: [
        'Ayuda a interrumpir bucles de pensamiento leve',
        'Reduce sensación de estar atrapado(a) en la mente',
        'Combina movimiento suave con regulación emocional',
        'Es fácil de repetir varias veces por semana',
        'Puede aumentar sensación de claridad y presencia',
      ],
      preparation: {
        environment: [
          'Busca un espacio seguro donde puedas caminar sin prisa durante algunos minutos',
          'Puede hacerse en interior, pasillo, habitación, patio, oficina o exterior si el entorno es tranquilo y seguro',
        ],
        spaceOptions: [
          {
            id: 'trayecto-largo',
            label: 'Trayecto largo',
            instruction:
              'Camina en línea recta o en una ruta sencilla si cuentas con espacio suficiente.',
          },
          {
            id: 'trayecto-corto',
            label: 'Trayecto corto',
            instruction:
              'Da vueltas en un espacio corto, avanzando y regresando con calma.',
          },
          {
            id: 'en-el-mismo-lugar',
            label: 'En el mismo lugar',
            instruction:
              'Si no puedes desplazarte, marcha con suavidad en el mismo sitio llevando atención a tus pasos.',
          },
        ],
        postureInstruction:
          'Mantén una postura natural, hombros relajados, mandíbula suave y brazos libres o descansando a los lados.',
        paceInstruction:
          'Camina a un ritmo cómodo. No es ejercicio físico intenso; el objetivo es notar el movimiento y el presente.',
        beforeStartMessage:
          'No necesitas caminar rápido ni vaciar tu mente. Solo vas a notar tus pasos, tu respiración y lo que ocurre a tu alrededor.',
      },
      defaultProtocol: {
        totalDurationSeconds: 600,
        mode: 'guided_walking',
        pace: 'slow_to_natural',
        focusSequence: [
          'cuerpo',
          'pasos',
          'respiracion',
          'entorno',
          'cuerpo',
        ],
      },
      alternativeProtocols: [
        {
          id: 'corta',
          label: 'Versión corta',
          totalDurationSeconds: 300,
          useWhen:
            'Cuando el usuario tiene poco tiempo o quiere una pausa breve.',
        },
        {
          id: 'extendida',
          label: 'Versión extendida',
          totalDurationSeconds: 900,
          useWhen:
            'Cuando el usuario disfruta la práctica y quiere sostener más tiempo la regulación.',
        },
      ],
      steps: [
        {
          id: 'step_1',
          order: 1,
          title: 'Haz una pausa antes de caminar',
          type: 'setup',
          durationSeconds: 20,
          instruction:
            'Quédate quieto(a) por unos segundos. Nota cómo se siente tu cuerpo antes de empezar. Afloja hombros, manos y mandíbula.',
          uiHint: "Pantalla inicial con botón 'Comenzar caminata'.",
        },
        {
          id: 'step_2',
          order: 2,
          title: 'Elige tu espacio',
          type: 'setup',
          durationSeconds: 20,
          instruction:
            'Decide si caminarás en línea recta, en un trayecto corto de ida y vuelta o en el mismo lugar. Asegúrate de que sea seguro.',
          uiHint:
            'Permitir elegir tipo de espacio antes de iniciar.',
        },
        {
          id: 'step_3',
          order: 3,
          title: 'Comienza lentamente',
          type: 'start_movement',
          durationSeconds: 30,
          instruction:
            'Empieza a caminar despacio. No intentes llegar a ningún lugar. Solo permite que tu cuerpo entre en movimiento de manera natural.',
          uiHint:
            'Animación de pasos suaves con ritmo calmado.',
        },
        {
          id: 'step_4',
          order: 4,
          title: 'Siente tus pies',
          type: 'body_focus',
          durationSeconds: 60,
          instruction:
            'Lleva tu atención a los pies. Nota cómo un pie se levanta, avanza y vuelve a tocar el suelo. Luego observa el otro pie.',
          uiHint:
            'Mostrar atención alternando entre pie izquierdo y derecho.',
        },
        {
          id: 'step_5',
          order: 5,
          title: 'Observa el ritmo de tus pasos',
          type: 'movement_awareness',
          durationSeconds: 60,
          instruction:
            "Sigue el ritmo natural de tu caminata. Puedes repetir mentalmente: 'izquierdo, derecho' o 'paso, paso' para sostener la atención.",
          uiHint:
            'Mostrar contador suave o texto rítmico opcional.',
        },
        {
          id: 'step_6',
          order: 6,
          title: 'Incluye tu respiración',
          type: 'breath_awareness',
          durationSeconds: 60,
          instruction:
            'Sin cambiarla demasiado, nota cómo respiras mientras caminas. Observa si la respiración entra y sale de forma tranquila o rápida. Solo observa.',
          uiHint:
            'Animación sutil que combine pasos y respiración.',
        },
        {
          id: 'step_7',
          order: 7,
          title: 'Abre tu atención al entorno',
          type: 'sensory_awareness',
          durationSeconds: 90,
          instruction:
            'Nota 3 cosas que ves, 2 cosas que escuchas y 1 sensación física en tu cuerpo mientras sigues caminando.',
          uiHint:
            'Mostrar guía visual 3-2-1 para enfocar la atención.',
        },
        {
          id: 'step_8',
          order: 8,
          title: 'Regresa a tus pasos si te distraes',
          type: 'refocus',
          durationSeconds: 90,
          instruction:
            'Si te atrapan pensamientos, preocupaciones o pendientes, solo reconócelos y vuelve a la sensación de caminar. No necesitas pelearte con ellos.',
          uiHint:
            "Mensaje breve: 'Notar y volver a los pasos'.",
        },
        {
          id: 'step_9',
          order: 9,
          title: 'Camina el último minuto con calma',
          type: 'integrate',
          durationSeconds: 90,
          instruction:
            'Durante el último tramo, integra todo: pasos, respiración, cuerpo y entorno. Permítete caminar con más presencia y menos prisa.',
          uiHint:
            'Pantalla limpia con pocas instrucciones para dejar más autonomía.',
        },
        {
          id: 'step_10',
          order: 10,
          title: 'Detente y observa',
          type: 'closing',
          durationSeconds: 30,
          instruction:
            'Detente poco a poco. Quédate quieto(a) unos segundos y nota si tu mente, respiración o cuerpo se sienten un poco distintos.',
          uiHint: 'Pantalla final con check-in opcional.',
        },
      ],
      guidedExperience: {
        introText:
          'Vamos a caminar con atención plena. No se trata de llegar rápido, sino de usar el movimiento para volver al presente.',
        stepPrompts: [
          'Empieza despacio',
          'Siente tus pies tocar el suelo',
          'Nota el ritmo de tus pasos',
          'Observa tu respiración mientras caminas',
          'Mira y escucha lo que hay a tu alrededor',
          'Si te distraes, vuelve a tus pasos',
        ],
        midExercisePrompts: [
          'No necesitas dejar de pensar, solo volver al cuerpo',
          'Camina a un ritmo amable',
          'Tus pasos pueden ser tu punto de enfoque',
          'Cada vez que vuelves al presente, estás practicando',
        ],
        completionText:
          'Bien hecho. Esta caminata no busca rendimiento, sino ayudarte a sentirte más presente, más conectado(a) con tu cuerpo y menos absorbido(a) por la mente.',
      },
      interactionModel: {
        primaryAction: 'start_exercise',
        secondaryActions: [
          'pause_exercise',
          'restart_exercise',
          'switch_to_short_version',
          'skip_intro',
        ],
        userInputs: [
          {
            id: 'space_choice',
            type: 'single_choice',
            label: '¿Dónde vas a caminar?',
            options: [
              'Trayecto largo',
              'Trayecto corto',
              'En el mismo lugar',
            ],
          },
          {
            id: 'pace_choice',
            type: 'single_choice',
            label: '¿A qué ritmo quieres hacerlo?',
            options: ['Muy lento', 'Lento', 'Natural'],
          },
          {
            id: 'guided_audio_preference',
            type: 'single_choice',
            label: '¿Cómo quieres la guía?',
            options: [
              'Con indicaciones frecuentes',
              'Con indicaciones suaves',
              'Solo inicio y cierre',
            ],
          },
        ],
      },
      scoreSpecificMessages: [
        {
          range: { min: 0, max: 2 },
          message:
            'Este ejercicio está pensado para ayudarte a despejar la mente, bajar tensión leve y recuperar presencia cuando sientes ansiedad baja o saturación mental.',
        },
      ],
      progressTracking: {
        completionDefinition:
          'Completar al menos 5 minutos de caminata consciente o finalizar todas las fases guiadas',
        track: [
          'durationSeconds',
          'completed',
          'protocolUsed',
          'spaceChoice',
          'paceChoice',
          'selfReportedMentalNoiseBefore',
          'selfReportedMentalNoiseAfter',
        ],
        optionalCheckIn: {
          beforePrompt:
            'Antes de empezar, ¿qué tan saturada o acelerada sientes tu mente?',
          afterPrompt:
            'Ahora, ¿qué tan saturada o acelerada sientes tu mente?',
          scaleMin: 0,
          scaleMax: 10,
          scaleLabels: {
            min: 'Muy tranquila',
            max: 'Muy saturada',
          },
        },
      },
      completionCriteria: {
        minimumDurationSeconds: 300,
        recommendedDurationSeconds: 600,
      },
      commonDifficulties: [
        {
          issue: 'El usuario sigue pensando demasiado mientras camina',
          response:
            'Recordarle que no debe vaciar la mente; solo regresar a los pasos, al cuerpo o al entorno.',
        },
        {
          issue: 'Se siente raro caminar tan despacio',
          response:
            'Permitir un ritmo natural y mantener el foco en la sensación de los pies.',
        },
        {
          issue: 'No tiene espacio suficiente',
          response:
            'Usar versión de ida y vuelta corta o caminar en el mismo lugar.',
        },
      ],
      nextStepSuggestions: [
        {
          when: { scoreBetween: [0, 2] },
          recommend: [
            {
              type: 'exercise',
              id: 'relajacion-nocturna-breve',
              reason:
                'Útil si el usuario quiere complementar la caminata con un cierre calmado del día.',
            },
            {
              type: 'exercise',
              id: 'mindfulness-respiratorio-breve',
              reason:
                'Permite seguir entrenando atención al presente en quietud.',
            },
          ],
        },
      ],
      clinicalDisclaimer:
        'Este ejercicio es una herramienta de apoyo y no sustituye atención profesional. Si la ansiedad aumenta, interfiere con tu vida diaria o sientes que estás en riesgo, busca ayuda profesional o servicios de emergencia.',
    },
    sources: [],
    isPremium: false,
    isPublished: true,
  },
  {
    id: 'seed-relajacion-nocturna-breve',
    type: 'exercise',
    title: 'Relajación nocturna breve',
    description:
      'Ejercicio guiado de relajación corporal y mental para ayudar al usuario a cerrar el día, liberar tensión acumulada y prepararse para dormir con más calma.',
    topic: 'ansiedad',
    body: {
      id: 'relajacion-nocturna-breve',
      slug: 'relajacion-nocturna-breve',
      language: 'es-MX',
      category: 'relaxation',
      subCategory: 'night_wind_down',
      difficulty: 'beginner',
      estimatedDurationMinutes: 7,
      durationRangeMinutes: {
        min: 5,
        max: 10,
      },
      recommendedFor: {
        testId: 'gad2',
        testTitle: 'GAD-2',
        scoreRanges: [
          {
            range: { min: 0, max: 2 },
            label: 'Tamizaje negativo / síntomas bajos',
            priority: 4,
            reason:
              'Es útil para usuarios con ansiedad leve o tensión acumulada al final del día que necesitan una transición tranquila antes de dormir.',
          },
        ],
      },
      goal: 'Ayudar al usuario a desacelerar antes de dormir, reducir tensión física y mental, y facilitar una sensación de descanso y cierre del día.',
      therapeuticIntent: [
        'Bajar activación al final del día',
        'Reducir tensión corporal acumulada',
        'Disminuir ruido mental previo al sueño',
        'Crear una rutina breve de cierre nocturno',
      ],
      whenToUse: [
        'Antes de dormir',
        'Cuando el usuario siente el cuerpo tenso en la noche',
        'Cuando hay pensamientos leves que dificultan relajarse',
        'Después de un día demandante o estresante',
        'Como parte de una rutina nocturna consistente',
      ],
      avoidOrModifyIf: [
        'Si el usuario ya está demasiado somnoliento, usar una versión más corta para evitar quedarse dormido antes de terminar',
        'Si acostarse genera incomodidad, hacer el ejercicio sentado(a) en cama o en una silla cómoda',
        'Si alguna parte del cuerpo duele, no tensarla; solo observarla y relajarla suavemente',
        'Si el usuario se siente muy activado(a), conviene empezar con 1 minuto de respiración diafragmática antes de este ejercicio',
      ],
      benefits: [
        'Ayuda a soltar tensión física acumulada',
        'Puede facilitar la transición al descanso',
        'Reduce sensación de agitación ligera al final del día',
        'Es fácil de repetir cada noche',
        'Favorece una asociación mental de calma con la hora de dormir',
      ],
      preparation: {
        environment: [
          'Busca un lugar cómodo, de preferencia donde suelas dormir o descansar',
          'Si es posible, baja un poco la luz y reduce estímulos como notificaciones o ruido',
        ],
        postureOptions: [
          {
            id: 'acostado',
            label: 'Acostado(a)',
            instruction:
              'Recuéstate boca arriba o de lado en una posición cómoda, con brazos sueltos y piernas relajadas.',
          },
          {
            id: 'sentado',
            label: 'Sentado(a)',
            instruction:
              'Siéntate con la espalda apoyada, pies descansando y manos sueltas sobre piernas o regazo.',
          },
        ],
        comfortSuggestions: [
          'Afloja ropa ajustada si eso te ayuda a sentirte más cómodo(a)',
          'Puedes cubrirte con una manta ligera si eso da sensación de seguridad o descanso',
        ],
        beforeStartMessage:
          'No necesitas dormirte durante el ejercicio. El objetivo es ayudar a tu cuerpo y mente a bajar revoluciones poco a poco.',
      },
      defaultProtocol: {
        totalDurationSeconds: 420,
        mode: 'guided_relaxation',
        sequence: [
          'pause',
          'breath',
          'body_release',
          'face_release',
          'mental_slowdown',
          'closing',
        ],
      },
      alternativeProtocols: [
        {
          id: 'corta',
          label: 'Versión corta',
          totalDurationSeconds: 300,
          useWhen:
            'Cuando el usuario ya está en cama y quiere una práctica más breve.',
        },
        {
          id: 'extendida',
          label: 'Versión extendida',
          totalDurationSeconds: 600,
          useWhen:
            'Cuando el usuario quiere alargar el cierre nocturno y profundizar más en la relajación.',
        },
      ],
      steps: [
        {
          id: 'step_1',
          order: 1,
          title: 'Prepárate para cerrar el día',
          type: 'setup',
          durationSeconds: 30,
          instruction:
            'Colócate en una postura cómoda. Haz una pausa y reconoce que este momento es para bajar el ritmo y dejar el día por ahora.',
          uiHint: "Pantalla inicial tenue con botón 'Comenzar'.",
        },
        {
          id: 'step_2',
          order: 2,
          title: 'Suaviza la respiración',
          type: 'breath_awareness',
          durationSeconds: 45,
          instruction:
            'Respira lentamente sin forzarte. Inhala con suavidad y exhala un poco más largo. Hazlo 4 veces a tu propio ritmo.',
          uiHint:
            'Animación de respiración lenta, sin conteo rígido.',
        },
        {
          id: 'step_3',
          order: 3,
          title: 'Relaja hombros y brazos',
          type: 'body_release',
          durationSeconds: 45,
          instruction:
            'Lleva tu atención a hombros, brazos y manos. Nota si hay tensión y permite que bajen, pesen y se aflojen un poco más con cada exhalación.',
          uiHint:
            'Resaltar visualmente hombros, brazos y manos.',
        },
        {
          id: 'step_4',
          order: 4,
          title: 'Relaja pecho y abdomen',
          type: 'body_release',
          durationSeconds: 45,
          instruction:
            'Observa pecho y abdomen. No intentes controlarlos demasiado. Solo permite que se muevan con la respiración y se suelten un poco más.',
          uiHint:
            'Mostrar foco suave en zona media del cuerpo.',
        },
        {
          id: 'step_5',
          order: 5,
          title: 'Relaja piernas y pies',
          type: 'body_release',
          durationSeconds: 45,
          instruction:
            'Lleva tu atención a piernas, pantorrillas y pies. Imagina que sueltan el peso del día y descansan por completo.',
          uiHint: 'Recorrido visual de arriba hacia abajo.',
        },
        {
          id: 'step_6',
          order: 6,
          title: 'Afloja rostro y mandíbula',
          type: 'face_release',
          durationSeconds: 45,
          instruction:
            'Suelta frente, ojos, mandíbula y lengua. Deja que la expresión del rostro se vuelva más suave y descansada.',
          uiHint:
            "Mensaje corto: 'Suelta la mandíbula. Afloja el rostro'.",
        },
        {
          id: 'step_7',
          order: 7,
          title: 'Deja pasar los pensamientos',
          type: 'mental_release',
          durationSeconds: 75,
          instruction:
            'Si aparecen pendientes, recuerdos o preocupaciones, no los sigas. Solo reconoce que están ahí y déjalos pasar. Vuelve a la sensación de tu cuerpo descansando.',
          uiHint: 'Pantalla muy limpia con texto mínimo.',
        },
        {
          id: 'step_8',
          order: 8,
          title: 'Cierra con una sensación de descanso',
          type: 'closing',
          durationSeconds: 45,
          instruction:
            "Haz una última respiración lenta. Repite mentalmente: 'Por ahora, puedo descansar'. Permanece quieto(a) unos segundos y termina cuando lo sientas natural.",
          uiHint:
            'Pantalla final con transición suave y sin estímulos bruscos.',
        },
      ],
      guidedExperience: {
        introText:
          'Vamos a hacer una pausa breve para ayudar a tu cuerpo y mente a cerrar el día con más calma.',
        stepPrompts: [
          'Ponte cómodo(a)',
          'Respira un poco más lento',
          'Suelta hombros y brazos',
          'Relaja pecho y abdomen',
          'Deja descansar piernas y pies',
          'Afloja tu rostro',
          'Deja pasar los pensamientos',
          'Permítete descansar',
        ],
        midExercisePrompts: [
          'No necesitas hacer esfuerzo',
          'Solo suelta un poco más con cada exhalación',
          'No tienes que resolver nada ahora',
          'Por este momento, puedes descansar',
        ],
        completionText:
          'Bien hecho. Aunque el cambio sea sutil, repetir este cierre nocturno ayuda a que tu cuerpo asocie la noche con descanso y calma.',
      },
      interactionModel: {
        primaryAction: 'start_exercise',
        secondaryActions: [
          'pause_exercise',
          'restart_exercise',
          'switch_to_short_version',
          'skip_intro',
        ],
        userInputs: [
          {
            id: 'posture_choice',
            type: 'single_choice',
            label: '¿Cómo quieres hacer este ejercicio?',
            options: ['Acostado(a)', 'Sentado(a)'],
          },
          {
            id: 'sleepiness_level',
            type: 'single_choice',
            label: '¿Qué tan despierto(a) te sientes?',
            options: [
              'Muy despierto(a)',
              'Algo cansado(a)',
              'Muy somnoliento(a)',
            ],
          },
          {
            id: 'guidance_style',
            type: 'single_choice',
            label: '¿Cómo prefieres la guía?',
            options: [
              'Paso a paso',
              'Suave y espaciada',
              'Solo inicio y cierre',
            ],
          },
        ],
      },
      scoreSpecificMessages: [
        {
          range: { min: 0, max: 2 },
          message:
            'Este ejercicio está pensado para ayudarte a cerrar el día con menos tensión, bajar activación ligera y favorecer una noche más tranquila.',
        },
      ],
      progressTracking: {
        completionDefinition:
          'Completar al menos 5 minutos de relajación guiada o finalizar todas las fases del ejercicio',
        track: [
          'durationSeconds',
          'completed',
          'protocolUsed',
          'postureChoice',
          'sleepinessLevel',
          'selfReportedTensionBefore',
          'selfReportedTensionAfter',
        ],
        optionalCheckIn: {
          beforePrompt:
            'Antes de empezar, ¿qué tanta tensión sientes en tu cuerpo?',
          afterPrompt:
            'Ahora, ¿qué tanta tensión sientes en tu cuerpo?',
          scaleMin: 0,
          scaleMax: 10,
          scaleLabels: {
            min: 'Nada de tensión',
            max: 'Mucha tensión',
          },
        },
      },
      completionCriteria: {
        minimumDurationSeconds: 300,
        recommendedDurationSeconds: 420,
      },
      commonDifficulties: [
        {
          issue: 'El usuario sigue pensando en pendientes',
          response:
            'Recordarle que no debe dejar la mente en blanco; solo notar el pensamiento y volver al cuerpo.',
        },
        {
          issue: 'Le cuesta relajarse rápido',
          response:
            'Normalizarlo y sugerir práctica repetida durante varias noches seguidas.',
        },
        {
          issue: 'Se queda dormido(a) antes de terminar',
          response:
            'Eso también puede considerarse un buen resultado en contexto nocturno.',
        },
      ],
      nextStepSuggestions: [
        {
          when: { scoreBetween: [0, 2] },
          recommend: [
            {
              type: 'exercise',
              id: 'respiracion-diafragmatica',
              reason:
                'Puede usarse antes si el usuario necesita bajar un poco más la activación física.',
            },
            {
              type: 'exercise',
              id: 'mindfulness-respiratorio-breve',
              reason:
                'Útil si el usuario quiere una práctica corta de atención antes de relajarse por completo.',
            },
          ],
        },
      ],
      clinicalDisclaimer:
        'Este ejercicio es una herramienta de apoyo y no sustituye atención profesional. Si la ansiedad aumenta, interfiere con tu vida diaria o sientes que estás en riesgo, busca ayuda profesional o servicios de emergencia.',
    },
    sources: [],
    isPremium: false,
    isPublished: true,
  },
  {
    id: 'seed-relajacion-muscular-progresiva',
    type: 'exercise',
    title: 'Relajación muscular progresiva',
    description:
      'Ejercicio guiado para tensar y soltar grupos musculares de forma progresiva, ayudando al usuario a identificar tensión física asociada a ansiedad y a liberar esa activación corporal.',
    topic: 'ansiedad',
    body: {
      id: 'relajacion-muscular-progresiva',
      slug: 'relajacion-muscular-progresiva',
      language: 'es-MX',
      category: 'relaxation',
      subCategory: 'body_tension_release',
      difficulty: 'beginner',
      estimatedDurationMinutes: 10,
      durationRangeMinutes: {
        min: 7,
        max: 15,
      },
      recommendedFor: {
        testId: 'gad2',
        testTitle: 'GAD-2',
        scoreRanges: [
          {
            range: { min: 3, max: 6 },
            label: 'Tamizaje positivo',
            priority: 2,
            reason:
              'Es útil cuando la ansiedad ya se refleja en tensión corporal, inquietud física o dificultad para relajarse.',
          },
        ],
      },
      goal: 'Ayudar al usuario a reconocer la diferencia entre tensión y relajación en su cuerpo, bajar activación física y recuperar una sensación de calma y control.',
      therapeuticIntent: [
        'Reducir tensión muscular asociada a ansiedad',
        'Bajar activación corporal',
        'Incrementar conciencia del cuerpo',
        'Facilitar relajación física antes de otras herramientas',
      ],
      whenToUse: [
        'Cuando el usuario sienta el cuerpo tenso o rígido',
        'Cuando note mandíbula apretada, hombros elevados o manos tensas',
        'Cuando la ansiedad se sienta más en el cuerpo que en la mente',
        'Antes de dormir si hay inquietud corporal',
        'Después de una situación estresante',
      ],
      avoidOrModifyIf: [
        'Si alguna zona del cuerpo duele, está lesionada o sensible, no tensarla; solo observarla y relajarla suavemente',
        'Si el usuario tiene calambres frecuentes o una condición muscular, usar tensión más suave',
        'Si tensar el cuerpo aumenta incomodidad, hacer una versión de solo soltar sin fase de tensión',
        'Si el usuario se siente muy mareado(a) o hiperventila, pausar y volver a respiración natural',
      ],
      benefits: [
        'Ayuda a disminuir tensión física acumulada',
        'Puede reducir sensación de ansiedad corporal en pocos minutos',
        'Entrena al usuario a detectar señales tempranas de tensión',
        'Facilita relajación profunda sin requerir mucha experiencia',
        'Funciona bien como complemento de respiración o visualización',
      ],
      preparation: {
        environment: [
          'Busca un espacio tranquilo y seguro donde puedas permanecer sin interrupciones unos minutos',
          'Puede hacerse sentado(a) o acostado(a), siempre que el cuerpo esté relativamente apoyado',
        ],
        postureOptions: [
          {
            id: 'acostado',
            label: 'Acostado(a)',
            instruction:
              'Recuéstate en una posición cómoda con brazos a los lados y piernas relajadas.',
          },
          {
            id: 'sentado',
            label: 'Sentado(a)',
            instruction:
              'Siéntate con espalda apoyada, pies en el suelo y manos descansando sobre piernas o regazo.',
          },
        ],
        generalInstruction:
          'La idea no es hacer fuerza excesiva. Solo tensa cada grupo muscular de forma suave o moderada y luego suéltalo por completo.',
        beforeStartMessage:
          'No necesitas tensar fuerte. Lo más importante es notar la diferencia entre apretar y soltar.',
      },
      defaultProtocol: {
        mode: 'tense_and_release',
        tenseSeconds: 5,
        releaseSeconds: 10,
        breathingInstruction: 'inhalar al tensar y exhalar al soltar',
        muscleSequence: [
          'manos',
          'brazos',
          'hombros',
          'rostro',
          'pecho_abdomen',
          'piernas',
          'pies',
        ],
      },
      alternativeProtocols: [
        {
          id: 'suave',
          label: 'Versión suave',
          tenseSeconds: 3,
          releaseSeconds: 8,
          useWhen:
            'Cuando el usuario está muy sensible físicamente o es su primera vez.',
        },
        {
          id: 'solo-soltar',
          label: 'Versión sin tensión',
          tenseSeconds: 0,
          releaseSeconds: 10,
          useWhen:
            'Cuando hay dolor, lesiones o incomodidad al contraer músculos.',
        },
      ],
      steps: [
        {
          id: 'step_1',
          order: 1,
          title: 'Prepárate',
          type: 'setup',
          durationSeconds: 25,
          instruction:
            'Adopta una postura cómoda. Afloja un poco la respiración y permite que el cuerpo se apoye.',
          uiHint:
            'Pantalla inicial con postura sentada o acostada.',
        },
        {
          id: 'step_2',
          order: 2,
          title: 'Haz una respiración de inicio',
          type: 'breath_awareness',
          durationSeconds: 20,
          instruction:
            'Inhala suavemente por la nariz y exhala lentamente. Hazlo dos veces para empezar con más calma.',
          uiHint:
            'Animación suave de respiración sin conteo rígido.',
        },
        {
          id: 'step_3',
          order: 3,
          title: 'Tensa manos',
          type: 'tense_release',
          durationSeconds: 15,
          targetArea: 'manos',
          instruction:
            'Aprieta suavemente ambas manos en puño durante 5 segundos. Luego suéltalas por completo durante 10 segundos y nota la diferencia.',
          uiHint: 'Resaltar manos con contador visual 5/10.',
        },
        {
          id: 'step_4',
          order: 4,
          title: 'Tensa brazos',
          type: 'tense_release',
          durationSeconds: 15,
          targetArea: 'brazos',
          instruction:
            'Tensa antebrazos y brazos durante 5 segundos. Después suelta y deja que descansen durante 10 segundos.',
          uiHint: 'Mostrar brazos relajándose al exhalar.',
        },
        {
          id: 'step_5',
          order: 5,
          title: 'Tensa hombros',
          type: 'tense_release',
          durationSeconds: 15,
          targetArea: 'hombros',
          instruction:
            'Eleva los hombros hacia las orejas durante 5 segundos. Luego suéltalos lentamente y deja que caigan durante 10 segundos.',
          uiHint: "Mensaje breve: 'Sube... y suelta'.",
        },
        {
          id: 'step_6',
          order: 6,
          title: 'Relaja rostro',
          type: 'tense_release',
          durationSeconds: 15,
          targetArea: 'rostro',
          instruction:
            'Aprieta suavemente frente, ojos y mandíbula durante 5 segundos. Luego suelta por completo y nota cómo cambia tu cara.',
          uiHint: 'Recordatorio visual de soltar mandíbula.',
        },
        {
          id: 'step_7',
          order: 7,
          title: 'Suaviza pecho y abdomen',
          type: 'breath_release',
          durationSeconds: 20,
          targetArea: 'pecho_abdomen',
          instruction:
            'Lleva una inhalación suave al pecho y abdomen. Al exhalar, deja que esa zona se ablande un poco más. Repite dos veces.',
          uiHint:
            'Animación de respiración enfocada al torso.',
        },
        {
          id: 'step_8',
          order: 8,
          title: 'Tensa piernas',
          type: 'tense_release',
          durationSeconds: 15,
          targetArea: 'piernas',
          instruction:
            'Tensa muslos y pantorrillas durante 5 segundos. Luego suelta y deja que las piernas pesen más durante 10 segundos.',
          uiHint: 'Recorrido visual hacia piernas.',
        },
        {
          id: 'step_9',
          order: 9,
          title: 'Tensa pies',
          type: 'tense_release',
          durationSeconds: 15,
          targetArea: 'pies',
          instruction:
            'Lleva los pies suavemente hacia arriba o aprieta ligeramente los dedos durante 5 segundos. Luego suelta completamente durante 10 segundos.',
          uiHint: 'Mostrar pies soltando tensión.',
        },
        {
          id: 'step_10',
          order: 10,
          title: 'Recorre el cuerpo completo',
          type: 'body_scan',
          durationSeconds: 45,
          instruction:
            'Haz un recorrido mental desde la cabeza hasta los pies y observa qué zonas se sienten más sueltas, más pesadas o más tranquilas.',
          uiHint:
            'Pantalla limpia con recorrido corporal suave.',
        },
        {
          id: 'step_11',
          order: 11,
          title: 'Cierra el ejercicio',
          type: 'closing',
          durationSeconds: 30,
          instruction:
            'Haz una última exhalación lenta. Permanece quieto(a) unos segundos y nota si tu cuerpo se siente menos tenso que al inicio.',
          uiHint: 'Pantalla final con check-in opcional.',
        },
      ],
      guidedExperience: {
        introText:
          'Vamos a tensar y soltar distintas partes del cuerpo para ayudarte a liberar la tensión acumulada.',
        stepPrompts: [
          'Prepárate y respira',
          'Aprieta suavemente las manos y suelta',
          'Tensa brazos y suelta',
          'Sube hombros y suelta',
          'Aprieta rostro y relaja',
          'Afloja pecho y abdomen',
          'Tensa piernas y suelta',
          'Suelta pies',
          'Recorre tu cuerpo',
        ],
        midExercisePrompts: [
          'No necesitas apretar fuerte',
          'Exhala al soltar',
          'Nota la diferencia entre tensión y descanso',
          'Deja que el cuerpo pese un poco más',
        ],
        completionText:
          'Bien hecho. Aunque el cambio sea gradual, repetir este ejercicio ayuda a que tu cuerpo aprenda a salir más rápido del estado de tensión.',
      },
      interactionModel: {
        primaryAction: 'start_exercise',
        secondaryActions: [
          'pause_exercise',
          'restart_exercise',
          'switch_to_soft_version',
          'skip_target_area',
        ],
        userInputs: [
          {
            id: 'posture_choice',
            type: 'single_choice',
            label: '¿Cómo quieres hacer este ejercicio?',
            options: ['Acostado(a)', 'Sentado(a)'],
          },
          {
            id: 'body_sensitivity',
            type: 'single_choice',
            label: '¿Qué tan cómodo se siente tu cuerpo hoy?',
            options: [
              'Cómodo',
              'Algo sensible',
              'Muy sensible o con dolor',
            ],
          },
          {
            id: 'guidance_style',
            type: 'single_choice',
            label: '¿Cómo quieres la guía?',
            options: [
              'Paso a paso',
              'Suave y espaciada',
              'Solo señales clave',
            ],
          },
        ],
      },
      scoreSpecificMessages: [
        {
          range: { min: 3, max: 6 },
          message:
            'Este ejercicio está pensado para ayudarte a bajar la tensión física de la ansiedad y recuperar una sensación inicial de calma y control.',
        },
      ],
      progressTracking: {
        completionDefinition:
          'Completar al menos 5 grupos musculares o finalizar todas las fases del ejercicio',
        track: [
          'durationSeconds',
          'completed',
          'protocolUsed',
          'postureChoice',
          'areasCompleted',
          'selfReportedTensionBefore',
          'selfReportedTensionAfter',
        ],
        optionalCheckIn: {
          beforePrompt:
            'Antes de empezar, ¿qué tanta tensión sientes en tu cuerpo?',
          afterPrompt:
            'Ahora, ¿qué tanta tensión sientes en tu cuerpo?',
          scaleMin: 0,
          scaleMax: 10,
          scaleLabels: {
            min: 'Nada de tensión',
            max: 'Mucha tensión',
          },
        },
      },
      completionCriteria: {
        minimumAreasCompleted: 5,
        recommendedAreasCompleted: 7,
      },
      commonDifficulties: [
        {
          issue: 'El usuario aprieta demasiado fuerte',
          response:
            'Recordarle que la tensión debe ser suave o moderada, nunca dolorosa.',
        },
        {
          issue: 'No nota diferencia entre tensión y relajación',
          response:
            'Invitarle a usar una tensión un poco más clara o a prestar más atención al momento de soltar.',
        },
        {
          issue: 'Alguna zona duele o se incomoda',
          response:
            'Saltar esa zona y usar solo respiración o relajación pasiva ahí.',
        },
      ],
      nextStepSuggestions: [
        {
          when: { scoreBetween: [3, 6] },
          recommend: [
            {
              type: 'exercise',
              id: 'visualizacion-lugar-seguro',
              reason:
                'Complementa la relajación corporal con una sensación mental de seguridad.',
            },
            {
              type: 'exercise',
              id: 'tiempo-de-preocupacion',
              reason:
                'Útil si además de tensión física hay mucha preocupación mental.',
            },
            {
              type: 'test',
              id: 'gad7',
              reason:
                'Ayuda a estimar mejor la severidad de los síntomas.',
            },
          ],
        },
      ],
      clinicalDisclaimer:
        'Este ejercicio es una herramienta de apoyo y no sustituye atención profesional. Si tu ansiedad se intensifica, interfiere mucho con tu vida diaria o sientes que estás en riesgo, busca ayuda profesional o servicios de emergencia.',
    },
    sources: [],
    isPremium: false,
    isPublished: true,
  },
  {
    id: 'seed-visualizacion-lugar-seguro',
    type: 'exercise',
    title: 'Visualización de lugar seguro',
    description:
      'Ejercicio guiado de imaginería para ayudar al usuario a crear una sensación de seguridad, calma y estabilidad mental cuando se siente ansioso o sobrecargado.',
    topic: 'ansiedad',
    body: {
      id: 'visualizacion-lugar-seguro',
      slug: 'visualizacion-lugar-seguro',
      language: 'es-MX',
      category: 'imagery',
      subCategory: 'safe_place_visualization',
      difficulty: 'beginner',
      estimatedDurationMinutes: 7,
      durationRangeMinutes: {
        min: 5,
        max: 10,
      },
      recommendedFor: {
        testId: 'gad2',
        testTitle: 'GAD-2',
        scoreRanges: [
          {
            range: { min: 3, max: 6 },
            label: 'Tamizaje positivo',
            priority: 3,
            reason:
              'Es útil cuando el usuario necesita bajar activación mental, sentirse contenido(a) y recuperar una sensación de seguridad interna.',
          },
        ],
      },
      goal: 'Ayudar al usuario a disminuir ansiedad y sobrecarga mental mediante una imagen interna de seguridad, calma y protección.',
      therapeuticIntent: [
        'Disminuir activación emocional',
        'Crear sensación subjetiva de seguridad',
        'Reducir intensidad de pensamientos ansiosos',
        'Fortalecer una herramienta interna de regulación',
      ],
      whenToUse: [
        'Cuando el usuario se sienta nervioso(a), inquieto(a) o sobrecargado(a)',
        'Después de una situación estresante',
        'Cuando la mente esté demasiado activa',
        'Antes de dormir si hay ansiedad ligera o moderada',
        'Después de respiración o relajación muscular para profundizar la calma',
      ],
      avoidOrModifyIf: [
        'Si cerrar los ojos aumenta incomodidad, hacer el ejercicio con mirada suave y fija en un punto',
        'Si imaginar escenas resulta difícil, usar una imagen muy simple o una fotografía recordada',
        'Si un lugar trae recuerdos dolorosos o ambiguos, elegir otro escenario',
        'Si el usuario se siente muy activado(a), conviene hacer primero respiración diafragmática durante 1 o 2 minutos',
      ],
      benefits: [
        'Ayuda a cortar la sensación de amenaza o saturación',
        'Favorece una sensación de refugio interno',
        'Reduce tensión mental y emocional',
        'Es fácil de repetir cuando el usuario ya conoce su lugar seguro',
        'Puede combinarse con respiración lenta para mayor efecto',
      ],
      preparation: {
        environment: [
          'Busca un lugar donde puedas estar unos minutos sin interrupciones',
          'Puede hacerse sentado(a) o acostado(a), siempre que el cuerpo esté cómodo y estable',
        ],
        postureOptions: [
          {
            id: 'sentado',
            label: 'Sentado(a)',
            instruction:
              'Siéntate con espalda cómoda y relativamente recta. Apoya manos sobre piernas o regazo.',
          },
          {
            id: 'acostado',
            label: 'Acostado(a)',
            instruction:
              'Recuéstate en una posición cómoda, con el cuerpo apoyado y respiración libre.',
          },
        ],
        imageryNote:
          'El lugar seguro puede ser real, recordado, imaginado o una mezcla de varios lugares. Lo importante es que transmita calma, protección y comodidad.',
        beforeStartMessage:
          'No necesitas visualizar todo perfecto. Basta con imaginar algunos detalles que te ayuden a sentirte más seguro(a) y tranquilo(a).',
      },
      defaultProtocol: {
        totalDurationSeconds: 420,
        mode: 'guided_imagery',
        sequence: [
          'settle_body',
          'choose_place',
          'add_visual_details',
          'add_sensory_details',
          'anchor_safety',
          'rest_in_scene',
          'return',
        ],
      },
      alternativeProtocols: [
        {
          id: 'simple',
          label: 'Versión simple',
          totalDurationSeconds: 300,
          useWhen:
            'Cuando al usuario le cuesta imaginar detalles o quiere una práctica más corta.',
        },
        {
          id: 'deep',
          label: 'Versión profunda',
          totalDurationSeconds: 600,
          useWhen:
            'Cuando el usuario ya conoce el ejercicio y quiere sostener más tiempo la sensación de calma.',
        },
      ],
      steps: [
        {
          id: 'step_1',
          order: 1,
          title: 'Prepárate',
          type: 'setup',
          durationSeconds: 25,
          instruction:
            'Adopta una postura cómoda. Afloja hombros, mandíbula y manos. Permite que tu cuerpo se apoye.',
          uiHint:
            "Pantalla inicial tranquila con botón 'Comenzar'.",
        },
        {
          id: 'step_2',
          order: 2,
          title: 'Haz dos respiraciones lentas',
          type: 'breath_awareness',
          durationSeconds: 20,
          instruction:
            'Inhala suavemente y exhala un poco más largo. Hazlo dos veces para ayudar a tu cuerpo a bajar el ritmo.',
          uiHint: 'Animación de respiración lenta y simple.',
        },
        {
          id: 'step_3',
          order: 3,
          title: 'Elige tu lugar seguro',
          type: 'imagery_selection',
          durationSeconds: 40,
          instruction:
            'Imagina un lugar donde puedas sentirte seguro(a), tranquilo(a) y protegido(a). Puede ser una playa, una habitación acogedora, un jardín, una cabaña o cualquier espacio que te transmita calma.',
          uiHint:
            'Mostrar opciones visuales abstractas para inspirar sin imponer una sola escena.',
        },
        {
          id: 'step_4',
          order: 4,
          title: 'Observa lo que ves',
          type: 'visual_details',
          durationSeconds: 60,
          instruction:
            'Empieza a notar detalles visuales de ese lugar. Mira colores, luz, formas, distancia, objetos o paisaje. No necesitas ver todo con claridad; basta con algunos elementos.',
          uiHint:
            "Mensajes suaves: '¿Qué ves?', '¿Cómo es la luz?', '¿Qué hay a tu alrededor?'.",
        },
        {
          id: 'step_5',
          order: 5,
          title: 'Agrega sonidos y sensaciones',
          type: 'sensory_details',
          durationSeconds: 60,
          instruction:
            'Ahora nota qué se escucha en ese lugar y cómo se siente estar ahí. Tal vez hay silencio, viento, agua, hojas o sonidos suaves. Nota también temperatura, textura y comodidad.',
          uiHint:
            'Invitar a explorar oído, temperatura y sensación corporal.',
        },
        {
          id: 'step_6',
          order: 6,
          title: 'Permite que tu cuerpo se sienta ahí',
          type: 'embodiment',
          durationSeconds: 50,
          instruction:
            'Imagina que tu cuerpo realmente está en ese lugar. Observa si tus hombros, pecho, abdomen o manos pueden aflojarse un poco más mientras permaneces ahí.',
          uiHint:
            'Transición visual hacia sensación de descanso corporal.',
        },
        {
          id: 'step_7',
          order: 7,
          title: 'Ancla una frase de seguridad',
          type: 'safety_anchor',
          durationSeconds: 35,
          instruction:
            "Repite mentalmente una frase breve mientras imaginas el lugar, por ejemplo: 'Aquí estoy a salvo', 'Por ahora estoy bien' o 'Puedo estar en calma aquí'.",
          uiHint:
            'Mostrar 2 o 3 frases sugeridas y permitir elegir una.',
        },
        {
          id: 'step_8',
          order: 8,
          title: 'Quédate un momento más',
          type: 'rest_in_scene',
          durationSeconds: 80,
          instruction:
            'Permanece unos instantes en tu lugar seguro. No necesitas hacer nada. Solo descansa ahí y deja que la sensación de calma se asiente un poco más.',
          uiHint:
            'Pantalla limpia, con mínimos textos y temporizador discreto.',
        },
        {
          id: 'step_9',
          order: 9,
          title: 'Regresa poco a poco',
          type: 'closing',
          durationSeconds: 50,
          instruction:
            'Sin perder por completo esa sensación, vuelve a notar tu respiración y el lugar real donde estás. Mueve suavemente manos o pies y abre los ojos si los tenías cerrados.',
          uiHint:
            'Pantalla final con transición gradual de regreso.',
        },
      ],
      guidedExperience: {
        introText:
          'Vamos a imaginar un lugar que te haga sentir seguro(a), tranquilo(a) y contenido(a). No necesitas visualizarlo perfecto. Solo vamos a construir una sensación de calma paso a paso.',
        stepPrompts: [
          'Ponte cómodo(a)',
          'Respira un poco más lento',
          'Elige un lugar seguro',
          'Observa lo que ves',
          'Nota sonidos y sensaciones',
          'Permite que tu cuerpo se sienta ahí',
          'Repite una frase de seguridad',
          'Descansa en ese lugar',
          'Vuelve poco a poco',
        ],
        midExercisePrompts: [
          'No necesitas imaginar todo con claridad',
          'Elige solo los detalles que te hagan sentir bien',
          'Este lugar puede ser simple y aun así funcionar',
          'Permite que tu cuerpo se ablande un poco más',
        ],
        completionText:
          'Bien hecho. Mientras más repitas este ejercicio, más fácil puede ser para tu mente y tu cuerpo volver a esa sensación de seguridad.',
      },
      interactionModel: {
        primaryAction: 'start_exercise',
        secondaryActions: [
          'pause_exercise',
          'restart_exercise',
          'switch_to_simple_version',
          'keep_eyes_open_mode',
        ],
        userInputs: [
          {
            id: 'posture_choice',
            type: 'single_choice',
            label: '¿Cómo quieres hacer este ejercicio?',
            options: ['Sentado(a)', 'Acostado(a)'],
          },
          {
            id: 'safe_place_type',
            type: 'single_choice',
            label: '¿Qué tipo de lugar quieres imaginar?',
            options: [
              'Naturaleza',
              'Interior acogedor',
              'Lugar real que recuerdo',
              'Lugar totalmente imaginado',
            ],
          },
          {
            id: 'guidance_style',
            type: 'single_choice',
            label: '¿Cómo prefieres la guía?',
            options: [
              'Paso a paso',
              'Suave y espaciada',
              'Solo con indicaciones clave',
            ],
          },
        ],
      },
      scoreSpecificMessages: [
        {
          range: { min: 3, max: 6 },
          message:
            'Este ejercicio está pensado para ayudarte a sentir más calma y seguridad cuando la ansiedad empieza a sentirse difícil de manejar.',
        },
      ],
      progressTracking: {
        completionDefinition:
          'Completar al menos 4 minutos de visualización guiada o finalizar todas las fases del ejercicio',
        track: [
          'durationSeconds',
          'completed',
          'protocolUsed',
          'postureChoice',
          'safePlaceType',
          'selfReportedCalmBefore',
          'selfReportedCalmAfter',
        ],
        optionalCheckIn: {
          beforePrompt:
            'Antes de empezar, ¿qué tan seguro(a) o en calma te sientes en este momento?',
          afterPrompt:
            'Ahora, ¿qué tan seguro(a) o en calma te sientes?',
          scaleMin: 0,
          scaleMax: 10,
          scaleLabels: {
            min: 'Nada en calma',
            max: 'Muy en calma',
          },
        },
      },
      completionCriteria: {
        minimumDurationSeconds: 240,
        recommendedDurationSeconds: 420,
      },
      commonDifficulties: [
        {
          issue: 'El usuario no logra imaginar imágenes claras',
          response:
            'Recordarle que no necesita ver el lugar con nitidez; puede enfocarse en una sola sensación, color, sonido o palabra.',
        },
        {
          issue: 'Aparecen pensamientos intrusivos',
          response:
            'Invitarle a notarlos sin pelear y regresar a un detalle del lugar seguro, como la luz, el piso o una frase de calma.',
        },
        {
          issue: 'El lugar elegido no se siente realmente seguro',
          response:
            'Sugerir cambiar de escenario o simplificarlo hasta que genere mayor comodidad.',
        },
      ],
      nextStepSuggestions: [
        {
          when: { scoreBetween: [3, 6] },
          recommend: [
            {
              type: 'exercise',
              id: 'relajacion-muscular-progresiva',
              reason:
                'Complementa esta práctica con liberación de tensión corporal.',
            },
            {
              type: 'exercise',
              id: 'tiempo-de-preocupacion',
              reason:
                'Útil si además de activación emocional hay preocupación repetitiva.',
            },
            {
              type: 'test',
              id: 'gad7',
              reason:
                'Ayuda a estimar mejor la severidad de los síntomas.',
            },
          ],
        },
      ],
      clinicalDisclaimer:
        'Este ejercicio es una herramienta de apoyo y no sustituye atención profesional. Si tu ansiedad se intensifica, interfiere mucho con tu vida diaria o sientes que estás en riesgo, busca ayuda profesional o servicios de emergencia.',
    },
    sources: [],
    isPremium: false,
    isPublished: true,
  },
  {
    id: 'seed-tiempo-de-preocupacion',
    type: 'exercise',
    title: 'Tiempo de preocupación',
    description:
      'Ejercicio guiado para ayudar al usuario a contener la preocupación excesiva, posponer pensamientos repetitivos y recuperar atención en el presente sin intentar eliminar a la fuerza sus preocupaciones.',
    topic: 'ansiedad',
    body: {
      id: 'tiempo-de-preocupacion',
      slug: 'tiempo-de-preocupacion',
      language: 'es-MX',
      category: 'cognitive',
      subCategory: 'worry_management',
      difficulty: 'beginner',
      estimatedDurationMinutes: 10,
      durationRangeMinutes: {
        min: 8,
        max: 15,
      },
      recommendedFor: {
        testId: 'gad2',
        testTitle: 'GAD-2',
        scoreRanges: [
          {
            range: { min: 3, max: 6 },
            label: 'Tamizaje positivo',
            priority: 4,
            reason:
              'Es útil cuando la ansiedad aparece como preocupación constante, pensamientos repetitivos o dificultad para soltar temas que dan vueltas en la mente.',
          },
        ],
      },
      goal: 'Ayudar al usuario a dejar de engancharse con preocupaciones durante todo el día, crear un espacio controlado para atenderlas y reducir la sensación de que la mente está fuera de control.',
      therapeuticIntent: [
        'Contener la preocupación repetitiva',
        'Reducir rumiación durante el día',
        'Aumentar sensación de control sobre los pensamientos',
        'Diferenciar entre preocuparse y resolver',
      ],
      whenToUse: [
        'Cuando el usuario nota que su mente vuelve una y otra vez a los mismos problemas',
        'Cuando hay preocupación constante durante el día',
        "Cuando el usuario se distrae por pensamientos de '¿y si...?'",
        'Cuando cuesta dejar de pensar en pendientes o escenarios negativos',
        'Como práctica diaria para ordenar la preocupación',
      ],
      avoidOrModifyIf: [
        'Si el usuario está en una crisis intensa o muy activado(a), conviene primero usar respiración diafragmática o relajación muscular',
        'Si el usuario empieza a sentirse más abrumado(a), reducir el tiempo de la práctica y enfocarse solo en 1 o 2 preocupaciones',
        'Si el usuario tiende a hacer el ejercicio justo antes de dormir, moverlo a una hora más temprana',
        'Si una preocupación implica riesgo inmediato o seguridad, no se debe posponer; debe atenderse de inmediato',
      ],
      benefits: [
        'Ayuda a limitar el tiempo mental dedicado a preocuparse',
        'Reduce la sensación de estar pensando en lo mismo todo el día',
        'Favorece una relación más ordenada con la ansiedad',
        'Permite distinguir preocupaciones útiles de repetición mental improductiva',
        'Sirve como base para otras herramientas cognitivas',
      ],
      preparation: {
        environment: [
          'Busca un lugar tranquilo donde puedas escribir o pensar con calma durante unos minutos',
          'Idealmente realiza este ejercicio a la misma hora del día, de preferencia tarde o temprano por la noche, pero no justo antes de dormir',
        ],
        materials: [
          'Papel y pluma',
          'Notas en el celular',
          'Campo de texto dentro de la app',
        ],
        timingRecommendation:
          'Programa un espacio fijo de 10 minutos para preocuparte de forma intencional. Fuera de ese espacio, practicarás posponer las preocupaciones para ese momento.',
        beforeStartMessage:
          'La idea no es dejar de preocuparte a la fuerza. La idea es darle a la preocupación un lugar y un horario para que no invada todo tu día.',
      },
      defaultProtocol: {
        totalDurationSeconds: 600,
        mode: 'scheduled_worry_time',
        dailyPractice: true,
        recommendedTimeOfDay: 'tarde',
        recommendedDurationMinutes: 10,
      },
      alternativeProtocols: [
        {
          id: 'corta',
          label: 'Versión corta',
          totalDurationSeconds: 480,
          useWhen:
            'Cuando el usuario se satura fácilmente o está comenzando con esta técnica.',
        },
        {
          id: 'extendida',
          label: 'Versión extendida',
          totalDurationSeconds: 900,
          useWhen:
            'Cuando el usuario ya domina la técnica y quiere revisar con más detalle preocupaciones concretas.',
        },
      ],
      steps: [
        {
          id: 'step_1',
          order: 1,
          title: 'Define tu espacio de preocupación',
          type: 'setup',
          durationSeconds: 40,
          instruction:
            'Elige un momento específico del día para este ejercicio, por ejemplo 6:00 p. m. o 7:30 p. m. Durante ese momento sí vas a permitirte pensar en tus preocupaciones.',
          uiHint:
            'Permitir seleccionar hora y duración dentro de la app.',
        },
        {
          id: 'step_2',
          order: 2,
          title: 'Haz una pausa antes de empezar',
          type: 'grounding',
          durationSeconds: 30,
          instruction:
            'Antes de entrar a las preocupaciones, toma una respiración lenta y reconoce que este es un espacio acotado. No necesitas resolver toda tu vida en este momento.',
          uiHint:
            'Pantalla breve de transición antes de comenzar el ejercicio.',
        },
        {
          id: 'step_3',
          order: 3,
          title: 'Escribe tus preocupaciones',
          type: 'worry_listing',
          durationSeconds: 150,
          instruction:
            'Escribe todas las preocupaciones que tengas en mente. Hazlo rápido, sin analizarlas demasiado. Pueden ser pendientes, miedos, dudas o escenarios que te inquietan.',
          uiHint:
            "Campo de texto o lista editable con botón 'Agregar preocupación'.",
        },
        {
          id: 'step_4',
          order: 4,
          title: 'Elige una preocupación a la vez',
          type: 'worry_selection',
          durationSeconds: 60,
          instruction:
            'Mira tu lista y elige una sola preocupación para revisarla primero. No intentes atender todas al mismo tiempo.',
          uiHint:
            'Permitir seleccionar una preocupación de la lista.',
        },
        {
          id: 'step_5',
          order: 5,
          title: 'Pregúntate si es resoluble hoy',
          type: 'evaluation',
          durationSeconds: 90,
          instruction:
            "Pregúntate: '¿Hay algo concreto que pueda hacer hoy o pronto con respecto a esto?'. Si la respuesta es sí, anota una acción pequeña. Si la respuesta es no, reconócelo y evita seguir dándole vueltas en este momento.",
          uiHint:
            "Mostrar opciones: 'Sí, puedo hacer algo' / 'No, no puedo resolverlo ahora'.",
        },
        {
          id: 'step_6',
          order: 6,
          title: 'Anota una acción o suelta por ahora',
          type: 'decision',
          durationSeconds: 90,
          instruction:
            "Si sí hay una acción posible, escribe solo el siguiente paso concreto. Si no hay una acción posible, escribe una frase como: 'Esto no lo puedo resolver ahora, volveré a ello mañana si sigue siendo importante'.",
          uiHint:
            'Permitir guardar acción concreta o frase de cierre.',
        },
        {
          id: 'step_7',
          order: 7,
          title: 'Repite con otra preocupación si hay tiempo',
          type: 'repeat',
          durationSeconds: 90,
          instruction:
            'Si aún tienes tiempo dentro de tu espacio de preocupación, repite el proceso con una o dos preocupaciones más. No necesitas abarcar toda la lista.',
          uiHint:
            'Mostrar temporizador restante del ejercicio.',
        },
        {
          id: 'step_8',
          order: 8,
          title: 'Cierra el espacio de preocupación',
          type: 'closing',
          durationSeconds: 50,
          instruction:
            "Cuando termine el tiempo, cierra la lista. Haz una respiración lenta y recuérdate: 'Por hoy ya atendí mis preocupaciones en su espacio. Si regresan, las volveré a ver en mi próximo tiempo de preocupación'.",
          uiHint:
            "Pantalla de cierre con frase de salida y botón 'Terminar'.",
        },
      ],
      guidedExperience: {
        introText:
          'Vamos a darle a tus preocupaciones un espacio limitado para que no ocupen todo tu día. No se trata de ignorarlas, sino de ordenarlas.',
        stepPrompts: [
          'Define tu momento de preocupación',
          'Haz una pausa',
          'Escribe tus preocupaciones',
          'Elige una sola',
          'Pregunta si puede resolverse hoy',
          'Anota una acción o suelta por ahora',
          'Repite solo si hay tiempo',
          'Cierra el ejercicio',
        ],
        midExercisePrompts: [
          'No tienes que resolver todo hoy',
          'Preocuparte no siempre es lo mismo que actuar',
          'Una sola acción pequeña puede ser suficiente',
          'Si no puedes resolverlo ahora, puedes dejarlo para después',
        ],
        completionText:
          'Bien hecho. Al practicar esto, tu mente puede aprender que no necesita preocuparse todo el día para no olvidar lo importante.',
      },
      interactionModel: {
        primaryAction: 'start_exercise',
        secondaryActions: [
          'pause_exercise',
          'restart_exercise',
          'add_worry',
          'mark_worry_as_actionable',
          'mark_worry_as_not_actionable',
        ],
        userInputs: [
          {
            id: 'scheduled_time',
            type: 'time_picker',
            label: '¿A qué hora quieres tu tiempo de preocupación?',
          },
          {
            id: 'worry_entries',
            type: 'list_input',
            label: 'Escribe tus preocupaciones',
          },
          {
            id: 'actionability_check',
            type: 'single_choice',
            label:
              '¿Esta preocupación puede resolverse con una acción concreta pronto?',
            options: ['Sí', 'No', 'No estoy seguro(a)'],
          },
          {
            id: 'next_action',
            type: 'text_input',
            label:
              'Si sí se puede resolver, ¿cuál es el siguiente paso más pequeño?',
          },
        ],
      },
      scoreSpecificMessages: [
        {
          range: { min: 3, max: 6 },
          message:
            'Este ejercicio está pensado para ayudarte a poner orden a la preocupación y evitar que tu mente esté atrapada en ella durante todo el día.',
        },
      ],
      progressTracking: {
        completionDefinition:
          'Completar al menos una lista de preocupaciones y revisar una preocupación con el criterio de acción concreta o no acción',
        track: [
          'durationSeconds',
          'completed',
          'scheduledTime',
          'worriesCaptured',
          'actionableWorriesCount',
          'nonActionableWorriesCount',
          'selfReportedMentalLoadBefore',
          'selfReportedMentalLoadAfter',
        ],
        optionalCheckIn: {
          beforePrompt:
            'Antes de empezar, ¿qué tan cargada sientes tu mente por las preocupaciones?',
          afterPrompt:
            'Ahora, ¿qué tan cargada sientes tu mente por las preocupaciones?',
          scaleMin: 0,
          scaleMax: 10,
          scaleLabels: {
            min: 'Nada cargada',
            max: 'Muy cargada',
          },
        },
      },
      completionCriteria: {
        minimumWorriesCaptured: 1,
        minimumReviewedWorries: 1,
        recommendedReviewedWorries: 3,
      },
      commonDifficulties: [
        {
          issue:
            'El usuario siente que posponer preocupaciones es ignorarlas',
          response:
            'Recordarle que no las está negando, solo les está dando un momento específico para atenderlas mejor.',
        },
        {
          issue: 'Las preocupaciones vuelven durante el día',
          response:
            "Invitar a anotar una palabra clave y decirse: 'Lo veré en mi tiempo de preocupación'.",
        },
        {
          issue:
            'Quiere resolver todas las preocupaciones en una sola sesión',
          response:
            'Sugerir enfocarse solo en una o dos y priorizar la acción más pequeña posible.',
        },
      ],
      nextStepSuggestions: [
        {
          when: { scoreBetween: [3, 6] },
          recommend: [
            {
              type: 'exercise',
              id: 'resolucion-de-problemas-basica',
              reason:
                'Ayuda a convertir preocupaciones resolubles en pasos concretos.',
            },
            {
              type: 'exercise',
              id: 'respiracion-diafragmatica',
              reason:
                'Útil si el usuario también siente activación física mientras se preocupa.',
            },
            {
              type: 'test',
              id: 'gad7',
              reason:
                'Ayuda a estimar mejor la severidad de los síntomas.',
            },
          ],
        },
      ],
      clinicalDisclaimer:
        'Este ejercicio es una herramienta de apoyo y no sustituye atención profesional. Si tu ansiedad se intensifica, interfiere mucho con tu vida diaria o sientes que estás en riesgo, busca ayuda profesional o servicios de emergencia.',
    },
    sources: [],
    isPremium: false,
    isPublished: true,
  },
  {
    id: 'seed-resolucion-de-problemas-basica',
    type: 'exercise',
    title: 'Resolución de problemas básica',
    description:
      'Ejercicio guiado para ayudar al usuario a convertir una preocupación concreta en un problema manejable, generar opciones y elegir un siguiente paso realista.',
    topic: 'ansiedad',
    body: {
      id: 'resolucion-de-problemas-basica',
      slug: 'resolucion-de-problemas-basica',
      language: 'es-MX',
      category: 'cognitive_behavioral',
      subCategory: 'problem_solving',
      difficulty: 'beginner',
      estimatedDurationMinutes: 10,
      durationRangeMinutes: {
        min: 8,
        max: 15,
      },
      recommendedFor: {
        testId: 'gad2',
        testTitle: 'GAD-2',
        scoreRanges: [
          {
            range: { min: 3, max: 6 },
            label: 'Tamizaje positivo',
            priority: 5,
            reason:
              'Es útil cuando la ansiedad está acompañada de preocupaciones concretas, pendientes o situaciones que sí pueden abordarse con acciones pequeñas y realistas.',
          },
        ],
      },
      goal: 'Ayudar al usuario a bajar sensación de descontrol convirtiendo una preocupación concreta en un plan simple, claro y accionable.',
      therapeuticIntent: [
        'Reducir la sensación de bloqueo',
        'Diferenciar preocupación de acción',
        'Aumentar sensación de eficacia personal',
        'Transformar un problema difuso en pasos concretos',
      ],
      whenToUse: [
        'Cuando el usuario tiene una preocupación concreta y real',
        'Cuando siente que un problema le da vueltas en la cabeza',
        'Cuando no sabe por dónde empezar',
        'Cuando quiere recuperar sensación de control',
        "Después de identificar una preocupación accionable en 'Tiempo de preocupación'",
      ],
      avoidOrModifyIf: [
        'Si el usuario está muy activado(a) o en crisis, conviene primero usar respiración o relajación',
        'Si el problema implica riesgo inmediato o seguridad, debe buscar ayuda o actuar de inmediato y no tratarlo solo como ejercicio',
        'Si el problema es demasiado grande, dividirlo en una parte pequeña y manejable',
        'Si el usuario empieza a sentirse abrumado(a), limitar el ejercicio a identificar solo el siguiente paso',
      ],
      benefits: [
        'Ayuda a salir del bloqueo mental',
        'Reduce rumiación sobre problemas concretos',
        'Favorece decisiones más claras',
        'Convierte la ansiedad en acción organizada',
        'Puede fortalecer confianza para manejar situaciones difíciles',
      ],
      preparation: {
        environment: [
          'Busca un lugar tranquilo donde puedas pensar y, de preferencia, escribir',
          'Puede hacerse con papel y pluma, notas del celular o dentro de la app',
        ],
        materials: [
          'Papel y pluma',
          'Notas en el celular',
          'Campo de texto dentro de la app',
        ],
        selectionRule:
          'Elige un solo problema por vez. Debe ser algo específico, actual y que en alguna medida pueda abordarse.',
        beforeStartMessage:
          'No necesitas resolver todo hoy. El objetivo es encontrar el siguiente paso más útil y realista.',
      },
      defaultProtocol: {
        totalDurationSeconds: 600,
        mode: 'structured_problem_solving',
        steps: [
          'define_problem',
          'set_goal',
          'brainstorm_options',
          'evaluate_options',
          'choose_next_step',
          'commit_and_close',
        ],
      },
      alternativeProtocols: [
        {
          id: 'micro',
          label: 'Versión micro',
          totalDurationSeconds: 480,
          useWhen:
            'Cuando el usuario está saturado(a) y solo puede enfocarse en un siguiente paso pequeño.',
        },
        {
          id: 'extendida',
          label: 'Versión extendida',
          totalDurationSeconds: 900,
          useWhen:
            'Cuando el usuario quiere evaluar varias opciones con más calma.',
        },
      ],
      steps: [
        {
          id: 'step_1',
          order: 1,
          title: 'Haz una pausa',
          type: 'setup',
          durationSeconds: 30,
          instruction:
            'Antes de empezar, toma una respiración lenta y reconoce que vas a trabajar solo un problema por vez.',
          uiHint: "Pantalla inicial con botón 'Comenzar'.",
        },
        {
          id: 'step_2',
          order: 2,
          title: 'Define el problema',
          type: 'define_problem',
          durationSeconds: 90,
          instruction:
            "Escribe el problema de la forma más específica posible. En vez de 'mi vida está desordenada', intenta algo como 'no he respondido un correo importante y eso me preocupa'.",
          uiHint:
            'Campo de texto con ejemplo de problema específico.',
        },
        {
          id: 'step_3',
          order: 3,
          title: 'Define qué te gustaría lograr',
          type: 'set_goal',
          durationSeconds: 60,
          instruction:
            "Escribe un objetivo pequeño y realista. No tiene que ser resolver todo, solo avanzar un poco. Ejemplo: 'Quiero enviar una respuesta inicial hoy'.",
          uiHint: 'Campo de texto para objetivo breve.',
        },
        {
          id: 'step_4',
          order: 4,
          title: 'Genera varias opciones',
          type: 'brainstorm_options',
          durationSeconds: 120,
          instruction:
            'Anota al menos 3 posibles acciones. No las evalúes todavía. Solo genera alternativas, aunque algunas no sean perfectas.',
          uiHint:
            'Lista editable con mínimo sugerido de 3 opciones.',
        },
        {
          id: 'step_5',
          order: 5,
          title: 'Evalúa ventajas y dificultades',
          type: 'evaluate_options',
          durationSeconds: 120,
          instruction:
            "Revisa cada opción y pregúntate: '¿Qué tan realista es?', '¿Qué tan útil sería?', '¿Qué tan difícil sería hacerla hoy o pronto?'.",
          uiHint:
            'Tabla simple con columnas: opción, utilidad, dificultad, realismo.',
        },
        {
          id: 'step_6',
          order: 6,
          title: 'Elige el siguiente paso',
          type: 'choose_next_step',
          durationSeconds: 90,
          instruction:
            'Selecciona la opción más realista y útil. Después conviértela en un paso concreto, pequeño y claro que puedas hacer pronto.',
          uiHint:
            "Botón para marcar una opción como 'Elegida'.",
        },
        {
          id: 'step_7',
          order: 7,
          title: 'Ponle fecha o momento',
          type: 'commitment',
          durationSeconds: 45,
          instruction:
            'Decide cuándo harás ese paso. Es mejor elegir una hora o momento concreto que dejarlo en general.',
          uiHint: 'Selector de fecha/hora o texto libre.',
        },
        {
          id: 'step_8',
          order: 8,
          title: 'Cierra el ejercicio',
          type: 'closing',
          durationSeconds: 45,
          instruction:
            "Haz una respiración lenta y repite mentalmente: 'No necesito resolver todo ahora; ya tengo un siguiente paso'.",
          uiHint: 'Pantalla final con resumen del plan.',
        },
      ],
      guidedExperience: {
        introText:
          'Vamos a tomar una preocupación concreta y convertirla en un plan pequeño y manejable.',
        stepPrompts: [
          'Haz una pausa',
          'Define el problema',
          'Define un objetivo pequeño',
          'Genera varias opciones',
          'Evalúa las opciones',
          'Elige el siguiente paso',
          'Decide cuándo hacerlo',
          'Cierra el ejercicio',
        ],
        midExercisePrompts: [
          'No busques la solución perfecta',
          'Lo importante es avanzar un poco',
          'Un paso pequeño sigue siendo progreso',
          'Resolver no siempre significa hacerlo todo hoy',
        ],
        completionText:
          'Bien hecho. Tener un siguiente paso claro puede ayudar a que el problema se sienta menos grande y menos abrumador.',
      },
      interactionModel: {
        primaryAction: 'start_exercise',
        secondaryActions: [
          'pause_exercise',
          'restart_exercise',
          'add_option',
          'select_best_option',
          'save_next_step',
        ],
        userInputs: [
          {
            id: 'problem_text',
            type: 'text_input',
            label:
              '¿Cuál es el problema concreto que quieres trabajar?',
          },
          {
            id: 'goal_text',
            type: 'text_input',
            label:
              '¿Qué te gustaría lograr con este problema?',
          },
          {
            id: 'options_list',
            type: 'list_input',
            label: 'Escribe posibles acciones',
          },
          {
            id: 'option_rating',
            type: 'multi_field_rating',
            label: 'Evalúa cada opción',
            fields: ['utilidad', 'dificultad', 'realismo'],
          },
          {
            id: 'chosen_next_step',
            type: 'text_input',
            label:
              '¿Cuál será tu siguiente paso concreto?',
          },
          {
            id: 'planned_time',
            type: 'datetime_picker',
            label: '¿Cuándo harás ese paso?',
          },
        ],
      },
      scoreSpecificMessages: [
        {
          range: { min: 3, max: 6 },
          message:
            'Este ejercicio está pensado para ayudarte a ordenar una preocupación concreta y convertirla en un paso claro y manejable.',
        },
      ],
      progressTracking: {
        completionDefinition:
          'Definir un problema, elegir una opción y guardar un siguiente paso concreto con momento estimado',
        track: [
          'durationSeconds',
          'completed',
          'problemDefined',
          'optionsGeneratedCount',
          'chosenOption',
          'nextStepSaved',
          'plannedTime',
          'selfReportedControlBefore',
          'selfReportedControlAfter',
        ],
        optionalCheckIn: {
          beforePrompt:
            'Antes de empezar, ¿qué tan fuera de control se siente este problema?',
          afterPrompt:
            'Ahora, ¿qué tan manejable se siente este problema?',
          scaleMin: 0,
          scaleMax: 10,
          scaleLabels: {
            min: 'Muy manejable',
            max: 'Muy fuera de control',
          },
        },
      },
      completionCriteria: {
        minimumOptionsGenerated: 2,
        recommendedOptionsGenerated: 3,
        mustHaveChosenNextStep: true,
      },
      commonDifficulties: [
        {
          issue: 'El usuario elige un problema demasiado grande',
          response:
            'Invitarlo a reducirlo a una sola parte concreta que sí pueda trabajarse hoy o pronto.',
        },
        {
          issue: 'No sabe qué opciones poner',
          response:
            'Sugerir empezar con opciones simples, incluso imperfectas, para romper el bloqueo.',
        },
        {
          issue: 'Quiere elegir la opción perfecta',
          response:
            'Recordarle que la mejor opción aquí es la más realista y útil, no la perfecta.',
        },
      ],
      nextStepSuggestions: [
        {
          when: { scoreBetween: [3, 6] },
          recommend: [
            {
              type: 'exercise',
              id: 'tiempo-de-preocupacion',
              reason:
                'Útil para ordenar otras preocupaciones que todavía no se han convertido en acción.',
            },
            {
              type: 'exercise',
              id: 'respiracion-diafragmatica',
              reason:
                'Ayuda si el problema todavía genera activación física antes o después del ejercicio.',
            },
            {
              type: 'test',
              id: 'gad7',
              reason:
                'Ayuda a estimar mejor la severidad de los síntomas.',
            },
          ],
        },
      ],
      clinicalDisclaimer:
        'Este ejercicio es una herramienta de apoyo y no sustituye atención profesional. Si tu ansiedad se intensifica, interfiere mucho con tu vida diaria o sientes que estás en riesgo, busca ayuda profesional o servicios de emergencia.',
    },
    sources: [],
    isPremium: false,
    isPublished: true,
  },
  {
    id: 'seed-facing-fears-exposicion-gradual',
    type: 'exercise',
    title: 'Facing fears / exposición gradual guiada',
    description:
      'Ejercicio guiado de exposición gradual para ayudar al usuario a reducir evitación, acercarse poco a poco a situaciones que le generan miedo y comprobar que puede tolerar la ansiedad sin escapar de inmediato.',
    topic: 'ansiedad',
    body: {
      id: 'facing-fears-exposicion-gradual-guiada',
      slug: 'facing-fears-exposicion-gradual-guiada',
      language: 'es-MX',
      category: 'behavioral',
      subCategory: 'graded_exposure',
      difficulty: 'intermediate',
      estimatedDurationMinutes: 15,
      durationRangeMinutes: {
        min: 10,
        max: 20,
      },
      recommendedFor: {
        testId: 'gad7',
        testTitle: 'GAD-7',
        scoreRanges: [
          {
            range: { min: 5, max: 9 },
            label: 'Ansiedad leve',
            priority: 6,
            reason:
              'Es útil cuando el usuario identifica una situación específica que evita por miedo y se siente lo suficientemente estable para practicar acercamientos graduales.',
          },
          {
            range: { min: 10, max: 14 },
            label: 'Ansiedad moderada',
            priority: 4,
            reason:
              'Es útil como parte de un trabajo más estructurado para reducir evitación y recuperar funcionamiento en situaciones concretas.',
          },
        ],
      },
      goal: 'Ayudar al usuario a acercarse de forma segura y gradual a una situación temida para reducir evitación, ganar confianza y aprender que la ansiedad puede bajar sin escapar.',
      therapeuticIntent: [
        'Reducir evitación',
        'Incrementar tolerancia al malestar',
        'Disminuir miedo anticipatorio',
        'Aumentar sensación de autoeficacia',
        'Generar aprendizaje correctivo frente a una situación temida',
      ],
      whenToUse: [
        'Cuando el usuario evita situaciones específicas por ansiedad',
        'Cuando hay miedo anticipatorio antes de ciertas actividades',
        'Cuando una evitación pequeña está empezando a limitar la rutina',
        'Cuando el usuario quiere recuperar una actividad concreta que ha dejado de hacer por miedo',
        'Como parte de una práctica repetida, no solo como ejercicio de una sola vez',
      ],
      avoidOrModifyIf: [
        'No usar este ejercicio para exponerse a situaciones realmente peligrosas o inseguras',
        'No usar este ejercicio con recuerdos traumáticos intensos sin acompañamiento profesional',
        'Si el usuario tiene síntomas severos, disociación, sensación de perder el control con mucha frecuencia o riesgo de hacerse daño, debe buscar ayuda profesional',
        'Si la ansiedad inicial es demasiado alta, empezar con un paso mucho más pequeño o usar primero un ejercicio de regulación',
        'Si el usuario necesita medicación de rescate o conductas de seguridad intensas para intentarlo, conviene replantear el nivel del paso',
      ],
      benefits: [
        'Ayuda a romper el ciclo de evitación y alivio momentáneo',
        'Reduce el miedo con práctica repetida',
        'Aumenta sensación de control',
        'Puede devolver actividades importantes al día a día',
        'Ayuda al usuario a descubrir que puede tolerar ansiedad sin escapar',
      ],
      preparation: {
        environment: [
          'Elige una situación real, específica y razonablemente segura',
          'Procura hacer el primer intento en un contexto controlado y con tiempo suficiente para no sentir prisa',
        ],
        materials: [
          'Escala de ansiedad del 0 al 10',
          'Lista o jerarquía de miedos dentro de la app',
          'Temporizador',
        ],
        selectionRule:
          'Empieza con una situación que provoque ansiedad baja o moderada, no con la más difícil. Idealmente elige un paso que se sienta entre 3 y 6 en una escala de ansiedad de 0 a 10.',
        beforeStartMessage:
          'El objetivo no es sentirte perfecto(a) ni eliminar toda la ansiedad. El objetivo es quedarte el tiempo suficiente para aprender que puedes tolerarla y que no siempre necesitas evitar.',
      },
      defaultProtocol: {
        totalDurationSeconds: 900,
        mode: 'graded_exposure',
        distressScale: {
          min: 0,
          max: 10,
        },
        recommendedStartIntensity: {
          min: 3,
          max: 6,
        },
        stayUntil: {
          type: 'either_or',
          conditions: [
            'permanecer al menos 5 minutos',
            'o notar que la ansiedad baja al menos 2 puntos',
            'o completar la tarea planeada sin escapar',
          ],
        },
      },
      alternativeProtocols: [
        {
          id: 'micro',
          label: 'Versión micro',
          totalDurationSeconds: 600,
          useWhen:
            'Cuando es la primera vez que el usuario hace exposición o cuando el paso elegido todavía se siente retador.',
        },
        {
          id: 'repeat-practice',
          label: 'Práctica repetida',
          totalDurationSeconds: 1200,
          useWhen:
            'Cuando el usuario repite el mismo paso varias veces para consolidar el aprendizaje.',
        },
      ],
      steps: [
        {
          id: 'step_1',
          order: 1,
          title: 'Identifica el miedo concreto',
          type: 'fear_identification',
          durationSeconds: 90,
          instruction:
            "Escribe una situación específica que sueles evitar por ansiedad. Debe ser concreta, por ejemplo: 'subir al elevador un piso', 'hacer una llamada breve' o 'entrar 5 minutos a una tienda'.",
          uiHint:
            'Campo de texto con ejemplos concretos y específicos.',
        },
        {
          id: 'step_2',
          order: 2,
          title: 'Haz una mini jerarquía',
          type: 'fear_ladder',
          durationSeconds: 120,
          instruction:
            'Divide ese miedo en pasos de menor a mayor dificultad. Crea al menos 3 niveles: fácil, medio y difícil.',
          uiHint:
            'Constructor de jerarquía con arrastrar y soltar o lista ordenable.',
        },
        {
          id: 'step_3',
          order: 3,
          title: 'Elige un paso manejable',
          type: 'step_selection',
          durationSeconds: 60,
          instruction:
            'Selecciona un paso que sientas entre 3 y 6 de ansiedad sobre 10. No elijas el más difícil para empezar.',
          uiHint:
            'Slider de ansiedad del 0 al 10 para cada paso.',
        },
        {
          id: 'step_4',
          order: 4,
          title: 'Prepárate sin escapar antes de empezar',
          type: 'setup',
          durationSeconds: 45,
          instruction:
            "Haz una respiración lenta y repite una frase breve como: 'Puedo intentar esto paso a paso' o 'No necesito sentirme perfecto(a) para empezar'. Evita usar esta preparación como forma de posponer indefinidamente.",
          uiHint:
            "Mostrar frase de apoyo breve y botón 'Estoy listo(a)'.",
        },
        {
          id: 'step_5',
          order: 5,
          title: 'Entra en la situación elegida',
          type: 'enter_exposure',
          durationSeconds: 180,
          instruction:
            'Haz el paso que elegiste. Quédate en la situación en vez de salir de inmediato. Observa lo que pasa en tu cuerpo y en tu mente sin pelearte con ello.',
          uiHint:
            "Temporizador visible y recordatorio: 'Quédate un poco más'.",
        },
        {
          id: 'step_6',
          order: 6,
          title: 'Mide tu ansiedad mientras te quedas',
          type: 'distress_rating',
          durationSeconds: 120,
          instruction:
            'Ponle un número a tu ansiedad del 0 al 10 al inicio, a la mitad y al final. Nota si sube, se mantiene o empieza a bajar.',
          uiHint:
            'Check-ins rápidos con slider de 0 a 10.',
        },
        {
          id: 'step_7',
          order: 7,
          title: 'Evita salir por alivio inmediato',
          type: 'response_prevention',
          durationSeconds: 90,
          instruction:
            'Si puedes hacerlo de forma segura, trata de no salir solo porque la ansiedad subió. Quédate el tiempo planeado o hasta notar que la intensidad cambia aunque sea un poco.',
          uiHint:
            "Mensaje breve: 'No huyas demasiado pronto si estás a salvo'.",
        },
        {
          id: 'step_8',
          order: 8,
          title: 'Registra lo que aprendiste',
          type: 'learning_review',
          durationSeconds: 120,
          instruction:
            "Al terminar, responde: '¿Qué temía que pasara?', '¿Qué pasó realmente?', '¿Qué descubrí sobre mi capacidad para tolerarlo?'.",
          uiHint:
            'Campos de texto guiados para reflexión breve.',
        },
        {
          id: 'step_9',
          order: 9,
          title: 'Decide el siguiente intento',
          type: 'next_step_planning',
          durationSeconds: 75,
          instruction:
            'Decide si repetirás el mismo paso otro día o si ya estás listo(a) para avanzar al siguiente nivel de la jerarquía.',
          uiHint:
            "Opciones: 'Repetir mismo paso' o 'Subir un nivel'.",
        },
      ],
      guidedExperience: {
        introText:
          'Vamos a acercarnos poco a poco a una situación que te genera miedo. No se trata de obligarte a lo más difícil, sino de practicar un paso manejable y quedarte lo suficiente para aprender de la experiencia.',
        stepPrompts: [
          'Identifica el miedo concreto',
          'Crea una mini jerarquía',
          'Elige un paso manejable',
          'Prepárate para empezar',
          'Entra en la situación',
          'Mide tu ansiedad',
          'Quédate un poco más',
          'Registra lo que aprendiste',
          'Planea el siguiente intento',
        ],
        midExercisePrompts: [
          'La ansiedad puede subir y luego cambiar',
          'Tu meta no es sentirte perfecto(a), es quedarte y aprender',
          'Respira para mantenerte presente, no para escapar de la experiencia',
          'Cada repetición ayuda a debilitar la evitación',
        ],
        completionText:
          'Bien hecho. Aunque haya sido incómodo, acercarte en vez de evitar ya es una forma de entrenamiento. Repetir pasos manejables suele ser más útil que intentar uno demasiado difícil.',
      },
      interactionModel: {
        primaryAction: 'start_exercise',
        secondaryActions: [
          'pause_exercise',
          'restart_exercise',
          'edit_fear_ladder',
          'rate_anxiety',
          'save_learning',
        ],
        userInputs: [
          {
            id: 'fear_description',
            type: 'text_input',
            label:
              '¿Qué situación sueles evitar por ansiedad?',
          },
          {
            id: 'fear_ladder',
            type: 'ordered_list_input',
            label:
              'Ordena tus pasos de menor a mayor dificultad',
          },
          {
            id: 'selected_step',
            type: 'single_choice',
            label: '¿Qué paso vas a practicar hoy?',
          },
          {
            id: 'anxiety_rating_start',
            type: 'scale',
            label:
              '¿Cuánta ansiedad sientes antes de empezar?',
            min: 0,
            max: 10,
          },
          {
            id: 'anxiety_rating_mid',
            type: 'scale',
            label:
              '¿Cuánta ansiedad sientes a la mitad?',
            min: 0,
            max: 10,
          },
          {
            id: 'anxiety_rating_end',
            type: 'scale',
            label:
              '¿Cuánta ansiedad sientes al final?',
            min: 0,
            max: 10,
          },
          {
            id: 'predicted_outcome',
            type: 'text_input',
            label: '¿Qué temías que pasara?',
          },
          {
            id: 'actual_outcome',
            type: 'text_input',
            label: '¿Qué pasó realmente?',
          },
          {
            id: 'learning_note',
            type: 'text_input',
            label: '¿Qué aprendiste de este intento?',
          },
        ],
      },
      scoreSpecificMessages: [
        {
          range: { min: 5, max: 9 },
          message:
            'Este ejercicio puede ayudarte si tu ansiedad aparece sobre todo al evitar situaciones concretas y quieres recuperar confianza paso a paso.',
        },
        {
          range: { min: 10, max: 14 },
          message:
            'Este ejercicio puede ser útil como parte de un trabajo más estructurado para reducir evitación, pero conviene empezar con pasos pequeños y muy claros.',
        },
      ],
      progressTracking: {
        completionDefinition:
          'Elegir un paso de la jerarquía, realizar un intento de exposición y guardar al menos un aprendizaje del ejercicio',
        track: [
          'durationSeconds',
          'completed',
          'fearDescription',
          'selectedStep',
          'anxietyRatingStart',
          'anxietyRatingMid',
          'anxietyRatingEnd',
          'predictedOutcome',
          'actualOutcome',
          'learningNote',
          'repeatPlanned',
        ],
        optionalCheckIn: {
          beforePrompt:
            'Antes de empezar, ¿qué tan capaz te sientes de intentar este paso?',
          afterPrompt:
            'Ahora, ¿qué tan capaz te sientes de volver a intentarlo?',
          scaleMin: 0,
          scaleMax: 10,
          scaleLabels: {
            min: 'Nada capaz',
            max: 'Muy capaz',
          },
        },
      },
      completionCriteria: {
        mustHaveFearLadder: true,
        mustHaveSelectedStep: true,
        mustHaveExposureAttempt: true,
        mustHaveLearningRecorded: true,
      },
      commonDifficulties: [
        {
          issue:
            'El usuario quiere empezar con el paso más difícil',
          response:
            'Sugerir comenzar con un paso más pequeño para aumentar probabilidad de práctica repetida y aprendizaje útil.',
        },
        {
          issue:
            'La ansiedad sube rápido y quiere escapar',
          response:
            'Recordarle que el objetivo es quedarse un poco más si está a salvo, no demostrar valentía perfecta ni sufrir innecesariamente.',
        },
        {
          issue: 'No nota mejoría en un solo intento',
          response:
            'Explicar que la exposición funciona mejor con repeticiones consistentes del mismo paso antes de subir de nivel.',
        },
      ],
      nextStepSuggestions: [
        {
          when: { scoreBetween: [5, 9] },
          recommend: [
            {
              type: 'exercise',
              id: 'respiracion-diafragmatica',
              reason:
                'Útil antes o después de la práctica para regular activación física sin convertirla en una forma de evitación.',
            },
            {
              type: 'exercise',
              id: 'visualizacion-lugar-seguro',
              reason:
                'Puede ayudar al usuario a recuperar sensación de calma después del intento.',
            },
          ],
        },
        {
          when: { scoreBetween: [10, 14] },
          recommend: [
            {
              type: 'exercise',
              id: 'tiempo-de-preocupacion',
              reason:
                'Útil si además de evitación hay mucha anticipación mental o preocupación repetitiva.',
            },
            {
              type: 'exercise',
              id: 'resolucion-de-problemas-basica',
              reason:
                'Ayuda cuando parte de la ansiedad está asociada a decisiones o problemas concretos alrededor de la situación temida.',
            },
          ],
        },
      ],
      clinicalDisclaimer:
        'Este ejercicio es una herramienta de apoyo y no sustituye atención profesional. No debe usarse para exponerse a peligros reales. Si tu ansiedad es muy intensa, tienes síntomas severos, trauma no trabajado o sientes que podrías estar en riesgo, busca ayuda profesional.',
    },
    sources: [],
    isPremium: false,
    isPublished: true,
  },
];
