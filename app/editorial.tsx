import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import Head from "expo-router/head";
import Svg, { Text as SvgText } from "react-native-svg";
import { useEffect, useRef, useState } from "react";
import {
  AccessibilityInfo, Animated, Image, Platform, Pressable, ScrollView, StyleSheet,
  Text, TextInput, useWindowDimensions, View,
} from "react-native";
import { DadmarkLogo } from "../components/dadmark-logo";
import { DistrictForgeLogo } from "../components/districtforge-logo";

const C = { paper: "#F4F4F1", ink: "#101010", grey: "#D9DCDD", line: "#A5A7A5", muted: "#555854" };
type Section = "work" | "about" | "contact";

export default function EditorialPortfolio() {
  const { width } = useWindowDimensions();
  const mobile = width < 760;
  const [heroWidth, setHeroWidth] = useState(width);
  const scroll = useRef<ScrollView>(null);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    let active = true;
    void AccessibilityInfo.isReduceMotionEnabled().then((value) => { if (active) setReduceMotion(value); });
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setReduceMotion);
    return () => { active = false; subscription.remove(); };
  }, []);
  const titleWidth = heroWidth * 0.96;
  const titleHeight = titleWidth / 6;
  const titleX = scrollY.interpolate({
    inputRange: [0, mobile ? 420 : 540],
    outputRange: [0, -heroWidth],
    extrapolate: "clamp",
  });
  const positions = useRef<Record<Section, number>>({ work: 0, about: 0, contact: 0 });
  const sending = useRef(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [expandedProcess, setExpandedProcess] = useState<Record<string, boolean>>({});

  function scrollTo(section: Section) {
    scroll.current?.scrollTo({ y: positions.current[section], animated: true });
  }

  async function submitContact() {
    if (sending.current) return;
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email.trim()) || !message.trim()) {
      setError("Enter your name, a valid email, and a message.");
      setStatus("error");
      return;
    }
    sending.current = true;
    setStatus("sending");
    setError("");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(
        Platform.OS === "web" ? "/api/contact" : "https://jaredrachlin.dev/api/contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim(), website: "" }),
          signal: controller.signal,
        },
      );
      const result = await response.json().catch(() => null);
      if (!response.ok || result?.ok !== true) {
        throw new Error(result?.error || "Your message could not be sent. Please try again.");
      }
      setStatus("success");
      setName(""); setEmail(""); setMessage("");
    } catch (cause) {
      setStatus("error");
      setError(cause instanceof Error && cause.name === "AbortError"
        ? "The request timed out. Please try again."
        : cause instanceof Error ? cause.message : "Your message could not be sent.");
    } finally {
      clearTimeout(timeout);
      sending.current = false;
    }
  }

  return (
    <>
      <Head>
        <title>Jared Rachlin — Independent Product Builder</title>
        <meta name="description" content="Dad, night-shift worker, and self-taught builder. Explore Dadmark, DistrictForge, and the thinking behind the work." />
      </Head>
      <Animated.ScrollView ref={scroll} style={s.page} contentContainerStyle={s.content}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: Platform.OS !== "web" })}>
        <View style={[s.nav, mobile && s.navMobile]}>
          <Link href="/" accessibilityLabel="Jared Rachlin homepage" style={s.wordmark}>JR®</Link>
          <View style={s.navLinks}>
            {(["work", "about", "contact"] as const).map((item) => (
              <Pressable key={item} accessibilityRole="button" onPress={() => scrollTo(item)} style={s.navButton}>
                <Text style={s.label}>{item.toUpperCase()}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View onLayout={(event) => setHeroWidth(event.nativeEvent.layout.width)} style={[s.hero, { height: mobile ? 500 : 790 }]}>
          <View style={s.heroTop}>
            <Text style={s.label}>INDEPENDENT PRODUCT BUILDER</Text>
            <Text style={s.label}>PORTFOLIO</Text>
          </View>
          <View pointerEvents="none" style={s.axis} />
          <Animated.View pointerEvents="none" accessibilityRole="header" accessibilityLabel="Jared Rachlin" style={[s.heroTitle, {
            width: titleWidth,
            height: titleHeight,
            left: heroWidth * 0.02,
            top: mobile ? 250 : 260,
            transform: [{ translateX: reduceMotion ? 0 : titleX }],
          }]}>
            <Svg width="100%" height="100%" viewBox="0 0 1200 200">
              <SvgText x={0} y={165} fontFamily="Arial, Helvetica, sans-serif" fontWeight="900" fontSize={180} fill={C.ink} textLength={1200} lengthAdjust="spacingAndGlyphs">JARED RACHLIN</SvgText>
            </Svg>
          </Animated.View>
          <Image
            source={Platform.OS === "web" ? { uri: "/mesleeves.png" } : require("../public/mesleeves.png")}
            accessibilityLabel="Jared Rachlin"
            resizeMode="contain"
            style={[s.portrait, { width: Math.min(width * 0.98, 820), height: Math.min(width * 0.98, 820) * 1103 / 1426 }]}
          />
          {!mobile && <Text style={s.heroNote}>REAL PROBLEMS.{"\n"}THOUGHTFUL SOFTWARE.{"\n"}ALWAYS IN PROGRESS.</Text>}
          <Pressable accessibilityRole="button" accessibilityLabel="Explore selected work" onPress={() => scrollTo("work")} style={s.heroCta}>
            <Feather name="arrow-down-right" size={16} color={C.paper} />
            <Text style={s.lightLabel}>EXPLORE THE WORK</Text>
          </Pressable>
        </View>

        <View nativeID="about" onLayout={(e) => { positions.current.about = e.nativeEvent.layout.y; }} style={s.darkSection}>
          <View style={[s.sectionInner, mobile && s.mobilePadding]}>
            <Text style={s.lightLabel}>THE PERSON BEHIND THE PRODUCTS</Text>
            <Text accessibilityRole="header" style={[s.statement, mobile && s.statementMobile]}>Everyday friction.{"\n"}Better possibilities.</Text>
            <View style={[s.columns, mobile && s.stacked]}>
              <Text style={[s.bodyLight, s.flex, mobile && s.naturalHeight]}>I’m Jared—a dad, night-shift worker, and self-taught builder turning everyday problems into focused digital products.</Text>
              <Text style={[s.bodyLight, s.flex, mobile && s.naturalHeight]}>I learn by making: understanding the problem, shaping the experience, and improving it with the people who will use it.</Text>
            </View>
            <View style={s.tags}>
              {["PRODUCT DIRECTION", "EXPERIENCE DESIGN", "WEB APPLICATIONS", "COMMUNITY FEEDBACK"].map((tag) => <Text key={tag} style={s.tag}>{tag}</Text>)}
            </View>
          </View>
        </View>

        <View nativeID="work" onLayout={(e) => { positions.current.work = e.nativeEvent.layout.y; }} style={[s.sectionInner, mobile && s.mobilePadding]}>
          <Text style={s.label}>SELECTED WORK</Text>
          <Text accessibilityRole="header" style={[s.sectionTitle, mobile && s.titleMobile]}>Built from life.</Text>
          <Link href="https://www.districtforge.app" asChild>
          <Pressable accessibilityRole="link" accessibilityLabel="Visit DistrictForge" style={s.project}>
            <View style={s.projectMeta}><Text style={s.label}>SCHOOL FACILITIES OPERATIONS</Text><DistrictForgeLogo size={32} color={C.ink} /></View>
            <Text accessibilityRole="header" style={[s.projectTitle, mobile && s.projectTitleMobile]}>DistrictForge</Text>
            <Text style={s.body}>One operational system for work orders, assets, inspections, inventory, purchasing, budgets, facility use, and long-range planning.</Text>
            <View style={s.projectFooter}><Text style={s.label}>EXPLORE DISTRICTFORGE</Text><Feather name="arrow-up-right" size={28} color={C.ink} /></View>
          </Pressable>
          </Link>
          <Link href="https://dadmark.app" asChild>
          <Pressable accessibilityRole="link" accessibilityLabel="Visit Dadmark" style={StyleSheet.flatten([s.project, s.dadmark])}>
            <View style={s.projectMeta}><Text style={s.label}>BUILT AROUND FATHERHOOD</Text><DadmarkLogo size={46} /></View>
            <Text accessibilityRole="header" style={[s.projectTitle, mobile && s.projectTitleMobile]}>Dadmark</Text>
            <Text style={s.body}>A product shaped by life as a dad. Built from direct experience and improved through real feedback.</Text>
            <View style={s.projectFooter}><Text style={s.label}>EXPLORE DADMARK</Text><Feather name="arrow-up-right" size={28} color={C.ink} /></View>
          </Pressable>
          </Link>
        </View>

        <View style={s.process}>
          <View style={[s.sectionInner, mobile && s.mobilePadding]}>
            <Text style={s.label}>HOW I BUILD</Text>
            {[
              ["problem", "Start with the real problem.", "The strongest products begin with how people actually work.", "I begin by listening, observing the current workflow, and identifying the friction people have learned to work around. That keeps the product focused on a real need instead of a feature list."],
              ["clarity", "Make the complex feel clear.", "Thoughtful structure and direct language make powerful software approachable.", "I organize dense workflows into clear steps, remove unnecessary decisions, and use familiar language so the product feels understandable from the first interaction."],
              ["improve", "Keep improving in public.", "Feedback belongs inside the build process, where it can shape what gets made next.", "I share working versions early, watch how people use them, and turn their feedback into focused iterations. The product gets stronger because the people closest to the problem help shape it."],
            ].map(([key, title, body, detail]) => {
              const expanded = !!expandedProcess[key];
              return (
                <Pressable
                  key={key}
                  accessibilityRole="button"
                  accessibilityState={{ expanded }}
                  accessibilityLabel={`${title} ${expanded ? "Collapse details" : "Expand details"}`}
                  onPress={() => setExpandedProcess((current) => ({ ...current, [key]: !current[key] }))}
                  style={({ pressed }) => [s.processRow, pressed && s.processRowPressed]}
                >
                  <View style={s.processHeader}>
                    <View style={s.flex}>
                      <Text style={s.processTitle}>{title}</Text>
                      <Text style={s.body}>{body}</Text>
                    </View>
                    <View style={s.processIcon}>
                      <Feather name={expanded ? "minus" : "plus"} size={22} color={C.ink} />
                    </View>
                  </View>
                  {expanded ? <Text style={s.processDetail}>{detail}</Text> : null}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View nativeID="contact" onLayout={(e) => { positions.current.contact = e.nativeEvent.layout.y; }} style={s.darkSection}>
          <View style={[s.sectionInner, mobile && s.mobilePadding]}>
            <Text style={s.lightLabel}>START A CONVERSATION</Text>
            <Text accessibilityRole="header" style={[s.statement, mobile && s.statementMobile]}>Something worth{"\n"}building together?</Text>
            <View style={[s.columns, mobile && s.stacked]}>
              <Text style={[s.bodyLight, s.flex, mobile && s.naturalHeight]}>A question, an idea, or a problem you keep running into. I’d like to hear about it.</Text>
              <View style={[s.flex, mobile && s.naturalHeight]}>
                <Text style={s.fieldLabel}>YOUR NAME</Text>
                <TextInput accessibilityLabel="Your name" autoComplete="name" value={name} onChangeText={setName} editable={status !== "sending"} style={s.input} placeholder="Name" placeholderTextColor="#A7AAA5" />
                <Text style={s.fieldLabel}>EMAIL ADDRESS</Text>
                <TextInput accessibilityLabel="Email address" autoComplete="email" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} editable={status !== "sending"} style={s.input} placeholder="you@example.com" placeholderTextColor="#A7AAA5" />
                <Text style={s.fieldLabel}>WHAT’S ON YOUR MIND?</Text>
                <TextInput accessibilityLabel="Message" multiline value={message} onChangeText={setMessage} editable={status !== "sending"} style={[s.input, s.message]} placeholder="Tell me a little about it…" placeholderTextColor="#A7AAA5" />
                <Pressable accessibilityRole="button" accessibilityState={{ disabled: status === "sending" }} disabled={status === "sending"} onPress={submitContact} style={({ pressed }) => [s.send, (pressed || status === "sending") && s.pressed]}><Text style={s.label}>{status === "sending" ? "SENDING…" : "SEND MESSAGE"}</Text><Feather name="arrow-up-right" size={22} color={C.ink} /></Pressable>
                <Text accessibilityLiveRegion="polite" style={s.feedback}>{status === "success" ? "Thanks—your message has been sent." : status === "error" ? error : ""}</Text>
              </View>
            </View>
            <View style={s.footer}><Text style={s.lightLabel}>© {new Date().getFullYear()} JARED RACHLIN</Text></View>
          </View>
        </View>
      </Animated.ScrollView>
    </>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: C.paper }, content: { flexGrow: 1 },
  nav: { paddingHorizontal: 48, minHeight: 90, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: C.line },
  navMobile: { paddingHorizontal: 20 }, wordmark: { color: C.ink, fontSize: 28, fontWeight: "900", letterSpacing: -2 },
  navLinks: { flexDirection: "row", gap: 12 }, navButton: { minHeight: 44, justifyContent: "center", paddingHorizontal: 6 },
  label: { color: C.ink, fontSize: 10, lineHeight: 16, fontWeight: "600", letterSpacing: 1 },
  lightLabel: { color: C.paper, fontSize: 10, lineHeight: 16, fontWeight: "600", letterSpacing: 1 },
  hero: { backgroundColor: C.grey, overflow: "hidden", alignItems: "center", position: "relative" },
  heroTop: { width: "100%", padding: 24, flexDirection: "row", justifyContent: "space-between", gap: 20, flexWrap: "wrap", zIndex: 4 },
  axis: { position: "absolute", top: 0, bottom: 0, left: "50%", borderLeftWidth: 1, borderColor: "#BFC2C1" },
  heroTitle: { position: "absolute", zIndex: 1 },
  portrait: { position: "absolute", bottom: -8, zIndex: 2 },
  heroNote: { position: "absolute", bottom: 46, left: 48, fontSize: 10, lineHeight: 18, letterSpacing: 1, color: C.ink, zIndex: 3 },
  heroCta: { position: "absolute", bottom: 16, right: 16, zIndex: 4, backgroundColor: C.ink, paddingHorizontal: 12, paddingVertical: 10, minHeight: 44, gap: 8, flexDirection: "row", alignItems: "center" },
  darkSection: { backgroundColor: C.ink }, sectionInner: { width: "100%", maxWidth: 1260, alignSelf: "center", paddingHorizontal: 48, paddingVertical: 88 },
  mobilePadding: { paddingHorizontal: 24, paddingVertical: 56 },
  statement: { fontSize: 72, lineHeight: 76, letterSpacing: -3, fontWeight: "700", color: C.paper, marginTop: 36, marginBottom: 42 },
  statementMobile: { fontSize: 40, lineHeight: 44, letterSpacing: -1.5 },
  naturalHeight: { flex: 0, flexGrow: 0, flexShrink: 0, flexBasis: "auto" },
  columns: { flexDirection: "row", gap: 60 }, stacked: { flexDirection: "column", gap: 24 }, flex: { flex: 1, minWidth: 0 },
  body: { fontSize: 17, lineHeight: 28, color: C.muted, maxWidth: 650 }, bodyLight: { fontSize: 19, lineHeight: 30, color: "#C1C3BE" },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginTop: 40 }, tag: { fontSize: 10, letterSpacing: 1, color: C.paper, borderWidth: 1, borderColor: "#5B5E58", padding: 12 },
  sectionTitle: { fontSize: 82, lineHeight: 90, fontWeight: "700", letterSpacing: -4, marginTop: 24, marginBottom: 48, color: C.ink },
  titleMobile: { fontSize: 48, lineHeight: 52, letterSpacing: -2 },
  project: { padding: 28, backgroundColor: C.grey, marginBottom: 28, minHeight: 320, justifyContent: "space-between" },
  dadmark: { backgroundColor: "#E9E4DB" }, projectMeta: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 },
  projectTitle: { fontSize: 64, letterSpacing: -3, fontWeight: "700", marginTop: 30, marginBottom: 18, color: C.ink },
  projectTitleMobile: { fontSize: 34, letterSpacing: -1.5 }, projectFooter: { flexDirection: "row", flexWrap: "wrap", gap: 16, justifyContent: "space-between", alignItems: "center", marginTop: 24, paddingTop: 8 },
  process: { borderTopWidth: 1, borderColor: C.line }, processRow: { borderBottomWidth: 1, borderColor: C.line, paddingVertical: 32 },
  processRowPressed: { opacity: 0.65 }, processHeader: { flexDirection: "row", gap: 24, alignItems: "flex-start" },
  processIcon: { width: 44, height: 44, alignItems: "center", justifyContent: "center", marginTop: -8 },
  processDetail: { color: C.ink, fontSize: 16, lineHeight: 27, maxWidth: 760, marginTop: 24, paddingRight: 54 },
  processTitle: { fontSize: 28, lineHeight: 34, letterSpacing: -0.8, fontWeight: "600", marginBottom: 12, color: C.ink },
  fieldLabel: { color: C.paper, fontSize: 10, letterSpacing: 1, marginBottom: 8 },
  input: { color: C.paper, fontSize: 17, padding: 14, minHeight: 52, borderBottomWidth: 1, borderColor: "#74776F", marginBottom: 26, backgroundColor: "#1C1E1B" },
  message: { minHeight: 130, textAlignVertical: "top" }, send: { backgroundColor: C.paper, minHeight: 56, paddingHorizontal: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  feedback: { color: C.paper, fontSize: 14, lineHeight: 22, marginTop: 16, minHeight: 24 },
  footer: { marginTop: 64, borderTopWidth: 1, borderColor: "#5B5E58", paddingTop: 24, flexDirection: "row", flexWrap: "wrap", gap: 24, justifyContent: "space-between", alignItems: "center" },
  footerLink: { color: C.paper, fontSize: 12, paddingVertical: 12 }, pressed: { opacity: 0.6 },
});
