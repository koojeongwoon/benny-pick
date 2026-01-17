export default defineNuxtRouteMiddleware((to, from) => {
  // 클라이언트 사이드에서만 실행
  if (import.meta.server) return;

  const publicPages = ['/', '/login', '/register'];
  const authPages = ['/login', '/register'];
  const isPublicPage = publicPages.includes(to.path);
  const isAuthPage = authPages.includes(to.path);

  // 로그인 상태 확인
  const accessToken = localStorage.getItem('access_token');
  const userStr = localStorage.getItem('user');

  // 비로그인 상태
  if (!accessToken || !userStr) {
    if (!isPublicPage) {
      return navigateTo('/login');
    }
    return;
  }

  // 로그인 상태
  try {
    const user = JSON.parse(userStr);

    // 로그인 사용자가 로그인/회원가입 페이지 접근 시
    if (isAuthPage) {
      // 온보딩 완료 여부에 따라 리다이렉트
      return navigateTo(user.onboarding_completed ? '/chat' : '/onboarding');
    }

    // 온보딩 미완료 사용자는 온보딩 페이지만 접근 가능
    if (!user.onboarding_completed && to.path !== '/onboarding' && !isPublicPage) {
      return navigateTo('/onboarding');
    }

    // 온보딩 완료 사용자가 온보딩 페이지 접근 시 채팅으로
    if (user.onboarding_completed && to.path === '/onboarding') {
      return navigateTo('/chat');
    }
  } catch (e) {
    // 잘못된 사용자 데이터면 로그아웃 처리
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    if (!isPublicPage) {
      return navigateTo('/login');
    }
  }
});
