import React from "react";

// Existing tools (named exports → wrap for React.lazy)
const JsonFormatter = React.lazy(() => import("./JsonFormatter").then((m) => ({ default: m.JsonFormatter })));
const RegexTester = React.lazy(() => import("./RegexTester").then((m) => ({ default: m.RegexTester })));
const ContrastChecker = React.lazy(() => import("./ContrastChecker").then((m) => ({ default: m.ContrastChecker })));
const MarkdownPreviewer = React.lazy(() => import("./MarkdownPreviewer").then((m) => ({ default: m.MarkdownPreviewer })));
const Base64UrlCodec = React.lazy(() => import("./Base64UrlCodec").then((m) => ({ default: m.Base64UrlCodec })));
const UuidHashGenerator = React.lazy(() => import("./UuidHashGenerator").then((m) => ({ default: m.UuidHashGenerator })));

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
const CssColorVariablesGenerator = React.lazy(() => import("./color/css-color-variables-generator"));
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
const BrowserStorageInspector = React.lazy(() => import("./dev-utilities/browser-storage-inspector"));
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
};

export function getToolComponent(slug: string): React.ComponentType | null {
  return registry[slug] || null;
}

export default registry;
