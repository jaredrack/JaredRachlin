import { Feather } from "@expo/vector-icons";
import { DadmarkLogo } from "../components/dadmark-logo";
import { DistrictForgeLogo } from "../components/districtforge-logo";
import Head from "expo-router/head";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, useWindowDimensions, View } from "react-native";

const colors = {
  ink: "#0B1220",
  navy: "#10233D",
  blue: "#2176D9",
  blueDark: "#155FB7",
  pale: "#EAF3FF",
  line: "#D8E3F0",
  slate: "#60738D",
  white: "#FFFFFF",
};

const principles = [
  {
    number: "01",
    title: "Start with the real problem",
    text: "The strongest products begin with how people actually work—not with a list of features.",
  },
  {
    number: "02",
    title: "Make the complex feel clear",
    text: "Thoughtful structure and direct language should make powerful software feel approachable.",
  },
  {
    number: "03",
    title: "Keep improving in public",
    text: "Feedback belongs inside the build process, where it can shape what gets made next.",
  },
];

export default function PersonalLandingPage() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const compact = width < 760;
  const narrow = width < 480;
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactStatus, setContactStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [contactError, setContactError] = useState("");

  async function submitContact() {
    if (!contactName.trim() || !/^\S+@\S+\.\S+$/.test(contactEmail.trim()) || !contactMessage.trim()) {
      setContactError("Enter your name, a valid email, and a message.");
      setContactStatus("error");
      return;
    }

    setContactStatus("sending");
    setContactError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: contactName, email: contactEmail, message: contactMessage, website: "" }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || "The message could not be sent.");

      setContactStatus("success");
      setContactName("");
      setContactEmail("");
      setContactMessage("");
    } catch (error) {
      setContactStatus("error");
      setContactError(error instanceof Error ? error.message : "The message could not be sent.");
    }
  }

  return (
    <>
      <Head>
        <title>Jared Rachlin | Product Builder</title>
        <meta
          name="description"
          content="Jared Rachlin builds practical digital products around real problems, including Dadmark and DistrictForge."
        />
        <meta property="og:title" content="Jared Rachlin | Product Builder" />
        <meta
          property="og:description"
          content="Practical software, built around real problems."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jaredrachlin.dev" />
      </Head>

      <ScrollView style={styles.page} contentContainerStyle={styles.pageContent}>
        <View style={styles.navWrap}>
          <View style={styles.nav}>
            <Pressable accessibilityRole="link" onPress={() => router.replace("/")} style={styles.wordmark}>
              <View style={styles.wordmarkDot} />
              <Text style={styles.wordmarkText}>JARED RACHLIN</Text>
            </Pressable>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel="Jump to selected work"
              onPress={() => {
                if (typeof document !== "undefined") document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
              }}
              style={({ pressed }) => [styles.navButton, pressed && styles.pressed]}
            >
              <Text style={styles.navButtonText}>{narrow ? "WORK" : "SELECTED WORK"}</Text>
              <Feather name="arrow-down" size={15} color={colors.navy} />
            </Pressable>
          </View>
        </View>

        <View style={[styles.hero, compact && styles.heroCompact]}>
          <View style={[styles.heroCopy, compact && styles.heroCopyCompact]}>
            <View style={styles.eyebrowRow}>
              <View style={styles.eyebrowLine} />
              <Text style={styles.eyebrow}>INDEPENDENT PRODUCT BUILDER</Text>
            </View>
            <Text style={[styles.heroTitle, compact && styles.heroTitleCompact, narrow && styles.heroTitleNarrow]}>
              I build practical software around problems worth solving.
            </Text>
            <Text style={[styles.heroBody, compact && styles.heroBodyCompact]}>
              I’m Jared—a dad, night-shift worker, and self-taught builder turning everyday friction into focused digital products.
            </Text>
            <View style={[styles.heroActions, narrow && styles.heroActionsNarrow]}>
              <Pressable
                accessibilityRole="link"
                onPress={() => {
                  if (typeof document !== "undefined") document.getElementById("work")?.scrollIntoView({ behavior: "smooth" });
                }}
                style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}
              >
                <Text style={styles.primaryButtonText}>Explore my work</Text>
                <Feather name="arrow-down-right" size={18} color={colors.white} />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={() => {
                  if (typeof document !== "undefined") document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}
              >
                <Text style={styles.secondaryButtonText}>Start a conversation</Text>
              </Pressable>
            </View>
          </View>

          <View style={[styles.portraitFrame, compact && styles.portraitFrameCompact]}>
            <View style={styles.portraitAccent} />
            <Image
              source={{ uri: "/jared-rachlin-portrait.jpg" }}
              accessibilityLabel="Portrait of Jared Rachlin"
              resizeMode="cover"
              style={styles.portrait}
            />
            <View style={styles.portraitCaption}>
              <View>
                <Text style={styles.portraitName}>Jared Rachlin</Text>
                <Text style={styles.portraitMeta}>New York · Building in public</Text>
              </View>
              <View style={styles.availablePill}>
                <View style={styles.availableDot} />
                <Text style={styles.availableText}>BUILDING</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statementSection}>
          <Text style={styles.sectionKicker}>WHAT I DO</Text>
          <Text style={[styles.statement, compact && styles.statementCompact]}>
            I learn by making—researching a problem, shaping the product, building the experience, and improving it with the people who will use it.
          </Text>
          <View style={[styles.capabilityRow, compact && styles.capabilityRowCompact]}>
            {[
              ["compass", "Product direction"],
              ["layout", "Experience design"],
              ["code", "Web applications"],
              ["message-circle", "Community feedback"],
            ].map(([icon, label]) => (
              <View key={label} style={styles.capability}>
                <Feather name={icon as any} size={18} color={colors.blue} />
                <Text style={styles.capabilityText}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View nativeID="work" style={styles.workSection}>
          <View style={[styles.sectionHeadingRow, compact && styles.sectionHeadingRowCompact]}>
            <View>
              <Text style={styles.sectionKicker}>SELECTED WORK</Text>
              <Text style={[styles.sectionTitle, compact && styles.sectionTitleCompact]}>Products in progress.</Text>
            </View>
            <Text style={styles.sectionAside}>Built from direct experience and shaped through real feedback.</Text>
          </View>

          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Open DistrictForge"
            onPress={() => {
  if (typeof window !== "undefined") {
    window.location.href = "/districtforge";
  }
}}
            style={({ pressed }) => [styles.projectCard, styles.districtCard, pressed && styles.projectPressed]}
          >
            <View style={[styles.projectTop, compact && styles.projectTopCompact]}>
              <View style={styles.projectMark}>
                <DistrictForgeLogo size={31} />
              </View>
              <View style={styles.projectStatus}>
                <View style={styles.statusDot} />
                <Text style={styles.projectStatusText}>ACTIVE PROTOTYPE</Text>
              </View>
            </View>
            <View style={[styles.projectBody, compact && styles.projectBodyCompact]}>
              <View style={styles.projectCopy}>
                <Text style={styles.projectLabel}>SCHOOL FACILITIES OPERATIONS</Text>
                <Text style={[styles.projectTitle, compact && styles.projectTitleCompact]}>DistrictForge</Text>
                <Text style={styles.projectDescription}>
                  One operational system for work orders, assets, inspections, inventory, purchasing, budgets, facility use, and long-range planning.
                </Text>
              </View>
              <View style={styles.projectLink}>
                <Text style={styles.projectLinkText}>View project</Text>
                <Feather name="arrow-up-right" size={20} color={colors.white} />
              </View>
            </View>
            <View style={styles.projectGrid} pointerEvents="none">
              <View style={[styles.gridLine, { top: "33%" }]} />
              <View style={[styles.gridLine, { top: "66%" }]} />
              <View style={[styles.gridLineVertical, { left: "62%" }]} />
              <View style={[styles.gridLineVertical, { left: "81%" }]} />
            </View>
          </Pressable>

          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Open Dadmark"
            onPress={() => Linking.openURL("https://dadmark.app")}
            style={({ pressed }) => [styles.projectCard, styles.dadmarkCard, pressed && styles.projectPressed]}
          >
            <View style={[styles.projectTop, compact && styles.projectTopCompact]}>
              <View style={styles.dadmarkMark}>
                <DadmarkLogo size={48} />
              </View>
              <View style={[styles.projectStatus, styles.projectStatusWarm]}>
                <View style={[styles.statusDot, styles.statusDotWarm]} />
                <Text style={[styles.projectStatusText, styles.projectStatusTextWarm]}>PRIVATE BETA</Text>
              </View>
            </View>
            <View style={[styles.projectBody, compact && styles.projectBodyCompact]}>
              <View style={styles.projectCopy}>
                <Text style={[styles.projectLabel, styles.projectLabelWarm]}>FATHERHOOD · CONNECTION · TRADITIONS</Text>
                <Text style={[styles.projectTitle, styles.projectTitleDark, compact && styles.projectTitleCompact]}>Dadmark</Text>
                <Text style={[styles.projectDescription, styles.projectDescriptionDark]}>
                  Realistic, age-aware ideas that help dads use the time they have to create stronger connections and lasting family traditions.
                </Text>
              </View>
              <View style={[styles.projectLink, styles.projectLinkWarm]}>
                <Text style={[styles.projectLinkText, styles.projectLinkTextDark]}>Visit Dadmark</Text>
                <Feather name="arrow-up-right" size={20} color="#17130F" />
              </View>
            </View>
          </Pressable>
        </View>

        <View style={styles.processSection}>
          <View style={[styles.sectionHeadingRow, compact && styles.sectionHeadingRowCompact]}>
            <View>
              <Text style={styles.sectionKicker}>HOW I WORK</Text>
              <Text style={[styles.sectionTitle, compact && styles.sectionTitleCompact]}>Simple principles. Serious intent.</Text>
            </View>
          </View>
          <View style={[styles.principlesGrid, compact && styles.principlesGridCompact]}>
            {principles.map((item) => (
              <View key={item.number} style={styles.principleCard}>
                <Text style={styles.principleNumber}>{item.number}</Text>
                <Text style={styles.principleTitle}>{item.title}</Text>
                <Text style={styles.principleText}>{item.text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View nativeID="contact" style={styles.contactSection}>
          <Text style={styles.contactKicker}>HAVE A PROBLEM WORTH SOLVING?</Text>
          <Text style={[styles.contactTitle, compact && styles.contactTitleCompact]}>Let’s talk about it.</Text>
          <Text style={styles.contactBody}>
            I’m always interested in useful ideas, candid feedback, and conversations with people close to the problem.
          </Text>
          <View style={styles.contactForm}>
            <View style={[styles.contactFieldRow, narrow && styles.contactFieldRowNarrow]}>
              <View style={styles.contactFieldGroup}>
                <Text style={styles.contactLabel}>NAME</Text>
                <TextInput
                  accessibilityLabel="Your name"
                  autoComplete="name"
                  onChangeText={setContactName}
                  placeholder="Your name"
                  placeholderTextColor="#7F90A5"
                  style={styles.contactInput}
                  value={contactName}
                />
              </View>
              <View style={styles.contactFieldGroup}>
                <Text style={styles.contactLabel}>EMAIL</Text>
                <TextInput
                  accessibilityLabel="Your email address"
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  onChangeText={setContactEmail}
                  placeholder="you@example.com"
                  placeholderTextColor="#7F90A5"
                  style={styles.contactInput}
                  value={contactEmail}
                />
              </View>
            </View>
            <View style={styles.contactFieldGroup}>
              <Text style={styles.contactLabel}>MESSAGE</Text>
              <TextInput
                accessibilityLabel="Your message"
                multiline
                onChangeText={setContactMessage}
                placeholder="Tell me what you are working through..."
                placeholderTextColor="#7F90A5"
                style={[styles.contactInput, styles.contactMessageInput]}
                textAlignVertical="top"
                value={contactMessage}
              />
            </View>
            {contactStatus === "error" ? <Text accessibilityRole="alert" style={styles.contactError}>{contactError}</Text> : null}
            {contactStatus === "success" ? (
              <View accessibilityRole="alert" style={styles.contactSuccess}>
                <Feather name="check-circle" size={18} color="#5ED49A" />
                <Text style={styles.contactSuccessText}>Message sent. I’ll get back to you soon.</Text>
              </View>
            ) : null}
            <View style={[styles.contactFormFooter, narrow && styles.contactFormFooterNarrow]}>
              <Text style={styles.contactDestination}>Delivered privately to jaredrachlin@gmail.com</Text>
              <Pressable
                accessibilityRole="button"
                disabled={contactStatus === "sending"}
                onPress={submitContact}
                style={({ pressed }) => [styles.contactButton, pressed && styles.pressed, contactStatus === "sending" && styles.contactButtonDisabled]}
              >
                <Text style={styles.contactButtonText}>{contactStatus === "sending" ? "Sending..." : "Send message"}</Text>
                <Feather name="send" size={17} color={colors.white} />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={[styles.footer, compact && styles.footerCompact]}>
          <Text style={styles.footerName}>JARED RACHLIN</Text>
          <Text style={styles.footerText}>Designing, building, and learning in public.</Text>
          <Text style={styles.footerText}>© 2026</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.white },
  pageContent: { minHeight: "100%" },
  navWrap: { borderBottomWidth: 1, borderBottomColor: colors.line, backgroundColor: colors.white },
  nav: { width: "100%", maxWidth: 1240, alignSelf: "center", minHeight: 82, paddingHorizontal: 28, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  wordmark: { flexDirection: "row", alignItems: "center", gap: 11 },
  wordmarkDot: { width: 12, height: 12, backgroundColor: colors.blue, borderRadius: 2, transform: [{ rotate: "45deg" }] },
  wordmarkText: { color: colors.navy, fontSize: 15, fontWeight: "900", letterSpacing: 2.1 },
  navButton: { height: 42, paddingHorizontal: 18, borderWidth: 1, borderColor: colors.line, borderRadius: 99, flexDirection: "row", alignItems: "center", gap: 8 },
  navButtonText: { color: colors.navy, fontSize: 12, fontWeight: "900", letterSpacing: 1.2 },
  hero: { width: "100%", maxWidth: 1240, alignSelf: "center", paddingHorizontal: 28, paddingVertical: 84, flexDirection: "row", gap: 76, alignItems: "center" },
  heroCompact: { paddingTop: 48, paddingBottom: 64, flexDirection: "column", gap: 42, alignItems: "stretch" },
  heroCopy: { flex: 1.16, minWidth: 0 },
  heroCopyCompact: {
    width: "100%",
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
  },
  eyebrowRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 26 },
  eyebrowLine: { width: 32, height: 2, backgroundColor: colors.blue },
  eyebrow: { color: colors.blue, fontSize: 12, lineHeight: 16, fontWeight: "900", letterSpacing: 2.1 },
  heroTitle: { color: colors.ink, fontSize: 66, lineHeight: 70, letterSpacing: -3.2, fontWeight: "900", maxWidth: 720 },
  heroTitleCompact: { fontSize: 49, lineHeight: 53, letterSpacing: -2.3 },
  heroTitleNarrow: { fontSize: 39, lineHeight: 43, letterSpacing: -1.7 },
  heroBody: { color: colors.slate, fontSize: 20, lineHeight: 32, maxWidth: 610, marginTop: 28 },
  heroBodyCompact: { fontSize: 18, lineHeight: 29 },
  heroActions: { flexDirection: "row", gap: 12, marginTop: 34, flexWrap: "wrap" },
  heroActionsNarrow: { flexDirection: "column" },
  primaryButton: { minHeight: 54, paddingHorizontal: 22, borderRadius: 8, backgroundColor: colors.blue, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 18 },
  primaryButtonText: { color: colors.white, fontSize: 15, fontWeight: "800" },
  secondaryButton: { minHeight: 54, paddingHorizontal: 22, borderRadius: 8, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" },
  secondaryButtonText: { color: colors.navy, fontSize: 15, fontWeight: "800" },
  portraitFrame: { flex: 0.84, minWidth: 340, maxWidth: 450, height: 570, backgroundColor: colors.pale, padding: 12, position: "relative" },
  portraitFrameCompact: {
    width: "100%",
    minWidth: 0,
    maxWidth: 560,
    height: 560,
    alignSelf: "center",
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
  },
  portraitAccent: { position: "absolute", right: -16, top: -16, width: 116, height: 116, borderTopWidth: 4, borderRightWidth: 4, borderColor: colors.blue },
  portrait: { width: "100%", height: "100%", backgroundColor: "#C9D1DA" },
  portraitCaption: { position: "absolute", left: 28, right: 28, bottom: 28, minHeight: 78, paddingHorizontal: 18, paddingVertical: 15, backgroundColor: "rgba(11,18,32,0.90)", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  portraitName: { color: colors.white, fontSize: 16, fontWeight: "900" },
  portraitMeta: { color: "#BFD0E5", fontSize: 11, marginTop: 5 },
  availablePill: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderColor: "rgba(255,255,255,0.18)", paddingHorizontal: 10, paddingVertical: 7, borderRadius: 99 },
  availableDot: { width: 7, height: 7, borderRadius: 99, backgroundColor: "#5ED49A" },
  availableText: { color: colors.white, fontSize: 9, fontWeight: "900", letterSpacing: 1.3 },
  statementSection: { backgroundColor: colors.pale, paddingHorizontal: 28, paddingVertical: 84, alignItems: "center" },
  sectionKicker: { color: colors.blue, fontSize: 11, fontWeight: "900", letterSpacing: 2.2, marginBottom: 18 },
  statement: { color: colors.navy, fontSize: 36, lineHeight: 49, letterSpacing: -1.1, fontWeight: "800", textAlign: "center", maxWidth: 930 },
  statementCompact: { fontSize: 28, lineHeight: 39 },
  capabilityRow: { width: "100%", maxWidth: 930, marginTop: 44, paddingTop: 28, borderTopWidth: 1, borderTopColor: "#C8DAEE", flexDirection: "row", justifyContent: "space-between", gap: 18 },
  capabilityRowCompact: { flexWrap: "wrap", justifyContent: "center" },
  capability: { flexDirection: "row", alignItems: "center", gap: 9 },
  capabilityText: { color: colors.slate, fontSize: 13, fontWeight: "700" },
  workSection: { width: "100%", maxWidth: 1240, alignSelf: "center", paddingHorizontal: 28, paddingVertical: 96 },
  sectionHeadingRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 40, marginBottom: 42 },
  sectionHeadingRowCompact: { flexDirection: "column", alignItems: "flex-start", gap: 14 },
  sectionTitle: { color: colors.ink, fontSize: 44, lineHeight: 50, fontWeight: "900", letterSpacing: -1.8 },
  sectionTitleCompact: { fontSize: 34, lineHeight: 40 },
  sectionAside: { color: colors.slate, fontSize: 15, lineHeight: 24, maxWidth: 390 },
  projectCard: { overflow: "hidden", borderRadius: 18, minHeight: 390, marginBottom: 24, padding: 34, position: "relative" },
  districtCard: { backgroundColor: colors.navy },
  dadmarkCard: { backgroundColor: "#EEE6D8" },
  projectPressed: { transform: [{ scale: 0.994 }], opacity: 0.95 },
  projectTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 18, zIndex: 2 },
  projectTopCompact: { alignItems: "flex-start" },
  projectMark: { width: 54, height: 54, borderRadius: 13, backgroundColor: colors.white, alignItems: "center", justifyContent: "center" },
  projectStatus: { flexDirection: "row", alignItems: "center", gap: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.20)", borderRadius: 99, paddingHorizontal: 12, paddingVertical: 8 },
  projectStatusWarm: { borderColor: "rgba(23,19,15,0.16)" },
  statusDot: { width: 7, height: 7, borderRadius: 99, backgroundColor: "#62D59A" },
  statusDotWarm: { backgroundColor: "#AD7B3A" },
  projectStatusText: { color: colors.white, fontSize: 9, fontWeight: "900", letterSpacing: 1.4 },
  projectStatusTextWarm: { color: "#5E4930" },
  projectBody: { flex: 1, marginTop: 72, flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 40, zIndex: 2 },
  projectBodyCompact: { marginTop: 54, flexDirection: "column", alignItems: "flex-start", gap: 30 },
  projectCopy: { maxWidth: 720 },
  projectLabel: { color: "#91C4FA", fontSize: 10, fontWeight: "900", letterSpacing: 2.1, marginBottom: 12 },
  projectLabelWarm: { color: "#8C6536" },
  projectTitle: { color: colors.white, fontSize: 54, lineHeight: 60, fontWeight: "900", letterSpacing: -2 },
  projectTitleCompact: { fontSize: 42, lineHeight: 48 },
  projectTitleDark: { color: "#17130F" },
  projectDescription: { color: "#C7D7E9", fontSize: 17, lineHeight: 28, marginTop: 16, maxWidth: 690 },
  projectDescriptionDark: { color: "#655B50" },
  projectLink: { minHeight: 52, flexDirection: "row", alignItems: "center", gap: 15, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.45)", paddingBottom: 10 },
  projectLinkWarm: { borderBottomColor: "rgba(23,19,15,0.35)" },
  projectLinkText: { color: colors.white, fontSize: 14, fontWeight: "900" },
  projectLinkTextDark: { color: "#17130F" },
  projectGrid: { ...StyleSheet.absoluteFillObject, opacity: 0.12 },
  gridLine: { position: "absolute", left: 0, right: 0, height: 1, backgroundColor: colors.white },
  gridLineVertical: { position: "absolute", top: 0, bottom: 0, width: 1, backgroundColor: colors.white },
  dadmarkMark: { width: 54, height: 54, borderRadius: 13, backgroundColor: "#17130F", alignItems: "center", justifyContent: "center", overflow: "hidden" },
  processSection: { backgroundColor: "#F7F9FC", paddingHorizontal: 28, paddingVertical: 92 },
  principlesGrid: { width: "100%", maxWidth: 1184, alignSelf: "center", flexDirection: "row", gap: 18 },
  principlesGridCompact: { flexDirection: "column" },
  principleCard: { flex: 1, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line, padding: 28, minHeight: 240 },
  principleNumber: { color: colors.blue, fontSize: 11, fontWeight: "900", letterSpacing: 2, marginBottom: 44 },
  principleTitle: { color: colors.navy, fontSize: 22, lineHeight: 28, fontWeight: "900", letterSpacing: -0.5 },
  principleText: { color: colors.slate, fontSize: 15, lineHeight: 24, marginTop: 14 },
  contactSection: { backgroundColor: colors.ink, paddingHorizontal: 28, paddingVertical: 100, alignItems: "center" },
  contactKicker: { color: "#77B9FF", fontSize: 11, fontWeight: "900", letterSpacing: 2.1 },
  contactTitle: { color: colors.white, fontSize: 60, lineHeight: 66, fontWeight: "900", letterSpacing: -2.4, marginTop: 19 },
  contactTitleCompact: { fontSize: 42, lineHeight: 48 },
  contactBody: { color: "#A9B8CA", fontSize: 17, lineHeight: 28, textAlign: "center", maxWidth: 650, marginTop: 18 },
  contactForm: { width: "100%", maxWidth: 760, marginTop: 42, borderWidth: 1, borderColor: "rgba(255,255,255,0.16)", borderRadius: 20, padding: 24, gap: 20, backgroundColor: "rgba(255,255,255,0.035)" },
  contactFieldRow: { flexDirection: "row", gap: 18 },
  contactFieldRowNarrow: { flexDirection: "column" },
  contactFieldGroup: { flex: 1, gap: 9 },
  contactLabel: { color: "#8FC4FF", fontSize: 10, fontWeight: "900", letterSpacing: 1.8 },
  contactInput: { minHeight: 54, borderWidth: 1, borderColor: "rgba(255,255,255,0.20)", borderRadius: 10, backgroundColor: "#101A2A", color: colors.white, fontSize: 16, paddingHorizontal: 16, paddingVertical: 13 },
  contactMessageInput: { minHeight: 150 },
  contactError: { color: "#FF9D9D", fontSize: 13, lineHeight: 19 },
  contactSuccess: { flexDirection: "row", alignItems: "center", gap: 9 },
  contactSuccessText: { color: "#CDEBDB", fontSize: 13, lineHeight: 19 },
  contactFormFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 18 },
  contactFormFooterNarrow: { flexDirection: "column", alignItems: "stretch" },
  contactDestination: { color: "#8C9DB2", fontSize: 12, lineHeight: 18 },
  contactButton: { minHeight: 54, borderWidth: 1, borderColor: "rgba(255,255,255,0.24)", borderRadius: 99, paddingHorizontal: 22, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12, backgroundColor: colors.blue },
  contactButtonDisabled: { opacity: 0.55 },
  contactButtonText: { color: colors.white, fontSize: 14, fontWeight: "800" },
  footer: { minHeight: 100, maxWidth: 1240, width: "100%", alignSelf: "center", paddingHorizontal: 28, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 20 },
  footerCompact: { paddingVertical: 28, flexDirection: "column", alignItems: "flex-start" },
  footerName: { color: colors.navy, fontSize: 12, fontWeight: "900", letterSpacing: 1.8 },
  footerText: { color: colors.slate, fontSize: 12 },
  pressed: { opacity: 0.75 },
});
