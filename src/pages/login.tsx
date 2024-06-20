import React, { useState, useEffect } from "react";
import styles from "@/styles/Settings.module.scss";
import Link from "next/link";
import { loginUserGoogle, loginUserManual } from "@/Utils/firebaseUser";
import { useRouter } from "next/navigation";
const LoginPage = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const { push } = useRouter();
  const handleFormSubmission = async (e: any) => {
    e.preventDefault();
    if (await loginUserManual({ email, password })) {
      push("/settings");
    }
  };
  const handleGoogleSignIn = async (e: any) => {
    e.preventDefault();
    if (await loginUserGoogle()) {
      push("/settings");
    }
  };
  return (
    <div className={`${styles.settingsPage} ${styles.authPage}`}>
      <div className={styles.logo}>
        <img
          src="/images/logolmg.svg"
          alt="logo"
          data-tooltip-id="tooltip"
          data-tooltip-content="Rive"
        />
        <p>O seu aplicativo de filmes gratuito</p>
      </div>
      <div className={styles.settings}>
        <h1>Login</h1>
        <div className={styles.group2}>
          <>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e: any) => setEmail(e.target.value)}
              required
            />
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e: any) => setPassword(e.target.value)}
              required
            />
            <button onClick={handleFormSubmission}>Entrar</button>
          </>
        </div>
        <h4 className={styles.signin} onClick={handleGoogleSignIn}>
          Entrar com a conta <span className={styles.highlight}>Google</span>
        </h4>
        <h4>
          Se preferir utilize um Email e Password!{" "}
          <Link href="/signup" className={styles.highlight}>
            Criar conta
          </Link>
        </h4>
        {/* <h4 onClick={() => resetPassword(email)} className={styles.highlight}>Forgot Password?</h4> */}
      </div>
    </div>
  );
};

export default LoginPage;
