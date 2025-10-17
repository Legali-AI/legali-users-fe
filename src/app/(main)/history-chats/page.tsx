"use client";

import { H1 } from "@/components/elements/typography";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useAuthStatus } from "@/hooks/use-auth-status";
import { useChatHistory } from "@/hooks/use-chat-queries";
import { ArrowRight, Clock, MessageSquare, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export default function HistoryChatsPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuthStatus();
  const router = useRouter();
  const { data: chatHistory = [], isLoading, error, refetch } = useChatHistory();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // 8 items per page for 2x4 grid

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, authLoading, router]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="size-8 animate-spin rounded-full border-2 border-sky-blue-200 border-t-sky-blue-600" />
          <p className="text-slate-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Pagination logic
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return chatHistory.slice(startIndex, endIndex);
  }, [chatHistory, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(chatHistory.length / itemsPerPage);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isLoading) {
    return (
      <main
        className="flex w-full flex-col items-center justify-center bg-sky-blue-200 px-8 py-40 sm:px-10 md:px-16 lg:px-32"
        aria-label="History chats page">
        {/* Background decorations */}
        {/* Bottom Left */}
        <div
          className="absolute -bottom-[100px] -left-[200px] -z-20 aspect-[3/2] w-[700px] rotate-45 pointer-events-none"
          style={{
            borderRadius: "686.309px",
            background: "linear-gradient(90deg, #E5F8FF 0%, #9BDBF3 100%)",
            filter: "blur(43.400001525878906px)",
          }}
        />
        {/* Bottom Right */}
        <div
          className="absolute -right-[200px] -bottom-[100px] -z-20 aspect-[3/2] w-[700px] rotate-45 pointer-events-none"
          style={{
            borderRadius: "686.309px",
            background: "linear-gradient(90deg, #E5F8FF 0%, #9BDBF3 100%)",
            filter: "blur(43.400001525878906px)",
          }}
        />

        {/* Loading spinner */}
        <div className="flex flex-col items-center justify-center space-y-4" data-aos="zoom-in" data-aos-duration="600">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-sky-blue-200 border-t-sky-blue-600"></div>
          <H1 weight={"semibold"}>Loading History Chats...</H1>
          <p className="text-gray-600">Please wait while we fetch your chat history</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main
        className="flex w-full flex-col items-center justify-center bg-sky-blue-200 px-8 py-40 sm:px-10 md:px-16 lg:px-32"
        aria-label="History chats page">
        {/* Background decorations */}
        {/* Bottom Left */}
        <div
          className="absolute -bottom-[100px] -left-[200px] -z-20 aspect-[3/2] w-[700px] rotate-45 pointer-events-none"
          style={{
            borderRadius: "686.309px",
            background: "linear-gradient(90deg, #E5F8FF 0%, #9BDBF3 100%)",
            filter: "blur(43.400001525878906px)",
          }}
        />
        {/* Bottom Right */}
        <div
          className="absolute -right-[200px] -bottom-[100px] -z-20 aspect-[3/2] w-[700px] rotate-45 pointer-events-none"
          style={{
            borderRadius: "686.309px",
            background: "linear-gradient(90deg, #E5F8FF 0%, #9BDBF3 100%)",
            filter: "blur(43.400001525878906px)",
          }}
        />

        {/* Page header */}
        <div data-aos="zoom-in" data-aos-duration="600">
          <H1 weight={"semibold"}>History Chats</H1>
        </div>

        {/* Error card */}
        <div
          className="mt-6 w-full max-w-2xl"
          data-aos="slide-up"
          data-aos-duration="600"
          data-aos-delay="100">
          <Card>
            <CardContent className="p-6 text-center">
              <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to load chats</h3>
              <p className="text-gray-600 mb-4">Please try again or contact support if the problem persists.</p>
              <Button onClick={() => refetch()} className="bg-sky-600 hover:bg-sky-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-6 py-3">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (!chatHistory || chatHistory.length === 0) {
    return (
      <main
        className="flex w-full flex-col items-center justify-center bg-sky-blue-200 px-8 py-40 sm:px-10 md:px-16 lg:px-32"
        aria-label="History chats page">
        {/* Background decorations */}
        {/* Bottom Left */}
        <div
          className="absolute -bottom-[100px] -left-[200px] -z-20 aspect-[3/2] w-[700px] rotate-45 pointer-events-none"
          style={{
            borderRadius: "686.309px",
            background: "linear-gradient(90deg, #E5F8FF 0%, #9BDBF3 100%)",
            filter: "blur(43.400001525878906px)",
          }}
        />
        {/* Bottom Right */}
        <div
          className="absolute -right-[200px] -bottom-[100px] -z-20 aspect-[3/2] w-[700px] rotate-45 pointer-events-none"
          style={{
            borderRadius: "686.309px",
            background: "linear-gradient(90deg, #E5F8FF 0%, #9BDBF3 100%)",
            filter: "blur(43.400001525878906px)",
          }}
        />

        {/* Page header */}
        <div data-aos="zoom-in" data-aos-duration="600">
          <H1 weight={"semibold"}>History Chats</H1>
        </div>

        {/* Empty state card */}
        <div
          className="mt-6 w-full max-w-2xl"
          data-aos="slide-up"
          data-aos-duration="600"
          data-aos-delay="100">
          <Card>
            <CardContent className="p-6 text-center">
              <MessageSquare className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No chats found</h3>
              <p className="text-gray-600 mb-4">Start a conversation with our AI Legal Confidant to see your chat history here.</p>
              <Button asChild className="bg-sky-600 hover:bg-sky-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-6 py-3">
                <Link href="/agent">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Start New Chat
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main
      className="flex w-full flex-col items-center justify-center bg-sky-blue-200 px-8 py-40 sm:px-10 md:px-16 lg:px-32"
      aria-label="History chats page">
      {/* Background decorations */}
      {/* Bottom Left */}
      <div
        className="absolute -bottom-[100px] -left-[200px] -z-10 aspect-[3/2] w-[700px] rotate-45"
        style={{
          borderRadius: "686.309px",
          background: "linear-gradient(90deg, #E5F8FF 0%, #9BDBF3 100%)",
          filter: "blur(43.400001525878906px)",
        }}
      />
      {/* Bottom Right */}
      <div
        className="absolute -right-[200px] -bottom-[100px] -z-10 aspect-[3/2] w-[700px] rotate-45"
        style={{
          borderRadius: "686.309px",
          background: "linear-gradient(90deg, #E5F8FF 0%, #9BDBF3 100%)",
          filter: "blur(43.400001525878906px)",
        }}
      />

      {/* Page header */}
      <div data-aos="zoom-in" data-aos-duration="600">
        <H1 weight={"semibold"}>History Chats</H1>
      </div>

      {/* Chat history cards grid */}
      <div
        className="mt-6 grid w-full max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:mt-8 md:gap-8 xl:mt-10 xl:gap-10"
        data-aos="slide-up"
        data-aos-duration="600"
        data-aos-delay="100">
        {paginatedData.map((chat, index) => (
          <div key={chat.id} data-aos="zoom-in-up" data-aos-duration="600" data-aos-delay={200 + index * 100}>
            <Card className="hover:shadow-md transition-shadow h-48">
              <CardContent className="p-6 h-full">
                <div className="flex flex-col h-full">
                  {/* Header with icon and info */}
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-sky-100 flex items-center justify-center">
                        <MessageSquare className="h-6 w-6 text-sky-600" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        {chat.session_name || "Untitled Chat"}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <p className="text-sm text-gray-500">{formatDate(chat.created_at)}</p>
                      </div>
                      {chat.summary && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{chat.summary}</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Button at right-bottom */}
                  <div className="flex justify-end mt-4">
                    <Button asChild className="bg-sky-600 hover:bg-sky-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-4 py-2">
                      <Link href={`/agent?chat_id=${chat.id}&from=history`}>
                        Continue Chat
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8" data-aos="fade-up" data-aos-duration="600" data-aos-delay="300">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      setCurrentPage(currentPage - 1);
                    }
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(page);
                    }}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) {
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Start new chat button */}
      <div className="mt-8 text-center" data-aos="fade-up" data-aos-duration="600" data-aos-delay="300">
        <Button asChild className="bg-sky-600 hover:bg-sky-700 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 rounded-lg px-6 py-3 text-base">
          <Link href="/agent">
            <MessageSquare className="mr-2 h-5 w-5" />
            Start New Chat
          </Link>
        </Button>
      </div>
    </main>
  );
}

