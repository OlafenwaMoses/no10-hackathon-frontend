import { GTT_LEVERS, GTT_LEVER_LABELS, type InterviewQuestionType, type TalentCategory } from "../types";

export const INTERVIEW_QUESTION_KEYS = [
  "relocate_self",
  "expand_uk",
  "uk_attractiveness",
  "top_lever",
  "biggest_barrier",
  "gut_reaction",
] as const;
export type InterviewQuestionKey = (typeof INTERVIEW_QUESTION_KEYS)[number];

export type InterviewQuestion = {
  key: InterviewQuestionKey;
  type: InterviewQuestionType;
  question: string;
  options: string[];
};

const LIKELIHOOD = ["Very unlikely", "Unlikely", "Neither likely nor unlikely", "Likely", "Very likely"];

const EXPAND_UK: Record<TalentCategory, string> = {
  founder: "How likely are you to open, or significantly grow, a UK office or headquarters and hire there within the next two years?",
  c_suite: "How likely are you to open, or significantly grow, a UK office or headquarters for your organisation and hire there within the next two years?",
  investor: "How likely are you to invest in UK companies, or set up a UK presence for your investing, within the next two years?",
  hnwi: "How likely are you to invest in UK companies, or set up a UK presence for your investments or family office, within the next two years?",
  researcher: "How likely would you be to take a position at a UK institution, or move your research group there, within the next two years?",
  highly_talented: "How likely would you be to take a role with a UK-based organisation within the next two years?",
};

export function buildInterviewQuestions(category: TalentCategory): InterviewQuestion[] {
  return [
    {
      key: "relocate_self",
      type: "scale",
      question:
        category === "researcher"
          ? "If the right opportunity came up, how open would you be to relocating yourself, and your research, to the UK within the next two years?"
          : "If the right opportunity came up, how open would you be to relocating yourself to the UK within the next two years?",
      options: ["Not at all open", "Slightly open", "Moderately open", "Very open", "Extremely open"],
    },
    { key: "expand_uk", type: "scale", question: EXPAND_UK[category], options: LIKELIHOOD },
    {
      key: "uk_attractiveness",
      type: "scale",
      question: "Compared with where you're based now, how attractive is the UK as a place to do your work?",
      options: [
        "Much less attractive",
        "Somewhat less attractive",
        "About the same",
        "Somewhat more attractive",
        "Much more attractive",
      ],
    },
    {
      key: "top_lever",
      type: "choice",
      question: "Which of these would most increase the chance you'd move to, or expand in, the UK?",
      options: GTT_LEVERS.map((lever) => GTT_LEVER_LABELS[lever]),
    },
    {
      key: "biggest_barrier",
      type: "open",
      question: "What's the single biggest thing holding you back from moving to or expanding in the UK?",
      options: [],
    },
    {
      key: "gut_reaction",
      type: "open",
      question: "What's your gut reaction when you think about the UK as a place to live and build your work?",
      options: [],
    },
  ];
}
