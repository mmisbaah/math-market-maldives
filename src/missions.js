function generateUniqueMission(track, level, activeShop, customerIndex, usedKeysSet) {
        const products = activeShop.products;
        let attempt = 0;
        let mission = null;
        let key = '';

        const getRand = (offset) => {
          const str = `${track}-${level}-${activeShop.id}-${customerIndex}-${attempt}-${offset}`;
          let h = 0;
          for (let i = 0; i < str.length; i++) {
            h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
          }
          return Math.abs(h % 100000) / 100000;
        };

        do {
          attempt++;
          const pIdx1 = Math.floor(getRand(1) * products.length);
          let pIdx2 = Math.floor(getRand(2) * products.length);
          if (pIdx2 === pIdx1) pIdx2 = (pIdx1 + 1) % products.length;
          let pIdx3 = Math.floor(getRand(3) * products.length);
          if (pIdx3 === pIdx1 || pIdx3 === pIdx2) pIdx3 = (pIdx1 + 2) % products.length;

          const item1 = products[pIdx1];
          const item2 = products[pIdx2];
          const item3 = products[pIdx3];

          if (track === 'explorer') {
            if (level === 1) {
              const targetQty = 2 + Math.floor(getRand(4) * 8); // 2..9
              key = `exp-l1-${activeShop.id}-${item1.id}-${targetQty}`;
              mission = {
                title: 'Open for Business',
                skillName: 'KS1 Strand 1: Count & Match Quantities',
                instruction: `Assalamu alaikum! Please select exactly ${targetQty} ${item1.name}s from the shelf.`,
                instructionEs: `¡Assalamu alaikum! Elige exactamente ${targetQty} unidades de ${item1.name} del estante.`,
                targetQty: targetQty,
                item: item1,
                type: 'count_items',
                strategyName: 'Counting & One-to-One Correspondence',
                badgeName: 'KS1 Master Counter 🌟',
                hints: [
                  `Go to Step 2 (Shelves) and tap ${item1.name} ${targetQty} times.`,
                  `Count out loud: 1, 2, 3... up to ${targetQty}!`,
                  `Check your basket counter before proceeding.`
                ]
              };
            } else if (level === 2) {
              const qty1 = 2 + Math.floor(getRand(4) * 7);
              const qty2 = 2 + Math.floor(getRand(5) * 7);
              key = `exp-l2-${activeShop.id}-${item1.id}-${qty1}-${item2.id}-${qty2}`;
              mission = {
                title: 'Fill the Shelves',
                skillName: 'KS1 Strand 1: Compare & Count On',
                instruction: `I need ${qty1} ${item1.name}s and ${qty2} ${item2.name}s. What is the total item count?`,
                instructionEs: `Necesito ${qty1} unidades de ${item1.name} y ${qty2} de ${item2.name}. ¿Cuántos artículos hay en total?`,
                targetTotalQty: qty1 + qty2,
                expectedNumeric: qty1 + qty2,
                type: 'math_answer',
                strategyName: 'Counting On Strategy',
                badgeName: 'KS1 Shelf Stacker 📦',
                hints: [
                  `Start with ${qty1} and count on ${qty2} more.`,
                  `Sum calculation: ${qty1} + ${qty2} = ${qty1 + qty2}.`,
                  `Enter the total in Step 3 Payment.`
                ]
              };
            } else if (level === 3) {
              const a = 4 + Math.floor(getRand(4) * 7);
              const b = 3 + Math.floor(getRand(5) * 7);
              key = `exp-l3-${activeShop.id}-${item1.id}-${a}-${item2.id}-${b}`;
              mission = {
                title: 'Complete the Orders',
                skillName: 'KS1 Strand 1: Addition within 20',
                instruction: `An order requires ${a} ${item1.name}s plus ${b} ${item2.name}s. How many items total?`,
                instructionEs: `Un pedido lleva ${a} unidades de ${item1.name} y ${b} de ${item2.name}. ¿Cuántos artículos hay en total?`,
                expectedNumeric: a + b,
                type: 'math_answer',
                strategyName: 'Adding Parts to Whole',
                badgeName: 'KS1 Addition Ace ➕',
                hints: [
                  `Add the two amounts together: ${a} + ${b}.`,
                  `Make a 10 first to add easily!`,
                  `Result: ${a + b}.`
                ]
              };
            } else if (level === 4) {
              const price = (1 + Math.floor(getRand(4) * 8)) * 5;
              const notes = [20, 50, 100];
              const paidOptions = notes.filter(n => n > price);
              const paid = paidOptions[Math.floor(getRand(5) * paidOptions.length)] || price + 10;
              key = `exp-l4-${activeShop.id}-${price}-${paid}`;
              mission = {
                title: 'At the Checkout',
                skillName: 'KS1 Strand 2: MVR Currency & Subtraction',
                instruction: `The price is MVR ${price}. The customer pays with an MVR ${paid} note. Calculate exact MVR change.`,
                instructionEs: `El precio es ${price} MVR. El cliente paga con ${paid} MVR. Calcula el cambio exacto.`,
                expectedNumeric: paid - price,
                type: 'math_answer',
                strategyName: 'Count-Back Subtraction in MVR',
                badgeName: 'KS1 Change Maker 🪙',
                hints: [
                  `Subtract total price from payment: MVR ${paid} - MVR ${price}.`,
                  `Count up from MVR ${price} to MVR ${paid}.`,
                  `Exact Change = MVR ${paid - price}.`
                ]
              };
            } else if (level === 5) {
              const budget = (5 + Math.floor(getRand(4) * 6)) * 10;
              const qty = 2 + Math.floor(getRand(5) * 3);
              const unitP = Math.floor(budget / (qty + 1.5));
              const spent = unitP * qty;
              key = `exp-l5-${activeShop.id}-${item1.id}-${budget}-${qty}-${unitP}`;
              mission = {
                title: 'Smart Shopping',
                skillName: 'KS1 Strand 2: Whole Number MVR Budgeting',
                instruction: `With an MVR ${budget} budget, buying ${qty} ${item1.name}s at MVR ${unitP} each costs MVR ${spent}. How much MVR is left?`,
                instructionEs: `Tienes ${budget} MVR. Compras ${qty} unidades de ${item1.name} a ${unitP} MVR cada una y gastas ${spent} MVR. ¿Cuánto queda?`,
                expectedNumeric: budget - spent,
                type: 'math_answer',
                strategyName: 'Budget Allocation in MVR',
                badgeName: 'KS1 Smart Saver 💰',
                hints: [
                  `Calculate spent amount: ${qty} × MVR ${unitP} = MVR ${spent}.`,
                  `Subtract spent from budget: MVR ${budget} - MVR ${spent}.`,
                  `Remaining MVR = ${budget - spent}.`
                ]
              };
            } else {
              const a = 3 + Math.floor(getRand(4) * 6);
              const b = 3 + Math.floor(getRand(5) * 6);
              key = `exp-l6-${activeShop.id}-${item1.id}-${a}-${item2.id}-${b}`;
              mission = {
                title: 'Market Festival',
                skillName: 'KS1 Strand 1 & 2: Combined Operations',
                instruction: `Festival order: Serve ${a} ${item1.name}s and ${b} ${item2.name}s. Total items?`,
                instructionEs: `Pedido del festival: sirve ${a} unidades de ${item1.name} y ${b} de ${item2.name}. ¿Cuántos artículos son?`,
                expectedNumeric: a + b,
                type: 'math_answer',
                strategyName: 'Combined Assembly Strategy',
                badgeName: 'KS1 Island Festival Star 🎪',
                hints: [
                  `Add ${a} items + ${b} items.`,
                  `Sum = ${a + b} total items.`,
                  `Excellent job preparing for the festival!`
                ]
              };
            }
          } else if (track === 'manager') {
            if (level === 1) {
              const q1 = 2 + Math.floor(getRand(4) * 3);
              const q2 = 1 + Math.floor(getRand(5) * 2);
              const p1 = item1.price * q1;
              const p2 = item2.price * q2;
              key = `mgr-l1-${activeShop.id}-${item1.id}-${q1}-${item2.id}-${q2}`;
              mission = {
                title: 'Open for Business',
                skillName: 'KS2 Strand 1: Adding Whole MVR Prices',
                instruction: `Buying ${q1} ${item1.name}s (MVR ${item1.price.toFixed(2)} ea) + ${q2} ${item2.name} (MVR ${item2.price.toFixed(2)} ea). Total cost in MVR?`,
                instructionEs: `Compras ${q1} unidades de ${item1.name} (${item1.price.toFixed(2)} MVR cada una) y ${q2} de ${item2.name} (${item2.price.toFixed(2)} MVR cada una). ¿Cuál es el costo total?`,
                expectedNumeric: p1 + p2,
                type: 'math_answer',
                strategyName: 'Multi-Item MVR Addition',
                badgeName: 'KS2 Price Calculator 🏷',
                hints: [
                  `Item 1: ${q1} × MVR ${item1.price.toFixed(2)} = MVR ${p1.toFixed(2)}.`,
                  `Item 2: ${q2} × MVR ${item2.price.toFixed(2)} = MVR ${p2.toFixed(2)}.`,
                  `Total = MVR ${(p1 + p2).toFixed(2)}.`
                ]
              };
            } else if (level === 2) {
              const groups = 3 + Math.floor(getRand(4) * 6);
              const perGroup = 4 + Math.floor(getRand(5) * 6);
              key = `mgr-l2-${activeShop.id}-${item2.id}-${groups}-${perGroup}`;
              mission = {
                title: 'Fill the Shelves',
                skillName: 'KS2 Strand 1: Multiplication & Equal Groups',
                instruction: `Pack ${groups} boxes with ${perGroup} ${item2.name}s each. How many total items are packed?`,
                instructionEs: `Prepara ${groups} cajas con ${perGroup} unidades de ${item2.name} en cada una. ¿Cuántos artículos hay en total?`,
                expectedNumeric: groups * perGroup,
                type: 'math_answer',
                strategyName: 'Equal Groups Multiplication',
                badgeName: 'KS2 Equal Groups Expert 📦',
                hints: [
                  `Think: ${groups} groups of ${perGroup}.`,
                  `Multiplication: ${groups} × ${perGroup} = ${groups * perGroup}.`
                ]
              };
            } else if (level === 3) {
              const perPack = 3 + Math.floor(getRand(4) * 6);
              const packs = 3 + Math.floor(getRand(5) * 5);
              const totalItems = perPack * packs;
              key = `mgr-l3-${activeShop.id}-${item3.id}-${totalItems}-${packs}`;
              mission = {
                title: 'Complete the Orders',
                skillName: 'KS2 Strand 1: Division & Fair Sharing',
                instruction: `Divide ${totalItems} ${item3.name}s equally into ${packs} market gift packs. How many in each pack?`,
                instructionEs: `Reparte ${totalItems} unidades de ${item3.name} por igual entre ${packs} paquetes. ¿Cuántas van en cada paquete?`,
                expectedNumeric: perPack,
                type: 'math_answer',
                strategyName: 'Fair Share Division',
                badgeName: 'KS2 Division Master ➗',
                hints: [
                  `Divide total items by number of packs: ${totalItems} ÷ ${packs}.`,
                  `Think: What number × ${packs} = ${totalItems}?`,
                  `Each pack gets ${perPack} items.`
                ]
              };
            } else if (level === 4) {
              const totalPrice = (3 + Math.floor(getRand(4) * 12)) * 5;
              const notes = [50, 100, 500];
              const paid = notes.find(n => n > totalPrice) || totalPrice + 20;
              key = `mgr-l4-${activeShop.id}-${totalPrice}-${paid}`;
              mission = {
                title: 'At the Checkout',
                skillName: 'KS2 Strand 2: MVR Exact Change',
                instruction: `Total bill is MVR ${totalPrice.toFixed(2)}. Paid with an MVR ${paid.toFixed(2)} note. Calculate exact change in MVR.`,
                instructionEs: `La cuenta es de ${totalPrice.toFixed(2)} MVR. Pagan con ${paid.toFixed(2)} MVR. Calcula el cambio exacto.`,
                expectedNumeric: paid - totalPrice,
                type: 'math_answer',
                strategyName: 'Decimal Cash Subtraction',
                badgeName: 'KS2 Cashier Pro 💵',
                hints: [
                  `Subtract bill from note: MVR ${paid.toFixed(2)} - MVR ${totalPrice.toFixed(2)}.`,
                  `Change = MVR ${(paid - totalPrice).toFixed(2)}.`
                ]
              };
            } else if (level === 5) {
              const denominators = [2, 3, 4, 5];
              const den = denominators[Math.floor(getRand(4) * denominators.length)];
              const num = 1;
              const totalUnits = den * (2 + Math.floor(getRand(5) * 5));
              const ans = (totalUnits / den) * num;
              key = `mgr-l5-${activeShop.id}-${item2.id}-${num}/${den}-${totalUnits}`;
              mission = {
                title: 'Smart Shopping',
                skillName: 'KS2 Strand 1: Fractions & Parts',
                instruction: `A recipe calls for ${num}/${den} of a tray of ${item2.name}s (${totalUnits} units per tray). How many units is ${num}/${den}?`,
                instructionEs: `Una receta pide ${num}/${den} de una bandeja de ${item2.name} (${totalUnits} unidades por bandeja). ¿Cuántas unidades son ${num}/${den}?`,
                expectedNumeric: ans,
                type: 'math_answer',
                strategyName: 'Fractional Part Calculation',
                badgeName: 'KS2 Fraction Wizard 🍕',
                hints: [
                  `Divide total (${totalUnits}) by denominator (${den}).`,
                  `${num}/${den} of ${totalUnits} = ${ans} units.`,
                  `Result = ${ans}.`
                ]
              };
            } else {
              const packs = 2 + Math.floor(getRand(4) * 4);
              const fee = 5 * (1 + Math.floor(getRand(5) * 4));
              const total = (item1.price * packs) + fee;
              key = `mgr-l6-${activeShop.id}-${item1.id}-${packs}-${fee}`;
              mission = {
                title: 'Market Festival',
                skillName: 'KS2 Strand 1 & 2: Multistep Order Solving',
                instruction: `Order: ${packs} packs of ${item1.name} (MVR ${item1.price.toFixed(2)} ea) + MVR ${fee.toFixed(2)} delivery fee. Total bill in MVR?`,
                instructionEs: `Pedido: ${packs} paquetes de ${item1.name} (${item1.price.toFixed(2)} MVR cada uno) más ${fee.toFixed(2)} MVR de entrega. ¿Cuál es la cuenta total?`,
                expectedNumeric: total,
                type: 'math_answer',
                strategyName: 'Multi-Step Financial Order',
                badgeName: 'KS2 Festival Manager 👑',
                hints: [
                  `${packs} × MVR ${item1.price.toFixed(2)} = MVR ${(item1.price * packs).toFixed(2)}.`,
                  `Add delivery fee: MVR ${(item1.price * packs).toFixed(2)} + MVR ${fee.toFixed(2)}.`,
                  `Total bill = MVR ${total.toFixed(2)}.`
                ]
              };
            }
          } else {
            // Planner Track
            if (level === 1) {
              const price1 = 10 + Math.floor(getRand(4) * 30) + (Math.floor(getRand(5) * 20) * 0.05);
              const price2 = 10 + Math.floor(getRand(6) * 30) + (Math.floor(getRand(7) * 20) * 0.05);
              key = `pln-l1-${activeShop.id}-${price1.toFixed(2)}-${price2.toFixed(2)}`;
              mission = {
                title: 'Open for Business',
                skillName: 'KS2 Upper Strand 1: Decimal Addition',
                instruction: `Item A costs MVR ${price1.toFixed(2)} and Item B costs MVR ${price2.toFixed(2)}. Calculate total cost in MVR.`,
                instructionEs: `El artículo A cuesta ${price1.toFixed(2)} MVR y el B cuesta ${price2.toFixed(2)} MVR. Calcula el costo total.`,
                expectedNumeric: price1 + price2,
                type: 'math_answer',
                strategyName: 'Decimal Alignment Addition',
                badgeName: 'KS2 Decimal Specialist 🎯',
                hints: [
                  `Align decimal points: MVR ${price1.toFixed(2)} + MVR ${price2.toFixed(2)}.`,
                  `Total = MVR ${(price1 + price2).toFixed(2)}.`
                ]
              };
            } else if (level === 2) {
              const kg = 3 + Math.floor(getRand(4) * 8);
              const rate = (3 + Math.floor(getRand(5) * 8)) * 5;
              key = `pln-l2-${activeShop.id}-${kg}-${rate}`;
              mission = {
                title: 'Fill the Shelves',
                skillName: 'KS2 Upper Strand 2: Weight & Rates',
                instruction: `Produce costs MVR ${rate.toFixed(2)} per kg. What is the total cost for a ${kg} kg bag in MVR?`,
                instructionEs: `El producto cuesta ${rate.toFixed(2)} MVR por kg. ¿Cuánto cuesta una bolsa de ${kg} kg?`,
                expectedNumeric: kg * rate,
                type: 'math_answer',
                strategyName: 'Rate Multiplication',
                badgeName: 'KS2 Quantity Planner ⚖️',
                hints: [
                  `Multiply rate by weight: ${kg} × MVR ${rate.toFixed(2)}.`,
                  `Total = MVR ${(kg * rate).toFixed(2)}.`
                ]
              };
            } else if (level === 3) {
              const base = 2 + Math.floor(getRand(4) * 4);
              const scale = 2 + Math.floor(getRand(5) * 5);
              key = `pln-l3-${activeShop.id}-${base}-${scale}`;
              mission = {
                title: 'Complete the Orders',
                skillName: 'KS2 Upper Strand 1: Proportional Ratios',
                instruction: `A 1-batch recipe requires ${base} kg coconut. For a ${scale}-batch order, how many kg of coconut are needed?`,
                instructionEs: `Una tanda necesita ${base} kg de coco. ¿Cuántos kg hacen falta para ${scale} tandas?`,
                expectedNumeric: base * scale,
                type: 'math_answer',
                strategyName: 'Proportional Ratio Scaling',
                badgeName: 'KS2 Ratio Master 📐',
                hints: [
                  `Ratio base is ${base} kg per batch.`,
                  `Multiply base by batch scale: ${base} × ${scale}.`,
                  `Required = ${base * scale} kg.`
                ]
              };
            } else if (level === 4) {
              const rawTotal = (2 + Math.floor(getRand(4) * 8)) * 50;
              const discounts = [10, 15, 20, 25, 50];
              const discountPct = discounts[Math.floor(getRand(5) * discounts.length)];
              const discountAmt = rawTotal * (discountPct / 100);
              key = `pln-l4-${activeShop.id}-${rawTotal}-${discountPct}`;
              mission = {
                title: 'At the Checkout',
                skillName: 'KS2 Upper Strand 1: Percentage Discounts',
                instruction: `Bill total is MVR ${rawTotal.toFixed(2)}. Apply a ${discountPct}% Festival Discount. Calculate final price in MVR.`,
                instructionEs: `La cuenta es de ${rawTotal.toFixed(2)} MVR. Aplica un descuento del ${discountPct}% y calcula el precio final.`,
                expectedNumeric: rawTotal - discountAmt,
                type: 'math_answer',
                strategyName: 'Percentage Deduction Strategy',
                badgeName: 'KS2 Discount Strategist 🏷️',
                hints: [
                  `${discountPct}% of MVR ${rawTotal.toFixed(2)} = MVR ${discountAmt.toFixed(2)}.`,
                  `Deduct discount: MVR ${rawTotal.toFixed(2)} - MVR ${discountAmt.toFixed(2)}.`,
                  `Final Price = MVR ${(rawTotal - discountAmt).toFixed(2)}.`
                ]
              };
            } else if (level === 5) {
              const budget = (3 + Math.floor(getRand(4) * 6)) * 100;
              const itemCost = Math.floor(budget * (0.4 + getRand(5) * 0.4)) + 0.50;
              key = `pln-l5-${activeShop.id}-${budget}-${itemCost}`;
              mission = {
                title: 'Smart Shopping',
                skillName: 'KS2 Upper Strand 2: Capital & Budget Management',
                instruction: `With MVR ${budget.toFixed(2)} capital, after stock purchase of MVR ${itemCost.toFixed(2)}, how much capital remains in MVR?`,
                instructionEs: `Tienes ${budget.toFixed(2)} MVR de capital. Tras comprar existencias por ${itemCost.toFixed(2)} MVR, ¿cuánto queda?`,
                expectedNumeric: budget - itemCost,
                type: 'math_answer',
                strategyName: 'Capital Budgeting',
                badgeName: 'KS2 Budget Master 📊',
                hints: [
                  `Subtract stock cost from capital: MVR ${budget.toFixed(2)} - MVR ${itemCost.toFixed(2)}.`,
                  `Remaining capital = MVR ${(budget - itemCost).toFixed(2)}.`
                ]
              };
            } else {
              const revenue = (5 + Math.floor(getRand(4) * 8)) * 100;
              const costs = Math.floor(revenue * (0.5 + getRand(5) * 0.3));
              key = `pln-l6-${activeShop.id}-${revenue}-${costs}`;
              mission = {
                title: 'Market Festival',
                skillName: 'KS2 Upper Strand 1 & 2: Revenue, Costs & Net Profit',
                instruction: `Stall Summary: Total Revenue = MVR ${revenue.toFixed(2)}, Total Costs = MVR ${costs.toFixed(2)}. Calculate Net Profit in MVR.`,
                instructionEs: `Resumen del puesto: ingresos = ${revenue.toFixed(2)} MVR; costos = ${costs.toFixed(2)} MVR. Calcula la ganancia neta.`,
                expectedNumeric: revenue - costs,
                type: 'math_answer',
                strategyName: 'Profit Formula (Revenue - Costs)',
                badgeName: 'KS2 Market Tycoon 🏆',
                hints: [
                  `Net Profit = Revenue - Costs.`,
                  `MVR ${revenue.toFixed(2)} - MVR ${costs.toFixed(2)}.`,
                  `Net Profit = MVR ${(revenue - costs).toFixed(2)}.`
                ]
              };
            }
          }
        } while (usedKeysSet && usedKeysSet.has(key) && attempt < 50);

        if (usedKeysSet && key) {
          usedKeysSet.add(key);
        }

        return mission;
      }
export { generateUniqueMission };
