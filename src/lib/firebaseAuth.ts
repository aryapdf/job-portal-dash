import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCustomToken, fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth } from "./firebase";


// CHECK EMAIL - Cek apakah email sudah terdaftar
export async function checkEmailExists(email: string) {
  const res = await fetch("/api/check-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error);

  return data; // { exists, hasPassword, providers }
}

// LOGIN pakai email & password
export async function loginUserUsingPassword(email: string, password: string) {
  if (!email || !password) throw new Error("Email dan password harus diisi.");

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(getFirebaseErrorMessage(error.code));
  }
}

// REGISTER pakai email & password
export async function registerUser(email: string, password: string) {
  if (!email || !password) throw new Error("Email dan password harus diisi.");

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(getFirebaseErrorMessage(error.code));
  }
}

// KIRIM MAGIC LINK ke email
export async function sendMagicLink(email: string) {
  if (!email) throw new Error("Email harus diisi");

  if (typeof window !== "undefined") {
    window.localStorage.setItem("emailForSignIn", email);
  }

  console.log("Sending magic link to:", email);
  console.log("API URL:", "/api/send-magic-link");

  const res = await fetch("/api/send-magic-link", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  console.log("Response status:", res.status);

  const data = await res.json();
  console.log("Response data:", data);

  if (!res.ok) {
    throw new Error(data.error || "Gagal mengirim magic link");
  }

  return true;
}

// VERIFIKASI MAGIC LINK (dipanggil di halaman /verify)
export async function verifyMagicLink(token: string, email: string) {
  try {
    // Sign in with custom token
    const userCredential = await signInWithCustomToken(auth, token);

    // Clear localStorage
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("emailForSignIn");
    }

    return userCredential.user;
  } catch (error: any) {
    throw new Error("Link tidak valid atau sudah kedaluwarsa");
  }
}

// Helper untuk pesan error Firebase
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
    case "auth/email-already-in-use":
      return "Email sudah digunakan";
    case "auth/invalid-custom-token":
      return "Link tidak valid";
    case "auth/custom-token-mismatch":
      return "Link tidak valid untuk project ini";
    default:
      return "Terjadi kesalahan autentikasi";
  }
}