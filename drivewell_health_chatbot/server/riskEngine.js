const SYMPTOM_POINTS = {
  headache: 8,
  backPain: 5,
  neckPain: 5,
  eyeStrain: 8,
  nausea: 15,
  blurredVision: 20,
  dizziness: 25,
  chestPain: 100,
};

const URGENT_SYMPTOMS = new Set(['chestPain', 'dizziness']);

const SYMPTOM_LABELS = {
  headache: 'Headache',
  backPain: 'Back pain',
  neckPain: 'Neck pain',
  eyeStrain: 'Eye strain',
  nausea: 'Nausea',
  blurredVision: 'Blurred vision',
  dizziness: 'Dizziness / lightheadedness',
  chestPain: 'Chest pain or pressure',
};

function sleepPoints(hours) {
  if (hours < 4) return 40;
  if (hours < 6) return 25;
  if (hours < 7) return 10;
  return 0;
}

export function scoreCheckin({ sleepHours, stressLevel, symptoms = [], medication, recentCheckins = [] }) {
  const factors = [];
  let score = 0;

  const sp = sleepPoints(sleepHours);
  score += sp;
  if (sp > 0) factors.push(`Sleep: ${sleepHours}h logged (+${sp})`);

  const stressPts = Math.max(0, Math.min(5, stressLevel)) * 6;
  score += stressPts;
  if (stressPts > 0) factors.push(`Stress level ${stressLevel}/5 (+${stressPts})`);

  let urgent = false;
  for (const s of symptoms) {
    const pts = SYMPTOM_POINTS[s];
    if (!pts) continue;
    score += pts;
    factors.push(`${SYMPTOM_LABELS[s] || s} (+${pts})`);
    if (URGENT_SYMPTOMS.has(s)) urgent = true;
  }

  if (medication) {
    score += 20;
    factors.push('Medication that can cause drowsiness (+20)');
  }

  const priorPoorSleepStreak = recentCheckins.slice(0, 2).every((c) => c.sleepHours < 6);
  if (recentCheckins.length >= 2 && priorPoorSleepStreak) {
    score += 15;
    factors.push('3rd+ consecutive night of poor sleep (+15)');
  }

  let level;
  if (urgent || score >= 60) level = 'High';
  else if (score >= 30) level = 'Moderate';
  else level = 'Low';

  const recommendation = buildRecommendation(level, urgent);

  return { score, level, urgent, factors, recommendation };
}

function buildRecommendation(level, urgent) {
  if (urgent) {
    return "Do not start your shift. This includes symptoms that need medical attention — contact your dispatcher and consider seeking medical care before driving.";
  }
  if (level === 'High') {
    return "High fatigue/health risk detected. Do not start your shift yet — rest, hydrate, and check in again before driving. Notify your dispatcher if this doesn't improve.";
  }
  if (level === 'Moderate') {
    return 'Some risk factors present. Take extra breaks, avoid long stretches without stopping, and monitor how you feel throughout the shift.';
  }
  return 'No significant risk factors detected. Standard precautions apply — stay hydrated and take normal rest breaks.';
}

const FATIGUE_KEYWORDS = [
  "can't keep my eyes open",
  'falling asleep',
  'nodding off',
  'so tired',
  'exhausted',
  'about to crash',
  'blacking out',
  'chest pain',
  'chest hurts',
  "can't breathe",
  'severely dizzy',
  'passing out',
];

export function scanMessageForFatigueSignals(message) {
  const lower = String(message || '').toLowerCase();
  for (const kw of FATIGUE_KEYWORDS) {
    if (lower.includes(kw)) return kw;
  }
  return null;
}
