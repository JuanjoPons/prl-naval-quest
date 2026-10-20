import { LevelConfig } from '../types/prl';

export const LEVELS_DATA: Record<number, LevelConfig> = {
  1: {
    id: 1,
    name: 'Sesión 1: Taller de Mantenimiento y Evaluación de Riesgos',
    subtitle: 'Lijado de fibra de vidrio, captación de polvo y seguridad eléctrica',
    location: 'Taller Principal de Reparaciones Navales',
    description: 'Afronta las tareas de acondicionamiento del casco en el taller: identifica los riesgos del polvo de fibra, selecciona EPIs adecuados, opera maquinaria eléctrica segura y gestiona los residuos peligrosos.',
    targetCompetencies: [
      'Evaluación de riesgos según severidad y probabilidad',
      'Selección de EPIs para vías respiratorias y ojos (RD 773/1997)',
      'Sistemas de ventilación y extracción localizada',
      'Seguridad eléctrica en herramientas portátiles (RD 614/2001)',
      'Señalización de seguridad y gestión de residuos de lijado',
      'Marco legal de derechos y deberes (Ley 31/1995 LPRL)'
    ],
    startingX: 90,
    startingY: 310,
    challenges: [
      {
        id: 101,
        x: 160,
        y: 160,
        type: 'tool',
        name: 'Lijadora de Casco',
        roleOrSub: 'Herramienta de lijado',
        title: 'Reto 1: Selección de Herramienta de Lijado',
        desc: 'Debes pulir el casco de fibra de vidrio en la grada de trabajo. Hay riesgo inminente de emisión masiva de microfibras irritantes. ¿Qué equipo utilizas?',
        options: [
          {
            text: 'Lijadora orbital con sistema de aspiración neumática integrada acoplada a filtro',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Excelente: La prevención en origen (captación de polvo en la propia máquina) reduce hasta un 90% las partículas en suspensión antes de que alcancen el aire respirable.'
          },
          {
            text: 'Lijadora manual abierta convencional sin toma de captación',
            scoreDelta: -0.6,
            correct: false,
            damage: true,
            explanation: 'Peligro: El lijado abierto sin extracción inunda el taller de microesquirlas de vidrio en suspensión, provocando irritación ocular y riesgo respiratorio para todo el equipo.'
          }
        ],
        completed: false
      },
      {
        id: 102,
        x: 290,
        y: 130,
        type: 'epi',
        name: 'Armario de EPIs',
        roleOrSub: 'Protección individual',
        title: 'Reto 2: Selección de Protección Respiratoria y Ocular',
        desc: 'Vas a intervenir en una zona donde habrá polvo de resina y fibra de vidrio en suspensión. ¿Qué conjunto de EPIs seleccionas del armario?',
        options: [
          {
            text: 'Mascarilla autofiltrante FFP2/FFP3 + Gafas integrales de montura estanca contra polvo',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Correcto: Las gafas estancas impiden la entrada lateral de partículas abrasivas y el filtro FFP2/FFP3 retiene microfibras inhalables de acuerdo al RD 773/1997.'
          },
          {
            text: 'Gafas de sol convencionales de trabajo y mascarilla higiénica de tela',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: 'Accidente Ocular: Las gafas convencionales no tienen sellado facial perimetral y las mascarillas higiénicas no ofrecen retención de partículas nocivas. ¡Pierdes 1 vida!'
          }
        ],
        completed: false
      },
      {
        id: 103,
        x: 440,
        y: 140,
        type: 'npc',
        name: 'Manuel',
        roleOrSub: 'Jefe de Taller',
        title: 'Reto 3: Metodología de Evaluación del Riesgo',
        desc: 'Manuel te pregunta: "Antes de arrancar la jornada, ¿cómo clasificas formalmente el riesgo del polvo de fibra de vidrio en este espacio cerrado?"',
        options: [
          {
            text: 'Riesgo Importante: Consecuencias extremadamente dañinas y probabilidad media de inhalación',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Muy bien: En la metodología general del INSST, un daño respiratorio crónico con exposición continua clasifica como Riesgo Importante y exige medidas correctoras inmediatas.'
          },
          {
            text: 'Riesgo Trivial o Tolerable: Es solo polvo doméstico y no requiere planificación',
            scoreDelta: -0.5,
            correct: false,
            explanation: 'Incorrecto: Menospreciar el polvo de resinas poliéster y fibra puede desencadenar silicosis, neumoconiosis y asma ocupacional.'
          }
        ],
        completed: false
      },
      {
        id: 104,
        x: 600,
        y: 140,
        type: 'ventilation',
        name: 'Campana de Aspiración',
        roleOrSub: 'Extracción localizada',
        title: 'Reto 4: Protocolo de Ventilación y Extracción Localizada',
        desc: 'El taller cuenta con una chimenea y brazos móviles de extracción localizada. ¿Cuál es el orden de encendido correcto?',
        options: [
          {
            text: 'Encender y comprobar el caudal de la extracción ANTES de iniciar el trabajo y mantenerla 5 min tras terminar',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Perfecto: La ventilación debe funcionar antes de la generación del aerosol para crear el flujo laminar y mantenerse al finalizar para purgar el aire residual.'
          },
          {
            text: 'Encender la ventilación únicamente si el taller se nubla de polvo visible',
            scoreDelta: -0.5,
            correct: false,
            explanation: 'Fallo preventivo: Cuando el polvo es visible a simple vista, la concentración en el ambiente ya supera con creces los límites de exposición profesional (VLA-ED).'
          }
        ],
        completed: false
      },
      {
        id: 105,
        x: 690,
        y: 280,
        type: 'waste',
        name: 'Bidón de Residuos',
        roleOrSub: 'Gestión ambiental y PRL',
        title: 'Reto 5: Disposición de Residuos de Fibra y Disolventes',
        desc: 'Has terminado de lijar. Hay discos gastados impregnados de polvillo y trapos con disolvente de limpieza. ¿Dónde los depositas?',
        options: [
          {
            text: 'En el contenedor estanco metálico debidamente etiquetado como Residuo Peligroso',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Impecable: Los trapos impregnados con resinas o disolventes pueden generar combustión espontánea y contaminar el entorno. Deben ir a gestor autorizado.'
          },
          {
            text: 'En la papelera común de restos orgánicos o junto a los restos de madera',
            scoreDelta: -0.6,
            correct: false,
            explanation: 'Infracción Medioambiental y Grave en PRL: El vertido inadecuado genera riesgo de incendio y vapores tóxicos en el interior del taller.'
          }
        ],
        completed: false
      },
      {
        id: 106,
        x: 620,
        y: 440,
        type: 'electrical',
        name: 'Cuadro Eléctrico y Banco',
        roleOrSub: 'Riesgo eléctrico',
        title: 'Reto 6: Seguridad Eléctrica de las Herramientas Portátiles',
        desc: 'Vas a enchufar la pulidora en el banco de trabajo. Observas el cable, la clavija y el cuadro eléctrico. ¿Qué verificas según el RD 614/2001?',
        options: [
          {
            text: 'Doble aislamiento (símbolo doble cuadrado), cable sin empalmes ni fisuras y conexión con diferencial operativo',
            scoreDelta: 0.7,
            correct: true,
            explanation: 'Sobresaliente: La verificación visual de conductores, carcasas aisladas y protección diferencial de 30mA salva vidas ante contactos indirectos.'
          },
          {
            text: 'Conectar rápidamente a una regleta sobrecargada aunque tenga cinta aislante en el cable pelado',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: '¡Electrocución!: El cable deteriorado provoca un contacto eléctrico directo y chispazo. Pierdes 1 vida por no revisar los equipos de trabajo.'
          }
        ],
        completed: false
      },
      {
        id: 107,
        x: 380,
        y: 470,
        type: 'sign',
        name: 'Panel de Señalización',
        roleOrSub: 'Señalización de seguridad',
        title: 'Reto 7: Señalización Adecuada del Área de Lijado',
        desc: 'El área de lijado debe delimitarse para que terceros no ingresen sin protección. ¿Qué señalética oficial instalas en los accesos?',
        options: [
          {
            text: 'Señales redondas azules de obligación (uso de mascarilla y gafas) y balizamiento perimetral',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Correcto: Las señales circulares de fondo azul con pictograma blanco indican obligación según el RD 485/1997 sobre señalización de seguridad.'
          },
          {
            text: 'Ninguna señal, se avisa de viva voz si entra alguien despistado',
            scoreDelta: -0.5,
            correct: false,
            explanation: 'Negligencia: La señalización óptica normalizada es un medio de protección colectiva obligatorio para advertir a cualquier operario o visitante.'
          }
        ],
        completed: false
      },
      {
        id: 108,
        x: 180,
        y: 460,
        type: 'npc',
        name: 'Carlos',
        roleOrSub: 'Delegado de Prevención',
        title: 'Reto 8: Marco Legal y Derechos en PRL (Ley 31/1995)',
        desc: 'Carlos te consulta: "Si detectamos que el sistema de extracción del taller falla y hay una atmósfera asfixiante, ¿qué derecho nos asiste según la LPRL?"',
        options: [
          {
            text: 'Derecho de paralización de actividad ante riesgo grave e inminente (Art. 21 LPRL)',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Exacto: El Artículo 21 de la Ley 31/1995 ampara a los trabajadores y sus representantes para interrumpir la actividad si existe peligro inminente para la salud sin sanción alguna.'
          },
          {
            text: 'Continuar trabajando obligatoriamente hasta que termine el turno para no frenar la producción',
            scoreDelta: -0.6,
            correct: false,
            explanation: 'Falso y muy peligroso: La salud y la integridad física prevalecen siempre sobre cualquier criterio de producción o rendimiento económico.'
          }
        ],
        completed: false
      }
    ]
  },
  2: {
    id: 2,
    name: 'Sesión 2: El Muelle y Productos Químicos',
    subtitle: 'Pintado antiincrustante (Antifouling), disolventes y prevención de vertidos',
    location: 'Muelle Exterior y Pantalán de Mantenimiento',
    description: 'En el muelle exterior, debes preparar y aplicar pintura antiincrustante en la obra viva del barco. Enfréntate al riesgo químico de disolventes orgánicos, atmósferas inflamables, protección respiratoria de vapores, guantes químicos y respuesta inmediata ante salpicaduras.',
    targetCompetencies: [
      'Interpretación de Fichas de Datos de Seguridad (FDS / SDS - Reglamento CLP)',
      'Selección de guantes químicos específicos (EN ISO 374)',
      'Máscaras respiratorias combinadas A1P3 para vapores orgánicos',
      'Ventilación y condiciones ambientales en el muelle (viento y corrientes)',
      'Herramientas antichispa en atmósferas con disolventes (ATEX)',
      'Protocolos de emergencia: Lavado ocular y duchas de descontaminación',
      'Prevención de derrames y cubetos de retención en muelle',
      'Almacenamiento seguro de sustancias inflamables en armario RF-90'
    ],
    startingX: 90,
    startingY: 340,
    challenges: [
      {
        id: 201,
        x: 180,
        y: 170,
        type: 'chemical',
        name: 'Ficha FDS y Botes de Antifouling',
        roleOrSub: 'Información química y CLP',
        title: 'Reto 1: Ficha de Datos de Seguridad (FDS / SDS)',
        desc: 'Tienes delante las latas de pintura antiincrustante que contienen biocidas y disolventes xileno. ¿Qué acción previa es imperativa antes de abrirlas?',
        options: [
          {
            text: 'Consultar las Frases H (peligros) y P (consejos de prudencia) en la Ficha FDS de 16 secciones',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Excelente: La Ficha de Datos de Seguridad indica los límites de exposición profesional (VLA), incompatibilidades químicas, primeros auxilios y EPIs obligatorios.'
          },
          {
            text: 'Abrir y oler directamente el bote para comprobar si los disolventes están frescos',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: '¡Inhalación Tóxica Aguda!: Oler directamente disolventes aromáticos produce narcosis inmediata, irritación de mucosas y cefalea. ¡Pierdes 1 vida!'
          },
          {
            text: 'Comenzar a pintar sin leer nada confiando en la intuición de taller',
            scoreDelta: -0.5,
            correct: false,
            damage: true,
            explanation: 'Negligencia Grave: Desconocer la reactividad del producto expone a todo el equipo a mezclas incompatibles e intoxicaciones. Pierdes 1 vida.'
          }
        ],
        completed: false
      },
      {
        id: 202,
        x: 300,
        y: 150,
        type: 'epi',
        name: 'Caja de Guantes Químicos',
        roleOrSub: 'Protección dérmica (EN 374)',
        title: 'Reto 2: Selección de Guantes para Disolventes y Resinas',
        desc: 'El antifouling contiene hidrocarburos aromáticos que degradan materiales comunes. ¿Qué guantes seleccionas?',
        options: [
          {
            text: 'Guantes de nitrilo reforzado o neopreno homologados según norma EN ISO 374 con resistencia a permeación',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Muy bien: El nitrilo/neopreno de espesor técnico resiste la permeación y degradación de solventes y xilenos habituales en pinturas marinas.'
          },
          {
            text: 'Guantes de látex doméstico desechables muy finos',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: 'Dermatitis Química Severa: Los solventes orgánicos disuelven el látex en segundos, entrando en contacto directo con tu piel y causando quemadura química. ¡Pierdes 1 vida!'
          },
          {
            text: 'Guantes de cuero de mecánico sin recubrimiento estanco',
            scoreDelta: -0.6,
            correct: false,
            damage: true,
            explanation: 'Efecto Esponja Peligroso: El cuero poroso absorbe los solventes y los mantiene presionados de forma continua contra tu piel. Pierdes 1 vida.'
          }
        ],
        completed: false
      },
      {
        id: 203,
        x: 420,
        y: 150,
        type: 'epi',
        name: 'Estación de Mascarillas',
        roleOrSub: 'Protección respiratoria',
        title: 'Reto 3: Filtro Respiratorio para Pintura con Disolventes',
        desc: 'Vas a aplicar la pintura antiincrustante a rodillo y brocha en el costado de la embarcación. ¿Qué tipo de filtro requiere tu máscara buconasal?',
        options: [
          {
            text: 'Filtro combinado A1 o A2 (banda marrón: vapores orgánicos) con prefiltro de partículas P2/P3',
            scoreDelta: 0.7,
            correct: true,
            explanation: 'Exacto: El filtro de carbón activo (código A) retiene los vapores disolventes tóxicos, y la etapa P retiene las microgotas y pigmentos pesados.'
          },
          {
            text: 'Una mascarilla de papel simple para polvo de obra tipo FFP1',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: 'Intoxicación Respiratoria: Las mascarillas para polvo solo retienen partículas sólidas inertes, dejando pasar el 100% de los vapores químicos. ¡Pierdes 1 vida!'
          },
          {
            text: 'No usar ninguna máscara asumiendo que la brisa marina dispersa los gases',
            scoreDelta: -0.6,
            correct: false,
            damage: true,
            explanation: 'Afección Tóxica: Junto al casco la concentración de vapores supera los valores límite ambientales incluso al aire libre. Pierdes 1 vida.'
          }
        ],
        completed: false
      },
      {
        id: 204,
        x: 490,
        y: 200,
        type: 'ventilation',
        name: 'Manga de Viento y Posición',
        roleOrSub: 'Condiciones ambientales',
        title: 'Reto 4: Dirección del Viento y Ventilación Natural en Muelle',
        desc: 'Sopla una brisa en el muelle. ¿Cómo te posicionas respecto a la embarcación y los botes abiertos de pintura?',
        options: [
          {
            text: 'Situarse con el viento a la espalda o de costado, permitiendo que la corriente aleje los vapores de tu rostro',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Perfecto: Aprovechar la ventilación natural y orientarse adecuadamente aleja la nube de vapores de la zona de respiración del aplicador.'
          },
          {
            text: 'Colocarse contra el viento para que el chorro de aire te dé directo en la cara mientras pintas',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: 'Exposición Directa y Salpicaduras: El viento te proyecta las microgotas de pintura y los vapores tóxicos hacia los ojos y la cara. ¡Pierdes 1 vida!'
          }
        ],
        completed: false
      },
      {
        id: 205,
        x: 450,
        y: 290,
        type: 'hazard',
        name: 'Cubeto de Retención',
        roleOrSub: 'Protección ambiental y del muelle',
        title: 'Reto 5: Prevención de Derrames y Vertidos al Mar',
        desc: 'El barco está atracado junto al agua marina. ¿Qué medida de contención colectiva debes disponer bajo las latas y el casco?',
        options: [
          {
            text: 'Cubeto estanco de retención para envases y lona impermeable bajo la borda para evitar caídas al mar',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Impecable: Los biocidas marinos son altamente ecotóxicos; el cubeto retiene el 110% del volumen del envase mayor y evita vertidos accidentales.'
          },
          {
            text: 'Apoyar los botes directamente en el filo resbaladizo del pantalán sin bandeja ni amarre',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: 'Resbalón y Vertido Contaminante: Un golpe accidental vuelca la pintura en el muelle, resbalas en el charco químico y cae producto al mar. ¡Pierdes 1 vida!'
          }
        ],
        completed: false
      },
      {
        id: 206,
        x: 460,
        y: 410,
        type: 'tool',
        name: 'Mesa de Agitadores y Herramientas',
        roleOrSub: 'Seguridad ATEX',
        title: 'Reto 6: Herramientas para Zonas con Vapores Inflamables',
        desc: 'Debes abrir latas de disolvente y mezclar los componentes. La concentración de vapores puede generar atmósfera explosiva. ¿Qué herramientas empleas?',
        options: [
          {
            text: 'Útiles y varillas agitadoras antichispa (latón/cobre-berilio o plásticos antiestáticos)',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Excelente: Las herramientas antichispa evitan fricciones mecánicas con capacidad de encender mezclas de aire-disolvente en zonas clasificadas ATEX.'
          },
          {
            text: 'Un cincel de acero templado golpeado fuertemente con un martillo de hierro',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: '¡Deflagración e Incendio!: El golpe de acero contra acero genera chispas incandescentes (>1000°C) que inflaman los vapores volátiles. ¡Pierdes 1 vida!'
          }
        ],
        completed: false
      },
      {
        id: 207,
        x: 350,
        y: 470,
        type: 'emergency',
        name: 'Ducha y Lavaojos Portuario',
        roleOrSub: 'Primeros auxilios',
        title: 'Reto 7: Actuación Inmediata ante Salpicadura Ocular de Pintura',
        desc: 'Durante la apertura de una lata presurizada, salpica una gota de disolvente en el borde del ojo de un compañero. ¿Cuál es el protocolo PAS inmediato?',
        options: [
          {
            text: 'Llevarlo de inmediato al lavaojos y mantener los párpados abiertos con agua limpia continua al menos 15 minutos',
            scoreDelta: 0.7,
            correct: true,
            explanation: 'Vital y Correcto: El lavado ocular copioso e inmediato diluye el agente cáustico y previene la necrosis de la córnea antes de la atención médica.'
          },
          {
            text: 'Frotarse el ojo enérgicamente con la manga del mono de trabajo sucio',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: 'Lesión Corneal Grave: Frotar extiende el producto químico y la fricción del tejido causa erosión y desgarros en el epitelio corneal. ¡Pierdes 1 vida!'
          },
          {
            text: 'Esperar a que termine la jornada para acudir al centro médico si continúa doliendo',
            scoreDelta: -0.6,
            correct: false,
            damage: true,
            explanation: 'Secuela Irreversible: En quemaduras químicas oculares los primeros segundos son críticos; demorarse provoca ceguera funcional. Pierdes 1 vida.'
          }
        ],
        completed: false
      },
      {
        id: 208,
        x: 180,
        y: 470,
        type: 'chemical',
        name: 'Armario Ignífugo de Almacén',
        roleOrSub: 'Almacenamiento seguro',
        title: 'Reto 8: Fin de Jornada y Almacenamiento de Inflamables',
        desc: 'Concluida la sesión de pintado, quedan botes a medio uso y restos de diluyente. ¿Cómo los guardas?',
        options: [
          {
            text: 'Cerrar herméticamente las tapas y almacenarlos en el armario de seguridad ignífugo ventilado RF-90',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Sobresaliente: El almacenamiento en armario resistente al fuego (tipo RF-90) evita la acumulación de vapores y la propagación de incendios.'
          },
          {
            text: 'Dejarlos destapados sobre el muelle bajo el sol para que se sequen los restos',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: 'Incendio por Insolación: El calor solar directo sobrepresuriza los envases, volatiliza los solventes y crea una bolsa inflamable propensa a deflagrar. ¡Pierdes 1 vida!'
          }
        ],
        completed: false
      }
    ]
  },
  3: {
    id: 3,
    name: 'Sesión 3: Trabajo en Altura (Palo Mayor)',
    subtitle: 'Configuración de arnés, puntos de anclaje, factor de caída y arboladura',
    location: 'Cubierta y Arboladura del Velero',
    description: 'Aprende a trabajar con seguridad en el palo mayor del velero (> 12 m): configuración y ajuste del arnés anticaídas (EN 361), puntos de anclaje certificados (EN 795), evaluación del factor de caída, absorbedores de energía y rescate rápido.',
    targetCompetencies: [
      'Trabajos en altura superiores a 2 metros (RD 2177/2004)',
      'Configuración y ajuste correcto del arnés anticaídas (EN 361)',
      'Evaluación de riesgos de caída, distancia libre y Factor de Caída',
      'Selección de puntos de anclaje estructurales certificados (EN 795)',
      'Sistemas de conexión con doble cabo en Y y absorbedor (EN 355)',
      'Casco para trabajos en altura con barboquejo de retención (EN 12492)',
      'Balizamiento de cubierta y prevención de caída de herramientas',
      'Protocolos de rescate rápido y prevención del síndrome del arnés'
    ],
    startingX: 90,
    startingY: 310,
    challenges: [
      {
        id: 301,
        x: 170,
        y: 160,
        type: 'epi',
        name: 'Configuración del Arnés EN 361',
        roleOrSub: 'Protección individual anticaídas',
        title: 'Reto 1: Configuración y Ajuste del Arnés Anticaídas (EN 361)',
        desc: 'Vas a subir al palo mayor para reparar la luz de tope a 12 metros de altura. Antes de la maniobra, ¿cómo ajustas y configuras el arnés de cuerpo entero?',
        options: [
          {
            text: 'Ajustar perneras y tirantes permitiendo pasar plano los dedos de la mano, centrar la anilla dorsal "A" entre omóplatos y verificar hebillas sin holgura',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Excelente: Un arnés bien ceñido reparte la desaceleración de una caída en muslos y pelvis; si las perneras quedan holgadas provocan lesiones graves en ingles y genitales.'
          },
          {
            text: 'Llevar las perneras muy flojas para poder moverse con más soltura y frescor sobre la cubierta',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: '¡Lesión Traumática!: Al detener una caída con perneras flojas, las cintas ascienden violentamente provocando traumatismo inguinal severo. ¡Pierdes 1 vida!'
          },
          {
            text: 'Utilizar únicamente un cinturón lumbar de posicionamiento sin tirantes ni perneras',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: '¡Prohibido por RD 2177/2004!: Los cinturones simples causan asfixia ortostática y fractura de columna ante una caída libre. ¡Pierdes 1 vida!'
          }
        ],
        completed: false
      },
      {
        id: 302,
        x: 290,
        y: 150,
        type: 'hazard',
        name: 'Evaluación del Factor de Caída',
        roleOrSub: 'Evaluación de riesgos de caída',
        title: 'Reto 2: Evaluación del Factor de Caída y Tirante de Aire',
        desc: 'El técnico debe conectarse en la cruceta del mástil. ¿Dónde debe ubicarse el anclaje para minimizar el impacto corporal en caso de caída?',
        options: [
          {
            text: 'Siempre por encima de la cabeza (Factor de Caída 0) para minimizar la distancia de caída libre y la fuerza de choque',
            scoreDelta: 0.7,
            correct: true,
            explanation: 'Sobresaliente: Conectar el cabo por encima de la cabeza (Factor 0) reduce la caída libre a cero; situarlo a los pies (Factor 2) duplica el recorrido y genera fuerzas de choque extremas.'
          },
          {
            text: 'Anclarse a la altura de la cintura o cadera para tener el mosquetón al alcance sin estirar el brazo',
            scoreDelta: -0.5,
            correct: false,
            explanation: 'Factor de Caída 1 Inadecuado: Conectar a nivel de cintura permite una caída libre igual a la longitud del elemento de amarre, aumentando el tirante de aire necesario y la sacudida.'
          },
          {
            text: 'Al nivel de los pies en la base del mástil para tener el mosquetón al alcance de la mano',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: '¡Factor de Caída 2 Crítico!: Caer el doble de la longitud del cabo somete al cuerpo y al anclaje a más de 12 kN de fuerza, con riesgo de rotura y lesiones medulares. ¡Pierdes 1 vida!'
          }
        ],
        completed: false
      },
      {
        id: 303,
        x: 420,
        y: 150,
        type: 'hazard',
        name: 'Cruceta y Punto de Anclaje EN 795',
        roleOrSub: 'Anclaje estructural homologado',
        title: 'Reto 3: Selección de Puntos de Anclaje Homologados (EN 795)',
        desc: 'Situado en la arboladura, necesitas asegurar tu línea de vida. ¿Qué elemento estructural del velero es apto como punto de anclaje?',
        options: [
          {
            text: 'Un cáncamo o anilla estructural certificada según EN 795 o driza de seguridad de acero con resistencia probada >= 12 kN',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Perfecto: La norma EN 795 garantiza que el punto de anclaje resiste la carga dinámica multiplicada del operario equipado.'
          },
          {
            text: 'Atarse al cable tensor de un obenque o a un pasacables de cubierta sin verificar certificación',
            scoreDelta: -0.6,
            correct: false,
            damage: true,
            explanation: 'Peligro de Deslizamiento: Los cables de jarcia firme no están ensayados como anclaje anticaídas; el mosquetón resbala sin freno o deforma el tensor. ¡Pierdes 1 vida!'
          },
          {
            text: 'El soporte de plástico de la antena de TV o el cable flexible del anemómetro',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: 'Rotura de Anclaje: Los soportes de antenas no tienen capacidad estructural y colapsan al primer tirón. ¡Pierdes 1 vida!'
          }
        ],
        completed: false
      },
      {
        id: 304,
        x: 500,
        y: 220,
        type: 'tool',
        name: 'Doble Cabo en Y con Absorbedor',
        roleOrSub: 'Progresión en vertical segura',
        title: 'Reto 4: Sistema de Amarre con Doble Cabo en Y (EN 355)',
        desc: 'Al trepar por los peldaños del mástil hacia la percha, ¿cómo ejecutas la progresión vertical segura?',
        options: [
          {
            text: 'Conectar un doble cabo en "Y" con absorbedor de energía (EN 355), manteniendo la regla de tener siempre un mosquetón fijado antes de soltar el otro',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Excelente: La regla de conexión continua del 100% asegura que en ningún segundo el técnico quede desprotegido en el aire.'
          },
          {
            text: 'Utilizar una cuerda náutica de amarre sin absorbedor de energía atada con un nudo as de guía',
            scoreDelta: -0.6,
            correct: false,
            damage: true,
            explanation: 'Sobretensión Fatal: Las cuerdas rígidas sin absorbedor transmiten el choque íntegro al esqueleto (> 12 kN) provocando estallido de vértebras. ¡Pierdes 1 vida!'
          },
          {
            text: 'Subir a pulso sujetándose con ambas manos en los cables sin conectar ningún mosquetón para no perder tiempo',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: '¡Caída Libre de Altura!: Un golpe de mar balancea el barco, resbalas del peldaño y caes al vacío sobre cubierta. ¡Pierdes 1 vida!'
          }
        ],
        completed: false
      },
      {
        id: 305,
        x: 460,
        y: 320,
        type: 'epi',
        name: 'Casco con Barboquejo EN 12492',
        roleOrSub: 'Protección craneal en altura',
        title: 'Reto 5: Casco de Seguridad con Barboquejo de Retención',
        desc: 'En lo alto del mástil hay rachas de viento y riesgo de oscilación pendular contra la cruceta. ¿Qué protección de cabeza utilizas?',
        options: [
          {
            text: 'Casco específico para trabajos en altura (EN 12492 / EN 397) con barboquejo de 4 puntos abrochado que resiste > 25 daN',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Impecable: El barboquejo técnico impide la pérdida del casco durante la caída o por acción de ráfagas de viento marinas.'
          },
          {
            text: 'Casco de obra civil estándar con la cinta de barbilla desabrochada y suelta',
            scoreDelta: -0.6,
            correct: false,
            damage: true,
            explanation: 'Pérdida Inmediata: Con el primer golpe de viento el casco se desrende y cae al agua, dejando tu cabeza expuesta a colisiones contra el mástil. ¡Pierdes 1 vida!'
          },
          {
            text: 'Una gorra marinera o casco de obra industrial sin cinta de fijación bajo la barbilla',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: 'Traumatismo Craneal: El viento te arrebata el casco y el balanceo del mástil te golpea la cabeza contra el aluminio. ¡Pierdes 1 vida!'
          }
        ],
        completed: false
      },
      {
        id: 306,
        x: 440,
        y: 430,
        type: 'tool',
        name: 'Bolsa Portaherramientas y Drizas',
        roleOrSub: 'Prevención de caída de objetos',
        title: 'Reto 6: Prevención y Amarre Anticaída de Herramientas',
        desc: 'Llevas alicates, destornillador y cables para la luz de tope. ¿Cómo aseguras los útiles en altura?',
        options: [
          {
            text: 'Bolsa portaherramientas cerrada con mosquetón al arnés y cada herramienta atada con cordin retráctil imperdible a la muñeca',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Muy bien: Una herramienta caída desde 12 metros de altura adquiere energía cinética suficiente para causar lesiones mortales en cubierta.'
          },
          {
            text: 'Guardar las herramientas en los bolsillos del mono de trabajo sin cierre ni cordón imperdible',
            scoreDelta: -0.6,
            correct: false,
            damage: true,
            explanation: 'Caída Involuntaria: Al arquearte sobre la cruceta, los alicates resbalan del bolsillo y caen disparados a plomo sobre la bañera. ¡Pierdes 1 vida!'
          },
          {
            text: 'Apoyar las herramientas sueltas sobre la cruceta mientras usas ambas manos',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: 'Impacto por Caída de Objetos: Los alicates caen de la cruceta e impactan con fuerza en la bañera del velero. ¡Pierdes 1 vida!'
          }
        ],
        completed: false
      },
      {
        id: 307,
        x: 310,
        y: 470,
        type: 'sign',
        name: 'Zona de Exclusión en Cubierta',
        roleOrSub: 'Protección colectiva en cubierta',
        title: 'Reto 7: Balizamiento y Zona de Exclusión Bajo el Mástil',
        desc: 'Mientras el técnico trabaja en la arboladura, ¿qué medidas colectivas deben aplicarse en la cubierta inferior?',
        options: [
          {
            text: 'Balizar el perímetro inferior de la bañera con cinta de peligro, prohibir el paso a terceros y exigir casco a todo el personal',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Exacto: El balizamiento perimetral evita que tripulantes u operarios pasen por la vertical de caída de objetos o desprendimientos.'
          },
          {
            text: 'Colocar una simple nota escrita en el timón recomendando no mirar hacia el cielo',
            scoreDelta: -0.5,
            correct: false,
            explanation: 'Medida Ineficaz: Una nota no constituye balizamiento físico efectivo de delimitación perimetral de peligro según el RD 485/1997.'
          },
          {
            text: 'Permitir que los compañeros sigan limpiando la cubierta justo debajo del palo',
            scoreDelta: -0.6,
            correct: false,
            damage: true,
            explanation: 'Riesgo a Terceros: Un tornillo desprendido cae sobre un operario en cubierta que no llevaba protección. ¡Pierdes 1 vida!'
          }
        ],
        completed: false
      },
      {
        id: 308,
        x: 170,
        y: 460,
        type: 'emergency',
        name: 'Protocolo de Rescate en Altura',
        roleOrSub: 'Emergencias y rescate rápido',
        title: 'Reto 8: Síndrome del Arnés y Tiempo de Rescate Urgente',
        desc: 'Un operario queda suspendido inconsciente del arnés tras frenar una caída. ¿Por qué el rescate debe completarse en menos de 10-15 minutos?',
        options: [
          {
            text: 'Para prevenir el síndrome del arnés (shock ortostático por acumulación de sangre en piernas) que conduce a síncope y parada cardíaca',
            scoreDelta: 0.7,
            correct: true,
            explanation: 'Vital y riguroso: En suspensión inerte, la falta de bombeo muscular acumula litros de sangre en miembros inferiores, provocando isquemia cerebral y colapso circulatorio.'
          },
          {
            text: 'Tumbar a la víctima inmediatamente plana en el suelo con piernas elevadas una vez rescatada',
            scoreDelta: -0.6,
            correct: false,
            damage: true,
            explanation: 'Retorno Venoso Letal: Colocar inmediatamente a la víctima en horizontal tras una suspensión prolongada sobrecarga el corazón con sangre desoxigenada y toxinas, provocando paro cardíaco (rescate letal). Debe mantenerse sentada o en cuclillas. ¡Pierdes 1 vida!'
          },
          {
            text: 'No hay prisa porque el arnés garantiza que la persona puede permanecer colgada durante horas sin peligro',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: 'Fallo Fatal de Emergencia: Superados los 15 minutos de suspensión inerte sobreviene el shock irreversible y muerte por asfixia posicional. ¡Pierdes 1 vida!'
          }
        ],
        completed: false
      }
    ]
  },
  4: {
    id: 4,
    name: 'Sesión 4: La Sentina - Espacios Confinados y Electricidad',
    subtitle: 'Medición de gases, ventilación forzada y consignación LOTO',
    location: 'Sentina y Sala de Máquinas del Buque',
    description: 'Ingresa en la sentina del barco, un espacio confinado con riesgo de asfixia, atmósferas explosivas y choque eléctrico: medición multigás, ventilación forzada continua, recurso preventivo exterior, consignación de baterías (LOTO) y tensiones de seguridad de 24V.',
    targetCompetencies: [
      'Entrada y trabajo en espacios confinados (RD 486/1997)',
      'Medición previa con detector multigás (O2, CO, H2S, LEL)',
      'Ventilación forzada continua con insuflación de aire fresco',
      'Presencia preceptiva de recurso preventivo exterior en boca de hombre',
      'Bloqueo y etiquetado eléctrico LOTO en bancos de baterías',
      'Equipos de iluminación y herramientas a Muy Baja Tensión (MBTS 24V)',
      'Equipos de rescate: Trípode con torno anticaídas y línea de vida'
    ],
    startingX: 90,
    startingY: 310,
    challenges: [
      {
        id: 401,
        x: 170,
        y: 160,
        type: 'chemical',
        name: 'Detector Multigás de Atmósfera',
        roleOrSub: 'Control de atmósferas peligrosas',
        title: 'Reto 1: Medición Previa de la Atmósfera en Sentina',
        desc: 'La escotilla de la sentina ha estado cerrada meses con aguas aceitosas y vapores de baterías. ¿Qué acción previa realizas antes de ingresar?',
        options: [
          {
            text: 'Introducir la sonda del detector multigás desde el exterior a diferentes alturas para medir O2 (20.9%), CO, H2S y LEL',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Excelente: Los gases densos como el H2S se acumulan en el fondo mientras los hidrocarburos ligeros suben. La medición estratificada previa es obligatoria.'
          },
          {
            text: 'Asomar la cabeza y olfatear el aire para comprobar rápidamente si se puede respirar',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: '¡Asfixia Súbita!: En atmósferas con déficit de oxígeno (< 17% O2) o sulfhídrico la pérdida de consciencia es casi instantánea. ¡Pierdes 1 vida!'
          }
        ],
        completed: false
      },
      {
        id: 402,
        x: 290,
        y: 150,
        type: 'ventilation',
        name: 'Manga de Ventilación Forzada',
        roleOrSub: 'Renovación de aire',
        title: 'Reto 2: Ventilación Mecánica Forzada Continuada',
        desc: 'La sentina presenta aire viciado y restos de vapores de hidrocarburos. ¿Cómo estableces la ventilación mecánica antes y durante el trabajo?',
        options: [
          {
            text: 'Insuflar aire fresco exterior mediante conducto flexible hasta el fondo de la sentina de forma ininterrumpida',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Perfecto: La ventilación forzada por insuflación barre los gases pesados del fondo y garantiza la renovación continua del volumen de aire respirable.'
          },
          {
            text: 'Inyectar oxígeno medicinal o industrial puro para enriquecer el ambiente rápidamente',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: '¡Riesgo Catastrófico de Explosión!: Enriquecer la atmósfera con O2 (> 23.5%) vuelve hipercombustibles la ropa y los aceites, provocando fuego fulminante. ¡Pierdes 1 vida!'
          }
        ],
        completed: false
      },
      {
        id: 403,
        x: 420,
        y: 150,
        type: 'npc',
        name: 'Recurso Preventivo Exterior',
        roleOrSub: 'Vigilancia y comunicación',
        title: 'Reto 3: Vigilancia Exterior y Recurso Preventivo',
        desc: 'Vas a descender a la sentina para desmontar la bomba de achique. ¿Qué dotación de personal exige el protocolo de espacios confinados?',
        options: [
          {
            text: 'Un recurso preventivo en el exterior junto a la escotilla, en contacto visual y verbal continuo, con mando para activar el rescate',
            scoreDelta: 0.7,
            correct: true,
            explanation: 'Exacto: El vigilante exterior nunca debe abandonar el puesto ni entrar sin apoyo; es el enlace vital de rescate según la Disposición Adicional 14ª LPRL.'
          },
          {
            text: 'Entrar solo y cerrar la trampilla para que no caiga polvo de cubierta mientras trabajas',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: 'Atrapamiento Mortal: Si sufres un desvanecimiento o avería dentro de la sentina cerrada, nadie sabrá que estás en peligro. ¡Pierdes 1 vida!'
          }
        ],
        completed: false
      },
      {
        id: 404,
        x: 500,
        y: 220,
        type: 'electrical',
        name: 'Selector de Baterías (LOTO)',
        roleOrSub: 'Consignación eléctrica',
        title: 'Reto 4: Procedimiento de Bloqueo Eléctrico (LOTO)',
        desc: 'La bomba de achique averiada está cableada a un banco de baterías conmutado. ¿Cómo procedes a cortar la energía antes de desarmarla?',
        options: [
          {
            text: 'Abrir desconectadores, retirar fusibles principales y colocar candado y tarjeta identificativa LOTO',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Impecable: El procedimiento Lockout / Tagout garantiza que ningún otro tripulante pueda rearmar los disyuntores de forma involuntaria.'
          },
          {
            text: 'Manipular los cables con la corriente activa para comprobar con un chispazo cuál es el positivo',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: '¡Cortocircuito e Inflamación!: El chispazo en presencia de gases de batería o restos de sentina enciende vapores y produce quemadura eléctrica. ¡Pierdes 1 vida!'
          }
        ],
        completed: false
      },
      {
        id: 405,
        x: 460,
        y: 320,
        type: 'electrical',
        name: 'Lámpara Portátil MBTS 24V',
        roleOrSub: 'Muy Baja Tensión de Seguridad',
        title: 'Reto 5: Tensión de Seguridad en Emplazamientos Conductores',
        desc: 'El interior de la sentina tiene humedad acumulada y partes metálicas de masa conductora. ¿Qué equipo de iluminación portátil utilizas?',
        options: [
          {
            text: 'Lámpara portátil alimentada a Muy Baja Tensión de Seguridad (MBTS 24V o 12V) con transformador ubicado FUERA de la sentina',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Reglamentario y Seguro: En locales muy conductores el RD 614/2001 exige MBTS $\\le$ 24V para que una fuga accidental no genere corriente peligrosa en el cuerpo.'
          },
          {
            text: 'Una lámpara halógena portátil convencional conectada directamente a 230V con alargadera común',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: '¡Electrocución Crítica!: El contacto de 230V sobre chapa mojada salina provoca fibrilación ventricular inmediata en un espacio confinado. ¡Pierdes 1 vida!'
          }
        ],
        completed: false
      },
      {
        id: 406,
        x: 440,
        y: 430,
        type: 'epi',
        name: 'Bota Antideslizante para Hidrocarburos',
        roleOrSub: 'Protección podológica',
        title: 'Reto 6: Calzado de Seguridad en Fondos de Sentina',
        desc: 'El fondo de la sentina presenta una película resbaladiza de agua, aceite y restos de combustible diésel. ¿Qué calzado seleccionas?',
        options: [
          {
            text: 'Botas de seguridad con suela antideslizante certificada (SRC), resistencia a hidrocarburos (FO) y puntera de protección',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Correcto: La suela técnica con marcado FO resiste el ataque de solventes y aceites sin reblandecerse ni perder tracción sobre chapa lagrimada.'
          },
          {
            text: 'Zapatillas deportivas convencionales con suela desgastada',
            scoreDelta: -0.6,
            correct: false,
            damage: true,
            explanation: 'Caída con Traumatismo: El hidrocarburo degrada la suela ordinaria provocando un resbalón contra las cuadernas metálicas del fondo. ¡Pierdes 1 vida!'
          }
        ],
        completed: false
      },
      {
        id: 407,
        x: 310,
        y: 470,
        type: 'emergency',
        name: 'Trípode y Torno de Evacuación',
        roleOrSub: 'Sistema de extracción de emergencia',
        title: 'Reto 7: Dispositivo de Rescate Rápido en Boca de Hombre',
        desc: 'Antes de descender al fondo de la sentina, ¿qué dispositivo de salvamento debe quedar instalado en la escotilla de acceso?',
        options: [
          {
            text: 'Trípode de rescate homologado con torno/polipasto anticaídas conectado mediante cable retráctil al arnés del técnico',
            scoreDelta: 0.7,
            correct: true,
            explanation: 'Imprescindible: Permite al recurso preventivo extraer al operario inconsciente verticalmente en segundos sin necesidad de entrar a la zona de peligro.'
          },
          {
            text: 'Ninguno; si ocurre algo se avisará a bomberos para que traigan su propio material más tarde',
            scoreDelta: -0.6,
            correct: false,
            damage: true,
            explanation: 'Rescate Fallido: El tiempo de respuesta de servicios externos supera los márgenes de supervivencia cerebral ante parada por asfixia. ¡Pierdes 1 vida!'
          }
        ],
        completed: false
      },
      {
        id: 408,
        x: 170,
        y: 460,
        type: 'sign',
        name: 'Alarma del Detector Portátil',
        roleOrSub: 'Protocolo de evacuación inmediata',
        title: 'Reto 8: Actuación ante Disparo de Alarma de Gases',
        desc: 'Estás reparando la bomba de sentina y el detector multigás que llevas en el pecho comienza a emitir pitidos y destellos rojos de peligro. ¿Qué haces?',
        options: [
          {
            text: 'Evacuar inmediatamente el espacio confinado hacia el exterior por la escala sin detenerte a recoger nada y dar la alarma',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Protocolo Salvavidas: Una alarma de gas tóxico o falta de O2 no admite demora; unos pocos segundos de exposición pueden causar colapso muscular.'
          },
          {
            text: 'Silenciar la alarma del aparato y apurar 5 minutos más para terminar de conectar el último cable',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: 'Intoxicación Fulminante: La concentración de gas sulfhídrico supera el umbral de supervivencia causando síncope respiratorio. ¡Pierdes 1 vida!'
          }
        ],
        completed: false
      }
    ]
  },
  5: {
    id: 5,
    name: 'Sesión 5: Varadero - Emergencias y Primeros Auxilios',
    subtitle: 'Plan de autoprotección, fuegos clase B, protocolo PAS y RCP',
    location: 'Varadero General y Puesto de Emergencias',
    description: 'Enfrenta situaciones críticas en el varadero: extinción de fuegos de líquidos inflamables (Clase B), protocolo PAS ante heridos, actuación en parada cardiorrespiratoria con DEA, quemaduras químicas, inmovilización en traumatismos y evacuación al punto de encuentro.',
    targetCompetencies: [
      'Clasificación del fuego y uso de extintores CO2 / polvo ABC (RD 513/2017)',
      'Protocolo PAS (Proteger, Avisar al 112, Socorrer)',
      'Soporte Vital Básico y desfibrilación semiautomática (DEA)',
      'Posición Lateral de Seguridad (PLS) en víctimas inconscientes',
      'Atención a traumatismos y sospecha de lesión medular',
      'Tratamiento de urgencia en quemaduras químicas cutáneas',
      'Plan de autoprotección y evacuación al punto de encuentro (RD 393/2007)'
    ],
    startingX: 90,
    startingY: 310,
    challenges: [
      {
        id: 501,
        x: 180,
        y: 150,
        type: 'hazard',
        name: 'Fuego de Disolvente en el Suelo',
        roleOrSub: 'Extinción de incendios Clase B',
        title: 'Reto 1: Elección de Agente Extintor en Fuego de Líquidos',
        desc: 'Un vertido accidental de disolvente y resina prende fuego en el suelo de hormigón del varadero, generando una llama viva. ¿Qué agente extintor utilizas?',
        options: [
          {
            text: 'Extintor de Polvo Químico Seco Polivalente ABC o de Nieve Carbónica (CO2)',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Perfecto: Los fuegos Clase B (combustibles líquidos) se sofocan con polvo químico o CO2; el CO2 sofoca y enfría sin dejar residuo conductor ni dañar maquinaria.'
          },
          {
            text: 'Manguera de agua a presión directa conectada a la toma portuaria',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: '¡Ebullición Desbordante (Boilover)!: El agua es más densa que los solventes; se hunde, hierve instantáneamente y proyecta el líquido en llamas por todo el varadero. ¡Pierdes 1 vida!'
          },
          {
            text: 'Intentar sofocarlo pisándolo con las botas de seguridad',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: 'Quemaduras Severas: El solvente empapa el calzado y transmite calor extremo a la piel con quemaduras de 2º y 3er grado. ¡Pierdes 1 vida!'
          }
        ],
        completed: false
      },
      {
        id: 502,
        x: 300,
        y: 150,
        type: 'emergency',
        name: 'Panel Protocolo P.A.S.',
        roleOrSub: 'Protocolo de actuación de emergencias',
        title: 'Reto 2: Secuencia Correcta del Protocolo P.A.S.',
        desc: 'Un operario grita pidiendo auxilio dentro de la nave del varadero. Ante cualquier accidente laboral, ¿cuál es el orden estricto de actuación?',
        options: [
          {
            text: '1º PROTEGER (al herido y a ti mismo), 2º AVISAR (al 112 y al Centro de Control del Astillero), 3º SOCORRER (atender al herido dentro de tus conocimientos)',
            scoreDelta: 0.7,
            correct: true,
            explanation: 'Impecable y Fundamental: La regla de oro PAS garantiza que no se generen nuevas víctimas antes de pedir los recursos sanitarios necesarios.'
          },
          {
            text: 'Correr directamente a agarrar al herido y moverlo fuera sin evaluar si hay cables con corriente o fuga tóxica',
            scoreDelta: -0.6,
            correct: false,
            damage: true,
            explanation: 'Accidente en Cadena: Si no aseguras primero el entorno, caes fulminado por el mismo riesgo que causó el accidente (atmósfera tóxica o electrocución). ¡Pierdes 1 vida!'
          },
          {
            text: 'Avisar primero a los compañeros por redes sociales antes de llamar a emergencias sanitarias',
            scoreDelta: -0.6,
            correct: false,
            explanation: 'Pérdida de Tiempo Crítica: Los primeros minutos en un trauma grave son vitales para la supervivencia de la víctima.'
          }
        ],
        completed: false
      },
      {
        id: 503,
        x: 440,
        y: 150,
        type: 'tool',
        name: 'Puesto de Extintores Portátiles',
        roleOrSub: 'Técnica de manejo seguro de extintores',
        title: 'Reto 3: Técnica y Posicionamiento al Utilizar el Extintor',
        desc: 'Has descolgado el extintor de 6 kg para sofocar el conato de fuego en el varadero. ¿Cómo lo operas de forma segura y eficaz?',
        options: [
          {
            text: 'Quitar pasador de seguridad, situarse con el viento a la espalda a 2-3 metros, realizar descarga de prueba y dirigir el chorro a la base en zig-zag sin dar la espalda al fuego al retroceder',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Excelente técnica: Atacar la base del combustible corta la reacción en cadena; el viento a la espalda aleja humo y calor, y jamás se da la espalda por si hay reignición.'
          },
          {
            text: 'Colocarse de cara al viento y disparar directamente hacia la parte superior del humo',
            scoreDelta: -0.6,
            correct: false,
            damage: true,
            explanation: 'Inhalación e Ineficacia: El humo te ciega, el polvo es devuelto a tu cara y disparar a las llamas altas no apaga el combustible que alimenta el fuego. ¡Pierdes 1 vida!'
          },
          {
            text: 'Volcar el extintor boca abajo y golpear la boquilla fuertemente contra el suelo',
            scoreDelta: -0.6,
            correct: false,
            damage: true,
            explanation: 'Riesgo Mecánico: Los extintores presurizados modernos tienen tubo sonda interno; golpearlos puede romper la válvula de control. ¡Pierdes 1 vida!'
          }
        ],
        completed: false
      },
      {
        id: 504,
        x: 580,
        y: 200,
        type: 'emergency',
        name: 'Cabina DEA y Soporte Vital',
        roleOrSub: 'Reanimación Cardiopulmonar y DEA',
        title: 'Reto 4: Parada Cardiorrespiratoria (PCR) y Desfibrilador (DEA)',
        desc: 'Un operario se desploma súbitamente en el muelle. No responde y no respira. Mientras llega el DEA del astillero, ¿cómo inicias la RCP básica?',
        options: [
          {
            text: 'Iniciar 30 compresiones torácicas a un ritmo de 100-120 cpm seguidas de 2 insuflaciones, conectar el DEA de inmediato al llegar y seguir sus indicaciones de voz',
            scoreDelta: 0.7,
            correct: true,
            explanation: 'Vital y Correcto: Las compresiones en el centro del pecho mantienen el flujo sanguíneo cerebral; la desfibrilación precoz con DEA antes de 5 minutos eleva la supervivencia hasta un 70%.'
          },
          {
            text: 'Tocar el pecho del paciente y sujetar sus manos mientras el DEA emite la descarga eléctrica de choque',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: 'Electrocución por Descarga: Tocar a la víctima durante la descarga del DEA deriva corriente a tu cuerpo, provocando arritmia o parada en ti. ¡Pierdes 1 vida!'
          },
          {
            text: 'Esperar a que despierte sin tocarlo mientras se le ofrece agua con azúcar',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: 'Error Mortal: En parada cardiorrespiratoria cada minuto sin RCP reduce la probabilidad de supervivencia un 10%. La anoxia cerebral es irreversible en 4 minutos. ¡Pierdes 1 vida!'
          }
        ],
        completed: false
      },
      {
        id: 505,
        x: 620,
        y: 340,
        type: 'emergency',
        name: 'Posición Lateral de Seguridad (PLS)',
        roleOrSub: 'Primeros auxilios en inconsciencia',
        title: 'Reto 5: Actuación ante Víctima Inconsciente con Respiración Espontánea',
        desc: 'Un marinero sufre un desvanecimiento por golpe de calor en cubierta. Está inconsciente pero compruebas que sí respira con normalidad. ¿En qué posición lo colocas?',
        options: [
          {
            text: 'Posición Lateral de Seguridad (PLS) estable sobre un costado, con cabeza extendida hacia atrás y boca abierta mirando hacia abajo',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Sobresaliente: La PLS evita la asfixia por caída de la lengua hacia la faringe y permite el drenaje de vómitos o flemas al exterior, vigilando la respiración hasta la llegada médica.'
          },
          {
            text: 'Boca arriba (decúbito supino) con la cabeza flexionada sobre una almohada alta',
            scoreDelta: -0.6,
            correct: false,
            damage: true,
            explanation: 'Obstrucción de Vía Aérea: En decúbito supino la lengua relajada cae taponando la glotis provocando asfixia mecánica rápida. ¡Pierdes 1 vida!'
          },
          {
            text: 'Sentado en una silla para que el aire le dé en la cara',
            scoreDelta: -0.5,
            correct: false,
            explanation: 'Inestabilidad y Caída: En pérdida de consciencia el tono muscular es nulo y la persona se desplomará de la silla sufriendo traumatismo craneal.'
          }
        ],
        completed: false
      },
      {
        id: 506,
        x: 480,
        y: 440,
        type: 'hazard',
        name: 'Traumatismo en Cuna de Varada',
        roleOrSub: 'Atención a fracturas y sospecha medular',
        title: 'Reto 6: Sospecha de Fractura y Lesión en Columna Vertebral',
        desc: 'Un técnico cae desde 2,5 metros al resbalar de la escala de la cuna del barco. Refiere dolor agudo en la zona lumbar y hormigueo en piernas. ¿Qué conducta adoptas?',
        options: [
          {
            text: 'Mantenerlo inmóvil en el suelo alineando el eje cabeza-cuello-tronco, abrigarlo para evitar shock y no moverlo salvo riesgo inminente de explosión',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Correcto y Seguro: Ante sospecha de lesión de columna vertebral cualquier torsión o flexión indebida puede seccionar la médula espinal produciendo tetraplejia o paraplejia irreversible.'
          },
          {
            text: 'Ayudarle a ponerse de pie y obligarlo a caminar unos pasos para ver si tiene huesos rotos',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: '¡Sección Medular Traumática!: La carga de peso sobre una vértebra fracturada desplaza fragmentos óseos hacia el canal medular. ¡Pierdes 1 vida!'
          },
          {
            text: 'Cargarlo a la espalda en volandas para llevarlo al despacho del astillero',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: 'Maniobra Temeraria: Doblar la columna de un politraumatizado agrava las hemorragias internas y las lesiones vertebrales. ¡Pierdes 1 vida!'
          }
        ],
        completed: false
      },
      {
        id: 507,
        x: 310,
        y: 460,
        type: 'chemical',
        name: 'Ducha de Lavado de Emergencia',
        roleOrSub: 'Quemaduras químicas por resina o catalizador',
        title: 'Reto 7: Primeros Auxilios en Quemadura Química Cutánea',
        desc: 'Durante la preparación de resina de poliéster salpica catalizador de peróxido sobre el antebrazo desnudo de un compañero provocando escozor ardiente. ¿Cuál es el tratamiento inmediato?',
        options: [
          {
            text: 'Irrigar copiosamente con agua corriente limpia a baja presión durante mínimo 20 minutos, retirar joyas y ropa no pegada, y no aplicar pomadas grasas',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Impecable: El lavado prolongado con agua diluye y arrastra el agente cáustico neutralizándolo por dilución; las pomadas atrapan el producto químico en la dermis agravando la necrosis.'
          },
          {
            text: 'Untar pasta de dientes, mantequilla o aceite de motor sobre la quemadura',
            scoreDelta: -0.6,
            correct: false,
            damage: true,
            explanation: 'Infección y Profundización del Daño: Los remedios caseros retienen el calor químico e introducen bacterias en la piel denudada. ¡Pierdes 1 vida!'
          },
          {
            text: 'Neutralizar aplicando ácido clorhídrico concentrado para equilibrar el pH',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: '¡Reacción Exotérmica Violenta!: La neutralización química sin control médico genera calor explosivo y quema el tejido por reacción térmica combinada. ¡Pierdes 1 vida!'
          }
        ],
        completed: false
      },
      {
        id: 508,
        x: 160,
        y: 460,
        type: 'sign',
        name: 'Pulsador de Alarma y Punto de Encuentro',
        roleOrSub: 'Plan de autoprotección y evacuación',
        title: 'Reto 8: Activación de Alarma y Evacuación al Punto de Encuentro',
        desc: 'El incendio de disolvente no se ha podido controlar con el extintor y amenaza los depósitos contiguos. ¿Cuál es la pauta de evacuación reglamentaria?',
        options: [
          {
            text: 'Romper el cristal del pulsador de alarma de emergencia, evacuar por las salidas señalizadas sin regresar por pertenencias y acudir al Punto de Encuentro para el recuento del personal',
            scoreDelta: 0.6,
            correct: true,
            explanation: 'Sobresaliente: El Plan de Autoprotección (RD 393/2007) exige alertar a todo el astillero y congregarse en el punto de reunión exterior para que los bomberos verifiquen si falta alguien.'
          },
          {
            text: 'Volver a los vestuarios a buscar la cartera y el teléfono móvil antes de salir',
            scoreDelta: -0.7,
            correct: false,
            damage: true,
            explanation: 'Atrapamiento por Humos: En 2 minutos los humos tóxicos y gases de cianuro bloquean los pasillos provocando desorientación y asfixia. ¡Pierdes 1 vida!'
          },
          {
            text: 'Marcharse a casa directamente sin avisar a nadie ni registrarse en el Punto de Encuentro',
            scoreDelta: -0.6,
            correct: false,
            explanation: 'Riesgo Crítico para los Rescatadores: Al no constar en el recuento del punto de encuentro, los bomberos arriesgarán su vida entrando a buscar a una persona que ya no está en peligro.'
          }
        ],
        completed: false
      }
    ]
  }
};

