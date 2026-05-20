export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: number
  content: string
  tags: string[]
}

export const categories = [
  'Disciplina',
  'Hábitos',
  'Vicios',
  'Gym',
  'Programación',
  'IA',
  'Mentalidad',
  'Build in Public',
]

export const blogPosts: BlogPost[] = [
  {
    slug: 'dopamina-sistema-control',
    title: 'Dopamina: cómo construí un sistema de control real',
    excerpt: 'Documentando el proceso de romper con el ciclo de dopamina instantánea. No es motivación. Es arquitectura conductual.',
    category: 'Vicios',
    date: '2026-05-10',
    readTime: 8,
    tags: ['dopamina', 'disciplina', 'sistema'],
    content: `
## El problema con la dopamina instantánea

No es que seas débil. Es que tu sistema nervioso está optimizado para recompensas inmediatas en un entorno que las entrega con fricción cero.

TikTok. Pornografía. Comida procesada. Redes sociales. Todos estos sistemas están diseñados por ingenieros con doctorados en psicología conductual para maximizar el tiempo que pasas en su plataforma.

Tú no eres el usuario. Eres el producto.

## El protocolo de recalibración

Lo que funcionó para mí no fue fuerza de voluntad. Fue diseño de entorno.

**Semana 1-2: Fricción de entrada**
- Eliminar apps del teléfono (no silenciar, eliminar)
- Poner el teléfono en otra habitación durante bloques de trabajo
- Substituir el scroll por una actividad con 10 segundos de retraso

**Semana 3-4: Sustitución de recompensa**
- Gym como recompensa de dopamina legítima
- Lectura técnica en bloques de 25 minutos
- Sauna/ducha fría como reinicio del sistema nervioso

**Semana 5+: Recalibración sistémica**
- La dopamina lenta empieza a sentirse mejor
- El trabajo profundo genera flow genuino
- Las recompensas falsas pierden potencia

## Métricas actuales

Llevo 47 días sin redes sociales en el teléfono. Los resultados en productividad son measurables. El foco en bloques de deep work aumentó de 35 minutos promedio a 94 minutos.

No es motivación. Es ingeniería conductual aplicada a ti mismo.
    `,
  },
  {
    slug: 'gym-disciplina-arquitectura',
    title: 'El gym como arquitectura de disciplina',
    excerpt: 'Por qué el entrenamiento físico no es sobre la estética. Es sobre la construcción del sistema nervioso disciplinado.',
    category: 'Gym',
    date: '2026-05-05',
    readTime: 6,
    tags: ['gym', 'disciplina', 'hábitos'],
    content: `
## No entrenas el músculo. Entrenas la identidad.

Cada vez que vas al gym cuando no quieres ir, estás votando por la identidad de una persona disciplinada.

Esto no es metáfora. Es neurociencia. Los comportamientos repetidos forman vías neuronales que eventualmente se convierten en la ruta por defecto de tu cerebro.

## El protocolo de entrenamiento actual

**Lunes/Miércoles/Viernes: Upper**
- Press banca 4x6
- Remo con barra 4x8
- Press militar 3x8
- Curl + Tríceps 3x12

**Martes/Jueves/Sábado: Lower**
- Sentadilla 4x6
- Peso muerto rumano 3x10
- Prensa 3x12
- Pantorrillas + Core

**Principio operativo:** Consistencia sobre intensidad. Aparecer siempre es más importante que tener la sesión perfecta.

## Métricas de progreso

Peso inicial: 67kg | Actual: 73kg (+6kg en 4 meses)
Bench press: 40kg | Actual: 72.5kg
Sentadilla: 50kg | Actual: 95kg

El número importa menos que el proceso. El proceso es el objetivo.
    `,
  },
  {
    slug: 'deep-work-protocolo',
    title: 'Deep Work: el protocolo que uso para programar 5 horas seguidas',
    excerpt: 'Sistema de trabajo profundo para desarrolladores. Entorno, bloques, rituales y recuperación.',
    category: 'Programación',
    date: '2026-04-28',
    readTime: 7,
    tags: ['deep work', 'programación', 'productividad'],
    content: `
## El problema del desarrollador moderno

Tienes 8 horas de trabajo disponibles. Terminas el día con 90 minutos de trabajo real hecho. El resto fue ruido: notificaciones, reuniones sin agenda, cambios de contexto.

El trabajo de programación requiere estado de flow. El estado de flow requiere entre 15-20 minutos de warm-up ininterrumpido. Cada interrupción reinicia el contador.

## El protocolo de 5 horas

**Bloque de mañana: 06:00 - 11:00**
- 05:30: Despertar, agua, sin teléfono
- 05:45: 15 min de revisión del día anterior + definición de tarea principal
- 06:00: Inicio del bloque. Sin teléfono. Sin notificaciones. Sin redes.
- 08:30: Pausa de 15 minutos. Caminar. Sin pantallas.
- 08:45: Segundo bloque de 2h15
- 11:00: Revisión. Commit. Documentación.

**Rituales de entrada al flow:**
- Misma playlist (sin letra) todos los días
- Cerrar todas las tabs excepto el editor y la documentación
- Escribir en papel: "El objetivo de hoy es ___"
- Agua y café preparados antes del bloque

## Resultados después de 60 días

Productividad medible por líneas de código/features completadas: +340%
Tiempo promedio en flow state: de 22 min a 78 min
Bugs en producción: -60% (la concentración reduce errores)

El deep work no es una técnica de productividad. Es un estilo de vida.
    `,
  },
  {
    slug: 'build-in-public-30-dias',
    title: 'Build in Public: 30 días documentando públicamente',
    excerpt: 'Qué aprendí después de 30 días mostrando el proceso real. La vulnerabilidad pública como herramienta de accountability.',
    category: 'Build in Public',
    date: '2026-04-20',
    readTime: 5,
    tags: ['build in public', 'accountability', 'comunidad'],
    content: `
## Por qué construir en público

La primera razón es egoísta: la accountability pública es el mejor sistema de motivación que existe.

Cuando nadie te ve, es fácil ceder. Cuando 500 personas siguen tu proceso, ceder tiene un costo social real.

No es sobre los seguidores. Es sobre el sistema de compromiso que creas contigo mismo.

## Los 30 días: datos reales

Publicaciones: 47 (TikTok + Twitter)
Días sin publicar: 3
Seguidores ganados: +1,247
DMs recibidos con "esto me inspiró a empezar": 89
Días que quise dejarlo: 7
Días que realmente dejé algo: 0

## Lecciones de 30 días

**1. La consistencia supera la calidad**
Los videos perfectos tienen menos impacto que la presencia diaria. La gente sigue a personas, no a contenido.

**2. La vulnerabilidad auténtica genera conexión real**
Los días malos, los fracasos, los momentos de duda — eso conecta más que los éxitos.

**3. El proceso público cambia el proceso privado**
Saber que vas a publicar te hace más intencional. Te preguntas: "¿Esto vale la pena documentar?" Y esa pregunta te hace hacer cosas que valgan la pena.

El objetivo no es la audiencia. El objetivo es construir algo real. La audiencia es consecuencia.
    `,
  },
  {
    slug: 'mentalidad-identidad-primer-principio',
    title: 'Identidad antes que comportamiento',
    excerpt: 'Por qué los sistemas de hábitos fracasan sin el cambio de identidad primero. El primer principio de la transformación real.',
    category: 'Mentalidad',
    date: '2026-04-15',
    readTime: 6,
    tags: ['mentalidad', 'identidad', 'hábitos atómicos'],
    content: `
## El error más común en el desarrollo personal

La mayoría intenta cambiar comportamientos. "Voy a ir al gym", "voy a dejar de fumar", "voy a estudiar más".

El problema es que estos son objetivos de resultado, no cambios de identidad.

La pregunta correcta no es "¿qué quiero hacer?" sino "¿quién quiero ser?"

## La inversión del proceso

**Mal proceso:** Objetivo → Comportamiento → Resultado
**Buen proceso:** Identidad → Comportamiento → Resultado

Cuando te defines como "una persona disciplinada", cada decisión pasa por el filtro: "¿Es esto lo que haría una persona disciplinada?"

No estás forzando un comportamiento. Estás expresando una identidad.

## Cómo cambié mi identidad

No fue un momento de revelación. Fue un proceso de acumulación de evidencia.

Cada pequeña acción consistente con la nueva identidad añade un voto a "soy ese tipo de persona". Con el tiempo, los votos se acumulan y la evidencia se vuelve irrefutable.

La identidad no se declara. Se construye.
    `,
  },
  {
    slug: 'ia-herramienta-desarrollador-disciplinado',
    title: 'IA como herramienta del desarrollador disciplinado',
    excerpt: 'Cómo integro herramientas de IA en mi flujo sin perder la capacidad de pensar. El protocolo de amplificación.',
    category: 'IA',
    date: '2026-04-08',
    readTime: 9,
    tags: ['IA', 'programación', 'productividad', 'deep work'],
    content: `
## El debate equivocado

Todo el mundo debate si la IA va a "reemplazar" a los programadores. Ese no es el debate relevante.

El debate relevante es: ¿Cómo usas la IA para amplificar tu capacidad sin perder tu capacidad de pensar?

## El protocolo de amplificación

**Regla 1: Primero piensa, luego pregunta**
Antes de usar una herramienta de IA, pasa al menos 10 minutos intentando resolver el problema tú mismo. Esto mantiene activo tu músculo de resolución de problemas.

**Regla 2: Entiende lo que aceptas**
Nunca copies código que no entiendes. Si la IA genera una solución, léela línea por línea hasta que puedas explicarla con tus propias palabras.

**Regla 3: Usa IA para la arquitectura, no para el pensamiento**
La IA es buena en boilerplate, documentación, refactoring de patrones conocidos. No la uses para decisiones arquitectónicas — ahí está el valor real del desarrollador.

## Las herramientas actuales

- **Claude:** Para razonamiento técnico complejo y arquitectura
- **GitHub Copilot:** Para autocompletado contextual en el editor
- **Perplexity:** Para investigación técnica rápida con fuentes
- **NotebookLM:** Para procesar documentación larga

El desarrollador disciplinado usa la IA como un acelerador, no como un sustituto. La diferencia está en si desarrollas o pierdes tu capacidad de razonamiento.
    `,
  },
]
