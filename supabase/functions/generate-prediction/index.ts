import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PredictionInput {
  sleep: number;
  stress: number;
  mood: number;
  energy: number;
  symptoms: string[];
  quickInputs: string[];
  stressReason?: string;
}

interface PredictionResult {
  finalScore: number;
  riskLevel: string;
  recommendation: string;
  warnings: string[];
  penalties: string[];
  stressInsight?: string;
}

// Weights
const MOOD_WEIGHT = 0.3;
const STRESS_WEIGHT = 0.3;
const ENERGY_WEIGHT = 0.2;
const SLEEP_WEIGHT = 0.1;
const SYMPTOM_WEIGHT = 0.1;

function normalizeMood(mood: number): number {
  // mood is 1-5, normalize to 0-1
  return (mood - 1) / 4;
}

function normalizeStress(stress: number): number {
  // stress is 1-10, invert and normalize (lower stress = higher score)
  return (10 - stress) / 9;
}

function normalizeEnergy(energy: number): number {
  // energy is 1-5, normalize to 0-1
  return (energy - 1) / 4;
}

function normalizeSleep(sleep: number): number {
  // optimal sleep is 7-9 hours, score based on proximity to ideal
  if (sleep >= 7 && sleep <= 9) return 1.0;
  if (sleep >= 6 && sleep < 7) return 0.7;
  if (sleep > 9 && sleep <= 10) return 0.8;
  if (sleep >= 5 && sleep < 6) return 0.5;
  if (sleep > 10) return 0.6;
  if (sleep >= 4 && sleep < 5) return 0.3;
  return 0.1; // less than 4 hours
}

function calculateSymptomScore(symptoms: string[]): number {
  // More symptoms = lower score
  const count = symptoms.length;
  if (count === 0) return 1.0;
  if (count === 1) return 0.8;
  if (count === 2) return 0.6;
  if (count === 3) return 0.4;
  return Math.max(0.1, 1 - (count * 0.15)); // 4+ symptoms
}

function getRiskLevel(score: number): string {
  if (score >= 0.8) return 'Excellent / Balanced';
  if (score >= 0.6) return 'Stable but Needs Monitoring';
  if (score >= 0.4) return 'Needs Recovery / Mild Risk';
  return 'High Alert / Severe Fatigue or Stress';
}

function generatePrediction(input: PredictionInput): PredictionResult {
  const { sleep, stress, mood, energy, symptoms, quickInputs, stressReason } = input;
  
  const warnings: string[] = [];
  const penalties: string[] = [];
  let penaltyDeduction = 0;

  // Calculate base normalized scores
  const moodScore = normalizeMood(mood);
  const stressScore = normalizeStress(stress);
  const energyScore = normalizeEnergy(energy);
  const sleepScore = normalizeSleep(sleep);
  const symptomScore = calculateSymptomScore(symptoms);

  // Apply rule-based logic penalties
  
  // Low sleep penalty (<6 hours)
  if (sleep < 6) {
    penalties.push('Fatigue penalty: Low sleep duration detected');
    penaltyDeduction += 0.1;
  }

  // High stress penalty (>7/10)
  if (stress > 7) {
    penalties.push('Cortisol penalty: High stress levels detected');
    penaltyDeduction += 0.1;
  }

  // Symptom warnings
  if (symptoms.length >= 4) {
    warnings.push('⚠️ Strong risk warning: 4+ symptoms reported');
    penaltyDeduction += 0.05;
  } else if (symptoms.length >= 2) {
    warnings.push('⚠️ Mild risk warning: Multiple symptoms reported');
  }

  // Specific symptom combinations
  if (symptoms.includes('Bloating') && energy <= 2) {
    warnings.push('🔴 Gut imbalance detected: Bloating combined with low energy');
    penaltyDeduction += 0.05;
  }

  if (symptoms.includes('Anxiety') && sleep < 6) {
    warnings.push('🔴 Mood decline risk: Anxiety combined with poor sleep');
    penaltyDeduction += 0.05;
  }

  // Calculate weighted final score
  let finalScore = (
    (moodScore * MOOD_WEIGHT) +
    (stressScore * STRESS_WEIGHT) +
    (energyScore * ENERGY_WEIGHT) +
    (sleepScore * SLEEP_WEIGHT) +
    (symptomScore * SYMPTOM_WEIGHT)
  );

  // Apply penalties
  finalScore = Math.max(0, finalScore - penaltyDeduction);

  // Bonus for healthy habits
  if (quickInputs.includes('Exercise')) {
    finalScore = Math.min(1, finalScore + 0.03);
  }
  if (quickInputs.includes('Healthy Diet')) {
    finalScore = Math.min(1, finalScore + 0.02);
  }

  // Get risk level
  const riskLevel = getRiskLevel(finalScore);

  // Generate tailored recommendation
  const recommendation = generateRecommendation(input, finalScore, riskLevel, warnings);

  // Generate personalized stress insight
  const stressInsight = generateStressInsight(stressReason, stress);

  console.log('Prediction generated:', {
    input,
    scores: { moodScore, stressScore, energyScore, sleepScore, symptomScore },
    finalScore,
    riskLevel,
    penalties,
    warnings,
    stressInsight
  });

  return {
    finalScore: Math.round(finalScore * 100) / 100,
    riskLevel,
    recommendation,
    warnings,
    penalties,
    stressInsight
  };
}

function generateStressInsight(stressReason: string | undefined, stress: number): string | undefined {
  if (!stressReason || stressReason.trim().length === 0) {
    // Generic message if no stress reason provided
    if (stress > 5) {
      return "Take a moment to breathe deeply. Even small breaks can help reset your mind and body.";
    }
    return undefined;
  }

  const reason = stressReason.toLowerCase();

  // Work/Study related
  if (reason.includes('exam') || reason.includes('study') || reason.includes('test') || reason.includes('school') || reason.includes('assignment')) {
    return "Study stress can feel overwhelming. Try the Pomodoro technique — 25 minutes of focus, then a 5-minute break. You've got this! 📚";
  }

  if (reason.includes('work') || reason.includes('job') || reason.includes('deadline') || reason.includes('project') || reason.includes('boss') || reason.includes('workload')) {
    return "Work pressure building up? Step away for a 5-minute walk or stretch. A clear mind leads to better productivity. 💼";
  }

  // Relationship/Emotional
  if (reason.includes('relationship') || reason.includes('partner') || reason.includes('boyfriend') || reason.includes('girlfriend') || reason.includes('spouse')) {
    return "Relationship stress is tough. Try grounding yourself with slow, deep breaths. Consider journaling your feelings before any important conversations. 💙";
  }

  if (reason.includes('family') || reason.includes('parent') || reason.includes('mom') || reason.includes('dad') || reason.includes('sibling')) {
    return "Family matters can weigh heavily on us. A 4-7-8 breathing exercise can help calm your nervous system. Remember, it's okay to set boundaries. 🏠";
  }

  if (reason.includes('emotion') || reason.includes('feeling') || reason.includes('sad') || reason.includes('upset') || reason.includes('anxious') || reason.includes('worried')) {
    return "Your feelings are valid. Try a grounding exercise: name 5 things you see, 4 you hear, 3 you touch. This can help bring you back to the present. 🌸";
  }

  // Health/Physical
  if (reason.includes('health') || reason.includes('sick') || reason.includes('pain') || reason.includes('doctor') || reason.includes('medical')) {
    return "Health concerns can be stressful. Focus on what you can control — stay hydrated, rest when needed, and reach out to healthcare providers when necessary. 🩺";
  }

  if (reason.includes('sleep') || reason.includes('tired') || reason.includes('fatigue') || reason.includes('exhausted') || reason.includes('insomnia')) {
    return "Sleep deprivation affects everything. Tonight, try a calming routine: no screens 30 mins before bed, dim lights, and a warm drink. Your body will thank you. 🌙";
  }

  // Financial
  if (reason.includes('money') || reason.includes('financial') || reason.includes('bill') || reason.includes('debt') || reason.includes('rent')) {
    return "Financial stress is real and valid. Take one small step today — even reviewing a single expense can give you back a sense of control. 💰";
  }

  // Social
  if (reason.includes('friend') || reason.includes('social') || reason.includes('lonely') || reason.includes('alone') || reason.includes('isolated')) {
    return "Social connections matter. Even a short text to someone you trust can lift your spirits. You're not alone in feeling this way. 🤝";
  }

  // Default personalized response based on stress level
  if (stress >= 7) {
    return `We hear you about "${stressReason.slice(0, 30)}${stressReason.length > 30 ? '...' : ''}". High stress moments call for immediate relief — try box breathing: 4 counts in, hold 4, out 4, hold 4. 🧘`;
  }

  return `Thanks for sharing about "${stressReason.slice(0, 30)}${stressReason.length > 30 ? '...' : ''}". Remember, acknowledging stress is the first step. Take things one moment at a time. 💚`;
}

function generateRecommendation(
  input: PredictionInput,
  score: number,
  riskLevel: string,
  warnings: string[]
): string {
  const { sleep, stress, mood, energy, symptoms } = input;
  
  const recommendations: string[] = [];

  // Based on final score range
  if (score >= 0.8) {
    recommendations.push("Great job! Your biomarkers indicate excellent balance. Keep maintaining your current healthy habits.");
  } else if (score >= 0.6) {
    recommendations.push("You're doing well overall, but there's room for optimization.");
  } else if (score >= 0.4) {
    recommendations.push("Your body needs some recovery attention. Focus on rest and stress management.");
  } else {
    recommendations.push("⚠️ Your readings indicate significant stress or fatigue. Prioritize immediate self-care.");
  }

  // Specific recommendations based on inputs
  if (sleep < 6) {
    recommendations.push("💤 Prioritize getting 7-8 hours of sleep tonight. Consider a wind-down routine.");
  }

  if (stress > 7) {
    recommendations.push("🧘 High stress detected. Try breathing exercises, meditation, or a short walk.");
  }

  if (mood <= 2) {
    recommendations.push("💚 Low mood noted. Connect with someone you trust or engage in an activity you enjoy.");
  }

  if (energy <= 2) {
    recommendations.push("⚡ Low energy levels. Consider a power nap, light exercise, or checking your nutrition.");
  }

  if (symptoms.includes('Bloating')) {
    recommendations.push("🍃 For bloating: Stay hydrated, consider probiotics, and avoid processed foods.");
  }

  if (symptoms.includes('Anxiety')) {
    recommendations.push("🌿 For anxiety: Limit caffeine, practice grounding techniques, and maintain regular sleep.");
  }

  if (symptoms.includes('Brain Fog')) {
    recommendations.push("🧠 For brain fog: Ensure adequate hydration, take breaks, and consider omega-3 rich foods.");
  }

  if (symptoms.includes('Insomnia')) {
    recommendations.push("🌙 For insomnia: Avoid screens before bed, keep a consistent sleep schedule, and reduce evening caffeine.");
  }

  return recommendations.join(' ');
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const input: PredictionInput = await req.json();
    
    console.log('Received prediction request:', input);

    // Validate input
    if (typeof input.sleep !== 'number' || 
        typeof input.stress !== 'number' || 
        typeof input.mood !== 'number' || 
        typeof input.energy !== 'number') {
      throw new Error('Invalid input: missing required numeric fields');
    }

    const prediction = generatePrediction({
      sleep: input.sleep,
      stress: input.stress,
      mood: input.mood,
      energy: input.energy,
      symptoms: input.symptoms || [],
      quickInputs: input.quickInputs || [],
      stressReason: input.stressReason || ''
    });

    return new Response(JSON.stringify(prediction), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating prediction:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
