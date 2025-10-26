// lib/firebaseAuth.ts
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export async function loginUserUsingPassword(email: string, password: string) {
  // ✅ Remove undefined from type
  if (!email || !password) {
    throw new Error("Email dan password harus diisi.");
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    // Better error messages
    const errorMessage = getFirebaseErrorMessage(error.code);
    throw new Error(errorMessage);
  }
}

// Helper untuk Firebase error messages
function getFirebaseErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/user-not-found":
      return "Email tidak terdaftar";
    case "auth/wrong-password":
      return "Password salah";
    case "auth/invalid-email":
      return "Format email tidak valid";
    case "auth/user-disabled":
      return "Akun telah dinonaktifkan";
    case "auth/too-many-requests":
      return "Terlalu banyak percobaan login. Coba lagi nanti";
    default:
      return "Terjadi kesalahan saat login";
  }
}