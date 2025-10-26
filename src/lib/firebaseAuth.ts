// lib/firebaseAuth.ts
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  isSignInWithEmailLink, fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth } from "./firebase";

const actionCodeSettings = {
  url: `${process.env.NEXT_PUBLIC_BASE_URL}/finishSignIn`, // Halaman redirect setelah klik magic link
  handleCodeInApp: true,
};


export async function checkEmailExists(email: string): Promise<boolean> {
  try {
    const methods = await fetchSignInMethodsForEmail(auth, email);
    return methods.length > 0;
  } catch (error) {
    console.error("Error checking email:", error);
    throw error;
  }
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
  if (!email) throw new Error("Email harus diisi.");

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    // Simpan email ke localStorage agar bisa dipakai di halaman redirect
    window.localStorage.setItem("emailForSignIn", email);
    return true;
  } catch (error: any) {
    throw new Error(getFirebaseErrorMessage(error.code));
  }
}

// VERIFIKASI MAGIC LINK (biasanya dipanggil di halaman /finishSignIn)
export async function verifyMagicLink(url: string) {
  if (isSignInWithEmailLink(auth, url)) {
    const email = window.localStorage.getItem("emailForSignIn");
    if (!email) {
      // fallback: minta user isi ulang email
      throw new Error("Email tidak ditemukan. Silakan isi ulang email Anda.");
    }

    const result = await signInWithEmailLink(auth, email, url);
    window.localStorage.removeItem("emailForSignIn");
    return result.user;
  } else {
    throw new Error("Link tidak valid atau sudah kedaluwarsa.");
  }
}

// 🔹 Helper untuk pesan error Firebase
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
    default:
      return "Terjadi kesalahan autentikasi";
  }
}
