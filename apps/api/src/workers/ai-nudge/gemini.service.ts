import { Injectable, Logger } from '@nestjs/common';
import { TriggerType } from '@prisma/client';

interface InsightInput {
  userName:                string;
  identityStatement:       string | null;
  triggerType:             TriggerType;
  topHabit:                string;
  keystoneHabit:           string | null;
  currentStreak:           number;
  longestStreak:           number;
  completionRateLast7Days: number;
  isEligible:              boolean;
}

interface InsightContent {
  headline: string;
  message:  string;
  cta:      string;
}

@Injectable()
export class GeminiService {
  private readonly logger  = new Logger(GeminiService.name);
  private readonly apiKey  = process.env.GEMINI_API_KEY;
  private readonly apiUrl  = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

  async generateInsight(input: InsightInput): Promise<InsightContent> {
    try {
      const prompt = this.buildPrompt(input);

      const response = await fetch(`${this.apiUrl}?key=${this.apiKey}`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents:         [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 300 },
        }),
      });

      if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);

      const data      = await response.json();
      const rawText   = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
      const clean     = rawText.replace(/```json|```/g, '').trim();
      const parsed    = JSON.parse(clean);

      return {
        headline: String(parsed.headline ?? '').slice(0, 120),
        message:  String(parsed.message  ?? '').slice(0, 400),
        cta:      String(parsed.cta      ?? '').slice(0, 80),
      };
    } catch (err) {
      this.logger.warn(`Gemini generation failed — using fallback. Error: ${err.message}`);
      return this.fallback(input);
    }
  }

  private buildPrompt(input: InsightInput): string {
    const identityLine = input.identityStatement
      ? `The user's identity statement is: "${input.identityStatement}".`
      : '';
    const keystoneLine = input.keystoneHabit
      ? `Their keystone habit is "${input.keystoneHabit}".`
      : '';

    // Pre-eligibility: educational nudge only — no personal data referenced
    if (!input.isEligible) {
      return `
You are RIO, a behavioral coaching AI. The user is new and hasn't built enough history for personalized insights yet.

Write a short, warm educational nudge to encourage them to keep going.
Focus on: why small daily habits matter, identity-based motivation, or the science of habit formation.
Do NOT mention their specific habits or streaks.
Tone: encouraging, warm, clear.

Respond ONLY with a JSON object (no markdown, no preamble):
{ "headline": "max 10 words", "message": "max 50 words — educational tip", "cta": "max 4 words" }
      `.trim();
    }

    return `
You are RIO, a behavioral coaching AI that focuses on identity-reinforcement and system-building.
${identityLine}
${keystoneLine}

User: ${input.userName}
Trigger: ${input.triggerType}
Top habit: "${input.topHabit}"
Current streak: ${input.currentStreak} days
Longest streak: ${input.longestStreak} days
7-day completion rate: ${input.completionRateLast7Days}%

Trigger context:
- two_day_risk: User is about to miss two days in a row — urgently prevent the pattern
- streak_risk: User has an active streak but missed yesterday — nudge to protect it today
- streak_recovery: Streak just reset — help them reframe as a restart not a failure
- completion_dropoff: Completion rate dropped below 50% — identify the friction
- pillar_imbalance: One life area has zero completions this week — flag the blind spot
- momentum: User is on a strong run (5+ days) — celebrate and reinforce identity
- weekly_reflection: End of week — prompt a brief honest reflection
- fallback: General encouragement aligned with identity

Rules:
- Reference their identity statement if available — reinforce WHO they are becoming
- Prioritize the keystone habit if relevant
- Be a coach, not a cheerleader — honest, specific, behavioral
- Max 2 sentences in message. No clichés.

Respond ONLY with a JSON object (no markdown, no preamble):
{ "headline": "max 10 words", "message": "max 50 words", "cta": "max 4 words" }
    `.trim();
  }

  private fallback(input: InsightInput): InsightContent {
    const map: Record<TriggerType, InsightContent> = {
      two_day_risk:       { headline: "Don't break the chain twice", message: `Two consecutive misses is the pattern that ends streaks. Check in for "${input.topHabit}" today — one minute counts.`, cta: 'Check In Now' },
      streak_risk:        { headline: 'Your streak needs you today', message: `You've built ${input.currentStreak} days on "${input.topHabit}". Yesterday slipped — don't let today follow.`, cta: 'Protect My Streak' },
      streak_recovery:    { headline: 'Streaks reset, systems don\'t', message: `A reset is just a restart. The identity you're building — that didn't reset. Begin again today.`, cta: 'Start Again' },
      completion_dropoff: { headline: 'Your completion rate dropped', message: `Only ${input.completionRateLast7Days}% last week. Something created friction — identify it and remove one obstacle today.`, cta: 'Review My Habits' },
      pillar_imbalance:   { headline: 'One area of your life is silent', message: `Balanced growth requires attention across pillars. One of yours had no activity this week.`, cta: 'Balance My Pillars' },
      momentum:           { headline: `${input.currentStreak} days and building`, message: `"${input.topHabit}" is becoming who you are. This streak is evidence, not luck.`, cta: 'Keep Going' },
      weekly_reflection:  { headline: 'How did this week serve you?', message: `Take 60 seconds to reflect on what worked and what to adjust. That's what systems are for.`, cta: 'Review My Week' },
      educational:        { headline: 'Every check-in is a vote', message: `Each time you complete a habit, you cast a vote for the person you\'re becoming. Small actions compound.`, cta: 'Check In Today' },
      fallback:           { headline: 'Your system is waiting', message: `Consistency over intensity. Show up for "${input.topHabit}" today and let the system do its work.`, cta: 'Let\'s Go' },
    };
    return map[input.triggerType] ?? map.fallback;
  }
}