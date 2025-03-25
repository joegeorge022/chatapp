import React, { useState } from "react";
import { auth, provider } from "../firebase-config";
import { 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile 
} from "firebase/auth";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function Auth(props) {
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [signInError, setSignInError] = useState("");
  const [signInLoading, setSignInLoading] = useState(false);
  
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [signUpError, setSignUpError] = useState("");
  const [signUpLoading, setSignUpLoading] = useState(false);
  
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState("");

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setGoogleError("");
      
      setTimeout(async () => {
        try {
          const result = await signInWithPopup(auth, provider);
          cookies.set("authtoken", result.user.refreshToken, {
            path: '/',
            secure: true,
            sameSite: 'none'
          });
          props.setIsAuth(true);
        } catch (err) {
          console.error("Authentication error:", err);
          if (err.code === 'auth/popup-closed-by-user') {
            setGoogleError('Authentication popup was closed. Please try again.');
          } else if (err.code === 'auth/popup-blocked') {
            setGoogleError('Popup was blocked by your browser. Please allow popups for this site.');
          } else {
            setGoogleError(`Authentication failed: ${err.message}`);
          }
          setGoogleLoading(false);
        }
      }, 100);
    } catch (err) {
      console.error("Pre-authentication error:", err);
      setGoogleError(`Error preparing authentication: ${err.message}`);
      setGoogleLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setSignInError("");
    
    if (!signInEmail || !signInPassword) {
      setSignInError("Please enter both email and password");
      return;
    }
    
    try {
      setSignInLoading(true);
      const result = await signInWithEmailAndPassword(auth, signInEmail, signInPassword);
      
      cookies.set("authtoken", result.user.refreshToken, {
        path: '/',
        secure: true,
        sameSite: 'none'
      });
      props.setIsAuth(true);
    } catch (err) {
      console.error("Sign in error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setSignInError('Invalid email or password. Please try again.');
      } else {
        setSignInError(err.message);
      }
    } finally {
      setSignInLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setSignUpError("");
    
    if (!signUpEmail || !signUpPassword) {
      setSignUpError("Please enter both email and password");
      return;
    }
    
    if (!displayName.trim()) {
      setSignUpError("Please enter your name");
      return;
    }
    
    try {
      setSignUpLoading(true);
      const result = await createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword);
      
      await updateProfile(result.user, {
        displayName: displayName.trim()
      });
      
      cookies.set("authtoken", result.user.refreshToken, {
        path: '/',
        secure: true,
        sameSite: 'none'
      });
      props.setIsAuth(true);
    } catch (err) {
      console.error("Sign up error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setSignUpError('This email is already registered. Please sign in instead.');
      } else if (err.code === 'auth/invalid-email') {
        setSignUpError('Please enter a valid email address.');
      } else if (err.code === 'auth/weak-password') {
        setSignUpError('Password should be at least 6 characters.');
      } else {
        setSignUpError(err.message);
      }
    } finally {
      setSignUpLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="auth-forms">
        {/* Sign In Form */}
        <div className="email-auth">
          <h2>Sign In</h2>
          {signInError && <p className="auth-error">{signInError}</p>}
          <form onSubmit={handleSignIn}>
            <input 
              type="email" 
              placeholder="Email" 
              value={signInEmail}
              onChange={(e) => setSignInEmail(e.target.value)}
              disabled={signInLoading}
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={signInPassword}
              onChange={(e) => setSignInPassword(e.target.value)}
              disabled={signInLoading}
            />
            <button type="submit" disabled={signInLoading}>
              {signInLoading ? "Processing..." : "Sign In"}
            </button>
          </form>
        </div>
        
        {/* Divider */}
        <div className="auth-forms-divider"></div>
        
        {/* Sign Up Form */}
        <div className="email-auth">
          <h2>Create Account</h2>
          {signUpError && <p className="auth-error">{signUpError}</p>}
          <form onSubmit={handleSignUp}>
            <input 
              type="text" 
              placeholder="Your Name" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={signUpLoading}
            />
            <input 
              type="email" 
              placeholder="Email" 
              value={signUpEmail}
              onChange={(e) => setSignUpEmail(e.target.value)}
              disabled={signUpLoading}
            />
            <input 
              type="password" 
              placeholder="Password" 
              value={signUpPassword}
              onChange={(e) => setSignUpPassword(e.target.value)}
              disabled={signUpLoading}
            />
            <button type="submit" disabled={signUpLoading}>
              {signUpLoading ? "Processing..." : "Sign Up"}
            </button>
          </form>
        </div>
      </div>
      
      <div className="auth-divider">
        <span>OR</span>
      </div>
      
      {googleError && <p className="auth-error">{googleError}</p>}
      <button className="google-btn" onClick={handleGoogleSignIn} disabled={googleLoading}>
        {googleLoading ? (
          "Processing..."
        ) : (
          <>
            <img src="g-logo.png" alt="Google" />
            Sign in with Google
          </>
        )}
      </button>
    </div>
  );
}

export default Auth;
