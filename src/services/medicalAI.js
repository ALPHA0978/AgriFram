import { BaseAI } from './baseAI.js'
import { FALLBACK_DISCLAIMER } from './huggingFaceService.js'

export class MedicalAI extends BaseAI {
  static async comprehensiveDiagnosis(patientData) {
    const analysisId = `[DIAGNOSIS-${Date.now()}]`;
    console.log(`${analysisId} 🏥 Starting comprehensive diagnosis via minimax-m2:cloud...`);
    const startTime = Date.now();
    try {
      const systemPrompt = `You are an advanced medical AI. Return ONLY valid JSON:
{
  "primaryDiagnosis": "most likely condition",
  "confidence": 85,
  "urgency": "low|medium|high|critical",
  "differentialDiagnosis": [
    {"condition": "name", "probability": "percentage", "reasoning": "why possible"}
  ],
  "symptoms": {
    "reported": ["patient symptoms"],
    "associated": ["related symptoms to watch"],
    "redFlags": ["warning signs"]
  },
  "investigations": [
    {"test": "test name", "priority": "high|medium|low", "reason": "why needed"}
  ],
  "treatment": {
    "immediate": ["urgent actions"],
    "medications": [{"name": "drug", "dosage": "amount", "duration": "time"}],
    "lifestyle": ["recommendations"]
  },
  "followUp": {
    "timeframe": "when to return",
    "monitoring": ["what to watch"],
    "specialist": "if referral needed"
  },
  "riskFactors": ["identified risks"],
  "prognosis": "expected outcome"
}`

      const response = await this.callAPI(`Patient: Age ${patientData.age}, Gender ${patientData.gender}, Symptoms: ${patientData.symptoms}, Duration: ${patientData.duration}, Medical History: ${patientData.medicalHistory}, Current Medications: ${patientData.medications}, Vital Signs: ${patientData.vitals}`, systemPrompt)

      const parsed = this.parseJSON(response);
      if (parsed) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`${analysisId} ✅ Diagnosis complete in ${elapsed}s - ${parsed.primaryDiagnosis || 'done'}`);
        return parsed;
      }
      console.warn(`${analysisId} ⚠️ Using fallback diagnosis data. ${FALLBACK_DISCLAIMER}`);
      return this.getDefaultDiagnosis();
    } catch (error) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.error(`${analysisId} ❌ Diagnosis error after ${elapsed}s:`, error.message);
      console.warn(`${analysisId} ⚠️ Using fallback diagnosis data. ${FALLBACK_DISCLAIMER}`);
      return this.getDefaultDiagnosis()
    }
  }

  static async analyzeVitals(vitalsData) {
    const analysisId = `[VITALS-${Date.now()}]`;
    console.log(`${analysisId} ❤️ Analyzing vitals via minimax-m2:cloud... BP:${vitalsData.bloodPressure}, HR:${vitalsData.heartRate}`);
    const startTime = Date.now();
    try {
      const systemPrompt = `Advanced medical vitals AI. Return ONLY JSON:
{
  "overallStatus": "normal|concerning|critical",
  "alerts": [{"type": "vital", "severity": "low|medium|high", "message": "alert", "action": "required action"}],
  "vitalsAnalysis": {
    "bloodPressure": {"status": "normal|high|low", "risk": "assessment", "category": "optimal|normal|elevated|stage1|stage2"},
    "heartRate": {"status": "normal|high|low", "concern": "level", "rhythm": "regular|irregular"},
    "temperature": {"status": "normal|fever|hypothermia", "action": "needed"},
    "oxygenSaturation": {"status": "normal|low", "urgency": "level"}
  },
  "predictions": {
    "riskFactors": ["identified risks"],
    "complications": ["potential complications"],
    "timeline": "expected progression",
    "monitoring": "what to watch"
  },
  "recommendations": {
    "immediate": ["urgent actions"],
    "monitoring": ["parameters to track"],
    "lifestyle": ["modifications"]
  }
}`

      const response = await this.callAPI(`Comprehensive vitals analysis: BP ${vitalsData.bloodPressure}, HR ${vitalsData.heartRate}, Temp ${vitalsData.temperature}°F, SpO2 ${vitalsData.oxygenSaturation}%, RR ${vitalsData.respiratoryRate}. Provide detailed medical assessment with predictions.`, systemPrompt)

      const parsed = this.parseJSON(response);
      if (parsed) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`${analysisId} ✅ Vitals analysis complete in ${elapsed}s - Status: ${parsed.overallStatus}`);
        return parsed;
      }
      console.warn(`${analysisId} ⚠️ Using fallback vitals data. ${FALLBACK_DISCLAIMER}`);
      return this.getDefaultVitals();
    } catch (error) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.error(`${analysisId} ❌ Vitals analysis error after ${elapsed}s:`, error.message);
      console.warn(`${analysisId} ⚠️ Using fallback vitals data. ${FALLBACK_DISCLAIMER}`);
      return this.getDefaultVitals()
    }
  }

  static async predictHealthOutcomes(patientData, vitalsHistory) {
    const analysisId = `[PREDICT-${Date.now()}]`;
    console.log(`${analysisId} 🔮 Predicting health outcomes via minimax-m2:cloud...`);
    const startTime = Date.now();
    try {
      const systemPrompt = `Medical prediction AI. Return ONLY JSON:
{
  "riskAssessment": {
    "cardiovascular": {"risk": "low|medium|high", "factors": ["risk factors"], "timeline": "when to expect"},
    "diabetes": {"risk": "low|medium|high", "indicators": ["warning signs"], "prevention": ["preventive measures"]},
    "hypertension": {"risk": "low|medium|high", "progression": "likely progression", "management": ["management strategies"]}
  },
  "healthTrajectory": {
    "shortTerm": "1-3 months outlook",
    "mediumTerm": "6-12 months projection",
    "longTerm": "1-5 years prediction"
  },
  "interventions": {
    "preventive": ["prevention strategies"],
    "therapeutic": ["treatment options"],
    "lifestyle": ["lifestyle changes"]
  },
  "monitoring": {
    "frequency": "how often to check",
    "parameters": ["what to monitor"],
    "alerts": ["warning signs to watch"]
  }
}`

      const historyText = vitalsHistory ? vitalsHistory.map(h => `${h.date}: BP ${h.bp}, HR ${h.hr}`).join(', ') : 'No history'

      const response = await this.callAPI(`Patient: Age ${patientData.age}, Gender ${patientData.gender}, Medical History: ${patientData.medicalHistory}, Current Symptoms: ${patientData.symptoms}, Vitals History: ${historyText}. Predict health outcomes and risks.`, systemPrompt)

      const parsed = this.parseJSON(response);
      if (parsed) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`${analysisId} ✅ Health outcomes predicted in ${elapsed}s`);
        return parsed;
      }
      console.warn(`${analysisId} ⚠️ Using fallback predictions. ${FALLBACK_DISCLAIMER}`);
      return this.getDefaultPredictions();
    } catch (error) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.error(`${analysisId} ❌ Health prediction error after ${elapsed}s:`, error.message);
      console.warn(`${analysisId} ⚠️ Using fallback predictions. ${FALLBACK_DISCLAIMER}`);
      return this.getDefaultPredictions()
    }
  }

  static async analyzeHealthTrends(healthData) {
    const analysisId = `[TRENDS-${Date.now()}]`;
    console.log(`${analysisId} 📊 Analyzing health trends via minimax-m2:cloud...`);
    const startTime = Date.now();
    try {
      const systemPrompt = `Health trends AI. Return ONLY JSON:
{
  "trendAnalysis": {
    "vitals": {"direction": "improving|stable|declining", "confidence": "percentage", "factors": ["influencing factors"]},
    "symptoms": {"progression": "better|same|worse", "pattern": "pattern description", "triggers": ["identified triggers"]},
    "overall": {"health": "excellent|good|fair|poor", "trajectory": "upward|stable|downward", "outlook": "prognosis"}
  },
  "predictions": {
    "nextWeek": "expected changes in 1 week",
    "nextMonth": "projected status in 1 month",
    "riskEvents": [{"event": "potential complication", "probability": "likelihood", "timeframe": "when"}]
  },
  "recommendations": {
    "immediate": ["actions needed now"],
    "preventive": ["prevention strategies"],
    "optimization": ["health optimization tips"]
  }
}`

      const response = await this.callAPI(`Analyze health trends: ${JSON.stringify(healthData)}`, systemPrompt)

      const parsed = this.parseJSON(response);
      if (parsed) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`${analysisId} ✅ Health trends analyzed in ${elapsed}s`);
        return parsed;
      }
      console.warn(`${analysisId} ⚠️ Using fallback trends. ${FALLBACK_DISCLAIMER}`);
      return this.getDefaultTrends();
    } catch (error) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.error(`${analysisId} ❌ Health trends error after ${elapsed}s:`, error.message);
      console.warn(`${analysisId} ⚠️ Using fallback trends. ${FALLBACK_DISCLAIMER}`);
      return this.getDefaultTrends()
    }
  }

  static getDefaultDiagnosis() {
    console.warn('⚠️ FALLBACK DATA IN USE:', FALLBACK_DISCLAIMER);
    return {
      _isFallback: true,
      _fallbackDisclaimer: FALLBACK_DISCLAIMER,
      primaryDiagnosis: 'Requires clinical evaluation',
      confidence: 70,
      urgency: 'medium',
      differentialDiagnosis: [
        { condition: 'Viral infection', probability: '40%', reasoning: 'Common symptoms match' },
        { condition: 'Bacterial infection', probability: '30%', reasoning: 'Symptom severity' }
      ],
      symptoms: {
        reported: ['Fever', 'Fatigue'],
        associated: ['Headache', 'Body aches'],
        redFlags: ['Difficulty breathing', 'Chest pain']
      },
      investigations: [
        { test: 'Complete Blood Count', priority: 'high', reason: 'Check for infection markers' },
        { test: 'Chest X-ray', priority: 'medium', reason: 'Rule out pneumonia' }
      ],
      treatment: {
        immediate: ['Rest', 'Hydration', 'Fever management'],
        medications: [{ name: 'Paracetamol', dosage: '500mg', duration: '3 times daily' }],
        lifestyle: ['Adequate rest', 'Increase fluid intake']
      },
      followUp: {
        timeframe: '48-72 hours if no improvement',
        monitoring: ['Temperature', 'Breathing difficulty'],
        specialist: 'Internal Medicine if symptoms persist'
      },
      riskFactors: ['Age', 'Chronic conditions'],
      prognosis: 'Good with appropriate treatment'
    }
  }

  static getDefaultVitals() {
    console.warn('⚠️ FALLBACK DATA IN USE:', FALLBACK_DISCLAIMER);
    return {
      _isFallback: true,
      _fallbackDisclaimer: FALLBACK_DISCLAIMER,
      overallStatus: 'normal',
      alerts: [],
      vitalsAnalysis: {
        bloodPressure: { status: 'normal', risk: 'low', category: 'normal' },
        heartRate: { status: 'normal', concern: 'none', rhythm: 'regular' },
        temperature: { status: 'normal', action: 'continue monitoring' },
        oxygenSaturation: { status: 'normal', urgency: 'none' }
      },
      predictions: {
        riskFactors: ['No immediate risks identified'],
        complications: ['Low risk for complications'],
        timeline: 'Stable condition expected',
        monitoring: 'Regular vital checks recommended'
      },
      recommendations: {
        immediate: ['Continue current care'],
        monitoring: ['Regular vital signs'],
        lifestyle: ['Maintain healthy habits']
      }
    }
  }

  static getDefaultPredictions() {
    console.warn('⚠️ FALLBACK DATA IN USE:', FALLBACK_DISCLAIMER);
    return {
      _isFallback: true,
      _fallbackDisclaimer: FALLBACK_DISCLAIMER,
      riskAssessment: {
        cardiovascular: { risk: 'low', factors: ['No major risk factors'], timeline: 'Low risk in next 5 years' },
        diabetes: { risk: 'low', indicators: ['Normal glucose indicators'], prevention: ['Maintain healthy diet', 'Regular exercise'] },
        hypertension: { risk: 'low', progression: 'Stable blood pressure expected', management: ['Continue monitoring'] }
      },
      healthTrajectory: {
        shortTerm: 'Stable health expected in next 3 months',
        mediumTerm: 'Good health outlook for next year',
        longTerm: 'Positive long-term health prospects with current lifestyle'
      },
      interventions: {
        preventive: ['Regular health checkups', 'Maintain current lifestyle'],
        therapeutic: ['No immediate treatment needed'],
        lifestyle: ['Continue healthy habits', 'Regular exercise']
      },
      monitoring: {
        frequency: 'Monthly health checks recommended',
        parameters: ['Blood pressure', 'Weight', 'General wellness'],
        alerts: ['Sudden symptom changes', 'Persistent discomfort']
      }
    }
  }

  static getDefaultTrends() {
    console.warn('⚠️ FALLBACK DATA IN USE:', FALLBACK_DISCLAIMER);
    return {
      _isFallback: true,
      _fallbackDisclaimer: FALLBACK_DISCLAIMER,
      trendAnalysis: {
        vitals: { direction: 'stable', confidence: '85%', factors: ['Consistent readings'] },
        symptoms: { progression: 'stable', pattern: 'No concerning patterns', triggers: ['None identified'] },
        overall: { health: 'good', trajectory: 'stable', outlook: 'Positive' }
      },
      predictions: {
        nextWeek: 'Continued stable health expected',
        nextMonth: 'Maintaining current health status',
        riskEvents: [{ event: 'No significant risks identified', probability: 'Low', timeframe: 'Not applicable' }]
      },
      recommendations: {
        immediate: ['Continue current health practices'],
        preventive: ['Regular exercise', 'Balanced diet'],
        optimization: ['Stress management', 'Adequate sleep']
      }
    }
  }
}