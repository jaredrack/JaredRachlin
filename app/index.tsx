import Head from "expo-router/head";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

const C = {
  bg: "#F4F3F0",
  ink: "#111111",
  mute: "#6B6B6B",
  line: "#E4E2DC",
  white: "#FFFFFF",
  black: "#0B0B0B",
};

function scrollTo(id: string) {
  if (typeof document !== "undefined") {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export default function DribbblePortfolio() {
  const { width, height } = useWindowDimensions();
  const compact = width < 900;
  const narrow = width < 640;
  const typeSize = Math.round(Math.min(width * 0.2, height * 0.22, 240));
  const photoW = Math.round(Math.min(width * 0.46, 720));
  const photoH = Math.round(Math.min(height * 0.7, 820));

  const nameY = useRef(new Animated.Value(-180)).current;
  const nameOp = useRef(new Animated.Value(0)).current;
  const photoY = useRef(new Animated.Value(260)).current;
  const photoOp = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(nameY, {
          toValue: 0,
          duration: 950,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(nameOp, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(photoY, {
          toValue: 0,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(photoOp, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [nameOp, nameY, photoOp, photoY]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function submit() {
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email.trim()) || !message.trim()) {
      setError("Enter your name, a valid email, and a message.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message, website: "" }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "Could not send.");
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (e) {
      setStatus("error");
      setError(e instanceof Error ? e.message : "Could not send.");
    }
  }

  return (
    <>
      <Head>
        <title>Jared Rachlin — Product Builder</title>
        <meta
          name="description"
          content="Dad, night-shift worker, and self-taught builder. Selected work: DistrictForge and Dadmark."
        />
      </Head>

      <ScrollView style={s.page} contentContainerStyle={s.pageContent} showsVerticalScrollIndicator={false}>
        <View style={[s.screen, { minHeight: height }]}>
          <View style={[s.nav, compact && s.navCompact]}>
            <Text style={s.mark}>JR</Text>
            <View style={s.navLinks}>
              {!narrow ? (
                <>
                  <Pressable onPress={() => scrollTo("work")}><Text style={s.navText}>Work</Text></Pressable>
                  <Pressable onPress={() => scrollTo("about")}><Text style={s.navText}>About</Text></Pressable>
                </>
              ) : null}
              <Pressable onPress={() => scrollTo("contact")} style={s.navCta}>
                <Text style={s.navCtaText}>Get in touch</Text>
              </Pressable>
            </View>
          </View>

          <View style={s.hero}>
            <View style={s.heroTop}>
              <View style={s.avail}>
                <View style={s.dot} />
                <Text style={s.availText}>Available for work</Text>
              </View>
            </View>

            <View style={s.heroStage}>
              <Animated.View style={{ opacity: nameOp, transform: [{ translateY: nameY }], zIndex: 1 }}>
                <Text style={[s.huge, { fontSize: typeSize, lineHeight: typeSize * 0.88 }]}>HI, I'M</Text>
                <Text style={[s.huge, { fontSize: typeSize, lineHeight: typeSize * 0.88 }]}>JARED.</Text>
              </Animated.View>
              <Animated.Image
                source={{ uri: "/mesleeves.png" }}
                accessibilityLabel="Portrait of Jared Rachlin"
                resizeMode="contain"
                style={[
                  s.cutout,
                  { width: photoW, height: photoH, opacity: photoOp, transform: [{ translateY: photoY }] },
                ]}
              />
            </View>

            <View style={[s.heroBottom, compact && s.heroBottomCompact]}>
              <Text style={s.lede}>
                Independent product builder turning everyday friction into focused software.
              </Text>
              <Pressable onPress={() => scrollTo("work")} style={s.textLink}>
                <Text style={s.textLinkLabel}>See selected work →</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View nativeID="about" style={[s.about, compact && s.aboutCompact]}>
          <Text style={s.kicker}>About</Text>
          <Text style={[s.aboutTitle, compact && s.aboutTitleCompact]}>
            Most portfolios try to impress. This one tries to communicate.
          </Text>
          <Text style={s.aboutBody}>
            I’m Jared — a dad, night-shift worker, and self-taught builder in New York. I learn a problem
            firsthand, shape the product, and keep improving it with the people closest to it.
          </Text>
        </View>

        <View nativeID="work" style={s.work}>
          <Text style={s.kicker}>Selected work</Text>
          <Text style={[s.sectionTitle, compact && s.sectionTitleCompact]}>Products in progress.</Text>

          <Pressable
            onPress={() => Linking.openURL("https://www.districtforge.app")}
            style={({ pressed }) => [s.card, s.cardDark, pressed && s.pressed]}
          >
            <Text style={s.cardMetaLight}>01  ·  School facilities</Text>
            <Text style={[s.cardTitleLight, compact && s.cardTitleCompact]}>DistrictForge</Text>
            <Text style={s.cardBodyLight}>
              One operational system for work orders, assets, inspections, inventory, and planning.
            </Text>
            <Text style={s.cardLinkLight}>Visit districtforge.app →</Text>
          </Pressable>

          <Pressable
            onPress={() => Linking.openURL("https://dadmark.app")}
            style={({ pressed }) => [s.card, s.cardWarm, pressed && s.pressed]}
          >
            <Text style={s.cardMetaDark}>02  ·  Fatherhood</Text>
            <Text style={[s.cardTitleDark, compact && s.cardTitleCompact]}>Dadmark</Text>
            <Text style={s.cardBodyDark}>
              Realistic, age-aware ideas that help dads use the time they have.
            </Text>
            <Text style={s.cardLinkDark}>Visit dadmark.app →</Text>
          </Pressable>
        </View>

        <View nativeID="contact" style={s.contact}>
          <Text style={s.kicker}>Contact</Text>
          <Text style={[s.sectionTitle, compact && s.sectionTitleCompact]}>Let’s talk about it.</Text>

          <View style={s.form}>
            <TextInput accessibilityLabel="Your name" onChangeText={setName} placeholder="Name" placeholderTextColor="#8A8A8A" style={s.input} value={name} />
            <TextInput accessibilityLabel="Your email" autoCapitalize="none" keyboardType="email-address" onChangeText={setEmail} placeholder="Email" placeholderTextColor="#8A8A8A" style={s.input} value={email} />
            <TextInput accessibilityLabel="Your message" multiline onChangeText={setMessage} placeholder="What are you working through?" placeholderTextColor="#8A8A8A" style={[s.input, s.textarea]} textAlignVertical="top" value={message} />
            {status === "error" ? <Text style={s.err}>{error}</Text> : null}
            {status === "success" ? <Text style={s.ok}>Sent. I’ll get back to you soon.</Text> : null}
            <Pressable disabled={status === "sending"} onPress={submit} style={s.submit}>
              <Text style={s.submitText}>{status === "sending" ? "Sending..." : "Send message"}</Text>
            </Pressable>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>© {new Date().getFullYear()} Jared Rachlin</Text>
          <Text style={s.footerText}>New York</Text>
        </View>
      </ScrollView>
    </>
  );
}

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: C.bg },
  pageContent: { paddingBottom: 40 },
  screen: {
    width: "100%",
    justifyContent: "space-between",
  },
  nav: {
    width: "100%",
    maxWidth: 1320,
    alignSelf: "center",
    paddingHorizontal: 36,
    minHeight: 88,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navCompact: { paddingHorizontal: 20 },
  mark: { fontSize: 18, fontWeight: "800", letterSpacing: -0.6, color: C.ink },
  navLinks: { flexDirection: "row", alignItems: "center", gap: 28 },
  navText: { fontSize: 14, color: C.ink, fontWeight: "500" },
  navCta: { backgroundColor: C.black, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 },
  navCtaText: { color: C.white, fontSize: 13, fontWeight: "600" },
  hero: {
    flex: 1,
    width: "100%",
    maxWidth: 1320,
    alignSelf: "center",
    paddingHorizontal: 36,
    paddingBottom: 36,
    justifyContent: "space-between",
  },
  heroTop: { marginTop: 8 },
  avail: { flexDirection: "row", alignItems: "center", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 99, backgroundColor: "#1F9D55" },
  availText: { fontSize: 13, fontWeight: "600", color: C.ink },
  heroStage: {
    flex: 1,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    minHeight: 360,
  },
  huge: {
    fontWeight: "800",
    letterSpacing: -8,
    color: C.ink,
    textAlign: "center",
    zIndex: 1,
  },
  cutout: { position: "absolute", zIndex: 2 },
  heroBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 24,
    paddingTop: 12,
  },
  heroBottomCompact: { flexDirection: "column", alignItems: "flex-start" },
  lede: { maxWidth: 420, fontSize: 18, lineHeight: 26, color: C.mute },
  textLink: { paddingVertical: 6 },
  textLinkLabel: { fontSize: 15, fontWeight: "600", color: C.ink },
  about: { maxWidth: 900, width: "100%", alignSelf: "center", paddingHorizontal: 28, paddingVertical: 90 },
  aboutCompact: { paddingHorizontal: 20, paddingVertical: 56 },
  kicker: { fontSize: 12, fontWeight: "700", letterSpacing: 1.4, textTransform: "uppercase", color: C.mute, marginBottom: 16 },
  aboutTitle: { fontSize: 42, lineHeight: 48, fontWeight: "700", letterSpacing: -1.6, color: C.ink, marginBottom: 22 },
  aboutTitleCompact: { fontSize: 30, lineHeight: 36, letterSpacing: -0.8 },
  aboutBody: { fontSize: 18, lineHeight: 28, color: C.mute, maxWidth: 640 },
  work: { maxWidth: 1180, width: "100%", alignSelf: "center", paddingHorizontal: 28, paddingBottom: 80 },
  sectionTitle: { fontSize: 48, lineHeight: 54, fontWeight: "700", letterSpacing: -1.8, color: C.ink, marginBottom: 32 },
  sectionTitleCompact: { fontSize: 32, lineHeight: 38, letterSpacing: -1 },
  card: { borderRadius: 28, padding: 36, marginBottom: 20 },
  cardDark: { backgroundColor: "#111820" },
  cardWarm: { backgroundColor: "#EFE6D8" },
  cardMetaLight: { color: "#9BB0C7", fontSize: 13, fontWeight: "600", marginBottom: 14 },
  cardMetaDark: { color: "#8A6F4A", fontSize: 13, fontWeight: "600", marginBottom: 14 },
  cardTitleLight: { color: C.white, fontSize: 44, fontWeight: "800", letterSpacing: -1.6, marginBottom: 12 },
  cardTitleDark: { color: C.ink, fontSize: 44, fontWeight: "800", letterSpacing: -1.6, marginBottom: 12 },
  cardTitleCompact: { fontSize: 32 },
  cardBodyLight: { color: "#C5D0DC", fontSize: 17, lineHeight: 26, maxWidth: 520, marginBottom: 22 },
  cardBodyDark: { color: "#6D6256", fontSize: 17, lineHeight: 26, maxWidth: 520, marginBottom: 22 },
  cardLinkLight: { color: C.white, fontSize: 15, fontWeight: "600" },
  cardLinkDark: { color: C.ink, fontSize: 15, fontWeight: "600" },
  contact: { maxWidth: 720, width: "100%", alignSelf: "center", paddingHorizontal: 28, paddingVertical: 80 },
  form: { gap: 14 },
  input: { minHeight: 54, borderRadius: 14, borderWidth: 1, borderColor: C.line, backgroundColor: C.white, paddingHorizontal: 16, fontSize: 16, color: C.ink },
  textarea: { minHeight: 140, paddingTop: 14 },
  err: { color: "#C03232", fontSize: 13 },
  ok: { color: "#1F7A45", fontSize: 13 },
  submit: { alignSelf: "flex-start", backgroundColor: C.black, borderRadius: 999, paddingHorizontal: 22, paddingVertical: 14, marginTop: 6 },
  submitText: { color: C.white, fontWeight: "600", fontSize: 15 },
  footer: { maxWidth: 1180, width: "100%", alignSelf: "center", paddingHorizontal: 28, paddingVertical: 28, flexDirection: "row", justifyContent: "space-between" },
  footerText: { fontSize: 13, color: C.mute },
  pressed: { opacity: 0.92 },
});
