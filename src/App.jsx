import React from "react";
import { useState, useEffect, useRef, useMemo } from "react";
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { createClient } from "@supabase/supabase-js";

/* ─── Error Boundary ─── */
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) return (
      <div style={{padding:40,color:"#e85a5a",fontFamily:"monospace",background:"#07111d",minHeight:"100vh"}}>
        <div style={{fontSize:18,marginBottom:12}}>Something went wrong:</div>
        <pre style={{fontSize:12,whiteSpace:"pre-wrap"}}>{this.state.error?.message}</pre>
        <button onClick={()=>this.setState({error:null})} style={{marginTop:20,padding:"10px 20px",background:"#c8943a",border:"none",borderRadius:6,cursor:"pointer",color:"#000"}}>Try Again</button>
      </div>
    );
    return this.props.children;
  }
}
const C23 = {
  v1_4:   "וַיִּהְיוּ חַיֵּי שָׂרָה מֵאָה שָׁנָה וְעֶשְׂרִים שָׁנָה וְשֶׁבַע שָׁנִים שְׁנֵי חַיֵּי שָׂרָה וַתָּמָת שָׂרָה בְּקִרְיַת אַרְבַּע הִוא חֶבְרוֹן בְּאֶרֶץ כְּנָעַן וַיָּבֹא אַבְרָהָם לִסְפֹּד לְשָׂרָה וְלִבְכֹּתָהּ וַיָּקָם אַבְרָהָם מֵעַל פְּנֵי מֵתוֹ וַיְדַבֵּר אֶל בְּנֵי חֵת לֵאמֹר גֵּר וְתוֹשָׁב אָנֹכִי עִמָּכֶם תְּנוּ לִי אֲחֻזַּת קֶבֶר עִמָּכֶם וְאֶקְבְּרָה מֵתִי מִלְּפָנָי",
  v5_8:   "וַיַּעֲנוּ בְנֵי חֵת אֶת אַבְרָהָם לֵאמֹר לוֹ שְׁמָעֵנוּ אֲדֹנִי נְשִׂיא אֱלֹהִים אַתָּה בְּתוֹכֵנוּ בְּמִבְחַר קְבָרֵינוּ קְבֹר אֶת מֵתֶךָ אִישׁ מִמֶּנּוּ אֶת קִבְרוֹ לֹא יִכְלֶה מִמְּךָ מִקְּבֹר מֵתֶךָ וַיָּקָם אַבְרָהָם וַיִּשְׁתַּחוּ לְעַם הָאָרֶץ לִבְנֵי חֵת וַיְדַבֵּר אִתָּם לֵאמֹר אִם יֵשׁ אֶת נַפְשְׁכֶם לִקְבֹּר אֶת מֵתִי מִלְּפָנַי שְׁמָעוּנִי וּפִגְעוּ לִי בְּעֶפְרוֹן בֶּן צֹחַר",
  v9_12:  "וְיִתֶּן לִי אֶת מְעָרַת הַמַּכְפֵּלָה אֲשֶׁר לוֹ אֲשֶׁר בִּקְצֵה שָׂדֵהוּ בְּכֶסֶף מָלֵא יִתְּנֶנָּה לִי בְּתוֹכְכֶם לַאֲחֻזַּת קָבֶר וְעֶפְרוֹן יֹשֵׁב בְּתוֹךְ בְּנֵי חֵת וַיַּעַן עֶפְרוֹן הַחִתִּי אֶת אַבְרָהָם בְּאָזְנֵי בְנֵי חֵת לְכֹל בָּאֵי שַׁעַר עִירוֹ לֵאמֹר לֹא אֲדֹנִי שְׁמָעֵנִי הַשָּׂדֶה נָתַתִּי לָךְ וְהַמְּעָרָה אֲשֶׁר בּוֹ לְךָ נְתַתִּיהָ לְעֵינֵי בְנֵי עַמִּי נְתַתִּיהָ לָּךְ קְבֹר מֵתֶךָ וַיִּשְׁתַּחוּ אַבְרָהָם לִפְנֵי עַם הָאָרֶץ",
  v13_16: "וַיְדַבֵּר אֶל עֶפְרוֹן בְּאָזְנֵי עַם הָאָרֶץ לֵאמֹר אַךְ אִם אַתָּה לוּ שְׁמָעֵנִי נָתַתִּי כֶּסֶף הַשָּׂדֶה קַח מִמֶּנִּי וְאֶקְבְּרָה אֶת מֵתִי שָׁמָּה וַיַּעַן עֶפְרוֹן אֶת אַבְרָהָם לֵאמֹר לוֹ אֲדֹנִי שְׁמָעֵנִי אֶרֶץ אַרְבַּע מֵאֹת שֶׁקֶל כֶּסֶף בֵּינִי וּבֵינְךָ מַה הִוא וְאֶת מֵתְךָ קְבֹר וַיִּשְׁמַע אַבְרָהָם אֶל עֶפְרוֹן וַיִּשְׁקֹל אַבְרָהָם לְעֶפְרֹן אֶת הַכֶּסֶף אֲשֶׁר דִּבֶּר בְּאָזְנֵי בְנֵי חֵת אַרְבַּע מֵאוֹת שֶׁקֶל כֶּסֶף עֹבֵר לַסֹּחֵר",
  v17_20: "וַיָּקָם שְׂדֵה עֶפְרוֹן אֲשֶׁר בַּמַּכְפֵּלָה אֲשֶׁר לִפְנֵי מַמְרֵא הַשָּׂדֶה וְהַמְּעָרָה אֲשֶׁר בּוֹ וְכָל הָעֵץ אֲשֶׁר בַּשָּׂדֶה אֲשֶׁר בְּכָל גְּבֻלוֹ סָבִיב לְאַבְרָהָם לְמִקְנָה לְעֵינֵי בְנֵי חֵת בְּכֹל בָּאֵי שַׁעַר עִירוֹ וְאַחֲרֵי כֵן קָבַר אַבְרָהָם אֶת שָׂרָה אִשְׁתּוֹ אֶל מְעָרַת שְׂדֵה הַמַּכְפֵּלָה עַל פְּנֵי מַמְרֵא הִוא חֶבְרוֹן בְּאֶרֶץ כְּנָעַן וַיָּקָם הַשָּׂדֶה וְהַמְּעָרָה אֲשֶׁר בּוֹ לְאַבְרָהָם לַאֲחֻזַּת קָבֶר מֵאֵת בְּנֵי חֵת",
};

/* ─── Siddur Text ─── */
const HM1 = "הַמֵּאִיר לָאָרֶץ וְלַדָּרִים עָלֶיהָ בְּרַחֲמִים וּבְטוּבוֹ מְחַדֵּשׁ בְּכָל יוֹם תָּמִיד מַעֲשֵׂה בְרֵאשִׁית מָה רַבּוּ מַעֲשֶׂיךָ יְיָ כֻּלָּם בְּחָכְמָה עָשִׂיתָ מָלְאָה הָאָרֶץ קִנְיָנֶךָ הַמֶּלֶךְ הַמְרוֹמָם לְבַדּוֹ מֵאָז הַמְשֻׁבָּח וְהַמְפֹאָר וְהַמִּתְנַשֵּׂא מִימוֹת עוֹלָם";
const HM2 = "אֱלֹהֵי עוֹלָם בְּרַחֲמֶיךָ הָרַבִּים רַחֵם עָלֵינוּ אֲדוֹן עֻזֵּנוּ צוּר מִשְׂגַּבֵּנוּ מָגֵן יִשְׁעֵנוּ מִשְׂגָּב בַּעֲדֵנוּ אֵל בָּרוּךְ גְּדוֹל דֵּעָה הֵכִין וּפָעַל זָהֳרֵי חַמָּה טוֹב יָצַר כָּבוֹד לִשְׁמוֹ";
const HM3 = "מְאוֹרוֹת נָתַן סְבִיבוֹת עֻזּוֹ פִּנּוֹת צְבָאָיו קְדוֹשִׁים רוֹמְמֵי שַׁדַּי תָּמִיד מְסַפְּרִים כְּבוֹד אֵל וּקְדֻשָּׁתוֹ תִּתְבָּרֵךְ יְיָ אֱלֹהֵינוּ בַּשָּׁמַיִם מִמַּעַל וְעַל הָאָרֶץ מִתָּחַת עַל כָּל שֶׁבַח מַעֲשֵׂה יָדֶיךָ וְעַל מְאוֹרֵי אוֹר שֶׁיָּצַרְתָּ יְפָאֲרוּךָ סֶּלָה";
const HM_FULL = HM1 + " " + HM2 + " " + HM3;

const P147 = [
  "הַלְלוּיָהּ כִּי טוֹב זַמְּרָה אֱלֹהֵינוּ כִּי נָעִים נָאוָה תְהִלָּה בּוֹנֵה יְרוּשָׁלַיִם יְיָ נִדְחֵי יִשְׂרָאֵל יְכַנֵּס הָרוֹפֵא לִשְׁבוּרֵי לֵב וּמְחַבֵּשׁ לְעַצְּבוֹתָם מוֹנֶה מִסְפָּר לַכּוֹכָבִים לְכֻלָּם שֵׁמוֹת יִקְרָא",
  "גָּדוֹל אֲדוֹנֵינוּ וְרַב כֹּחַ לִתְבוּנָתוֹ אֵין מִסְפָּר מְעוֹדֵד עֲנָוִים יְיָ מַשְׁפִּיל רְשָׁעִים עֲדֵי אָרֶץ עֱנוּ לַיְיָ בְּתוֹדָה זַמְּרוּ לֵאלֹהֵינוּ בְכִנּוֹר הַמְכַסֶּה שָׁמַיִם בְּעָבִים הַמֵּכִין לָאָרֶץ מָטָר הַמַּצְמִיחַ הָרִים חָצִיר",
  "נוֹתֵן לִבְהֵמָה לַחְמָהּ לִבְנֵי עֹרֵב אֲשֶׁר יִקְרָאוּ לֹא בִגְבוּרַת הַסּוּס יֶחְפָּץ לֹא בְשׁוֹקֵי הָאִישׁ יִרְצֶה רוֹצֶה יְיָ אֶת יְרֵאָיו אֶת הַמְיַחֲלִים לְחַסְדּוֹ שַׁבְּחִי יְרוּשָׁלַיִם אֶת יְיָ הַלְלִי אֱלֹהַיִךְ צִיּוֹן",
  "כִּי חִזַּק בְּרִיחֵי שְׁעָרָיִךְ בֵּרַךְ בָּנַיִךְ בְּקִרְבֵּךְ הַשָּׂם גְּבוּלֵךְ שָׁלוֹם חֵלֶב חִטִּים יַשְׂבִּיעֵךְ הַשֹּׁלֵחַ אִמְרָתוֹ אָרֶץ עַד מְהֵרָה יָרוּץ דְּבָרוֹ הַנֹּתֵן שֶׁלֶג כַּצָּמֶר כְּפוֹר כָּאֵפֶר יְפַזֵּר",
  "מַשְׁלִיךְ קַרְחוֹ כְפִתִּים לִפְנֵי קָרָתוֹ מִי יַעֲמֹד יִשְׁלַח דְּבָרוֹ וְיַמְסֵם יַשֵּׁב רוּחוֹ יִזְּלוּ מָיִם מַגִּיד דְּבָרָיו לְיַעֲקֹב חֻקָּיו וּמִשְׁפָּטָיו לְיִשְׂרָאֵל לֹא עָשָׂה כֵן לְכָל גּוֹי וּמִשְׁפָּטִים בַּל יְדָעוּם הַלְלוּיָהּ",
];

const P148 = [
  "הַלְלוּיָהּ הַלְלוּ אֶת יְיָ מִן הַשָּׁמַיִם הַלְלוּהוּ בַּמְּרוֹמִים הַלְלוּהוּ כָל מַלְאָכָיו הַלְלוּהוּ כָּל צְבָאָיו הַלְלוּהוּ שֶׁמֶשׁ וְיָרֵחַ הַלְלוּהוּ כָּל כּוֹכְבֵי אוֹר הַלְלוּהוּ שְׁמֵי הַשָּׁמָיִם וְהַמַּיִם אֲשֶׁר מֵעַל הַשָּׁמָיִם",
  "יְהַלְלוּ אֶת שֵׁם יְיָ כִּי הוּא צִוָּה וְנִבְרָאוּ וַיַּעֲמִידֵם לָעַד לְעוֹלָם חָק נָתַן וְלֹא יַעֲבוֹר הַלְלוּ אֶת יְיָ מִן הָאָרֶץ תַּנִּינִים וְכָל תְּהֹמוֹת אֵשׁ וּבָרָד שֶׁלֶג וְקִיטוֹר רוּחַ סְעָרָה עֹשָׂה דְבָרוֹ",
  "הֶהָרִים וְכָל גְּבָעוֹת עֵץ פְּרִי וְכָל אֲרָזִים הַחַיָּה וְכָל בְּהֵמָה רֶמֶשׂ וְצִפּוֹר כָּנָף מַלְכֵי אֶרֶץ וְכָל לְאֻמִּים שָׂרִים וְכָל שֹׁפְטֵי אָרֶץ בַּחוּרִים וְגַם בְּתוּלוֹת זְקֵנִים עִם נְעָרִים",
  "יְהַלְלוּ אֶת שֵׁם יְיָ כִּי נִשְׂגָּב שְׁמוֹ לְבַדּוֹ הוֹדוֹ עַל אֶרֶץ וְשָׁמָיִם וַיָּרֶם קֶרֶן לְעַמּוֹ תְּהִלָּה לְכָל חֲסִידָיו לִבְנֵי יִשְׂרָאֵל עַם קְרֹבוֹ הַלְלוּיָהּ",
];

/* ─── 50-Day Schedule ─── */
const SCH = [
  {days:[1,4],   ch:{id:"c1",heb:"בְּרֵאשִׁית כ״ג:א-ד",  en:"Bereishit 23:1–4",  text:C23.v1_4},   sid:{id:"s1",heb:"הַמֵּאִיר א",       en:"HaMeir I",          text:HM1}},
  {days:[5,8],   ch:{id:"c2",heb:"בְּרֵאשִׁית כ״ג:ה-ח",  en:"Bereishit 23:5–8",  text:C23.v5_8},   sid:{id:"s2",heb:"הַמֵּאִיר ב",       en:"HaMeir II",         text:HM2}},
  {days:[9,12],  ch:{id:"c3",heb:"בְּרֵאשִׁית כ״ג:ט-יב", en:"Bereishit 23:9–12", text:C23.v9_12},  sid:{id:"s3",heb:"הַמֵּאִיר ג",       en:"HaMeir III",        text:HM3}},
  {days:[13,16], ch:{id:"c4",heb:"בְּרֵאשִׁית כ״ג:יג-טז",en:"Bereishit 23:13–16",text:C23.v13_16}, sid:{id:"s4",heb:"תהלים קמ״ז א-ד",   en:"Psalm 147:1–4",     text:P147[0]}},
  {days:[17,17], ch:{id:"c5",heb:"בְּרֵאשִׁית כ״ג:יז-כ", en:"Bereishit 23:17–20",text:C23.v17_20}, sid:{id:"s5",heb:"תהלים קמ״ז ה-ח",   en:"Psalm 147:5–8",     text:P147[1]}},
  {days:[18,18], review:true},
  {days:[19,22], ch:{id:"c1",heb:"בְּרֵאשִׁית כ״ג:א-ד",  en:"Bereishit 23:1–4",  text:C23.v1_4},   sid:{id:"s6",heb:"תהלים קמ״ז ט-יב",  en:"Psalm 147:9–12",    text:P147[2]}},
  {days:[23,26], ch:{id:"c2",heb:"בְּרֵאשִׁית כ״ג:ה-ח",  en:"Bereishit 23:5–8",  text:C23.v5_8},   sid:{id:"s7",heb:"תהלים קמ״ז יג-טז", en:"Psalm 147:13–16",   text:P147[3]}},
  {days:[27,29], ch:{id:"c3",heb:"בְּרֵאשִׁית כ״ג:ט-יב", en:"Bereishit 23:9–12", text:C23.v9_12},  sid:{id:"s8",heb:"תהלים קמ״ז יז-כ",  en:"Psalm 147:17–20",   text:P147[4]}},
  {days:[30,30], review:true},
  {days:[31,34], ch:{id:"c4",heb:"בְּרֵאשִׁית כ״ג:יג-טז",en:"Bereishit 23:13–16",text:C23.v13_16}, sid:{id:"s9",heb:"תהלים קמ״ח א-ד",   en:"Psalm 148:1–4",     text:P148[0]}},
  {days:[35,38], ch:{id:"c5",heb:"בְּרֵאשִׁית כ״ג:יז-כ", en:"Bereishit 23:17–20",text:C23.v17_20}, sid:{id:"s10",heb:"תהלים קמ״ח ה-ח",  en:"Psalm 148:5–8",     text:P148[1]}},
  {days:[39,42], ch:{id:"c1",heb:"בְּרֵאשִׁית כ״ג:א-ד",  en:"Bereishit 23:1–4",  text:C23.v1_4},   sid:{id:"s11",heb:"תהלים קמ״ח ט-יב", en:"Psalm 148:9–12",    text:P148[2]}},
  {days:[43,46], ch:{id:"c2",heb:"בְּרֵאשִׁית כ״ג:ה-ח",  en:"Bereishit 23:5–8",  text:C23.v5_8},   sid:{id:"s12",heb:"תהלים קמ״ח יג-יד",en:"Psalm 148:13–14",   text:P148[3]}},
  {days:[47,49], ch:{id:"c3",heb:"בְּרֵאשִׁית כ״ג:ט-יב", en:"Bereishit 23:9–12", text:C23.v9_12},  sid:{id:"s13",heb:"הַמֵּאִיר (כֻּלּוֹ)",en:"Full HaMeir",       text:HM_FULL}},
  {days:[50,50], review:true, complete:true},
];

const getDayEntry  = d => SCH.find(e => d >= e.days[0] && d <= e.days[1]);
const getReviewPassages = day => {
  const seen = new Set(); const out = [];
  SCH.filter(e => !e.review && e.days[1] < day).forEach(e => {
    [e.ch, e.sid].forEach(p => { if (!seen.has(p.id)) { seen.add(p.id); out.push(p); } });
  });
  return out;
};

/* ─── Storage ─── */
const SK = {
  sessions: n => `hr:s:${n.toLowerCase().replace(/\s+/g,"-")}`,
  teacherPin: "hr:teacher-pin", roster: "hr:roster", custom: "hr:custom",
};
/* ─── Supabase Config ─── */
const SUPABASE_URL = "https://qrtaqtgwrqpgbbxtlrrd.supabase.co";
const SUPABASE_KEY = "sb_publishable_CBniNc1A-K-4ojVV-rM5_g_pLXsiVo5";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const dbGet = async (k, fb) => {
  try {
    const { data, error } = await supabase
      .from("kv_store")
      .select("value")
      .eq("key", k)
      .maybeSingle();
    if (error) { console.error("dbGet error:", error); return fb; }
    return data ? data.value : fb;
  } catch (e) { console.error("dbGet exception:", e); return fb; }
};

const dbSet = async (k, v) => {
  try {
    const { error } = await supabase
      .from("kv_store")
      .upsert({ key: k, value: v }, { onConflict: "key" });
    if (error) console.error("dbSet error:", error);
  } catch (e) { console.error("dbSet exception:", e); }
};

const dbDel = async (k) => {
  try {
    const { error } = await supabase
      .from("kv_store")
      .delete()
      .eq("key", k);
    if (error) console.error("dbDel error:", error);
  } catch (e) { console.error("dbDel exception:", e); }
};
const normName = s => s.trim().toLowerCase();
const DEMO = "demo";

/* ─── Design ─── */
const C = { bg:"#07111d", surface:"#0c1a2b", card:"#0f1f30", border:"#1a2e45", gold:"#c8943a", goldL:"#e5ab48", goldD:"#5a4018", cream:"#ecd9b2", green:"#4dbd72", red:"#e85a5a", blue:"#5da4e4", text:"#cfe0f0", muted:"#3d6080" };
const fontLink = `@import url('https://fonts.googleapis.com/css2?family=Frank+Ruhl+Libre:wght@300;400;500;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&display=swap');`;
const CSS = `${fontLink}
html,body{background:${C.bg};color:${C.text};font-family:'Cormorant Garamond',Georgia,serif;margin:0;padding:0}
*{box-sizing:border-box}
.heb{font-family:'Frank Ruhl Libre',serif;direction:rtl}
.fade{animation:fd .35s ease both}
@keyframes fd{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.word-btn{background:transparent;border:2px solid transparent;border-radius:6px;cursor:pointer;font-family:'Frank Ruhl Libre',serif;transition:all .15s;padding:4px 6px;line-height:1.9}
.word-btn.correct{border-color:${C.green}55;background:${C.green}12;color:${C.green}}
.word-btn.incorrect{border-color:${C.red}55;background:${C.red}12;color:${C.red};text-decoration:line-through}
.shake{animation:shk .45s ease}
@keyframes shk{0%,100%{transform:translateX(0)}20%{transform:translateX(-10px)}40%{transform:translateX(10px)}60%{transform:translateX(-8px)}80%{transform:translateX(8px)}}
.pop{animation:pp .5s cubic-bezier(.17,.67,.35,1.3) both}
@keyframes pp{from{opacity:0;transform:scale(.85) translateY(-10px)}to{opacity:1;transform:scale(1) translateY(0)}}
input,textarea,select{background:${C.surface};border:1px solid ${C.border};color:${C.cream};border-radius:8px;padding:10px 14px;font-family:'Cormorant Garamond',Georgia,serif;font-size:16px;outline:none;transition:.2s;display:block}
input:focus,textarea:focus,select:focus{border-color:${C.gold}}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${C.goldD};border-radius:3px}`;
const B = (v="p",x={}) => ({ padding:"10px 22px",borderRadius:6,border:"none",cursor:"pointer",fontSize:15,fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:600,letterSpacing:.4,transition:"all .18s",
  ...(v==="p"?{background:`linear-gradient(135deg,${C.gold},${C.goldL})`,color:"#05101a"}:{}),
  ...(v==="g"?{background:"transparent",color:C.text,border:`1px solid ${C.border}`}:{}),
  ...(v==="d"?{background:"transparent",color:C.red,border:`1px solid ${C.red}44`}:{}), ...x });

/* ─── Yiddish Feedback ─── */
const FEEDBACK = [
  { min:88, emoji:"🌟", headline:"A gevaldige leiner bistu!", lines:["You read like a true Yiddishe kop today — incredible!","Mama and Tatte would be so proud. Keep it up!"] },
  { min:72, emoji:"✨", headline:"Yasher koach — what reading!", lines:["You're becoming a real masmid, and it shows!","Every session you get stronger. Kein ayin hara!"] },
  { min:55, emoji:"👏", headline:"Gut gemacht, yungerman!", lines:["You worked hard today and it definitely shows.","A bissel more chazara and you'll be flying!"] },
  { min:38, emoji:"💪", headline:"Chazak v'ematz — don't give up!", lines:["Every Yiddishe kind started right where you are.","With seder and chazara, you'll get there — guaranteed!"] },
  { min:0,  emoji:"🕯️", headline:"Kol haschelos kashos — every beginning is hard!", lines:["Every single word you practiced today is building something real.","Keep going with simcha — your best reading is still ahead!"] },
];
const getFeedback = f => FEEDBACK.find(x => f >= x.min);

/* ══ PIN PAD ══ */
function PinPad({ title, subtitle, onSuccess, onCancel, validate, wrongMsg="Incorrect PIN — try again" }) {
  const [digits,setDigits]=useState([]); const [shake,setShake]=useState(false); const [err,setErr]=useState("");
  const press = async d => {
    if(shake||digits.length>=4) return;
    const next=[...digits,d]; setDigits(next);
    if(next.length===4){
      const pin=next.join("");
      const ok = await Promise.resolve(validate(pin));
      if(ok){ onSuccess(pin); }
      else { setShake(true); setErr(wrongMsg); setTimeout(()=>{setShake(false);setDigits([]);setErr("");},750); }
    }
  };
  return (
    <div className="fade" style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"36px 32px",width:"100%",maxWidth:320,textAlign:"center"}}>
        <div style={{fontSize:22,color:C.gold,fontStyle:"italic",marginBottom:6}}>{title}</div>
        {subtitle&&<div style={{fontSize:14,color:C.muted,marginBottom:24}}>{subtitle}</div>}
        <div className={shake?"shake":""} style={{display:"flex",justifyContent:"center",gap:14,marginBottom:28}}>
          {[0,1,2,3].map(i=><div key={i} style={{width:16,height:16,borderRadius:"50%",background:i<digits.length?C.gold:"transparent",border:`2px solid ${i<digits.length?C.gold:C.muted}`,transition:"all .15s"}}/>)}
        </div>
        {err&&<div style={{fontSize:13,color:C.red,marginBottom:16}}>{err}</div>}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}>
          {[1,2,3,4,5,6,7,8,9].map(n=>(
            <button key={n} onClick={()=>press(String(n))} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 0",fontSize:22,fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:600,color:C.cream,cursor:"pointer",transition:"all .15s"}}
              onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>{n}</button>
          ))}
          <div/>
          <button onClick={()=>press("0")} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 0",fontSize:22,fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:600,color:C.cream,cursor:"pointer"}} onMouseEnter={e=>e.currentTarget.style.borderColor=C.gold} onMouseLeave={e=>e.currentTarget.style.borderColor=C.border}>0</button>
          <button onClick={()=>setDigits(d=>d.slice(0,-1))} style={{background:"transparent",border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 0",fontSize:20,color:C.muted,cursor:"pointer"}}>⌫</button>
        </div>
        {onCancel&&<button style={B("g",{width:"100%",marginTop:4,fontSize:14})} onClick={onCancel}>Cancel</button>}
      </div>
    </div>
  );
}

function PinSetup({ onDone, onCancel }) {
  const [step,setStep]=useState("enter"); const [first,setFirst]=useState("");
  if(step==="enter") return <PinPad title="Set Teacher PIN" subtitle="Choose a 4-digit PIN to protect the teacher panel" onSuccess={pin=>{setFirst(pin);setStep("confirm");}} onCancel={onCancel} validate={()=>true}/>;
  return <PinPad title="Confirm PIN" subtitle="Enter your PIN one more time to confirm" onSuccess={async pin=>{await dbSet(SK.teacherPin,pin);onDone();}} onCancel={()=>setStep("enter")} validate={pin=>pin===first} wrongMsg="PINs don't match — try again"/>;
}

/* ══ WELCOME ══ */
function Welcome({ onEnter, onTeacherClick }) {
  const [name,setName]=useState(""); const [stage,setStage]=useState("name");
  const [roster,setRoster]=useState([]); const [loading,setLoading]=useState(false);
  useEffect(()=>{dbGet(SK.roster,[]).then(setRoster);},[]);

  const submit = async () => {
    const n=name.trim(); if(!n) return;
    if(normName(n)===DEMO){ setStage("demo"); return; }
    setLoading(true);
    const r=await dbGet(SK.roster,[]); setRoster(r); setLoading(false);
    const found=r.find(s=>normName(s.name)===normName(n));
    setStage(found?"pin":"notFound");
  };

  if(stage==="demo") return <PinPad title="Demo Mode" subtitle="Enter PIN: 0 0 0 0" onSuccess={()=>onEnter(name.trim(),true)} onCancel={()=>setStage("name")} validate={p=>p==="0000"}/>;

  if(stage==="pin"){
    const student=roster.find(s=>normName(s.name)===normName(name.trim()));
    return <PinPad title={`Shalom, ${name.trim()}!`} subtitle="Enter your 4-digit PIN" onSuccess={()=>onEnter(name.trim(),false)} onCancel={()=>setStage("name")} validate={p=>p===student?.pin}/>;
  }
  if(stage==="notFound") return (
    <div className="fade" style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:16,padding:"36px 32px",maxWidth:380,width:"100%",textAlign:"center"}}>
        <div style={{fontSize:40,marginBottom:16}}>🔒</div>
        <div style={{fontSize:20,color:C.cream,fontStyle:"italic",marginBottom:10}}>Account not found</div>
        <div style={{fontSize:15,color:C.muted,lineHeight:1.7,marginBottom:24}}>"<span style={{color:C.cream}}>{name.trim()}</span>" isn't in the system yet.<br/>Ask your teacher to add your name.</div>
        <button style={B("p",{width:"100%",padding:12})} onClick={()=>{setStage("name");setName("");}}>← Try Again</button>
      </div>
      <button style={{...B("g",{fontSize:12,padding:"7px 18px",marginTop:16}),opacity:.5}} onClick={onTeacherClick}>🎓 Teacher Access</button>
    </div>
  );

  return (
    <div className="fade" style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{textAlign:"center",marginBottom:40}}>
        <div style={{fontSize:11,letterSpacing:5,color:C.muted,marginBottom:10}}>חֶדֶר לוּבַּאוִויטש — דַּאַלַאס</div>
        <div className="heb" style={{fontSize:62,color:C.gold,lineHeight:1,marginBottom:8}}>קְרִיאָה</div>
        <div style={{fontSize:18,color:C.cream,letterSpacing:2,fontStyle:"italic",marginBottom:4}}>Summer Kriah Program</div>
        <div style={{fontSize:13,color:C.muted,letterSpacing:1}}>Cheder Lubavitch of Dallas</div>
        <div style={{width:80,height:1,background:`linear-gradient(90deg,transparent,${C.gold},transparent)`,margin:"14px auto 0"}}/>
      </div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"32px 36px",width:"100%",maxWidth:380}}>
        <label style={{display:"block",fontSize:11,letterSpacing:2,color:C.muted,marginBottom:8}}>YOUR NAME</label>
        <input value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&name.trim()&&submit()} placeholder="Enter your name…" style={{width:"100%",marginBottom:18}}/>
        <button style={B("p",{width:"100%",padding:14,fontSize:17})} onClick={submit} disabled={!name.trim()||loading}>{loading?"Checking…":"Continue →"}</button>
      </div>
      <button style={{...B("g",{fontSize:12,padding:"7px 18px",marginTop:16}),opacity:.5}} onClick={onTeacherClick}>🎓 Teacher Access</button>
    </div>
  );
}

/* ══ DAY SELECTOR ══ */
function DaySelector({ studentName, isDemo, sessions, onSelectDay, onSignOut }) {
  const completedDays = new Set(sessions.map(s=>s.day));
  const reviewDays = new Set([18,30,50]);
  return (
    <div className="fade" style={{minHeight:"100vh",padding:"24px 16px",maxWidth:680,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:28}}>
        <div>
          <div style={{fontSize:11,letterSpacing:3,color:C.muted}}>SHALOM,</div>
          <div style={{fontSize:26,color:C.cream,fontStyle:"italic"}}>{studentName}</div>
          {isDemo&&<div style={{fontSize:11,color:C.gold,marginTop:2,letterSpacing:1}}>DEMO MODE — progress not saved</div>}
        </div>
        <button style={B("g",{fontSize:12,padding:"7px 14px"})} onClick={onSignOut}>← Sign Out</button>
      </div>

      <div style={{fontSize:17,color:C.gold,fontStyle:"italic",marginBottom:6}}>Which day are you on?</div>
      <div style={{fontSize:13,color:C.muted,marginBottom:20}}>Pick your day number and we'll have your reading ready.</div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(10,1fr)",gap:6,marginBottom:24}}>
        {Array.from({length:50},(_,i)=>i+1).map(d=>{
          const isReview=reviewDays.has(d);
          const isDone=completedDays.has(d);
          const isComplete50=d===50;
          return (
            <button key={d} onClick={()=>onSelectDay(d)} title={isReview?`Day ${d} — Review Day`:`Day ${d}`} style={{
              background:isDone?`${C.green}1a`:isReview?`${C.gold}18`:C.card,
              border:`1px solid ${isDone?C.green:isReview?C.gold:C.border}`,
              borderRadius:8, padding:"8px 0", textAlign:"center", cursor:"pointer",
              fontSize:13, fontWeight:600,
              color:isDone?C.green:isReview?C.goldL:C.muted,
              transition:"all .15s", position:"relative",
            }}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=C.gold;e.currentTarget.style.color=C.goldL;}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor=isDone?C.green:isReview?C.gold:C.border; e.currentTarget.style.color=isDone?C.green:isReview?C.goldL:C.muted;}}>
              {isComplete50?"🏆":isReview?"✡":d}
            </button>
          );
        })}
      </div>

      <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
        {[[C.green,"Completed"],[C.gold,"Review Day"],[C.muted,"Not yet reached"]].map(([cl,lb])=>(
          <div key={lb} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:C.muted}}>
            <div style={{width:10,height:10,borderRadius:2,background:cl,opacity:.7}}/>{lb}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Audio Storage ─── */
const uploadAudio = async (blob, studentName, day) => {
  try {
    const filename = `${normName(studentName)}_day${day}_${Date.now()}.webm`;
    const { error } = await supabase.storage
      .from("audio-snippets")
      .upload(filename, blob, { contentType: "audio/webm" });
    if (error) { console.error("uploadAudio error:", error); return null; }
    return filename;
  } catch (e) { console.error("uploadAudio exception:", e); return null; }
};

const getAudioUrl = async (filename) => {
  try {
    const { data, error } = await supabase.storage
      .from("audio-snippets")
      .createSignedUrl(filename, 3600);
    if (error) { console.error("getAudioUrl error:", error); return null; }
    return data.signedUrl;
  } catch (e) { console.error("getAudioUrl exception:", e); return null; }
};

const deleteAudio = async (filename) => {
  try {
    await supabase.storage.from("audio-snippets").remove([filename]);
  } catch {}
};

const cleanOldAudio = async (sessions) => {
  const cutoff = Date.now() - 14 * 24 * 60 * 60 * 1000;
  sessions.filter(s => s.audioFile && s.date < cutoff).forEach(s => deleteAudio(s.audioFile));
};


/* ── normalize Hebrew for comparison ── */
const normHeb = s => s.replace(/[\u0591-\u05C7]/g,"").replace(/[.,;:!?״׳"']/g,"").trim().toLowerCase();

/* ══ PASSAGE READER with dual scoring + audio snippet ══ */
/* ─── Shared Mic Hook ─── */
function useMic(onWord) {
  const [ready, setReady]   = useState(false);
  const streamRef           = useRef(null);
  const recorderRef         = useRef(null);
  const chunksRef           = useRef([]);
  const srRef               = useRef(null);
  const srActiveRef         = useRef(false);

  useEffect(() => {
    let cancelled = false;
    navigator.mediaDevices?.getUserMedia({ audio: true }).then(stream => {
      if (cancelled) { stream.getTracks().forEach(t=>t.stop()); return; }
      streamRef.current = stream;
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SR) {
        const r = new SR();
        r.lang = "he-IL"; r.continuous = true; r.interimResults = false; r.maxAlternatives = 1;
        r.onresult = e => {
          for (let i = e.resultIndex; i < e.results.length; i++) {
            if (e.results[i].isFinal)
              e.results[i][0].transcript.trim().split(/\s+/).filter(Boolean).forEach(w => onWord(w));
          }
        };
        r.onend = () => { if (srActiveRef.current) try { r.start(); } catch {} };
        srRef.current = r;
        try { r.start(); srActiveRef.current = true; } catch {}
      }
      setReady(true);
    }).catch(() => {});
    return () => {
      cancelled = true;
      srActiveRef.current = false;
      try { srRef.current?.abort(); } catch {}
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const startRecording = () => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    try {
      const mr = new MediaRecorder(streamRef.current, { mimeType:"audio/webm" });
      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.start();
      recorderRef.current = mr;
    } catch {}
  };

  const stopRecording = () => new Promise(resolve => {
    const mr = recorderRef.current;
    if (!mr || mr.state === "inactive") { resolve(null); return; }
    mr.onstop = () => {
      const blob = new Blob(chunksRef.current, { type:"audio/webm" });
      resolve(blob.size > 1000 ? blob : null);
    };
    try { mr.stop(); } catch { resolve(null); }
  });

  return { ready, startRecording, stopRecording };
}

/* ══ PASSAGE READER with dual scoring + audio snippet ══ */
function PassageReader({ passage, onDone, baselineWpm, tapReminderFired, onTapReminder, onSnippet }) {
  const words = useMemo(()=>passage.text.split(/\s+/).filter(Boolean),[passage.text]);
  const [ws, setWs]   = useState(()=>words.map(w=>({word:w, self:"pending", mic:"pending"})));
  const [idx, setIdx] = useState(0);
  const [done, setDone] = useState(false);
  const tapTimesRef     = useRef([]);
  const passageStartRef = useRef(Date.now());
  const snippetFiredRef = useRef(false);
  const halfwayIdx      = Math.floor(words.length / 2);
  const micWordQueue    = useRef([]);
  const micIdxRef       = useRef(0);

  const { ready: micReady, startRecording, stopRecording } = useMic(heardWord => {
    const norm = normHeb(heardWord);
    micWordQueue.current.push(norm);
    setWs(prev => {
      const next = [...prev];
      const queue = [...micWordQueue.current];
      let mi = micIdxRef.current;
      for (const hw of queue) {
        if (mi >= words.length) break;
        if (normHeb(words[mi]) === hw) { next[mi] = {...next[mi], mic:"correct"}; mi++; }
        else { next[mi] = {...next[mi], mic:"incorrect"}; mi++; }
      }
      micIdxRef.current = mi;
      micWordQueue.current = [];
      return next;
    });
  });

  /* start recording as soon as mic is ready */
  useEffect(() => { if (micReady) startRecording(); }, [micReady]);

  /* self-tap */
  const mark = (status) => {
    const now = Date.now();
    tapTimesRef.current.push(now);

    /* capture 20-second snippet at halfway point */
    if (!snippetFiredRef.current && idx >= halfwayIdx) {
      snippetFiredRef.current = true;
      setTimeout(async () => {
        const blob = await stopRecording();
        if (blob) onSnippet(blob);
      }, 20000);
    }

    /* speed check */
    if (!tapReminderFired && baselineWpm > 0 && tapTimesRef.current.length >= 5) {
      const gaps = tapTimesRef.current.slice(-5).reduce((acc, t, i, arr) => {
        if (i === 0) return acc;
        return [...acc, t - arr[i-1]];
      }, []);
      const avgGapMs = gaps.reduce((a,b)=>a+b,0) / gaps.length;
      const tapWpm   = 60000 / avgGapMs;
      if (tapWpm >= baselineWpm * 2) onTapReminder();
    }

    setWs(prev=>{const n=[...prev]; n[idx]={...n[idx], self:status}; return n;});
    const next = idx + 1;
    if (next >= words.length) setDone(true);
    else setIdx(next);
  };

  useEffect(()=>{
    if (done) {
      const sec = Math.max(1,(Date.now()-passageStartRef.current)/1000);
      onDone(ws, sec);
    }
  },[done]);

  const selfCorrect  = ws.filter(x=>x.self==="correct").length;
  const selfIncorrect= ws.filter(x=>x.self==="incorrect").length;
  const doneCount    = selfCorrect + selfIncorrect;

  if (done) return null;
  return (
    <div>
      <div style={{background:`${C.gold}0c`,border:`1px solid ${C.gold}33`,borderRadius:8,padding:"8px 16px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span className="heb" style={{fontSize:18,color:C.gold}}>{passage.heb}</span>
        <span style={{fontSize:12,color:C.muted}}>{doneCount}/{words.length}</span>
      </div>
      <div style={{height:3,background:C.border,borderRadius:2,marginBottom:12,overflow:"hidden"}}>
        <div style={{height:"100%",width:`${Math.round((doneCount/words.length)*100)}%`,background:`linear-gradient(90deg,${C.gold},${C.goldL})`,transition:"width .3s"}}/>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:14}}>
        {[[selfCorrect,C.green,"✓"],[selfIncorrect,C.red,"✗"],[words.length-doneCount,C.muted,"◷"]].map(([v,cl,ic])=>(
          <div key={ic} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 0",textAlign:"center",flex:1}}>
            <div style={{fontSize:20,color:cl,fontWeight:700}}>{v}</div>
            <div style={{fontSize:11,color:C.muted}}>{ic}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:14}}>
        <div className="heb" style={{fontSize:18,color:C.muted,direction:"rtl",minHeight:26,textAlign:"center"}}>{words.slice(Math.max(0,idx-2),idx).join(" ")}</div>
        <div style={{background:C.card,border:`2px solid ${C.gold}`,borderRadius:14,padding:"20px 36px",textAlign:"center"}}>
          <div className="heb" style={{fontSize:56,color:C.goldL,lineHeight:1.3}}>{words[idx]}</div>
          <div style={{fontSize:11,color:C.muted,marginTop:4,letterSpacing:2}}>{idx+1} / {words.length}</div>
        </div>
        <div className="heb" style={{fontSize:18,color:C.muted,direction:"rtl",minHeight:26,textAlign:"center"}}>{words.slice(idx+1,idx+3).join(" ")}</div>
        <div style={{display:"flex",gap:14}}>
          <button style={{...B("g",{fontSize:17,padding:"14px 36px",border:`1.5px solid ${C.red}66`,color:C.red}),borderRadius:10}} onClick={()=>mark("incorrect")}>✗ Mistake</button>
          <button style={{background:`linear-gradient(135deg,#2a7a45,${C.green})`,color:"#fff",border:"none",borderRadius:10,padding:"14px 36px",fontSize:17,fontFamily:"'Cormorant Garamond',Georgia,serif",fontWeight:600,cursor:"pointer"}} onClick={()=>mark("correct")}>✓ Got it</button>
        </div>
        <button style={B("g",{fontSize:11,padding:"6px 14px"})} onClick={()=>setDone(true)}>Skip to next</button>
      </div>
    </div>
  );
}

/* ══ FULL SESSION ══ */
function ReadingSession({ dayEntry, onComplete, onCancel, isReview, reviewPassages, baselineWpm, studentName, dayNum }) {
  const passages = isReview ? reviewPassages : (dayEntry ? [dayEntry.ch, dayEntry.sid] : []);
  if (!passages || passages.length === 0) return (
    <div style={{padding:40,textAlign:"center",color:C.muted}}>
      <div style={{fontSize:32,marginBottom:12}}>📚</div>
      <div>No passages found for this day.</div>
      <button style={{...B("g",{fontSize:14,padding:"10px 24px",marginTop:20})}} onClick={onCancel}>← Back</button>
    </div>
  );
  const [pIdx,setPIdx]     = useState(0);
  const [allResults,setAllResults] = useState([]);
  const [elapsed,setElapsed]   = useState(0);
  const [phase,setPhase]     = useState("reading");
  const [tenMinBanner,setTenMinBanner] = useState(false);
  const [tenMinDismissed,setTenMinDismissed] = useState(false);
  const [tapReminder,setTapReminder] = useState(false);
  const [tapReminderFired,setTapReminderFired] = useState(false);
  const timerRef   = useRef(null);
  const tenFiredRef= useRef(false);

  useEffect(()=>{
    timerRef.current=setInterval(()=>setElapsed(s=>s+1),1000);
    return ()=>clearInterval(timerRef.current);
  },[]);

  useEffect(()=>{
    if(!tenFiredRef.current && elapsed>=600){ tenFiredRef.current=true; setTenMinBanner(true); }
  },[elapsed]);

  const [audioFile, setAudioFile] = useState(null);

  const handleSnippet = async (blob) => {
    const filename = await uploadAudio(blob, studentName, dayNum);
    if (filename) setAudioFile(filename);
  };

  const handleTapReminder = () => {
    if (tapReminderFired) return;
    setTapReminderFired(true); setTapReminder(true);
    setTimeout(()=>setTapReminder(false), 5000);
  };

  const handlePassageDone = (ws, sec) => {
    const selfCorrect  = ws.filter(x=>x.self==="correct").length;
    const selfIncorrect= ws.filter(x=>x.self==="incorrect").length;
    const micCorrect   = ws.filter(x=>x.mic==="correct").length;
    const micIncorrect = ws.filter(x=>x.mic==="incorrect").length;
    const selfRead = selfCorrect+selfIncorrect;
    const micRead  = micCorrect+micIncorrect;
    const selfWpm  = Math.round((selfRead/sec)*60);
    const selfAcc  = selfRead>0?Math.round((selfCorrect/selfRead)*100):0;
    const micAcc   = micRead>0?Math.round((micCorrect/micRead)*100):null;
    const speedVsBaseline = baselineWpm>0 ? Math.round((selfWpm/baselineWpm)*100) : null;

    const r = {
      passageId:passages[pIdx].id, passageEn:passages[pIdx].en,
      selfWpm, selfAcc, selfCorrect, selfIncorrect,
      micAcc, micCorrect, micIncorrect, micRead,
      speedVsBaseline,
    };
    const newResults = [...allResults, r];
    setAllResults(newResults);
    const next = pIdx+1;
    if(next < passages.length){ setPIdx(next); setPhase("transition"); }
    else {
      clearInterval(timerRef.current); setPhase("done");
      const totalSec = Math.max(1, elapsed);
      const allSC = newResults.reduce((a,r)=>a+r.selfCorrect,0);
      const allSI = newResults.reduce((a,r)=>a+r.selfIncorrect,0);
      const allSRead = allSC+allSI;
      const avgSelfWpm = Math.round(newResults.reduce((a,r)=>a+r.selfWpm,0)/newResults.length);
      const avgSelfAcc = allSRead>0?Math.round((allSC/allSRead)*100):0;
      const flu = Math.round(avgSelfWpm*0.4+avgSelfAcc*0.6);
      const avgMicAcc = newResults.filter(r=>r.micAcc!==null).length>0
        ? Math.round(newResults.filter(r=>r.micAcc!==null).reduce((a,r)=>a+r.micAcc,0)/newResults.filter(r=>r.micAcc!==null).length)
        : null;
      const speedFlag = newResults.some(r=>r.speedVsBaseline!==null && r.speedVsBaseline>=200);
      const micSelfGap = avgMicAcc!==null ? Math.abs(avgSelfAcc-avgMicAcc) : null;
      setTimeout(()=>onComplete({
        wpm:avgSelfWpm, accuracy:avgSelfAcc, fluency:flu, totalTime:totalSec,
        isReview, passageDetails:newResults,
        micAcc:avgMicAcc, micSelfGap, speedFlag,
        tapReminderFired, audioFile,
      }),400);
    }
  };

  const fmtTime = s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  return (
    <div className="fade" style={{minHeight:"100vh",padding:"20px 16px",maxWidth:680,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <button style={B("g",{fontSize:12,padding:"6px 14px"})} onClick={onCancel}>← Back</button>
        <div style={{textAlign:"center"}}>
          {isReview
            ? <div style={{fontSize:16,color:C.gold,fontStyle:"italic"}}>✡ Review Day</div>
            : <div style={{fontSize:13,color:C.muted}}>{pIdx===0?"Chumash":"Siddur"} · {pIdx+1} of 2</div>}
        </div>
        <div style={{fontFamily:"monospace",fontSize:26,color:elapsed>=600?C.red:elapsed>=480?C.goldL:C.muted}}>{fmtTime(elapsed)}</div>
      </div>

      {tapReminder && (
        <div className="pop" style={{background:`${C.gold}15`,border:`1px solid ${C.gold}55`,borderRadius:10,padding:"12px 18px",marginBottom:14,textAlign:"center",fontSize:15,color:C.cream}}>
          📖 Remember — read each word out loud before tapping!
        </div>
      )}

      {tenMinBanner && !tenMinDismissed && (
        <div className="pop" style={{background:`linear-gradient(135deg,${C.goldD},#1c3a1c)`,border:`2px solid ${C.gold}`,borderRadius:12,padding:"16px 20px",marginBottom:14,textAlign:"center"}}>
          <div style={{fontSize:22,marginBottom:6}}>🌟 10 minutes!</div>
          <div style={{fontSize:16,color:C.cream,marginBottom:12}}>Today's quota is complete — amazing work! You can keep going or finish up.</div>
          <button style={B("p",{padding:"9px 28px",fontSize:14})} onClick={()=>setTenMinDismissed(true)}>Keep Reading →</button>
        </div>
      )}

      {phase==="reading" && (
        <PassageReader key={pIdx} passage={passages[pIdx]} onDone={handlePassageDone}
          baselineWpm={baselineWpm} tapReminderFired={tapReminderFired} onTapReminder={handleTapReminder}
          onSnippet={pIdx===0 ? handleSnippet : ()=>{}}/>
      )}

      {phase==="transition" && (
        <div className="pop" style={{textAlign:"center",padding:"50px 20px"}}>
          <div style={{fontSize:40,marginBottom:14}}>✨</div>
          <div style={{fontSize:22,color:C.green,fontStyle:"italic",marginBottom:8}}>Gut gemacht!</div>
          <div style={{fontSize:15,color:C.muted,marginBottom:24}}>Chumash done — now your Siddur portion.</div>
          <div className="heb" style={{fontSize:26,color:C.gold,marginBottom:22}}>{passages[pIdx].heb}</div>
          <button style={B("p",{padding:"13px 40px",fontSize:17})} onClick={()=>setPhase("reading")}>Begin Siddur →</button>
        </div>
      )}

      {phase==="done" && <div style={{textAlign:"center",color:C.gold,fontSize:18,fontStyle:"italic",padding:60}}>Saving your results…</div>}
    </div>
  );
}

/* ══ RESULTS ══ */
function Results({ result, dayNum, studentName, onNext, onViewMore, isDemo }) {
  const fb=getFeedback(result.fluency);
  const emojiRating=result.fluency>=88?"🌟🌟🌟":result.fluency>=72?"🌟🌟":result.fluency>=55?"🌟":"✨";
  return (
    <div className="fade" style={{minHeight:"100vh",padding:"40px 20px",maxWidth:500,margin:"0 auto",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
      <div style={{fontSize:58,marginBottom:12}}>{fb.emoji}</div>
      <div style={{fontSize:30,marginBottom:20}}>{emojiRating}</div>
      <div style={{fontSize:28,color:C.cream,fontStyle:"italic",textAlign:"center",marginBottom:14}}>{fb.headline}</div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"22px 28px",marginBottom:24,textAlign:"center",maxWidth:400,width:"100%"}}>
        {fb.lines.map((l,i)=><p key={i} style={{fontSize:16,color:C.text,lineHeight:1.7,margin:i===0?"0 0 8px":"0"}}>{l}</p>)}
        {result.isReview&&<p style={{fontSize:14,color:C.gold,marginTop:12,fontStyle:"italic"}}>✡ Review day complete!</p>}
        {isDemo&&<p style={{fontSize:12,color:C.muted,marginTop:10}}>Demo mode — results not saved</p>}
        <div style={{marginTop:16,paddingTop:14,borderTop:`1px solid ${C.border}`,fontSize:13,color:C.muted,fontStyle:"italic"}}>Day {dayNum} · {studentName}</div>
      </div>
      <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center"}}>
        <button style={B("p",{padding:"12px 36px",fontSize:17})} onClick={onNext}>Practice Again</button>
        {onViewMore&&<button style={B("g",{padding:"12px 28px",fontSize:14})} onClick={onViewMore}>Keep Reading →</button>}
      </div>
    </div>
  );
}

/* ══ PROGRAM COMPLETE ══ */
function ProgramComplete({ studentName, onRestart }) {
  return (
    <div className="fade" style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:32,textAlign:"center"}}>
      <div style={{fontSize:64,marginBottom:16}}>🏆</div>
      <div style={{fontSize:11,letterSpacing:4,color:C.gold,marginBottom:12}}>מַזָּל טוֹב!</div>
      <div style={{fontSize:32,color:C.cream,fontStyle:"italic",marginBottom:8}}>Summer Kriah Complete!</div>
      <div style={{fontSize:18,color:C.muted,marginBottom:32}}>You finished all 50 days of the program, {studentName}!</div>
      <div style={{background:C.card,border:`2px solid ${C.gold}`,borderRadius:16,padding:"28px 36px",maxWidth:420,width:"100%",marginBottom:32}}>
        <div className="heb" style={{fontSize:40,color:C.goldL,marginBottom:12,direction:"rtl"}}>יְהִי רָצוֹן שֶׁתֵּלְכוּ מֵחַיִל אֶל חַיִל</div>
        <div style={{fontSize:14,color:C.muted,fontStyle:"italic"}}>"May you go from strength to strength"</div>
      </div>
      <button style={B("p",{padding:"14px 40px",fontSize:17})} onClick={onRestart}>Back to Start</button>
    </div>
  );
}

/* ══ AUDIO PLAYER ══ */
function AudioPlayer({ filename }) {
  const [url, setUrl]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const load = async () => {
    if (url) { toggle(); return; }
    setLoading(true);
    const signed = await getAudioUrl(filename);
    setLoading(false);
    if (!signed) return;
    setUrl(signed);
    setTimeout(() => { audioRef.current?.play(); setPlaying(true); }, 100);
  };

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play(); setPlaying(true); }
  };

  return (
    <div style={{display:"inline-flex",alignItems:"center",gap:6}}>
      <button onClick={load} style={{background:`${C.blue}18`,border:`1px solid ${C.blue}44`,borderRadius:20,padding:"3px 10px",fontSize:12,color:C.blue,cursor:"pointer"}}>
        {loading ? "…" : playing ? "⏸ pause" : "🎙 play snippet"}
      </button>
      {url && <audio ref={audioRef} src={url} onEnded={()=>setPlaying(false)} style={{display:"none"}}/>}
    </div>
  );
}

/* ══ STUDENT PROGRESS ══ */
function StudentProgress({ studentName, onBack }) {
  const [sessions,setSessions]=useState([]); const [loading,setLoading]=useState(true);
  useEffect(()=>{
    if(!studentName){ setLoading(false); return; }
    dbGet(SK.sessions(studentName),[]).then(s=>{
      const arr = Array.isArray(s)?s:[];
      setSessions(arr);
      setLoading(false);
      cleanOldAudio(arr);
    });
  },[studentName]);

  const validSessions = sessions.filter(s=>s && typeof s.fluency==="number" && typeof s.accuracy==="number" && typeof s.wpm==="number");
  const data = validSessions.map((s,i)=>({n:i+1, fluency:s.fluency||0, accuracy:s.accuracy||0, wpm:s.wpm||0}));
  const avg = k => validSessions.length ? Math.round(validSessions.reduce((a,s)=>a+(s[k]||0),0)/validSessions.length) : 0;
  const best = k => validSessions.length ? Math.max(...validSessions.map(s=>s[k]||0)) : 0;
  const baseline = validSessions.find(s=>s.isBaseline);
  const latest = validSessions.length>1 ? validSessions[validSessions.length-1] : null;
  const showCharts = data.length >= 2;
  return (
    <div className="fade" style={{minHeight:"100vh",padding:"24px 16px",maxWidth:700,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div><div style={{fontSize:11,letterSpacing:2,color:C.muted}}>STUDENT PROGRESS</div><div style={{fontSize:24,color:C.cream,fontStyle:"italic"}}>{studentName}</div></div>
        <div style={{display:"flex",gap:8}}>
          {validSessions.length>0&&<button style={B("p",{fontSize:12,padding:"7px 14px"})} onClick={()=>generateStudentPDF(studentName,validSessions)}>⬇ Parent Report</button>}
          <button style={B("g",{fontSize:12,padding:"7px 14px"})} onClick={onBack}>← Back</button>
        </div>
      </div>
      {loading?<div style={{textAlign:"center",color:C.muted,padding:60}}>Loading…</div>
      :validSessions.length===0?<div style={{textAlign:"center",color:C.muted,padding:60}}><div style={{fontSize:36,marginBottom:12}}>📚</div>No sessions yet for {studentName||"this student"}.</div>
      :(<>
        {baseline&&latest&&(
          <div style={{background:C.card,border:`1px solid ${C.gold}44`,borderRadius:12,padding:20,marginBottom:18}}>
            <div style={{fontSize:15,color:C.gold,fontStyle:"italic",marginBottom:14}}>Baseline vs. Latest</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              {[["Fluency","fluency",C.gold],["Accuracy","accuracy",C.green],["WPM","wpm",C.blue]].map(([lb,k,cl])=>(
                <div key={k} style={{background:C.surface,borderRadius:8,padding:12,textAlign:"center"}}>
                  <div style={{fontSize:11,color:C.muted,marginBottom:6,letterSpacing:1}}>{lb.toUpperCase()}</div>
                  <div style={{display:"flex",justifyContent:"center",gap:12,alignItems:"center"}}>
                    <div style={{textAlign:"center"}}><div style={{fontSize:20,color:C.muted}}>{baseline[k]}{k==="accuracy"?"%":""}</div><div style={{fontSize:9,color:C.muted}}>BASE</div></div>
                    <div style={{color:C.muted}}>→</div>
                    <div style={{textAlign:"center"}}><div style={{fontSize:20,color:cl,fontWeight:700}}>{latest[k]}{k==="accuracy"?"%":""}</div><div style={{fontSize:9,color:C.muted}}>NOW</div></div>
                  </div>
                  <div style={{fontSize:12,color:latest[k]>=baseline[k]?C.green:C.red,marginTop:4}}>
                    {latest[k]>baseline[k]?"▲ +"+(latest[k]-baseline[k]):latest[k]<baseline[k]?"▼ "+(latest[k]-baseline[k]):"—"}
                    {k==="accuracy"?"%":""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18}}>
          {[[avg("fluency"),best("fluency"),C.gold,"Fluency"],[`${avg("accuracy")}%`,`${best("accuracy")}%`,C.green,"Accuracy"],[avg("wpm"),best("wpm"),C.blue,"WPM"]].map(([av,bv,cl,lb])=>(
            <div key={lb} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:14,textAlign:"center"}}>
              <div style={{fontSize:26,color:cl,fontWeight:700}}>{av}</div>
              <div style={{fontSize:10,color:C.muted,letterSpacing:1}}>{lb.toUpperCase()}</div>
              <div style={{fontSize:10,color:C.muted,marginTop:2}}>Best: <span style={{color:cl}}>{bv}</span></div>
            </div>
          ))}
        </div>
        {showCharts && (
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"18px 18px 10px",marginBottom:14}}>
          <div style={{fontSize:14,color:C.gold,fontStyle:"italic",marginBottom:14}}>Fluency curve</div>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={data} margin={{top:4,right:8,bottom:0,left:-10}}>
              <defs><linearGradient id="gflu" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.gold} stopOpacity={.3}/><stop offset="95%" stopColor={C.gold} stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
              <XAxis dataKey="n" stroke={C.muted} tick={{fill:C.muted,fontSize:10}}/>
              <YAxis domain={[0,100]} stroke={C.muted} tick={{fill:C.muted,fontSize:10}}/>
              <Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.cream,fontSize:12}}/>
              <Area type="monotone" dataKey="fluency" stroke={C.gold} fill="url(#gflu)" strokeWidth={2.5} dot={{fill:C.gold,r:3}} name="Fluency"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        )}
        {showCharts && (
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"18px 18px 10px",marginBottom:14}}>
          <div style={{fontSize:14,color:C.gold,fontStyle:"italic",marginBottom:14}}>Accuracy & speed</div>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={data} margin={{top:4,right:8,bottom:0,left:-10}}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border}/>
              <XAxis dataKey="n" stroke={C.muted} tick={{fill:C.muted,fontSize:10}}/>
              <YAxis stroke={C.muted} tick={{fill:C.muted,fontSize:10}}/>
              <Tooltip contentStyle={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:8,color:C.cream,fontSize:12}}/>
              <Legend wrapperStyle={{fontSize:11,color:C.muted}}/>
              <Line type="monotone" dataKey="accuracy" stroke={C.green} strokeWidth={2} dot={{fill:C.green,r:3}} name="Accuracy %"/>
              <Line type="monotone" dataKey="wpm" stroke={C.blue} strokeWidth={2} dot={{fill:C.blue,r:3}} name="WPM"/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        )}
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18}}>
          <div style={{fontSize:14,color:C.gold,fontStyle:"italic",marginBottom:12}}>Session history</div>
          <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:400,overflowY:"auto"}}>
            {[...validSessions].reverse().map((s,i)=>{
              const hasFlag=s.speedFlag||s.tapReminderFired||(s.micSelfGap!=null&&s.micSelfGap>30);
              return (
                <div key={i} style={{background:C.surface,borderRadius:10,padding:"10px 14px",border:"1px solid "+(hasFlag?C.red+"55":C.border)}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                    <div>
                      <div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap",marginBottom:3}}>
                        <span style={{fontSize:11,background:C.gold+"18",color:C.goldL,padding:"2px 8px",borderRadius:10,border:"1px solid "+C.gold+"33"}}>Day {s.day}</span>
                        {s.isBaseline&&<span style={{fontSize:10,color:C.blue,background:C.blue+"15",padding:"2px 7px",borderRadius:10}}>baseline</span>}
                        {s.isReview&&<span style={{fontSize:10,color:C.gold,background:C.gold+"15",padding:"2px 7px",borderRadius:10}}>review</span>}
                      </div>
                      <div style={{fontSize:10,color:C.muted}}>{new Date(s.date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</div>
                    </div>
                    <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                      <div>
                        <div style={{fontSize:9,color:C.muted,textAlign:"center",marginBottom:3,letterSpacing:1}}>SELF</div>
                        <div style={{display:"flex",gap:8}}>
                          {[[s.fluency,C.gold,"FLU"],[s.accuracy+"%",C.green,"ACC"],[s.wpm,C.blue,"WPM"]].map(([v,cl,lb])=>(
                            <div key={lb} style={{textAlign:"center"}}><div style={{fontSize:13,color:cl,fontWeight:700}}>{v}</div><div style={{fontSize:9,color:C.muted}}>{lb}</div></div>
                          ))}
                        </div>
                      </div>
                      {s.micAcc!=null&&(
                        <div style={{borderLeft:"1px solid "+C.border,paddingLeft:8}}>
                          <div style={{fontSize:9,color:C.muted,textAlign:"center",marginBottom:3,letterSpacing:1}}>MIC</div>
                          <div style={{textAlign:"center"}}><div style={{fontSize:13,color:C.blue,fontWeight:700}}>{s.micAcc}%</div><div style={{fontSize:9,color:C.muted}}>ACC</div></div>
                        </div>
                      )}
                    </div>
                  </div>
                  {s.audioFile&&<AudioPlayer filename={s.audioFile}/>}
                  {hasFlag&&(
                    <div style={{background:C.red+"0e",border:"1px solid "+C.red+"33",borderRadius:6,padding:"7px 10px",marginTop:6,fontSize:11,color:C.red,lineHeight:1.5}}>
                      {[s.speedFlag?"Tapped 2x faster than baseline":null,
                        s.tapReminderFired?"Reading reminder shown mid-session":null,
                        (s.micSelfGap!=null&&s.micSelfGap>30)?("Self "+s.accuracy+"% vs mic "+s.micAcc+"% — worth a conversation"):null
                      ].filter(Boolean).join(" · ")}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </>)}
    </div>
  );
}

/* ══ PDF GENERATION ══ */
const generateStudentPDF = (studentName, sessions) => {
  const valid = sessions.filter(s=>s&&typeof s.accuracy==="number");
  const baseline = valid.find(s=>s.isBaseline);
  const latest   = valid.length>0 ? valid[valid.length-1] : null;
  const avg = k => valid.length ? Math.round(valid.reduce((a,s)=>a+(s[k]||0),0)/valid.length) : 0;
  const best= k => valid.length ? Math.max(...valid.map(s=>s[k]||0)) : 0;
  const daysCompleted = new Set(valid.map(s=>s.day)).size;

  /* build SVG sparkline for accuracy over time */
  const pts = valid.map((s,i)=>({x:i,y:s.accuracy||0}));
  const svgW=400, svgH=80, pad=10;
  const xS = pts.length>1 ? (svgW-pad*2)/(pts.length-1) : 1;
  const yS = (svgH-pad*2)/100;
  const polyAcc = pts.map((p,i)=>`${pad+i*xS},${svgH-pad-p.y*yS}`).join(" ");
  const polyWpm = pts.map((p,i)=>{
    const w = valid[i].wpm||0;
    const maxW = Math.max(...valid.map(s=>s.wpm||1),1);
    return `${pad+i*xS},${svgH-pad-(w/maxW)*(svgH-pad*2)}`;
  }).join(" ");

  const impAcc = baseline&&latest ? latest.accuracy-baseline.accuracy : null;
  const impWpm = baseline&&latest ? latest.wpm-baseline.wpm : null;
  const deltaStr = (v,unit="") => v===null?"—":v>0?`▲ +${v}${unit}`:`▼ ${v}${unit}`;

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <title>Kriah Report — ${studentName}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Georgia',serif;background:#fff;color:#1a1a1a;padding:40px;max-width:720px;margin:0 auto}
    .header{text-align:center;border-bottom:2px solid #c8943a;padding-bottom:20px;margin-bottom:28px}
    .school{font-size:11px;letter-spacing:3px;color:#888;margin-bottom:6px}
    .title{font-size:26px;color:#c8943a;margin-bottom:4px}
    .subtitle{font-size:13px;color:#555;letter-spacing:1px}
    .student-name{font-size:32px;color:#1a1a1a;margin:18px 0 4px;font-style:italic}
    .meta{font-size:12px;color:#888;margin-bottom:24px}
    .section{margin-bottom:24px}
    .section-title{font-size:12px;letter-spacing:2px;color:#888;border-bottom:1px solid #eee;padding-bottom:6px;margin-bottom:14px}
    .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:20px}
    .stat-box{border:1px solid #eee;border-radius:8px;padding:14px;text-align:center}
    .stat-val{font-size:28px;font-weight:700;margin-bottom:4px}
    .stat-lbl{font-size:10px;letter-spacing:1px;color:#888}
    .stat-delta{font-size:11px;margin-top:4px}
    .up{color:#2a7a45}.down{color:#c0392b}.neu{color:#888}
    .compare{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:20px}
    .compare-box{border:1px solid #eee;border-radius:8px;padding:16px}
    .compare-label{font-size:10px;letter-spacing:2px;color:#888;margin-bottom:8px}
    .compare-row{display:flex;justify-content:space-between;font-size:13px;padding:4px 0;border-bottom:1px solid #f5f5f5}
    table{width:100%;border-collapse:collapse;font-size:12px}
    th{background:#f9f4ec;color:#888;letter-spacing:1px;font-size:10px;padding:8px 10px;text-align:left;border-bottom:2px solid #eee}
    td{padding:7px 10px;border-bottom:1px solid #f5f5f5}
    tr:last-child td{border-bottom:none}
    .flag{color:#c0392b;font-size:11px}
    .footer{margin-top:32px;padding-top:16px;border-top:1px solid #eee;text-align:center;font-size:11px;color:#aaa}
    svg{display:block;margin:0 auto}
    @media print{body{padding:20px}button{display:none}}
  </style></head><body>
  <div class="header">
    <div class="school">חֶדֶר לוּבַּאוִויטש — דַּאַלַאס</div>
    <div class="title">Summer Kriah Program</div>
    <div class="subtitle">Cheder Lubavitch of Dallas · Student Progress Report</div>
  </div>

  <div class="student-name">${studentName}</div>
  <div class="meta">
    ${daysCompleted} day${daysCompleted!==1?"s":""} completed &nbsp;·&nbsp;
    ${valid.length} session${valid.length!==1?"s":""} recorded &nbsp;·&nbsp;
    Report generated ${new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}
  </div>

  <div class="section">
    <div class="section-title">CURRENT PERFORMANCE</div>
    <div class="stats-grid">
      ${[
        [latest?`${latest.accuracy}%`:"—","#2a7a45","Accuracy",impAcc!==null?`${deltaStr(impAcc,"%")}`:""],
        [latest?latest.wpm:"—","#2255aa","Words / Min",impWpm!==null?`${deltaStr(impWpm)}`:""],
        [best("accuracy")+"%","#555","Best Accuracy","all time"],
        [daysCompleted,"#c8943a","Days Completed","of 50"],
      ].map(([v,cl,lb,sub])=>`
        <div class="stat-box">
          <div class="stat-val" style="color:${cl}">${v}</div>
          <div class="stat-lbl">${lb}</div>
          ${sub?`<div class="stat-delta ${sub.includes("▲")?"up":sub.includes("▼")?"down":"neu"}">${sub}</div>`:""}
        </div>`).join("")}
    </div>
  </div>

  ${baseline&&latest&&valid.length>1?`
  <div class="section">
    <div class="section-title">BASELINE vs. LATEST</div>
    <div class="compare">
      <div class="compare-box">
        <div class="compare-label">FIRST SESSION (BASELINE)</div>
        <div class="compare-row"><span>Accuracy</span><span>${baseline.accuracy}%</span></div>
        <div class="compare-row"><span>Words / Min</span><span>${baseline.wpm}</span></div>
        <div class="compare-row"><span>Date</span><span>${new Date(baseline.date).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span></div>
      </div>
      <div class="compare-box">
        <div class="compare-label">MOST RECENT SESSION</div>
        <div class="compare-row"><span>Accuracy</span><span style="color:${impAcc>=0?"#2a7a45":"#c0392b"}">${latest.accuracy}% ${deltaStr(impAcc,"%")}</span></div>
        <div class="compare-row"><span>Words / Min</span><span style="color:${impWpm>=0?"#2255aa":"#c0392b"}">${latest.wpm} ${deltaStr(impWpm)}</span></div>
        <div class="compare-row"><span>Date</span><span>${new Date(latest.date).toLocaleDateString("en-US",{month:"short",day:"numeric"})}</span></div>
      </div>
    </div>
  </div>`:""}

  ${pts.length>1?`
  <div class="section">
    <div class="section-title">IMPROVEMENT OVER TIME</div>
    <svg width="${svgW}" height="${svgH}" style="width:100%;max-width:${svgW}px">
      <defs>
        <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#2a7a45" stop-opacity="0.15"/>
          <stop offset="100%" stop-color="#2a7a45" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <polygon points="${polyAcc} ${pad+(pts.length-1)*xS},${svgH-pad} ${pad},${svgH-pad}" fill="url(#ga)"/>
      <polyline points="${polyAcc}" fill="none" stroke="#2a7a45" stroke-width="2"/>
      <polyline points="${polyWpm}" fill="none" stroke="#2255aa" stroke-width="2" stroke-dasharray="4,3"/>
      ${pts.map((p,i)=>`<circle cx="${pad+i*xS}" cy="${svgH-pad-p.y*yS}" r="3" fill="#2a7a45"/>`).join("")}
    </svg>
    <div style="text-align:center;font-size:10px;color:#888;margin-top:6px">
      <span style="color:#2a7a45">— Accuracy %</span> &nbsp;&nbsp;
      <span style="color:#2255aa">- - WPM (scaled)</span>
    </div>
  </div>`:""}

  <div class="section">
    <div class="section-title">SESSION HISTORY</div>
    <table>
      <tr><th>Date</th><th>Day</th><th>Accuracy</th><th>WPM</th><th>Errors</th><th>Notes</th></tr>
      ${[...valid].reverse().map(s=>`
        <tr>
          <td>${new Date(s.date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</td>
          <td>${s.day}${s.isBaseline?" ★":""}</td>
          <td>${s.accuracy}%</td>
          <td>${s.wpm}</td>
          <td>${s.incorrect||0}</td>
          <td class="flag">${[
            s.isBaseline?"Baseline session":"",
            s.isReview?"Review day":"",
            s.speedFlag?"Fast tapping flagged":"",
          ].filter(Boolean).join(", ")||"—"}</td>
        </tr>`).join("")}
    </table>
  </div>

  <div class="footer">
    Cheder Lubavitch of Dallas — Summer Kriah Program &nbsp;·&nbsp;
    This report was generated automatically from reading session data.
  </div>

  <script>window.onload=()=>window.print();</script>
  </body></html>`;

  const w = window.open("","_blank");
  if (w) { w.document.write(html); w.document.close(); }
};

const generateClassPDF = async (roster) => {
  const rows = await Promise.all(roster.map(async s => {
    const sessions = await dbGet(SK.sessions(s.name), []);
    const valid = sessions.filter(x=>x&&typeof x.accuracy==="number");
    const baseline = valid.find(x=>x.isBaseline);
    const latest   = valid.length>0 ? valid[valid.length-1] : null;
    const days     = new Set(valid.map(x=>x.day)).size;
    const lastDate = valid.length>0 ? new Date(valid[valid.length-1].date).toLocaleDateString("en-US",{month:"short",day:"numeric"}) : "—";
    const impAcc   = baseline&&latest ? latest.accuracy-baseline.accuracy : null;
    return { name:s.name, days, baseline, latest, impAcc, lastDate, sessions:valid.length };
  }));
  rows.sort((a,b)=>(b.latest?.accuracy||0)-(a.latest?.accuracy||0));

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <title>Class Overview — Summer Kriah</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Georgia',serif;background:#fff;color:#1a1a1a;padding:40px;max-width:900px;margin:0 auto}
    .header{text-align:center;border-bottom:2px solid #c8943a;padding-bottom:20px;margin-bottom:28px}
    .school{font-size:11px;letter-spacing:3px;color:#888;margin-bottom:6px}
    .title{font-size:26px;color:#c8943a;margin-bottom:4px}
    .subtitle{font-size:13px;color:#555}
    .meta{font-size:12px;color:#888;margin:16px 0 24px;text-align:center}
    table{width:100%;border-collapse:collapse;font-size:13px}
    th{background:#f9f4ec;color:#888;letter-spacing:1px;font-size:10px;padding:10px 12px;text-align:left;border-bottom:2px solid #e8e0d0}
    td{padding:10px 12px;border-bottom:1px solid #f0ece4;vertical-align:middle}
    tr:nth-child(even) td{background:#fdfaf5}
    .rank{color:#c8943a;font-weight:700;font-size:15px}
    .name{font-size:15px;font-style:italic}
    .up{color:#2a7a45;font-weight:600}.down{color:#c0392b}.neu{color:#aaa}
    .bar-bg{background:#f0ece4;border-radius:4px;height:8px;width:100px;display:inline-block;vertical-align:middle;margin-left:6px}
    .bar-fg{background:#2a7a45;border-radius:4px;height:8px;display:block}
    .footer{margin-top:32px;padding-top:16px;border-top:1px solid #eee;text-align:center;font-size:11px;color:#aaa}
    @media print{body{padding:20px}button{display:none}}
  </style></head><body>
  <div class="header">
    <div class="school">חֶדֶר לוּבַּאוִויטש — דַּאַלַאס</div>
    <div class="title">Summer Kriah Program — Class Overview</div>
    <div class="subtitle">Cheder Lubavitch of Dallas</div>
  </div>
  <div class="meta">
    ${roster.length} students &nbsp;·&nbsp;
    Report generated ${new Date().toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}
  </div>

  <table>
    <tr>
      <th>#</th><th>Student</th><th>Days</th><th>Sessions</th>
      <th>Baseline Acc.</th><th>Current Acc.</th><th>Improvement</th>
      <th>Current WPM</th><th>Last Session</th>
    </tr>
    ${rows.map((r,i)=>{
      const deltaStr = r.impAcc===null?"—":r.impAcc>0?`▲ +${r.impAcc}%`:r.impAcc<0?`▼ ${r.impAcc}%`:"—";
      const deltaClass = r.impAcc===null?"neu":r.impAcc>0?"up":r.impAcc<0?"down":"neu";
      const accPct = r.latest?.accuracy||0;
      return `<tr>
        <td class="rank">${i+1}</td>
        <td class="name">${r.name}</td>
        <td>${r.days}</td>
        <td>${r.sessions}</td>
        <td>${r.baseline?r.baseline.accuracy+"%":"—"}</td>
        <td>
          ${r.latest?r.latest.accuracy+"%":"—"}
          ${r.latest?`<span class="bar-bg"><span class="bar-fg" style="width:${accPct}%"></span></span>`:""}
        </td>
        <td class="${deltaClass}">${deltaStr}</td>
        <td>${r.latest?r.latest.wpm:"—"}</td>
        <td>${r.lastDate}</td>
      </tr>`;
    }).join("")}
  </table>

  <div class="footer">
    Cheder Lubavitch of Dallas — Summer Kriah Program &nbsp;·&nbsp;
    Students ranked by current accuracy. ★ = baseline session.
  </div>
  <script>window.onload=()=>window.print();</script>
  </body></html>`;

  const w = window.open("","_blank");
  if (w) { w.document.write(html); w.document.close(); }
};
function Teacher({ customPassages, onAdd, onDelete, onBack, onViewStudent, onChangePIN }) {
  const [f,setF]=useState({titleEn:"",title:"",text:"",level:"Intermediate"});
  const [open,setOpen]=useState(false);
  const [lookup,setLookup]=useState("");
  const [roster,setRoster]=useState([]); const [sName,setSName]=useState(""); const [sPin,setSPin]=useState(""); const [pinErr,setPinErr]=useState("");
  const [showPins,setShowPins]=useState({});
  useEffect(()=>{ dbGet(SK.roster,[]).then(setRoster); },[]);

  const addStudent = async () => {
    const n=sName.trim(); const p=sPin.trim();
    if(!n) return;
    if(!/^\d{4}$/.test(p)){setPinErr("PIN must be exactly 4 digits");return;}
    if(roster.find(s=>normName(s.name)===normName(n))){setPinErr("Student already exists");return;}
    const up=[...roster,{name:n,pin:p}]; setRoster(up); await dbSet(SK.roster,up);
    setSName(""); setSPin(""); setPinErr("");
  };
  const removeStudent = async i => { const up=roster.filter((_,j)=>j!==i); setRoster(up); await dbSet(SK.roster,up); };
  const addPassage = () => {
    if(!f.titleEn.trim()||!f.text.trim()) return;
    onAdd({...f,title:f.title||f.titleEn}); setF({titleEn:"",title:"",text:"",level:"Intermediate"}); setOpen(false);
  };

  return (
    <div className="fade" style={{minHeight:"100vh",padding:"24px 16px",maxWidth:640,margin:"0 auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:24}}>
        <div style={{fontSize:22,color:C.cream,fontStyle:"italic"}}>🎓 Teacher Panel</div>
        <div style={{display:"flex",gap:8}}>
          {roster.length>0&&<button style={B("p",{fontSize:12,padding:"7px 12px"})} onClick={()=>generateClassPDF(roster)}>⬇ Class Overview</button>}
          <button style={B("g",{fontSize:12,padding:"7px 12px"})} onClick={onChangePIN}>Change PIN</button>
          <button style={B("g",{fontSize:12,padding:"7px 12px"})} onClick={onBack}>← Back</button>
        </div>
      </div>

      {/* Roster */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22,marginBottom:18}}>
        <div style={{fontSize:16,color:C.gold,fontStyle:"italic",marginBottom:14}}>Student Roster</div>
        <div style={{display:"flex",gap:8,marginBottom:8,flexWrap:"wrap"}}>
          <input value={sName} onChange={e=>setSName(e.target.value)} placeholder="Student name" style={{flex:2,minWidth:110}} onKeyDown={e=>e.key==="Enter"&&addStudent()}/>
          <input value={sPin} onChange={e=>setSPin(e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="PIN" maxLength={4} style={{width:70,letterSpacing:4,textAlign:"center"}} onKeyDown={e=>e.key==="Enter"&&addStudent()}/>
          <button style={B("p",{padding:"10px 16px",fontSize:13})} onClick={addStudent}>Add →</button>
        </div>
        {pinErr&&<div style={{fontSize:12,color:C.red,marginBottom:8}}>{pinErr}</div>}
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          <input value={lookup} onChange={e=>setLookup(e.target.value)} placeholder="View student progress…" style={{flex:1}} onKeyDown={e=>e.key==="Enter"&&lookup.trim()&&onViewStudent(lookup.trim())}/>
          <button style={B("p",{padding:"10px 16px",fontSize:13})} onClick={()=>lookup.trim()&&onViewStudent(lookup.trim())} disabled={!lookup.trim()}>View →</button>
        </div>
        {roster.length>0?(
          <div style={{display:"flex",flexDirection:"column",gap:5,maxHeight:220,overflowY:"auto"}}>
            {roster.map((s,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",background:C.surface,borderRadius:8}}>
                <div style={{fontSize:14,color:C.cream}}>{s.name}</div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:12,color:C.muted,fontFamily:"monospace",letterSpacing:2}}>{showPins[i]?s.pin:"••••"}</span>
                  <button onClick={()=>setShowPins(p=>({...p,[i]:!p[i]}))} style={{background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontSize:12,padding:"2px 5px"}}>{showPins[i]?"🙈":"👁"}</button>
                  <button onClick={()=>onViewStudent(s.name)} style={B("g",{fontSize:11,padding:"4px 10px"})}>Progress</button>
                  <button onClick={()=>removeStudent(i)} style={B("d",{fontSize:11,padding:"4px 10px"})}>×</button>
                </div>
              </div>
            ))}
          </div>
        ):<div style={{fontSize:12,color:C.muted}}>No students added yet.</div>}
      </div>

      {/* Schedule view */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22,marginBottom:18}}>
        <div style={{fontSize:16,color:C.gold,fontStyle:"italic",marginBottom:14}}>50-Day Program Schedule</div>
        <div style={{maxHeight:220,overflowY:"auto",display:"flex",flexDirection:"column",gap:5}}>
          {SCH.map((e,i)=>(
            <div key={i} style={{display:"flex",gap:10,padding:"7px 10px",background:C.surface,borderRadius:6,alignItems:"center"}}>
              <span style={{fontSize:11,color:e.review?C.gold:C.muted,minWidth:56,fontWeight:600}}>Days {e.days[0]}–{e.days[1]}</span>
              {e.review
                ? <span style={{fontSize:12,color:C.gold}}>{e.complete?"🏆 Program Complete":"✡ Review Day"}</span>
                : <><span className="heb" style={{fontSize:14,color:C.cream}}>{e.ch.heb}</span><span style={{color:C.border}}>·</span><span className="heb" style={{fontSize:14,color:C.muted}}>{e.sid.heb}</span></>}
            </div>
          ))}
        </div>
      </div>

      {/* Add passage */}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22,marginBottom:18}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:open?18:0}}>
          <div style={{fontSize:16,color:C.gold,fontStyle:"italic"}}>Add Custom Passage</div>
          <button style={B(open?"g":"p",{fontSize:12,padding:"7px 16px"})} onClick={()=>setOpen(!open)}>{open?"Cancel":"+ Add"}</button>
        </div>
        {open&&(
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {[["English Title *","titleEn","e.g. Ma Tovu",false],["Hebrew Title","title","מַה טֹּבוּ",true]].map(([lb,key,ph,heb])=>(
              <div key={key}><label style={{display:"block",fontSize:10,letterSpacing:2,color:C.muted,marginBottom:5}}>{lb.toUpperCase()}</label>
              <input value={f[key]} onChange={e=>setF({...f,[key]:e.target.value})} placeholder={ph} style={{width:"100%",...(heb?{fontFamily:"'Frank Ruhl Libre',serif",fontSize:20,direction:"rtl"}:{})}}/></div>
            ))}
            <div><label style={{display:"block",fontSize:10,letterSpacing:2,color:C.muted,marginBottom:5}}>HEBREW TEXT *</label>
            <textarea value={f.text} onChange={e=>setF({...f,text:e.target.value})} placeholder="Paste Hebrew here…" dir="rtl" style={{width:"100%",minHeight:90,resize:"vertical",fontFamily:"'Frank Ruhl Libre',serif",fontSize:22,lineHeight:2,direction:"rtl"}}/></div>
            <select value={f.level} onChange={e=>setF({...f,level:e.target.value})} style={{width:"auto"}}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select>
            <button style={B("p",{padding:"11px"})} onClick={addPassage} disabled={!f.titleEn.trim()||!f.text.trim()}>Add Passage</button>
          </div>
        )}
      </div>

      {customPassages.length>0&&(
        <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:22}}>
          <div style={{fontSize:16,color:C.gold,fontStyle:"italic",marginBottom:12}}>Custom Passages ({customPassages.length})</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {customPassages.map(p=>(
              <div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 12px",background:C.surface,borderRadius:8}}>
                <div><div className="heb" style={{fontSize:18,color:C.cream}}>{p.title||p.titleEn}</div><div style={{fontSize:11,color:C.muted}}>{p.titleEn} · {p.level}</div></div>
                <button style={B("d",{fontSize:11,padding:"5px 12px"})} onClick={()=>onDelete(p.id)}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ══ ROOT ══ */
export default function App() {
  const [screen,setScreen]       = useState("welcome");
  const [name,setName]           = useState("");
  const [isDemo,setIsDemo]       = useState(false);
  const [selectedDay,setSelectedDay] = useState(null);
  const [result,setResult]       = useState(null);
  const [sessions,setSessions]   = useState([]);
  const [custom,setCustom]       = useState([]);
  const [viewingStudent,setViewingStudent] = useState("");
  const [teacherPinExists,setTeacherPinExists] = useState(null);

  useEffect(()=>{ dbGet(SK.custom,[]).then(setCustom); dbGet(SK.teacherPin,null).then(p=>setTeacherPinExists(!!p)); },[]);

  const loadSessions = async (n) => { const s=await dbGet(SK.sessions(n),[]); setSessions(s); };

  const handleEnter = async (n,demo) => {
    setName(n); setIsDemo(demo);
    if(!demo) await loadSessions(n);
    setScreen("daySelect");
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    const entry=getDayEntry(day);
    if(entry?.complete) { setScreen("programComplete"); return; }
    setScreen("reading");
  };

  const handleComplete = async (res) => {
    const entry=getDayEntry(selectedDay);
    if(!isDemo){
      const prev=await dbGet(SK.sessions(name),[]);
      const isBaseline=prev.length===0;
      const session={...res, day:selectedDay, date:Date.now(), isBaseline, isReview:entry?.review||false};
      const updated=[...prev,session];
      await dbSet(SK.sessions(name),updated);
      setSessions(updated);
    }
    setResult(res); setScreen("results");
  };

  const addCustom = async p => { const up=[...custom,{...p,id:`c${Date.now()}`}]; setCustom(up); await dbSet(SK.custom,up); };
  const delCustom = async id => { const up=custom.filter(p=>p.id!==id); setCustom(up); await dbSet(SK.custom,up); };
  const viewStudent = sName => { setViewingStudent(sName); setScreen("studentProgress"); };
  const handleTeacherClick = () => { if(teacherPinExists===false) setScreen("teacherSetup"); else setScreen("teacherLogin"); };

  const dayEntry = selectedDay ? getDayEntry(selectedDay) : null;
  const isReview = dayEntry?.review && !dayEntry?.complete;
  const reviewPassages = isReview ? getReviewPassages(selectedDay) : [];

  return (
    <div style={{background:C.bg,minHeight:"100vh",color:C.text}}>
      <style>{CSS}</style>
      <ErrorBoundary>

      {screen==="welcome" && <Welcome onEnter={handleEnter} onTeacherClick={handleTeacherClick}/>}

      {screen==="daySelect" && <DaySelector studentName={name} isDemo={isDemo} sessions={sessions} onSelectDay={handleDaySelect} onSignOut={()=>{setName("");setIsDemo(false);setScreen("welcome");}}/>}

      {screen==="reading" && dayEntry && (
        <ReadingSession dayEntry={dayEntry} isReview={isReview} reviewPassages={reviewPassages}
          onComplete={handleComplete} onCancel={()=>setScreen("daySelect")}
          baselineWpm={sessions.find(s=>s.isBaseline)?.wpm || 0}
          studentName={name} dayNum={selectedDay}/>
      )}

      {screen==="results" && result && (
        <Results result={result} dayNum={selectedDay} studentName={name} isDemo={isDemo}
          onNext={()=>setScreen("daySelect")}
          onViewMore={null}/>
      )}

      {screen==="programComplete" && <ProgramComplete studentName={name} onRestart={()=>setScreen("daySelect")}/>}

      {screen==="teacherSetup" && <PinSetup onDone={()=>{setTeacherPinExists(true);setScreen("teacher");}} onCancel={()=>setScreen("welcome")}/>}

      {screen==="teacherLogin" && <PinPad title="Teacher Access" subtitle="Enter your 4-digit PIN" onSuccess={()=>setScreen("teacher")} onCancel={()=>setScreen("welcome")} validate={async p=>{const s=await dbGet(SK.teacherPin,null);return p===s;}}/>}

      {screen==="teacher" && <Teacher customPassages={custom} onAdd={addCustom} onDelete={delCustom} onBack={()=>setScreen("welcome")} onViewStudent={viewStudent} onChangePIN={()=>setScreen("teacherSetup")}/>}

      {screen==="studentProgress" && <StudentProgress studentName={viewingStudent} onBack={()=>setScreen("teacher")}/>}
      </ErrorBoundary>
    </div>
  );
}
