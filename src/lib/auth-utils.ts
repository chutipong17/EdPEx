export function clearAuthData(): void {
  if (typeof window === "undefined") return;

  // Clear all auth cookies by setting them to expire
  const cookies = ["edpex-session"];

  cookies.forEach((cookieName) => {
    document.cookie = `${cookieName}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  });

  // Clear localStorage auth data
  localStorage.removeItem("auth-storage");
}

/**
 * Redirect to sign-in page if not already there
 */
export function redirectToSignIn(): void {
  if (typeof window === "undefined") return;

  if (!window.location.pathname.includes("/sign-in")) {
    window.location.href = "/sign-in";
  }
}

/**
 * Handle token expiration - clear data and redirect
 */
export function handleTokenExpiration(): void {
  clearAuthData();
  redirectToSignIn();
}
