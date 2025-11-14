"use client";

import * as React from "react";
import { View, Button, TextField, Card, Heading, Flex, Text, Badge, Divider } from "@aws-amplify/ui-react";
import { useAIGeneration } from '@/client';

interface Answer {
  question: string;
  answer: string;
}

interface AssessmentResult {
  status: string;
  qualificationScore: number;
  disqualifyingCount: number;
  answeredCount: number;
  totalRequired: number;
  metRequirements: string[];
  unmetRequirements: string[];
  unansweredRequirements: string[];
  recommendations: string[];
  reasoning: string;
}

export default function EligibilityPage() {
  const [criteria, setCriteria] = React.useState<string[]>([]);
  const [currentCriterion, setCurrentCriterion] = React.useState("");
  const [answers, setAnswers] = React.useState<Answer[]>([{ question: "", answer: "" }]);
  
  const [{ data, isLoading }, assessEligibility] = useAIGeneration("assessEligibility");

  const addCriterion = () => {
    if (currentCriterion.trim()) {
      setCriteria([...criteria, currentCriterion.trim()]);
      setCurrentCriterion("");
    }
  };

  const removeCriterion = (index: number) => {
    setCriteria(criteria.filter((_, i) => i !== index));
  };

  const addAnswer = () => {
    setAnswers([...answers, { question: "", answer: "" }]);
  };

  const removeAnswer = (index: number) => {
    setAnswers(answers.filter((_, i) => i !== index));
  };

  const updateAnswer = (index: number, field: 'question' | 'answer', value: string) => {
    const newAnswers = [...answers];
    newAnswers[index][field] = value;
    setAnswers(newAnswers);
  };

  const handleAssess = () => {
    // Convert answers array to JSON object
    const answersObject = answers.reduce((acc, { question, answer }) => {
      if (question.trim()) {
        acc[question.trim()] = answer;
      }
      return acc;
    }, {} as Record<string, string>);

    assessEligibility({
      requirements: criteria,
      answers: JSON.stringify(answersObject)
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'prequalified':
        return 'success';
      case 'may qualify':
        return 'info';
      case 'not qualified':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'info';
    }
  };

  const result = data as AssessmentResult | null;

  return (
    <View padding="medium" flex="1">
      <Heading level={2} marginBottom="medium">Eligibility Assessment</Heading>

      <Flex direction="row" gap="medium">
        {/* Left Column - Input Forms */}
        <View flex="1">
          {/* Eligibility Criteria Section */}
          <Card variation="outlined" marginBottom="medium" padding="small">
            <Heading level={4} marginBottom="small">Eligibility Criteria</Heading>
            
            <Flex direction="row" gap="xs" marginBottom="small">
              <TextField
                label="Add Criterion"
                value={currentCriterion}
                onChange={(e) => setCurrentCriterion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCriterion()}
                flex="1"
                size="small"
              />
              <Button onClick={addCriterion} marginTop="26px" size="small">Add</Button>
            </Flex>

            <View>
              {criteria.map((criterion, index) => (
                <Flex
                  key={index}
                  direction="row"
                  alignItems="center"
                  gap="xs"
                  padding="xs"
                  backgroundColor="var(--amplify-colors-background-secondary)"
                  marginBottom="xs"
                  borderRadius="small"
                >
                  <Text flex="1" fontSize="small">{criterion}</Text>
                  <Button size="small" variation="link" onClick={() => removeCriterion(index)}>
                    Remove
                  </Button>
                </Flex>
              ))}
              {criteria.length === 0 && (
                <Text color="font.tertiary" fontSize="small">No criteria added yet</Text>
              )}
            </View>
          </Card>

          {/* Questions & Answers Section */}
          <Card variation="outlined" marginBottom="medium" padding="small">
            <Heading level={4} marginBottom="small">Questions & Answers</Heading>
            
            {answers.map((answer, index) => (
              <Flex key={index} direction="column" gap="xs" marginBottom="small">
                <TextField
                  label="Question"
                  value={answer.question}
                  onChange={(e) => updateAnswer(index, 'question', e.target.value)}
                  placeholder="Enter question"
                  size="small"
                />
                <Flex direction="row" gap="xs" alignItems="flex-end">
                  <TextField
                    label="Answer"
                    value={answer.answer}
                    onChange={(e) => updateAnswer(index, 'answer', e.target.value)}
                    placeholder="Enter answer"
                    flex="1"
                    size="small"
                  />
                  {answers.length > 1 && (
                    <Button size="small" variation="link" onClick={() => removeAnswer(index)}>
                      Remove
                    </Button>
                  )}
                </Flex>
                {index < answers.length - 1 && <Divider marginTop="xs" />}
              </Flex>
            ))}

            <Button onClick={addAnswer} variation="link" size="small">
              + Add Another Q&A
            </Button>
          </Card>

          <Button
            onClick={handleAssess}
            isLoading={isLoading}
            isDisabled={criteria.length === 0 || isLoading}
            variation="primary"
            width="100%"
            size="small"
          >
            Assess Eligibility
          </Button>
        </View>

        {/* Right Column - Results */}
        <View flex="1">
          <Card variation="outlined" minHeight="400px" padding="small">
            <Heading level={4} marginBottom="small">Assessment Results</Heading>

            {isLoading && (
              <Text fontSize="small">Analyzing eligibility...</Text>
            )}

            {!isLoading && !result && (
              <Text color="font.tertiary" fontSize="small">
                Add criteria and answers, then click "Assess Eligibility" to see results
              </Text>
            )}

            {result && (
              <View>
                <Flex direction="row" alignItems="center" gap="small" marginBottom="medium">
                  <Badge size="small" variation={getStatusColor(result.status)}>
                    {result.status}
                  </Badge>
                  <Text fontSize="medium" fontWeight="bold">
                    Score: {result.qualificationScore}/100
                  </Text>
                </Flex>

                <View marginBottom="small">
                  <Heading level={6} marginBottom="xs">Summary</Heading>
                  <Text fontSize="small">{result.reasoning}</Text>
                </View>

                <Flex direction="row" gap="medium" marginBottom="small">
                  <View>
                    <Text fontSize="xs" color="font.tertiary">Answered</Text>
                    <Text fontSize="medium" fontWeight="bold">{result.answeredCount}/{result.totalRequired}</Text>
                  </View>
                  <View>
                    <Text fontSize="xs" color="font.tertiary">Disqualifying</Text>
                    <Text fontSize="medium" fontWeight="bold" color="red.60">{result.disqualifyingCount}</Text>
                  </View>
                </Flex>

                {result.metRequirements.length > 0 && (
                  <View marginBottom="small">
                    <Heading level={6} marginBottom="xs">✓ Met Requirements</Heading>
                    {result.metRequirements.map((req, idx) => (
                      <Text key={idx} fontSize="small" color="green.60" marginBottom="xxs">• {req}</Text>
                    ))}
                  </View>
                )}

                {result.unmetRequirements.length > 0 && (
                  <View marginBottom="small">
                    <Heading level={6} marginBottom="xs">✗ Unmet Requirements</Heading>
                    {result.unmetRequirements.map((req, idx) => (
                      <Text key={idx} fontSize="small" color="red.60" marginBottom="xxs">• {req}</Text>
                    ))}
                  </View>
                )}

                {result.unansweredRequirements.length > 0 && (
                  <View marginBottom="small">
                    <Heading level={6} marginBottom="xs">? Unanswered Requirements</Heading>
                    {result.unansweredRequirements.map((req, idx) => (
                      <Text key={idx} fontSize="small" color="orange.60" marginBottom="xxs">• {req}</Text>
                    ))}
                  </View>
                )}

                {result.recommendations.length > 0 && (
                  <View marginTop="small">
                    <Heading level={6} marginBottom="xs">Recommendations</Heading>
                    {result.recommendations.map((rec, idx) => (
                      <Card key={idx} variation="outlined" marginBottom="xs" padding="xs">
                        <Text fontSize="small">{rec}</Text>
                      </Card>
                    ))}
                  </View>
                )}
              </View>
            )}
          </Card>
        </View>
      </Flex>
    </View>
  );
}
