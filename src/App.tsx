// @ts-nocheck
import { useState, useCallback } from "react";

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

// ─── 10-Week progression logic ────────────────────────────────────────────────
// S1  Base A       — forma, 3s exc, series moderadas
// S2  Volumen A    — +1 serie todo, mismo peso
// S3  Variación A  — ejercicios distintos, mismos músculos
// S4  Intensidad A — menos reps, 4s exc
// S5  Deload       — -30% volumen, forma perfecta
// S6  Base B       — 3s exc, ejercicios nuevos
// S7  Volumen B    — +1 serie
// S8  Variación B  — nuevas variantes
// S9  Intensidad B — menos reps, 5s exc
// S10 Peak         — máximo esfuerzo del ciclo

const WEEK_META = [
  { label:"Semana 1",  tag:"Base",        color:"#3b82f6", desc:"Establece los patrones. La forma ahora determina el progreso futuro." },
  { label:"Semana 2",  tag:"Volumen",     color:"#6366f1", desc:"+1 serie en todo. Mismo peso, más trabajo total." },
  { label:"Semana 3",  tag:"Variación",   color:"#f97316", desc:"Ejercicios distintos, mismos músculos. El cuerpo no anticipa." },
  { label:"Semana 4",  tag:"Intensidad",  color:"#ef4444", desc:"Menos reps, más tempo. Tiempo bajo tensión máximo." },
  { label:"Semana 5",  tag:"Deload",      color:"#94a3b8", desc:"Menos volumen, forma perfecta. El músculo se consolida." },
  { label:"Semana 6",  tag:"Base B",      color:"#0ea5e9", desc:"Nuevo ciclo. Ejercicios diferentes, misma estructura." },
  { label:"Semana 7",  tag:"Volumen B",   color:"#8b5cf6", desc:"+1 serie. Más trabajo, base más sólida que S2." },
  { label:"Semana 8",  tag:"Variación B", color:"#f59e0b", desc:"Variantes nuevas. Rompe la adaptación de nuevo." },
  { label:"Semana 9",  tag:"Intensidad B",color:"#dc2626", desc:"5s excéntrico en todo. El punto más exigente del ciclo." },
  { label:"Semana 10", tag:"Peak",        color:"#fbbf24", desc:"El máximo del ciclo completo. Cada rep debe costar." },
];

// ─── Day factory ──────────────────────────────────────────────────────────────
const mkDay = (id, short, label, type, focus, dur, muscles, sections, tip) =>
  ({ id, short, label, type, focus, duration:dur, muscles, sections, tip });

const rest = (id, short, label, tip) =>
  ({ id, short, label, type:"REST", focus:"Descanso", duration:"—", muscles:"Recuperación completa", sections:[], tip });

// Sets/reps helpers
const s = (base, wi, add=1) => base + (wi >= 1 ? add : 0); // +1 serie from week 2
const exc = (wi) => wi <= 1 ? "3s excéntrico" : wi <= 3 ? "4s excéntrico" : wi <= 5 ? "3s excéntrico" : wi <= 7 ? "4s excéntrico" : "5s excéntrico";

function buildAllWeeks() {
  return WEEK_META.map((_, wi) => {
    const e = exc(wi);
    const isDeload = wi === 4;
    const ds = isDeload ? -1 : 0; // deload: -1 serie
    const dr = isDeload ? -2 : 0; // deload: -2 reps

    // JUE: Espalda + Bíceps
    const jue = mkDay("jue","JUE","Jueves","STRENGTH","Espalda + Bíceps",
      wi < 1 ? "55 min" : wi === 4 ? "45 min" : "60 min",
      "Dorsal · Romboides · Trapecio · Bíceps · Core",
      [
        { name:"Warm-up — Pecho (antagonista)", exercises:[
          { name:"Push-up de activación", note:"Activa el pecho antes de jalar — no es el ejercicio principal", sets:"2 × 10", weight:"BW", info:"pushupLight" },
          { name:"KB Halos", note:"Manguito rotador", sets:"2 × 10", weight:"4.5 kg", info:"kbHalo" },
        ]},
        { name:"Espalda", exercises: wi < 3 ? [
          { name:"KB Swing (2 manos)", note:e, sets:`${s(4,wi)+ds} × ${10+dr}`, weight:"10 kg", info:"kbSwing" },
          { name:"KB Bent-over Row", note:e, sets:`${s(3,wi)+ds} × ${10+dr}`, weight:"10 kg", info:"bentOverRow" },
          { name:"KB Renegade Row", note:e, sets:`${s(3,wi)+ds} × ${6+dr}/arm`, weight:"10 kg", info:"renegadeRow" },
          { name:"KB Pullover", note:e+" — estira el dorsal", sets:`${s(3,wi)+ds} × ${10+dr}`, weight:"10 kg", info:"pulloverKb" },
        ] : wi === 3 ? [
          { name:"KB Swing (2 manos)", note:e+" — menos reps", sets:`5 × 6`, weight:"10 kg", info:"kbSwing" },
          { name:"KB Row con pausa 2s", note:e+" — pausa arriba", sets:`4 × 6`, weight:"10 kg", info:"bentOverRowPause" },
          { name:"KB Renegade Row", note:e, sets:`4 × 6/arm`, weight:"10 kg", info:"renegadeRow" },
          { name:"KB Deadlift", note:e, sets:`4 × 6`, weight:"10 kg", info:"deadlift" },
          { name:"KB Pullover", note:e, sets:`3 × 8`, weight:"10 kg", info:"pulloverKb" },
        ] : wi === 4 ? [
          { name:"KB Swing (2 manos)", note:"3s — deload, forma perfecta", sets:`3 × 8`, weight:"10 kg", info:"kbSwing" },
          { name:"KB Bent-over Row", note:"3s — deload", sets:`3 × 8`, weight:"10 kg", info:"bentOverRow" },
          { name:"KB Pullover", note:"3s — deload", sets:`2 × 8`, weight:"10 kg", info:"pulloverKb" },
        ] : wi < 7 ? [
          { name:"KB Single-arm Swing", note:e+" — anti-rotación", sets:`${s(4,wi-5)} × 10/arm`, weight:"10 kg", info:"kbSwingSingle" },
          { name:"KB Row con pausa 2s", note:e, sets:`${s(3,wi-5)} × 10`, weight:"10 kg", info:"bentOverRowPause" },
          { name:"KB Renegade Row", note:e, sets:`${s(3,wi-5)} × 8/arm`, weight:"10 kg", info:"renegadeRow" },
          { name:"KB Deadlift", note:e, sets:`${s(3,wi-5)} × 8`, weight:"10 kg", info:"deadlift" },
          { name:"KB Pullover", note:e, sets:`${s(3,wi-5)} × 10`, weight:"10 kg", info:"pulloverKb" },
        ] : wi === 7 ? [
          { name:"KB Single-arm Swing", note:e+" — anti-rotación", sets:`5 × 10/arm`, weight:"10 kg", info:"kbSwingSingle" },
          { name:"KB Row con pausa 2s", note:e+" — pausa máxima", sets:`4 × 8`, weight:"10 kg", info:"bentOverRowPause" },
          { name:"KB Renegade Row", note:e+" — control total", sets:`4 × 8/arm`, weight:"10 kg", info:"renegadeRow" },
          { name:"KB Deadlift", note:e+" — bisagra de cadera", sets:`4 × 8`, weight:"10 kg", info:"deadlift" },
          { name:"KB Pullover", note:e+" — estira el dorsal", sets:`3 × 10`, weight:"10 kg", info:"pulloverKb" },
        ] : wi === 8 ? [
          { name:"KB Single-arm Swing", note:e+" — máxima potencia", sets:`6 × 8/arm`, weight:"10 kg", info:"kbSwingSingle" },
          { name:"KB Row con pausa 3s", note:e+" — pausa larga", sets:`5 × 5`, weight:"10 kg", info:"bentOverRowPause" },
          { name:"KB Renegade Row", note:e+" — menos reps", sets:`5 × 5/arm`, weight:"10 kg", info:"renegadeRow" },
          { name:"KB Deadlift", note:e+" — fuerza excéntrica", sets:`5 × 5`, weight:"10 kg", info:"deadlift" },
          { name:"KB Pullover", note:e, sets:`4 × 8`, weight:"10 kg", info:"pulloverKb" },
        ] : [
          { name:"KB Single-arm Swing", note:"5s — peak del ciclo", sets:`6 × 6/arm`, weight:"10 kg", info:"kbSwingSingle" },
          { name:"KB Row con pausa 3s", note:"5s — máximo esfuerzo", sets:`5 × 5`, weight:"10 kg", info:"bentOverRowPause" },
          { name:"KB Renegade Row", note:"5s — control total máximo", sets:`5 × 5/arm`, weight:"10 kg", info:"renegadeRow" },
          { name:"KB Deadlift", note:"5s — fuerza pico", sets:`5 × 5`, weight:"10 kg", info:"deadlift" },
          { name:"KB Pullover", note:"5s — cierra la espalda", sets:`4 × 8`, weight:"10 kg", info:"pulloverKb" },
        ]},
        { name:"Bíceps", exercises: wi === 4 ? [
          { name:"KB Bicep Curl", note:"3s — deload", sets:"2 × 10/arm", weight:"6.8 kg", info:"bicepCurl" },
          { name:"KB Hammer Curl", note:"3s — deload", sets:"2 × 10/arm", weight:"6.8 kg", info:"hammerCurl" },
        ] : wi < 3 ? [
          { name:"KB Bicep Curl", note:e, sets:`${s(3,wi)} × 12/arm`, weight:"6.8 kg", info:"bicepCurl" },
          { name:"KB Hammer Curl", note:e, sets:`${s(3,wi)} × 12/arm`, weight:"6.8 kg", info:"hammerCurl" },
          ...(wi >= 1 ? [{ name:"Concentration Curl", note:e+" — aislamiento", sets:"2 × 10/arm", weight:"6.8 kg", info:"concentrationCurl" }] : []),
        ] : wi === 3 ? [
          { name:"Concentration Curl", note:"4s — aislamiento total", sets:"4 × 8/arm", weight:"6.8 kg", info:"concentrationCurl" },
          { name:"KB Bicep Curl", note:"4s + pausa 2s arriba", sets:"4 × 8/arm", weight:"6.8 kg", info:"bicepCurl" },
          { name:"KB Hammer Curl", note:"4s excéntrico", sets:"3 × 8/arm", weight:"6.8 kg", info:"hammerCurl" },
        ] : wi < 7 ? [
          { name:"Concentration Curl", note:e, sets:`${s(3,wi-5)} × 10/arm`, weight:"6.8 kg", info:"concentrationCurl" },
          { name:"KB Bicep Curl", note:e, sets:`${s(3,wi-5)} × 12/arm`, weight:"6.8 kg", info:"bicepCurl" },
          { name:"KB Hammer Curl", note:e, sets:`${s(2,wi-5)} × 12/arm`, weight:"6.8 kg", info:"hammerCurl" },
        ] : wi === 7 ? [
          { name:"Concentration Curl", note:"4s — pausa 1s arriba", sets:"4 × 10/arm", weight:"6.8 kg", info:"concentrationCurl" },
          { name:"KB Bicep Curl", note:"4s — pausa 2s arriba", sets:"4 × 10/arm", weight:"6.8 kg", info:"bicepCurl" },
          { name:"KB Hammer Curl", note:"4s — grosor máximo", sets:"3 × 10/arm", weight:"6.8 kg", info:"hammerCurl" },
        ] : wi === 8 ? [
          { name:"Concentration Curl", note:"5s — el más lento", sets:"4 × 8/arm", weight:"6.8 kg", info:"concentrationCurl" },
          { name:"KB Bicep Curl", note:"5s + pausa 2s arriba", sets:"4 × 8/arm", weight:"6.8 kg", info:"bicepCurl" },
          { name:"KB Hammer Curl", note:"5s — fuerza pico", sets:"3 × 8/arm", weight:"6.8 kg", info:"hammerCurl" },
        ] : [
          { name:"Concentration Curl", note:"5s — peak aislamiento", sets:"5 × 6/arm", weight:"6.8 kg", info:"concentrationCurl" },
          { name:"KB Bicep Curl", note:"5s + pausa 2s arriba", sets:"5 × 6/arm", weight:"6.8 kg", info:"bicepCurl" },
          { name:"KB Hammer Curl", note:"5s — cierra el bíceps", sets:"4 × 8/arm", weight:"6.8 kg", info:"hammerCurl" },
        ]},
        { name:"Core", exercises:[
          { name:"Dead Bug", note:"Exhala completamente cada rep", sets:`${Math.max(3+ds,2)} × ${10+dr}`, weight:"BW", info:"deadbug" },
          { name:"Russian Twist", note:"Rota completamente cada lado", sets:`${Math.max(3+ds,2)} × ${16+dr}`, weight:wi < 7 ? "4.5 kg" : "6.8 kg", info:wi < 7 ? "russianTwist" : "russianHeavy" },
          { name:"Leg Raise", note:"4s bajando siempre", sets:`${Math.max(3+ds,2)} × ${10+wi}`, weight:"BW", info:"legRaise" },
          { name:"Hollow Body Hold", note:wi < 7 ? "Piernas a 30°" : "Piernas a 25°", sets:`${Math.max(3+ds,2)} × ${22+wi*2}s`, weight:"BW", info:"hollowHold" },
          { name:"Bicycle crunches", note:"Lento — rotación de torso", sets:`${Math.max(3+ds,2)} × ${16+wi}`, weight:"BW", info:"bicycle" },
        ]},
      ],
      wi === 4 ? "Deload: el músculo crece y se consolida durante el descanso. Forma perfecta en cada rep — sin esfuerzo máximo."
    : wi === 0 ? "El pullover es el ejercicio más subestimado del plan — es el único que estira completamente el dorsal sin jalón."
    : wi < 4 ? "El pullover y las rows construyen el ancho y grosor de la espalda. Ambos son necesarios."
    : wi === 9 ? "S10 peak: el día más exigente de espalda y bíceps del ciclo completo. Cada rep debe costar."
    : "Concentration curl primero — aísla el bíceps completamente antes de fatiga del curl estándar."
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
        ] : wi < 3 ? [
          { name:"KB Single-arm Press", note:e, sets:`${s(4,wi)} × ${s(10,wi)}/arm`, weight:"6.8 kg", info:"kbPress" },
          { name:"KB Lateral Raise", note:"4s bajando — deltoides lateral", sets:`${s(3,wi)} × 12/arm`, weight:"4.5 kg", info:"lateralRaise" },
          { name:"KB Front Raise", note:"3s bajando — deltoides anterior", sets:`${s(3,wi)} × 12/arm`, weight:"4.5 kg", info:"frontRaise" },
          { name:"KB Upright Row", note:e, sets:`${s(3,wi)} × 12`, weight:"6.8 kg", info:"uprightRow" },
        ] : wi === 3 ? [
          { name:"KB Single-arm Press", note:"4s — fuerza excéntrica", sets:"5 × 6/arm", weight:"6.8 kg", info:"kbPress" },
          { name:"KB Windmill", note:"4s — core lateral + hombro", sets:"4 × 8/lado", weight:"6.8 kg", info:"kbWindmill" },
          { name:"KB Lateral Raise", note:"5s bajando — deltoides peak", sets:"4 × 8/arm", weight:"4.5 kg", info:"lateralRaise" },
          { name:"KB Upright Row", note:"4s bajando", sets:"4 × 8", weight:"6.8 kg", info:"uprightRow" },
        ] : wi < 7 ? [
          { name:"KB Clean + Press", note:e+" — potencia + empuje", sets:`${s(4,wi-5)} × ${s(8,wi-5)}/arm`, weight:"6.8 kg", info:"cleanPress" },
          { name:"KB Windmill", note:e+" — core lateral + hombro", sets:`${s(3,wi-5)} × 8/lado`, weight:"6.8 kg", info:"kbWindmill" },
          { name:"KB Lateral Raise", note:"4s bajando", sets:`${s(3,wi-5)} × 10/arm`, weight:"4.5 kg", info:"lateralRaise" },
          { name:"KB Upright Row", note:e, sets:`${s(3,wi-5)} × 12`, weight:"6.8 kg", info:"uprightRow" },
          { name:"KB Front Raise", note:"3s bajando", sets:`${s(3,wi-5)} × 10/arm`, weight:"4.5 kg", info:"frontRaise" },
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
        ] : wi < 3 ? [
          { name:"KB Bicep Curl", note:e, sets:`${s(3,wi)} × 12/arm`, weight:"6.8 kg", info:"bicepCurl" },
          { name:"KB Tricep Extension", note:e, sets:`${s(3,wi)} × 12`, weight:"6.8 kg", info:"tricepExt" },
          { name:"KB Hammer Curl", note:e, sets:`${s(2,wi)} × 12/arm`, weight:"6.8 kg", info:"hammerCurl" },
          { name:"KB Tricep Kickback", note:e+" — pausa 1s arriba", sets:`${s(2,wi)} × 12/arm`, weight:"4.5 kg", info:"tricepKickback" },
          { name:"Diamond Push-up", note:"Al fallo controlado", sets:`${s(2,wi)} × max`, weight:"BW", info:"diamondPushup" },
        ] : wi === 3 ? [
          { name:"KB Bicep Curl", note:"4s + pausa 1s arriba", sets:"4 × 8/arm", weight:"6.8 kg", info:"bicepCurl" },
          { name:"KB Tricep Extension", note:"4s — codos fijos", sets:"4 × 10", weight:"6.8 kg", info:"tricepExt" },
          { name:"Concentration Curl", note:"4s — aislamiento total", sets:"3 × 8/arm", weight:"6.8 kg", info:"concentrationCurl" },
          { name:"KB Tricep Kickback", note:"4s — pausa 2s arriba", sets:"3 × 10/arm", weight:"4.5 kg", info:"tricepKickback" },
          { name:"Diamond Push-up", note:"Al fallo", sets:"4 × max", weight:"BW", info:"diamondPushup" },
        ] : wi < 7 ? [
          { name:"Concentration Curl", note:e+" — aislamiento bíceps", sets:`${s(3,wi-5)} × 10/arm`, weight:"6.8 kg", info:"concentrationCurl" },
          { name:"KB Tricep Extension", note:e, sets:`${s(3,wi-5)} × 12`, weight:"6.8 kg", info:"tricepExt" },
          { name:"KB Bicep Curl", note:e, sets:`${s(3,wi-5)} × 12/arm`, weight:"6.8 kg", info:"bicepCurl" },
          { name:"KB Tricep Kickback", note:e+" — pausa 1s arriba", sets:`${s(2,wi-5)} × 12/arm`, weight:"4.5 kg", info:"tricepKickback" },
          { name:"Diamond Push-up", note:"Al fallo", sets:`${s(2,wi-5)} × max`, weight:"BW", info:"diamondPushup" },
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
          { name:"KB Farmer Carry", note:"Grip + postura + core", sets:wi===4?"2 × 40m":`${Math.max(s(3,wi > 5 ? wi-5 : wi), 2)} × 40m`, weight:"10 kg + 6.8 kg", info:"farmerCarry" },
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

    // LUN: Piernas + Glúteos
    const lun = mkDay("lun","LUN","Lunes","STRENGTH","Piernas + Glúteos",
      wi < 1 ? "55 min" : wi === 4 ? "45 min" : "60 min",
      "Cuádriceps · Isquios · Glúteos · Core",
      [
        { name:"Warm-up", exercises:[
          { name:"Hip circles + leg swings", note:"30s cada dirección", sets:"2 min", weight:"—", info:"hipCircles" },
          { name:"Goblet squat hold", note:"Stretch profundo de cadera", sets:"3 × 30s", weight:"4.5 kg", info:"gobletHold" },
        ]},
        { name:"Cuádriceps + Glúteos", exercises: wi === 4 ? [
          { name:"KB Goblet Squat", note:"3s — deload", sets:"3 × 8", weight:"10 kg", info:"gobletSquat" },
          { name:"KB Sumo Squat", note:"3s — deload", sets:"3 × 8", weight:"10 kg", info:"sumoSquat" },
          { name:"KB Glute Bridge", note:"Pausa 2s — deload", sets:"3 × 12", weight:"10 kg", info:"gluteBridge" },
        ] : wi < 3 ? [
          { name:"KB Goblet Squat", note:e, sets:`${s(4,wi)} × ${s(8,wi)}`, weight:"10 kg", info:"gobletSquat" },
          { name:"KB Split Squat", note:e, sets:`${s(3,wi)} × ${s(10,wi)}/leg`, weight:"10 kg", info:"splitSquat" },
          { name:"KB Sumo Squat", note:"Pausa 2s abajo", sets:`${s(3,wi)} × ${s(10,wi)}`, weight:"10 kg", info:"sumoSquat" },
          { name:"KB Glute Bridge", note:"Pausa 2s arriba", sets:`${s(3,wi)} × 15`, weight:"10 kg", info:"gluteBridge" },
          ...(wi >= 1 ? [{ name:"KB Lateral Lunge", note:e+" — aductor + glúteo medio", sets:"3 × 10/leg", weight:"10 kg", info:"lateralLunge" }] : []),
        ] : wi === 3 ? [
          { name:"KB Goblet Squat", note:"5s bajada + 2s pausa abajo", sets:"5 × 5", weight:"10 kg", info:"gobletSquat" },
          { name:"KB Split Squat", note:"5s excéntrico", sets:"4 × 6/leg", weight:"10 kg", info:"splitSquat" },
          { name:"KB Sumo Squat", note:"5s bajada + 3s pausa", sets:"4 × 5", weight:"10 kg", info:"sumoSquat" },
          { name:"KB Lateral Lunge", note:"4s excéntrico", sets:"4 × 8/leg", weight:"10 kg", info:"lateralLunge" },
          { name:"KB Glute Bridge", note:"Pausa 3s arriba", sets:"5 × 10", weight:"10 kg", info:"gluteBridge" },
        ] : wi < 7 ? [
          { name:"KB Goblet Squat", note:e+" — tempo controlado", sets:`${s(4,wi-5)} × ${s(8,wi-5)}`, weight:"10 kg", info:"gobletSquat" },
          { name:"KB Split Squat", note:e, sets:`${s(3,wi-5)} × ${s(10,wi-5)}/leg`, weight:"10 kg", info:"splitSquat" },
          { name:"KB Lateral Lunge", note:e, sets:`${s(3,wi-5)} × 10/leg`, weight:"10 kg", info:"lateralLunge" },
          { name:"KB Glute Bridge", note:"Pausa 2s arriba", sets:`${s(3,wi-5)} × 15`, weight:"10 kg", info:"gluteBridge" },
          { name:"KB Sumo Squat", note:"Pausa 2s abajo", sets:`${s(3,wi-5)} × 10`, weight:"10 kg", info:"sumoSquat" },
        ] : wi === 7 ? [
          { name:"KB Goblet Squat", note:"4s + pausa 2s abajo", sets:"5 × 8", weight:"10 kg", info:"gobletSquat" },
          { name:"KB Split Squat", note:"4s excéntrico", sets:"4 × 10/leg", weight:"10 kg", info:"splitSquat" },
          { name:"KB Lateral Lunge", note:"4s excéntrico", sets:"4 × 10/leg", weight:"10 kg", info:"lateralLunge" },
          { name:"KB Glute Bridge", note:"Pausa 3s arriba", sets:"4 × 15", weight:"10 kg", info:"gluteBridge" },
          { name:"KB Sumo Squat", note:"4s + pausa 2s", sets:"4 × 10", weight:"10 kg", info:"sumoSquat" },
        ] : wi === 8 ? [
          { name:"KB Goblet Squat", note:"5s + 2s pausa — fuerza pico", sets:"5 × 5", weight:"10 kg", info:"gobletSquat" },
          { name:"KB Split Squat", note:"5s excéntrico", sets:"5 × 6/leg", weight:"10 kg", info:"splitSquat" },
          { name:"KB Lateral Lunge", note:"5s excéntrico", sets:"4 × 8/leg", weight:"10 kg", info:"lateralLunge" },
          { name:"KB Glute Bridge", note:"Pausa 3s arriba", sets:"5 × 12", weight:"10 kg", info:"gluteBridge" },
          { name:"KB Sumo Squat", note:"5s + 3s pausa", sets:"4 × 5", weight:"10 kg", info:"sumoSquat" },
        ] : [
          { name:"KB Goblet Squat", note:"5s + 2s pausa — peak del ciclo", sets:"6 × 5", weight:"10 kg", info:"gobletSquat" },
          { name:"KB Split Squat", note:"5s excéntrico — fuerza máxima", sets:"5 × 6/leg", weight:"10 kg", info:"splitSquat" },
          { name:"KB Lateral Lunge", note:"5s excéntrico", sets:"5 × 8/leg", weight:"10 kg", info:"lateralLunge" },
          { name:"KB Glute Bridge", note:"Pausa 3s — glúteo peak", sets:"5 × 12", weight:"10 kg", info:"gluteBridge" },
          { name:"KB Sumo Squat", note:"5s + 3s pausa", sets:"5 × 5", weight:"10 kg", info:"sumoSquat" },
        ]},
        { name:"Isquios", exercises: wi === 4 ? [
          { name:"KB Romanian Deadlift", note:"3s — deload", sets:"3 × 8", weight:"10 kg", info:"rdl" },
          { name:"KB Single-leg Deadlift", note:"3s — deload", sets:"2 × 8/leg", weight:"10 kg", info:"singleLegDL" },
        ] : [
          { name:"KB Romanian Deadlift", note:wi < 3 ? e : wi === 3 ? "5s + pausa 3s en estiramiento" : wi < 7 ? e : wi < 9 ? e+" + pausa en estiramiento" : "5s + pausa 3s — peak isquios", sets:wi < 3 ? `${s(4,wi)} × 10` : wi === 3 ? "5 × 5" : wi < 7 ? `${s(4,wi-5)} × 10` : wi < 9 ? "4 × 8" : "5 × 5", weight:"10 kg", info:"rdl" },
          { name:"KB Single-leg Deadlift", note:wi < 3 ? e+" — equilibrio" : wi === 3 ? "4s — fuerza excéntrica" : e+" — equilibrio", sets:wi < 3 ? `${s(3,wi)} × 8/leg` : wi === 3 ? "4 × 6/leg" : wi < 7 ? `${s(3,wi-5)} × 8/leg` : "4 × 8/leg", weight:"10 kg", info:"singleLegDL" },
        ]},
        { name:"Core", exercises:[
          { name:"Plank Shoulder Tap", note:"Caderas sin rotar", sets:`${wi===4?"2":"3"} × ${18+wi*2} taps`, weight:"BW", info:"plankShoulder" },
          { name:"Leg Raise", note:"4s bajando siempre", sets:`${wi===4?"2":"3"} × ${10+wi}`, weight:"BW", info:"legRaise" },
          { name:"Dead Bug", note:"Exhala completamente cada rep", sets:`${wi===4?"2":"3"} × ${10+Math.floor(wi/2)}`, weight:"BW", info:"deadbug" },
          { name:"Hollow Body Hold", note:wi < 7 ? "Piernas a 30°" : "Piernas a 25°", sets:`${wi===4?"2":"3"} × ${22+wi*2}s`, weight:"BW", info:"hollowHold" },
          { name:"Russian Twist", note:"Rota completamente cada lado", sets:`${wi===4?"2":"3"} × ${14+wi}`, weight:wi < 7 ? "4.5 kg" : "6.8 kg", info:wi < 7 ? "russianTwist" : "russianHeavy" },
        ]},
      ],
      wi === 4 ? "Deload de piernas. Menos volumen, misma forma perfecta. Los isquios y glúteos se consolidan esta semana."
    : wi === 9 ? "S10 peak: el día de piernas más difícil del ciclo. El Goblet 5s+2s pausa debería costar desde la primera rep."
    : "Las piernas son el grupo muscular más grande. Más músculo en piernas = más calorías quemadas en reposo todo el día."
    );

    // MAR: Pecho + Tríceps
    const mar = mkDay("mar","MAR","Martes","STRENGTH","Pecho + Tríceps",
      wi < 1 ? "55 min" : wi === 4 ? "45 min" : "60 min",
      "Pectoral · Tríceps · Core",
      [
        { name:"Warm-up — Espalda alta (antagonista)", exercises:[
          { name:"KB Row liviano", note:"Activa escápulas antes de presionar — no es el ejercicio principal", sets:"2 × 12", weight:"6.8 kg", info:"kbRowLight" },
          { name:"KB Halos", note:"Manguito rotador", sets:"2 × 10", weight:"4.5 kg", info:"kbHalo" },
        ]},
        { name:"Pecho", exercises: wi === 4 ? [
          { name:"KB Floor Press", note:"3s — deload", sets:"3 × 8/arm", weight:"10 kg", info:"floorPress" },
          { name:"Push-up", note:"3s — deload", sets:"3 × 8", weight:"BW", info:"pushup" },
          { name:"KB Floor Fly", note:"4s — deload", sets:"2 × 8/arm", weight:"6.8 kg", info:"floorFly" },
        ] : wi < 3 ? [
          { name:"KB Floor Press", note:e, sets:`${s(4,wi)} × ${s(8,wi)}/arm`, weight:"10 kg", info:"floorPress" },
          { name:"Push-up", note:e, sets:`${s(4,wi)} × 10`, weight:"BW", info:"pushup" },
          { name:"KB Floor Fly", note:"4s bajando — estira el pecho", sets:`${s(3,wi)} × ${s(10,wi)}/arm`, weight:"6.8 kg", info:"floorFly" },
          ...(wi >= 1 ? [{ name:"Push-up Archer", note:e+" — pecho unilateral", sets:"3 × 8/lado", weight:"BW", info:"pushupArcher" }] : []),
        ] : wi === 3 ? [
          { name:"KB Floor Press", note:"5s — fuerza excéntrica", sets:"5 × 5/arm", weight:"10 kg", info:"floorPress" },
          { name:"Push-up Archer", note:"5s — máximo tiempo tensión", sets:"4 × 6/lado", weight:"BW", info:"pushupArcher" },
          { name:"Push-up", note:"5s bajada", sets:"4 × 6", weight:"BW", info:"pushup" },
          { name:"KB Floor Fly", note:"5s — estiramiento máximo", sets:"4 × 8/arm", weight:"6.8 kg", info:"floorFly" },
        ] : wi < 7 ? [
          { name:"KB Floor Press", note:e, sets:`${s(4,wi-5)} × ${s(8,wi-5)}/arm`, weight:"10 kg", info:"floorPress" },
          { name:"Push-up Close Grip", note:e+" — pecho interno", sets:`${s(3,wi-5)} × 10`, weight:"BW", info:"pushupClose" },
          { name:"Push-up Archer", note:e+" — pecho externo", sets:`${s(3,wi-5)} × 8/lado`, weight:"BW", info:"pushupArcher" },
          { name:"KB Floor Fly", note:"4s bajando", sets:`${s(3,wi-5)} × 10/arm`, weight:"6.8 kg", info:"floorFly" },
        ] : wi === 7 ? [
          { name:"KB Floor Press", note:"4s + pausa 1s abajo", sets:"5 × 8/arm", weight:"10 kg", info:"floorPress" },
          { name:"Push-up Close Grip", note:"4s excéntrico", sets:"4 × 10", weight:"BW", info:"pushupClose" },
          { name:"Push-up Archer", note:"4s — pecho externo", sets:"4 × 8/lado", weight:"BW", info:"pushupArcher" },
          { name:"KB Floor Fly", note:"5s bajando", sets:"4 × 10/arm", weight:"6.8 kg", info:"floorFly" },
        ] : wi === 8 ? [
          { name:"KB Floor Press", note:"5s + pausa 2s abajo", sets:"5 × 5/arm", weight:"10 kg", info:"floorPress" },
          { name:"Push-up Archer", note:"5s — fuerza pico", sets:"5 × 6/lado", weight:"BW", info:"pushupArcher" },
          { name:"Push-up", note:"5s bajada", sets:"4 × 6", weight:"BW", info:"pushup" },
          { name:"KB Floor Fly", note:"5s — estiramiento peak", sets:"4 × 8/arm", weight:"6.8 kg", info:"floorFly" },
        ] : [
          { name:"KB Floor Press", note:"5s + pausa 2s — peak pecho", sets:"6 × 5/arm", weight:"10 kg", info:"floorPress" },
          { name:"Push-up Archer", note:"5s — peak ciclo", sets:"5 × 6/lado", weight:"BW", info:"pushupArcher" },
          { name:"Push-up Close Grip", note:"5s — pecho interno peak", sets:"4 × 8", weight:"BW", info:"pushupClose" },
          { name:"KB Floor Fly", note:"5s — estiramiento máximo del ciclo", sets:"4 × 8/arm", weight:"6.8 kg", info:"floorFly" },
        ]},
        { name:"Tríceps", exercises: wi === 4 ? [
          { name:"KB Tricep Extension", note:"3s — deload", sets:"2 × 12", weight:"6.8 kg", info:"tricepExt" },
          { name:"Diamond Push-up", note:"Deload — sin ir al fallo", sets:"2 × 8", weight:"BW", info:"diamondPushup" },
        ] : [
          { name:"KB Tricep Extension", note:wi < 3 ? e : wi === 3 ? "4s + pausa 2s arriba" : wi < 8 ? e : "5s + pausa 2s arriba", sets:wi < 3 ? `${s(3,wi)} × 12` : wi === 3 ? "4 × 10" : wi < 7 ? `${s(3,wi-5)} × 12` : wi < 9 ? "4 × 10" : "5 × 8", weight:"6.8 kg", info:"tricepExt" },
          { name:"Diamond Push-up", note:wi === 3 ? "Al fallo — cierra el tríceps" : wi < 3 ? "Al fallo controlado" : "Al fallo", sets:wi < 3 ? `${s(3,wi)} × max` : wi === 3 ? "5 × max" : wi < 7 ? `${s(3,wi-5)} × max` : "4 × max", weight:"BW", info:"diamondPushup" },
          ...(wi >= 1 && wi !== 4 ? [{ name:"KB Tricep Kickback", note:wi < 3 ? e : wi === 3 ? "4s + pausa 2s" : e, sets:wi < 3 ? `${s(2,wi)} × 12/arm` : wi === 3 ? "3 × 10/arm" : `${s(2,wi-5)} × 12/arm`, weight:"4.5 kg", info:"tricepKickback" }] : []),
        ]},
        { name:"Core", exercises:[
          { name:"Hollow Body Hold", note:wi < 4 ? "Piernas a 30°" : wi === 4 ? "Piernas a 35° — deload" : wi < 8 ? "Piernas a 28°" : "Piernas a 22°", sets:`${wi===4?"2":"3"} × ${25+wi*3}s`, weight:"BW", info:"hollowHold" },
          { name:"Mountain Climbers", note:"Caderas completamente quietas", sets:`${wi===4?"2":"3"} × ${25+wi*4}s`, weight:"BW", info:"mountainClimber" },
          { name:"Leg Raise", note:"4s bajando siempre", sets:`${wi===4?"2":"3"} × ${10+wi}`, weight:"BW", info:"legRaise" },
          { name:"Dead Bug", note:"Exhala completamente cada rep", sets:`${wi===4?"2":"3"} × ${10+Math.floor(wi/2)}`, weight:"BW", info:"deadbug" },
          { name:"Russian Twist", note:"Rota completamente cada lado", sets:`${wi===4?"2":"3"} × ${14+wi}`, weight:wi < 7 ? "4.5 kg" : "6.8 kg", info:wi < 7 ? "russianTwist" : "russianHeavy" },
        ]},
      ],
      wi === 4 ? "Deload de pecho y tríceps. Menos volumen, forma impecable. La semana que viene empiezas el segundo ciclo."
    : wi === 9 ? "S10 peak: el día de pecho más exigente del ciclo. Floor Press 5s+2s pausa debería quemar desde rep 3."
    : "El warm-up de espalda antes de presionar protege el hombro y mejora la postura al presionar. Nunca lo saltes."
    );

    // MIE: FitXR + Abdomen
    const mie = mkDay("mie","MIÉ","Miércoles","FITXR","FitXR + Abdomen",
      wi === 4 ? "35 min" : wi < 2 ? "50 min" : wi < 7 ? "55 min" : "60 min",
      "Cardio · Oblicuos · Core total · Abdomen",
      [
        { name:"Warm-up", exercises:[
          { name:"KB Halos", note:"Círculos lentos", sets:"2 × 10", weight:"4.5 kg", info:"kbHalo" },
        ]},
        { name:"FitXR", exercises: wi === 4 ? [
          { name:"FitXR — Flow", note:"Pace moderado — deload", sets:"20 min", weight:"—", info:"fitxrFlow" },
        ] : [
          { name:"FitXR — Box", note:wi < 8 ? `${wi < 2 ? "2–3" : wi < 6 ? "3" : "4"} rounds, máximo esfuerzo` : "4 rounds — máximo del ciclo", sets:wi < 2 ? "20 min" : wi < 8 ? "20 min" : "25 min", weight:"—", info:"fitxrBox" },
          ...(wi === 0 ? [{ name:"FitXR — Combat", note:"1–2 rounds", sets:"10 min", weight:"—", info:"fitxrCombat" }]
           : wi < 5 ? [{ name:"FitXR — HIIT", note:"Máximo esfuerzo", sets:"15 min", weight:"—", info:"fitxrHiit" }]
           : wi === 5 ? [{ name:"FitXR — Combat", note:"2 rounds, footwork", sets:"15 min", weight:"—", info:"fitxrCombat" }]
           : wi < 9 ? [{ name:"FitXR — HIIT", note:"Máximo esfuerzo", sets:`${wi < 8 ? 15 : 20} min`, weight:"—", info:"fitxrHiit" }]
           : [{ name:"FitXR — HIIT", note:"Peak cardio — 100% esfuerzo", sets:"20 min", weight:"—", info:"fitxrHiit" }]),
        ]},
        { name:"Abdomen", exercises:[
          { name:"Russian Twist", note:"Rota completamente cada lado", sets:`${wi===4?"2":"3"} × ${16+wi*2}`, weight:wi < 3 ? "4.5 kg" : "6.8 kg", info:wi < 3 ? "russianTwist" : "russianHeavy" },
          { name:"Bicycle crunches", note:"Lento — rotación de torso", sets:`${wi===4?"2":"3"} × ${18+wi*2}`, weight:"BW", info:"bicycle" },
          { name:"Leg Raise", note:"4s bajando siempre", sets:`${wi===4?"2":"3"} × ${10+wi}`, weight:"BW", info:"legRaise" },
          { name:"Hollow Body Hold", note:wi < 4 ? "Piernas a 30°" : wi === 4 ? "Piernas a 35° — deload" : wi < 8 ? "Piernas a 28°" : "Piernas a 22°", sets:`${wi===4?"2":"3"} × ${25+wi*4}s`, weight:"BW", info:"hollowHold" },
          ...(wi >= 2 && wi !== 4 ? [{ name:"KB Plank Drag", note:"Core lateral — caderas quietas", sets:"3 × 10/lado", weight:"4.5 kg", info:"plankDrag" }] : []),
          ...(wi >= 6 ? [{ name:"Hollow Body Rock", note:"Mantén la forma al rockear", sets:"3 × 15 rocks", weight:"BW", info:"hollowRock" }] : []),
          ...(wi >= 8 ? [{ name:"Mountain Climbers", note:"45s — full effort", sets:"3 × 45s", weight:"BW", info:"mountainClimber" }] : []),
          { name:"Toe Touches", note:"Piernas al techo — sin impulso", sets:`${wi===4?"2":"3"} × ${16+wi}`, weight:"BW", info:"toeTouches" },
          { name:"Crunches", note:"Pequeño y controlado — sin jalar cuello", sets:`${wi===4?"2":"3"} × ${20+wi}`, weight:"BW", info:"crunches" },
        ]},
      ],
      wi === 4 ? "Deload: solo Flow y abdomen suave. El cuerpo procesa el trabajo de las 4 semanas anteriores."
    : wi === 9 ? "S10 peak: el miércoles más duro del ciclo. 4 rounds de Box + HIIT máximo + abdomen completo."
    : "FitXR Box + abdomen es la combinación que más ayuda a definir el core. El abdomen se define con cardio, no solo con crunches."
    );

    return [lun, mar, mie, jue, vie, sat, dom];
  });
}

// Plan starts at what was originally S3 (Jay already completed S1 and S2).
// Internal progression logic (wi 2-9) is preserved exactly — only display labels shift to S1-S8.
const RAW_WEEKS = buildAllWeeks();
const ALL_WEEKS = RAW_WEEKS.slice(4);

const DISPLAY_META = WEEK_META.slice(4).map((w, i) => ({
  ...w,
  label: `Semana ${i + 1}`,
}));

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

// ─── Timeline helpers ─────────────────────────────────────────────────────────
function parseSetCount(str) {
  const m = str.match(/^(\d+)\s*[×x]/i);
  return m ? parseInt(m[1]) : 1;
}
function parseRepsLabel(str) {
  const m = str.match(/[×x]\s*(.+)/i);
  return m ? m[1].trim() : str;
}

// ─── Timeline View ────────────────────────────────────────────────────────────
function TimelineView({ day, wk, done, setDone }) {
  const sections = day.sections.filter(s => s.exercises.length > 0);

  const toggle = useCallback((key) => {
    setDone(p => {
      const next = { ...p, [key]: !p[key] };
      try { localStorage.setItem("jay-training-done", JSON.stringify(next)); } catch {}
      return next;
    });
  }, [setDone]);

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      {sections.map((section, si) => {
        const dot = SDOT(section.name);
        const maxRounds = Math.max(...section.exercises.map(ex => parseSetCount(ex.sets)));

        return (
          <div key={section.name}>
            {/* Section header */}
            <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:10, paddingLeft:2 }}>
              <div style={{ width:4, height:4, borderRadius:"50%", background:dot, flexShrink:0 }}/>
              <div style={{ fontSize:9, fontWeight:600, letterSpacing:"0.12em", color:"#6b7280" }}>{section.name.toUpperCase()}</div>
            </div>

            {/* Rounds */}
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {Array.from({ length: maxRounds }, (_, ri) => (
                <div key={ri}>
                  <div style={{
                    fontSize:9, fontWeight:700, letterSpacing:"0.14em",
                    color:dot, marginBottom:6, paddingLeft:4,
                    fontFamily:"'DM Mono',monospace",
                  }}>SERIE {ri + 1}</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
                    {section.exercises.map((ex, ei) => {
                      const numSets = parseSetCount(ex.sets);
                      if (ri >= numSets) return null;
                      const key = `tl-w${wk}-${day.id}-${si}-${ei}-${ri}`;
                      const isDone = done[key];
                      return (
                        <div key={ei} onClick={() => toggle(key)} style={{
                          display:"grid", gridTemplateColumns:"1fr auto auto",
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
                          <div style={{
                            fontFamily:"'DM Mono',monospace", fontSize:12,
                            color: isDone ? "#4b5563" : dot, fontWeight:600,
                          }}>{parseRepsLabel(ex.sets)}</div>
                          <div style={{
                            width:20, height:20, borderRadius:"50%", flexShrink:0,
                            background: isDone ? dot : "rgba(255,255,255,0.05)",
                            border:`1px solid ${isDone ? dot : "rgba(255,255,255,0.12)"}`,
                            display:"flex", alignItems:"center", justifyContent:"center",
                            transition:"all 0.15s",
                          }}>
                            {isDone && <span style={{ fontSize:9, color:"#000", fontWeight:700 }}>✓</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
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

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [wk, setWk]       = useState(initWeek());
  const [di, setDi]       = useState(0);
  const [view, setView]   = useState("week");
  const [done, setDone] = useState(() => {
    try {
      const saved = localStorage.getItem("jay-training-done");
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });
  const [open, setOpen]   = useState(null);
  const [showMini, setShowMini] = useState(false);
  const [tlView, setTlView] = useState(false);

  const W_META = DISPLAY_META[wk];
  const DAYS   = ALL_WEEKS[wk];
  const day    = DAYS[di];
  const tc     = TC[day.type] || TC.REST;
  const allEx  = day.sections.flatMap(s => s.exercises);
  const total  = allEx.length;
  const doneN  = allEx.filter((_,i) => done[`w${wk}-${day.id}-${i}`]).length;
  const pct    = total > 0 ? Math.round(doneN / total * 100) : 0;
  let ct = 0;

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
        html, body { overflow-x: hidden; }

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

      {/* Header */}
      <div style={{ background:"#000000", borderBottom:"1px solid rgba(57,255,136,0.12)", padding:"14px 0 12px", position:"sticky", top:0, zIndex:20 }}>
        <div style={{ width:"100%", maxWidth:1440, margin:"0 auto", padding:"0 20px", boxSizing:"border-box", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:"#39ff88", letterSpacing:"0.22em", fontWeight:600 }}>JAY · HIPERTROFIA · 6 SEMANAS</div>
            <div style={{ fontSize:14, fontWeight:700, marginTop:3, color:"#f3f4f6", letterSpacing:"0.01em" }}>Masa muscular + Abdomen definido</div>
          </div>
          <div style={{ display:"flex", gap:4 }}>
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
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ width:"100%", maxWidth:1440, margin:"0 auto", padding:"14px 20px 56px", boxSizing:"border-box" }}>
        <div className="jay-shell">

        {/* ── SIDEBAR (nav) ── */}
        <div className="jay-sidebar" style={{ marginBottom:14 }}>

        {/* Week tabs — full width */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(6, 1fr)", gap:4, marginBottom:10, width:"100%" }}>
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

        {/* Day pills — full width grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7, 1fr)", gap:4, width:"100%" }}>
          {DAYS.map((d,i)=>{
            const tc2=TC[d.type]||TC.REST; const isA=i===di;
            return (
              <button key={d.id} onClick={()=>gd(i)} style={{
                background:isA?tc2.bg:"rgba(255,255,255,0.02)",
                border:`1px solid ${isA?tc2.accent:"rgba(255,255,255,0.07)"}`,
                borderRadius:7, padding:"7px 3px", cursor:"pointer", textAlign:"center",
                boxShadow:isA?`0 0 12px ${tc2.glow}`:"none", transition:"all 0.15s", width:"100%",
              }}>
                <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9, color:isA?tc2.label:"#71717a", fontWeight:600 }}>{DAY_LABELS[d.id]}</div>
                <div style={{ width:4, height:4, borderRadius:"50%", margin:"4px auto 0", background:isA?tc2.accent:"rgba(255,255,255,0.1)" }}/>
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
                  <div style={{ fontSize:10, color:"#6b7280", marginTop:1 }}>{day.duration}{total>0?` · ${total} ejercicios`:""}</div>
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
                  <TimelineView day={day} wk={wk} done={done} setDone={setDone}/>
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
                          return (
                            <div key={idx} className={isOpen ? "jay-ex-open" : ""}>
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
                                  <div style={{ fontSize:10, color:"#6b7280", marginTop:1 }}>{ex.weight}</div>
                                </div>
                                <div onClick={e=>{e.stopPropagation();setDone(p => {
                                  const next = {...p, [key]: !p[key]};
                                  try { localStorage.setItem("jay-training-done", JSON.stringify(next)); } catch {}
                                  return next;
                                });}} style={{
                                  width:20, height:20, borderRadius:"50%", flexShrink:0,
                                  background:isDone?dot:"rgba(255,255,255,0.05)",
                                  border:`1px solid ${isDone?dot:"rgba(255,255,255,0.1)"}`,
                                  display:"flex", alignItems:"center", justifyContent:"center",
                                  cursor:"pointer", transition:"all 0.14s",
                                }}>
                                  {isDone&&<span style={{ fontSize:9, color:"#000000", fontWeight:700 }}>✓</span>}
                                </div>
                              </div>
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
        {/* ── END SHELL ── */}
      </div>
    </div>
  );
}
