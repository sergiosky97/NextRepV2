import { IconKey } from "@nextrep/assets/index";
import { createI18n } from "@nextrep/i18n/index";
import { createTheme, tokens } from "@nextrep/ui/index";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { createApiClient } from "@nextrep/api-client/index";
import {
  clearSession,
  loadSession,
  refreshStoredSession
} from "../src/features/auth/application/session.storage";
import { NavIcon } from "../src/features/home/presentation/nav-icon";

const i18n = createI18n("es");
const theme = createTheme("light");
const apiClient = createApiClient({ baseUrl: "http://localhost:4000" });
const navItems = [
  { key: "home", labelKey: "home.navHome" },
  { key: "groups", labelKey: "home.navGroups" },
  { key: "activity", labelKey: "home.navActivity" },
  { key: "calendar", labelKey: "home.navCalendar" },
  { key: "more", labelKey: "home.navMore" }
] as const satisfies ReadonlyArray<{ key: IconKey; labelKey: string }>;

export default function HomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState(i18n.t("home.greeting"));

  useEffect(() => {
    void loadSession().then((session) => {
      if (!session) {
        router.replace("/login");
        return;
      }
      apiClient
        .getMe(session.accessToken)
        .then((user) => setUserName(user.displayName || user.email))
        .catch(async () => {
          const refreshed = await refreshStoredSession((token) => apiClient.refresh(token));
          if (!refreshed) {
            await clearSession();
            router.replace("/login");
            return;
          }
          const me = await apiClient.getMe(refreshed.accessToken);
          setUserName(me.displayName || me.email);
        });
    });
  }, [router]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View
        style={{
          padding: tokens.spacing.lg,
          borderBottomColor: theme.border,
          borderBottomWidth: 1,
          flexDirection: "row",
          gap: tokens.spacing.md,
          alignItems: "center"
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: tokens.radius.pill,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: tokens.color.primary
          }}
        >
          <Text style={{ color: tokens.color.primaryText }}>U</Text>
        </View>
        <Text style={{ color: theme.text, fontSize: tokens.typography.subtitle }}>
          {userName}
        </Text>
        <Pressable
          onPress={async () => {
            const session = await loadSession();
            if (session?.accessToken) await apiClient.logout(session.accessToken);
            await clearSession();
            router.replace("/login");
          }}
          style={{
            borderColor: theme.border,
            borderWidth: 1,
            borderRadius: tokens.radius.md,
            paddingHorizontal: tokens.spacing.sm,
            paddingVertical: tokens.spacing.xs
          }}
        >
          <Text style={{ color: theme.text }}>Logout</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={{ padding: tokens.spacing.lg }}>
        <View
          style={{
            borderColor: theme.border,
            borderWidth: 1,
            borderRadius: tokens.radius.lg,
            backgroundColor: theme.surface,
            padding: tokens.spacing.xl
          }}
        >
          <Text style={{ color: theme.text }}>{i18n.t("home.placeholderPost")}</Text>
        </View>
      </ScrollView>
      <View
        style={{
          borderTopColor: theme.border,
          borderTopWidth: 1,
          flexDirection: "row",
          justifyContent: "space-around",
          paddingVertical: tokens.spacing.md
        }}
      >
        {navItems.map((item, index) => (
          <View key={item.key} style={{ alignItems: "center", gap: tokens.spacing.xs }}>
            <NavIcon name={item.key} color={index === 0 ? tokens.color.primary : theme.text} />
            <Text style={{ color: index === 0 ? tokens.color.primary : theme.text }}>
              {i18n.t(item.labelKey)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
