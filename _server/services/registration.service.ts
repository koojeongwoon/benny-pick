import type { TokenResponse } from "~/server/types";
import { createUser, createTokens, toUserResponse } from "./auth.service";
import { ValidationError } from "~/server/utils/exceptions";

// 회원가입 슬롯 정의
interface RegistrationSlots {
  name?: string;
  email?: string;
  password?: string;
  passwordConfirm?: string;
}

// 회원가입 세션
interface RegistrationSession {
  id: string;
  slots: RegistrationSlots;
  currentStep: RegistrationStep;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
  createdAt: number;
}

// 회원가입 단계
type RegistrationStep =
  | "greeting"
  | "collect_name"
  | "collect_email"
  | "collect_password"
  | "collect_password_confirm"
  | "confirm"
  | "completed";

// 세션 저장소
const registrationSessions = new Map<string, RegistrationSession>();

// 세션 ID 생성
function generateSessionId(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return "reg_" + Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

// 이메일 유효성 검사
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 비밀번호 유효성 검사
function isValidPassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: "비밀번호는 8자 이상이어야 해요." };
  }
  return { valid: true };
}

// 단계별 프롬프트
const stepPrompts: Record<RegistrationStep, string> = {
  greeting: "안녕하세요! 베니픽 회원가입을 도와드릴게요. 먼저 이름을 알려주시겠어요?",
  collect_name: "이름을 입력해주세요.",
  collect_email: "좋아요! 이제 로그인에 사용할 이메일 주소를 알려주세요.",
  collect_password: "이메일이 확인됐어요! 이제 비밀번호를 설정해주세요. (8자 이상)",
  collect_password_confirm: "비밀번호를 한 번 더 입력해주세요.",
  confirm: "", // 동적으로 생성
  completed: "회원가입이 완료됐어요! 이제 베니픽의 모든 서비스를 이용하실 수 있어요. 🎉",
};

// 회원가입 응답 타입
export interface RegistrationResponse {
  response: string;
  session_id: string;
  step: RegistrationStep;
  slots: RegistrationSlots;
  is_completed: boolean;
  tokens?: TokenResponse;
  validation_error?: string;
}

// 회원가입 요청 타입
export interface RegistrationRequest {
  message: string;
  session_id?: string;
}

// 메인 회원가입 대화 함수
export async function registrationConversation(
  db: D1Database,
  request: RegistrationRequest
): Promise<RegistrationResponse> {
  // 세션 조회 또는 생성
  let session: RegistrationSession;

  if (request.session_id && registrationSessions.has(request.session_id)) {
    session = registrationSessions.get(request.session_id)!;
  } else {
    session = {
      id: generateSessionId(),
      slots: {},
      currentStep: "greeting",
      messages: [],
      createdAt: Date.now(),
    };
    registrationSessions.set(session.id, session);

    // 첫 방문: 인사 메시지 반환
    const greetingResponse = stepPrompts.greeting;
    session.messages.push({ role: "assistant", content: greetingResponse });
    session.currentStep = "collect_name";

    return {
      response: greetingResponse,
      session_id: session.id,
      step: "collect_name",
      slots: session.slots,
      is_completed: false,
    };
  }

  // 사용자 메시지 저장
  const userMessage = request.message.trim();
  session.messages.push({ role: "user", content: userMessage });

  let response: string;
  let validationError: string | undefined;
  let tokens: TokenResponse | undefined;

  // 현재 단계에 따라 처리
  switch (session.currentStep) {
    case "collect_name": {
      if (userMessage.length < 2 || userMessage.length > 50) {
        validationError = "이름은 2~50자 사이로 입력해주세요.";
        response = validationError + " 다시 입력해주세요.";
      } else {
        session.slots.name = userMessage;
        session.currentStep = "collect_email";
        response = `${userMessage}님, 반가워요! ` + stepPrompts.collect_email;
      }
      break;
    }

    case "collect_email": {
      if (!isValidEmail(userMessage)) {
        validationError = "올바른 이메일 형식이 아니에요.";
        response = validationError + " 다시 입력해주세요. (예: example@email.com)";
      } else {
        // 이메일 중복 체크
        const existing = await db
          .prepare("SELECT id FROM users WHERE email = ?")
          .bind(userMessage.toLowerCase())
          .first();

        if (existing) {
          validationError = "이미 가입된 이메일이에요.";
          response = validationError + " 다른 이메일을 입력해주세요.";
        } else {
          session.slots.email = userMessage.toLowerCase();
          session.currentStep = "collect_password";
          response = stepPrompts.collect_password;
        }
      }
      break;
    }

    case "collect_password": {
      const passwordCheck = isValidPassword(userMessage);
      if (!passwordCheck.valid) {
        validationError = passwordCheck.message;
        response = validationError + " 다시 입력해주세요.";
      } else {
        session.slots.password = userMessage;
        session.currentStep = "collect_password_confirm";
        response = stepPrompts.collect_password_confirm;
      }
      break;
    }

    case "collect_password_confirm": {
      if (userMessage !== session.slots.password) {
        validationError = "비밀번호가 일치하지 않아요.";
        response = validationError + " 비밀번호를 다시 입력해주세요.";
        session.currentStep = "collect_password";
        session.slots.password = undefined;
      } else {
        session.slots.passwordConfirm = userMessage;
        session.currentStep = "confirm";

        // 확인 메시지 생성
        response = `입력하신 정보를 확인해주세요:\n\n` +
          `• 이름: ${session.slots.name}\n` +
          `• 이메일: ${session.slots.email}\n\n` +
          `이대로 가입을 진행할까요? (네/아니오)`;
      }
      break;
    }

    case "confirm": {
      const confirmKeywords = ["네", "예", "응", "ㅇㅇ", "yes", "y", "확인", "진행"];
      const cancelKeywords = ["아니오", "아니", "ㄴㄴ", "no", "n", "취소", "다시"];

      const lowerMessage = userMessage.toLowerCase();

      if (confirmKeywords.some((k) => lowerMessage.includes(k))) {
        // 회원가입 진행
        try {
          const user = await createUser(
            db,
            session.slots.email!,
            session.slots.password!,
            session.slots.name!
          );

          tokens = {
            ...createTokens(user.id),
            user: toUserResponse(user),
          };

          session.currentStep = "completed";
          response = stepPrompts.completed;

          // 세션 정리 (완료 후 삭제)
          setTimeout(() => {
            registrationSessions.delete(session.id);
          }, 60000); // 1분 후 삭제

        } catch (error) {
          if (error instanceof ValidationError) {
            validationError = error.message;
            response = error.message + " 다시 시도해주세요.";
            session.currentStep = "collect_email";
          } else {
            throw error;
          }
        }
      } else if (cancelKeywords.some((k) => lowerMessage.includes(k))) {
        // 처음부터 다시
        session.slots = {};
        session.currentStep = "collect_name";
        response = "알겠어요. 처음부터 다시 시작할게요. 이름을 알려주세요.";
      } else {
        response = "가입을 진행하시려면 '네', 다시 입력하시려면 '아니오'라고 말씀해주세요.";
      }
      break;
    }

    default:
      response = "죄송해요, 알 수 없는 상태예요. 새로운 세션을 시작해주세요.";
  }

  // 응답 저장
  session.messages.push({ role: "assistant", content: response });

  return {
    response,
    session_id: session.id,
    step: session.currentStep,
    slots: {
      name: session.slots.name,
      email: session.slots.email,
      // 비밀번호는 응답에 포함하지 않음
    },
    is_completed: session.currentStep === "completed",
    tokens,
    validation_error: validationError,
  };
}

// 스트리밍 회원가입 대화
export async function* registrationConversationStream(
  db: D1Database,
  request: RegistrationRequest
): AsyncGenerator<string> {
  const result = await registrationConversation(db, request);

  // session 이벤트
  yield `event: session\ndata: ${JSON.stringify({ session_id: result.session_id })}\n\n`;

  // step 이벤트
  yield `event: step\ndata: ${JSON.stringify({ step: result.step })}\n\n`;

  // slots 이벤트
  yield `event: slots\ndata: ${JSON.stringify(result.slots)}\n\n`;

  // validation_error 이벤트 (있는 경우)
  if (result.validation_error) {
    yield `event: validation_error\ndata: ${JSON.stringify({ error: result.validation_error })}\n\n`;
  }

  // 응답 메시지를 청크로 전송
  const words = result.response.split(" ");
  for (const word of words) {
    yield `event: message\ndata: ${JSON.stringify({ text: word + " " })}\n\n`;
    // 약간의 딜레이로 타이핑 효과 (실제로는 클라이언트에서 처리)
  }

  // tokens 이벤트 (완료된 경우)
  if (result.tokens) {
    yield `event: tokens\ndata: ${JSON.stringify(result.tokens)}\n\n`;
  }

  // done 이벤트
  yield `event: done\ndata: ${JSON.stringify({ is_completed: result.is_completed })}\n\n`;
}

// 세션 삭제
export function deleteRegistrationSession(sessionId: string): boolean {
  return registrationSessions.delete(sessionId);
}

// 세션 조회
export function getRegistrationSession(sessionId: string): RegistrationSession | undefined {
  return registrationSessions.get(sessionId);
}
