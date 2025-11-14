"use client";

import * as React from "react";
import { View, Heading, Card, Flex, Text, Button } from "@aws-amplify/ui-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <View padding="xxl" flex="1">
      <Flex direction="column" alignItems="center" justifyContent="center" minHeight="60vh">
        <Heading level={1} marginBottom="xl">Welcome to Amplify AI</Heading>
        <Text marginBottom="xxl" fontSize="large" textAlign="center">
          Choose how you'd like to get started
        </Text>

        <Flex direction="row" gap="large" wrap="wrap" justifyContent="center">
          <Card
            variation="outlined"
            padding="large"
            onClick={() => router.push('/chat')}
            style={{ cursor: 'pointer', minWidth: '280px' }}
          >
            <Heading level={3} marginBottom="medium">💬 Chat</Heading>
            <Text marginBottom="medium">
              Start a conversation with our AI assistant. Get help, ask questions, and explore ideas.
            </Text>
            <Button variation="primary" width="100%">
              Go to Chat
            </Button>
          </Card>

          <Card
            variation="outlined"
            padding="large"
            onClick={() => router.push('/eligibility')}
            style={{ cursor: 'pointer', minWidth: '280px' }}
          >
            <Heading level={3} marginBottom="medium">✓ Eligibility Assessment</Heading>
            <Text marginBottom="medium">
              Check qualification status by analyzing requirements and answers with AI.
            </Text>
            <Button variation="primary" width="100%">
              Go to Eligibility
            </Button>
          </Card>
        </Flex>
      </Flex>
    </View>
  );
}
