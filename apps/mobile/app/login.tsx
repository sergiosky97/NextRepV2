import { createApiClient } from "@nextrep/api-client/index";
import { createI18n } from "@nextrep/i18n/index";
import { createTheme, tokens } from "@nextrep/ui/index";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { loadSession, saveSession } from "../src/features/auth/application/session.storage";

const i18n = createI18n("es");
const theme = createTheme("light");
const apiClient = createApiClient({ baseUrl: "http://localhost:4000" });

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void loadSession().then((session) => {
      if (session?.accessToken) router.replace("/home");
    });
  }, [router]);

  async function onLogin() {
    if (!email.includes("@")) {
      setError(i18n.t("auth.invalidEmail"));
      return;
    }
    if (password.length < 6) {
      setError(i18n.t("auth.shortPassword"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const session = await apiClient.login({ email, password });
      await saveSession(session);
      router.replace("/home");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : i18n.t("auth.genericError"));
    } finally {
      setLoading(false);
    }
  }

  async function onRegister() {
    if (!email.includes("@")) {
      setError(i18n.t("auth.invalidEmail"));
      return;
    }
    if (password.length < 6) {
      setError(i18n.t("auth.shortPassword"));
      return;
    }
    setLoading(true);
    setError("");
    try {
      const session = await apiClient.register({ email, password });
      await saveSession(session);
      router.replace("/home");
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : i18n.t("auth.genericError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: tokens.spacing.xl,
        backgroundColor: theme.background
      }}
    >
      <View
        style={{
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderWidth: 1,
          borderRadius: tokens.radius.lg,
          padding: tokens.spacing.xl,
          gap: tokens.spacing.lg
        }}
      >
        <Text style={{ textAlign: "center", fontSize: tokens.typography.title, color: theme.text }}>
          {i18n.t("appName")}
        </Text>
        <TextInput
          placeholder={i18n.t("auth.emailLabel")}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          style={{
            borderColor: theme.border,
            borderWidth: 1,
            borderRadius: tokens.radius.md,
            padding: tokens.spacing.md,
            color: theme.text
          }}
        />
        <TextInput
          placeholder={i18n.t("auth.passwordLabel")}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{
            borderColor: theme.border,
            borderWidth: 1,
            borderRadius: tokens.radius.md,
            padding: tokens.spacing.md,
            color: theme.text
          }}
        />
        {error ? <Text style={{ color: tokens.color.danger }}>{error}</Text> : null}
        <Pressable
          onPress={onLogin}
          style={{
            alignItems: "center",
            backgroundColor: tokens.color.primary,
            borderRadius: tokens.radius.md,
            padding: tokens.spacing.md
          }}
        >
          <Text style={{ color: tokens.color.primaryText }}>
            {loading ? "..." : i18n.t("auth.loginButton")}
          </Text>
        </Pressable>
        <Pressable
          onPress={onRegister}
          style={{
            alignItems: "center",
            borderColor: theme.border,
            borderWidth: 1,
            borderRadius: tokens.radius.md,
            padding: tokens.spacing.md
          }}
        >
          <Text style={{ color: theme.text }}>{i18n.t("auth.secondaryAction")}</Text>
        </Pressable>
      </View>
    </View>
  );
}
