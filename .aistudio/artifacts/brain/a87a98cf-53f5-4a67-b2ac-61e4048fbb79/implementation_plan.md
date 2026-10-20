# PRL Naval Quest - Simulador Interactivo 2D de Prevención de Riesgos Laborales (PRL)

PRL Naval Quest es un simulador formativo en 2D con vista cenital estilo RPG/Zelda clásico ambientado en un entorno naval y astillero. Permite a los alumnos controlar a un técnico de mantenimiento en escenarios interactivos reales (Taller de Mantenimiento y Muelle con Embarcación), afrontando entre 8 y 10 retos de seguridad por sesión con toma de decisiones que impactan su salud (vidas) y su calificación numérica directa (de 1.0 a 10.0), incluyendo la posibilidad de exportar el simulador en un único archivo HTML descargable para su entrega o uso sin conexión.

## Decisiones Críticas y Resumen de Preferencias

> [!IMPORTANT]
> **Estructura Pedagógica y Calificación**:
> - **5 Sesiones planificadas**: Sesión 1 (Taller de Mantenimiento y Evaluación), Sesión 2 (El Muelle y Productos Químicos / Antifouling), Sesión 3 (Trabajo en Altura), Sesión 4 (La Sentina y Espacios Confinados), Sesión 5 (Varadero y Emergencias).
> - **8 a 10 retos interactivos por nivel**: En esta fase se implementan de forma completa y jugable el **Nivel 1 (Taller)** ampliado a 8 retos exhaustivos y el **Nivel 2 (Muelle)** con 8 retos específicos de pintura química, ventilación y EPIs, además del selector y estructura para las sesiones 3, 4 y 5.
> - **Sistema de Calificación 1 a 10**: Cada sesión arranca con una base pedagógica de 5.0 (aprobado raspado). Cada respuesta correcta suma entre +0.5 y +0.7 puntos hasta un máximo de 10.0, mientras que errores o negligencias restan nota (-0.5 a -1.0) y descuentan vidas (accidentes laborales con mensaje de retroalimentación preventiva inmediata).
> - **Representación Visual Gráfica en Escenario Real**: En lugar de simples cajas de texto o círculos abstractos, el Canvas 2D renderiza los elementos del astillero: silueta del casco del barco en varada/muelle con soporte, bancos de trabajo con mordazas y herramientas, estanterías de químicos y EPIs, campanas de aspiración con indicador de flujo, bidones de residuos homologados con pictogramas CLP, agua del muelle con reflejos y bolardos de amarre.
> - **Personaje Técnico Real**: Sprite del técnico con casco de seguridad azul, mono de trabajo y herramientas (basado en el modelo aportado), con movimiento en 4 direcciones, animación de paso y cambio de postura al interactuar.
> - **Exportación HTML Autónoma**: Botón en la interfaz para descargar todo el juego compilado en un archivo único `.html` sin dependencias externas para compartir directamente con el alumnado en plataformas como Moodle, Classroom o ejecutarlo en local sin servidor.

---

## 1. Visión General y Concepto Pedagógico

- **Objetivo Educativo**: Capacitar a alumnos de ciclos formativos de Formación Profesional (FP Marítimo-Pesquera, Mantenimiento Electromecánico, Transporte y Mantenimiento de Vehículos, y PRL) en la identificación de riesgos y aplicación de la Ley 31/1995 de Prevención de Riesgos Laborales.
- **Público Objetivo**: Alumnado y profesorado de prevención y formación técnica naval.
- **Propuesta de Valor**: Sustituir cuestionarios teóricos monótonos por una experiencia inmersiva de exploración libre estilo Zelda donde el alumno camina físicamente hacia los focos de peligro, inspecciona la maquinaria y toma decisiones de campo con consecuencias visuales e inmediatas.

---

## 2. Experiencia de Usuario y Diseño Visual

### A. Escenario del Nivel 1: Taller de Mantenimiento Naval
- **Suelo del taller**: Pavimento industrial de hormigón pulido con delimitaciones de pasillos en amarillo y negro.
- **Barco en seco**: Casco de embarcación de fibra de vidrio sustentado por cunas de varada, mostrando zonas con polvo blanco de lijado.
- **Bancos de trabajo**: Mesas de madera reforzada con tornillos de banco, taladro de columna y cables eléctricos.
- **Zona de aspiración y ventilación**: Conducto y campana extractora de polvo con filtros HEPA.
- **Armario de EPIs y Botiquín**: Armario metálico con mascarillas FFP2/FFP3, gafas integrales y pantalla facial.
- **Bidones de residuos peligrosos**: Contenedores sellados con etiquetas de residuos tóxicos para fibras y disolventes.
- **Retos del Nivel 1 (8 retos completos)**:
  1. *Lijadora de Casco*: Selección de herramienta con aspiración integrada vs. manual desprovista.
  2. *Armario de EPIs*: Mascarilla FFP2/FFP3 + gafas de montura estanca vs. gafas normales.
  3. *Evaluación del Riesgo con Manuel*: Matriz de probabilidad x severidad del polvo de fibra (Riesgo Importante).
  4. *Campana de Ventilación*: Encendido previo del sistema de captación localizada antes de emitir polvo.
  5. *Gestión de Residuos de Pulido*: Vertido en contenedor clasificado de residuos peligrosos vs. basura común.
  6. *Seguridad Eléctrica del Banco*: Comprobación de aislamiento doble, clavija con toma de tierra y cables sin empalmes caseros.
  7. *Panel de Señalización de Seguridad*: Colocación de señal de obligación azul (uso obligatorio de mascarilla y protección ocular).
  8. *Marco Normativo LPRL con Carlos*: Identificación del Art. 14 de la Ley 31/1995 (derecho a una protección eficaz).

### B. Escenario del Nivel 2: El Muelle y Productos Químicos (Antifouling)
- **Entorno exterior marítimo**: Pantalán de madera y hormigón, agua marina con ondas animadas, bolardos y cabos de amarre.
- **Embarcación amarrada**: Casco con su línea de flotación y la obra viva (parte sumergida) lista para el pintado antiincrustante.
- **Estación de mezclado y almacenamiento químico**: Cubeto de retención antifugas para latas de pintura y disolventes.
- **Ducha y lavaojos de emergencia**: Estación de descontaminación rápida con señal verde de salvamento.
- **Retos del Nivel 2 (8 retos completos)**:
  1. *Ficha de Datos de Seguridad (FDS / SDS)*: Consulta de frases H y P antes de abrir los envases de antifouling.
  2. *Selección de Guantes para Químicos*: Guantes de nitrilo/neopreno específicos para hidrocarburos vs. guantes de látex domésticos.
  3. *Protección de Vías Respiratorias*: Máscara con filtro combinado para vapores orgánicos (A1/A2) y partículas (P3).
  4. *Condiciones de Ventilación y Viento*: Pintar a favor del viento en zona abierta sin acumulación de gases pesados.
  5. *Prevención de Vertidos al Mar*: Colocación de lona impermeable y cubetos de retención bajo la embarcación.
  6. *Herramientas Antichispa*: Uso de agitadores y paletinas no férricas que impidan chispas en atmósferas con disolventes.
  7. *Actuación ante Salpicadura en la Piel*: Lavado inmediato con agua abundante a baja presión durante 15 minutos.
  8. *Almacenamiento y Cierre de Envases*: Sellado hermético de latas usadas y retorno a armario ignífugo ventilado.

### C. Sistema de Interacción y HUD
- **HUD superior integrado**: Nombre del alumno, sesión activa, vidas (3 corazones), barra de progreso de nota (1.0 a 10.0 con código de color dinámico) y porcentaje de retos resueltos.
- **Indicador flotante de proximidad**: Indicador animado `[ E / ESPACIO ]` al acercarse a un objeto o personaje interactivo.
- **Modal de Reto / Pregunta**: Panel con contexto pedagógico, consecuencias detalladas de cada alternativa y explicación técnica preventiva tras responder.
- **Panel de Evaluación y Emisión de Informe**: Resumen final con nota numérica exacta, desglose de aciertos/errores, tiempo empleado y botón para imprimir o descargar el informe en PDF / HTML.

---

## 3. Decisiones de Arquitectura Técnica y Estrategia

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRL NAVAL QUEST ENGINE                          │
├───────────────────────────────┬────────────────────────────────────────┤
│      CANVAS 2D GAME ENGINE    │            ACADEMIC HUD & MODALS       │
│  - Tilemap / Escenarios       │  - Marcador de Nota (1.0 a 10.0)       │
│    (Taller N1 / Muelle N2)    │  - Contador de Vidas & Accidentes      │
│  - Renderizado Técnico Real   │  - Desafíos con feedback pedagógico    │
│    (Casco, Guantes, Cables)   │  - Informe de Evaluación / Rúbrica     │
│  - Motor de Colisiones        │  - Exportador HTML autónomo            │
│  - Sprite del Técnico         │                                        │
├───────────────────────────────┴────────────────────────────────────────┤
│                     DATA & SIMULATION STATE STORE                      │
│  - Session Levels (1 to 5) with full 8-10 challenge trees              │
│  - Real-time scoring calculation & penalty matrix                      │
│  - LocalStorage progress recovery & student identity                   │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Motor Gráfico en HTML5 Canvas con React**:
   - Renderizado optimizado a 60 FPS con doble buffer en Canvas para los escenarios navales (suelos texturizados, casco de barco, boyas, agua animada, bancos con herramientas).
   - Movimiento fluido mediante WASD / Teclas de flecha y soporte táctil para dispositivos móviles / tablets con D-Pad virtual.
2. **Generador de Escenarios Navales Paramétricos**:
   - Funciones de dibujo vectorial precisas en Canvas que generan elementos reconocibles (líneas de flotación, herramientas, armarios de seguridad, cuadros eléctricos, olas de agua, boyas de amarre) sin depender de imágenes externas que puedan fallar en entornos cerrados.
3. **Módulo de Exportación HTML Autónomo**:
   - Generación de un archivo `.html` autocontenido con todo el código JS, CSS y datos embebidos mediante un Blob descargable, permitiendo al docente y a los alumnos usarlo en cualquier aula de informática sin conexión a internet.
4. **Respaldo de Notas y Seguridad Educativa**:
   - Guardado del historial de respuestas, cálculo ponderado de la nota y posibilidad de generar un informe de evaluación imprimible o descargable.

---

## 4. Plan de Ejecución por Fases

1. **Estructura de Datos y Banco de Retos**:
   - Definición del modelo TypeScript para Retos, Opciones, Efectos sobre nota y vidas, y Explicaciones pedagógicas.
   - Creación de los 8 retos para el Nivel 1 (Taller) y 8 retos para el Nivel 2 (Muelle y Antifouling).
2. **Motor Gráfico y Renderizado del Astillero**:
   - Dibujo detallado del Taller (barco en grada, bancos, lijadora, aspiración, armario, residuos).
   - Dibujo detallado del Muelle (embarcación amarrada sobre agua animada, cubetos químicos, ducha de emergencia, bolardos).
   - Personaje animado con casco azul, mono y dirección de movimiento.
3. **Lógica de Calificación, HUD y Modales de Pregunta**:
   - Control de nota continua con tope mínimo 1.0 y máximo 10.0.
   - Sistema de corazones y penalización por accidente laboral con retroalimentación correctiva.
4. **Selector de Sesiones, Pantalla de Resultados y Exportador**:
   - Menú de sesiones para seleccionar Nivel 1 o Nivel 2 (y visualización de los próximos niveles 3, 4 y 5).
   - Pantalla de evaluación con nota final de la sesión, desglose y botón de exportación HTML / Impresión.
