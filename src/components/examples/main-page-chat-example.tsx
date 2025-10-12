/**
 * Example component showing how to integrate chat navigation from main page
 * This can be used in any component on the main page
 */

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  navigateToAgentTool,
  startNewChatWithMessage,
} from "@/lib/chat-navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function MainPageChatExample() {
  const router = useRouter();
  const [userInput, setUserInput] = useState("");

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    // Navigate to agent with the message
    const url = startNewChatWithMessage(userInput);
    router.push(url);
  };

  const handleQuickAction = (message: string, tool?: string) => {
    if (tool) {
      const url = navigateToAgentTool(tool, message);
      router.push(url);
    } else {
      const url = startNewChatWithMessage(message);
      router.push(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main chat input */}
      <div className="flex gap-2">
        <Input
          value={userInput}
          onChange={e => setUserInput(e.target.value)}
          placeholder="Ask your legal question..."
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button onClick={handleSendMessage} disabled={!userInput.trim()}>
          Ask AI
        </Button>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          onClick={() =>
            handleQuickAction("I need help analyzing a contract", "redflag")
          }
        >
          📄 Analyze Contract
        </Button>

        <Button
          variant="outline"
          onClick={() =>
            handleQuickAction("I need to create a legal document", "template")
          }
        >
          📝 Create Document
        </Button>

        <Button
          variant="outline"
          onClick={() => handleQuickAction("I need to find a lawyer")}
        >
          ⚖️ Find Lawyer
        </Button>

        <Button
          variant="outline"
          onClick={() =>
            handleQuickAction(
              "I need help with litigation funding",
              "funding-litigants"
            )
          }
        >
          💰 Get Funding
        </Button>
      </div>

      {/* Example usage in code */}
      <div className="rounded bg-gray-50 p-4 text-xs text-gray-500">
        <p className="mb-2 font-semibold">Usage Examples:</p>
        <code className="block">
          {`// From any component:
import { startNewChatWithMessage } from "@/lib/chat-navigation";
import { useRouter } from "next/navigation";

const router = useRouter();

// Send user to agent with message
const url = startNewChatWithMessage("My question here");
router.push(url);

// Send user to agent with message and specific tool
const url = navigateToAgentTool("redflag", "Analyze this contract");
router.push(url);`}
        </code>
      </div>
    </div>
  );
}
