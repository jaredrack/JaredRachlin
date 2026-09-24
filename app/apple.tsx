import { Feather } from "@expo/vector-icons";
import { DadmarkLogo } from "../components/dadmark-logo";
import { DistrictForgeLogo } from "../components/districtforge-logo";
import Head from "expo-router/head";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";

const colors = {
  black: "#000000",
  ink: "#1D1D1F",
  secondary: "#6E6E73",
  tertiary: "#86868B",
  line: "#D2D2D7",
  softLine: "#E8E8ED",
  surface: "#F5F5F7",
  surfaceAlt: "#FBFBFD",
  white: "#FFFFFF",
  blue: "#0071E3",
  blueHover: "#0077ED",
};

const principles = [
  {
    number: "01",
    title: "Start with the real problem.",
    text: "The strongest products begin with how people actually work—not with a list of features.",
  },
  {
    number: "02",
    title: "Make the complex feel clear.",
    text: "Thoughtful structure and direct language should make powerful software feel approachable.",
  },
  {
    number: "03",
    title: "Keep improving in public.",
    text: "Feedback belongs inside the build process, where it can shape what gets made next.",
  },
];

export default function PersonalLandingPage() {
  const { width } = useWindowDimensions();
  const router = useRouter();

  const compact = width < 840;
  const narrow = width < 560;

  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactStatus, setContactStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [contactError, setContactError] = useState("");

  function scrollTo(id: string) {
    if (typeof document !== "undefined") {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  async function submitContact() {
    if (
      !contactName.trim() ||
      !/^\S+@\S+\.\S+$/.test(contactEmail.trim()) ||
      !contactMessage.trim()
    ) {
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
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          message: contactMessage,
          website: "",
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || "The message could not be sent.");
      }

      setContactStatus("success");
      setContactName("");
      setContactEmail("");
      setContactMessage("");
    } catch (error) {
      setContactStatus("error");
      setContactError(
        error instanceof Error
          ? error.message
          : "The message could not be sent."
      );
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

        <meta
          property="og:title"
          content="Jared Rachlin | Product Builder"
        />

        <meta
          property="og:description"
          content="Practical software, built around real problems."
        />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://jaredrachlin.dev" />
      </Head>

      <ScrollView
        style={styles.page}
        contentContainerStyle={styles.pageContent}
        showsVerticalScrollIndicator={false}
      >
        {/* NAV */}
        <View
          style={[
            styles.navShell,
            Platform.OS === "web" ? (styles.webSticky as any) : null,
          ]}
        >
          <View style={styles.nav}>
            <Pressable
              accessibilityRole="link"
              onPress={() => router.replace("/")}
              style={({ pressed }) => [
                styles.wordmark,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.wordmarkText}>Jared Rachlin</Text>
            </Pressable>

            <View style={styles.navLinks}>
              {!narrow ? (
                <Pressable
                  accessibilityRole="link"
                  onPress={() => scrollTo("work")}
                  style={({ pressed }) => [
                    styles.navLink,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.navLinkText}>Work</Text>
                </Pressable>
              ) : null}

              {!narrow ? (
                <Pressable
                  accessibilityRole="link"
                  onPress={() => scrollTo("about")}
                  style={({ pressed }) => [
                    styles.navLink,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.navLinkText}>About</Text>
                </Pressable>
              ) : null}

              <Pressable
                accessibilityRole="link"
                onPress={() => scrollTo("contact")}
                style={({ pressed }) => [
                  styles.navLink,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.navLinkText}>Contact</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* HERO */}
        <View style={[styles.hero, compact && styles.heroCompact]}>
          <View style={styles.heroInner}>
            <Text style={styles.heroEyebrow}>Independent product builder</Text>

            <Text
              style={[
                styles.heroTitle,
                compact && styles.heroTitleCompact,
                narrow && styles.heroTitleNarrow,
              ]}
            >
              I build software around problems worth solving.
            </Text>

            <Text
              style={[
                styles.heroBody,
                compact && styles.heroBodyCompact,
              ]}
            >
              I’m Jared—a dad, night-shift worker, and self-taught builder
              turning everyday friction into focused digital products.
            </Text>

            <View
              style={[
                styles.heroActions,
                narrow && styles.heroActionsNarrow,
              ]}
            >
              <Pressable
                accessibilityRole="link"
                onPress={() => scrollTo("work")}
                style={({ pressed, hovered }: any) => [
                  styles.blueLink,
                  hovered && styles.blueLinkHovered,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.blueLinkText}>Explore my work</Text>
                <Feather
                  name="chevron-right"
                  size={18}
                  color={colors.blue}
                />
              </Pressable>

              <Pressable
                accessibilityRole="link"
                onPress={() => scrollTo("contact")}
                style={({ pressed }) => pressed && styles.pressed}
              >
                <Text style={styles.secondaryHeroLink}>
                  Start a conversation
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* PORTRAIT / INTRO */}
        <View style={styles.introSection}>
          <View
            style={[
              styles.introInner,
              compact && styles.introInnerCompact,
            ]}
          >
            <View
              style={[
                styles.portraitWrap,
                compact && styles.portraitWrapCompact,
              ]}
            >
              <Image
                source={{ uri: "/jared-rachlin-portrait.jpg" }}
                accessibilityLabel="Portrait of Jared Rachlin"
                resizeMode="cover"
                style={styles.portrait}
              />
            </View>

            <View style={styles.introCopy}>
              <Text style={styles.sectionEyebrow}>What I do</Text>

              <Text
                style={[
                  styles.introTitle,
                  compact && styles.introTitleCompact,
                ]}
              >
                Learn the problem. Shape the product. Build the experience.
              </Text>

              <Text style={styles.introBody}>
                I learn by making—researching a problem, shaping the product,
                building the experience, and improving it with the people who
                will use it.
              </Text>

              <View style={styles.capabilityList}>
                {[
                  "Product direction",
                  "Experience design",
                  "Web applications",
                  "Community feedback",
                ].map((item) => (
                  <View key={item} style={styles.capabilityItem}>
                    <View style={styles.capabilityDot} />
                    <Text style={styles.capabilityText}>{item}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* WORK HEADER */}
        <View nativeID="work" style={styles.workSection}>
          <View style={styles.sectionIntro}>
            <Text style={styles.sectionEyebrow}>Selected work</Text>

            <Text
              style={[
                styles.sectionTitle,
                compact && styles.sectionTitleCompact,
              ]}
            >
              Products in progress.
            </Text>

            <Text style={styles.sectionDescription}>
              Built from direct experience and shaped through real feedback.
            </Text>
          </View>

          {/* DISTRICTFORGE */}
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Open DistrictForge"
            onPress={() => {
              if (typeof window !== "undefined") {
                window.location.href = "/districtforge";
              }
            }}
            style={({ pressed }) => [
              styles.projectCard,
              styles.districtCard,
              pressed && styles.projectPressed,
            ]}
          >
            <View
              style={[
                styles.projectInner,
                compact && styles.projectInnerCompact,
              ]}
            >
              <View style={styles.projectCopy}>
                <View style={styles.projectMetaRow}>
                  <View style={styles.projectLogoWhite}>
                    <DistrictForgeLogo size={34} />
                  </View>

                  <Text style={styles.projectStatusLight}>
                    Active prototype
                  </Text>
                </View>

                <Text style={styles.projectCategoryLight}>
                  School facilities operations
                </Text>

                <Text
                  style={[
                    styles.projectTitleLight,
                    compact && styles.projectTitleCompact,
                  ]}
                >
                  DistrictForge
                </Text>

                <Text style={styles.projectDescriptionLight}>
                  One operational system for work orders, assets, inspections,
                  inventory, purchasing, budgets, facility use, and long-range
                  planning.
                </Text>

                <View style={styles.projectLinkRow}>
                  <Text style={styles.projectLinkLight}>View project</Text>
                  <Feather
                    name="arrow-up-right"
                    size={19}
                    color={colors.white}
                  />
                </View>
              </View>

              <View
                style={[
                  styles.deviceStage,
                  compact && styles.deviceStageCompact,
                ]}
                pointerEvents="none"
              >
                <View style={styles.browser}>
                  <View style={styles.browserChrome}>
                    <View style={styles.browserDots}>
                      <View style={styles.browserDot} />
                      <View style={styles.browserDot} />
                      <View style={styles.browserDot} />
                    </View>

                    <View style={styles.addressBar}>
                      <Text style={styles.addressText}>
                        districtforge.app
                      </Text>
                    </View>
                  </View>

                  <View style={styles.fakeDashboard}>
                    <View style={styles.fakeSidebar}>
                      <View style={styles.fakeSidebarLogo} />
                      <View style={styles.fakeSidebarLineActive} />
                      <View style={styles.fakeSidebarLine} />
                      <View style={styles.fakeSidebarLineShort} />
                      <View style={styles.fakeSidebarLine} />
                    </View>

                    <View style={styles.fakeMain}>
                      <Text style={styles.fakeOverline}>
                        FACILITIES OVERVIEW
                      </Text>

                      <Text style={styles.fakeTitle}>
                        Work orders
                      </Text>

                      <View style={styles.fakeStatsRow}>
                        <View style={styles.fakeStat}>
                          <Text style={styles.fakeStatLabel}>OPEN</Text>
                          <Text style={styles.fakeStatValue}>24</Text>
                        </View>

                        <View style={styles.fakeStat}>
                          <Text style={styles.fakeStatLabel}>
                            IN PROGRESS
                          </Text>
                          <Text style={styles.fakeStatValue}>11</Text>
                        </View>

                        <View style={styles.fakeStat}>
                          <Text style={styles.fakeStatLabel}>TODAY</Text>
                          <Text style={styles.fakeStatValue}>08</Text>
                        </View>
                      </View>

                      <View style={styles.fakeTable}>
                        {[0, 1, 2, 3].map((item) => (
                          <View key={item} style={styles.fakeTableRow}>
                            <View style={styles.fakeTableIcon} />
                            <View style={styles.fakeTableContent}>
                              <View style={styles.fakeTableLine} />
                              <View style={styles.fakeTableLineShort} />
                            </View>
                            <View style={styles.fakeTablePill} />
                          </View>
                        ))}
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </Pressable>

          {/* DADMARK */}
          <Pressable
            accessibilityRole="link"
            accessibilityLabel="Open Dadmark"
            onPress={() => Linking.openURL("https://dadmark.app")}
            style={({ pressed }) => [
              styles.projectCard,
              styles.dadmarkCard,
              pressed && styles.projectPressed,
            ]}
          >
            <View
              style={[
                styles.projectInner,
                styles.projectReverse,
                compact && styles.projectInnerCompact,
              ]}
            >
              <View
                style={[
                  styles.deviceStage,
                  styles.deviceStageWarm,
                  compact && styles.deviceStageCompact,
                ]}
                pointerEvents="none"
              >
                <View style={styles.phoneShell}>
                  <View style={styles.phoneNotch} />

                  <View style={styles.phoneContent}>
                    <View style={styles.phoneLogo}>
                      <DadmarkLogo size={54} />
                    </View>

                    <Text style={styles.phoneEyebrow}>FOR DADS</Text>

                    <Text style={styles.phoneTitle}>
                      Make the time count.
                    </Text>

                    <Text style={styles.phoneBody}>
                      Simple ideas for stronger connection, better traditions,
                      and more meaningful time together.
                    </Text>

                    <View style={styles.phoneCard}>
                      <Text style={styles.phoneCardLabel}>
                        THIS WEEK
                      </Text>

                      <Text style={styles.phoneCardTitle}>
                        Start a tiny tradition.
                      </Text>

                      <View style={styles.phoneCardButton}>
                        <Text style={styles.phoneCardButtonText}>
                          See idea
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.projectCopy}>
                <View style={styles.projectMetaRow}>
                  <View style={styles.projectLogoDark}>
                    <DadmarkLogo size={50} />
                  </View>

                  <Text style={styles.projectStatusDark}>
                    Private beta
                  </Text>
                </View>

                <Text style={styles.projectCategoryDark}>
                  Fatherhood · connection · traditions
                </Text>

                <Text
                  style={[
                    styles.projectTitleDark,
                    compact && styles.projectTitleCompact,
                  ]}
                >
                  Dadmark
                </Text>

                <Text style={styles.projectDescriptionDark}>
                  Realistic, age-aware ideas that help dads use the time they
                  have to create stronger connections and lasting family
                  traditions.
                </Text>

                <View style={styles.projectLinkRow}>
                  <Text style={styles.projectLinkDark}>Visit Dadmark</Text>
                  <Feather
                    name="arrow-up-right"
                    size={19}
                    color={colors.ink}
                  />
                </View>
              </View>
            </View>
          </Pressable>
        </View>

        {/* STATEMENT */}
        <View style={styles.darkStatement}>
          <View style={styles.darkStatementInner}>
            <Text style={styles.darkEyebrow}>The approach</Text>

            <Text
              style={[
                styles.darkStatementTitle,
                compact && styles.darkStatementTitleCompact,
              ]}
            >
              Useful first.
              {"\n"}
              Clear by design.
            </Text>

            <Text style={styles.darkStatementBody}>
              The hard work can happen underneath. The product itself should
              feel obvious.
            </Text>
          </View>
        </View>

        {/* PRINCIPLES */}
        <View nativeID="about" style={styles.processSection}>
          <View style={styles.sectionIntro}>
            <Text style={styles.sectionEyebrow}>How I work</Text>

            <Text
              style={[
                styles.sectionTitle,
                compact && styles.sectionTitleCompact,
              ]}
            >
              Simple principles.
              {"\n"}
              Serious intent.
            </Text>
          </View>

          <View
            style={[
              styles.principlesGrid,
              compact && styles.principlesGridCompact,
            ]}
          >
            {principles.map((item) => (
              <View key={item.number} style={styles.principleCard}>
                <Text style={styles.principleNumber}>{item.number}</Text>

                <View>
                  <Text style={styles.principleTitle}>
                    {item.title}
                  </Text>

                  <Text style={styles.principleText}>
                    {item.text}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ABOUT */}
        <View style={styles.aboutSection}>
          <View
            style={[
              styles.aboutInner,
              compact && styles.aboutInnerCompact,
            ]}
          >
            <Text style={styles.sectionEyebrow}>About Jared</Text>

            <View style={styles.aboutCopy}>
              <Text
                style={[
                  styles.aboutTitle,
                  compact && styles.aboutTitleCompact,
                ]}
              >
                Building things people actually use.
              </Text>

              <Text style={styles.aboutBody}>
                I’m a self-taught product builder in New York. Most of what I
                build starts with a problem I’ve seen firsthand, followed by a
                lot of research, iteration, and conversation with the people
                closest to it.
              </Text>
            </View>
          </View>
        </View>

        {/* CONTACT */}
        <View nativeID="contact" style={styles.contactSection}>
          <View style={styles.contactIntro}>
            <Text style={styles.contactEyebrow}>
              Have a problem worth solving?
            </Text>

            <Text
              style={[
                styles.contactTitle,
                compact && styles.contactTitleCompact,
                narrow && styles.contactTitleNarrow,
              ]}
            >
              Let’s talk about it.
            </Text>

            <Text style={styles.contactBody}>
              I’m always interested in useful ideas, candid feedback, and
              conversations with people close to the problem.
            </Text>
          </View>

          <View style={styles.contactForm}>
            <View
              style={[
                styles.contactFieldRow,
                narrow && styles.contactFieldRowNarrow,
              ]}
            >
              <View style={styles.contactFieldGroup}>
                <Text style={styles.contactLabel}>Name</Text>

                <TextInput
                  accessibilityLabel="Your name"
                  autoComplete="name"
                  onChangeText={setContactName}
                  placeholder="Your name"
                  placeholderTextColor="#86868B"
                  style={styles.contactInput}
                  value={contactName}
                />
              </View>

              <View style={styles.contactFieldGroup}>
                <Text style={styles.contactLabel}>Email</Text>

                <TextInput
                  accessibilityLabel="Your email address"
                  autoCapitalize="none"
                  autoComplete="email"
                  keyboardType="email-address"
                  onChangeText={setContactEmail}
                  placeholder="you@example.com"
                  placeholderTextColor="#86868B"
                  style={styles.contactInput}
                  value={contactEmail}
                />
              </View>
            </View>

            <View style={styles.contactFieldGroup}>
              <Text style={styles.contactLabel}>Message</Text>

              <TextInput
                accessibilityLabel="Your message"
                multiline
                onChangeText={setContactMessage}
                placeholder="Tell me what you are working through..."
                placeholderTextColor="#86868B"
                style={[
                  styles.contactInput,
                  styles.contactMessageInput,
                ]}
                textAlignVertical="top"
                value={contactMessage}
              />
            </View>

            {contactStatus === "error" ? (
              <Text
                accessibilityRole="alert"
                style={styles.contactError}
              >
                {contactError}
              </Text>
            ) : null}

            {contactStatus === "success" ? (
              <View
                accessibilityRole="alert"
                style={styles.contactSuccess}
              >
                <Feather
                  name="check-circle"
                  size={18}
                  color="#1D9A5B"
                />

                <Text style={styles.contactSuccessText}>
                  Message sent. I’ll get back to you soon.
                </Text>
              </View>
            ) : null}

            <View
              style={[
                styles.contactFormFooter,
                narrow && styles.contactFormFooterNarrow,
              ]}
            >
              <Text style={styles.contactDestination}>
                Delivered privately to jaredrachlin@gmail.com
              </Text>

              <Pressable
                accessibilityRole="button"
                disabled={contactStatus === "sending"}
                onPress={submitContact}
                style={({ pressed, hovered }: any) => [
                  styles.contactButton,
                  hovered && styles.contactButtonHover,
                  pressed && styles.contactButtonPressed,
                  contactStatus === "sending" &&
                    styles.contactButtonDisabled,
                ]}
              >
                <Text style={styles.contactButtonText}>
                  {contactStatus === "sending"
                    ? "Sending..."
                    : "Send message"}
                </Text>

                <Feather
                  name="arrow-up-right"
                  size={17}
                  color={colors.white}
                />
              </Pressable>
            </View>
          </View>
        </View>

        {/* FOOTER */}
        <View
          style={[
            styles.footer,
            compact && styles.footerCompact,
          ]}
        >
          <Text style={styles.footerName}>Jared Rachlin</Text>

          <Text style={styles.footerText}>
            Designing, building, and learning in public.
          </Text>

          <Text style={styles.footerText}>© 2026</Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.white,
  },

  pageContent: {
    minHeight: "100%",
  },

  webSticky: {
    position: "sticky" as any,
    top: 0,
  },

  navShell: {
    zIndex: 100,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.10)",
  },

  nav: {
    width: "100%",
    maxWidth: 1180,
    minHeight: 52,
    alignSelf: "center",
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  wordmark: {
    paddingVertical: 8,
  },

  wordmarkText: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
    letterSpacing: -0.2,
  },

  navLinks: {
    flexDirection: "row",
    alignItems: "center",
    gap: 28,
  },

  navLink: {
    paddingVertical: 8,
  },

  navLinkText: {
    color: "#424245",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "400",
  },

  hero: {
    minHeight: 760,
    paddingHorizontal: 24,
    paddingVertical: 120,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.white,
  },

  heroCompact: {
    minHeight: 680,
    paddingTop: 90,
    paddingBottom: 90,
  },

  heroInner: {
    width: "100%",
    maxWidth: 1120,
    alignItems: "center",
  },

  heroEyebrow: {
    color: colors.secondary,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
    letterSpacing: -0.2,
    textAlign: "center",
    marginBottom: 22,
  },

  heroTitle: {
    maxWidth: 1080,
    color: colors.ink,
    fontSize: 88,
    lineHeight: 88,
    fontWeight: "700",
    letterSpacing: -5.4,
    textAlign: "center",
  },

  heroTitleCompact: {
    fontSize: 62,
    lineHeight: 64,
    letterSpacing: -3.6,
  },

  heroTitleNarrow: {
    fontSize: 47,
    lineHeight: 50,
    letterSpacing: -2.6,
  },

  heroBody: {
    maxWidth: 650,
    color: colors.secondary,
    fontSize: 22,
    lineHeight: 31,
    fontWeight: "400",
    letterSpacing: -0.6,
    textAlign: "center",
    marginTop: 32,
  },

  heroBodyCompact: {
    fontSize: 19,
    lineHeight: 28,
  },

  heroActions: {
    marginTop: 35,
    flexDirection: "row",
    alignItems: "center",
    gap: 28,
  },

  heroActionsNarrow: {
    flexDirection: "column",
    gap: 17,
  },

  blueLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  blueLinkHovered: {
    opacity: 0.82,
  },

  blueLinkText: {
    color: colors.blue,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "400",
    letterSpacing: -0.3,
  },

  secondaryHeroLink: {
    color: colors.blue,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "400",
    letterSpacing: -0.3,
  },

  introSection: {
    backgroundColor: colors.surface,
    paddingHorizontal: 24,
    paddingVertical: 130,
  },

  introInner: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 90,
  },

  introInnerCompact: {
    flexDirection: "column",
    gap: 58,
    alignItems: "stretch",
  },

  portraitWrap: {
    flex: 0.9,
    minWidth: 340,
    maxWidth: 475,
    height: 580,
    borderRadius: 30,
    overflow: "hidden",
    backgroundColor: "#DADAE0",
  },

  portraitWrapCompact: {
    width: "100%",
    minWidth: 0,
    maxWidth: 560,
    height: 560,
    alignSelf: "center",
    flexGrow: 0,
  },

  portrait: {
    width: "100%",
    height: "100%",
  },

  introCopy: {
    flex: 1.1,
  },

  sectionEyebrow: {
    color: colors.secondary,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
    letterSpacing: -0.2,
    marginBottom: 20,
  },

  introTitle: {
    maxWidth: 640,
    color: colors.ink,
    fontSize: 58,
    lineHeight: 60,
    fontWeight: "700",
    letterSpacing: -3.2,
  },

  introTitleCompact: {
    fontSize: 44,
    lineHeight: 47,
    letterSpacing: -2.2,
  },

  introBody: {
    maxWidth: 610,
    color: colors.secondary,
    fontSize: 19,
    lineHeight: 29,
    letterSpacing: -0.35,
    marginTop: 26,
  },

  capabilityList: {
    marginTop: 36,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 26,
    gap: 16,
  },

  capabilityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  capabilityDot: {
    width: 5,
    height: 5,
    borderRadius: 99,
    backgroundColor: colors.tertiary,
  },

  capabilityText: {
    color: colors.ink,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "500",
  },

  workSection: {
    width: "100%",
    maxWidth: 1280,
    alignSelf: "center",
    paddingHorizontal: 24,
    paddingTop: 145,
    paddingBottom: 150,
    backgroundColor: colors.white,
  },

  sectionIntro: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    marginBottom: 66,
  },

  sectionTitle: {
    color: colors.ink,
    fontSize: 68,
    lineHeight: 70,
    fontWeight: "700",
    letterSpacing: -4,
  },

  sectionTitleCompact: {
    fontSize: 48,
    lineHeight: 51,
    letterSpacing: -2.6,
  },

  sectionDescription: {
    maxWidth: 520,
    color: colors.secondary,
    fontSize: 18,
    lineHeight: 27,
    letterSpacing: -0.3,
    marginTop: 22,
  },

  projectCard: {
    width: "100%",
    borderRadius: 36,
    overflow: "hidden",
    marginBottom: 34,
  },

  districtCard: {
    backgroundColor: "#0B1526",
  },

  dadmarkCard: {
    backgroundColor: "#F1EADF",
  },

  projectPressed: {
    opacity: 0.97,
    transform: [{ scale: 0.997 }],
  },

  projectInner: {
    minHeight: 690,
    paddingTop: 68,
    paddingHorizontal: 62,
    flexDirection: "row",
    gap: 58,
    alignItems: "stretch",
  },

  projectInnerCompact: {
    minHeight: 0,
    paddingTop: 46,
    paddingHorizontal: 26,
    flexDirection: "column",
    gap: 48,
  },

  projectReverse: {
    flexDirection: "row",
  },

  projectCopy: {
    flex: 0.9,
    justifyContent: "center",
    paddingBottom: 62,
    zIndex: 2,
  },

  projectMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 17,
    marginBottom: 52,
  },

  projectLogoWhite: {
    width: 58,
    height: 58,
    borderRadius: 15,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  projectLogoDark: {
    width: 58,
    height: 58,
    borderRadius: 15,
    backgroundColor: "#17130F",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  projectStatusLight: {
    color: "#B7C5D8",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },

  projectStatusDark: {
    color: "#75695C",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },

  projectCategoryLight: {
    color: "#91BDF3",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.25,
    marginBottom: 16,
  },

  projectCategoryDark: {
    color: "#8B6536",
    fontSize: 13,
    lineHeight: 19,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.25,
    marginBottom: 16,
  },

  projectTitleLight: {
    color: colors.white,
    fontSize: 64,
    lineHeight: 67,
    fontWeight: "700",
    letterSpacing: -3.8,
  },

  projectTitleDark: {
    color: "#17130F",
    fontSize: 64,
    lineHeight: 67,
    fontWeight: "700",
    letterSpacing: -3.8,
  },

  projectTitleCompact: {
    fontSize: 48,
    lineHeight: 51,
    letterSpacing: -2.8,
  },

  projectDescriptionLight: {
    maxWidth: 540,
    color: "#B9C4D3",
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: -0.25,
    marginTop: 22,
  },

  projectDescriptionDark: {
    maxWidth: 540,
    color: "#6D6256",
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: -0.25,
    marginTop: 22,
  },

  projectLinkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 35,
  },

  projectLinkLight: {
    color: colors.white,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "500",
  },

  projectLinkDark: {
    color: colors.ink,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: "500",
  },

  deviceStage: {
    flex: 1.15,
    justifyContent: "flex-end",
    paddingTop: 80,
  },

  deviceStageCompact: {
    flex: 0,
    minHeight: 430,
    paddingTop: 0,
  },

  deviceStageWarm: {
    alignItems: "center",
  },

  browser: {
    width: "100%",
    minWidth: 590,
    height: 490,
    backgroundColor: colors.white,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: "hidden",
    shadowColor: colors.black,
    shadowOpacity: 0.28,
    shadowRadius: 40,
    shadowOffset: { width: 0, height: 14 },
  },

  browserChrome: {
    height: 44,
    backgroundColor: "#F6F6F8",
    borderBottomWidth: 1,
    borderBottomColor: colors.softLine,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  browserDots: {
    flexDirection: "row",
    gap: 6,
  },

  browserDot: {
    width: 9,
    height: 9,
    borderRadius: 99,
    backgroundColor: "#C7C7CC",
  },

  addressBar: {
    height: 24,
    minWidth: 210,
    paddingHorizontal: 20,
    borderRadius: 7,
    backgroundColor: "#EDEDF0",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -105 }],
  },

  addressText: {
    color: colors.tertiary,
    fontSize: 9,
    lineHeight: 12,
  },

  fakeDashboard: {
    flex: 1,
    flexDirection: "row",
  },

  fakeSidebar: {
    width: 112,
    backgroundColor: "#F8F8FA",
    borderRightWidth: 1,
    borderRightColor: colors.softLine,
    padding: 18,
  },

  fakeSidebarLogo: {
    width: 31,
    height: 31,
    borderRadius: 8,
    backgroundColor: "#142846",
    marginBottom: 43,
  },

  fakeSidebarLine: {
    width: 60,
    height: 6,
    borderRadius: 99,
    backgroundColor: "#D8D8DD",
    marginBottom: 18,
  },

  fakeSidebarLineShort: {
    width: 42,
    height: 6,
    borderRadius: 99,
    backgroundColor: "#D8D8DD",
    marginBottom: 18,
  },

  fakeSidebarLineActive: {
    width: 70,
    height: 7,
    borderRadius: 99,
    backgroundColor: "#8EA6C7",
    marginBottom: 18,
  },

  fakeMain: {
    flex: 1,
    padding: 30,
  },

  fakeOverline: {
    color: colors.tertiary,
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1.2,
  },

  fakeTitle: {
    color: colors.ink,
    fontSize: 26,
    lineHeight: 31,
    fontWeight: "700",
    letterSpacing: -1,
    marginTop: 7,
  },

  fakeStatsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 26,
  },

  fakeStat: {
    flex: 1,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ECECF0",
    backgroundColor: "#FAFAFC",
  },

  fakeStatLabel: {
    color: colors.tertiary,
    fontSize: 7,
    lineHeight: 10,
    fontWeight: "700",
    letterSpacing: 0.7,
  },

  fakeStatValue: {
    color: colors.ink,
    fontSize: 19,
    lineHeight: 23,
    fontWeight: "700",
    marginTop: 8,
  },

  fakeTable: {
    marginTop: 18,
    borderWidth: 1,
    borderColor: "#ECECF0",
    borderRadius: 11,
    overflow: "hidden",
  },

  fakeTableRow: {
    minHeight: 58,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEF1",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 12,
  },

  fakeTableIcon: {
    width: 25,
    height: 25,
    borderRadius: 7,
    backgroundColor: "#EDF1F6",
  },

  fakeTableContent: {
    flex: 1,
    gap: 5,
  },

  fakeTableLine: {
    width: "65%",
    height: 5,
    borderRadius: 99,
    backgroundColor: "#C8C8CD",
  },

  fakeTableLineShort: {
    width: "40%",
    height: 4,
    borderRadius: 99,
    backgroundColor: "#DEDEE2",
  },

  fakeTablePill: {
    width: 39,
    height: 14,
    borderRadius: 99,
    backgroundColor: "#E5ECF5",
  },

  phoneShell: {
    width: 290,
    height: 560,
    borderWidth: 7,
    borderColor: "#181818",
    borderRadius: 45,
    backgroundColor: "#FAF7F1",
    overflow: "hidden",
    padding: 18,
    shadowColor: colors.black,
    shadowOpacity: 0.25,
    shadowRadius: 35,
    shadowOffset: { width: 0, height: 14 },
  },

  phoneNotch: {
    width: 88,
    height: 24,
    borderRadius: 99,
    backgroundColor: "#181818",
    alignSelf: "center",
    marginTop: -8,
    marginBottom: 22,
  },

  phoneContent: {
    flex: 1,
  },

  phoneLogo: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: "#17130F",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    marginBottom: 35,
  },

  phoneEyebrow: {
    color: "#926F46",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 1.2,
  },

  phoneTitle: {
    color: "#17130F",
    fontSize: 33,
    lineHeight: 35,
    fontWeight: "700",
    letterSpacing: -1.7,
    marginTop: 7,
  },

  phoneBody: {
    color: "#72665A",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 14,
  },

  phoneCard: {
    marginTop: 32,
    backgroundColor: colors.white,
    borderRadius: 19,
    padding: 20,
  },

  phoneCardLabel: {
    color: "#A17B4D",
    fontSize: 8,
    fontWeight: "700",
    letterSpacing: 1,
  },

  phoneCardTitle: {
    color: "#17130F",
    fontSize: 20,
    lineHeight: 24,
    fontWeight: "700",
    letterSpacing: -0.7,
    marginTop: 8,
  },

  phoneCardButton: {
    alignSelf: "flex-start",
    marginTop: 23,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 99,
    backgroundColor: "#17130F",
  },

  phoneCardButtonText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "600",
  },

  darkStatement: {
    backgroundColor: colors.black,
    paddingHorizontal: 24,
    paddingVertical: 180,
  },

  darkStatementInner: {
    width: "100%",
    maxWidth: 1120,
    alignSelf: "center",
  },

  darkEyebrow: {
    color: colors.tertiary,
    fontSize: 16,
    lineHeight: 23,
    fontWeight: "600",
    marginBottom: 25,
  },

  darkStatementTitle: {
    maxWidth: 1000,
    color: "#F5F5F7",
    fontSize: 90,
    lineHeight: 91,
    fontWeight: "700",
    letterSpacing: -5.5,
  },

  darkStatementTitleCompact: {
    fontSize: 56,
    lineHeight: 59,
    letterSpacing: -3.2,
  },

  darkStatementBody: {
    maxWidth: 600,
    color: "#A1A1A6",
    fontSize: 21,
    lineHeight: 31,
    letterSpacing: -0.45,
    marginTop: 34,
  },

  processSection: {
    backgroundColor: colors.surface,
    paddingHorizontal: 24,
    paddingVertical: 145,
  },

  principlesGrid: {
    width: "100%",
    maxWidth: 1180,
    alignSelf: "center",
    flexDirection: "row",
    gap: 18,
  },

  principlesGridCompact: {
    flexDirection: "column",
  },

  principleCard: {
    flex: 1,
    minHeight: 420,
    padding: 34,
    borderRadius: 28,
    backgroundColor: colors.white,
    justifyContent: "space-between",
  },

  principleNumber: {
    color: colors.tertiary,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },

  principleTitle: {
    color: colors.ink,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "700",
    letterSpacing: -1.1,
  },

  principleText: {
    color: colors.secondary,
    fontSize: 16,
    lineHeight: 25,
    letterSpacing: -0.2,
    marginTop: 15,
  },

  aboutSection: {
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingVertical: 165,
  },

  aboutInner: {
    width: "100%",
    maxWidth: 1120,
    alignSelf: "center",
    flexDirection: "row",
    gap: 95,
    alignItems: "flex-start",
  },

  aboutInnerCompact: {
    flexDirection: "column",
    gap: 22,
  },

  aboutCopy: {
    flex: 1,
  },

  aboutTitle: {
    maxWidth: 800,
    color: colors.ink,
    fontSize: 70,
    lineHeight: 72,
    fontWeight: "700",
    letterSpacing: -4.2,
  },

  aboutTitleCompact: {
    fontSize: 49,
    lineHeight: 52,
    letterSpacing: -2.7,
  },

  aboutBody: {
    maxWidth: 620,
    color: colors.secondary,
    fontSize: 20,
    lineHeight: 30,
    letterSpacing: -0.35,
    marginTop: 32,
  },

  contactSection: {
    backgroundColor: colors.surface,
    paddingHorizontal: 24,
    paddingTop: 150,
    paddingBottom: 150,
    alignItems: "center",
  },

  contactIntro: {
    width: "100%",
    maxWidth: 900,
    alignItems: "center",
  },

  contactEyebrow: {
    color: colors.secondary,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
  },

  contactTitle: {
    color: colors.ink,
    fontSize: 78,
    lineHeight: 80,
    fontWeight: "700",
    letterSpacing: -4.7,
    textAlign: "center",
  },

  contactTitleCompact: {
    fontSize: 55,
    lineHeight: 58,
    letterSpacing: -3,
  },

  contactTitleNarrow: {
    fontSize: 45,
    lineHeight: 48,
    letterSpacing: -2.3,
  },

  contactBody: {
    maxWidth: 620,
    color: colors.secondary,
    fontSize: 18,
    lineHeight: 28,
    textAlign: "center",
    letterSpacing: -0.25,
    marginTop: 24,
  },

  contactForm: {
    width: "100%",
    maxWidth: 780,
    marginTop: 55,
    padding: 30,
    gap: 22,
    borderRadius: 28,
    backgroundColor: colors.white,
  },

  contactFieldRow: {
    flexDirection: "row",
    gap: 18,
  },

  contactFieldRowNarrow: {
    flexDirection: "column",
  },

  contactFieldGroup: {
    flex: 1,
    gap: 9,
  },

  contactLabel: {
    color: colors.ink,
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "600",
  },

  contactInput: {
    minHeight: 55,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 13,
    backgroundColor: colors.white,
    color: colors.ink,
    fontSize: 16,
    lineHeight: 22,
    paddingHorizontal: 15,
    paddingVertical: 14,
  },

  contactMessageInput: {
    minHeight: 160,
  },

  contactError: {
    color: "#C93232",
    fontSize: 13,
    lineHeight: 19,
  },

  contactSuccess: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  contactSuccessText: {
    color: "#267A4B",
    fontSize: 13,
    lineHeight: 19,
  },

  contactFormFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 18,
    marginTop: 2,
  },

  contactFormFooterNarrow: {
    flexDirection: "column",
    alignItems: "stretch",
  },

  contactDestination: {
    color: colors.tertiary,
    fontSize: 12,
    lineHeight: 18,
  },

  contactButton: {
    minHeight: 50,
    paddingHorizontal: 23,
    borderRadius: 99,
    backgroundColor: colors.blue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  contactButtonHover: {
    backgroundColor: colors.blueHover,
  },

  contactButtonPressed: {
    opacity: 0.82,
  },

  contactButtonDisabled: {
    opacity: 0.55,
  },

  contactButtonText: {
    color: colors.white,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
  },

  footer: {
    width: "100%",
    maxWidth: 1180,
    minHeight: 110,
    alignSelf: "center",
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },

  footerCompact: {
    paddingVertical: 32,
    flexDirection: "column",
    alignItems: "flex-start",
  },

  footerName: {
    color: colors.ink,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },

  footerText: {
    color: colors.secondary,
    fontSize: 12,
    lineHeight: 18,
  },

  pressed: {
    opacity: 0.65,
  },
});