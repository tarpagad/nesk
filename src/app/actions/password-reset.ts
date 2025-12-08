"use server";

export async function requestPasswordReset(email: string) {
  try {
    // Use Better Auth's built-in password reset API
    const response = await fetch(
      `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/api/auth/request-password-reset`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          redirectTo: "/auth/reset-password",
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to send reset email");
    }

    return { success: true };
  } catch (error) {
    console.error("Password reset request error:", error);
    throw error;
  }
}

export async function resetPasswordWithToken(
  token: string,
  newPassword: string,
) {
  try {
    const response = await fetch(
      `${process.env.BETTER_AUTH_URL || "http://localhost:3000"}/api/auth/reset-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to reset password");
    }

    return { success: true };
  } catch (error) {
    console.error("Password reset error:", error);
    throw error;
  }
}
