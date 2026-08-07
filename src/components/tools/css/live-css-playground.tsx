import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

const CSS_TO_REACT_MAP: Record<string, string> = {
  background: "backgroundImage",
  "background-color": "backgroundColor",
  "background-image": "backgroundImage",
  "background-size": "backgroundSize",
  "background-position": "backgroundPosition",
  "border-radius": "borderRadius",
  "border-top-left-radius": "borderTopLeftRadius",
  "border-top-right-radius": "borderTopRightRadius",
  "border-bottom-left-radius": "borderBottomLeftRadius",
  "border-bottom-right-radius": "borderBottomRightRadius",
  "border-color": "borderColor",
  "border-width": "borderWidth",
  "border-style": "borderStyle",
  "border-top": "borderTop",
  "border-right": "borderRight",
  "border-bottom": "borderBottom",
  "border-left": "borderLeft",
  "text-align": "textAlign",
  "text-decoration": "textDecoration",
  "text-transform": "textTransform",
  "text-shadow": "textShadow",
  "text-overflow": "textOverflow",
  "font-size": "fontSize",
  "font-weight": "fontWeight",
  "font-family": "fontFamily",
  "font-style": "fontStyle",
  "line-height": "lineHeight",
  "letter-spacing": "letterSpacing",
  "word-spacing": "wordSpacing",
  "word-break": "wordBreak",
  "box-shadow": "boxShadow",
  "box-sizing": "boxSizing",
  "margin-top": "marginTop",
  "margin-right": "marginRight",
  "margin-bottom": "marginBottom",
  "margin-left": "marginLeft",
  "padding-top": "paddingTop",
  "padding-right": "paddingRight",
  "padding-bottom": "paddingBottom",
  "padding-left": "paddingLeft",
  "max-width": "maxWidth",
  "max-height": "maxHeight",
  "min-width": "minWidth",
  "min-height": "minHeight",
  "overflow-x": "overflowX",
  "overflow-y": "overflowY",
  "overflow-wrap": "overflowWrap",
  "white-space": "whiteSpace",
  "pointer-events": "pointerEvents",
  "object-fit": "objectFit",
  "object-position": "objectPosition",
  "list-style": "listStyle",
  "flex-direction": "flexDirection",
  "flex-wrap": "flexWrap",
  "flex-grow": "flexGrow",
  "flex-shrink": "flexShrink",
  "flex-basis": "flexBasis",
  "align-items": "alignItems",
  "align-content": "alignContent",
  "align-self": "alignSelf",
  "justify-content": "justifyContent",
  "justify-items": "justifyItems",
  "justify-self": "justifySelf",
  "grid-template-columns": "gridTemplateColumns",
  "grid-template-rows": "gridTemplateRows",
  "grid-column": "gridColumn",
  "grid-row": "gridRow",
  "grid-gap": "gridGap",
  "column-gap": "columnGap",
  "row-gap": "rowGap",
  "z-index": "zIndex",
  "opacity": "opacity",
  "transform-origin": "transformOrigin",
  "animation-name": "animationName",
  "animation-duration": "animationDuration",
  "animation-timing-function": "animationTimingFunction",
  "animation-delay": "animationDelay",
  "animation-iteration-count": "animationIterationCount",
  "animation-direction": "animationDirection",
  "transition-property": "transitionProperty",
  "transition-duration": "transitionDuration",
  "transition-timing-function": "transitionTimingFunction",
  "transition-delay": "transitionDelay",
  "backdrop-filter": "backdropFilter",
  "clip-path": "clipPath",
  "mask-image": "maskImage",
  "touch-action": "touchAction",
  "image-rendering": "imageRendering",
  "shape-outside": "shapeOutside",
};

function kebabToCamel(prop: string): string {
  return prop
    .split("-")
    .map((word, i) => (i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
    .join("");
}

function parseCssToStyle(cssText: string): React.CSSProperties {
  const style: Record<string, string> = {};

  cssText.split("\n").filter(Boolean).forEach((line) => {
    const colonIndex = line.indexOf(":");
    if (colonIndex === -1) return;

    const rawProp = line.slice(0, colonIndex).trim();
    const value = line.slice(colonIndex + 1).trim().replace(/;$/, "");

    if (!rawProp || !value) return;

    const camelProp = CSS_TO_REACT_MAP[rawProp] || kebabToCamel(rawProp);
    style[camelProp] = value;
  });

  return style as React.CSSProperties;
}

export default function LiveCssPlayground() {
  const [css, setCss] = useState("background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);\ncolor: white;\npadding: 2rem;\nborder-radius: 12px;\ntext-align: center;\nfont-size: 1.5rem;\nfont-weight: bold;\nbox-shadow: 0 10px 30px rgba(0,0,0,0.2);");

  return (
    <ToolLayout id="live-css-playground">
      <ToolInput value={css} onChange={setCss} placeholder="Write CSS here..." label="CSS" rows={10} />
      <div>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Live Preview</label>
        <div
          className="w-full min-h-[200px] border border-border rounded-sm overflow-hidden"
        >
          <div style={parseCssToStyle(css)}>
            Hello World! This is a preview element.
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
