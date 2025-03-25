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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    try {
      setLoading(true);
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
        setError('Authentication popup was closed. Please try again.');
      } else {
        setError(`Authentication failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }
    
    if (isSignUp && !displayName.trim()) {
      setError("Please enter your name");
      return;
    }
    
    try {
      setLoading(true);
      let result;
      if (isSignUp) {
        result = await createUserWithEmailAndPassword(auth, email, password);
        
        await updateProfile(result.user, {
          displayName: displayName.trim()
        });
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }
      
      cookies.set("authtoken", result.user.refreshToken, {
        path: '/',
        secure: true,
        sameSite: 'none'
      });
      props.setIsAuth(true);
    } catch (err) {
      console.error("Email authentication error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please sign in instead.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="email-auth">
        <h2>{isSignUp ? "Create Account" : "Sign In"}</h2>
        {error && <p className="auth-error">{error}</p>}
        <form onSubmit={handleEmailAuth}>
          {isSignUp && (
            <input 
              type="text" 
              placeholder="Your Name" 
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              disabled={loading}
            />
          )}
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <p className="auth-toggle" onClick={() => !loading && setIsSignUp(!isSignUp)}>
          {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
        </p>
      </div>
      
      <div className="auth-divider">
        <span>OR</span>
      </div>
      
      <button className="google-btn" onClick={handleSignIn} disabled={loading}>
        <img src="g-logo.png" alt="Google" />
        {loading ? "Processing..." : "Sign in with Google"}
      </button>
    </div>
  );
}

export default Auth;
