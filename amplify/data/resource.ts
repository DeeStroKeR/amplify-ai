import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  chat: a.conversation({
    aiModel: {
      resourcePath: 'us.anthropic.claude-sonnet-4-5-20250929-v1:0',
    },
    systemPrompt: `You are a helpful assistant`,
  })
    .authorization((allow) => allow.owner()),

  chatNamer: a.generation({
    aiModel: {
      resourcePath: 'us.anthropic.claude-haiku-4-5-20251001-v1:0',
    },
    systemPrompt: 'Generate a short, descriptive title (3-5 words) for a chat conversation based on the first message. Return only the title, nothing else.',
  })
    .arguments({
      content: a.string(),
    })
    .returns(
      a.customType({
        name: a.string(),
      })
    )
    .authorization((allow) => allow.authenticated()),
    
  // generateRecipe: a.generation({
  //   aiModel: a.ai.model('Claude 3 Haiku'),
  //   systemPrompt: 'You are a helpful assistant that generates recipes.',
  // })
  // .arguments({
  //   description: a.string(),
  // })
  // .returns(
  //   a.customType({
  //     name: a.string(),
  //     ingredients: a.string().array(),
  //     instructions: a.string(),
  //   })
  // )
  // .authorization((allow) => allow.authenticated()),
  assessEligibility: a.generation({
    aiModel: {
      resourcePath: 'us.anthropic.claude-haiku-4-5-20251001-v1:0',
    },
     systemPrompt: 'You are an eligibility assessment system. Analyze the provided requirements and user answers to determine qualification status.\n\nQUALIFICATION STATUS RULES:\n1. Prequalified - All required questions answered correctly/requirements met\n2. May Qualify - All answered questions are correct, but 1+ questions remain unanswered (no disqualifying answers)\n3. Not Qualified - 1 disqualifying answer - suggest changes to qualify\n4. Rejected - 2+ disqualifying answers OR user confirmed disqualifying answer\n\nRESPONSE FORMAT (JSON ONLY):\n{\n  status: one of Prequalified, May Qualify, Not Qualified, Rejected\n  qualificationScore: 0-100\n  disqualifyingCount: number\n  answeredCount: number\n  totalRequired: number\n  metRequirements: array of strings\n  unmetRequirements: array of strings\n  unansweredRequirements: array of strings\n  recommendations: array of strings\n  reasoning: Brief explanation of the status\n}\n\nAnalyze carefully:\n- Check if each requirement is met based on the answers\n- Count disqualifying answers\n- Identify missing answers\n- Provide actionable recommendations',
  })
    .arguments({
      requirements: a.string().array(),
      answers: a.json()
    })
    .returns(
      a.customType({
        status: a.string(),
        qualificationScore: a.integer(),
        disqualifyingCount: a.integer(),
        answeredCount: a.integer(),
        totalRequired: a.integer(),
        metRequirements: a.string().array(),
        unmetRequirements: a.string().array(),
        unansweredRequirements: a.string().array(),
        recommendations: a.string().array(),
        reasoning: a.string(),
      })
    )
    .authorization(allow => allow.authenticated()),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});

//Invocation of model ID anthropic.claude-3-7-sonnet-20250219-v1:0 with on-demand throughput isn’t supported. Retry your request with the ID or ARN of an inference profile that contains this model.
//3.5 + 