"use client";
import * as React from "react";
import { Flex, ScrollView } from "@aws-amplify/ui-react";
import { ConversationsContext } from "@/providers/ConversationsProvider";
import { ConversationItem } from "./ConversationItem";

export const Sidebar = ({ children }: React.PropsWithChildren) => {
  const { conversations } = React.useContext(ConversationsContext);

  return (
    <Flex direction="column" width="500px" height="100%">
      <ScrollView flex="1">
        <Flex direction="column" padding="medium">
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
            />
          ))}
        </Flex>
      </ScrollView>
      <Flex direction="row" padding="large">
        {children}
      </Flex>
    </Flex>
  );
};
