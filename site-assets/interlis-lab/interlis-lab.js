function ls(n) {
  return {
    severity: "error",
    message: n,
    source: "check"
  };
}
function Ac(n, t, e) {
  switch (n.type) {
    case "ili2c-compiles":
      return e.ok ? [] : [
        ls(
          "Das Modell kompiliert noch nicht. Prüfe die Compiler-Meldungen und versuche es erneut."
        )
      ];
    case "contains-text":
      return t.includes(n.text) ? [] : [
        ls(
          n.message ?? `Im Modell fehlt noch der erwartete Text: "${n.text}".`
        )
      ];
    case "not-contains-text":
      return t.includes(n.text) ? [
        ls(
          n.message ?? `Der Text "${n.text}" sollte nicht mehr im Modell vorkommen.`
        )
      ] : [];
    case "custom":
      return [
        {
          severity: "warning",
          message: `Der Custom-Check "${n.id}" ist im MVP noch nicht implementiert.`,
          source: "check"
        }
      ];
  }
}
function Cc(n, t, e) {
  return n ? "Alle Prüfungen erfolgreich bestanden." : t.ok ? e.find((s) => s.source === "check")?.message ?? "Mindestens eine Aufgabenanforderung ist noch nicht erfüllt." : "Modell kompiliert noch nicht. Nutze die Compiler-Ausgabe als nächsten Schritt.";
}
function Km(n) {
  const t = (n.lesson.checks ?? []).flatMap(
    (r) => Ac(r, n.code, n.runResult)
  ), e = [...n.runResult.diagnostics, ...t], i = n.runResult.ok && !t.some((r) => r.severity === "error"), s = {
    ...n.runResult,
    ok: i,
    diagnostics: e
  };
  return {
    ok: i,
    diagnostics: e,
    summary: Cc(i, n.runResult, e),
    runResult: s
  };
}
const ho = {
  info: 0,
  warning: 1,
  error: 2
};
function Gm(n) {
  return n.reduce((t, e) => t ? ho[e.severity] > ho[t] ? e.severity : t : e.severity, void 0);
}
function Jm(n) {
  return n.some((t) => t.severity === "error");
}
function Mc(n) {
  const t = [n.file, n.line, n.column].filter((e) => e !== void 0).join(":");
  return t ? `${t} ` : "";
}
function Ym(n) {
  return `${Mc(n)}${n.message}`.trim();
}
function Xm(n, t) {
  const e = n.split(`
`), i = t.split(`
`), s = Math.max(e.length, i.length), r = [];
  for (let o = 0; o < s; o += 1) {
    const l = e[o], a = i[o];
    let h = "same";
    l === void 0 ? h = "added" : a === void 0 ? h = "removed" : l !== a && (h = "changed"), r.push({
      lineNumber: o + 1,
      current: l,
      solution: a,
      type: h
    });
  }
  return r;
}
const we = {
  ready: "interlis-lab-ready",
  runStart: "interlis-lab-run-start",
  runComplete: "interlis-lab-run-complete",
  hintShown: "interlis-lab-hint-shown",
  solutionShown: "interlis-lab-solution-shown",
  reset: "interlis-lab-reset",
  error: "interlis-lab-error"
};
function ve(n, t) {
  return new CustomEvent(n, {
    detail: t,
    bubbles: !0,
    composed: !0
  });
}
const ot = {
  run: "Compile",
  showHint: "Hinweis anzeigen",
  showNextHint: "Nächsten Hinweis anzeigen",
  showSolution: "Lösung",
  reset: "Zurücksetzen",
  compare: "Vergleichen",
  exerciseTab: "Eigene Lösung",
  solutionTab: "Musterlösung",
  editor: "Editor",
  solutionView: "Musterlösung",
  statusIdle: "Noch nicht geprüft",
  statusLoading: "Lädt...",
  statusReady: "Bereit",
  statusRunning: "Prüft...",
  statusSuccess: "Modell kompiliert erfolgreich",
  statusFailed: "Modell kompiliert noch nicht",
  statusError: "Fehler",
  rawOutput: "Compiler-Output"
};
function Sr(n) {
  return typeof n == "object" && n !== null && !Array.isArray(n);
}
function li(n, t) {
  if (!Sr(n))
    throw new Error(`${t} muss ein Objekt sein.`);
  return n;
}
function Z(n, t) {
  if (typeof n != "string" || n.trim().length === 0)
    throw new Error(`${t} muss ein nicht-leerer String sein.`);
  return n;
}
function Re(n, t) {
  if (n != null)
    return Z(n, t);
}
function Tc(n, t) {
  if (n != null) {
    if (!Array.isArray(n) || n.some((e) => typeof e != "string"))
      throw new Error(`${t} muss ein String-Array sein.`);
    return [...n];
  }
}
function Oc(n, t) {
  const e = li(n, `Hint ${t + 1}`);
  return {
    id: Re(e.id, `Hint ${t + 1}.id`) ?? `hint-${t + 1}`,
    title: Re(e.title, `Hint ${t + 1}.title`),
    text: Z(e.text, `Hint ${t + 1}.text`)
  };
}
function Ec(n, t) {
  const e = li(n, `Check ${t + 1}`), i = Z(e.type, `Check ${t + 1}.type`);
  switch (i) {
    case "ili2c-compiles":
      return { type: i };
    case "contains-text":
      return {
        type: i,
        text: Z(e.text, `Check ${t + 1}.text`),
        message: Re(e.message, `Check ${t + 1}.message`)
      };
    case "not-contains-text":
      return {
        type: i,
        text: Z(e.text, `Check ${t + 1}.text`),
        message: Re(e.message, `Check ${t + 1}.message`)
      };
    case "custom":
      return {
        type: i,
        id: Z(e.id, `Check ${t + 1}.id`),
        params: Sr(e.params) ? { ...e.params } : void 0
      };
    default:
      throw new Error(`Unbekannter Check-Typ: ${i}`);
  }
}
function Dc(n) {
  const t = li(n, "reflection");
  return {
    question: Z(t.question, "reflection.question"),
    kind: t.kind === void 0 ? void 0 : Z(t.kind, "reflection.kind"),
    options: Tc(t.options, "reflection.options"),
    answer: Re(t.answer, "reflection.answer")
  };
}
function Rc(n) {
  if (n != null) {
    if (!Array.isArray(n))
      throw new Error("files muss ein Array sein.");
    return n.map((t, e) => {
      const i = li(t, `File ${e + 1}`);
      return {
        path: Z(i.path, `File ${e + 1}.path`),
        language: i.language === void 0 ? void 0 : Z(i.language, `File ${e + 1}.language`),
        content: Z(i.content, `File ${e + 1}.content`),
        readonly: typeof i.readonly == "boolean" ? i.readonly : void 0
      };
    });
  }
}
function Lc(n) {
  if (n != null) {
    if (!Array.isArray(n))
      throw new Error("actions muss ein Array sein.");
    return n.map((t, e) => {
      const i = li(t, `Action ${e + 1}`);
      return {
        id: Z(i.id, `Action ${e + 1}.id`),
        label: Z(i.label, `Action ${e + 1}.label`),
        kind: Z(i.kind, `Action ${e + 1}.kind`),
        primary: typeof i.primary == "boolean" ? i.primary : void 0
      };
    });
  }
}
function zl(n) {
  const t = li(n, "Lesson"), e = Z(t.type, "type");
  if (!["guided", "debugging", "challenge", "worked-example"].includes(e))
    throw new Error(`Ungültiger Lesson-Typ: ${e}`);
  const i = t.level === void 0 ? void 0 : Z(t.level, "level");
  if (i && !["beginner", "intermediate", "advanced"].includes(i))
    throw new Error(`Ungültiges Level: ${i}`);
  return {
    id: Z(t.id, "id"),
    title: Z(t.title, "title"),
    type: e,
    level: i,
    goal: Z(t.goal, "goal"),
    explanation: Re(t.explanation, "explanation"),
    task: Z(t.task, "task"),
    initialCode: Z(t.initialCode, "initialCode"),
    solution: Re(t.solution, "solution"),
    hints: Array.isArray(t.hints) ? t.hints.map(Oc) : void 0,
    checks: Array.isArray(t.checks) ? t.checks.map(Ec) : void 0,
    reflection: t.reflection ? Dc(t.reflection) : void 0,
    files: Rc(t.files),
    actions: Lc(t.actions),
    metadata: Sr(t.metadata) ? { ...t.metadata } : void 0
  };
}
async function Bc(n, t = fetch) {
  const e = await t(n);
  if (!e.ok)
    throw new Error(`Die Aufgabe konnte nicht geladen werden (${e.status} ${e.statusText}).`);
  const i = await e.json();
  return zl(i);
}
function co(n, t = {}) {
  const e = t.code ?? n.initialCode;
  return {
    status: "ready",
    code: e,
    visibleHintCount: 0,
    solutionVisible: t.showSolution ?? !1,
    dirty: e !== n.initialCode,
    feedbackMessage: void 0,
    error: void 0
  };
}
function Pc(n) {
  return {
    status: "loading",
    code: n?.code ?? "",
    visibleHintCount: n?.visibleHintCount ?? 0,
    solutionVisible: n?.solutionVisible ?? !1,
    lastResult: n?.lastResult,
    error: void 0,
    dirty: n?.dirty ?? !1,
    feedbackMessage: void 0
  };
}
function Zm(n, t, e) {
  return {
    ...n,
    code: t,
    dirty: t !== e.initialCode
  };
}
function Ic(n) {
  return {
    ...n,
    status: "running",
    error: void 0,
    feedbackMessage: void 0
  };
}
function Nc(n, t, e) {
  return {
    ...n,
    status: t.ok ? "success" : "failed",
    lastResult: t,
    error: void 0,
    feedbackMessage: e
  };
}
function Qm(n, t) {
  return {
    ...n,
    visibleHintCount: Math.min(t, n.visibleHintCount + 1)
  };
}
function $c(n) {
  return {
    ...n,
    solutionVisible: !0
  };
}
function Hc(n, t) {
  return {
    ...n,
    status: "error",
    error: t,
    feedbackMessage: void 0
  };
}
class Vc {
  constructor(t) {
    this.textarea = t;
  }
  getValue() {
    return this.textarea.value;
  }
  setValue(t) {
    this.textarea.value !== t && (this.textarea.value = t);
  }
  setDiagnostics(t) {
    const e = t.find((i) => i.severity === "error");
    this.textarea.setAttribute("aria-invalid", e ? "true" : "false"), this.textarea.title = e?.message ?? "";
  }
  setReadOnly(t) {
    this.textarea.readOnly = t;
  }
  focus() {
    this.textarea.focus();
  }
  dispose() {
    this.textarea.removeAttribute("aria-invalid"), this.textarea.title = "";
  }
}
let Bs = [], Ul = [];
(() => {
  let n = "lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o".split(",").map((t) => t ? parseInt(t, 36) : 1);
  for (let t = 0, e = 0; t < n.length; t++)
    (t % 2 ? Ul : Bs).push(e = e + n[t]);
})();
function Fc(n) {
  if (n < 768) return !1;
  for (let t = 0, e = Bs.length; ; ) {
    let i = t + e >> 1;
    if (n < Bs[i]) e = i;
    else if (n >= Ul[i]) t = i + 1;
    else return !0;
    if (t == e) return !1;
  }
}
function fo(n) {
  return n >= 127462 && n <= 127487;
}
const uo = 8205;
function Wc(n, t, e = !0, i = !0) {
  return (e ? jl : _c)(n, t, i);
}
function jl(n, t, e) {
  if (t == n.length) return t;
  t && ql(n.charCodeAt(t)) && Kl(n.charCodeAt(t - 1)) && t--;
  let i = as(n, t);
  for (t += po(i); t < n.length; ) {
    let s = as(n, t);
    if (i == uo || s == uo || e && Fc(s))
      t += po(s), i = s;
    else if (fo(s)) {
      let r = 0, o = t - 2;
      for (; o >= 0 && fo(as(n, o)); )
        r++, o -= 2;
      if (r % 2 == 0) break;
      t += 2;
    } else
      break;
  }
  return t;
}
function _c(n, t, e) {
  for (; t > 0; ) {
    let i = jl(n, t - 2, e);
    if (i < t) return i;
    t--;
  }
  return 0;
}
function as(n, t) {
  let e = n.charCodeAt(t);
  if (!Kl(e) || t + 1 == n.length) return e;
  let i = n.charCodeAt(t + 1);
  return ql(i) ? (e - 55296 << 10) + (i - 56320) + 65536 : e;
}
function ql(n) {
  return n >= 56320 && n < 57344;
}
function Kl(n) {
  return n >= 55296 && n < 56320;
}
function po(n) {
  return n < 65536 ? 1 : 2;
}
class N {
  /**
  Get the line description around the given position.
  */
  lineAt(t) {
    if (t < 0 || t > this.length)
      throw new RangeError(`Invalid position ${t} in document of length ${this.length}`);
    return this.lineInner(t, !1, 1, 0);
  }
  /**
  Get the description for the given (1-based) line number.
  */
  line(t) {
    if (t < 1 || t > this.lines)
      throw new RangeError(`Invalid line number ${t} in ${this.lines}-line document`);
    return this.lineInner(t, !0, 1, 0);
  }
  /**
  Replace a range of the text with the given content.
  */
  replace(t, e, i) {
    [t, e] = Je(this, t, e);
    let s = [];
    return this.decompose(
      0,
      t,
      s,
      2
      /* Open.To */
    ), i.length && i.decompose(
      0,
      i.length,
      s,
      3
      /* Open.To */
    ), this.decompose(
      e,
      this.length,
      s,
      1
      /* Open.From */
    ), qt.from(s, this.length - (e - t) + i.length);
  }
  /**
  Append another document to this one.
  */
  append(t) {
    return this.replace(this.length, this.length, t);
  }
  /**
  Retrieve the text between the given points.
  */
  slice(t, e = this.length) {
    [t, e] = Je(this, t, e);
    let i = [];
    return this.decompose(t, e, i, 0), qt.from(i, e - t);
  }
  /**
  Test whether this text is equal to another instance.
  */
  eq(t) {
    if (t == this)
      return !0;
    if (t.length != this.length || t.lines != this.lines)
      return !1;
    let e = this.scanIdentical(t, 1), i = this.length - this.scanIdentical(t, -1), s = new wi(this), r = new wi(t);
    for (let o = e, l = e; ; ) {
      if (s.next(o), r.next(o), o = 0, s.lineBreak != r.lineBreak || s.done != r.done || s.value != r.value)
        return !1;
      if (l += s.value.length, s.done || l >= i)
        return !0;
    }
  }
  /**
  Iterate over the text. When `dir` is `-1`, iteration happens
  from end to start. This will return lines and the breaks between
  them as separate strings.
  */
  iter(t = 1) {
    return new wi(this, t);
  }
  /**
  Iterate over a range of the text. When `from` > `to`, the
  iterator will run in reverse.
  */
  iterRange(t, e = this.length) {
    return new Gl(this, t, e);
  }
  /**
  Return a cursor that iterates over the given range of lines,
  _without_ returning the line breaks between, and yielding empty
  strings for empty lines.
  
  When `from` and `to` are given, they should be 1-based line numbers.
  */
  iterLines(t, e) {
    let i;
    if (t == null)
      i = this.iter();
    else {
      e == null && (e = this.lines + 1);
      let s = this.line(t).from;
      i = this.iterRange(s, Math.max(s, e == this.lines + 1 ? this.length : e <= 1 ? 0 : this.line(e - 1).to));
    }
    return new Jl(i);
  }
  /**
  Return the document as a string, using newline characters to
  separate lines.
  */
  toString() {
    return this.sliceString(0);
  }
  /**
  Convert the document to an array of lines (which can be
  deserialized again via [`Text.of`](https://codemirror.net/6/docs/ref/#state.Text^of)).
  */
  toJSON() {
    let t = [];
    return this.flatten(t), t;
  }
  /**
  @internal
  */
  constructor() {
  }
  /**
  Create a `Text` instance for the given array of lines.
  */
  static of(t) {
    if (t.length == 0)
      throw new RangeError("A document must have at least one line");
    return t.length == 1 && !t[0] ? N.empty : t.length <= 32 ? new Y(t) : qt.from(Y.split(t, []));
  }
}
class Y extends N {
  constructor(t, e = zc(t)) {
    super(), this.text = t, this.length = e;
  }
  get lines() {
    return this.text.length;
  }
  get children() {
    return null;
  }
  lineInner(t, e, i, s) {
    for (let r = 0; ; r++) {
      let o = this.text[r], l = s + o.length;
      if ((e ? i : l) >= t)
        return new Uc(s, l, i, o);
      s = l + 1, i++;
    }
  }
  decompose(t, e, i, s) {
    let r = t <= 0 && e >= this.length ? this : new Y(go(this.text, t, e), Math.min(e, this.length) - Math.max(0, t));
    if (s & 1) {
      let o = i.pop(), l = bn(r.text, o.text.slice(), 0, r.length);
      if (l.length <= 32)
        i.push(new Y(l, o.length + r.length));
      else {
        let a = l.length >> 1;
        i.push(new Y(l.slice(0, a)), new Y(l.slice(a)));
      }
    } else
      i.push(r);
  }
  replace(t, e, i) {
    if (!(i instanceof Y))
      return super.replace(t, e, i);
    [t, e] = Je(this, t, e);
    let s = bn(this.text, bn(i.text, go(this.text, 0, t)), e), r = this.length + i.length - (e - t);
    return s.length <= 32 ? new Y(s, r) : qt.from(Y.split(s, []), r);
  }
  sliceString(t, e = this.length, i = `
`) {
    [t, e] = Je(this, t, e);
    let s = "";
    for (let r = 0, o = 0; r <= e && o < this.text.length; o++) {
      let l = this.text[o], a = r + l.length;
      r > t && o && (s += i), t < a && e > r && (s += l.slice(Math.max(0, t - r), e - r)), r = a + 1;
    }
    return s;
  }
  flatten(t) {
    for (let e of this.text)
      t.push(e);
  }
  scanIdentical() {
    return 0;
  }
  static split(t, e) {
    let i = [], s = -1;
    for (let r of t)
      i.push(r), s += r.length + 1, i.length == 32 && (e.push(new Y(i, s)), i = [], s = -1);
    return s > -1 && e.push(new Y(i, s)), e;
  }
}
class qt extends N {
  constructor(t, e) {
    super(), this.children = t, this.length = e, this.lines = 0;
    for (let i of t)
      this.lines += i.lines;
  }
  lineInner(t, e, i, s) {
    for (let r = 0; ; r++) {
      let o = this.children[r], l = s + o.length, a = i + o.lines - 1;
      if ((e ? a : l) >= t)
        return o.lineInner(t, e, i, s);
      s = l + 1, i = a + 1;
    }
  }
  decompose(t, e, i, s) {
    for (let r = 0, o = 0; o <= e && r < this.children.length; r++) {
      let l = this.children[r], a = o + l.length;
      if (t <= a && e >= o) {
        let h = s & ((o <= t ? 1 : 0) | (a >= e ? 2 : 0));
        o >= t && a <= e && !h ? i.push(l) : l.decompose(t - o, e - o, i, h);
      }
      o = a + 1;
    }
  }
  replace(t, e, i) {
    if ([t, e] = Je(this, t, e), i.lines < this.lines)
      for (let s = 0, r = 0; s < this.children.length; s++) {
        let o = this.children[s], l = r + o.length;
        if (t >= r && e <= l) {
          let a = o.replace(t - r, e - r, i), h = this.lines - o.lines + a.lines;
          if (a.lines < h >> 4 && a.lines > h >> 6) {
            let c = this.children.slice();
            return c[s] = a, new qt(c, this.length - (e - t) + i.length);
          }
          return super.replace(r, l, a);
        }
        r = l + 1;
      }
    return super.replace(t, e, i);
  }
  sliceString(t, e = this.length, i = `
`) {
    [t, e] = Je(this, t, e);
    let s = "";
    for (let r = 0, o = 0; r < this.children.length && o <= e; r++) {
      let l = this.children[r], a = o + l.length;
      o > t && r && (s += i), t < a && e > o && (s += l.sliceString(t - o, e - o, i)), o = a + 1;
    }
    return s;
  }
  flatten(t) {
    for (let e of this.children)
      e.flatten(t);
  }
  scanIdentical(t, e) {
    if (!(t instanceof qt))
      return 0;
    let i = 0, [s, r, o, l] = e > 0 ? [0, 0, this.children.length, t.children.length] : [this.children.length - 1, t.children.length - 1, -1, -1];
    for (; ; s += e, r += e) {
      if (s == o || r == l)
        return i;
      let a = this.children[s], h = t.children[r];
      if (a != h)
        return i + a.scanIdentical(h, e);
      i += a.length + 1;
    }
  }
  static from(t, e = t.reduce((i, s) => i + s.length + 1, -1)) {
    let i = 0;
    for (let d of t)
      i += d.lines;
    if (i < 32) {
      let d = [];
      for (let p of t)
        p.flatten(d);
      return new Y(d, e);
    }
    let s = Math.max(
      32,
      i >> 5
      /* Tree.BranchShift */
    ), r = s << 1, o = s >> 1, l = [], a = 0, h = -1, c = [];
    function f(d) {
      let p;
      if (d.lines > r && d instanceof qt)
        for (let g of d.children)
          f(g);
      else d.lines > o && (a > o || !a) ? (u(), l.push(d)) : d instanceof Y && a && (p = c[c.length - 1]) instanceof Y && d.lines + p.lines <= 32 ? (a += d.lines, h += d.length + 1, c[c.length - 1] = new Y(p.text.concat(d.text), p.length + 1 + d.length)) : (a + d.lines > s && u(), a += d.lines, h += d.length + 1, c.push(d));
    }
    function u() {
      a != 0 && (l.push(c.length == 1 ? c[0] : qt.from(c, h)), h = -1, a = c.length = 0);
    }
    for (let d of t)
      f(d);
    return u(), l.length == 1 ? l[0] : new qt(l, e);
  }
}
N.empty = /* @__PURE__ */ new Y([""], 0);
function zc(n) {
  let t = -1;
  for (let e of n)
    t += e.length + 1;
  return t;
}
function bn(n, t, e = 0, i = 1e9) {
  for (let s = 0, r = 0, o = !0; r < n.length && s <= i; r++) {
    let l = n[r], a = s + l.length;
    a >= e && (a > i && (l = l.slice(0, i - s)), s < e && (l = l.slice(e - s)), o ? (t[t.length - 1] += l, o = !1) : t.push(l)), s = a + 1;
  }
  return t;
}
function go(n, t, e) {
  return bn(n, [""], t, e);
}
class wi {
  constructor(t, e = 1) {
    this.dir = e, this.done = !1, this.lineBreak = !1, this.value = "", this.nodes = [t], this.offsets = [e > 0 ? 1 : (t instanceof Y ? t.text.length : t.children.length) << 1];
  }
  nextInner(t, e) {
    for (this.done = this.lineBreak = !1; ; ) {
      let i = this.nodes.length - 1, s = this.nodes[i], r = this.offsets[i], o = r >> 1, l = s instanceof Y ? s.text.length : s.children.length;
      if (o == (e > 0 ? l : 0)) {
        if (i == 0)
          return this.done = !0, this.value = "", this;
        e > 0 && this.offsets[i - 1]++, this.nodes.pop(), this.offsets.pop();
      } else if ((r & 1) == (e > 0 ? 0 : 1)) {
        if (this.offsets[i] += e, t == 0)
          return this.lineBreak = !0, this.value = `
`, this;
        t--;
      } else if (s instanceof Y) {
        let a = s.text[o + (e < 0 ? -1 : 0)];
        if (this.offsets[i] += e, a.length > Math.max(0, t))
          return this.value = t == 0 ? a : e > 0 ? a.slice(t) : a.slice(0, a.length - t), this;
        t -= a.length;
      } else {
        let a = s.children[o + (e < 0 ? -1 : 0)];
        t > a.length ? (t -= a.length, this.offsets[i] += e) : (e < 0 && this.offsets[i]--, this.nodes.push(a), this.offsets.push(e > 0 ? 1 : (a instanceof Y ? a.text.length : a.children.length) << 1));
      }
    }
  }
  next(t = 0) {
    return t < 0 && (this.nextInner(-t, -this.dir), t = this.value.length), this.nextInner(t, this.dir);
  }
}
class Gl {
  constructor(t, e, i) {
    this.value = "", this.done = !1, this.cursor = new wi(t, e > i ? -1 : 1), this.pos = e > i ? t.length : 0, this.from = Math.min(e, i), this.to = Math.max(e, i);
  }
  nextInner(t, e) {
    if (e < 0 ? this.pos <= this.from : this.pos >= this.to)
      return this.value = "", this.done = !0, this;
    t += Math.max(0, e < 0 ? this.pos - this.to : this.from - this.pos);
    let i = e < 0 ? this.pos - this.from : this.to - this.pos;
    t > i && (t = i), i -= t;
    let { value: s } = this.cursor.next(t);
    return this.pos += (s.length + t) * e, this.value = s.length <= i ? s : e < 0 ? s.slice(s.length - i) : s.slice(0, i), this.done = !this.value, this;
  }
  next(t = 0) {
    return t < 0 ? t = Math.max(t, this.from - this.pos) : t > 0 && (t = Math.min(t, this.to - this.pos)), this.nextInner(t, this.cursor.dir);
  }
  get lineBreak() {
    return this.cursor.lineBreak && this.value != "";
  }
}
class Jl {
  constructor(t) {
    this.inner = t, this.afterBreak = !0, this.value = "", this.done = !1;
  }
  next(t = 0) {
    let { done: e, lineBreak: i, value: s } = this.inner.next(t);
    return e && this.afterBreak ? (this.value = "", this.afterBreak = !1) : e ? (this.done = !0, this.value = "") : i ? this.afterBreak ? this.value = "" : (this.afterBreak = !0, this.next()) : (this.value = s, this.afterBreak = !1), this;
  }
  get lineBreak() {
    return !1;
  }
}
typeof Symbol < "u" && (N.prototype[Symbol.iterator] = function() {
  return this.iter();
}, wi.prototype[Symbol.iterator] = Gl.prototype[Symbol.iterator] = Jl.prototype[Symbol.iterator] = function() {
  return this;
});
class Uc {
  /**
  @internal
  */
  constructor(t, e, i, s) {
    this.from = t, this.to = e, this.number = i, this.text = s;
  }
  /**
  The length of the line (not including any line break after it).
  */
  get length() {
    return this.to - this.from;
  }
}
function Je(n, t, e) {
  return t = Math.max(0, Math.min(n.length, t)), [t, Math.max(t, Math.min(n.length, e))];
}
function at(n, t, e = !0, i = !0) {
  return Wc(n, t, e, i);
}
function jc(n) {
  return n >= 56320 && n < 57344;
}
function qc(n) {
  return n >= 55296 && n < 56320;
}
function Kc(n, t) {
  let e = n.charCodeAt(t);
  if (!qc(e) || t + 1 == n.length)
    return e;
  let i = n.charCodeAt(t + 1);
  return jc(i) ? (e - 55296 << 10) + (i - 56320) + 65536 : e;
}
function Gc(n) {
  return n < 65536 ? 1 : 2;
}
const Ps = /\r\n?|\n/;
var pt = /* @__PURE__ */ (function(n) {
  return n[n.Simple = 0] = "Simple", n[n.TrackDel = 1] = "TrackDel", n[n.TrackBefore = 2] = "TrackBefore", n[n.TrackAfter = 3] = "TrackAfter", n;
})(pt || (pt = {}));
class Xt {
  // Sections are encoded as pairs of integers. The first is the
  // length in the current document, and the second is -1 for
  // unaffected sections, and the length of the replacement content
  // otherwise. So an insertion would be (0, n>0), a deletion (n>0,
  // 0), and a replacement two positive numbers.
  /**
  @internal
  */
  constructor(t) {
    this.sections = t;
  }
  /**
  The length of the document before the change.
  */
  get length() {
    let t = 0;
    for (let e = 0; e < this.sections.length; e += 2)
      t += this.sections[e];
    return t;
  }
  /**
  The length of the document after the change.
  */
  get newLength() {
    let t = 0;
    for (let e = 0; e < this.sections.length; e += 2) {
      let i = this.sections[e + 1];
      t += i < 0 ? this.sections[e] : i;
    }
    return t;
  }
  /**
  False when there are actual changes in this set.
  */
  get empty() {
    return this.sections.length == 0 || this.sections.length == 2 && this.sections[1] < 0;
  }
  /**
  Iterate over the unchanged parts left by these changes. `posA`
  provides the position of the range in the old document, `posB`
  the new position in the changed document.
  */
  iterGaps(t) {
    for (let e = 0, i = 0, s = 0; e < this.sections.length; ) {
      let r = this.sections[e++], o = this.sections[e++];
      o < 0 ? (t(i, s, r), s += r) : s += o, i += r;
    }
  }
  /**
  Iterate over the ranges changed by these changes. (See
  [`ChangeSet.iterChanges`](https://codemirror.net/6/docs/ref/#state.ChangeSet.iterChanges) for a
  variant that also provides you with the inserted text.)
  `fromA`/`toA` provides the extent of the change in the starting
  document, `fromB`/`toB` the extent of the replacement in the
  changed document.
  
  When `individual` is true, adjacent changes (which are kept
  separate for [position mapping](https://codemirror.net/6/docs/ref/#state.ChangeDesc.mapPos)) are
  reported separately.
  */
  iterChangedRanges(t, e = !1) {
    Is(this, t, e);
  }
  /**
  Get a description of the inverted form of these changes.
  */
  get invertedDesc() {
    let t = [];
    for (let e = 0; e < this.sections.length; ) {
      let i = this.sections[e++], s = this.sections[e++];
      s < 0 ? t.push(i, s) : t.push(s, i);
    }
    return new Xt(t);
  }
  /**
  Compute the combined effect of applying another set of changes
  after this one. The length of the document after this set should
  match the length before `other`.
  */
  composeDesc(t) {
    return this.empty ? t : t.empty ? this : Yl(this, t);
  }
  /**
  Map this description, which should start with the same document
  as `other`, over another set of changes, so that it can be
  applied after it. When `before` is true, map as if the changes
  in `this` happened before the ones in `other`.
  */
  mapDesc(t, e = !1) {
    return t.empty ? this : Ns(this, t, e);
  }
  mapPos(t, e = -1, i = pt.Simple) {
    let s = 0, r = 0;
    for (let o = 0; o < this.sections.length; ) {
      let l = this.sections[o++], a = this.sections[o++], h = s + l;
      if (a < 0) {
        if (h > t)
          return r + (t - s);
        r += l;
      } else {
        if (i != pt.Simple && h >= t && (i == pt.TrackDel && s < t && h > t || i == pt.TrackBefore && s < t || i == pt.TrackAfter && h > t))
          return null;
        if (h > t || h == t && e < 0 && !l)
          return t == s || e < 0 ? r : r + a;
        r += a;
      }
      s = h;
    }
    if (t > s)
      throw new RangeError(`Position ${t} is out of range for changeset of length ${s}`);
    return r;
  }
  /**
  Check whether these changes touch a given range. When one of the
  changes entirely covers the range, the string `"cover"` is
  returned.
  */
  touchesRange(t, e = t) {
    for (let i = 0, s = 0; i < this.sections.length && s <= e; ) {
      let r = this.sections[i++], o = this.sections[i++], l = s + r;
      if (o >= 0 && s <= e && l >= t)
        return s < t && l > e ? "cover" : !0;
      s = l;
    }
    return !1;
  }
  /**
  @internal
  */
  toString() {
    let t = "";
    for (let e = 0; e < this.sections.length; ) {
      let i = this.sections[e++], s = this.sections[e++];
      t += (t ? " " : "") + i + (s >= 0 ? ":" + s : "");
    }
    return t;
  }
  /**
  Serialize this change desc to a JSON-representable value.
  */
  toJSON() {
    return this.sections;
  }
  /**
  Create a change desc from its JSON representation (as produced
  by [`toJSON`](https://codemirror.net/6/docs/ref/#state.ChangeDesc.toJSON).
  */
  static fromJSON(t) {
    if (!Array.isArray(t) || t.length % 2 || t.some((e) => typeof e != "number"))
      throw new RangeError("Invalid JSON representation of ChangeDesc");
    return new Xt(t);
  }
  /**
  @internal
  */
  static create(t) {
    return new Xt(t);
  }
}
class Q extends Xt {
  constructor(t, e) {
    super(t), this.inserted = e;
  }
  /**
  Apply the changes to a document, returning the modified
  document.
  */
  apply(t) {
    if (this.length != t.length)
      throw new RangeError("Applying change set to a document with the wrong length");
    return Is(this, (e, i, s, r, o) => t = t.replace(s, s + (i - e), o), !1), t;
  }
  mapDesc(t, e = !1) {
    return Ns(this, t, e, !0);
  }
  /**
  Given the document as it existed _before_ the changes, return a
  change set that represents the inverse of this set, which could
  be used to go from the document created by the changes back to
  the document as it existed before the changes.
  */
  invert(t) {
    let e = this.sections.slice(), i = [];
    for (let s = 0, r = 0; s < e.length; s += 2) {
      let o = e[s], l = e[s + 1];
      if (l >= 0) {
        e[s] = l, e[s + 1] = o;
        let a = s >> 1;
        for (; i.length < a; )
          i.push(N.empty);
        i.push(o ? t.slice(r, r + o) : N.empty);
      }
      r += o;
    }
    return new Q(e, i);
  }
  /**
  Combine two subsequent change sets into a single set. `other`
  must start in the document produced by `this`. If `this` goes
  `docA` → `docB` and `other` represents `docB` → `docC`, the
  returned value will represent the change `docA` → `docC`.
  */
  compose(t) {
    return this.empty ? t : t.empty ? this : Yl(this, t, !0);
  }
  /**
  Given another change set starting in the same document, maps this
  change set over the other, producing a new change set that can be
  applied to the document produced by applying `other`. When
  `before` is `true`, order changes as if `this` comes before
  `other`, otherwise (the default) treat `other` as coming first.
  
  Given two changes `A` and `B`, `A.compose(B.map(A))` and
  `B.compose(A.map(B, true))` will produce the same document. This
  provides a basic form of [operational
  transformation](https://en.wikipedia.org/wiki/Operational_transformation),
  and can be used for collaborative editing.
  */
  map(t, e = !1) {
    return t.empty ? this : Ns(this, t, e, !0);
  }
  /**
  Iterate over the changed ranges in the document, calling `f` for
  each, with the range in the original document (`fromA`-`toA`)
  and the range that replaces it in the new document
  (`fromB`-`toB`).
  
  When `individual` is true, adjacent changes are reported
  separately.
  */
  iterChanges(t, e = !1) {
    Is(this, t, e);
  }
  /**
  Get a [change description](https://codemirror.net/6/docs/ref/#state.ChangeDesc) for this change
  set.
  */
  get desc() {
    return Xt.create(this.sections);
  }
  /**
  @internal
  */
  filter(t) {
    let e = [], i = [], s = [], r = new Oi(this);
    t: for (let o = 0, l = 0; ; ) {
      let a = o == t.length ? 1e9 : t[o++];
      for (; l < a || l == a && r.len == 0; ) {
        if (r.done)
          break t;
        let c = Math.min(r.len, a - l);
        lt(s, c, -1);
        let f = r.ins == -1 ? -1 : r.off == 0 ? r.ins : 0;
        lt(e, c, f), f > 0 && ae(i, e, r.text), r.forward(c), l += c;
      }
      let h = t[o++];
      for (; l < h; ) {
        if (r.done)
          break t;
        let c = Math.min(r.len, h - l);
        lt(e, c, -1), lt(s, c, r.ins == -1 ? -1 : r.off == 0 ? r.ins : 0), r.forward(c), l += c;
      }
    }
    return {
      changes: new Q(e, i),
      filtered: Xt.create(s)
    };
  }
  /**
  Serialize this change set to a JSON-representable value.
  */
  toJSON() {
    let t = [];
    for (let e = 0; e < this.sections.length; e += 2) {
      let i = this.sections[e], s = this.sections[e + 1];
      s < 0 ? t.push(i) : s == 0 ? t.push([i]) : t.push([i].concat(this.inserted[e >> 1].toJSON()));
    }
    return t;
  }
  /**
  Create a change set for the given changes, for a document of the
  given length, using `lineSep` as line separator.
  */
  static of(t, e, i) {
    let s = [], r = [], o = 0, l = null;
    function a(c = !1) {
      if (!c && !s.length)
        return;
      o < e && lt(s, e - o, -1);
      let f = new Q(s, r);
      l = l ? l.compose(f.map(l)) : f, s = [], r = [], o = 0;
    }
    function h(c) {
      if (Array.isArray(c))
        for (let f of c)
          h(f);
      else if (c instanceof Q) {
        if (c.length != e)
          throw new RangeError(`Mismatched change set length (got ${c.length}, expected ${e})`);
        a(), l = l ? l.compose(c.map(l)) : c;
      } else {
        let { from: f, to: u = f, insert: d } = c;
        if (f > u || f < 0 || u > e)
          throw new RangeError(`Invalid change range ${f} to ${u} (in doc of length ${e})`);
        let p = d ? typeof d == "string" ? N.of(d.split(i || Ps)) : d : N.empty, g = p.length;
        if (f == u && g == 0)
          return;
        f < o && a(), f > o && lt(s, f - o, -1), lt(s, u - f, g), ae(r, s, p), o = u;
      }
    }
    return h(t), a(!l), l;
  }
  /**
  Create an empty changeset of the given length.
  */
  static empty(t) {
    return new Q(t ? [t, -1] : [], []);
  }
  /**
  Create a changeset from its JSON representation (as produced by
  [`toJSON`](https://codemirror.net/6/docs/ref/#state.ChangeSet.toJSON).
  */
  static fromJSON(t) {
    if (!Array.isArray(t))
      throw new RangeError("Invalid JSON representation of ChangeSet");
    let e = [], i = [];
    for (let s = 0; s < t.length; s++) {
      let r = t[s];
      if (typeof r == "number")
        e.push(r, -1);
      else {
        if (!Array.isArray(r) || typeof r[0] != "number" || r.some((o, l) => l && typeof o != "string"))
          throw new RangeError("Invalid JSON representation of ChangeSet");
        if (r.length == 1)
          e.push(r[0], 0);
        else {
          for (; i.length < s; )
            i.push(N.empty);
          i[s] = N.of(r.slice(1)), e.push(r[0], i[s].length);
        }
      }
    }
    return new Q(e, i);
  }
  /**
  @internal
  */
  static createSet(t, e) {
    return new Q(t, e);
  }
}
function lt(n, t, e, i = !1) {
  if (t == 0 && e <= 0)
    return;
  let s = n.length - 2;
  s >= 0 && e <= 0 && e == n[s + 1] ? n[s] += t : s >= 0 && t == 0 && n[s] == 0 ? n[s + 1] += e : i ? (n[s] += t, n[s + 1] += e) : n.push(t, e);
}
function ae(n, t, e) {
  if (e.length == 0)
    return;
  let i = t.length - 2 >> 1;
  if (i < n.length)
    n[n.length - 1] = n[n.length - 1].append(e);
  else {
    for (; n.length < i; )
      n.push(N.empty);
    n.push(e);
  }
}
function Is(n, t, e) {
  let i = n.inserted;
  for (let s = 0, r = 0, o = 0; o < n.sections.length; ) {
    let l = n.sections[o++], a = n.sections[o++];
    if (a < 0)
      s += l, r += l;
    else {
      let h = s, c = r, f = N.empty;
      for (; h += l, c += a, a && i && (f = f.append(i[o - 2 >> 1])), !(e || o == n.sections.length || n.sections[o + 1] < 0); )
        l = n.sections[o++], a = n.sections[o++];
      t(s, h, r, c, f), s = h, r = c;
    }
  }
}
function Ns(n, t, e, i = !1) {
  let s = [], r = i ? [] : null, o = new Oi(n), l = new Oi(t);
  for (let a = -1; ; ) {
    if (o.done && l.len || l.done && o.len)
      throw new Error("Mismatched change set lengths");
    if (o.ins == -1 && l.ins == -1) {
      let h = Math.min(o.len, l.len);
      lt(s, h, -1), o.forward(h), l.forward(h);
    } else if (l.ins >= 0 && (o.ins < 0 || a == o.i || o.off == 0 && (l.len < o.len || l.len == o.len && !e))) {
      let h = l.len;
      for (lt(s, l.ins, -1); h; ) {
        let c = Math.min(o.len, h);
        o.ins >= 0 && a < o.i && o.len <= c && (lt(s, 0, o.ins), r && ae(r, s, o.text), a = o.i), o.forward(c), h -= c;
      }
      l.next();
    } else if (o.ins >= 0) {
      let h = 0, c = o.len;
      for (; c; )
        if (l.ins == -1) {
          let f = Math.min(c, l.len);
          h += f, c -= f, l.forward(f);
        } else if (l.ins == 0 && l.len < c)
          c -= l.len, l.next();
        else
          break;
      lt(s, h, a < o.i ? o.ins : 0), r && a < o.i && ae(r, s, o.text), a = o.i, o.forward(o.len - c);
    } else {
      if (o.done && l.done)
        return r ? Q.createSet(s, r) : Xt.create(s);
      throw new Error("Mismatched change set lengths");
    }
  }
}
function Yl(n, t, e = !1) {
  let i = [], s = e ? [] : null, r = new Oi(n), o = new Oi(t);
  for (let l = !1; ; ) {
    if (r.done && o.done)
      return s ? Q.createSet(i, s) : Xt.create(i);
    if (r.ins == 0)
      lt(i, r.len, 0, l), r.next();
    else if (o.len == 0 && !o.done)
      lt(i, 0, o.ins, l), s && ae(s, i, o.text), o.next();
    else {
      if (r.done || o.done)
        throw new Error("Mismatched change set lengths");
      {
        let a = Math.min(r.len2, o.len), h = i.length;
        if (r.ins == -1) {
          let c = o.ins == -1 ? -1 : o.off ? 0 : o.ins;
          lt(i, a, c, l), s && c && ae(s, i, o.text);
        } else o.ins == -1 ? (lt(i, r.off ? 0 : r.len, a, l), s && ae(s, i, r.textBit(a))) : (lt(i, r.off ? 0 : r.len, o.off ? 0 : o.ins, l), s && !o.off && ae(s, i, o.text));
        l = (r.ins > a || o.ins >= 0 && o.len > a) && (l || i.length > h), r.forward2(a), o.forward(a);
      }
    }
  }
}
class Oi {
  constructor(t) {
    this.set = t, this.i = 0, this.next();
  }
  next() {
    let { sections: t } = this.set;
    this.i < t.length ? (this.len = t[this.i++], this.ins = t[this.i++]) : (this.len = 0, this.ins = -2), this.off = 0;
  }
  get done() {
    return this.ins == -2;
  }
  get len2() {
    return this.ins < 0 ? this.len : this.ins;
  }
  get text() {
    let { inserted: t } = this.set, e = this.i - 2 >> 1;
    return e >= t.length ? N.empty : t[e];
  }
  textBit(t) {
    let { inserted: e } = this.set, i = this.i - 2 >> 1;
    return i >= e.length && !t ? N.empty : e[i].slice(this.off, t == null ? void 0 : this.off + t);
  }
  forward(t) {
    t == this.len ? this.next() : (this.len -= t, this.off += t);
  }
  forward2(t) {
    this.ins == -1 ? this.forward(t) : t == this.ins ? this.next() : (this.ins -= t, this.off += t);
  }
}
class Me {
  constructor(t, e, i) {
    this.from = t, this.to = e, this.flags = i;
  }
  /**
  The anchor of the range—the side that doesn't move when you
  extend it.
  */
  get anchor() {
    return this.flags & 32 ? this.to : this.from;
  }
  /**
  The head of the range, which is moved when the range is
  [extended](https://codemirror.net/6/docs/ref/#state.SelectionRange.extend).
  */
  get head() {
    return this.flags & 32 ? this.from : this.to;
  }
  /**
  True when `anchor` and `head` are at the same position.
  */
  get empty() {
    return this.from == this.to;
  }
  /**
  If this is a cursor that is explicitly associated with the
  character on one of its sides, this returns the side. -1 means
  the character before its position, 1 the character after, and 0
  means no association.
  */
  get assoc() {
    return this.flags & 8 ? -1 : this.flags & 16 ? 1 : 0;
  }
  /**
  The bidirectional text level associated with this cursor, if
  any.
  */
  get bidiLevel() {
    let t = this.flags & 7;
    return t == 7 ? null : t;
  }
  /**
  The goal column (stored vertical offset) associated with a
  cursor. This is used to preserve the vertical position when
  [moving](https://codemirror.net/6/docs/ref/#view.EditorView.moveVertically) across
  lines of different length.
  */
  get goalColumn() {
    let t = this.flags >> 6;
    return t == 16777215 ? void 0 : t;
  }
  /**
  Map this range through a change, producing a valid range in the
  updated document.
  */
  map(t, e = -1) {
    let i, s;
    return this.empty ? i = s = t.mapPos(this.from, e) : (i = t.mapPos(this.from, 1), s = t.mapPos(this.to, -1)), i == this.from && s == this.to ? this : new Me(i, s, this.flags);
  }
  /**
  Extend this range to cover at least `from` to `to`.
  */
  extend(t, e = t, i = 0) {
    if (t <= this.anchor && e >= this.anchor)
      return y.range(t, e, void 0, void 0, i);
    let s = Math.abs(t - this.anchor) > Math.abs(e - this.anchor) ? t : e;
    return y.range(this.anchor, s, void 0, void 0, i);
  }
  /**
  Compare this range to another range.
  */
  eq(t, e = !1) {
    return this.anchor == t.anchor && this.head == t.head && this.goalColumn == t.goalColumn && (!e || !this.empty || this.assoc == t.assoc);
  }
  /**
  Return a JSON-serializable object representing the range.
  */
  toJSON() {
    return { anchor: this.anchor, head: this.head };
  }
  /**
  Convert a JSON representation of a range to a `SelectionRange`
  instance.
  */
  static fromJSON(t) {
    if (!t || typeof t.anchor != "number" || typeof t.head != "number")
      throw new RangeError("Invalid JSON representation for SelectionRange");
    return y.range(t.anchor, t.head);
  }
  /**
  @internal
  */
  static create(t, e, i) {
    return new Me(t, e, i);
  }
}
class y {
  constructor(t, e) {
    this.ranges = t, this.mainIndex = e;
  }
  /**
  Map a selection through a change. Used to adjust the selection
  position for changes.
  */
  map(t, e = -1) {
    return t.empty ? this : y.create(this.ranges.map((i) => i.map(t, e)), this.mainIndex);
  }
  /**
  Compare this selection to another selection. By default, ranges
  are compared only by position. When `includeAssoc` is true,
  cursor ranges must also have the same
  [`assoc`](https://codemirror.net/6/docs/ref/#state.SelectionRange.assoc) value.
  */
  eq(t, e = !1) {
    if (this.ranges.length != t.ranges.length || this.mainIndex != t.mainIndex)
      return !1;
    for (let i = 0; i < this.ranges.length; i++)
      if (!this.ranges[i].eq(t.ranges[i], e))
        return !1;
    return !0;
  }
  /**
  Get the primary selection range. Usually, you should make sure
  your code applies to _all_ ranges, by using methods like
  [`changeByRange`](https://codemirror.net/6/docs/ref/#state.EditorState.changeByRange).
  */
  get main() {
    return this.ranges[this.mainIndex];
  }
  /**
  Make sure the selection only has one range. Returns a selection
  holding only the main range from this selection.
  */
  asSingle() {
    return this.ranges.length == 1 ? this : new y([this.main], 0);
  }
  /**
  Extend this selection with an extra range.
  */
  addRange(t, e = !0) {
    return y.create([t].concat(this.ranges), e ? 0 : this.mainIndex + 1);
  }
  /**
  Replace a given range with another range, and then normalize the
  selection to merge and sort ranges if necessary.
  */
  replaceRange(t, e = this.mainIndex) {
    let i = this.ranges.slice();
    return i[e] = t, y.create(i, this.mainIndex);
  }
  /**
  Convert this selection to an object that can be serialized to
  JSON.
  */
  toJSON() {
    return { ranges: this.ranges.map((t) => t.toJSON()), main: this.mainIndex };
  }
  /**
  Create a selection from a JSON representation.
  */
  static fromJSON(t) {
    if (!t || !Array.isArray(t.ranges) || typeof t.main != "number" || t.main >= t.ranges.length)
      throw new RangeError("Invalid JSON representation for EditorSelection");
    return new y(t.ranges.map((e) => Me.fromJSON(e)), t.main);
  }
  /**
  Create a selection holding a single range.
  */
  static single(t, e = t) {
    return new y([y.range(t, e)], 0);
  }
  /**
  Sort and merge the given set of ranges, creating a valid
  selection.
  */
  static create(t, e = 0) {
    if (t.length == 0)
      throw new RangeError("A selection needs at least one range");
    for (let i = 0, s = 0; s < t.length; s++) {
      let r = t[s];
      if (r.empty ? r.from <= i : r.from < i)
        return y.normalized(t.slice(), e);
      i = r.to;
    }
    return new y(t, e);
  }
  /**
  Create a cursor selection range at the given position. You can
  safely ignore the optional arguments in most situations.
  */
  static cursor(t, e = 0, i, s) {
    return Me.create(t, t, (e == 0 ? 0 : e < 0 ? 8 : 16) | (i == null ? 7 : Math.min(6, i)) | (s ?? 16777215) << 6);
  }
  /**
  Create a selection range.
  */
  static range(t, e, i, s, r) {
    let o = (i ?? 16777215) << 6 | (s == null ? 7 : Math.min(6, s));
    return !r && t != e && (r = e < t ? 1 : -1), e < t ? Me.create(e, t, 48 | o) : Me.create(t, e, (r ? r < 0 ? 8 : 16 : 0) | o);
  }
  /**
  @internal
  */
  static normalized(t, e = 0) {
    let i = t[e];
    t.sort((s, r) => s.from - r.from), e = t.indexOf(i);
    for (let s = 1; s < t.length; s++) {
      let r = t[s], o = t[s - 1];
      if (r.empty ? r.from <= o.to : r.from < o.to) {
        let l = o.from, a = Math.max(r.to, o.to);
        s <= e && e--, t.splice(--s, 2, r.anchor > r.head ? y.range(a, l) : y.range(l, a));
      }
    }
    return new y(t, e);
  }
}
function Xl(n, t) {
  for (let e of n.ranges)
    if (e.to > t)
      throw new RangeError("Selection points outside of document");
}
let Ar = 0;
class M {
  constructor(t, e, i, s, r) {
    this.combine = t, this.compareInput = e, this.compare = i, this.isStatic = s, this.id = Ar++, this.default = t([]), this.extensions = typeof r == "function" ? r(this) : r;
  }
  /**
  Returns a facet reader for this facet, which can be used to
  [read](https://codemirror.net/6/docs/ref/#state.EditorState.facet) it but not to define values for it.
  */
  get reader() {
    return this;
  }
  /**
  Define a new facet.
  */
  static define(t = {}) {
    return new M(t.combine || ((e) => e), t.compareInput || ((e, i) => e === i), t.compare || (t.combine ? (e, i) => e === i : Cr), !!t.static, t.enables);
  }
  /**
  Returns an extension that adds the given value to this facet.
  */
  of(t) {
    return new yn([], this, 0, t);
  }
  /**
  Create an extension that computes a value for the facet from a
  state. You must take care to declare the parts of the state that
  this value depends on, since your function is only called again
  for a new state when one of those parts changed.
  
  In cases where your value depends only on a single field, you'll
  want to use the [`from`](https://codemirror.net/6/docs/ref/#state.Facet.from) method instead.
  */
  compute(t, e) {
    if (this.isStatic)
      throw new Error("Can't compute a static facet");
    return new yn(t, this, 1, e);
  }
  /**
  Create an extension that computes zero or more values for this
  facet from a state.
  */
  computeN(t, e) {
    if (this.isStatic)
      throw new Error("Can't compute a static facet");
    return new yn(t, this, 2, e);
  }
  from(t, e) {
    return e || (e = (i) => i), this.compute([t], (i) => e(i.field(t)));
  }
}
function Cr(n, t) {
  return n == t || n.length == t.length && n.every((e, i) => e === t[i]);
}
class yn {
  constructor(t, e, i, s) {
    this.dependencies = t, this.facet = e, this.type = i, this.value = s, this.id = Ar++;
  }
  dynamicSlot(t) {
    var e;
    let i = this.value, s = this.facet.compareInput, r = this.id, o = t[r] >> 1, l = this.type == 2, a = !1, h = !1, c = [];
    for (let f of this.dependencies)
      f == "doc" ? a = !0 : f == "selection" ? h = !0 : (((e = t[f.id]) !== null && e !== void 0 ? e : 1) & 1) == 0 && c.push(t[f.id]);
    return {
      create(f) {
        return f.values[o] = i(f), 1;
      },
      update(f, u) {
        if (a && u.docChanged || h && (u.docChanged || u.selection) || $s(f, c)) {
          let d = i(f);
          if (l ? !mo(d, f.values[o], s) : !s(d, f.values[o]))
            return f.values[o] = d, 1;
        }
        return 0;
      },
      reconfigure: (f, u) => {
        let d, p = u.config.address[r];
        if (p != null) {
          let g = Mn(u, p);
          if (this.dependencies.every((m) => m instanceof M ? u.facet(m) === f.facet(m) : m instanceof St ? u.field(m, !1) == f.field(m, !1) : !0) || (l ? mo(d = i(f), g, s) : s(d = i(f), g)))
            return f.values[o] = g, 0;
        } else
          d = i(f);
        return f.values[o] = d, 1;
      }
    };
  }
}
function mo(n, t, e) {
  if (n.length != t.length)
    return !1;
  for (let i = 0; i < n.length; i++)
    if (!e(n[i], t[i]))
      return !1;
  return !0;
}
function $s(n, t) {
  let e = !1;
  for (let i of t)
    vi(n, i) & 1 && (e = !0);
  return e;
}
function Jc(n, t, e) {
  let i = e.map((a) => n[a.id]), s = e.map((a) => a.type), r = i.filter((a) => !(a & 1)), o = n[t.id] >> 1;
  function l(a) {
    let h = [];
    for (let c = 0; c < i.length; c++) {
      let f = Mn(a, i[c]);
      if (s[c] == 2)
        for (let u of f)
          h.push(u);
      else
        h.push(f);
    }
    return t.combine(h);
  }
  return {
    create(a) {
      for (let h of i)
        vi(a, h);
      return a.values[o] = l(a), 1;
    },
    update(a, h) {
      if (!$s(a, r))
        return 0;
      let c = l(a);
      return t.compare(c, a.values[o]) ? 0 : (a.values[o] = c, 1);
    },
    reconfigure(a, h) {
      let c = $s(a, i), f = h.config.facets[t.id], u = h.facet(t);
      if (f && !c && Cr(e, f))
        return a.values[o] = u, 0;
      let d = l(a);
      return t.compare(d, u) ? (a.values[o] = u, 0) : (a.values[o] = d, 1);
    }
  };
}
const Yi = /* @__PURE__ */ M.define({ static: !0 });
class St {
  constructor(t, e, i, s, r) {
    this.id = t, this.createF = e, this.updateF = i, this.compareF = s, this.spec = r, this.provides = void 0;
  }
  /**
  Define a state field.
  */
  static define(t) {
    let e = new St(Ar++, t.create, t.update, t.compare || ((i, s) => i === s), t);
    return t.provide && (e.provides = t.provide(e)), e;
  }
  create(t) {
    let e = t.facet(Yi).find((i) => i.field == this);
    return (e?.create || this.createF)(t);
  }
  /**
  @internal
  */
  slot(t) {
    let e = t[this.id] >> 1;
    return {
      create: (i) => (i.values[e] = this.create(i), 1),
      update: (i, s) => {
        let r = i.values[e], o = this.updateF(r, s);
        return this.compareF(r, o) ? 0 : (i.values[e] = o, 1);
      },
      reconfigure: (i, s) => {
        let r = i.facet(Yi), o = s.facet(Yi), l;
        return (l = r.find((a) => a.field == this)) && l != o.find((a) => a.field == this) ? (i.values[e] = l.create(i), 1) : s.config.address[this.id] != null ? (i.values[e] = s.field(this), 0) : (i.values[e] = this.create(i), 1);
      }
    };
  }
  /**
  Returns an extension that enables this field and overrides the
  way it is initialized. Can be useful when you need to provide a
  non-default starting value for the field.
  */
  init(t) {
    return [this, Yi.of({ field: this, create: t })];
  }
  /**
  State field instances can be used as
  [`Extension`](https://codemirror.net/6/docs/ref/#state.Extension) values to enable the field in a
  given state.
  */
  get extension() {
    return this;
  }
}
const Ae = { lowest: 4, low: 3, default: 2, high: 1, highest: 0 };
function hi(n) {
  return (t) => new Zl(t, n);
}
const _n = {
  /**
  The highest precedence level, for extensions that should end up
  near the start of the precedence ordering.
  */
  highest: /* @__PURE__ */ hi(Ae.highest),
  /**
  A higher-than-default precedence, for extensions that should
  come before those with default precedence.
  */
  high: /* @__PURE__ */ hi(Ae.high),
  /**
  The default precedence, which is also used for extensions
  without an explicit precedence.
  */
  default: /* @__PURE__ */ hi(Ae.default),
  /**
  A lower-than-default precedence.
  */
  low: /* @__PURE__ */ hi(Ae.low),
  /**
  The lowest precedence level. Meant for things that should end up
  near the end of the extension order.
  */
  lowest: /* @__PURE__ */ hi(Ae.lowest)
};
class Zl {
  constructor(t, e) {
    this.inner = t, this.prec = e;
  }
}
class Ye {
  /**
  Create an instance of this compartment to add to your [state
  configuration](https://codemirror.net/6/docs/ref/#state.EditorStateConfig.extensions).
  */
  of(t) {
    return new Hs(this, t);
  }
  /**
  Create an [effect](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) that
  reconfigures this compartment.
  */
  reconfigure(t) {
    return Ye.reconfigure.of({ compartment: this, extension: t });
  }
  /**
  Get the current content of the compartment in the state, or
  `undefined` if it isn't present.
  */
  get(t) {
    return t.config.compartments.get(this);
  }
}
class Hs {
  constructor(t, e) {
    this.compartment = t, this.inner = e;
  }
}
class Cn {
  constructor(t, e, i, s, r, o) {
    for (this.base = t, this.compartments = e, this.dynamicSlots = i, this.address = s, this.staticValues = r, this.facets = o, this.statusTemplate = []; this.statusTemplate.length < i.length; )
      this.statusTemplate.push(
        0
        /* SlotStatus.Unresolved */
      );
  }
  staticFacet(t) {
    let e = this.address[t.id];
    return e == null ? t.default : this.staticValues[e >> 1];
  }
  static resolve(t, e, i) {
    let s = [], r = /* @__PURE__ */ Object.create(null), o = /* @__PURE__ */ new Map();
    for (let u of Yc(t, e, o))
      u instanceof St ? s.push(u) : (r[u.facet.id] || (r[u.facet.id] = [])).push(u);
    let l = /* @__PURE__ */ Object.create(null), a = [], h = [];
    for (let u of s)
      l[u.id] = h.length << 1, h.push((d) => u.slot(d));
    let c = i?.config.facets;
    for (let u in r) {
      let d = r[u], p = d[0].facet, g = c && c[u] || [];
      if (d.every(
        (m) => m.type == 0
        /* Provider.Static */
      ))
        if (l[p.id] = a.length << 1 | 1, Cr(g, d))
          a.push(i.facet(p));
        else {
          let m = p.combine(d.map((b) => b.value));
          a.push(i && p.compare(m, i.facet(p)) ? i.facet(p) : m);
        }
      else {
        for (let m of d)
          m.type == 0 ? (l[m.id] = a.length << 1 | 1, a.push(m.value)) : (l[m.id] = h.length << 1, h.push((b) => m.dynamicSlot(b)));
        l[p.id] = h.length << 1, h.push((m) => Jc(m, p, d));
      }
    }
    let f = h.map((u) => u(l));
    return new Cn(t, o, f, l, a, r);
  }
}
function Yc(n, t, e) {
  let i = [[], [], [], [], []], s = /* @__PURE__ */ new Map();
  function r(o, l) {
    let a = s.get(o);
    if (a != null) {
      if (a <= l)
        return;
      let h = i[a].indexOf(o);
      h > -1 && i[a].splice(h, 1), o instanceof Hs && e.delete(o.compartment);
    }
    if (s.set(o, l), Array.isArray(o))
      for (let h of o)
        r(h, l);
    else if (o instanceof Hs) {
      if (e.has(o.compartment))
        throw new RangeError("Duplicate use of compartment in extensions");
      let h = t.get(o.compartment) || o.inner;
      e.set(o.compartment, h), r(h, l);
    } else if (o instanceof Zl)
      r(o.inner, o.prec);
    else if (o instanceof St)
      i[l].push(o), o.provides && r(o.provides, l);
    else if (o instanceof yn)
      i[l].push(o), o.facet.extensions && r(o.facet.extensions, Ae.default);
    else {
      let h = o.extension;
      if (!h)
        throw new Error(`Unrecognized extension value in extension set (${o}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`);
      r(h, l);
    }
  }
  return r(n, Ae.default), i.reduce((o, l) => o.concat(l));
}
function vi(n, t) {
  if (t & 1)
    return 2;
  let e = t >> 1, i = n.status[e];
  if (i == 4)
    throw new Error("Cyclic dependency between fields and/or facets");
  if (i & 2)
    return i;
  n.status[e] = 4;
  let s = n.computeSlot(n, n.config.dynamicSlots[e]);
  return n.status[e] = 2 | s;
}
function Mn(n, t) {
  return t & 1 ? n.config.staticValues[t >> 1] : n.values[t >> 1];
}
const Ql = /* @__PURE__ */ M.define(), Vs = /* @__PURE__ */ M.define({
  combine: (n) => n.some((t) => t),
  static: !0
}), ta = /* @__PURE__ */ M.define({
  combine: (n) => n.length ? n[0] : void 0,
  static: !0
}), ea = /* @__PURE__ */ M.define(), ia = /* @__PURE__ */ M.define(), na = /* @__PURE__ */ M.define(), sa = /* @__PURE__ */ M.define({
  combine: (n) => n.length ? n[0] : !1
});
class me {
  /**
  @internal
  */
  constructor(t, e) {
    this.type = t, this.value = e;
  }
  /**
  Define a new type of annotation.
  */
  static define() {
    return new Xc();
  }
}
class Xc {
  /**
  Create an instance of this annotation.
  */
  of(t) {
    return new me(this, t);
  }
}
class Zc {
  /**
  @internal
  */
  constructor(t) {
    this.map = t;
  }
  /**
  Create a [state effect](https://codemirror.net/6/docs/ref/#state.StateEffect) instance of this
  type.
  */
  of(t) {
    return new F(this, t);
  }
}
class F {
  /**
  @internal
  */
  constructor(t, e) {
    this.type = t, this.value = e;
  }
  /**
  Map this effect through a position mapping. Will return
  `undefined` when that ends up deleting the effect.
  */
  map(t) {
    let e = this.type.map(this.value, t);
    return e === void 0 ? void 0 : e == this.value ? this : new F(this.type, e);
  }
  /**
  Tells you whether this effect object is of a given
  [type](https://codemirror.net/6/docs/ref/#state.StateEffectType).
  */
  is(t) {
    return this.type == t;
  }
  /**
  Define a new effect type. The type parameter indicates the type
  of values that his effect holds. It should be a type that
  doesn't include `undefined`, since that is used in
  [mapping](https://codemirror.net/6/docs/ref/#state.StateEffect.map) to indicate that an effect is
  removed.
  */
  static define(t = {}) {
    return new Zc(t.map || ((e) => e));
  }
  /**
  Map an array of effects through a change set.
  */
  static mapEffects(t, e) {
    if (!t.length)
      return t;
    let i = [];
    for (let s of t) {
      let r = s.map(e);
      r && i.push(r);
    }
    return i;
  }
}
F.reconfigure = /* @__PURE__ */ F.define();
F.appendConfig = /* @__PURE__ */ F.define();
class tt {
  constructor(t, e, i, s, r, o) {
    this.startState = t, this.changes = e, this.selection = i, this.effects = s, this.annotations = r, this.scrollIntoView = o, this._doc = null, this._state = null, i && Xl(i, e.newLength), r.some((l) => l.type == tt.time) || (this.annotations = r.concat(tt.time.of(Date.now())));
  }
  /**
  @internal
  */
  static create(t, e, i, s, r, o) {
    return new tt(t, e, i, s, r, o);
  }
  /**
  The new document produced by the transaction. Contrary to
  [`.state`](https://codemirror.net/6/docs/ref/#state.Transaction.state)`.doc`, accessing this won't
  force the entire new state to be computed right away, so it is
  recommended that [transaction
  filters](https://codemirror.net/6/docs/ref/#state.EditorState^transactionFilter) use this getter
  when they need to look at the new document.
  */
  get newDoc() {
    return this._doc || (this._doc = this.changes.apply(this.startState.doc));
  }
  /**
  The new selection produced by the transaction. If
  [`this.selection`](https://codemirror.net/6/docs/ref/#state.Transaction.selection) is undefined,
  this will [map](https://codemirror.net/6/docs/ref/#state.EditorSelection.map) the start state's
  current selection through the changes made by the transaction.
  */
  get newSelection() {
    return this.selection || this.startState.selection.map(this.changes);
  }
  /**
  The new state created by the transaction. Computed on demand
  (but retained for subsequent access), so it is recommended not to
  access it in [transaction
  filters](https://codemirror.net/6/docs/ref/#state.EditorState^transactionFilter) when possible.
  */
  get state() {
    return this._state || this.startState.applyTransaction(this), this._state;
  }
  /**
  Get the value of the given annotation type, if any.
  */
  annotation(t) {
    for (let e of this.annotations)
      if (e.type == t)
        return e.value;
  }
  /**
  Indicates whether the transaction changed the document.
  */
  get docChanged() {
    return !this.changes.empty;
  }
  /**
  Indicates whether this transaction reconfigures the state
  (through a [configuration compartment](https://codemirror.net/6/docs/ref/#state.Compartment) or
  with a top-level configuration
  [effect](https://codemirror.net/6/docs/ref/#state.StateEffect^reconfigure).
  */
  get reconfigured() {
    return this.startState.config != this.state.config;
  }
  /**
  Returns true if the transaction has a [user
  event](https://codemirror.net/6/docs/ref/#state.Transaction^userEvent) annotation that is equal to
  or more specific than `event`. For example, if the transaction
  has `"select.pointer"` as user event, `"select"` and
  `"select.pointer"` will match it.
  */
  isUserEvent(t) {
    let e = this.annotation(tt.userEvent);
    return !!(e && (e == t || e.length > t.length && e.slice(0, t.length) == t && e[t.length] == "."));
  }
}
tt.time = /* @__PURE__ */ me.define();
tt.userEvent = /* @__PURE__ */ me.define();
tt.addToHistory = /* @__PURE__ */ me.define();
tt.remote = /* @__PURE__ */ me.define();
function Qc(n, t) {
  let e = [];
  for (let i = 0, s = 0; ; ) {
    let r, o;
    if (i < n.length && (s == t.length || t[s] >= n[i]))
      r = n[i++], o = n[i++];
    else if (s < t.length)
      r = t[s++], o = t[s++];
    else
      return e;
    !e.length || e[e.length - 1] < r ? e.push(r, o) : e[e.length - 1] < o && (e[e.length - 1] = o);
  }
}
function ra(n, t, e) {
  var i;
  let s, r, o;
  return e ? (s = t.changes, r = Q.empty(t.changes.length), o = n.changes.compose(t.changes)) : (s = t.changes.map(n.changes), r = n.changes.mapDesc(t.changes, !0), o = n.changes.compose(s)), {
    changes: o,
    selection: t.selection ? t.selection.map(r) : (i = n.selection) === null || i === void 0 ? void 0 : i.map(s),
    effects: F.mapEffects(n.effects, s).concat(F.mapEffects(t.effects, r)),
    annotations: n.annotations.length ? n.annotations.concat(t.annotations) : t.annotations,
    scrollIntoView: n.scrollIntoView || t.scrollIntoView
  };
}
function Fs(n, t, e) {
  let i = t.selection, s = je(t.annotations);
  return t.userEvent && (s = s.concat(tt.userEvent.of(t.userEvent))), {
    changes: t.changes instanceof Q ? t.changes : Q.of(t.changes || [], e, n.facet(ta)),
    selection: i && (i instanceof y ? i : y.single(i.anchor, i.head)),
    effects: je(t.effects),
    annotations: s,
    scrollIntoView: !!t.scrollIntoView
  };
}
function oa(n, t, e) {
  let i = Fs(n, t.length ? t[0] : {}, n.doc.length);
  t.length && t[0].filter === !1 && (e = !1);
  for (let r = 1; r < t.length; r++) {
    t[r].filter === !1 && (e = !1);
    let o = !!t[r].sequential;
    i = ra(i, Fs(n, t[r], o ? i.changes.newLength : n.doc.length), o);
  }
  let s = tt.create(n, i.changes, i.selection, i.effects, i.annotations, i.scrollIntoView);
  return ef(e ? tf(s) : s);
}
function tf(n) {
  let t = n.startState, e = !0;
  for (let s of t.facet(ea)) {
    let r = s(n);
    if (r === !1) {
      e = !1;
      break;
    }
    Array.isArray(r) && (e = e === !0 ? r : Qc(e, r));
  }
  if (e !== !0) {
    let s, r;
    if (e === !1)
      r = n.changes.invertedDesc, s = Q.empty(t.doc.length);
    else {
      let o = n.changes.filter(e);
      s = o.changes, r = o.filtered.mapDesc(o.changes).invertedDesc;
    }
    n = tt.create(t, s, n.selection && n.selection.map(r), F.mapEffects(n.effects, r), n.annotations, n.scrollIntoView);
  }
  let i = t.facet(ia);
  for (let s = i.length - 1; s >= 0; s--) {
    let r = i[s](n);
    r instanceof tt ? n = r : Array.isArray(r) && r.length == 1 && r[0] instanceof tt ? n = r[0] : n = oa(t, je(r), !1);
  }
  return n;
}
function ef(n) {
  let t = n.startState, e = t.facet(na), i = n;
  for (let s = e.length - 1; s >= 0; s--) {
    let r = e[s](n);
    r && Object.keys(r).length && (i = ra(i, Fs(t, r, n.changes.newLength), !0));
  }
  return i == n ? n : tt.create(t, n.changes, n.selection, i.effects, i.annotations, i.scrollIntoView);
}
const nf = [];
function je(n) {
  return n == null ? nf : Array.isArray(n) ? n : [n];
}
var ee = /* @__PURE__ */ (function(n) {
  return n[n.Word = 0] = "Word", n[n.Space = 1] = "Space", n[n.Other = 2] = "Other", n;
})(ee || (ee = {}));
const sf = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
let Ws;
try {
  Ws = /* @__PURE__ */ new RegExp("[\\p{Alphabetic}\\p{Number}_]", "u");
} catch {
}
function rf(n) {
  if (Ws)
    return Ws.test(n);
  for (let t = 0; t < n.length; t++) {
    let e = n[t];
    if (/\w/.test(e) || e > "" && (e.toUpperCase() != e.toLowerCase() || sf.test(e)))
      return !0;
  }
  return !1;
}
function of(n) {
  return (t) => {
    if (!/\S/.test(t))
      return ee.Space;
    if (rf(t))
      return ee.Word;
    for (let e = 0; e < n.length; e++)
      if (t.indexOf(n[e]) > -1)
        return ee.Word;
    return ee.Other;
  };
}
class $ {
  constructor(t, e, i, s, r, o) {
    this.config = t, this.doc = e, this.selection = i, this.values = s, this.status = t.statusTemplate.slice(), this.computeSlot = r, o && (o._state = this);
    for (let l = 0; l < this.config.dynamicSlots.length; l++)
      vi(this, l << 1);
    this.computeSlot = null;
  }
  field(t, e = !0) {
    let i = this.config.address[t.id];
    if (i == null) {
      if (e)
        throw new RangeError("Field is not present in this state");
      return;
    }
    return vi(this, i), Mn(this, i);
  }
  /**
  Create a [transaction](https://codemirror.net/6/docs/ref/#state.Transaction) that updates this
  state. Any number of [transaction specs](https://codemirror.net/6/docs/ref/#state.TransactionSpec)
  can be passed. Unless
  [`sequential`](https://codemirror.net/6/docs/ref/#state.TransactionSpec.sequential) is set, the
  [changes](https://codemirror.net/6/docs/ref/#state.TransactionSpec.changes) (if any) of each spec
  are assumed to start in the _current_ document (not the document
  produced by previous specs), and its
  [selection](https://codemirror.net/6/docs/ref/#state.TransactionSpec.selection) and
  [effects](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) are assumed to refer
  to the document created by its _own_ changes. The resulting
  transaction contains the combined effect of all the different
  specs. For [selection](https://codemirror.net/6/docs/ref/#state.TransactionSpec.selection), later
  specs take precedence over earlier ones.
  */
  update(...t) {
    return oa(this, t, !0);
  }
  /**
  @internal
  */
  applyTransaction(t) {
    let e = this.config, { base: i, compartments: s } = e;
    for (let l of t.effects)
      l.is(Ye.reconfigure) ? (e && (s = /* @__PURE__ */ new Map(), e.compartments.forEach((a, h) => s.set(h, a)), e = null), s.set(l.value.compartment, l.value.extension)) : l.is(F.reconfigure) ? (e = null, i = l.value) : l.is(F.appendConfig) && (e = null, i = je(i).concat(l.value));
    let r;
    e ? r = t.startState.values.slice() : (e = Cn.resolve(i, s, this), r = new $(e, this.doc, this.selection, e.dynamicSlots.map(() => null), (a, h) => h.reconfigure(a, this), null).values);
    let o = t.startState.facet(Vs) ? t.newSelection : t.newSelection.asSingle();
    new $(e, t.newDoc, o, r, (l, a) => a.update(l, t), t);
  }
  /**
  Create a [transaction spec](https://codemirror.net/6/docs/ref/#state.TransactionSpec) that
  replaces every selection range with the given content.
  */
  replaceSelection(t) {
    return typeof t == "string" && (t = this.toText(t)), this.changeByRange((e) => ({
      changes: { from: e.from, to: e.to, insert: t },
      range: y.cursor(e.from + t.length)
    }));
  }
  /**
  Create a set of changes and a new selection by running the given
  function for each range in the active selection. The function
  can return an optional set of changes (in the coordinate space
  of the start document), plus an updated range (in the coordinate
  space of the document produced by the call's own changes). This
  method will merge all the changes and ranges into a single
  changeset and selection, and return it as a [transaction
  spec](https://codemirror.net/6/docs/ref/#state.TransactionSpec), which can be passed to
  [`update`](https://codemirror.net/6/docs/ref/#state.EditorState.update).
  */
  changeByRange(t) {
    let e = this.selection, i = t(e.ranges[0]), s = this.changes(i.changes), r = [i.range], o = je(i.effects);
    for (let l = 1; l < e.ranges.length; l++) {
      let a = t(e.ranges[l]), h = this.changes(a.changes), c = h.map(s);
      for (let u = 0; u < l; u++)
        r[u] = r[u].map(c);
      let f = s.mapDesc(h, !0);
      r.push(a.range.map(f)), s = s.compose(c), o = F.mapEffects(o, c).concat(F.mapEffects(je(a.effects), f));
    }
    return {
      changes: s,
      selection: y.create(r, e.mainIndex),
      effects: o
    };
  }
  /**
  Create a [change set](https://codemirror.net/6/docs/ref/#state.ChangeSet) from the given change
  description, taking the state's document length and line
  separator into account.
  */
  changes(t = []) {
    return t instanceof Q ? t : Q.of(t, this.doc.length, this.facet($.lineSeparator));
  }
  /**
  Using the state's [line
  separator](https://codemirror.net/6/docs/ref/#state.EditorState^lineSeparator), create a
  [`Text`](https://codemirror.net/6/docs/ref/#state.Text) instance from the given string.
  */
  toText(t) {
    return N.of(t.split(this.facet($.lineSeparator) || Ps));
  }
  /**
  Return the given range of the document as a string.
  */
  sliceDoc(t = 0, e = this.doc.length) {
    return this.doc.sliceString(t, e, this.lineBreak);
  }
  /**
  Get the value of a state [facet](https://codemirror.net/6/docs/ref/#state.Facet).
  */
  facet(t) {
    let e = this.config.address[t.id];
    return e == null ? t.default : (vi(this, e), Mn(this, e));
  }
  /**
  Convert this state to a JSON-serializable object. When custom
  fields should be serialized, you can pass them in as an object
  mapping property names (in the resulting object, which should
  not use `doc` or `selection`) to fields.
  */
  toJSON(t) {
    let e = {
      doc: this.sliceDoc(),
      selection: this.selection.toJSON()
    };
    if (t)
      for (let i in t) {
        let s = t[i];
        s instanceof St && this.config.address[s.id] != null && (e[i] = s.spec.toJSON(this.field(t[i]), this));
      }
    return e;
  }
  /**
  Deserialize a state from its JSON representation. When custom
  fields should be deserialized, pass the same object you passed
  to [`toJSON`](https://codemirror.net/6/docs/ref/#state.EditorState.toJSON) when serializing as
  third argument.
  */
  static fromJSON(t, e = {}, i) {
    if (!t || typeof t.doc != "string")
      throw new RangeError("Invalid JSON representation for EditorState");
    let s = [];
    if (i) {
      for (let r in i)
        if (Object.prototype.hasOwnProperty.call(t, r)) {
          let o = i[r], l = t[r];
          s.push(o.init((a) => o.spec.fromJSON(l, a)));
        }
    }
    return $.create({
      doc: t.doc,
      selection: y.fromJSON(t.selection),
      extensions: e.extensions ? s.concat([e.extensions]) : s
    });
  }
  /**
  Create a new state. You'll usually only need this when
  initializing an editor—updated states are created by applying
  transactions.
  */
  static create(t = {}) {
    let e = Cn.resolve(t.extensions || [], /* @__PURE__ */ new Map()), i = t.doc instanceof N ? t.doc : N.of((t.doc || "").split(e.staticFacet($.lineSeparator) || Ps)), s = t.selection ? t.selection instanceof y ? t.selection : y.single(t.selection.anchor, t.selection.head) : y.single(0);
    return Xl(s, i.length), e.staticFacet(Vs) || (s = s.asSingle()), new $(e, i, s, e.dynamicSlots.map(() => null), (r, o) => o.create(r), null);
  }
  /**
  The size (in columns) of a tab in the document, determined by
  the [`tabSize`](https://codemirror.net/6/docs/ref/#state.EditorState^tabSize) facet.
  */
  get tabSize() {
    return this.facet($.tabSize);
  }
  /**
  Get the proper [line-break](https://codemirror.net/6/docs/ref/#state.EditorState^lineSeparator)
  string for this state.
  */
  get lineBreak() {
    return this.facet($.lineSeparator) || `
`;
  }
  /**
  Returns true when the editor is
  [configured](https://codemirror.net/6/docs/ref/#state.EditorState^readOnly) to be read-only.
  */
  get readOnly() {
    return this.facet(sa);
  }
  /**
  Look up a translation for the given phrase (via the
  [`phrases`](https://codemirror.net/6/docs/ref/#state.EditorState^phrases) facet), or return the
  original string if no translation is found.
  
  If additional arguments are passed, they will be inserted in
  place of markers like `$1` (for the first value) and `$2`, etc.
  A single `$` is equivalent to `$1`, and `$$` will produce a
  literal dollar sign.
  */
  phrase(t, ...e) {
    for (let i of this.facet($.phrases))
      if (Object.prototype.hasOwnProperty.call(i, t)) {
        t = i[t];
        break;
      }
    return e.length && (t = t.replace(/\$(\$|\d*)/g, (i, s) => {
      if (s == "$")
        return "$";
      let r = +(s || 1);
      return !r || r > e.length ? i : e[r - 1];
    })), t;
  }
  /**
  Find the values for a given language data field, provided by the
  the [`languageData`](https://codemirror.net/6/docs/ref/#state.EditorState^languageData) facet.
  
  Examples of language data fields are...
  
  - [`"commentTokens"`](https://codemirror.net/6/docs/ref/#commands.CommentTokens) for specifying
    comment syntax.
  - [`"autocomplete"`](https://codemirror.net/6/docs/ref/#autocomplete.autocompletion^config.override)
    for providing language-specific completion sources.
  - [`"wordChars"`](https://codemirror.net/6/docs/ref/#state.EditorState.charCategorizer) for adding
    characters that should be considered part of words in this
    language.
  - [`"closeBrackets"`](https://codemirror.net/6/docs/ref/#autocomplete.CloseBracketConfig) controls
    bracket closing behavior.
  */
  languageDataAt(t, e, i = -1) {
    let s = [];
    for (let r of this.facet(Ql))
      for (let o of r(this, e, i))
        Object.prototype.hasOwnProperty.call(o, t) && s.push(o[t]);
    return s;
  }
  /**
  Return a function that can categorize strings (expected to
  represent a single [grapheme cluster](https://codemirror.net/6/docs/ref/#state.findClusterBreak))
  into one of:
  
   - Word (contains an alphanumeric character or a character
     explicitly listed in the local language's `"wordChars"`
     language data, which should be a string)
   - Space (contains only whitespace)
   - Other (anything else)
  */
  charCategorizer(t) {
    let e = this.languageDataAt("wordChars", t);
    return of(e.length ? e[0] : "");
  }
  /**
  Find the word at the given position, meaning the range
  containing all [word](https://codemirror.net/6/docs/ref/#state.CharCategory.Word) characters
  around it. If no word characters are adjacent to the position,
  this returns null.
  */
  wordAt(t) {
    let { text: e, from: i, length: s } = this.doc.lineAt(t), r = this.charCategorizer(t), o = t - i, l = t - i;
    for (; o > 0; ) {
      let a = at(e, o, !1);
      if (r(e.slice(a, o)) != ee.Word)
        break;
      o = a;
    }
    for (; l < s; ) {
      let a = at(e, l);
      if (r(e.slice(l, a)) != ee.Word)
        break;
      l = a;
    }
    return o == l ? null : y.range(o + i, l + i);
  }
}
$.allowMultipleSelections = Vs;
$.tabSize = /* @__PURE__ */ M.define({
  combine: (n) => n.length ? n[0] : 4
});
$.lineSeparator = ta;
$.readOnly = sa;
$.phrases = /* @__PURE__ */ M.define({
  compare(n, t) {
    let e = Object.keys(n), i = Object.keys(t);
    return e.length == i.length && e.every((s) => n[s] == t[s]);
  }
});
$.languageData = Ql;
$.changeFilter = ea;
$.transactionFilter = ia;
$.transactionExtender = na;
Ye.reconfigure = /* @__PURE__ */ F.define();
function _i(n, t, e = {}) {
  let i = {};
  for (let s of n)
    for (let r of Object.keys(s)) {
      let o = s[r], l = i[r];
      if (l === void 0)
        i[r] = o;
      else if (!(l === o || o === void 0)) if (Object.hasOwnProperty.call(e, r))
        i[r] = e[r](l, o);
      else
        throw new Error("Config merge conflict for field " + r);
    }
  for (let s in t)
    i[s] === void 0 && (i[s] = t[s]);
  return i;
}
class Le {
  /**
  Compare this value with another value. Used when comparing
  rangesets. The default implementation compares by identity.
  Unless you are only creating a fixed number of unique instances
  of your value type, it is a good idea to implement this
  properly.
  */
  eq(t) {
    return this == t;
  }
  /**
  Create a [range](https://codemirror.net/6/docs/ref/#state.Range) with this value.
  */
  range(t, e = t) {
    return _s.create(t, e, this);
  }
}
Le.prototype.startSide = Le.prototype.endSide = 0;
Le.prototype.point = !1;
Le.prototype.mapMode = pt.TrackDel;
function Mr(n, t) {
  return n == t || n.constructor == t.constructor && n.eq(t);
}
let _s = class la {
  constructor(t, e, i) {
    this.from = t, this.to = e, this.value = i;
  }
  /**
  @internal
  */
  static create(t, e, i) {
    return new la(t, e, i);
  }
};
function zs(n, t) {
  return n.from - t.from || n.value.startSide - t.value.startSide;
}
class Tr {
  constructor(t, e, i, s) {
    this.from = t, this.to = e, this.value = i, this.maxPoint = s;
  }
  get length() {
    return this.to[this.to.length - 1];
  }
  // Find the index of the given position and side. Use the ranges'
  // `from` pos when `end == false`, `to` when `end == true`.
  findIndex(t, e, i, s = 0) {
    let r = i ? this.to : this.from;
    for (let o = s, l = r.length; ; ) {
      if (o == l)
        return o;
      let a = o + l >> 1, h = r[a] - t || (i ? this.value[a].endSide : this.value[a].startSide) - e;
      if (a == o)
        return h >= 0 ? o : l;
      h >= 0 ? l = a : o = a + 1;
    }
  }
  between(t, e, i, s) {
    for (let r = this.findIndex(e, -1e9, !0), o = this.findIndex(i, 1e9, !1, r); r < o; r++)
      if (s(this.from[r] + t, this.to[r] + t, this.value[r]) === !1)
        return !1;
  }
  map(t, e) {
    let i = [], s = [], r = [], o = -1, l = -1;
    for (let a = 0; a < this.value.length; a++) {
      let h = this.value[a], c = this.from[a] + t, f = this.to[a] + t, u, d;
      if (c == f) {
        let p = e.mapPos(c, h.startSide, h.mapMode);
        if (p == null || (u = d = p, h.startSide != h.endSide && (d = e.mapPos(c, h.endSide), d < u)))
          continue;
      } else if (u = e.mapPos(c, h.startSide), d = e.mapPos(f, h.endSide), u > d || u == d && h.startSide > 0 && h.endSide <= 0)
        continue;
      (d - u || h.endSide - h.startSide) < 0 || (o < 0 && (o = u), h.point && (l = Math.max(l, d - u)), i.push(h), s.push(u - o), r.push(d - o));
    }
    return { mapped: i.length ? new Tr(s, r, i, l) : null, pos: o };
  }
}
class B {
  constructor(t, e, i, s) {
    this.chunkPos = t, this.chunk = e, this.nextLayer = i, this.maxPoint = s;
  }
  /**
  @internal
  */
  static create(t, e, i, s) {
    return new B(t, e, i, s);
  }
  /**
  @internal
  */
  get length() {
    let t = this.chunk.length - 1;
    return t < 0 ? 0 : Math.max(this.chunkEnd(t), this.nextLayer.length);
  }
  /**
  The number of ranges in the set.
  */
  get size() {
    if (this.isEmpty)
      return 0;
    let t = this.nextLayer.size;
    for (let e of this.chunk)
      t += e.value.length;
    return t;
  }
  /**
  @internal
  */
  chunkEnd(t) {
    return this.chunkPos[t] + this.chunk[t].length;
  }
  /**
  Update the range set, optionally adding new ranges or filtering
  out existing ones.
  
  (Note: The type parameter is just there as a kludge to work
  around TypeScript variance issues that prevented `RangeSet<X>`
  from being a subtype of `RangeSet<Y>` when `X` is a subtype of
  `Y`.)
  */
  update(t) {
    let { add: e = [], sort: i = !1, filterFrom: s = 0, filterTo: r = this.length } = t, o = t.filter;
    if (e.length == 0 && !o)
      return this;
    if (i && (e = e.slice().sort(zs)), this.isEmpty)
      return e.length ? B.of(e) : this;
    let l = new aa(this, null, -1).goto(0), a = 0, h = [], c = new Xe();
    for (; l.value || a < e.length; )
      if (a < e.length && (l.from - e[a].from || l.startSide - e[a].value.startSide) >= 0) {
        let f = e[a++];
        c.addInner(f.from, f.to, f.value) || h.push(f);
      } else l.rangeIndex == 1 && l.chunkIndex < this.chunk.length && (a == e.length || this.chunkEnd(l.chunkIndex) < e[a].from) && (!o || s > this.chunkEnd(l.chunkIndex) || r < this.chunkPos[l.chunkIndex]) && c.addChunk(this.chunkPos[l.chunkIndex], this.chunk[l.chunkIndex]) ? l.nextChunk() : ((!o || s > l.to || r < l.from || o(l.from, l.to, l.value)) && (c.addInner(l.from, l.to, l.value) || h.push(_s.create(l.from, l.to, l.value))), l.next());
    return c.finishInner(this.nextLayer.isEmpty && !h.length ? B.empty : this.nextLayer.update({ add: h, filter: o, filterFrom: s, filterTo: r }));
  }
  /**
  Map this range set through a set of changes, return the new set.
  */
  map(t) {
    if (t.empty || this.isEmpty)
      return this;
    let e = [], i = [], s = -1;
    for (let o = 0; o < this.chunk.length; o++) {
      let l = this.chunkPos[o], a = this.chunk[o], h = t.touchesRange(l, l + a.length);
      if (h === !1)
        s = Math.max(s, a.maxPoint), e.push(a), i.push(t.mapPos(l));
      else if (h === !0) {
        let { mapped: c, pos: f } = a.map(l, t);
        c && (s = Math.max(s, c.maxPoint), e.push(c), i.push(f));
      }
    }
    let r = this.nextLayer.map(t);
    return e.length == 0 ? r : new B(i, e, r || B.empty, s);
  }
  /**
  Iterate over the ranges that touch the region `from` to `to`,
  calling `f` for each. There is no guarantee that the ranges will
  be reported in any specific order. When the callback returns
  `false`, iteration stops.
  */
  between(t, e, i) {
    if (!this.isEmpty) {
      for (let s = 0; s < this.chunk.length; s++) {
        let r = this.chunkPos[s], o = this.chunk[s];
        if (e >= r && t <= r + o.length && o.between(r, t - r, e - r, i) === !1)
          return;
      }
      this.nextLayer.between(t, e, i);
    }
  }
  /**
  Iterate over the ranges in this set, in order, including all
  ranges that end at or after `from`.
  */
  iter(t = 0) {
    return Ei.from([this]).goto(t);
  }
  /**
  @internal
  */
  get isEmpty() {
    return this.nextLayer == this;
  }
  /**
  Iterate over the ranges in a collection of sets, in order,
  starting from `from`.
  */
  static iter(t, e = 0) {
    return Ei.from(t).goto(e);
  }
  /**
  Iterate over two groups of sets, calling methods on `comparator`
  to notify it of possible differences.
  */
  static compare(t, e, i, s, r = -1) {
    let o = t.filter((f) => f.maxPoint > 0 || !f.isEmpty && f.maxPoint >= r), l = e.filter((f) => f.maxPoint > 0 || !f.isEmpty && f.maxPoint >= r), a = bo(o, l, i), h = new ci(o, a, r), c = new ci(l, a, r);
    i.iterGaps((f, u, d) => yo(h, f, c, u, d, s)), i.empty && i.length == 0 && yo(h, 0, c, 0, 0, s);
  }
  /**
  Compare the contents of two groups of range sets, returning true
  if they are equivalent in the given range.
  */
  static eq(t, e, i = 0, s) {
    s == null && (s = 999999999);
    let r = t.filter((c) => !c.isEmpty && e.indexOf(c) < 0), o = e.filter((c) => !c.isEmpty && t.indexOf(c) < 0);
    if (r.length != o.length)
      return !1;
    if (!r.length)
      return !0;
    let l = bo(r, o), a = new ci(r, l, 0).goto(i), h = new ci(o, l, 0).goto(i);
    for (; ; ) {
      if (a.to != h.to || !Us(a.active, h.active) || a.point && (!h.point || !Mr(a.point, h.point)))
        return !1;
      if (a.to > s)
        return !0;
      a.next(), h.next();
    }
  }
  /**
  Iterate over a group of range sets at the same time, notifying
  the iterator about the ranges covering every given piece of
  content. Returns the open count (see
  [`SpanIterator.span`](https://codemirror.net/6/docs/ref/#state.SpanIterator.span)) at the end
  of the iteration.
  */
  static spans(t, e, i, s, r = -1) {
    let o = new ci(t, null, r).goto(e), l = e, a = o.openStart;
    for (; ; ) {
      let h = Math.min(o.to, i);
      if (o.point) {
        let c = o.activeForPoint(o.to), f = o.pointFrom < e ? c.length + 1 : o.point.startSide < 0 ? c.length : Math.min(c.length, a);
        s.point(l, h, o.point, c, f, o.pointRank), a = Math.min(o.openEnd(h), c.length);
      } else h > l && (s.span(l, h, o.active, a), a = o.openEnd(h));
      if (o.to > i)
        return a + (o.point && o.to > i ? 1 : 0);
      l = o.to, o.next();
    }
  }
  /**
  Create a range set for the given range or array of ranges. By
  default, this expects the ranges to be _sorted_ (by start
  position and, if two start at the same position,
  `value.startSide`). You can pass `true` as second argument to
  cause the method to sort them.
  */
  static of(t, e = !1) {
    let i = new Xe();
    for (let s of t instanceof _s ? [t] : e ? lf(t) : t)
      i.add(s.from, s.to, s.value);
    return i.finish();
  }
  /**
  Join an array of range sets into a single set.
  */
  static join(t) {
    if (!t.length)
      return B.empty;
    let e = t[t.length - 1];
    for (let i = t.length - 2; i >= 0; i--)
      for (let s = t[i]; s != B.empty; s = s.nextLayer)
        e = new B(s.chunkPos, s.chunk, e, Math.max(s.maxPoint, e.maxPoint));
    return e;
  }
}
B.empty = /* @__PURE__ */ new B([], [], null, -1);
function lf(n) {
  if (n.length > 1)
    for (let t = n[0], e = 1; e < n.length; e++) {
      let i = n[e];
      if (zs(t, i) > 0)
        return n.slice().sort(zs);
      t = i;
    }
  return n;
}
B.empty.nextLayer = B.empty;
class Xe {
  finishChunk(t) {
    this.chunks.push(new Tr(this.from, this.to, this.value, this.maxPoint)), this.chunkPos.push(this.chunkStart), this.chunkStart = -1, this.setMaxPoint = Math.max(this.setMaxPoint, this.maxPoint), this.maxPoint = -1, t && (this.from = [], this.to = [], this.value = []);
  }
  /**
  Create an empty builder.
  */
  constructor() {
    this.chunks = [], this.chunkPos = [], this.chunkStart = -1, this.last = null, this.lastFrom = -1e9, this.lastTo = -1e9, this.from = [], this.to = [], this.value = [], this.maxPoint = -1, this.setMaxPoint = -1, this.nextLayer = null;
  }
  /**
  Add a range. Ranges should be added in sorted (by `from` and
  `value.startSide`) order.
  */
  add(t, e, i) {
    this.addInner(t, e, i) || (this.nextLayer || (this.nextLayer = new Xe())).add(t, e, i);
  }
  /**
  @internal
  */
  addInner(t, e, i) {
    let s = t - this.lastTo || i.startSide - this.last.endSide;
    if (s <= 0 && (t - this.lastFrom || i.startSide - this.last.startSide) < 0)
      throw new Error("Ranges must be added sorted by `from` position and `startSide`");
    return s < 0 ? !1 : (this.from.length == 250 && this.finishChunk(!0), this.chunkStart < 0 && (this.chunkStart = t), this.from.push(t - this.chunkStart), this.to.push(e - this.chunkStart), this.last = i, this.lastFrom = t, this.lastTo = e, this.value.push(i), i.point && (this.maxPoint = Math.max(this.maxPoint, e - t)), !0);
  }
  /**
  @internal
  */
  addChunk(t, e) {
    if ((t - this.lastTo || e.value[0].startSide - this.last.endSide) < 0)
      return !1;
    this.from.length && this.finishChunk(!0), this.setMaxPoint = Math.max(this.setMaxPoint, e.maxPoint), this.chunks.push(e), this.chunkPos.push(t);
    let i = e.value.length - 1;
    return this.last = e.value[i], this.lastFrom = e.from[i] + t, this.lastTo = e.to[i] + t, !0;
  }
  /**
  Finish the range set. Returns the new set. The builder can't be
  used anymore after this has been called.
  */
  finish() {
    return this.finishInner(B.empty);
  }
  /**
  @internal
  */
  finishInner(t) {
    if (this.from.length && this.finishChunk(!1), this.chunks.length == 0)
      return t;
    let e = B.create(this.chunkPos, this.chunks, this.nextLayer ? this.nextLayer.finishInner(t) : t, this.setMaxPoint);
    return this.from = null, e;
  }
}
function bo(n, t, e) {
  let i = /* @__PURE__ */ new Map();
  for (let r of n)
    for (let o = 0; o < r.chunk.length; o++)
      r.chunk[o].maxPoint <= 0 && i.set(r.chunk[o], r.chunkPos[o]);
  let s = /* @__PURE__ */ new Set();
  for (let r of t)
    for (let o = 0; o < r.chunk.length; o++) {
      let l = i.get(r.chunk[o]);
      l != null && (e ? e.mapPos(l) : l) == r.chunkPos[o] && !e?.touchesRange(l, l + r.chunk[o].length) && s.add(r.chunk[o]);
    }
  return s;
}
class aa {
  constructor(t, e, i, s = 0) {
    this.layer = t, this.skip = e, this.minPoint = i, this.rank = s;
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  get endSide() {
    return this.value ? this.value.endSide : 0;
  }
  goto(t, e = -1e9) {
    return this.chunkIndex = this.rangeIndex = 0, this.gotoInner(t, e, !1), this;
  }
  gotoInner(t, e, i) {
    for (; this.chunkIndex < this.layer.chunk.length; ) {
      let s = this.layer.chunk[this.chunkIndex];
      if (!(this.skip && this.skip.has(s) || this.layer.chunkEnd(this.chunkIndex) < t || s.maxPoint < this.minPoint))
        break;
      this.chunkIndex++, i = !1;
    }
    if (this.chunkIndex < this.layer.chunk.length) {
      let s = this.layer.chunk[this.chunkIndex].findIndex(t - this.layer.chunkPos[this.chunkIndex], e, !0);
      (!i || this.rangeIndex < s) && this.setRangeIndex(s);
    }
    this.next();
  }
  forward(t, e) {
    (this.to - t || this.endSide - e) < 0 && this.gotoInner(t, e, !0);
  }
  next() {
    for (; ; )
      if (this.chunkIndex == this.layer.chunk.length) {
        this.from = this.to = 1e9, this.value = null;
        break;
      } else {
        let t = this.layer.chunkPos[this.chunkIndex], e = this.layer.chunk[this.chunkIndex], i = t + e.from[this.rangeIndex];
        if (this.from = i, this.to = t + e.to[this.rangeIndex], this.value = e.value[this.rangeIndex], this.setRangeIndex(this.rangeIndex + 1), this.minPoint < 0 || this.value.point && this.to - this.from >= this.minPoint)
          break;
      }
  }
  setRangeIndex(t) {
    if (t == this.layer.chunk[this.chunkIndex].value.length) {
      if (this.chunkIndex++, this.skip)
        for (; this.chunkIndex < this.layer.chunk.length && this.skip.has(this.layer.chunk[this.chunkIndex]); )
          this.chunkIndex++;
      this.rangeIndex = 0;
    } else
      this.rangeIndex = t;
  }
  nextChunk() {
    this.chunkIndex++, this.rangeIndex = 0, this.next();
  }
  compare(t) {
    return this.from - t.from || this.startSide - t.startSide || this.rank - t.rank || this.to - t.to || this.endSide - t.endSide;
  }
}
class Ei {
  constructor(t) {
    this.heap = t;
  }
  static from(t, e = null, i = -1) {
    let s = [];
    for (let r = 0; r < t.length; r++)
      for (let o = t[r]; !o.isEmpty; o = o.nextLayer)
        o.maxPoint >= i && s.push(new aa(o, e, i, r));
    return s.length == 1 ? s[0] : new Ei(s);
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  goto(t, e = -1e9) {
    for (let i of this.heap)
      i.goto(t, e);
    for (let i = this.heap.length >> 1; i >= 0; i--)
      hs(this.heap, i);
    return this.next(), this;
  }
  forward(t, e) {
    for (let i of this.heap)
      i.forward(t, e);
    for (let i = this.heap.length >> 1; i >= 0; i--)
      hs(this.heap, i);
    (this.to - t || this.value.endSide - e) < 0 && this.next();
  }
  next() {
    if (this.heap.length == 0)
      this.from = this.to = 1e9, this.value = null, this.rank = -1;
    else {
      let t = this.heap[0];
      this.from = t.from, this.to = t.to, this.value = t.value, this.rank = t.rank, t.value && t.next(), hs(this.heap, 0);
    }
  }
}
function hs(n, t) {
  for (let e = n[t]; ; ) {
    let i = (t << 1) + 1;
    if (i >= n.length)
      break;
    let s = n[i];
    if (i + 1 < n.length && s.compare(n[i + 1]) >= 0 && (s = n[i + 1], i++), e.compare(s) < 0)
      break;
    n[i] = e, n[t] = s, t = i;
  }
}
class ci {
  constructor(t, e, i) {
    this.minPoint = i, this.active = [], this.activeTo = [], this.activeRank = [], this.minActive = -1, this.point = null, this.pointFrom = 0, this.pointRank = 0, this.to = -1e9, this.endSide = 0, this.openStart = -1, this.cursor = Ei.from(t, e, i);
  }
  goto(t, e = -1e9) {
    return this.cursor.goto(t, e), this.active.length = this.activeTo.length = this.activeRank.length = 0, this.minActive = -1, this.to = t, this.endSide = e, this.openStart = -1, this.next(), this;
  }
  forward(t, e) {
    for (; this.minActive > -1 && (this.activeTo[this.minActive] - t || this.active[this.minActive].endSide - e) < 0; )
      this.removeActive(this.minActive);
    this.cursor.forward(t, e);
  }
  removeActive(t) {
    Xi(this.active, t), Xi(this.activeTo, t), Xi(this.activeRank, t), this.minActive = wo(this.active, this.activeTo);
  }
  addActive(t) {
    let e = 0, { value: i, to: s, rank: r } = this.cursor;
    for (; e < this.activeRank.length && (r - this.activeRank[e] || s - this.activeTo[e]) > 0; )
      e++;
    Zi(this.active, e, i), Zi(this.activeTo, e, s), Zi(this.activeRank, e, r), t && Zi(t, e, this.cursor.from), this.minActive = wo(this.active, this.activeTo);
  }
  // After calling this, if `this.point` != null, the next range is a
  // point. Otherwise, it's a regular range, covered by `this.active`.
  next() {
    let t = this.to, e = this.point;
    this.point = null;
    let i = this.openStart < 0 ? [] : null;
    for (; ; ) {
      let s = this.minActive;
      if (s > -1 && (this.activeTo[s] - this.cursor.from || this.active[s].endSide - this.cursor.startSide) < 0) {
        if (this.activeTo[s] > t) {
          this.to = this.activeTo[s], this.endSide = this.active[s].endSide;
          break;
        }
        this.removeActive(s), i && Xi(i, s);
      } else if (this.cursor.value)
        if (this.cursor.from > t) {
          this.to = this.cursor.from, this.endSide = this.cursor.startSide;
          break;
        } else {
          let r = this.cursor.value;
          if (!r.point)
            this.addActive(i), this.cursor.next();
          else if (e && this.cursor.to == this.to && this.cursor.from < this.cursor.to)
            this.cursor.next();
          else {
            this.point = r, this.pointFrom = this.cursor.from, this.pointRank = this.cursor.rank, this.to = this.cursor.to, this.endSide = r.endSide, this.cursor.next(), this.forward(this.to, this.endSide);
            break;
          }
        }
      else {
        this.to = this.endSide = 1e9;
        break;
      }
    }
    if (i) {
      this.openStart = 0;
      for (let s = i.length - 1; s >= 0 && i[s] < t; s--)
        this.openStart++;
    }
  }
  activeForPoint(t) {
    if (!this.active.length)
      return this.active;
    let e = [];
    for (let i = this.active.length - 1; i >= 0 && !(this.activeRank[i] < this.pointRank); i--)
      (this.activeTo[i] > t || this.activeTo[i] == t && this.active[i].endSide >= this.point.endSide) && e.push(this.active[i]);
    return e.reverse();
  }
  openEnd(t) {
    let e = 0;
    for (let i = this.activeTo.length - 1; i >= 0 && this.activeTo[i] > t; i--)
      e++;
    return e;
  }
}
function yo(n, t, e, i, s, r) {
  n.goto(t), e.goto(i);
  let o = i + s, l = i, a = i - t, h = !!r.boundChange;
  for (let c = !1; ; ) {
    let f = n.to + a - e.to, u = f || n.endSide - e.endSide, d = u < 0 ? n.to + a : e.to, p = Math.min(d, o);
    if (n.point || e.point ? (n.point && e.point && Mr(n.point, e.point) && Us(n.activeForPoint(n.to), e.activeForPoint(e.to)) || r.comparePoint(l, p, n.point, e.point), c = !1) : (c && r.boundChange(l), p > l && !Us(n.active, e.active) && r.compareRange(l, p, n.active, e.active), h && p < o && (f || n.openEnd(d) != e.openEnd(d)) && (c = !0)), d > o)
      break;
    l = d, u <= 0 && n.next(), u >= 0 && e.next();
  }
}
function Us(n, t) {
  if (n.length != t.length)
    return !1;
  for (let e = 0; e < n.length; e++)
    if (n[e] != t[e] && !Mr(n[e], t[e]))
      return !1;
  return !0;
}
function Xi(n, t) {
  for (let e = t, i = n.length - 1; e < i; e++)
    n[e] = n[e + 1];
  n.pop();
}
function Zi(n, t, e) {
  for (let i = n.length - 1; i >= t; i--)
    n[i + 1] = n[i];
  n[t] = e;
}
function wo(n, t) {
  let e = -1, i = 1e9;
  for (let s = 0; s < t.length; s++)
    (t[s] - i || n[s].endSide - n[e].endSide) < 0 && (e = s, i = t[s]);
  return e;
}
function zn(n, t, e = n.length) {
  let i = 0;
  for (let s = 0; s < e && s < n.length; )
    n.charCodeAt(s) == 9 ? (i += t - i % t, s++) : (i++, s = at(n, s));
  return i;
}
function af(n, t, e, i) {
  for (let s = 0, r = 0; ; ) {
    if (r >= t)
      return s;
    if (s == n.length)
      break;
    r += n.charCodeAt(s) == 9 ? e - r % e : 1, s = at(n, s);
  }
  return n.length;
}
const js = "ͼ", vo = typeof Symbol > "u" ? "__" + js : Symbol.for(js), qs = typeof Symbol > "u" ? "__styleSet" + Math.floor(Math.random() * 1e8) : /* @__PURE__ */ Symbol("styleSet"), xo = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : {};
class ce {
  // :: (Object<Style>, ?{finish: ?(string) → string})
  // Create a style module from the given spec.
  //
  // When `finish` is given, it is called on regular (non-`@`)
  // selectors (after `&` expansion) to compute the final selector.
  constructor(t, e) {
    this.rules = [];
    let { finish: i } = e || {};
    function s(o) {
      return /^@/.test(o) ? [o] : o.split(/,\s*/);
    }
    function r(o, l, a, h) {
      let c = [], f = /^@(\w+)\b/.exec(o[0]), u = f && f[1] == "keyframes";
      if (f && l == null) return a.push(o[0] + ";");
      for (let d in l) {
        let p = l[d];
        if (/&/.test(d))
          r(
            d.split(/,\s*/).map((g) => o.map((m) => g.replace(/&/, m))).reduce((g, m) => g.concat(m)),
            p,
            a
          );
        else if (p && typeof p == "object") {
          if (!f) throw new RangeError("The value of a property (" + d + ") should be a primitive value.");
          r(s(d), p, c, u);
        } else p != null && c.push(d.replace(/_.*/, "").replace(/[A-Z]/g, (g) => "-" + g.toLowerCase()) + ": " + p + ";");
      }
      (c.length || u) && a.push((i && !f && !h ? o.map(i) : o).join(", ") + " {" + c.join(" ") + "}");
    }
    for (let o in t) r(s(o), t[o], this.rules);
  }
  // :: () → string
  // Returns a string containing the module's CSS rules.
  getRules() {
    return this.rules.join(`
`);
  }
  // :: () → string
  // Generate a new unique CSS class name.
  static newName() {
    let t = xo[vo] || 1;
    return xo[vo] = t + 1, js + t.toString(36);
  }
  // :: (union<Document, ShadowRoot>, union<[StyleModule], StyleModule>, ?{nonce: ?string})
  //
  // Mount the given set of modules in the given DOM root, which ensures
  // that the CSS rules defined by the module are available in that
  // context.
  //
  // Rules are only added to the document once per root.
  //
  // Rule order will follow the order of the modules, so that rules from
  // modules later in the array take precedence of those from earlier
  // modules. If you call this function multiple times for the same root
  // in a way that changes the order of already mounted modules, the old
  // order will be changed.
  //
  // If a Content Security Policy nonce is provided, it is added to
  // the `<style>` tag generated by the library.
  static mount(t, e, i) {
    let s = t[qs], r = i && i.nonce;
    s ? r && s.setNonce(r) : s = new hf(t, r), s.mount(Array.isArray(e) ? e : [e], t);
  }
}
let ko = /* @__PURE__ */ new Map();
class hf {
  constructor(t, e) {
    let i = t.ownerDocument || t, s = i.defaultView;
    if (!t.head && t.adoptedStyleSheets && s.CSSStyleSheet) {
      let r = ko.get(i);
      if (r) return t[qs] = r;
      this.sheet = new s.CSSStyleSheet(), ko.set(i, this);
    } else
      this.styleTag = i.createElement("style"), e && this.styleTag.setAttribute("nonce", e);
    this.modules = [], t[qs] = this;
  }
  mount(t, e) {
    let i = this.sheet, s = 0, r = 0;
    for (let o = 0; o < t.length; o++) {
      let l = t[o], a = this.modules.indexOf(l);
      if (a < r && a > -1 && (this.modules.splice(a, 1), r--, a = -1), a == -1) {
        if (this.modules.splice(r++, 0, l), i) for (let h = 0; h < l.rules.length; h++)
          i.insertRule(l.rules[h], s++);
      } else {
        for (; r < a; ) s += this.modules[r++].rules.length;
        s += l.rules.length, r++;
      }
    }
    if (i)
      e.adoptedStyleSheets.indexOf(this.sheet) < 0 && (e.adoptedStyleSheets = [this.sheet, ...e.adoptedStyleSheets]);
    else {
      let o = "";
      for (let a = 0; a < this.modules.length; a++)
        o += this.modules[a].getRules() + `
`;
      this.styleTag.textContent = o;
      let l = e.head || e;
      this.styleTag.parentNode != l && l.insertBefore(this.styleTag, l.firstChild);
    }
  }
  setNonce(t) {
    this.styleTag && this.styleTag.getAttribute("nonce") != t && this.styleTag.setAttribute("nonce", t);
  }
}
var fe = {
  8: "Backspace",
  9: "Tab",
  10: "Enter",
  12: "NumLock",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  44: "PrintScreen",
  45: "Insert",
  46: "Delete",
  59: ";",
  61: "=",
  91: "Meta",
  92: "Meta",
  106: "*",
  107: "+",
  108: ",",
  109: "-",
  110: ".",
  111: "/",
  144: "NumLock",
  145: "ScrollLock",
  160: "Shift",
  161: "Shift",
  162: "Control",
  163: "Control",
  164: "Alt",
  165: "Alt",
  173: "-",
  186: ";",
  187: "=",
  188: ",",
  189: "-",
  190: ".",
  191: "/",
  192: "`",
  219: "[",
  220: "\\",
  221: "]",
  222: "'"
}, Di = {
  48: ")",
  49: "!",
  50: "@",
  51: "#",
  52: "$",
  53: "%",
  54: "^",
  55: "&",
  56: "*",
  57: "(",
  59: ":",
  61: "+",
  173: "_",
  186: ":",
  187: "+",
  188: "<",
  189: "_",
  190: ">",
  191: "?",
  192: "~",
  219: "{",
  220: "|",
  221: "}",
  222: '"'
}, cf = typeof navigator < "u" && /Mac/.test(navigator.platform), ff = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var st = 0; st < 10; st++) fe[48 + st] = fe[96 + st] = String(st);
for (var st = 1; st <= 24; st++) fe[st + 111] = "F" + st;
for (var st = 65; st <= 90; st++)
  fe[st] = String.fromCharCode(st + 32), Di[st] = String.fromCharCode(st);
for (var cs in fe) Di.hasOwnProperty(cs) || (Di[cs] = fe[cs]);
function uf(n) {
  var t = cf && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey || ff && n.shiftKey && n.key && n.key.length == 1 || n.key == "Unidentified", e = !t && n.key || (n.shiftKey ? Di : fe)[n.keyCode] || n.key || "Unidentified";
  return e == "Esc" && (e = "Escape"), e == "Del" && (e = "Delete"), e == "Left" && (e = "ArrowLeft"), e == "Up" && (e = "ArrowUp"), e == "Right" && (e = "ArrowRight"), e == "Down" && (e = "ArrowDown"), e;
}
function Kt() {
  var n = arguments[0];
  typeof n == "string" && (n = document.createElement(n));
  var t = 1, e = arguments[1];
  if (e && typeof e == "object" && e.nodeType == null && !Array.isArray(e)) {
    for (var i in e) if (Object.prototype.hasOwnProperty.call(e, i)) {
      var s = e[i];
      typeof s == "string" ? n.setAttribute(i, s) : s != null && (n[i] = s);
    }
    t++;
  }
  for (; t < arguments.length; t++) ha(n, arguments[t]);
  return n;
}
function ha(n, t) {
  if (typeof t == "string")
    n.appendChild(document.createTextNode(t));
  else if (t != null) if (t.nodeType != null)
    n.appendChild(t);
  else if (Array.isArray(t))
    for (var e = 0; e < t.length; e++) ha(n, t[e]);
  else
    throw new RangeError("Unsupported child node: " + t);
}
let ut = typeof navigator < "u" ? navigator : { userAgent: "", vendor: "", platform: "" }, Ks = typeof document < "u" ? document : { documentElement: { style: {} } };
const Gs = /* @__PURE__ */ /Edge\/(\d+)/.exec(ut.userAgent), ca = /* @__PURE__ */ /MSIE \d/.test(ut.userAgent), Js = /* @__PURE__ */ /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(ut.userAgent), Un = !!(ca || Js || Gs), So = !Un && /* @__PURE__ */ /gecko\/(\d+)/i.test(ut.userAgent), fs = !Un && /* @__PURE__ */ /Chrome\/(\d+)/.exec(ut.userAgent), Ao = "webkitFontSmoothing" in Ks.documentElement.style, Ys = !Un && /* @__PURE__ */ /Apple Computer/.test(ut.vendor), Co = Ys && (/* @__PURE__ */ /Mobile\/\w+/.test(ut.userAgent) || ut.maxTouchPoints > 2);
var C = {
  mac: Co || /* @__PURE__ */ /Mac/.test(ut.platform),
  windows: /* @__PURE__ */ /Win/.test(ut.platform),
  linux: /* @__PURE__ */ /Linux|X11/.test(ut.platform),
  ie: Un,
  ie_version: ca ? Ks.documentMode || 6 : Js ? +Js[1] : Gs ? +Gs[1] : 0,
  gecko: So,
  gecko_version: So ? +(/* @__PURE__ */ /Firefox\/(\d+)/.exec(ut.userAgent) || [0, 0])[1] : 0,
  chrome: !!fs,
  chrome_version: fs ? +fs[1] : 0,
  ios: Co,
  android: /* @__PURE__ */ /Android\b/.test(ut.userAgent),
  webkit: Ao,
  webkit_version: Ao ? +(/* @__PURE__ */ /\bAppleWebKit\/(\d+)/.exec(ut.userAgent) || [0, 0])[1] : 0,
  safari: Ys,
  safari_version: Ys ? +(/* @__PURE__ */ /\bVersion\/(\d+(\.\d+)?)/.exec(ut.userAgent) || [0, 0])[1] : 0,
  tabSize: Ks.documentElement.style.tabSize != null ? "tab-size" : "-moz-tab-size"
};
function Or(n, t) {
  for (let e in n)
    e == "class" && t.class ? t.class += " " + n.class : e == "style" && t.style ? t.style += ";" + n.style : t[e] = n[e];
  return t;
}
const Tn = /* @__PURE__ */ Object.create(null);
function Er(n, t, e) {
  if (n == t)
    return !0;
  n || (n = Tn), t || (t = Tn);
  let i = Object.keys(n), s = Object.keys(t);
  if (i.length - 0 != s.length - 0)
    return !1;
  for (let r of i)
    if (r != e && (s.indexOf(r) == -1 || n[r] !== t[r]))
      return !1;
  return !0;
}
function df(n, t) {
  for (let e = n.attributes.length - 1; e >= 0; e--) {
    let i = n.attributes[e].name;
    t[i] == null && n.removeAttribute(i);
  }
  for (let e in t) {
    let i = t[e];
    e == "style" ? n.style.cssText = i : n.getAttribute(e) != i && n.setAttribute(e, i);
  }
}
function Mo(n, t, e) {
  let i = !1;
  if (t)
    for (let s in t)
      e && s in e || (i = !0, s == "style" ? n.style.cssText = "" : n.removeAttribute(s));
  if (e)
    for (let s in e)
      t && t[s] == e[s] || (i = !0, s == "style" ? n.style.cssText = e[s] : n.setAttribute(s, e[s]));
  return i;
}
function pf(n) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let e = 0; e < n.attributes.length; e++) {
    let i = n.attributes[e];
    t[i.name] = i.value;
  }
  return t;
}
class zi {
  /**
  Compare this instance to another instance of the same type.
  (TypeScript can't express this, but only instances of the same
  specific class will be passed to this method.) This is used to
  avoid redrawing widgets when they are replaced by a new
  decoration of the same type. The default implementation just
  returns `false`, which will cause new instances of the widget to
  always be redrawn.
  */
  eq(t) {
    return !1;
  }
  /**
  Update a DOM element created by a widget of the same type (but
  different, non-`eq` content) to reflect this widget. May return
  true to indicate that it could update, false to indicate it
  couldn't (in which case the widget will be redrawn). The default
  implementation just returns false.
  */
  updateDOM(t, e, i) {
    return !1;
  }
  /**
  @internal
  */
  compare(t) {
    return this == t || this.constructor == t.constructor && this.eq(t);
  }
  /**
  The estimated height this widget will have, to be used when
  estimating the height of content that hasn't been drawn. May
  return -1 to indicate you don't know. The default implementation
  returns -1.
  */
  get estimatedHeight() {
    return -1;
  }
  /**
  For inline widgets that are displayed inline (as opposed to
  `inline-block`) and introduce line breaks (through `<br>` tags
  or textual newlines), this must indicate the amount of line
  breaks they introduce. Defaults to 0.
  */
  get lineBreaks() {
    return 0;
  }
  /**
  Can be used to configure which kinds of events inside the widget
  should be ignored by the editor. The default is to ignore all
  events.
  */
  ignoreEvent(t) {
    return !0;
  }
  /**
  Override the way screen coordinates for positions at/in the
  widget are found. `pos` will be the offset into the widget, and
  `side` the side of the position that is being queried—less than
  zero for before, greater than zero for after, and zero for
  directly at that position.
  */
  coordsAt(t, e, i) {
    return null;
  }
  /**
  @internal
  */
  get isHidden() {
    return !1;
  }
  /**
  @internal
  */
  get editable() {
    return !1;
  }
  /**
  This is called when the an instance of the widget is removed
  from the editor view.
  */
  destroy(t) {
  }
}
var rt = /* @__PURE__ */ (function(n) {
  return n[n.Text = 0] = "Text", n[n.WidgetBefore = 1] = "WidgetBefore", n[n.WidgetAfter = 2] = "WidgetAfter", n[n.WidgetRange = 3] = "WidgetRange", n;
})(rt || (rt = {}));
class K extends Le {
  constructor(t, e, i, s) {
    super(), this.startSide = t, this.endSide = e, this.widget = i, this.spec = s;
  }
  /**
  @internal
  */
  get heightRelevant() {
    return !1;
  }
  /**
  Create a mark decoration, which influences the styling of the
  content in its range. Nested mark decorations will cause nested
  DOM elements to be created. Nesting order is determined by
  precedence of the [facet](https://codemirror.net/6/docs/ref/#view.EditorView^decorations), with
  the higher-precedence decorations creating the inner DOM nodes.
  Such elements are split on line boundaries and on the boundaries
  of lower-precedence decorations.
  */
  static mark(t) {
    return new Ui(t);
  }
  /**
  Create a widget decoration, which displays a DOM element at the
  given position.
  */
  static widget(t) {
    let e = Math.max(-1e4, Math.min(1e4, t.side || 0)), i = !!t.block;
    return e += i && !t.inlineOrder ? e > 0 ? 3e8 : -4e8 : e > 0 ? 1e8 : -1e8, new Be(t, e, e, i, t.widget || null, !1);
  }
  /**
  Create a replace decoration which replaces the given range with
  a widget, or simply hides it.
  */
  static replace(t) {
    let e = !!t.block, i, s;
    if (t.isBlockGap)
      i = -5e8, s = 4e8;
    else {
      let { start: r, end: o } = fa(t, e);
      i = (r ? e ? -3e8 : -1 : 5e8) - 1, s = (o ? e ? 2e8 : 1 : -6e8) + 1;
    }
    return new Be(t, i, s, e, t.widget || null, !0);
  }
  /**
  Create a line decoration, which can add DOM attributes to the
  line starting at the given position.
  */
  static line(t) {
    return new ji(t);
  }
  /**
  Build a [`DecorationSet`](https://codemirror.net/6/docs/ref/#view.DecorationSet) from the given
  decorated range or ranges. If the ranges aren't already sorted,
  pass `true` for `sort` to make the library sort them for you.
  */
  static set(t, e = !1) {
    return B.of(t, e);
  }
  /**
  @internal
  */
  hasHeight() {
    return this.widget ? this.widget.estimatedHeight > -1 : !1;
  }
}
K.none = B.empty;
class Ui extends K {
  constructor(t) {
    let { start: e, end: i } = fa(t);
    super(e ? -1 : 5e8, i ? 1 : -6e8, null, t), this.tagName = t.tagName || "span", this.attrs = t.class && t.attributes ? Or(t.attributes, { class: t.class }) : t.class ? { class: t.class } : t.attributes || Tn;
  }
  eq(t) {
    return this == t || t instanceof Ui && this.tagName == t.tagName && Er(this.attrs, t.attrs);
  }
  range(t, e = t) {
    if (t >= e)
      throw new RangeError("Mark decorations may not be empty");
    return super.range(t, e);
  }
}
Ui.prototype.point = !1;
class ji extends K {
  constructor(t) {
    super(-2e8, -2e8, null, t);
  }
  eq(t) {
    return t instanceof ji && this.spec.class == t.spec.class && Er(this.spec.attributes, t.spec.attributes);
  }
  range(t, e = t) {
    if (e != t)
      throw new RangeError("Line decoration ranges must be zero-length");
    return super.range(t, e);
  }
}
ji.prototype.mapMode = pt.TrackBefore;
ji.prototype.point = !0;
class Be extends K {
  constructor(t, e, i, s, r, o) {
    super(e, i, r, t), this.block = s, this.isReplace = o, this.mapMode = s ? e <= 0 ? pt.TrackBefore : pt.TrackAfter : pt.TrackDel;
  }
  // Only relevant when this.block == true
  get type() {
    return this.startSide != this.endSide ? rt.WidgetRange : this.startSide <= 0 ? rt.WidgetBefore : rt.WidgetAfter;
  }
  get heightRelevant() {
    return this.block || !!this.widget && (this.widget.estimatedHeight >= 5 || this.widget.lineBreaks > 0);
  }
  eq(t) {
    return t instanceof Be && gf(this.widget, t.widget) && this.block == t.block && this.startSide == t.startSide && this.endSide == t.endSide;
  }
  range(t, e = t) {
    if (this.isReplace && (t > e || t == e && this.startSide > 0 && this.endSide <= 0))
      throw new RangeError("Invalid range for replacement decoration");
    if (!this.isReplace && e != t)
      throw new RangeError("Widget decorations can only have zero-length ranges");
    return super.range(t, e);
  }
}
Be.prototype.point = !0;
function fa(n, t = !1) {
  let { inclusiveStart: e, inclusiveEnd: i } = n;
  return e == null && (e = n.inclusive), i == null && (i = n.inclusive), { start: e ?? t, end: i ?? t };
}
function gf(n, t) {
  return n == t || !!(n && t && n.compare(t));
}
function qe(n, t, e, i = 0) {
  let s = e.length - 1;
  s >= 0 && e[s] + i >= n ? e[s] = Math.max(e[s], t) : e.push(n, t);
}
class Ri extends Le {
  constructor(t, e) {
    super(), this.tagName = t, this.attributes = e;
  }
  eq(t) {
    return t == this || t instanceof Ri && this.tagName == t.tagName && Er(this.attributes, t.attributes);
  }
  /**
  Create a block wrapper object with the given tag name and
  attributes.
  */
  static create(t) {
    return new Ri(t.tagName, t.attributes || Tn);
  }
  /**
  Create a range set from the given block wrapper ranges.
  */
  static set(t, e = !1) {
    return B.of(t, e);
  }
}
Ri.prototype.startSide = Ri.prototype.endSide = -1;
function Li(n) {
  let t;
  return n.nodeType == 11 ? t = n.getSelection ? n : n.ownerDocument : t = n, t.getSelection();
}
function Xs(n, t) {
  return t ? n == t || n.contains(t.nodeType != 1 ? t.parentNode : t) : !1;
}
function xi(n, t) {
  if (!t.anchorNode)
    return !1;
  try {
    return Xs(n, t.anchorNode);
  } catch {
    return !1;
  }
}
function wn(n) {
  return n.nodeType == 3 ? Bi(n, 0, n.nodeValue.length).getClientRects() : n.nodeType == 1 ? n.getClientRects() : [];
}
function ki(n, t, e, i) {
  return e ? To(n, t, e, i, -1) || To(n, t, e, i, 1) : !1;
}
function ue(n) {
  for (var t = 0; ; t++)
    if (n = n.previousSibling, !n)
      return t;
}
function On(n) {
  return n.nodeType == 1 && /^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(n.nodeName);
}
function To(n, t, e, i, s) {
  for (; ; ) {
    if (n == e && t == i)
      return !0;
    if (t == (s < 0 ? 0 : ne(n))) {
      if (n.nodeName == "DIV")
        return !1;
      let r = n.parentNode;
      if (!r || r.nodeType != 1)
        return !1;
      t = ue(n) + (s < 0 ? 0 : 1), n = r;
    } else if (n.nodeType == 1) {
      if (n = n.childNodes[t + (s < 0 ? -1 : 0)], n.nodeType == 1 && n.contentEditable == "false")
        return !1;
      t = s < 0 ? ne(n) : 0;
    } else
      return !1;
  }
}
function ne(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function En(n, t) {
  let e = t ? n.left : n.right;
  return { left: e, right: e, top: n.top, bottom: n.bottom };
}
function mf(n) {
  let t = n.visualViewport;
  return t ? {
    left: 0,
    right: t.width,
    top: 0,
    bottom: t.height
  } : {
    left: 0,
    right: n.innerWidth,
    top: 0,
    bottom: n.innerHeight
  };
}
function ua(n, t) {
  let e = t.width / n.offsetWidth, i = t.height / n.offsetHeight;
  return (e > 0.995 && e < 1.005 || !isFinite(e) || Math.abs(t.width - n.offsetWidth) < 1) && (e = 1), (i > 0.995 && i < 1.005 || !isFinite(i) || Math.abs(t.height - n.offsetHeight) < 1) && (i = 1), { scaleX: e, scaleY: i };
}
function bf(n, t, e, i, s, r, o, l) {
  let a = n.ownerDocument, h = a.defaultView || window;
  for (let c = n, f = !1; c && !f; )
    if (c.nodeType == 1) {
      let u, d = c == a.body, p = 1, g = 1;
      if (d)
        u = mf(h);
      else {
        if (/^(fixed|sticky)$/.test(getComputedStyle(c).position) && (f = !0), c.scrollHeight <= c.clientHeight && c.scrollWidth <= c.clientWidth) {
          c = c.assignedSlot || c.parentNode;
          continue;
        }
        let v = c.getBoundingClientRect();
        ({ scaleX: p, scaleY: g } = ua(c, v)), u = {
          left: v.left,
          right: v.left + c.clientWidth * p,
          top: v.top,
          bottom: v.top + c.clientHeight * g
        };
      }
      let m = 0, b = 0;
      if (s == "nearest")
        t.top < u.top + o ? (b = t.top - (u.top + o), e > 0 && t.bottom > u.bottom + b && (b = t.bottom - u.bottom + o)) : t.bottom > u.bottom - o && (b = t.bottom - u.bottom + o, e < 0 && t.top - b < u.top && (b = t.top - (u.top + o)));
      else {
        let v = t.bottom - t.top, w = u.bottom - u.top;
        b = (s == "center" && v <= w ? t.top + v / 2 - w / 2 : s == "start" || s == "center" && e < 0 ? t.top - o : t.bottom - w + o) - u.top;
      }
      if (i == "nearest" ? t.left < u.left + r ? (m = t.left - (u.left + r), e > 0 && t.right > u.right + m && (m = t.right - u.right + r)) : t.right > u.right - r && (m = t.right - u.right + r, e < 0 && t.left < u.left + m && (m = t.left - (u.left + r))) : m = (i == "center" ? t.left + (t.right - t.left) / 2 - (u.right - u.left) / 2 : i == "start" == l ? t.left - r : t.right - (u.right - u.left) + r) - u.left, m || b)
        if (d)
          h.scrollBy(m, b);
        else {
          let v = 0, w = 0;
          if (b) {
            let O = c.scrollTop;
            c.scrollTop += b / g, w = (c.scrollTop - O) * g;
          }
          if (m) {
            let O = c.scrollLeft;
            c.scrollLeft += m / p, v = (c.scrollLeft - O) * p;
          }
          t = {
            left: t.left - v,
            top: t.top - w,
            right: t.right - v,
            bottom: t.bottom - w
          }, v && Math.abs(v - m) < 1 && (i = "nearest"), w && Math.abs(w - b) < 1 && (s = "nearest");
        }
      if (d)
        break;
      (t.top < u.top || t.bottom > u.bottom || t.left < u.left || t.right > u.right) && (t = {
        left: Math.max(t.left, u.left),
        right: Math.min(t.right, u.right),
        top: Math.max(t.top, u.top),
        bottom: Math.min(t.bottom, u.bottom)
      }), c = c.assignedSlot || c.parentNode;
    } else if (c.nodeType == 11)
      c = c.host;
    else
      break;
}
function da(n, t = !0) {
  let e = n.ownerDocument, i = null, s = null;
  for (let r = n.parentNode; r && !(r == e.body || (!t || i) && s); )
    if (r.nodeType == 1)
      !s && r.scrollHeight > r.clientHeight && (s = r), t && !i && r.scrollWidth > r.clientWidth && (i = r), r = r.assignedSlot || r.parentNode;
    else if (r.nodeType == 11)
      r = r.host;
    else
      break;
  return { x: i, y: s };
}
class yf {
  constructor() {
    this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0;
  }
  eq(t) {
    return this.anchorNode == t.anchorNode && this.anchorOffset == t.anchorOffset && this.focusNode == t.focusNode && this.focusOffset == t.focusOffset;
  }
  setRange(t) {
    let { anchorNode: e, focusNode: i } = t;
    this.set(e, Math.min(t.anchorOffset, e ? ne(e) : 0), i, Math.min(t.focusOffset, i ? ne(i) : 0));
  }
  set(t, e, i, s) {
    this.anchorNode = t, this.anchorOffset = e, this.focusNode = i, this.focusOffset = s;
  }
}
let Se = null;
C.safari && C.safari_version >= 26 && (Se = !1);
function pa(n) {
  if (n.setActive)
    return n.setActive();
  if (Se)
    return n.focus(Se);
  let t = [];
  for (let e = n; e && (t.push(e, e.scrollTop, e.scrollLeft), e != e.ownerDocument); e = e.parentNode)
    ;
  if (n.focus(Se == null ? {
    get preventScroll() {
      return Se = { preventScroll: !0 }, !0;
    }
  } : void 0), !Se) {
    Se = !1;
    for (let e = 0; e < t.length; ) {
      let i = t[e++], s = t[e++], r = t[e++];
      i.scrollTop != s && (i.scrollTop = s), i.scrollLeft != r && (i.scrollLeft = r);
    }
  }
}
let Oo;
function Bi(n, t, e = t) {
  let i = Oo || (Oo = document.createRange());
  return i.setEnd(n, e), i.setStart(n, t), i;
}
function Ke(n, t, e, i) {
  let s = { key: t, code: t, keyCode: e, which: e, cancelable: !0 };
  i && ({ altKey: s.altKey, ctrlKey: s.ctrlKey, shiftKey: s.shiftKey, metaKey: s.metaKey } = i);
  let r = new KeyboardEvent("keydown", s);
  r.synthetic = !0, n.dispatchEvent(r);
  let o = new KeyboardEvent("keyup", s);
  return o.synthetic = !0, n.dispatchEvent(o), r.defaultPrevented || o.defaultPrevented;
}
function wf(n) {
  for (; n; ) {
    if (n && (n.nodeType == 9 || n.nodeType == 11 && n.host))
      return n;
    n = n.assignedSlot || n.parentNode;
  }
  return null;
}
function vf(n, t) {
  let e = t.focusNode, i = t.focusOffset;
  if (!e || t.anchorNode != e || t.anchorOffset != i)
    return !1;
  for (i = Math.min(i, ne(e)); ; )
    if (i) {
      if (e.nodeType != 1)
        return !1;
      let s = e.childNodes[i - 1];
      s.contentEditable == "false" ? i-- : (e = s, i = ne(e));
    } else {
      if (e == n)
        return !0;
      i = ue(e), e = e.parentNode;
    }
}
function ga(n) {
  return n instanceof Window ? n.pageYOffset > Math.max(0, n.document.documentElement.scrollHeight - n.innerHeight - 4) : n.scrollTop > Math.max(1, n.scrollHeight - n.clientHeight - 4);
}
function ma(n, t) {
  for (let e = n, i = t; ; ) {
    if (e.nodeType == 3 && i > 0)
      return { node: e, offset: i };
    if (e.nodeType == 1 && i > 0) {
      if (e.contentEditable == "false")
        return null;
      e = e.childNodes[i - 1], i = ne(e);
    } else if (e.parentNode && !On(e))
      i = ue(e), e = e.parentNode;
    else
      return null;
  }
}
function ba(n, t) {
  for (let e = n, i = t; ; ) {
    if (e.nodeType == 3 && i < e.nodeValue.length)
      return { node: e, offset: i };
    if (e.nodeType == 1 && i < e.childNodes.length) {
      if (e.contentEditable == "false")
        return null;
      e = e.childNodes[i], i = 0;
    } else if (e.parentNode && !On(e))
      i = ue(e) + 1, e = e.parentNode;
    else
      return null;
  }
}
class Bt {
  constructor(t, e, i = !0) {
    this.node = t, this.offset = e, this.precise = i;
  }
  static before(t, e) {
    return new Bt(t.parentNode, ue(t), e);
  }
  static after(t, e) {
    return new Bt(t.parentNode, ue(t) + 1, e);
  }
}
var j = /* @__PURE__ */ (function(n) {
  return n[n.LTR = 0] = "LTR", n[n.RTL = 1] = "RTL", n;
})(j || (j = {}));
const Pe = j.LTR, Dr = j.RTL;
function ya(n) {
  let t = [];
  for (let e = 0; e < n.length; e++)
    t.push(1 << +n[e]);
  return t;
}
const xf = /* @__PURE__ */ ya("88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008"), kf = /* @__PURE__ */ ya("4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333"), Zs = /* @__PURE__ */ Object.create(null), _t = [];
for (let n of ["()", "[]", "{}"]) {
  let t = /* @__PURE__ */ n.charCodeAt(0), e = /* @__PURE__ */ n.charCodeAt(1);
  Zs[t] = e, Zs[e] = -t;
}
function wa(n) {
  return n <= 247 ? xf[n] : 1424 <= n && n <= 1524 ? 2 : 1536 <= n && n <= 1785 ? kf[n - 1536] : 1774 <= n && n <= 2220 ? 4 : 8192 <= n && n <= 8204 ? 256 : 64336 <= n && n <= 65023 ? 4 : 1;
}
const Sf = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\ufb50-\ufdff]/;
class Jt {
  /**
  The direction of this span.
  */
  get dir() {
    return this.level % 2 ? Dr : Pe;
  }
  /**
  @internal
  */
  constructor(t, e, i) {
    this.from = t, this.to = e, this.level = i;
  }
  /**
  @internal
  */
  side(t, e) {
    return this.dir == e == t ? this.to : this.from;
  }
  /**
  @internal
  */
  forward(t, e) {
    return t == (this.dir == e);
  }
  /**
  @internal
  */
  static find(t, e, i, s) {
    let r = -1;
    for (let o = 0; o < t.length; o++) {
      let l = t[o];
      if (l.from <= e && l.to >= e) {
        if (l.level == i)
          return o;
        (r < 0 || (s != 0 ? s < 0 ? l.from < e : l.to > e : t[r].level > l.level)) && (r = o);
      }
    }
    if (r < 0)
      throw new RangeError("Index out of range");
    return r;
  }
}
function va(n, t) {
  if (n.length != t.length)
    return !1;
  for (let e = 0; e < n.length; e++) {
    let i = n[e], s = t[e];
    if (i.from != s.from || i.to != s.to || i.direction != s.direction || !va(i.inner, s.inner))
      return !1;
  }
  return !0;
}
const _ = [];
function Af(n, t, e, i, s) {
  for (let r = 0; r <= i.length; r++) {
    let o = r ? i[r - 1].to : t, l = r < i.length ? i[r].from : e, a = r ? 256 : s;
    for (let h = o, c = a, f = a; h < l; h++) {
      let u = wa(n.charCodeAt(h));
      u == 512 ? u = c : u == 8 && f == 4 && (u = 16), _[h] = u == 4 ? 2 : u, u & 7 && (f = u), c = u;
    }
    for (let h = o, c = a, f = a; h < l; h++) {
      let u = _[h];
      if (u == 128)
        h < l - 1 && c == _[h + 1] && c & 24 ? u = _[h] = c : _[h] = 256;
      else if (u == 64) {
        let d = h + 1;
        for (; d < l && _[d] == 64; )
          d++;
        let p = h && c == 8 || d < e && _[d] == 8 ? f == 1 ? 1 : 8 : 256;
        for (let g = h; g < d; g++)
          _[g] = p;
        h = d - 1;
      } else u == 8 && f == 1 && (_[h] = 1);
      c = u, u & 7 && (f = u);
    }
  }
}
function Cf(n, t, e, i, s) {
  let r = s == 1 ? 2 : 1;
  for (let o = 0, l = 0, a = 0; o <= i.length; o++) {
    let h = o ? i[o - 1].to : t, c = o < i.length ? i[o].from : e;
    for (let f = h, u, d, p; f < c; f++)
      if (d = Zs[u = n.charCodeAt(f)])
        if (d < 0) {
          for (let g = l - 3; g >= 0; g -= 3)
            if (_t[g + 1] == -d) {
              let m = _t[g + 2], b = m & 2 ? s : m & 4 ? m & 1 ? r : s : 0;
              b && (_[f] = _[_t[g]] = b), l = g;
              break;
            }
        } else {
          if (_t.length == 189)
            break;
          _t[l++] = f, _t[l++] = u, _t[l++] = a;
        }
      else if ((p = _[f]) == 2 || p == 1) {
        let g = p == s;
        a = g ? 0 : 1;
        for (let m = l - 3; m >= 0; m -= 3) {
          let b = _t[m + 2];
          if (b & 2)
            break;
          if (g)
            _t[m + 2] |= 2;
          else {
            if (b & 4)
              break;
            _t[m + 2] |= 4;
          }
        }
      }
  }
}
function Mf(n, t, e, i) {
  for (let s = 0, r = i; s <= e.length; s++) {
    let o = s ? e[s - 1].to : n, l = s < e.length ? e[s].from : t;
    for (let a = o; a < l; ) {
      let h = _[a];
      if (h == 256) {
        let c = a + 1;
        for (; ; )
          if (c == l) {
            if (s == e.length)
              break;
            c = e[s++].to, l = s < e.length ? e[s].from : t;
          } else if (_[c] == 256)
            c++;
          else
            break;
        let f = r == 1, u = (c < t ? _[c] : i) == 1, d = f == u ? f ? 1 : 2 : i;
        for (let p = c, g = s, m = g ? e[g - 1].to : n; p > a; )
          p == m && (p = e[--g].from, m = g ? e[g - 1].to : n), _[--p] = d;
        a = c;
      } else
        r = h, a++;
    }
  }
}
function Qs(n, t, e, i, s, r, o) {
  let l = i % 2 ? 2 : 1;
  if (i % 2 == s % 2)
    for (let a = t, h = 0; a < e; ) {
      let c = !0, f = !1;
      if (h == r.length || a < r[h].from) {
        let g = _[a];
        g != l && (c = !1, f = g == 16);
      }
      let u = !c && l == 1 ? [] : null, d = c ? i : i + 1, p = a;
      t: for (; ; )
        if (h < r.length && p == r[h].from) {
          if (f)
            break t;
          let g = r[h];
          if (!c)
            for (let m = g.to, b = h + 1; ; ) {
              if (m == e)
                break t;
              if (b < r.length && r[b].from == m)
                m = r[b++].to;
              else {
                if (_[m] == l)
                  break t;
                break;
              }
            }
          if (h++, u)
            u.push(g);
          else {
            g.from > a && o.push(new Jt(a, g.from, d));
            let m = g.direction == Pe != !(d % 2);
            tr(n, m ? i + 1 : i, s, g.inner, g.from, g.to, o), a = g.to;
          }
          p = g.to;
        } else {
          if (p == e || (c ? _[p] != l : _[p] == l))
            break;
          p++;
        }
      u ? Qs(n, a, p, i + 1, s, u, o) : a < p && o.push(new Jt(a, p, d)), a = p;
    }
  else
    for (let a = e, h = r.length; a > t; ) {
      let c = !0, f = !1;
      if (!h || a > r[h - 1].to) {
        let g = _[a - 1];
        g != l && (c = !1, f = g == 16);
      }
      let u = !c && l == 1 ? [] : null, d = c ? i : i + 1, p = a;
      t: for (; ; )
        if (h && p == r[h - 1].to) {
          if (f)
            break t;
          let g = r[--h];
          if (!c)
            for (let m = g.from, b = h; ; ) {
              if (m == t)
                break t;
              if (b && r[b - 1].to == m)
                m = r[--b].from;
              else {
                if (_[m - 1] == l)
                  break t;
                break;
              }
            }
          if (u)
            u.push(g);
          else {
            g.to < a && o.push(new Jt(g.to, a, d));
            let m = g.direction == Pe != !(d % 2);
            tr(n, m ? i + 1 : i, s, g.inner, g.from, g.to, o), a = g.from;
          }
          p = g.from;
        } else {
          if (p == t || (c ? _[p - 1] != l : _[p - 1] == l))
            break;
          p--;
        }
      u ? Qs(n, p, a, i + 1, s, u, o) : p < a && o.push(new Jt(p, a, d)), a = p;
    }
}
function tr(n, t, e, i, s, r, o) {
  let l = t % 2 ? 2 : 1;
  Af(n, s, r, i, l), Cf(n, s, r, i, l), Mf(s, r, i, l), Qs(n, s, r, t, e, i, o);
}
function Tf(n, t, e) {
  if (!n)
    return [new Jt(0, 0, t == Dr ? 1 : 0)];
  if (t == Pe && !e.length && !Sf.test(n))
    return xa(n.length);
  if (e.length)
    for (; n.length > _.length; )
      _[_.length] = 256;
  let i = [], s = t == Pe ? 0 : 1;
  return tr(n, s, s, e, 0, n.length, i), i;
}
function xa(n) {
  return [new Jt(0, n, 0)];
}
let ka = "";
function Of(n, t, e, i, s) {
  var r;
  let o = i.head - n.from, l = Jt.find(t, o, (r = i.bidiLevel) !== null && r !== void 0 ? r : -1, i.assoc), a = t[l], h = a.side(s, e);
  if (o == h) {
    let u = l += s ? 1 : -1;
    if (u < 0 || u >= t.length)
      return null;
    a = t[l = u], o = a.side(!s, e), h = a.side(s, e);
  }
  let c = at(n.text, o, a.forward(s, e));
  (c < a.from || c > a.to) && (c = h), ka = n.text.slice(Math.min(o, c), Math.max(o, c));
  let f = l == (s ? t.length - 1 : 0) ? null : t[l + (s ? 1 : -1)];
  return f && c == h && f.level + (s ? 0 : 1) < a.level ? y.cursor(f.side(!s, e) + n.from, f.forward(s, e) ? 1 : -1, f.level) : y.cursor(c + n.from, a.forward(s, e) ? -1 : 1, a.level);
}
function Ef(n, t, e) {
  for (let i = t; i < e; i++) {
    let s = wa(n.charCodeAt(i));
    if (s == 1)
      return Pe;
    if (s == 2 || s == 4)
      return Dr;
  }
  return Pe;
}
const Sa = /* @__PURE__ */ M.define(), Aa = /* @__PURE__ */ M.define(), Ca = /* @__PURE__ */ M.define(), Ma = /* @__PURE__ */ M.define(), er = /* @__PURE__ */ M.define(), Ta = /* @__PURE__ */ M.define(), Oa = /* @__PURE__ */ M.define(), Rr = /* @__PURE__ */ M.define(), Lr = /* @__PURE__ */ M.define(), Ea = /* @__PURE__ */ M.define({
  combine: (n) => n.some((t) => t)
}), Da = /* @__PURE__ */ M.define({
  combine: (n) => n.some((t) => t)
}), Ra = /* @__PURE__ */ M.define();
class Ge {
  constructor(t, e, i, s, r, o = !1) {
    this.range = t, this.y = e, this.x = i, this.yMargin = s, this.xMargin = r, this.isSnapshot = o;
  }
  map(t) {
    return t.empty ? this : new Ge(this.range.map(t), this.y, this.x, this.yMargin, this.xMargin, this.isSnapshot);
  }
  clip(t) {
    return this.range.to <= t.doc.length ? this : new Ge(y.cursor(t.doc.length), this.y, this.x, this.yMargin, this.xMargin, this.isSnapshot);
  }
}
const Qi = /* @__PURE__ */ F.define({ map: (n, t) => n.map(t) }), La = /* @__PURE__ */ F.define();
function Pt(n, t, e) {
  let i = n.facet(Ma);
  i.length ? i[0](t) : window.onerror && window.onerror(String(t), e, void 0, void 0, t) || (e ? console.error(e + ":", t) : console.error(t));
}
const te = /* @__PURE__ */ M.define({ combine: (n) => n.length ? n[0] : !0 });
let Df = 0;
const We = /* @__PURE__ */ M.define({
  combine(n) {
    return n.filter((t, e) => {
      for (let i = 0; i < e; i++)
        if (n[i].plugin == t.plugin)
          return !1;
      return !0;
    });
  }
});
class kt {
  constructor(t, e, i, s, r) {
    this.id = t, this.create = e, this.domEventHandlers = i, this.domEventObservers = s, this.baseExtensions = r(this), this.extension = this.baseExtensions.concat(We.of({ plugin: this, arg: void 0 }));
  }
  /**
  Create an extension for this plugin with the given argument.
  */
  of(t) {
    return this.baseExtensions.concat(We.of({ plugin: this, arg: t }));
  }
  /**
  Define a plugin from a constructor function that creates the
  plugin's value, given an editor view.
  */
  static define(t, e) {
    const { eventHandlers: i, eventObservers: s, provide: r, decorations: o } = e || {};
    return new kt(Df++, t, i, s, (l) => {
      let a = [];
      return o && a.push(jn.of((h) => {
        let c = h.plugin(l);
        return c ? o(c) : K.none;
      })), r && a.push(r(l)), a;
    });
  }
  /**
  Create a plugin for a class whose constructor takes a single
  editor view as argument.
  */
  static fromClass(t, e) {
    return kt.define((i, s) => new t(i, s), e);
  }
}
class us {
  constructor(t) {
    this.spec = t, this.mustUpdate = null, this.value = null;
  }
  get plugin() {
    return this.spec && this.spec.plugin;
  }
  update(t) {
    if (this.value) {
      if (this.mustUpdate) {
        let e = this.mustUpdate;
        if (this.mustUpdate = null, this.value.update)
          try {
            this.value.update(e);
          } catch (i) {
            if (Pt(e.state, i, "CodeMirror plugin crashed"), this.value.destroy)
              try {
                this.value.destroy();
              } catch {
              }
            this.deactivate();
          }
      }
    } else if (this.spec)
      try {
        this.value = this.spec.plugin.create(t, this.spec.arg);
      } catch (e) {
        Pt(t.state, e, "CodeMirror plugin crashed"), this.deactivate();
      }
    return this;
  }
  destroy(t) {
    var e;
    if (!((e = this.value) === null || e === void 0) && e.destroy)
      try {
        this.value.destroy();
      } catch (i) {
        Pt(t.state, i, "CodeMirror plugin crashed");
      }
  }
  deactivate() {
    this.spec = this.value = null;
  }
}
const Ba = /* @__PURE__ */ M.define(), Br = /* @__PURE__ */ M.define(), jn = /* @__PURE__ */ M.define(), Pa = /* @__PURE__ */ M.define(), Pr = /* @__PURE__ */ M.define(), qi = /* @__PURE__ */ M.define(), Ia = /* @__PURE__ */ M.define();
function Eo(n, t) {
  let e = n.state.facet(Ia);
  if (!e.length)
    return e;
  let i = e.map((r) => r instanceof Function ? r(n) : r), s = [];
  return B.spans(i, t.from, t.to, {
    point() {
    },
    span(r, o, l, a) {
      let h = r - t.from, c = o - t.from, f = s;
      for (let u = l.length - 1; u >= 0; u--, a--) {
        let d = l[u].spec.bidiIsolate, p;
        if (d == null && (d = Ef(t.text, h, c)), a > 0 && f.length && (p = f[f.length - 1]).to == h && p.direction == d)
          p.to = c, f = p.inner;
        else {
          let g = { from: h, to: c, direction: d, inner: [] };
          f.push(g), f = g.inner;
        }
      }
    }
  }), s;
}
const Na = /* @__PURE__ */ M.define();
function Ir(n) {
  let t = 0, e = 0, i = 0, s = 0;
  for (let r of n.state.facet(Na)) {
    let o = r(n);
    o && (o.left != null && (t = Math.max(t, o.left)), o.right != null && (e = Math.max(e, o.right)), o.top != null && (i = Math.max(i, o.top)), o.bottom != null && (s = Math.max(s, o.bottom)));
  }
  return { left: t, right: e, top: i, bottom: s };
}
const mi = /* @__PURE__ */ M.define();
class Tt {
  constructor(t, e, i, s) {
    this.fromA = t, this.toA = e, this.fromB = i, this.toB = s;
  }
  join(t) {
    return new Tt(Math.min(this.fromA, t.fromA), Math.max(this.toA, t.toA), Math.min(this.fromB, t.fromB), Math.max(this.toB, t.toB));
  }
  addToSet(t) {
    let e = t.length, i = this;
    for (; e > 0; e--) {
      let s = t[e - 1];
      if (!(s.fromA > i.toA)) {
        if (s.toA < i.fromA)
          break;
        i = i.join(s), t.splice(e - 1, 1);
      }
    }
    return t.splice(e, 0, i), t;
  }
  // Extend a set to cover all the content in `ranges`, which is a
  // flat array with each pair of numbers representing fromB/toB
  // positions. These pairs are generated in unchanged ranges, so the
  // offset between doc A and doc B is the same for their start and
  // end points.
  static extendWithRanges(t, e) {
    if (e.length == 0)
      return t;
    let i = [];
    for (let s = 0, r = 0, o = 0; ; ) {
      let l = s < t.length ? t[s].fromB : 1e9, a = r < e.length ? e[r] : 1e9, h = Math.min(l, a);
      if (h == 1e9)
        break;
      let c = h + o, f = h, u = c;
      for (; ; )
        if (r < e.length && e[r] <= f) {
          let d = e[r + 1];
          r += 2, f = Math.max(f, d);
          for (let p = s; p < t.length && t[p].fromB <= f; p++)
            o = t[p].toA - t[p].toB;
          u = Math.max(u, d + o);
        } else if (s < t.length && t[s].fromB <= f) {
          let d = t[s++];
          f = Math.max(f, d.toB), u = Math.max(u, d.toA), o = d.toA - d.toB;
        } else
          break;
      i.push(new Tt(c, u, h, f));
    }
    return i;
  }
}
class Dn {
  constructor(t, e, i) {
    this.view = t, this.state = e, this.transactions = i, this.flags = 0, this.startState = t.state, this.changes = Q.empty(this.startState.doc.length);
    for (let r of i)
      this.changes = this.changes.compose(r.changes);
    let s = [];
    this.changes.iterChangedRanges((r, o, l, a) => s.push(new Tt(r, o, l, a))), this.changedRanges = s;
  }
  /**
  @internal
  */
  static create(t, e, i) {
    return new Dn(t, e, i);
  }
  /**
  Tells you whether the [viewport](https://codemirror.net/6/docs/ref/#view.EditorView.viewport) or
  [visible ranges](https://codemirror.net/6/docs/ref/#view.EditorView.visibleRanges) changed in this
  update.
  */
  get viewportChanged() {
    return (this.flags & 4) > 0;
  }
  /**
  Returns true when
  [`viewportChanged`](https://codemirror.net/6/docs/ref/#view.ViewUpdate.viewportChanged) is true
  and the viewport change is not just the result of mapping it in
  response to document changes.
  */
  get viewportMoved() {
    return (this.flags & 8) > 0;
  }
  /**
  Indicates whether the height of a block element in the editor
  changed in this update.
  */
  get heightChanged() {
    return (this.flags & 2) > 0;
  }
  /**
  Returns true when the document was modified or the size of the
  editor, or elements within the editor, changed.
  */
  get geometryChanged() {
    return this.docChanged || (this.flags & 18) > 0;
  }
  /**
  True when this update indicates a focus change.
  */
  get focusChanged() {
    return (this.flags & 1) > 0;
  }
  /**
  Whether the document changed in this update.
  */
  get docChanged() {
    return !this.changes.empty;
  }
  /**
  Whether the selection was explicitly set in this update.
  */
  get selectionSet() {
    return this.transactions.some((t) => t.selection);
  }
  /**
  @internal
  */
  get empty() {
    return this.flags == 0 && this.transactions.length == 0;
  }
}
const Rf = [];
class J {
  constructor(t, e, i = 0) {
    this.dom = t, this.length = e, this.flags = i, this.parent = null, t.cmTile = this;
  }
  get breakAfter() {
    return this.flags & 1;
  }
  get children() {
    return Rf;
  }
  isWidget() {
    return !1;
  }
  get isHidden() {
    return !1;
  }
  isComposite() {
    return !1;
  }
  isLine() {
    return !1;
  }
  isText() {
    return !1;
  }
  isBlock() {
    return !1;
  }
  get domAttrs() {
    return null;
  }
  sync(t) {
    if (this.flags |= 2, this.flags & 4) {
      this.flags &= -5;
      let e = this.domAttrs;
      e && df(this.dom, e);
    }
  }
  toString() {
    return this.constructor.name + (this.children.length ? `(${this.children})` : "") + (this.breakAfter ? "#" : "");
  }
  destroy() {
    this.parent = null;
  }
  setDOM(t) {
    this.dom = t, t.cmTile = this;
  }
  get posAtStart() {
    return this.parent ? this.parent.posBefore(this) : 0;
  }
  get posAtEnd() {
    return this.posAtStart + this.length;
  }
  posBefore(t, e = this.posAtStart) {
    let i = e;
    for (let s of this.children) {
      if (s == t)
        return i;
      i += s.length + s.breakAfter;
    }
    throw new RangeError("Invalid child in posBefore");
  }
  posAfter(t) {
    return this.posBefore(t) + t.length;
  }
  covers(t) {
    return !0;
  }
  coordsIn(t, e) {
    return null;
  }
  domPosFor(t, e) {
    let i = ue(this.dom), s = this.length ? t > 0 : e > 0;
    return new Bt(this.parent.dom, i + (s ? 1 : 0), t == 0 || t == this.length);
  }
  markDirty(t) {
    this.flags &= -3, t && (this.flags |= 4), this.parent && this.parent.flags & 2 && this.parent.markDirty(!1);
  }
  get overrideDOMText() {
    return null;
  }
  get root() {
    for (let t = this; t; t = t.parent)
      if (t instanceof Kn)
        return t;
    return null;
  }
  static get(t) {
    return t.cmTile;
  }
}
class qn extends J {
  constructor(t) {
    super(t, 0), this._children = [];
  }
  isComposite() {
    return !0;
  }
  get children() {
    return this._children;
  }
  get lastChild() {
    return this.children.length ? this.children[this.children.length - 1] : null;
  }
  append(t) {
    this.children.push(t), t.parent = this;
  }
  sync(t) {
    if (this.flags & 2)
      return;
    super.sync(t);
    let e = this.dom, i = null, s, r = t?.node == e ? t : null, o = 0;
    for (let l of this.children) {
      if (l.sync(t), o += l.length + l.breakAfter, s = i ? i.nextSibling : e.firstChild, r && s != l.dom && (r.written = !0), l.dom.parentNode == e)
        for (; s && s != l.dom; )
          s = Do(s);
      else
        e.insertBefore(l.dom, s);
      i = l.dom;
    }
    for (s = i ? i.nextSibling : e.firstChild, r && s && (r.written = !0); s; )
      s = Do(s);
    this.length = o;
  }
}
function Do(n) {
  let t = n.nextSibling;
  return n.parentNode.removeChild(n), t;
}
class Kn extends qn {
  constructor(t, e) {
    super(e), this.view = t;
  }
  owns(t) {
    for (; t; t = t.parent)
      if (t == this)
        return !0;
    return !1;
  }
  isBlock() {
    return !0;
  }
  nearest(t) {
    for (; ; ) {
      if (!t)
        return null;
      let e = J.get(t);
      if (e && this.owns(e))
        return e;
      t = t.parentNode;
    }
  }
  blockTiles(t) {
    for (let e = [], i = this, s = 0, r = 0; ; )
      if (s == i.children.length) {
        if (!e.length)
          return;
        i = i.parent, i.breakAfter && r++, s = e.pop();
      } else {
        let o = i.children[s++];
        if (o instanceof ie)
          e.push(s), i = o, s = 0;
        else {
          let l = r + o.length, a = t(o, r);
          if (a !== void 0)
            return a;
          r = l + o.breakAfter;
        }
      }
  }
  // Find the block at the given position. If side < -1, make sure to
  // stay before block widgets at that position, if side > 1, after
  // such widgets (used for selection drawing, which needs to be able
  // to get coordinates for positions that aren't valid cursor positions).
  resolveBlock(t, e) {
    let i, s = -1, r, o = -1;
    if (this.blockTiles((l, a) => {
      let h = a + l.length;
      if (t >= a && t <= h) {
        if (l.isWidget() && e >= -1 && e <= 1) {
          if (l.flags & 32)
            return !0;
          l.flags & 16 && (i = void 0);
        }
        (a < t || t == h && (e < -1 ? l.length : l.covers(1))) && (!i || !l.isWidget() && i.isWidget()) && (i = l, s = t - a), (h > t || t == a && (e > 1 ? l.length : l.covers(-1))) && (!r || !l.isWidget() && r.isWidget()) && (r = l, o = t - a);
      }
    }), !i && !r)
      throw new Error("No tile at position " + t);
    return i && e < 0 || !r ? { tile: i, offset: s } : { tile: r, offset: o };
  }
}
class ie extends qn {
  constructor(t, e) {
    super(t), this.wrapper = e;
  }
  isBlock() {
    return !0;
  }
  covers(t) {
    return this.children.length ? t < 0 ? this.children[0].covers(-1) : this.lastChild.covers(1) : !1;
  }
  get domAttrs() {
    return this.wrapper.attributes;
  }
  static of(t, e) {
    let i = new ie(e || document.createElement(t.tagName), t);
    return e || (i.flags |= 4), i;
  }
}
class Ze extends qn {
  constructor(t, e) {
    super(t), this.attrs = e;
  }
  isLine() {
    return !0;
  }
  static start(t, e, i) {
    let s = new Ze(e || document.createElement("div"), t);
    return (!e || !i) && (s.flags |= 4), s;
  }
  get domAttrs() {
    return this.attrs;
  }
  // Find the tile associated with a given position in this line.
  resolveInline(t, e, i) {
    let s = null, r = -1, o = null, l = -1;
    function a(c, f) {
      for (let u = 0, d = 0; u < c.children.length && d <= f; u++) {
        let p = c.children[u], g = d + p.length;
        g >= f && (p.isComposite() ? a(p, f - d) : (!o || o.isHidden && (e > 0 || i && Bf(o, p))) && (g > f || p.flags & 32) ? (o = p, l = f - d) : (d < f || p.flags & 16 && !p.isHidden) && (s = p, r = f - d)), d = g;
      }
    }
    a(this, t);
    let h = (e < 0 ? s : o) || s || o;
    return h ? { tile: h, offset: h == s ? r : l } : null;
  }
  coordsIn(t, e) {
    let i = this.resolveInline(t, e, !0);
    return i ? i.tile.coordsIn(Math.max(0, i.offset), e) : Lf(this);
  }
  domIn(t, e) {
    let i = this.resolveInline(t, e);
    if (i) {
      let { tile: s, offset: r } = i;
      if (this.dom.contains(s.dom))
        return s.isText() ? new Bt(s.dom, Math.min(s.dom.nodeValue.length, r)) : s.domPosFor(r, s.flags & 16 ? 1 : s.flags & 32 ? -1 : e);
      let o = i.tile.parent, l = !1;
      for (let a of o.children) {
        if (l)
          return new Bt(a.dom, 0);
        a == i.tile && (l = !0);
      }
    }
    return new Bt(this.dom, 0);
  }
}
function Lf(n) {
  let t = n.dom.lastChild;
  if (!t)
    return n.dom.getBoundingClientRect();
  let e = wn(t);
  return e[e.length - 1] || null;
}
function Bf(n, t) {
  let e = n.coordsIn(0, 1), i = t.coordsIn(0, 1);
  return e && i && i.top < e.bottom;
}
class gt extends qn {
  constructor(t, e) {
    super(t), this.mark = e;
  }
  get domAttrs() {
    return this.mark.attrs;
  }
  static of(t, e) {
    let i = new gt(e || document.createElement(t.tagName), t);
    return e || (i.flags |= 4), i;
  }
}
class Te extends J {
  constructor(t, e) {
    super(t, e.length), this.text = e;
  }
  sync(t) {
    this.flags & 2 || (super.sync(t), this.dom.nodeValue != this.text && (t && t.node == this.dom && (t.written = !0), this.dom.nodeValue = this.text));
  }
  isText() {
    return !0;
  }
  toString() {
    return JSON.stringify(this.text);
  }
  coordsIn(t, e) {
    let i = this.dom.nodeValue.length;
    t > i && (t = i);
    let s = t, r = t, o = 0;
    t == 0 && e < 0 || t == i && e >= 0 ? C.chrome || C.gecko || (t ? (s--, o = 1) : r < i && (r++, o = -1)) : e < 0 ? s-- : r < i && r++;
    let l = Bi(this.dom, s, r).getClientRects();
    if (!l.length)
      return null;
    let a = l[(o ? o < 0 : e >= 0) ? 0 : l.length - 1];
    return C.safari && !o && a.width == 0 && (a = Array.prototype.find.call(l, (h) => h.width) || a), o ? En(a, o < 0) : a || null;
  }
  static of(t, e) {
    let i = new Te(e || document.createTextNode(t), t);
    return e || (i.flags |= 2), i;
  }
}
class Ie extends J {
  constructor(t, e, i, s) {
    super(t, e, s), this.widget = i;
  }
  isWidget() {
    return !0;
  }
  get isHidden() {
    return this.widget.isHidden;
  }
  covers(t) {
    return this.flags & 48 ? !1 : (this.flags & (t < 0 ? 64 : 128)) > 0;
  }
  coordsIn(t, e) {
    return this.coordsInWidget(t, e, !1);
  }
  coordsInWidget(t, e, i) {
    let s = this.widget.coordsAt(this.dom, t, e);
    if (s)
      return s;
    if (i)
      return En(this.dom.getBoundingClientRect(), this.length ? t == 0 : e <= 0);
    {
      let r = this.dom.getClientRects(), o = null;
      if (!r.length)
        return null;
      let l = this.flags & 16 ? !0 : this.flags & 32 ? !1 : t > 0;
      for (let a = l ? r.length - 1 : 0; o = r[a], !(t > 0 ? a == 0 : a == r.length - 1 || o.top < o.bottom); a += l ? -1 : 1)
        ;
      return En(o, !l);
    }
  }
  get overrideDOMText() {
    if (!this.length)
      return N.empty;
    let { root: t } = this;
    if (!t)
      return N.empty;
    let e = this.posAtStart;
    return t.view.state.doc.slice(e, e + this.length);
  }
  destroy() {
    super.destroy(), this.widget.destroy(this.dom);
  }
  static of(t, e, i, s, r) {
    return r || (r = t.toDOM(e), t.editable || (r.contentEditable = "false")), new Ie(r, i, t, s);
  }
}
class Rn extends J {
  constructor(t) {
    let e = document.createElement("img");
    e.className = "cm-widgetBuffer", e.setAttribute("aria-hidden", "true"), super(e, 0, t);
  }
  get isHidden() {
    return !0;
  }
  get overrideDOMText() {
    return N.empty;
  }
  coordsIn(t) {
    return this.dom.getBoundingClientRect();
  }
}
class Pf {
  constructor(t) {
    this.index = 0, this.beforeBreak = !1, this.parents = [], this.tile = t;
  }
  // Advance by the given distance. If side is -1, stop leaving or
  // entering tiles, or skipping zero-length tiles, once the distance
  // has been traversed. When side is 1, leave, enter, or skip
  // everything at the end position.
  advance(t, e, i) {
    let { tile: s, index: r, beforeBreak: o, parents: l } = this;
    for (; t || e > 0; )
      if (s.isComposite())
        if (o) {
          if (!t)
            break;
          i && i.break(), t--, o = !1;
        } else if (r == s.children.length) {
          if (!t && !l.length)
            break;
          i && i.leave(s), o = !!s.breakAfter, { tile: s, index: r } = l.pop(), r++;
        } else {
          let a = s.children[r], h = a.breakAfter;
          (e > 0 ? a.length <= t : a.length < t) && (!i || i.skip(a, 0, a.length) !== !1 || !a.isComposite) ? (o = !!h, r++, t -= a.length) : (l.push({ tile: s, index: r }), s = a, r = 0, i && a.isComposite() && i.enter(a));
        }
      else if (r == s.length)
        o = !!s.breakAfter, { tile: s, index: r } = l.pop(), r++;
      else if (t) {
        let a = Math.min(t, s.length - r);
        i && i.skip(s, r, r + a), t -= a, r += a;
      } else
        break;
    return this.tile = s, this.index = r, this.beforeBreak = o, this;
  }
  get root() {
    return this.parents.length ? this.parents[0].tile : this.tile;
  }
}
class If {
  constructor(t, e, i, s) {
    this.from = t, this.to = e, this.wrapper = i, this.rank = s;
  }
}
class Nf {
  constructor(t, e, i) {
    this.cache = t, this.root = e, this.blockWrappers = i, this.curLine = null, this.lastBlock = null, this.afterWidget = null, this.pos = 0, this.wrappers = [], this.wrapperPos = 0;
  }
  addText(t, e, i, s) {
    var r;
    this.flushBuffer();
    let o = this.ensureMarks(e, i), l = o.lastChild;
    if (l && l.isText() && !(l.flags & 8) && l.length + t.length < 512) {
      this.cache.reused.set(
        l,
        2
        /* Reused.DOM */
      );
      let a = o.children[o.children.length - 1] = new Te(l.dom, l.text + t);
      a.parent = o;
    } else
      o.append(s || Te.of(t, (r = this.cache.find(Te)) === null || r === void 0 ? void 0 : r.dom));
    this.pos += t.length, this.afterWidget = null;
  }
  addComposition(t, e) {
    let i = this.curLine;
    i.dom != e.line.dom && (i.setDOM(this.cache.reused.has(e.line) ? ds(e.line.dom) : e.line.dom), this.cache.reused.set(
      e.line,
      2
      /* Reused.DOM */
    ));
    let s = i;
    for (let l = e.marks.length - 1; l >= 0; l--) {
      let a = e.marks[l], h = s.lastChild;
      if (h instanceof gt && h.mark.eq(a.mark))
        h.dom != a.dom && h.setDOM(ds(a.dom)), s = h;
      else {
        if (this.cache.reused.get(a)) {
          let f = J.get(a.dom);
          f && f.setDOM(ds(a.dom));
        }
        let c = gt.of(a.mark, a.dom);
        s.append(c), s = c;
      }
      this.cache.reused.set(
        a,
        2
        /* Reused.DOM */
      );
    }
    let r = J.get(t.text);
    r && this.cache.reused.set(
      r,
      2
      /* Reused.DOM */
    );
    let o = new Te(t.text, t.text.nodeValue);
    o.flags |= 8, this.pos = t.range.toB, s.append(o);
  }
  addInlineWidget(t, e, i) {
    let s = this.afterWidget && t.flags & 48 && (this.afterWidget.flags & 48) == (t.flags & 48);
    s || this.flushBuffer();
    let r = this.ensureMarks(e, i);
    !s && !(t.flags & 16) && r.append(this.getBuffer(1)), r.append(t), this.pos += t.length, this.afterWidget = t;
  }
  addMark(t, e, i) {
    this.flushBuffer(), this.ensureMarks(e, i).append(t), this.pos += t.length, this.afterWidget = null;
  }
  addBlockWidget(t) {
    this.getBlockPos().append(t), this.pos += t.length, this.lastBlock = t, this.endLine();
  }
  continueWidget(t) {
    let e = this.afterWidget || this.lastBlock;
    e.length += t, this.pos += t;
  }
  addLineStart(t, e) {
    var i;
    t || (t = $a);
    let s = Ze.start(t, e || ((i = this.cache.find(Ze)) === null || i === void 0 ? void 0 : i.dom), !!e);
    this.getBlockPos().append(this.lastBlock = this.curLine = s);
  }
  addLine(t) {
    this.getBlockPos().append(t), this.pos += t.length, this.lastBlock = t, this.endLine();
  }
  addBreak() {
    this.lastBlock.flags |= 1, this.endLine(), this.pos++;
  }
  addLineStartIfNotCovered(t) {
    this.blockPosCovered() || this.addLineStart(t);
  }
  ensureLine(t) {
    this.curLine || this.addLineStart(t);
  }
  ensureMarks(t, e) {
    var i;
    let s = this.curLine;
    for (let r = t.length - 1; r >= 0; r--) {
      let o = t[r], l;
      if (e > 0 && (l = s.lastChild) && l instanceof gt && l.mark.eq(o))
        s = l, e--;
      else {
        let a = gt.of(o, (i = this.cache.find(gt, (h) => h.mark.eq(o))) === null || i === void 0 ? void 0 : i.dom);
        s.append(a), s = a, e = 0;
      }
    }
    return s;
  }
  endLine() {
    if (this.curLine) {
      this.flushBuffer();
      let t = this.curLine.lastChild;
      (!t || !Ro(this.curLine, !1) || t.dom.nodeName != "BR" && t.isWidget() && !(C.ios && Ro(this.curLine, !0))) && this.curLine.append(this.cache.findWidget(
        ps,
        0,
        32
        /* TileFlag.After */
      ) || new Ie(
        ps.toDOM(),
        0,
        ps,
        32
        /* TileFlag.After */
      )), this.curLine = this.afterWidget = null;
    }
  }
  updateBlockWrappers() {
    this.wrapperPos > this.pos + 1e4 && (this.blockWrappers.goto(this.pos), this.wrappers.length = 0);
    for (let t = this.wrappers.length - 1; t >= 0; t--)
      this.wrappers[t].to < this.pos && this.wrappers.splice(t, 1);
    for (let t = this.blockWrappers; t.value && t.from <= this.pos; t.next())
      if (t.to >= this.pos) {
        let e = new If(t.from, t.to, t.value, t.rank), i = this.wrappers.length;
        for (; i > 0 && (this.wrappers[i - 1].rank - e.rank || this.wrappers[i - 1].to - e.to) < 0; )
          i--;
        this.wrappers.splice(i, 0, e);
      }
    this.wrapperPos = this.pos;
  }
  getBlockPos() {
    var t;
    this.updateBlockWrappers();
    let e = this.root;
    for (let i of this.wrappers) {
      let s = e.lastChild;
      if (i.from < this.pos && s instanceof ie && s.wrapper.eq(i.wrapper))
        e = s;
      else {
        let r = ie.of(i.wrapper, (t = this.cache.find(ie, (o) => o.wrapper.eq(i.wrapper))) === null || t === void 0 ? void 0 : t.dom);
        e.append(r), e = r;
      }
    }
    return e;
  }
  blockPosCovered() {
    let t = this.lastBlock;
    return t != null && !t.breakAfter && (!t.isWidget() || (t.flags & 160) > 0);
  }
  getBuffer(t) {
    let e = 2 | (t < 0 ? 16 : 32), i = this.cache.find(
      Rn,
      void 0,
      1
      /* Reused.Full */
    );
    return i && (i.flags = e), i || new Rn(e);
  }
  flushBuffer() {
    this.afterWidget && !(this.afterWidget.flags & 32) && (this.afterWidget.parent.append(this.getBuffer(-1)), this.afterWidget = null);
  }
}
class $f {
  constructor(t) {
    this.skipCount = 0, this.text = "", this.textOff = 0, this.cursor = t.iter();
  }
  skip(t) {
    this.textOff + t <= this.text.length ? this.textOff += t : (this.skipCount += t - (this.text.length - this.textOff), this.text = "", this.textOff = 0);
  }
  next(t) {
    if (this.textOff == this.text.length) {
      let { value: s, lineBreak: r, done: o } = this.cursor.next(this.skipCount);
      if (this.skipCount = 0, o)
        throw new Error("Ran out of text content when drawing inline views");
      this.text = s;
      let l = this.textOff = Math.min(t, s.length);
      return r ? null : s.slice(0, l);
    }
    let e = Math.min(this.text.length, this.textOff + t), i = this.text.slice(this.textOff, e);
    return this.textOff = e, i;
  }
}
const Ln = [Ie, Ze, Te, gt, Rn, ie, Kn];
for (let n = 0; n < Ln.length; n++)
  Ln[n].bucket = n;
class Hf {
  constructor(t) {
    this.view = t, this.buckets = Ln.map(() => []), this.index = Ln.map(() => 0), this.reused = /* @__PURE__ */ new Map();
  }
  // Put a tile in the cache.
  add(t) {
    let e = t.constructor.bucket, i = this.buckets[e];
    i.length < 6 ? i.push(t) : i[
      this.index[e] = (this.index[e] + 1) % 6
      /* C.Bucket */
    ] = t;
  }
  find(t, e, i = 2) {
    let s = t.bucket, r = this.buckets[s], o = this.index[s];
    for (let l = r.length - 1; l >= 0; l--) {
      let a = (l + o) % r.length, h = r[a];
      if ((!e || e(h)) && !this.reused.has(h))
        return r.splice(a, 1), a < o && this.index[s]--, this.reused.set(h, i), h;
    }
    return null;
  }
  findWidget(t, e, i) {
    let s = this.buckets[0];
    if (s.length)
      for (let r = 0, o = 0; ; r++) {
        if (r == s.length) {
          if (o)
            return null;
          o = 1, r = 0;
        }
        let l = s[r];
        if (!this.reused.has(l) && (o == 0 ? l.widget.compare(t) : l.widget.constructor == t.constructor && t.updateDOM(l.dom, this.view, l.widget)))
          return s.splice(r, 1), r < this.index[0] && this.index[0]--, l.widget == t && l.length == e && (l.flags & 497) == i ? (this.reused.set(
            l,
            1
            /* Reused.Full */
          ), l) : (this.reused.set(
            l,
            2
            /* Reused.DOM */
          ), new Ie(l.dom, e, t, l.flags & -498 | i));
      }
  }
  reuse(t) {
    return this.reused.set(
      t,
      1
      /* Reused.Full */
    ), t;
  }
  maybeReuse(t, e = 2) {
    if (!this.reused.has(t))
      return this.reused.set(t, e), t.dom;
  }
  clear() {
    for (let t = 0; t < this.buckets.length; t++)
      this.buckets[t].length = this.index[t] = 0;
  }
}
class Vf {
  constructor(t, e, i, s, r) {
    this.view = t, this.decorations = s, this.disallowBlockEffectsFor = r, this.openWidget = !1, this.openMarks = 0, this.cache = new Hf(t), this.text = new $f(t.state.doc), this.builder = new Nf(this.cache, new Kn(t, t.contentDOM), B.iter(i)), this.cache.reused.set(
      e,
      2
      /* Reused.DOM */
    ), this.old = new Pf(e), this.reuseWalker = {
      skip: (o, l, a) => {
        if (this.cache.add(o), o.isComposite())
          return !1;
      },
      enter: (o) => this.cache.add(o),
      leave: () => {
      },
      break: () => {
      }
    };
  }
  run(t, e) {
    let i = e && this.getCompositionContext(e.text);
    for (let s = 0, r = 0, o = 0; ; ) {
      let l = o < t.length ? t[o++] : null, a = l ? l.fromA : this.old.root.length;
      if (a > s) {
        let h = a - s;
        this.preserve(h, !o, !l), s = a, r += h;
      }
      if (!l)
        break;
      e && l.fromA <= e.range.fromA && l.toA >= e.range.toA ? (this.forward(l.fromA, e.range.fromA, e.range.fromA < e.range.toA ? 1 : -1), this.emit(r, e.range.fromB), this.cache.clear(), this.builder.addComposition(e, i), this.text.skip(e.range.toB - e.range.fromB), this.forward(e.range.fromA, l.toA), this.emit(e.range.toB, l.toB)) : (this.forward(l.fromA, l.toA), this.emit(r, l.toB)), r = l.toB, s = l.toA;
    }
    return this.builder.curLine && this.builder.endLine(), this.builder.root;
  }
  preserve(t, e, i) {
    let s = _f(this.old), r = this.openMarks;
    this.old.advance(t, i ? 1 : -1, {
      skip: (o, l, a) => {
        if (o.isWidget())
          if (this.openWidget)
            this.builder.continueWidget(a - l);
          else {
            let h = a > 0 || l < o.length ? Ie.of(o.widget, this.view, a - l, o.flags & 496, this.cache.maybeReuse(o)) : this.cache.reuse(o);
            h.flags & 256 ? (h.flags &= -2, this.builder.addBlockWidget(h)) : (this.builder.ensureLine(null), this.builder.addInlineWidget(h, s, r), r = s.length);
          }
        else if (o.isText())
          this.builder.ensureLine(null), !l && a == o.length && !this.cache.reused.has(o) ? this.builder.addText(o.text, s, r, this.cache.reuse(o)) : (this.cache.add(o), this.builder.addText(o.text.slice(l, a), s, r)), r = s.length;
        else if (o.isLine())
          o.flags &= -2, this.cache.reused.set(
            o,
            1
            /* Reused.Full */
          ), this.builder.addLine(o);
        else if (o instanceof Rn)
          this.cache.add(o);
        else if (o instanceof gt)
          this.builder.ensureLine(null), this.builder.addMark(o, s, r), this.cache.reused.set(
            o,
            1
            /* Reused.Full */
          ), r = s.length;
        else
          return !1;
        this.openWidget = !1;
      },
      enter: (o) => {
        o.isLine() ? this.builder.addLineStart(o.attrs, this.cache.maybeReuse(o)) : (this.cache.add(o), o instanceof gt && s.unshift(o.mark)), this.openWidget = !1;
      },
      leave: (o) => {
        o.isLine() ? s.length && (s.length = r = 0) : o instanceof gt && (s.shift(), r = Math.min(r, s.length));
      },
      break: () => {
        this.builder.addBreak(), this.openWidget = !1;
      }
    }), this.text.skip(t);
  }
  emit(t, e) {
    let i = null, s = this.builder, r = 0, o = B.spans(this.decorations, t, e, {
      point: (l, a, h, c, f, u) => {
        if (h instanceof Be) {
          if (this.disallowBlockEffectsFor[u]) {
            if (h.block)
              throw new RangeError("Block decorations may not be specified via plugins");
            if (a > this.view.state.doc.lineAt(l).to)
              throw new RangeError("Decorations that replace line breaks may not be specified via plugins");
          }
          if (r = c.length, f > c.length)
            s.continueWidget(a - l);
          else {
            let d = h.widget || (h.block ? Qe.block : Qe.inline), p = Ff(h), g = this.cache.findWidget(d, a - l, p) || Ie.of(d, this.view, a - l, p);
            h.block ? (h.startSide > 0 && s.addLineStartIfNotCovered(i), s.addBlockWidget(g)) : (s.ensureLine(i), s.addInlineWidget(g, c, f));
          }
          i = null;
        } else
          i = Wf(i, h);
        a > l && this.text.skip(a - l);
      },
      span: (l, a, h, c) => {
        for (let f = l; f < a; ) {
          let u = this.text.next(Math.min(512, a - f));
          u == null ? (s.addLineStartIfNotCovered(i), s.addBreak(), f++) : (s.ensureLine(i), s.addText(u, h, f == l ? c : h.length), f += u.length), i = null;
        }
      }
    });
    s.addLineStartIfNotCovered(i), this.openWidget = o > r, this.openMarks = o;
  }
  forward(t, e, i = 1) {
    e - t <= 10 ? this.old.advance(e - t, i, this.reuseWalker) : (this.old.advance(5, -1, this.reuseWalker), this.old.advance(e - t - 10, -1), this.old.advance(5, i, this.reuseWalker));
  }
  getCompositionContext(t) {
    let e = [], i = null;
    for (let s = t.parentNode; ; s = s.parentNode) {
      let r = J.get(s);
      if (s == this.view.contentDOM)
        break;
      r instanceof gt ? e.push(r) : r?.isLine() ? i = r : r instanceof ie || (s.nodeName == "DIV" && !i && s != this.view.contentDOM ? i = new Ze(s, $a) : i || e.push(gt.of(new Ui({ tagName: s.nodeName.toLowerCase(), attributes: pf(s) }), s)));
    }
    return { line: i, marks: e };
  }
}
function Ro(n, t) {
  let e = (i) => {
    for (let s of i.children)
      if ((t ? s.isText() : s.length) || e(s))
        return !0;
    return !1;
  };
  return e(n);
}
function Ff(n) {
  let t = n.isReplace ? (n.startSide < 0 ? 64 : 0) | (n.endSide > 0 ? 128 : 0) : n.startSide > 0 ? 32 : 16;
  return n.block && (t |= 256), t;
}
const $a = { class: "cm-line" };
function Wf(n, t) {
  let e = t.spec.attributes, i = t.spec.class;
  return !e && !i || (n || (n = { class: "cm-line" }), e && Or(e, n), i && (n.class += " " + i)), n;
}
function _f(n) {
  let t = [];
  for (let e = n.parents.length; e > 1; e--) {
    let i = e == n.parents.length ? n.tile : n.parents[e].tile;
    i instanceof gt && t.push(i.mark);
  }
  return t;
}
function ds(n) {
  let t = J.get(n);
  return t && t.setDOM(n.cloneNode()), n;
}
class Qe extends zi {
  constructor(t) {
    super(), this.tag = t;
  }
  eq(t) {
    return t.tag == this.tag;
  }
  toDOM() {
    return document.createElement(this.tag);
  }
  updateDOM(t) {
    return t.nodeName.toLowerCase() == this.tag;
  }
  get isHidden() {
    return !0;
  }
}
Qe.inline = /* @__PURE__ */ new Qe("span");
Qe.block = /* @__PURE__ */ new Qe("div");
const ps = /* @__PURE__ */ new class extends zi {
  toDOM() {
    return document.createElement("br");
  }
  get isHidden() {
    return !0;
  }
  get editable() {
    return !0;
  }
}();
class Lo {
  constructor(t) {
    this.view = t, this.decorations = [], this.blockWrappers = [], this.dynamicDecorationMap = [!1], this.domChanged = null, this.hasComposition = null, this.editContextFormatting = K.none, this.lastCompositionAfterCursor = !1, this.minWidth = 0, this.minWidthFrom = 0, this.minWidthTo = 0, this.impreciseAnchor = null, this.impreciseHead = null, this.forceSelection = !1, this.lastUpdate = Date.now(), this.updateDeco(), this.tile = new Kn(t, t.contentDOM), this.updateInner([new Tt(0, 0, 0, t.state.doc.length)], null);
  }
  // Update the document view to a given state.
  update(t) {
    var e;
    let i = t.changedRanges;
    this.minWidth > 0 && i.length && (i.every(({ fromA: c, toA: f }) => f < this.minWidthFrom || c > this.minWidthTo) ? (this.minWidthFrom = t.changes.mapPos(this.minWidthFrom, 1), this.minWidthTo = t.changes.mapPos(this.minWidthTo, 1)) : this.minWidth = this.minWidthFrom = this.minWidthTo = 0), this.updateEditContextFormatting(t);
    let s = -1;
    this.view.inputState.composing >= 0 && !this.view.observer.editContext && (!((e = this.domChanged) === null || e === void 0) && e.newSel ? s = this.domChanged.newSel.head : !Xf(t.changes, this.hasComposition) && !t.selectionSet && (s = t.state.selection.main.head));
    let r = s > -1 ? Uf(this.view, t.changes, s) : null;
    if (this.domChanged = null, this.hasComposition) {
      let { from: c, to: f } = this.hasComposition;
      i = new Tt(c, f, t.changes.mapPos(c, -1), t.changes.mapPos(f, 1)).addToSet(i.slice());
    }
    this.hasComposition = r ? { from: r.range.fromB, to: r.range.toB } : null, (C.ie || C.chrome) && !r && t && t.state.doc.lines != t.startState.doc.lines && (this.forceSelection = !0);
    let o = this.decorations, l = this.blockWrappers;
    this.updateDeco();
    let a = Kf(o, this.decorations, t.changes);
    a.length && (i = Tt.extendWithRanges(i, a));
    let h = Jf(l, this.blockWrappers, t.changes);
    return h.length && (i = Tt.extendWithRanges(i, h)), r && !i.some((c) => c.fromA <= r.range.fromA && c.toA >= r.range.toA) && (i = r.range.addToSet(i.slice())), this.tile.flags & 2 && i.length == 0 ? !1 : (this.updateInner(i, r), t.transactions.length && (this.lastUpdate = Date.now()), !0);
  }
  // Used by update and the constructor do perform the actual DOM
  // update
  updateInner(t, e) {
    this.view.viewState.mustMeasureContent = !0;
    let { observer: i } = this.view;
    i.ignore(() => {
      if (e || t.length) {
        let o = this.tile, l = new Vf(this.view, o, this.blockWrappers, this.decorations, this.dynamicDecorationMap);
        e && J.get(e.text) && l.cache.reused.set(
          J.get(e.text),
          2
          /* Reused.DOM */
        ), this.tile = l.run(t, e), ir(o, l.cache.reused);
      }
      this.tile.dom.style.height = this.view.viewState.contentHeight / this.view.scaleY + "px", this.tile.dom.style.flexBasis = this.minWidth ? this.minWidth + "px" : "";
      let r = C.chrome || C.ios ? { node: i.selectionRange.focusNode, written: !1 } : void 0;
      this.tile.sync(r), r && (r.written || i.selectionRange.focusNode != r.node || !this.tile.dom.contains(r.node)) && (this.forceSelection = !0), this.tile.dom.style.height = "";
    });
    let s = [];
    if (this.view.viewport.from || this.view.viewport.to < this.view.state.doc.length)
      for (let r of this.tile.children)
        r.isWidget() && r.widget instanceof gs && s.push(r.dom);
    i.updateGaps(s);
  }
  updateEditContextFormatting(t) {
    this.editContextFormatting = this.editContextFormatting.map(t.changes);
    for (let e of t.transactions)
      for (let i of e.effects)
        i.is(La) && (this.editContextFormatting = i.value);
  }
  // Sync the DOM selection to this.state.selection
  updateSelection(t = !1, e = !1) {
    (t || !this.view.observer.selectionRange.focusNode) && this.view.observer.readSelectionRange();
    let { dom: i } = this.tile, s = this.view.root.activeElement, r = s == i, o = !r && !(this.view.state.facet(te) || i.tabIndex > -1) && xi(i, this.view.observer.selectionRange) && !(s && i.contains(s));
    if (!(r || e || o))
      return;
    let l = this.forceSelection;
    this.forceSelection = !1;
    let a = this.view.state.selection.main, h, c;
    if (a.empty ? c = h = this.inlineDOMNearPos(a.anchor, a.assoc || 1) : (c = this.inlineDOMNearPos(a.head, a.head == a.from ? 1 : -1), h = this.inlineDOMNearPos(a.anchor, a.anchor == a.from ? 1 : -1)), C.gecko && a.empty && !this.hasComposition && zf(h)) {
      let u = document.createTextNode("");
      this.view.observer.ignore(() => h.node.insertBefore(u, h.node.childNodes[h.offset] || null)), h = c = new Bt(u, 0), l = !0;
    }
    let f = this.view.observer.selectionRange;
    (l || !f.focusNode || (!ki(h.node, h.offset, f.anchorNode, f.anchorOffset) || !ki(c.node, c.offset, f.focusNode, f.focusOffset)) && !this.suppressWidgetCursorChange(f, a)) && (this.view.observer.ignore(() => {
      C.android && C.chrome && i.contains(f.focusNode) && Yf(f.focusNode, i) && (i.blur(), i.focus({ preventScroll: !0 }));
      let u = Li(this.view.root);
      if (u) if (a.empty) {
        if (C.gecko) {
          let d = jf(h.node, h.offset);
          if (d && d != 3) {
            let p = (d == 1 ? ma : ba)(h.node, h.offset);
            p && (h = new Bt(p.node, p.offset));
          }
        }
        u.collapse(h.node, h.offset), a.bidiLevel != null && u.caretBidiLevel !== void 0 && (u.caretBidiLevel = a.bidiLevel);
      } else if (u.extend) {
        u.collapse(h.node, h.offset);
        try {
          u.extend(c.node, c.offset);
        } catch {
        }
      } else {
        let d = document.createRange();
        a.anchor > a.head && ([h, c] = [c, h]), d.setEnd(c.node, c.offset), d.setStart(h.node, h.offset), u.removeAllRanges(), u.addRange(d);
      }
      o && this.view.root.activeElement == i && (i.blur(), s && s.focus());
    }), this.view.observer.setSelectionRange(h, c)), this.impreciseAnchor = h.precise ? null : new Bt(f.anchorNode, f.anchorOffset), this.impreciseHead = c.precise ? null : new Bt(f.focusNode, f.focusOffset);
  }
  // If a zero-length widget is inserted next to the cursor during
  // composition, avoid moving it across it and disrupting the
  // composition.
  suppressWidgetCursorChange(t, e) {
    return this.hasComposition && e.empty && ki(t.focusNode, t.focusOffset, t.anchorNode, t.anchorOffset) && this.posFromDOM(t.focusNode, t.focusOffset) == e.head;
  }
  enforceCursorAssoc() {
    if (this.hasComposition)
      return;
    let { view: t } = this, e = t.state.selection.main, i = Li(t.root), { anchorNode: s, anchorOffset: r } = t.observer.selectionRange;
    if (!i || !e.empty || !e.assoc || !i.modify)
      return;
    let o = this.lineAt(e.head, e.assoc);
    if (!o)
      return;
    let l = o.posAtStart;
    if (e.head == l || e.head == l + o.length)
      return;
    let a = this.coordsAt(e.head, -1), h = this.coordsAt(e.head, 1);
    if (!a || !h || a.bottom > h.top)
      return;
    let c = this.domAtPos(e.head + e.assoc, e.assoc);
    i.collapse(c.node, c.offset), i.modify("move", e.assoc < 0 ? "forward" : "backward", "lineboundary"), t.observer.readSelectionRange();
    let f = t.observer.selectionRange;
    t.docView.posFromDOM(f.anchorNode, f.anchorOffset) != e.from && i.collapse(s, r);
  }
  posFromDOM(t, e) {
    let i = this.tile.nearest(t);
    if (!i)
      return this.tile.dom.compareDocumentPosition(t) & 2 ? 0 : this.view.state.doc.length;
    let s = i.posAtStart;
    if (i.isComposite()) {
      let r;
      if (t == i.dom)
        r = i.dom.childNodes[e];
      else {
        let o = ne(t) == 0 ? 0 : e == 0 ? -1 : 1;
        for (; ; ) {
          let l = t.parentNode;
          if (l == i.dom)
            break;
          o == 0 && l.firstChild != l.lastChild && (t == l.firstChild ? o = -1 : o = 1), t = l;
        }
        o < 0 ? r = t : r = t.nextSibling;
      }
      if (r == i.dom.firstChild)
        return s;
      for (; r && !J.get(r); )
        r = r.nextSibling;
      if (!r)
        return s + i.length;
      for (let o = 0, l = s; ; o++) {
        let a = i.children[o];
        if (a.dom == r)
          return l;
        l += a.length + a.breakAfter;
      }
    } else return i.isText() ? t == i.dom ? s + e : s + (e ? i.length : 0) : s;
  }
  domAtPos(t, e) {
    let { tile: i, offset: s } = this.tile.resolveBlock(t, e);
    return i.isWidget() ? i.domPosFor(t, e) : i.domIn(s, e);
  }
  inlineDOMNearPos(t, e) {
    let i, s = -1, r = !1, o, l = -1, a = !1;
    return this.tile.blockTiles((h, c) => {
      if (h.isWidget()) {
        if (h.flags & 32 && c >= t)
          return !0;
        h.flags & 16 && (r = !0);
      } else {
        let f = c + h.length;
        if (c <= t && (i = h, s = t - c, r = f < t), f >= t && !o && (o = h, l = t - c, a = c > t), c > t && o)
          return !0;
      }
    }), !i && !o ? this.domAtPos(t, e) : (r && o ? i = null : a && i && (o = null), i && e < 0 || !o ? i.domIn(s, e) : o.domIn(l, e));
  }
  coordsAt(t, e) {
    let { tile: i, offset: s } = this.tile.resolveBlock(t, e);
    return i.isWidget() ? i.widget instanceof gs ? null : i.coordsInWidget(s, e, !0) : i.coordsIn(s, e);
  }
  lineAt(t, e) {
    let { tile: i } = this.tile.resolveBlock(t, e);
    return i.isLine() ? i : null;
  }
  coordsForChar(t) {
    let { tile: e, offset: i } = this.tile.resolveBlock(t, 1);
    if (!e.isLine())
      return null;
    function s(r, o) {
      if (r.isComposite())
        for (let l of r.children) {
          if (l.length >= o) {
            let a = s(l, o);
            if (a)
              return a;
          }
          if (o -= l.length, o < 0)
            break;
        }
      else if (r.isText() && o < r.length) {
        let l = at(r.text, o);
        if (l == o)
          return null;
        let a = Bi(r.dom, o, l).getClientRects();
        for (let h = 0; h < a.length; h++) {
          let c = a[h];
          if (h == a.length - 1 || c.top < c.bottom && c.left < c.right)
            return c;
        }
      }
      return null;
    }
    return s(e, i);
  }
  measureVisibleLineHeights(t) {
    let e = [], { from: i, to: s } = t, r = this.view.contentDOM.clientWidth, o = r > Math.max(this.view.scrollDOM.clientWidth, this.minWidth) + 1, l = -1, a = this.view.textDirection == j.LTR, h = 0, c = (f, u, d) => {
      for (let p = 0; p < f.children.length && !(u > s); p++) {
        let g = f.children[p], m = u + g.length, b = g.dom.getBoundingClientRect(), { height: v } = b;
        if (d && !p && (h += b.top - d.top), g instanceof ie)
          m > i && c(g, u, b);
        else if (u >= i && (h > 0 && e.push(-h), e.push(v + h), h = 0, o)) {
          let w = g.dom.lastChild, O = w ? wn(w) : [];
          if (O.length) {
            let k = O[O.length - 1], S = a ? k.right - b.left : b.right - k.left;
            S > l && (l = S, this.minWidth = r, this.minWidthFrom = u, this.minWidthTo = m);
          }
        }
        d && p == f.children.length - 1 && (h += d.bottom - b.bottom), u = m + g.breakAfter;
      }
    };
    return c(this.tile, 0, null), e;
  }
  textDirectionAt(t) {
    let { tile: e } = this.tile.resolveBlock(t, 1);
    return getComputedStyle(e.dom).direction == "rtl" ? j.RTL : j.LTR;
  }
  measureTextSize() {
    let t = this.tile.blockTiles((o) => {
      if (o.isLine() && o.children.length && o.length <= 20) {
        let l = 0, a;
        for (let h of o.children) {
          if (!h.isText() || /[^ -~]/.test(h.text))
            return;
          let c = wn(h.dom);
          if (c.length != 1)
            return;
          l += c[0].width, a = c[0].height;
        }
        if (l)
          return {
            lineHeight: o.dom.getBoundingClientRect().height,
            charWidth: l / o.length,
            textHeight: a
          };
      }
    });
    if (t)
      return t;
    let e = document.createElement("div"), i, s, r;
    return e.className = "cm-line", e.style.width = "99999px", e.style.position = "absolute", e.textContent = "abc def ghi jkl mno pqr stu", this.view.observer.ignore(() => {
      this.tile.dom.appendChild(e);
      let o = wn(e.firstChild)[0];
      i = e.getBoundingClientRect().height, s = o && o.width ? o.width / 27 : 7, r = o && o.height ? o.height : i, e.remove();
    }), { lineHeight: i, charWidth: s, textHeight: r };
  }
  computeBlockGapDeco() {
    let t = [], e = this.view.viewState;
    for (let i = 0, s = 0; ; s++) {
      let r = s == e.viewports.length ? null : e.viewports[s], o = r ? r.from - 1 : this.view.state.doc.length;
      if (o > i) {
        let l = (e.lineBlockAt(o).bottom - e.lineBlockAt(i).top) / this.view.scaleY;
        t.push(K.replace({
          widget: new gs(l),
          block: !0,
          inclusive: !0,
          isBlockGap: !0
        }).range(i, o));
      }
      if (!r)
        break;
      i = r.to + 1;
    }
    return K.set(t);
  }
  updateDeco() {
    let t = 1, e = this.view.state.facet(jn).map((r) => (this.dynamicDecorationMap[t++] = typeof r == "function") ? r(this.view) : r), i = !1, s = this.view.state.facet(Pr).map((r, o) => {
      let l = typeof r == "function";
      return l && (i = !0), l ? r(this.view) : r;
    });
    for (s.length && (this.dynamicDecorationMap[t++] = i, e.push(B.join(s))), this.decorations = [
      this.editContextFormatting,
      ...e,
      this.computeBlockGapDeco(),
      this.view.viewState.lineGapDeco
    ]; t < this.decorations.length; )
      this.dynamicDecorationMap[t++] = !1;
    this.blockWrappers = this.view.state.facet(Pa).map((r) => typeof r == "function" ? r(this.view) : r);
  }
  scrollIntoView(t) {
    var e;
    if (t.isSnapshot) {
      let c = this.view.viewState.lineBlockAt(t.range.head);
      this.view.scrollDOM.scrollTop = c.top - t.yMargin, this.view.scrollDOM.scrollLeft = t.xMargin;
      return;
    }
    for (let c of this.view.state.facet(Ra))
      try {
        if (c(this.view, t.range, t))
          return !0;
      } catch (f) {
        Pt(this.view.state, f, "scroll handler");
      }
    let { range: i } = t, s = this.coordsAt(i.head, (e = i.assoc) !== null && e !== void 0 ? e : i.empty ? 0 : i.head > i.anchor ? -1 : 1), r;
    if (!s)
      return;
    !i.empty && (r = this.coordsAt(i.anchor, i.anchor > i.head ? -1 : 1)) && (s = {
      left: Math.min(s.left, r.left),
      top: Math.min(s.top, r.top),
      right: Math.max(s.right, r.right),
      bottom: Math.max(s.bottom, r.bottom)
    });
    let o = Ir(this.view), l = {
      left: s.left - o.left,
      top: s.top - o.top,
      right: s.right + o.right,
      bottom: s.bottom + o.bottom
    }, { offsetWidth: a, offsetHeight: h } = this.view.scrollDOM;
    if (bf(this.view.scrollDOM, l, i.head < i.anchor ? -1 : 1, t.x, t.y, Math.max(Math.min(t.xMargin, a), -a), Math.max(Math.min(t.yMargin, h), -h), this.view.textDirection == j.LTR), window.visualViewport && window.innerHeight - window.visualViewport.height > 1 && (s.top > window.pageYOffset + window.visualViewport.offsetTop + window.visualViewport.height || s.bottom < window.pageYOffset + window.visualViewport.offsetTop)) {
      let c = this.view.docView.lineAt(i.head, 1);
      c && c.dom.scrollIntoView({ block: "nearest" });
    }
  }
  lineHasWidget(t) {
    let e = (i) => i.isWidget() || i.children.some(e);
    return e(this.tile.resolveBlock(t, 1).tile);
  }
  destroy() {
    ir(this.tile);
  }
}
function ir(n, t) {
  let e = t?.get(n);
  if (e != 1) {
    e == null && n.destroy();
    for (let i of n.children)
      ir(i, t);
  }
}
function zf(n) {
  return n.node.nodeType == 1 && n.node.firstChild && (n.offset == 0 || n.node.childNodes[n.offset - 1].contentEditable == "false") && (n.offset == n.node.childNodes.length || n.node.childNodes[n.offset].contentEditable == "false");
}
function Ha(n, t) {
  let e = n.observer.selectionRange;
  if (!e.focusNode)
    return null;
  let i = ma(e.focusNode, e.focusOffset), s = ba(e.focusNode, e.focusOffset), r = i || s;
  if (s && i && s.node != i.node) {
    let l = J.get(s.node);
    if (!l || l.isText() && l.text != s.node.nodeValue)
      r = s;
    else if (n.docView.lastCompositionAfterCursor) {
      let a = J.get(i.node);
      !a || a.isText() && a.text != i.node.nodeValue || (r = s);
    }
  }
  if (n.docView.lastCompositionAfterCursor = r != i, !r)
    return null;
  let o = t - r.offset;
  return { from: o, to: o + r.node.nodeValue.length, node: r.node };
}
function Uf(n, t, e) {
  let i = Ha(n, e);
  if (!i)
    return null;
  let { node: s, from: r, to: o } = i, l = s.nodeValue;
  if (/[\n\r]/.test(l) || n.state.doc.sliceString(i.from, i.to) != l)
    return null;
  let a = t.invertedDesc;
  return { range: new Tt(a.mapPos(r), a.mapPos(o), r, o), text: s };
}
function jf(n, t) {
  return n.nodeType != 1 ? 0 : (t && n.childNodes[t - 1].contentEditable == "false" ? 1 : 0) | (t < n.childNodes.length && n.childNodes[t].contentEditable == "false" ? 2 : 0);
}
let qf = class {
  constructor() {
    this.changes = [];
  }
  compareRange(t, e) {
    qe(t, e, this.changes);
  }
  comparePoint(t, e) {
    qe(t, e, this.changes);
  }
  boundChange(t) {
    qe(t, t, this.changes);
  }
};
function Kf(n, t, e) {
  let i = new qf();
  return B.compare(n, t, e, i), i.changes;
}
class Gf {
  constructor() {
    this.changes = [];
  }
  compareRange(t, e) {
    qe(t, e, this.changes);
  }
  comparePoint() {
  }
  boundChange(t) {
    qe(t, t, this.changes);
  }
}
function Jf(n, t, e) {
  let i = new Gf();
  return B.compare(n, t, e, i), i.changes;
}
function Yf(n, t) {
  for (let e = n; e && e != t; e = e.assignedSlot || e.parentNode)
    if (e.nodeType == 1 && e.contentEditable == "false")
      return !0;
  return !1;
}
function Xf(n, t) {
  let e = !1;
  return t && n.iterChangedRanges((i, s) => {
    i < t.to && s > t.from && (e = !0);
  }), e;
}
class gs extends zi {
  constructor(t) {
    super(), this.height = t;
  }
  toDOM() {
    let t = document.createElement("div");
    return t.className = "cm-gap", this.updateDOM(t), t;
  }
  eq(t) {
    return t.height == this.height;
  }
  updateDOM(t) {
    return t.style.height = this.height + "px", !0;
  }
  get editable() {
    return !0;
  }
  get estimatedHeight() {
    return this.height;
  }
  ignoreEvent() {
    return !1;
  }
}
function Zf(n, t, e = 1) {
  let i = n.charCategorizer(t), s = n.doc.lineAt(t), r = t - s.from;
  if (s.length == 0)
    return y.cursor(t);
  r == 0 ? e = 1 : r == s.length && (e = -1);
  let o = r, l = r;
  e < 0 ? o = at(s.text, r, !1) : l = at(s.text, r);
  let a = i(s.text.slice(o, l));
  for (; o > 0; ) {
    let h = at(s.text, o, !1);
    if (i(s.text.slice(h, o)) != a)
      break;
    o = h;
  }
  for (; l < s.length; ) {
    let h = at(s.text, l);
    if (i(s.text.slice(l, h)) != a)
      break;
    l = h;
  }
  return y.range(o + s.from, l + s.from);
}
function Qf(n, t, e, i, s) {
  let r = Math.round((i - t.left) * n.defaultCharacterWidth);
  if (n.lineWrapping && e.height > n.defaultLineHeight * 1.5) {
    let l = n.viewState.heightOracle.textHeight, a = Math.floor((s - e.top - (n.defaultLineHeight - l) * 0.5) / l);
    r += a * n.viewState.heightOracle.lineLength;
  }
  let o = n.state.sliceDoc(e.from, e.to);
  return e.from + af(o, r, n.state.tabSize);
}
function nr(n, t, e) {
  let i = n.lineBlockAt(t);
  if (Array.isArray(i.type)) {
    let s;
    for (let r of i.type) {
      if (r.from > t)
        break;
      if (!(r.to < t)) {
        if (r.from < t && r.to > t)
          return r;
        (!s || r.type == rt.Text && (s.type != r.type || (e < 0 ? r.from < t : r.to > t))) && (s = r);
      }
    }
    return s || i;
  }
  return i;
}
function tu(n, t, e, i) {
  let s = nr(n, t.head, t.assoc || -1), r = !i || s.type != rt.Text || !(n.lineWrapping || s.widgetLineBreaks) ? null : n.coordsAtPos(t.assoc < 0 && t.head > s.from ? t.head - 1 : t.head);
  if (r) {
    let o = n.dom.getBoundingClientRect(), l = n.textDirectionAt(s.from), a = n.posAtCoords({
      x: e == (l == j.LTR) ? o.right - 1 : o.left + 1,
      y: (r.top + r.bottom) / 2
    });
    if (a != null)
      return y.cursor(a, e ? -1 : 1);
  }
  return y.cursor(e ? s.to : s.from, e ? -1 : 1);
}
function Bo(n, t, e, i) {
  let s = n.state.doc.lineAt(t.head), r = n.bidiSpans(s), o = n.textDirectionAt(s.from);
  for (let l = t, a = null; ; ) {
    let h = Of(s, r, o, l, e), c = ka;
    if (!h) {
      if (s.number == (e ? n.state.doc.lines : 1))
        return l;
      c = `
`, s = n.state.doc.line(s.number + (e ? 1 : -1)), r = n.bidiSpans(s), h = n.visualLineSide(s, !e);
    }
    if (a) {
      if (!a(c))
        return l;
    } else {
      if (!i)
        return h;
      a = i(c);
    }
    l = h;
  }
}
function eu(n, t, e) {
  let i = n.state.charCategorizer(t), s = i(e);
  return (r) => {
    let o = i(r);
    return s == ee.Space && (s = o), s == o;
  };
}
function iu(n, t, e, i) {
  let s = t.head, r = e ? 1 : -1;
  if (s == (e ? n.state.doc.length : 0))
    return y.cursor(s, t.assoc);
  let o = t.goalColumn, l, a = n.contentDOM.getBoundingClientRect(), h = n.coordsAtPos(s, t.assoc || ((t.empty ? e : t.head == t.from) ? 1 : -1)), c = n.documentTop;
  if (h)
    o == null && (o = h.left - a.left), l = r < 0 ? h.top : h.bottom;
  else {
    let p = n.viewState.lineBlockAt(s);
    o == null && (o = Math.min(a.right - a.left, n.defaultCharacterWidth * (s - p.from))), l = (r < 0 ? p.top : p.bottom) + c;
  }
  let f = a.left + o, u = n.viewState.heightOracle.textHeight >> 1, d = i ?? u;
  for (let p = 0; ; p += u) {
    let g = l + (d + p) * r, m = sr(n, { x: f, y: g }, !1, r);
    if (e ? g > a.bottom : g < a.top)
      return y.cursor(m.pos, m.assoc);
    let b = n.coordsAtPos(m.pos, m.assoc), v = b ? (b.top + b.bottom) / 2 : 0;
    if (!b || (e ? v > l : v < l))
      return y.cursor(m.pos, m.assoc, void 0, o);
  }
}
function Si(n, t, e) {
  for (; ; ) {
    let i = 0;
    for (let s of n)
      s.between(t - 1, t + 1, (r, o, l) => {
        if (t > r && t < o) {
          let a = i || e || (t - r < o - t ? -1 : 1);
          t = a < 0 ? r : o, i = a;
        }
      });
    if (!i)
      return t;
  }
}
function Va(n, t) {
  let e = null;
  for (let i = 0; i < t.ranges.length; i++) {
    let s = t.ranges[i], r = null;
    if (s.empty) {
      let o = Si(n, s.from, 0);
      o != s.from && (r = y.cursor(o, -1));
    } else {
      let o = Si(n, s.from, -1), l = Si(n, s.to, 1);
      (o != s.from || l != s.to) && (r = y.range(s.from == s.anchor ? o : l, s.from == s.head ? o : l));
    }
    r && (e || (e = t.ranges.slice()), e[i] = r);
  }
  return e ? y.create(e, t.mainIndex) : t;
}
function ms(n, t, e) {
  let i = Si(n.state.facet(qi).map((s) => s(n)), e.from, t.head > e.from ? -1 : 1);
  return i == e.from ? e : y.cursor(i, i < e.from ? 1 : -1);
}
class Gt {
  constructor(t, e) {
    this.pos = t, this.assoc = e;
  }
}
function sr(n, t, e, i) {
  let s = n.contentDOM.getBoundingClientRect(), r = s.top + n.viewState.paddingTop, { x: o, y: l } = t, a = l - r, h;
  for (; ; ) {
    if (a < 0)
      return new Gt(0, 1);
    if (a > n.viewState.docHeight)
      return new Gt(n.state.doc.length, -1);
    if (h = n.elementAtHeight(a), i == null)
      break;
    if (h.type == rt.Text) {
      if (i < 0 ? h.to < n.viewport.from : h.from > n.viewport.to)
        break;
      let u = n.docView.coordsAt(i < 0 ? h.from : h.to, i > 0 ? -1 : 1);
      if (u && (i < 0 ? u.top <= a + r : u.bottom >= a + r))
        break;
    }
    let f = n.viewState.heightOracle.textHeight / 2;
    a = i > 0 ? h.bottom + f : h.top - f;
  }
  if (n.viewport.from >= h.to || n.viewport.to <= h.from) {
    if (e)
      return null;
    if (h.type == rt.Text) {
      let f = Qf(n, s, h, o, l);
      return new Gt(f, f == h.from ? 1 : -1);
    }
  }
  if (h.type != rt.Text)
    return a < (h.top + h.bottom) / 2 ? new Gt(h.from, 1) : new Gt(h.to, -1);
  let c = n.docView.lineAt(h.from, 2);
  return (!c || c.length != h.length) && (c = n.docView.lineAt(h.from, -2)), new nu(n, o, l, n.textDirectionAt(h.from)).scanTile(c, h.from);
}
class nu {
  constructor(t, e, i, s) {
    this.view = t, this.x = e, this.y = i, this.baseDir = s, this.line = null, this.spans = null;
  }
  bidiSpansAt(t) {
    return (!this.line || this.line.from > t || this.line.to < t) && (this.line = this.view.state.doc.lineAt(t), this.spans = this.view.bidiSpans(this.line)), this;
  }
  baseDirAt(t, e) {
    let { line: i, spans: s } = this.bidiSpansAt(t);
    return s[Jt.find(s, t - i.from, -1, e)].level == this.baseDir;
  }
  dirAt(t, e) {
    let { line: i, spans: s } = this.bidiSpansAt(t);
    return s[Jt.find(s, t - i.from, -1, e)].dir;
  }
  // Used to short-circuit bidi tests for content with a uniform direction
  bidiIn(t, e) {
    let { spans: i, line: s } = this.bidiSpansAt(t);
    return i.length > 1 || i.length && (i[0].level != this.baseDir || i[0].to + s.from < e);
  }
  // Scan through the rectangles for the content of a tile with inline
  // content, looking for one that overlaps the queried position
  // vertically andis
  // closest horizontally. The caller is responsible for dividing its
  // content into N pieces, and pass an array with N+1 positions
  // (including the position after the last piece). For a text tile,
  // these will be character clusters, for a composite tile, these
  // will be child tiles.
  scan(t, e, i = !1) {
    let s = 0, r = t.length - 1, o = /* @__PURE__ */ new Set(), l = this.bidiIn(t[0], t[r]), a, h, c = -1, f = 1e9, u;
    t: for (; s < r; ) {
      let p = r - s, g = s + r >> 1;
      e: if (o.has(g)) {
        let b = s + Math.floor(Math.random() * p);
        for (let v = 0; v < p; v++) {
          if (!o.has(b)) {
            g = b;
            break e;
          }
          b++, b == r && (b = s);
        }
        break t;
      }
      o.add(g);
      let m = e(g);
      if (m)
        for (let b = 0; b < m.length; b++) {
          let v = m[b], w = 0;
          if (!(v.width == 0 && m.length > 1)) {
            if (v.bottom < this.y)
              (!a || a.bottom < v.bottom) && (a = v), w = 1;
            else if (v.top > this.y)
              (!h || h.top > v.top) && (h = v), w = -1;
            else {
              let O = v.left > this.x ? this.x - v.left : v.right < this.x ? this.x - v.right : 0, k = Math.abs(O);
              k < f && (c = g, f = k, u = v), O && (w = O < 0 == (this.baseDir == j.LTR) ? -1 : 1);
            }
            w == -1 && (!l || this.baseDirAt(t[g], 1)) ? r = g : w == 1 && (!l || this.baseDirAt(t[g + 1], -1)) && (s = g + 1);
          }
        }
    }
    if (!u) {
      let p = a && (!h || this.y - a.bottom < h.top - this.y) ? a : h;
      return this.y = (p.top + p.bottom) / 2, this.scan(t, e, !0);
    }
    if (f && !i) {
      let { top: p, bottom: g } = u;
      if (a && a.bottom > (p + p + g) / 3)
        return this.y = a.bottom - 1, this.scan(t, e, !0);
      if (h && h.top < (p + g + g) / 3)
        return this.y = h.top + 1, this.scan(t, e, !0);
    }
    let d = (l ? this.dirAt(t[c], 1) : this.baseDir) == j.LTR;
    return {
      i: c,
      // Test whether x is closes to the start or end of this element
      after: this.x > (u.left + u.right) / 2 == d
    };
  }
  scanText(t, e) {
    let i = [];
    for (let r = 0; r < t.length; r = at(t.text, r))
      i.push(e + r);
    i.push(e + t.length);
    let s = this.scan(i, (r) => {
      let o = i[r] - e, l = i[r + 1] - e;
      return Bi(t.dom, o, l).getClientRects();
    });
    return s.after ? new Gt(i[s.i + 1], -1) : new Gt(i[s.i], 1);
  }
  scanTile(t, e) {
    if (!t.length)
      return new Gt(e, 1);
    if (t.children.length == 1) {
      let l = t.children[0];
      if (l.isText())
        return this.scanText(l, e);
      if (l.isComposite())
        return this.scanTile(l, e);
    }
    let i = [e];
    for (let l = 0, a = e; l < t.children.length; l++)
      i.push(a += t.children[l].length);
    let s = this.scan(i, (l) => {
      let a = t.children[l];
      return a.flags & 48 ? null : (a.dom.nodeType == 1 ? a.dom : Bi(a.dom, 0, a.length)).getClientRects();
    }), r = t.children[s.i], o = i[s.i];
    return r.isText() ? this.scanText(r, o) : r.isComposite() ? this.scanTile(r, o) : s.after ? new Gt(i[s.i + 1], -1) : new Gt(o, 1);
  }
}
const Ve = "￿";
class su {
  constructor(t, e) {
    this.points = t, this.view = e, this.text = "", this.lineSeparator = e.state.facet($.lineSeparator);
  }
  append(t) {
    this.text += t;
  }
  lineBreak() {
    this.text += Ve;
  }
  readRange(t, e) {
    if (!t)
      return this;
    let i = t.parentNode;
    for (let s = t; ; ) {
      this.findPointBefore(i, s);
      let r = this.text.length;
      this.readNode(s);
      let o = J.get(s), l = s.nextSibling;
      if (l == e) {
        o?.breakAfter && !l && i != this.view.contentDOM && this.lineBreak();
        break;
      }
      let a = J.get(l);
      (o && a ? o.breakAfter : (o ? o.breakAfter : On(s)) || On(l) && (s.nodeName != "BR" || o?.isWidget()) && this.text.length > r) && !ou(l, e) && this.lineBreak(), s = l;
    }
    return this.findPointBefore(i, e), this;
  }
  readTextNode(t) {
    let e = t.nodeValue;
    for (let i of this.points)
      i.node == t && (i.pos = this.text.length + Math.min(i.offset, e.length));
    for (let i = 0, s = this.lineSeparator ? null : /\r\n?|\n/g; ; ) {
      let r = -1, o = 1, l;
      if (this.lineSeparator ? (r = e.indexOf(this.lineSeparator, i), o = this.lineSeparator.length) : (l = s.exec(e)) && (r = l.index, o = l[0].length), this.append(e.slice(i, r < 0 ? e.length : r)), r < 0)
        break;
      if (this.lineBreak(), o > 1)
        for (let a of this.points)
          a.node == t && a.pos > this.text.length && (a.pos -= o - 1);
      i = r + o;
    }
  }
  readNode(t) {
    let e = J.get(t), i = e && e.overrideDOMText;
    if (i != null) {
      this.findPointInside(t, i.length);
      for (let s = i.iter(); !s.next().done; )
        s.lineBreak ? this.lineBreak() : this.append(s.value);
    } else t.nodeType == 3 ? this.readTextNode(t) : t.nodeName == "BR" ? t.nextSibling && this.lineBreak() : t.nodeType == 1 && this.readRange(t.firstChild, null);
  }
  findPointBefore(t, e) {
    for (let i of this.points)
      i.node == t && t.childNodes[i.offset] == e && (i.pos = this.text.length);
  }
  findPointInside(t, e) {
    for (let i of this.points)
      (t.nodeType == 3 ? i.node == t : t.contains(i.node)) && (i.pos = this.text.length + (ru(t, i.node, i.offset) ? e : 0));
  }
}
function ru(n, t, e) {
  for (; ; ) {
    if (!t || e < ne(t))
      return !1;
    if (t == n)
      return !0;
    e = ue(t) + 1, t = t.parentNode;
  }
}
function ou(n, t) {
  let e;
  for (; !(n == t || !n); n = n.nextSibling) {
    let i = J.get(n);
    if (!i?.isWidget())
      return !1;
    i && (e || (e = [])).push(i);
  }
  if (e)
    for (let i of e) {
      let s = i.overrideDOMText;
      if (s?.length)
        return !1;
    }
  return !0;
}
class Po {
  constructor(t, e) {
    this.node = t, this.offset = e, this.pos = -1;
  }
}
class lu {
  constructor(t, e, i, s) {
    this.typeOver = s, this.bounds = null, this.text = "", this.domChanged = e > -1;
    let { impreciseHead: r, impreciseAnchor: o } = t.docView, l = t.state.selection;
    if (t.state.readOnly && e > -1)
      this.newSel = null;
    else if (e > -1 && (this.bounds = Fa(t.docView.tile, e, i, 0))) {
      let a = r || o ? [] : hu(t), h = new su(a, t);
      h.readRange(this.bounds.startDOM, this.bounds.endDOM), this.text = h.text, this.newSel = cu(a, this.bounds.from);
    } else {
      let a = t.observer.selectionRange, h = r && r.node == a.focusNode && r.offset == a.focusOffset || !Xs(t.contentDOM, a.focusNode) ? l.main.head : t.docView.posFromDOM(a.focusNode, a.focusOffset), c = o && o.node == a.anchorNode && o.offset == a.anchorOffset || !Xs(t.contentDOM, a.anchorNode) ? l.main.anchor : t.docView.posFromDOM(a.anchorNode, a.anchorOffset), f = t.viewport;
      if ((C.ios || C.chrome) && l.main.empty && h != c && (f.from > 0 || f.to < t.state.doc.length)) {
        let u = Math.min(h, c), d = Math.max(h, c), p = f.from - u, g = f.to - d;
        (p == 0 || p == 1 || u == 0) && (g == 0 || g == -1 || d == t.state.doc.length) && (h = 0, c = t.state.doc.length);
      }
      if (t.inputState.composing > -1 && l.ranges.length > 1)
        this.newSel = l.replaceRange(y.range(c, h));
      else if (t.lineWrapping && c == h && !(l.main.empty && l.main.head == h) && t.inputState.lastTouchTime > Date.now() - 100) {
        let u = t.coordsAtPos(h, -1), d = 0;
        u && (d = t.inputState.lastTouchY <= u.bottom ? -1 : 1), this.newSel = y.create([y.cursor(h, d)]);
      } else
        this.newSel = y.single(c, h);
    }
  }
}
function Fa(n, t, e, i) {
  if (n.isComposite()) {
    let s = -1, r = -1, o = -1, l = -1;
    for (let a = 0, h = i, c = i; a < n.children.length; a++) {
      let f = n.children[a], u = h + f.length;
      if (h < t && u > e)
        return Fa(f, t, e, h);
      if (u >= t && s == -1 && (s = a, r = h), h > e && f.dom.parentNode == n.dom) {
        o = a, l = c;
        break;
      }
      c = u, h = u + f.breakAfter;
    }
    return {
      from: r,
      to: l < 0 ? i + n.length : l,
      startDOM: (s ? n.children[s - 1].dom.nextSibling : null) || n.dom.firstChild,
      endDOM: o < n.children.length && o >= 0 ? n.children[o].dom : null
    };
  } else return n.isText() ? { from: i, to: i + n.length, startDOM: n.dom, endDOM: n.dom.nextSibling } : null;
}
function Wa(n, t) {
  let e, { newSel: i } = t, { state: s } = n, r = s.selection.main, o = n.inputState.lastKeyTime > Date.now() - 100 ? n.inputState.lastKeyCode : -1;
  if (t.bounds) {
    let { from: l, to: a } = t.bounds, h = r.from, c = null;
    (o === 8 || C.android && t.text.length < a - l) && (h = r.to, c = "end");
    let f = s.doc.sliceString(l, a, Ve), u, d;
    !r.empty && r.from >= l && r.to <= a && (t.typeOver || f != t.text) && f.slice(0, r.from - l) == t.text.slice(0, r.from - l) && f.slice(r.to - l) == t.text.slice(u = t.text.length - (f.length - (r.to - l))) ? e = {
      from: r.from,
      to: r.to,
      insert: N.of(t.text.slice(r.from - l, u).split(Ve))
    } : (d = _a(f, t.text, h - l, c)) && (C.chrome && o == 13 && d.toB == d.from + 2 && t.text.slice(d.from, d.toB) == Ve + Ve && d.toB--, e = {
      from: l + d.from,
      to: l + d.toA,
      insert: N.of(t.text.slice(d.from, d.toB).split(Ve))
    });
  } else i && (!n.hasFocus && s.facet(te) || Bn(i, r)) && (i = null);
  if (!e && !i)
    return !1;
  if ((C.mac || C.android) && e && e.from == e.to && e.from == r.head - 1 && /^\. ?$/.test(e.insert.toString()) && n.contentDOM.getAttribute("autocorrect") == "off" ? (i && e.insert.length == 2 && (i = y.single(i.main.anchor - 1, i.main.head - 1)), e = { from: e.from, to: e.to, insert: N.of([e.insert.toString().replace(".", " ")]) }) : s.doc.lineAt(r.from).to < r.to && n.docView.lineHasWidget(r.to) && n.inputState.insertingTextAt > Date.now() - 50 ? e = {
    from: r.from,
    to: r.to,
    insert: s.toText(n.inputState.insertingText)
  } : C.chrome && e && e.from == e.to && e.from == r.head && e.insert.toString() == `
 ` && n.lineWrapping && (i && (i = y.single(i.main.anchor - 1, i.main.head - 1)), e = { from: r.from, to: r.to, insert: N.of([" "]) }), e)
    return Nr(n, e, i, o);
  if (i && !Bn(i, r)) {
    let l = !1, a = "select";
    return n.inputState.lastSelectionTime > Date.now() - 50 && (n.inputState.lastSelectionOrigin == "select" && (l = !0), a = n.inputState.lastSelectionOrigin, a == "select.pointer" && (i = Va(s.facet(qi).map((h) => h(n)), i))), n.dispatch({ selection: i, scrollIntoView: l, userEvent: a }), !0;
  } else
    return !1;
}
function Nr(n, t, e, i = -1) {
  if (C.ios && n.inputState.flushIOSKey(t))
    return !0;
  let s = n.state.selection.main;
  if (C.android && (t.to == s.to && // GBoard will sometimes remove a space it just inserted
  // after a completion when you press enter
  (t.from == s.from || t.from == s.from - 1 && n.state.sliceDoc(t.from, s.from) == " ") && t.insert.length == 1 && t.insert.lines == 2 && Ke(n.contentDOM, "Enter", 13) || (t.from == s.from - 1 && t.to == s.to && t.insert.length == 0 || i == 8 && t.insert.length < t.to - t.from && t.to > s.head) && Ke(n.contentDOM, "Backspace", 8) || t.from == s.from && t.to == s.to + 1 && t.insert.length == 0 && Ke(n.contentDOM, "Delete", 46)))
    return !0;
  let r = t.insert.toString();
  n.inputState.composing >= 0 && n.inputState.composing++;
  let o, l = () => o || (o = au(n, t, e));
  return n.state.facet(Ta).some((a) => a(n, t.from, t.to, r, l)) || n.dispatch(l()), !0;
}
function au(n, t, e) {
  let i, s = n.state, r = s.selection.main, o = -1;
  if (t.from == t.to && t.from < r.from || t.from > r.to) {
    let a = t.from < r.from ? -1 : 1, h = a < 0 ? r.from : r.to, c = Si(s.facet(qi).map((f) => f(n)), h, a);
    t.from == c && (o = c);
  }
  if (o > -1)
    i = {
      changes: t,
      selection: y.cursor(t.from + t.insert.length, -1)
    };
  else if (t.from >= r.from && t.to <= r.to && t.to - t.from >= (r.to - r.from) / 3 && (!e || e.main.empty && e.main.from == t.from + t.insert.length) && n.inputState.composing < 0) {
    let a = r.from < t.from ? s.sliceDoc(r.from, t.from) : "", h = r.to > t.to ? s.sliceDoc(t.to, r.to) : "";
    i = s.replaceSelection(n.state.toText(a + t.insert.sliceString(0, void 0, n.state.lineBreak) + h));
  } else {
    let a = s.changes(t), h = e && e.main.to <= a.newLength ? e.main : void 0;
    if (s.selection.ranges.length > 1 && (n.inputState.composing >= 0 || n.inputState.compositionPendingChange) && t.to <= r.to + 10 && t.to >= r.to - 10) {
      let c = n.state.sliceDoc(t.from, t.to), f, u = e && Ha(n, e.main.head);
      if (u) {
        let p = t.insert.length - (t.to - t.from);
        f = { from: u.from, to: u.to - p };
      } else
        f = n.state.doc.lineAt(r.head);
      let d = r.to - t.to;
      i = s.changeByRange((p) => {
        if (p.from == r.from && p.to == r.to)
          return { changes: a, range: h || p.map(a) };
        let g = p.to - d, m = g - c.length;
        if (n.state.sliceDoc(m, g) != c || // Unfortunately, there's no way to make multiple
        // changes in the same node work without aborting
        // composition, so cursors in the composition range are
        // ignored.
        g >= f.from && m <= f.to)
          return { range: p };
        let b = s.changes({ from: m, to: g, insert: t.insert }), v = p.to - r.to;
        return {
          changes: b,
          range: h ? y.range(Math.max(0, h.anchor + v), Math.max(0, h.head + v)) : p.map(b)
        };
      });
    } else
      i = {
        changes: a,
        selection: h && s.selection.replaceRange(h)
      };
  }
  let l = "input.type";
  return (n.composing || n.inputState.compositionPendingChange && n.inputState.compositionEndedAt > Date.now() - 50) && (n.inputState.compositionPendingChange = !1, l += ".compose", n.inputState.compositionFirstChange && (l += ".start", n.inputState.compositionFirstChange = !1)), s.update(i, { userEvent: l, scrollIntoView: !0 });
}
function _a(n, t, e, i) {
  let s = Math.min(n.length, t.length), r = 0;
  for (; r < s && n.charCodeAt(r) == t.charCodeAt(r); )
    r++;
  if (r == s && n.length == t.length)
    return null;
  let o = n.length, l = t.length;
  for (; o > 0 && l > 0 && n.charCodeAt(o - 1) == t.charCodeAt(l - 1); )
    o--, l--;
  if (i == "end") {
    let a = Math.max(0, r - Math.min(o, l));
    e -= o + a - r;
  }
  if (o < r && n.length < t.length) {
    let a = e <= r && e >= o ? r - e : 0;
    r -= a, l = r + (l - o), o = r;
  } else if (l < r) {
    let a = e <= r && e >= l ? r - e : 0;
    r -= a, o = r + (o - l), l = r;
  }
  return { from: r, toA: o, toB: l };
}
function hu(n) {
  let t = [];
  if (n.root.activeElement != n.contentDOM)
    return t;
  let { anchorNode: e, anchorOffset: i, focusNode: s, focusOffset: r } = n.observer.selectionRange;
  return e && (t.push(new Po(e, i)), (s != e || r != i) && t.push(new Po(s, r))), t;
}
function cu(n, t) {
  if (n.length == 0)
    return null;
  let e = n[0].pos, i = n.length == 2 ? n[1].pos : e;
  return e > -1 && i > -1 ? y.single(e + t, i + t) : null;
}
function Bn(n, t) {
  return t.head == n.main.head && t.anchor == n.main.anchor;
}
class fu {
  setSelectionOrigin(t) {
    this.lastSelectionOrigin = t, this.lastSelectionTime = Date.now();
  }
  constructor(t) {
    this.view = t, this.lastKeyCode = 0, this.lastKeyTime = 0, this.lastTouchTime = 0, this.lastTouchX = 0, this.lastTouchY = 0, this.lastFocusTime = 0, this.lastScrollTop = 0, this.lastScrollLeft = 0, this.lastWheelEvent = 0, this.pendingIOSKey = void 0, this.tabFocusMode = -1, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastContextMenu = 0, this.scrollHandlers = [], this.handlers = /* @__PURE__ */ Object.create(null), this.composing = -1, this.compositionFirstChange = null, this.compositionEndedAt = 0, this.compositionPendingKey = !1, this.compositionPendingChange = !1, this.insertingText = "", this.insertingTextAt = 0, this.mouseSelection = null, this.draggedContent = null, this.handleEvent = this.handleEvent.bind(this), this.notifiedFocused = t.hasFocus, C.safari && t.contentDOM.addEventListener("input", () => null), C.gecko && Mu(t.contentDOM.ownerDocument);
  }
  handleEvent(t) {
    !wu(this.view, t) || this.ignoreDuringComposition(t) || t.type == "keydown" && this.keydown(t) || (this.view.updateState != 0 ? Promise.resolve().then(() => this.runHandlers(t.type, t)) : this.runHandlers(t.type, t));
  }
  runHandlers(t, e) {
    let i = this.handlers[t];
    if (i) {
      for (let s of i.observers)
        s(this.view, e);
      for (let s of i.handlers) {
        if (e.defaultPrevented)
          break;
        if (s(this.view, e)) {
          e.preventDefault();
          break;
        }
      }
    }
  }
  ensureHandlers(t) {
    let e = uu(t), i = this.handlers, s = this.view.contentDOM;
    for (let r in e)
      if (r != "scroll") {
        let o = !e[r].handlers.length, l = i[r];
        l && o != !l.handlers.length && (s.removeEventListener(r, this.handleEvent), l = null), l || s.addEventListener(r, this.handleEvent, { passive: o });
      }
    for (let r in i)
      r != "scroll" && !e[r] && s.removeEventListener(r, this.handleEvent);
    this.handlers = e;
  }
  keydown(t) {
    if (this.lastKeyCode = t.keyCode, this.lastKeyTime = Date.now(), t.keyCode == 9 && this.tabFocusMode > -1 && (!this.tabFocusMode || Date.now() <= this.tabFocusMode))
      return !0;
    if (this.tabFocusMode > 0 && t.keyCode != 27 && Ua.indexOf(t.keyCode) < 0 && (this.tabFocusMode = -1), C.android && C.chrome && !t.synthetic && (t.keyCode == 13 || t.keyCode == 8))
      return this.view.observer.delayAndroidKey(t.key, t.keyCode), !0;
    let e;
    return C.ios && !t.synthetic && !t.altKey && !t.metaKey && !t.shiftKey && ((e = za.find((i) => i.keyCode == t.keyCode)) && !t.ctrlKey || du.indexOf(t.key) > -1 && t.ctrlKey) ? (this.pendingIOSKey = e || t, setTimeout(() => this.flushIOSKey(), 250), !0) : (t.keyCode != 229 && this.view.observer.forceFlush(), !1);
  }
  flushIOSKey(t) {
    let e = this.pendingIOSKey;
    return !e || e.key == "Enter" && t && t.from < t.to && /^\S+$/.test(t.insert.toString()) ? !1 : (this.pendingIOSKey = void 0, Ke(this.view.contentDOM, e.key, e.keyCode, e instanceof KeyboardEvent ? e : void 0));
  }
  ignoreDuringComposition(t) {
    return !/^key/.test(t.type) || t.synthetic ? !1 : this.composing > 0 ? !0 : C.safari && !C.ios && this.compositionPendingKey && Date.now() - this.compositionEndedAt < 100 ? (this.compositionPendingKey = !1, !0) : !1;
  }
  startMouseSelection(t) {
    this.mouseSelection && this.mouseSelection.destroy(), this.mouseSelection = t;
  }
  update(t) {
    this.view.observer.update(t), this.mouseSelection && this.mouseSelection.update(t), this.draggedContent && t.docChanged && (this.draggedContent = this.draggedContent.map(t.changes)), t.transactions.length && (this.lastKeyCode = this.lastSelectionTime = 0);
  }
  destroy() {
    this.mouseSelection && this.mouseSelection.destroy();
  }
}
function Io(n, t) {
  return (e, i) => {
    try {
      return t.call(n, i, e);
    } catch (s) {
      Pt(e.state, s);
    }
  };
}
function uu(n) {
  let t = /* @__PURE__ */ Object.create(null);
  function e(i) {
    return t[i] || (t[i] = { observers: [], handlers: [] });
  }
  for (let i of n) {
    let s = i.spec, r = s && s.plugin.domEventHandlers, o = s && s.plugin.domEventObservers;
    if (r)
      for (let l in r) {
        let a = r[l];
        a && e(l).handlers.push(Io(i.value, a));
      }
    if (o)
      for (let l in o) {
        let a = o[l];
        a && e(l).observers.push(Io(i.value, a));
      }
  }
  for (let i in Nt)
    e(i).handlers.push(Nt[i]);
  for (let i in bt)
    e(i).observers.push(bt[i]);
  return t;
}
const za = [
  { key: "Backspace", keyCode: 8, inputType: "deleteContentBackward" },
  { key: "Enter", keyCode: 13, inputType: "insertParagraph" },
  { key: "Enter", keyCode: 13, inputType: "insertLineBreak" },
  { key: "Delete", keyCode: 46, inputType: "deleteContentForward" }
], du = "dthko", Ua = [16, 17, 18, 20, 91, 92, 224, 225], tn = 6;
function en(n) {
  return Math.max(0, n) * 0.7 + 8;
}
function pu(n, t) {
  return Math.max(Math.abs(n.clientX - t.clientX), Math.abs(n.clientY - t.clientY));
}
class gu {
  constructor(t, e, i, s) {
    this.view = t, this.startEvent = e, this.style = i, this.mustSelect = s, this.scrollSpeed = { x: 0, y: 0 }, this.scrolling = -1, this.lastEvent = e, this.scrollParents = da(t.contentDOM), this.atoms = t.state.facet(qi).map((o) => o(t));
    let r = t.contentDOM.ownerDocument;
    r.addEventListener("mousemove", this.move = this.move.bind(this)), r.addEventListener("mouseup", this.up = this.up.bind(this)), this.extend = e.shiftKey, this.multiple = t.state.facet($.allowMultipleSelections) && mu(t, e), this.dragging = yu(t, e) && Ka(e) == 1 ? null : !1;
  }
  start(t) {
    this.dragging === !1 && this.select(t);
  }
  move(t) {
    if (t.buttons == 0)
      return this.destroy();
    if (this.dragging || this.dragging == null && pu(this.startEvent, t) < 10)
      return;
    this.select(this.lastEvent = t);
    let e = 0, i = 0, s = 0, r = 0, o = this.view.win.innerWidth, l = this.view.win.innerHeight;
    this.scrollParents.x && ({ left: s, right: o } = this.scrollParents.x.getBoundingClientRect()), this.scrollParents.y && ({ top: r, bottom: l } = this.scrollParents.y.getBoundingClientRect());
    let a = Ir(this.view);
    t.clientX - a.left <= s + tn ? e = -en(s - t.clientX) : t.clientX + a.right >= o - tn && (e = en(t.clientX - o)), t.clientY - a.top <= r + tn ? i = -en(r - t.clientY) : t.clientY + a.bottom >= l - tn && (i = en(t.clientY - l)), this.setScrollSpeed(e, i);
  }
  up(t) {
    this.dragging == null && this.select(this.lastEvent), this.dragging || t.preventDefault(), this.destroy();
  }
  destroy() {
    this.setScrollSpeed(0, 0);
    let t = this.view.contentDOM.ownerDocument;
    t.removeEventListener("mousemove", this.move), t.removeEventListener("mouseup", this.up), this.view.inputState.mouseSelection = this.view.inputState.draggedContent = null;
  }
  setScrollSpeed(t, e) {
    this.scrollSpeed = { x: t, y: e }, t || e ? this.scrolling < 0 && (this.scrolling = setInterval(() => this.scroll(), 50)) : this.scrolling > -1 && (clearInterval(this.scrolling), this.scrolling = -1);
  }
  scroll() {
    let { x: t, y: e } = this.scrollSpeed;
    t && this.scrollParents.x && (this.scrollParents.x.scrollLeft += t, t = 0), e && this.scrollParents.y && (this.scrollParents.y.scrollTop += e, e = 0), (t || e) && this.view.win.scrollBy(t, e), this.dragging === !1 && this.select(this.lastEvent);
  }
  select(t) {
    let { view: e } = this, i = Va(this.atoms, this.style.get(t, this.extend, this.multiple));
    (this.mustSelect || !i.eq(e.state.selection, this.dragging === !1)) && this.view.dispatch({
      selection: i,
      userEvent: "select.pointer"
    }), this.mustSelect = !1;
  }
  update(t) {
    t.transactions.some((e) => e.isUserEvent("input.type")) ? this.destroy() : this.style.update(t) && setTimeout(() => this.select(this.lastEvent), 20);
  }
}
function mu(n, t) {
  let e = n.state.facet(Sa);
  return e.length ? e[0](t) : C.mac ? t.metaKey : t.ctrlKey;
}
function bu(n, t) {
  let e = n.state.facet(Aa);
  return e.length ? e[0](t) : C.mac ? !t.altKey : !t.ctrlKey;
}
function yu(n, t) {
  let { main: e } = n.state.selection;
  if (e.empty)
    return !1;
  let i = Li(n.root);
  if (!i || i.rangeCount == 0)
    return !0;
  let s = i.getRangeAt(0).getClientRects();
  for (let r = 0; r < s.length; r++) {
    let o = s[r];
    if (o.left <= t.clientX && o.right >= t.clientX && o.top <= t.clientY && o.bottom >= t.clientY)
      return !0;
  }
  return !1;
}
function wu(n, t) {
  if (!t.bubbles)
    return !0;
  if (t.defaultPrevented)
    return !1;
  for (let e = t.target, i; e != n.contentDOM; e = e.parentNode)
    if (!e || e.nodeType == 11 || (i = J.get(e)) && i.isWidget() && !i.isHidden && i.widget.ignoreEvent(t))
      return !1;
  return !0;
}
const Nt = /* @__PURE__ */ Object.create(null), bt = /* @__PURE__ */ Object.create(null), ja = C.ie && C.ie_version < 15 || C.ios && C.webkit_version < 604;
function vu(n) {
  let t = n.dom.parentNode;
  if (!t)
    return;
  let e = t.appendChild(document.createElement("textarea"));
  e.style.cssText = "position: fixed; left: -10000px; top: 10px", e.focus(), setTimeout(() => {
    n.focus(), e.remove(), qa(n, e.value);
  }, 50);
}
function Gn(n, t, e) {
  for (let i of n.facet(t))
    e = i(e, n);
  return e;
}
function qa(n, t) {
  t = Gn(n.state, Rr, t);
  let { state: e } = n, i, s = 1, r = e.toText(t), o = r.lines == e.selection.ranges.length;
  if (rr != null && e.selection.ranges.every((a) => a.empty) && rr == r.toString()) {
    let a = -1;
    i = e.changeByRange((h) => {
      let c = e.doc.lineAt(h.from);
      if (c.from == a)
        return { range: h };
      a = c.from;
      let f = e.toText((o ? r.line(s++).text : t) + e.lineBreak);
      return {
        changes: { from: c.from, insert: f },
        range: y.cursor(h.from + f.length)
      };
    });
  } else o ? i = e.changeByRange((a) => {
    let h = r.line(s++);
    return {
      changes: { from: a.from, to: a.to, insert: h.text },
      range: y.cursor(a.from + h.length)
    };
  }) : i = e.replaceSelection(r);
  n.dispatch(i, {
    userEvent: "input.paste",
    scrollIntoView: !0
  });
}
bt.scroll = (n) => {
  n.inputState.lastScrollTop = n.scrollDOM.scrollTop, n.inputState.lastScrollLeft = n.scrollDOM.scrollLeft;
};
bt.wheel = bt.mousewheel = (n) => {
  n.inputState.lastWheelEvent = Date.now();
};
Nt.keydown = (n, t) => (n.inputState.setSelectionOrigin("select"), t.keyCode == 27 && n.inputState.tabFocusMode != 0 && (n.inputState.tabFocusMode = Date.now() + 2e3), !1);
bt.touchstart = (n, t) => {
  let e = n.inputState, i = t.targetTouches[0];
  e.lastTouchTime = Date.now(), i && (e.lastTouchX = i.clientX, e.lastTouchY = i.clientY), e.setSelectionOrigin("select.pointer");
};
bt.touchmove = (n) => {
  n.inputState.setSelectionOrigin("select.pointer");
};
Nt.mousedown = (n, t) => {
  if (n.observer.flush(), n.inputState.lastTouchTime > Date.now() - 2e3)
    return !1;
  let e = null;
  for (let i of n.state.facet(Ca))
    if (e = i(n, t), e)
      break;
  if (!e && t.button == 0 && (e = ku(n, t)), e) {
    let i = !n.hasFocus;
    n.inputState.startMouseSelection(new gu(n, t, e, i)), i && n.observer.ignore(() => {
      pa(n.contentDOM);
      let r = n.root.activeElement;
      r && !r.contains(n.contentDOM) && r.blur();
    });
    let s = n.inputState.mouseSelection;
    if (s)
      return s.start(t), s.dragging === !1;
  } else
    n.inputState.setSelectionOrigin("select.pointer");
  return !1;
};
function No(n, t, e, i) {
  if (i == 1)
    return y.cursor(t, e);
  if (i == 2)
    return Zf(n.state, t, e);
  {
    let s = n.docView.lineAt(t, e), r = n.state.doc.lineAt(s ? s.posAtEnd : t), o = s ? s.posAtStart : r.from, l = s ? s.posAtEnd : r.to;
    return l < n.state.doc.length && l == r.to && l++, y.range(o, l);
  }
}
const xu = C.ie && C.ie_version <= 11;
let $o = null, Ho = 0, Vo = 0;
function Ka(n) {
  if (!xu)
    return n.detail;
  let t = $o, e = Vo;
  return $o = n, Vo = Date.now(), Ho = !t || e > Date.now() - 400 && Math.abs(t.clientX - n.clientX) < 2 && Math.abs(t.clientY - n.clientY) < 2 ? (Ho + 1) % 3 : 1;
}
function ku(n, t) {
  let e = n.posAndSideAtCoords({ x: t.clientX, y: t.clientY }, !1), i = Ka(t), s = n.state.selection;
  return {
    update(r) {
      r.docChanged && (e.pos = r.changes.mapPos(e.pos), s = s.map(r.changes));
    },
    get(r, o, l) {
      let a = n.posAndSideAtCoords({ x: r.clientX, y: r.clientY }, !1), h, c = No(n, a.pos, a.assoc, i);
      if (e.pos != a.pos && !o) {
        let f = No(n, e.pos, e.assoc, i), u = Math.min(f.from, c.from), d = Math.max(f.to, c.to);
        c = u < c.from ? y.range(u, d, c.assoc) : y.range(d, u, c.assoc);
      }
      return o ? s.replaceRange(s.main.extend(c.from, c.to, c.assoc)) : l && i == 1 && s.ranges.length > 1 && (h = Su(s, a.pos)) ? h : l ? s.addRange(c) : y.create([c]);
    }
  };
}
function Su(n, t) {
  for (let e = 0; e < n.ranges.length; e++) {
    let { from: i, to: s } = n.ranges[e];
    if (i <= t && s >= t)
      return y.create(n.ranges.slice(0, e).concat(n.ranges.slice(e + 1)), n.mainIndex == e ? 0 : n.mainIndex - (n.mainIndex > e ? 1 : 0));
  }
  return null;
}
Nt.dragstart = (n, t) => {
  let { selection: { main: e } } = n.state;
  if (t.target.draggable) {
    let s = n.docView.tile.nearest(t.target);
    if (s && s.isWidget()) {
      let r = s.posAtStart, o = r + s.length;
      (r >= e.to || o <= e.from) && (e = y.range(r, o));
    }
  }
  let { inputState: i } = n;
  return i.mouseSelection && (i.mouseSelection.dragging = !0), i.draggedContent = e, t.dataTransfer && (t.dataTransfer.setData("Text", Gn(n.state, Lr, n.state.sliceDoc(e.from, e.to))), t.dataTransfer.effectAllowed = "copyMove"), !1;
};
Nt.dragend = (n) => (n.inputState.draggedContent = null, !1);
function Fo(n, t, e, i) {
  if (e = Gn(n.state, Rr, e), !e)
    return;
  let s = n.posAtCoords({ x: t.clientX, y: t.clientY }, !1), { draggedContent: r } = n.inputState, o = i && r && bu(n, t) ? { from: r.from, to: r.to } : null, l = { from: s, insert: e }, a = n.state.changes(o ? [o, l] : l);
  n.focus(), n.dispatch({
    changes: a,
    selection: { anchor: a.mapPos(s, -1), head: a.mapPos(s, 1) },
    userEvent: o ? "move.drop" : "input.drop"
  }), n.inputState.draggedContent = null;
}
Nt.drop = (n, t) => {
  if (!t.dataTransfer)
    return !1;
  if (n.state.readOnly)
    return !0;
  let e = t.dataTransfer.files;
  if (e && e.length) {
    let i = Array(e.length), s = 0, r = () => {
      ++s == e.length && Fo(n, t, i.filter((o) => o != null).join(n.state.lineBreak), !1);
    };
    for (let o = 0; o < e.length; o++) {
      let l = new FileReader();
      l.onerror = r, l.onload = () => {
        /[\x00-\x08\x0e-\x1f]{2}/.test(l.result) || (i[o] = l.result), r();
      }, l.readAsText(e[o]);
    }
    return !0;
  } else {
    let i = t.dataTransfer.getData("Text");
    if (i)
      return Fo(n, t, i, !0), !0;
  }
  return !1;
};
Nt.paste = (n, t) => {
  if (n.state.readOnly)
    return !0;
  n.observer.flush();
  let e = ja ? null : t.clipboardData;
  return e ? (qa(n, e.getData("text/plain") || e.getData("text/uri-list")), !0) : (vu(n), !1);
};
function Au(n, t) {
  let e = n.dom.parentNode;
  if (!e)
    return;
  let i = e.appendChild(document.createElement("textarea"));
  i.style.cssText = "position: fixed; left: -10000px; top: 10px", i.value = t, i.focus(), i.selectionEnd = t.length, i.selectionStart = 0, setTimeout(() => {
    i.remove(), n.focus();
  }, 50);
}
function Cu(n) {
  let t = [], e = [], i = !1;
  for (let s of n.selection.ranges)
    s.empty || (t.push(n.sliceDoc(s.from, s.to)), e.push(s));
  if (!t.length) {
    let s = -1;
    for (let { from: r } of n.selection.ranges) {
      let o = n.doc.lineAt(r);
      o.number > s && (t.push(o.text), e.push({ from: o.from, to: Math.min(n.doc.length, o.to + 1) })), s = o.number;
    }
    i = !0;
  }
  return { text: Gn(n, Lr, t.join(n.lineBreak)), ranges: e, linewise: i };
}
let rr = null;
Nt.copy = Nt.cut = (n, t) => {
  if (!xi(n.contentDOM, n.observer.selectionRange))
    return !1;
  let { text: e, ranges: i, linewise: s } = Cu(n.state);
  if (!e && !s)
    return !1;
  rr = s ? e : null, t.type == "cut" && !n.state.readOnly && n.dispatch({
    changes: i,
    scrollIntoView: !0,
    userEvent: "delete.cut"
  });
  let r = ja ? null : t.clipboardData;
  return r ? (r.clearData(), r.setData("text/plain", e), !0) : (Au(n, e), !1);
};
const Ga = /* @__PURE__ */ me.define();
function Ja(n, t) {
  let e = [];
  for (let i of n.facet(Oa)) {
    let s = i(n, t);
    s && e.push(s);
  }
  return e.length ? n.update({ effects: e, annotations: Ga.of(!0) }) : null;
}
function Ya(n) {
  setTimeout(() => {
    let t = n.hasFocus;
    if (t != n.inputState.notifiedFocused) {
      let e = Ja(n.state, t);
      e ? n.dispatch(e) : n.update([]);
    }
  }, 10);
}
bt.focus = (n) => {
  n.inputState.lastFocusTime = Date.now(), !n.scrollDOM.scrollTop && (n.inputState.lastScrollTop || n.inputState.lastScrollLeft) && (n.scrollDOM.scrollTop = n.inputState.lastScrollTop, n.scrollDOM.scrollLeft = n.inputState.lastScrollLeft), Ya(n);
};
bt.blur = (n) => {
  n.observer.clearSelectionRange(), Ya(n);
};
bt.compositionstart = bt.compositionupdate = (n) => {
  n.observer.editContext || (n.inputState.compositionFirstChange == null && (n.inputState.compositionFirstChange = !0), n.inputState.composing < 0 && (n.inputState.composing = 0));
};
bt.compositionend = (n) => {
  n.observer.editContext || (n.inputState.composing = -1, n.inputState.compositionEndedAt = Date.now(), n.inputState.compositionPendingKey = !0, n.inputState.compositionPendingChange = n.observer.pendingRecords().length > 0, n.inputState.compositionFirstChange = null, C.chrome && C.android ? n.observer.flushSoon() : n.inputState.compositionPendingChange ? Promise.resolve().then(() => n.observer.flush()) : setTimeout(() => {
    n.inputState.composing < 0 && n.docView.hasComposition && n.update([]);
  }, 50));
};
bt.contextmenu = (n) => {
  n.inputState.lastContextMenu = Date.now();
};
Nt.beforeinput = (n, t) => {
  var e, i;
  if ((t.inputType == "insertText" || t.inputType == "insertCompositionText") && (n.inputState.insertingText = t.data, n.inputState.insertingTextAt = Date.now()), t.inputType == "insertReplacementText" && n.observer.editContext) {
    let r = (e = t.dataTransfer) === null || e === void 0 ? void 0 : e.getData("text/plain"), o = t.getTargetRanges();
    if (r && o.length) {
      let l = o[0], a = n.posAtDOM(l.startContainer, l.startOffset), h = n.posAtDOM(l.endContainer, l.endOffset);
      return Nr(n, { from: a, to: h, insert: n.state.toText(r) }, null), !0;
    }
  }
  let s;
  if (C.chrome && C.android && (s = za.find((r) => r.inputType == t.inputType)) && (n.observer.delayAndroidKey(s.key, s.keyCode), s.key == "Backspace" || s.key == "Delete")) {
    let r = ((i = window.visualViewport) === null || i === void 0 ? void 0 : i.height) || 0;
    setTimeout(() => {
      var o;
      (((o = window.visualViewport) === null || o === void 0 ? void 0 : o.height) || 0) > r + 10 && n.hasFocus && (n.contentDOM.blur(), n.focus());
    }, 100);
  }
  return C.ios && t.inputType == "deleteContentForward" && n.observer.flushSoon(), C.safari && t.inputType == "insertText" && n.inputState.composing >= 0 && setTimeout(() => bt.compositionend(n, t), 20), !1;
};
const Wo = /* @__PURE__ */ new Set();
function Mu(n) {
  Wo.has(n) || (Wo.add(n), n.addEventListener("copy", () => {
  }), n.addEventListener("cut", () => {
  }));
}
const _o = ["pre-wrap", "normal", "pre-line", "break-spaces"];
let ti = !1;
function zo() {
  ti = !1;
}
class Tu {
  constructor(t) {
    this.lineWrapping = t, this.doc = N.empty, this.heightSamples = {}, this.lineHeight = 14, this.charWidth = 7, this.textHeight = 14, this.lineLength = 30;
  }
  heightForGap(t, e) {
    let i = this.doc.lineAt(e).number - this.doc.lineAt(t).number + 1;
    return this.lineWrapping && (i += Math.max(0, Math.ceil((e - t - i * this.lineLength * 0.5) / this.lineLength))), this.lineHeight * i;
  }
  heightForLine(t) {
    return this.lineWrapping ? (1 + Math.max(0, Math.ceil((t - this.lineLength) / Math.max(1, this.lineLength - 5)))) * this.lineHeight : this.lineHeight;
  }
  setDoc(t) {
    return this.doc = t, this;
  }
  mustRefreshForWrapping(t) {
    return _o.indexOf(t) > -1 != this.lineWrapping;
  }
  mustRefreshForHeights(t) {
    let e = !1;
    for (let i = 0; i < t.length; i++) {
      let s = t[i];
      s < 0 ? i++ : this.heightSamples[Math.floor(s * 10)] || (e = !0, this.heightSamples[Math.floor(s * 10)] = !0);
    }
    return e;
  }
  refresh(t, e, i, s, r, o) {
    let l = _o.indexOf(t) > -1, a = Math.abs(e - this.lineHeight) > 0.3 || this.lineWrapping != l;
    if (this.lineWrapping = l, this.lineHeight = e, this.charWidth = i, this.textHeight = s, this.lineLength = r, a) {
      this.heightSamples = {};
      for (let h = 0; h < o.length; h++) {
        let c = o[h];
        c < 0 ? h++ : this.heightSamples[Math.floor(c * 10)] = !0;
      }
    }
    return a;
  }
}
class Ou {
  constructor(t, e) {
    this.from = t, this.heights = e, this.index = 0;
  }
  get more() {
    return this.index < this.heights.length;
  }
}
class Lt {
  /**
  @internal
  */
  constructor(t, e, i, s, r) {
    this.from = t, this.length = e, this.top = i, this.height = s, this._content = r;
  }
  /**
  The type of element this is. When querying lines, this may be
  an array of all the blocks that make up the line.
  */
  get type() {
    return typeof this._content == "number" ? rt.Text : Array.isArray(this._content) ? this._content : this._content.type;
  }
  /**
  The end of the element as a document position.
  */
  get to() {
    return this.from + this.length;
  }
  /**
  The bottom position of the element.
  */
  get bottom() {
    return this.top + this.height;
  }
  /**
  If this is a widget block, this will return the widget
  associated with it.
  */
  get widget() {
    return this._content instanceof Be ? this._content.widget : null;
  }
  /**
  If this is a textblock, this holds the number of line breaks
  that appear in widgets inside the block.
  */
  get widgetLineBreaks() {
    return typeof this._content == "number" ? this._content : 0;
  }
  /**
  @internal
  */
  join(t) {
    let e = (Array.isArray(this._content) ? this._content : [this]).concat(Array.isArray(t._content) ? t._content : [t]);
    return new Lt(this.from, this.length + t.length, this.top, this.height + t.height, e);
  }
}
var U = /* @__PURE__ */ (function(n) {
  return n[n.ByPos = 0] = "ByPos", n[n.ByHeight = 1] = "ByHeight", n[n.ByPosNoHeight = 2] = "ByPosNoHeight", n;
})(U || (U = {}));
const vn = 1e-3;
class dt {
  constructor(t, e, i = 2) {
    this.length = t, this.height = e, this.flags = i;
  }
  get outdated() {
    return (this.flags & 2) > 0;
  }
  set outdated(t) {
    this.flags = (t ? 2 : 0) | this.flags & -3;
  }
  setHeight(t) {
    this.height != t && (Math.abs(this.height - t) > vn && (ti = !0), this.height = t);
  }
  // Base case is to replace a leaf node, which simply builds a tree
  // from the new nodes and returns that (HeightMapBranch and
  // HeightMapGap override this to actually use from/to)
  replace(t, e, i) {
    return dt.of(i);
  }
  // Again, these are base cases, and are overridden for branch and gap nodes.
  decomposeLeft(t, e) {
    e.push(this);
  }
  decomposeRight(t, e) {
    e.push(this);
  }
  applyChanges(t, e, i, s) {
    let r = this, o = i.doc;
    for (let l = s.length - 1; l >= 0; l--) {
      let { fromA: a, toA: h, fromB: c, toB: f } = s[l], u = r.lineAt(a, U.ByPosNoHeight, i.setDoc(e), 0, 0), d = u.to >= h ? u : r.lineAt(h, U.ByPosNoHeight, i, 0, 0);
      for (f += d.to - h, h = d.to; l > 0 && u.from <= s[l - 1].toA; )
        a = s[l - 1].fromA, c = s[l - 1].fromB, l--, a < u.from && (u = r.lineAt(a, U.ByPosNoHeight, i, 0, 0));
      c += u.from - a, a = u.from;
      let p = $r.build(i.setDoc(o), t, c, f);
      r = Pn(r, r.replace(a, h, p));
    }
    return r.updateHeight(i, 0);
  }
  static empty() {
    return new vt(0, 0, 0);
  }
  // nodes uses null values to indicate the position of line breaks.
  // There are never line breaks at the start or end of the array, or
  // two line breaks next to each other, and the array isn't allowed
  // to be empty (same restrictions as return value from the builder).
  static of(t) {
    if (t.length == 1)
      return t[0];
    let e = 0, i = t.length, s = 0, r = 0;
    for (; ; )
      if (e == i)
        if (s > r * 2) {
          let l = t[e - 1];
          l.break ? t.splice(--e, 1, l.left, null, l.right) : t.splice(--e, 1, l.left, l.right), i += 1 + l.break, s -= l.size;
        } else if (r > s * 2) {
          let l = t[i];
          l.break ? t.splice(i, 1, l.left, null, l.right) : t.splice(i, 1, l.left, l.right), i += 2 + l.break, r -= l.size;
        } else
          break;
      else if (s < r) {
        let l = t[e++];
        l && (s += l.size);
      } else {
        let l = t[--i];
        l && (r += l.size);
      }
    let o = 0;
    return t[e - 1] == null ? (o = 1, e--) : t[e] == null && (o = 1, i++), new Du(dt.of(t.slice(0, e)), o, dt.of(t.slice(i)));
  }
}
function Pn(n, t) {
  return n == t ? n : (n.constructor != t.constructor && (ti = !0), t);
}
dt.prototype.size = 1;
const Eu = /* @__PURE__ */ K.replace({});
class Xa extends dt {
  constructor(t, e, i) {
    super(t, e), this.deco = i, this.spaceAbove = 0;
  }
  mainBlock(t, e) {
    return new Lt(e, this.length, t + this.spaceAbove, this.height - this.spaceAbove, this.deco || 0);
  }
  blockAt(t, e, i, s) {
    return this.spaceAbove && t < i + this.spaceAbove ? new Lt(s, 0, i, this.spaceAbove, Eu) : this.mainBlock(i, s);
  }
  lineAt(t, e, i, s, r) {
    let o = this.mainBlock(s, r);
    return this.spaceAbove ? this.blockAt(0, i, s, r).join(o) : o;
  }
  forEachLine(t, e, i, s, r, o) {
    t <= r + this.length && e >= r && o(this.lineAt(0, U.ByPos, i, s, r));
  }
  setMeasuredHeight(t) {
    let e = t.heights[t.index++];
    e < 0 ? (this.spaceAbove = -e, e = t.heights[t.index++]) : this.spaceAbove = 0, this.setHeight(e);
  }
  updateHeight(t, e = 0, i = !1, s) {
    return s && s.from <= e && s.more && this.setMeasuredHeight(s), this.outdated = !1, this;
  }
  toString() {
    return `block(${this.length})`;
  }
}
class vt extends Xa {
  constructor(t, e, i) {
    super(t, e, null), this.collapsed = 0, this.widgetHeight = 0, this.breaks = 0, this.spaceAbove = i;
  }
  mainBlock(t, e) {
    return new Lt(e, this.length, t + this.spaceAbove, this.height - this.spaceAbove, this.breaks);
  }
  replace(t, e, i) {
    let s = i[0];
    return i.length == 1 && (s instanceof vt || s instanceof nt && s.flags & 4) && Math.abs(this.length - s.length) < 10 ? (s instanceof nt ? s = new vt(s.length, this.height, this.spaceAbove) : s.height = this.height, this.outdated || (s.outdated = !1), s) : dt.of(i);
  }
  updateHeight(t, e = 0, i = !1, s) {
    return s && s.from <= e && s.more ? this.setMeasuredHeight(s) : (i || this.outdated) && (this.spaceAbove = 0, this.setHeight(Math.max(this.widgetHeight, t.heightForLine(this.length - this.collapsed)) + this.breaks * t.lineHeight)), this.outdated = !1, this;
  }
  toString() {
    return `line(${this.length}${this.collapsed ? -this.collapsed : ""}${this.widgetHeight ? ":" + this.widgetHeight : ""})`;
  }
}
class nt extends dt {
  constructor(t) {
    super(t, 0);
  }
  heightMetrics(t, e) {
    let i = t.doc.lineAt(e).number, s = t.doc.lineAt(e + this.length).number, r = s - i + 1, o, l = 0;
    if (t.lineWrapping) {
      let a = Math.min(this.height, t.lineHeight * r);
      o = a / r, this.length > r + 1 && (l = (this.height - a) / (this.length - r - 1));
    } else
      o = this.height / r;
    return { firstLine: i, lastLine: s, perLine: o, perChar: l };
  }
  blockAt(t, e, i, s) {
    let { firstLine: r, lastLine: o, perLine: l, perChar: a } = this.heightMetrics(e, s);
    if (e.lineWrapping) {
      let h = s + (t < e.lineHeight ? 0 : Math.round(Math.max(0, Math.min(1, (t - i) / this.height)) * this.length)), c = e.doc.lineAt(h), f = l + c.length * a, u = Math.max(i, t - f / 2);
      return new Lt(c.from, c.length, u, f, 0);
    } else {
      let h = Math.max(0, Math.min(o - r, Math.floor((t - i) / l))), { from: c, length: f } = e.doc.line(r + h);
      return new Lt(c, f, i + l * h, l, 0);
    }
  }
  lineAt(t, e, i, s, r) {
    if (e == U.ByHeight)
      return this.blockAt(t, i, s, r);
    if (e == U.ByPosNoHeight) {
      let { from: d, to: p } = i.doc.lineAt(t);
      return new Lt(d, p - d, 0, 0, 0);
    }
    let { firstLine: o, perLine: l, perChar: a } = this.heightMetrics(i, r), h = i.doc.lineAt(t), c = l + h.length * a, f = h.number - o, u = s + l * f + a * (h.from - r - f);
    return new Lt(h.from, h.length, Math.max(s, Math.min(u, s + this.height - c)), c, 0);
  }
  forEachLine(t, e, i, s, r, o) {
    t = Math.max(t, r), e = Math.min(e, r + this.length);
    let { firstLine: l, perLine: a, perChar: h } = this.heightMetrics(i, r);
    for (let c = t, f = s; c <= e; ) {
      let u = i.doc.lineAt(c);
      if (c == t) {
        let p = u.number - l;
        f += a * p + h * (t - r - p);
      }
      let d = a + h * u.length;
      o(new Lt(u.from, u.length, f, d, 0)), f += d, c = u.to + 1;
    }
  }
  replace(t, e, i) {
    let s = this.length - e;
    if (s > 0) {
      let r = i[i.length - 1];
      r instanceof nt ? i[i.length - 1] = new nt(r.length + s) : i.push(null, new nt(s - 1));
    }
    if (t > 0) {
      let r = i[0];
      r instanceof nt ? i[0] = new nt(t + r.length) : i.unshift(new nt(t - 1), null);
    }
    return dt.of(i);
  }
  decomposeLeft(t, e) {
    e.push(new nt(t - 1), null);
  }
  decomposeRight(t, e) {
    e.push(null, new nt(this.length - t - 1));
  }
  updateHeight(t, e = 0, i = !1, s) {
    let r = e + this.length;
    if (s && s.from <= e + this.length && s.more) {
      let o = [], l = Math.max(e, s.from), a = -1;
      for (s.from > e && o.push(new nt(s.from - e - 1).updateHeight(t, e)); l <= r && s.more; ) {
        let c = t.doc.lineAt(l).length;
        o.length && o.push(null);
        let f = s.heights[s.index++], u = 0;
        f < 0 && (u = -f, f = s.heights[s.index++]), a == -1 ? a = f : Math.abs(f - a) >= vn && (a = -2);
        let d = new vt(c, f, u);
        d.outdated = !1, o.push(d), l += c + 1;
      }
      l <= r && o.push(null, new nt(r - l).updateHeight(t, l));
      let h = dt.of(o);
      return (a < 0 || Math.abs(h.height - this.height) >= vn || Math.abs(a - this.heightMetrics(t, e).perLine) >= vn) && (ti = !0), Pn(this, h);
    } else (i || this.outdated) && (this.setHeight(t.heightForGap(e, e + this.length)), this.outdated = !1);
    return this;
  }
  toString() {
    return `gap(${this.length})`;
  }
}
class Du extends dt {
  constructor(t, e, i) {
    super(t.length + e + i.length, t.height + i.height, e | (t.outdated || i.outdated ? 2 : 0)), this.left = t, this.right = i, this.size = t.size + i.size;
  }
  get break() {
    return this.flags & 1;
  }
  blockAt(t, e, i, s) {
    let r = i + this.left.height;
    return t < r ? this.left.blockAt(t, e, i, s) : this.right.blockAt(t, e, r, s + this.left.length + this.break);
  }
  lineAt(t, e, i, s, r) {
    let o = s + this.left.height, l = r + this.left.length + this.break, a = e == U.ByHeight ? t < o : t < l, h = a ? this.left.lineAt(t, e, i, s, r) : this.right.lineAt(t, e, i, o, l);
    if (this.break || (a ? h.to < l : h.from > l))
      return h;
    let c = e == U.ByPosNoHeight ? U.ByPosNoHeight : U.ByPos;
    return a ? h.join(this.right.lineAt(l, c, i, o, l)) : this.left.lineAt(l, c, i, s, r).join(h);
  }
  forEachLine(t, e, i, s, r, o) {
    let l = s + this.left.height, a = r + this.left.length + this.break;
    if (this.break)
      t < a && this.left.forEachLine(t, e, i, s, r, o), e >= a && this.right.forEachLine(t, e, i, l, a, o);
    else {
      let h = this.lineAt(a, U.ByPos, i, s, r);
      t < h.from && this.left.forEachLine(t, h.from - 1, i, s, r, o), h.to >= t && h.from <= e && o(h), e > h.to && this.right.forEachLine(h.to + 1, e, i, l, a, o);
    }
  }
  replace(t, e, i) {
    let s = this.left.length + this.break;
    if (e < s)
      return this.balanced(this.left.replace(t, e, i), this.right);
    if (t > this.left.length)
      return this.balanced(this.left, this.right.replace(t - s, e - s, i));
    let r = [];
    t > 0 && this.decomposeLeft(t, r);
    let o = r.length;
    for (let l of i)
      r.push(l);
    if (t > 0 && Uo(r, o - 1), e < this.length) {
      let l = r.length;
      this.decomposeRight(e, r), Uo(r, l);
    }
    return dt.of(r);
  }
  decomposeLeft(t, e) {
    let i = this.left.length;
    if (t <= i)
      return this.left.decomposeLeft(t, e);
    e.push(this.left), this.break && (i++, t >= i && e.push(null)), t > i && this.right.decomposeLeft(t - i, e);
  }
  decomposeRight(t, e) {
    let i = this.left.length, s = i + this.break;
    if (t >= s)
      return this.right.decomposeRight(t - s, e);
    t < i && this.left.decomposeRight(t, e), this.break && t < s && e.push(null), e.push(this.right);
  }
  balanced(t, e) {
    return t.size > 2 * e.size || e.size > 2 * t.size ? dt.of(this.break ? [t, null, e] : [t, e]) : (this.left = Pn(this.left, t), this.right = Pn(this.right, e), this.setHeight(t.height + e.height), this.outdated = t.outdated || e.outdated, this.size = t.size + e.size, this.length = t.length + this.break + e.length, this);
  }
  updateHeight(t, e = 0, i = !1, s) {
    let { left: r, right: o } = this, l = e + r.length + this.break, a = null;
    return s && s.from <= e + r.length && s.more ? a = r = r.updateHeight(t, e, i, s) : r.updateHeight(t, e, i), s && s.from <= l + o.length && s.more ? a = o = o.updateHeight(t, l, i, s) : o.updateHeight(t, l, i), a ? this.balanced(r, o) : (this.height = this.left.height + this.right.height, this.outdated = !1, this);
  }
  toString() {
    return this.left + (this.break ? " " : "-") + this.right;
  }
}
function Uo(n, t) {
  let e, i;
  n[t] == null && (e = n[t - 1]) instanceof nt && (i = n[t + 1]) instanceof nt && n.splice(t - 1, 3, new nt(e.length + 1 + i.length));
}
const Ru = 5;
class $r {
  constructor(t, e) {
    this.pos = t, this.oracle = e, this.nodes = [], this.lineStart = -1, this.lineEnd = -1, this.covering = null, this.writtenTo = t;
  }
  get isCovered() {
    return this.covering && this.nodes[this.nodes.length - 1] == this.covering;
  }
  span(t, e) {
    if (this.lineStart > -1) {
      let i = Math.min(e, this.lineEnd), s = this.nodes[this.nodes.length - 1];
      s instanceof vt ? s.length += i - this.pos : (i > this.pos || !this.isCovered) && this.nodes.push(new vt(i - this.pos, -1, 0)), this.writtenTo = i, e > i && (this.nodes.push(null), this.writtenTo++, this.lineStart = -1);
    }
    this.pos = e;
  }
  point(t, e, i) {
    if (t < e || i.heightRelevant) {
      let s = i.widget ? i.widget.estimatedHeight : 0, r = i.widget ? i.widget.lineBreaks : 0;
      s < 0 && (s = this.oracle.lineHeight);
      let o = e - t;
      i.block ? this.addBlock(new Xa(o, s, i)) : (o || r || s >= Ru) && this.addLineDeco(s, r, o);
    } else e > t && this.span(t, e);
    this.lineEnd > -1 && this.lineEnd < this.pos && (this.lineEnd = this.oracle.doc.lineAt(this.pos).to);
  }
  enterLine() {
    if (this.lineStart > -1)
      return;
    let { from: t, to: e } = this.oracle.doc.lineAt(this.pos);
    this.lineStart = t, this.lineEnd = e, this.writtenTo < t && ((this.writtenTo < t - 1 || this.nodes[this.nodes.length - 1] == null) && this.nodes.push(this.blankContent(this.writtenTo, t - 1)), this.nodes.push(null)), this.pos > t && this.nodes.push(new vt(this.pos - t, -1, 0)), this.writtenTo = this.pos;
  }
  blankContent(t, e) {
    let i = new nt(e - t);
    return this.oracle.doc.lineAt(t).to == e && (i.flags |= 4), i;
  }
  ensureLine() {
    this.enterLine();
    let t = this.nodes.length ? this.nodes[this.nodes.length - 1] : null;
    if (t instanceof vt)
      return t;
    let e = new vt(0, -1, 0);
    return this.nodes.push(e), e;
  }
  addBlock(t) {
    this.enterLine();
    let e = t.deco;
    e && e.startSide > 0 && !this.isCovered && this.ensureLine(), this.nodes.push(t), this.writtenTo = this.pos = this.pos + t.length, e && e.endSide > 0 && (this.covering = t);
  }
  addLineDeco(t, e, i) {
    let s = this.ensureLine();
    s.length += i, s.collapsed += i, s.widgetHeight = Math.max(s.widgetHeight, t), s.breaks += e, this.writtenTo = this.pos = this.pos + i;
  }
  finish(t) {
    let e = this.nodes.length == 0 ? null : this.nodes[this.nodes.length - 1];
    this.lineStart > -1 && !(e instanceof vt) && !this.isCovered ? this.nodes.push(new vt(0, -1, 0)) : (this.writtenTo < this.pos || e == null) && this.nodes.push(this.blankContent(this.writtenTo, this.pos));
    let i = t;
    for (let s of this.nodes)
      s instanceof vt && s.updateHeight(this.oracle, i), i += s ? s.length : 1;
    return this.nodes;
  }
  // Always called with a region that on both sides either stretches
  // to a line break or the end of the document.
  // The returned array uses null to indicate line breaks, but never
  // starts or ends in a line break, or has multiple line breaks next
  // to each other.
  static build(t, e, i, s) {
    let r = new $r(i, t);
    return B.spans(e, i, s, r, 0), r.finish(i);
  }
}
function Lu(n, t, e) {
  let i = new Bu();
  return B.compare(n, t, e, i, 0), i.changes;
}
class Bu {
  constructor() {
    this.changes = [];
  }
  compareRange() {
  }
  comparePoint(t, e, i, s) {
    (t < e || i && i.heightRelevant || s && s.heightRelevant) && qe(t, e, this.changes, 5);
  }
}
function Pu(n, t) {
  let e = n.getBoundingClientRect(), i = n.ownerDocument, s = i.defaultView || window, r = Math.max(0, e.left), o = Math.min(s.innerWidth, e.right), l = Math.max(0, e.top), a = Math.min(s.innerHeight, e.bottom);
  for (let h = n.parentNode; h && h != i.body; )
    if (h.nodeType == 1) {
      let c = h, f = window.getComputedStyle(c);
      if ((c.scrollHeight > c.clientHeight || c.scrollWidth > c.clientWidth) && f.overflow != "visible") {
        let u = c.getBoundingClientRect();
        r = Math.max(r, u.left), o = Math.min(o, u.right), l = Math.max(l, u.top), a = Math.min(h == n.parentNode ? s.innerHeight : a, u.bottom);
      }
      h = f.position == "absolute" || f.position == "fixed" ? c.offsetParent : c.parentNode;
    } else if (h.nodeType == 11)
      h = h.host;
    else
      break;
  return {
    left: r - e.left,
    right: Math.max(r, o) - e.left,
    top: l - (e.top + t),
    bottom: Math.max(l, a) - (e.top + t)
  };
}
function Iu(n) {
  let t = n.getBoundingClientRect(), e = n.ownerDocument.defaultView || window;
  return t.left < e.innerWidth && t.right > 0 && t.top < e.innerHeight && t.bottom > 0;
}
function Nu(n, t) {
  let e = n.getBoundingClientRect();
  return {
    left: 0,
    right: e.right - e.left,
    top: t,
    bottom: e.bottom - (e.top + t)
  };
}
class bs {
  constructor(t, e, i, s) {
    this.from = t, this.to = e, this.size = i, this.displaySize = s;
  }
  static same(t, e) {
    if (t.length != e.length)
      return !1;
    for (let i = 0; i < t.length; i++) {
      let s = t[i], r = e[i];
      if (s.from != r.from || s.to != r.to || s.size != r.size)
        return !1;
    }
    return !0;
  }
  draw(t, e) {
    return K.replace({
      widget: new $u(this.displaySize * (e ? t.scaleY : t.scaleX), e)
    }).range(this.from, this.to);
  }
}
class $u extends zi {
  constructor(t, e) {
    super(), this.size = t, this.vertical = e;
  }
  eq(t) {
    return t.size == this.size && t.vertical == this.vertical;
  }
  toDOM() {
    let t = document.createElement("div");
    return this.vertical ? t.style.height = this.size + "px" : (t.style.width = this.size + "px", t.style.height = "2px", t.style.display = "inline-block"), t;
  }
  get estimatedHeight() {
    return this.vertical ? this.size : -1;
  }
}
class jo {
  constructor(t, e) {
    this.view = t, this.state = e, this.pixelViewport = { left: 0, right: window.innerWidth, top: 0, bottom: 0 }, this.inView = !0, this.paddingTop = 0, this.paddingBottom = 0, this.contentDOMWidth = 0, this.contentDOMHeight = 0, this.editorHeight = 0, this.editorWidth = 0, this.scaleX = 1, this.scaleY = 1, this.scrollOffset = 0, this.scrolledToBottom = !1, this.scrollAnchorPos = 0, this.scrollAnchorHeight = -1, this.scaler = qo, this.scrollTarget = null, this.printing = !1, this.mustMeasureContent = !0, this.defaultTextDirection = j.LTR, this.visibleRanges = [], this.mustEnforceCursorAssoc = !1;
    let i = e.facet(Br).some((s) => typeof s != "function" && s.class == "cm-lineWrapping");
    this.heightOracle = new Tu(i), this.stateDeco = Ko(e), this.heightMap = dt.empty().applyChanges(this.stateDeco, N.empty, this.heightOracle.setDoc(e.doc), [new Tt(0, 0, 0, e.doc.length)]);
    for (let s = 0; s < 2 && (this.viewport = this.getViewport(0, null), !!this.updateForViewport()); s++)
      ;
    this.updateViewportLines(), this.lineGaps = this.ensureLineGaps([]), this.lineGapDeco = K.set(this.lineGaps.map((s) => s.draw(this, !1))), this.scrollParent = t.scrollDOM, this.computeVisibleRanges();
  }
  updateForViewport() {
    let t = [this.viewport], { main: e } = this.state.selection;
    for (let i = 0; i <= 1; i++) {
      let s = i ? e.head : e.anchor;
      if (!t.some(({ from: r, to: o }) => s >= r && s <= o)) {
        let { from: r, to: o } = this.lineBlockAt(s);
        t.push(new nn(r, o));
      }
    }
    return this.viewports = t.sort((i, s) => i.from - s.from), this.updateScaler();
  }
  updateScaler() {
    let t = this.scaler;
    return this.scaler = this.heightMap.height <= 7e6 ? qo : new Hr(this.heightOracle, this.heightMap, this.viewports), t.eq(this.scaler) ? 0 : 2;
  }
  updateViewportLines() {
    this.viewportLines = [], this.heightMap.forEachLine(this.viewport.from, this.viewport.to, this.heightOracle.setDoc(this.state.doc), 0, 0, (t) => {
      this.viewportLines.push(bi(t, this.scaler));
    });
  }
  update(t, e = null) {
    this.state = t.state;
    let i = this.stateDeco;
    this.stateDeco = Ko(this.state);
    let s = t.changedRanges, r = Tt.extendWithRanges(s, Lu(i, this.stateDeco, t ? t.changes : Q.empty(this.state.doc.length))), o = this.heightMap.height, l = this.scrolledToBottom ? null : this.scrollAnchorAt(this.scrollOffset);
    zo(), this.heightMap = this.heightMap.applyChanges(this.stateDeco, t.startState.doc, this.heightOracle.setDoc(this.state.doc), r), (this.heightMap.height != o || ti) && (t.flags |= 2), l ? (this.scrollAnchorPos = t.changes.mapPos(l.from, -1), this.scrollAnchorHeight = l.top) : (this.scrollAnchorPos = -1, this.scrollAnchorHeight = o);
    let a = r.length ? this.mapViewport(this.viewport, t.changes) : this.viewport;
    (e && (e.range.head < a.from || e.range.head > a.to) || !this.viewportIsAppropriate(a)) && (a = this.getViewport(0, e));
    let h = a.from != this.viewport.from || a.to != this.viewport.to;
    this.viewport = a, t.flags |= this.updateForViewport(), (h || !t.changes.empty || t.flags & 2) && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps(this.mapLineGaps(this.lineGaps, t.changes))), t.flags |= this.computeVisibleRanges(t.changes), e && (this.scrollTarget = e), !this.mustEnforceCursorAssoc && (t.selectionSet || t.focusChanged) && t.view.lineWrapping && t.state.selection.main.empty && t.state.selection.main.assoc && !t.state.facet(Da) && (this.mustEnforceCursorAssoc = !0);
  }
  measure() {
    let { view: t } = this, e = t.contentDOM, i = window.getComputedStyle(e), s = this.heightOracle, r = i.whiteSpace;
    this.defaultTextDirection = i.direction == "rtl" ? j.RTL : j.LTR;
    let o = this.heightOracle.mustRefreshForWrapping(r) || this.mustMeasureContent === "refresh", l = e.getBoundingClientRect(), a = o || this.mustMeasureContent || this.contentDOMHeight != l.height;
    this.contentDOMHeight = l.height, this.mustMeasureContent = !1;
    let h = 0, c = 0;
    if (l.width && l.height) {
      let { scaleX: k, scaleY: S } = ua(e, l);
      (k > 5e-3 && Math.abs(this.scaleX - k) > 5e-3 || S > 5e-3 && Math.abs(this.scaleY - S) > 5e-3) && (this.scaleX = k, this.scaleY = S, h |= 16, o = a = !0);
    }
    let f = (parseInt(i.paddingTop) || 0) * this.scaleY, u = (parseInt(i.paddingBottom) || 0) * this.scaleY;
    (this.paddingTop != f || this.paddingBottom != u) && (this.paddingTop = f, this.paddingBottom = u, h |= 18), this.editorWidth != t.scrollDOM.clientWidth && (s.lineWrapping && (a = !0), this.editorWidth = t.scrollDOM.clientWidth, h |= 16);
    let d = da(this.view.contentDOM, !1).y;
    d != this.scrollParent && (this.scrollParent = d, this.scrollAnchorHeight = -1, this.scrollOffset = 0);
    let p = this.getScrollOffset();
    this.scrollOffset != p && (this.scrollAnchorHeight = -1, this.scrollOffset = p), this.scrolledToBottom = ga(this.scrollParent || t.win);
    let g = (this.printing ? Nu : Pu)(e, this.paddingTop), m = g.top - this.pixelViewport.top, b = g.bottom - this.pixelViewport.bottom;
    this.pixelViewport = g;
    let v = this.pixelViewport.bottom > this.pixelViewport.top && this.pixelViewport.right > this.pixelViewport.left;
    if (v != this.inView && (this.inView = v, v && (a = !0)), !this.inView && !this.scrollTarget && !Iu(t.dom))
      return 0;
    let w = l.width;
    if ((this.contentDOMWidth != w || this.editorHeight != t.scrollDOM.clientHeight) && (this.contentDOMWidth = l.width, this.editorHeight = t.scrollDOM.clientHeight, h |= 16), a) {
      let k = t.docView.measureVisibleLineHeights(this.viewport);
      if (s.mustRefreshForHeights(k) && (o = !0), o || s.lineWrapping && Math.abs(w - this.contentDOMWidth) > s.charWidth) {
        let { lineHeight: S, charWidth: A, textHeight: R } = t.docView.measureTextSize();
        o = S > 0 && s.refresh(r, S, A, R, Math.max(5, w / A), k), o && (t.docView.minWidth = 0, h |= 16);
      }
      m > 0 && b > 0 ? c = Math.max(m, b) : m < 0 && b < 0 && (c = Math.min(m, b)), zo();
      for (let S of this.viewports) {
        let A = S.from == this.viewport.from ? k : t.docView.measureVisibleLineHeights(S);
        this.heightMap = (o ? dt.empty().applyChanges(this.stateDeco, N.empty, this.heightOracle, [new Tt(0, 0, 0, t.state.doc.length)]) : this.heightMap).updateHeight(s, 0, o, new Ou(S.from, A));
      }
      ti && (h |= 2);
    }
    let O = !this.viewportIsAppropriate(this.viewport, c) || this.scrollTarget && (this.scrollTarget.range.head < this.viewport.from || this.scrollTarget.range.head > this.viewport.to);
    return O && (h & 2 && (h |= this.updateScaler()), this.viewport = this.getViewport(c, this.scrollTarget), h |= this.updateForViewport()), (h & 2 || O) && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps(o ? [] : this.lineGaps, t)), h |= this.computeVisibleRanges(), this.mustEnforceCursorAssoc && (this.mustEnforceCursorAssoc = !1, t.docView.enforceCursorAssoc()), h;
  }
  get visibleTop() {
    return this.scaler.fromDOM(this.pixelViewport.top);
  }
  get visibleBottom() {
    return this.scaler.fromDOM(this.pixelViewport.bottom);
  }
  getViewport(t, e) {
    let i = 0.5 - Math.max(-0.5, Math.min(0.5, t / 1e3 / 2)), s = this.heightMap, r = this.heightOracle, { visibleTop: o, visibleBottom: l } = this, a = new nn(s.lineAt(o - i * 1e3, U.ByHeight, r, 0, 0).from, s.lineAt(l + (1 - i) * 1e3, U.ByHeight, r, 0, 0).to);
    if (e) {
      let { head: h } = e.range;
      if (h < a.from || h > a.to) {
        let c = Math.min(this.editorHeight, this.pixelViewport.bottom - this.pixelViewport.top), f = s.lineAt(h, U.ByPos, r, 0, 0), u;
        e.y == "center" ? u = (f.top + f.bottom) / 2 - c / 2 : e.y == "start" || e.y == "nearest" && h < a.from ? u = f.top : u = f.bottom - c, a = new nn(s.lineAt(u - 1e3 / 2, U.ByHeight, r, 0, 0).from, s.lineAt(u + c + 1e3 / 2, U.ByHeight, r, 0, 0).to);
      }
    }
    return a;
  }
  mapViewport(t, e) {
    let i = e.mapPos(t.from, -1), s = e.mapPos(t.to, 1);
    return new nn(this.heightMap.lineAt(i, U.ByPos, this.heightOracle, 0, 0).from, this.heightMap.lineAt(s, U.ByPos, this.heightOracle, 0, 0).to);
  }
  // Checks if a given viewport covers the visible part of the
  // document and not too much beyond that.
  viewportIsAppropriate({ from: t, to: e }, i = 0) {
    if (!this.inView)
      return !0;
    let { top: s } = this.heightMap.lineAt(t, U.ByPos, this.heightOracle, 0, 0), { bottom: r } = this.heightMap.lineAt(e, U.ByPos, this.heightOracle, 0, 0), { visibleTop: o, visibleBottom: l } = this;
    return (t == 0 || s <= o - Math.max(10, Math.min(
      -i,
      250
      /* VP.MaxCoverMargin */
    ))) && (e == this.state.doc.length || r >= l + Math.max(10, Math.min(
      i,
      250
      /* VP.MaxCoverMargin */
    ))) && s > o - 2 * 1e3 && r < l + 2 * 1e3;
  }
  mapLineGaps(t, e) {
    if (!t.length || e.empty)
      return t;
    let i = [];
    for (let s of t)
      e.touchesRange(s.from, s.to) || i.push(new bs(e.mapPos(s.from), e.mapPos(s.to), s.size, s.displaySize));
    return i;
  }
  // Computes positions in the viewport where the start or end of a
  // line should be hidden, trying to reuse existing line gaps when
  // appropriate to avoid unneccesary redraws.
  // Uses crude character-counting for the positioning and sizing,
  // since actual DOM coordinates aren't always available and
  // predictable. Relies on generous margins (see LG.Margin) to hide
  // the artifacts this might produce from the user.
  ensureLineGaps(t, e) {
    let i = this.heightOracle.lineWrapping, s = i ? 1e4 : 2e3, r = s >> 1, o = s << 1;
    if (this.defaultTextDirection != j.LTR && !i)
      return [];
    let l = [], a = (c, f, u, d) => {
      if (f - c < r)
        return;
      let p = this.state.selection.main, g = [p.from];
      p.empty || g.push(p.to);
      for (let b of g)
        if (b > c && b < f) {
          a(c, b - 10, u, d), a(b + 10, f, u, d);
          return;
        }
      let m = Vu(t, (b) => b.from >= u.from && b.to <= u.to && Math.abs(b.from - c) < r && Math.abs(b.to - f) < r && !g.some((v) => b.from < v && b.to > v));
      if (!m) {
        if (f < u.to && e && i && e.visibleRanges.some((w) => w.from <= f && w.to >= f)) {
          let w = e.moveToLineBoundary(y.cursor(f), !1, !0).head;
          w > c && (f = w);
        }
        let b = this.gapSize(u, c, f, d), v = i || b < 2e6 ? b : 2e6;
        m = new bs(c, f, b, v);
      }
      l.push(m);
    }, h = (c) => {
      if (c.length < o || c.type != rt.Text)
        return;
      let f = Hu(c.from, c.to, this.stateDeco);
      if (f.total < o)
        return;
      let u = this.scrollTarget ? this.scrollTarget.range.head : null, d, p;
      if (i) {
        let g = s / this.heightOracle.lineLength * this.heightOracle.lineHeight, m, b;
        if (u != null) {
          let v = rn(f, u), w = ((this.visibleBottom - this.visibleTop) / 2 + g) / c.height;
          m = v - w, b = v + w;
        } else
          m = (this.visibleTop - c.top - g) / c.height, b = (this.visibleBottom - c.top + g) / c.height;
        d = sn(f, m), p = sn(f, b);
      } else {
        let g = f.total * this.heightOracle.charWidth, m = s * this.heightOracle.charWidth, b = 0;
        if (g > 2e6)
          for (let S of t)
            S.from >= c.from && S.from < c.to && S.size != S.displaySize && S.from * this.heightOracle.charWidth + b < this.pixelViewport.left && (b = S.size - S.displaySize);
        let v = this.pixelViewport.left + b, w = this.pixelViewport.right + b, O, k;
        if (u != null) {
          let S = rn(f, u), A = ((w - v) / 2 + m) / g;
          O = S - A, k = S + A;
        } else
          O = (v - m) / g, k = (w + m) / g;
        d = sn(f, O), p = sn(f, k);
      }
      d > c.from && a(c.from, d, c, f), p < c.to && a(p, c.to, c, f);
    };
    for (let c of this.viewportLines)
      Array.isArray(c.type) ? c.type.forEach(h) : h(c);
    return l;
  }
  gapSize(t, e, i, s) {
    let r = rn(s, i) - rn(s, e);
    return this.heightOracle.lineWrapping ? t.height * r : s.total * this.heightOracle.charWidth * r;
  }
  updateLineGaps(t) {
    bs.same(t, this.lineGaps) || (this.lineGaps = t, this.lineGapDeco = K.set(t.map((e) => e.draw(this, this.heightOracle.lineWrapping))));
  }
  computeVisibleRanges(t) {
    let e = this.stateDeco;
    this.lineGaps.length && (e = e.concat(this.lineGapDeco));
    let i = [];
    B.spans(e, this.viewport.from, this.viewport.to, {
      span(r, o) {
        i.push({ from: r, to: o });
      },
      point() {
      }
    }, 20);
    let s = 0;
    if (i.length != this.visibleRanges.length)
      s = 12;
    else
      for (let r = 0; r < i.length && !(s & 8); r++) {
        let o = this.visibleRanges[r], l = i[r];
        (o.from != l.from || o.to != l.to) && (s |= 4, t && t.mapPos(o.from, -1) == l.from && t.mapPos(o.to, 1) == l.to || (s |= 8));
      }
    return this.visibleRanges = i, s;
  }
  lineBlockAt(t) {
    return t >= this.viewport.from && t <= this.viewport.to && this.viewportLines.find((e) => e.from <= t && e.to >= t) || bi(this.heightMap.lineAt(t, U.ByPos, this.heightOracle, 0, 0), this.scaler);
  }
  lineBlockAtHeight(t) {
    return t >= this.viewportLines[0].top && t <= this.viewportLines[this.viewportLines.length - 1].bottom && this.viewportLines.find((e) => e.top <= t && e.bottom >= t) || bi(this.heightMap.lineAt(this.scaler.fromDOM(t), U.ByHeight, this.heightOracle, 0, 0), this.scaler);
  }
  getScrollOffset() {
    return (this.scrollParent == this.view.scrollDOM ? this.scrollParent.scrollTop : (this.scrollParent ? this.scrollParent.getBoundingClientRect().top : 0) - this.view.contentDOM.getBoundingClientRect().top) * this.scaleY;
  }
  scrollAnchorAt(t) {
    let e = this.lineBlockAtHeight(t + 8);
    return e.from >= this.viewport.from || this.viewportLines[0].top - t > 200 ? e : this.viewportLines[0];
  }
  elementAtHeight(t) {
    return bi(this.heightMap.blockAt(this.scaler.fromDOM(t), this.heightOracle, 0, 0), this.scaler);
  }
  get docHeight() {
    return this.scaler.toDOM(this.heightMap.height);
  }
  get contentHeight() {
    return this.docHeight + this.paddingTop + this.paddingBottom;
  }
}
class nn {
  constructor(t, e) {
    this.from = t, this.to = e;
  }
}
function Hu(n, t, e) {
  let i = [], s = n, r = 0;
  return B.spans(e, n, t, {
    span() {
    },
    point(o, l) {
      o > s && (i.push({ from: s, to: o }), r += o - s), s = l;
    }
  }, 20), s < t && (i.push({ from: s, to: t }), r += t - s), { total: r, ranges: i };
}
function sn({ total: n, ranges: t }, e) {
  if (e <= 0)
    return t[0].from;
  if (e >= 1)
    return t[t.length - 1].to;
  let i = Math.floor(n * e);
  for (let s = 0; ; s++) {
    let { from: r, to: o } = t[s], l = o - r;
    if (i <= l)
      return r + i;
    i -= l;
  }
}
function rn(n, t) {
  let e = 0;
  for (let { from: i, to: s } of n.ranges) {
    if (t <= s) {
      e += t - i;
      break;
    }
    e += s - i;
  }
  return e / n.total;
}
function Vu(n, t) {
  for (let e of n)
    if (t(e))
      return e;
}
const qo = {
  toDOM(n) {
    return n;
  },
  fromDOM(n) {
    return n;
  },
  scale: 1,
  eq(n) {
    return n == this;
  }
};
function Ko(n) {
  let t = n.facet(jn).filter((i) => typeof i != "function"), e = n.facet(Pr).filter((i) => typeof i != "function");
  return e.length && t.push(B.join(e)), t;
}
class Hr {
  constructor(t, e, i) {
    let s = 0, r = 0, o = 0;
    this.viewports = i.map(({ from: l, to: a }) => {
      let h = e.lineAt(l, U.ByPos, t, 0, 0).top, c = e.lineAt(a, U.ByPos, t, 0, 0).bottom;
      return s += c - h, { from: l, to: a, top: h, bottom: c, domTop: 0, domBottom: 0 };
    }), this.scale = (7e6 - s) / (e.height - s);
    for (let l of this.viewports)
      l.domTop = o + (l.top - r) * this.scale, o = l.domBottom = l.domTop + (l.bottom - l.top), r = l.bottom;
  }
  toDOM(t) {
    for (let e = 0, i = 0, s = 0; ; e++) {
      let r = e < this.viewports.length ? this.viewports[e] : null;
      if (!r || t < r.top)
        return s + (t - i) * this.scale;
      if (t <= r.bottom)
        return r.domTop + (t - r.top);
      i = r.bottom, s = r.domBottom;
    }
  }
  fromDOM(t) {
    for (let e = 0, i = 0, s = 0; ; e++) {
      let r = e < this.viewports.length ? this.viewports[e] : null;
      if (!r || t < r.domTop)
        return i + (t - s) / this.scale;
      if (t <= r.domBottom)
        return r.top + (t - r.domTop);
      i = r.bottom, s = r.domBottom;
    }
  }
  eq(t) {
    return t instanceof Hr ? this.scale == t.scale && this.viewports.length == t.viewports.length && this.viewports.every((e, i) => e.from == t.viewports[i].from && e.to == t.viewports[i].to) : !1;
  }
}
function bi(n, t) {
  if (t.scale == 1)
    return n;
  let e = t.toDOM(n.top), i = t.toDOM(n.bottom);
  return new Lt(n.from, n.length, e, i - e, Array.isArray(n._content) ? n._content.map((s) => bi(s, t)) : n._content);
}
const on = /* @__PURE__ */ M.define({ combine: (n) => n.join(" ") }), or = /* @__PURE__ */ M.define({ combine: (n) => n.indexOf(!0) > -1 }), lr = /* @__PURE__ */ ce.newName(), Za = /* @__PURE__ */ ce.newName(), Qa = /* @__PURE__ */ ce.newName(), th = { "&light": "." + Za, "&dark": "." + Qa };
function ar(n, t, e) {
  return new ce(t, {
    finish(i) {
      return /&/.test(i) ? i.replace(/&\w*/, (s) => {
        if (s == "&")
          return n;
        if (!e || !e[s])
          throw new RangeError(`Unsupported selector: ${s}`);
        return e[s];
      }) : n + " " + i;
    }
  });
}
const Fu = /* @__PURE__ */ ar("." + lr, {
  "&": {
    position: "relative !important",
    boxSizing: "border-box",
    "&.cm-focused": {
      // Provide a simple default outline to make sure a focused
      // editor is visually distinct. Can't leave the default behavior
      // because that will apply to the content element, which is
      // inside the scrollable container and doesn't include the
      // gutters. We also can't use an 'auto' outline, since those
      // are, for some reason, drawn behind the element content, which
      // will cause things like the active line background to cover
      // the outline (#297).
      outline: "1px dotted #212121"
    },
    display: "flex !important",
    flexDirection: "column"
  },
  ".cm-scroller": {
    display: "flex !important",
    alignItems: "flex-start !important",
    fontFamily: "monospace",
    lineHeight: 1.4,
    height: "100%",
    overflowX: "auto",
    position: "relative",
    zIndex: 0,
    overflowAnchor: "none"
  },
  ".cm-content": {
    margin: 0,
    flexGrow: 2,
    flexShrink: 0,
    display: "block",
    whiteSpace: "pre",
    wordWrap: "normal",
    // Issue #456
    boxSizing: "border-box",
    minHeight: "100%",
    padding: "4px 0",
    outline: "none",
    "&[contenteditable=true]": {
      WebkitUserModify: "read-write-plaintext-only"
    }
  },
  ".cm-lineWrapping": {
    whiteSpace_fallback: "pre-wrap",
    // For IE
    whiteSpace: "break-spaces",
    wordBreak: "break-word",
    // For Safari, which doesn't support overflow-wrap: anywhere
    overflowWrap: "anywhere",
    flexShrink: 1
  },
  "&light .cm-content": { caretColor: "black" },
  "&dark .cm-content": { caretColor: "white" },
  ".cm-line": {
    display: "block",
    padding: "0 2px 0 6px"
  },
  ".cm-layer": {
    position: "absolute",
    left: 0,
    top: 0,
    contain: "size style",
    "& > *": {
      position: "absolute"
    }
  },
  "&light .cm-selectionBackground": {
    background: "#d9d9d9"
  },
  "&dark .cm-selectionBackground": {
    background: "#222"
  },
  "&light.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
    background: "#d7d4f0"
  },
  "&dark.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
    background: "#233"
  },
  ".cm-cursorLayer": {
    pointerEvents: "none"
  },
  "&.cm-focused > .cm-scroller > .cm-cursorLayer": {
    animation: "steps(1) cm-blink 1.2s infinite"
  },
  // Two animations defined so that we can switch between them to
  // restart the animation without forcing another style
  // recomputation.
  "@keyframes cm-blink": { "0%": {}, "50%": { opacity: 0 }, "100%": {} },
  "@keyframes cm-blink2": { "0%": {}, "50%": { opacity: 0 }, "100%": {} },
  ".cm-cursor, .cm-dropCursor": {
    borderLeft: "1.2px solid black",
    marginLeft: "-0.6px",
    pointerEvents: "none"
  },
  ".cm-cursor": {
    display: "none"
  },
  "&dark .cm-cursor": {
    borderLeftColor: "#ddd"
  },
  ".cm-selectionHandle": {
    backgroundColor: "currentColor",
    width: "1.5px"
  },
  ".cm-selectionHandle-start::before, .cm-selectionHandle-end::before": {
    content: '""',
    backgroundColor: "inherit",
    borderRadius: "50%",
    width: "8px",
    height: "8px",
    position: "absolute",
    left: "-3.25px"
  },
  ".cm-selectionHandle-start::before": { top: "-8px" },
  ".cm-selectionHandle-end::before": { bottom: "-8px" },
  ".cm-dropCursor": {
    position: "absolute"
  },
  "&.cm-focused > .cm-scroller > .cm-cursorLayer .cm-cursor": {
    display: "block"
  },
  ".cm-iso": {
    unicodeBidi: "isolate"
  },
  ".cm-announced": {
    position: "fixed",
    top: "-10000px"
  },
  "@media print": {
    ".cm-announced": { display: "none" }
  },
  "&light .cm-activeLine": { backgroundColor: "#cceeff44" },
  "&dark .cm-activeLine": { backgroundColor: "#99eeff33" },
  "&light .cm-specialChar": { color: "red" },
  "&dark .cm-specialChar": { color: "#f78" },
  ".cm-gutters": {
    flexShrink: 0,
    display: "flex",
    height: "100%",
    boxSizing: "border-box",
    zIndex: 200
  },
  ".cm-gutters-before": { insetInlineStart: 0 },
  ".cm-gutters-after": { insetInlineEnd: 0 },
  "&light .cm-gutters": {
    backgroundColor: "#f5f5f5",
    color: "#6c6c6c",
    border: "0px solid #ddd",
    "&.cm-gutters-before": { borderRightWidth: "1px" },
    "&.cm-gutters-after": { borderLeftWidth: "1px" }
  },
  "&dark .cm-gutters": {
    backgroundColor: "#333338",
    color: "#ccc"
  },
  ".cm-gutter": {
    display: "flex !important",
    // Necessary -- prevents margin collapsing
    flexDirection: "column",
    flexShrink: 0,
    boxSizing: "border-box",
    minHeight: "100%",
    overflow: "hidden"
  },
  ".cm-gutterElement": {
    boxSizing: "border-box"
  },
  ".cm-lineNumbers .cm-gutterElement": {
    padding: "0 3px 0 5px",
    minWidth: "20px",
    textAlign: "right",
    whiteSpace: "nowrap"
  },
  "&light .cm-activeLineGutter": {
    backgroundColor: "#e2f2ff"
  },
  "&dark .cm-activeLineGutter": {
    backgroundColor: "#222227"
  },
  ".cm-panels": {
    boxSizing: "border-box",
    position: "sticky",
    left: 0,
    right: 0,
    zIndex: 300
  },
  "&light .cm-panels": {
    backgroundColor: "#f5f5f5",
    color: "black"
  },
  "&light .cm-panels-top": {
    borderBottom: "1px solid #ddd"
  },
  "&light .cm-panels-bottom": {
    borderTop: "1px solid #ddd"
  },
  "&dark .cm-panels": {
    backgroundColor: "#333338",
    color: "white"
  },
  ".cm-dialog": {
    padding: "2px 19px 4px 6px",
    position: "relative",
    "& label": { fontSize: "80%" }
  },
  ".cm-dialog-close": {
    position: "absolute",
    top: "3px",
    right: "4px",
    backgroundColor: "inherit",
    border: "none",
    font: "inherit",
    fontSize: "14px",
    padding: "0"
  },
  ".cm-tab": {
    display: "inline-block",
    overflow: "hidden",
    verticalAlign: "bottom"
  },
  ".cm-widgetBuffer": {
    verticalAlign: "text-top",
    height: "1em",
    width: 0,
    display: "inline"
  },
  ".cm-placeholder": {
    color: "#888",
    display: "inline-block",
    verticalAlign: "top",
    userSelect: "none"
  },
  ".cm-highlightSpace": {
    backgroundImage: "radial-gradient(circle at 50% 55%, #aaa 20%, transparent 5%)",
    backgroundPosition: "center"
  },
  ".cm-highlightTab": {
    backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="20"><path stroke="%23888" stroke-width="1" fill="none" d="M1 10H196L190 5M190 15L196 10M197 4L197 16"/></svg>')`,
    backgroundSize: "auto 100%",
    backgroundPosition: "right 90%",
    backgroundRepeat: "no-repeat"
  },
  ".cm-trailingSpace": {
    backgroundColor: "#ff332255"
  },
  ".cm-button": {
    verticalAlign: "middle",
    color: "inherit",
    fontSize: "70%",
    padding: ".2em 1em",
    borderRadius: "1px"
  },
  "&light .cm-button": {
    backgroundImage: "linear-gradient(#eff1f5, #d9d9df)",
    border: "1px solid #888",
    "&:active": {
      backgroundImage: "linear-gradient(#b4b4b4, #d0d3d6)"
    }
  },
  "&dark .cm-button": {
    backgroundImage: "linear-gradient(#393939, #111)",
    border: "1px solid #888",
    "&:active": {
      backgroundImage: "linear-gradient(#111, #333)"
    }
  },
  ".cm-textfield": {
    verticalAlign: "middle",
    color: "inherit",
    fontSize: "70%",
    border: "1px solid silver",
    padding: ".2em .5em"
  },
  "&light .cm-textfield": {
    backgroundColor: "white"
  },
  "&dark .cm-textfield": {
    border: "1px solid #555",
    backgroundColor: "inherit"
  }
}, th), Wu = {
  childList: !0,
  characterData: !0,
  subtree: !0,
  attributes: !0,
  characterDataOldValue: !0
}, ys = C.ie && C.ie_version <= 11;
class _u {
  constructor(t) {
    this.view = t, this.active = !1, this.editContext = null, this.selectionRange = new yf(), this.selectionChanged = !1, this.delayedFlush = -1, this.resizeTimeout = -1, this.queue = [], this.delayedAndroidKey = null, this.flushingAndroidKey = -1, this.lastChange = 0, this.scrollTargets = [], this.intersection = null, this.resizeScroll = null, this.intersecting = !1, this.gapIntersection = null, this.gaps = [], this.printQuery = null, this.parentCheck = -1, this.dom = t.contentDOM, this.observer = new MutationObserver((e) => {
      for (let i of e)
        this.queue.push(i);
      (C.ie && C.ie_version <= 11 || C.ios && t.composing) && e.some((i) => i.type == "childList" && i.removedNodes.length || i.type == "characterData" && i.oldValue.length > i.target.nodeValue.length) ? this.flushSoon() : this.flush();
    }), window.EditContext && C.android && t.constructor.EDIT_CONTEXT !== !1 && // Chrome <126 doesn't support inverted selections in edit context (#1392)
    !(C.chrome && C.chrome_version < 126) && (this.editContext = new Uu(t), t.state.facet(te) && (t.contentDOM.editContext = this.editContext.editContext)), ys && (this.onCharData = (e) => {
      this.queue.push({
        target: e.target,
        type: "characterData",
        oldValue: e.prevValue
      }), this.flushSoon();
    }), this.onSelectionChange = this.onSelectionChange.bind(this), this.onResize = this.onResize.bind(this), this.onPrint = this.onPrint.bind(this), this.onScroll = this.onScroll.bind(this), window.matchMedia && (this.printQuery = window.matchMedia("print")), typeof ResizeObserver == "function" && (this.resizeScroll = new ResizeObserver(() => {
      var e;
      ((e = this.view.docView) === null || e === void 0 ? void 0 : e.lastUpdate) < Date.now() - 75 && this.onResize();
    }), this.resizeScroll.observe(t.scrollDOM)), this.addWindowListeners(this.win = t.win), this.start(), typeof IntersectionObserver == "function" && (this.intersection = new IntersectionObserver((e) => {
      this.parentCheck < 0 && (this.parentCheck = setTimeout(this.listenForScroll.bind(this), 1e3)), e.length > 0 && e[e.length - 1].intersectionRatio > 0 != this.intersecting && (this.intersecting = !this.intersecting, this.intersecting != this.view.inView && this.onScrollChanged(document.createEvent("Event")));
    }, { threshold: [0, 1e-3] }), this.intersection.observe(this.dom), this.gapIntersection = new IntersectionObserver((e) => {
      e.length > 0 && e[e.length - 1].intersectionRatio > 0 && this.onScrollChanged(document.createEvent("Event"));
    }, {})), this.listenForScroll(), this.readSelectionRange();
  }
  onScrollChanged(t) {
    this.view.inputState.runHandlers("scroll", t), this.intersecting && this.view.measure();
  }
  onScroll(t) {
    this.intersecting && this.flush(!1), this.editContext && this.view.requestMeasure(this.editContext.measureReq), this.onScrollChanged(t);
  }
  onResize() {
    this.resizeTimeout < 0 && (this.resizeTimeout = setTimeout(() => {
      this.resizeTimeout = -1, this.view.requestMeasure();
    }, 50));
  }
  onPrint(t) {
    (t.type == "change" || !t.type) && !t.matches || (this.view.viewState.printing = !0, this.view.measure(), setTimeout(() => {
      this.view.viewState.printing = !1, this.view.requestMeasure();
    }, 500));
  }
  updateGaps(t) {
    if (this.gapIntersection && (t.length != this.gaps.length || this.gaps.some((e, i) => e != t[i]))) {
      this.gapIntersection.disconnect();
      for (let e of t)
        this.gapIntersection.observe(e);
      this.gaps = t;
    }
  }
  onSelectionChange(t) {
    let e = this.selectionChanged;
    if (!this.readSelectionRange() || this.delayedAndroidKey)
      return;
    let { view: i } = this, s = this.selectionRange;
    if (i.state.facet(te) ? i.root.activeElement != this.dom : !xi(this.dom, s))
      return;
    let r = s.anchorNode && i.docView.tile.nearest(s.anchorNode);
    if (r && r.isWidget() && r.widget.ignoreEvent(t)) {
      e || (this.selectionChanged = !1);
      return;
    }
    (C.ie && C.ie_version <= 11 || C.android && C.chrome) && !i.state.selection.main.empty && // (Selection.isCollapsed isn't reliable on IE)
    s.focusNode && ki(s.focusNode, s.focusOffset, s.anchorNode, s.anchorOffset) ? this.flushSoon() : this.flush(!1);
  }
  readSelectionRange() {
    let { view: t } = this, e = Li(t.root);
    if (!e)
      return !1;
    let i = C.safari && t.root.nodeType == 11 && t.root.activeElement == this.dom && zu(this.view, e) || e;
    if (!i || this.selectionRange.eq(i))
      return !1;
    let s = xi(this.dom, i);
    return s && !this.selectionChanged && t.inputState.lastFocusTime > Date.now() - 200 && t.inputState.lastTouchTime < Date.now() - 300 && vf(this.dom, i) ? (this.view.inputState.lastFocusTime = 0, t.docView.updateSelection(), !1) : (this.selectionRange.setRange(i), s && (this.selectionChanged = !0), !0);
  }
  setSelectionRange(t, e) {
    this.selectionRange.set(t.node, t.offset, e.node, e.offset), this.selectionChanged = !1;
  }
  clearSelectionRange() {
    this.selectionRange.set(null, 0, null, 0);
  }
  listenForScroll() {
    this.parentCheck = -1;
    let t = 0, e = null;
    for (let i = this.dom; i; )
      if (i.nodeType == 1)
        !e && t < this.scrollTargets.length && this.scrollTargets[t] == i ? t++ : e || (e = this.scrollTargets.slice(0, t)), e && e.push(i), i = i.assignedSlot || i.parentNode;
      else if (i.nodeType == 11)
        i = i.host;
      else
        break;
    if (t < this.scrollTargets.length && !e && (e = this.scrollTargets.slice(0, t)), e) {
      for (let i of this.scrollTargets)
        i.removeEventListener("scroll", this.onScroll);
      for (let i of this.scrollTargets = e)
        i.addEventListener("scroll", this.onScroll);
    }
  }
  ignore(t) {
    if (!this.active)
      return t();
    try {
      return this.stop(), t();
    } finally {
      this.start(), this.clear();
    }
  }
  start() {
    this.active || (this.observer.observe(this.dom, Wu), ys && this.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.active = !0);
  }
  stop() {
    this.active && (this.active = !1, this.observer.disconnect(), ys && this.dom.removeEventListener("DOMCharacterDataModified", this.onCharData));
  }
  // Throw away any pending changes
  clear() {
    this.processRecords(), this.queue.length = 0, this.selectionChanged = !1;
  }
  // Chrome Android, especially in combination with GBoard, not only
  // doesn't reliably fire regular key events, but also often
  // surrounds the effect of enter or backspace with a bunch of
  // composition events that, when interrupted, cause text duplication
  // or other kinds of corruption. This hack makes the editor back off
  // from handling DOM changes for a moment when such a key is
  // detected (via beforeinput or keydown), and then tries to flush
  // them or, if that has no effect, dispatches the given key.
  delayAndroidKey(t, e) {
    var i;
    if (!this.delayedAndroidKey) {
      let s = () => {
        let r = this.delayedAndroidKey;
        r && (this.clearDelayedAndroidKey(), this.view.inputState.lastKeyCode = r.keyCode, this.view.inputState.lastKeyTime = Date.now(), !this.flush() && r.force && Ke(this.dom, r.key, r.keyCode));
      };
      this.flushingAndroidKey = this.view.win.requestAnimationFrame(s);
    }
    (!this.delayedAndroidKey || t == "Enter") && (this.delayedAndroidKey = {
      key: t,
      keyCode: e,
      // Only run the key handler when no changes are detected if
      // this isn't coming right after another change, in which case
      // it is probably part of a weird chain of updates, and should
      // be ignored if it returns the DOM to its previous state.
      force: this.lastChange < Date.now() - 50 || !!(!((i = this.delayedAndroidKey) === null || i === void 0) && i.force)
    });
  }
  clearDelayedAndroidKey() {
    this.win.cancelAnimationFrame(this.flushingAndroidKey), this.delayedAndroidKey = null, this.flushingAndroidKey = -1;
  }
  flushSoon() {
    this.delayedFlush < 0 && (this.delayedFlush = this.view.win.requestAnimationFrame(() => {
      this.delayedFlush = -1, this.flush();
    }));
  }
  forceFlush() {
    this.delayedFlush >= 0 && (this.view.win.cancelAnimationFrame(this.delayedFlush), this.delayedFlush = -1), this.flush();
  }
  pendingRecords() {
    for (let t of this.observer.takeRecords())
      this.queue.push(t);
    return this.queue;
  }
  processRecords() {
    let t = this.pendingRecords();
    t.length && (this.queue = []);
    let e = -1, i = -1, s = !1;
    for (let r of t) {
      let o = this.readMutation(r);
      o && (o.typeOver && (s = !0), e == -1 ? { from: e, to: i } = o : (e = Math.min(o.from, e), i = Math.max(o.to, i)));
    }
    return { from: e, to: i, typeOver: s };
  }
  readChange() {
    let { from: t, to: e, typeOver: i } = this.processRecords(), s = this.selectionChanged && xi(this.dom, this.selectionRange);
    if (t < 0 && !s)
      return null;
    t > -1 && (this.lastChange = Date.now()), this.view.inputState.lastFocusTime = 0, this.selectionChanged = !1;
    let r = new lu(this.view, t, e, i);
    return this.view.docView.domChanged = { newSel: r.newSel ? r.newSel.main : null }, r;
  }
  // Apply pending changes, if any
  flush(t = !0) {
    if (this.delayedFlush >= 0 || this.delayedAndroidKey)
      return !1;
    t && this.readSelectionRange();
    let e = this.readChange();
    if (!e)
      return this.view.requestMeasure(), !1;
    let i = this.view.state, s = Wa(this.view, e);
    return this.view.state == i && (e.domChanged || e.newSel && !Bn(this.view.state.selection, e.newSel.main)) && this.view.update([]), s;
  }
  readMutation(t) {
    let e = this.view.docView.tile.nearest(t.target);
    if (!e || e.isWidget())
      return null;
    if (e.markDirty(t.type == "attributes"), t.type == "childList") {
      let i = Go(e, t.previousSibling || t.target.previousSibling, -1), s = Go(e, t.nextSibling || t.target.nextSibling, 1);
      return {
        from: i ? e.posAfter(i) : e.posAtStart,
        to: s ? e.posBefore(s) : e.posAtEnd,
        typeOver: !1
      };
    } else return t.type == "characterData" ? { from: e.posAtStart, to: e.posAtEnd, typeOver: t.target.nodeValue == t.oldValue } : null;
  }
  setWindow(t) {
    t != this.win && (this.removeWindowListeners(this.win), this.win = t, this.addWindowListeners(this.win));
  }
  addWindowListeners(t) {
    t.addEventListener("resize", this.onResize), this.printQuery ? this.printQuery.addEventListener ? this.printQuery.addEventListener("change", this.onPrint) : this.printQuery.addListener(this.onPrint) : t.addEventListener("beforeprint", this.onPrint), t.addEventListener("scroll", this.onScroll), t.document.addEventListener("selectionchange", this.onSelectionChange);
  }
  removeWindowListeners(t) {
    t.removeEventListener("scroll", this.onScroll), t.removeEventListener("resize", this.onResize), this.printQuery ? this.printQuery.removeEventListener ? this.printQuery.removeEventListener("change", this.onPrint) : this.printQuery.removeListener(this.onPrint) : t.removeEventListener("beforeprint", this.onPrint), t.document.removeEventListener("selectionchange", this.onSelectionChange);
  }
  update(t) {
    this.editContext && (this.editContext.update(t), t.startState.facet(te) != t.state.facet(te) && (t.view.contentDOM.editContext = t.state.facet(te) ? this.editContext.editContext : null));
  }
  destroy() {
    var t, e, i;
    this.stop(), (t = this.intersection) === null || t === void 0 || t.disconnect(), (e = this.gapIntersection) === null || e === void 0 || e.disconnect(), (i = this.resizeScroll) === null || i === void 0 || i.disconnect();
    for (let s of this.scrollTargets)
      s.removeEventListener("scroll", this.onScroll);
    this.removeWindowListeners(this.win), clearTimeout(this.parentCheck), clearTimeout(this.resizeTimeout), this.win.cancelAnimationFrame(this.delayedFlush), this.win.cancelAnimationFrame(this.flushingAndroidKey), this.editContext && (this.view.contentDOM.editContext = null, this.editContext.destroy());
  }
}
function Go(n, t, e) {
  for (; t; ) {
    let i = J.get(t);
    if (i && i.parent == n)
      return i;
    let s = t.parentNode;
    t = s != n.dom ? s : e > 0 ? t.nextSibling : t.previousSibling;
  }
  return null;
}
function Jo(n, t) {
  let e = t.startContainer, i = t.startOffset, s = t.endContainer, r = t.endOffset, o = n.docView.domAtPos(n.state.selection.main.anchor, 1);
  return ki(o.node, o.offset, s, r) && ([e, i, s, r] = [s, r, e, i]), { anchorNode: e, anchorOffset: i, focusNode: s, focusOffset: r };
}
function zu(n, t) {
  if (t.getComposedRanges) {
    let s = t.getComposedRanges(n.root)[0];
    if (s)
      return Jo(n, s);
  }
  let e = null;
  function i(s) {
    s.preventDefault(), s.stopImmediatePropagation(), e = s.getTargetRanges()[0];
  }
  return n.contentDOM.addEventListener("beforeinput", i, !0), n.dom.ownerDocument.execCommand("indent"), n.contentDOM.removeEventListener("beforeinput", i, !0), e ? Jo(n, e) : null;
}
class Uu {
  constructor(t) {
    this.from = 0, this.to = 0, this.pendingContextChange = null, this.handlers = /* @__PURE__ */ Object.create(null), this.composing = null, this.resetRange(t.state);
    let e = this.editContext = new window.EditContext({
      text: t.state.doc.sliceString(this.from, this.to),
      selectionStart: this.toContextPos(Math.max(this.from, Math.min(this.to, t.state.selection.main.anchor))),
      selectionEnd: this.toContextPos(t.state.selection.main.head)
    });
    this.handlers.textupdate = (i) => {
      let s = t.state.selection.main, { anchor: r, head: o } = s, l = this.toEditorPos(i.updateRangeStart), a = this.toEditorPos(i.updateRangeEnd);
      t.inputState.composing >= 0 && !this.composing && (this.composing = { contextBase: i.updateRangeStart, editorBase: l, drifted: !1 });
      let h = a - l > i.text.length;
      l == this.from && r < this.from ? l = r : a == this.to && r > this.to && (a = r);
      let c = _a(t.state.sliceDoc(l, a), i.text, (h ? s.from : s.to) - l, h ? "end" : null);
      if (!c) {
        let u = y.single(this.toEditorPos(i.selectionStart), this.toEditorPos(i.selectionEnd));
        Bn(u, s) || t.dispatch({ selection: u, userEvent: "select" });
        return;
      }
      let f = {
        from: c.from + l,
        to: c.toA + l,
        insert: N.of(i.text.slice(c.from, c.toB).split(`
`))
      };
      if ((C.mac || C.android) && f.from == o - 1 && /^\. ?$/.test(i.text) && t.contentDOM.getAttribute("autocorrect") == "off" && (f = { from: l, to: a, insert: N.of([i.text.replace(".", " ")]) }), this.pendingContextChange = f, !t.state.readOnly) {
        let u = this.to - this.from + (f.to - f.from + f.insert.length);
        Nr(t, f, y.single(this.toEditorPos(i.selectionStart, u), this.toEditorPos(i.selectionEnd, u)));
      }
      this.pendingContextChange && (this.revertPending(t.state), this.setSelection(t.state)), f.from < f.to && !f.insert.length && t.inputState.composing >= 0 && !/[\\p{Alphabetic}\\p{Number}_]/.test(e.text.slice(Math.max(0, i.updateRangeStart - 1), Math.min(e.text.length, i.updateRangeStart + 1))) && this.handlers.compositionend(i);
    }, this.handlers.characterboundsupdate = (i) => {
      let s = [], r = null;
      for (let o = this.toEditorPos(i.rangeStart), l = this.toEditorPos(i.rangeEnd); o < l; o++) {
        let a = t.coordsForChar(o);
        r = a && new DOMRect(a.left, a.top, a.right - a.left, a.bottom - a.top) || r || new DOMRect(), s.push(r);
      }
      e.updateCharacterBounds(i.rangeStart, s);
    }, this.handlers.textformatupdate = (i) => {
      let s = [];
      for (let r of i.getTextFormats()) {
        let o = r.underlineStyle, l = r.underlineThickness;
        if (!/none/i.test(o) && !/none/i.test(l)) {
          let a = this.toEditorPos(r.rangeStart), h = this.toEditorPos(r.rangeEnd);
          if (a < h) {
            let c = `text-decoration: underline ${/^[a-z]/.test(o) ? o + " " : o == "Dashed" ? "dashed " : o == "Squiggle" ? "wavy " : ""}${/thin/i.test(l) ? 1 : 2}px`;
            s.push(K.mark({ attributes: { style: c } }).range(a, h));
          }
        }
      }
      t.dispatch({ effects: La.of(K.set(s)) });
    }, this.handlers.compositionstart = () => {
      t.inputState.composing < 0 && (t.inputState.composing = 0, t.inputState.compositionFirstChange = !0);
    }, this.handlers.compositionend = () => {
      if (t.inputState.composing = -1, t.inputState.compositionFirstChange = null, this.composing) {
        let { drifted: i } = this.composing;
        this.composing = null, i && this.reset(t.state);
      }
    };
    for (let i in this.handlers)
      e.addEventListener(i, this.handlers[i]);
    this.measureReq = { read: (i) => {
      this.editContext.updateControlBounds(i.contentDOM.getBoundingClientRect());
      let s = Li(i.root);
      s && s.rangeCount && this.editContext.updateSelectionBounds(s.getRangeAt(0).getBoundingClientRect());
    } };
  }
  applyEdits(t) {
    let e = 0, i = !1, s = this.pendingContextChange;
    return t.changes.iterChanges((r, o, l, a, h) => {
      if (i)
        return;
      let c = h.length - (o - r);
      if (s && o >= s.to)
        if (s.from == r && s.to == o && s.insert.eq(h)) {
          s = this.pendingContextChange = null, e += c, this.to += c;
          return;
        } else
          s = null, this.revertPending(t.state);
      if (r += e, o += e, o <= this.from)
        this.from += c, this.to += c;
      else if (r < this.to) {
        if (r < this.from || o > this.to || this.to - this.from + h.length > 3e4) {
          i = !0;
          return;
        }
        this.editContext.updateText(this.toContextPos(r), this.toContextPos(o), h.toString()), this.to += c;
      }
      e += c;
    }), s && !i && this.revertPending(t.state), !i;
  }
  update(t) {
    let e = this.pendingContextChange, i = t.startState.selection.main;
    this.composing && (this.composing.drifted || !t.changes.touchesRange(i.from, i.to) && t.transactions.some((s) => !s.isUserEvent("input.type") && s.changes.touchesRange(this.from, this.to))) ? (this.composing.drifted = !0, this.composing.editorBase = t.changes.mapPos(this.composing.editorBase)) : !this.applyEdits(t) || !this.rangeIsValid(t.state) ? (this.pendingContextChange = null, this.reset(t.state)) : (t.docChanged || t.selectionSet || e) && this.setSelection(t.state), (t.geometryChanged || t.docChanged || t.selectionSet) && t.view.requestMeasure(this.measureReq);
  }
  resetRange(t) {
    let { head: e } = t.selection.main;
    this.from = Math.max(
      0,
      e - 1e4
      /* CxVp.Margin */
    ), this.to = Math.min(
      t.doc.length,
      e + 1e4
      /* CxVp.Margin */
    );
  }
  reset(t) {
    this.resetRange(t), this.editContext.updateText(0, this.editContext.text.length, t.doc.sliceString(this.from, this.to)), this.setSelection(t);
  }
  revertPending(t) {
    let e = this.pendingContextChange;
    this.pendingContextChange = null, this.editContext.updateText(this.toContextPos(e.from), this.toContextPos(e.from + e.insert.length), t.doc.sliceString(e.from, e.to));
  }
  setSelection(t) {
    let { main: e } = t.selection, i = this.toContextPos(Math.max(this.from, Math.min(this.to, e.anchor))), s = this.toContextPos(e.head);
    (this.editContext.selectionStart != i || this.editContext.selectionEnd != s) && this.editContext.updateSelection(i, s);
  }
  rangeIsValid(t) {
    let { head: e } = t.selection.main;
    return !(this.from > 0 && e - this.from < 500 || this.to < t.doc.length && this.to - e < 500 || this.to - this.from > 1e4 * 3);
  }
  toEditorPos(t, e = this.to - this.from) {
    t = Math.min(t, e);
    let i = this.composing;
    return i && i.drifted ? i.editorBase + (t - i.contextBase) : t + this.from;
  }
  toContextPos(t) {
    let e = this.composing;
    return e && e.drifted ? e.contextBase + (t - e.editorBase) : t - this.from;
  }
  destroy() {
    for (let t in this.handlers)
      this.editContext.removeEventListener(t, this.handlers[t]);
  }
}
class T {
  /**
  The current editor state.
  */
  get state() {
    return this.viewState.state;
  }
  /**
  To be able to display large documents without consuming too much
  memory or overloading the browser, CodeMirror only draws the
  code that is visible (plus a margin around it) to the DOM. This
  property tells you the extent of the current drawn viewport, in
  document positions.
  */
  get viewport() {
    return this.viewState.viewport;
  }
  /**
  When there are, for example, large collapsed ranges in the
  viewport, its size can be a lot bigger than the actual visible
  content. Thus, if you are doing something like styling the
  content in the viewport, it is preferable to only do so for
  these ranges, which are the subset of the viewport that is
  actually drawn.
  */
  get visibleRanges() {
    return this.viewState.visibleRanges;
  }
  /**
  Returns false when the editor is entirely scrolled out of view
  or otherwise hidden.
  */
  get inView() {
    return this.viewState.inView;
  }
  /**
  Indicates whether the user is currently composing text via
  [IME](https://en.wikipedia.org/wiki/Input_method), and at least
  one change has been made in the current composition.
  */
  get composing() {
    return !!this.inputState && this.inputState.composing > 0;
  }
  /**
  Indicates whether the user is currently in composing state. Note
  that on some platforms, like Android, this will be the case a
  lot, since just putting the cursor on a word starts a
  composition there.
  */
  get compositionStarted() {
    return !!this.inputState && this.inputState.composing >= 0;
  }
  /**
  The document or shadow root that the view lives in.
  */
  get root() {
    return this._root;
  }
  /**
  @internal
  */
  get win() {
    return this.dom.ownerDocument.defaultView || window;
  }
  /**
  Construct a new view. You'll want to either provide a `parent`
  option, or put `view.dom` into your document after creating a
  view, so that the user can see the editor.
  */
  constructor(t = {}) {
    var e;
    this.plugins = [], this.pluginMap = /* @__PURE__ */ new Map(), this.editorAttrs = {}, this.contentAttrs = {}, this.bidiCache = [], this.destroyed = !1, this.updateState = 2, this.measureScheduled = -1, this.measureRequests = [], this.contentDOM = document.createElement("div"), this.scrollDOM = document.createElement("div"), this.scrollDOM.tabIndex = -1, this.scrollDOM.className = "cm-scroller", this.scrollDOM.appendChild(this.contentDOM), this.announceDOM = document.createElement("div"), this.announceDOM.className = "cm-announced", this.announceDOM.setAttribute("aria-live", "polite"), this.dom = document.createElement("div"), this.dom.appendChild(this.announceDOM), this.dom.appendChild(this.scrollDOM), t.parent && t.parent.appendChild(this.dom);
    let { dispatch: i } = t;
    this.dispatchTransactions = t.dispatchTransactions || i && ((s) => s.forEach((r) => i(r, this))) || ((s) => this.update(s)), this.dispatch = this.dispatch.bind(this), this._root = t.root || wf(t.parent) || document, this.viewState = new jo(this, t.state || $.create(t)), t.scrollTo && t.scrollTo.is(Qi) && (this.viewState.scrollTarget = t.scrollTo.value.clip(this.viewState.state)), this.plugins = this.state.facet(We).map((s) => new us(s));
    for (let s of this.plugins)
      s.update(this);
    this.observer = new _u(this), this.inputState = new fu(this), this.inputState.ensureHandlers(this.plugins), this.docView = new Lo(this), this.mountStyles(), this.updateAttrs(), this.updateState = 0, this.requestMeasure(), !((e = document.fonts) === null || e === void 0) && e.ready && document.fonts.ready.then(() => {
      this.viewState.mustMeasureContent = "refresh", this.requestMeasure();
    });
  }
  dispatch(...t) {
    let e = t.length == 1 && t[0] instanceof tt ? t : t.length == 1 && Array.isArray(t[0]) ? t[0] : [this.state.update(...t)];
    this.dispatchTransactions(e, this);
  }
  /**
  Update the view for the given array of transactions. This will
  update the visible document and selection to match the state
  produced by the transactions, and notify view plugins of the
  change. You should usually call
  [`dispatch`](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) instead, which uses this
  as a primitive.
  */
  update(t) {
    if (this.updateState != 0)
      throw new Error("Calls to EditorView.update are not allowed while an update is in progress");
    let e = !1, i = !1, s, r = this.state;
    for (let u of t) {
      if (u.startState != r)
        throw new RangeError("Trying to update state with a transaction that doesn't start from the previous state.");
      r = u.state;
    }
    if (this.destroyed) {
      this.viewState.state = r;
      return;
    }
    let o = this.hasFocus, l = 0, a = null;
    t.some((u) => u.annotation(Ga)) ? (this.inputState.notifiedFocused = o, l = 1) : o != this.inputState.notifiedFocused && (this.inputState.notifiedFocused = o, a = Ja(r, o), a || (l = 1));
    let h = this.observer.delayedAndroidKey, c = null;
    if (h ? (this.observer.clearDelayedAndroidKey(), c = this.observer.readChange(), (c && !this.state.doc.eq(r.doc) || !this.state.selection.eq(r.selection)) && (c = null)) : this.observer.clear(), r.facet($.phrases) != this.state.facet($.phrases))
      return this.setState(r);
    s = Dn.create(this, r, t), s.flags |= l;
    let f = this.viewState.scrollTarget;
    try {
      this.updateState = 2;
      for (let u of t) {
        if (f && (f = f.map(u.changes)), u.scrollIntoView) {
          let { main: d } = u.state.selection, { x: p, y: g } = this.state.facet(T.cursorScrollMargin);
          f = new Ge(d.empty ? d : y.cursor(d.head, d.head > d.anchor ? -1 : 1), "nearest", "nearest", g, p);
        }
        for (let d of u.effects)
          d.is(Qi) && (f = d.value.clip(this.state));
      }
      this.viewState.update(s, f), this.bidiCache = In.update(this.bidiCache, s.changes), s.empty || (this.updatePlugins(s), this.inputState.update(s)), e = this.docView.update(s), this.state.facet(mi) != this.styleModules && this.mountStyles(), i = this.updateAttrs(), this.showAnnouncements(t), this.docView.updateSelection(e, t.some((u) => u.isUserEvent("select.pointer")));
    } finally {
      this.updateState = 0;
    }
    if (s.startState.facet(on) != s.state.facet(on) && (this.viewState.mustMeasureContent = !0), (e || i || f || this.viewState.mustEnforceCursorAssoc || this.viewState.mustMeasureContent) && this.requestMeasure(), e && this.docViewUpdate(), !s.empty)
      for (let u of this.state.facet(er))
        try {
          u(s);
        } catch (d) {
          Pt(this.state, d, "update listener");
        }
    (a || c) && Promise.resolve().then(() => {
      a && this.state == a.startState && this.dispatch(a), c && !Wa(this, c) && h.force && Ke(this.contentDOM, h.key, h.keyCode);
    });
  }
  /**
  Reset the view to the given state. (This will cause the entire
  document to be redrawn and all view plugins to be reinitialized,
  so you should probably only use it when the new state isn't
  derived from the old state. Otherwise, use
  [`dispatch`](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) instead.)
  */
  setState(t) {
    if (this.updateState != 0)
      throw new Error("Calls to EditorView.setState are not allowed while an update is in progress");
    if (this.destroyed) {
      this.viewState.state = t;
      return;
    }
    this.updateState = 2;
    let e = this.hasFocus;
    try {
      for (let i of this.plugins)
        i.destroy(this);
      this.viewState = new jo(this, t), this.plugins = t.facet(We).map((i) => new us(i)), this.pluginMap.clear();
      for (let i of this.plugins)
        i.update(this);
      this.docView.destroy(), this.docView = new Lo(this), this.inputState.ensureHandlers(this.plugins), this.mountStyles(), this.updateAttrs(), this.bidiCache = [];
    } finally {
      this.updateState = 0;
    }
    e && this.focus(), this.requestMeasure();
  }
  updatePlugins(t) {
    let e = t.startState.facet(We), i = t.state.facet(We);
    if (e != i) {
      let s = [];
      for (let r of i) {
        let o = e.indexOf(r);
        if (o < 0)
          s.push(new us(r));
        else {
          let l = this.plugins[o];
          l.mustUpdate = t, s.push(l);
        }
      }
      for (let r of this.plugins)
        r.mustUpdate != t && r.destroy(this);
      this.plugins = s, this.pluginMap.clear();
    } else
      for (let s of this.plugins)
        s.mustUpdate = t;
    for (let s = 0; s < this.plugins.length; s++)
      this.plugins[s].update(this);
    e != i && this.inputState.ensureHandlers(this.plugins);
  }
  docViewUpdate() {
    for (let t of this.plugins) {
      let e = t.value;
      if (e && e.docViewUpdate)
        try {
          e.docViewUpdate(this);
        } catch (i) {
          Pt(this.state, i, "doc view update listener");
        }
    }
  }
  /**
  @internal
  */
  measure(t = !0) {
    if (this.destroyed)
      return;
    if (this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.observer.delayedAndroidKey) {
      this.measureScheduled = -1, this.requestMeasure();
      return;
    }
    this.measureScheduled = 0, t && this.observer.forceFlush();
    let e = null, i = this.viewState.scrollParent, s = this.viewState.getScrollOffset(), { scrollAnchorPos: r, scrollAnchorHeight: o } = this.viewState;
    Math.abs(s - this.viewState.scrollOffset) > 1 && (o = -1), this.viewState.scrollAnchorHeight = -1;
    try {
      for (let l = 0; ; l++) {
        if (o < 0)
          if (ga(i || this.win))
            r = -1, o = this.viewState.heightMap.height;
          else {
            let d = this.viewState.scrollAnchorAt(s);
            r = d.from, o = d.top;
          }
        this.updateState = 1;
        let a = this.viewState.measure();
        if (!a && !this.measureRequests.length && this.viewState.scrollTarget == null)
          break;
        if (l > 5) {
          console.warn(this.measureRequests.length ? "Measure loop restarted more than 5 times" : "Viewport failed to stabilize");
          break;
        }
        let h = [];
        a & 4 || ([this.measureRequests, h] = [h, this.measureRequests]);
        let c = h.map((d) => {
          try {
            return d.read(this);
          } catch (p) {
            return Pt(this.state, p), Yo;
          }
        }), f = Dn.create(this, this.state, []), u = !1;
        f.flags |= a, e ? e.flags |= a : e = f, this.updateState = 2, f.empty || (this.updatePlugins(f), this.inputState.update(f), this.updateAttrs(), u = this.docView.update(f), u && this.docViewUpdate());
        for (let d = 0; d < h.length; d++)
          if (c[d] != Yo)
            try {
              let p = h[d];
              p.write && p.write(c[d], this);
            } catch (p) {
              Pt(this.state, p);
            }
        if (u && this.docView.updateSelection(!0), !f.viewportChanged && this.measureRequests.length == 0) {
          if (this.viewState.editorHeight)
            if (this.viewState.scrollTarget) {
              this.docView.scrollIntoView(this.viewState.scrollTarget), this.viewState.scrollTarget = null, o = -1;
              continue;
            } else {
              let p = ((r < 0 ? this.viewState.heightMap.height : this.viewState.lineBlockAt(r).top) - o) / this.scaleY;
              if ((p > 1 || p < -1) && (i == this.scrollDOM || this.hasFocus || Math.max(this.inputState.lastWheelEvent, this.inputState.lastTouchTime) > Date.now() - 100)) {
                s = s + p, i ? i.scrollTop += p : this.win.scrollBy(0, p), o = -1;
                continue;
              }
            }
          break;
        }
      }
    } finally {
      this.updateState = 0, this.measureScheduled = -1;
    }
    if (e && !e.empty)
      for (let l of this.state.facet(er))
        l(e);
  }
  /**
  Get the CSS classes for the currently active editor themes.
  */
  get themeClasses() {
    return lr + " " + (this.state.facet(or) ? Qa : Za) + " " + this.state.facet(on);
  }
  updateAttrs() {
    let t = Xo(this, Ba, {
      class: "cm-editor" + (this.hasFocus ? " cm-focused " : " ") + this.themeClasses
    }), e = {
      spellcheck: "false",
      autocorrect: "off",
      autocapitalize: "off",
      writingsuggestions: "false",
      translate: "no",
      contenteditable: this.state.facet(te) ? "true" : "false",
      class: "cm-content",
      style: `${C.tabSize}: ${this.state.tabSize}`,
      role: "textbox",
      "aria-multiline": "true"
    };
    this.state.readOnly && (e["aria-readonly"] = "true"), Xo(this, Br, e);
    let i = this.observer.ignore(() => {
      let s = Mo(this.contentDOM, this.contentAttrs, e), r = Mo(this.dom, this.editorAttrs, t);
      return s || r;
    });
    return this.editorAttrs = t, this.contentAttrs = e, i;
  }
  showAnnouncements(t) {
    let e = !0;
    for (let i of t)
      for (let s of i.effects)
        if (s.is(T.announce)) {
          e && (this.announceDOM.textContent = ""), e = !1;
          let r = this.announceDOM.appendChild(document.createElement("div"));
          r.textContent = s.value;
        }
  }
  mountStyles() {
    this.styleModules = this.state.facet(mi);
    let t = this.state.facet(T.cspNonce);
    ce.mount(this.root, this.styleModules.concat(Fu).reverse(), t ? { nonce: t } : void 0);
  }
  readMeasured() {
    if (this.updateState == 2)
      throw new Error("Reading the editor layout isn't allowed during an update");
    this.updateState == 0 && this.measureScheduled > -1 && this.measure(!1);
  }
  /**
  Schedule a layout measurement, optionally providing callbacks to
  do custom DOM measuring followed by a DOM write phase. Using
  this is preferable reading DOM layout directly from, for
  example, an event handler, because it'll make sure measuring and
  drawing done by other components is synchronized, avoiding
  unnecessary DOM layout computations.
  */
  requestMeasure(t) {
    if (this.measureScheduled < 0 && (this.measureScheduled = this.win.requestAnimationFrame(() => this.measure())), t) {
      if (this.measureRequests.indexOf(t) > -1)
        return;
      if (t.key != null) {
        for (let e = 0; e < this.measureRequests.length; e++)
          if (this.measureRequests[e].key === t.key) {
            this.measureRequests[e] = t;
            return;
          }
      }
      this.measureRequests.push(t);
    }
  }
  /**
  Get the value of a specific plugin, if present. Note that
  plugins that crash can be dropped from a view, so even when you
  know you registered a given plugin, it is recommended to check
  the return value of this method.
  */
  plugin(t) {
    let e = this.pluginMap.get(t);
    return (e === void 0 || e && e.plugin != t) && this.pluginMap.set(t, e = this.plugins.find((i) => i.plugin == t) || null), e && e.update(this).value;
  }
  /**
  The top position of the document, in screen coordinates. This
  may be negative when the editor is scrolled down. Points
  directly to the top of the first line, not above the padding.
  */
  get documentTop() {
    return this.contentDOM.getBoundingClientRect().top + this.viewState.paddingTop;
  }
  /**
  Reports the padding above and below the document.
  */
  get documentPadding() {
    return { top: this.viewState.paddingTop, bottom: this.viewState.paddingBottom };
  }
  /**
  If the editor is transformed with CSS, this provides the scale
  along the X axis. Otherwise, it will just be 1. Note that
  transforms other than translation and scaling are not supported.
  */
  get scaleX() {
    return this.viewState.scaleX;
  }
  /**
  Provide the CSS transformed scale along the Y axis.
  */
  get scaleY() {
    return this.viewState.scaleY;
  }
  /**
  Find the text line or block widget at the given vertical
  position (which is interpreted as relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop)).
  */
  elementAtHeight(t) {
    return this.readMeasured(), this.viewState.elementAtHeight(t);
  }
  /**
  Find the line block (see
  [`lineBlockAt`](https://codemirror.net/6/docs/ref/#view.EditorView.lineBlockAt)) at the given
  height, again interpreted relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop).
  */
  lineBlockAtHeight(t) {
    return this.readMeasured(), this.viewState.lineBlockAtHeight(t);
  }
  /**
  Get the extent and vertical position of all [line
  blocks](https://codemirror.net/6/docs/ref/#view.EditorView.lineBlockAt) in the viewport. Positions
  are relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop);
  */
  get viewportLineBlocks() {
    return this.viewState.viewportLines;
  }
  /**
  Find the line block around the given document position. A line
  block is a range delimited on both sides by either a
  non-[hidden](https://codemirror.net/6/docs/ref/#view.Decoration^replace) line break, or the
  start/end of the document. It will usually just hold a line of
  text, but may be broken into multiple textblocks by block
  widgets.
  */
  lineBlockAt(t) {
    return this.viewState.lineBlockAt(t);
  }
  /**
  The editor's total content height.
  */
  get contentHeight() {
    return this.viewState.contentHeight;
  }
  /**
  Move a cursor position by [grapheme
  cluster](https://codemirror.net/6/docs/ref/#state.findClusterBreak). `forward` determines whether
  the motion is away from the line start, or towards it. In
  bidirectional text, the line is traversed in visual order, using
  the editor's [text direction](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection).
  When the start position was the last one on the line, the
  returned position will be across the line break. If there is no
  further line, the original position is returned.
  
  By default, this method moves over a single cluster. The
  optional `by` argument can be used to move across more. It will
  be called with the first cluster as argument, and should return
  a predicate that determines, for each subsequent cluster,
  whether it should also be moved over.
  */
  moveByChar(t, e, i) {
    return ms(this, t, Bo(this, t, e, i));
  }
  /**
  Move a cursor position across the next group of either
  [letters](https://codemirror.net/6/docs/ref/#state.EditorState.charCategorizer) or non-letter
  non-whitespace characters.
  */
  moveByGroup(t, e) {
    return ms(this, t, Bo(this, t, e, (i) => eu(this, t.head, i)));
  }
  /**
  Get the cursor position visually at the start or end of a line.
  Note that this may differ from the _logical_ position at its
  start or end (which is simply at `line.from`/`line.to`) if text
  at the start or end goes against the line's base text direction.
  */
  visualLineSide(t, e) {
    let i = this.bidiSpans(t), s = this.textDirectionAt(t.from), r = i[e ? i.length - 1 : 0];
    return y.cursor(r.side(e, s) + t.from, r.forward(!e, s) ? 1 : -1);
  }
  /**
  Move to the next line boundary in the given direction. If
  `includeWrap` is true, line wrapping is on, and there is a
  further wrap point on the current line, the wrap point will be
  returned. Otherwise this function will return the start or end
  of the line.
  */
  moveToLineBoundary(t, e, i = !0) {
    return tu(this, t, e, i);
  }
  /**
  Move a cursor position vertically. When `distance` isn't given,
  it defaults to moving to the next line (including wrapped
  lines). Otherwise, `distance` should provide a positive distance
  in pixels.
  
  When `start` has a
  [`goalColumn`](https://codemirror.net/6/docs/ref/#state.SelectionRange.goalColumn), the vertical
  motion will use that as a target horizontal position. Otherwise,
  the cursor's own horizontal position is used. The returned
  cursor will have its goal column set to whichever column was
  used.
  */
  moveVertically(t, e, i) {
    return ms(this, t, iu(this, t, e, i));
  }
  /**
  Find the DOM parent node and offset (child offset if `node` is
  an element, character offset when it is a text node) at the
  given document position.
  
  Note that for positions that aren't currently in
  `visibleRanges`, the resulting DOM position isn't necessarily
  meaningful (it may just point before or after a placeholder
  element).
  */
  domAtPos(t, e = 1) {
    return this.docView.domAtPos(t, e);
  }
  /**
  Find the document position at the given DOM node. Can be useful
  for associating positions with DOM events. Will raise an error
  when `node` isn't part of the editor content.
  */
  posAtDOM(t, e = 0) {
    return this.docView.posFromDOM(t, e);
  }
  posAtCoords(t, e = !0) {
    this.readMeasured();
    let i = sr(this, t, e);
    return i && i.pos;
  }
  posAndSideAtCoords(t, e = !0) {
    return this.readMeasured(), sr(this, t, e);
  }
  /**
  Get the screen coordinates at the given document position.
  `side` determines whether the coordinates are based on the
  element before (-1) or after (1) the position (if no element is
  available on the given side, the method will transparently use
  another strategy to get reasonable coordinates).
  */
  coordsAtPos(t, e = 1) {
    this.readMeasured();
    let i = this.docView.coordsAt(t, e);
    if (!i || i.left == i.right)
      return i;
    let s = this.state.doc.lineAt(t), r = this.bidiSpans(s), o = r[Jt.find(r, t - s.from, -1, e)];
    return En(i, o.dir == j.LTR == e > 0);
  }
  /**
  Return the rectangle around a given character. If `pos` does not
  point in front of a character that is in the viewport and
  rendered (i.e. not replaced, not a line break), this will return
  null. For space characters that are a line wrap point, this will
  return the position before the line break.
  */
  coordsForChar(t) {
    return this.readMeasured(), this.docView.coordsForChar(t);
  }
  /**
  The default width of a character in the editor. May not
  accurately reflect the width of all characters (given variable
  width fonts or styling of invididual ranges).
  */
  get defaultCharacterWidth() {
    return this.viewState.heightOracle.charWidth;
  }
  /**
  The default height of a line in the editor. May not be accurate
  for all lines.
  */
  get defaultLineHeight() {
    return this.viewState.heightOracle.lineHeight;
  }
  /**
  The text direction
  ([`direction`](https://developer.mozilla.org/en-US/docs/Web/CSS/direction)
  CSS property) of the editor's content element.
  */
  get textDirection() {
    return this.viewState.defaultTextDirection;
  }
  /**
  Find the text direction of the block at the given position, as
  assigned by CSS. If
  [`perLineTextDirection`](https://codemirror.net/6/docs/ref/#view.EditorView^perLineTextDirection)
  isn't enabled, or the given position is outside of the viewport,
  this will always return the same as
  [`textDirection`](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection). Note that
  this may trigger a DOM layout.
  */
  textDirectionAt(t) {
    return !this.state.facet(Ea) || t < this.viewport.from || t > this.viewport.to ? this.textDirection : (this.readMeasured(), this.docView.textDirectionAt(t));
  }
  /**
  Whether this editor [wraps lines](https://codemirror.net/6/docs/ref/#view.EditorView.lineWrapping)
  (as determined by the
  [`white-space`](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space)
  CSS property of its content element).
  */
  get lineWrapping() {
    return this.viewState.heightOracle.lineWrapping;
  }
  /**
  Returns the bidirectional text structure of the given line
  (which should be in the current document) as an array of span
  objects. The order of these spans matches the [text
  direction](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection)—if that is
  left-to-right, the leftmost spans come first, otherwise the
  rightmost spans come first.
  */
  bidiSpans(t) {
    if (t.length > ju)
      return xa(t.length);
    let e = this.textDirectionAt(t.from), i;
    for (let r of this.bidiCache)
      if (r.from == t.from && r.dir == e && (r.fresh || va(r.isolates, i = Eo(this, t))))
        return r.order;
    i || (i = Eo(this, t));
    let s = Tf(t.text, e, i);
    return this.bidiCache.push(new In(t.from, t.to, e, i, !0, s)), s;
  }
  /**
  Check whether the editor has focus.
  */
  get hasFocus() {
    var t;
    return (this.dom.ownerDocument.hasFocus() || C.safari && ((t = this.inputState) === null || t === void 0 ? void 0 : t.lastContextMenu) > Date.now() - 3e4) && this.root.activeElement == this.contentDOM;
  }
  /**
  Put focus on the editor.
  */
  focus() {
    this.observer.ignore(() => {
      pa(this.contentDOM), this.docView.updateSelection();
    });
  }
  /**
  Update the [root](https://codemirror.net/6/docs/ref/##view.EditorViewConfig.root) in which the editor lives. This is only
  necessary when moving the editor's existing DOM to a new window or shadow root.
  */
  setRoot(t) {
    this._root != t && (this._root = t, this.observer.setWindow((t.nodeType == 9 ? t : t.ownerDocument).defaultView || window), this.mountStyles());
  }
  /**
  Clean up this editor view, removing its element from the
  document, unregistering event handlers, and notifying
  plugins. The view instance can no longer be used after
  calling this.
  */
  destroy() {
    this.root.activeElement == this.contentDOM && this.contentDOM.blur();
    for (let t of this.plugins)
      t.destroy(this);
    this.plugins = [], this.inputState.destroy(), this.docView.destroy(), this.dom.remove(), this.observer.destroy(), this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.destroyed = !0;
  }
  /**
  Returns an effect that can be
  [added](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) to a transaction to
  cause it to scroll the given position or range into view.
  */
  static scrollIntoView(t, e = {}) {
    var i, s, r, o;
    return Qi.of(new Ge(typeof t == "number" ? y.cursor(t) : t, (i = e.y) !== null && i !== void 0 ? i : "nearest", (s = e.x) !== null && s !== void 0 ? s : "nearest", (r = e.yMargin) !== null && r !== void 0 ? r : 5, (o = e.xMargin) !== null && o !== void 0 ? o : 5));
  }
  /**
  Return an effect that resets the editor to its current (at the
  time this method was called) scroll position. Note that this
  only affects the editor's own scrollable element, not parents.
  See also
  [`EditorViewConfig.scrollTo`](https://codemirror.net/6/docs/ref/#view.EditorViewConfig.scrollTo).
  
  The effect should be used with a document identical to the one
  it was created for. Failing to do so is not an error, but may
  not scroll to the expected position. You can
  [map](https://codemirror.net/6/docs/ref/#state.StateEffect.map) the effect to account for changes.
  */
  scrollSnapshot() {
    let { scrollTop: t, scrollLeft: e } = this.scrollDOM, i = this.viewState.scrollAnchorAt(t);
    return Qi.of(new Ge(y.cursor(i.from), "start", "start", i.top - t, e, !0));
  }
  /**
  Enable or disable tab-focus mode, which disables key bindings
  for Tab and Shift-Tab, letting the browser's default
  focus-changing behavior go through instead. This is useful to
  prevent trapping keyboard users in your editor.
  
  Without argument, this toggles the mode. With a boolean, it
  enables (true) or disables it (false). Given a number, it
  temporarily enables the mode until that number of milliseconds
  have passed or another non-Tab key is pressed.
  */
  setTabFocusMode(t) {
    t == null ? this.inputState.tabFocusMode = this.inputState.tabFocusMode < 0 ? 0 : -1 : typeof t == "boolean" ? this.inputState.tabFocusMode = t ? 0 : -1 : this.inputState.tabFocusMode != 0 && (this.inputState.tabFocusMode = Date.now() + t);
  }
  /**
  Returns an extension that can be used to add DOM event handlers.
  The value should be an object mapping event names to handler
  functions. For any given event, such functions are ordered by
  extension precedence, and the first handler to return true will
  be assumed to have handled that event, and no other handlers or
  built-in behavior will be activated for it. These are registered
  on the [content element](https://codemirror.net/6/docs/ref/#view.EditorView.contentDOM), except
  for `scroll` handlers, which will be called any time the
  editor's [scroll element](https://codemirror.net/6/docs/ref/#view.EditorView.scrollDOM) or one of
  its parent nodes is scrolled.
  */
  static domEventHandlers(t) {
    return kt.define(() => ({}), { eventHandlers: t });
  }
  /**
  Create an extension that registers DOM event observers. Contrary
  to event [handlers](https://codemirror.net/6/docs/ref/#view.EditorView^domEventHandlers),
  observers can't be prevented from running by a higher-precedence
  handler returning true. They also don't prevent other handlers
  and observers from running when they return true, and should not
  call `preventDefault`.
  */
  static domEventObservers(t) {
    return kt.define(() => ({}), { eventObservers: t });
  }
  /**
  Create a theme extension. The first argument can be a
  [`style-mod`](https://code.haverbeke.berlin/marijn/style-mod#documentation)
  style spec providing the styles for the theme. These will be
  prefixed with a generated class for the style.
  
  Because the selectors will be prefixed with a scope class, rule
  that directly match the editor's [wrapper
  element](https://codemirror.net/6/docs/ref/#view.EditorView.dom)—to which the scope class will be
  added—need to be explicitly differentiated by adding an `&` to
  the selector for that element—for example
  `&.cm-focused`.
  
  When `dark` is set to true, the theme will be marked as dark,
  which will cause the `&dark` rules from [base
  themes](https://codemirror.net/6/docs/ref/#view.EditorView^baseTheme) to be used (as opposed to
  `&light` when a light theme is active).
  */
  static theme(t, e) {
    let i = ce.newName(), s = [on.of(i), mi.of(ar(`.${i}`, t))];
    return e && e.dark && s.push(or.of(!0)), s;
  }
  /**
  Create an extension that adds styles to the base theme. Like
  with [`theme`](https://codemirror.net/6/docs/ref/#view.EditorView^theme), use `&` to indicate the
  place of the editor wrapper element when directly targeting
  that. You can also use `&dark` or `&light` instead to only
  target editors with a dark or light theme.
  */
  static baseTheme(t) {
    return _n.lowest(mi.of(ar("." + lr, t, th)));
  }
  /**
  Retrieve an editor view instance from the view's DOM
  representation.
  */
  static findFromDOM(t) {
    var e;
    let i = t.querySelector(".cm-content"), s = i && J.get(i) || J.get(t);
    return ((e = s?.root) === null || e === void 0 ? void 0 : e.view) || null;
  }
}
T.styleModule = mi;
T.inputHandler = Ta;
T.clipboardInputFilter = Rr;
T.clipboardOutputFilter = Lr;
T.scrollHandler = Ra;
T.focusChangeEffect = Oa;
T.perLineTextDirection = Ea;
T.exceptionSink = Ma;
T.updateListener = er;
T.editable = te;
T.mouseSelectionStyle = Ca;
T.dragMovesSelection = Aa;
T.clickAddsSelectionRange = Sa;
T.decorations = jn;
T.blockWrappers = Pa;
T.outerDecorations = Pr;
T.atomicRanges = qi;
T.bidiIsolatedRanges = Ia;
T.cursorScrollMargin = /* @__PURE__ */ M.define({
  combine: (n) => {
    let t = 5, e = 5;
    for (let i of n)
      typeof i == "number" ? t = e = i : { x: t, y: e } = i;
    return { x: t, y: e };
  }
});
T.scrollMargins = Na;
T.darkTheme = or;
T.cspNonce = /* @__PURE__ */ M.define({ combine: (n) => n.length ? n[0] : "" });
T.contentAttributes = Br;
T.editorAttributes = Ba;
T.lineWrapping = /* @__PURE__ */ T.contentAttributes.of({ class: "cm-lineWrapping" });
T.announce = /* @__PURE__ */ F.define();
const ju = 4096, Yo = {};
class In {
  constructor(t, e, i, s, r, o) {
    this.from = t, this.to = e, this.dir = i, this.isolates = s, this.fresh = r, this.order = o;
  }
  static update(t, e) {
    if (e.empty && !t.some((r) => r.fresh))
      return t;
    let i = [], s = t.length ? t[t.length - 1].dir : j.LTR;
    for (let r = Math.max(0, t.length - 10); r < t.length; r++) {
      let o = t[r];
      o.dir == s && !e.touchesRange(o.from, o.to) && i.push(new In(e.mapPos(o.from, 1), e.mapPos(o.to, -1), o.dir, o.isolates, !1, o.order));
    }
    return i;
  }
}
function Xo(n, t, e) {
  for (let i = n.state.facet(t), s = i.length - 1; s >= 0; s--) {
    let r = i[s], o = typeof r == "function" ? r(n) : r;
    o && Or(o, e);
  }
  return e;
}
const qu = C.mac ? "mac" : C.windows ? "win" : C.linux ? "linux" : "key";
function Ku(n, t) {
  const e = n.split(/-(?!$)/);
  let i = e[e.length - 1];
  i == "Space" && (i = " ");
  let s, r, o, l;
  for (let a = 0; a < e.length - 1; ++a) {
    const h = e[a];
    if (/^(cmd|meta|m)$/i.test(h))
      l = !0;
    else if (/^a(lt)?$/i.test(h))
      s = !0;
    else if (/^(c|ctrl|control)$/i.test(h))
      r = !0;
    else if (/^s(hift)?$/i.test(h))
      o = !0;
    else if (/^mod$/i.test(h))
      t == "mac" ? l = !0 : r = !0;
    else
      throw new Error("Unrecognized modifier name: " + h);
  }
  return s && (i = "Alt-" + i), r && (i = "Ctrl-" + i), l && (i = "Meta-" + i), o && (i = "Shift-" + i), i;
}
function ln(n, t, e) {
  return t.altKey && (n = "Alt-" + n), t.ctrlKey && (n = "Ctrl-" + n), t.metaKey && (n = "Meta-" + n), e !== !1 && t.shiftKey && (n = "Shift-" + n), n;
}
const Gu = /* @__PURE__ */ _n.default(/* @__PURE__ */ T.domEventHandlers({
  keydown(n, t) {
    return Zu(Ju(t.state), n, t, "editor");
  }
})), eh = /* @__PURE__ */ M.define({ enables: Gu }), Zo = /* @__PURE__ */ new WeakMap();
function Ju(n) {
  let t = n.facet(eh), e = Zo.get(t);
  return e || Zo.set(t, e = Xu(t.reduce((i, s) => i.concat(s), []))), e;
}
let oe = null;
const Yu = 4e3;
function Xu(n, t = qu) {
  let e = /* @__PURE__ */ Object.create(null), i = /* @__PURE__ */ Object.create(null), s = (o, l) => {
    let a = i[o];
    if (a == null)
      i[o] = l;
    else if (a != l)
      throw new Error("Key binding " + o + " is used both as a regular binding and as a multi-stroke prefix");
  }, r = (o, l, a, h, c) => {
    var f, u;
    let d = e[o] || (e[o] = /* @__PURE__ */ Object.create(null)), p = l.split(/ (?!$)/).map((b) => Ku(b, t));
    for (let b = 1; b < p.length; b++) {
      let v = p.slice(0, b).join(" ");
      s(v, !0), d[v] || (d[v] = {
        preventDefault: !0,
        stopPropagation: !1,
        run: [(w) => {
          let O = oe = { view: w, prefix: v, scope: o };
          return setTimeout(() => {
            oe == O && (oe = null);
          }, Yu), !0;
        }]
      });
    }
    let g = p.join(" ");
    s(g, !1);
    let m = d[g] || (d[g] = {
      preventDefault: !1,
      stopPropagation: !1,
      run: ((u = (f = d._any) === null || f === void 0 ? void 0 : f.run) === null || u === void 0 ? void 0 : u.slice()) || []
    });
    a && m.run.push(a), h && (m.preventDefault = !0), c && (m.stopPropagation = !0);
  };
  for (let o of n) {
    let l = o.scope ? o.scope.split(" ") : ["editor"];
    if (o.any)
      for (let h of l) {
        let c = e[h] || (e[h] = /* @__PURE__ */ Object.create(null));
        c._any || (c._any = { preventDefault: !1, stopPropagation: !1, run: [] });
        let { any: f } = o;
        for (let u in c)
          c[u].run.push((d) => f(d, hr));
      }
    let a = o[t] || o.key;
    if (a)
      for (let h of l)
        r(h, a, o.run, o.preventDefault, o.stopPropagation), o.shift && r(h, "Shift-" + a, o.shift, o.preventDefault, o.stopPropagation);
  }
  return e;
}
let hr = null;
function Zu(n, t, e, i) {
  hr = t;
  let s = uf(t), r = Kc(s, 0), o = Gc(r) == s.length && s != " ", l = "", a = !1, h = !1, c = !1;
  oe && oe.view == e && oe.scope == i && (l = oe.prefix + " ", Ua.indexOf(t.keyCode) < 0 && (h = !0, oe = null));
  let f = /* @__PURE__ */ new Set(), u = (m) => {
    if (m) {
      for (let b of m.run)
        if (!f.has(b) && (f.add(b), b(e)))
          return m.stopPropagation && (c = !0), !0;
      m.preventDefault && (m.stopPropagation && (c = !0), h = !0);
    }
    return !1;
  }, d = n[i], p, g;
  return d && (u(d[l + ln(s, t, !o)]) ? a = !0 : o && (t.altKey || t.metaKey || t.ctrlKey) && // Ctrl-Alt may be used for AltGr on Windows
  !(C.windows && t.ctrlKey && t.altKey) && // Alt-combinations on macOS tend to be typed characters
  !(C.mac && t.altKey && !(t.ctrlKey || t.metaKey)) && (p = fe[t.keyCode]) && p != s ? (u(d[l + ln(p, t, !0)]) || t.shiftKey && (g = Di[t.keyCode]) != s && g != p && u(d[l + ln(g, t, !1)])) && (a = !0) : o && t.shiftKey && u(d[l + ln(s, t, !0)]) && (a = !0), !a && u(d._any) && (a = !0)), h && (a = !0), a && c && t.stopPropagation(), hr = null, a;
}
class Ee {
  /**
  Create a marker with the given class and dimensions. If `width`
  is null, the DOM element will get no width style.
  */
  constructor(t, e, i, s, r) {
    this.className = t, this.left = e, this.top = i, this.width = s, this.height = r;
  }
  draw() {
    let t = document.createElement("div");
    return t.className = this.className, this.adjust(t), t;
  }
  update(t, e) {
    return e.className != this.className ? !1 : (this.adjust(t), !0);
  }
  adjust(t) {
    t.style.left = this.left + "px", t.style.top = this.top + "px", this.width != null && (t.style.width = this.width + "px"), t.style.height = this.height + "px";
  }
  eq(t) {
    return this.left == t.left && this.top == t.top && this.width == t.width && this.height == t.height && this.className == t.className;
  }
  /**
  Create a set of rectangles for the given selection range,
  assigning them theclass`className`. Will create a single
  rectangle for empty ranges, and a set of selection-style
  rectangles covering the range's content (in a bidi-aware
  way) for non-empty ones.
  */
  static forRange(t, e, i) {
    if (i.empty) {
      let s = t.coordsAtPos(i.head, i.assoc || 1);
      if (!s)
        return [];
      let r = ih(t);
      return [new Ee(e, s.left - r.left, s.top - r.top, null, s.bottom - s.top)];
    } else
      return Qu(t, e, i);
  }
}
function ih(n) {
  let t = n.scrollDOM.getBoundingClientRect();
  return { left: (n.textDirection == j.LTR ? t.left : t.right - n.scrollDOM.clientWidth * n.scaleX) - n.scrollDOM.scrollLeft * n.scaleX, top: t.top - n.scrollDOM.scrollTop * n.scaleY };
}
function Qo(n, t, e, i) {
  let s = n.coordsAtPos(t, e * 2);
  if (!s)
    return i;
  let r = n.dom.getBoundingClientRect(), o = (s.top + s.bottom) / 2, l = n.posAtCoords({ x: r.left + 1, y: o }), a = n.posAtCoords({ x: r.right - 1, y: o });
  return l == null || a == null ? i : { from: Math.max(i.from, Math.min(l, a)), to: Math.min(i.to, Math.max(l, a)) };
}
function Qu(n, t, e) {
  if (e.to <= n.viewport.from || e.from >= n.viewport.to)
    return [];
  let i = Math.max(e.from, n.viewport.from), s = Math.min(e.to, n.viewport.to), r = n.textDirection == j.LTR, o = n.contentDOM, l = o.getBoundingClientRect(), a = ih(n), h = o.querySelector(".cm-line"), c = h && window.getComputedStyle(h), f = l.left + (c ? parseInt(c.paddingLeft) + Math.min(0, parseInt(c.textIndent)) : 0), u = l.right - (c ? parseInt(c.paddingRight) : 0), d = nr(n, i, 1), p = nr(n, s, -1), g = d.type == rt.Text ? d : null, m = p.type == rt.Text ? p : null;
  if (g && (n.lineWrapping || d.widgetLineBreaks) && (g = Qo(n, i, 1, g)), m && (n.lineWrapping || p.widgetLineBreaks) && (m = Qo(n, s, -1, m)), g && m && g.from == m.from && g.to == m.to)
    return v(w(e.from, e.to, g));
  {
    let k = g ? w(e.from, null, g) : O(d, !1), S = m ? w(null, e.to, m) : O(p, !0), A = [];
    return (g || d).to < (m || p).from - (g && m ? 1 : 0) || d.widgetLineBreaks > 1 && k.bottom + n.defaultLineHeight / 2 < S.top ? A.push(b(f, k.bottom, u, S.top)) : k.bottom < S.top && n.elementAtHeight((k.bottom + S.top) / 2).type == rt.Text && (k.bottom = S.top = (k.bottom + S.top) / 2), v(k).concat(A).concat(v(S));
  }
  function b(k, S, A, R) {
    return new Ee(t, k - a.left, S - a.top, Math.max(0, A - k), R - S);
  }
  function v({ top: k, bottom: S, horizontal: A }) {
    let R = [];
    for (let P = 0; P < A.length; P += 2)
      R.push(b(A[P], k, A[P + 1], S));
    return R;
  }
  function w(k, S, A) {
    let R = 1e9, P = -1e9, W = [];
    function L(H, z, ft, wt, Ft) {
      let it = n.coordsAtPos(H, H == A.to ? -2 : 2), At = n.coordsAtPos(ft, ft == A.from ? 2 : -2);
      !it || !At || (R = Math.min(it.top, At.top, R), P = Math.max(it.bottom, At.bottom, P), Ft == j.LTR ? W.push(r && z ? f : it.left, r && wt ? u : At.right) : W.push(!r && wt ? f : At.left, !r && z ? u : it.right));
    }
    let E = k ?? A.from, V = S ?? A.to;
    for (let H of n.visibleRanges)
      if (H.to > E && H.from < V)
        for (let z = Math.max(H.from, E), ft = Math.min(H.to, V); ; ) {
          let wt = n.state.doc.lineAt(z);
          for (let Ft of n.bidiSpans(wt)) {
            let it = Ft.from + wt.from, At = Ft.to + wt.from;
            if (it >= ft)
              break;
            At > z && L(Math.max(it, z), k == null && it <= E, Math.min(At, ft), S == null && At >= V, Ft.dir);
          }
          if (z = wt.to + 1, z >= ft)
            break;
        }
    return W.length == 0 && L(E, k == null, V, S == null, n.textDirection), { top: R, bottom: P, horizontal: W };
  }
  function O(k, S) {
    let A = l.top + (S ? k.top : k.bottom);
    return { top: A, bottom: A, horizontal: [] };
  }
}
function td(n, t) {
  return n.constructor == t.constructor && n.eq(t);
}
class ed {
  constructor(t, e) {
    this.view = t, this.layer = e, this.drawn = [], this.scaleX = 1, this.scaleY = 1, this.measureReq = { read: this.measure.bind(this), write: this.draw.bind(this) }, this.dom = t.scrollDOM.appendChild(document.createElement("div")), this.dom.classList.add("cm-layer"), e.above && this.dom.classList.add("cm-layer-above"), e.class && this.dom.classList.add(e.class), this.scale(), this.dom.setAttribute("aria-hidden", "true"), this.setOrder(t.state), t.requestMeasure(this.measureReq), e.mount && e.mount(this.dom, t);
  }
  update(t) {
    t.startState.facet(xn) != t.state.facet(xn) && this.setOrder(t.state), (this.layer.update(t, this.dom) || t.geometryChanged) && (this.scale(), t.view.requestMeasure(this.measureReq));
  }
  docViewUpdate(t) {
    this.layer.updateOnDocViewUpdate !== !1 && t.requestMeasure(this.measureReq);
  }
  setOrder(t) {
    let e = 0, i = t.facet(xn);
    for (; e < i.length && i[e] != this.layer; )
      e++;
    this.dom.style.zIndex = String((this.layer.above ? 150 : -1) - e);
  }
  measure() {
    return this.layer.markers(this.view);
  }
  scale() {
    let { scaleX: t, scaleY: e } = this.view;
    (t != this.scaleX || e != this.scaleY) && (this.scaleX = t, this.scaleY = e, this.dom.style.transform = `scale(${1 / t}, ${1 / e})`);
  }
  draw(t) {
    if (t.length != this.drawn.length || t.some((e, i) => !td(e, this.drawn[i]))) {
      let e = this.dom.firstChild, i = 0;
      for (let s of t)
        s.update && e && s.constructor && this.drawn[i].constructor && s.update(e, this.drawn[i]) ? (e = e.nextSibling, i++) : this.dom.insertBefore(s.draw(), e);
      for (; e; ) {
        let s = e.nextSibling;
        e.remove(), e = s;
      }
      this.drawn = t, C.webkit && (this.dom.style.display = this.dom.firstChild ? "" : "none");
    }
  }
  destroy() {
    this.layer.destroy && this.layer.destroy(this.dom, this.view), this.dom.remove();
  }
}
const xn = /* @__PURE__ */ M.define();
function nh(n) {
  return [
    kt.define((t) => new ed(t, n)),
    xn.of(n)
  ];
}
const ei = /* @__PURE__ */ M.define({
  combine(n) {
    return _i(n, {
      cursorBlinkRate: 1200,
      drawRangeCursor: !0,
      iosSelectionHandles: !0
    }, {
      cursorBlinkRate: (t, e) => Math.min(t, e),
      drawRangeCursor: (t, e) => t || e
    });
  }
});
function id(n = {}) {
  return [
    ei.of(n),
    nd,
    sd,
    rd,
    Da.of(!0)
  ];
}
function sh(n) {
  return n.startState.facet(ei) != n.state.facet(ei);
}
const nd = /* @__PURE__ */ nh({
  above: !0,
  markers(n) {
    let { state: t } = n, e = t.facet(ei), i = [];
    for (let s of t.selection.ranges) {
      let r = s == t.selection.main;
      if (s.empty || e.drawRangeCursor && !(r && C.ios && e.iosSelectionHandles)) {
        let o = r ? "cm-cursor cm-cursor-primary" : "cm-cursor cm-cursor-secondary", l = s.empty ? s : y.cursor(s.head, s.assoc);
        for (let a of Ee.forRange(n, o, l))
          i.push(a);
      }
    }
    return i;
  },
  update(n, t) {
    n.transactions.some((i) => i.selection) && (t.style.animationName = t.style.animationName == "cm-blink" ? "cm-blink2" : "cm-blink");
    let e = sh(n);
    return e && tl(n.state, t), n.docChanged || n.selectionSet || e;
  },
  mount(n, t) {
    tl(t.state, n);
  },
  class: "cm-cursorLayer"
});
function tl(n, t) {
  t.style.animationDuration = n.facet(ei).cursorBlinkRate + "ms";
}
const sd = /* @__PURE__ */ nh({
  above: !1,
  markers(n) {
    let t = [], { main: e, ranges: i } = n.state.selection;
    for (let s of i)
      if (!s.empty)
        for (let r of Ee.forRange(n, "cm-selectionBackground", s))
          t.push(r);
    if (C.ios && !e.empty && n.state.facet(ei).iosSelectionHandles) {
      for (let s of Ee.forRange(n, "cm-selectionHandle cm-selectionHandle-start", y.cursor(e.from, 1)))
        t.push(s);
      for (let s of Ee.forRange(n, "cm-selectionHandle cm-selectionHandle-end", y.cursor(e.to, 1)))
        t.push(s);
    }
    return t;
  },
  update(n, t) {
    return n.docChanged || n.selectionSet || n.viewportChanged || sh(n);
  },
  class: "cm-selectionLayer"
}), rd = /* @__PURE__ */ _n.highest(/* @__PURE__ */ T.theme({
  ".cm-line": {
    "& ::selection, &::selection": { backgroundColor: "transparent !important" },
    caretColor: "transparent !important"
  },
  ".cm-content": {
    caretColor: "transparent !important",
    "& :focus": {
      caretColor: "initial !important",
      "&::selection, & ::selection": {
        backgroundColor: "Highlight !important"
      }
    }
  }
})), rh = /* @__PURE__ */ F.define({
  map(n, t) {
    return n == null ? null : t.mapPos(n);
  }
}), yi = /* @__PURE__ */ St.define({
  create() {
    return null;
  },
  update(n, t) {
    return n != null && (n = t.changes.mapPos(n)), t.effects.reduce((e, i) => i.is(rh) ? i.value : e, n);
  }
}), od = /* @__PURE__ */ kt.fromClass(class {
  constructor(n) {
    this.view = n, this.cursor = null, this.measureReq = { read: this.readPos.bind(this), write: this.drawCursor.bind(this) };
  }
  update(n) {
    var t;
    let e = n.state.field(yi);
    e == null ? this.cursor != null && ((t = this.cursor) === null || t === void 0 || t.remove(), this.cursor = null) : (this.cursor || (this.cursor = this.view.scrollDOM.appendChild(document.createElement("div")), this.cursor.className = "cm-dropCursor"), (n.startState.field(yi) != e || n.docChanged || n.geometryChanged) && this.view.requestMeasure(this.measureReq));
  }
  readPos() {
    let { view: n } = this, t = n.state.field(yi), e = t != null && n.coordsAtPos(t);
    if (!e)
      return null;
    let i = n.scrollDOM.getBoundingClientRect();
    return {
      left: e.left - i.left + n.scrollDOM.scrollLeft * n.scaleX,
      top: e.top - i.top + n.scrollDOM.scrollTop * n.scaleY,
      height: e.bottom - e.top
    };
  }
  drawCursor(n) {
    if (this.cursor) {
      let { scaleX: t, scaleY: e } = this.view;
      n ? (this.cursor.style.left = n.left / t + "px", this.cursor.style.top = n.top / e + "px", this.cursor.style.height = n.height / e + "px") : this.cursor.style.left = "-100000px";
    }
  }
  destroy() {
    this.cursor && this.cursor.remove();
  }
  setDropPos(n) {
    this.view.state.field(yi) != n && this.view.dispatch({ effects: rh.of(n) });
  }
}, {
  eventObservers: {
    dragover(n) {
      this.setDropPos(this.view.posAtCoords({ x: n.clientX, y: n.clientY }));
    },
    dragleave(n) {
      (n.target == this.view.contentDOM || !this.view.contentDOM.contains(n.relatedTarget)) && this.setDropPos(null);
    },
    dragend() {
      this.setDropPos(null);
    },
    drop() {
      this.setDropPos(null);
    }
  }
});
function ld() {
  return [yi, od];
}
const an = "-10000px";
class oh {
  constructor(t, e, i, s) {
    this.facet = e, this.createTooltipView = i, this.removeTooltipView = s, this.input = t.state.facet(e), this.tooltips = this.input.filter((o) => o);
    let r = null;
    this.tooltipViews = this.tooltips.map((o) => r = i(o, r));
  }
  update(t, e) {
    var i;
    let s = t.state.facet(this.facet), r = s.filter((a) => a);
    if (s === this.input) {
      for (let a of this.tooltipViews)
        a.update && a.update(t);
      return !1;
    }
    let o = [], l = e ? [] : null;
    for (let a = 0; a < r.length; a++) {
      let h = r[a], c = -1;
      if (h) {
        for (let f = 0; f < this.tooltips.length; f++) {
          let u = this.tooltips[f];
          u && u.create == h.create && (c = f);
        }
        if (c < 0)
          o[a] = this.createTooltipView(h, a ? o[a - 1] : null), l && (l[a] = !!h.above);
        else {
          let f = o[a] = this.tooltipViews[c];
          l && (l[a] = e[c]), f.update && f.update(t);
        }
      }
    }
    for (let a of this.tooltipViews)
      o.indexOf(a) < 0 && (this.removeTooltipView(a), (i = a.destroy) === null || i === void 0 || i.call(a));
    return e && (l.forEach((a, h) => e[h] = a), e.length = l.length), this.input = s, this.tooltips = r, this.tooltipViews = o, !0;
  }
}
function ad(n) {
  let t = n.dom.ownerDocument.documentElement;
  return { top: 0, left: 0, bottom: t.clientHeight, right: t.clientWidth };
}
const ws = /* @__PURE__ */ M.define({
  combine: (n) => {
    var t, e, i;
    return {
      position: C.ios ? "absolute" : ((t = n.find((s) => s.position)) === null || t === void 0 ? void 0 : t.position) || "fixed",
      parent: ((e = n.find((s) => s.parent)) === null || e === void 0 ? void 0 : e.parent) || null,
      tooltipSpace: ((i = n.find((s) => s.tooltipSpace)) === null || i === void 0 ? void 0 : i.tooltipSpace) || ad
    };
  }
}), el = /* @__PURE__ */ new WeakMap(), lh = /* @__PURE__ */ kt.fromClass(class {
  constructor(n) {
    this.view = n, this.above = [], this.inView = !0, this.madeAbsolute = !1, this.lastTransaction = 0, this.measureTimeout = -1;
    let t = n.state.facet(ws);
    this.position = t.position, this.parent = t.parent, this.classes = n.themeClasses, this.createContainer(), this.measureReq = { read: this.readMeasure.bind(this), write: this.writeMeasure.bind(this), key: this }, this.resizeObserver = typeof ResizeObserver == "function" ? new ResizeObserver(() => this.measureSoon()) : null, this.manager = new oh(n, Vr, (e, i) => this.createTooltip(e, i), (e) => {
      this.resizeObserver && this.resizeObserver.unobserve(e.dom), e.dom.remove();
    }), this.above = this.manager.tooltips.map((e) => !!e.above), this.intersectionObserver = typeof IntersectionObserver == "function" ? new IntersectionObserver((e) => {
      Date.now() > this.lastTransaction - 50 && e.length > 0 && e[e.length - 1].intersectionRatio < 1 && this.measureSoon();
    }, { threshold: [1] }) : null, this.observeIntersection(), n.win.addEventListener("resize", this.measureSoon = this.measureSoon.bind(this)), this.maybeMeasure();
  }
  createContainer() {
    this.parent ? (this.container = document.createElement("div"), this.container.style.position = "relative", this.container.className = this.view.themeClasses, this.parent.appendChild(this.container)) : this.container = this.view.dom;
  }
  observeIntersection() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      for (let n of this.manager.tooltipViews)
        this.intersectionObserver.observe(n.dom);
    }
  }
  measureSoon() {
    this.measureTimeout < 0 && (this.measureTimeout = setTimeout(() => {
      this.measureTimeout = -1, this.maybeMeasure();
    }, 50));
  }
  update(n) {
    n.transactions.length && (this.lastTransaction = Date.now());
    let t = this.manager.update(n, this.above);
    t && this.observeIntersection();
    let e = t || n.geometryChanged, i = n.state.facet(ws);
    if (i.position != this.position && !this.madeAbsolute) {
      this.position = i.position;
      for (let s of this.manager.tooltipViews)
        s.dom.style.position = this.position;
      e = !0;
    }
    if (i.parent != this.parent) {
      this.parent && this.container.remove(), this.parent = i.parent, this.createContainer();
      for (let s of this.manager.tooltipViews)
        this.container.appendChild(s.dom);
      e = !0;
    } else this.parent && this.view.themeClasses != this.classes && (this.classes = this.container.className = this.view.themeClasses);
    e && this.maybeMeasure();
  }
  createTooltip(n, t) {
    let e = n.create(this.view), i = t ? t.dom : null;
    if (e.dom.classList.add("cm-tooltip"), n.arrow && !e.dom.querySelector(".cm-tooltip > .cm-tooltip-arrow")) {
      let s = document.createElement("div");
      s.className = "cm-tooltip-arrow", e.dom.appendChild(s);
    }
    return e.dom.style.position = this.position, e.dom.style.top = an, e.dom.style.left = "0px", this.container.insertBefore(e.dom, i), e.mount && e.mount(this.view), this.resizeObserver && this.resizeObserver.observe(e.dom), e;
  }
  destroy() {
    var n, t, e;
    this.view.win.removeEventListener("resize", this.measureSoon);
    for (let i of this.manager.tooltipViews)
      i.dom.remove(), (n = i.destroy) === null || n === void 0 || n.call(i);
    this.parent && this.container.remove(), (t = this.resizeObserver) === null || t === void 0 || t.disconnect(), (e = this.intersectionObserver) === null || e === void 0 || e.disconnect(), clearTimeout(this.measureTimeout);
  }
  readMeasure() {
    let n = 1, t = 1, e = !1;
    if (this.position == "fixed" && this.manager.tooltipViews.length) {
      let { dom: r } = this.manager.tooltipViews[0];
      if (C.safari) {
        let o = r.getBoundingClientRect();
        e = Math.abs(o.top + 1e4) > 1 || Math.abs(o.left) > 1;
      } else
        e = !!r.offsetParent && r.offsetParent != this.container.ownerDocument.body;
    }
    if (e || this.position == "absolute")
      if (this.parent) {
        let r = this.parent.getBoundingClientRect();
        r.width && r.height && (n = r.width / this.parent.offsetWidth, t = r.height / this.parent.offsetHeight);
      } else
        ({ scaleX: n, scaleY: t } = this.view.viewState);
    let i = this.view.scrollDOM.getBoundingClientRect(), s = Ir(this.view);
    return {
      visible: {
        left: i.left + s.left,
        top: i.top + s.top,
        right: i.right - s.right,
        bottom: i.bottom - s.bottom
      },
      parent: this.parent ? this.container.getBoundingClientRect() : this.view.dom.getBoundingClientRect(),
      pos: this.manager.tooltips.map((r, o) => {
        let l = this.manager.tooltipViews[o];
        return l.getCoords ? l.getCoords(r.pos) : this.view.coordsAtPos(r.pos);
      }),
      size: this.manager.tooltipViews.map(({ dom: r }) => r.getBoundingClientRect()),
      space: this.view.state.facet(ws).tooltipSpace(this.view),
      scaleX: n,
      scaleY: t,
      makeAbsolute: e
    };
  }
  writeMeasure(n) {
    var t;
    if (n.makeAbsolute) {
      this.madeAbsolute = !0, this.position = "absolute";
      for (let l of this.manager.tooltipViews)
        l.dom.style.position = "absolute";
    }
    let { visible: e, space: i, scaleX: s, scaleY: r } = n, o = [];
    for (let l = 0; l < this.manager.tooltips.length; l++) {
      let a = this.manager.tooltips[l], h = this.manager.tooltipViews[l], { dom: c } = h, f = n.pos[l], u = n.size[l];
      if (!f || a.clip !== !1 && (f.bottom <= Math.max(e.top, i.top) || f.top >= Math.min(e.bottom, i.bottom) || f.right < Math.max(e.left, i.left) - 0.1 || f.left > Math.min(e.right, i.right) + 0.1)) {
        c.style.top = an;
        continue;
      }
      let d = a.arrow ? h.dom.querySelector(".cm-tooltip-arrow") : null, p = d ? 7 : 0, g = u.right - u.left, m = (t = el.get(h)) !== null && t !== void 0 ? t : u.bottom - u.top, b = h.offset || cd, v = this.view.textDirection == j.LTR, w = u.width > i.right - i.left ? v ? i.left : i.right - u.width : v ? Math.max(i.left, Math.min(f.left - (d ? 14 : 0) + b.x, i.right - g)) : Math.min(Math.max(i.left, f.left - g + (d ? 14 : 0) - b.x), i.right - g), O = this.above[l];
      !a.strictSide && (O ? f.top - m - p - b.y < i.top : f.bottom + m + p + b.y > i.bottom) && O == i.bottom - f.bottom > f.top - i.top && (O = this.above[l] = !O);
      let k = (O ? f.top - i.top : i.bottom - f.bottom) - p;
      if (k < m && h.resize !== !1) {
        if (k < this.view.defaultLineHeight) {
          c.style.top = an;
          continue;
        }
        el.set(h, m), c.style.height = (m = k) / r + "px";
      } else c.style.height && (c.style.height = "");
      let S = O ? f.top - m - p - b.y : f.bottom + p + b.y, A = w + g;
      if (h.overlap !== !0)
        for (let R of o)
          R.left < A && R.right > w && R.top < S + m && R.bottom > S && (S = O ? R.top - m - 2 - p : R.bottom + p + 2);
      if (this.position == "absolute" ? (c.style.top = (S - n.parent.top) / r + "px", il(c, (w - n.parent.left) / s)) : (c.style.top = S / r + "px", il(c, w / s)), d) {
        let R = f.left + (v ? b.x : -b.x) - (w + 14 - 7);
        d.style.left = R / s + "px";
      }
      h.overlap !== !0 && o.push({ left: w, top: S, right: A, bottom: S + m }), c.classList.toggle("cm-tooltip-above", O), c.classList.toggle("cm-tooltip-below", !O), h.positioned && h.positioned(n.space);
    }
  }
  maybeMeasure() {
    if (this.manager.tooltips.length && (this.view.inView && this.view.requestMeasure(this.measureReq), this.inView != this.view.inView && (this.inView = this.view.inView, !this.inView)))
      for (let n of this.manager.tooltipViews)
        n.dom.style.top = an;
  }
}, {
  eventObservers: {
    scroll() {
      this.maybeMeasure();
    }
  }
});
function il(n, t) {
  let e = parseInt(n.style.left, 10);
  (isNaN(e) || Math.abs(t - e) > 1) && (n.style.left = t + "px");
}
const hd = /* @__PURE__ */ T.baseTheme({
  ".cm-tooltip": {
    zIndex: 500,
    boxSizing: "border-box"
  },
  "&light .cm-tooltip": {
    border: "1px solid #bbb",
    backgroundColor: "#f5f5f5"
  },
  "&light .cm-tooltip-section:not(:first-child)": {
    borderTop: "1px solid #bbb"
  },
  "&dark .cm-tooltip": {
    backgroundColor: "#333338",
    color: "white"
  },
  ".cm-tooltip-arrow": {
    height: "7px",
    width: "14px",
    position: "absolute",
    zIndex: -1,
    overflow: "hidden",
    "&:before, &:after": {
      content: "''",
      position: "absolute",
      width: 0,
      height: 0,
      borderLeft: "7px solid transparent",
      borderRight: "7px solid transparent"
    },
    ".cm-tooltip-above &": {
      bottom: "-7px",
      "&:before": {
        borderTop: "7px solid #bbb"
      },
      "&:after": {
        borderTop: "7px solid #f5f5f5",
        bottom: "1px"
      }
    },
    ".cm-tooltip-below &": {
      top: "-7px",
      "&:before": {
        borderBottom: "7px solid #bbb"
      },
      "&:after": {
        borderBottom: "7px solid #f5f5f5",
        top: "1px"
      }
    }
  },
  "&dark .cm-tooltip .cm-tooltip-arrow": {
    "&:before": {
      borderTopColor: "#333338",
      borderBottomColor: "#333338"
    },
    "&:after": {
      borderTopColor: "transparent",
      borderBottomColor: "transparent"
    }
  }
}), cd = { x: 0, y: 0 }, Vr = /* @__PURE__ */ M.define({
  enables: [lh, hd]
}), Nn = /* @__PURE__ */ M.define({
  combine: (n) => n.reduce((t, e) => t.concat(e), [])
});
class Jn {
  // Needs to be static so that host tooltip instances always match
  static create(t) {
    return new Jn(t);
  }
  constructor(t) {
    this.view = t, this.mounted = !1, this.dom = document.createElement("div"), this.dom.classList.add("cm-tooltip-hover"), this.manager = new oh(t, Nn, (e, i) => this.createHostedView(e, i), (e) => e.dom.remove());
  }
  createHostedView(t, e) {
    let i = t.create(this.view);
    return i.dom.classList.add("cm-tooltip-section"), this.dom.insertBefore(i.dom, e ? e.dom.nextSibling : this.dom.firstChild), this.mounted && i.mount && i.mount(this.view), i;
  }
  mount(t) {
    for (let e of this.manager.tooltipViews)
      e.mount && e.mount(t);
    this.mounted = !0;
  }
  positioned(t) {
    for (let e of this.manager.tooltipViews)
      e.positioned && e.positioned(t);
  }
  update(t) {
    this.manager.update(t);
  }
  destroy() {
    var t;
    for (let e of this.manager.tooltipViews)
      (t = e.destroy) === null || t === void 0 || t.call(e);
  }
  passProp(t) {
    let e;
    for (let i of this.manager.tooltipViews) {
      let s = i[t];
      if (s !== void 0) {
        if (e === void 0)
          e = s;
        else if (e !== s)
          return;
      }
    }
    return e;
  }
  get offset() {
    return this.passProp("offset");
  }
  get getCoords() {
    return this.passProp("getCoords");
  }
  get overlap() {
    return this.passProp("overlap");
  }
  get resize() {
    return this.passProp("resize");
  }
}
const fd = /* @__PURE__ */ Vr.compute([Nn], (n) => {
  let t = n.facet(Nn);
  return t.length === 0 ? null : {
    pos: Math.min(...t.map((e) => e.pos)),
    end: Math.max(...t.map((e) => {
      var i;
      return (i = e.end) !== null && i !== void 0 ? i : e.pos;
    })),
    create: Jn.create,
    above: t[0].above,
    arrow: t.some((e) => e.arrow)
  };
}), ah = /* @__PURE__ */ M.define();
class ud {
  constructor(t, e, i, s, r, o) {
    this.view = t, this.source = e, this.field = i, this.locked = s, this.setHover = r, this.hoverTime = o, this.hoverTimeout = -1, this.restartTimeout = -1, this.pending = null, this.lastMove = { x: 0, y: 0, target: t.dom, time: 0 }, this.checkHover = this.checkHover.bind(this), t.dom.addEventListener("mouseleave", this.mouseleave = this.mouseleave.bind(this)), t.dom.addEventListener("mousemove", this.mousemove = this.mousemove.bind(this));
  }
  update(t) {
    this.pending && (this.pending = null, clearTimeout(this.restartTimeout), this.restartTimeout = setTimeout(() => this.startHover(), 20));
  }
  get active() {
    return this.view.state.field(this.field);
  }
  checkHover() {
    if (this.hoverTimeout = -1, this.active.length)
      return;
    let t = Date.now() - this.lastMove.time;
    t < this.hoverTime ? this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime - t) : this.startHover();
  }
  startHover() {
    clearTimeout(this.restartTimeout);
    let { view: t, lastMove: e } = this, i = t.docView.tile.nearest(e.target);
    if (!i)
      return;
    let s, r = 1;
    if (i.isWidget())
      s = i.posAtStart;
    else {
      if (s = t.posAtCoords(e), s == null)
        return;
      let o = t.coordsAtPos(s);
      if (!o || e.y < o.top || e.y > o.bottom || e.x < o.left - t.defaultCharacterWidth || e.x > o.right + t.defaultCharacterWidth)
        return;
      let l = t.bidiSpans(t.state.doc.lineAt(s)).find((h) => h.from <= s && h.to >= s), a = l && l.dir == j.RTL ? -1 : 1;
      r = e.x < o.left ? -a : a;
    }
    this.activateHover(t, s, r);
  }
  activateHover(t, e, i, s) {
    let r = this.source(t, e, i), o = (l) => {
      if (l && !(Array.isArray(l) && !l.length)) {
        let a = Array.isArray(l) ? l : [l];
        s && this.locked.set(a, s), t.dispatch({ effects: this.setHover.of(a) });
      }
    };
    if (r && "then" in r) {
      let l = this.pending = { pos: e };
      r.then((a) => {
        this.pending == l && (this.pending = null, o(a));
      }, (a) => Pt(t.state, a, "hover tooltip"));
    } else
      o(r);
  }
  get tooltip() {
    let t = this.view.plugin(lh), e = t ? t.manager.tooltips.findIndex((i) => i.create == Jn.create) : -1;
    return e > -1 ? t.manager.tooltipViews[e] : null;
  }
  mousemove(t) {
    var e, i;
    this.lastMove = { x: t.clientX, y: t.clientY, target: t.target, time: Date.now() }, this.hoverTimeout < 0 && (this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime));
    let { active: s, tooltip: r } = this;
    if (s.length && !this.locked.has(s) && r && !dd(r.dom, t) || this.pending) {
      let { pos: o } = s[0] || this.pending, l = (i = (e = s[0]) === null || e === void 0 ? void 0 : e.end) !== null && i !== void 0 ? i : o;
      (o == l ? this.view.posAtCoords(this.lastMove) != o : !pd(this.view, o, l, t.clientX, t.clientY)) && (this.view.dispatch({ effects: this.setHover.of([]) }), this.pending = null);
    }
  }
  mouseleave(t) {
    clearTimeout(this.hoverTimeout), this.hoverTimeout = -1;
    let { active: e } = this;
    if (e.length && !this.locked.has(e)) {
      let { tooltip: i } = this;
      i && i.dom.contains(t.relatedTarget) ? this.watchTooltipLeave(i.dom) : this.view.dispatch({ effects: this.setHover.of([]) });
    }
  }
  watchTooltipLeave(t) {
    let e = (i) => {
      t.removeEventListener("mouseleave", e);
      let { active: s } = this;
      s.length && !this.locked.has(s) && !this.view.dom.contains(i.relatedTarget) && this.view.dispatch({ effects: this.setHover.of([]) });
    };
    t.addEventListener("mouseleave", e);
  }
  destroy() {
    clearTimeout(this.hoverTimeout), clearTimeout(this.restartTimeout), this.view.dom.removeEventListener("mouseleave", this.mouseleave), this.view.dom.removeEventListener("mousemove", this.mousemove);
  }
}
const hn = 4;
function dd(n, t) {
  let { left: e, right: i, top: s, bottom: r } = n.getBoundingClientRect(), o;
  if (o = n.querySelector(".cm-tooltip-arrow")) {
    let l = o.getBoundingClientRect();
    s = Math.min(l.top, s), r = Math.max(l.bottom, r);
  }
  return t.clientX >= e - hn && t.clientX <= i + hn && t.clientY >= s - hn && t.clientY <= r + hn;
}
function pd(n, t, e, i, s, r) {
  let o = n.scrollDOM.getBoundingClientRect(), l = n.documentTop + n.documentPadding.top + n.contentHeight;
  if (o.left > i || o.right < i || o.top > s || Math.min(o.bottom, l) < s)
    return !1;
  let a = n.posAtCoords({ x: i, y: s }, !1);
  return a >= t && a <= e;
}
function gd(n, t = {}) {
  let e = F.define(), i = /* @__PURE__ */ new WeakMap(), s = St.define({
    create() {
      return [];
    },
    update(o, l) {
      let a = i.get(o);
      if (o.length && (t.hideOnChange && (l.docChanged || l.selection) ? o = [] : a && a(l) ? o = [] : t.hideOn && (o = o.filter((h) => !t.hideOn(l, h)))), l.docChanged && o.length) {
        let h = [];
        for (let c of o) {
          let f = l.changes.mapPos(c.pos, -1, pt.TrackDel);
          if (f != null) {
            let u = Object.assign(/* @__PURE__ */ Object.create(null), c);
            u.pos = f, u.end != null && (u.end = l.changes.mapPos(u.end)), h.push(u);
          }
        }
        o = h;
      }
      for (let h of l.effects)
        h.is(e) && (o = h.value, a = void 0), (h.is(bd) && !h.value || h.value == s) && (o = []);
      return o.length && a && i.set(o, a), o;
    },
    provide: (o) => Nn.from(o)
  });
  const r = kt.define((o) => new ud(
    o,
    n,
    s,
    i,
    e,
    t.hoverTime || 300
    /* Hover.Time */
  ));
  return {
    active: s,
    extension: [
      s,
      r,
      ah.of(r),
      fd
    ]
  };
}
function md(n, t, e, i = {}) {
  var s;
  let r = n.state.facet(ah).map((o) => n.plugin(o)).filter((o) => !!o);
  if (i.tooltip && i.tooltip.active) {
    let o = r.find((l) => l.field == i.tooltip.active);
    o && (r = [o]);
  }
  for (let o of r)
    o.activateHover(n, t, e, (s = i.until) !== null && s !== void 0 ? s : (() => !1));
}
const bd = /* @__PURE__ */ F.define(), nl = /* @__PURE__ */ M.define({
  combine(n) {
    let t, e;
    for (let i of n)
      t = t || i.topContainer, e = e || i.bottomContainer;
    return { topContainer: t, bottomContainer: e };
  }
});
function yd(n, t) {
  let e = n.plugin(hh), i = e ? e.specs.indexOf(t) : -1;
  return i > -1 ? e.panels[i] : null;
}
const hh = /* @__PURE__ */ kt.fromClass(class {
  constructor(n) {
    this.input = n.state.facet(cr), this.specs = this.input.filter((e) => e), this.panels = this.specs.map((e) => e(n));
    let t = n.state.facet(nl);
    this.top = new cn(n, !0, t.topContainer), this.bottom = new cn(n, !1, t.bottomContainer), this.top.sync(this.panels.filter((e) => e.top)), this.bottom.sync(this.panels.filter((e) => !e.top));
    for (let e of this.panels)
      e.dom.classList.add("cm-panel"), e.mount && e.mount();
  }
  update(n) {
    let t = n.state.facet(nl);
    this.top.container != t.topContainer && (this.top.sync([]), this.top = new cn(n.view, !0, t.topContainer)), this.bottom.container != t.bottomContainer && (this.bottom.sync([]), this.bottom = new cn(n.view, !1, t.bottomContainer)), this.top.syncClasses(), this.bottom.syncClasses();
    let e = n.state.facet(cr);
    if (e != this.input) {
      let i = e.filter((a) => a), s = [], r = [], o = [], l = [];
      for (let a of i) {
        let h = this.specs.indexOf(a), c;
        h < 0 ? (c = a(n.view), l.push(c)) : (c = this.panels[h], c.update && c.update(n)), s.push(c), (c.top ? r : o).push(c);
      }
      this.specs = i, this.panels = s, this.top.sync(r), this.bottom.sync(o);
      for (let a of l)
        a.dom.classList.add("cm-panel"), a.mount && a.mount();
    } else
      for (let i of this.panels)
        i.update && i.update(n);
  }
  destroy() {
    this.top.sync([]), this.bottom.sync([]);
  }
}, {
  provide: (n) => T.scrollMargins.of((t) => {
    let e = t.plugin(n);
    return e && { top: e.top.scrollMargin(), bottom: e.bottom.scrollMargin() };
  })
});
class cn {
  constructor(t, e, i) {
    this.view = t, this.top = e, this.container = i, this.dom = void 0, this.classes = "", this.panels = [], this.syncClasses();
  }
  sync(t) {
    for (let e of this.panels)
      e.destroy && t.indexOf(e) < 0 && e.destroy();
    this.panels = t, this.syncDOM();
  }
  syncDOM() {
    if (this.panels.length == 0) {
      this.dom && (this.dom.remove(), this.dom = void 0);
      return;
    }
    if (!this.dom) {
      this.dom = document.createElement("div"), this.dom.className = this.top ? "cm-panels cm-panels-top" : "cm-panels cm-panels-bottom", this.dom.style[this.top ? "top" : "bottom"] = "0";
      let e = this.container || this.view.dom;
      e.insertBefore(this.dom, this.top ? e.firstChild : null);
    }
    let t = this.dom.firstChild;
    for (let e of this.panels)
      if (e.dom.parentNode == this.dom) {
        for (; t != e.dom; )
          t = sl(t);
        t = t.nextSibling;
      } else
        this.dom.insertBefore(e.dom, t);
    for (; t; )
      t = sl(t);
  }
  scrollMargin() {
    return !this.dom || this.container ? 0 : Math.max(0, this.top ? this.dom.getBoundingClientRect().bottom - Math.max(0, this.view.scrollDOM.getBoundingClientRect().top) : Math.min(innerHeight, this.view.scrollDOM.getBoundingClientRect().bottom) - this.dom.getBoundingClientRect().top);
  }
  syncClasses() {
    if (!(!this.container || this.classes == this.view.themeClasses)) {
      for (let t of this.classes.split(" "))
        t && this.container.classList.remove(t);
      for (let t of (this.classes = this.view.themeClasses).split(" "))
        t && this.container.classList.add(t);
    }
  }
}
function sl(n) {
  let t = n.nextSibling;
  return n.remove(), t;
}
const cr = /* @__PURE__ */ M.define({
  enables: hh
});
class de extends Le {
  /**
  @internal
  */
  compare(t) {
    return this == t || this.constructor == t.constructor && this.eq(t);
  }
  /**
  Compare this marker to another marker of the same type.
  */
  eq(t) {
    return !1;
  }
  /**
  Called if the marker has a `toDOM` method and its representation
  was removed from a gutter.
  */
  destroy(t) {
  }
}
de.prototype.elementClass = "";
de.prototype.toDOM = void 0;
de.prototype.mapMode = pt.TrackBefore;
de.prototype.startSide = de.prototype.endSide = -1;
de.prototype.point = !0;
const vs = /* @__PURE__ */ M.define(), wd = /* @__PURE__ */ M.define(), vd = {
  class: "",
  renderEmptyElements: !1,
  elementStyle: "",
  markers: () => B.empty,
  lineMarker: () => null,
  widgetMarker: () => null,
  lineMarkerChange: null,
  initialSpacer: null,
  updateSpacer: null,
  domEventHandlers: {},
  side: "before"
}, Ai = /* @__PURE__ */ M.define();
function xd(n) {
  return [ch(), Ai.of({ ...vd, ...n })];
}
const rl = /* @__PURE__ */ M.define({
  combine: (n) => n.some((t) => t)
});
function ch(n) {
  return [
    kd
  ];
}
const kd = /* @__PURE__ */ kt.fromClass(class {
  constructor(n) {
    this.view = n, this.domAfter = null, this.prevViewport = n.viewport, this.dom = document.createElement("div"), this.dom.className = "cm-gutters cm-gutters-before", this.dom.setAttribute("aria-hidden", "true"), this.dom.style.minHeight = this.view.contentHeight / this.view.scaleY + "px", this.gutters = n.state.facet(Ai).map((t) => new ll(n, t)), this.fixed = !n.state.facet(rl);
    for (let t of this.gutters)
      t.config.side == "after" ? this.getDOMAfter().appendChild(t.dom) : this.dom.appendChild(t.dom);
    this.fixed && (this.dom.style.position = "sticky"), this.syncGutters(!1), n.scrollDOM.insertBefore(this.dom, n.contentDOM);
  }
  getDOMAfter() {
    return this.domAfter || (this.domAfter = document.createElement("div"), this.domAfter.className = "cm-gutters cm-gutters-after", this.domAfter.setAttribute("aria-hidden", "true"), this.domAfter.style.minHeight = this.view.contentHeight / this.view.scaleY + "px", this.domAfter.style.position = this.fixed ? "sticky" : "", this.view.scrollDOM.appendChild(this.domAfter)), this.domAfter;
  }
  update(n) {
    if (this.updateGutters(n)) {
      let t = this.prevViewport, e = n.view.viewport, i = Math.min(t.to, e.to) - Math.max(t.from, e.from);
      this.syncGutters(i < (e.to - e.from) * 0.8);
    }
    if (n.geometryChanged) {
      let t = this.view.contentHeight / this.view.scaleY + "px";
      this.dom.style.minHeight = t, this.domAfter && (this.domAfter.style.minHeight = t);
    }
    this.view.state.facet(rl) != !this.fixed && (this.fixed = !this.fixed, this.dom.style.position = this.fixed ? "sticky" : "", this.domAfter && (this.domAfter.style.position = this.fixed ? "sticky" : "")), this.prevViewport = n.view.viewport;
  }
  syncGutters(n) {
    let t = this.dom.nextSibling;
    n && (this.dom.remove(), this.domAfter && this.domAfter.remove());
    let e = B.iter(this.view.state.facet(vs), this.view.viewport.from), i = [], s = this.gutters.map((r) => new Sd(r, this.view.viewport, -this.view.documentPadding.top));
    for (let r of this.view.viewportLineBlocks)
      if (i.length && (i = []), Array.isArray(r.type)) {
        let o = !0;
        for (let l of r.type)
          if (l.type == rt.Text && o) {
            fr(e, i, l.from);
            for (let a of s)
              a.line(this.view, l, i);
            o = !1;
          } else if (l.widget)
            for (let a of s)
              a.widget(this.view, l);
      } else if (r.type == rt.Text) {
        fr(e, i, r.from);
        for (let o of s)
          o.line(this.view, r, i);
      } else if (r.widget)
        for (let o of s)
          o.widget(this.view, r);
    for (let r of s)
      r.finish();
    n && (this.view.scrollDOM.insertBefore(this.dom, t), this.domAfter && this.view.scrollDOM.appendChild(this.domAfter));
  }
  updateGutters(n) {
    let t = n.startState.facet(Ai), e = n.state.facet(Ai), i = n.docChanged || n.heightChanged || n.viewportChanged || !B.eq(n.startState.facet(vs), n.state.facet(vs), n.view.viewport.from, n.view.viewport.to);
    if (t == e)
      for (let s of this.gutters)
        s.update(n) && (i = !0);
    else {
      i = !0;
      let s = [];
      for (let r of e) {
        let o = t.indexOf(r);
        o < 0 ? s.push(new ll(this.view, r)) : (this.gutters[o].update(n), s.push(this.gutters[o]));
      }
      for (let r of this.gutters)
        r.dom.remove(), s.indexOf(r) < 0 && r.destroy();
      for (let r of s)
        r.config.side == "after" ? this.getDOMAfter().appendChild(r.dom) : this.dom.appendChild(r.dom);
      this.gutters = s;
    }
    return i;
  }
  destroy() {
    for (let n of this.gutters)
      n.destroy();
    this.dom.remove(), this.domAfter && this.domAfter.remove();
  }
}, {
  provide: (n) => T.scrollMargins.of((t) => {
    let e = t.plugin(n);
    if (!e || e.gutters.length == 0 || !e.fixed)
      return null;
    let i = e.dom.offsetWidth * t.scaleX, s = e.domAfter ? e.domAfter.offsetWidth * t.scaleX : 0;
    return t.textDirection == j.LTR ? { left: i, right: s } : { right: i, left: s };
  })
});
function ol(n) {
  return Array.isArray(n) ? n : [n];
}
function fr(n, t, e) {
  for (; n.value && n.from <= e; )
    n.from == e && t.push(n.value), n.next();
}
class Sd {
  constructor(t, e, i) {
    this.gutter = t, this.height = i, this.i = 0, this.cursor = B.iter(t.markers, e.from);
  }
  addElement(t, e, i) {
    let { gutter: s } = this, r = (e.top - this.height) / t.scaleY, o = e.height / t.scaleY;
    if (this.i == s.elements.length) {
      let l = new fh(t, o, r, i);
      s.elements.push(l), s.dom.appendChild(l.dom);
    } else
      s.elements[this.i].update(t, o, r, i);
    this.height = e.bottom, this.i++;
  }
  line(t, e, i) {
    let s = [];
    fr(this.cursor, s, e.from), i.length && (s = s.concat(i));
    let r = this.gutter.config.lineMarker(t, e, s);
    r && s.unshift(r);
    let o = this.gutter;
    s.length == 0 && !o.config.renderEmptyElements || this.addElement(t, e, s);
  }
  widget(t, e) {
    let i = this.gutter.config.widgetMarker(t, e.widget, e), s = i ? [i] : null;
    for (let r of t.state.facet(wd)) {
      let o = r(t, e.widget, e);
      o && (s || (s = [])).push(o);
    }
    s && this.addElement(t, e, s);
  }
  finish() {
    let t = this.gutter;
    for (; t.elements.length > this.i; ) {
      let e = t.elements.pop();
      t.dom.removeChild(e.dom), e.destroy();
    }
  }
}
class ll {
  constructor(t, e) {
    this.view = t, this.config = e, this.elements = [], this.spacer = null, this.dom = document.createElement("div"), this.dom.className = "cm-gutter" + (this.config.class ? " " + this.config.class : "");
    for (let i in e.domEventHandlers)
      this.dom.addEventListener(i, (s) => {
        let r = s.target, o;
        if (r != this.dom && this.dom.contains(r)) {
          for (; r.parentNode != this.dom; )
            r = r.parentNode;
          let a = r.getBoundingClientRect();
          o = (a.top + a.bottom) / 2;
        } else
          o = s.clientY;
        let l = t.lineBlockAtHeight(o - t.documentTop);
        e.domEventHandlers[i](t, l, s) && s.preventDefault();
      });
    this.markers = ol(e.markers(t)), e.initialSpacer && (this.spacer = new fh(t, 0, 0, [e.initialSpacer(t)]), this.dom.appendChild(this.spacer.dom), this.spacer.dom.style.cssText += "visibility: hidden; pointer-events: none");
  }
  update(t) {
    let e = this.markers;
    if (this.markers = ol(this.config.markers(t.view)), this.spacer && this.config.updateSpacer) {
      let s = this.config.updateSpacer(this.spacer.markers[0], t);
      s != this.spacer.markers[0] && this.spacer.update(t.view, 0, 0, [s]);
    }
    let i = t.view.viewport;
    return !B.eq(this.markers, e, i.from, i.to) || (this.config.lineMarkerChange ? this.config.lineMarkerChange(t) : !1);
  }
  destroy() {
    for (let t of this.elements)
      t.destroy();
  }
}
class fh {
  constructor(t, e, i, s) {
    this.height = -1, this.above = 0, this.markers = [], this.dom = document.createElement("div"), this.dom.className = "cm-gutterElement", this.update(t, e, i, s);
  }
  update(t, e, i, s) {
    this.height != e && (this.height = e, this.dom.style.height = e + "px"), this.above != i && (this.dom.style.marginTop = (this.above = i) ? i + "px" : ""), Ad(this.markers, s) || this.setMarkers(t, s);
  }
  setMarkers(t, e) {
    let i = "cm-gutterElement", s = this.dom.firstChild;
    for (let r = 0, o = 0; ; ) {
      let l = o, a = r < e.length ? e[r++] : null, h = !1;
      if (a) {
        let c = a.elementClass;
        c && (i += " " + c);
        for (let f = o; f < this.markers.length; f++)
          if (this.markers[f].compare(a)) {
            l = f, h = !0;
            break;
          }
      } else
        l = this.markers.length;
      for (; o < l; ) {
        let c = this.markers[o++];
        if (c.toDOM) {
          c.destroy(s);
          let f = s.nextSibling;
          s.remove(), s = f;
        }
      }
      if (!a)
        break;
      a.toDOM && (h ? s = s.nextSibling : this.dom.insertBefore(a.toDOM(t), s)), h && o++;
    }
    this.dom.className = i, this.markers = e;
  }
  destroy() {
    this.setMarkers(null, []);
  }
}
function Ad(n, t) {
  if (n.length != t.length)
    return !1;
  for (let e = 0; e < n.length; e++)
    if (!n[e].compare(t[e]))
      return !1;
  return !0;
}
const Cd = /* @__PURE__ */ M.define(), Md = /* @__PURE__ */ M.define(), _e = /* @__PURE__ */ M.define({
  combine(n) {
    return _i(n, { formatNumber: String, domEventHandlers: {} }, {
      domEventHandlers(t, e) {
        let i = Object.assign({}, t);
        for (let s in e) {
          let r = i[s], o = e[s];
          i[s] = r ? (l, a, h) => r(l, a, h) || o(l, a, h) : o;
        }
        return i;
      }
    });
  }
});
class xs extends de {
  constructor(t) {
    super(), this.number = t;
  }
  eq(t) {
    return this.number == t.number;
  }
  toDOM() {
    return document.createTextNode(this.number);
  }
}
function ks(n, t) {
  return n.state.facet(_e).formatNumber(t, n.state);
}
const Td = /* @__PURE__ */ Ai.compute([_e], (n) => ({
  class: "cm-lineNumbers",
  renderEmptyElements: !1,
  markers(t) {
    return t.state.facet(Cd);
  },
  lineMarker(t, e, i) {
    return i.some((s) => s.toDOM) ? null : new xs(ks(t, t.state.doc.lineAt(e.from).number));
  },
  widgetMarker: (t, e, i) => {
    for (let s of t.state.facet(Md)) {
      let r = s(t, e, i);
      if (r)
        return r;
    }
    return null;
  },
  lineMarkerChange: (t) => t.startState.facet(_e) != t.state.facet(_e),
  initialSpacer(t) {
    return new xs(ks(t, al(t.state.doc.lines)));
  },
  updateSpacer(t, e) {
    let i = ks(e.view, al(e.view.state.doc.lines));
    return i == t.number ? t : new xs(i);
  },
  domEventHandlers: n.facet(_e).domEventHandlers,
  side: "before"
}));
function Od(n = {}) {
  return [
    _e.of(n),
    ch(),
    Td
  ];
}
function al(n) {
  let t = 9;
  for (; t < n; )
    t = t * 10 + 9;
  return t;
}
const Ed = 1024;
let Dd = 0;
class Ss {
  constructor(t, e) {
    this.from = t, this.to = e;
  }
}
class I {
  /**
  Create a new node prop type.
  */
  constructor(t = {}) {
    this.id = Dd++, this.perNode = !!t.perNode, this.deserialize = t.deserialize || (() => {
      throw new Error("This node type doesn't define a deserialize function");
    }), this.combine = t.combine || null;
  }
  /**
  This is meant to be used with
  [`NodeSet.extend`](#common.NodeSet.extend) or
  [`LRParser.configure`](#lr.ParserConfig.props) to compute
  prop values for each node type in the set. Takes a [match
  object](#common.NodeType^match) or function that returns undefined
  if the node type doesn't get this prop, and the prop's value if
  it does.
  */
  add(t) {
    if (this.perNode)
      throw new RangeError("Can't add per-node props to node types");
    return typeof t != "function" && (t = yt.match(t)), (e) => {
      let i = t(e);
      return i === void 0 ? null : [this, i];
    };
  }
}
I.closedBy = new I({ deserialize: (n) => n.split(" ") });
I.openedBy = new I({ deserialize: (n) => n.split(" ") });
I.group = new I({ deserialize: (n) => n.split(" ") });
I.isolate = new I({ deserialize: (n) => {
  if (n && n != "rtl" && n != "ltr" && n != "auto")
    throw new RangeError("Invalid value for isolate: " + n);
  return n || "auto";
} });
I.contextHash = new I({ perNode: !0 });
I.lookAhead = new I({ perNode: !0 });
I.mounted = new I({ perNode: !0 });
class Ci {
  constructor(t, e, i, s = !1) {
    this.tree = t, this.overlay = e, this.parser = i, this.bracketed = s;
  }
  /**
  @internal
  */
  static get(t) {
    return t && t.props && t.props[I.mounted.id];
  }
}
const Rd = /* @__PURE__ */ Object.create(null);
class yt {
  /**
  @internal
  */
  constructor(t, e, i, s = 0) {
    this.name = t, this.props = e, this.id = i, this.flags = s;
  }
  /**
  Define a node type.
  */
  static define(t) {
    let e = t.props && t.props.length ? /* @__PURE__ */ Object.create(null) : Rd, i = (t.top ? 1 : 0) | (t.skipped ? 2 : 0) | (t.error ? 4 : 0) | (t.name == null ? 8 : 0), s = new yt(t.name || "", e, t.id, i);
    if (t.props) {
      for (let r of t.props)
        if (Array.isArray(r) || (r = r(s)), r) {
          if (r[0].perNode)
            throw new RangeError("Can't store a per-node prop on a node type");
          e[r[0].id] = r[1];
        }
    }
    return s;
  }
  /**
  Retrieves a node prop for this type. Will return `undefined` if
  the prop isn't present on this node.
  */
  prop(t) {
    return this.props[t.id];
  }
  /**
  True when this is the top node of a grammar.
  */
  get isTop() {
    return (this.flags & 1) > 0;
  }
  /**
  True when this node is produced by a skip rule.
  */
  get isSkipped() {
    return (this.flags & 2) > 0;
  }
  /**
  Indicates whether this is an error node.
  */
  get isError() {
    return (this.flags & 4) > 0;
  }
  /**
  When true, this node type doesn't correspond to a user-declared
  named node, for example because it is used to cache repetition.
  */
  get isAnonymous() {
    return (this.flags & 8) > 0;
  }
  /**
  Returns true when this node's name or one of its
  [groups](#common.NodeProp^group) matches the given string.
  */
  is(t) {
    if (typeof t == "string") {
      if (this.name == t)
        return !0;
      let e = this.prop(I.group);
      return e ? e.indexOf(t) > -1 : !1;
    }
    return this.id == t;
  }
  /**
  Create a function from node types to arbitrary values by
  specifying an object whose property names are node or
  [group](#common.NodeProp^group) names. Often useful with
  [`NodeProp.add`](#common.NodeProp.add). You can put multiple
  names, separated by spaces, in a single property name to map
  multiple node names to a single value.
  */
  static match(t) {
    let e = /* @__PURE__ */ Object.create(null);
    for (let i in t)
      for (let s of i.split(" "))
        e[s] = t[i];
    return (i) => {
      for (let s = i.prop(I.group), r = -1; r < (s ? s.length : 0); r++) {
        let o = e[r < 0 ? i.name : s[r]];
        if (o)
          return o;
      }
    };
  }
}
yt.none = new yt(
  "",
  /* @__PURE__ */ Object.create(null),
  0,
  8
  /* NodeFlag.Anonymous */
);
class Fr {
  /**
  Create a set with the given types. The `id` property of each
  type should correspond to its position within the array.
  */
  constructor(t) {
    this.types = t;
    for (let e = 0; e < t.length; e++)
      if (t[e].id != e)
        throw new RangeError("Node type ids should correspond to array positions when creating a node set");
  }
  /**
  Create a copy of this set with some node properties added. The
  arguments to this method can be created with
  [`NodeProp.add`](#common.NodeProp.add).
  */
  extend(...t) {
    let e = [];
    for (let i of this.types) {
      let s = null;
      for (let r of t) {
        let o = r(i);
        if (o) {
          s || (s = Object.assign({}, i.props));
          let l = o[1], a = o[0];
          a.combine && a.id in s && (l = a.combine(s[a.id], l)), s[a.id] = l;
        }
      }
      e.push(s ? new yt(i.name, s, i.id, i.flags) : i);
    }
    return new Fr(e);
  }
}
const fn = /* @__PURE__ */ new WeakMap(), hl = /* @__PURE__ */ new WeakMap();
var X;
(function(n) {
  n[n.ExcludeBuffers = 1] = "ExcludeBuffers", n[n.IncludeAnonymous = 2] = "IncludeAnonymous", n[n.IgnoreMounts = 4] = "IgnoreMounts", n[n.IgnoreOverlays = 8] = "IgnoreOverlays", n[n.EnterBracketed = 16] = "EnterBracketed";
})(X || (X = {}));
class q {
  /**
  Construct a new tree. See also [`Tree.build`](#common.Tree^build).
  */
  constructor(t, e, i, s, r) {
    if (this.type = t, this.children = e, this.positions = i, this.length = s, this.props = null, r && r.length) {
      this.props = /* @__PURE__ */ Object.create(null);
      for (let [o, l] of r)
        this.props[typeof o == "number" ? o : o.id] = l;
    }
  }
  /**
  @internal
  */
  toString() {
    let t = Ci.get(this);
    if (t && !t.overlay)
      return t.tree.toString();
    let e = "";
    for (let i of this.children) {
      let s = i.toString();
      s && (e && (e += ","), e += s);
    }
    return this.type.name ? (/\W/.test(this.type.name) && !this.type.isError ? JSON.stringify(this.type.name) : this.type.name) + (e.length ? "(" + e + ")" : "") : e;
  }
  /**
  Get a [tree cursor](#common.TreeCursor) positioned at the top of
  the tree. Mode can be used to [control](#common.IterMode) which
  nodes the cursor visits.
  */
  cursor(t = 0) {
    return new dr(this.topNode, t);
  }
  /**
  Get a [tree cursor](#common.TreeCursor) pointing into this tree
  at the given position and side (see
  [`moveTo`](#common.TreeCursor.moveTo).
  */
  cursorAt(t, e = 0, i = 0) {
    let s = fn.get(this) || this.topNode, r = new dr(s);
    return r.moveTo(t, e), fn.set(this, r._tree), r;
  }
  /**
  Get a [syntax node](#common.SyntaxNode) object for the top of the
  tree.
  */
  get topNode() {
    return new Et(this, 0, 0, null);
  }
  /**
  Get the [syntax node](#common.SyntaxNode) at the given position.
  If `side` is -1, this will move into nodes that end at the
  position. If 1, it'll move into nodes that start at the
  position. With 0, it'll only enter nodes that cover the position
  from both sides.
  
  Note that this will not enter
  [overlays](#common.MountedTree.overlay), and you often want
  [`resolveInner`](#common.Tree.resolveInner) instead.
  */
  resolve(t, e = 0) {
    let i = Pi(fn.get(this) || this.topNode, t, e, !1);
    return fn.set(this, i), i;
  }
  /**
  Like [`resolve`](#common.Tree.resolve), but will enter
  [overlaid](#common.MountedTree.overlay) nodes, producing a syntax node
  pointing into the innermost overlaid tree at the given position
  (with parent links going through all parent structure, including
  the host trees).
  */
  resolveInner(t, e = 0) {
    let i = Pi(hl.get(this) || this.topNode, t, e, !0);
    return hl.set(this, i), i;
  }
  /**
  In some situations, it can be useful to iterate through all
  nodes around a position, including those in overlays that don't
  directly cover the position. This method gives you an iterator
  that will produce all nodes, from small to big, around the given
  position.
  */
  resolveStack(t, e = 0) {
    return Pd(this, t, e);
  }
  /**
  Iterate over the tree and its children, calling `enter` for any
  node that touches the `from`/`to` region (if given) before
  running over such a node's children, and `leave` (if given) when
  leaving the node. When `enter` returns `false`, that node will
  not have its children iterated over (or `leave` called).
  */
  iterate(t) {
    let { enter: e, leave: i, from: s = 0, to: r = this.length } = t, o = t.mode || 0, l = (o & X.IncludeAnonymous) > 0;
    for (let a = this.cursor(o | X.IncludeAnonymous); ; ) {
      let h = !1;
      if (a.from <= r && a.to >= s && (!l && a.type.isAnonymous || e(a) !== !1)) {
        if (a.firstChild())
          continue;
        h = !0;
      }
      for (; h && i && (l || !a.type.isAnonymous) && i(a), !a.nextSibling(); ) {
        if (!a.parent())
          return;
        h = !0;
      }
    }
  }
  /**
  Get the value of the given [node prop](#common.NodeProp) for this
  node. Works with both per-node and per-type props.
  */
  prop(t) {
    return t.perNode ? this.props ? this.props[t.id] : void 0 : this.type.prop(t);
  }
  /**
  Returns the node's [per-node props](#common.NodeProp.perNode) in a
  format that can be passed to the [`Tree`](#common.Tree)
  constructor.
  */
  get propValues() {
    let t = [];
    if (this.props)
      for (let e in this.props)
        t.push([+e, this.props[e]]);
    return t;
  }
  /**
  Balance the direct children of this tree, producing a copy of
  which may have children grouped into subtrees with type
  [`NodeType.none`](#common.NodeType^none).
  */
  balance(t = {}) {
    return this.children.length <= 8 ? this : zr(yt.none, this.children, this.positions, 0, this.children.length, 0, this.length, (e, i, s) => new q(this.type, e, i, s, this.propValues), t.makeTree || ((e, i, s) => new q(yt.none, e, i, s)));
  }
  /**
  Build a tree from a postfix-ordered buffer of node information,
  or a cursor over such a buffer.
  */
  static build(t) {
    return Id(t);
  }
}
q.empty = new q(yt.none, [], [], 0);
class Wr {
  constructor(t, e) {
    this.buffer = t, this.index = e;
  }
  get id() {
    return this.buffer[this.index - 4];
  }
  get start() {
    return this.buffer[this.index - 3];
  }
  get end() {
    return this.buffer[this.index - 2];
  }
  get size() {
    return this.buffer[this.index - 1];
  }
  get pos() {
    return this.index;
  }
  next() {
    this.index -= 4;
  }
  fork() {
    return new Wr(this.buffer, this.index);
  }
}
class pe {
  /**
  Create a tree buffer.
  */
  constructor(t, e, i) {
    this.buffer = t, this.length = e, this.set = i;
  }
  /**
  @internal
  */
  get type() {
    return yt.none;
  }
  /**
  @internal
  */
  toString() {
    let t = [];
    for (let e = 0; e < this.buffer.length; )
      t.push(this.childString(e)), e = this.buffer[e + 3];
    return t.join(",");
  }
  /**
  @internal
  */
  childString(t) {
    let e = this.buffer[t], i = this.buffer[t + 3], s = this.set.types[e], r = s.name;
    if (/\W/.test(r) && !s.isError && (r = JSON.stringify(r)), t += 4, i == t)
      return r;
    let o = [];
    for (; t < i; )
      o.push(this.childString(t)), t = this.buffer[t + 3];
    return r + "(" + o.join(",") + ")";
  }
  /**
  @internal
  */
  findChild(t, e, i, s, r) {
    let { buffer: o } = this, l = -1;
    for (let a = t; a != e && !(uh(r, s, o[a + 1], o[a + 2]) && (l = a, i > 0)); a = o[a + 3])
      ;
    return l;
  }
  /**
  @internal
  */
  slice(t, e, i) {
    let s = this.buffer, r = new Uint16Array(e - t), o = 0;
    for (let l = t, a = 0; l < e; ) {
      r[a++] = s[l++], r[a++] = s[l++] - i;
      let h = r[a++] = s[l++] - i;
      r[a++] = s[l++] - t, o = Math.max(o, h);
    }
    return new pe(r, o, this.set);
  }
}
function uh(n, t, e, i) {
  switch (n) {
    case -2:
      return e < t;
    case -1:
      return i >= t && e < t;
    case 0:
      return e < t && i > t;
    case 1:
      return e <= t && i > t;
    case 2:
      return i > t;
    case 4:
      return !0;
  }
}
function Pi(n, t, e, i) {
  for (var s; n.from == n.to || (e < 1 ? n.from >= t : n.from > t) || (e > -1 ? n.to <= t : n.to < t); ) {
    let o = !i && n instanceof Et && n.index < 0 ? null : n.parent;
    if (!o)
      return n;
    n = o;
  }
  let r = i ? 0 : X.IgnoreOverlays;
  if (i)
    for (let o = n, l = o.parent; l; o = l, l = o.parent)
      o instanceof Et && o.index < 0 && ((s = l.enter(t, e, r)) === null || s === void 0 ? void 0 : s.from) != o.from && (n = l);
  for (; ; ) {
    let o = n.enter(t, e, r);
    if (!o)
      return n;
    n = o;
  }
}
class dh {
  cursor(t = 0) {
    return new dr(this, t);
  }
  getChild(t, e = null, i = null) {
    let s = cl(this, t, e, i);
    return s.length ? s[0] : null;
  }
  getChildren(t, e = null, i = null) {
    return cl(this, t, e, i);
  }
  resolve(t, e = 0) {
    return Pi(this, t, e, !1);
  }
  resolveInner(t, e = 0) {
    return Pi(this, t, e, !0);
  }
  matchContext(t) {
    return ur(this.parent, t);
  }
  enterUnfinishedNodesBefore(t) {
    let e = this.childBefore(t), i = this;
    for (; e; ) {
      let s = e.lastChild;
      if (!s || s.to != e.to)
        break;
      s.type.isError && s.from == s.to ? (i = e, e = s.prevSibling) : e = s;
    }
    return i;
  }
  get node() {
    return this;
  }
  get next() {
    return this.parent;
  }
}
class Et extends dh {
  constructor(t, e, i, s) {
    super(), this._tree = t, this.from = e, this.index = i, this._parent = s;
  }
  get type() {
    return this._tree.type;
  }
  get name() {
    return this._tree.type.name;
  }
  get to() {
    return this.from + this._tree.length;
  }
  nextChild(t, e, i, s, r = 0) {
    for (let o = this; ; ) {
      for (let { children: l, positions: a } = o._tree, h = e > 0 ? l.length : -1; t != h; t += e) {
        let c = l[t], f = a[t] + o.from, u;
        if (!(!(r & X.EnterBracketed && c instanceof q && (u = Ci.get(c)) && !u.overlay && u.bracketed && i >= f && i <= f + c.length) && !uh(s, i, f, f + c.length))) {
          if (c instanceof pe) {
            if (r & X.ExcludeBuffers)
              continue;
            let d = c.findChild(0, c.buffer.length, e, i - f, s);
            if (d > -1)
              return new he(new Ld(o, c, t, f), null, d);
          } else if (r & X.IncludeAnonymous || !c.type.isAnonymous || _r(c)) {
            let d;
            if (!(r & X.IgnoreMounts) && (d = Ci.get(c)) && !d.overlay)
              return new Et(d.tree, f, t, o);
            let p = new Et(c, f, t, o);
            return r & X.IncludeAnonymous || !p.type.isAnonymous ? p : p.nextChild(e < 0 ? c.children.length - 1 : 0, e, i, s, r);
          }
        }
      }
      if (r & X.IncludeAnonymous || !o.type.isAnonymous || (o.index >= 0 ? t = o.index + e : t = e < 0 ? -1 : o._parent._tree.children.length, o = o._parent, !o))
        return null;
    }
  }
  get firstChild() {
    return this.nextChild(
      0,
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  get lastChild() {
    return this.nextChild(
      this._tree.children.length - 1,
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  childAfter(t) {
    return this.nextChild(
      0,
      1,
      t,
      2
      /* Side.After */
    );
  }
  childBefore(t) {
    return this.nextChild(
      this._tree.children.length - 1,
      -1,
      t,
      -2
      /* Side.Before */
    );
  }
  prop(t) {
    return this._tree.prop(t);
  }
  enter(t, e, i = 0) {
    let s;
    if (!(i & X.IgnoreOverlays) && (s = Ci.get(this._tree)) && s.overlay) {
      let r = t - this.from, o = i & X.EnterBracketed && s.bracketed;
      for (let { from: l, to: a } of s.overlay)
        if ((e > 0 || o ? l <= r : l < r) && (e < 0 || o ? a >= r : a > r))
          return new Et(s.tree, s.overlay[0].from + this.from, -1, this);
    }
    return this.nextChild(0, 1, t, e, i);
  }
  nextSignificantParent() {
    let t = this;
    for (; t.type.isAnonymous && t._parent; )
      t = t._parent;
    return t;
  }
  get parent() {
    return this._parent ? this._parent.nextSignificantParent() : null;
  }
  get nextSibling() {
    return this._parent && this.index >= 0 ? this._parent.nextChild(
      this.index + 1,
      1,
      0,
      4
      /* Side.DontCare */
    ) : null;
  }
  get prevSibling() {
    return this._parent && this.index >= 0 ? this._parent.nextChild(
      this.index - 1,
      -1,
      0,
      4
      /* Side.DontCare */
    ) : null;
  }
  get tree() {
    return this._tree;
  }
  toTree() {
    return this._tree;
  }
  /**
  @internal
  */
  toString() {
    return this._tree.toString();
  }
}
function cl(n, t, e, i) {
  let s = n.cursor(), r = [];
  if (!s.firstChild())
    return r;
  if (e != null) {
    for (let o = !1; !o; )
      if (o = s.type.is(e), !s.nextSibling())
        return r;
  }
  for (; ; ) {
    if (i != null && s.type.is(i))
      return r;
    if (s.type.is(t) && r.push(s.node), !s.nextSibling())
      return i == null ? r : [];
  }
}
function ur(n, t, e = t.length - 1) {
  for (let i = n; e >= 0; i = i.parent) {
    if (!i)
      return !1;
    if (!i.type.isAnonymous) {
      if (t[e] && t[e] != i.name)
        return !1;
      e--;
    }
  }
  return !0;
}
class Ld {
  constructor(t, e, i, s) {
    this.parent = t, this.buffer = e, this.index = i, this.start = s;
  }
}
class he extends dh {
  get name() {
    return this.type.name;
  }
  get from() {
    return this.context.start + this.context.buffer.buffer[this.index + 1];
  }
  get to() {
    return this.context.start + this.context.buffer.buffer[this.index + 2];
  }
  constructor(t, e, i) {
    super(), this.context = t, this._parent = e, this.index = i, this.type = t.buffer.set.types[t.buffer.buffer[i]];
  }
  child(t, e, i) {
    let { buffer: s } = this.context, r = s.findChild(this.index + 4, s.buffer[this.index + 3], t, e - this.context.start, i);
    return r < 0 ? null : new he(this.context, this, r);
  }
  get firstChild() {
    return this.child(
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  get lastChild() {
    return this.child(
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  childAfter(t) {
    return this.child(
      1,
      t,
      2
      /* Side.After */
    );
  }
  childBefore(t) {
    return this.child(
      -1,
      t,
      -2
      /* Side.Before */
    );
  }
  prop(t) {
    return this.type.prop(t);
  }
  enter(t, e, i = 0) {
    if (i & X.ExcludeBuffers)
      return null;
    let { buffer: s } = this.context, r = s.findChild(this.index + 4, s.buffer[this.index + 3], e > 0 ? 1 : -1, t - this.context.start, e);
    return r < 0 ? null : new he(this.context, this, r);
  }
  get parent() {
    return this._parent || this.context.parent.nextSignificantParent();
  }
  externalSibling(t) {
    return this._parent ? null : this.context.parent.nextChild(
      this.context.index + t,
      t,
      0,
      4
      /* Side.DontCare */
    );
  }
  get nextSibling() {
    let { buffer: t } = this.context, e = t.buffer[this.index + 3];
    return e < (this._parent ? t.buffer[this._parent.index + 3] : t.buffer.length) ? new he(this.context, this._parent, e) : this.externalSibling(1);
  }
  get prevSibling() {
    let { buffer: t } = this.context, e = this._parent ? this._parent.index + 4 : 0;
    return this.index == e ? this.externalSibling(-1) : new he(this.context, this._parent, t.findChild(
      e,
      this.index,
      -1,
      0,
      4
      /* Side.DontCare */
    ));
  }
  get tree() {
    return null;
  }
  toTree() {
    let t = [], e = [], { buffer: i } = this.context, s = this.index + 4, r = i.buffer[this.index + 3];
    if (r > s) {
      let o = i.buffer[this.index + 1];
      t.push(i.slice(s, r, o)), e.push(0);
    }
    return new q(this.type, t, e, this.to - this.from);
  }
  /**
  @internal
  */
  toString() {
    return this.context.buffer.childString(this.index);
  }
}
function ph(n) {
  if (!n.length)
    return null;
  let t = 0, e = n[0];
  for (let r = 1; r < n.length; r++) {
    let o = n[r];
    (o.from > e.from || o.to < e.to) && (e = o, t = r);
  }
  let i = e instanceof Et && e.index < 0 ? null : e.parent, s = n.slice();
  return i ? s[t] = i : s.splice(t, 1), new Bd(s, e);
}
class Bd {
  constructor(t, e) {
    this.heads = t, this.node = e;
  }
  get next() {
    return ph(this.heads);
  }
}
function Pd(n, t, e) {
  let i = n.resolveInner(t, e), s = null;
  for (let r = i instanceof Et ? i : i.context.parent; r; r = r.parent)
    if (r.index < 0) {
      let o = r.parent;
      (s || (s = [i])).push(o.resolve(t, e)), r = o;
    } else {
      let o = Ci.get(r.tree);
      if (o && o.overlay && o.overlay[0].from <= t && o.overlay[o.overlay.length - 1].to >= t) {
        let l = new Et(o.tree, o.overlay[0].from + r.from, -1, r);
        (s || (s = [i])).push(Pi(l, t, e, !1));
      }
    }
  return s ? ph(s) : i;
}
class dr {
  /**
  Shorthand for `.type.name`.
  */
  get name() {
    return this.type.name;
  }
  /**
  @internal
  */
  constructor(t, e = 0) {
    if (this.buffer = null, this.stack = [], this.index = 0, this.bufferNode = null, this.mode = e & ~X.EnterBracketed, t instanceof Et)
      this.yieldNode(t);
    else {
      this._tree = t.context.parent, this.buffer = t.context;
      for (let i = t._parent; i; i = i._parent)
        this.stack.unshift(i.index);
      this.bufferNode = t, this.yieldBuf(t.index);
    }
  }
  yieldNode(t) {
    return t ? (this._tree = t, this.type = t.type, this.from = t.from, this.to = t.to, !0) : !1;
  }
  yieldBuf(t, e) {
    this.index = t;
    let { start: i, buffer: s } = this.buffer;
    return this.type = e || s.set.types[s.buffer[t]], this.from = i + s.buffer[t + 1], this.to = i + s.buffer[t + 2], !0;
  }
  /**
  @internal
  */
  yield(t) {
    return t ? t instanceof Et ? (this.buffer = null, this.yieldNode(t)) : (this.buffer = t.context, this.yieldBuf(t.index, t.type)) : !1;
  }
  /**
  @internal
  */
  toString() {
    return this.buffer ? this.buffer.buffer.childString(this.index) : this._tree.toString();
  }
  /**
  @internal
  */
  enterChild(t, e, i) {
    if (!this.buffer)
      return this.yield(this._tree.nextChild(t < 0 ? this._tree._tree.children.length - 1 : 0, t, e, i, this.mode));
    let { buffer: s } = this.buffer, r = s.findChild(this.index + 4, s.buffer[this.index + 3], t, e - this.buffer.start, i);
    return r < 0 ? !1 : (this.stack.push(this.index), this.yieldBuf(r));
  }
  /**
  Move the cursor to this node's first child. When this returns
  false, the node has no child, and the cursor has not been moved.
  */
  firstChild() {
    return this.enterChild(
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  /**
  Move the cursor to this node's last child.
  */
  lastChild() {
    return this.enterChild(
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  /**
  Move the cursor to the first child that ends after `pos`.
  */
  childAfter(t) {
    return this.enterChild(
      1,
      t,
      2
      /* Side.After */
    );
  }
  /**
  Move to the last child that starts before `pos`.
  */
  childBefore(t) {
    return this.enterChild(
      -1,
      t,
      -2
      /* Side.Before */
    );
  }
  /**
  Move the cursor to the child around `pos`. If side is -1 the
  child may end at that position, when 1 it may start there. This
  will also enter [overlaid](#common.MountedTree.overlay)
  [mounted](#common.NodeProp^mounted) trees unless `overlays` is
  set to false.
  */
  enter(t, e, i = this.mode) {
    return this.buffer ? i & X.ExcludeBuffers ? !1 : this.enterChild(1, t, e) : this.yield(this._tree.enter(t, e, i));
  }
  /**
  Move to the node's parent node, if this isn't the top node.
  */
  parent() {
    if (!this.buffer)
      return this.yieldNode(this.mode & X.IncludeAnonymous ? this._tree._parent : this._tree.parent);
    if (this.stack.length)
      return this.yieldBuf(this.stack.pop());
    let t = this.mode & X.IncludeAnonymous ? this.buffer.parent : this.buffer.parent.nextSignificantParent();
    return this.buffer = null, this.yieldNode(t);
  }
  /**
  @internal
  */
  sibling(t) {
    if (!this.buffer)
      return this._tree._parent ? this.yield(this._tree.index < 0 ? null : this._tree._parent.nextChild(this._tree.index + t, t, 0, 4, this.mode)) : !1;
    let { buffer: e } = this.buffer, i = this.stack.length - 1;
    if (t < 0) {
      let s = i < 0 ? 0 : this.stack[i] + 4;
      if (this.index != s)
        return this.yieldBuf(e.findChild(
          s,
          this.index,
          -1,
          0,
          4
          /* Side.DontCare */
        ));
    } else {
      let s = e.buffer[this.index + 3];
      if (s < (i < 0 ? e.buffer.length : e.buffer[this.stack[i] + 3]))
        return this.yieldBuf(s);
    }
    return i < 0 ? this.yield(this.buffer.parent.nextChild(this.buffer.index + t, t, 0, 4, this.mode)) : !1;
  }
  /**
  Move to this node's next sibling, if any.
  */
  nextSibling() {
    return this.sibling(1);
  }
  /**
  Move to this node's previous sibling, if any.
  */
  prevSibling() {
    return this.sibling(-1);
  }
  atLastNode(t) {
    let e, i, { buffer: s } = this;
    if (s) {
      if (t > 0) {
        if (this.index < s.buffer.buffer.length)
          return !1;
      } else
        for (let r = 0; r < this.index; r++)
          if (s.buffer.buffer[r + 3] < this.index)
            return !1;
      ({ index: e, parent: i } = s);
    } else
      ({ index: e, _parent: i } = this._tree);
    for (; i; { index: e, _parent: i } = i)
      if (e > -1)
        for (let r = e + t, o = t < 0 ? -1 : i._tree.children.length; r != o; r += t) {
          let l = i._tree.children[r];
          if (this.mode & X.IncludeAnonymous || l instanceof pe || !l.type.isAnonymous || _r(l))
            return !1;
        }
    return !0;
  }
  move(t, e) {
    if (e && this.enterChild(
      t,
      0,
      4
      /* Side.DontCare */
    ))
      return !0;
    for (; ; ) {
      if (this.sibling(t))
        return !0;
      if (this.atLastNode(t) || !this.parent())
        return !1;
    }
  }
  /**
  Move to the next node in a
  [pre-order](https://en.wikipedia.org/wiki/Tree_traversal#Pre-order,_NLR)
  traversal, going from a node to its first child or, if the
  current node is empty or `enter` is false, its next sibling or
  the next sibling of the first parent node that has one.
  */
  next(t = !0) {
    return this.move(1, t);
  }
  /**
  Move to the next node in a last-to-first pre-order traversal. A
  node is followed by its last child or, if it has none, its
  previous sibling or the previous sibling of the first parent
  node that has one.
  */
  prev(t = !0) {
    return this.move(-1, t);
  }
  /**
  Move the cursor to the innermost node that covers `pos`. If
  `side` is -1, it will enter nodes that end at `pos`. If it is 1,
  it will enter nodes that start at `pos`.
  */
  moveTo(t, e = 0) {
    for (; (this.from == this.to || (e < 1 ? this.from >= t : this.from > t) || (e > -1 ? this.to <= t : this.to < t)) && this.parent(); )
      ;
    for (; this.enterChild(1, t, e); )
      ;
    return this;
  }
  /**
  Get a [syntax node](#common.SyntaxNode) at the cursor's current
  position.
  */
  get node() {
    if (!this.buffer)
      return this._tree;
    let t = this.bufferNode, e = null, i = 0;
    if (t && t.context == this.buffer)
      t: for (let s = this.index, r = this.stack.length; r >= 0; ) {
        for (let o = t; o; o = o._parent)
          if (o.index == s) {
            if (s == this.index)
              return o;
            e = o, i = r + 1;
            break t;
          }
        s = this.stack[--r];
      }
    for (let s = i; s < this.stack.length; s++)
      e = new he(this.buffer, e, this.stack[s]);
    return this.bufferNode = new he(this.buffer, e, this.index);
  }
  /**
  Get the [tree](#common.Tree) that represents the current node, if
  any. Will return null when the node is in a [tree
  buffer](#common.TreeBuffer).
  */
  get tree() {
    return this.buffer ? null : this._tree._tree;
  }
  /**
  Iterate over the current node and all its descendants, calling
  `enter` when entering a node and `leave`, if given, when leaving
  one. When `enter` returns `false`, any children of that node are
  skipped, and `leave` isn't called for it.
  */
  iterate(t, e) {
    for (let i = 0; ; ) {
      let s = !1;
      if (this.type.isAnonymous || t(this) !== !1) {
        if (this.firstChild()) {
          i++;
          continue;
        }
        this.type.isAnonymous || (s = !0);
      }
      for (; ; ) {
        if (s && e && e(this), s = this.type.isAnonymous, !i)
          return;
        if (this.nextSibling())
          break;
        this.parent(), i--, s = !0;
      }
    }
  }
  /**
  Test whether the current node matches a given context—a sequence
  of direct parent node names. Empty strings in the context array
  are treated as wildcards.
  */
  matchContext(t) {
    if (!this.buffer)
      return ur(this.node.parent, t);
    let { buffer: e } = this.buffer, { types: i } = e.set;
    for (let s = t.length - 1, r = this.stack.length - 1; s >= 0; r--) {
      if (r < 0)
        return ur(this._tree, t, s);
      let o = i[e.buffer[this.stack[r]]];
      if (!o.isAnonymous) {
        if (t[s] && t[s] != o.name)
          return !1;
        s--;
      }
    }
    return !0;
  }
}
function _r(n) {
  return n.children.some((t) => t instanceof pe || !t.type.isAnonymous || _r(t));
}
function Id(n) {
  var t;
  let { buffer: e, nodeSet: i, maxBufferLength: s = Ed, reused: r = [], minRepeatType: o = i.types.length } = n, l = Array.isArray(e) ? new Wr(e, e.length) : e, a = i.types, h = 0, c = 0;
  function f(k, S, A, R, P, W) {
    let { id: L, start: E, end: V, size: H } = l, z = c, ft = h;
    if (H < 0)
      if (l.next(), H == -1) {
        let Qt = r[L];
        A.push(Qt), R.push(E - k);
        return;
      } else if (H == -3) {
        h = L;
        return;
      } else if (H == -4) {
        c = L;
        return;
      } else
        throw new RangeError(`Unrecognized record size: ${H}`);
    let wt = a[L], Ft, it, At = E - k;
    if (V - E <= s && (it = m(l.pos - S, P))) {
      let Qt = new Uint16Array(it.size - it.skip), Ct = l.pos - it.size, Wt = Qt.length;
      for (; l.pos > Ct; )
        Wt = b(it.start, Qt, Wt);
      Ft = new pe(Qt, V - it.start, i), At = it.start - k;
    } else {
      let Qt = l.pos - H;
      l.next();
      let Ct = [], Wt = [], ye = L >= o ? L : -1, He = 0, Ji = V;
      for (; l.pos > Qt; )
        ye >= 0 && l.id == ye && l.size >= 0 ? (l.end <= Ji - s && (p(Ct, Wt, E, He, l.end, Ji, ye, z, ft), He = Ct.length, Ji = l.end), l.next()) : W > 2500 ? u(E, Qt, Ct, Wt) : f(E, Qt, Ct, Wt, ye, W + 1);
      if (ye >= 0 && He > 0 && He < Ct.length && p(Ct, Wt, E, He, E, Ji, ye, z, ft), Ct.reverse(), Wt.reverse(), ye > -1 && He > 0) {
        let ao = d(wt, ft);
        Ft = zr(wt, Ct, Wt, 0, Ct.length, 0, V - E, ao, ao);
      } else
        Ft = g(wt, Ct, Wt, V - E, z - V, ft);
    }
    A.push(Ft), R.push(At);
  }
  function u(k, S, A, R) {
    let P = [], W = 0, L = -1;
    for (; l.pos > S; ) {
      let { id: E, start: V, end: H, size: z } = l;
      if (z > 4)
        l.next();
      else {
        if (L > -1 && V < L)
          break;
        L < 0 && (L = H - s), P.push(E, V, H), W++, l.next();
      }
    }
    if (W) {
      let E = new Uint16Array(W * 4), V = P[P.length - 2];
      for (let H = P.length - 3, z = 0; H >= 0; H -= 3)
        E[z++] = P[H], E[z++] = P[H + 1] - V, E[z++] = P[H + 2] - V, E[z++] = z;
      A.push(new pe(E, P[2] - V, i)), R.push(V - k);
    }
  }
  function d(k, S) {
    return (A, R, P) => {
      let W = 0, L = A.length - 1, E, V;
      if (L >= 0 && (E = A[L]) instanceof q) {
        if (!L && E.type == k && E.length == P)
          return E;
        (V = E.prop(I.lookAhead)) && (W = R[L] + E.length + V);
      }
      return g(k, A, R, P, W, S);
    };
  }
  function p(k, S, A, R, P, W, L, E, V) {
    let H = [], z = [];
    for (; k.length > R; )
      H.push(k.pop()), z.push(S.pop() + A - P);
    k.push(g(i.types[L], H, z, W - P, E - W, V)), S.push(P - A);
  }
  function g(k, S, A, R, P, W, L) {
    if (W) {
      let E = [I.contextHash, W];
      L = L ? [E].concat(L) : [E];
    }
    if (P > 25) {
      let E = [I.lookAhead, P];
      L = L ? [E].concat(L) : [E];
    }
    return new q(k, S, A, R, L);
  }
  function m(k, S) {
    let A = l.fork(), R = 0, P = 0, W = 0, L = A.end - s, E = { size: 0, start: 0, skip: 0 };
    t: for (let V = A.pos - k; A.pos > V; ) {
      let H = A.size;
      if (A.id == S && H >= 0) {
        E.size = R, E.start = P, E.skip = W, W += 4, R += 4, A.next();
        continue;
      }
      let z = A.pos - H;
      if (H < 0 || z < V || A.start < L)
        break;
      let ft = A.id >= o ? 4 : 0, wt = A.start;
      for (A.next(); A.pos > z; ) {
        if (A.size < 0)
          if (A.size == -3 || A.size == -4)
            ft += 4;
          else
            break t;
        else A.id >= o && (ft += 4);
        A.next();
      }
      P = wt, R += H, W += ft;
    }
    return (S < 0 || R == k) && (E.size = R, E.start = P, E.skip = W), E.size > 4 ? E : void 0;
  }
  function b(k, S, A) {
    let { id: R, start: P, end: W, size: L } = l;
    if (l.next(), L >= 0 && R < o) {
      let E = A;
      if (L > 4) {
        let V = l.pos - (L - 4);
        for (; l.pos > V; )
          A = b(k, S, A);
      }
      S[--A] = E, S[--A] = W - k, S[--A] = P - k, S[--A] = R;
    } else L == -3 ? h = R : L == -4 && (c = R);
    return A;
  }
  let v = [], w = [];
  for (; l.pos > 0; )
    f(n.start || 0, n.bufferStart || 0, v, w, -1, 0);
  let O = (t = n.length) !== null && t !== void 0 ? t : v.length ? w[0] + v[0].length : 0;
  return new q(a[n.topID], v.reverse(), w.reverse(), O);
}
const fl = /* @__PURE__ */ new WeakMap();
function kn(n, t) {
  if (!n.isAnonymous || t instanceof pe || t.type != n)
    return 1;
  let e = fl.get(t);
  if (e == null) {
    e = 1;
    for (let i of t.children) {
      if (i.type != n || !(i instanceof q)) {
        e = 1;
        break;
      }
      e += kn(n, i);
    }
    fl.set(t, e);
  }
  return e;
}
function zr(n, t, e, i, s, r, o, l, a) {
  let h = 0;
  for (let p = i; p < s; p++)
    h += kn(n, t[p]);
  let c = Math.ceil(
    h * 1.5 / 8
    /* Balance.BranchFactor */
  ), f = [], u = [];
  function d(p, g, m, b, v) {
    for (let w = m; w < b; ) {
      let O = w, k = g[w], S = kn(n, p[w]);
      for (w++; w < b; w++) {
        let A = kn(n, p[w]);
        if (S + A >= c)
          break;
        S += A;
      }
      if (w == O + 1) {
        if (S > c) {
          let A = p[O];
          d(A.children, A.positions, 0, A.children.length, g[O] + v);
          continue;
        }
        f.push(p[O]);
      } else {
        let A = g[w - 1] + p[w - 1].length - k;
        f.push(zr(n, p, g, O, w, k, A, null, a));
      }
      u.push(k + v - r);
    }
  }
  return d(t, e, i, s, 0), (l || a)(f, u, o);
}
class De {
  /**
  Construct a tree fragment. You'll usually want to use
  [`addTree`](#common.TreeFragment^addTree) and
  [`applyChanges`](#common.TreeFragment^applyChanges) instead of
  calling this directly.
  */
  constructor(t, e, i, s, r = !1, o = !1) {
    this.from = t, this.to = e, this.tree = i, this.offset = s, this.open = (r ? 1 : 0) | (o ? 2 : 0);
  }
  /**
  Whether the start of the fragment represents the start of a
  parse, or the end of a change. (In the second case, it may not
  be safe to reuse some nodes at the start, depending on the
  parsing algorithm.)
  */
  get openStart() {
    return (this.open & 1) > 0;
  }
  /**
  Whether the end of the fragment represents the end of a
  full-document parse, or the start of a change.
  */
  get openEnd() {
    return (this.open & 2) > 0;
  }
  /**
  Create a set of fragments from a freshly parsed tree, or update
  an existing set of fragments by replacing the ones that overlap
  with a tree with content from the new tree. When `partial` is
  true, the parse is treated as incomplete, and the resulting
  fragment has [`openEnd`](#common.TreeFragment.openEnd) set to
  true.
  */
  static addTree(t, e = [], i = !1) {
    let s = [new De(0, t.length, t, 0, !1, i)];
    for (let r of e)
      r.to > t.length && s.push(r);
    return s;
  }
  /**
  Apply a set of edits to an array of fragments, removing or
  splitting fragments as necessary to remove edited ranges, and
  adjusting offsets for fragments that moved.
  */
  static applyChanges(t, e, i = 128) {
    if (!e.length)
      return t;
    let s = [], r = 1, o = t.length ? t[0] : null;
    for (let l = 0, a = 0, h = 0; ; l++) {
      let c = l < e.length ? e[l] : null, f = c ? c.fromA : 1e9;
      if (f - a >= i)
        for (; o && o.from < f; ) {
          let u = o;
          if (a >= u.from || f <= u.to || h) {
            let d = Math.max(u.from, a) - h, p = Math.min(u.to, f) - h;
            u = d >= p ? null : new De(d, p, u.tree, u.offset + h, l > 0, !!c);
          }
          if (u && s.push(u), o.to > f)
            break;
          o = r < t.length ? t[r++] : null;
        }
      if (!c)
        break;
      a = c.toA, h = c.toA - c.toB;
    }
    return s;
  }
}
class gh {
  /**
  Start a parse, returning a [partial parse](#common.PartialParse)
  object. [`fragments`](#common.TreeFragment) can be passed in to
  make the parse incremental.
  
  By default, the entire input is parsed. You can pass `ranges`,
  which should be a sorted array of non-empty, non-overlapping
  ranges, to parse only those ranges. The tree returned in that
  case will start at `ranges[0].from`.
  */
  startParse(t, e, i) {
    return typeof t == "string" && (t = new Nd(t)), i = i ? i.length ? i.map((s) => new Ss(s.from, s.to)) : [new Ss(0, 0)] : [new Ss(0, t.length)], this.createParse(t, e || [], i);
  }
  /**
  Run a full parse, returning the resulting tree.
  */
  parse(t, e, i) {
    let s = this.startParse(t, e, i);
    for (; ; ) {
      let r = s.advance();
      if (r)
        return r;
    }
  }
}
class Nd {
  constructor(t) {
    this.string = t;
  }
  get length() {
    return this.string.length;
  }
  chunk(t) {
    return this.string.slice(t);
  }
  get lineChunks() {
    return !1;
  }
  read(t, e) {
    return this.string.slice(t, e);
  }
}
new I({ perNode: !0 });
let $d = 0;
class Mt {
  /**
  @internal
  */
  constructor(t, e, i, s) {
    this.name = t, this.set = e, this.base = i, this.modified = s, this.id = $d++;
  }
  toString() {
    let { name: t } = this;
    for (let e of this.modified)
      e.name && (t = `${e.name}(${t})`);
    return t;
  }
  static define(t, e) {
    let i = typeof t == "string" ? t : "?";
    if (t instanceof Mt && (e = t), e?.base)
      throw new Error("Can not derive from a modified tag");
    let s = new Mt(i, [], null, []);
    if (s.set.push(s), e)
      for (let r of e.set)
        s.set.push(r);
    return s;
  }
  /**
  Define a tag _modifier_, which is a function that, given a tag,
  will return a tag that is a subtag of the original. Applying the
  same modifier to a twice tag will return the same value (`m1(t1)
  == m1(t1)`) and applying multiple modifiers will, regardless or
  order, produce the same tag (`m1(m2(t1)) == m2(m1(t1))`).
  
  When multiple modifiers are applied to a given base tag, each
  smaller set of modifiers is registered as a parent, so that for
  example `m1(m2(m3(t1)))` is a subtype of `m1(m2(t1))`,
  `m1(m3(t1)`, and so on.
  */
  static defineModifier(t) {
    let e = new $n(t);
    return (i) => i.modified.indexOf(e) > -1 ? i : $n.get(i.base || i, i.modified.concat(e).sort((s, r) => s.id - r.id));
  }
}
let Hd = 0;
class $n {
  constructor(t) {
    this.name = t, this.instances = [], this.id = Hd++;
  }
  static get(t, e) {
    if (!e.length)
      return t;
    let i = e[0].instances.find((l) => l.base == t && Vd(e, l.modified));
    if (i)
      return i;
    let s = [], r = new Mt(t.name, s, t, e);
    for (let l of e)
      l.instances.push(r);
    let o = Fd(e);
    for (let l of t.set)
      if (!l.modified.length)
        for (let a of o)
          s.push($n.get(l, a));
    return r;
  }
}
function Vd(n, t) {
  return n.length == t.length && n.every((e, i) => e == t[i]);
}
function Fd(n) {
  let t = [[]];
  for (let e = 0; e < n.length; e++)
    for (let i = 0, s = t.length; i < s; i++)
      t.push(t[i].concat(n[e]));
  return t.sort((e, i) => i.length - e.length);
}
function Wd(n) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let e in n) {
    let i = n[e];
    Array.isArray(i) || (i = [i]);
    for (let s of e.split(" "))
      if (s) {
        let r = [], o = 2, l = s;
        for (let f = 0; ; ) {
          if (l == "..." && f > 0 && f + 3 == s.length) {
            o = 1;
            break;
          }
          let u = /^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(l);
          if (!u)
            throw new RangeError("Invalid path: " + s);
          if (r.push(u[0] == "*" ? "" : u[0][0] == '"' ? JSON.parse(u[0]) : u[0]), f += u[0].length, f == s.length)
            break;
          let d = s[f++];
          if (f == s.length && d == "!") {
            o = 0;
            break;
          }
          if (d != "/")
            throw new RangeError("Invalid path: " + s);
          l = s.slice(f);
        }
        let a = r.length - 1, h = r[a];
        if (!h)
          throw new RangeError("Invalid path: " + s);
        let c = new Ii(i, o, a > 0 ? r.slice(0, a) : null);
        t[h] = c.sort(t[h]);
      }
  }
  return mh.add(t);
}
const mh = new I({
  combine(n, t) {
    let e, i, s;
    for (; n || t; ) {
      if (!n || t && n.depth >= t.depth ? (s = t, t = t.next) : (s = n, n = n.next), e && e.mode == s.mode && !s.context && !e.context)
        continue;
      let r = new Ii(s.tags, s.mode, s.context);
      e ? e.next = r : i = r, e = r;
    }
    return i;
  }
});
class Ii {
  constructor(t, e, i, s) {
    this.tags = t, this.mode = e, this.context = i, this.next = s;
  }
  get opaque() {
    return this.mode == 0;
  }
  get inherit() {
    return this.mode == 1;
  }
  sort(t) {
    return !t || t.depth < this.depth ? (this.next = t, this) : (t.next = this.sort(t.next), t);
  }
  get depth() {
    return this.context ? this.context.length : 0;
  }
}
Ii.empty = new Ii([], 2, null);
function bh(n, t) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let r of n)
    if (!Array.isArray(r.tag))
      e[r.tag.id] = r.class;
    else
      for (let o of r.tag)
        e[o.id] = r.class;
  let { scope: i, all: s = null } = t || {};
  return {
    style: (r) => {
      let o = s;
      for (let l of r)
        for (let a of l.set) {
          let h = e[a.id];
          if (h) {
            o = o ? o + " " + h : h;
            break;
          }
        }
      return o;
    },
    scope: i
  };
}
function _d(n, t) {
  let e = null;
  for (let i of n) {
    let s = i.style(t);
    s && (e = e ? e + " " + s : s);
  }
  return e;
}
function zd(n, t, e, i = 0, s = n.length) {
  let r = new Ud(i, Array.isArray(t) ? t : [t], e);
  r.highlightRange(n.cursor(), i, s, "", r.highlighters), r.flush(s);
}
class Ud {
  constructor(t, e, i) {
    this.at = t, this.highlighters = e, this.span = i, this.class = "";
  }
  startSpan(t, e) {
    e != this.class && (this.flush(t), t > this.at && (this.at = t), this.class = e);
  }
  flush(t) {
    t > this.at && this.class && this.span(this.at, t, this.class);
  }
  highlightRange(t, e, i, s, r) {
    let { type: o, from: l, to: a } = t;
    if (l >= i || a <= e)
      return;
    o.isTop && (r = this.highlighters.filter((d) => !d.scope || d.scope(o)));
    let h = s, c = jd(t) || Ii.empty, f = _d(r, c.tags);
    if (f && (h && (h += " "), h += f, c.mode == 1 && (s += (s ? " " : "") + f)), this.startSpan(Math.max(e, l), h), c.opaque)
      return;
    let u = t.tree && t.tree.prop(I.mounted);
    if (u && u.overlay) {
      let d = t.node.enter(u.overlay[0].from + l, 1), p = this.highlighters.filter((m) => !m.scope || m.scope(u.tree.type)), g = t.firstChild();
      for (let m = 0, b = l; ; m++) {
        let v = m < u.overlay.length ? u.overlay[m] : null, w = v ? v.from + l : a, O = Math.max(e, b), k = Math.min(i, w);
        if (O < k && g)
          for (; t.from < k && (this.highlightRange(t, O, k, s, r), this.startSpan(Math.min(k, t.to), h), !(t.to >= w || !t.nextSibling())); )
            ;
        if (!v || w > i)
          break;
        b = v.to + l, b > e && (this.highlightRange(d.cursor(), Math.max(e, v.from + l), Math.min(i, b), "", p), this.startSpan(Math.min(i, b), h));
      }
      g && t.parent();
    } else if (t.firstChild()) {
      u && (s = "");
      do
        if (!(t.to <= e)) {
          if (t.from >= i)
            break;
          this.highlightRange(t, e, i, s, r), this.startSpan(Math.min(i, t.to), h);
        }
      while (t.nextSibling());
      t.parent();
    }
  }
}
function jd(n) {
  let t = n.type.prop(mh);
  for (; t && t.context && !n.matchContext(t.context); )
    t = t.next;
  return t || null;
}
const x = Mt.define, un = x(), se = x(), ul = x(se), dl = x(se), re = x(), dn = x(re), As = x(re), jt = x(), xe = x(jt), zt = x(), Ut = x(), pr = x(), fi = x(pr), pn = x(), D = {
  /**
  A comment.
  */
  comment: un,
  /**
  A line [comment](#highlight.tags.comment).
  */
  lineComment: x(un),
  /**
  A block [comment](#highlight.tags.comment).
  */
  blockComment: x(un),
  /**
  A documentation [comment](#highlight.tags.comment).
  */
  docComment: x(un),
  /**
  Any kind of identifier.
  */
  name: se,
  /**
  The [name](#highlight.tags.name) of a variable.
  */
  variableName: x(se),
  /**
  A type [name](#highlight.tags.name).
  */
  typeName: ul,
  /**
  A tag name (subtag of [`typeName`](#highlight.tags.typeName)).
  */
  tagName: x(ul),
  /**
  A property or field [name](#highlight.tags.name).
  */
  propertyName: dl,
  /**
  An attribute name (subtag of [`propertyName`](#highlight.tags.propertyName)).
  */
  attributeName: x(dl),
  /**
  The [name](#highlight.tags.name) of a class.
  */
  className: x(se),
  /**
  A label [name](#highlight.tags.name).
  */
  labelName: x(se),
  /**
  A namespace [name](#highlight.tags.name).
  */
  namespace: x(se),
  /**
  The [name](#highlight.tags.name) of a macro.
  */
  macroName: x(se),
  /**
  A literal value.
  */
  literal: re,
  /**
  A string [literal](#highlight.tags.literal).
  */
  string: dn,
  /**
  A documentation [string](#highlight.tags.string).
  */
  docString: x(dn),
  /**
  A character literal (subtag of [string](#highlight.tags.string)).
  */
  character: x(dn),
  /**
  An attribute value (subtag of [string](#highlight.tags.string)).
  */
  attributeValue: x(dn),
  /**
  A number [literal](#highlight.tags.literal).
  */
  number: As,
  /**
  An integer [number](#highlight.tags.number) literal.
  */
  integer: x(As),
  /**
  A floating-point [number](#highlight.tags.number) literal.
  */
  float: x(As),
  /**
  A boolean [literal](#highlight.tags.literal).
  */
  bool: x(re),
  /**
  Regular expression [literal](#highlight.tags.literal).
  */
  regexp: x(re),
  /**
  An escape [literal](#highlight.tags.literal), for example a
  backslash escape in a string.
  */
  escape: x(re),
  /**
  A color [literal](#highlight.tags.literal).
  */
  color: x(re),
  /**
  A URL [literal](#highlight.tags.literal).
  */
  url: x(re),
  /**
  A language keyword.
  */
  keyword: zt,
  /**
  The [keyword](#highlight.tags.keyword) for the self or this
  object.
  */
  self: x(zt),
  /**
  The [keyword](#highlight.tags.keyword) for null.
  */
  null: x(zt),
  /**
  A [keyword](#highlight.tags.keyword) denoting some atomic value.
  */
  atom: x(zt),
  /**
  A [keyword](#highlight.tags.keyword) that represents a unit.
  */
  unit: x(zt),
  /**
  A modifier [keyword](#highlight.tags.keyword).
  */
  modifier: x(zt),
  /**
  A [keyword](#highlight.tags.keyword) that acts as an operator.
  */
  operatorKeyword: x(zt),
  /**
  A control-flow related [keyword](#highlight.tags.keyword).
  */
  controlKeyword: x(zt),
  /**
  A [keyword](#highlight.tags.keyword) that defines something.
  */
  definitionKeyword: x(zt),
  /**
  A [keyword](#highlight.tags.keyword) related to defining or
  interfacing with modules.
  */
  moduleKeyword: x(zt),
  /**
  An operator.
  */
  operator: Ut,
  /**
  An [operator](#highlight.tags.operator) that dereferences something.
  */
  derefOperator: x(Ut),
  /**
  Arithmetic-related [operator](#highlight.tags.operator).
  */
  arithmeticOperator: x(Ut),
  /**
  Logical [operator](#highlight.tags.operator).
  */
  logicOperator: x(Ut),
  /**
  Bit [operator](#highlight.tags.operator).
  */
  bitwiseOperator: x(Ut),
  /**
  Comparison [operator](#highlight.tags.operator).
  */
  compareOperator: x(Ut),
  /**
  [Operator](#highlight.tags.operator) that updates its operand.
  */
  updateOperator: x(Ut),
  /**
  [Operator](#highlight.tags.operator) that defines something.
  */
  definitionOperator: x(Ut),
  /**
  Type-related [operator](#highlight.tags.operator).
  */
  typeOperator: x(Ut),
  /**
  Control-flow [operator](#highlight.tags.operator).
  */
  controlOperator: x(Ut),
  /**
  Program or markup punctuation.
  */
  punctuation: pr,
  /**
  [Punctuation](#highlight.tags.punctuation) that separates
  things.
  */
  separator: x(pr),
  /**
  Bracket-style [punctuation](#highlight.tags.punctuation).
  */
  bracket: fi,
  /**
  Angle [brackets](#highlight.tags.bracket) (usually `<` and `>`
  tokens).
  */
  angleBracket: x(fi),
  /**
  Square [brackets](#highlight.tags.bracket) (usually `[` and `]`
  tokens).
  */
  squareBracket: x(fi),
  /**
  Parentheses (usually `(` and `)` tokens). Subtag of
  [bracket](#highlight.tags.bracket).
  */
  paren: x(fi),
  /**
  Braces (usually `{` and `}` tokens). Subtag of
  [bracket](#highlight.tags.bracket).
  */
  brace: x(fi),
  /**
  Content, for example plain text in XML or markup documents.
  */
  content: jt,
  /**
  [Content](#highlight.tags.content) that represents a heading.
  */
  heading: xe,
  /**
  A level 1 [heading](#highlight.tags.heading).
  */
  heading1: x(xe),
  /**
  A level 2 [heading](#highlight.tags.heading).
  */
  heading2: x(xe),
  /**
  A level 3 [heading](#highlight.tags.heading).
  */
  heading3: x(xe),
  /**
  A level 4 [heading](#highlight.tags.heading).
  */
  heading4: x(xe),
  /**
  A level 5 [heading](#highlight.tags.heading).
  */
  heading5: x(xe),
  /**
  A level 6 [heading](#highlight.tags.heading).
  */
  heading6: x(xe),
  /**
  A prose [content](#highlight.tags.content) separator (such as a horizontal rule).
  */
  contentSeparator: x(jt),
  /**
  [Content](#highlight.tags.content) that represents a list.
  */
  list: x(jt),
  /**
  [Content](#highlight.tags.content) that represents a quote.
  */
  quote: x(jt),
  /**
  [Content](#highlight.tags.content) that is emphasized.
  */
  emphasis: x(jt),
  /**
  [Content](#highlight.tags.content) that is styled strong.
  */
  strong: x(jt),
  /**
  [Content](#highlight.tags.content) that is part of a link.
  */
  link: x(jt),
  /**
  [Content](#highlight.tags.content) that is styled as code or
  monospace.
  */
  monospace: x(jt),
  /**
  [Content](#highlight.tags.content) that has a strike-through
  style.
  */
  strikethrough: x(jt),
  /**
  Inserted text in a change-tracking format.
  */
  inserted: x(),
  /**
  Deleted text.
  */
  deleted: x(),
  /**
  Changed text.
  */
  changed: x(),
  /**
  An invalid or unsyntactic element.
  */
  invalid: x(),
  /**
  Metadata or meta-instruction.
  */
  meta: pn,
  /**
  [Metadata](#highlight.tags.meta) that applies to the entire
  document.
  */
  documentMeta: x(pn),
  /**
  [Metadata](#highlight.tags.meta) that annotates or adds
  attributes to a given syntactic element.
  */
  annotation: x(pn),
  /**
  Processing instruction or preprocessor directive. Subtag of
  [meta](#highlight.tags.meta).
  */
  processingInstruction: x(pn),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates that a
  given element is being defined. Expected to be used with the
  various [name](#highlight.tags.name) tags.
  */
  definition: Mt.defineModifier("definition"),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates that
  something is constant. Mostly expected to be used with
  [variable names](#highlight.tags.variableName).
  */
  constant: Mt.defineModifier("constant"),
  /**
  [Modifier](#highlight.Tag^defineModifier) used to indicate that
  a [variable](#highlight.tags.variableName) or [property
  name](#highlight.tags.propertyName) is being called or defined
  as a function.
  */
  function: Mt.defineModifier("function"),
  /**
  [Modifier](#highlight.Tag^defineModifier) that can be applied to
  [names](#highlight.tags.name) to indicate that they belong to
  the language's standard environment.
  */
  standard: Mt.defineModifier("standard"),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates a given
  [names](#highlight.tags.name) is local to some scope.
  */
  local: Mt.defineModifier("local"),
  /**
  A generic variant [modifier](#highlight.Tag^defineModifier) that
  can be used to tag language-specific alternative variants of
  some common tag. It is recommended for themes to define special
  forms of at least the [string](#highlight.tags.string) and
  [variable name](#highlight.tags.variableName) tags, since those
  come up a lot.
  */
  special: Mt.defineModifier("special")
};
for (let n in D) {
  let t = D[n];
  t instanceof Mt && (t.name = n);
}
bh([
  { tag: D.link, class: "tok-link" },
  { tag: D.heading, class: "tok-heading" },
  { tag: D.emphasis, class: "tok-emphasis" },
  { tag: D.strong, class: "tok-strong" },
  { tag: D.keyword, class: "tok-keyword" },
  { tag: D.atom, class: "tok-atom" },
  { tag: D.bool, class: "tok-bool" },
  { tag: D.url, class: "tok-url" },
  { tag: D.labelName, class: "tok-labelName" },
  { tag: D.inserted, class: "tok-inserted" },
  { tag: D.deleted, class: "tok-deleted" },
  { tag: D.literal, class: "tok-literal" },
  { tag: D.string, class: "tok-string" },
  { tag: D.number, class: "tok-number" },
  { tag: [D.regexp, D.escape, D.special(D.string)], class: "tok-string2" },
  { tag: D.variableName, class: "tok-variableName" },
  { tag: D.local(D.variableName), class: "tok-variableName tok-local" },
  { tag: D.definition(D.variableName), class: "tok-variableName tok-definition" },
  { tag: D.special(D.variableName), class: "tok-variableName2" },
  { tag: D.definition(D.propertyName), class: "tok-propertyName tok-definition" },
  { tag: D.typeName, class: "tok-typeName" },
  { tag: D.namespace, class: "tok-namespace" },
  { tag: D.className, class: "tok-className" },
  { tag: D.macroName, class: "tok-macroName" },
  { tag: D.propertyName, class: "tok-propertyName" },
  { tag: D.operator, class: "tok-operator" },
  { tag: D.comment, class: "tok-comment" },
  { tag: D.meta, class: "tok-meta" },
  { tag: D.invalid, class: "tok-invalid" },
  { tag: D.punctuation, class: "tok-punctuation" }
]);
var Cs;
const ze = /* @__PURE__ */ new I();
function qd(n) {
  return M.define({
    combine: n ? (t) => t.concat(n) : void 0
  });
}
const Kd = /* @__PURE__ */ new I();
class It {
  /**
  Construct a language object. If you need to invoke this
  directly, first define a data facet with
  [`defineLanguageFacet`](https://codemirror.net/6/docs/ref/#language.defineLanguageFacet), and then
  configure your parser to [attach](https://codemirror.net/6/docs/ref/#language.languageDataProp) it
  to the language's outer syntax node.
  */
  constructor(t, e, i = [], s = "") {
    this.data = t, this.name = s, $.prototype.hasOwnProperty("tree") || Object.defineProperty($.prototype, "tree", { get() {
      return Zt(this);
    } }), this.parser = e, this.extension = [
      si.of(this),
      $.languageData.of((r, o, l) => {
        let a = pl(r, o, l), h = a.type.prop(ze);
        if (!h)
          return [];
        let c = r.facet(h), f = a.type.prop(Kd);
        if (f) {
          let u = a.resolve(o - a.from, l);
          for (let d of f)
            if (d.test(u, r)) {
              let p = r.facet(d.facet);
              return d.type == "replace" ? p : p.concat(c);
            }
        }
        return c;
      })
    ].concat(i);
  }
  /**
  Query whether this language is active at the given position.
  */
  isActiveAt(t, e, i = -1) {
    return pl(t, e, i).type.prop(ze) == this.data;
  }
  /**
  Find the document regions that were parsed using this language.
  The returned regions will _include_ any nested languages rooted
  in this language, when those exist.
  */
  findRegions(t) {
    let e = t.facet(si);
    if (e?.data == this.data)
      return [{ from: 0, to: t.doc.length }];
    if (!e || !e.allowsNesting)
      return [];
    let i = [], s = (r, o) => {
      if (r.prop(ze) == this.data) {
        i.push({ from: o, to: o + r.length });
        return;
      }
      let l = r.prop(I.mounted);
      if (l) {
        if (l.tree.prop(ze) == this.data) {
          if (l.overlay)
            for (let a of l.overlay)
              i.push({ from: a.from + o, to: a.to + o });
          else
            i.push({ from: o, to: o + r.length });
          return;
        } else if (l.overlay) {
          let a = i.length;
          if (s(l.tree, l.overlay[0].from + o), i.length > a)
            return;
        }
      }
      for (let a = 0; a < r.children.length; a++) {
        let h = r.children[a];
        h instanceof q && s(h, r.positions[a] + o);
      }
    };
    return s(Zt(t), 0), i;
  }
  /**
  Indicates whether this language allows nested languages. The
  default implementation returns true.
  */
  get allowsNesting() {
    return !0;
  }
}
It.setState = /* @__PURE__ */ F.define();
function pl(n, t, e) {
  let i = n.facet(si), s = Zt(n).topNode;
  if (!i || i.allowsNesting)
    for (let r = s; r; r = r.enter(t, e, X.ExcludeBuffers | X.EnterBracketed))
      r.type.isTop && (s = r);
  return s;
}
function Zt(n) {
  let t = n.field(It.state, !1);
  return t ? t.tree : q.empty;
}
class Gd {
  /**
  Create an input object for the given document.
  */
  constructor(t) {
    this.doc = t, this.cursorPos = 0, this.string = "", this.cursor = t.iter();
  }
  get length() {
    return this.doc.length;
  }
  syncTo(t) {
    return this.string = this.cursor.next(t - this.cursorPos).value, this.cursorPos = t + this.string.length, this.cursorPos - this.string.length;
  }
  chunk(t) {
    return this.syncTo(t), this.string;
  }
  get lineChunks() {
    return !0;
  }
  read(t, e) {
    let i = this.cursorPos - this.string.length;
    return t < i || e >= this.cursorPos ? this.doc.sliceString(t, e) : this.string.slice(t - i, e - i);
  }
}
let ui = null;
class ii {
  constructor(t, e, i = [], s, r, o, l, a) {
    this.parser = t, this.state = e, this.fragments = i, this.tree = s, this.treeLen = r, this.viewport = o, this.skipped = l, this.scheduleOn = a, this.parse = null, this.tempSkipped = [];
  }
  /**
  @internal
  */
  static create(t, e, i) {
    return new ii(t, e, [], q.empty, 0, i, [], null);
  }
  startParse() {
    return this.parser.startParse(new Gd(this.state.doc), this.fragments);
  }
  /**
  @internal
  */
  work(t, e) {
    return e != null && e >= this.state.doc.length && (e = void 0), this.tree != q.empty && this.isDone(e ?? this.state.doc.length) ? (this.takeTree(), !0) : this.withContext(() => {
      var i;
      if (typeof t == "number") {
        let s = Date.now() + t;
        t = () => Date.now() > s;
      }
      for (this.parse || (this.parse = this.startParse()), e != null && (this.parse.stoppedAt == null || this.parse.stoppedAt > e) && e < this.state.doc.length && this.parse.stopAt(e); ; ) {
        let s = this.parse.advance();
        if (s)
          if (this.fragments = this.withoutTempSkipped(De.addTree(s, this.fragments, this.parse.stoppedAt != null)), this.treeLen = (i = this.parse.stoppedAt) !== null && i !== void 0 ? i : this.state.doc.length, this.tree = s, this.parse = null, this.treeLen < (e ?? this.state.doc.length))
            this.parse = this.startParse();
          else
            return !0;
        if (t())
          return !1;
      }
    });
  }
  /**
  @internal
  */
  takeTree() {
    let t, e;
    this.parse && (t = this.parse.parsedPos) >= this.treeLen && ((this.parse.stoppedAt == null || this.parse.stoppedAt > t) && this.parse.stopAt(t), this.withContext(() => {
      for (; !(e = this.parse.advance()); )
        ;
    }), this.treeLen = t, this.tree = e, this.fragments = this.withoutTempSkipped(De.addTree(this.tree, this.fragments, !0)), this.parse = null);
  }
  withContext(t) {
    let e = ui;
    ui = this;
    try {
      return t();
    } finally {
      ui = e;
    }
  }
  withoutTempSkipped(t) {
    for (let e; e = this.tempSkipped.pop(); )
      t = gl(t, e.from, e.to);
    return t;
  }
  /**
  @internal
  */
  changes(t, e) {
    let { fragments: i, tree: s, treeLen: r, viewport: o, skipped: l } = this;
    if (this.takeTree(), !t.empty) {
      let a = [];
      if (t.iterChangedRanges((h, c, f, u) => a.push({ fromA: h, toA: c, fromB: f, toB: u })), i = De.applyChanges(i, a), s = q.empty, r = 0, o = { from: t.mapPos(o.from, -1), to: t.mapPos(o.to, 1) }, this.skipped.length) {
        l = [];
        for (let h of this.skipped) {
          let c = t.mapPos(h.from, 1), f = t.mapPos(h.to, -1);
          c < f && l.push({ from: c, to: f });
        }
      }
    }
    return new ii(this.parser, e, i, s, r, o, l, this.scheduleOn);
  }
  /**
  @internal
  */
  updateViewport(t) {
    if (this.viewport.from == t.from && this.viewport.to == t.to)
      return !1;
    this.viewport = t;
    let e = this.skipped.length;
    for (let i = 0; i < this.skipped.length; i++) {
      let { from: s, to: r } = this.skipped[i];
      s < t.to && r > t.from && (this.fragments = gl(this.fragments, s, r), this.skipped.splice(i--, 1));
    }
    return this.skipped.length >= e ? !1 : (this.reset(), !0);
  }
  /**
  @internal
  */
  reset() {
    this.parse && (this.takeTree(), this.parse = null);
  }
  /**
  Notify the parse scheduler that the given region was skipped
  because it wasn't in view, and the parse should be restarted
  when it comes into view.
  */
  skipUntilInView(t, e) {
    this.skipped.push({ from: t, to: e });
  }
  /**
  Returns a parser intended to be used as placeholder when
  asynchronously loading a nested parser. It'll skip its input and
  mark it as not-really-parsed, so that the next update will parse
  it again.
  
  When `until` is given, a reparse will be scheduled when that
  promise resolves.
  */
  static getSkippingParser(t) {
    return new class extends gh {
      createParse(e, i, s) {
        let r = s[0].from, o = s[s.length - 1].to;
        return {
          parsedPos: r,
          advance() {
            let a = ui;
            if (a) {
              for (let h of s)
                a.tempSkipped.push(h);
              t && (a.scheduleOn = a.scheduleOn ? Promise.all([a.scheduleOn, t]) : t);
            }
            return this.parsedPos = o, new q(yt.none, [], [], o - r);
          },
          stoppedAt: null,
          stopAt() {
          }
        };
      }
    }();
  }
  /**
  @internal
  */
  isDone(t) {
    t = Math.min(t, this.state.doc.length);
    let e = this.fragments;
    return this.treeLen >= t && e.length && e[0].from == 0 && e[0].to >= t;
  }
  /**
  Get the context for the current parse, or `null` if no editor
  parse is in progress.
  */
  static get() {
    return ui;
  }
}
function gl(n, t, e) {
  return De.applyChanges(n, [{ fromA: t, toA: e, fromB: t, toB: e }]);
}
class ni {
  constructor(t) {
    this.context = t, this.tree = t.tree;
  }
  apply(t) {
    if (!t.docChanged && this.tree == this.context.tree)
      return this;
    let e = this.context.changes(t.changes, t.state), i = this.context.treeLen == t.startState.doc.length ? void 0 : Math.max(t.changes.mapPos(this.context.treeLen), e.viewport.to);
    return e.work(20, i) || e.takeTree(), new ni(e);
  }
  static init(t) {
    let e = Math.min(3e3, t.doc.length), i = ii.create(t.facet(si).parser, t, { from: 0, to: e });
    return i.work(20, e) || i.takeTree(), new ni(i);
  }
}
It.state = /* @__PURE__ */ St.define({
  create: ni.init,
  update(n, t) {
    for (let e of t.effects)
      if (e.is(It.setState))
        return e.value;
    return t.startState.facet(si) != t.state.facet(si) ? ni.init(t.state) : n.apply(t);
  }
});
let yh = (n) => {
  let t = setTimeout(
    () => n(),
    500
    /* Work.MaxPause */
  );
  return () => clearTimeout(t);
};
typeof requestIdleCallback < "u" && (yh = (n) => {
  let t = -1, e = setTimeout(
    () => {
      t = requestIdleCallback(n, {
        timeout: 400
        /* Work.MinPause */
      });
    },
    100
    /* Work.MinPause */
  );
  return () => t < 0 ? clearTimeout(e) : cancelIdleCallback(t);
});
const Ms = typeof navigator < "u" && (!((Cs = navigator.scheduling) === null || Cs === void 0) && Cs.isInputPending) ? () => navigator.scheduling.isInputPending() : null, Jd = /* @__PURE__ */ kt.fromClass(class {
  constructor(t) {
    this.view = t, this.working = null, this.workScheduled = 0, this.chunkEnd = -1, this.chunkBudget = -1, this.work = this.work.bind(this), this.scheduleWork();
  }
  update(t) {
    let e = this.view.state.field(It.state).context;
    (e.updateViewport(t.view.viewport) || this.view.viewport.to > e.treeLen) && this.scheduleWork(), (t.docChanged || t.selectionSet) && (this.view.hasFocus && (this.chunkBudget += 50), this.scheduleWork()), this.checkAsyncSchedule(e);
  }
  scheduleWork() {
    if (this.working)
      return;
    let { state: t } = this.view, e = t.field(It.state);
    (e.tree != e.context.tree || !e.context.isDone(t.doc.length)) && (this.working = yh(this.work));
  }
  work(t) {
    this.working = null;
    let e = Date.now();
    if (this.chunkEnd < e && (this.chunkEnd < 0 || this.view.hasFocus) && (this.chunkEnd = e + 3e4, this.chunkBudget = 3e3), this.chunkBudget <= 0)
      return;
    let { state: i, viewport: { to: s } } = this.view, r = i.field(It.state);
    if (r.tree == r.context.tree && r.context.isDone(
      s + 1e5
      /* Work.MaxParseAhead */
    ))
      return;
    let o = Date.now() + Math.min(this.chunkBudget, 100, t && !Ms ? Math.max(25, t.timeRemaining() - 5) : 1e9), l = r.context.treeLen < s && i.doc.length > s + 1e3, a = r.context.work(() => Ms && Ms() || Date.now() > o, s + (l ? 0 : 1e5));
    this.chunkBudget -= Date.now() - e, (a || this.chunkBudget <= 0) && (r.context.takeTree(), this.view.dispatch({ effects: It.setState.of(new ni(r.context)) })), this.chunkBudget > 0 && !(a && !l) && this.scheduleWork(), this.checkAsyncSchedule(r.context);
  }
  checkAsyncSchedule(t) {
    t.scheduleOn && (this.workScheduled++, t.scheduleOn.then(() => this.scheduleWork()).catch((e) => Pt(this.view.state, e)).then(() => this.workScheduled--), t.scheduleOn = null);
  }
  destroy() {
    this.working && this.working();
  }
  isWorking() {
    return !!(this.working || this.workScheduled > 0);
  }
}, {
  eventHandlers: { focus() {
    this.scheduleWork();
  } }
}), si = /* @__PURE__ */ M.define({
  combine(n) {
    return n.length ? n[0] : null;
  },
  enables: (n) => [
    It.state,
    Jd,
    T.contentAttributes.compute([n], (t) => {
      let e = t.facet(n);
      return e && e.name ? { "data-language": e.name } : {};
    })
  ]
}), Yd = /* @__PURE__ */ M.define(), Ur = /* @__PURE__ */ M.define({
  combine: (n) => {
    if (!n.length)
      return "  ";
    let t = n[0];
    if (!t || /\S/.test(t) || Array.from(t).some((e) => e != t[0]))
      throw new Error("Invalid indent unit: " + JSON.stringify(n[0]));
    return t;
  }
});
function Ne(n) {
  let t = n.facet(Ur);
  return t.charCodeAt(0) == 9 ? n.tabSize * t.length : t.length;
}
function Hn(n, t) {
  let e = "", i = n.tabSize, s = n.facet(Ur)[0];
  if (s == "	") {
    for (; t >= i; )
      e += "	", t -= i;
    s = " ";
  }
  for (let r = 0; r < t; r++)
    e += s;
  return e;
}
function wh(n, t) {
  n instanceof $ && (n = new Yn(n));
  for (let i of n.state.facet(Yd)) {
    let s = i(n, t);
    if (s !== void 0)
      return s;
  }
  let e = Zt(n.state);
  return e.length >= t ? Xd(n, e, t) : null;
}
class Yn {
  /**
  Create an indent context.
  */
  constructor(t, e = {}) {
    this.state = t, this.options = e, this.unit = Ne(t);
  }
  /**
  Get a description of the line at the given position, taking
  [simulated line
  breaks](https://codemirror.net/6/docs/ref/#language.IndentContext.constructor^options.simulateBreak)
  into account. If there is such a break at `pos`, the `bias`
  argument determines whether the part of the line line before or
  after the break is used.
  */
  lineAt(t, e = 1) {
    let i = this.state.doc.lineAt(t), { simulateBreak: s, simulateDoubleBreak: r } = this.options;
    return s != null && s >= i.from && s <= i.to ? r && s == t ? { text: "", from: t } : (e < 0 ? s < t : s <= t) ? { text: i.text.slice(s - i.from), from: s } : { text: i.text.slice(0, s - i.from), from: i.from } : i;
  }
  /**
  Get the text directly after `pos`, either the entire line
  or the next 100 characters, whichever is shorter.
  */
  textAfterPos(t, e = 1) {
    if (this.options.simulateDoubleBreak && t == this.options.simulateBreak)
      return "";
    let { text: i, from: s } = this.lineAt(t, e);
    return i.slice(t - s, Math.min(i.length, t + 100 - s));
  }
  /**
  Find the column for the given position.
  */
  column(t, e = 1) {
    let { text: i, from: s } = this.lineAt(t, e), r = this.countColumn(i, t - s), o = this.options.overrideIndentation ? this.options.overrideIndentation(s) : -1;
    return o > -1 && (r += o - this.countColumn(i, i.search(/\S|$/))), r;
  }
  /**
  Find the column position (taking tabs into account) of the given
  position in the given string.
  */
  countColumn(t, e = t.length) {
    return zn(t, this.state.tabSize, e);
  }
  /**
  Find the indentation column of the line at the given point.
  */
  lineIndent(t, e = 1) {
    let { text: i, from: s } = this.lineAt(t, e), r = this.options.overrideIndentation;
    if (r) {
      let o = r(s);
      if (o > -1)
        return o;
    }
    return this.countColumn(i, i.search(/\S|$/));
  }
  /**
  Returns the [simulated line
  break](https://codemirror.net/6/docs/ref/#language.IndentContext.constructor^options.simulateBreak)
  for this context, if any.
  */
  get simulatedBreak() {
    return this.options.simulateBreak || null;
  }
}
const vh = /* @__PURE__ */ new I();
function Xd(n, t, e) {
  let i = t.resolveStack(e), s = t.resolveInner(e, -1).resolve(e, 0).enterUnfinishedNodesBefore(e);
  if (s != i.node) {
    let r = [];
    for (let o = s; o && !(o.from < i.node.from || o.to > i.node.to || o.from == i.node.from && o.type == i.node.type); o = o.parent)
      r.push(o);
    for (let o = r.length - 1; o >= 0; o--)
      i = { node: r[o], next: i };
  }
  return xh(i, n, e);
}
function xh(n, t, e) {
  for (let i = n; i; i = i.next) {
    let s = Qd(i.node);
    if (s)
      return s(jr.create(t, e, i));
  }
  return 0;
}
function Zd(n) {
  return n.pos == n.options.simulateBreak && n.options.simulateDoubleBreak;
}
function Qd(n) {
  let t = n.type.prop(vh);
  if (t)
    return t;
  let e = n.firstChild, i;
  if (e && (i = e.type.prop(I.closedBy))) {
    let s = n.lastChild, r = s && i.indexOf(s.name) > -1;
    return (o) => np(o, !0, 1, void 0, r && !Zd(o) ? s.from : void 0);
  }
  return n.parent == null ? tp : null;
}
function tp() {
  return 0;
}
class jr extends Yn {
  constructor(t, e, i) {
    super(t.state, t.options), this.base = t, this.pos = e, this.context = i;
  }
  /**
  The syntax tree node to which the indentation strategy
  applies.
  */
  get node() {
    return this.context.node;
  }
  /**
  @internal
  */
  static create(t, e, i) {
    return new jr(t, e, i);
  }
  /**
  Get the text directly after `this.pos`, either the entire line
  or the next 100 characters, whichever is shorter.
  */
  get textAfter() {
    return this.textAfterPos(this.pos);
  }
  /**
  Get the indentation at the reference line for `this.node`, which
  is the line on which it starts, unless there is a node that is
  _not_ a parent of this node covering the start of that line. If
  so, the line at the start of that node is tried, again skipping
  on if it is covered by another such node.
  */
  get baseIndent() {
    return this.baseIndentFor(this.node);
  }
  /**
  Get the indentation for the reference line of the given node
  (see [`baseIndent`](https://codemirror.net/6/docs/ref/#language.TreeIndentContext.baseIndent)).
  */
  baseIndentFor(t) {
    let e = this.state.doc.lineAt(t.from);
    for (; ; ) {
      let i = t.resolve(e.from);
      for (; i.parent && i.parent.from == i.from; )
        i = i.parent;
      if (ep(i, t))
        break;
      e = this.state.doc.lineAt(i.from);
    }
    return this.lineIndent(e.from);
  }
  /**
  Continue looking for indentations in the node's parent nodes,
  and return the result of that.
  */
  continue() {
    return xh(this.context.next, this.base, this.pos);
  }
}
function ep(n, t) {
  for (let e = t; e; e = e.parent)
    if (n == e)
      return !0;
  return !1;
}
function ip(n) {
  let t = n.node, e = t.childAfter(t.from), i = t.lastChild;
  if (!e)
    return null;
  let s = n.options.simulateBreak, r = n.state.doc.lineAt(e.from), o = s == null || s <= r.from ? r.to : Math.min(r.to, s);
  for (let l = e.to; ; ) {
    let a = t.childAfter(l);
    if (!a || a == i)
      return null;
    if (!a.type.isSkipped) {
      if (a.from >= o)
        return null;
      let h = /^ */.exec(r.text.slice(e.to - r.from))[0].length;
      return { from: e.from, to: e.to + h };
    }
    l = a.to;
  }
}
function np(n, t, e, i, s) {
  let r = n.textAfter, o = r.match(/^\s*/)[0].length, l = i && r.slice(o, o + i.length) == i || s == n.pos + o, a = ip(n);
  return a ? l ? n.column(a.from) : n.column(a.to) : n.baseIndent + (l ? 0 : n.unit * e);
}
class Xn {
  constructor(t, e) {
    this.specs = t;
    let i;
    function s(l) {
      let a = ce.newName();
      return (i || (i = /* @__PURE__ */ Object.create(null)))["." + a] = l, a;
    }
    const r = typeof e.all == "string" ? e.all : e.all ? s(e.all) : void 0, o = e.scope;
    this.scope = o instanceof It ? (l) => l.prop(ze) == o.data : o ? (l) => l == o : void 0, this.style = bh(t.map((l) => ({
      tag: l.tag,
      class: l.class || s(Object.assign({}, l, { tag: null }))
    })), {
      all: r
    }).style, this.module = i ? new ce(i) : null, this.themeType = e.themeType;
  }
  /**
  Create a highlighter style that associates the given styles to
  the given tags. The specs must be objects that hold a style tag
  or array of tags in their `tag` property, and either a single
  `class` property providing a static CSS class (for highlighter
  that rely on external styling), or a
  [`style-mod`](https://github.com/marijnh/style-mod#documentation)-style
  set of CSS properties (which define the styling for those tags).
  
  The CSS rules created for a highlighter will be emitted in the
  order of the spec's properties. That means that for elements that
  have multiple tags associated with them, styles defined further
  down in the list will have a higher CSS precedence than styles
  defined earlier.
  */
  static define(t, e) {
    return new Xn(t, e || {});
  }
}
const gr = /* @__PURE__ */ M.define(), sp = /* @__PURE__ */ M.define({
  combine(n) {
    return n.length ? [n[0]] : null;
  }
});
function Ts(n) {
  let t = n.facet(gr);
  return t.length ? t : n.facet(sp);
}
function rp(n, t) {
  let e = [lp], i;
  return n instanceof Xn && (n.module && e.push(T.styleModule.of(n.module)), i = n.themeType), i ? e.push(gr.computeN([T.darkTheme], (s) => s.facet(T.darkTheme) == (i == "dark") ? [n] : [])) : e.push(gr.of(n)), e;
}
class op {
  constructor(t) {
    this.markCache = /* @__PURE__ */ Object.create(null), this.tree = Zt(t.state), this.decorations = this.buildDeco(t, Ts(t.state)), this.decoratedTo = t.viewport.to;
  }
  update(t) {
    let e = Zt(t.state), i = Ts(t.state), s = i != Ts(t.startState), { viewport: r } = t.view, o = t.changes.mapPos(this.decoratedTo, 1);
    e.length < r.to && !s && e.type == this.tree.type && o >= r.to ? (this.decorations = this.decorations.map(t.changes), this.decoratedTo = o) : (e != this.tree || t.viewportChanged || s) && (this.tree = e, this.decorations = this.buildDeco(t.view, i), this.decoratedTo = r.to);
  }
  buildDeco(t, e) {
    if (!e || !this.tree.length)
      return K.none;
    let i = new Xe();
    for (let { from: s, to: r } of t.visibleRanges)
      zd(this.tree, e, (o, l, a) => {
        i.add(o, l, this.markCache[a] || (this.markCache[a] = K.mark({ class: a })));
      }, s, r);
    return i.finish();
  }
}
const lp = /* @__PURE__ */ _n.high(/* @__PURE__ */ kt.fromClass(op, {
  decorations: (n) => n.decorations
})), ap = 1e4, hp = "()[]{}", cp = /* @__PURE__ */ new I();
function mr(n, t, e) {
  let i = n.prop(t < 0 ? I.openedBy : I.closedBy);
  if (i)
    return i;
  if (n.name.length == 1) {
    let s = e.indexOf(n.name);
    if (s > -1 && s % 2 == (t < 0 ? 1 : 0))
      return [e[s + t]];
  }
  return null;
}
function br(n) {
  let t = n.type.prop(cp);
  return t ? t(n.node) : n;
}
function Ue(n, t, e, i = {}) {
  let s = i.maxScanDistance || ap, r = i.brackets || hp, o = Zt(n), l = o.resolveInner(t, e);
  for (let a = l; a; a = a.parent) {
    let h = mr(a.type, e, r);
    if (h && a.from < a.to) {
      let c = br(a);
      if (c && (e > 0 ? t >= c.from && t < c.to : t > c.from && t <= c.to))
        return fp(n, t, e, a, c, h, r);
    }
  }
  return up(n, t, e, o, l.type, s, r);
}
function fp(n, t, e, i, s, r, o) {
  let l = i.parent, a = { from: s.from, to: s.to }, h = 0, c = l?.cursor();
  if (c && (e < 0 ? c.childBefore(i.from) : c.childAfter(i.to)))
    do
      if (e < 0 ? c.to <= i.from : c.from >= i.to) {
        if (h == 0 && r.indexOf(c.type.name) > -1 && c.from < c.to) {
          let f = br(c);
          return { start: a, end: f ? { from: f.from, to: f.to } : void 0, matched: !0 };
        } else if (mr(c.type, e, o))
          h++;
        else if (mr(c.type, -e, o)) {
          if (h == 0) {
            let f = br(c);
            return {
              start: a,
              end: f && f.from < f.to ? { from: f.from, to: f.to } : void 0,
              matched: !1
            };
          }
          h--;
        }
      }
    while (e < 0 ? c.prevSibling() : c.nextSibling());
  return { start: a, matched: !1 };
}
function up(n, t, e, i, s, r, o) {
  if (e < 0 ? !t : t == n.doc.length)
    return null;
  let l = e < 0 ? n.sliceDoc(t - 1, t) : n.sliceDoc(t, t + 1), a = o.indexOf(l);
  if (a < 0 || a % 2 == 0 != e > 0)
    return null;
  let h = { from: e < 0 ? t - 1 : t, to: e > 0 ? t + 1 : t }, c = n.doc.iterRange(t, e > 0 ? n.doc.length : 0), f = 0;
  for (let u = 0; !c.next().done && u <= r; ) {
    let d = c.value;
    e < 0 && (u += d.length);
    let p = t + u * e;
    for (let g = e > 0 ? 0 : d.length - 1, m = e > 0 ? d.length : -1; g != m; g += e) {
      let b = o.indexOf(d[g]);
      if (!(b < 0 || i.resolveInner(p + g, 1).type != s))
        if (b % 2 == 0 == e > 0)
          f++;
        else {
          if (f == 1)
            return { start: h, end: { from: p + g, to: p + g + 1 }, matched: b >> 1 == a >> 1 };
          f--;
        }
    }
    e > 0 && (u += d.length);
  }
  return c.done ? { start: h, matched: !1 } : null;
}
function ml(n, t, e, i = 0, s = 0) {
  t == null && (t = n.search(/[^\s\u00a0]/), t == -1 && (t = n.length));
  let r = s;
  for (let o = i; o < t; o++)
    n.charCodeAt(o) == 9 ? r += e - r % e : r++;
  return r;
}
class kh {
  /**
  Create a stream.
  */
  constructor(t, e, i, s) {
    this.string = t, this.tabSize = e, this.indentUnit = i, this.overrideIndent = s, this.pos = 0, this.start = 0, this.lastColumnPos = 0, this.lastColumnValue = 0;
  }
  /**
  True if we are at the end of the line.
  */
  eol() {
    return this.pos >= this.string.length;
  }
  /**
  True if we are at the start of the line.
  */
  sol() {
    return this.pos == 0;
  }
  /**
  Get the next code unit after the current position, or undefined
  if we're at the end of the line.
  */
  peek() {
    return this.string.charAt(this.pos) || void 0;
  }
  /**
  Read the next code unit and advance `this.pos`.
  */
  next() {
    if (this.pos < this.string.length)
      return this.string.charAt(this.pos++);
  }
  /**
  Match the next character against the given string, regular
  expression, or predicate. Consume and return it if it matches.
  */
  eat(t) {
    let e = this.string.charAt(this.pos), i;
    if (typeof t == "string" ? i = e == t : i = e && (t instanceof RegExp ? t.test(e) : t(e)), i)
      return ++this.pos, e;
  }
  /**
  Continue matching characters that match the given string,
  regular expression, or predicate function. Return true if any
  characters were consumed.
  */
  eatWhile(t) {
    let e = this.pos;
    for (; this.eat(t); )
      ;
    return this.pos > e;
  }
  /**
  Consume whitespace ahead of `this.pos`. Return true if any was
  found.
  */
  eatSpace() {
    let t = this.pos;
    for (; /[\s\u00a0]/.test(this.string.charAt(this.pos)); )
      ++this.pos;
    return this.pos > t;
  }
  /**
  Move to the end of the line.
  */
  skipToEnd() {
    this.pos = this.string.length;
  }
  /**
  Move to directly before the given character, if found on the
  current line.
  */
  skipTo(t) {
    let e = this.string.indexOf(t, this.pos);
    if (e > -1)
      return this.pos = e, !0;
  }
  /**
  Move back `n` characters.
  */
  backUp(t) {
    this.pos -= t;
  }
  /**
  Get the column position at `this.pos`.
  */
  column() {
    return this.lastColumnPos < this.start && (this.lastColumnValue = ml(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue), this.lastColumnPos = this.start), this.lastColumnValue;
  }
  /**
  Get the indentation column of the current line.
  */
  indentation() {
    var t;
    return (t = this.overrideIndent) !== null && t !== void 0 ? t : ml(this.string, null, this.tabSize);
  }
  /**
  Match the input against the given string or regular expression
  (which should start with a `^`). Return true or the regexp match
  if it matches.
  
  Unless `consume` is set to `false`, this will move `this.pos`
  past the matched text.
  
  When matching a string `caseInsensitive` can be set to true to
  make the match case-insensitive.
  */
  match(t, e, i) {
    if (typeof t == "string") {
      let s = (o) => i ? o.toLowerCase() : o, r = this.string.substr(this.pos, t.length);
      return s(r) == s(t) ? (e !== !1 && (this.pos += t.length), !0) : null;
    } else {
      let s = this.string.slice(this.pos).match(t);
      return s && s.index > 0 ? null : (s && e !== !1 && (this.pos += s[0].length), s);
    }
  }
  /**
  Get the current token.
  */
  current() {
    return this.string.slice(this.start, this.pos);
  }
}
function dp(n) {
  return {
    name: n.name || "",
    token: n.token,
    blankLine: n.blankLine || (() => {
    }),
    startState: n.startState || (() => !0),
    copyState: n.copyState || pp,
    indent: n.indent || (() => null),
    languageData: n.languageData || {},
    tokenTable: n.tokenTable || Gr,
    mergeTokens: n.mergeTokens !== !1
  };
}
function pp(n) {
  if (typeof n != "object")
    return n;
  let t = {};
  for (let e in n) {
    let i = n[e];
    t[e] = i instanceof Array ? i.slice() : i;
  }
  return t;
}
const bl = /* @__PURE__ */ new WeakMap();
class qr extends It {
  constructor(t) {
    let e = qd(t.languageData), i = dp(t), s, r = new class extends gh {
      createParse(o, l, a) {
        return new mp(s, o, l, a);
      }
    }();
    super(e, r, [], t.name), this.topNode = wp(e, this), s = this, this.streamParser = i, this.stateAfter = new I({ perNode: !0 }), this.tokenTable = t.tokenTable ? new Mh(i.tokenTable) : yp;
  }
  /**
  Define a stream language.
  */
  static define(t) {
    return new qr(t);
  }
  /**
  @internal
  */
  getIndent(t) {
    let e, { overrideIndentation: i } = t.options;
    i && (e = bl.get(t.state), e != null && e < t.pos - 1e4 && (e = void 0));
    let s = Kr(this, t.node.tree, t.node.from, t.node.from, e ?? t.pos), r, o;
    if (s ? (o = s.state, r = s.pos + 1) : (o = this.streamParser.startState(t.unit), r = t.node.from), t.pos - r > 1e4)
      return null;
    for (; r < t.pos; ) {
      let a = t.state.doc.lineAt(r), h = Math.min(t.pos, a.to);
      if (a.length) {
        let c = i ? i(a.from) : -1, f = new kh(a.text, t.state.tabSize, t.unit, c < 0 ? void 0 : c);
        for (; f.pos < h - a.from; )
          Ah(this.streamParser.token, f, o);
      } else
        this.streamParser.blankLine(o, t.unit);
      if (h == t.pos)
        break;
      r = a.to + 1;
    }
    let l = t.lineAt(t.pos);
    return i && e == null && bl.set(t.state, l.from), this.streamParser.indent(o, /^\s*(.*)/.exec(l.text)[1], t);
  }
  get allowsNesting() {
    return !1;
  }
}
function Kr(n, t, e, i, s) {
  let r = e >= i && e + t.length <= s && t.prop(n.stateAfter);
  if (r)
    return { state: n.streamParser.copyState(r), pos: e + t.length };
  for (let o = t.children.length - 1; o >= 0; o--) {
    let l = t.children[o], a = e + t.positions[o], h = l instanceof q && a < s && Kr(n, l, a, i, s);
    if (h)
      return h;
  }
  return null;
}
function Sh(n, t, e, i, s) {
  if (s && e <= 0 && i >= t.length)
    return t;
  !s && e == 0 && t.type == n.topNode && (s = !0);
  for (let r = t.children.length - 1; r >= 0; r--) {
    let o = t.positions[r], l = t.children[r], a;
    if (o < i && l instanceof q) {
      if (!(a = Sh(n, l, e - o, i - o, s)))
        break;
      return s ? new q(t.type, t.children.slice(0, r).concat(a), t.positions.slice(0, r + 1), o + a.length) : a;
    }
  }
  return null;
}
function gp(n, t, e, i, s) {
  for (let r of t) {
    let o = r.from + (r.openStart ? 25 : 0), l = r.to - (r.openEnd ? 25 : 0), a = o <= e && l > e && Kr(n, r.tree, 0 - r.offset, e, l), h;
    if (a && a.pos <= i && (h = Sh(n, r.tree, e + r.offset, a.pos + r.offset, !1)))
      return { state: a.state, tree: h };
  }
  return { state: n.streamParser.startState(s ? Ne(s) : 4), tree: q.empty };
}
class mp {
  constructor(t, e, i, s) {
    this.lang = t, this.input = e, this.fragments = i, this.ranges = s, this.stoppedAt = null, this.chunks = [], this.chunkPos = [], this.chunk = [], this.chunkReused = void 0, this.rangeIndex = 0, this.to = s[s.length - 1].to;
    let r = ii.get(), o = s[0].from, { state: l, tree: a } = gp(t, i, o, this.to, r?.state);
    this.state = l, this.parsedPos = this.chunkStart = o + a.length;
    for (let h = 0; h < a.children.length; h++)
      this.chunks.push(a.children[h]), this.chunkPos.push(a.positions[h]);
    r && this.parsedPos < r.viewport.from - 1e5 && s.some((h) => h.from <= r.viewport.from && h.to >= r.viewport.from) && (this.state = this.lang.streamParser.startState(Ne(r.state)), r.skipUntilInView(this.parsedPos, r.viewport.from), this.parsedPos = r.viewport.from), this.moveRangeIndex();
  }
  advance() {
    let t = ii.get(), e = this.stoppedAt == null ? this.to : Math.min(this.to, this.stoppedAt), i = Math.min(
      e,
      this.chunkStart + 512
      /* C.ChunkSize */
    );
    for (t && (i = Math.min(i, t.viewport.to)); this.parsedPos < i; )
      this.parseLine(t);
    return this.chunkStart < this.parsedPos && this.finishChunk(), this.parsedPos >= e ? this.finish() : t && this.parsedPos >= t.viewport.to ? (t.skipUntilInView(this.parsedPos, e), this.finish()) : null;
  }
  stopAt(t) {
    this.stoppedAt = t;
  }
  lineAfter(t) {
    let e = this.input.chunk(t);
    if (this.input.lineChunks)
      e == `
` && (e = "");
    else {
      let i = e.indexOf(`
`);
      i > -1 && (e = e.slice(0, i));
    }
    return t + e.length <= this.to ? e : e.slice(0, this.to - t);
  }
  nextLine() {
    let t = this.parsedPos, e = this.lineAfter(t), i = t + e.length;
    for (let s = this.rangeIndex; ; ) {
      let r = this.ranges[s].to;
      if (r >= i || (e = e.slice(0, r - (i - e.length)), s++, s == this.ranges.length))
        break;
      let o = this.ranges[s].from, l = this.lineAfter(o);
      e += l, i = o + l.length;
    }
    return { line: e, end: i };
  }
  skipGapsTo(t, e, i) {
    for (; ; ) {
      let s = this.ranges[this.rangeIndex].to, r = t + e;
      if (i > 0 ? s > r : s >= r)
        break;
      let o = this.ranges[++this.rangeIndex].from;
      e += o - s;
    }
    return e;
  }
  moveRangeIndex() {
    for (; this.ranges[this.rangeIndex].to < this.parsedPos; )
      this.rangeIndex++;
  }
  emitToken(t, e, i, s) {
    let r = 4;
    if (this.ranges.length > 1) {
      s = this.skipGapsTo(e, s, 1), e += s;
      let l = this.chunk.length;
      s = this.skipGapsTo(i, s, -1), i += s, r += this.chunk.length - l;
    }
    let o = this.chunk.length - 4;
    return this.lang.streamParser.mergeTokens && r == 4 && o >= 0 && this.chunk[o] == t && this.chunk[o + 2] == e ? this.chunk[o + 2] = i : this.chunk.push(t, e, i, r), s;
  }
  parseLine(t) {
    let { line: e, end: i } = this.nextLine(), s = 0, { streamParser: r } = this.lang, o = new kh(e, t ? t.state.tabSize : 4, t ? Ne(t.state) : 2);
    if (o.eol())
      r.blankLine(this.state, o.indentUnit);
    else
      for (; !o.eol(); ) {
        let l = Ah(r.token, o, this.state);
        if (l && (s = this.emitToken(this.lang.tokenTable.resolve(l), this.parsedPos + o.start, this.parsedPos + o.pos, s)), o.start > 1e4)
          break;
      }
    this.parsedPos = i, this.moveRangeIndex(), this.parsedPos < this.to && this.parsedPos++;
  }
  finishChunk() {
    let t = q.build({
      buffer: this.chunk,
      start: this.chunkStart,
      length: this.parsedPos - this.chunkStart,
      nodeSet: bp,
      topID: 0,
      maxBufferLength: 512,
      reused: this.chunkReused
    });
    t = new q(t.type, t.children, t.positions, t.length, [[this.lang.stateAfter, this.lang.streamParser.copyState(this.state)]]), this.chunks.push(t), this.chunkPos.push(this.chunkStart - this.ranges[0].from), this.chunk = [], this.chunkReused = void 0, this.chunkStart = this.parsedPos;
  }
  finish() {
    return new q(this.lang.topNode, this.chunks, this.chunkPos, this.parsedPos - this.ranges[0].from).balance();
  }
}
function Ah(n, t, e) {
  t.start = t.pos;
  for (let i = 0; i < 10; i++) {
    let s = n(t, e);
    if (t.pos > t.start)
      return s;
  }
  throw new Error("Stream parser failed to advance stream.");
}
const Gr = /* @__PURE__ */ Object.create(null), Ni = [yt.none], bp = /* @__PURE__ */ new Fr(Ni), yl = [], wl = /* @__PURE__ */ Object.create(null), Ch = /* @__PURE__ */ Object.create(null);
for (let [n, t] of [
  ["variable", "variableName"],
  ["variable-2", "variableName.special"],
  ["string-2", "string.special"],
  ["def", "variableName.definition"],
  ["tag", "tagName"],
  ["attribute", "attributeName"],
  ["type", "typeName"],
  ["builtin", "variableName.standard"],
  ["qualifier", "modifier"],
  ["error", "invalid"],
  ["header", "heading"],
  ["property", "propertyName"]
])
  Ch[n] = /* @__PURE__ */ Th(Gr, t);
class Mh {
  constructor(t) {
    this.extra = t, this.table = Object.assign(/* @__PURE__ */ Object.create(null), Ch);
  }
  resolve(t) {
    return t ? this.table[t] || (this.table[t] = Th(this.extra, t)) : 0;
  }
}
const yp = /* @__PURE__ */ new Mh(Gr);
function Os(n, t) {
  yl.indexOf(n) > -1 || (yl.push(n), console.warn(t));
}
function Th(n, t) {
  let e = [];
  for (let l of t.split(" ")) {
    let a = [];
    for (let h of l.split(".")) {
      let c = n[h] || D[h];
      c ? typeof c == "function" ? a.length ? a = a.map(c) : Os(h, `Modifier ${h} used at start of tag`) : a.length ? Os(h, `Tag ${h} used as modifier`) : a = Array.isArray(c) ? c : [c] : Os(h, `Unknown highlighting tag ${h}`);
    }
    for (let h of a)
      e.push(h);
  }
  if (!e.length)
    return 0;
  let i = t.replace(/ /g, "_"), s = i + " " + e.map((l) => l.id), r = wl[s];
  if (r)
    return r.id;
  let o = wl[s] = yt.define({
    id: Ni.length,
    name: i,
    props: [Wd({ [i]: e })]
  });
  return Ni.push(o), o.id;
}
function wp(n, t) {
  let e = yt.define({ id: Ni.length, name: "Document", props: [
    ze.add(() => n),
    vh.add(() => (i) => t.getIndent(i))
  ], top: !0 });
  return Ni.push(e), e;
}
j.RTL, j.LTR;
const vp = (n) => {
  let { state: t } = n, e = t.doc.lineAt(t.selection.main.from), i = Yr(n.state, e.from);
  return i.line ? xp(n) : i.block ? Sp(n) : !1;
};
function Jr(n, t) {
  return ({ state: e, dispatch: i }) => {
    if (e.readOnly)
      return !1;
    let s = n(t, e);
    return s ? (i(e.update(s)), !0) : !1;
  };
}
const xp = /* @__PURE__ */ Jr(
  Mp,
  0
  /* CommentOption.Toggle */
), kp = /* @__PURE__ */ Jr(
  Oh,
  0
  /* CommentOption.Toggle */
), Sp = /* @__PURE__ */ Jr(
  (n, t) => Oh(n, t, Cp(t)),
  0
  /* CommentOption.Toggle */
);
function Yr(n, t) {
  let e = n.languageDataAt("commentTokens", t, 1);
  return e.length ? e[0] : {};
}
const di = 50;
function Ap(n, { open: t, close: e }, i, s) {
  let r = n.sliceDoc(i - di, i), o = n.sliceDoc(s, s + di), l = /\s*$/.exec(r)[0].length, a = /^\s*/.exec(o)[0].length, h = r.length - l;
  if (r.slice(h - t.length, h) == t && o.slice(a, a + e.length) == e)
    return {
      open: { pos: i - l, margin: l && 1 },
      close: { pos: s + a, margin: a && 1 }
    };
  let c, f;
  s - i <= 2 * di ? c = f = n.sliceDoc(i, s) : (c = n.sliceDoc(i, i + di), f = n.sliceDoc(s - di, s));
  let u = /^\s*/.exec(c)[0].length, d = /\s*$/.exec(f)[0].length, p = f.length - d - e.length;
  return c.slice(u, u + t.length) == t && f.slice(p, p + e.length) == e ? {
    open: {
      pos: i + u + t.length,
      margin: /\s/.test(c.charAt(u + t.length)) ? 1 : 0
    },
    close: {
      pos: s - d - e.length,
      margin: /\s/.test(f.charAt(p - 1)) ? 1 : 0
    }
  } : null;
}
function Cp(n) {
  let t = [];
  for (let e of n.selection.ranges) {
    let i = n.doc.lineAt(e.from), s = e.to <= i.to ? i : n.doc.lineAt(e.to);
    s.from > i.from && s.from == e.to && (s = e.to == i.to + 1 ? i : n.doc.lineAt(e.to - 1));
    let r = t.length - 1;
    r >= 0 && t[r].to > i.from ? t[r].to = s.to : t.push({ from: i.from + /^\s*/.exec(i.text)[0].length, to: s.to });
  }
  return t;
}
function Oh(n, t, e = t.selection.ranges) {
  let i = e.map((r) => Yr(t, r.from).block);
  if (!i.every((r) => r))
    return null;
  let s = e.map((r, o) => Ap(t, i[o], r.from, r.to));
  if (n != 2 && !s.every((r) => r))
    return { changes: t.changes(e.map((r, o) => s[o] ? [] : [{ from: r.from, insert: i[o].open + " " }, { from: r.to, insert: " " + i[o].close }])) };
  if (n != 1 && s.some((r) => r)) {
    let r = [];
    for (let o = 0, l; o < s.length; o++)
      if (l = s[o]) {
        let a = i[o], { open: h, close: c } = l;
        r.push({ from: h.pos - a.open.length, to: h.pos + h.margin }, { from: c.pos - c.margin, to: c.pos + a.close.length });
      }
    return { changes: r };
  }
  return null;
}
function Mp(n, t, e = t.selection.ranges) {
  let i = [], s = -1;
  t: for (let { from: r, to: o } of e) {
    let l = i.length, a = 1e9, h;
    for (let c = r; c <= o; ) {
      let f = t.doc.lineAt(c);
      if (h == null && (h = Yr(t, f.from).line, !h))
        continue t;
      if (f.from > s && (r == o || o > f.from)) {
        s = f.from;
        let u = /^\s*/.exec(f.text)[0].length, d = u == f.length, p = f.text.slice(u, u + h.length) == h ? u : -1;
        u < f.text.length && u < a && (a = u), i.push({ line: f, comment: p, token: h, indent: u, empty: d, single: !1 });
      }
      c = f.to + 1;
    }
    if (a < 1e9)
      for (let c = l; c < i.length; c++)
        i[c].indent < i[c].line.text.length && (i[c].indent = a);
    i.length == l + 1 && (i[l].single = !0);
  }
  if (n != 2 && i.some((r) => r.comment < 0 && (!r.empty || r.single))) {
    let r = [];
    for (let { line: l, token: a, indent: h, empty: c, single: f } of i)
      (f || !c) && r.push({ from: l.from + h, insert: a + " " });
    let o = t.changes(r);
    return { changes: o, selection: t.selection.map(o, 1) };
  } else if (n != 1 && i.some((r) => r.comment >= 0)) {
    let r = [];
    for (let { line: o, comment: l, token: a } of i)
      if (l >= 0) {
        let h = o.from + l, c = h + a.length;
        o.text[c - o.from] == " " && c++, r.push({ from: h, to: c });
      }
    return { changes: r };
  }
  return null;
}
const yr = /* @__PURE__ */ me.define(), Tp = /* @__PURE__ */ me.define(), Op = /* @__PURE__ */ M.define(), Eh = /* @__PURE__ */ M.define({
  combine(n) {
    return _i(n, {
      minDepth: 100,
      newGroupDelay: 500,
      joinToEvent: (t, e) => e
    }, {
      minDepth: Math.max,
      newGroupDelay: Math.min,
      joinToEvent: (t, e) => (i, s) => t(i, s) || e(i, s)
    });
  }
}), Dh = /* @__PURE__ */ St.define({
  create() {
    return Yt.empty;
  },
  update(n, t) {
    let e = t.state.facet(Eh), i = t.annotation(yr);
    if (i) {
      let a = mt.fromTransaction(t, i.selection), h = i.side, c = h == 0 ? n.undone : n.done;
      return a ? c = Vn(c, c.length, e.minDepth, a) : c = Bh(c, t.startState.selection), new Yt(h == 0 ? i.rest : c, h == 0 ? c : i.rest);
    }
    let s = t.annotation(Tp);
    if ((s == "full" || s == "before") && (n = n.isolate()), t.annotation(tt.addToHistory) === !1)
      return t.changes.empty ? n : n.addMapping(t.changes.desc);
    let r = mt.fromTransaction(t), o = t.annotation(tt.time), l = t.annotation(tt.userEvent);
    return r ? n = n.addChanges(r, o, l, e, t) : t.selection && (n = n.addSelection(t.startState.selection, o, l, e.newGroupDelay)), (s == "full" || s == "after") && (n = n.isolate()), n;
  },
  toJSON(n) {
    return { done: n.done.map((t) => t.toJSON()), undone: n.undone.map((t) => t.toJSON()) };
  },
  fromJSON(n) {
    return new Yt(n.done.map(mt.fromJSON), n.undone.map(mt.fromJSON));
  }
});
function Ep(n = {}) {
  return [
    Dh,
    Eh.of(n),
    T.domEventHandlers({
      beforeinput(t, e) {
        let i = t.inputType == "historyUndo" ? Rh : t.inputType == "historyRedo" ? wr : null;
        return i ? (t.preventDefault(), i(e)) : !1;
      }
    })
  ];
}
function Zn(n, t) {
  return function({ state: e, dispatch: i }) {
    if (!t && e.readOnly)
      return !1;
    let s = e.field(Dh, !1);
    if (!s)
      return !1;
    let r = s.pop(n, e, t);
    return r ? (i(r), !0) : !1;
  };
}
const Rh = /* @__PURE__ */ Zn(0, !1), wr = /* @__PURE__ */ Zn(1, !1), Dp = /* @__PURE__ */ Zn(0, !0), Rp = /* @__PURE__ */ Zn(1, !0);
class mt {
  constructor(t, e, i, s, r) {
    this.changes = t, this.effects = e, this.mapped = i, this.startSelection = s, this.selectionsAfter = r;
  }
  setSelAfter(t) {
    return new mt(this.changes, this.effects, this.mapped, this.startSelection, t);
  }
  toJSON() {
    var t, e, i;
    return {
      changes: (t = this.changes) === null || t === void 0 ? void 0 : t.toJSON(),
      mapped: (e = this.mapped) === null || e === void 0 ? void 0 : e.toJSON(),
      startSelection: (i = this.startSelection) === null || i === void 0 ? void 0 : i.toJSON(),
      selectionsAfter: this.selectionsAfter.map((s) => s.toJSON())
    };
  }
  static fromJSON(t) {
    return new mt(t.changes && Q.fromJSON(t.changes), [], t.mapped && Xt.fromJSON(t.mapped), t.startSelection && y.fromJSON(t.startSelection), t.selectionsAfter.map(y.fromJSON));
  }
  // This does not check `addToHistory` and such, it assumes the
  // transaction needs to be converted to an item. Returns null when
  // there are no changes or effects in the transaction.
  static fromTransaction(t, e) {
    let i = Ot;
    for (let s of t.startState.facet(Op)) {
      let r = s(t);
      r.length && (i = i.concat(r));
    }
    return !i.length && t.changes.empty ? null : new mt(t.changes.invert(t.startState.doc), i, void 0, e || t.startState.selection, Ot);
  }
  static selection(t) {
    return new mt(void 0, Ot, void 0, void 0, t);
  }
}
function Vn(n, t, e, i) {
  let s = t + 1 > e + 20 ? t - e - 1 : 0, r = n.slice(s, t);
  return r.push(i), r;
}
function Lp(n, t) {
  let e = [], i = !1;
  return n.iterChangedRanges((s, r) => e.push(s, r)), t.iterChangedRanges((s, r, o, l) => {
    for (let a = 0; a < e.length; ) {
      let h = e[a++], c = e[a++];
      l >= h && o <= c && (i = !0);
    }
  }), i;
}
function Bp(n, t) {
  return n.ranges.length == t.ranges.length && n.ranges.filter((e, i) => e.empty != t.ranges[i].empty).length === 0;
}
function Lh(n, t) {
  return n.length ? t.length ? n.concat(t) : n : t;
}
const Ot = [], Pp = 200;
function Bh(n, t) {
  if (n.length) {
    let e = n[n.length - 1], i = e.selectionsAfter.slice(Math.max(0, e.selectionsAfter.length - Pp));
    return i.length && i[i.length - 1].eq(t) ? n : (i.push(t), Vn(n, n.length - 1, 1e9, e.setSelAfter(i)));
  } else
    return [mt.selection([t])];
}
function Ip(n) {
  let t = n[n.length - 1], e = n.slice();
  return e[n.length - 1] = t.setSelAfter(t.selectionsAfter.slice(0, t.selectionsAfter.length - 1)), e;
}
function Es(n, t) {
  if (!n.length)
    return n;
  let e = n.length, i = Ot;
  for (; e; ) {
    let s = Np(n[e - 1], t, i);
    if (s.changes && !s.changes.empty || s.effects.length) {
      let r = n.slice(0, e);
      return r[e - 1] = s, r;
    } else
      t = s.mapped, e--, i = s.selectionsAfter;
  }
  return i.length ? [mt.selection(i)] : Ot;
}
function Np(n, t, e) {
  let i = Lh(n.selectionsAfter.length ? n.selectionsAfter.map((l) => l.map(t)) : Ot, e);
  if (!n.changes)
    return mt.selection(i);
  let s = n.changes.map(t), r = t.mapDesc(n.changes, !0), o = n.mapped ? n.mapped.composeDesc(r) : r;
  return new mt(s, F.mapEffects(n.effects, t), o, n.startSelection.map(r), i);
}
const $p = /^(input\.type|delete)($|\.)/;
class Yt {
  constructor(t, e, i = 0, s = void 0) {
    this.done = t, this.undone = e, this.prevTime = i, this.prevUserEvent = s;
  }
  isolate() {
    return this.prevTime ? new Yt(this.done, this.undone) : this;
  }
  addChanges(t, e, i, s, r) {
    let o = this.done, l = o[o.length - 1];
    return l && l.changes && !l.changes.empty && t.changes && (!i || $p.test(i)) && (!l.selectionsAfter.length && e - this.prevTime < s.newGroupDelay && s.joinToEvent(r, Lp(l.changes, t.changes)) || // For compose (but not compose.start) events, always join with previous event
    i == "input.type.compose") ? o = Vn(o, o.length - 1, s.minDepth, new mt(t.changes.compose(l.changes), Lh(F.mapEffects(t.effects, l.changes), l.effects), l.mapped, l.startSelection, Ot)) : o = Vn(o, o.length, s.minDepth, t), new Yt(o, Ot, e, i);
  }
  addSelection(t, e, i, s) {
    let r = this.done.length ? this.done[this.done.length - 1].selectionsAfter : Ot;
    return r.length > 0 && e - this.prevTime < s && i == this.prevUserEvent && i && /^select($|\.)/.test(i) && Bp(r[r.length - 1], t) ? this : new Yt(Bh(this.done, t), this.undone, e, i);
  }
  addMapping(t) {
    return new Yt(Es(this.done, t), Es(this.undone, t), this.prevTime, this.prevUserEvent);
  }
  pop(t, e, i) {
    let s = t == 0 ? this.done : this.undone;
    if (s.length == 0)
      return null;
    let r = s[s.length - 1], o = r.selectionsAfter[0] || (r.startSelection ? r.startSelection.map(r.changes.invertedDesc, 1) : e.selection);
    if (i && r.selectionsAfter.length)
      return e.update({
        selection: r.selectionsAfter[r.selectionsAfter.length - 1],
        annotations: yr.of({ side: t, rest: Ip(s), selection: o }),
        userEvent: t == 0 ? "select.undo" : "select.redo",
        scrollIntoView: !0
      });
    if (r.changes) {
      let l = s.length == 1 ? Ot : s.slice(0, s.length - 1);
      return r.mapped && (l = Es(l, r.mapped)), e.update({
        changes: r.changes,
        selection: r.startSelection,
        effects: r.effects,
        annotations: yr.of({ side: t, rest: l, selection: o }),
        filter: !1,
        userEvent: t == 0 ? "undo" : "redo",
        scrollIntoView: !0
      });
    } else
      return null;
  }
}
Yt.empty = /* @__PURE__ */ new Yt(Ot, Ot);
const Hp = [
  { key: "Mod-z", run: Rh, preventDefault: !0 },
  { key: "Mod-y", mac: "Mod-Shift-z", run: wr, preventDefault: !0 },
  { linux: "Ctrl-Shift-z", run: wr, preventDefault: !0 },
  { key: "Mod-u", run: Dp, preventDefault: !0 },
  { key: "Alt-u", mac: "Mod-Shift-u", run: Rp, preventDefault: !0 }
];
function ai(n, t) {
  return y.create(n.ranges.map(t), n.mainIndex);
}
function $t(n, t) {
  return n.update({ selection: t, scrollIntoView: !0, userEvent: "select" });
}
function Ht({ state: n, dispatch: t }, e) {
  let i = ai(n.selection, e);
  return i.eq(n.selection, !0) ? !1 : (t($t(n, i)), !0);
}
function Qn(n, t) {
  return y.cursor(t ? n.to : n.from);
}
function Ph(n, t) {
  return Ht(n, (e) => e.empty ? n.moveByChar(e, t) : Qn(e, t));
}
function ht(n) {
  return n.textDirectionAt(n.state.selection.main.head) == j.LTR;
}
const Ih = (n) => Ph(n, !ht(n)), Nh = (n) => Ph(n, ht(n));
function $h(n, t) {
  return Ht(n, (e) => e.empty ? n.moveByGroup(e, t) : Qn(e, t));
}
const Vp = (n) => $h(n, !ht(n)), Fp = (n) => $h(n, ht(n));
function Wp(n, t, e) {
  if (t.type.prop(e))
    return !0;
  let i = t.to - t.from;
  return i && (i > 2 || /[^\s,.;:]/.test(n.sliceDoc(t.from, t.to))) || t.firstChild;
}
function ts(n, t, e) {
  let i = Zt(n).resolveInner(t.head), s = e ? I.closedBy : I.openedBy;
  for (let a = t.head; ; ) {
    let h = e ? i.childAfter(a) : i.childBefore(a);
    if (!h)
      break;
    Wp(n, h, s) ? i = h : a = e ? h.to : h.from;
  }
  let r = i.type.prop(s), o, l;
  return r && (o = e ? Ue(n, i.from, 1) : Ue(n, i.to, -1)) && o.matched ? l = e ? o.end.to : o.end.from : l = e ? i.to : i.from, y.cursor(l, e ? -1 : 1);
}
const _p = (n) => Ht(n, (t) => ts(n.state, t, !ht(n))), zp = (n) => Ht(n, (t) => ts(n.state, t, ht(n)));
function Hh(n, t) {
  return Ht(n, (e) => {
    if (!e.empty)
      return Qn(e, t);
    let i = n.moveVertically(e, t);
    return i.head != e.head ? i : n.moveToLineBoundary(e, t);
  });
}
const Vh = (n) => Hh(n, !1), Fh = (n) => Hh(n, !0);
function Wh(n) {
  let t = n.scrollDOM.clientHeight < n.scrollDOM.scrollHeight - 2, e = 0, i = 0, s;
  if (t) {
    for (let r of n.state.facet(T.scrollMargins)) {
      let o = r(n);
      o?.top && (e = Math.max(o?.top, e)), o?.bottom && (i = Math.max(o?.bottom, i));
    }
    s = n.scrollDOM.clientHeight - e - i;
  } else
    s = (n.dom.ownerDocument.defaultView || window).innerHeight;
  return {
    marginTop: e,
    marginBottom: i,
    selfScroll: t,
    height: Math.max(n.defaultLineHeight, s - 5)
  };
}
function _h(n, t) {
  let e = Wh(n), { state: i } = n, s = ai(i.selection, (o) => o.empty ? n.moveVertically(o, t, e.height) : Qn(o, t));
  if (s.eq(i.selection))
    return !1;
  let r;
  if (e.selfScroll) {
    let o = n.coordsAtPos(i.selection.main.head), l = n.scrollDOM.getBoundingClientRect(), a = l.top + e.marginTop, h = l.bottom - e.marginBottom;
    o && o.top > a && o.bottom < h && (r = T.scrollIntoView(s.main.head, { y: "start", yMargin: o.top - a }));
  }
  return n.dispatch($t(i, s), { effects: r }), !0;
}
const vl = (n) => _h(n, !1), vr = (n) => _h(n, !0);
function be(n, t, e) {
  let i = n.lineBlockAt(t.head), s = n.moveToLineBoundary(t, e);
  if (s.head == t.head && s.head != (e ? i.to : i.from) && (s = n.moveToLineBoundary(t, e, !1)), !e && s.head == i.from && i.length) {
    let r = /^\s*/.exec(n.state.sliceDoc(i.from, Math.min(i.from + 100, i.to)))[0].length;
    r && t.head != i.from + r && (s = y.cursor(i.from + r));
  }
  return s;
}
const Up = (n) => Ht(n, (t) => be(n, t, !0)), jp = (n) => Ht(n, (t) => be(n, t, !1)), qp = (n) => Ht(n, (t) => be(n, t, !ht(n))), Kp = (n) => Ht(n, (t) => be(n, t, ht(n))), Gp = (n) => Ht(n, (t) => y.cursor(n.lineBlockAt(t.head).from, 1)), Jp = (n) => Ht(n, (t) => y.cursor(n.lineBlockAt(t.head).to, -1));
function Yp(n, t, e) {
  let i = !1, s = ai(n.selection, (r) => {
    let o = Ue(n, r.head, -1) || Ue(n, r.head, 1) || r.head > 0 && Ue(n, r.head - 1, 1) || r.head < n.doc.length && Ue(n, r.head + 1, -1);
    if (!o || !o.end)
      return r;
    i = !0;
    let l = o.start.from == r.head ? o.end.to : o.end.from;
    return y.cursor(l);
  });
  return i ? (t($t(n, s)), !0) : !1;
}
const Xp = ({ state: n, dispatch: t }) => Yp(n, t);
function Dt(n, t) {
  let e = ai(n.state.selection, (i) => {
    let s = t(i);
    return y.range(i.anchor, s.head, s.goalColumn, s.bidiLevel || void 0, s.assoc);
  });
  return e.eq(n.state.selection) ? !1 : (n.dispatch($t(n.state, e)), !0);
}
function zh(n, t) {
  return Dt(n, (e) => n.moveByChar(e, t));
}
const Uh = (n) => zh(n, !ht(n)), jh = (n) => zh(n, ht(n));
function qh(n, t) {
  return Dt(n, (e) => n.moveByGroup(e, t));
}
const Zp = (n) => qh(n, !ht(n)), Qp = (n) => qh(n, ht(n)), tg = (n) => Dt(n, (t) => ts(n.state, t, !ht(n))), eg = (n) => Dt(n, (t) => ts(n.state, t, ht(n)));
function Kh(n, t) {
  return Dt(n, (e) => n.moveVertically(e, t));
}
const Gh = (n) => Kh(n, !1), Jh = (n) => Kh(n, !0);
function Yh(n, t) {
  return Dt(n, (e) => n.moveVertically(e, t, Wh(n).height));
}
const xl = (n) => Yh(n, !1), kl = (n) => Yh(n, !0), ig = (n) => Dt(n, (t) => be(n, t, !0)), ng = (n) => Dt(n, (t) => be(n, t, !1)), sg = (n) => Dt(n, (t) => be(n, t, !ht(n))), rg = (n) => Dt(n, (t) => be(n, t, ht(n))), og = (n) => Dt(n, (t) => y.cursor(n.lineBlockAt(t.head).from)), lg = (n) => Dt(n, (t) => y.cursor(n.lineBlockAt(t.head).to)), Sl = ({ state: n, dispatch: t }) => (t($t(n, { anchor: 0 })), !0), Al = ({ state: n, dispatch: t }) => (t($t(n, { anchor: n.doc.length })), !0), Cl = ({ state: n, dispatch: t }) => (t($t(n, { anchor: n.selection.main.anchor, head: 0 })), !0), Ml = ({ state: n, dispatch: t }) => (t($t(n, { anchor: n.selection.main.anchor, head: n.doc.length })), !0), ag = ({ state: n, dispatch: t }) => (t(n.update({ selection: { anchor: 0, head: n.doc.length }, userEvent: "select" })), !0), hg = ({ state: n, dispatch: t }) => {
  let e = es(n).map(({ from: i, to: s }) => y.range(i, Math.min(s + 1, n.doc.length)));
  return t(n.update({ selection: y.create(e), userEvent: "select" })), !0;
}, cg = ({ state: n, dispatch: t }) => {
  let e = ai(n.selection, (i) => {
    let s = Zt(n), r = s.resolveStack(i.from, 1);
    if (i.empty) {
      let o = s.resolveStack(i.from, -1);
      o.node.from >= r.node.from && o.node.to <= r.node.to && (r = o);
    }
    for (let o = r; o; o = o.next) {
      let { node: l } = o;
      if ((l.from < i.from && l.to >= i.to || l.to > i.to && l.from <= i.from) && o.next)
        return y.range(l.to, l.from);
    }
    return i;
  });
  return e.eq(n.selection) ? !1 : (t($t(n, e)), !0);
};
function Xh(n, t) {
  let { state: e } = n, i = e.selection, s = e.selection.ranges.slice();
  for (let r of e.selection.ranges) {
    let o = e.doc.lineAt(r.head);
    if (t ? o.to < n.state.doc.length : o.from > 0)
      for (let l = r; ; ) {
        let a = n.moveVertically(l, t);
        if (a.head < o.from || a.head > o.to) {
          s.some((h) => h.head == a.head) || s.push(a);
          break;
        } else {
          if (a.head == l.head)
            break;
          l = a;
        }
      }
  }
  return s.length == i.ranges.length ? !1 : (n.dispatch($t(e, y.create(s, s.length - 1))), !0);
}
const fg = (n) => Xh(n, !1), ug = (n) => Xh(n, !0), dg = ({ state: n, dispatch: t }) => {
  let e = n.selection, i = null;
  return e.ranges.length > 1 ? i = y.create([e.main]) : e.main.empty || (i = y.create([y.cursor(e.main.head)])), i ? (t($t(n, i)), !0) : !1;
};
function Ki(n, t) {
  if (n.state.readOnly)
    return !1;
  let e = "delete.selection", { state: i } = n, s = i.changeByRange((r) => {
    let { from: o, to: l } = r;
    if (o == l) {
      let a = t(r);
      a < o ? (e = "delete.backward", a = gn(n, a, !1)) : a > o && (e = "delete.forward", a = gn(n, a, !0)), o = Math.min(o, a), l = Math.max(l, a);
    } else
      o = gn(n, o, !1), l = gn(n, l, !0);
    return o == l ? { range: r } : { changes: { from: o, to: l }, range: y.cursor(o, o < r.head ? -1 : 1) };
  });
  return s.changes.empty ? !1 : (n.dispatch(i.update(s, {
    scrollIntoView: !0,
    userEvent: e,
    effects: e == "delete.selection" ? T.announce.of(i.phrase("Selection deleted")) : void 0
  })), !0);
}
function gn(n, t, e) {
  if (n instanceof T)
    for (let i of n.state.facet(T.atomicRanges).map((s) => s(n)))
      i.between(t, t, (s, r) => {
        s < t && r > t && (t = e ? r : s);
      });
  return t;
}
const Zh = (n, t, e) => Ki(n, (i) => {
  let s = i.from, { state: r } = n, o = r.doc.lineAt(s), l, a;
  if (e && !t && s > o.from && s < o.from + 200 && !/[^ \t]/.test(l = o.text.slice(0, s - o.from))) {
    if (l[l.length - 1] == "	")
      return s - 1;
    let h = zn(l, r.tabSize), c = h % Ne(r) || Ne(r);
    for (let f = 0; f < c && l[l.length - 1 - f] == " "; f++)
      s--;
    a = s;
  } else
    a = at(o.text, s - o.from, t, t) + o.from, a == s && o.number != (t ? r.doc.lines : 1) ? a += t ? 1 : -1 : !t && /[\ufe00-\ufe0f]/.test(o.text.slice(a - o.from, s - o.from)) && (a = at(o.text, a - o.from, !1, !1) + o.from);
  return a;
}), xr = (n) => Zh(n, !1, !0), Qh = (n) => Zh(n, !0, !1), tc = (n, t) => Ki(n, (e) => {
  let i = e.head, { state: s } = n, r = s.doc.lineAt(i), o = s.charCategorizer(i);
  for (let l = null; ; ) {
    if (i == (t ? r.to : r.from)) {
      i == e.head && r.number != (t ? s.doc.lines : 1) && (i += t ? 1 : -1);
      break;
    }
    let a = at(r.text, i - r.from, t) + r.from, h = r.text.slice(Math.min(i, a) - r.from, Math.max(i, a) - r.from), c = o(h);
    if (l != null && c != l)
      break;
    (h != " " || i != e.head) && (l = c), i = a;
  }
  return i;
}), ec = (n) => tc(n, !1), pg = (n) => tc(n, !0), gg = (n) => Ki(n, (t) => {
  let e = n.lineBlockAt(t.head).to;
  return t.head < e ? e : Math.min(n.state.doc.length, t.head + 1);
}), mg = (n) => Ki(n, (t) => {
  let e = n.moveToLineBoundary(t, !1).head;
  return t.head > e ? e : Math.max(0, t.head - 1);
}), bg = (n) => Ki(n, (t) => {
  let e = n.moveToLineBoundary(t, !0).head;
  return t.head < e ? e : Math.min(n.state.doc.length, t.head + 1);
}), yg = ({ state: n, dispatch: t }) => {
  if (n.readOnly)
    return !1;
  let e = n.changeByRange((i) => ({
    changes: { from: i.from, to: i.to, insert: N.of(["", ""]) },
    range: y.cursor(i.from)
  }));
  return t(n.update(e, { scrollIntoView: !0, userEvent: "input" })), !0;
}, wg = ({ state: n, dispatch: t }) => {
  if (n.readOnly)
    return !1;
  let e = n.changeByRange((i) => {
    if (!i.empty || i.from == 0 || i.from == n.doc.length)
      return { range: i };
    let s = i.from, r = n.doc.lineAt(s), o = s == r.from ? s - 1 : at(r.text, s - r.from, !1) + r.from, l = s == r.to ? s + 1 : at(r.text, s - r.from, !0) + r.from;
    return {
      changes: { from: o, to: l, insert: n.doc.slice(s, l).append(n.doc.slice(o, s)) },
      range: y.cursor(l)
    };
  });
  return e.changes.empty ? !1 : (t(n.update(e, { scrollIntoView: !0, userEvent: "move.character" })), !0);
};
function es(n) {
  let t = [], e = -1;
  for (let i of n.selection.ranges) {
    let s = n.doc.lineAt(i.from), r = n.doc.lineAt(i.to);
    if (!i.empty && i.to == r.from && (r = n.doc.lineAt(i.to - 1)), e >= s.number) {
      let o = t[t.length - 1];
      o.to = r.to, o.ranges.push(i);
    } else
      t.push({ from: s.from, to: r.to, ranges: [i] });
    e = r.number + 1;
  }
  return t;
}
function ic(n, t, e) {
  if (n.readOnly)
    return !1;
  let i = [], s = [];
  for (let r of es(n)) {
    if (e ? r.to == n.doc.length : r.from == 0)
      continue;
    let o = n.doc.lineAt(e ? r.to + 1 : r.from - 1), l = o.length + 1;
    if (e) {
      i.push({ from: r.to, to: o.to }, { from: r.from, insert: o.text + n.lineBreak });
      for (let a of r.ranges)
        s.push(y.range(Math.min(n.doc.length, a.anchor + l), Math.min(n.doc.length, a.head + l)));
    } else {
      i.push({ from: o.from, to: r.from }, { from: r.to, insert: n.lineBreak + o.text });
      for (let a of r.ranges)
        s.push(y.range(a.anchor - l, a.head - l));
    }
  }
  return i.length ? (t(n.update({
    changes: i,
    scrollIntoView: !0,
    selection: y.create(s, n.selection.mainIndex),
    userEvent: "move.line"
  })), !0) : !1;
}
const vg = ({ state: n, dispatch: t }) => ic(n, t, !1), xg = ({ state: n, dispatch: t }) => ic(n, t, !0);
function nc(n, t, e) {
  if (n.readOnly)
    return !1;
  let i = [];
  for (let r of es(n))
    e ? i.push({ from: r.from, insert: n.doc.slice(r.from, r.to) + n.lineBreak }) : i.push({ from: r.to, insert: n.lineBreak + n.doc.slice(r.from, r.to) });
  let s = n.changes(i);
  return t(n.update({
    changes: s,
    selection: n.selection.map(s, e ? 1 : -1),
    scrollIntoView: !0,
    userEvent: "input.copyline"
  })), !0;
}
const kg = ({ state: n, dispatch: t }) => nc(n, t, !1), Sg = ({ state: n, dispatch: t }) => nc(n, t, !0), Ag = (n) => {
  if (n.state.readOnly)
    return !1;
  let { state: t } = n, e = t.changes(es(t).map(({ from: s, to: r }) => (s > 0 ? s-- : r < t.doc.length && r++, { from: s, to: r }))), i = ai(t.selection, (s) => {
    let r;
    if (n.lineWrapping) {
      let o = n.lineBlockAt(s.head), l = n.coordsAtPos(s.head, s.assoc || 1);
      l && (r = o.bottom + n.documentTop - l.bottom + n.defaultLineHeight / 2);
    }
    return n.moveVertically(s, !0, r);
  }).map(e);
  return n.dispatch({ changes: e, selection: i, scrollIntoView: !0, userEvent: "delete.line" }), !0;
};
function Cg(n, t) {
  if (/\(\)|\[\]|\{\}/.test(n.sliceDoc(t - 1, t + 1)))
    return { from: t, to: t };
  let e = Zt(n).resolveInner(t), i = e.childBefore(t), s = e.childAfter(t), r;
  return i && s && i.to <= t && s.from >= t && (r = i.type.prop(I.closedBy)) && r.indexOf(s.name) > -1 && n.doc.lineAt(i.to).from == n.doc.lineAt(s.from).from && !/\S/.test(n.sliceDoc(i.to, s.from)) ? { from: i.to, to: s.from } : null;
}
const Tl = /* @__PURE__ */ sc(!1), Mg = /* @__PURE__ */ sc(!0);
function sc(n) {
  return ({ state: t, dispatch: e }) => {
    if (t.readOnly)
      return !1;
    let i = t.changeByRange((s) => {
      let { from: r, to: o } = s, l = t.doc.lineAt(r), a = !n && r == o && Cg(t, r);
      n && (r = o = (o <= l.to ? l : t.doc.lineAt(o)).to);
      let h = new Yn(t, { simulateBreak: r, simulateDoubleBreak: !!a }), c = wh(h, r);
      for (c == null && (c = zn(/^\s*/.exec(t.doc.lineAt(r).text)[0], t.tabSize)); o < l.to && /\s/.test(l.text[o - l.from]); )
        o++;
      a ? { from: r, to: o } = a : r > l.from && r < l.from + 100 && !/\S/.test(l.text.slice(0, r)) && (r = l.from);
      let f = ["", Hn(t, c)];
      return a && f.push(Hn(t, h.lineIndent(l.from, -1))), {
        changes: { from: r, to: o, insert: N.of(f) },
        range: y.cursor(r + 1 + f[1].length)
      };
    });
    return e(t.update(i, { scrollIntoView: !0, userEvent: "input" })), !0;
  };
}
function Xr(n, t) {
  let e = -1;
  return n.changeByRange((i) => {
    let s = [];
    for (let o = i.from; o <= i.to; ) {
      let l = n.doc.lineAt(o);
      l.number > e && (i.empty || i.to > l.from) && (t(l, s, i), e = l.number), o = l.to + 1;
    }
    let r = n.changes(s);
    return {
      changes: s,
      range: y.range(r.mapPos(i.anchor, 1), r.mapPos(i.head, 1))
    };
  });
}
const Tg = ({ state: n, dispatch: t }) => {
  if (n.readOnly)
    return !1;
  let e = /* @__PURE__ */ Object.create(null), i = new Yn(n, { overrideIndentation: (r) => {
    let o = e[r];
    return o ?? -1;
  } }), s = Xr(n, (r, o, l) => {
    let a = wh(i, r.from);
    if (a == null)
      return;
    /\S/.test(r.text) || (a = 0);
    let h = /^\s*/.exec(r.text)[0], c = Hn(n, a);
    (h != c || l.from < r.from + h.length) && (e[r.from] = a, o.push({ from: r.from, to: r.from + h.length, insert: c }));
  });
  return s.changes.empty || t(n.update(s, { userEvent: "indent" })), !0;
}, rc = ({ state: n, dispatch: t }) => n.readOnly ? !1 : (t(n.update(Xr(n, (e, i) => {
  i.push({ from: e.from, insert: n.facet(Ur) });
}), { userEvent: "input.indent" })), !0), oc = ({ state: n, dispatch: t }) => n.readOnly ? !1 : (t(n.update(Xr(n, (e, i) => {
  let s = /^\s*/.exec(e.text)[0];
  if (!s)
    return;
  let r = zn(s, n.tabSize), o = 0, l = Hn(n, Math.max(0, r - Ne(n)));
  for (; o < s.length && o < l.length && s.charCodeAt(o) == l.charCodeAt(o); )
    o++;
  i.push({ from: e.from + o, to: e.from + s.length, insert: l.slice(o) });
}), { userEvent: "delete.dedent" })), !0), Og = (n) => (n.setTabFocusMode(), !0), Eg = [
  { key: "Ctrl-b", run: Ih, shift: Uh, preventDefault: !0 },
  { key: "Ctrl-f", run: Nh, shift: jh },
  { key: "Ctrl-p", run: Vh, shift: Gh },
  { key: "Ctrl-n", run: Fh, shift: Jh },
  { key: "Ctrl-a", run: Gp, shift: og },
  { key: "Ctrl-e", run: Jp, shift: lg },
  { key: "Ctrl-d", run: Qh },
  { key: "Ctrl-h", run: xr },
  { key: "Ctrl-k", run: gg },
  { key: "Ctrl-Alt-h", run: ec },
  { key: "Ctrl-o", run: yg },
  { key: "Ctrl-t", run: wg },
  { key: "Ctrl-v", run: vr }
], Dg = /* @__PURE__ */ [
  { key: "ArrowLeft", run: Ih, shift: Uh, preventDefault: !0 },
  { key: "Mod-ArrowLeft", mac: "Alt-ArrowLeft", run: Vp, shift: Zp, preventDefault: !0 },
  { mac: "Cmd-ArrowLeft", run: qp, shift: sg, preventDefault: !0 },
  { key: "ArrowRight", run: Nh, shift: jh, preventDefault: !0 },
  { key: "Mod-ArrowRight", mac: "Alt-ArrowRight", run: Fp, shift: Qp, preventDefault: !0 },
  { mac: "Cmd-ArrowRight", run: Kp, shift: rg, preventDefault: !0 },
  { key: "ArrowUp", run: Vh, shift: Gh, preventDefault: !0 },
  { mac: "Cmd-ArrowUp", run: Sl, shift: Cl },
  { mac: "Ctrl-ArrowUp", run: vl, shift: xl },
  { key: "ArrowDown", run: Fh, shift: Jh, preventDefault: !0 },
  { mac: "Cmd-ArrowDown", run: Al, shift: Ml },
  { mac: "Ctrl-ArrowDown", run: vr, shift: kl },
  { key: "PageUp", run: vl, shift: xl },
  { key: "PageDown", run: vr, shift: kl },
  { key: "Home", run: jp, shift: ng, preventDefault: !0 },
  { key: "Mod-Home", run: Sl, shift: Cl },
  { key: "End", run: Up, shift: ig, preventDefault: !0 },
  { key: "Mod-End", run: Al, shift: Ml },
  { key: "Enter", run: Tl, shift: Tl },
  { key: "Mod-a", run: ag },
  { key: "Backspace", run: xr, shift: xr, preventDefault: !0 },
  { key: "Delete", run: Qh, preventDefault: !0 },
  { key: "Mod-Backspace", mac: "Alt-Backspace", run: ec, preventDefault: !0 },
  { key: "Mod-Delete", mac: "Alt-Delete", run: pg, preventDefault: !0 },
  { mac: "Mod-Backspace", run: mg, preventDefault: !0 },
  { mac: "Mod-Delete", run: bg, preventDefault: !0 }
].concat(/* @__PURE__ */ Eg.map((n) => ({ mac: n.key, run: n.run, shift: n.shift }))), Rg = /* @__PURE__ */ [
  { key: "Alt-ArrowLeft", mac: "Ctrl-ArrowLeft", run: _p, shift: tg },
  { key: "Alt-ArrowRight", mac: "Ctrl-ArrowRight", run: zp, shift: eg },
  { key: "Alt-ArrowUp", run: vg },
  { key: "Shift-Alt-ArrowUp", run: kg },
  { key: "Alt-ArrowDown", run: xg },
  { key: "Shift-Alt-ArrowDown", run: Sg },
  { key: "Mod-Alt-ArrowUp", run: fg },
  { key: "Mod-Alt-ArrowDown", run: ug },
  { key: "Escape", run: dg },
  { key: "Mod-Enter", run: Mg },
  { key: "Alt-l", mac: "Ctrl-l", run: hg },
  { key: "Mod-i", run: cg, preventDefault: !0 },
  { key: "Mod-[", run: oc },
  { key: "Mod-]", run: rc },
  { key: "Mod-Alt-\\", run: Tg },
  { key: "Shift-Mod-k", run: Ag },
  { key: "Shift-Mod-\\", run: Xp },
  { key: "Mod-/", run: vp },
  { key: "Alt-A", run: kp },
  { key: "Ctrl-m", mac: "Shift-Alt-m", run: Og }
].concat(Dg), Lg = { key: "Tab", run: rc, shift: oc };
class Ol {
  constructor(t, e, i) {
    this.from = t, this.to = e, this.diagnostic = i;
  }
}
class Ce {
  constructor(t, e, i) {
    this.diagnostics = t, this.panel = e, this.selected = i;
  }
  static init(t, e, i) {
    let s = i.facet($i).markerFilter;
    s && (t = s(t, i));
    let r = t.slice().sort((d, p) => d.from - p.from || d.to - p.to), o = new Xe(), l = [], a = 0, h = i.doc.iter(), c = 0, f = i.doc.length;
    for (let d = 0; ; ) {
      let p = d == r.length ? null : r[d];
      if (!p && !l.length)
        break;
      let g, m;
      if (l.length)
        g = a, m = l.reduce((w, O) => Math.min(w, O.to), p && p.from > g ? p.from : 1e8);
      else {
        if (g = p.from, g > f)
          break;
        m = p.to, l.push(p), d++;
      }
      for (; d < r.length; ) {
        let w = r[d];
        if (w.from == g && (w.to > w.from || w.to == g))
          l.push(w), d++, m = Math.min(w.to, m);
        else {
          m = Math.min(w.from, m);
          break;
        }
      }
      m = Math.min(m, f);
      let b = !1;
      if (l.some((w) => w.from == g && (w.to == m || m == f)) && (b = g == m, !b && m - g < 10)) {
        let w = g - (c + h.value.length);
        w > 0 && (h.next(w), c = g);
        for (let O = g; ; ) {
          if (O >= m) {
            b = !0;
            break;
          }
          if (!h.lineBreak && c + h.value.length > O)
            break;
          O = c + h.value.length, c += h.value.length, h.next();
        }
      }
      let v = dc(l);
      if (b)
        o.add(g, g, K.widget({
          widget: new Vg(v),
          diagnostics: l.slice()
        }));
      else {
        let w = l.reduce((O, k) => k.markClass ? O + " " + k.markClass : O, "");
        o.add(g, m, K.mark({
          class: "cm-lintRange cm-lintRange-" + v + w,
          diagnostics: l.slice(),
          inclusiveEnd: l.some((O) => O.to > m)
        }));
      }
      if (a = m, a == f)
        break;
      for (let w = 0; w < l.length; w++)
        l[w].to <= a && l.splice(w--, 1);
    }
    let u = o.finish();
    return new Ce(u, e, ge(u));
  }
}
function ge(n, t = null, e = 0) {
  let i = null;
  return n.between(e, 1e9, (s, r, { spec: o }) => {
    if (!(t && o.diagnostics.indexOf(t) < 0))
      if (!i)
        i = new Ol(s, r, t || o.diagnostics[0]);
      else {
        if (o.diagnostics.indexOf(i.diagnostic) < 0)
          return !1;
        i = new Ol(i.from, r, i.diagnostic);
      }
  }), i;
}
function lc(n, t) {
  let e = t.pos, i = t.end || e, s = n.state.facet($i).hideOn(n, e, i);
  if (s != null)
    return s;
  let r = n.startState.doc.lineAt(t.pos);
  return !!(n.effects.some((o) => o.is(is)) || n.changes.touchesRange(r.from, Math.max(r.to, i)));
}
function ac(n, t) {
  return n.field(xt, !1) ? t : t.concat(F.appendConfig.of(Kg));
}
function Bg(n, t) {
  return {
    effects: ac(n, [is.of(t)])
  };
}
const is = /* @__PURE__ */ F.define(), Zr = /* @__PURE__ */ F.define(), hc = /* @__PURE__ */ F.define(), xt = /* @__PURE__ */ St.define({
  create() {
    return new Ce(K.none, null, null);
  },
  update(n, t) {
    if (t.docChanged && n.diagnostics.size) {
      let e = n.diagnostics.map(t.changes), i = null, s = n.panel;
      if (n.selected) {
        let r = t.changes.mapPos(n.selected.from, 1);
        i = ge(e, n.selected.diagnostic, r) || ge(e, null, r);
      }
      !e.size && s && t.state.facet($i).autoPanel && (s = null), n = new Ce(e, s, i);
    }
    for (let e of t.effects)
      if (e.is(is)) {
        let i = t.state.facet($i).autoPanel ? e.value.length ? Hi.open : null : n.panel;
        n = Ce.init(e.value, i, t.state);
      } else e.is(Zr) ? n = new Ce(n.diagnostics, e.value ? Hi.open : null, n.selected) : e.is(hc) && (n = new Ce(n.diagnostics, n.panel, e.value));
    return n;
  },
  provide: (n) => [
    cr.from(n, (t) => t.panel),
    T.decorations.from(n, (t) => t.diagnostics)
  ]
}), Pg = /* @__PURE__ */ K.mark({ class: "cm-lintRange cm-lintRange-active" });
function Ig(n, t, e) {
  let { diagnostics: i } = n.state.field(xt), s, r = -1, o = -1;
  i.between(t - (e < 0 ? 1 : 0), t + (e > 0 ? 1 : 0), (a, h, { spec: c }) => {
    if (t >= a && t <= h && (a == h || (t > a || e > 0) && (t < h || e < 0)))
      return s = c.diagnostics, r = a, o = h, !1;
  });
  let l = n.state.facet($i).tooltipFilter;
  return s && l && (s = l(s, n.state)), s ? {
    pos: r,
    end: o,
    above: n.state.doc.lineAt(r).to < o,
    create() {
      return { dom: cc(n, s) };
    }
  } : null;
}
function cc(n, t) {
  return Kt("ul", { class: "cm-tooltip-lint" }, t.map((e) => uc(n, e, !1)));
}
const Ng = (n) => {
  let t = n.state.field(xt, !1);
  (!t || !t.panel) && n.dispatch({ effects: ac(n.state, [Zr.of(!0)]) });
  let e = yd(n, Hi.open);
  return e && e.dom.querySelector(".cm-panel-lint ul").focus(), !0;
}, El = (n) => {
  let t = n.state.field(xt, !1);
  return !t || !t.panel ? !1 : (n.dispatch({ effects: Zr.of(!1) }), !0);
}, $g = (n) => {
  let t = n.state.field(xt, !1);
  if (!t)
    return !1;
  let e = n.state.selection.main, i = ge(t.diagnostics, null, e.to + 1);
  return !i && (i = ge(t.diagnostics, null, 0), !i || i.from == e.from && i.to == e.to) ? !1 : (n.dispatch({ selection: { anchor: i.from, head: i.to }, scrollIntoView: !0 }), md(n, i.from, 1, {
    tooltip: mc,
    until: (s) => s.docChanged || s.newSelection.main.head < i.from || s.newSelection.main.head > i.to
  }), !0);
}, Hg = [
  { key: "Mod-Shift-m", run: Ng, preventDefault: !0 },
  { key: "F8", run: $g }
], $i = /* @__PURE__ */ M.define({
  combine(n) {
    return {
      sources: n.map((t) => t.source).filter((t) => t != null),
      ..._i(n.map((t) => t.config), {
        delay: 750,
        markerFilter: null,
        tooltipFilter: null,
        needsRefresh: null,
        hideOn: () => null
      }, {
        delay: Math.max,
        markerFilter: Dl,
        tooltipFilter: Dl,
        needsRefresh: (t, e) => t ? e ? (i) => t(i) || e(i) : t : e,
        hideOn: (t, e) => t ? e ? (i, s, r) => t(i, s, r) || e(i, s, r) : t : e,
        autoPanel: (t, e) => t || e
      })
    };
  }
});
function Dl(n, t) {
  return n ? t ? (e, i) => t(n(e, i), i) : n : t;
}
function fc(n) {
  let t = [];
  if (n)
    t: for (let { name: e } of n) {
      for (let i = 0; i < e.length; i++) {
        let s = e[i];
        if (/[a-zA-Z]/.test(s) && !t.some((r) => r.toLowerCase() == s.toLowerCase())) {
          t.push(s);
          continue t;
        }
      }
      t.push("");
    }
  return t;
}
function uc(n, t, e) {
  var i;
  let s = e ? fc(t.actions) : [];
  return Kt("li", { class: "cm-diagnostic cm-diagnostic-" + t.severity }, Kt("span", { class: "cm-diagnosticText" }, t.renderMessage ? t.renderMessage(n) : t.message), (i = t.actions) === null || i === void 0 ? void 0 : i.map((r, o) => {
    let l = !1, a = (d) => {
      if (d.preventDefault(), l)
        return;
      l = !0;
      let p = ge(n.state.field(xt).diagnostics, t);
      p && r.apply(n, p.from, p.to);
    }, { name: h } = r, c = s[o] ? h.indexOf(s[o]) : -1, f = c < 0 ? h : [
      h.slice(0, c),
      Kt("u", h.slice(c, c + 1)),
      h.slice(c + 1)
    ], u = r.markClass ? " " + r.markClass : "";
    return Kt("button", {
      type: "button",
      class: "cm-diagnosticAction" + u,
      onclick: a,
      onmousedown: a,
      "aria-label": ` Action: ${h}${c < 0 ? "" : ` (access key "${s[o]})"`}.`
    }, f);
  }), t.source && Kt("div", { class: "cm-diagnosticSource" }, t.source));
}
class Vg extends zi {
  constructor(t) {
    super(), this.sev = t;
  }
  eq(t) {
    return t.sev == this.sev;
  }
  toDOM() {
    return Kt("span", { class: "cm-lintPoint cm-lintPoint-" + this.sev });
  }
}
class Rl {
  constructor(t, e) {
    this.diagnostic = e, this.id = "item_" + Math.floor(Math.random() * 4294967295).toString(16), this.dom = uc(t, e, !0), this.dom.id = this.id, this.dom.setAttribute("role", "option");
  }
}
class Hi {
  constructor(t) {
    this.view = t, this.items = [];
    let e = (s) => {
      if (!(s.ctrlKey || s.altKey || s.metaKey)) {
        if (s.keyCode == 27)
          El(this.view), this.view.focus();
        else if (s.keyCode == 38 || s.keyCode == 33)
          this.moveSelection((this.selectedIndex - 1 + this.items.length) % this.items.length);
        else if (s.keyCode == 40 || s.keyCode == 34)
          this.moveSelection((this.selectedIndex + 1) % this.items.length);
        else if (s.keyCode == 36)
          this.moveSelection(0);
        else if (s.keyCode == 35)
          this.moveSelection(this.items.length - 1);
        else if (s.keyCode == 13)
          this.view.focus();
        else if (s.keyCode >= 65 && s.keyCode <= 90 && this.selectedIndex >= 0) {
          let { diagnostic: r } = this.items[this.selectedIndex], o = fc(r.actions);
          for (let l = 0; l < o.length; l++)
            if (o[l].toUpperCase().charCodeAt(0) == s.keyCode) {
              let a = ge(this.view.state.field(xt).diagnostics, r);
              a && r.actions[l].apply(t, a.from, a.to);
            }
        } else
          return;
        s.preventDefault();
      }
    }, i = (s) => {
      for (let r = 0; r < this.items.length; r++)
        this.items[r].dom.contains(s.target) && this.moveSelection(r);
    };
    this.list = Kt("ul", {
      tabIndex: 0,
      role: "listbox",
      "aria-label": this.view.state.phrase("Diagnostics"),
      onkeydown: e,
      onclick: i
    }), this.dom = Kt("div", { class: "cm-panel-lint" }, this.list, Kt("button", {
      type: "button",
      name: "close",
      "aria-label": this.view.state.phrase("close"),
      onclick: () => El(this.view)
    }, "×")), this.update();
  }
  get selectedIndex() {
    let t = this.view.state.field(xt).selected;
    if (!t)
      return -1;
    for (let e = 0; e < this.items.length; e++)
      if (this.items[e].diagnostic == t.diagnostic)
        return e;
    return -1;
  }
  update() {
    let { diagnostics: t, selected: e } = this.view.state.field(xt), i = 0, s = !1, r = null, o = /* @__PURE__ */ new Set();
    for (t.between(0, this.view.state.doc.length, (l, a, { spec: h }) => {
      for (let c of h.diagnostics) {
        if (o.has(c))
          continue;
        o.add(c);
        let f = -1, u;
        for (let d = i; d < this.items.length; d++)
          if (this.items[d].diagnostic == c) {
            f = d;
            break;
          }
        f < 0 ? (u = new Rl(this.view, c), this.items.splice(i, 0, u), s = !0) : (u = this.items[f], f > i && (this.items.splice(i, f - i), s = !0)), e && u.diagnostic == e.diagnostic ? u.dom.hasAttribute("aria-selected") || (u.dom.setAttribute("aria-selected", "true"), r = u) : u.dom.hasAttribute("aria-selected") && u.dom.removeAttribute("aria-selected"), i++;
      }
    }); i < this.items.length && !(this.items.length == 1 && this.items[0].diagnostic.from < 0); )
      s = !0, this.items.pop();
    this.items.length == 0 && (this.items.push(new Rl(this.view, {
      from: -1,
      to: -1,
      severity: "info",
      message: this.view.state.phrase("No diagnostics")
    })), s = !0), r ? (this.list.setAttribute("aria-activedescendant", r.id), this.view.requestMeasure({
      key: this,
      read: () => ({ sel: r.dom.getBoundingClientRect(), panel: this.list.getBoundingClientRect() }),
      write: ({ sel: l, panel: a }) => {
        let h = a.height / this.list.offsetHeight;
        l.top < a.top ? this.list.scrollTop -= (a.top - l.top) / h : l.bottom > a.bottom && (this.list.scrollTop += (l.bottom - a.bottom) / h);
      }
    })) : this.selectedIndex < 0 && this.list.removeAttribute("aria-activedescendant"), s && this.sync();
  }
  sync() {
    let t = this.list.firstChild;
    function e() {
      let i = t;
      t = i.nextSibling, i.remove();
    }
    for (let i of this.items)
      if (i.dom.parentNode == this.list) {
        for (; t != i.dom; )
          e();
        t = i.dom.nextSibling;
      } else
        this.list.insertBefore(i.dom, t);
    for (; t; )
      e();
  }
  moveSelection(t) {
    if (this.selectedIndex < 0)
      return;
    let e = this.view.state.field(xt), i = ge(e.diagnostics, this.items[t].diagnostic);
    i && this.view.dispatch({
      selection: { anchor: i.from, head: i.to },
      scrollIntoView: !0,
      effects: hc.of(i)
    });
  }
  static open(t) {
    return new Hi(t);
  }
}
function Sn(n, t = 'viewBox="0 0 40 40"') {
  return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ${t}>${encodeURIComponent(n)}</svg>')`;
}
function mn(n) {
  return Sn(`<path d="m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0" stroke="${n}" fill="none" stroke-width=".7"/>`, 'width="6" height="3"');
}
const Fg = /* @__PURE__ */ T.baseTheme({
  ".cm-diagnostic": {
    padding: "3px 6px 3px 8px",
    marginLeft: "-1px",
    display: "block",
    whiteSpace: "pre-wrap"
  },
  ".cm-diagnostic-error": { borderLeft: "5px solid #d11" },
  ".cm-diagnostic-warning": { borderLeft: "5px solid orange" },
  ".cm-diagnostic-info": { borderLeft: "5px solid #999" },
  ".cm-diagnostic-hint": { borderLeft: "5px solid #66d" },
  ".cm-diagnosticAction": {
    font: "inherit",
    border: "none",
    padding: "2px 4px",
    backgroundColor: "#444",
    color: "white",
    borderRadius: "3px",
    marginLeft: "8px",
    cursor: "pointer"
  },
  ".cm-diagnosticSource": {
    fontSize: "70%",
    opacity: 0.7
  },
  ".cm-lintRange": {
    backgroundPosition: "left bottom",
    backgroundRepeat: "repeat-x",
    paddingBottom: "0.7px"
  },
  ".cm-lintRange-error": { backgroundImage: /* @__PURE__ */ mn("#f11") },
  ".cm-lintRange-warning": { backgroundImage: /* @__PURE__ */ mn("orange") },
  ".cm-lintRange-info": { backgroundImage: /* @__PURE__ */ mn("#999") },
  ".cm-lintRange-hint": { backgroundImage: /* @__PURE__ */ mn("#66d") },
  ".cm-lintRange-active": { backgroundColor: "#ffdd9980" },
  ".cm-tooltip-lint": {
    padding: 0,
    margin: 0
  },
  ".cm-lintPoint": {
    position: "relative",
    "&:after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: "-2px",
      borderLeft: "3px solid transparent",
      borderRight: "3px solid transparent",
      borderBottom: "4px solid #d11"
    }
  },
  ".cm-lintPoint-warning": {
    "&:after": { borderBottomColor: "orange" }
  },
  ".cm-lintPoint-info": {
    "&:after": { borderBottomColor: "#999" }
  },
  ".cm-lintPoint-hint": {
    "&:after": { borderBottomColor: "#66d" }
  },
  ".cm-panel.cm-panel-lint": {
    position: "relative",
    "& ul": {
      maxHeight: "100px",
      overflowY: "auto",
      "& [aria-selected]": {
        backgroundColor: "#ddd",
        "& u": { textDecoration: "underline" }
      },
      "&:focus [aria-selected]": {
        background_fallback: "#bdf",
        backgroundColor: "Highlight",
        color_fallback: "white",
        color: "HighlightText"
      },
      "& u": { textDecoration: "none" },
      padding: 0,
      margin: 0
    },
    "& [name=close]": {
      position: "absolute",
      top: "0",
      right: "2px",
      background: "inherit",
      border: "none",
      font: "inherit",
      padding: 0,
      margin: 0
    }
  },
  "&dark .cm-lintRange-active": { backgroundColor: "#86714a80" },
  "&dark .cm-panel.cm-panel-lint ul": {
    "& [aria-selected]": {
      backgroundColor: "#2e343e"
    }
  }
});
function Wg(n) {
  return n == "error" ? 4 : n == "warning" ? 3 : n == "info" ? 2 : 1;
}
function dc(n) {
  let t = "hint", e = 1;
  for (let i of n) {
    let s = Wg(i.severity);
    s > e && (e = s, t = i.severity);
  }
  return t;
}
class pc extends de {
  constructor(t) {
    super(), this.diagnostics = t, this.severity = dc(t);
  }
  toDOM(t) {
    let e = document.createElement("div");
    e.className = "cm-lint-marker cm-lint-marker-" + this.severity;
    let i = this.diagnostics, s = t.state.facet(ns).tooltipFilter;
    return s && (i = s(i, t.state)), i.length && (e.onmouseover = () => zg(t, e, i)), e;
  }
}
function _g(n, t) {
  let e = (i) => {
    let s = t.getBoundingClientRect();
    if (!(i.clientX > s.left - 10 && i.clientX < s.right + 10 && i.clientY > s.top - 10 && i.clientY < s.bottom + 10)) {
      for (let r = i.target; r; r = r.parentNode)
        if (r.nodeType == 1 && r.classList.contains("cm-tooltip-lint"))
          return;
      window.removeEventListener("mousemove", e), n.state.field(gc) && n.dispatch({ effects: Qr.of(null) });
    }
  };
  window.addEventListener("mousemove", e);
}
function zg(n, t, e) {
  function i() {
    let o = n.elementAtHeight(t.getBoundingClientRect().top + 5 - n.documentTop);
    n.coordsAtPos(o.from) && n.dispatch({ effects: Qr.of({
      pos: o.from,
      above: !1,
      clip: !1,
      create() {
        return {
          dom: cc(n, e),
          getCoords: () => t.getBoundingClientRect()
        };
      }
    }) }), t.onmouseout = t.onmousemove = null, _g(n, t);
  }
  let { hoverTime: s } = n.state.facet(ns), r = setTimeout(i, s);
  t.onmouseout = () => {
    clearTimeout(r), t.onmouseout = t.onmousemove = null;
  }, t.onmousemove = () => {
    clearTimeout(r), r = setTimeout(i, s);
  };
}
function Ug(n, t) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let s of t) {
    let r = n.lineAt(s.from);
    (e[r.from] || (e[r.from] = [])).push(s);
  }
  let i = [];
  for (let s in e)
    i.push(new pc(e[s]).range(+s));
  return B.of(i, !0);
}
const jg = /* @__PURE__ */ xd({
  class: "cm-gutter-lint",
  markers: (n) => n.state.field(kr),
  widgetMarker: (n, t, e) => {
    let i = [];
    return n.state.field(kr).between(e.from, e.to, (s, r, o) => {
      s > e.from && s < e.to && i.push(...o.diagnostics);
    }), i.length ? new pc(i) : null;
  }
}), kr = /* @__PURE__ */ St.define({
  create() {
    return B.empty;
  },
  update(n, t) {
    n = n.map(t.changes);
    let e = t.state.facet(ns).markerFilter;
    for (let i of t.effects)
      if (i.is(is)) {
        let s = i.value;
        e && (s = e(s || [], t.state)), n = Ug(t.state.doc, s.slice(0));
      }
    return n;
  }
}), Qr = /* @__PURE__ */ F.define(), gc = /* @__PURE__ */ St.define({
  create() {
    return null;
  },
  update(n, t) {
    return n && t.docChanged && (n = lc(t, n) ? null : { ...n, pos: t.changes.mapPos(n.pos) }), t.effects.reduce((e, i) => i.is(Qr) ? i.value : e, n);
  },
  provide: (n) => Vr.from(n)
}), qg = /* @__PURE__ */ T.baseTheme({
  ".cm-gutter-lint": {
    width: "1.4em",
    "& .cm-gutterElement": {
      padding: ".2em"
    }
  },
  ".cm-lint-marker": {
    width: "1em",
    height: "1em"
  },
  ".cm-lint-marker-info": {
    content: /* @__PURE__ */ Sn('<path fill="#aaf" stroke="#77e" stroke-width="6" stroke-linejoin="round" d="M5 5L35 5L35 35L5 35Z"/>')
  },
  ".cm-lint-marker-warning": {
    content: /* @__PURE__ */ Sn('<path fill="#fe8" stroke="#fd7" stroke-width="6" stroke-linejoin="round" d="M20 6L37 35L3 35Z"/>')
  },
  ".cm-lint-marker-error": {
    content: /* @__PURE__ */ Sn('<circle cx="20" cy="20" r="15" fill="#f87" stroke="#f43" stroke-width="6"/>')
  }
}), mc = /* @__PURE__ */ gd(Ig, { hideOn: lc }), Kg = [
  xt,
  /* @__PURE__ */ T.decorations.compute([xt], (n) => {
    let { selected: t, panel: e } = n.field(xt);
    return !t || !e || t.from == t.to ? K.none : K.set([
      Pg.range(t.from, t.to)
    ]);
  }),
  mc,
  Fg
], ns = /* @__PURE__ */ M.define({
  combine(n) {
    return _i(n, {
      hoverTime: 300,
      markerFilter: null,
      tooltipFilter: null
    });
  }
});
function Gg(n = {}) {
  return [ns.of(n), kr, jg, qg, gc];
}
const Jg = /^(INTERLIS|MODEL|TOPIC|CLASS|STRUCTURE|DOMAIN|TYPE|END|IMPORTS|REFSYSTEM|CONTRACTED|VIEW|EXTENDS|ABSTRACT|FINAL|BASKET|DATA|OID|NO|HALIGNMENT|VALIGNMENT|MANDATORY|CONSTRAINTS|EXISTENCE|UNIQUE|SET|BAG|LIST|OF|REFERENCE|TO|ASSOCIATION|ROLE|ATTRIBUTE|TEXT|BOOLEAN|NUMERIC|COORD|SURFACE|AREA|POLYLINE|FORMAT|BASED ON|VERSION|AT)\b/i, Yg = qr.define({
  token(n) {
    return n.match(/!!.*/) ? "comment" : n.match(/"([^"\\]|\\.)*"?/) ? "string" : n.match(/\b\d+(\.\d+)?\b/) ? "number" : n.match(Jg) ? "keyword" : n.match(/[A-Z][A-Za-z0-9_]*/) ? "typeName" : (n.next(), null);
  },
  languageData: {
    commentTokens: { line: "!!" }
  }
}), Xg = Xn.define([
  { tag: D.keyword, color: "#075985", fontWeight: "600" },
  { tag: D.comment, color: "#64748b", fontStyle: "italic" },
  { tag: D.string, color: "#1e4ed8" },
  { tag: D.number, color: "#b45309" },
  { tag: D.typeName, color: "#7c3aed" }
]), Zg = T.theme({
  "&": {
    backgroundColor: "var(--interlis-lab-background)",
    color: "var(--interlis-lab-text-color)",
    fontSize: "14px",
    height: "100%"
  },
  ".cm-scroller": {
    fontFamily: "var(--interlis-lab-monospace-font)",
    height: "100%",
    lineHeight: "1.55",
    minHeight: "18rem"
  },
  ".cm-content": {
    caretColor: "var(--interlis-lab-accent-color)",
    padding: "1rem 0.75rem"
  },
  ".cm-line": {
    padding: "0 0.35rem"
  },
  ".cm-gutters": {
    backgroundColor: "var(--interlis-lab-panel-background)",
    borderRight: "1px solid var(--interlis-lab-border-color)",
    color: "var(--interlis-lab-muted-color)"
  },
  ".cm-selectionBackground, &.cm-focused .cm-selectionBackground": {
    backgroundColor: "rgba(3, 102, 214, 0.22)"
  },
  "&.cm-focused": {
    outline: "none"
  },
  ".cm-diagnostic": {
    fontFamily: "var(--interlis-lab-font-family)"
  }
});
function Qg(n, t) {
  if (!n.line)
    return;
  const e = Math.min(Math.max(n.line, 1), t.doc.lines), i = t.doc.line(e), s = n.column ? Math.max(n.column - 1, 0) : 0, r = Math.min(i.from + s, i.to), o = r < i.to ? r + 1 : i.to;
  return {
    from: r,
    to: o,
    severity: n.severity,
    message: n.message,
    source: n.source
  };
}
class tm {
  constructor(t) {
    this.textarea = t, this.readOnly = new Ye(), this.editable = new Ye(), this.syncingFromView = !1, this.fallback = new Vc(t);
    try {
      const e = t.parentElement;
      if (!e)
        return;
      this.view = new T({
        parent: e,
        state: $.create({
          doc: t.value,
          extensions: [
            Od(),
            Ep(),
            id(),
            ld(),
            Yg,
            rp(Xg),
            Gg(),
            eh.of([Lg, ...Rg, ...Hp, ...Hg]),
            T.lineWrapping,
            T.contentAttributes.of({
              "aria-label": t.getAttribute("aria-label") ?? "INTERLIS-Code Editor"
            }),
            T.updateListener.of((i) => {
              if (!(!i.docChanged || this.syncingFromView)) {
                this.syncingFromView = !0;
                try {
                  this.fallback.setValue(i.state.doc.toString()), t.dispatchEvent(new Event("input", { bubbles: !0, composed: !0 }));
                } finally {
                  this.syncingFromView = !1;
                }
              }
            }),
            this.readOnly.of($.readOnly.of(t.readOnly)),
            this.editable.of(T.editable.of(!t.readOnly)),
            Zg
          ]
        })
      }), t.dataset.editor = "codemirror";
    } catch {
      this.view = void 0;
    }
  }
  getValue() {
    return this.view?.state.doc.toString() ?? this.fallback.getValue();
  }
  setValue(t) {
    if (this.fallback.setValue(t), !(!this.view || this.syncingFromView || this.view.state.doc.toString() === t)) {
      this.syncingFromView = !0;
      try {
        this.view.dispatch({
          changes: {
            from: 0,
            to: this.view.state.doc.length,
            insert: t
          }
        });
      } finally {
        this.syncingFromView = !1;
      }
    }
  }
  setDiagnostics(t) {
    if (this.fallback.setDiagnostics(t), !this.view)
      return;
    const e = t.map((i) => Qg(i, this.view.state)).filter((i) => !!i);
    this.view.dispatch(Bg(this.view.state, e));
  }
  setReadOnly(t) {
    this.fallback.setReadOnly(t), this.view && this.view.dispatch({
      effects: [
        this.readOnly.reconfigure($.readOnly.of(t)),
        this.editable.reconfigure(T.editable.of(!t))
      ]
    });
  }
  focus() {
    this.view?.focus(), this.view || this.fallback.focus();
  }
  dispose() {
    this.view?.destroy(), this.view = void 0, delete this.textarea.dataset.editor, this.fallback.dispose();
  }
}
function em(n, t) {
  const e = n.findIndex((i) => i.includes(t));
  return e >= 0 ? e + 1 : 1;
}
function im(n) {
  const t = n.split(/\r?\n/), e = [], i = [];
  n.includes("!! FAIL") && e.push({
    severity: "error",
    message: "Mock-Fehler: Der Code enthält !! FAIL.",
    line: em(t, "!! FAIL"),
    source: "runner"
  });
  for (const [r, o] of t.entries()) {
    const l = o.trim();
    if (!l || l.startsWith("!!"))
      continue;
    const a = l.match(/^MODEL\s+([A-Za-z_][A-Za-z0-9_]*)\b/);
    if (a) {
      i.push({ kind: "MODEL", name: a[1], line: r + 1 });
      continue;
    }
    const h = l.match(/^TOPIC\s+([A-Za-z_][A-Za-z0-9_]*)\s*=/);
    if (h) {
      i.push({ kind: "TOPIC", name: h[1], line: r + 1 });
      continue;
    }
    const c = l.match(/^CLASS\s+([A-Za-z_][A-Za-z0-9_]*)\s*=/);
    if (c) {
      i.push({ kind: "CLASS", name: c[1], line: r + 1 });
      continue;
    }
    const f = l.match(/^END\s+([A-Za-z_][A-Za-z0-9_]*)\s*([.;])/);
    if (f) {
      const u = i.pop(), d = f[1], p = f[2];
      if (!u) {
        e.push({
          severity: "error",
          message: `Unerwartetes END ${d}${p}`,
          line: r + 1,
          source: "runner"
        });
        continue;
      }
      u.name !== d && e.push({
        severity: "error",
        message: `END ${d}${p} passt nicht zu ${u.kind} ${u.name}. Erwartet: END ${u.name}${u.kind === "MODEL" ? "." : ";"}`,
        line: r + 1,
        source: "runner"
      });
    }
  }
  const s = i.find((r) => r.kind === "MODEL");
  s && !new RegExp(`END\\s+${s.name}\\s*\\.`, "m").test(n) && e.push({
    severity: "error",
    message: `Das Modell ${s.name} endet nicht mit "END ${s.name}."`,
    line: s.line,
    source: "runner"
  });
  for (const r of i.reverse())
    e.push({
      severity: "error",
      message: `${r.kind} ${r.name} wurde nicht korrekt geschlossen.`,
      line: r.line,
      source: "runner"
    });
  return e;
}
class nm {
  constructor() {
    this.id = "mock", this.label = "Mock Runner";
  }
  async compile(t) {
    const e = performance.now(), i = im(t.code), s = i.length === 0;
    return {
      ok: s,
      diagnostics: i,
      stdout: s ? "Mock compile successful" : void 0,
      stderr: s ? void 0 : "Mock compile failed",
      durationMs: Math.round(performance.now() - e)
    };
  }
}
const sm = "https://cjrtnc.leaningtech.com/4.3/loader.js", rm = "/ili2c.jar", bc = "/str/model.ili", om = 12e4, Ds = /* @__PURE__ */ new Map();
let pi, lm = 0;
function to() {
  return globalThis;
}
function am() {
  const n = to();
  if (typeof n.cheerpjInit != "function")
    throw new Error("CheerpJ ist nicht geladen.");
  return n;
}
function hm() {
  const n = to();
  if (typeof n.cheerpjInit != "function" || typeof n.cheerpjRunJar != "function" || typeof n.cheerpOSAddStringFile != "function" || typeof n.cjFileBlob != "function")
    throw new Error("CheerpJ ist nicht vollständig geladen.");
  return n;
}
function cm(n) {
  if (typeof document > "u")
    return Promise.reject(new Error("Der CheerpJ-Runner benötigt eine Browser-Umgebung."));
  if (typeof to().cheerpjInit == "function")
    return Promise.resolve();
  const t = Ds.get(n);
  if (t)
    return t;
  const e = new Promise((i, s) => {
    const r = document.querySelector(
      `script[data-interlis-lab-cheerpj="${n}"]`
    ), o = r ?? document.createElement("script");
    o.addEventListener("load", () => i(), { once: !0 }), o.addEventListener(
      "error",
      () => {
        Ds.delete(n), s(new Error("Der CheerpJ-Loader konnte nicht geladen werden."));
      },
      { once: !0 }
    ), r || (o.src = n, o.async = !0, o.dataset.interlisLabCheerpj = n, document.head.append(o));
  });
  return Ds.set(n, e), e;
}
function fm(n) {
  return pi || (pi = am().cheerpjInit({
    status: "none",
    version: n.javaVersion ?? 17,
    ...n.cheerpjInitOptions
  }).catch((e) => {
    throw pi = void 0, e;
  }), pi);
}
function um(n) {
  if (n.startsWith("/app/"))
    return n;
  if (typeof document < "u" && typeof window < "u") {
    const t = new URL(n, document.baseURI);
    if ((t.protocol === "http:" || t.protocol === "https:") && t.origin !== window.location.origin)
      throw new Error("ili2cJarUrl muss für CheerpJ unter demselben Webserver wie die Seite verfügbar sein.");
    return `/app${t.pathname}`;
  }
  return n.startsWith("/") ? `/app${n}` : `/app/${n}`;
}
function dm(n, t) {
  let e;
  const i = new Promise((s, r) => {
    e = setTimeout(() => {
      r(new Error(`ili2c wurde nach ${t} ms abgebrochen.`));
    }, t);
  });
  return Promise.race([n, i]).finally(() => {
    e && clearTimeout(e);
  });
}
function pm(n) {
  switch (n.toLowerCase()) {
    case "warning":
      return "warning";
    case "info":
      return "info";
    default:
      return "error";
  }
}
function gm(n, t) {
  return n === t || n.endsWith(`/${t.split("/").pop() ?? ""}`) ? t.split("/").pop() ?? n : n;
}
function mm(n, t = bc) {
  const e = [];
  for (const i of n.split(/\r?\n/)) {
    const r = i.trim().match(/^(Error|Warning|Info):\s+(.+)$/);
    if (!r)
      continue;
    const o = pm(r[1]);
    let l = r[2];
    if (l.startsWith("...compiler run "))
      continue;
    const a = l.match(/^(.+):(\d+):(.+)$/);
    if (a) {
      l = a[3].trim(), e.push({
        severity: o,
        message: l,
        file: gm(a[1], t),
        line: Number(a[2]),
        source: "ili2c"
      });
      continue;
    }
    e.push({
      severity: o,
      message: l,
      source: "ili2c"
    });
  }
  return e.filter((i) => i.severity !== "info");
}
class bm {
  constructor(t = {}) {
    this.options = t, this.id = "cheerpj", this.label = "CheerpJ Runner";
  }
  async init() {
    this.options.executor || (await cm(this.options.cheerpjLoaderUrl ?? sm), await fm(this.options));
  }
  async compile(t) {
    if (this.options.executor)
      return this.options.executor(t, this.options);
    await this.init();
    const e = hm(), i = performance.now(), s = this.options.modelPath ?? bc, r = this.options.logPath ?? `/files/interlis-lab-ili2c-${++lm}.log`, o = um(this.options.ili2cJarUrl ?? rm);
    await e.cheerpOSAddStringFile(s, t.code);
    const l = ["--log", r, ...this.options.javaArgs ?? [], s], a = await dm(
      e.cheerpjRunJar(o, ...l),
      this.options.timeoutMs ?? om
    ), h = await e.cjFileBlob(r).then((u) => u.text()).catch(() => ""), c = (this.options.parseDiagnostics ?? ((u) => mm(u, s)))(
      h
    );
    a !== 0 && c.length === 0 && c.push({
      severity: "error",
      message: `ili2c wurde mit Exit-Code ${a} beendet.`,
      source: "ili2c"
    });
    const f = a === 0 && !c.some((u) => u.severity === "error");
    return {
      ok: f,
      diagnostics: c,
      stdout: f ? h : void 0,
      stderr: f ? void 0 : h,
      durationMs: Math.round(performance.now() - i)
    };
  }
}
const An = globalThis, eo = An.ShadowRoot && (An.ShadyCSS === void 0 || An.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, io = /* @__PURE__ */ Symbol(), Ll = /* @__PURE__ */ new WeakMap();
let yc = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== io) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (eo && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = Ll.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && Ll.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ym = (n) => new yc(typeof n == "string" ? n : n + "", void 0, io), wm = (n, ...t) => {
  const e = n.length === 1 ? n[0] : t.reduce((i, s, r) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + n[r + 1], n[0]);
  return new yc(e, n, io);
}, vm = (n, t) => {
  if (eo) n.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const i = document.createElement("style"), s = An.litNonce;
    s !== void 0 && i.setAttribute("nonce", s), i.textContent = e.cssText, n.appendChild(i);
  }
}, Bl = eo ? (n) => n : (n) => n instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules) e += i.cssText;
  return ym(e);
})(n) : n;
const { is: xm, defineProperty: km, getOwnPropertyDescriptor: Sm, getOwnPropertyNames: Am, getOwnPropertySymbols: Cm, getPrototypeOf: Mm } = Object, ss = globalThis, Pl = ss.trustedTypes, Tm = Pl ? Pl.emptyScript : "", Om = ss.reactiveElementPolyfillSupport, Mi = (n, t) => n, Fn = { toAttribute(n, t) {
  switch (t) {
    case Boolean:
      n = n ? Tm : null;
      break;
    case Object:
    case Array:
      n = n == null ? n : JSON.stringify(n);
  }
  return n;
}, fromAttribute(n, t) {
  let e = n;
  switch (t) {
    case Boolean:
      e = n !== null;
      break;
    case Number:
      e = n === null ? null : Number(n);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(n);
      } catch {
        e = null;
      }
  }
  return e;
} }, no = (n, t) => !xm(n, t), Il = { attribute: !0, type: String, converter: Fn, reflect: !1, useDefault: !1, hasChanged: no };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), ss.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let Fe = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Il) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), s = this.getPropertyDescriptor(t, i, e);
      s !== void 0 && km(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: s, set: r } = Sm(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: s, set(o) {
      const l = s?.call(this);
      r?.call(this, o), this.requestUpdate(t, l, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Il;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Mi("elementProperties"))) return;
    const t = Mm(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Mi("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Mi("properties"))) {
      const e = this.properties, i = [...Am(e), ...Cm(e)];
      for (const s of i) this.createProperty(s, e[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [i, s] of e) this.elementProperties.set(i, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const s = this._$Eu(e, i);
      s !== void 0 && this._$Eh.set(s, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const s of i) e.unshift(Bl(s));
    } else t !== void 0 && e.push(Bl(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const i of e.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return vm(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$ET(t, e) {
    const i = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, i);
    if (s !== void 0 && i.reflect === !0) {
      const r = (i.converter?.toAttribute !== void 0 ? i.converter : Fn).toAttribute(e, i.type);
      this._$Em = t, r == null ? this.removeAttribute(s) : this.setAttribute(s, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const i = this.constructor, s = i._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const r = i.getPropertyOptions(s), o = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : Fn;
      this._$Em = s;
      const l = o.fromAttribute(e, r.type);
      this[s] = l ?? this._$Ej?.get(s) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, i, s = !1, r) {
    if (t !== void 0) {
      const o = this.constructor;
      if (s === !1 && (r = this[t]), i ??= o.getPropertyOptions(t), !((i.hasChanged ?? no)(r, e) || i.useDefault && i.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, i)))) return;
      this.C(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: i, reflect: s, wrapped: r }, o) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), r !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (e = void 0), this._$AL.set(t, e)), s === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [s, r] of this._$Ep) this[s] = r;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [s, r] of i) {
        const { wrapped: o } = r, l = this[s];
        o !== !0 || this._$AL.has(s) || l === void 0 || this.C(s, void 0, r, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
Fe.elementStyles = [], Fe.shadowRootOptions = { mode: "open" }, Fe[Mi("elementProperties")] = /* @__PURE__ */ new Map(), Fe[Mi("finalized")] = /* @__PURE__ */ new Map(), Om?.({ ReactiveElement: Fe }), (ss.reactiveElementVersions ??= []).push("2.1.2");
const so = globalThis, Nl = (n) => n, Wn = so.trustedTypes, $l = Wn ? Wn.createPolicy("lit-html", { createHTML: (n) => n }) : void 0, wc = "$lit$", le = `lit$${Math.random().toFixed(9).slice(2)}$`, vc = "?" + le, Em = `<${vc}>`, $e = document, Vi = () => $e.createComment(""), Fi = (n) => n === null || typeof n != "object" && typeof n != "function", ro = Array.isArray, Dm = (n) => ro(n) || typeof n?.[Symbol.iterator] == "function", Rs = `[ 	
\f\r]`, gi = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Hl = /-->/g, Vl = />/g, ke = RegExp(`>|${Rs}(?:([^\\s"'>=/]+)(${Rs}*=${Rs}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Fl = /'/g, Wl = /"/g, xc = /^(?:script|style|textarea|title)$/i, Rm = (n) => (t, ...e) => ({ _$litType$: n, strings: t, values: e }), Rt = Rm(1), ri = /* @__PURE__ */ Symbol.for("lit-noChange"), G = /* @__PURE__ */ Symbol.for("lit-nothing"), _l = /* @__PURE__ */ new WeakMap(), Oe = $e.createTreeWalker($e, 129);
function kc(n, t) {
  if (!ro(n) || !n.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return $l !== void 0 ? $l.createHTML(t) : t;
}
const Lm = (n, t) => {
  const e = n.length - 1, i = [];
  let s, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = gi;
  for (let l = 0; l < e; l++) {
    const a = n[l];
    let h, c, f = -1, u = 0;
    for (; u < a.length && (o.lastIndex = u, c = o.exec(a), c !== null); ) u = o.lastIndex, o === gi ? c[1] === "!--" ? o = Hl : c[1] !== void 0 ? o = Vl : c[2] !== void 0 ? (xc.test(c[2]) && (s = RegExp("</" + c[2], "g")), o = ke) : c[3] !== void 0 && (o = ke) : o === ke ? c[0] === ">" ? (o = s ?? gi, f = -1) : c[1] === void 0 ? f = -2 : (f = o.lastIndex - c[2].length, h = c[1], o = c[3] === void 0 ? ke : c[3] === '"' ? Wl : Fl) : o === Wl || o === Fl ? o = ke : o === Hl || o === Vl ? o = gi : (o = ke, s = void 0);
    const d = o === ke && n[l + 1].startsWith("/>") ? " " : "";
    r += o === gi ? a + Em : f >= 0 ? (i.push(h), a.slice(0, f) + wc + a.slice(f) + le + d) : a + le + (f === -2 ? l : d);
  }
  return [kc(n, r + (n[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class Wi {
  constructor({ strings: t, _$litType$: e }, i) {
    let s;
    this.parts = [];
    let r = 0, o = 0;
    const l = t.length - 1, a = this.parts, [h, c] = Lm(t, e);
    if (this.el = Wi.createElement(h, i), Oe.currentNode = this.el.content, e === 2 || e === 3) {
      const f = this.el.content.firstChild;
      f.replaceWith(...f.childNodes);
    }
    for (; (s = Oe.nextNode()) !== null && a.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const f of s.getAttributeNames()) if (f.endsWith(wc)) {
          const u = c[o++], d = s.getAttribute(f).split(le), p = /([.?@])?(.*)/.exec(u);
          a.push({ type: 1, index: r, name: p[2], strings: d, ctor: p[1] === "." ? Pm : p[1] === "?" ? Im : p[1] === "@" ? Nm : rs }), s.removeAttribute(f);
        } else f.startsWith(le) && (a.push({ type: 6, index: r }), s.removeAttribute(f));
        if (xc.test(s.tagName)) {
          const f = s.textContent.split(le), u = f.length - 1;
          if (u > 0) {
            s.textContent = Wn ? Wn.emptyScript : "";
            for (let d = 0; d < u; d++) s.append(f[d], Vi()), Oe.nextNode(), a.push({ type: 2, index: ++r });
            s.append(f[u], Vi());
          }
        }
      } else if (s.nodeType === 8) if (s.data === vc) a.push({ type: 2, index: r });
      else {
        let f = -1;
        for (; (f = s.data.indexOf(le, f + 1)) !== -1; ) a.push({ type: 7, index: r }), f += le.length - 1;
      }
      r++;
    }
  }
  static createElement(t, e) {
    const i = $e.createElement("template");
    return i.innerHTML = t, i;
  }
}
function oi(n, t, e = n, i) {
  if (t === ri) return t;
  let s = i !== void 0 ? e._$Co?.[i] : e._$Cl;
  const r = Fi(t) ? void 0 : t._$litDirective$;
  return s?.constructor !== r && (s?._$AO?.(!1), r === void 0 ? s = void 0 : (s = new r(n), s._$AT(n, e, i)), i !== void 0 ? (e._$Co ??= [])[i] = s : e._$Cl = s), s !== void 0 && (t = oi(n, s._$AS(n, t.values), s, i)), t;
}
class Bm {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: i } = this._$AD, s = (t?.creationScope ?? $e).importNode(e, !0);
    Oe.currentNode = s;
    let r = Oe.nextNode(), o = 0, l = 0, a = i[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let h;
        a.type === 2 ? h = new Gi(r, r.nextSibling, this, t) : a.type === 1 ? h = new a.ctor(r, a.name, a.strings, this, t) : a.type === 6 && (h = new $m(r, this, t)), this._$AV.push(h), a = i[++l];
      }
      o !== a?.index && (r = Oe.nextNode(), o++);
    }
    return Oe.currentNode = $e, s;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class Gi {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, i, s) {
    this.type = 2, this._$AH = G, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = s, this._$Cv = s?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = oi(this, t, e), Fi(t) ? t === G || t == null || t === "" ? (this._$AH !== G && this._$AR(), this._$AH = G) : t !== this._$AH && t !== ri && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Dm(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== G && Fi(this._$AH) ? this._$AA.nextSibling.data = t : this.T($e.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: i } = t, s = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = Wi.createElement(kc(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === s) this._$AH.p(e);
    else {
      const r = new Bm(s, this), o = r.u(this.options);
      r.p(e), this.T(o), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = _l.get(t.strings);
    return e === void 0 && _l.set(t.strings, e = new Wi(t)), e;
  }
  k(t) {
    ro(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, s = 0;
    for (const r of t) s === e.length ? e.push(i = new Gi(this.O(Vi()), this.O(Vi()), this, this.options)) : i = e[s], i._$AI(r), s++;
    s < e.length && (this._$AR(i && i._$AB.nextSibling, s), e.length = s);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const i = Nl(t).nextSibling;
      Nl(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class rs {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, s, r) {
    this.type = 1, this._$AH = G, this._$AN = void 0, this.element = t, this.name = e, this._$AM = s, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = G;
  }
  _$AI(t, e = this, i, s) {
    const r = this.strings;
    let o = !1;
    if (r === void 0) t = oi(this, t, e, 0), o = !Fi(t) || t !== this._$AH && t !== ri, o && (this._$AH = t);
    else {
      const l = t;
      let a, h;
      for (t = r[0], a = 0; a < r.length - 1; a++) h = oi(this, l[i + a], e, a), h === ri && (h = this._$AH[a]), o ||= !Fi(h) || h !== this._$AH[a], h === G ? t = G : t !== G && (t += (h ?? "") + r[a + 1]), this._$AH[a] = h;
    }
    o && !s && this.j(t);
  }
  j(t) {
    t === G ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Pm extends rs {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === G ? void 0 : t;
  }
}
class Im extends rs {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== G);
  }
}
class Nm extends rs {
  constructor(t, e, i, s, r) {
    super(t, e, i, s, r), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = oi(this, t, e, 0) ?? G) === ri) return;
    const i = this._$AH, s = t === G && i !== G || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, r = t !== G && (i === G || s);
    s && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class $m {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    oi(this, t);
  }
}
const Hm = so.litHtmlPolyfillSupport;
Hm?.(Wi, Gi), (so.litHtmlVersions ??= []).push("3.3.2");
const Vm = (n, t, e) => {
  const i = e?.renderBefore ?? t;
  let s = i._$litPart$;
  if (s === void 0) {
    const r = e?.renderBefore ?? null;
    i._$litPart$ = s = new Gi(t.insertBefore(Vi(), r), r, void 0, e ?? {});
  }
  return s._$AI(n), s;
};
const oo = globalThis;
class Ti extends Fe {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Vm(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return ri;
  }
}
Ti._$litElement$ = !0, Ti.finalized = !0, oo.litElementHydrateSupport?.({ LitElement: Ti });
const Fm = oo.litElementPolyfillSupport;
Fm?.({ LitElement: Ti });
(oo.litElementVersions ??= []).push("4.2.2");
const Wm = { attribute: !0, type: String, converter: Fn, reflect: !1, hasChanged: no }, _m = (n = Wm, t, e) => {
  const { kind: i, metadata: s } = e;
  let r = globalThis.litPropertyMetadata.get(s);
  if (r === void 0 && globalThis.litPropertyMetadata.set(s, r = /* @__PURE__ */ new Map()), i === "setter" && ((n = Object.create(n)).wrapped = !0), r.set(e.name, n), i === "accessor") {
    const { name: o } = e;
    return { set(l) {
      const a = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(o, a, n, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(o, void 0, n, l), l;
    } };
  }
  if (i === "setter") {
    const { name: o } = e;
    return function(l) {
      const a = this[o];
      t.call(this, l), this.requestUpdate(o, a, n, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function Vt(n) {
  return (t, e) => typeof e == "object" ? _m(n, t, e) : ((i, s, r) => {
    const o = s.hasOwnProperty(r);
    return s.constructor.createProperty(r, i), o ? Object.getOwnPropertyDescriptor(s, r) : void 0;
  })(n, t, e);
}
function os(n) {
  return Vt({ ...n, state: !0, attribute: !1 });
}
const zm = (n, t, e) => (e.configurable = !0, e.enumerable = !0, Reflect.decorate && typeof t != "object" && Object.defineProperty(n, t, e), e);
function Sc(n, t) {
  return (e, i, s) => {
    const r = (o) => o.renderRoot?.querySelector(n) ?? null;
    return zm(e, i, { get() {
      return r(this);
    } });
  };
}
const Um = wm`
  :host {
    --interlis-lab-border-color: var(--ng-200, #d4d4d4);
    --interlis-lab-border-strong: var(--ng-100, #e5e5e5);
    --interlis-lab-background: var(--ng-white, #ffffff);
    --interlis-lab-panel-background: var(--ng-50, #f5f5f5);
    --interlis-lab-text-color: var(--ng-700, #262626);
    --interlis-lab-muted-color: var(--ng-400, #737373);
    --interlis-lab-success-color: var(--color-link, #0366d6);
    --interlis-lab-error-color: #b42318;
    --interlis-lab-warning-color: #9a6700;
    --interlis-lab-accent-color: var(--color-link, #0366d6);
    --interlis-lab-radius: 0;
    --interlis-lab-font-family: system-ui, sans-serif;
    --interlis-lab-monospace-font: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    --interlis-lab-control-row-height: 3.85rem;
    color: var(--interlis-lab-text-color);
    display: block;
    font-family: var(--interlis-lab-font-family);
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  h2,
  h3,
  h4,
  p {
    margin: 0;
  }

  .shell {
    background: var(--interlis-lab-background);
    border: 1px solid var(--interlis-lab-border-color);
    border-radius: var(--interlis-lab-radius);
    overflow: hidden;
  }

  .section {
    padding: 1rem 1.25rem;
  }

  .lab-header {
    align-items: start;
    border-bottom: 1px solid var(--interlis-lab-border-color);
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    padding: 1.1rem 1.25rem 1rem;
  }

  .title-stack {
    display: grid;
    gap: 0.35rem;
    min-width: 0;
  }

  .eyebrow,
  .panel-label {
    color: var(--interlis-lab-muted-color);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0;
    text-transform: uppercase;
  }

  h2 {
    font-size: 1.28rem;
    line-height: 1.25;
  }

  .meta-row {
    color: var(--interlis-lab-muted-color);
    display: flex;
    flex-wrap: wrap;
    font-size: 0.82rem;
    gap: 0.4rem 0.7rem;
  }

  .status-line {
    align-items: center;
    color: var(--interlis-lab-muted-color);
    display: inline-flex;
    flex: 0 0 auto;
    font-size: 0.86rem;
    font-weight: 650;
    gap: 0.45rem;
    padding-top: 0.15rem;
    white-space: nowrap;
  }

  .status-dot {
    background: currentColor;
    border-radius: var(--interlis-lab-radius);
    height: 0.55rem;
    width: 0.55rem;
  }

  .status-line[data-status='ready'],
  .status-line[data-status='running'] {
    color: var(--interlis-lab-accent-color);
  }

  .status-line[data-status='success'] {
    color: var(--interlis-lab-success-color);
  }

  .status-line[data-status='failed'],
  .status-line[data-status='error'] {
    color: var(--interlis-lab-error-color);
  }

  .workbench {
    display: grid;
    gap: 0;
  }

  .lesson-panel {
    background: var(--interlis-lab-panel-background);
    border-bottom: 1px solid var(--interlis-lab-border-color);
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    min-width: 0;
    padding: 1.1rem 1.25rem;
  }

  .lesson-panel h3 {
    font-size: 1.05rem;
    line-height: 1.5;
  }

  .lesson-context {
    display: grid;
    gap: 0.95rem;
  }

  .lesson-context section {
    display: grid;
    gap: 0.3rem;
  }

  .lesson-context h4 {
    color: var(--interlis-lab-muted-color);
    font-size: 0.8rem;
    font-weight: 700;
  }

  .lesson-context p,
  .compiler-output-empty {
    color: var(--interlis-lab-muted-color);
    line-height: 1.6;
  }

  .workspace {
    align-self: stretch;
    background: var(--interlis-lab-background);
    display: grid;
    grid-template-rows: minmax(0, 1fr) auto minmax(13rem, auto);
    min-width: 0;
  }

  .workspace > * + * {
    border-top: 1px solid var(--interlis-lab-border-color);
  }

  .editor-frame {
    --interlis-lab-editor-gutter-width: 0px;
    --interlis-lab-editor-gutter-divider-width: 0px;
    background: var(--interlis-lab-background);
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    min-height: 0;
    overflow: hidden;
  }

  .editor-header {
    background: var(--interlis-lab-panel-background);
    border-bottom: 1px solid var(--interlis-lab-border-color);
    color: var(--interlis-lab-muted-color);
    display: grid;
    font-size: 0.78rem;
    grid-template-columns: var(--interlis-lab-editor-gutter-width) minmax(0, 1fr);
    min-width: 0;
  }

  .editor-header-gutter {
    border-right: var(--interlis-lab-editor-gutter-divider-width) solid var(--interlis-lab-border-color);
    min-width: 0;
  }

  .editor-header-main {
    align-items: flex-end;
    display: flex;
    gap: 0.75rem;
    justify-content: space-between;
    min-width: 0;
    padding: 0.55rem 0.75rem 0 0;
  }

  .editor-tabs {
    display: flex;
    flex: 1 1 auto;
    gap: 0;
    margin-bottom: -2px;
    min-width: 0;
    overflow-x: auto;
    overflow-y: visible;
    padding-bottom: 2px;
  }

  .editor-tabs .editor-tab {
    background: transparent;
    border-color: transparent;
    border-style: solid;
    border-width: 0;
    border-radius: var(--interlis-lab-radius);
    box-sizing: border-box;
    color: var(--interlis-lab-muted-color);
    display: inline-flex;
    align-items: center;
    font-size: 0.82rem;
    font-weight: 700;
    min-height: 0;
    min-width: 0;
    padding: 0.45rem 0.7rem 0.5rem;
    position: relative;
  }

  .editor-tabs .editor-tab:hover:not(:disabled) {
    background: rgba(3, 102, 214, 0.06);
    border-bottom-color: transparent;
    border-left-color: transparent;
    border-right-color: var(--interlis-lab-border-color);
    border-top-color: var(--interlis-lab-border-color);
    color: var(--interlis-lab-accent-color);
  }

  .editor-tabs .editor-tab[aria-selected='true'] {
    background: var(--interlis-lab-background);
    color: var(--interlis-lab-text-color);
    z-index: 1;
  }

  .editor-tabs .editor-tab[aria-selected='true']::after {
    background: var(--interlis-lab-background);
    bottom: -1px;
    content: '';
    height: 2px;
    left: 0;
    pointer-events: none;
    position: absolute;
    right: 0;
  }

  .editor-tabs .editor-tab[data-view='exercise'] {
    border-top: 1px solid var(--interlis-lab-border-color);
    border-right: 1px solid var(--interlis-lab-border-color);
    border-bottom-width: 0;
    border-left-width: 0;
  }

  .editor-tabs .editor-tab[data-view='solution'] {
    border-top: 1px solid var(--interlis-lab-border-color);
    border-right: 1px solid var(--interlis-lab-border-color);
    border-bottom-width: 0;
    border-left-width: 0;
  }

  .editor-frame[data-view='solution'] .editor-tabs .editor-tab[data-view='solution'][aria-selected='true'] {
    border-left-width: 1px;
  }

  .editor-frame[data-view='solution'] .editor-tabs .editor-tab[data-view='solution'][aria-selected='true']::after {
    left: -1px;
  }

  .editor-frame[data-view='solution'] .editor-tabs .editor-tab[aria-selected='true'] {
    color: var(--interlis-lab-accent-color);
  }

  .editor-mode {
    flex: 0 0 auto;
    padding-bottom: 0.55rem;
  }

  .editor-host {
    height: 100%;
    min-height: 18rem;
    position: relative;
  }

  .native-editor {
    background: var(--interlis-lab-background);
    border: none;
    color: var(--interlis-lab-text-color);
    display: block;
    font-family: var(--interlis-lab-monospace-font);
    font-size: 0.9rem;
    height: 100%;
    line-height: 1.55;
    min-height: 18rem;
    outline: none;
    padding: 1rem;
    resize: none;
    width: 100%;
  }

  .native-editor[data-editor='codemirror'] {
    height: 1px;
    left: 0;
    min-height: 0;
    opacity: 0;
    overflow: hidden;
    padding: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
    width: 1px;
  }

  .native-editor::placeholder {
    color: var(--interlis-lab-muted-color);
  }

  .native-editor[readonly] {
    opacity: 0.82;
  }

  .cm-editor {
    height: 100%;
    min-height: 18rem;
  }

  .toolbar {
    align-items: center;
    display: flex;
    flex-wrap: nowrap;
    gap: 0.55rem;
    height: var(--interlis-lab-control-row-height);
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0 1rem;
  }

  button {
    appearance: none;
    background: #ffffff;
    border: 1px solid var(--interlis-lab-border-strong);
    border-radius: var(--interlis-lab-radius);
    color: var(--interlis-lab-text-color);
    cursor: pointer;
    font: inherit;
    font-size: 0.9rem;
    font-weight: 650;
    min-height: 2.35rem;
    min-width: 7rem;
    padding: 0.55rem 0.85rem;
    transition:
      background-color 140ms ease,
      border-color 140ms ease,
      color 140ms ease;
  }

  button:hover:not(:disabled) {
    background: #f0f6ff;
    border-color: var(--interlis-lab-accent-color);
    color: var(--interlis-lab-accent-color);
  }

  button:focus-visible {
    outline: 2px solid rgba(3, 102, 214, 0.35);
    outline-offset: 2px;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.48;
  }

  .primary {
    background: var(--interlis-lab-accent-color);
    border-color: var(--interlis-lab-accent-color);
    color: #ffffff;
  }

  .primary:hover:not(:disabled) {
    background: #0256b6;
    color: #ffffff;
  }

  .compiler-output {
    background: var(--interlis-lab-background);
    display: grid;
    gap: 0;
    grid-template-rows: auto minmax(0, 1fr);
    min-height: 13rem;
    min-width: 0;
  }

  .compiler-output-header {
    align-items: center;
    background: var(--interlis-lab-panel-background);
    border-bottom: 1px solid var(--interlis-lab-border-color);
    color: var(--interlis-lab-muted-color);
    display: flex;
    font-size: 0.78rem;
    gap: 0.5rem;
    height: var(--interlis-lab-control-row-height);
    justify-content: space-between;
    min-width: 0;
    padding: 0 0.75rem;
    white-space: nowrap;
  }

  .compiler-output-header[data-tone='failed'],
  .compiler-output-header[data-tone='error'] {
    color: var(--interlis-lab-error-color);
  }

  .compiler-output-header[data-tone='ready'],
  .compiler-output-header[data-tone='running'],
  .compiler-output-header[data-tone='success'] {
    color: var(--interlis-lab-accent-color);
  }

  .compiler-output-title {
    color: var(--interlis-lab-text-color);
    flex: 0 0 auto;
    font-weight: 700;
  }

  .compiler-output-header span:last-child {
    overflow: hidden;
    text-align: right;
    text-overflow: ellipsis;
  }

  pre {
    background: #111827;
    border-radius: var(--interlis-lab-radius);
    color: #dbe7ff;
    font-family: var(--interlis-lab-monospace-font);
    font-size: 0.85rem;
    margin: 0.65rem 0 0;
    overflow: auto;
    padding: 0.75rem;
    white-space: pre-wrap;
  }

  .compiler-output-body {
    background: #111827;
    margin: 0;
    max-height: 18rem;
    min-height: 8rem;
    overflow: auto;
  }

  .compiler-output-body pre {
    background: transparent;
    display: block;
    margin: 0;
  }

  .compiler-output-body pre + pre {
    border-top: 1px solid rgba(219, 231, 255, 0.2);
  }

  .compiler-output-empty {
    background: var(--interlis-lab-background);
    padding: 0.85rem 1rem;
  }

  .empty-state {
    color: var(--interlis-lab-muted-color);
    line-height: 1.6;
  }

  @media (min-width: 900px) {
    .workbench {
      align-items: stretch;
      grid-template-columns: minmax(16rem, 1fr) minmax(0, 2fr);
    }

    .lesson-panel {
      border-bottom: none;
      border-right: 1px solid var(--interlis-lab-border-color);
    }
  }

  @media (max-width: 720px) {
    .lab-header {
      align-items: stretch;
      flex-direction: column;
      padding: 1rem;
    }

    .status-line {
      align-self: flex-start;
    }

    .section,
    .lesson-panel {
      padding: 0.9rem;
    }

    .editor-host,
    .native-editor,
    .cm-editor {
      min-height: 17rem;
    }

    .workspace {
      grid-template-rows: auto auto auto;
    }
  }
`;
var jm = Object.defineProperty, ct = (n, t, e, i) => {
  for (var s = void 0, r = n.length - 1, o; r >= 0; r--)
    (o = n[r]) && (s = o(t, e, s) || s);
  return s && jm(t, e, s), s;
};
const qm = {
  status: "idle",
  code: "",
  visibleHintCount: 0,
  solutionVisible: !1,
  dirty: !1
};
function Ls() {
  return {
    exercise: { status: "ready" },
    solution: { status: "ready" }
  };
}
const lo = class lo extends Ti {
  constructor() {
    super(...arguments), this.readonly = !1, this.showSolution = !1, this.runner = "mock", this.theme = "auto", this.labState = qm, this.editorView = "exercise", this.initializedRunners = /* @__PURE__ */ new WeakSet(), this.lessonRequestToken = 0, this.viewRunStates = Ls(), this.handleEditorTabClick = (t) => {
      const i = t.currentTarget.dataset.view;
      !i || i === this.editorView || i === "solution" && !this.isSolutionRevealed() || (this.editorView = i);
    }, this.handleEditorInput = (t) => {
      if (!this.activeLesson || this.isShowingSolutionView(this.activeLesson))
        return;
      const e = t.currentTarget;
      this.labState = {
        ...this.labState,
        code: e.value,
        dirty: e.value !== this.activeLesson.initialCode
      }, this.persistCode(e.value);
    }, this.handleSolution = () => {
      const t = this.activeLesson;
      !t?.solution || this.isSolutionRevealed(t) || (this.labState = $c(this.labState), this.editorView = "solution", this.dispatchEvent(
        ve(we.solutionShown, {
          lessonId: t.id
        })
      ));
    }, this.handleReset = () => {
      const t = this.activeLesson;
      t && (this.editorView = "exercise", this.viewRunStates = Ls(), this.clearStoredCode(), this.labState = co(t, {
        code: t.initialCode,
        showSolution: !1
      }), this.dispatchEvent(
        ve(we.reset, {
          lessonId: t.id
        })
      ));
    }, this.handleRun = async () => {
      const t = this.activeLesson;
      if (!t)
        return;
      const e = this.getCompileCode(t), i = this.editorView;
      try {
        const s = await this.getRunner();
        s.init && !this.initializedRunners.has(s) && (await s.init(), this.initializedRunners.add(s)), this.labState = Ic(this.labState), this.setViewRunState(i, {
          ...this.viewRunStates[i],
          status: "running",
          error: void 0
        }), this.dispatchEvent(
          ve(we.runStart, {
            lessonId: t.id
          })
        );
        const r = await s.compile({
          code: e,
          lessonId: t.id,
          files: t.files
        });
        this.labState = Nc(
          this.labState,
          r,
          r.ok ? ot.statusSuccess : ot.statusFailed
        ), this.setViewRunState(i, {
          status: r.ok ? "success" : "failed",
          lastResult: r,
          error: void 0
        }), this.dispatchEvent(
          ve(we.runComplete, {
            lessonId: t.id,
            ok: r.ok,
            diagnostics: r.diagnostics,
            durationMs: r.durationMs
          })
        );
      } catch (s) {
        this.reportError(this.toFriendlyMessage(s, t.id), t.id, i);
      }
    };
  }
  disconnectedCallback() {
    this.disconnectGutterResizeObserver(), this.editorAdapter?.dispose(), this.editorAdapter = void 0, this.disposeResolvedRunner(), super.disconnectedCallback();
  }
  willUpdate(t) {
    if (t.has("lesson") && this.lesson && this.applyPreparedLesson(this.lesson), t.has("showSolution") && this.activeLesson) {
      const e = this.showSolution && !!this.activeLesson.solution;
      this.labState = {
        ...this.labState,
        solutionVisible: e
      }, this.editorView = e ? "solution" : "exercise";
    }
  }
  updated(t) {
    t.has("lesson") && !this.lesson && this.src && this.loadLesson(), t.has("lesson") && this.lesson && this.activeLesson && this.dispatchEvent(
      ve(we.ready, {
        lessonId: this.activeLesson.id
      })
    ), t.has("src") && !this.lesson && this.src && this.loadLesson(), (t.has("runner") || t.has("runnerInstance") || t.has("ili2cJarUrl") || t.has("cheerpjLoaderUrl")) && this.disposeResolvedRunner(), this.syncEditorAdapter(), this.syncEditorTabAlignment();
  }
  render() {
    const t = this.activeLesson;
    if (this.loadMessage)
      return Rt`
        <section class="shell">
          <div class="section">
            <h2>INTERLIS Lab</h2>
            <p class="empty-state">${this.loadMessage}</p>
          </div>
        </section>
      `;
    if (!t)
      return Rt`
        <section class="shell">
          <div class="section">
            <h2>INTERLIS Lab</h2>
            <p class="empty-state">Noch keine Lesson geladen.</p>
          </div>
        </section>
      `;
    const e = this.getCurrentViewRunState(), i = this.getStatusLabel(e.status), s = e.lastResult, r = this.isShowingSolutionView(t), o = this.isSolutionRevealed(t), l = this.getEditorValue(t), a = this.readonly || r, h = this.getActiveTabId(), c = e.status;
    return Rt`
      <section class="shell" data-theme=${this.theme}>
        <header class="lab-header">
          <div class="title-stack">
            <p class="eyebrow">INTERLIS Lab</p>
            <h2>${t.title}</h2>
            ${t.level ? Rt`
                  <div class="meta-row">
                    <span>Niveau ${t.level}</span>
                  </div>
                ` : G}
          </div>
          <div class="status-line" data-status=${c} aria-live="polite">
            <span class="status-dot" aria-hidden="true"></span>
            <span>${i}</span>
          </div>
        </header>

        <div class="workbench">
          <aside class="lesson-panel" aria-label="Aufgabe">
            <p class="panel-label">Aufgabe</p>
            <h3>${t.task}</h3>
            <div class="lesson-context">
              <section>
                <h4>Ziel</h4>
                <p>${t.goal}</p>
              </section>
              ${t.explanation ? Rt`
                    <section>
                      <h4>Kurz erklärt</h4>
                      <p>${t.explanation}</p>
                    </section>
                  ` : G}
            </div>
          </aside>

          <div class="workspace">
            <div class="editor-frame" data-view=${this.editorView}>
              <div class="editor-header">
                <div class="editor-header-gutter" aria-hidden="true"></div>
                <div class="editor-header-main">
                  <div class="editor-tabs" role="tablist" aria-label="Editor-Ansichten">
                    ${this.renderEditorTab("exercise", ot.exerciseTab)}
                    ${o ? this.renderEditorTab("solution", ot.solutionTab) : G}
                  </div>
                  <span class="editor-mode">${a ? "Nur Lesen" : "Bearbeitbar"}</span>
                </div>
              </div>
              <div
                id="interlis-editor-panel"
                class="editor-host"
                role="tabpanel"
                aria-labelledby=${h}
              >
                <textarea
                  id="interlis-editor"
                  class="native-editor"
                  .value=${l}
                  ?readonly=${a}
                  spellcheck="false"
                  autocapitalize="off"
                  autocomplete="off"
                  aria-label="INTERLIS-Code Editor"
                  placeholder="INTERLIS 2.3; ..."
                  @input=${this.handleEditorInput}
                ></textarea>
              </div>
            </div>

            <div class="toolbar" role="toolbar" aria-label="Aktionen">
              <button
                class="primary"
                type="button"
                ?disabled=${this.labState.status === "running"}
                @click=${this.handleRun}
              >
                ${ot.run}
              </button>
              <button
                type="button"
                ?disabled=${this.labState.status === "running" || !t.solution || o}
                @click=${this.handleSolution}
              >
                ${ot.showSolution}
              </button>
              <button
                type="button"
                ?disabled=${this.labState.status === "running"}
                @click=${this.handleReset}
              >
                ${ot.reset}
              </button>
            </div>

            ${this.renderCompilerOutput(i, s, e)}
          </div>
        </div>
      </section>
    `;
  }
  renderEditorTab(t, e) {
    const i = this.editorView === t;
    return Rt`
      <button
        class="editor-tab"
        data-view=${t}
        type="button"
        role="tab"
        id=${t === "solution" ? "interlis-editor-tab-solution" : "interlis-editor-tab-exercise"}
        aria-selected=${i ? "true" : "false"}
        aria-controls="interlis-editor-panel"
        tabindex=${i ? "0" : "-1"}
        ?disabled=${this.labState.status === "running"}
        @click=${this.handleEditorTabClick}
      >
        ${e}
      </button>
    `;
  }
  renderCompilerOutput(t, e, i) {
    const s = !!(e?.stdout || e?.stderr), r = i.error ?? (e ? "Kein Compiler-Output für diesen Lauf." : "Noch kein Compiler-Lauf. Klicke Compile, um die Ausgabe hier zu sehen.");
    return Rt`
      <section class="compiler-output" aria-label=${ot.rawOutput}>
        <div class="compiler-output-header" data-tone=${i.status}>
          <span class="compiler-output-title">${ot.rawOutput}</span>
          <span>${t}</span>
        </div>
        ${s ? Rt`
              <div class="compiler-output-body">
                ${e?.stdout ? Rt`<pre>${e.stdout}</pre>` : G}
                ${e?.stderr ? Rt`<pre>${e.stderr}</pre>` : G}
              </div>
            ` : Rt`<p class="compiler-output-empty">${r}</p>`}
      </section>
    `;
  }
  getStatusLabel(t = this.getCurrentViewRunState().status) {
    switch (t) {
      case "loading":
        return ot.statusLoading;
      case "ready":
        return ot.statusReady;
      case "running":
        return ot.statusRunning;
      case "success":
        return ot.statusSuccess;
      case "failed":
        return ot.statusFailed;
      case "error":
        return ot.statusError;
      default:
        return ot.statusIdle;
    }
  }
  syncEditorAdapter() {
    if (!this.textarea)
      return;
    this.editorAdapter || (this.editorAdapter = new tm(this.textarea));
    const t = this.activeLesson, e = t ? this.getEditorValue(t) : this.labState.code, i = this.readonly || this.isShowingSolutionView(t), s = this.getCurrentViewRunState().lastResult?.diagnostics ?? [];
    this.editorAdapter.setValue(e), this.editorAdapter.setReadOnly?.(i), this.editorAdapter.setDiagnostics(s);
  }
  syncEditorTabAlignment() {
    const t = this.editorFrame;
    if (!t) {
      this.disconnectGutterResizeObserver();
      return;
    }
    const e = t.querySelector(".cm-gutters");
    e !== this.observedGutters && (this.observedGutters && this.gutterResizeObserver && this.gutterResizeObserver.unobserve(this.observedGutters), this.observedGutters = e ?? void 0, e && typeof ResizeObserver < "u" && (this.gutterResizeObserver ??= new ResizeObserver(() => {
      this.updateEditorTabAlignmentMetrics();
    }), this.gutterResizeObserver.observe(e))), this.updateEditorTabAlignmentMetrics();
  }
  updateEditorTabAlignmentMetrics() {
    if (!this.editorFrame)
      return;
    const t = this.editorFrame.querySelector(".cm-gutters"), e = t?.getBoundingClientRect().width ?? 0;
    this.editorFrame.style.setProperty("--interlis-lab-editor-gutter-width", `${e}px`), this.editorFrame.style.setProperty(
      "--interlis-lab-editor-gutter-divider-width",
      t ? "1px" : "0px"
    );
  }
  disconnectGutterResizeObserver() {
    this.observedGutters && this.gutterResizeObserver && this.gutterResizeObserver.unobserve(this.observedGutters), this.gutterResizeObserver?.disconnect(), this.gutterResizeObserver = void 0, this.observedGutters = void 0;
  }
  async applyLesson(t) {
    try {
      const e = this.applyPreparedLesson(t);
      await this.updateComplete, this.dispatchEvent(
        ve(we.ready, {
          lessonId: e.id
        })
      );
    } catch (e) {
      this.reportError(this.toFriendlyMessage(e), this.activeLesson?.id);
    }
  }
  async loadLesson() {
    if (!this.src)
      return;
    const t = ++this.lessonRequestToken;
    this.loadMessage = void 0, this.labState = Pc(this.labState);
    try {
      const e = await Bc(this.src);
      if (t !== this.lessonRequestToken)
        return;
      await this.applyLesson(e);
    } catch (e) {
      if (t !== this.lessonRequestToken)
        return;
      const i = this.toFriendlyMessage(e);
      this.activeLesson = void 0, this.loadMessage = `${i} Prüfe, ob die Datei ${this.src} existiert und gültiges JSON enthält.`, this.reportError(this.loadMessage);
    }
  }
  async getRunner() {
    const t = this.runnerInstance ? `instance:${this.runnerInstance.id}` : `named:${this.runner}:ili2c=${this.ili2cJarUrl ?? ""}:loader=${this.cheerpjLoaderUrl ?? ""}`;
    return this.resolvedRunner && this.resolvedRunnerKey === t ? this.resolvedRunner : (await this.disposeResolvedRunner(), this.resolvedRunner = this.runnerInstance ?? this.createRunnerFromName(this.runner), this.resolvedRunnerKey = t, this.resolvedRunner);
  }
  createRunnerFromName(t) {
    return t === "cheerpj" ? new bm({
      cheerpjLoaderUrl: this.cheerpjLoaderUrl,
      ili2cJarUrl: this.ili2cJarUrl
    }) : new nm();
  }
  async disposeResolvedRunner() {
    if (!this.resolvedRunner?.dispose) {
      this.resolvedRunner = void 0, this.resolvedRunnerKey = void 0;
      return;
    }
    await this.resolvedRunner.dispose(), this.resolvedRunner = void 0, this.resolvedRunnerKey = void 0;
  }
  reportError(t, e, i = this.editorView) {
    this.labState = Hc(this.labState, t), this.activeLesson && this.setViewRunState(i, {
      ...this.viewRunStates[i],
      status: "error",
      error: t
    }), this.dispatchEvent(
      ve(we.error, {
        lessonId: e,
        message: t
      })
    );
  }
  persistCode(t) {
    if (this.storageKey)
      try {
        localStorage.setItem(this.storageKey, t);
      } catch {
      }
  }
  readStoredCode() {
    if (this.storageKey)
      try {
        return localStorage.getItem(this.storageKey) ?? void 0;
      } catch {
        return;
      }
  }
  clearStoredCode() {
    if (this.storageKey)
      try {
        localStorage.removeItem(this.storageKey);
      } catch {
      }
  }
  toFriendlyMessage(t, e) {
    return t instanceof Error ? e ? `Fehler in Lesson ${e}: ${t.message}` : t.message : e ? `Fehler in Lesson ${e}.` : "Unbekannter Fehler.";
  }
  applyPreparedLesson(t) {
    const e = zl(t), i = this.readStoredCode() ?? e.initialCode, s = this.showSolution && !!e.solution;
    return this.activeLesson = e, this.loadMessage = void 0, this.editorView = s ? "solution" : "exercise", this.viewRunStates = Ls(), this.labState = co(e, {
      code: i,
      showSolution: s
    }), e;
  }
  getEditorValue(t) {
    return this.isShowingSolutionView(t) ? t.solution ?? this.labState.code : this.labState.code;
  }
  getCompileCode(t) {
    return this.getEditorValue(t);
  }
  getCurrentViewRunState() {
    return this.viewRunStates[this.editorView];
  }
  setViewRunState(t, e) {
    this.viewRunStates = {
      ...this.viewRunStates,
      [t]: e
    };
  }
  getActiveTabId() {
    return this.isShowingSolutionView() ? "interlis-editor-tab-solution" : "interlis-editor-tab-exercise";
  }
  isSolutionRevealed(t = this.activeLesson) {
    return !!t?.solution && this.labState.solutionVisible;
  }
  isShowingSolutionView(t = this.activeLesson) {
    return this.editorView === "solution" && !!t?.solution;
  }
};
lo.styles = [Um];
let et = lo;
ct([
  Vt({ type: String })
], et.prototype, "src");
ct([
  Vt({ type: Boolean })
], et.prototype, "readonly");
ct([
  Vt({ type: Boolean, attribute: "show-solution" })
], et.prototype, "showSolution");
ct([
  Vt({ type: String, attribute: "storage-key" })
], et.prototype, "storageKey");
ct([
  Vt({ type: String })
], et.prototype, "runner");
ct([
  Vt({ type: String, attribute: "ili2c-jar-url" })
], et.prototype, "ili2cJarUrl");
ct([
  Vt({ type: String, attribute: "cheerpj-loader-url" })
], et.prototype, "cheerpjLoaderUrl");
ct([
  Vt({ type: String })
], et.prototype, "theme");
ct([
  Vt({ attribute: !1 })
], et.prototype, "lesson");
ct([
  Vt({ attribute: !1 })
], et.prototype, "runnerInstance");
ct([
  os()
], et.prototype, "activeLesson");
ct([
  os()
], et.prototype, "labState");
ct([
  os()
], et.prototype, "loadMessage");
ct([
  os()
], et.prototype, "editorView");
ct([
  Sc(".editor-frame")
], et.prototype, "editorFrame");
ct([
  Sc("#interlis-editor")
], et.prototype, "textarea");
customElements.get("interlis-lab") || customElements.define("interlis-lab", et);
export {
  bm as CheerpJInterlisRunner,
  tm as CodeMirrorEditorAdapter,
  et as InterlisLabElement,
  nm as MockInterlisRunner,
  Vc as TextareaEditorAdapter,
  Xm as buildInterlisDiff,
  Nc as completeInterlisLabRun,
  ve as createInterlisLabEvent,
  co as createInterlisLabState,
  Pc as createLoadingState,
  ot as defaultLabels,
  Km as evaluateInterlisLessonChecks,
  Hc as failInterlisLabState,
  Mc as formatDiagnosticLocation,
  Ym as formatDiagnosticMessage,
  Gm as getHighestDiagnosticSeverity,
  Jm as hasErrorDiagnostics,
  we as interlisLabEvents,
  Bc as loadInterlisLabLesson,
  mm as parseIli2cDiagnostics,
  zl as parseInterlisLabLesson,
  $c as revealInterlisLabSolution,
  Qm as revealNextInterlisLabHint,
  Ic as startInterlisLabRun,
  Zm as updateInterlisLabCode
};
//# sourceMappingURL=interlis-lab.js.map
