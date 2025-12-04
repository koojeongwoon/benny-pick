# Feature Specification: 복지집사 (Benefit Chat) MVP

**Feature Branch**: `001-benefit-chat-mvp`  
**Created**: 2025-12-03  
**Status**: Draft  
**Input**: User description: "AI-powered welfare benefit chat for mobile web, matching users to benefits with a conversational UI."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Personalized Benefit Lookup (Priority: P1)

A job-seeking user (김민수) wants to quickly find out if they are eligible for any welfare benefits, specifically focusing on monthly rent support, by having a natural language conversation with an AI assistant, without having to read complex government announcements.

**Why this priority**: This is the core value proposition of the service and directly addresses the primary target persona's pain point. It delivers immediate, tangible value by identifying potential financial aid.

**Independent Test**: The user can initiate a conversation, provide their basic information (age, residency, job status), receive a specific benefit match with an estimated amount, and be provided with a direct link to apply. This can be fully tested by simulating a chat interaction and verifying the returned policy and amount against known conditions.

**Acceptance Scenarios**:

1.  **Given** the user is on the landing page, **When** they click "내 숨은 돈 조회하기" (Find My Hidden Money), **Then** they are presented with the chat interface to begin a conversation.
2.  **Given** the user is in the chat interface, **When** they provide information like "나 용인 사는 28살 백수인데 월세 지원돼?", **Then** the AI assistant extracts key variables (age, region, job status) and asks clarifying questions if necessary (e.g., "혹시 세대주로 분리되어 혼자 사시나요?").
3.  **Given** the AI has sufficient information, **When** it matches the user's profile to an eligible welfare policy, **Then** it presents a congratulatory message, states the specific policy name, and the estimated monthly benefit amount (e.g., "축하합니다! 청년월세 특별지원 대상이에요. 매달 20만 원씩 받을 수 있어요.").
4.  **Given** a benefit is matched and displayed, **When** the user views the result, **Then** a clear "[신청하러 가기]" (Go to Application) link is provided for the matched policy.
5.  **Given** no benefit is matched, **When** the AI completes the check, **Then** a polite message indicating no immediate matches is displayed.

---

### User Story 2 - Overview of Matched Benefits (Priority: P2)

A user who has completed the benefit lookup conversation wants to see a consolidated report of all matched policies in an easy-to-understand card-based UI, including the total estimated amount they could receive.

**Why this priority**: This story enhances the value of the primary lookup by providing a clear, summarized view, making it easier for the user to understand their overall potential benefits. It contributes to user satisfaction and clarity post-lookup.

**Independent Test**: After successfully matching one or more policies, the system displays a carousel of distinct policy cards and a sum of all potential benefits. This can be tested by verifying the display of cards and the accuracy of the total amount based on the matched policies.

**Acceptance Scenarios**:

1.  **Given** the user has matched one or more policies, **When** they reach the results page, **Then** a horizontal scrolling carousel of individual policy cards is displayed.
2.  **Given** policy cards are displayed, **When** the user views the cards, **Then** each card includes a relevant emoji, the policy title, the estimated amount, and a short description (e.g., "청년월세 특별지원", "월 20만 원", "12개월간 현금으로 꽂아드려요.").
3.  **Given** multiple policies are matched, **When** the user views the results, **Then** a clear indication of the total estimated benefit amount across all matched policies is displayed.

---

### User Story 3 - Transparent Usage Disclaimer (Priority: P3)

A user interacting with the service needs to be clearly informed that the benefit matching results are simulated and do not hold legal authority, ensuring transparency and managing expectations.

**Why this priority**: This addresses legal and ethical considerations, preventing misunderstandings about the service's limitations. While not core functionality, it's important for trust and compliance.

**Independent Test**: The presence and clear visibility of the disclaimer on relevant pages (e.g., results page, chat interface) can be verified.

**Acceptance Scenarios**:

1.  **Given** the user is viewing the chat interface or the results page, **When** they interact with the application, **Then** a prominent footer displays the disclaimer: "법적 효력이 없는 모의 계산 결과임" (Simulated calculation results with no legal effect).

## Edge Cases

-   **No Matching Policies**: How the system gracefully handles scenarios where no benefits match the user's criteria.
-   **Incomplete User Input**: How the AI handles vague or insufficient information from the user, prompting for more details.
-   **Invalid or Unrecognized Input**: What happens if the user provides information the AI cannot parse (e.g., non-sensical text).
-   **Policy Data Updates**: How changes or additions to welfare policies are incorporated into the system without manual code changes.
-   **Rate Limit Exceeded**: How the system responds when an API call (especially to AI Workers) hits a rate limit, preventing service disruption or excessive cost.

## Assumptions

-   The system operates within the Cloudflare ecosystem, leveraging Cloudflare Pages for frontend hosting and Cloudflare Workers for backend logic.
-   A mechanism for populating and updating the welfare policy database is outside the scope of this MVP.
-   User authentication/login is not required for the MVP; the `/api/chat` endpoint will be publicly accessible with rate limiting as the primary defense against abuse.
-   The AI model used for intent parsing and response generation is capable of understanding Korean natural language with reasonable accuracy.

## Requirements *(mandatory)*

### Functional Requirements

-   **FR-001 (Hybrid Chat UI)**: The system MUST provide a hybrid chat user interface that supports both natural language text input and quick reply (multiple-choice button) options simultaneously. Typing animations MUST be applied for bot responses to enhance user experience.
-   **FR-002 (AI Intent Parsing)**: The system MUST utilize an AI service to parse user utterances, extracting key variables such as [age, residency, job status], and converting them into a structured JSON format.
-   **FR-003 (Policy Matching Engine)**: The system MUST filter and match eligible welfare policies from a database solution by comparing parsed user variables against defined policy conditions.
-   **FR-004 (AI Response Generation - RAG)**: The system MUST generate empathetic and informative natural language responses based on matched policy data, using Retrieval-Augmented Generation (RAG) via an AI service. Responses MUST accurately reflect policy names and amounts without fabrication.
-   **FR-005 (Results Report)**: The system MUST display matched policies as a list of card-style UI elements and show the aggregated sum of estimated benefit amounts.
-   **FR-006 (Disclaimer)**: The system MUST prominently display a footer stating, "법적 효력이 없는 모의 계산 결과임" (Simulated calculation results with no legal effect).
-   **FR-007 (API Endpoint)**: The system MUST expose a POST `/api/chat` API endpoint that accepts user messages and chat history, processes them through intent parsing, policy matching, and response generation, and returns a structured JSON response including parsed intent, policy data, and the AI-generated reply text.
-   **FR-008 (External System Integration)**: The system MUST integrate with an AI service for both intent parsing and response generation, utilizing a specific AI model.
-   **FR-009 (Data Storage)**: The system MUST store welfare policy data in a database solution using a `policies` table with fields for `title`, `category`, `age_min`, `age_max`, `region_si`, `region_gu`, `job_status`, `conditions` (JSON), `benefit_summary`, and `apply_url`.

### Key Entities *(include if feature involves data)*

-   **Policy**: Represents a welfare benefit program. Key attributes include title, category, eligibility criteria (age range, region, job status), detailed conditions (JSON), benefit summary, and an application URL. This entity is stored and queried from a database solution.

## Success Criteria *(mandatory)*

### Measurable Outcomes

-   **SC-001 (Matching Accuracy)**: For known test cases, the system MUST correctly match eligible policies with 95% accuracy.
-   **SC-002 (Response Time)**: The average end-to-end response time for a user chat message (from sending to receiving a conversational reply) MUST be under 5 seconds.
-   **SC-005 (Factual Accuracy)**: Conversational replies MUST NOT fabricate policy names or benefit amounts (0% hallucination rate for factual data).
-   **SC-003 (Coverage)**: The system MUST be able to match at least 50 core welfare benefit types for the 2030 youth target persona at MVP launch.
-   **SC-004 (User Task Completion)**: 80% of target users (20-30s job seekers) MUST successfully complete a benefit lookup and identify at least one matched policy on their first attempt.
-   **SC-005 (AI Hallucination Rate)**: AI-generated responses MUST NOT fabricate policy names or benefit amounts (0% hallucination rate for factual data).