import type { NextApiRequest, NextApiResponse } from 'next';

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY!;
const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

const GENERIC_PLAN = {
  keyTopics: [
    "General Concepts",
    "Practice Problems",
    "Review Notes",
    "Important Formulas",
    "Exam Strategies",
    "Time Management"
  ],
  dailySchedule: [
    {
      day: "Day 1",
      topics: ["General Concepts", "Practice Problems"],
      timeAllocation: "2 hours",
      focusAreas: ["Review", "Practice"]
    },
    {
      day: "Day 2",
      topics: ["Review Notes", "Important Formulas"],
      timeAllocation: "2 hours",
      focusAreas: ["Memorization", "Application"]
    },
    {
      day: "Day 3",
      topics: ["Exam Strategies", "Time Management"],
      timeAllocation: "1.5 hours",
      focusAreas: ["Planning", "Mock Tests"]
    }
  ],
  weeklyGoals: [
    "Study every day",
    "Practice problems",
    "Review notes",
    "Take mock tests",
    "Clarify doubts"
  ],
  examStrategy: [
    "Stay calm",
    "Manage time",
    "Review answers",
    "Attempt easy questions first",
    "Don't leave blanks"
  ]
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { examDate, subject } = req.body;

  try {
    const prompt = `
You are an expert study planner. Create a JSON study plan for a student with an exam in "${subject}" on "${examDate}". 
Include:
- keyTopics: 6-8 main topics
- dailySchedule: 7 days, each with day, topics (3-4), timeAllocation, focusAreas
- weeklyGoals: 5-7 goals
- examStrategy: 5-7 tips
Format as JSON with keys: keyTopics, dailySchedule, weeklyGoals, examStrategy.
    `;

    const perplexityRes = await fetch(PERPLEXITY_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'sonar',
        messages: [
          { role: 'system', content: 'You are an expert study planner.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 2048,
      }),
    });

    if (!perplexityRes.ok) {
      const errorText = await perplexityRes.text();
      console.error('Perplexity API error:', errorText);
      throw new Error('Perplexity API error: ' + errorText);
    }

    const perplexityData = await perplexityRes.json();
    const text = perplexityData.choices?.[0]?.message?.content || '';

    // Try to extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const studyPlan = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (!studyPlan) throw new Error('Failed to parse study plan');

    return res.status(200).json(studyPlan);
  } catch (err: any) {
    console.error('Perplexity error:', err);
    return res.status(200).json(GENERIC_PLAN);
  }
} 