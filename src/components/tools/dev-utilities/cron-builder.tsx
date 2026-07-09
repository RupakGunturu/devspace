import { useState } from "react";
import { ToolLayout } from "../ToolLayout";
import { ToolInput } from "../ToolInput";
import { ToolOutput } from "../ToolOutput";
import { ToolButton } from "../ToolButton";

export default function CronBuilder() {
  const [minute, setMinute] = useState("*");
  const [hour, setHour] = useState("*");
  const [dom, setDom] = useState("*");
  const [month, setMonth] = useState("*");
  const [dow, setDow] = useState("*");

  const cron = `${minute} ${hour} ${dom} ${month} ${dow}`;
  const explain = () => `${minute === "*" ? "Every minute" : `Minute ${minute}`}, ${hour === "*" ? "every hour" : `hour ${hour}`}, ${dom === "*" ? "every day" : `day ${dom}`}, ${month === "*" ? "every month" : `month ${month}`}, ${dow === "*" ? "every day of week" : `day-of-week ${dow}`}`;

  return (
    <ToolLayout id="cron-builder">
      <div className="grid grid-cols-5 gap-3">
        {[{ l: "Min", v: minute, s: setMinute }, { l: "Hour", v: hour, s: setHour }, { l: "Day", v: dom, s: setDom }, { l: "Month", v: month, s: setMonth }, { l: "Week", v: dow, s: setDow }].map((f) => (
          <div key={f.l}><label className="block text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{f.l}</label><input value={f.v} onChange={(e) => f.s(e.target.value)} className="w-full p-2.5 bg-paper-dim/50 border border-border rounded-sm text-sm font-mono text-foreground text-center" /></div>
        ))}
      </div>
      <div className="p-4 bg-paper-dim/50 border border-border rounded-sm"><span className="text-[10px] uppercase tracking-wider text-muted-foreground">Cron Expression</span><p className="font-mono text-lg text-foreground mt-1">{cron}</p><p className="text-sm text-muted-foreground mt-2">{explain()}</p></div>
      <div className="flex gap-2 flex-wrap">
        <ToolButton onClick={() => { setMinute("0"); setHour("9"); setDom("*"); setMonth("*"); setDow("1-5"); }} variant="secondary">Weekdays 9AM</ToolButton>
        <ToolButton onClick={() => { setMinute("*/5"); setHour("*"); setDom("*"); setMonth("*"); setDow("*"); }} variant="secondary">Every 5 min</ToolButton>
        <ToolButton onClick={() => { setMinute("0"); setHour("0"); setDom("1"); setMonth("*"); setDow("*"); }} variant="secondary">Monthly midnight</ToolButton>
      </div>
    </ToolLayout>
  );
}
