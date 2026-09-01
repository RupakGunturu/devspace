import React from "react";

// Generic stub for auth-gated tools
const ToolStub = React.lazy(() => import("./ToolStub"));

function createToolStub(name: string, description: string): React.ComponentType {
  return function StubWrapper() {
    return React.createElement(ToolStub, { name, description });
  };
}

// Content tools
const TwitterThreadFormatter = React.lazy(() =>
  import("./TwitterThreadFormatter").then((m) => ({ default: m.TwitterThreadFormatter })),
);
const HashtagGenerator = React.lazy(() =>
  import("./HashtagGenerator").then((m) => ({ default: m.HashtagGenerator })),
);
const OgImagePreviewer = React.lazy(() =>
  import("./OgImagePreviewer").then((m) => ({ default: m.OgImagePreviewer })),
);
const InstagramCaptionFormatter = React.lazy(() =>
  import("./InstagramCaptionFormatter").then((m) => ({ default: m.InstagramCaptionFormatter })),
);
const YoutubeAbTextTester = React.lazy(() =>
  import("./YoutubeAbTextTester").then((m) => ({ default: m.YoutubeAbTextTester })),
);

// Existing tools (named exports → wrap for React.lazy)
const JsonFormatter = React.lazy(() =>
  import("./JsonFormatter").then((m) => ({ default: m.JsonFormatter })),
);
const RegexTester = React.lazy(() =>
  import("./RegexTester").then((m) => ({ default: m.RegexTester })),
);
const ContrastChecker = React.lazy(() =>
  import("./ContrastChecker").then((m) => ({ default: m.ContrastChecker })),
);
const MarkdownPreviewer = React.lazy(() =>
  import("./MarkdownPreviewer").then((m) => ({ default: m.MarkdownPreviewer })),
);
const Base64UrlCodec = React.lazy(() =>
  import("./Base64UrlCodec").then((m) => ({ default: m.Base64UrlCodec })),
);
const UuidHashGenerator = React.lazy(() =>
  import("./UuidHashGenerator").then((m) => ({ default: m.UuidHashGenerator })),
);

// Developer tools
const DiffChecker = React.lazy(() =>
  import("./DiffChecker").then((m) => ({ default: m.DiffChecker })),
);
const GitCommandBuilder = React.lazy(() =>
  import("./GitCommandBuilder").then((m) => ({ default: m.GitCommandBuilder })),
);
const PackageJsonChecker = React.lazy(() =>
  import("./PackageJsonChecker").then((m) => ({ default: m.PackageJsonChecker })),
);

// Learning tools
const BigOCheatsheet = React.lazy(() =>
  import("./BigOCheatsheet").then((m) => ({ default: m.BigOCheatsheet })),
);
const AlgorithmPatternMatcher = React.lazy(() =>
  import("./AlgorithmPatternMatcher").then((m) => ({ default: m.AlgorithmPatternMatcher })),
);
const FlashcardGenerator = React.lazy(() =>
  import("./FlashcardGenerator").then((m) => ({ default: m.FlashcardGenerator })),
);
const SystemDesignCheatsheet = React.lazy(() =>
  import("./SystemDesignCheatsheet").then((m) => ({ default: m.SystemDesignCheatsheet })),
);
const LeetcodeStreakVisualizer = React.lazy(() =>
  import("./LeetcodeStreakVisualizer").then((m) => ({ default: m.LeetcodeStreakVisualizer })),
);
const SpacedRepetitionTimer = React.lazy(() =>
  import("./SpacedRepetitionTimer").then((m) => ({ default: m.SpacedRepetitionTimer })),
);

// CSS Tools
const BoxShadowGenerator = React.lazy(() => import("./css/box-shadow-generator"));
const GlassmorphismGenerator = React.lazy(() => import("./css/glassmorphism-generator"));
const NeumorphismGenerator = React.lazy(() => import("./css/neumorphism-generator"));
const CssGradientBuilder = React.lazy(() => import("./css/css-gradient-builder"));
const MeshGradientGenerator = React.lazy(() => import("./css/mesh-gradient-generator"));
const CssFilterBuilder = React.lazy(() => import("./css/css-filter-builder"));
const ClipPathEditor = React.lazy(() => import("./css/clip-path-editor"));
const CubicBezierEditor = React.lazy(() => import("./css/cubic-bezier-editor"));
const CssKeyframeBuilder = React.lazy(() => import("./css/css-keyframe-builder"));
const SvgPathAnimator = React.lazy(() => import("./css/svg-path-animator"));
const BorderRadiusGenerator = React.lazy(() => import("./css/border-radius-generator"));
const CssSpecificityCalculator = React.lazy(() => import("./css/css-specificity-calculator"));
const FlexboxPlayground = React.lazy(() => import("./css/flexbox-playground"));
const CssGridBuilder = React.lazy(() => import("./css/css-grid-builder"));
const ScrollbarStyler = React.lazy(() => import("./css/scrollbar-styler"));
const CssVariablesThemeBuilder = React.lazy(() => import("./css/css-variables-theme-builder"));
const TailwindToCss = React.lazy(() => import("./css/tailwind-to-css"));
const CssToTailwind = React.lazy(() => import("./css/css-to-tailwind"));
const CssUnitsConverter = React.lazy(() => import("./css/css-units-converter"));
const CssTextShadowBuilder = React.lazy(() => import("./css/css-text-shadow-builder"));
const ZIndexManager = React.lazy(() => import("./css/z-index-manager"));
const PrintCssGenerator = React.lazy(() => import("./css/print-css-generator"));
const TransitionVisualizer = React.lazy(() => import("./css/transition-visualizer"));
const CssCounterGenerator = React.lazy(() => import("./css/css-counter-generator"));
const CssOutlineBorderExplorer = React.lazy(() => import("./css/css-outline-border-explorer"));
const CssAnimationBuilder = React.lazy(() => import("./css/css-animation-builder"));
const SvgPathVisualizer = React.lazy(() => import("./css/svg-path-visualizer"));
const LiveCssPlayground = React.lazy(() => import("./css/live-css-playground"));
const TailwindClassGenerator = React.lazy(() => import("./dev-utilities/tailwind-class-generator"));

// Color Tools
const HexRgbHslConverter = React.lazy(() => import("./color/hex-rgb-hsl-converter"));
const ColorPaletteGenerator = React.lazy(() => import("./color/color-palette-generator"));
const ColorBlindSimulator = React.lazy(() => import("./color/color-blind-simulator"));
const WcagContrastChecker = React.lazy(() => import("./color/wcag-contrast-checker"));
const ImageToColorPalette = React.lazy(() => import("./color/image-to-color-palette"));
const ColorGradientGenerator = React.lazy(() => import("./color/color-gradient-generator"));
const ColorMixer = React.lazy(() => import("./color/color-mixer"));
const ColorTemperatureConverter = React.lazy(() => import("./color/color-temperature-converter"));
const ColorNameFinder = React.lazy(() => import("./color/color-name-finder"));
const RandomColorGenerator = React.lazy(() => import("./color/random-color-generator"));
const ColorShadesGenerator = React.lazy(() => import("./color/color-shades-generator"));
const PantoneToHex = React.lazy(() => import("./color/pantone-to-hex"));
const ColorHarmonyExplorer = React.lazy(() => import("./color/color-harmony-explorer"));
const DarkModePaletteGenerator = React.lazy(() => import("./color/dark-mode-palette-generator"));
const CssColorVariablesGenerator = React.lazy(
  () => import("./color/css-color-variables-generator"),
);
const ColorStoryFromEmotion = React.lazy(() => import("./color/color-story-from-emotion"));
const BrandColorExtractor = React.lazy(() => import("./color/brand-color-extractor"));

// Dev Utilities
const JwtDecoder = React.lazy(() => import("./dev-utilities/jwt-decoder"));
const JwtGenerator = React.lazy(() => import("./dev-utilities/jwt-generator"));
const RegexVisualizer = React.lazy(() => import("./dev-utilities/regex-visualizer"));
const JsonToTypescript = React.lazy(() => import("./dev-utilities/json-to-typescript"));
const JsonToZod = React.lazy(() => import("./dev-utilities/json-to-zod"));
const JsonToPythonDataclass = React.lazy(() => import("./dev-utilities/json-to-python-dataclass"));
const JsonDiff = React.lazy(() => import("./dev-utilities/json-diff"));
const JsonPathTester = React.lazy(() => import("./dev-utilities/json-path-tester"));
const YamlJsonConverter = React.lazy(() => import("./dev-utilities/yaml-json-converter"));
const TomlJsonConverter = React.lazy(() => import("./dev-utilities/toml-json-converter"));
const CronBuilder = React.lazy(() => import("./dev-utilities/cron-builder"));
const CronExplainer = React.lazy(() => import("./dev-utilities/cron-explainer"));
const UuidGenerator = React.lazy(() => import("./dev-utilities/uuid-generator"));
const HashGenerator = React.lazy(() => import("./dev-utilities/hash-generator"));
const HmacGenerator = React.lazy(() => import("./dev-utilities/hmac-generator"));
const ApiResponseMocker = React.lazy(() => import("./dev-utilities/api-response-mocker"));
const HttpStatusCodes = React.lazy(() => import("./dev-utilities/http-status-codes"));
const HttpHeaderAnalyzer = React.lazy(() => import("./dev-utilities/http-header-analyzer"));
const EnvValidator = React.lazy(() => import("./dev-utilities/env-validator"));
const DockerComposeGenerator = React.lazy(() => import("./dev-utilities/docker-compose-generator"));
const GitignoreGenerator = React.lazy(() => import("./dev-utilities/gitignore-generator"));
const LicensePicker = React.lazy(() => import("./dev-utilities/license-picker"));
const SemverExplainer = React.lazy(() => import("./dev-utilities/semver-explainer"));
const NpmPackageComparator = React.lazy(() => import("./dev-utilities/npm-package-comparator"));
const EslintRuleExplorer = React.lazy(() => import("./dev-utilities/eslint-rule-explorer"));
const SqlFormatter = React.lazy(() => import("./dev-utilities/sql-formatter"));
const SqlToMongodb = React.lazy(() => import("./dev-utilities/sql-to-mongodb"));
const GraphqlToRest = React.lazy(() => import("./dev-utilities/graphql-to-rest"));
const GitCommandExplainer = React.lazy(() => import("./dev-utilities/git-command-explainer"));
const JsonVisualizer = React.lazy(() => import("./dev-utilities/json-visualizer"));
const SqlFormatterExplainer = React.lazy(() => import("./dev-utilities/sql-formatter-explainer"));
const DockerCommandBuilder = React.lazy(() => import("./dev-utilities/docker-command-builder"));
const UnicodeSymbolFinder = React.lazy(() => import("./dev-utilities/unicode-symbol-finder"));
const EnvVarGenerator = React.lazy(() => import("./dev-utilities/env-var-generator"));
const BrowserStorageInspector = React.lazy(
  () => import("./dev-utilities/browser-storage-inspector"),
);
const ApiRateLimitEstimator = React.lazy(() => import("./dev-utilities/api-rate-limit-estimator"));
const RegexTesterExplainer = React.lazy(() => import("./dev-utilities/regex-tester-explainer"));

// Text & Content
const MarkdownPreview = React.lazy(() => import("./text-content/markdown-preview"));
const MarkdownTableGenerator = React.lazy(() => import("./text-content/markdown-table-generator"));
const WordCounter = React.lazy(() => import("./text-content/word-counter"));
const TextDiff = React.lazy(() => import("./text-content/text-diff"));
const LoremIpsumGenerator = React.lazy(() => import("./text-content/lorem-ipsum-generator"));
const SlugGenerator = React.lazy(() => import("./text-content/slug-generator"));
const CaseConverter = React.lazy(() => import("./text-content/case-converter"));
const TextToAsciiArt = React.lazy(() => import("./text-content/text-to-ascii-art"));
const EmojiFinder = React.lazy(() => import("./text-content/emoji-finder"));
const StringEscaper = React.lazy(() => import("./text-content/string-escaper"));
const DuplicateLineRemover = React.lazy(() => import("./text-content/duplicate-line-remover"));
const TextSorter = React.lazy(() => import("./text-content/text-sorter"));
const CsvToJson = React.lazy(() => import("./text-content/csv-to-json"));
const JsonToCsv = React.lazy(() => import("./text-content/json-to-csv"));
const CsvToMarkdownTable = React.lazy(() => import("./text-content/csv-to-markdown-table"));
const WhitespaceCleaner = React.lazy(() => import("./text-content/whitespace-cleaner"));
const TextRepeater = React.lazy(() => import("./text-content/text-repeater"));
const FindReplace = React.lazy(() => import("./text-content/find-replace"));
const LetterFrequency = React.lazy(() => import("./text-content/letter-frequency"));
const HeadlineAnalyzer = React.lazy(() => import("./text-content/headline-analyzer"));
const TweetLengthChecker = React.lazy(() => import("./text-content/tweet-length-checker"));
const ParagraphShuffler = React.lazy(() => import("./text-content/paragraph-shuffler"));
const PalindromeChecker = React.lazy(() => import("./text-content/palindrome-checker"));

// Converters
const Base64Encoder = React.lazy(() => import("./converters/base64-encoder"));
const UrlEncoder = React.lazy(() => import("./converters/url-encoder"));
const HtmlEntityEncoder = React.lazy(() => import("./converters/html-entity-encoder"));
const BinaryText = React.lazy(() => import("./converters/binary-text"));
const HexDecimalBinary = React.lazy(() => import("./converters/hex-decimal-binary"));
const UnixTimestamp = React.lazy(() => import("./converters/unix-timestamp"));
const TimezoneOverlap = React.lazy(() => import("./converters/timezone-overlap"));
const AspectRatioCalculator = React.lazy(() => import("./converters/aspect-ratio-calculator"));
const PixelToRem = React.lazy(() => import("./converters/pixel-to-rem"));
const SvgToJsx = React.lazy(() => import("./converters/svg-to-jsx"));
const JsxToHtml = React.lazy(() => import("./converters/jsx-to-html"));
const MarkdownToHtml = React.lazy(() => import("./converters/markdown-to-html"));
const HtmlToMarkdown = React.lazy(() => import("./converters/html-to-markdown"));
const NumberToWords = React.lazy(() => import("./converters/number-to-words"));
const RomanNumeral = React.lazy(() => import("./converters/roman-numeral"));
const TemperatureConverter = React.lazy(() => import("./converters/temperature-converter"));
const UnitConverter = React.lazy(() => import("./converters/unit-converter"));
const CurrencyFormatter = React.lazy(() => import("./converters/currency-formatter"));
const ImageFormatConverter = React.lazy(() => import("./converters/image-format-converter"));
const FaviconGenerator = React.lazy(() => import("./converters/favicon-generator"));
const CssPxPt = React.lazy(() => import("./converters/css-px-pt"));
const ColorFormatConverter = React.lazy(() => import("./converters/color-format-converter"));
const Base64ImageConverter = React.lazy(() => import("./dev-utilities/base64-image-converter"));
const TimestampConverter = React.lazy(() => import("./dev-utilities/timestamp-converter"));

// AI
const VariableNamer = React.lazy(() => import("./ai/variable-namer"));
const CommitMessageGenerator = React.lazy(() => import("./ai/commit-message-generator"));
const ReadmeGenerator = React.lazy(() => import("./ai/readme-generator"));
const CodeExplainer = React.lazy(() => import("./ai/code-explainer"));
const CodeReviewAssistant = React.lazy(() => import("./ai/code-review-assistant"));
const DocstringGenerator = React.lazy(() => import("./ai/docstring-generator"));
const TestCaseGenerator = React.lazy(() => import("./ai/test-case-generator"));
const ApiEndpointNamer = React.lazy(() => import("./ai/api-endpoint-namer"));
const PrDescriptionWriter = React.lazy(() => import("./ai/pr-description-writer"));
const ComponentPropsGenerator = React.lazy(() => import("./ai/component-props-generator"));
const ErrorMessageExplainer = React.lazy(() => import("./ai/error-message-explainer"));
const BlogIntroGenerator = React.lazy(() => import("./ai/blog-intro-generator"));
const MetaDescriptionWriter = React.lazy(() => import("./ai/meta-description-writer"));
const AltTextGenerator = React.lazy(() => import("./ai/alt-text-generator"));
const SqlQueryGenerator = React.lazy(() => import("./ai/sql-query-generator"));
const RegexGenerator = React.lazy(() => import("./ai/regex-generator"));
const TechStackSuggester = React.lazy(() => import("./ai/tech-stack-suggester"));
const ColorStoryGenerator = React.lazy(() => import("./ai/color-story-generator"));
const PlaceholderContentGenerator = React.lazy(() => import("./ai/placeholder-content-generator"));
const ChangelogGenerator = React.lazy(() => import("./ai/changelog-generator"));
const I18nJsonGenerator = React.lazy(() => import("./ai/i18n-json-generator"));

// SEO
const OgMetaPreviewer = React.lazy(() => import("./seo/og-meta-previewer"));
const MetaTagGenerator = React.lazy(() => import("./seo/meta-tag-generator"));
const OpenGraphGenerator = React.lazy(() => import("./seo/open-graph-generator"));
const TwitterCardGenerator = React.lazy(() => import("./seo/twitter-card-generator"));
const RobotsTxtGenerator = React.lazy(() => import("./seo/robots-txt-generator"));
const SitemapGenerator = React.lazy(() => import("./seo/sitemap-generator"));
const KeywordDensityChecker = React.lazy(() => import("./seo/keyword-density-checker"));
const SchemaMarkupGenerator = React.lazy(() => import("./seo/schema-markup-generator"));
const PageTitleAnalyzer = React.lazy(() => import("./seo/page-title-analyzer"));
const UtmBuilder = React.lazy(() => import("./seo/utm-builder"));
const SlugSeoScorer = React.lazy(() => import("./seo/slug-seo-scorer"));
const CanonicalUrlChecker = React.lazy(() => import("./seo/canonical-url-checker"));

// Security
const PasswordGenerator = React.lazy(() => import("./security/password-generator"));
const PasswordStrengthChecker = React.lazy(() => import("./security/password-strength-checker"));
const PasswordHasher = React.lazy(() => import("./security/password-hasher"));
const RsaKeyGenerator = React.lazy(() => import("./security/rsa-key-generator"));
const AesEncryptDecrypt = React.lazy(() => import("./security/aes-encrypt-decrypt"));
const CorsHeaderBuilder = React.lazy(() => import("./security/cors-header-builder"));
const CspBuilder = React.lazy(() => import("./security/csp-builder"));
const IpLookup = React.lazy(() => import("./security/ip-lookup"));
const WhoisLookup = React.lazy(() => import("./security/whois-lookup"));
const SslDecoder = React.lazy(() => import("./security/ssl-decoder"));
const CvssCalculator = React.lazy(() => import("./security/cvss-calculator"));
const PrivacyPolicyGenerator = React.lazy(() => import("./security/privacy-policy-generator"));

// Image
const ImageCompressor = React.lazy(() => import("./image/image-compressor"));
const ImageResizer = React.lazy(() => import("./image/image-resizer"));
const ImageCropper = React.lazy(() => import("./image/image-cropper"));
const ImageToBase64 = React.lazy(() => import("./image/image-to-base64"));
const SvgOptimizer = React.lazy(() => import("./image/svg-optimizer"));
const SvgToPng = React.lazy(() => import("./image/svg-to-png"));
const SocialMediaImageSizer = React.lazy(() => import("./image/social-media-image-sizer"));
const PhotoExifViewer = React.lazy(() => import("./image/photo-exif-viewer"));
const WatermarkAdder = React.lazy(() => import("./image/watermark-adder"));
const ImageColorPicker = React.lazy(() => import("./image/image-color-picker"));
const NoiseTextureGenerator = React.lazy(() => import("./image/noise-texture-generator"));
const PatternGenerator = React.lazy(() => import("./image/pattern-generator"));
const PlaceholderImageGenerator = React.lazy(() => import("./image/placeholder-image-generator"));
const GifFrameExtractor = React.lazy(() => import("./image/gif-frame-extractor"));

// Code Tools
const CodeBeautifier = React.lazy(() => import("./code-tools/code-beautifier"));
const CodeMinifier = React.lazy(() => import("./code-tools/code-minifier"));
const CodeToImage = React.lazy(() => import("./code-tools/code-to-image"));
const HtmlPreview = React.lazy(() => import("./code-tools/html-preview"));
const TypescriptPlayground = React.lazy(() => import("./code-tools/typescript-playground"));
const GithubBadgeGenerator = React.lazy(() => import("./code-tools/github-badge-generator"));
const GithubReadmeStats = React.lazy(() => import("./code-tools/github-readme-stats"));
const DependencySizeChecker = React.lazy(() => import("./code-tools/dependency-size-checker"));
const MockDataGenerator = React.lazy(() => import("./code-tools/mock-data-generator"));
const ApiDocsGenerator = React.lazy(() => import("./code-tools/api-docs-generator"));
const PrettierConfigBuilder = React.lazy(() => import("./code-tools/prettier-config-builder"));
const EslintConfigBuilder = React.lazy(() => import("./code-tools/eslint-config-builder"));
const WebpackBundleAnalyzer = React.lazy(() => import("./code-tools/webpack-bundle-analyzer"));

// Typography
const FontPairFinder = React.lazy(() => import("./typography/font-pair-finder"));
const FontWeightGallery = React.lazy(() => import("./typography/font-weight-gallery"));
const TypeScaleGenerator = React.lazy(() => import("./typography/type-scale-generator"));
const LineHeightCalculator = React.lazy(() => import("./typography/line-height-calculator"));
const GoogleFontsPicker = React.lazy(() => import("./typography/google-fonts-picker"));
const VariableFontPlayground = React.lazy(() => import("./typography/variable-font-playground"));
const LetterSpacingVisualizer = React.lazy(() => import("./typography/letter-spacing-visualizer"));
const WebSafeFontsPreview = React.lazy(() => import("./typography/web-safe-fonts-preview"));
const FontSizeConverter = React.lazy(() => import("./typography/font-size-converter"));
const LigatureExplorer = React.lazy(() => import("./typography/ligature-explorer"));

// Math
const PercentageCalculator = React.lazy(() => import("./math/percentage-calculator"));
const CompoundInterestCalculator = React.lazy(() => import("./math/compound-interest-calculator"));
const LoanEmiCalculator = React.lazy(() => import("./math/loan-emi-calculator"));
const GstTaxCalculator = React.lazy(() => import("./math/gst-tax-calculator"));
const DiscountCalculator = React.lazy(() => import("./math/discount-calculator"));
const TipCalculator = React.lazy(() => import("./math/tip-calculator"));
const BmiCalculator = React.lazy(() => import("./math/bmi-calculator"));
const AgeCalculator = React.lazy(() => import("./math/age-calculator"));
const DateDifferenceCalculator = React.lazy(() => import("./math/date-difference-calculator"));
const PrimeNumberChecker = React.lazy(() => import("./math/prime-number-checker"));
const FibonacciGenerator = React.lazy(() => import("./math/fibonacci-generator"));
const ScientificCalculator = React.lazy(() => import("./math/scientific-calculator"));
const MatrixCalculator = React.lazy(() => import("./math/matrix-calculator"));
const BinaryMathCalculator = React.lazy(() => import("./math/binary-math-calculator"));

// Finance Tools
const EmiLoanCalculator = React.lazy(() =>
  import("./EmiLoanCalculator").then((m) => ({ default: m.EmiLoanCalculator })),
);
const BudgetSplitPlanner = React.lazy(() =>
  import("./BudgetSplitPlanner").then((m) => ({ default: m.BudgetSplitPlanner })),
);
const CurrencyConverter = React.lazy(() =>
  import("./CurrencyConverter").then((m) => ({ default: m.CurrencyConverter })),
);
const FreelanceTaxEstimator = React.lazy(() =>
  import("./FreelanceTaxEstimator").then((m) => ({ default: m.FreelanceTaxEstimator })),
);
const ExpenseSplitter = React.lazy(() =>
  import("./ExpenseSplitter").then((m) => ({ default: m.ExpenseSplitter })),
);

// HR Tools (already implemented)
const JdGenerator = React.lazy(() =>
  import("./JdGenerator").then((m) => ({ default: m.JdGenerator })),
);
const OfferLetterGenerator = React.lazy(() =>
  import("./OfferLetterGenerator").then((m) => ({ default: m.OfferLetterGenerator })),
);

// Branding/Profile tools
const LinkedinBannerGenerator = React.lazy(() =>
  import("./LinkedinBannerGenerator").then((m) => ({ default: m.LinkedinBannerGenerator })),
);
const LinkedinPostFormatter = React.lazy(() =>
  import("./LinkedinPostFormatter").then((m) => ({ default: m.LinkedinPostFormatter })),
);
const GithubProfileBuilder = React.lazy(() =>
  import("./GithubProfileBuilder").then((m) => ({ default: m.GithubProfileBuilder })),
);
const PortfolioBioGenerator = React.lazy(() =>
  import("./PortfolioBioGenerator").then((m) => ({ default: m.PortfolioBioGenerator })),
);
const TechStackBadgeGenerator = React.lazy(() =>
  import("./TechStackBadgeGenerator").then((m) => ({ default: m.TechStackBadgeGenerator })),
);
const LinkedinAboutGenerator = React.lazy(() =>
  import("./LinkedinAboutGenerator").then((m) => ({ default: m.LinkedinAboutGenerator })),
);
const GithubContributionCustomizer = React.lazy(() =>
  import("./GithubContributionCustomizer").then((m) => ({
    default: m.GithubContributionCustomizer,
  })),
);
const CaseStudyOutlineGenerator = React.lazy(() =>
  import("./CaseStudyOutlineGenerator").then((m) => ({ default: m.CaseStudyOutlineGenerator })),
);
const ResumeAtsChecker = React.lazy(() =>
  import("./ResumeAtsChecker").then((m) => ({ default: m.ResumeAtsChecker })),
);
const ResumeBulletRewriter = React.lazy(() =>
  import("./ResumeBulletRewriter").then((m) => ({ default: m.ResumeBulletRewriter })),
);
const ElevatorPitchGenerator = React.lazy(() =>
  import("./ElevatorPitchGenerator").then((m) => ({ default: m.ElevatorPitchGenerator })),
);

// Design tools
const ColorPaletteExtractor = React.lazy(() =>
  import("./ColorPaletteExtractor").then((m) => ({ default: m.ColorPaletteExtractor })),
);
const MoodPaletteGenerator = React.lazy(() =>
  import("./MoodPaletteGenerator").then((m) => ({ default: m.MoodPaletteGenerator })),
);
const TypographyPairer = React.lazy(() =>
  import("./TypographyPairer").then((m) => ({ default: m.TypographyPairer })),
);
const SvgToPngConverter = React.lazy(() =>
  import("./SvgToPngConverter").then((m) => ({ default: m.SvgToPngConverter })),
);
const MockupFrameGenerator = React.lazy(() =>
  import("./MockupFrameGenerator").then((m) => ({ default: m.MockupFrameGenerator })),
);
const FaviconGeneratorTool = React.lazy(() =>
  import("./FaviconGenerator").then((m) => ({ default: m.FaviconGenerator })),
);
const AspectRatioCropper = React.lazy(() =>
  import("./AspectRatioCropper").then((m) => ({ default: m.AspectRatioCropper })),
);
const SpacingGridGenerator = React.lazy(() =>
  import("./SpacingGridGenerator").then((m) => ({ default: m.SpacingGridGenerator })),
);
const IconPackBrowser = React.lazy(() =>
  import("./IconPackBrowser").then((m) => ({ default: m.IconPackBrowser })),
);
const DesignTokenExporter = React.lazy(() =>
  import("./DesignTokenExporter").then((m) => ({ default: m.DesignTokenExporter })),
);

// Writing tools
const WordCountTracker = React.lazy(() =>
  import("./WordCountTracker").then((m) => ({ default: m.WordCountTracker })),
);
const PlotOutlineGenerator = React.lazy(() =>
  import("./PlotOutlineGenerator").then((m) => ({ default: m.PlotOutlineGenerator })),
);
const CharacterNameGenerator = React.lazy(() =>
  import("./CharacterNameGenerator").then((m) => ({ default: m.CharacterNameGenerator })),
);
const ReadabilityScoreChecker = React.lazy(() =>
  import("./ReadabilityScoreChecker").then((m) => ({ default: m.ReadabilityScoreChecker })),
);
const CitationFormatter = React.lazy(() =>
  import("./CitationFormatter").then((m) => ({ default: m.CitationFormatter })),
);

// Media tools
const BpmTapTempo = React.lazy(() =>
  import("./BpmTapTempo").then((m) => ({ default: m.BpmTapTempo })),
);
const VideoAspectRatioCalculator = React.lazy(() =>
  import("./VideoAspectRatioCalculator").then((m) => ({ default: m.VideoAspectRatioCalculator })),
);
const ThumbnailAbPreviewer = React.lazy(() =>
  import("./ThumbnailAbPreviewer").then((m) => ({ default: m.ThumbnailAbPreviewer })),
);
const PodcastShowNotesGenerator = React.lazy(() =>
  import("./PodcastShowNotesGenerator").then((m) => ({ default: m.PodcastShowNotesGenerator })),
);
const AudioFormatConverter = React.lazy(() =>
  import("./AudioFormatConverter").then((m) => ({ default: m.AudioFormatConverter })),
);
const LoudnessNormalizerGuide = React.lazy(() =>
  import("./LoudnessNormalizerGuide").then((m) => ({ default: m.LoudnessNormalizerGuide })),
);

// Photography tools
const HeadshotBgRemover = React.lazy(() =>
  import("./HeadshotBgRemover").then((m) => ({ default: m.HeadshotBgRemover })),
);
const EventTimelineGenerator = React.lazy(() =>
  import("./EventTimelineGenerator").then((m) => ({ default: m.EventTimelineGenerator })),
);
const PhotographyPricingBuilder = React.lazy(() =>
  import("./PhotographyPricingBuilder").then((m) => ({ default: m.PhotographyPricingBuilder })),
);
const PhotoWatermarkTool = React.lazy(() =>
  import("./PhotoWatermarkTool").then((m) => ({ default: m.PhotoWatermarkTool })),
);
const ExifDataViewer = React.lazy(() =>
  import("./ExifDataViewer").then((m) => ({ default: m.ExifDataViewer })),
);
const ClientContractChecklist = React.lazy(() =>
  import("./ClientContractChecklist").then((m) => ({ default: m.ClientContractChecklist })),
);

// Content tools
const ContentCalendarGenerator = React.lazy(() =>
  import("./ContentCalendarGenerator").then((m) => ({ default: m.ContentCalendarGenerator })),
);

// Productivity
const PomodoroTimer = React.lazy(() => import("./productivity/pomodoro-timer"));
const MeetingCostCalculator = React.lazy(() => import("./productivity/meeting-cost-calculator"));
const WorldClock = React.lazy(() => import("./productivity/world-clock"));
const CountdownTimer = React.lazy(() => import("./productivity/countdown-timer"));
const RandomTeamGenerator = React.lazy(() => import("./productivity/random-team-generator"));
const DecisionWheelSpinner = React.lazy(() => import("./productivity/decision-wheel-spinner"));
const DailyStandupGenerator = React.lazy(() => import("./productivity/daily-standup-generator"));
const WeekNumberCalculator = React.lazy(() => import("./productivity/week-number-calculator"));
const WorkingDaysCalculator = React.lazy(() => import("./productivity/working-days-calculator"));
const ReadingTimeEstimator = React.lazy(() => import("./productivity/reading-time-estimator"));
const HabitStreakTracker = React.lazy(() => import("./productivity/habit-streak-tracker"));
const NoteToSelf = React.lazy(() => import("./productivity/note-to-self"));

// Career Tools
const CoverLetterTailor = React.lazy(() =>
  import("./CoverLetterTailor").then((m) => ({ default: m.CoverLetterTailor })),
);
const InterviewQuestionBank = React.lazy(() =>
  import("./InterviewQuestionBank").then((m) => ({ default: m.InterviewQuestionBank })),
);
const SalaryNegotiationScript = React.lazy(() =>
  import("./SalaryNegotiationScript").then((m) => ({ default: m.SalaryNegotiationScript })),
);
const FreelanceRateCalculator = React.lazy(() =>
  import("./FreelanceRateCalculator").then((m) => ({ default: m.FreelanceRateCalculator })),
);
const InvoiceGenerator = React.lazy(() =>
  import("./InvoiceGenerator").then((m) => ({ default: m.InvoiceGenerator })),
);
const StandupNoteFormatter = React.lazy(() =>
  import("./StandupNoteFormatter").then((m) => ({ default: m.StandupNoteFormatter })),
);
const MockInterviewTimer = React.lazy(() =>
  import("./MockInterviewTimer").then((m) => ({ default: m.MockInterviewTimer })),
);
const InterviewScorecard = React.lazy(() =>
  import("./InterviewScorecard").then((m) => ({ default: m.InterviewScorecard })),
);
const OnboardingChecklist = React.lazy(() =>
  import("./OnboardingChecklist").then((m) => ({ default: m.OnboardingChecklist })),
);
const SalaryBandCalculator = React.lazy(() =>
  import("./SalaryBandCalculator").then((m) => ({ default: m.SalaryBandCalculator })),
);
const EmployeeHandbookGenerator = React.lazy(() =>
  import("./EmployeeHandbookGenerator").then((m) => ({ default: m.EmployeeHandbookGenerator })),
);

// Marketing/SEO tools
const MetaTitleLengthChecker = React.lazy(() =>
  import("./MetaTitleLengthChecker").then((m) => ({ default: m.MetaTitleLengthChecker })),
);
const KeywordDensityAnalyzer = React.lazy(() =>
  import("./KeywordDensityAnalyzer").then((m) => ({ default: m.KeywordDensityAnalyzer })),
);
const UtmLinkBuilder = React.lazy(() =>
  import("./UtmLinkBuilder").then((m) => ({ default: m.UtmLinkBuilder })),
);
const AdCopyGenerator = React.lazy(() =>
  import("./AdCopyGenerator").then((m) => ({ default: m.AdCopyGenerator })),
);
const EmailSubjectTester = React.lazy(() =>
  import("./EmailSubjectTester").then((m) => ({ default: m.EmailSubjectTester })),
);
const SeoSlugGenerator = React.lazy(() =>
  import("./SeoSlugGenerator").then((m) => ({ default: m.SeoSlugGenerator })),
);
const ContentBriefGenerator = React.lazy(() =>
  import("./ContentBriefGenerator").then((m) => ({ default: m.ContentBriefGenerator })),
);
const BacklinkAnchorChecker = React.lazy(() =>
  import("./BacklinkAnchorChecker").then((m) => ({ default: m.BacklinkAnchorChecker })),
);

// E-commerce tools
const ProductDescriptionGenerator = React.lazy(() =>
  import("./ProductDescriptionGenerator").then((m) => ({ default: m.ProductDescriptionGenerator })),
);
const ProfitMarginCalculator = React.lazy(() =>
  import("./ProfitMarginCalculator").then((m) => ({ default: m.ProfitMarginCalculator })),
);
const SkuBarcodeGenerator = React.lazy(() =>
  import("./SkuBarcodeGenerator").then((m) => ({ default: m.SkuBarcodeGenerator })),
);
const ShippingCostEstimator = React.lazy(() =>
  import("./ShippingCostEstimator").then((m) => ({ default: m.ShippingCostEstimator })),
);
const ReturnPolicyGenerator = React.lazy(() =>
  import("./ReturnPolicyGenerator").then((m) => ({ default: m.ReturnPolicyGenerator })),
);
const CouponCodeGenerator = React.lazy(() =>
  import("./CouponCodeGenerator").then((m) => ({ default: m.CouponCodeGenerator })),
);
const InventoryReorderCalculator = React.lazy(() =>
  import("./InventoryReorderCalculator").then((m) => ({ default: m.InventoryReorderCalculator })),
);
const ProductPhotoBgRemover = React.lazy(() =>
  import("./ProductPhotoBgRemover").then((m) => ({ default: m.ProductPhotoBgRemover })),
);

// Legal tools
const NdaTemplateGenerator = React.lazy(() =>
  import("./NdaTemplateGenerator").then((m) => ({ default: m.NdaTemplateGenerator })),
);
const ContractClauseExplainer = React.lazy(() =>
  import("./ContractClauseExplainer").then((m) => ({ default: m.ContractClauseExplainer })),
);
const TrademarkChecker = React.lazy(() =>
  import("./TrademarkChecker").then((m) => ({ default: m.TrademarkChecker })),
);

// Real Estate tools
const RentVsBuyCalculator = React.lazy(() =>
  import("./RentVsBuyCalculator").then((m) => ({ default: m.RentVsBuyCalculator })),
);
const MortgageAffordability = React.lazy(() =>
  import("./MortgageAffordability").then((m) => ({ default: m.MortgageAffordability })),
);
const PropertyListingGenerator = React.lazy(() =>
  import("./PropertyListingGenerator").then((m) => ({ default: m.PropertyListingGenerator })),
);
const AreaUnitConverter = React.lazy(() =>
  import("./AreaUnitConverter").then((m) => ({ default: m.AreaUnitConverter })),
);
const RentalYieldCalculator = React.lazy(() =>
  import("./RentalYieldCalculator").then((m) => ({ default: m.RentalYieldCalculator })),
);

// Health tools
const BmiBodyMetrics = React.lazy(() =>
  import("./BmiBodyMetrics").then((m) => ({ default: m.BmiBodyMetrics })),
);
const WaterIntakeCalculator = React.lazy(() =>
  import("./WaterIntakeCalculator").then((m) => ({ default: m.WaterIntakeCalculator })),
);
const SleepCycleCalculator = React.lazy(() =>
  import("./SleepCycleCalculator").then((m) => ({ default: m.SleepCycleCalculator })),
);
const MedicationReminderBuilder = React.lazy(() =>
  import("./MedicationReminderBuilder").then((m) => ({ default: m.MedicationReminderBuilder })),
);
const StepActivityTracker = React.lazy(() =>
  import("./StepActivityTracker").then((m) => ({ default: m.StepActivityTracker })),
);
const WorkoutPlanGenerator = React.lazy(() =>
  import("./WorkoutPlanGenerator").then((m) => ({ default: m.WorkoutPlanGenerator })),
);
const MacroCalorieCalculator = React.lazy(() =>
  import("./MacroCalorieCalculator").then((m) => ({ default: m.MacroCalorieCalculator })),
);
const ProgressiveOverloadTracker = React.lazy(() =>
  import("./ProgressiveOverloadTracker").then((m) => ({ default: m.ProgressiveOverloadTracker })),
);
const RestTimer = React.lazy(() => import("./RestTimer").then((m) => ({ default: m.RestTimer })));

// Education tools
const LessonPlanGenerator = React.lazy(() =>
  import("./LessonPlanGenerator").then((m) => ({ default: m.LessonPlanGenerator })),
);
const RubricBuilder = React.lazy(() =>
  import("./RubricBuilder").then((m) => ({ default: m.RubricBuilder })),
);
const QuizGenerator = React.lazy(() =>
  import("./QuizGenerator").then((m) => ({ default: m.QuizGenerator })),
);
const GradeCurveCalculator = React.lazy(() =>
  import("./GradeCurveCalculator").then((m) => ({ default: m.GradeCurveCalculator })),
);
const CertificateGenerator = React.lazy(() =>
  import("./CertificateGenerator").then((m) => ({ default: m.CertificateGenerator })),
);
const AttendanceTracker = React.lazy(() =>
  import("./AttendanceTracker").then((m) => ({ default: m.AttendanceTracker })),
);

// Sales tools
const ColdEmailSequenceGenerator = React.lazy(() =>
  import("./ColdEmailSequenceGenerator").then((m) => ({ default: m.ColdEmailSequenceGenerator })),
);
const SalesPitchDeckOutline = React.lazy(() =>
  import("./SalesPitchDeckOutline").then((m) => ({ default: m.SalesPitchDeckOutline })),
);
const LeadScoringCalculator = React.lazy(() =>
  import("./LeadScoringCalculator").then((m) => ({ default: m.LeadScoringCalculator })),
);
const CommissionCalculator = React.lazy(() =>
  import("./CommissionCalculator").then((m) => ({ default: m.CommissionCalculator })),
);
const FollowupReminderScheduler = React.lazy(() =>
  import("./FollowupReminderScheduler").then((m) => ({ default: m.FollowupReminderScheduler })),
);

// Events tools
const EventBudgetPlanner = React.lazy(() =>
  import("./EventBudgetPlanner").then((m) => ({ default: m.EventBudgetPlanner })),
);
const EventBudgetSplitter = React.lazy(() =>
  import("./EventBudgetSplitter").then((m) => ({ default: m.EventBudgetSplitter })),
);
const RaffleWinnerPicker = React.lazy(() =>
  import("./RaffleWinnerPicker").then((m) => ({ default: m.RaffleWinnerPicker })),
);
const PollSurveyBuilder = React.lazy(() =>
  import("./PollSurveyBuilder").then((m) => ({ default: m.PollSurveyBuilder })),
);
const RsvpTracker = React.lazy(() =>
  import("./RsvpTracker").then((m) => ({ default: m.RsvpTracker })),
);
const SeatingChartGenerator = React.lazy(() =>
  import("./SeatingChartGenerator").then((m) => ({ default: m.SeatingChartGenerator })),
);

// No-Code tools
const ZapierWorkflowGenerator = React.lazy(() =>
  import("./ZapierWorkflowGenerator").then((m) => ({ default: m.ZapierWorkflowGenerator })),
);
const WebhookPayloadTester = React.lazy(() =>
  import("./WebhookPayloadTester").then((m) => ({ default: m.WebhookPayloadTester })),
);
const AirtableFormulaHelper = React.lazy(() =>
  import("./AirtableFormulaHelper").then((m) => ({ default: m.AirtableFormulaHelper })),
);
const FormSheetMapper = React.lazy(() =>
  import("./FormSheetMapper").then((m) => ({ default: m.FormSheetMapper })),
);

// Fun
const QrCodeGenerator = React.lazy(() => import("./fun/qr-code-generator"));
const BarcodeGenerator = React.lazy(() => import("./fun/barcode-generator"));
const RandomQuoteGenerator = React.lazy(() => import("./fun/random-quote-generator"));
const DevExcuseGenerator = React.lazy(() => import("./fun/dev-excuse-generator"));
const AsciiArtGenerator = React.lazy(() => import("./fun/ascii-art-generator"));
const MorseCodeConverter = React.lazy(() => import("./fun/morse-code-converter"));
const BrainfuckInterpreter = React.lazy(() => import("./fun/brainfuck-interpreter"));
const EmojiCombiner = React.lazy(() => import("./fun/emoji-combiner"));
const KeyboardShortcutCheatsheet = React.lazy(() => import("./fun/keyboard-shortcut-cheatsheet"));
const HttpCatReference = React.lazy(() => import("./fun/http-cat-reference"));
const NamingConventionGuide = React.lazy(() => import("./fun/naming-convention-guide"));
const LoremPicsumGallery = React.lazy(() => import("./fun/lorem-picsum-gallery"));

const registry: Record<string, React.ComponentType> = {
  "json-formatter": JsonFormatter,
  "regex-tester": RegexTester,
  "contrast-checker": ContrastChecker,
  "markdown-previewer": MarkdownPreviewer,
  "base64-url-codec": Base64UrlCodec,
  "uuid-hash": UuidHashGenerator,

  "box-shadow-generator": BoxShadowGenerator,
  "glassmorphism-generator": GlassmorphismGenerator,
  "neumorphism-generator": NeumorphismGenerator,
  "css-gradient-builder": CssGradientBuilder,
  "mesh-gradient-generator": MeshGradientGenerator,
  "css-filter-builder": CssFilterBuilder,
  "clip-path-editor": ClipPathEditor,
  "cubic-bezier-editor": CubicBezierEditor,
  "css-keyframe-builder": CssKeyframeBuilder,
  "svg-path-animator": SvgPathAnimator,
  "border-radius-generator": BorderRadiusGenerator,
  "css-specificity-calculator": CssSpecificityCalculator,
  "flexbox-playground": FlexboxPlayground,
  "css-grid-builder": CssGridBuilder,
  "scrollbar-styler": ScrollbarStyler,
  "css-variables-theme-builder": CssVariablesThemeBuilder,
  "tailwind-to-css": TailwindToCss,
  "css-to-tailwind": CssToTailwind,
  "css-units-converter": CssUnitsConverter,
  "css-text-shadow-builder": CssTextShadowBuilder,
  "z-index-manager": ZIndexManager,
  "print-css-generator": PrintCssGenerator,
  "transition-visualizer": TransitionVisualizer,
  "css-counter-generator": CssCounterGenerator,
  "css-outline-border-explorer": CssOutlineBorderExplorer,
  "css-animation-builder": CssAnimationBuilder,
  "svg-path-visualizer": SvgPathVisualizer,
  "live-css-playground": LiveCssPlayground,
  "tailwind-class-generator": TailwindClassGenerator,

  "hex-rgb-hsl-converter": HexRgbHslConverter,
  "color-palette-generator": ColorPaletteGenerator,
  "color-blind-simulator": ColorBlindSimulator,
  "wcag-contrast-checker": WcagContrastChecker,
  "image-to-color-palette": ImageToColorPalette,
  "color-gradient-generator": ColorGradientGenerator,
  "color-mixer": ColorMixer,
  "color-temperature-converter": ColorTemperatureConverter,
  "color-name-finder": ColorNameFinder,
  "random-color-generator": RandomColorGenerator,
  "color-shades-generator": ColorShadesGenerator,
  "pantone-to-hex": PantoneToHex,
  "color-harmony-explorer": ColorHarmonyExplorer,
  "dark-mode-palette-generator": DarkModePaletteGenerator,
  "css-color-variables-generator": CssColorVariablesGenerator,
  "color-story-from-emotion": ColorStoryFromEmotion,
  "brand-color-extractor": BrandColorExtractor,

  "jwt-decoder": JwtDecoder,
  "jwt-generator": JwtGenerator,
  "regex-visualizer": RegexVisualizer,
  "json-to-typescript": JsonToTypescript,
  "json-to-zod": JsonToZod,
  "json-to-python-dataclass": JsonToPythonDataclass,
  "json-diff": JsonDiff,
  "json-path-tester": JsonPathTester,
  "yaml-json-converter": YamlJsonConverter,
  "toml-json-converter": TomlJsonConverter,
  "cron-builder": CronBuilder,
  "cron-explainer": CronExplainer,
  "uuid-generator": UuidGenerator,
  "hash-generator": HashGenerator,
  "hmac-generator": HmacGenerator,
  "api-response-mocker": ApiResponseMocker,
  "http-status-codes": HttpStatusCodes,
  "http-header-analyzer": HttpHeaderAnalyzer,
  "env-validator": EnvValidator,
  "docker-compose-generator": DockerComposeGenerator,
  "gitignore-generator": GitignoreGenerator,
  "license-picker": LicensePicker,
  "semver-explainer": SemverExplainer,
  "npm-package-comparator": NpmPackageComparator,
  "eslint-rule-explorer": EslintRuleExplorer,
  "sql-formatter": SqlFormatter,
  "sql-to-mongodb": SqlToMongodb,
  "graphql-to-rest": GraphqlToRest,
  "git-command-explainer": GitCommandExplainer,
  "json-visualizer": JsonVisualizer,
  "sql-formatter-explainer": SqlFormatterExplainer,
  "docker-command-builder": DockerCommandBuilder,
  "unicode-symbol-finder": UnicodeSymbolFinder,
  "env-var-generator": EnvVarGenerator,
  "browser-storage-inspector": BrowserStorageInspector,
  "api-rate-limit-estimator": ApiRateLimitEstimator,
  "regex-tester-explainer": RegexTesterExplainer,

  "markdown-preview": MarkdownPreview,
  "markdown-table-generator": MarkdownTableGenerator,
  "word-counter": WordCounter,
  "text-diff": TextDiff,
  "lorem-ipsum-generator": LoremIpsumGenerator,
  "slug-generator": SlugGenerator,
  "case-converter": CaseConverter,
  "text-to-ascii-art": TextToAsciiArt,
  "emoji-finder": EmojiFinder,
  "string-escaper": StringEscaper,
  "duplicate-line-remover": DuplicateLineRemover,
  "text-sorter": TextSorter,
  "csv-to-json": CsvToJson,
  "json-to-csv": JsonToCsv,
  "csv-to-markdown-table": CsvToMarkdownTable,
  "whitespace-cleaner": WhitespaceCleaner,
  "text-repeater": TextRepeater,
  "find-replace": FindReplace,
  "letter-frequency": LetterFrequency,
  "headline-analyzer": HeadlineAnalyzer,
  "tweet-length-checker": TweetLengthChecker,
  "paragraph-shuffler": ParagraphShuffler,
  "palindrome-checker": PalindromeChecker,

  "base64-encoder": Base64Encoder,
  "url-encoder": UrlEncoder,
  "html-entity-encoder": HtmlEntityEncoder,
  "binary-text": BinaryText,
  "hex-decimal-binary": HexDecimalBinary,
  "unix-timestamp": UnixTimestamp,
  "timezone-overlap": TimezoneOverlap,
  "aspect-ratio-calculator": AspectRatioCalculator,
  "pixel-to-rem": PixelToRem,
  "svg-to-jsx": SvgToJsx,
  "jsx-to-html": JsxToHtml,
  "markdown-to-html": MarkdownToHtml,
  "html-to-markdown": HtmlToMarkdown,
  "number-to-words": NumberToWords,
  "roman-numeral": RomanNumeral,
  "temperature-converter": TemperatureConverter,
  "unit-converter": UnitConverter,
  "currency-formatter": CurrencyFormatter,
  "image-format-converter": ImageFormatConverter,
  "favicon-generator": FaviconGenerator,
  "css-px-pt": CssPxPt,
  "color-format-converter": ColorFormatConverter,
  "base64-image-converter": Base64ImageConverter,
  "timestamp-converter": TimestampConverter,

  "variable-namer": VariableNamer,
  "commit-message-generator": CommitMessageGenerator,
  "readme-generator": ReadmeGenerator,
  "code-explainer": CodeExplainer,
  "code-review-assistant": CodeReviewAssistant,
  "docstring-generator": DocstringGenerator,
  "test-case-generator": TestCaseGenerator,
  "api-endpoint-namer": ApiEndpointNamer,
  "pr-description-writer": PrDescriptionWriter,
  "component-props-generator": ComponentPropsGenerator,
  "error-message-explainer": ErrorMessageExplainer,
  "blog-intro-generator": BlogIntroGenerator,
  "meta-description-writer": MetaDescriptionWriter,
  "alt-text-generator": AltTextGenerator,
  "sql-query-generator": SqlQueryGenerator,
  "regex-generator": RegexGenerator,
  "tech-stack-suggester": TechStackSuggester,
  "color-story-generator": ColorStoryGenerator,
  "placeholder-content-generator": PlaceholderContentGenerator,
  "changelog-generator": ChangelogGenerator,
  "i18n-json-generator": I18nJsonGenerator,

  "og-meta-previewer": OgMetaPreviewer,
  "meta-tag-generator": MetaTagGenerator,
  "open-graph-generator": OpenGraphGenerator,
  "twitter-card-generator": TwitterCardGenerator,
  "robots-txt-generator": RobotsTxtGenerator,
  "sitemap-generator": SitemapGenerator,
  "keyword-density-checker": KeywordDensityChecker,
  "schema-markup-generator": SchemaMarkupGenerator,
  "page-title-analyzer": PageTitleAnalyzer,
  "utm-builder": UtmBuilder,
  "slug-seo-scorer": SlugSeoScorer,
  "canonical-url-checker": CanonicalUrlChecker,

  "password-generator": PasswordGenerator,
  "password-strength-checker": PasswordStrengthChecker,
  "password-hasher": PasswordHasher,
  "rsa-key-generator": RsaKeyGenerator,
  "aes-encrypt-decrypt": AesEncryptDecrypt,
  "cors-header-builder": CorsHeaderBuilder,
  "csp-builder": CspBuilder,
  "ip-lookup": IpLookup,
  "whois-lookup": WhoisLookup,
  "ssl-decoder": SslDecoder,
  "cvss-calculator": CvssCalculator,
  "privacy-policy-generator": PrivacyPolicyGenerator,

  "image-compressor": ImageCompressor,
  "image-resizer": ImageResizer,
  "image-cropper": ImageCropper,
  "image-to-base64": ImageToBase64,
  "svg-optimizer": SvgOptimizer,
  "svg-to-png": SvgToPng,
  "social-media-image-sizer": SocialMediaImageSizer,
  "photo-exif-viewer": PhotoExifViewer,
  "watermark-adder": WatermarkAdder,
  "image-color-picker": ImageColorPicker,
  "noise-texture-generator": NoiseTextureGenerator,
  "pattern-generator": PatternGenerator,
  "placeholder-image-generator": PlaceholderImageGenerator,
  "gif-frame-extractor": GifFrameExtractor,

  "code-beautifier": CodeBeautifier,
  "code-minifier": CodeMinifier,
  "code-to-image": CodeToImage,
  "html-preview": HtmlPreview,
  "typescript-playground": TypescriptPlayground,
  "github-badge-generator": GithubBadgeGenerator,
  "github-readme-stats": GithubReadmeStats,
  "dependency-size-checker": DependencySizeChecker,
  "mock-data-generator": MockDataGenerator,
  "api-docs-generator": ApiDocsGenerator,
  "prettier-config-builder": PrettierConfigBuilder,
  "eslint-config-builder": EslintConfigBuilder,
  "webpack-bundle-analyzer": WebpackBundleAnalyzer,

  "font-pair-finder": FontPairFinder,
  "font-weight-gallery": FontWeightGallery,
  "type-scale-generator": TypeScaleGenerator,
  "line-height-calculator": LineHeightCalculator,
  "google-fonts-picker": GoogleFontsPicker,
  "variable-font-playground": VariableFontPlayground,
  "letter-spacing-visualizer": LetterSpacingVisualizer,
  "web-safe-fonts-preview": WebSafeFontsPreview,
  "font-size-converter": FontSizeConverter,
  "ligature-explorer": LigatureExplorer,

  "percentage-calculator": PercentageCalculator,
  "compound-interest-calculator": CompoundInterestCalculator,
  "loan-emi-calculator": LoanEmiCalculator,
  "gst-tax-calculator": GstTaxCalculator,
  "discount-calculator": DiscountCalculator,
  "tip-calculator": TipCalculator,
  "bmi-calculator": BmiCalculator,
  "age-calculator": AgeCalculator,
  "date-difference-calculator": DateDifferenceCalculator,
  "prime-number-checker": PrimeNumberChecker,
  "fibonacci-generator": FibonacciGenerator,
  "scientific-calculator": ScientificCalculator,
  "matrix-calculator": MatrixCalculator,
  "binary-math-calculator": BinaryMathCalculator,

  "pomodoro-timer": PomodoroTimer,
  "meeting-cost-calculator": MeetingCostCalculator,
  "world-clock": WorldClock,
  "countdown-timer": CountdownTimer,
  "random-team-generator": RandomTeamGenerator,
  "decision-wheel-spinner": DecisionWheelSpinner,
  "daily-standup-generator": DailyStandupGenerator,
  "week-number-calculator": WeekNumberCalculator,
  "working-days-calculator": WorkingDaysCalculator,
  "reading-time-estimator": ReadingTimeEstimator,
  "habit-streak-tracker": HabitStreakTracker,
  "note-to-self": NoteToSelf,

  "qr-code-generator": QrCodeGenerator,
  "barcode-generator": BarcodeGenerator,
  "random-quote-generator": RandomQuoteGenerator,
  "dev-excuse-generator": DevExcuseGenerator,
  "ascii-art-generator": AsciiArtGenerator,
  "morse-code-converter": MorseCodeConverter,
  "brainfuck-interpreter": BrainfuckInterpreter,
  "emoji-combiner": EmojiCombiner,
  "keyboard-shortcut-cheatsheet": KeyboardShortcutCheatsheet,
  "http-cat-reference": HttpCatReference,
  "naming-convention-guide": NamingConventionGuide,
  "lorem-picsum-gallery": LoremPicsumGallery,

  "emi-loan-calculator": EmiLoanCalculator,
  "budget-split-planner": BudgetSplitPlanner,
  "currency-converter": CurrencyConverter,
  "freelance-tax-estimator": FreelanceTaxEstimator,
  "expense-splitter": ExpenseSplitter,

  // ── Auth-gated tools (stubs) ──────────────────────────────────────
  // Branding
  "linkedin-banner-generator": LinkedinBannerGenerator,
  "linkedin-post-formatter": LinkedinPostFormatter,
  "github-profile-builder": GithubProfileBuilder,
  "portfolio-bio-generator": PortfolioBioGenerator,
  "tech-stack-badge-generator": TechStackBadgeGenerator,
  "linkedin-about-generator": LinkedinAboutGenerator,
  "github-contribution-customizer": GithubContributionCustomizer,
  "case-study-outline-generator": CaseStudyOutlineGenerator,
  "resume-ats-checker": ResumeAtsChecker,
  "resume-bullet-rewriter": ResumeBulletRewriter,
  "elevator-pitch-generator": ElevatorPitchGenerator,
  "salary-negotiation-script": SalaryNegotiationScript,
  "cover-letter-tailor": CoverLetterTailor,
  "interview-question-bank": InterviewQuestionBank,
  "mock-interview-timer": MockInterviewTimer,
  "freelance-rate-calculator": FreelanceRateCalculator,
  "invoice-generator": InvoiceGenerator,

  // Design
  "color-palette-extractor": ColorPaletteExtractor,
  "mood-palette-generator": MoodPaletteGenerator,
  "typography-pairer": TypographyPairer,
  "svg-to-png-converter": SvgToPngConverter,
  "mockup-frame-generator": MockupFrameGenerator,
  "favicon-generator-all": FaviconGeneratorTool,
  "aspect-ratio-cropper": AspectRatioCropper,
  "spacing-grid-generator": SpacingGridGenerator,
  "icon-pack-browser": IconPackBrowser,
  "design-token-exporter": DesignTokenExporter,

  // Content
  "twitter-thread-formatter": TwitterThreadFormatter,
  "og-image-previewer": OgImagePreviewer,
  "hashtag-generator": HashtagGenerator,
  "instagram-caption-formatter": InstagramCaptionFormatter,
  // Content tools (auth-gated)
  "content-calendar-generator": ContentCalendarGenerator,
  "youtube-ab-text-tester": YoutubeAbTextTester,

  // Dev Utilities (auth-gated)
  "diff-checker": DiffChecker,
  "git-command-builder": GitCommandBuilder,
  "package-json-checker": PackageJsonChecker,
  "standup-note-formatter": StandupNoteFormatter,

  // Learning
  "big-o-cheatsheet": BigOCheatsheet,
  "algorithm-pattern-matcher": AlgorithmPatternMatcher,
  "flashcard-generator": FlashcardGenerator,
  "system-design-cheatsheet": SystemDesignCheatsheet,
  "leetcode-streak-visualizer": LeetcodeStreakVisualizer,
  "spaced-repetition-timer": SpacedRepetitionTimer,

  // Marketing
  "meta-title-length-checker": MetaTitleLengthChecker,
  "keyword-density-analyzer": KeywordDensityAnalyzer,
  "utm-link-builder": UtmLinkBuilder,
  "ad-copy-generator": AdCopyGenerator,
  "email-subject-tester": EmailSubjectTester,
  "seo-slug-generator": SeoSlugGenerator,
  "content-brief-generator": ContentBriefGenerator,
  "backlink-anchor-checker": BacklinkAnchorChecker,

  // E-commerce
  "product-description-generator": ProductDescriptionGenerator,
  "profit-margin-calculator": ProfitMarginCalculator,
  "sku-barcode-generator": SkuBarcodeGenerator,
  "shipping-cost-estimator": ShippingCostEstimator,
  "return-policy-generator": ReturnPolicyGenerator,
  "coupon-code-generator": CouponCodeGenerator,
  "inventory-reorder-calculator": InventoryReorderCalculator,
  "product-photo-bg-remover": ProductPhotoBgRemover,

  // Finance (implemented)

  // HR
  "jd-generator": JdGenerator,
  "offer-letter-generator": OfferLetterGenerator,
  "interview-scorecard": InterviewScorecard,
  "onboarding-checklist": OnboardingChecklist,
  "salary-band-calculator": SalaryBandCalculator,
  "employee-handbook-generator": EmployeeHandbookGenerator,

  // Legal
  "nda-template-generator": NdaTemplateGenerator,
  "contract-clause-explainer": ContractClauseExplainer,
  "trademark-checker": TrademarkChecker,

  // Real Estate
  "rent-vs-buy-calculator": RentVsBuyCalculator,
  "mortgage-affordability": MortgageAffordability,
  "property-listing-generator": PropertyListingGenerator,
  "area-unit-converter": AreaUnitConverter,
  "rental-yield-calculator": RentalYieldCalculator,

  // Photography
  "headshot-bg-remover": HeadshotBgRemover,
  "event-timeline-generator": EventTimelineGenerator,
  "photography-pricing-builder": PhotographyPricingBuilder,
  "photo-watermark-tool": PhotoWatermarkTool,
  "exif-data-viewer": ExifDataViewer,
  "client-contract-checklist": ClientContractChecklist,

  // Health
  "bmi-body-metrics": BmiBodyMetrics,
  "water-intake-calculator": WaterIntakeCalculator,
  "sleep-cycle-calculator": SleepCycleCalculator,
  "medication-reminder-builder": MedicationReminderBuilder,
  "step-activity-tracker": StepActivityTracker,

  // Fitness
  "workout-plan-generator": WorkoutPlanGenerator,
  "macro-calorie-calculator": MacroCalorieCalculator,
  "progressive-overload-tracker": ProgressiveOverloadTracker,
  "rest-timer": RestTimer,

  // Writing
  "word-count-tracker": WordCountTracker,
  "plot-outline-generator": PlotOutlineGenerator,
  "character-name-generator": CharacterNameGenerator,
  "readability-score-checker": ReadabilityScoreChecker,
  "citation-formatter": CitationFormatter,

  // Media
  "bpm-tap-tempo": BpmTapTempo,
  "video-aspect-ratio-calculator": VideoAspectRatioCalculator,
  "thumbnail-ab-previewer": ThumbnailAbPreviewer,
  "podcast-show-notes-generator": PodcastShowNotesGenerator,
  "audio-format-converter": AudioFormatConverter,
  "loudness-normalizer-guide": LoudnessNormalizerGuide,

  // Education
  "lesson-plan-generator": LessonPlanGenerator,
  "rubric-builder": RubricBuilder,
  "quiz-generator": QuizGenerator,
  "grade-curve-calculator": GradeCurveCalculator,
  "certificate-generator": CertificateGenerator,
  "attendance-tracker": AttendanceTracker,

  // Sales
  "cold-email-sequence-generator": ColdEmailSequenceGenerator,
  "sales-pitch-deck-outline": SalesPitchDeckOutline,
  "lead-scoring-calculator": LeadScoringCalculator,
  "commission-calculator": CommissionCalculator,
  "followup-reminder-scheduler": FollowupReminderScheduler,

  // Events
  "event-budget-planner": EventBudgetPlanner,
  "event-budget-splitter": EventBudgetSplitter,
  "raffle-winner-picker": RaffleWinnerPicker,
  "poll-survey-builder": PollSurveyBuilder,
  "rsvp-tracker": RsvpTracker,
  "seating-chart-generator": SeatingChartGenerator,

  // No-Code
  "zapier-workflow-generator": ZapierWorkflowGenerator,
  "webhook-payload-tester": WebhookPayloadTester,
  "airtable-formula-helper": AirtableFormulaHelper,
  "form-sheet-mapper": FormSheetMapper,
};

export function getToolComponent(slug: string): React.ComponentType | null {
  return registry[slug] || null;
}

export default registry;
