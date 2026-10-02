import { SHOPS } from './data.js';

const words = {
  en: {
    home: 'Home & Setup', serve: 'Serve Customers', picnic: 'Picnic Challenge', decorate: 'Decorator Shop', progress: 'NCF Progress',
    heroTag: 'MALDIVES MATH ADVENTURE', heroTitle: 'Your market awaits!', heroLead: 'Make your choices, then open your stall.',
    adventure: 'Adventure', sky: 'Island sky', stall: 'Your stall', shopkeeper: 'Shopkeeper', change: 'Change',
    trackHelp: 'Choose your math level', themeHelp: 'Change the market colors', stallHelp: 'Pick what your shop sells', avatarHelp: 'Choose your character',
    start: 'Open my market stall', chooseTrack: 'Choose your adventure', chooseTheme: 'Choose your island sky', chooseStall: 'Choose your market stall', chooseAvatar: 'Choose your shopkeeper',
    trackSub: 'Pick the math journey that feels right.', themeSub: 'Give your market a new look.', stallSub: 'Where will your shopkeeping story begin?', avatarSub: 'Who will welcome the first customer?', close: 'Close selection',
    question: 'The Question / Order', shelves: 'Select from Shelves', payment: 'Payment & Result', customer: 'Customer', level: 'Level', mission: 'Mission',
    orderPrompt: "Customer's question / order:", curriculum: 'NCF Curriculum Goal:', hint: 'Strategy Hint', hintOne: 'Read the order and decide which operation to use.', hintTwo: 'Work with the numbers in the order one step at a time.', hintAnswer: 'The answer is', hintCount: 'Choose only the requested product and count each tap.',
    toShelves: 'Go to shelves', shelvesTitle: 'Select products from the shelves', step2: 'Step 2 of 3', step3: 'Step 3 of 3', step2of2: 'Step 2 of 2',
    tray: 'Counting tray', selected: 'selected', packed: 'Packed basket', clear: 'Clear basket', emptyBasket: 'Tap a product above to add it to the basket.',
    backQuestion: 'Back to question', toPayment: 'Go to checkout', checkout: 'Checkout', checkoutFull: 'Checkout & calculation',
    selectedItems: 'Selected items:', itemsInBasket: 'items in basket', basketTotal: 'Basket total:', handBasket: 'Hand basket to customer',
    packedIntro: 'You have packed', packedOutro: 'in the basket for', enterAnswer: 'Enter your answer (MVR or quantity):', backShelves: 'Back to shelves', checkAnswer: 'Check answer & complete order',
    picnicTitle: 'Picnic Basket Challenge', picnicLead: 'Choose exactly 3 different items totaling 40–60 MVR.', picnicItems: 'Picnic basket:', total: 'Total:', submitPicnic: 'Submit picnic basket',
    decoratorTitle: 'Island Stall Decorator', decoratorLead: 'Customize your stall with earned coins.', coins: 'MVR coins', equipped: 'Equipped', equip: 'Equip', buy: 'Buy item',
    dashboardTitle: 'Learning progress', dashboardLead: 'Key Stage 1 & 2 mathematics', completed: 'Completed orders', independent: 'Solved independently', hintsUsed: 'Hints used', badges: 'Badges unlocked', badgeTitle: 'Curriculum badges:', noBadges: 'Serve customers to earn badges.',
    noCoins: 'Not enough coins. Serve more customers.', unlocked: 'Unlocked', validNumber: 'Enter a number using the keypad.', wrongAnswer: 'That answer is not correct. Try the calculation again.',
    perfect: 'Shukuriyaa! Perfect order! You earned 25 coins.', basketNeeds: 'Your basket needs exactly', adjustBasket: 'Go back to the shelves to adjust it.',
    picnicSuccess: 'Great picnic basket! You earned 50 coins.', picnicError: 'Choose exactly 3 different items totaling 40–60 MVR.',
    nextCustomer: 'Next customer', remove: 'Remove', myStall: 'My decorated stall', resume: 'Resume your order',
    levelPath: 'Your level path', retryLevel: 'Practice this level', resetProgress: 'Start a new game', resetConfirm: 'Clear saved progress and start a new game?', soundOn: 'Turn sound on', soundOff: 'Turn sound off'
  },
  es: {
    home: 'Inicio y opciones', serve: 'Atender clientes', picnic: 'Reto de picnic', decorate: 'Decorar puesto', progress: 'Progreso NCF',
    heroTag: 'AVENTURA MATEMÁTICA EN MALDIVAS', heroTitle: '¡Tu mercado te espera!', heroLead: 'Elige tus opciones y abre tu puesto.',
    adventure: 'Aventura', sky: 'Cielo isleño', stall: 'Tu puesto', shopkeeper: 'Vendedor', change: 'Cambiar',
    trackHelp: 'Elige tu nivel de matemáticas', themeHelp: 'Cambia los colores del mercado', stallHelp: 'Elige qué vende tu tienda', avatarHelp: 'Elige tu personaje',
    start: 'Abrir mi puesto', chooseTrack: 'Elige tu aventura', chooseTheme: 'Elige el cielo de tu isla', chooseStall: 'Elige tu puesto', chooseAvatar: 'Elige tu vendedor',
    trackSub: 'Elige la aventura matemática adecuada para ti.', themeSub: 'Dale otro aspecto al mercado.', stallSub: '¿Dónde empezará tu historia?', avatarSub: '¿Quién recibirá al primer cliente?', close: 'Cerrar selección',
    question: 'Pedido', shelves: 'Estantes', payment: 'Pago y resultado', customer: 'Cliente', level: 'Nivel', mission: 'Misión',
    orderPrompt: 'Pregunta o pedido del cliente:', curriculum: 'Objetivo curricular NCF:', hint: 'Pista', hintOne: 'Lee el pedido y decide qué operación necesitas.', hintTwo: 'Usa los números del pedido paso a paso.', hintAnswer: 'La respuesta es', hintCount: 'Elige solo el producto pedido y cuenta cada toque.',
    toShelves: 'Ir a los estantes', shelvesTitle: 'Elige productos de los estantes', step2: 'Paso 2 de 3', step3: 'Paso 3 de 3', step2of2: 'Paso 2 de 2',
    tray: 'Bandeja para contar', selected: 'elegidos', packed: 'Cesta preparada', clear: 'Vaciar cesta', emptyBasket: 'Toca un producto para añadirlo a la cesta.',
    backQuestion: 'Volver al pedido', toPayment: 'Ir a la caja', checkout: 'Caja', checkoutFull: 'Caja y cálculo',
    selectedItems: 'Artículos elegidos:', itemsInBasket: 'en la cesta', basketTotal: 'Total de la cesta:', handBasket: 'Entregar cesta al cliente',
    packedIntro: 'Has preparado', packedOutro: 'en la cesta para', enterAnswer: 'Escribe tu respuesta (MVR o cantidad):', backShelves: 'Volver a estantes', checkAnswer: 'Comprobar y completar pedido',
    picnicTitle: 'Reto de cesta de picnic', picnicLead: 'Elige exactamente 3 artículos distintos por 40–60 MVR.', picnicItems: 'Cesta de picnic:', total: 'Total:', submitPicnic: 'Enviar cesta de picnic',
    decoratorTitle: 'Decorar el puesto', decoratorLead: 'Personaliza tu puesto con monedas ganadas.', coins: 'monedas MVR', equipped: 'Equipado', equip: 'Equipar', buy: 'Comprar',
    dashboardTitle: 'Progreso de aprendizaje', dashboardLead: 'Matemáticas de las etapas 1 y 2', completed: 'Pedidos completados', independent: 'Resueltos sin ayuda', hintsUsed: 'Pistas usadas', badges: 'Insignias ganadas', badgeTitle: 'Insignias curriculares:', noBadges: 'Atiende clientes para ganar insignias.',
    noCoins: 'No hay suficientes monedas. Atiende más clientes.', unlocked: 'Desbloqueado', validNumber: 'Escribe un número con el teclado.', wrongAnswer: 'La respuesta no es correcta. Vuelve a calcular.',
    perfect: '¡Shukuriyaa! Pedido perfecto. Ganaste 25 monedas.', basketNeeds: 'Tu cesta necesita exactamente', adjustBasket: 'Vuelve a los estantes para corregirla.',
    picnicSuccess: '¡Excelente cesta de picnic! Ganaste 50 monedas.', picnicError: 'Elige exactamente 3 artículos distintos por 40–60 MVR.',
    nextCustomer: 'Siguiente cliente', remove: 'Quitar', myStall: 'Mi puesto decorado', resume: 'Continuar pedido',
    levelPath: 'Ruta de niveles', retryLevel: 'Practicar este nivel', resetProgress: 'Empezar de nuevo', resetConfirm: '¿Borrar el progreso guardado y empezar de nuevo?', soundOn: 'Activar sonido', soundOff: 'Silenciar sonido'
  }
};

const shopNames = {
  fruit: ['Island Produce Stall', 'Puesto de frutas de la isla'], bakery: ['Island Bakery & Hedhikaa', 'Panadería y hedhikaa'],
  garden: ['Island Agriculture & Seeds', 'Cultivos y semillas'], toy: ['Island Crafts & Toys', 'Artesanías y juguetes'],
  ocean: ['Ocean & Fishery Supply', 'Pesca y suministros marinos'], space: ['Space Depot & Tech', 'Depósito espacial']
};
const shopDescriptionsEs = {
  fruit: 'Frutas, cocos y productos frescos de Maldivas',
  bakery: 'Roshi y meriendas tradicionales recién hechas',
  garden: 'Plantas de invernadero, chiles y semillas',
  toy: 'Dhonis artesanales, juegos y rompecabezas',
  ocean: 'Equipo de pesca y artículos del océano',
  space: 'Alimentos y tecnología para exploradores espaciales'
};
const productNames = {
  kurumba: 'Coco kurumba', papaya: 'Papaya falho', mango: 'Mango anbu', lime: 'Lima limbo', watermelon: 'Sandía karakah', curryleaves: 'Hojas de curry',
  gulha: 'Gulha de pescado', masrooshi: 'Masrooshi', bajiya: 'Bajiya de pescado', roshi: 'Roshi fresco', bondibaiy: 'Saagu bondibaiy', cupcake: 'Pastelito de coco',
  mirus: 'Planta de chile mirus', papayaseed: 'Semillas de papaya', can: 'Regadera', pot: 'Maceta de barro', fertilizer: 'Abono isleño', sapling: 'Palmera joven',
  dhoni: 'Dhoni de madera', blocks: 'Bloques de cáscara de coco', puzzle: 'Rompecabezas de arrecife', top: 'Peonza', bear: 'Tortuga de peluche', shellcraft: 'Artesanía de caracolas',
  roanu: 'Cuerda de fibra roanu', tuna: 'Atún listado', yellowfin: 'Trozo de atún aleta amarilla', reel: 'Carrete de pesca', compass: 'Brújula de latón', hat: 'Sombrero de pescador',
  astrosnack: 'Ración espacial', oxygen: 'Cápsula de oxígeno', battery: 'Célula solar', crystal: 'Cristal de energía', spacejuice: 'Agua de coco espacial', robotkit: 'Piezas de sensor robótico'
};
const themes = { sunny: 'Playa soleada', sunset: 'Atardecer del atolón', lagoon: 'Laguna azul', night: 'Mercado nocturno', jungle: 'Palmeras verdes' };
const upgradeNames = { awning_red: 'Toldo tradicional a rayas', awning_mint: 'Toldo tropical verde', sign_gold: 'Letrero brillante', mascot_parrot: 'Mascota loro', plant_flower: 'Macetas de hibisco', lamp_festive: 'Faroles de festival' };
const customerStoriesEs = [
  'Busca frutas y meriendas para la familia.',
  'Prepara semillas y tierra para plantar en la isla.',
  'Reúne provisiones para navegar por el atolón.',
  'Busca ingredientes para preparar hedhikaa.',
  'Reúne materiales para la clase de matemáticas.',
  'Calcula alimentos para una investigación de salud.'
];
const customerNamesEs = ['Aminath de Malé', 'Moosa el agricultor', 'Capitán Ibrahim', 'Mariyam la panadera', 'Hawwa la maestra', 'Dr. Hassan'];
const skillNamesEs = {
  'KS1 Strand 1: Count & Match Quantities': 'Etapa 1: contar y relacionar cantidades',
  'KS1 Strand 1: Compare & Count On': 'Etapa 1: comparar y seguir contando',
  'KS1 Strand 1: Addition within 20': 'Etapa 1: sumas hasta 20',
  'KS1 Strand 2: MVR Currency & Subtraction': 'Etapa 1: dinero y restas',
  'KS1 Strand 2: Whole Number MVR Budgeting': 'Etapa 1: presupuestos sencillos',
  'KS1 Strand 1 & 2: Combined Operations': 'Etapa 1: operaciones combinadas',
  'KS2 Strand 1: Adding Whole MVR Prices': 'Etapa 2: sumar precios',
  'KS2 Strand 1: Multiplication & Equal Groups': 'Etapa 2: multiplicar grupos iguales',
  'KS2 Strand 1: Division & Fair Sharing': 'Etapa 2: dividir y repartir',
  'KS2 Strand 2: MVR Exact Change': 'Etapa 2: calcular el cambio',
  'KS2 Strand 1: Fractions & Parts': 'Etapa 2: fracciones y partes',
  'KS2 Strand 1 & 2: Multistep Order Solving': 'Etapa 2: problemas de varios pasos',
  'KS2 Upper Strand 1: Decimal Addition': 'Etapa 2 avanzada: sumar decimales',
  'KS2 Upper Strand 2: Weight & Rates': 'Etapa 2 avanzada: peso y tarifas',
  'KS2 Upper Strand 1: Proportional Ratios': 'Etapa 2 avanzada: proporciones',
  'KS2 Upper Strand 1: Percentage Discounts': 'Etapa 2 avanzada: descuentos porcentuales',
  'KS2 Upper Strand 2: Capital & Budget Management': 'Etapa 2 avanzada: capital y presupuesto',
  'KS2 Upper Strand 1 & 2: Revenue, Costs & Net Profit': 'Etapa 2 avanzada: ingresos, costos y ganancias'
};

export const t = (language, key) => words[language]?.[key] || words.en[key] || key;
export const localShop = (language, shop) => language === 'es' ? (shopNames[shop.id]?.[1] || shop.name) : shop.name;
export const localShopDescription = (language, shop) => language === 'es' ? (shopDescriptionsEs[shop.id] || shop.subtitle) : shop.subtitle;
export const localProduct = (language, product) => language === 'es' ? (productNames[product.id] || product.name) : product.name;
export const localTheme = (language, theme) => language === 'es' ? (themes[theme.id] || theme.name) : theme.name;
export const localUpgrade = (language, upgrade) => language === 'es' ? (upgradeNames[upgrade.id] || upgrade.name) : upgrade.name;
export const localCustomerStory = (language, customerIndex, customer) => language === 'es' ? customerStoriesEs[customerIndex % customerStoriesEs.length] : customer.story;
export const localCustomerName = (language, customerIndex, customer) => language === 'es' ? customerNamesEs[customerIndex % customerNamesEs.length] : customer.name;
export const localSkill = (language, skillName) => language === 'es' ? (skillNamesEs[skillName] || skillName) : skillName;
export const localMission = (language, mission) => {
  let text = language === 'es' ? mission.instructionEs || mission.instruction : mission.instruction;
  if (language === 'es') {
    for (const [id, translated] of Object.entries(productNames)) {
      const original = Object.values(importedProducts).find(product => product.id === id)?.name;
      if (original) text = text.replaceAll(original, translated);
    }
  }
  return text;
};

const importedProducts = Object.values(SHOPS).flatMap(shop => shop.products);
