export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];

const dictionaries = {
  es: {
    appName: "NextRep",
    auth: {
      title: "Inicia sesion",
      emailLabel: "Email",
      passwordLabel: "Contrasena",
      loginButton: "Entrar",
      secondaryHelp: "No tienes cuenta?",
      secondaryAction: "Registrate",
      invalidEmail: "Email invalido",
      shortPassword: "La contrasena debe tener al menos 6 caracteres",
      genericError: "No se pudo iniciar sesion"
    },
    home: {
      greeting: "Bienvenido",
      placeholderPost: "Contenido inicial del feed",
      navHome: "Inicio",
      navGroups: "Grupos",
      navActivity: "Actividad",
      navCalendar: "Calendario",
      navMore: "Mas"
    }
  },
  en: {
    appName: "NextRep",
    auth: {
      title: "Sign in",
      emailLabel: "Email",
      passwordLabel: "Password",
      loginButton: "Login",
      secondaryHelp: "No account yet?",
      secondaryAction: "Register",
      invalidEmail: "Invalid email",
      shortPassword: "Password must be at least 6 characters",
      genericError: "Could not sign in"
    },
    home: {
      greeting: "Welcome",
      placeholderPost: "Initial feed content",
      navHome: "Home",
      navGroups: "Groups",
      navActivity: "Activity",
      navCalendar: "Calendar",
      navMore: "More"
    }
  }
} as const;

function getByPath(dict: Record<string, unknown>, path: string): string {
  const parts = path.split(".");
  let current: unknown = dict;
  for (const part of parts) {
    if (!current || typeof current !== "object") return path;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === "string" ? current : path;
}

export function createI18n(locale: Locale) {
  const dict = (dictionaries[locale] ?? dictionaries.es) as Record<string, unknown>;
  return {
    t: (key: string) => getByPath(dict, key)
  };
}
