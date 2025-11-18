import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  chat: a.conversation({
    aiModel: a.ai.model("Claude 3.5 Sonnet"),
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
      // resourcePath: 'us.anthropic.claude-haiku-4-5-20251001-v1:0',
      // resourcePath: 'us.anthropic.claude-sonnet-4-5-20250929-v1:0'
      resourcePath: 'us.anthropic.claude-sonnet-4-5-20250929-v1:0'
    },
     systemPrompt: 'You are an eligibility assessment system for grant applications.\n\nTASK:\n1. Review the Eligibility Criteria provided\n2. Examine the applicant form to identify questions related to eligibility\n3. Evaluate the applicant answers against each criterion\n4. Determine qualification status using the decision tree below\n\nDECISION TREE FOR STATUS:\nStep 1: Check for disqualifying answers\n- If any answer contradicts or fails to meet eligibility criteria then status is Not Qualified\n\nStep 2: If no disqualifying answers, check completion\n- If all eligibility questions are answered AND all criteria are met then status is Prequalified\n- If some eligibility questions are unanswered OR blank OR missing then status is May Qualify\n\nIMPORTANT: An unanswered or blank question is NOT the same as a disqualifying answer. Missing information means May Qualify, wrong information means Not Qualified.\n\nRESPONSE REQUIREMENTS:\n- Return ONLY valid JSON matching the defined schema structure\n- Use double quotes for all strings\n- Do not include markdown formatting or code blocks\n- Status must be exactly one of these three values: Prequalified or May Qualify or Not Qualified\n\nANALYSIS GUIDELINES:\n- Match form questions to eligibility criteria by content and intent\n- Treat empty strings, null values, or missing answers as unanswered not disqualifying\n- Only mark as disqualifying if the answer actively contradicts a requirement\n- For May Qualify status explain what questions need to be answered\n- For Not Qualified status explain which answers are disqualifying and why\n- Provide specific actionable recommendations based on the status',
})
    .arguments({
      requirements: a.string().array(),
      answers: a.json()
    })
    .returns(
      a.customType({
      status: a.string(),
      eligibilityQuestionCount: a.integer(),
      answeredCount: a.integer(),
      unansweredCount: a.integer(),
      criteriaMetCount: a.integer(),
      criteriaMetList: a.string().array(),
      criteriaNotMetCount: a.integer(),
      criteriaNotMetList: a.string().array(),
      disqualifyingAnswersCount: a.integer(),
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
