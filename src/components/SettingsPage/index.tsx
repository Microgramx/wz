import React, { useState, useEffect, ChangeEvent } from "react";
import styles from "@/styles/Settings.module.scss";
import Link from "next/link";
import { FaGithub, FaGlobe } from "react-icons/fa";
import { getSettings, setSettings } from "@/Utils/settings";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/Utils/firebase";
import { logoutUser } from "@/Utils/firebaseUser";
import { toast } from "sonner";
import ColorPicker from "@/components/ColorPicker";
import ThemeButtons from "@/components/ThemeButtons";

const defaultColors = {
  ascent_color: "gold",
  bg_color: "#f4f7fe",
  bg_gradient: "rgba(238, 235, 235, 0.8)",
  primary_1: "rgb(255, 255, 255)",
  primary_2: "#64748b",
  primary_3: "#52525b",
  primary_4: "black",
  watchPageBtn: "rgb(255, 255, 255)",
};

const darkColors = {
  ascent_color: "gold",
  bg_color: "rgb(27, 25, 25)",
  bg_gradient: "rgba(49, 47, 47, 0.8)",
  primary_1: "black",
  primary_2: "rgb(87, 107, 135)",
  primary_3: "rgb(164, 179, 201)",
  primary_4: "white",
  watchPageBtn: "rgb(164, 179, 201)",
};

interface SettingsPageProps {
  mode: string;
  theme: string;
  ascent_color: string;
  setMode: (mode: string) => void;
  setTheme: (theme: string) => void;
  setAscent_color: (color: string) => void;
}

interface Colors {
  ascent_color: string;
  bg_color: string;
  bg_gradient: string;
  primary_1: string;
  primary_2: string;
  primary_3: string;
  primary_4: string;
  watchPageBtn: string;
}

const SettingsPage: React.FC<SettingsPageProps> = ({
  mode,
  theme,
  ascent_color,
  setMode,
  setTheme,
  setAscent_color,
}) => {
  const [user, setUser] = useState<any>(false);
  const [loading, setLoading] = useState(true);
  const [colors, setColors] = useState<Colors>({
    ...defaultColors,
    ascent_color,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedColors = localStorage.getItem("colors");
      if (savedColors) {
        const parsedColors = JSON.parse(savedColors);
        setColors(parsedColors);
        applyColors(parsedColors);
      }

      toast.info(
        "Atenção: as configurações de mudança de layout estão em modo de teste. Isso pode causar conflitos com algumas cores. Deixe sua opinião sobre o beta em nosso canal do Discord.",
        {
          duration: 10000, // duração em milissegundos (10 segundos)
        },
      );
    }
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user ? user : false);
      setLoading(false);
    });
  }, []);

  const applyColors = (colors: Colors) => {
    Object.keys(colors).forEach((color) => {
      document.documentElement.style.setProperty(
        `--${color.replace(/_/g, "-")}`,
        colors[color as keyof Colors],
      );
    });
  };

  const handleColorChange = (
    e: ChangeEvent<HTMLInputElement>,
    colorName: keyof Colors,
  ) => {
    const newColors = { ...colors, [colorName]: e.target.value };
    setColors(newColors);
    if (typeof window !== "undefined") {
      document.documentElement.style.setProperty(
        `--${colorName.replace(/_/g, "-")}`,
        e.target.value,
      );
      localStorage.setItem("colors", JSON.stringify(newColors));
    }
  };

  const handleSelect = ({ type, value }: any) => {
    const prevVal = { mode, theme, ascent_color };
    let newColors;
    if (type === "mode") {
      setSettings({ values: { ...prevVal, mode: value } });
      setMode(value);
      if (value === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        document.documentElement.className = `theme-${systemTheme}`;
        newColors =
          systemTheme === "dark"
            ? { ...darkColors, ascent_color }
            : { ...defaultColors, ascent_color };
      } else {
        document.documentElement.className = `theme-${value}`;
        newColors =
          value === "dark"
            ? { ...darkColors, ascent_color }
            : { ...defaultColors, ascent_color };
      }
      setColors(newColors);
      if (typeof window !== "undefined") {
        localStorage.setItem("colors", JSON.stringify(newColors));
      }
    } else if (type === "theme") {
      setSettings({ values: { ...prevVal, theme: value } });
      setTheme(value);
      if (value !== "light" && value !== "dark") {
        setMode("custom");
      }
    } else if (type === "ascent_color") {
      setSettings({ values: { ...prevVal, ascent_color: value } });
      setAscent_color(value);
    }
  };

  useEffect(() => {
    applyColors(colors);
  }, [colors]);

  useEffect(() => {
    const updateSystemTheme = () => {
      if (mode === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
          .matches
          ? "dark"
          : "light";
        document.documentElement.className = `theme-${systemTheme}`;
        const newColors =
          systemTheme === "dark"
            ? { ...darkColors, ascent_color }
            : { ...defaultColors, ascent_color };
        setColors(newColors);
        if (typeof window !== "undefined") {
          localStorage.setItem("colors", JSON.stringify(newColors));
        }
      } else {
        document.documentElement.className = `theme-${theme}`;
      }
    };

    updateSystemTheme();

    if (mode === "system" && typeof window !== "undefined") {
      const darkModeMediaQuery = window.matchMedia(
        "(prefers-color-scheme: dark)",
      );
      darkModeMediaQuery.addEventListener("change", updateSystemTheme);
      return () => {
        darkModeMediaQuery.removeEventListener("change", updateSystemTheme);
      };
    }
  }, [mode, theme]);

  return (
    <div className={`${styles.settingsPage} ${styles.authPage}`}>
      <div className={styles.logo}>
        <img src="/images/logolmg.svg" alt="logo" />
        <p>Warez é um projeto livre e sem fins lucrativos</p>
      </div>
      <div className={styles.settings}>
        <h1>Conta</h1>
        {user ? (
          <div className={styles.group}>
            <p className={styles.logout} onClick={() => logoutUser()}>
              Sair
            </p>
            <h4 className={styles.profileCard}>
              Estamos corrigindo as falhas na Cloud da Watchlist
            </h4>
          </div>
        ) : (
          <div className={styles.group}>
            <Link href="/login">Login</Link>
            <Link href="/signup">Signup</Link>
            <h4 className={styles.profileCard}>
              Faça login para sincronizar com a nuvem
            </h4>
          </div>
        )}
        <h1>Aparência</h1>
        <div className={styles.group}>
          <div>
            <label htmlFor="mode">Voltar as cores padrão</label>
            <div>
              <ThemeButtons mode={mode} handleSelect={handleSelect} />
            </div>
            <ColorPicker
              label="Botões"
              color={colors.ascent_color}
              colorName="ascent_color"
              handleColorChange={handleColorChange}
            />
            <ColorPicker
              label="Background"
              color={colors.bg_color}
              colorName="bg_color"
              handleColorChange={handleColorChange}
            />
            <ColorPicker
              label="Widget 'Apenas PC'"
              color={colors.bg_gradient}
              colorName="bg_gradient"
              handleColorChange={handleColorChange}
            />
            <ColorPicker
              label="Barra de Navegação"
              color={colors.primary_1}
              colorName="primary_1"
              handleColorChange={handleColorChange}
            />
            <ColorPicker
              label="Textos"
              color={colors.primary_2}
              colorName="primary_2"
              handleColorChange={handleColorChange}
            />
            <ColorPicker
              label="Titulo"
              color={colors.primary_3}
              colorName="primary_3"
              handleColorChange={handleColorChange}
            />
            <ColorPicker
              label="Efeitos"
              color={colors.primary_4}
              colorName="primary_4"
              handleColorChange={handleColorChange}
            />
            <ColorPicker
              label="Botão do próximo episódio"
              color={colors.watchPageBtn}
              colorName="watchPageBtn"
              handleColorChange={handleColorChange}
            />
          </div>
        </div>
        <h1>Centro da App</h1>
        <div className={styles.group}>
          <Link
            href="/downloads"
            data-tooltip-id="tooltip"
            data-tooltip-content="Downloads"
          >
            Download App
          </Link>
          <Link href="mailto:geral@webproject.pt">Reportar Erro</Link>
        </div>
        <h1>Links</h1>
        <div className={styles.group}>
          <Link href={"https://wareztuga.pt"}>
            <FaGlobe /> Wareztuga
          </Link>
          <Link href={"https://wareztuga.pt"}>
            <FaGlobe /> Parceiro
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
