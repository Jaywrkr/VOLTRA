// @ts-nocheck
import { useState, useCallback, useEffect, useRef } from "react";

// Equipment: 10kg | 6.8kg (15lbs) | 4.5kg (10lbs) | BW
// NO exercises using two of the same KB weight simultaneously
// NO supersets, NO arrows
// Week starts Monday
// Order: LUN MAR MIE JUE VIE SAB DOM

const EX = {
  // ESPALDA
  bentOverRow:      { steps:["Inclinado ~45°, espalda recta. KB de 10kg colgando con el brazo extendido al frente.","Jala el codo hacia atrás y arriba, cerca del cuerpo. KB llega al nivel de la cadera. Pausa 1 segundo arriba. Baja lentamente."], cue:"Piensa en meter el codo al bolsillo trasero del pantalón — eso activa el dorsal correctamente." },
  bentOverRowPause: { steps:["Igual que la row estándar pero más lento. KB de 10kg.","Al llegar arriba, aprieta el omóplato 2 segundos antes de bajar. Baja en 4 segundos. La pausa fuerza la contracción máxima."], cue:"La pausa arriba no da trampa posible — el músculo trabaja al máximo en ese punto." },
  renegadeRow:      { steps:["Posición de plancha, manos en el suelo. KB de 10kg en el suelo como apoyo de una mano. Pies bien separados para equilibrio.","Jala el KB hacia la cadera mientras el otro brazo sostiene. Pausa 1s arriba. Baja controlado. Las caderas no rotan."], cue:"Más separados los pies = más estable. El renegade entrena espalda y core al mismo tiempo." },
  kbSwing:          { steps:["KB de 10kg. Pies a la anchura de hombros. Empuja las caderas hacia atrás — el KB pasa entre las piernas como péndulo.","Empuja las caderas explosivamente hacia adelante. El KB sube hasta la altura del pecho por inercia pura. Los brazos no jalan."], cue:"Swing = ejercicio de caderas. Si sientes los brazos trabajar fuerte, la técnica está mal." },
  kbSwingSingle:    { steps:["Igual que el swing bilateral pero con una sola mano en el KB de 10kg. El cuerpo intentará rotar.","Resiste la rotación activamente con el core. Completa todas las reps de un lado antes de cambiar."], cue:"El core trabaja el doble resistiendo la rotación. Eso es fuerza funcional real." },
  deadlift:         { steps:["KB de 10kg en el suelo entre los pies. Empuja las caderas hacia atrás, agarra el KB, espalda completamente recta y neutral.","Empuja el suelo con los pies y extiende caderas y rodillas al mismo tiempo. Arriba: caderas extendidas, hombros atrás. Baja en 3 segundos."], cue:"Bisagra de cadera, no sentadilla. La diferencia: en el DL las caderas van atrás primero, no las rodillas." },
  pulloverKb:       { steps:["Boca arriba. KB de 10kg sostenido con ambas manos sobre el pecho, brazos casi completamente rectos.","Baja el KB detrás de la cabeza, manteniéndolo cerca de ella. Sientes el estiramiento del dorsal. Regresa lentamente."], cue:"El único ejercicio que estira completamente el dorsal sin jalón. No lo saltes." },
  // BÍCEPS
  bicepCurl:        { steps:["De pie, KB de 6.8kg en una mano, brazo extendido al costado. El codo es el único punto que se mueve.","Curla el KB hacia el hombro. Pausa 1 segundo arriba. Baja en 3 segundos — esa bajada es el 70% del trabajo."], cue:"3 segundos bajando siempre. Si no los cuentas, dejas músculo sin trabajar." },
  hammerCurl:       { steps:["Igual que el curl pero con agarre neutral — como sostener un martillo. KB de 6.8kg al costado.","Curla hacia el hombro con el agarre lateral. Este agarre trabaja más el braquial y el antebrazo además del bíceps."], cue:"El hammer curl construye el grosor del brazo más que el curl estándar." },
  concentrationCurl:{ steps:["Sentado, codo de la mano con el KB apoyado en la parte interna del muslo. KB de 6.8kg colgando.","Curla lentamente hacia el hombro. El codo no se despega del muslo. Baja en 4 segundos. Movimiento puro de bíceps."], cue:"El mejor aislamiento del bíceps disponible sin máquinas. Lento siempre — sin impulso." },
  // HOMBROS
  kbPress:          { steps:["KB de 6.8kg en una mano al nivel del hombro. Codo debajo de la muñeca. Core activado — no arquees la espalda.","Presiona hacia arriba a extensión completa. El bícep queda junto a la oreja arriba. Baja en 3 segundos."], cue:"Si arqueas la espalda para empujar, el peso es demasiado. El core sostiene todo." },
  lateralRaise:     { steps:["KB de 4.5kg en una mano al costado del cuerpo. Codo ligeramente doblado y fijo durante todo el movimiento.","Sube lateralmente hasta la altura del hombro — no más arriba. Baja en 4 segundos. Ahí crece el deltoides lateral."], cue:"4 segundos bajando siempre. Si usas impulso del cuerpo para subir, reduce el peso." },
  frontRaise:       { steps:["KB de 4.5kg en una mano al frente del cuerpo, brazo extendido.","Sube al frente hasta la altura del hombro exactamente. No más. Baja en 3 segundos. Alterna brazos."], cue:"No subas más que el hombro — aumenta el riesgo de lesión sin añadir beneficio." },
  uprightRow:       { steps:["KB de 6.8kg con ambas manos al frente del cuerpo, brazos extendidos hacia abajo.","Sube el KB hacia la barbilla llevando los codos hacia arriba y afuera. Codos más altos que las muñecas. Baja lento."], cue:"No subas más alto que la barbilla. Los codos guían el movimiento — las manos solo sostienen." },
  kbHalo:           { steps:["KB de 4.5kg sostenido por la base (cuernos arriba) con ambas manos al nivel del pecho.","Pasa el KB lentamente alrededor de la cabeza en un círculo completo. El torso no se mueve. Alterna la dirección."], cue:"Lento y controlado. Rápido significa que no estás trabajando los estabilizadores del manguito rotador." },
  cleanPress:       { steps:["KB de 6.8kg. Haz un swing de un brazo y en lugar de dejarlo ir al frente, dóblalo hacia el hombro — queda en rack position al hombro.","Desde el hombro, presiona hacia arriba a extensión completa. Baja al hombro y vuelve al swing. Una secuencia continua."], cue:"El clean no es un curl. El KB sube por inercia del swing — no lo estés jalando con el brazo." },
  kbWindmill:       { steps:["KB de 6.8kg en la mano derecha extendida hacia el techo. Pies más separados que los hombros, puntas afuera.","Inclínate hacia la izquierda deslizando la mano izquierda por la pierna izquierda. El KB siempre arriba — mira hacia el KB. Regresa lento."], cue:"El KB se queda arriba todo el tiempo. Es estabilidad de hombro más core lateral." },
  // TRÍCEPS
  tricepExt:        { steps:["De pie o sentado, KB de 6.8kg sostenido con ambas manos detrás de la cabeza. Codos apuntando al techo — son el eje fijo.","Extiende los brazos hacia arriba a extensión completa. Baja en 3 segundos. Los codos NO se mueven durante todo el ejercicio."], cue:"Si los codos se mueven, no estás trabajando el tríceps — estás compensando con los hombros." },
  tricepKickback:   { steps:["Inclinado hacia adelante ~45°. KB de 4.5kg en una mano. Codo pegado al cuerpo, brazo doblado a 90°.","Extiende el brazo hacia atrás hasta quedar completamente recto. Sostén 1 segundo. Baja en 3 segundos. El codo no se mueve."], cue:"La pausa al llegar arriba es donde el tríceps trabaja al máximo. No te la saltes." },
  diamondPushup:    { steps:["Manos en el suelo formando un triángulo con pulgares e índices tocándose, debajo del pecho. Cuerpo recto.","Baja hasta casi tocar las manos. Los codos apuntan hacia atrás. Sube. Mucho más difícil que el push-up normal."], cue:"Ejercicio principal de tríceps con peso corporal. 8 reps lentas superan a 20 rápidas." },
  // PIERNAS
  gobletSquat:      { steps:["KB de 10kg al pecho con ambas manos. Pies a la anchura de los hombros o un poco más, puntas ligeramente afuera. Core activado.","Baja en 3 segundos empujando las rodillas hacia afuera. Caderas por debajo de las rodillas. Sube empujando el suelo con los pies."], cue:"Las rodillas siguen los pies — nunca colapsen hacia adentro." },
  splitSquat:       { steps:["Un pie adelante, otro atrás. KB de 10kg en ambas manos (uno en cada mano) o colgando de una mano. Distancia larga entre pies.","Baja la rodilla trasera hacia el suelo sin tocarlo — en 3 segundos. Rodilla delantera no pasa la punta del pie. Sube empujando con el talón delantero."], cue:"El peso va en el pie de adelante — el de atrás solo equilibra." },
  sumoSquat:        { steps:["KB de 10kg colgando con ambas manos entre las piernas. Pies más separados que los hombros, puntas a 45°.","Baja en 3 segundos. Pausa 2 segundos abajo. Sube empujando los talones y apretando glúteos."], cue:"El sumo trabaja más el aductor y el glúteo que el goblet estándar. Ambos se complementan." },
  rdl:              { steps:["KB de 10kg con ambas manos al frente del cuerpo. Rodillas ligeramente dobladas. Empuja las caderas hacia atrás, espalda recta.","Baja el KB por las piernas hasta sentir tensión fuerte en los isquios. Para. Regresa empujando las caderas al frente."], cue:"Sentirás tensión en la parte trasera de los muslos. Si no la sientes, inclínate más hacia adelante." },
  singleLegDL:      { steps:["De pie sobre una pierna. KB de 10kg en la mano opuesta al pie de apoyo. Rodilla de apoyo ligeramente doblada.","Inclínate con espalda recta: el KB baja, la pierna libre sube como contrapeso. Caderas cuadradas, sin rotar."], cue:"Fija la mirada en un punto del suelo. Estabilidad = músculo profundo activado." },
  gluteBridge:      { steps:["Boca arriba, rodillas dobladas, pies cerca de los glúteos. KB de 10kg apoyado sobre las caderas — sostenlo con las manos.","Empuja las caderas hacia el techo apretando los glúteos con fuerza. Pausa 2 segundos arriba. Baja lentamente."], cue:"Pausa 2 segundos arriba siempre — sin esa pausa no activas el glúteo al máximo." },
  lateralLunge:     { steps:["De pie, pies juntos. KB de 10kg colgando en una mano o al pecho. Da un paso amplio hacia un lado.","El pie que aterriza queda completamente plano en el suelo. Dobla esa rodilla hasta muslo paralelo. La otra pierna queda estirada. Regresa empujando con el talón."], cue:"La rodilla sigue el pie — nunca colapse hacia adentro." },
  gobletHold:       { steps:["KB de 4.5kg al pecho. Baja a posición de sentadilla profunda, caderas por debajo de las rodillas.","Usa los codos para empujar las rodillas afuera suavemente. Respira profundo. El peso te lleva más abajo con cada exhalación."], cue:"No fuerces. El stretch de cadera mejora con la respiración, no con la fuerza bruta." },
  // PECHO
  floorPress:       { steps:["Boca arriba. KB de 10kg en una mano al nivel del pecho. Codo apoyado en el suelo a 45° del cuerpo.","Presiona hacia el techo a extensión completa. Baja en 3 segundos hasta que el codo toque el suelo. Pausa 1 segundo antes de subir."], cue:"3 segundos bajando. El suelo protege el hombro — más seguro que el press estándar." },
  floorFly:         { steps:["Boca arriba. KB de 6.8kg en una mano, brazo extendido hacia el lado. Ligera flexión en el codo.","Sube el KB hacia el centro del pecho como si abrazaras. Baja en 4 segundos. Una mano a la vez. El pecho hace todo el trabajo."], cue:"El único ejercicio que estira y contrae el pecho simultáneamente. No lo saltes." },
  pushup:           { steps:["Manos a la anchura de los hombros en el suelo. Cuerpo completamente recto. Codos a 45° del cuerpo — ni completamente cerrados ni abiertos.","Baja en 3 segundos hasta que el pecho casi toque el suelo. Sube explosivo. Si no mantienes el cuerpo recto, baja las rodillas."], cue:"Calidad sobre cantidad. 6 perfectos con 3 segundos > 20 rápidos." },
  pushupArcher:     { steps:["Posición de push-up con brazos más abiertos. Al bajar, desplázate hacia un lado: ese codo dobla completamente, el otro queda casi recto.","Alterna el lado. Trabaja el pecho de forma unilateral — más difícil que el push-up estándar."], cue:"El brazo casi recto trabaja el pecho externo desde un ángulo diferente." },
  pushupClose:      { steps:["Manos más juntas de lo normal, debajo del pecho. Cuerpo recto.","Baja lentamente. Los codos apuntan hacia atrás al bajar — no se abren hacia los lados. Trabaja pecho interno y tríceps."], cue:"No confundir con diamond — aquí los codos van hacia atrás, no hacia afuera." },
  // CORE
  plank:            { steps:["Antebrazos en el suelo, codos directamente debajo de los hombros. Cuerpo en línea recta de cabeza a talones.","Mantén apretando el abdomen Y los glúteos al mismo tiempo. Respira con normalidad."], cue:"Sin glúteos apretados pierdes la mitad del trabajo abdominal." },
  plankShoulder:    { steps:["Plancha con brazos rectos, manos bajo los hombros. Pies bien separados para mayor estabilidad.","Lleva una mano al hombro opuesto mientras te sostienes en la otra. Vuelve. Alterna. Las caderas no deben rotar."], cue:"Cierra los pies para hacerlo más difícil. Empieza con pies separados." },
  plankDrag:        { steps:["Plancha con brazos rectos. KB de 4.5kg en el suelo a un lado. Core muy activado.","Con la mano opuesta arrastra el KB por debajo de tu cuerpo hacia el otro lado. Las caderas no se mueven."], cue:"Si las caderas rotan, separa más los pies. El objetivo es anti-rotación." },
  deadbug:          { steps:["Boca arriba, espalda baja pegada al suelo. Brazos extendidos al techo. Rodillas dobladas a 90° en el aire.","Baja simultáneamente el brazo derecho hacia atrás y la pierna izquierda hacia el suelo. Exhala todo el aire. Regresa y alterna."], cue:"Si la espalda baja se levanta del suelo, el movimiento es demasiado grande. Reduce el rango." },
  legRaise:         { steps:["Boca arriba, manos bajo los glúteos para proteger la zona lumbar. Piernas juntas y rectas, levantadas ligeramente del suelo.","Sube las piernas a 90°. Baja en 4 segundos — muy lentamente. Para antes de tocar el suelo y repite."], cue:"La bajada lenta es el ejercicio real. Si caes rápido, pierdes el 70% del trabajo." },
  hollowHold:       { steps:["Boca arriba, espalda baja presionada contra el suelo. Sube los hombros del suelo. Extiende los brazos atrás de la cabeza.","Sube las piernas a unos 30° del suelo — no 90°. Cuerpo en forma de U invertida. Si la espalda baja se despega, sube más las piernas."], cue:"Más abajo las piernas = más difícil. Progresa gradualmente cada semana." },
  hollowRock:       { steps:["Posición hollow hold: hombros arriba, piernas a 30°, brazos atrás de la cabeza.","Rockea hacia adelante y atrás manteniendo la forma de arco. No pierdas la posición hollow al moverse."], cue:"Si pierdes la forma al rockear, vuelve al hold estático primero." },
  russianTwist:     { steps:["Sentado a 45°, rodillas dobladas, pies levantados ligeramente. KB de 4.5kg en ambas manos.","Rota el torso completamente hacia un lado hasta casi tocar el suelo con el KB. Regresa al centro y al otro lado."], cue:"La rotación viene del torso — los brazos solo transportan el peso." },
  russianHeavy:     { steps:["Igual que el russian twist pero con el KB de 6.8kg en las manos.","Rota completamente — el KB toca o casi toca el suelo en cada lado. Control al pasar por el centro."], cue:"Si pierdes el equilibrio, baja los pies al suelo hasta que domines el movimiento." },
  bicycle:          { steps:["Boca arriba, manos detrás de la cabeza sin jalar el cuello. Rodillas dobladas a 90° en el aire.","Codo derecho hacia rodilla izquierda mientras extiendes la pierna derecha. Lento y controlado. Alterna."], cue:"No es velocidad — es rotación del torso. Lento significa más trabajo en los oblicuos." },
  toeTouches:       { steps:["Boca arriba. Piernas extendidas hacia el techo, perpendiculares al suelo.","Sube las manos hacia los pies contrayendo el abdomen. Los hombros se despegan del suelo. Baja lentamente."], cue:"Las piernas apuntan al techo todo el tiempo. No dejes que caigan hacia adelante." },
  crunches:         { steps:["Boca arriba, rodillas dobladas, pies apoyados en el suelo. Manos detrás de la cabeza sin jalar.","Contrae el abdomen y sube los hombros del suelo. Movimiento pequeño y controlado. Baja lentamente."], cue:"El movimiento es pequeño. Si jalas el cuello, cruza los brazos al pecho en su lugar." },
  mountainClimber:  { steps:["Posición de plancha con brazos rectos. Core activado.","Lleva una rodilla al pecho rápidamente, regresa y alterna. Las caderas no suben ni bajan — se quedan completamente quietas."], cue:"Si las caderas se mueven, ve más lento hasta controlar el movimiento." },
  farmerCarry:      { steps:["KB de 10kg en una mano y KB de 6.8kg en la otra. Postura completamente erguida, hombros atrás y abajo.","Camina con pasos normales. No te inclines hacia ningún lado. Si te inclinas, el peso es demasiado."], cue:"Imagina que llevas una copa de agua en la cabeza — ese nivel de control." },
  suitcaseCarry:    { steps:["Solo el KB de 10kg en una mano. Postura erguida. El peso te jalará hacia ese lado — resiste activamente con el core.","Camina manteniendo los hombros completamente nivelados. Cambia de mano al regresar."], cue:"Entrena el core anti-lateral — uno de los movimientos más funcionales del plan." },
  hipCircles:       { steps:["De pie, manos en las caderas. Dibuja círculos grandes con las caderas — 10 hacia cada lado lentamente.","Leg swings: apoyado de una pared, balancea una pierna adelante y atrás con control. 10 reps por pierna. Luego lateral."], cue:"El rango de movimiento aumenta solo al calentarse. No fuerces." },
  catCow:           { steps:["En cuatro patas, manos bajo los hombros. Exhala: arquea la espalda hacia arriba (gato), cabeza baja.","Inhala: hunde la espalda hacia abajo (vaca), cabeza arriba. Alterna lentamente. Luego rota el torso de lado a lado."], cue:"Hazlo despacio y con consciencia. Mantiene la columna sana." },
  activation:       { steps:["Arm circles amplios hacia adelante y hacia atrás. Shoulder rolls hacia adelante y atrás.","Movimiento continuo y dinámico. El rango de movimiento aumenta progresivamente con cada repetición."], cue:"Nunca estiramiento estático antes de entrenar. Siempre movimiento dinámico." },
  kbRowLight:       { steps:["Inclinado ~45°, espalda recta. KB de 6.8kg, brazo extendido. Es el warm-up del antagonista.","Jala el codo hacia atrás — foco en sentir la retracción de la escápula. Liviano y controlado."], cue:"El objetivo es activar la espalda antes de presionar, no fatigarla." },
  pushupLight:      { steps:["Push-up normal a ritmo normal — solo para activar el pecho antes de jalar.","5 a 10 repeticiones sin esfuerzo máximo. El objetivo es calentar el pecho y los tríceps."], cue:"Warm-up del antagonista. El pecho activo estabiliza el hombro al jalar." },
  fitxrBox:         { steps:["Posición de boxeo: peso en la parte media del pie, rodillas ligeramente dobladas, manos arriba protegiéndote.","Golpea los targets combinando jabs, crosses, hooks y uppercuts. El poder viene del giro de las caderas, no solo del brazo."], cue:"Rota las caderas en cada golpe — ahí está la potencia real." },
  fitxrCombat:      { steps:["Posición atlética. Sigue los targets con todo el cuerpo: pies, caderas y brazos coordinados.","Foco en el footwork: mueve los pies antes de golpear. No te quedes estático en ningún momento."], cue:"Footwork activo = más calorías quemadas y mejor coordinación." },
  fitxrHiit:        { steps:["Sigue las instrucciones del modo HIIT al máximo esfuerzo absoluto. No moderes.","Recupera activamente en los descansos — sigue moviéndote ligeramente, no te detengas por completo."], cue:"HIIT funciona solo si el esfuerzo es real. La incomodidad es la señal de que está funcionando." },
  fitxrFlow:        { steps:["Pace moderado y fluido. Sigue los movimientos con toda la amplitud posible de movimiento.","Respira profundo y controlado. Flow activa sin fatigar — es recuperación activa con carga."], cue:"Flow no es fácil — es controlado. Hay una diferencia importante entre los dos." },
};

// ─── 8-Week hypertrophy + fat-burn program ────────────────────────────────────
// S1  Base A      — 4s exc, 4×12 main, todos los grupos
// S2  Volumen A   — 5×12, mismo peso, más trabajo total
// S3  Variación A — ejercicios distintos, mismos músculos
// S4  Intensidad A— 5s exc, 5×8, tiempo bajo tensión máximo
// S5  Deload      — 3×10, forma perfecta, músculo se consolida
// S6  Base B      — 4s exc, 4×10, ejercicios nuevos
// S7  Volumen B   — 5×10, +1 serie
// S8  Peak        — 5s exc, 6×8, máximo esfuerzo del ciclo

const WEEK_META = [
  { label:"Semana 1", tag:"Base A",      color:"#3b82f6", desc:"Establece los patrones. 4s excéntrico en todo. 4×12 en ejercicios principales." },
  { label:"Semana 2", tag:"Volumen A",   color:"#6366f1", desc:"+1 serie en todo. Mismo peso, más volumen total. El cuerpo responde." },
  { label:"Semana 3", tag:"Variación A", color:"#f97316", desc:"Ejercicios distintos, mismos músculos. El cuerpo no anticipa — crece." },
  { label:"Semana 4", tag:"Intensidad A",color:"#ef4444", desc:"5s excéntrico, 5 series. Tiempo bajo tensión máximo — el músculo explota." },
  { label:"Semana 5", tag:"Deload",      color:"#94a3b8", desc:"3×10, forma perfecta. El músculo se consolida durante el descanso activo." },
  { label:"Semana 6", tag:"Base B",      color:"#0ea5e9", desc:"Nuevo ciclo, ejercicios frescos. La base B construye sobre la A." },
  { label:"Semana 7", tag:"Volumen B",   color:"#8b5cf6", desc:"5 series en todo. Más trabajo que S2 — base más sólida debajo." },
  { label:"Semana 8", tag:"Peak",        color:"#fbbf24", desc:"El máximo del ciclo. 6 series, 5s excéntrico. Cada rep debe costar." },
];

// ─── Day factory ──────────────────────────────────────────────────────────────
const mkDay = (id, short, label, type, focus, dur, muscles, sections, tip) =>
  ({ id, short, label, type, focus, duration:dur, muscles, sections, tip });

const rest = (id, short, label, tip) =>
  ({ id, short, label, type:"REST", focus:"Descanso", duration:"—", muscles:"Recuperación completa", sections:[], tip });

function buildAllWeeks() {
  return WEEK_META.map((_, wi) => {
    // ── Progression config ──────────────────────────────────────────────────
    const isDeload = wi === 4;
    const isPeak   = wi === 7;
    const isIntA   = wi === 3;
    const isVolA   = wi === 1;
    const isVarA   = wi === 2;
    const isBaseB  = wi === 5;
    const isVolB   = wi === 6;

    const ecc = (isDeload) ? "3s" : (isPeak || isIntA) ? "5s" : "4s";
    const e   = `${ecc} excéntrico`;

    // Main compound: sets × reps
    const ms = isDeload ? 3 : isPeak ? 6 : (isVolA || isVolB) ? 5 : 4;
    const mr = isDeload ? 10 : (isIntA || isPeak) ? 8 : (isBaseB || isVolB) ? 10 : 12;
    // Isolation: sets × reps
    const is_ = isDeload ? 3 : isPeak ? 5 : (isVolA || isVolB) ? 5 : 4;
    const ir  = isDeload ? 10 : (isIntA || isPeak) ? 8 : (isBaseB || isVolB) ? 10 : 12;
    // Core: sets
    const cs  = isDeload ? 3 : 4;
    // Core reps / holds (progressive)
    const cTw = isDeload ? 14 : 16 + wi * 2;           // twist reps
    const cLr = isDeload ? 10 : 12 + wi;               // leg raise reps
    const cHt = isDeload ? 30 : 35 + wi * 3;           // hollow hold seconds
    const cBc = isDeload ? 16 : 18 + wi * 2;           // bicycle reps
    const cMc = isDeload ? "25s" : `${28 + wi * 4}s`;  // mountain climber time
    const cDb = isDeload ? 10 : 12 + wi;               // dead bug reps
    const cTt = isDeload ? 14 : 16 + wi;               // toe touches reps

    // ── LUN: Piernas + Glúteos + Core ──────────────────────────────────────
    const lun = mkDay("lun","LUN","Lunes","STRENGTH","Piernas + Glúteos",
      isDeload ? "45 min" : wi === 0 ? "60 min" : "65 min",
      "Cuádriceps · Isquios · Glúteos · Aductores · Core",
      [
        { name:"Warm-up", exercises:[
          { name:"Hip circles + leg swings", note:"30s cada dirección", sets:"2 min", weight:"—", info:"hipCircles" },
          { name:"Goblet squat hold", note:"Stretch profundo de cadera", sets:"3 × 30s", weight:"4.5 kg", info:"gobletHold" },
        ]},
        { name:"Cuádriceps + Glúteos", exercises: isDeload ? [
          { name:"KB Goblet Squat", note:"3s — forma perfecta", sets:"3 × 10", weight:"10 kg", info:"gobletSquat" },
          { name:"KB Sumo Squat", note:"Pausa 2s abajo", sets:"3 × 10", weight:"10 kg", info:"sumoSquat" },
          { name:"KB Glute Bridge", note:"Pausa 2s arriba", sets:"3 × 12", weight:"10 kg", info:"gluteBridge" },
        ] : [
          { name:"KB Goblet Squat", note:`${e}${isIntA||isPeak?" + 2s pausa abajo":""}`, sets:`${ms} × ${mr}`, weight:"10 kg", info:"gobletSquat" },
          { name:"KB Split Squat", note:e, sets:`${ms} × ${mr}/leg`, weight:"10 kg", info:"splitSquat" },
          { name:"KB Sumo Squat", note:`Pausa ${isIntA||isPeak?"3":"2"}s abajo`, sets:`${ms} × ${mr}`, weight:"10 kg", info:"sumoSquat" },
          { name:"KB Glute Bridge", note:`Pausa ${isIntA||isPeak?"3":"2"}s arriba`, sets:`${ms} × ${mr+3}`, weight:"10 kg", info:"gluteBridge" },
          { name:"KB Lateral Lunge", note:`${e} — aductor + glúteo medio`, sets:`${ms} × ${mr}/leg`, weight:"10 kg", info:"lateralLunge" },
        ]},
        { name:"Isquios", exercises: isDeload ? [
          { name:"KB Romanian Deadlift", note:"3s — deload", sets:"3 × 10", weight:"10 kg", info:"rdl" },
          { name:"KB Single-leg Deadlift", note:"3s — equilibrio", sets:"2 × 8/leg", weight:"10 kg", info:"singleLegDL" },
        ] : [
          { name:"KB Romanian Deadlift", note:`${e}${isIntA||isPeak?" + pausa 2s en estiramiento":""}`, sets:`${ms} × ${mr}`, weight:"10 kg", info:"rdl" },
          { name:"KB Single-leg Deadlift", note:`${e} — equilibrio`, sets:`${is_} × ${ir}/leg`, weight:"10 kg", info:"singleLegDL" },
        ]},
        { name:"Core", exercises:[
          { name:"Plank Shoulder Tap", note:"Caderas sin rotar", sets:`${cs} × ${cTw} taps`, weight:"BW", info:"plankShoulder" },
          { name:"Leg Raise", note:"4s bajando siempre", sets:`${cs} × ${cLr}`, weight:"BW", info:"legRaise" },
          { name:"Dead Bug", note:"Exhala completamente cada rep", sets:`${cs} × ${cDb}`, weight:"BW", info:"deadbug" },
          { name:"Hollow Body Hold", note:isPeak?"Piernas a 22°":isIntA?"Piernas a 25°":"Piernas a 30°", sets:`${cs} × ${cHt}s`, weight:"BW", info:"hollowHold" },
          { name:"Russian Twist", note:"Rota completamente cada lado", sets:`${cs} × ${cTw}`, weight:wi >= 3 ? "6.8 kg" : "4.5 kg", info:wi >= 3 ? "russianHeavy" : "russianTwist" },
        ]},
      ],
      isDeload ? "Deload de piernas. 3×10 — los isquios y glúteos se consolidan en la recuperación activa."
      : isPeak ? "Peak: el día de piernas más duro del ciclo. Goblet con pausa 3s debería quemar desde rep 1."
      : "Piernas = grupo muscular más grande. Cada sesión activa el metabolismo las siguientes 48h."
    );

    // ── MAR: Pecho + Tríceps + Core ────────────────────────────────────────
    const marPecho = isDeload ? [
      { name:"KB Floor Press", note:"3s — forma perfecta", sets:"3 × 10/arm", weight:"10 kg", info:"floorPress" },
      { name:"Push-up", note:"3s — deload", sets:"3 × 10", weight:"BW", info:"pushup" },
      { name:"KB Floor Fly", note:"4s bajando", sets:"3 × 8/arm", weight:"6.8 kg", info:"floorFly" },
    ] : isVarA ? [
      { name:"KB Floor Press", note:`${e} + pausa 1s abajo`, sets:`${ms} × ${mr}/arm`, weight:"10 kg", info:"floorPress" },
      { name:"Push-up Archer", note:`${e} — pecho unilateral`, sets:`${ms} × ${mr}/lado`, weight:"BW", info:"pushupArcher" },
      { name:"Push-up Close Grip", note:`${e} — pecho interno`, sets:`${ms} × ${mr}`, weight:"BW", info:"pushupClose" },
      { name:"KB Floor Fly", note:"4s bajando — estira pecho", sets:`${ms} × ${mr}/arm`, weight:"6.8 kg", info:"floorFly" },
    ] : (isBaseB || isVolB) ? [
      { name:"KB Floor Press", note:`${e} + pausa 1s abajo`, sets:`${ms} × ${mr}/arm`, weight:"10 kg", info:"floorPress" },
      { name:"Push-up Close Grip", note:`${e} — pecho interno + tríceps`, sets:`${ms} × ${mr}`, weight:"BW", info:"pushupClose" },
      { name:"Push-up Archer", note:`${e} — pecho externo`, sets:`${ms} × ${mr}/lado`, weight:"BW", info:"pushupArcher" },
      { name:"KB Floor Fly", note:"4s bajando — estiramiento completo", sets:`${ms} × ${mr}/arm`, weight:"6.8 kg", info:"floorFly" },
    ] : isPeak ? [
      { name:"KB Floor Press", note:`${e} + pausa 2s abajo`, sets:`${ms} × ${mr}/arm`, weight:"10 kg", info:"floorPress" },
      { name:"Push-up Archer", note:`${e} — peak pecho externo`, sets:`${ms} × ${mr}/lado`, weight:"BW", info:"pushupArcher" },
      { name:"Push-up Close Grip", note:`${e} — peak interno`, sets:`${ms} × ${mr}`, weight:"BW", info:"pushupClose" },
      { name:"KB Floor Fly", note:"5s bajando — máximo estiramiento", sets:`${ms} × ${mr}/arm`, weight:"6.8 kg", info:"floorFly" },
    ] : [
      { name:"KB Floor Press", note:e, sets:`${ms} × ${mr}/arm`, weight:"10 kg", info:"floorPress" },
      { name:"Push-up", note:e, sets:`${ms} × ${mr}`, weight:"BW", info:"pushup" },
      { name:"KB Floor Fly", note:"4s bajando — estira el pecho", sets:`${ms} × ${mr}/arm`, weight:"6.8 kg", info:"floorFly" },
      { name:"Push-up Archer", note:`${e} — pecho unilateral`, sets:`${is_} × ${ir}/lado`, weight:"BW", info:"pushupArcher" },
    ];
    const marTriceps = isDeload ? [
      { name:"KB Tricep Extension", note:"3s — deload", sets:"3 × 10", weight:"6.8 kg", info:"tricepExt" },
      { name:"Diamond Push-up", note:"Sin ir al fallo", sets:"3 × 8", weight:"BW", info:"diamondPushup" },
    ] : [
      { name:"KB Tricep Extension", note:`${e}${isIntA||isPeak?" + pausa 2s arriba":""}`, sets:`${is_} × ${ir}`, weight:"6.8 kg", info:"tricepExt" },
      { name:"Diamond Push-up", note:isPeak?"Al fallo absoluto":"Al fallo controlado", sets:`${is_} × max`, weight:"BW", info:"diamondPushup" },
      { name:"KB Tricep Kickback", note:`${e} — pausa 1s arriba`, sets:`${is_} × ${ir}/arm`, weight:"4.5 kg", info:"tricepKickback" },
    ];
    const mar = mkDay("mar","MAR","Martes","STRENGTH","Pecho + Tríceps",
      isDeload ? "45 min" : wi === 0 ? "60 min" : "65 min",
      "Pectoral · Tríceps · Serratus · Core",
      [
        { name:"Warm-up — Espalda alta (antagonista)", exercises:[
          { name:"KB Row liviano", note:"Activa escápulas antes de presionar", sets:"2 × 12", weight:"6.8 kg", info:"kbRowLight" },
          { name:"KB Halos", note:"Manguito rotador", sets:"2 × 10", weight:"4.5 kg", info:"kbHalo" },
        ]},
        { name:"Pecho", exercises: marPecho },
        { name:"Tríceps", exercises: marTriceps },
        { name:"Core", exercises:[
          { name:"Hollow Body Hold", note:isPeak?"Piernas a 22°":isIntA?"Piernas a 25°":isDeload?"Piernas a 35°":"Piernas a 28°", sets:`${cs} × ${cHt}s`, weight:"BW", info:"hollowHold" },
          { name:"Mountain Climbers", note:"Caderas completamente quietas", sets:`${cs} × ${cMc}`, weight:"BW", info:"mountainClimber" },
          { name:"Leg Raise", note:"4s bajando siempre", sets:`${cs} × ${cLr}`, weight:"BW", info:"legRaise" },
          { name:"Dead Bug", note:"Exhala completamente cada rep", sets:`${cs} × ${cDb}`, weight:"BW", info:"deadbug" },
          { name:"Russian Twist", note:"Rota completamente", sets:`${cs} × ${cTw}`, weight:wi >= 3 ? "6.8 kg" : "4.5 kg", info:wi >= 3 ? "russianHeavy" : "russianTwist" },
        ]},
      ],
      isDeload ? "Deload de pecho y tríceps. Forma impecable, sin esfuerzo máximo. El músculo se consolida."
      : isPeak ? "Peak de pecho: Floor Press 5s+2s pausa debería quemar desde rep 3. Sin excusas."
      : "El warm-up de espalda antes de presionar protege el hombro y mejora la postura. Nunca lo saltes."
    );

    // ── MIÉ: Cardio + Abdomen ──────────────────────────────────────────────
    const mie = mkDay("mie","MIÉ","Miércoles","FITXR","FitXR + Abdomen",
      isDeload ? "35 min" : wi <= 1 ? "50 min" : "60 min",
      "Cardio · Oblicuos · Core total · Abdomen",
      [
        { name:"Warm-up", exercises:[
          { name:"KB Halos", note:"Círculos lentos", sets:"2 × 10", weight:"4.5 kg", info:"kbHalo" },
        ]},
        { name:"FitXR", exercises: isDeload ? [
          { name:"FitXR — Flow", note:"Pace moderado — deload", sets:"20 min", weight:"—", info:"fitxrFlow" },
        ] : isBaseB ? [
          { name:"FitXR — Box", note:"3 rounds, máximo esfuerzo", sets:"20 min", weight:"—", info:"fitxrBox" },
          { name:"FitXR — Combat", note:"2 rounds, footwork activo", sets:"15 min", weight:"—", info:"fitxrCombat" },
        ] : [
          { name:"FitXR — Box", note:`${isPeak||isIntA?"4":"3"} rounds, máximo esfuerzo`, sets:isPeak||isIntA?"25 min":"20 min", weight:"—", info:"fitxrBox" },
          { name:"FitXR — HIIT", note:isPeak?"Peak cardio — 100% esfuerzo":"Máximo esfuerzo", sets:isPeak?"20 min":"15 min", weight:"—", info:"fitxrHiit" },
        ]},
        { name:"Abdomen", exercises:[
          { name:"Russian Twist Heavy", note:"Rota completamente — toca el suelo", sets:`${cs} × ${cTw}`, weight:"6.8 kg", info:"russianHeavy" },
          { name:"Bicycle crunches", note:"Lento — rotación de torso", sets:`${cs} × ${cBc}`, weight:"BW", info:"bicycle" },
          { name:"Leg Raise", note:"4s bajando siempre", sets:`${cs} × ${cLr}`, weight:"BW", info:"legRaise" },
          { name:"Hollow Body Hold", note:isPeak?"Piernas a 22°":isIntA?"Piernas a 25°":"Piernas a 28°", sets:`${cs} × ${cHt}s`, weight:"BW", info:"hollowHold" },
          { name:"KB Plank Drag", note:"Core anti-rotación — caderas quietas", sets:`${cs} × ${cDb}/lado`, weight:"4.5 kg", info:"plankDrag" },
          ...(wi >= 3 ? [{ name:"Hollow Body Rock", note:"Mantén la forma al rockear", sets:`${cs} × 15 rocks`, weight:"BW", info:"hollowRock" }] : []),
          { name:"Mountain Climbers", note:"Full effort — caderas quietas", sets:`${cs} × ${cMc}`, weight:"BW", info:"mountainClimber" },
          { name:"Toe Touches", note:"Piernas al techo — sin impulso", sets:`${cs} × ${cTt}`, weight:"BW", info:"toeTouches" },
          { name:"Crunches", note:"Pequeño y controlado", sets:`${cs} × ${cTt+4}`, weight:"BW", info:"crunches" },
          { name:"Dead Bug", note:"Exhala completamente", sets:`${cs} × ${cDb}`, weight:"BW", info:"deadbug" },
        ]},
      ],
      isDeload ? "Deload: Flow + abdomen suave. El cuerpo procesa el trabajo de las 4 semanas anteriores."
      : isPeak ? "Peak de cardio y abdomen. El miércoles más duro del ciclo — 100% en todo."
      : "FitXR + abdomen es la combinación que define el core. El abdomen se define con cardio + carga progresiva."
    );

    // ── JUE: Espalda + Bíceps + Core ──────────────────────────────────────
    const jueEspalda = isDeload ? [
      { name:"KB Swing (2 manos)", note:"3s — forma perfecta", sets:"3 × 10", weight:"10 kg", info:"kbSwing" },
      { name:"KB Bent-over Row", note:"3s — deload", sets:"3 × 10", weight:"10 kg", info:"bentOverRow" },
      { name:"KB Pullover", note:"3s — estira el dorsal", sets:"3 × 8", weight:"10 kg", info:"pulloverKb" },
    ] : (isVarA || isIntA || isBaseB || isVolB || isPeak) ? [
      { name:"KB Single-arm Swing", note:`${e} — anti-rotación`, sets:`${ms} × ${mr}/arm`, weight:"10 kg", info:"kbSwingSingle" },
      { name:`KB Row con pausa ${isIntA||isPeak?"3":"2"}s`, note:e, sets:`${ms} × ${mr}`, weight:"10 kg", info:"bentOverRowPause" },
      { name:"KB Renegade Row", note:e, sets:`${ms} × ${mr}/arm`, weight:"10 kg", info:"renegadeRow" },
      { name:"KB Deadlift", note:`${e} — bisagra de cadera`, sets:`${ms} × ${mr}`, weight:"10 kg", info:"deadlift" },
      { name:"KB Pullover", note:`${e} — estira el dorsal`, sets:`${is_} × ${ir}`, weight:"10 kg", info:"pulloverKb" },
    ] : [
      { name:"KB Swing (2 manos)", note:e, sets:`${ms} × ${mr}`, weight:"10 kg", info:"kbSwing" },
      { name:"KB Bent-over Row", note:e, sets:`${ms} × ${mr}`, weight:"10 kg", info:"bentOverRow" },
      { name:"KB Renegade Row", note:e, sets:`${ms} × ${mr}/arm`, weight:"10 kg", info:"renegadeRow" },
      { name:"KB Deadlift", note:`${e} — bisagra de cadera`, sets:`${ms} × ${mr}`, weight:"10 kg", info:"deadlift" },
      { name:"KB Pullover", note:`${e} — estira el dorsal`, sets:`${is_} × ${ir}`, weight:"10 kg", info:"pulloverKb" },
    ];
    const jueBiceps = isDeload ? [
      { name:"Concentration Curl", note:"3s — aislamiento", sets:"3 × 10/arm", weight:"6.8 kg", info:"concentrationCurl" },
      { name:"KB Bicep Curl", note:"3s — deload", sets:"3 × 10/arm", weight:"6.8 kg", info:"bicepCurl" },
    ] : [
      { name:"Concentration Curl", note:`${e}${isIntA||isPeak?" + pausa 2s arriba":""}`, sets:`${is_} × ${ir}/arm`, weight:"6.8 kg", info:"concentrationCurl" },
      { name:"KB Bicep Curl", note:`${e}${isIntA||isPeak?" + pausa 1s arriba":""}`, sets:`${is_} × ${ir}/arm`, weight:"6.8 kg", info:"bicepCurl" },
      { name:"KB Hammer Curl", note:`${e} — grosor del brazo`, sets:`${is_} × ${ir}/arm`, weight:"6.8 kg", info:"hammerCurl" },
    ];
    const jue = mkDay("jue","JUE","Jueves","STRENGTH","Espalda + Bíceps",
      isDeload ? "45 min" : wi === 0 ? "60 min" : "65 min",
      "Dorsal · Romboides · Trapecio · Bíceps · Braquial · Core",
      [
        { name:"Warm-up — Pecho (antagonista)", exercises:[
          { name:"Push-up de activación", note:"Activa el pecho antes de jalar — no es el ejercicio principal", sets:"2 × 10", weight:"BW", info:"pushupLight" },
          { name:"KB Halos", note:"Manguito rotador", sets:"2 × 10", weight:"4.5 kg", info:"kbHalo" },
        ]},
        { name:"Espalda", exercises: jueEspalda },
        { name:"Bíceps", exercises: jueBiceps },
        { name:"Core", exercises:[
          { name:"Dead Bug", note:"Exhala completamente cada rep", sets:`${cs} × ${cDb}`, weight:"BW", info:"deadbug" },
          { name:"Russian Twist", note:"Rota completamente cada lado", sets:`${cs} × ${cTw}`, weight:wi >= 3 ? "6.8 kg" : "4.5 kg", info:wi >= 3 ? "russianHeavy" : "russianTwist" },
          { name:"Leg Raise", note:"4s bajando siempre", sets:`${cs} × ${cLr}`, weight:"BW", info:"legRaise" },
          { name:"Hollow Body Hold", note:isPeak?"Piernas a 22°":isIntA?"Piernas a 25°":"Piernas a 30°", sets:`${cs} × ${cHt}s`, weight:"BW", info:"hollowHold" },
          { name:"Bicycle crunches", note:"Lento — rotación de torso", sets:`${cs} × ${cBc}`, weight:"BW", info:"bicycle" },
        ]},
      ],
      isDeload ? "Deload: el músculo crece y se consolida durante el descanso. Forma perfecta en cada rep — sin esfuerzo máximo."
    : wi === 0 ? "El pullover es el ejercicio más subestimado del plan — es el único que estira completamente el dorsal sin jalón."
    : isPeak ? "Peak de espalda y bíceps. Concentration curl primero — el bíceps ya está fresco para dar el máximo."
    : "El pullover y las rows construyen el ancho y grosor de la espalda. Ambos son necesarios."
    );

    // VIE: Hombros + Brazos
    const vie = mkDay("vie","VIE","Viernes","STRENGTH","Hombros + Brazos",
      wi < 1 ? "55 min" : wi === 4 ? "45 min" : "60 min",
      "Deltoides · Trapecio · Bíceps · Tríceps · Core",
      [
        { name:"Warm-up", exercises:[
          { name:"KB Halos", note:"Activa el manguito rotador", sets:"3 × 10", weight:"4.5 kg", info:"kbHalo" },
          { name:"Arm circles amplios", note:"Movilidad completa de hombro", sets:"2 min", weight:"—", info:"activation" },
        ]},
        { name:"Hombros", exercises: wi === 4 ? [
          { name:"KB Single-arm Press", note:"3s — deload", sets:"2 × 10/arm", weight:"6.8 kg", info:"kbPress" },
          { name:"KB Lateral Raise", note:"4s — deload", sets:"2 × 12/arm", weight:"4.5 kg", info:"lateralRaise" },
          { name:"KB Front Raise", note:"3s — deload", sets:"2 × 12/arm", weight:"4.5 kg", info:"frontRaise" },
        ] : (wi < 3 || isVarA) ? [
          { name:"KB Single-arm Press", note:e, sets:`${ms} × ${mr}/arm`, weight:"6.8 kg", info:"kbPress" },
          { name:"KB Lateral Raise", note:"4s bajando — deltoides lateral", sets:`${is_} × 12/arm`, weight:"4.5 kg", info:"lateralRaise" },
          { name:"KB Front Raise", note:"3s bajando — deltoides anterior", sets:`${is_} × 12/arm`, weight:"4.5 kg", info:"frontRaise" },
          { name:"KB Upright Row", note:e, sets:`${is_} × 12`, weight:"6.8 kg", info:"uprightRow" },
        ] : wi === 3 ? [
          { name:"KB Single-arm Press", note:"4s — fuerza excéntrica", sets:"5 × 6/arm", weight:"6.8 kg", info:"kbPress" },
          { name:"KB Windmill", note:"4s — core lateral + hombro", sets:"4 × 8/lado", weight:"6.8 kg", info:"kbWindmill" },
          { name:"KB Lateral Raise", note:"5s bajando — deltoides peak", sets:"4 × 8/arm", weight:"4.5 kg", info:"lateralRaise" },
          { name:"KB Upright Row", note:"4s bajando", sets:"4 × 8", weight:"6.8 kg", info:"uprightRow" },
        ] : isBaseB || isVolB ? [
          { name:"KB Clean + Press", note:e+" — potencia + empuje", sets:`${ms} × ${mr}/arm`, weight:"6.8 kg", info:"cleanPress" },
          { name:"KB Windmill", note:e+" — core lateral + hombro", sets:`${is_} × 8/lado`, weight:"6.8 kg", info:"kbWindmill" },
          { name:"KB Lateral Raise", note:"4s bajando", sets:`${is_} × ${ir}/arm`, weight:"4.5 kg", info:"lateralRaise" },
          { name:"KB Upright Row", note:e, sets:`${is_} × ${ir}`, weight:"6.8 kg", info:"uprightRow" },
          { name:"KB Front Raise", note:"3s bajando", sets:`${is_} × ${ir}/arm`, weight:"4.5 kg", info:"frontRaise" },
        ] : wi === 7 ? [
          { name:"KB Clean + Press", note:"4s exc.", sets:"5 × 8/arm", weight:"6.8 kg", info:"cleanPress" },
          { name:"KB Windmill", note:"4s — control total", sets:"4 × 10/lado", weight:"6.8 kg", info:"kbWindmill" },
          { name:"KB Lateral Raise", note:"5s bajando — deltoides peak", sets:"4 × 10/arm", weight:"4.5 kg", info:"lateralRaise" },
          { name:"KB Upright Row", note:"4s exc.", sets:"4 × 10", weight:"6.8 kg", info:"uprightRow" },
          { name:"KB Front Raise", note:"4s bajando", sets:"4 × 10/arm", weight:"4.5 kg", info:"frontRaise" },
        ] : wi === 8 ? [
          { name:"KB Clean + Press", note:"5s exc. — fuerza pico", sets:"5 × 5/arm", weight:"6.8 kg", info:"cleanPress" },
          { name:"KB Windmill", note:"5s — más reps", sets:"5 × 10/lado", weight:"6.8 kg", info:"kbWindmill" },
          { name:"KB Lateral Raise", note:"5s bajando", sets:"5 × 8/arm", weight:"4.5 kg", info:"lateralRaise" },
          { name:"KB Upright Row", note:"5s exc.", sets:"5 × 8", weight:"6.8 kg", info:"uprightRow" },
        ] : [
          { name:"KB Clean + Press", note:"5s exc. — peak del ciclo", sets:"6 × 5/arm", weight:"6.8 kg", info:"cleanPress" },
          { name:"KB Windmill", note:"5s — core + hombro peak", sets:"5 × 10/lado", weight:"6.8 kg", info:"kbWindmill" },
          { name:"KB Lateral Raise", note:"5s bajando — último set del ciclo", sets:"5 × 8/arm", weight:"4.5 kg", info:"lateralRaise" },
          { name:"KB Upright Row", note:"5s exc.", sets:"5 × 8", weight:"6.8 kg", info:"uprightRow" },
          { name:"KB Front Raise", note:"5s bajando", sets:"4 × 8/arm", weight:"4.5 kg", info:"frontRaise" },
        ]},
        { name:"Brazos", exercises: wi === 4 ? [
          { name:"KB Bicep Curl", note:"3s — deload", sets:"2 × 10/arm", weight:"6.8 kg", info:"bicepCurl" },
          { name:"KB Tricep Extension", note:"3s — deload", sets:"2 × 12", weight:"6.8 kg", info:"tricepExt" },
        ] : (wi < 3 || isVarA) ? [
          { name:"KB Bicep Curl", note:e, sets:`${is_} × ${ir}/arm`, weight:"6.8 kg", info:"bicepCurl" },
          { name:"KB Tricep Extension", note:e, sets:`${is_} × ${ir}`, weight:"6.8 kg", info:"tricepExt" },
          { name:"KB Hammer Curl", note:e, sets:`${is_} × ${ir}/arm`, weight:"6.8 kg", info:"hammerCurl" },
          { name:"KB Tricep Kickback", note:e+" — pausa 1s arriba", sets:`${is_} × ${ir}/arm`, weight:"4.5 kg", info:"tricepKickback" },
          { name:"Diamond Push-up", note:"Al fallo controlado", sets:`${is_} × max`, weight:"BW", info:"diamondPushup" },
        ] : wi === 3 ? [
          { name:"KB Bicep Curl", note:"4s + pausa 1s arriba", sets:"4 × 8/arm", weight:"6.8 kg", info:"bicepCurl" },
          { name:"KB Tricep Extension", note:"4s — codos fijos", sets:"4 × 10", weight:"6.8 kg", info:"tricepExt" },
          { name:"Concentration Curl", note:"4s — aislamiento total", sets:"3 × 8/arm", weight:"6.8 kg", info:"concentrationCurl" },
          { name:"KB Tricep Kickback", note:"4s — pausa 2s arriba", sets:"3 × 10/arm", weight:"4.5 kg", info:"tricepKickback" },
          { name:"Diamond Push-up", note:"Al fallo", sets:"4 × max", weight:"BW", info:"diamondPushup" },
        ] : isBaseB || isVolB ? [
          { name:"Concentration Curl", note:e+" — aislamiento bíceps", sets:`${is_} × ${ir}/arm`, weight:"6.8 kg", info:"concentrationCurl" },
          { name:"KB Tricep Extension", note:e, sets:`${is_} × ${ir}`, weight:"6.8 kg", info:"tricepExt" },
          { name:"KB Bicep Curl", note:e, sets:`${is_} × ${ir}/arm`, weight:"6.8 kg", info:"bicepCurl" },
          { name:"KB Tricep Kickback", note:e+" — pausa 1s arriba", sets:`${is_} × ${ir}/arm`, weight:"4.5 kg", info:"tricepKickback" },
          { name:"Diamond Push-up", note:"Al fallo", sets:`${is_} × max`, weight:"BW", info:"diamondPushup" },
        ] : wi === 7 ? [
          { name:"Concentration Curl", note:"4s — pausa 1s arriba", sets:"4 × 10/arm", weight:"6.8 kg", info:"concentrationCurl" },
          { name:"KB Tricep Extension", note:"4s — codos fijos", sets:"4 × 10", weight:"6.8 kg", info:"tricepExt" },
          { name:"KB Bicep Curl", note:"4s + pausa 2s arriba", sets:"4 × 10/arm", weight:"6.8 kg", info:"bicepCurl" },
          { name:"KB Tricep Kickback", note:"4s — pausa 2s", sets:"3 × 10/arm", weight:"4.5 kg", info:"tricepKickback" },
          { name:"Diamond Push-up", note:"Al fallo — lento", sets:"4 × max", weight:"BW", info:"diamondPushup" },
        ] : wi === 8 ? [
          { name:"Concentration Curl", note:"5s — máximo aislamiento", sets:"5 × 8/arm", weight:"6.8 kg", info:"concentrationCurl" },
          { name:"KB Tricep Extension", note:"5s — codos fijos", sets:"5 × 8", weight:"6.8 kg", info:"tricepExt" },
          { name:"KB Bicep Curl", note:"5s + pausa 2s", sets:"4 × 8/arm", weight:"6.8 kg", info:"bicepCurl" },
          { name:"KB Tricep Kickback", note:"5s — pausa 2s arriba", sets:"4 × 8/arm", weight:"4.5 kg", info:"tricepKickback" },
          { name:"Diamond Push-up", note:"Al fallo absoluto", sets:"5 × max", weight:"BW", info:"diamondPushup" },
        ] : [
          { name:"Concentration Curl", note:"5s — peak aislamiento bíceps", sets:"5 × 6/arm", weight:"6.8 kg", info:"concentrationCurl" },
          { name:"KB Tricep Extension", note:"5s — peak tríceps", sets:"5 × 8", weight:"6.8 kg", info:"tricepExt" },
          { name:"KB Bicep Curl", note:"5s + pausa 2s", sets:"5 × 6/arm", weight:"6.8 kg", info:"bicepCurl" },
          { name:"KB Tricep Kickback", note:"5s — cierra el tríceps", sets:"4 × 8/arm", weight:"4.5 kg", info:"tricepKickback" },
          { name:"Diamond Push-up", note:"Al fallo — cierra el ciclo", sets:"5 × max", weight:"BW", info:"diamondPushup" },
        ]},
        { name:"Finisher + Core", exercises:[
          { name:"KB Farmer Carry", note:"Grip + postura + core", sets:wi===4?"2 × 40m":`${cs} × 40m`, weight:"10 kg + 6.8 kg", info:"farmerCarry" },
          { name:"Hollow Body Hold", note:wi < 4 ? "Piernas a 30°" : wi === 4 ? "Piernas a 35° — deload" : wi < 8 ? "Piernas a 28°" : "Piernas a 22°", sets:wi===4?"2 × 25s":`3 × ${25+wi*3}s`, weight:"BW", info:"hollowHold" },
          { name:"Russian Twist", note:"Rota completamente cada lado", sets:wi===4?"2 × 14":`3 × ${14+wi}`, weight:wi < 7 ? "4.5 kg" : "6.8 kg", info:wi < 7 ? "russianTwist" : "russianHeavy" },
          { name:"Leg Raise", note:"4s bajando siempre", sets:wi===4?"2 × 10":`3 × ${10+wi}`, weight:"BW", info:"legRaise" },
          { name:"Mountain Climbers", note:"Caderas completamente quietas", sets:wi===4?"2 × 25s":`3 × ${25+wi*3}s`, weight:"BW", info:"mountainClimber" },
        ]},
      ],
      wi === 4 ? "Deload de hombros y brazos. Forma perfecta en cada repetición. El músculo se consolida esta semana."
    : wi === 9 ? "S10 peak: hombros y brazos al máximo. El 5s excéntrico con pausa hace que el peso se sienta el doble."
    : "Curl y extensión de tríceps en la misma sesión — antagonistas trabajando juntos. La simetría del brazo viene de entrenar ambos."
    );

    // SAB + DOM
    const sat = rest("sat","SAT","Sábado","El músculo crece en el descanso, no durante el entrenamiento. El sábado es parte del plan.");

    // DOM: Domingo — circuito opcional de cardio + abdomen, para los domingos sin fútbol
    const sundayLevel = wi - 2; // 0-7 across the displayed 8 weeks
    const dom = mkDay("dom","DOM","Domingo","FITXR","Cardio + Abdomen (opcional)",
      sundayLevel < 2 ? "30 min" : sundayLevel < 5 ? "35 min" : "40 min",
      "Cardio ligero · Abdomen · Solo si no juegas fútbol",
      [
        { name:"FitXR", exercises:[
          { name:"FitXR — Box", note: sundayLevel < 2 ? "2 rounds, esfuerzo moderado-alto" : sundayLevel < 5 ? "2–3 rounds, esfuerzo alto" : "3 rounds, esfuerzo alto",
            sets: sundayLevel < 2 ? "15 min" : sundayLevel < 5 ? "18 min" : "20 min", weight:"—", info:"fitxrBox" },
          ...(sundayLevel >= 4 ? [{ name:"FitXR — Combat", note:"1 round, footwork", sets:"8 min", weight:"—", info:"fitxrCombat" }] : []),
        ]},
        { name:"Abdomen", exercises:[
          { name:"Russian Twist", note:"Rota completamente cada lado", sets:`3 × ${16 + sundayLevel}`, weight: sundayLevel < 3 ? "4.5 kg" : "6.8 kg", info: sundayLevel < 3 ? "russianTwist" : "russianHeavy" },
          { name:"Bicycle crunches", note:"Lento — rotación de torso", sets:`3 × ${18 + sundayLevel}`, weight:"BW", info:"bicycle" },
          { name:"Hollow Body Hold", note: sundayLevel < 4 ? "Piernas a 30°" : "Piernas a 25°", sets:`3 × ${28 + sundayLevel*2}s`, weight:"BW", info:"hollowHold" },
          { name:"Plank hold", note:"Abs + glúteos apretados", sets:`3 × ${38 + sundayLevel*2}s`, weight:"BW", info:"plank" },
          ...(sundayLevel >= 3 ? [{ name:"Mountain Climbers", note:"Caderas completamente quietas", sets:`3 × ${28 + sundayLevel*2}s`, weight:"BW", info:"mountainClimber" }] : []),
          ...(sundayLevel >= 6 ? [{ name:"Hollow Body Rock", note:"Mantén la forma al rockear", sets:"3 × 15 rocks", weight:"BW", info:"hollowRock" }] : []),
          { name:"Dead Bug", note:"Exhala completamente cada rep", sets:`3 × ${10+sundayLevel}`, weight:"BW", info:"deadbug" },
          { name:"Toe Touches", note:"Piernas al techo — sin impulso", sets:`3 × ${16+sundayLevel}`, weight:"BW", info:"toeTouches" },
          { name:"Plank hold", note:"Abs + glúteos apretados", sets:`3 × ${35+sundayLevel*3}s`, weight:"BW", info:"plank" },
        ]},
      ],
      "Opcional — solo si no juegas fútbol este domingo. Si juegas, descansa: el partido ya es tu cardio. Si no, esto te mantiene activo sin comprometer las piernas para el lunes."
    );

    return [lun, mar, mie, jue, vie, sat, dom];
  });
}

// Plan starts at what was originally S3 (Jay already completed S1 and S2).
// Internal progression logic (wi 2-9) is preserved exactly — only display labels shift to S1-S8.
const RAW_WEEKS = buildAllWeeks();
const ALL_WEEKS = RAW_WEEKS.slice(0);

const DISPLAY_META = WEEK_META.slice(0).map((w, i) => ({
  ...w,
  label: `Semana ${i + 1}`,
}));

// ─── Muscle balance analysis ───────────────────────────────────────────────────
// Maps each EX[] entry to the muscle group it primarily trains, so we can total
// weekly working sets per muscle and spot which ones are under-trained.
const MUSCLE_OF = {
  gobletSquat:"Piernas", splitSquat:"Piernas", sumoSquat:"Piernas", rdl:"Piernas",
  singleLegDL:"Piernas", gluteBridge:"Piernas", lateralLunge:"Piernas", gobletHold:"Piernas",
  bentOverRow:"Espalda", bentOverRowPause:"Espalda", renegadeRow:"Espalda", kbSwing:"Espalda",
  kbSwingSingle:"Espalda", deadlift:"Espalda", pulloverKb:"Espalda", kbRowLight:"Espalda",
  farmerCarry:"Espalda", suitcaseCarry:"Espalda",
  bicepCurl:"Bíceps", hammerCurl:"Bíceps", concentrationCurl:"Bíceps",
  kbPress:"Hombros", lateralRaise:"Hombros", frontRaise:"Hombros", uprightRow:"Hombros",
  kbHalo:"Hombros", cleanPress:"Hombros", kbWindmill:"Hombros",
  tricepExt:"Tríceps", tricepKickback:"Tríceps", diamondPushup:"Tríceps", pushupLight:"Tríceps",
  floorPress:"Pecho", floorFly:"Pecho", pushup:"Pecho", pushupArcher:"Pecho", pushupClose:"Pecho",
  plank:"Core", plankShoulder:"Core", plankDrag:"Core", deadbug:"Core", legRaise:"Core",
  hollowHold:"Core", hollowRock:"Core", russianTwist:"Core", russianHeavy:"Core",
  bicycle:"Core", toeTouches:"Core", crunches:"Core", mountainClimber:"Core",
  fitxrBox:"Cardio", fitxrCombat:"Cardio", fitxrHiit:"Cardio", fitxrFlow:"Cardio",
};
const MUSCLE_COLOR = {
  Piernas:"#39ff88", Espalda:"#22d3ee", Bíceps:"#5eead4", Hombros:"#a3ffcb",
  Tríceps:"#fbbf24", Pecho:"#fb7185", Core:"#fb923c", Cardio:"#00e5b0",
};
const MUSCLE_DAY = {
  Piernas:"LUN", Espalda:"JUE", Bíceps:"JUE", Pecho:"MAR", Tríceps:"MAR",
  Hombros:"VIE", Core:"MIÉ", Cardio:"MIÉ",
};

// Typical weight used for each exercise, taken from wherever it first appears
// in the program — reused for suggestions so they use tools already in rotation.
const INFO_WEIGHT = {};
for (const wkDays of ALL_WEEKS) {
  for (const d of wkDays) {
    for (const sec of d.sections) {
      for (const ex of sec.exercises) {
        if (!(ex.info in INFO_WEIGHT)) INFO_WEIGHT[ex.info] = ex.weight;
      }
    }
  }
}

function computeMuscleVolume(days) {
  const vol = {};
  for (const d of days) {
    if (d.type === "REST") continue;
    for (const sec of d.sections) {
      if (sec.name.startsWith("Warm-up")) continue;
      for (const ex of sec.exercises) {
        const m = MUSCLE_OF[ex.info];
        if (!m) continue;
        vol[m] = (vol[m] || 0) + parseSetCount(ex.sets);
      }
    }
  }
  return vol;
}

function suggestForMuscle(muscle, excludeInfo) {
  return Object.keys(MUSCLE_OF)
    .filter(k => MUSCLE_OF[k] === muscle && k in INFO_WEIGHT && !excludeInfo.has(k))
    .slice(0, 2)
    .map(k => ({ info: k, weight: INFO_WEIGHT[k] }));
}

function EX_NAME(infoKey) {
  const names = {
    gobletSquat:"KB Goblet Squat", splitSquat:"KB Split Squat", sumoSquat:"KB Sumo Squat", rdl:"KB Romanian Deadlift",
    singleLegDL:"KB Single-leg Deadlift", gluteBridge:"KB Glute Bridge", lateralLunge:"KB Lateral Lunge", gobletHold:"Goblet Squat Hold",
    bentOverRow:"KB Bent-over Row", bentOverRowPause:"KB Row con pausa", renegadeRow:"KB Renegade Row", kbSwing:"KB Swing",
    kbSwingSingle:"KB Single-arm Swing", deadlift:"KB Deadlift", pulloverKb:"KB Pullover", kbRowLight:"KB Row liviano",
    farmerCarry:"KB Farmer Carry", suitcaseCarry:"KB Suitcase Carry",
    bicepCurl:"KB Bicep Curl", hammerCurl:"KB Hammer Curl", concentrationCurl:"Concentration Curl",
    kbPress:"KB Single-arm Press", lateralRaise:"KB Lateral Raise", frontRaise:"KB Front Raise", uprightRow:"KB Upright Row",
    kbHalo:"KB Halos", cleanPress:"KB Clean + Press", kbWindmill:"KB Windmill",
    tricepExt:"KB Tricep Extension", tricepKickback:"KB Tricep Kickback", diamondPushup:"Diamond Push-up", pushupLight:"Push-up de activación",
    floorPress:"KB Floor Press", floorFly:"KB Floor Fly", pushup:"Push-up", pushupArcher:"Push-up Archer", pushupClose:"Push-up Close Grip",
    plank:"Plank hold", plankShoulder:"Plank Shoulder Tap", plankDrag:"KB Plank Drag", deadbug:"Dead Bug", legRaise:"Leg Raise",
    hollowHold:"Hollow Body Hold", hollowRock:"Hollow Body Rock", russianTwist:"Russian Twist", russianHeavy:"Russian Twist Heavy",
    bicycle:"Bicycle crunches", toeTouches:"Toe Touches", crunches:"Crunches", mountainClimber:"Mountain Climbers",
    fitxrBox:"FitXR — Box", fitxrCombat:"FitXR — Combat", fitxrHiit:"FitXR — HIIT", fitxrFlow:"FitXR — Flow",
  };
  return names[infoKey] || infoKey;
}

// ─── UI Styles ────────────────────────────────────────────────────────────────
const TC = {
  STRENGTH:{ bg:"#060a07", accent:"#39ff88", label:"#a3ffcb", glow:"rgba(57,255,136,0.10)" },
  FITXR:   { bg:"#060a0a", accent:"#00e5b0", label:"#a3fff0", glow:"rgba(0,229,176,0.10)" },
  REST:    { bg:"#0a0a0a", accent:"#4b5563", label:"#9ca3af", glow:"rgba(75,85,99,0.06)" },
};

const SDOT = (n) => {
  if (n.startsWith("Warm-up")) return "#6b7280";
  if (n.includes("Espalda")) return "#22d3ee";
  if (n.includes("Bícep")) return "#39ff88";
  if (n.includes("Hombro")) return "#a3ffcb";
  if (n.includes("Brazos")) return "#5eead4";
  if (n.startsWith("Cuádr") || n.includes("Glúteo")) return "#39ff88";
  if (n.includes("Isquio")) return "#86efac";
  if (n.includes("Pecho")) return "#fb7185";
  if (n.includes("Trícep")) return "#fbbf24";
  if (n.includes("Core") || n.includes("Abdomen")) return "#fb923c";
  if (n.includes("FitXR")) return "#00e5b0";
  if (n.includes("Finisher")) return "#fde047";
  return "#9ca3af";
};

const DAY_LABELS = { jue:"JUE", vie:"VIE", sat:"SAT", dom:"DOM", lun:"LUN", mar:"MAR", mie:"MIÉ" };

function initWeek() {
  return 0;
}

// JS getDay(): 0=Sun..6=Sat → index into WEEKDAY_ORDER / DAYS (lun..dom)
function todayDayIndex() {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

function isoDate(d) {
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

// Real calendar date for a given weekday-pill index (0=Lun..6=Dom), relative to today.
function isoDateForWeekdayIndex(i) {
  const d = new Date();
  d.setDate(d.getDate() + (i - todayDayIndex()));
  return isoDate(d);
}

// Saturday is always a REST day regardless of program week, so it never breaks a streak.
function isRestWeekday(d) {
  return d.getDay() === 6;
}

// Consecutive real-calendar days (ending today or yesterday) that were fully
// completed, skipping Saturdays since they're always rest.
function computeStreak(completedSet) {
  let streak = 0;
  const cursor = new Date();
  if (!completedSet.has(isoDate(cursor)) && !isRestWeekday(cursor)) cursor.setDate(cursor.getDate() - 1);
  while (true) {
    if (completedSet.has(isoDate(cursor)) || isRestWeekday(cursor)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }
  return streak;
}

// ─── Timeline helpers ─────────────────────────────────────────────────────────
function parseSetCount(str) {
  const m = str.match(/^(\d+)\s*[×x]/i);
  return m ? parseInt(m[1]) : 1;
}
function parseRepsLabel(str) {
  const m = str.match(/[×x]\s*(.+)/i);
  return m ? m[1].trim() : str;
}
function parseTimeSeconds(str) {
  let m = str.match(/(\d+)\s*s\b/i);
  if (m) return parseInt(m[1]);
  m = str.match(/(\d+)\s*min\b/i);
  if (m) return parseInt(m[1]) * 60;
  return null;
}
function isTimed(ex) {
  return parseTimeSeconds(ex.sets) != null;
}

// Timeline tracks completion per individual set (round), under different
// localStorage keys than the list view's per-exercise tracking — so its
// progress needs its own tally instead of reusing the list view's count.
function timelineTotals(day, wk, done) {
  const sections = day.sections.filter(s => s.exercises.length > 0);
  let total = 0, doneN = 0;
  sections.forEach((section, si) => {
    section.exercises.forEach((ex, ei) => {
      const n = parseSetCount(ex.sets);
      for (let ri = 0; ri < n; ri++) {
        total++;
        if (done[`tl-w${wk}-${day.id}-${si}-${ei}-${ri}`]) doneN++;
      }
    });
  });
  return { total, doneN };
}

// ─── Stopwatch button + floating widget ────────────────────────────────────
function TimerButton({ ex, dot, onStart }) {
  if (!isTimed(ex)) return null;
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onStart(ex); }}
      title="Abrir cronómetro"
      style={{
        width:22, height:22, borderRadius:"50%", flexShrink:0, cursor:"pointer",
        background:"rgba(255,255,255,0.05)", border:`1px solid ${dot}40`,
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:11, color:dot, padding:0,
      }}
    >⏱</button>
  );
}

// Editable "actual weight used" field — defaults to the programmed weight
// until the lifter overrides it, then that override is remembered.
function WeightInput({ storeKey, defaultWeight, value, onChange, isDone }) {
  return (
    <input
      type="text"
      value={value ?? defaultWeight}
      onClick={e => e.stopPropagation()}
      onChange={e => onChange(storeKey, e.target.value)}
      style={{
        width:52, fontFamily:"'DM Mono',monospace", fontSize:10, fontWeight:600,
        color: isDone ? "#4b5563" : "#9ca3af",
        background: isDone ? "transparent" : "rgba(255,255,255,0.05)",
        border:"1px solid rgba(255,255,255,0.08)", borderRadius:5,
        padding:"2px 4px", textAlign:"center",
      }}
    />
  );
}

// Bigger tap target (44px) around the visual checkmark circle — sweaty hands
// and gym gloves miss small hit areas.
function CompleteCheckbox({ isDone, dot, onToggle }) {
  return (
    <button
      onClick={e => { e.stopPropagation(); onToggle(); }}
      style={{
        width:44, height:44, borderRadius:"50%", flexShrink:0, cursor:"pointer",
        background:"transparent", border:"none", padding:0,
        display:"flex", alignItems:"center", justifyContent:"center",
      }}
    >
      <span style={{
        width:26, height:26, borderRadius:"50%",
        background: isDone ? dot : "rgba(255,255,255,0.05)",
        border:`1px solid ${isDone ? dot : "rgba(255,255,255,0.12)"}`,
        display:"flex", alignItems:"center", justifyContent:"center",
        transition:"all 0.15s",
      }}>
        {isDone && <span style={{ fontSize:11, color:"#000", fontWeight:700 }}>✓</span>}
      </span>
    </button>
  );
}

// Swipe right to complete a set — faster than aiming for a small circle
// mid-set. Falls through to a normal tap/click when there's no drag.
function SwipeRow({ dot, onToggle, children }) {
  const [dx, setDx] = useState(0);
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const THRESHOLD = 72;

  const onTouchStart = (e) => {
    startXRef.current = e.touches[0].clientX;
    draggingRef.current = true;
  };
  const onTouchMove = (e) => {
    if (!draggingRef.current) return;
    const delta = e.touches[0].clientX - startXRef.current;
    setDx(Math.max(0, Math.min(delta, 100)));
  };
  const onTouchEnd = () => {
    draggingRef.current = false;
    if (dx > THRESHOLD) onToggle();
    setDx(0);
  };

  return (
    <div style={{ position:"relative", borderRadius:8, overflow:"hidden" }}>
      {dx > 4 && (
        <div style={{
          position:"absolute", inset:0, display:"flex", alignItems:"center", paddingLeft:16,
          background:`${dot}25`,
        }}>
          <span style={{ fontSize:14, color:dot, fontWeight:700, opacity:Math.min(dx / THRESHOLD, 1) }}>✓ Completar</span>
        </div>
      )}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ transform:`translateX(${dx}px)`, transition: dx === 0 ? "transform 0.2s" : "none" }}
      >
        {children}
      </div>
    </div>
  );
}

function VersionBadge() {
  return (
    <div style={{
      position:"fixed", bottom:16, left:16, zIndex:190,
      background:"rgba(0,0,0,0.55)", border:"1px solid rgba(255,255,255,0.1)",
      borderRadius:6, padding:"3px 8px", pointerEvents:"none",
      backdropFilter:"blur(4px)",
    }}>
      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"rgba(255,255,255,0.4)", letterSpacing:"0.05em" }}>v{__APP_VERSION__}</span>
    </div>
  );
}

function FloatingStopwatch({ info, onClose }) {
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(true);
  const infoKey = info && info.key;

  useEffect(() => {
    setSeconds(0);
    setRunning(true);
  }, [infoKey]);

  useEffect(() => {
    if (!running || !info) return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [running, info]);

  if (!info) return null;

  const target = info.targetSeconds;
  const isCountdown = target != null;
  const display = isCountdown ? Math.max(target - seconds, 0) : seconds;
  const finished = isCountdown && display === 0;
  const mm = String(Math.floor(display / 60)).padStart(2, "0");
  const ss = String(display % 60).padStart(2, "0");

  return (
    <div style={{
      position:"fixed", bottom:16, right:16, zIndex:200,
      background:"#0a0a0a", border:`1px solid ${finished ? "#39ff88" : "rgba(255,255,255,0.15)"}`,
      borderRadius:12, padding:"10px 12px", minWidth:140,
      boxShadow:"0 6px 28px rgba(0,0,0,0.55)",
      fontFamily:"'DM Sans',sans-serif",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:8, marginBottom:4 }}>
        <span style={{ fontSize:9, color:"#6b7280", fontWeight:600, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{info.label}</span>
        <span onClick={onClose} style={{ cursor:"pointer", color:"#6b7280", fontSize:12, lineHeight:1 }}>✕</span>
      </div>
      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:24, fontWeight:700, color: finished ? "#39ff88" : "#f3f4f6", textAlign:"center", marginBottom:7 }}>{mm}:{ss}</div>
      <div style={{ display:"flex", gap:6 }}>
        <button onClick={() => setRunning(r => !r)} style={{ flex:1, padding:"5px 0", borderRadius:6, border:"1px solid rgba(255,255,255,0.12)", background:"rgba(255,255,255,0.04)", color:"#e5e7eb", fontSize:11, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>{running ? "Pausar" : "Iniciar"}</button>
        <button onClick={() => setSeconds(0)} style={{ flex:1, padding:"5px 0", borderRadius:6, border:"1px solid rgba(255,255,255,0.12)", background:"rgba(255,255,255,0.04)", color:"#e5e7eb", fontSize:11, cursor:"pointer", fontFamily:"'DM Sans',sans-serif" }}>Reset</button>
      </div>
    </div>
  );
}

// ─── Timeline View ────────────────────────────────────────────────────────────
// Rounds are interleaved across muscle-group sections: SERIE 1 shows round 1
// of every working section (e.g. Espalda + Bíceps) before moving to SERIE 2.
function TimelineView({ day, wk, done, setDone, onStartTimer, weights, setWeight }) {
  const sections = day.sections.filter(s => s.exercises.length > 0);
  const warmupIdx = [];
  const mainIdx = [];
  sections.forEach((s, si) => (s.name.startsWith("Warm-up") ? warmupIdx : mainIdx).push(si));

  const toggle = useCallback((key) => {
    setDone(p => {
      const next = { ...p, [key]: !p[key] };
      try { localStorage.setItem("jay-training-done", JSON.stringify(next)); } catch {}
      return next;
    });
  }, [setDone]);

  const renderRow = (section, si, ex, ei, ri, dot) => {
    const key = `tl-w${wk}-${day.id}-${si}-${ei}-${ri}`;
    const isDone = done[key];
    const doToggle = () => toggle(key);
    return (
      <SwipeRow key={ei} dot={dot} onToggle={doToggle}>
        <div onClick={doToggle} style={{
          display:"grid", gridTemplateColumns:"1fr auto auto auto",
          alignItems:"center", gap:10,
          padding:"10px 13px",
          background: isDone ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,0.03)",
          border:`1px solid ${isDone ? "rgba(255,255,255,0.04)" : dot+"20"}`,
          borderLeft:`3px solid ${isDone ? "rgba(255,255,255,0.06)" : dot}`,
          borderRadius:8, cursor:"pointer",
          opacity: isDone ? 0.38 : 1,
          transition:"all 0.15s",
        }}>
          <div style={{
            fontSize:13, fontWeight:500,
            color: isDone ? "#4b5563" : "#f3f4f6",
            textDecoration: isDone ? "line-through" : "none",
          }}>{ex.name}</div>
          <WeightInput storeKey={key} defaultWeight={ex.weight} value={weights[key]} onChange={setWeight} isDone={isDone}/>
          <div style={{
            fontFamily:"'DM Mono',monospace", fontSize:12,
            color: isDone ? "#4b5563" : dot, fontWeight:600,
          }}>{parseRepsLabel(ex.sets)}</div>
          <div style={{ display:"flex", alignItems:"center", gap:2 }}>
            {onStartTimer && <TimerButton ex={ex} dot={dot} onStart={onStartTimer}/>}
            <CompleteCheckbox isDone={isDone} dot={dot} onToggle={doToggle}/>
          </div>
        </div>
      </SwipeRow>
    );
  };

  const sectionRoundBlock = (si, ri) => {
    const section = sections[si];
    const dot = SDOT(section.name);
    const rows = section.exercises
      .map((ex, ei) => (ri < parseSetCount(ex.sets) ? renderRow(section, si, ex, ei, ri, dot) : null))
      .filter(Boolean);
    if (rows.length === 0) return null;
    return (
      <div key={si} style={{ marginBottom:8 }}>
        <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:5, paddingLeft:4 }}>
          <div style={{ width:3, height:3, borderRadius:"50%", background:dot, flexShrink:0 }}/>
          <div style={{ fontSize:8, fontWeight:600, letterSpacing:"0.1em", color:"#6b7280" }}>{section.name.toUpperCase()}</div>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:3 }}>{rows}</div>
      </div>
    );
  };

  const maxRounds = mainIdx.length
    ? Math.max(...mainIdx.map(si => Math.max(...sections[si].exercises.map(ex => parseSetCount(ex.sets)))))
    : 0;

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {warmupIdx.map(si => {
        const section = sections[si];
        const dot = SDOT(section.name);
        const rounds = Math.max(...section.exercises.map(ex => parseSetCount(ex.sets)));
        return (
          <div key={section.name}>
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10, paddingLeft:2 }}>
              <div style={{ width:4, height:4, borderRadius:"50%", background:dot, flexShrink:0 }}/>
              <div style={{ fontSize:9, fontWeight:600, letterSpacing:"0.12em", color:"#6b7280" }}>{section.name.toUpperCase()}</div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {Array.from({ length: rounds }, (_, ri) => (
                <div key={ri}>
                  <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.14em", color:dot, marginBottom:6, paddingLeft:4, fontFamily:"'DM Mono',monospace" }}>SERIE {ri + 1}</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                    {section.exercises.map((ex, ei) => (ri < parseSetCount(ex.sets) ? renderRow(section, si, ex, ei, ri, dot) : null))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {maxRounds > 0 && (
        <div>
          {mainIdx.length > 1 && (
            <div style={{ fontSize:9, color:"#6b7280", marginBottom:10, paddingLeft:2 }}>Series intercaladas entre {mainIdx.map(si => sections[si].name).join(" · ")}</div>
          )}
          <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
            {Array.from({ length: maxRounds }, (_, ri) => (
              <div key={ri}>
                <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.14em", color:"#e5e7eb", marginBottom:8, paddingLeft:4, fontFamily:"'DM Mono',monospace" }}>SERIE {ri + 1}</div>
                {mainIdx.map(si => sectionRoundBlock(si, ri))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Exercise Panel ───────────────────────────────────────────────────────────
function ExPanel({ infoKey, dot }) {
  const [step, setStep] = useState(0);
  const info = EX[infoKey];
  if (!info) return null;
  return (
    <div style={{
      background:"#060911", border:`1px solid ${dot}22`,
      borderTop:"none", borderRadius:"0 0 10px 10px", padding:"12px 12px 10px",
    }}>
      <div style={{ display:"flex", gap:4, marginBottom:10 }}>
        {info.steps.map((_,i) => (
          <button key={i} onClick={()=>setStep(i)} style={{
            flex:1, padding:"6px 8px", borderRadius:6, cursor:"pointer", border:"none",
            background:step===i?`${dot}18`:"rgba(255,255,255,0.04)",
            color:step===i?dot:"#9ca3af",
            fontSize:12, fontFamily:"'DM Sans',sans-serif", fontWeight:step===i?600:400,
            outline:`1px solid ${step===i?dot+"35":"rgba(255,255,255,0.06)"}`,
          }}>Paso {i+1}</button>
        ))}
      </div>
      <div style={{
        background:"rgba(255,255,255,0.03)", borderRadius:8,
        padding:"11px 12px", marginBottom:9,
        border:"1px solid rgba(255,255,255,0.05)", minHeight:64,
      }}>
        <div style={{ fontSize:12, color:"#d1d5db", lineHeight:1.75 }}>{info.steps[step]}</div>
      </div>
      <div style={{
        background:"rgba(251,191,36,0.05)", borderRadius:7,
        padding:"8px 11px", borderLeft:"2px solid rgba(251,191,36,0.32)",
      }}>
        <span style={{ fontSize:9, color:"#92400e", fontWeight:700, letterSpacing:"0.09em" }}>CLAVE  </span>
        <span style={{ fontSize:11, color:"#fcd34d", lineHeight:1.6 }}>{info.cue}</span>
      </div>
    </div>
  );
}

// ─── Mini set data ────────────────────────────────────────────────────────────
// Simplified weekly mini sets — no supersets, no arrows
const MINI_DATA = {
  jue: [
    { label:"Espalda extra", time:"10 min", exs:[{ n:"KB Pullover", note:"3s — estira el dorsal", s:"3 × 10", w:"10 kg" },{ n:"Dead Bug", note:"Exhala cada rep", s:"3 × 10", w:"BW" }]},
    { label:"Bíceps nocturno", time:"10 min", exs:[{ n:"KB Bicep Curl", note:"4s bajando", s:"3 × 10/arm", w:"6.8 kg" },{ n:"Russian Twist", note:"Oblicuos extra", s:"3 × 16", w:"4.5 kg" }]},
    { label:"Espalda variada", time:"12 min", exs:[{ n:"KB Single-arm Swing", note:"Anti-rotación", s:"3 × 10/arm", w:"10 kg" },{ n:"Concentration Curl", note:"4s excéntrico", s:"3 × 10/arm", w:"6.8 kg" },{ n:"Hollow Body Hold", note:"Piernas a 30°", s:"3 × 35s", w:"BW" }]},
    { label:"Tirón intenso", time:"12 min", exs:[{ n:"KB Row con pausa 2s", note:"4s bajando", s:"4 × 8/arm", w:"10 kg" },{ n:"Hammer Curl", note:"5s excéntrico", s:"3 × 8/arm", w:"6.8 kg" },{ n:"Plank hold", note:"Abs + glúteos", s:"3 × 45s", w:"BW" }]},
    { label:"Movilidad suave", time:"12 min", exs:[{ n:"Cat-cow + rotación", note:"Columna completa", s:"3 min", w:"—" },{ n:"KB Halos (lento)", note:"Manguito rotador", s:"3 × 10", w:"4.5 kg" }]},
    { label:"Espalda extra B", time:"12 min", exs:[{ n:"KB Pullover", note:"4s excéntrico", s:"4 × 10", w:"10 kg" },{ n:"KB Single-arm Swing", note:"Control + potencia", s:"3 × 10/arm", w:"10 kg" },{ n:"Hollow Body Hold", note:"Piernas a 28°", s:"3 × 40s", w:"BW" }]},
    { label:"Bíceps nocturno B", time:"12 min", exs:[{ n:"Concentration Curl", note:"4s excéntrico", s:"4 × 10/arm", w:"6.8 kg" },{ n:"KB Bicep Curl", note:"4s + pausa 1s arriba", s:"3 × 10/arm", w:"6.8 kg" },{ n:"Russian Twist Heavy", note:"Oblicuos", s:"3 × 18", w:"6.8 kg" }]},
    { label:"Espalda variada B", time:"12 min", exs:[{ n:"KB Row con pausa 3s", note:"4s bajando", s:"4 × 8", w:"10 kg" },{ n:"KB Pullover", note:"4s excéntrico", s:"4 × 10", w:"10 kg" },{ n:"Dead Bug", note:"Exhala cada rep", s:"3 × 12", w:"BW" }]},
    { label:"Tirón peak", time:"15 min", exs:[{ n:"KB Row con pausa 3s", note:"5s bajando", s:"5 × 6/arm", w:"10 kg" },{ n:"Concentration Curl", note:"5s excéntrico", s:"4 × 8/arm", w:"6.8 kg" },{ n:"Hollow Body Hold", note:"Piernas a 22°", s:"4 × 45s", w:"BW" }]},
    { label:"Peak tirón nocturno", time:"15 min", exs:[{ n:"KB Single-arm Swing", note:"5s — máxima potencia", s:"5 × 5/arm", w:"10 kg" },{ n:"Concentration Curl", note:"5s + pausa 2s arriba", s:"4 × 6/arm", w:"6.8 kg" },{ n:"Hollow Rock", note:"20 rocks perfectos", s:"3 × 20", w:"BW" }]},
  ],
  vie: [
    { label:"Hombros extra", time:"10 min", exs:[{ n:"KB Lateral Raise", note:"5s bajando", s:"3 × 12/arm", w:"4.5 kg" },{ n:"KB Front Raise", note:"3s bajando", s:"3 × 12/arm", w:"4.5 kg" }]},
    { label:"Brazos nocturno", time:"10 min", exs:[{ n:"KB Bicep Curl", note:"3s bajando", s:"3 × 12/arm", w:"6.8 kg" },{ n:"KB Tricep Ext.", note:"3s bajando", s:"3 × 12", w:"6.8 kg" }]},
    { label:"Hombros variados", time:"12 min", exs:[{ n:"KB Windmill", note:"Core + hombro", s:"3 × 8/lado", w:"6.8 kg" },{ n:"Hammer Curl", note:"4s excéntrico", s:"3 × 10/arm", w:"6.8 kg" },{ n:"Diamond Push-up", note:"Al fallo", s:"3 × max", w:"BW" }]},
    { label:"Brazos intenso", time:"12 min", exs:[{ n:"Concentration Curl", note:"4s excéntrico", s:"3 × 8/arm", w:"6.8 kg" },{ n:"KB Tricep Ext.", note:"4s + pausa 2s arriba", s:"3 × 10", w:"6.8 kg" },{ n:"KB Tricep Kickback", note:"4s + pausa 1s", s:"3 × 10/arm", w:"4.5 kg" }]},
    { label:"Movilidad suave", time:"12 min", exs:[{ n:"KB Halos (lento)", note:"Manguito rotador", s:"3 × 10", w:"4.5 kg" },{ n:"Hollow Body Hold", note:"Solo activación", s:"2 × 25s", w:"BW" }]},
    { label:"Hombros extra B", time:"12 min", exs:[{ n:"KB Clean + Press", note:"4s excéntrico", s:"3 × 8/arm", w:"6.8 kg" },{ n:"KB Windmill", note:"Control total", s:"3 × 10/lado", w:"6.8 kg" },{ n:"KB Lateral Raise", note:"5s bajando", s:"3 × 10/arm", w:"4.5 kg" }]},
    { label:"Brazos nocturno B", time:"12 min", exs:[{ n:"Concentration Curl", note:"4s + pausa 1s arriba", s:"4 × 10/arm", w:"6.8 kg" },{ n:"KB Tricep Ext.", note:"4s excéntrico", s:"4 × 10", w:"6.8 kg" },{ n:"KB Tricep Kickback", note:"4s + pausa 2s", s:"3 × 10/arm", w:"4.5 kg" }]},
    { label:"Hombros variados B", time:"12 min", exs:[{ n:"KB Clean + Press", note:"4s excéntrico", s:"4 × 8/arm", w:"6.8 kg" },{ n:"KB Windmill", note:"4s — más reps", s:"4 × 10/lado", w:"6.8 kg" },{ n:"KB Lateral Raise", note:"5s bajando", s:"4 × 10/arm", w:"4.5 kg" }]},
    { label:"Brazos peak", time:"15 min", exs:[{ n:"Concentration Curl", note:"5s excéntrico", s:"5 × 8/arm", w:"6.8 kg" },{ n:"KB Tricep Ext.", note:"5s + pausa 2s arriba", s:"4 × 8", w:"6.8 kg" },{ n:"Diamond Push-up", note:"Al fallo absoluto", s:"5 × max", w:"BW" }]},
    { label:"Peak brazos nocturno", time:"15 min", exs:[{ n:"Concentration Curl", note:"5s + pausa 2s — máximo", s:"5 × 6/arm", w:"6.8 kg" },{ n:"KB Tricep Ext.", note:"5s + pausa 2s arriba", s:"5 × 8", w:"6.8 kg" },{ n:"KB Tricep Kickback", note:"5s — cierra el ciclo", s:"4 × 8/arm", w:"4.5 kg" }]},
  ],
  sat: [
    { label:"Movilidad suave", time:"15 min", exs:[{ n:"Hip circles + leg swings", note:"Movilidad de cadera", s:"3 min", w:"—" },{ n:"Cat-cow + rotación torácica", note:"Columna completa", s:"3 min", w:"—" }]},
    { label:"Movilidad activa", time:"15 min", exs:[{ n:"KB Halos (lento)", note:"Manguito rotador", s:"3 × 10", w:"4.5 kg" },{ n:"Goblet squat hold", note:"Stretch de cadera", s:"3 × 40s", w:"4.5 kg" }]},
    { label:"Movilidad + core suave", time:"15 min", exs:[{ n:"Cat-cow", note:"Columna", s:"3 min", w:"—" },{ n:"Hollow Body Hold", note:"Solo 2 series — activación", s:"2 × 30s", w:"BW" }]},
    { label:"Recuperación activa", time:"15 min", exs:[{ n:"Caminata tranquila", note:"Sin esfuerzo — solo mover el cuerpo", s:"10 min", w:"—" },{ n:"Estiramiento isquios + cuádriceps", note:"45s por posición", s:"2 lados", w:"—" }]},
    { label:"Movilidad deload", time:"15 min", exs:[{ n:"KB Halos", note:"Muy lento", s:"3 × 10", w:"4.5 kg" },{ n:"Hip circles", note:"Movilidad cadera", s:"3 min", w:"—" }]},
    { label:"Movilidad suave B", time:"15 min", exs:[{ n:"Hip circles + leg swings", note:"Movilidad cadera", s:"3 min", w:"—" },{ n:"KB Halos (lento)", note:"Manguito rotador", s:"3 × 10", w:"4.5 kg" }]},
    { label:"Movilidad activa B", time:"15 min", exs:[{ n:"Goblet squat hold", note:"Stretch profundo", s:"3 × 40s", w:"4.5 kg" },{ n:"Cat-cow + rotación", note:"Columna", s:"3 min", w:"—" },{ n:"Hollow Hold", note:"Activación suave", s:"2 × 30s", w:"BW" }]},
    { label:"Movilidad completa", time:"15 min", exs:[{ n:"Hip circles + leg swings", note:"Cadera completa", s:"3 min", w:"—" },{ n:"KB Halos", note:"Manguito rotador", s:"3 × 10", w:"4.5 kg" },{ n:"Hollow Hold", note:"Activación", s:"2 × 30s", w:"BW" }]},
    { label:"Recuperación S9", time:"15 min", exs:[{ n:"Caminata tranquila", note:"Recuperación activa", s:"10 min", w:"—" },{ n:"Cat-cow + rotación", note:"Columna", s:"3 min", w:"—" }]},
    { label:"Cierre del ciclo", time:"15 min", exs:[{ n:"Caminata tranquila", note:"10 semanas completas — celebra", s:"15 min", w:"—" },{ n:"Estiramiento completo", note:"Todo el cuerpo — sin prisa", s:"10 min", w:"—" }]},
  ],
  dom: [
    { label:"Caminata activa", time:"20 min", exs:[{ n:"Caminata moderada", note:"Recuperación — no corras", s:"20 min", w:"—" }]},
    { label:"Caminata + core suave", time:"20 min", exs:[{ n:"Caminata moderada", note:"Recuperación activa", s:"15 min", w:"—" },{ n:"Dead Bug", note:"2 series — solo activación", s:"2 × 10", w:"BW" }]},
    { label:"Movilidad dominical", time:"15 min", exs:[{ n:"Hip circles", note:"Movilidad cadera", s:"3 min", w:"—" },{ n:"Cat-cow", note:"Columna", s:"2 min", w:"—" }]},
    { label:"Descanso + estiramiento", time:"15 min", exs:[{ n:"Estiramiento hombros + espalda", note:"45s por posición", s:"2 lados", w:"—" }]},
    { label:"Descanso total", time:"—", exs:[{ n:"Descanso completo", note:"No hay opcional esta semana — eres humano", s:"—", w:"—" }]},
    { label:"Caminata moderada", time:"20 min", exs:[{ n:"Caminata a paso moderado", note:"Recuperación activa", s:"20 min", w:"—" }]},
    { label:"Core suave", time:"15 min", exs:[{ n:"Dead Bug", note:"Lento — 3 series", s:"3 × 10", w:"BW" },{ n:"Hollow Hold", note:"Piernas a 35°", s:"2 × 30s", w:"BW" }]},
    { label:"Movilidad dominical B", time:"15 min", exs:[{ n:"Hip circles + leg swings", note:"Cadera", s:"3 min", w:"—" },{ n:"KB Halos", note:"Manguito rotador", s:"2 × 10", w:"4.5 kg" }]},
    { label:"Descanso activo", time:"20 min", exs:[{ n:"Caminata tranquila", note:"Recuperación S9 — lo necesitas", s:"20 min", w:"—" }]},
    { label:"Domingo de cierre", time:"20 min", exs:[{ n:"Caminata libre", note:"10 semanas completas", s:"20 min", w:"—" }]},
  ],
  lun: [
    { label:"Glúteos extra", time:"10 min", exs:[{ n:"KB Glute Bridge", note:"Pausa 2s arriba", s:"3 × 15", w:"10 kg" },{ n:"Leg Raise", note:"4s bajando", s:"3 × 12", w:"BW" }]},
    { label:"Cuádriceps extra", time:"10 min", exs:[{ n:"KB Sumo Squat", note:"Pausa 3s abajo", s:"3 × 10", w:"10 kg" },{ n:"Hollow Body Hold", note:"Piernas a 30°", s:"3 × 35s", w:"BW" }]},
    { label:"Piernas variadas", time:"12 min", exs:[{ n:"KB Split Squat", note:"4s excéntrico", s:"3 × 8/leg", w:"10 kg" },{ n:"KB RDL pausa", note:"3s en el estiramiento", s:"3 × 8", w:"10 kg" },{ n:"Crunches", note:"20 lentos", s:"3 × 20", w:"BW" }]},
    { label:"Piernas intenso", time:"12 min", exs:[{ n:"KB Goblet Squat", note:"5s + 2s pausa", s:"4 × 5", w:"10 kg" },{ n:"KB Single-leg DL", note:"4s excéntrico", s:"3 × 6/leg", w:"10 kg" },{ n:"Plank hold", note:"Abs + glúteos", s:"3 × 45s", w:"BW" }]},
    { label:"Movilidad piernas", time:"12 min", exs:[{ n:"Goblet squat hold", note:"Deload — stretch", s:"3 × 40s", w:"4.5 kg" },{ n:"Hip circles + leg swings", note:"Movilidad", s:"3 min", w:"—" }]},
    { label:"Glúteos extra B", time:"12 min", exs:[{ n:"KB Glute Bridge", note:"Pausa 3s arriba", s:"4 × 12", w:"10 kg" },{ n:"KB Lateral Lunge", note:"4s excéntrico", s:"3 × 10/leg", w:"10 kg" },{ n:"Leg Raise", note:"4s bajando", s:"3 × 12", w:"BW" }]},
    { label:"Cuádriceps extra B", time:"12 min", exs:[{ n:"KB Goblet Squat", note:"4s + pausa 2s", s:"4 × 8", w:"10 kg" },{ n:"KB Split Squat", note:"4s excéntrico", s:"3 × 8/leg", w:"10 kg" },{ n:"Hollow Body Hold", note:"Piernas a 28°", s:"3 × 40s", w:"BW" }]},
    { label:"Piernas variadas B", time:"12 min", exs:[{ n:"KB RDL", note:"4s excéntrico", s:"4 × 8", w:"10 kg" },{ n:"KB Lateral Lunge", note:"4s excéntrico", s:"4 × 10/leg", w:"10 kg" },{ n:"Plank Shoulder Tap", note:"24 taps sin rotación", s:"3 × 24", w:"BW" }]},
    { label:"Piernas peak nocturno", time:"15 min", exs:[{ n:"KB Goblet Squat", note:"5s + 2s pausa", s:"4 × 5", w:"10 kg" },{ n:"KB Glute Bridge", note:"Pausa 3s — glúteo peak", s:"4 × 12", w:"10 kg" },{ n:"Hollow Rock", note:"20 rocks perfectos", s:"3 × 20", w:"BW" }]},
    { label:"Peak piernas nocturno", time:"15 min", exs:[{ n:"KB Split Squat", note:"5s excéntrico", s:"4 × 6/leg", w:"10 kg" },{ n:"KB Glute Bridge", note:"Pausa 3s", s:"5 × 10", w:"10 kg" },{ n:"Leg Raise", note:"5s bajando", s:"4 × 15", w:"BW" }]},
  ],
  mar: [
    { label:"Pecho extra", time:"10 min", exs:[{ n:"Push-up lento", note:"4s bajando", s:"3 × max", w:"BW" },{ n:"Hollow Body Hold", note:"Piernas a 30°", s:"3 × 30s", w:"BW" }]},
    { label:"Tríceps nocturno", time:"10 min", exs:[{ n:"Diamond Push-up", note:"Al fallo — lento", s:"4 × max", w:"BW" },{ n:"Leg Raise", note:"4s bajando", s:"3 × 15", w:"BW" }]},
    { label:"Pecho variado", time:"12 min", exs:[{ n:"Push-up Archer", note:"4s bajando — 8 por lado", s:"3 × 8/lado", w:"BW" },{ n:"KB Tricep Kickback", note:"4s excéntrico", s:"3 × 12/arm", w:"4.5 kg" },{ n:"Crunches", note:"Pequeño y controlado", s:"3 × 20", w:"BW" }]},
    { label:"Push intenso", time:"12 min", exs:[{ n:"KB Floor Press", note:"5s excéntrico", s:"4 × 5/arm", w:"10 kg" },{ n:"Diamond Push-up", note:"Al fallo absoluto", s:"4 × max", w:"BW" },{ n:"Hollow Rock", note:"20 rocks", s:"3 × 20", w:"BW" }]},
    { label:"Movilidad suave", time:"12 min", exs:[{ n:"KB Halos", note:"Muy lento", s:"3 × 10", w:"4.5 kg" },{ n:"Hollow Hold", note:"Solo activación", s:"2 × 25s", w:"BW" }]},
    { label:"Pecho extra B", time:"12 min", exs:[{ n:"Push-up Close Grip", note:"4s excéntrico", s:"4 × 10", w:"BW" },{ n:"KB Floor Fly", note:"5s bajando", s:"3 × 10/arm", w:"6.8 kg" },{ n:"Hollow Body Hold", note:"Piernas a 28°", s:"3 × 40s", w:"BW" }]},
    { label:"Tríceps nocturno B", time:"12 min", exs:[{ n:"KB Tricep Extension", note:"4s + pausa 2s arriba", s:"4 × 10", w:"6.8 kg" },{ n:"Diamond Push-up", note:"Al fallo", s:"4 × max", w:"BW" },{ n:"KB Tricep Kickback", note:"4s + pausa 2s", s:"3 × 10/arm", w:"4.5 kg" }]},
    { label:"Pecho variado B", time:"12 min", exs:[{ n:"Push-up Archer", note:"4s — control total", s:"4 × 8/lado", w:"BW" },{ n:"KB Floor Press", note:"4s + pausa 2s abajo", s:"4 × 8/arm", w:"10 kg" },{ n:"Mountain Climbers", note:"40s — caderas quietas", s:"3 × 40s", w:"BW" }]},
    { label:"Push peak", time:"15 min", exs:[{ n:"KB Floor Press", note:"5s + pausa 2s abajo", s:"5 × 5/arm", w:"10 kg" },{ n:"Diamond Push-up", note:"Al fallo absoluto", s:"5 × max", w:"BW" },{ n:"Hollow Body Hold", note:"Piernas a 22°", s:"4 × 45s", w:"BW" }]},
    { label:"Peak pecho nocturno", time:"15 min", exs:[{ n:"KB Floor Fly", note:"5s — estiramiento máximo", s:"4 × 8/arm", w:"6.8 kg" },{ n:"Push-up Archer", note:"5s — máximo tempo", s:"4 × 6/lado", w:"BW" },{ n:"Diamond Push-up", note:"Al fallo — cierra el ciclo", s:"5 × max", w:"BW" }]},
  ],
  mie: [
    { label:"Abdomen extra", time:"10 min", exs:[{ n:"Leg Raise", note:"4s bajando", s:"3 × 12", w:"BW" },{ n:"Russian Twist", note:"Rota completamente", s:"3 × 16", w:"4.5 kg" },{ n:"Plank hold", note:"Abs + glúteos", s:"3 × 40s", w:"BW" }]},
    { label:"Oblicuos extra", time:"10 min", exs:[{ n:"Russian Twist Heavy", note:"Toca el suelo cada lado", s:"4 × 16", w:"6.8 kg" },{ n:"Bicycle crunches", note:"Lento — rotación torso", s:"3 × 24", w:"BW" }]},
    { label:"Core variado", time:"12 min", exs:[{ n:"Hollow Rock", note:"Mantén la forma", s:"3 × 20", w:"BW" },{ n:"KB Plank Drag", note:"Caderas quietas", s:"3 × 10/lado", w:"4.5 kg" },{ n:"Toe Touches", note:"Sin impulso", s:"3 × 20", w:"BW" }]},
    { label:"Core intenso", time:"12 min", exs:[{ n:"Hollow Hold", note:"Piernas a 25°", s:"4 × 40s", w:"BW" },{ n:"Russian Twist Heavy", note:"Rápido + completo", s:"4 × 20", w:"6.8 kg" },{ n:"Mountain Climbers", note:"45s — full effort", s:"3 × 45s", w:"BW" }]},
    { label:"Abdomen suave", time:"10 min", exs:[{ n:"Leg Raise", note:"3s bajando — deload", s:"2 × 10", w:"BW" },{ n:"Hollow Hold", note:"Piernas a 35°", s:"2 × 25s", w:"BW" }]},
    { label:"Abdomen extra B", time:"12 min", exs:[{ n:"Russian Twist Heavy", note:"Rota completamente", s:"4 × 18", w:"6.8 kg" },{ n:"Leg Raise", note:"4s bajando", s:"3 × 14", w:"BW" },{ n:"Plank hold", note:"Cierra la sesión", s:"3 × 45s", w:"BW" }]},
    { label:"Oblicuos extra B", time:"12 min", exs:[{ n:"Bicycle crunches", note:"Lento — rotación torso", s:"4 × 24", w:"BW" },{ n:"Russian Twist Heavy", note:"Toca el suelo", s:"4 × 20", w:"6.8 kg" },{ n:"KB Plank Drag", note:"Caderas quietas", s:"3 × 12/lado", w:"4.5 kg" }]},
    { label:"Core completo", time:"12 min", exs:[{ n:"Hollow Rock", note:"20 rocks perfectos", s:"3 × 20", w:"BW" },{ n:"KB Plank Drag", note:"Anti-rotación", s:"4 × 12/lado", w:"4.5 kg" },{ n:"Toe Touches", note:"Sin impulso", s:"3 × 20", w:"BW" }]},
    { label:"Core peak", time:"15 min", exs:[{ n:"Hollow Hold", note:"Piernas a 22°", s:"4 × 45s", w:"BW" },{ n:"Russian Twist Heavy", note:"Rápido + completo", s:"5 × 20", w:"6.8 kg" },{ n:"Mountain Climbers", note:"45s full effort", s:"4 × 45s", w:"BW" }]},
    { label:"Peak abdomen nocturno", time:"15 min", exs:[{ n:"Hollow Rock", note:"20 rocks — cierra el ciclo", s:"4 × 20", w:"BW" },{ n:"Russian Twist Heavy", note:"Peak oblicuos", s:"5 × 20", w:"6.8 kg" },{ n:"Leg Raise", note:"5s bajando — último set del ciclo", s:"4 × 15", w:"BW" }]},
  ],
};

function MiniPanel({ dayId, wi }) {
  const data = (MINI_DATA[dayId] || [])[wi];
  if (!data) return null;
  return (
    <div style={{ marginTop:14, background:"rgba(251,191,36,0.03)", border:"1px solid rgba(251,191,36,0.1)", borderRadius:10, padding:"11px 12px" }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:9 }}>
        <div>
          <div style={{ fontSize:9, fontWeight:700, color:"rgba(251,191,36,0.5)", letterSpacing:"0.12em", marginBottom:2 }}>OPCIONAL · NOCHE</div>
          <div style={{ fontSize:13, fontWeight:600, color:"#fbbf24" }}>{data.label}</div>
        </div>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"rgba(251,191,36,0.45)", background:"rgba(251,191,36,0.07)", padding:"3px 8px", borderRadius:5 }}>{data.time}</div>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
        {data.exs.map((ex,i) => (
          <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr auto", alignItems:"center", gap:8, background:"rgba(255,255,255,0.02)", borderRadius:7, padding:"8px 10px", border:"1px solid rgba(255,255,255,0.03)" }}>
            <div>
              <div style={{ fontSize:12, fontWeight:500, color:"#e5c97a" }}>{ex.n}</div>
              <div style={{ fontSize:10, color:"#8a6f34", marginTop:1 }}>{ex.note}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#fbbf24", fontWeight:500 }}>{ex.s}</div>
              <div style={{ fontSize:9, color:"#6b4f1e", marginTop:1 }}>{ex.w}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontSize:9, color:"rgba(251,191,36,0.32)", marginTop:7, paddingTop:7, borderTop:"1px solid rgba(251,191,36,0.07)" }}>
        Sin obligación — solo si tienes energía y tiempo esa noche.
      </div>
    </div>
  );
}

// ─── Muscle Balance Panel ──────────────────────────────────────────────────────
function MuscleBalancePanel({ days }) {
  const vol = computeMuscleVolume(days);
  const muscles = Object.keys(MUSCLE_DAY);
  const rows = muscles.map(m => ({ muscle: m, sets: vol[m] || 0 })).sort((a, b) => a.sets - b.sets);
  const max = Math.max(1, ...rows.map(r => r.sets));
  const weakest = rows.slice(0, 2);

  const usedInfo = new Set();
  for (const d of days) for (const sec of d.sections) for (const ex of sec.exercises) usedInfo.add(ex.info);

  return (
    <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:9, padding:"12px 13px", marginTop:12 }}>
      <div style={{ fontSize:9, fontWeight:700, color:"#39ff88", letterSpacing:"0.14em", marginBottom:10 }}>BALANCE MUSCULAR · ESTA SEMANA</div>
      <div style={{ display:"flex", flexDirection:"column", gap:6, marginBottom:12 }}>
        {rows.map(({ muscle, sets }) => {
          const c = MUSCLE_COLOR[muscle] || "#9ca3af";
          return (
            <div key={muscle} style={{ display:"grid", gridTemplateColumns:"70px 1fr 34px", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:10, color:"#a1a1aa" }}>{muscle}</span>
              <div style={{ height:5, background:"rgba(255,255,255,0.05)", borderRadius:99, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${(sets / max) * 100}%`, background:c, borderRadius:99 }}/>
              </div>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:c, textAlign:"right" }}>{sets}</span>
            </div>
          );
        })}
      </div>

      {weakest.length > 0 && (
        <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:10 }}>
          <div style={{ fontSize:9, fontWeight:700, color:"#fbbf24", letterSpacing:"0.1em", marginBottom:7 }}>SUGERENCIAS · MENOS TRABAJADOS</div>
          <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
            {weakest.map(({ muscle }) => {
              const suggestions = suggestForMuscle(muscle, usedInfo);
              if (suggestions.length === 0) return null;
              return (
                <div key={muscle} style={{ fontSize:11, color:"#d1d5db", lineHeight:1.6 }}>
                  <span style={{ color:MUSCLE_COLOR[muscle], fontWeight:600 }}>{muscle}</span>
                  {" — agrega "}
                  {suggestions.map((s, i) => (
                    <span key={s.info}>
                      {i > 0 ? " o " : ""}
                      <span style={{ color:"#e5e7eb" }}>{EX_NAME(s.info)}</span>
                      {" ("}{s.weight}{")"}
                    </span>
                  ))}
                  {MUSCLE_DAY[muscle] ? ` el ${MUSCLE_DAY[muscle]}, con el mismo equipo que ya usas ese día.` : "."}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Luca's kid circuit ─────────────────────────────────────────────────────
// Separate track for a 10-year-old, overweight, currently inactive: bodyweight
// only, short low-impact bursts with generous rest, framed as a game so he can
// do it solo next to dad's session — not a scaled-down adult workout.
const LUCA_MISSIONS = [
  {
    title: "Misión Animales", emoji: "🐻", color: "#38bdf8",
    warmup: { name: "Baile libre", note: "Pon una canción y muévete como quieras 1 minuto — ese es tu calentamiento.", time: "1 min" },
    exercises: [
      { name: "Camina como oso", note: "Manos y pies en el suelo, camina lento por el cuarto.", time: "20s" },
      { name: "Camina como cangrejo", note: "Boca arriba, apóyate en manos y pies, camina de lado.", time: "20s" },
      { name: "Salta como rana", note: "Agáchate y salta hacia adelante, con calma.", reps: "8 saltos" },
      { name: "Marcha de soldado", note: "Rodillas arriba, marcha en tu lugar.", time: "20s" },
      { name: "Tabla del cocodrilo", note: "Cuerpo recto apoyado en los antebrazos.", time: "12s" },
    ],
    rounds: 2,
    cooldown: "Respira hondo 3 veces y estira los brazos hacia el techo. ¡Misión cumplida! 🏅",
  },
  {
    title: "Misión Superhéroe", emoji: "🦸", color: "#a78bfa",
    warmup: { name: "Vuelo de superhéroe", note: "Brazos abiertos, corre suave en tu lugar 1 minuto.", time: "1 min" },
    exercises: [
      { name: "Sentadilla de superhéroe", note: "Baja como si fueras a aterrizar, sube despacio.", reps: "8 veces" },
      { name: "Escalador lento", note: "Manos en el suelo, lleva una rodilla al pecho, luego la otra.", time: "20s" },
      { name: "Saltos de estrella", note: "Abre brazos y piernas al saltar, con calma.", reps: "8 veces" },
      { name: "Silla invisible", note: "Espalda en la pared, como sentado sin silla.", time: "12s" },
      { name: "Giros de brazos", note: "Brazos estirados, círculos grandes y lentos.", time: "15s" },
    ],
    rounds: 2,
    cooldown: "Sacude todo el cuerpo como gelatina 10 segundos. ¡Salvaste el día! 🎖️",
  },
  {
    title: "Misión Deportista", emoji: "⚽", color: "#fb923c",
    warmup: { name: "Trote suave en tu lugar", note: "Rodillas bajitas, ritmo tranquilo.", time: "1 min" },
    exercises: [
      { name: "Sube al escalón", note: "Usa un escalón bajo o step, sube y baja despacio.", reps: "8 veces/pierna" },
      { name: "Boxeo imaginario", note: "Golpes al aire, sin correr, solo brazos.", time: "20s" },
      { name: "Saltos laterales", note: "Salta de lado a lado sobre una línea imaginaria.", reps: "8 veces" },
      { name: "Tabla del cocodrilo", note: "Cuerpo recto apoyado en los antebrazos.", time: "12s" },
      { name: "Toques de balón", note: "Si tienes pelota, tócala con cada pie alternando. Si no, marcha en tu lugar.", time: "20s" },
    ],
    rounds: 2,
    cooldown: "Estira las piernas sentado, brazos hacia los pies. ¡Buen partido! 🏆",
  },
  {
    title: "Misión Ninja", emoji: "🥷", color: "#34d399",
    warmup: { name: "Sigilo en cuclillas", note: "Camina agachado y despacio por el cuarto.", time: "1 min" },
    exercises: [
      { name: "Salto de ninja", note: "Salto largo hacia adelante, aterriza suave.", reps: "6 veces" },
      { name: "Equilibrio de ninja", note: "Párate en un pie, brazos abiertos.", time: "15s/lado" },
      { name: "Saltos de payaso", note: "Jumping jacks a tu ritmo.", reps: "10 veces" },
      { name: "Gateo de ninja", note: "Gatea lento y silencioso, como espiando.", time: "20s" },
      { name: "Tabla del cocodrilo", note: "Cuerpo recto apoyado en los antebrazos.", time: "12s" },
    ],
    rounds: 2,
    cooldown: "Cierra los ojos, respira lento 3 veces. ¡Misión secreta cumplida! 🥋",
  },
];

function lucaMissionForToday() {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const dayOfYear = Math.floor((new Date() - start) / 86400000);
  return LUCA_MISSIONS[dayOfYear % LUCA_MISSIONS.length];
}

function LucaView({ done, setDone }) {
  const mission = lucaMissionForToday();
  const todayKey = isoDate(new Date());

  const toggle = useCallback((key) => {
    setDone(p => {
      const next = { ...p, [key]: !p[key] };
      try { localStorage.setItem("luca-training-done", JSON.stringify(next)); } catch {}
      return next;
    });
  }, [setDone]);

  const totalSteps = 1 + mission.exercises.length * mission.rounds;
  let doneCount = 0;
  const warmupKey = `luca-${todayKey}-warmup`;
  if (done[warmupKey]) doneCount++;
  for (let ri = 0; ri < mission.rounds; ri++) {
    mission.exercises.forEach((_, ei) => {
      if (done[`luca-${todayKey}-${ri}-${ei}`]) doneCount++;
    });
  }
  const pct = Math.round((doneCount / totalSteps) * 100);
  const c = mission.color;

  const Row = ({ rowKey, name, note, right }) => {
    const isDone = done[rowKey];
    return (
      <div onClick={() => toggle(rowKey)} style={{
        display:"grid", gridTemplateColumns:"1fr auto auto", alignItems:"center", gap:10,
        padding:"12px 14px", marginBottom:8, cursor:"pointer",
        background: isDone ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
        border:`1px solid ${isDone ? "rgba(255,255,255,0.05)" : c+"30"}`,
        borderLeft:`3px solid ${isDone ? "rgba(255,255,255,0.08)" : c}`,
        borderRadius:10, opacity: isDone ? 0.45 : 1, transition:"all 0.15s",
      }}>
        <div>
          <div style={{ fontSize:14, fontWeight:600, color: isDone ? "#6b7280" : "#f3f4f6", textDecoration: isDone ? "line-through" : "none" }}>{name}</div>
          {note && <div style={{ fontSize:11, color:"#8a8f98", marginTop:2 }}>{note}</div>}
        </div>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:12, color: isDone ? "#4b5563" : c, fontWeight:700 }}>{right}</div>
        <CompleteCheckbox isDone={isDone} dot={c} onToggle={() => toggle(rowKey)}/>
      </div>
    );
  };

  return (
    <div style={{ maxWidth:560, margin:"0 auto" }}>
      <div style={{ background:`${c}12`, border:`1px solid ${c}35`, borderRadius:14, padding:"18px 18px 14px", marginBottom:16, textAlign:"center" }}>
        <div style={{ fontSize:34, marginBottom:4 }}>{mission.emoji}</div>
        <div style={{ fontSize:19, fontWeight:700, color:"#f3f4f6" }}>{mission.title}</div>
        <div style={{ fontSize:11, color:"#9ca3af", marginTop:4 }}>Circuito para Luca — ¡mientras papá entrena, tú cumples tu misión!</div>
        <div style={{ marginTop:12 }}>
          <div style={{ height:5, background:"rgba(255,255,255,0.08)", borderRadius:99, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, background:c, borderRadius:99, transition:"width 0.3s" }}/>
          </div>
          <div style={{ fontSize:10, color:c, marginTop:5, fontFamily:"'DM Mono',monospace" }}>{doneCount}/{totalSteps} pasos</div>
        </div>
      </div>

      <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.12em", color:"#6b7280", marginBottom:6, paddingLeft:2 }}>CALENTAMIENTO</div>
      <Row rowKey={warmupKey} name={mission.warmup.name} note={mission.warmup.note} right={mission.warmup.time}/>

      {Array.from({ length: mission.rounds }, (_, ri) => (
        <div key={ri} style={{ marginTop:14 }}>
          <div style={{ fontSize:9, fontWeight:700, letterSpacing:"0.12em", color:c, marginBottom:6, paddingLeft:2, fontFamily:"'DM Mono',monospace" }}>RONDA {ri + 1}</div>
          {mission.exercises.map((ex, ei) => (
            <Row key={ei} rowKey={`luca-${todayKey}-${ri}-${ei}`} name={ex.name} note={ex.note} right={ex.time || ex.reps}/>
          ))}
        </div>
      ))}

      <div style={{ background:"rgba(255,255,255,0.02)", borderLeft:`2px solid ${c}`, borderRadius:"0 8px 8px 0", padding:"10px 13px", marginTop:14 }}>
        <div style={{ fontSize:9, fontWeight:600, letterSpacing:"0.1em", color:c, marginBottom:2 }}>PARA CERRAR</div>
        <div style={{ fontSize:12, color:"#d1d5db", lineHeight:1.6 }}>{mission.cooldown}</div>
      </div>

      <div style={{ fontSize:10, color:"#6b7280", marginTop:12, textAlign:"center", lineHeight:1.6 }}>
        No hay prisa ni carrera contra nadie — cada paso cuenta. Toma agua cuando quieras. 💧
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [wk, setWk]       = useState(initWeek());
  const [di, setDi]       = useState(() => todayDayIndex());
  const [view, setView]   = useState("day");
  const [done, setDone] = useState(() => {
    try {
      const saved = localStorage.getItem("jay-training-done");
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  const [weights, setWeights] = useState(() => {
    try {
      const saved = localStorage.getItem("jay-training-weights");
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  const [open, setOpen]   = useState(null);
  const [showMini, setShowMini] = useState(false);
  const [tlView, setTlView] = useState(false);
  const [timer, setTimer] = useState(null);
  const [completedDates, setCompletedDates] = useState(() => {
    try {
      const saved = localStorage.getItem("jay-training-completed-dates");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [lucaDone, setLucaDone] = useState(() => {
    try {
      const saved = localStorage.getItem("luca-training-done");
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  const startTimer = useCallback((ex) => {
    setTimer({ key: `${ex.info}-${ex.sets}`, label: ex.name, targetSeconds: parseTimeSeconds(ex.sets) });
  }, []);

  const setWeight = useCallback((key, value) => {
    setWeights(p => {
      const next = { ...p, [key]: value };
      try { localStorage.setItem("jay-training-weights", JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const goToday = useCallback(() => {
    setDi(todayDayIndex());
    setView("day");
    setOpen(null);
    setShowMini(false);
    setTlView(false);
  }, []);

  const W_META = DISPLAY_META[wk];
  const DAYS   = ALL_WEEKS[wk];
  const day    = DAYS[di];
  const tc     = TC[day.type] || TC.REST;
  const allEx  = day.sections.flatMap(s => s.exercises);
  const listTotal = allEx.length;
  const listDoneN = allEx.filter((_,i) => done[`w${wk}-${day.id}-${i}`]).length;
  const { total: tlTotal, doneN: tlDoneN } = timelineTotals(day, wk, done);
  const total  = tlView ? tlTotal : listTotal;
  const doneN  = tlView ? tlDoneN : listDoneN;
  const pct    = total > 0 ? Math.round(doneN / total * 100) : 0;
  let ct = 0;

  // Mark today's calendar date complete for the streak once today's session hits 100%.
  useEffect(() => {
    if (di !== todayDayIndex() || day.type === "REST" || total === 0 || pct < 100) return;
    const todayIso = isoDate(new Date());
    setCompletedDates(prev => {
      if (prev.includes(todayIso)) return prev;
      const next = [...prev, todayIso];
      try { localStorage.setItem("jay-training-completed-dates", JSON.stringify(next)); } catch {}
      return next;
    });
  }, [di, day.type, total, pct]);

  const streak = computeStreak(new Set(completedDates));

  const gd = (i) => { setDi(i); setView("day"); setOpen(null); setShowMini(false); setTlView(false); };
  const gw = (i) => { setWk(i); setDi(0); setView("week"); setOpen(null); setShowMini(false); setTlView(false); };

  const SPLIT = [
    ["LUN","Piernas + Glúteos","#39ff88"],
    ["MAR","Pecho + Tríceps","#fb7185"],
    ["MIÉ","FitXR + Abdomen","#00e5b0"],
    ["JUE","Espalda + Bíceps","#22d3ee"],
    ["VIE","Hombros + Brazos","#a3ffcb"],
    ["SAT","Descanso","#6b7280"],
    ["DOM","Cardio + Abs (opcional)","#00e5b0"],
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#000000", fontFamily:"'DM Sans',system-ui,sans-serif", color:"#e5e7eb" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { display: none; }
        html { overflow-x: hidden; }

        /* ── Mobile first ── */
        .jay-shell { display: flex; flex-direction: column; gap: 14px; }
        .jay-sidebar { width: 100%; }
        .jay-main { width: 100%; min-width: 0; }
        .jay-week-grid { display: flex; flex-direction: column; gap: 7px; }
        .jay-ex-grid { display: flex; flex-direction: column; gap: 4px; }

        /* ── Tablet ≥ 768px ── */
        @media (min-width: 768px) {
          .jay-week-grid.is-week-view { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
        }

        /* ── Desktop ≥ 1024px ── */
        @media (min-width: 1024px) {
          .jay-shell { flex-direction: row; align-items: start; gap: 28px; }
          .jay-sidebar { width: 300px; flex-shrink: 0; position: sticky; top: 80px; max-height: calc(100vh - 96px); overflow-y: auto; }
          .jay-main { flex: 1; min-width: 0; }
          .jay-week-grid.is-week-view { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .jay-ex-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .jay-ex-grid-full { grid-column: 1 / -1; }
        }

        /* ── Wide ≥ 1280px ── */
        @media (min-width: 1280px) {
          .jay-sidebar { width: 340px; }
        }

        /* ── Ultra wide ≥ 1600px ── */
        @media (min-width: 1600px) {
          .jay-sidebar { width: 380px; }
        }

        /* ── Expanded exercise spans full width in the 2-col grid ── */
        @media (min-width: 1024px) {
          .jay-ex-open { grid-column: 1 / -1; }
        }
      `}</style>

      {/* Header — includes a compact progress row in day view so it stays
          visible while scrolling a long session, regardless of header height */}
      <div style={{ background:"#000000", borderBottom:"1px solid rgba(57,255,136,0.12)", padding:"14px 0 12px", position:"sticky", top:0, zIndex:20 }}>
        <div style={{ width:"100%", maxWidth:1440, margin:"0 auto", padding:"0 20px", boxSizing:"border-box", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#39ff88", letterSpacing:"0.22em", fontWeight:600 }}>JAY · HIPERTROFIA · 8 SEMANAS</div>
            <div style={{ fontSize:14, fontWeight:700, marginTop:3, color:"#f3f4f6", letterSpacing:"0.01em" }}>Masa muscular + Abdomen definido</div>
          </div>
          <div style={{ display:"flex", gap:4, alignItems:"center" }}>
            {streak > 0 && (
              <div title="Racha de días completados" style={{
                display:"flex", alignItems:"center", gap:4,
                background:"rgba(251,146,60,0.08)", border:"1px solid rgba(251,146,60,0.3)",
                borderRadius:6, padding:"5px 10px",
              }}>
                <span style={{ fontSize:12 }}>🔥</span>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:"#fb923c", fontWeight:700 }}>{streak}</span>
              </div>
            )}
            <button onClick={goToday} title="Ir al día de hoy" style={{
              background:"rgba(251,191,36,0.08)",
              border:"1px solid rgba(251,191,36,0.3)",
              color:"#fbbf24",
              borderRadius:6, padding:"5px 12px", fontSize:11, cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif", fontWeight:600,
              transition:"all 0.15s",
            }}>Hoy</button>
            {["week","day"].map(v=>(
              <button key={v} onClick={()=>setView(v)} style={{
                background:view===v?"rgba(57,255,136,0.1)":"transparent",
                border:`1px solid ${view===v?"rgba(57,255,136,0.4)":"rgba(255,255,255,0.08)"}`,
                color:view===v?"#39ff88":"#6b7280",
                borderRadius:6, padding:"5px 12px", fontSize:11, cursor:"pointer",
                fontFamily:"'DM Sans',sans-serif", fontWeight:600,
                transition:"all 0.15s",
              }}>{v==="week"?"Semana":"Sesión"}</button>
            ))}
            <button onClick={()=>setView("luca")} title="Circuito de Luca" style={{
              background:view==="luca"?"rgba(56,189,248,0.12)":"transparent",
              border:`1px solid ${view==="luca"?"rgba(56,189,248,0.4)":"rgba(255,255,255,0.08)"}`,
              color:view==="luca"?"#38bdf8":"#6b7280",
              borderRadius:6, padding:"5px 12px", fontSize:11, cursor:"pointer",
              fontFamily:"'DM Sans',sans-serif", fontWeight:600,
              transition:"all 0.15s",
            }}>🧒 Luca</button>
          </div>
        </div>
        {view==="day" && day.type!=="REST" && total>0 && (
          <div style={{ width:"100%", maxWidth:1440, margin:"0 auto", padding:"8px 20px 0", boxSizing:"border-box", display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:10, color:tc.label, fontWeight:600, whiteSpace:"nowrap", flexShrink:0 }}>{day.focus}</span>
            <div style={{ flex:1, height:3, background:"rgba(255,255,255,0.06)", borderRadius:99, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${pct}%`, background:tc.accent, borderRadius:99, transition:"width 0.3s" }}/>
            </div>
            <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:tc.label, whiteSpace:"nowrap", flexShrink:0 }}>{doneN}/{total}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ width:"100%", maxWidth:1440, margin:"0 auto", padding:"14px 20px 56px", boxSizing:"border-box" }}>
        {view==="luca" ? (
          <LucaView done={lucaDone} setDone={setLucaDone}/>
        ) : (
        <div className="jay-shell">

        {/* ── SIDEBAR (nav) ── */}
        <div className="jay-sidebar" style={{ marginBottom:14 }}>

        {/* Week tabs — full width */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(8, 1fr)", gap:4, marginBottom:10, width:"100%" }}>
          {DISPLAY_META.map((w,i)=>(
            <button key={i} onClick={()=>gw(i)} style={{
              background:wk===i?`${w.color}14`:"rgba(255,255,255,0.02)",
              border:`1px solid ${wk===i?w.color+"55":"rgba(255,255,255,0.07)"}`,
              borderRadius:7, padding:"6px 2px", cursor:"pointer", textAlign:"center",
              transition:"all 0.15s", width:"100%",
            }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:wk===i?w.color:"#52525b", fontWeight:700 }}>S{i+1}</div>
              <div style={{ fontSize:8, color:wk===i?w.color:"#3f3f46", marginTop:2, fontWeight:wk===i?600:400, lineHeight:1.2 }}>{w.tag}</div>
            </button>
          ))}
        </div>

        {/* Banner */}
        <div style={{ background:`${W_META.color}0c`, border:`1px solid ${W_META.color}30`, borderRadius:9, padding:"9px 12px", marginBottom:11 }}>
          <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:W_META.color, fontWeight:700 }}>{W_META.label} — {W_META.tag}  </span>
          <span style={{ fontSize:11, color:"#a1a1aa" }}>{W_META.desc}</span>
        </div>

        {/* Equipment */}
        <div style={{ display:"flex", gap:4, marginBottom:11, flexWrap:"wrap" }}>
          {[["10 kg","#39ff88","principal"],["6.8 kg","#5eead4","press · curl"],["4.5 kg","#a3ffcb","iso · warmup"],["BW","#a1a1aa","corporal"]].map(([w,c,r])=>(
            <div key={w} style={{ display:"flex", alignItems:"center", gap:4, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:5, padding:"3px 8px" }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:c }}/>
              <span style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:c, fontWeight:600 }}>{w}</span>
              <span style={{ fontSize:9, color:"#71717a" }}>{r}</span>
            </div>
          ))}
        </div>

        {/* Day pills — full width grid. Marks today, already-passed days, and
            which of those were completed (green ✓) or missed (dim dot). */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:4, width:"100%" }}>
          {DAYS.map((d,i)=>{
            const tc2=TC[d.type]||TC.REST; const isA=i===di;
            const todayIdx=todayDayIndex();
            const isToday=i===todayIdx;
            const isPast=i<todayIdx;
            const isRest=d.type==="REST";
            const isCompleted=completedDates.includes(isoDateForWeekdayIndex(i));
            return (
              <button key={d.id} onClick={()=>gd(i)} style={{
                background:isA?tc2.bg:"rgba(255,255,255,0.02)",
                border:`1px solid ${isToday&&!isA?"rgba(251,191,36,0.45)":isA?tc2.accent:"rgba(255,255,255,0.07)"}`,
                borderRadius:7, padding:"7px 3px", cursor:"pointer", textAlign:"center",
                boxShadow:isA?`0 0 12px ${tc2.glow}`:"none", transition:"all 0.15s", width:"100%",
                opacity:isPast&&!isRest&&!isCompleted&&!isA?0.55:1,
              }}>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:isToday&&!isA?"#fbbf24":isA?tc2.label:"#71717a", fontWeight:600 }}>{DAY_LABELS[d.id]}</div>
                {isToday ? (
                  <div style={{ fontSize:7, color:isA?tc2.label:"#fbbf24", fontWeight:700, marginTop:3, letterSpacing:"0.05em" }}>HOY</div>
                ) : isPast && !isRest && isCompleted ? (
                  <div style={{ fontSize:8, color:"#39ff88", marginTop:3, lineHeight:1 }}>✓</div>
                ) : (
                  <div style={{ width:4, height:4, borderRadius:"50%", margin:"4px auto 0", background:isPast&&!isRest?"rgba(239,68,68,0.45)":isA?tc2.accent:"rgba(255,255,255,0.1)" }}/>
                )}
              </button>
            );
          })}
        </div>

        {/* Split overview — desktop sidebar only shows here too */}
        <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:9, padding:"10px 13px", marginTop:11 }}>
          <div style={{ fontSize:9, fontWeight:700, color:"#39ff88", letterSpacing:"0.14em", marginBottom:8 }}>SPLIT · EMPIEZA LUNES</div>
          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
            {SPLIT.map(([d,g,c])=>(
              <div key={d} style={{ display:"flex", alignItems:"center", gap:8 }}>
                <div style={{ width:3, height:3, borderRadius:"50%", background:c, flexShrink:0 }}/>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:10, color:"#71717a", width:32, flexShrink:0 }}>{d}</span>
                <span style={{ fontSize:11, fontWeight:600, color:c }}>{g}</span>
              </div>
            ))}
          </div>
        </div>

        </div>
        {/* ── END SIDEBAR ── */}

        {/* ── MAIN CONTENT ── */}
        <div className="jay-main">

        {/* ── WEEK VIEW ── */}
        {view==="week" && (
          <div className="jay-week-grid is-week-view" style={{ display:"flex", flexDirection:"column", gap:7 }}>
            {DAYS.map((d,i)=>{
              const tc2=TC[d.type]||TC.REST; const isA=i===di;
              return (
                <button key={d.id} onClick={()=>gd(i)} style={{
                  background:isA?tc2.bg:"rgba(255,255,255,0.02)",
                  border:`1px solid ${isA?tc2.accent:"rgba(255,255,255,0.07)"}`,
                  borderRadius:9, padding:"11px 13px", cursor:"pointer", textAlign:"left",
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                  boxShadow:isA?`0 0 14px ${tc2.glow}`:"none", transition:"all 0.15s", width:"100%", boxSizing:"border-box",
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                    <div style={{ width:34, height:34, borderRadius:6, background:`${tc2.accent}12`, border:`1px solid ${tc2.accent}25`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                      <span style={{ fontFamily:"'DM Mono',monospace", fontSize:8, color:tc2.label, fontWeight:700 }}>{DAY_LABELS[d.id]}</span>
                    </div>
                    <div>
                      <div style={{ fontSize:13, fontWeight:600, color:"#f3f4f6" }}>{d.focus}</div>
                      <div style={{ fontSize:10, color:"#a1a1aa", marginTop:2 }}>{d.muscles}</div>
                    </div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:9, fontWeight:600, padding:"2px 7px", borderRadius:5, background:`${tc2.accent}12`, color:tc2.label }}>{d.type}</div>
                    <div style={{ fontSize:9, color:"#71717a", marginTop:3 }}>{d.duration}</div>
                  </div>
                </button>
              );
            })}
            <MuscleBalancePanel days={DAYS}/>
          </div>
        )}

        {/* ── DAY VIEW ── */}
        {view==="day" && (
          <div>
            {/* Hero */}
            <div style={{ background:tc.bg, border:`1px solid ${tc.accent}28`, borderRadius:12, padding:"14px 14px 12px", marginBottom:12, boxShadow:`0 0 28px ${tc.glow}` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div>
                  <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:tc.label, letterSpacing:"0.14em", marginBottom:3, opacity:.7 }}>{day.label.toUpperCase()} · {W_META.label.toUpperCase()}</div>
                  <div style={{ fontSize:17, fontWeight:600, lineHeight:1.25, color:"#f3f4f6" }}>{day.focus}</div>
                  <div style={{ fontSize:11, color:"#9ca3af", marginTop:3 }}>{day.muscles}</div>
                  <div style={{ fontSize:10, color:"#6b7280", marginTop:1 }}>{day.duration}{total>0?` · ${total} ${tlView?"series":"ejercicios"}`:""}</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:3, alignItems:"flex-end", flexShrink:0 }}>
                  <div style={{ fontSize:9, fontWeight:600, padding:"2px 7px", borderRadius:5, background:`${tc.accent}12`, color:tc.label }}>{day.type}</div>
                  <div style={{ fontSize:9, fontWeight:600, padding:"2px 7px", borderRadius:5, background:`${W_META.color}12`, color:W_META.color }}>{W_META.tag}</div>
                </div>
              </div>
              {total>0 && (
                <div style={{ marginTop:12 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:10, color:"#6b7280", marginBottom:4 }}>
                    <span>Progreso</span>
                    <span style={{ color:tc.label, fontFamily:"'DM Mono',monospace" }}>{doneN}/{total}</span>
                  </div>
                  <div style={{ height:2, background:"rgba(255,255,255,0.06)", borderRadius:99, overflow:"hidden" }}>
                    <div style={{ height:"100%", width:`${pct}%`, background:tc.accent, borderRadius:99, transition:"width 0.3s" }}/>
                  </div>
                </div>
              )}
            </div>

            {day.type==="REST" ? (
              <div>
                <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:9, padding:"24px 16px", textAlign:"center" }}>
                  <div style={{ fontSize:22, marginBottom:8, color:"#374151" }}>—</div>
                  <div style={{ fontSize:12, color:"#9ca3af", lineHeight:1.7 }}>{day.tip}</div>
                </div>
                <MiniPanel dayId={day.id} wi={wk}/>
              </div>
            ):(
              <>
                {/* View toggle */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                  <div style={{ fontSize:10, color:"#6b7280" }}>{tlView ? "Toca cada set para marcarlo completado" : "Toca un ejercicio para ver cómo hacerlo"}</div>
                  <div style={{ display:"flex", gap:3, background:"rgba(255,255,255,0.04)", borderRadius:7, padding:3 }}>
                    {[["Lista","list"],["Timeline","tl"]].map(([label,val])=>{
                      const active = (val==="tl") === tlView;
                      return (
                        <button key={val} onClick={()=>{ setTlView(val==="tl"); setOpen(null); }} style={{
                          padding:"4px 10px", borderRadius:5, fontSize:10, fontWeight:600, cursor:"pointer",
                          background: active ? "rgba(57,255,136,0.12)" : "transparent",
                          color: active ? "#39ff88" : "#6b7280",
                          border: active ? "1px solid rgba(57,255,136,0.3)" : "1px solid transparent",
                          fontFamily:"'DM Sans',sans-serif", transition:"all 0.15s",
                        }}>{label}</button>
                      );
                    })}
                  </div>
                </div>

                {tlView ? (
                  <TimelineView day={day} wk={wk} done={done} setDone={setDone} onStartTimer={startTimer} weights={weights} setWeight={setWeight}/>
                ) : null}

                {!tlView && day.sections.map(section=>{
                  const dot=SDOT(section.name);
                  return (
                    <div key={section.name} style={{ marginBottom:12 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6, paddingLeft:2 }}>
                        <div style={{ width:4, height:4, borderRadius:"50%", background:dot, flexShrink:0 }}/>
                        <div style={{ fontSize:9, fontWeight:600, letterSpacing:"0.12em", color:"#6b7280" }}>{section.name.toUpperCase()}</div>
                      </div>
                      <div className="jay-ex-grid">
                        {section.exercises.map(ex=>{
                          const idx=ct++; const key=`w${wk}-${day.id}-${idx}`;
                          const isDone=done[key]; const isOpen=open===key;
                          const doToggleDone = () => setDone(p => {
                            const next = {...p, [key]: !p[key]};
                            try { localStorage.setItem("jay-training-done", JSON.stringify(next)); } catch {}
                            return next;
                          });
                          return (
                            <div key={idx} className={isOpen ? "jay-ex-open" : ""}>
                              <SwipeRow dot={dot} onToggle={doToggleDone}>
                                <div onClick={()=>setOpen(isOpen?null:key)} style={{
                                  background:isOpen?"rgba(255,255,255,0.05)":isDone?"rgba(255,255,255,0.01)":"rgba(255,255,255,0.025)",
                                  border:`1px solid ${isOpen?dot+"38":isDone?"rgba(255,255,255,0.05)":"rgba(255,255,255,0.06)"}`,
                                  borderRadius:isOpen?"10px 10px 0 0":10,
                                  padding:"10px 12px", cursor:"pointer",
                                  display:"grid", gridTemplateColumns:"1fr auto auto",
                                  alignItems:"center", gap:10,
                                  opacity:isDone&&!isOpen?0.45:1, transition:"all 0.14s",
                                }}>
                                  <div>
                                    <div style={{ fontSize:13, fontWeight:500, color:isDone?"#6b7280":"#f3f4f6", textDecoration:isDone?"line-through":"none" }}>{ex.name}</div>
                                    <div style={{ fontSize:11, color:"#6b7280", marginTop:2 }}>{ex.note}</div>
                                  </div>
                                  <div style={{ textAlign:"right" }}>
                                    <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:dot, fontWeight:500 }}>{ex.sets}</div>
                                    <div style={{ marginTop:2 }}><WeightInput storeKey={key} defaultWeight={ex.weight} value={weights[key]} onChange={setWeight} isDone={isDone}/></div>
                                  </div>
                                  <div style={{ display:"flex", alignItems:"center", gap:2 }}>
                                    <TimerButton ex={ex} dot={dot} onStart={startTimer}/>
                                    <CompleteCheckbox isDone={isDone} dot={dot} onToggle={doToggleDone}/>
                                  </div>
                                </div>
                              </SwipeRow>
                              {isOpen && <ExPanel infoKey={ex.info} dot={dot}/>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Coach tip */}
                <div style={{ background:"rgba(255,255,255,0.02)", borderLeft:`2px solid ${tc.accent}`, borderRadius:"0 8px 8px 0", padding:"9px 12px", marginTop:4 }}>
                  <div style={{ fontSize:9, fontWeight:600, letterSpacing:"0.1em", color:tc.label, marginBottom:2 }}>COACH TIP</div>
                  <div style={{ fontSize:11, color:"#9ca3af", lineHeight:1.65 }}>{day.tip}</div>
                </div>

                {/* Mini set toggle */}
                <button onClick={()=>setShowMini(s=>!s)} style={{
                  width:"100%", marginTop:12, padding:"10px 12px", borderRadius:9, cursor:"pointer",
                  background:showMini?"rgba(251,191,36,0.05)":"rgba(255,255,255,0.02)",
                  border:`1px solid ${showMini?"rgba(251,191,36,0.2)":"rgba(255,255,255,0.06)"}`,
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                  fontFamily:"'DM Sans',sans-serif", transition:"all 0.15s", boxSizing:"border-box",
                }}>
                  <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                    <div style={{ width:5, height:5, borderRadius:"50%", background:"rgba(251,191,36,0.6)" }}/>
                    <span style={{ fontSize:11, color:"#e5c97a", fontWeight:500 }}>Mini set nocturno opcional</span>
                  </div>
                  <span style={{ fontSize:10, color:"rgba(251,191,36,0.4)" }}>{showMini?"▲":"▼"}</span>
                </button>
                {showMini && <MiniPanel dayId={day.id} wi={wk}/>}
              </>
            )}

            {/* Nav */}
            <div style={{ display:"flex", gap:5, marginTop:14 }}>
              {di>0&&<button onClick={()=>gd(di-1)} style={{ flex:1, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:8, padding:"10px", color:"#a1a1aa", cursor:"pointer", fontSize:12, fontFamily:"'DM Sans',sans-serif" }}>← {DAY_LABELS[DAYS[di-1].id]}</button>}
              {di<DAYS.length-1&&<button onClick={()=>gd(di+1)} style={{ flex:1, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:8, padding:"10px", color:"#a1a1aa", cursor:"pointer", fontSize:12, fontFamily:"'DM Sans',sans-serif" }}>{DAY_LABELS[DAYS[di+1].id]} →</button>}
            </div>
          </div>
        )}

        </div>
        {/* ── END MAIN CONTENT ── */}

        </div>
        )}
        {/* ── END SHELL / LUCA ── */}
      </div>
      <FloatingStopwatch info={timer} onClose={()=>setTimer(null)}/>
      <VersionBadge/>
    </div>
  );
}
