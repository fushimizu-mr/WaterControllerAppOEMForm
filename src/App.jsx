import { useState } from "react";

// ─── Configuration ────────────────────────────────────────────────────────────
// Replace with your Formspree form ID after creating one at https://formspree.io
// e.g. "https://formspree.io/f/xyzabcde"
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xaqrykek";

// ─── Sections ─────────────────────────────────────────────────────────────────
const SECTIONS = [
  { id: "app-info",       label: "App Information",  icon: "⚙" },
  { id: "dealer-info",    label: "OEM Profile",   icon: "🏢" },
  { id: "branding",       label: "Branding & Theme", icon: "🎨" },
  { id: "filter-catalog", label: "Filter Catalog",   icon: "🔬" },
  { id: "documentation",  label: "Documentation",    icon: "📄" },
];

const PROGRAMMING_MODES = [
  { id: "passive",          label: "Passive Monitor",   desc: "Track usage, no automated actions" },
  { id: "active",           label: "Active Monitor",    desc: "Monitor and alert on thresholds" },
  { id: "continuous_flush", label: "Continuous Flush",  desc: "Run flush cycle continuously" },
  { id: "periodic_flush",   label: "Periodic Flush",    desc: "Flush on a set schedule" },
];

const FLOW_METER_TYPES = [
  'Savant FS-6600H (Hall Effect, 3/4" BSP)',
  'Clack WS1 Inline (1", 66 pulse/gal)',
  "Custom / Other",
];

const DOC_TYPES = [
  "Cutsheet",
  "Installation Guide",
  "Owner's Manual",
  "Technical Spec",
  "Safety Data Sheet",
  "NSF Certificate",
  "Warranty",
  "Quick Start Guide",
  "Other",
];

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  navy:      "#0B1F3A",
  slate:     "#2A5A8C",
  teal:      "#00A896",
  glacier:   "#E8F4FD",
  amber:     "#F4A620",
  white:     "#FFFFFF",
  lightGray: "#F7FAFD",
  midGray:   "#D0DDE8",
  ink:       "#1A1F2E",
  muted:     "#6B7A8D",
  inputBg:   "#F7FAFD",
};

// ─── Base UI primitives ───────────────────────────────────────────────────────
function Label({ children, required }) {
  return (
    <label style={{ display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: T.muted, marginBottom: 6 }}>
      {children}{required && <span style={{ color: T.amber, marginLeft: 3 }}>*</span>}
    </label>
  );
}

function Input({ style, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      {...props}
      style={{
        width: "100%", boxSizing: "border-box", background: T.inputBg,
        border: `1.5px solid ${focused ? T.teal : T.midGray}`, borderRadius: 8,
        padding: "10px 14px", fontSize: 14, color: T.ink, outline: "none",
        fontFamily: "inherit", transition: "border-color 0.15s", ...style,
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

function Textarea({ style, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      {...props}
      style={{
        width: "100%", boxSizing: "border-box", background: T.inputBg,
        border: `1.5px solid ${focused ? T.teal : T.midGray}`, borderRadius: 8,
        padding: "10px 14px", fontSize: 14, color: T.ink, outline: "none",
        fontFamily: "inherit", resize: "vertical", minHeight: 90,
        transition: "border-color 0.15s", ...style,
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

function Select({ children, style, ...props }) {
  return (
    <select
      {...props}
      style={{
        width: "100%", boxSizing: "border-box", background: T.inputBg,
        border: `1.5px solid ${T.midGray}`, borderRadius: 8,
        padding: "10px 14px", fontSize: 14, color: T.ink, outline: "none",
        fontFamily: "inherit", cursor: "pointer", ...style,
      }}
    >
      {children}
    </select>
  );
}

function FieldGroup({ children, columns = 1 }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 16, marginBottom: 20 }}>
      {children}
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      {children}
    </div>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <div style={{ borderBottom: `2px solid ${T.glacier}`, paddingBottom: 16, marginBottom: 28 }}>
      <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: T.navy }}>{title}</h2>
      {subtitle && <p style={{ margin: "6px 0 0", fontSize: 13, color: T.muted }}>{subtitle}</p>}
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div style={{ background: T.white, borderRadius: 12, border: `1.5px solid ${T.midGray}`, padding: 24, ...style }}>
      {children}
    </div>
  );
}

function Chip({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "6px 14px", borderRadius: 20, fontFamily: "inherit",
        border: `1.5px solid ${active ? T.teal : T.midGray}`,
        background: active ? T.glacier : T.inputBg,
        color: active ? T.teal : T.muted,
        fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
      }}
    >
      {label}
    </button>
  );
}

function ImageUrlField({ label, aspectHint, value, onChange }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input
        type="url"
        value={value || ""}
        onChange={onChange}
        placeholder="https://drive.google.com/... or https://dropbox.com/..."
      />
      {aspectHint && (
        <div style={{ fontSize: 11, color: "#9AAABB", marginTop: 4 }}>
          {aspectHint} — upload to Google Drive or Dropbox and paste the share link.
        </div>
      )}
    </div>
  );
}

// ─── Filter Card ──────────────────────────────────────────────────────────────
function FilterCard({ index, filter, onChange, onRemove }) {
  const update = (key, val) => onChange(index, { ...filter, [key]: val });
  const toggleMode = (mode) => {
    const modes = filter.programmingModes || [];
    onChange(index, {
      ...filter,
      programmingModes: modes.includes(mode) ? modes.filter(m => m !== mode) : [...modes, mode],
    });
  };
  const [open, setOpen] = useState(index === 0);

  return (
    <Card style={{ marginBottom: 16 }}>
      <div
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}
        onClick={() => setOpen(o => !o)}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: T.navy }}>
            {filter.name || `Filter / Cartridge ${index + 1}`}
          </div>
          {filter.modelNumber && (
            <div style={{ fontSize: 11, fontFamily: "monospace", color: T.muted, marginTop: 2 }}>
              {filter.modelNumber}
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 18, color: T.muted }}>{open ? "▲" : "▼"}</span>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onRemove(index); }}
            style={{ background: "none", border: "none", color: "#9AAABB", cursor: "pointer", fontSize: 18, padding: 0 }}
          >
            ✕
          </button>
        </div>
      </div>

      {open && (
        <div style={{ marginTop: 20 }}>
          <FieldGroup columns={2}>
            <Field label="Name" required>
              <Input value={filter.name || ""} onChange={e => update("name", e.target.value)} placeholder="e.g. ProGuard Carbon Block" />
            </Field>
            <Field label="Subtitle">
              <Input value={filter.subtitle || ""} onChange={e => update("subtitle", e.target.value)} placeholder="e.g. Stage 1 Sediment Reduction" />
            </Field>
          </FieldGroup>
          <FieldGroup columns={2}>
            <Field label="Model Number" required>
              <Input value={filter.modelNumber || ""} onChange={e => update("modelNumber", e.target.value)} placeholder="e.g. PG-CB-10" style={{ fontFamily: "monospace" }} />
            </Field>
            <Field label="Filtration Level">
              <Input value={filter.filtrationLevel || ""} onChange={e => update("filtrationLevel", e.target.value)} placeholder="e.g. 0.5 micron" />
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Field label="Description">
              <Textarea value={filter.description || ""} onChange={e => update("description", e.target.value)} placeholder="Customer-facing description shown in the app..." />
            </Field>
          </FieldGroup>
          <FieldGroup>
            <Field label="Contaminants Addressed / Benefits">
              <Textarea value={filter.contaminants || ""} onChange={e => update("contaminants", e.target.value)} placeholder="e.g. Chlorine, chloramines, VOCs, taste & odor..." style={{ minHeight: 70 }} />
            </Field>
          </FieldGroup>
          <FieldGroup columns={2}>
            <Field label="Peak Flow Rate (GPM)">
              <Input type="number" step="0.1" value={filter.peakFlowRate || ""} onChange={e => update("peakFlowRate", e.target.value)} placeholder="e.g. 3.5" />
            </Field>
            <Field label="Service Flow Rate (GPM)">
              <Input type="number" step="0.1" value={filter.serviceFlowRate || ""} onChange={e => update("serviceFlowRate", e.target.value)} placeholder="e.g. 2.0" />
            </Field>
          </FieldGroup>
          <FieldGroup columns={2}>
            <Field label="Filter Capacity (gallons)">
              <Input type="number" value={filter.capacityGallons || ""} onChange={e => update("capacityGallons", e.target.value)} placeholder="e.g. 5000" />
            </Field>
            <Field label="Filter Lifespan (days)">
              <Input type="number" value={filter.lifespanDays || ""} onChange={e => update("lifespanDays", e.target.value)} placeholder="e.g. 365" />
            </Field>
          </FieldGroup>
          <div style={{ marginTop: 20 }}>
            <Label>Programming Modes</Label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 4 }}>
              {PROGRAMMING_MODES.map(m => (
                <Chip
                  key={m.id}
                  label={m.label}
                  active={(filter.programmingModes || []).includes(m.id)}
                  onClick={() => toggleMode(m.id)}
                />
              ))}
            </div>
            {(filter.programmingModes || []).length > 0 && (
              <div style={{ marginTop: 12, background: T.glacier, borderRadius: 8, padding: "10px 14px" }}>
                {PROGRAMMING_MODES
                  .filter(m => (filter.programmingModes || []).includes(m.id))
                  .map(m => (
                    <div key={m.id} style={{ fontSize: 12, color: T.slate, marginBottom: 4 }}>
                      <strong>{m.label}:</strong> {m.desc}
                    </div>
                  ))}
              </div>
            )}
          </div>
          <div style={{ marginTop: 20 }}>
            <ImageUrlField
              label="Filter Image"
              aspectHint="Recommended: 800×800px, PNG/JPG"
              value={filter.imageUrl}
              onChange={e => update("imageUrl", e.target.value)}
            />
          </div>
        </div>
      )}
    </Card>
  );
}

// ─── Document Row ─────────────────────────────────────────────────────────────
function DocRow({ index, doc, onChange, onRemove }) {
  const update = (key, val) => onChange(index, { ...doc, [key]: val });
  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1.4fr 1.6fr 1fr auto", gap: 10, alignItems: "start", marginBottom: 10 }}>
      <Input value={doc.title || ""} onChange={e => update("title", e.target.value)} placeholder="Document title *" />
      <Select value={doc.type || ""} onChange={e => update("type", e.target.value)}>
        <option value="">Type...</option>
        {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
      </Select>
      <Input value={doc.url || ""} onChange={e => update("url", e.target.value)} placeholder="https://..." />
      <Input value={doc.language || ""} onChange={e => update("language", e.target.value)} placeholder="English" />
      <button
        type="button"
        onClick={() => onRemove(index)}
        style={{ background: "none", border: "none", color: "#9AAABB", cursor: "pointer", fontSize: 20, paddingTop: 8 }}
      >
        ✕
      </button>
    </div>
  );
}

// ─── Section Components ───────────────────────────────────────────────────────
function SectionAppInfo({ data, setData }) {
  const update = (k, v) => setData(d => ({ ...d, appInfo: { ...d.appInfo, [k]: v } }));
  const d = data.appInfo || {};
  return (
    <div>
      <SectionHeader
        title="App Information"
        subtitle="Metadata displayed in the App Store and Google Play listings."
      />
      <FieldGroup columns={2}>
        <Field label="App Name" required>
          <Input value={d.appName || ""} onChange={e => update("appName", e.target.value)} placeholder="e.g. My Water Manager" />
        </Field>
        <Field label="Company Name" required>
          <Input value={d.companyName || ""} onChange={e => update("companyName", e.target.value)} placeholder="e.g. Example Water Systems" />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Description" required>
          <Textarea value={d.description || ""} onChange={e => update("description", e.target.value)} placeholder="Full app store description. Up to 4,000 characters." style={{ minHeight: 120 }} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Promotional Text">
          <Textarea value={d.promoText || ""} onChange={e => update("promoText", e.target.value)} placeholder="Short promotional blurb, updated without a new app release. Up to 170 characters." style={{ minHeight: 70 }} />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Keywords">
          <Input value={d.keywords || ""} onChange={e => update("keywords", e.target.value)} placeholder="water filter, home water, softener, purification (comma-separated)" />
        </Field>
      </FieldGroup>
      <FieldGroup columns={2}>
        <ImageUrlField label="App Icon" aspectHint="1024×1024px, PNG, no transparency" value={d.iconUrl} onChange={e => update("iconUrl", e.target.value)} />
        <ImageUrlField label="Banner / Feature Graphic" aspectHint="1024×500px for App Store" value={d.bannerUrl} onChange={e => update("bannerUrl", e.target.value)} />
      </FieldGroup>
    </div>
  );
}

function SectionFilterCatalog({ data, setData }) {
  const filters = data.filters || [];
  const updateFilter = (i, val) => setData(d => {
    const f = [...(d.filters || [])];
    f[i] = val;
    return { ...d, filters: f };
  });
  const addFilter = () => setData(d => ({ ...d, filters: [...(d.filters || []), {}] }));
  const removeFilter = (i) => setData(d => {
    const f = [...(d.filters || [])];
    f.splice(i, 1);
    return { ...d, filters: f };
  });
  return (
    <div>
      <SectionHeader
        title="Filter Catalog"
        subtitle="Define each filter or cartridge product available in the app."
      />
      {filters.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: "#9AAABB", background: T.inputBg, borderRadius: 10, border: `1.5px dashed ${T.midGray}`, marginBottom: 16 }}>
          No filters added yet. Add your first filter below.
        </div>
      )}
      {filters.map((f, i) => (
        <FilterCard key={i} index={i} filter={f} onChange={updateFilter} onRemove={removeFilter} />
      ))}
      <button
        type="button"
        onClick={addFilter}
        style={{ width: "100%", padding: "12px", borderRadius: 10, border: `2px dashed ${T.slate}`, background: "none", color: T.slate, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
      >
        + Add Filter / Cartridge
      </button>
    </div>
  );
}

function SectionDealerInfo({ data, setData }) {
  const update = (k, v) => setData(d => ({ ...d, dealer: { ...d.dealer, [k]: v } }));
  const d = data.dealer || {};
  return (
    <div>
      <SectionHeader
        title="Default Dealer Profile"
        subtitle="Displayed on the support and contact screens within the app until modified by installer or technician."
      />
      <FieldGroup columns={2}>
        <Field label="Deafault Dealer / Business Name" required>
          <Input value={d.name || ""} onChange={e => update("name", e.target.value)} placeholder="e.g. Crusader Water Systems" />
        </Field>
        <Field label="Contact Phone">
          <Input value={d.phone || ""} onChange={e => update("phone", e.target.value)} placeholder="(800) 555-0100" />
        </Field>
      </FieldGroup>
      <FieldGroup columns={2}>
        <Field label="Support Email">
          <Input type="email" value={d.email || ""} onChange={e => update("email", e.target.value)} placeholder="support@yourcompany.com" />
        </Field>
        <Field label="Website">
          <Input value={d.website || ""} onChange={e => update("website", e.target.value)} placeholder="https://yourcompany.com" />
        </Field>
      </FieldGroup>
      {/*
      <FieldGroup>
        <Field label="Service Coverage Area">
          <Input value={d.coverage || ""} onChange={e => update("coverage", e.target.value)} placeholder="e.g. Pacific Northwest, ZIP codes 97xxx-98xxx" />
        </Field>
      </FieldGroup>
      <FieldGroup>
        <Field label="Dealer Bio / About">
          <Textarea value={d.bio || ""} onChange={e => update("bio", e.target.value)} placeholder="Short paragraph about your business shown on the About screen." />
        </Field>
      </FieldGroup>
      */}
      <FieldGroup columns={2}>
        <Field label="Business Hours">
          <Input value={d.hours || ""} onChange={e => update("hours", e.target.value)} placeholder="Mon-Fri 8am-5pm PT" />
        </Field>
        <Field label="Emergency Contact">
          <Input value={d.emergency || ""} onChange={e => update("emergency", e.target.value)} placeholder="(optional) after-hours number" />
        </Field>
      </FieldGroup>
      <ImageUrlField
        label="Default Dealer Logo"
        aspectHint="SVG or PNG, min 400×200px"
        value={d.logoUrl}
        onChange={e => update("logoUrl", e.target.value)}
      />
    </div>
  );
}

function SectionBranding({ data, setData }) {
  const update = (k, v) => setData(d => ({ ...d, branding: { ...d.branding, [k]: v } }));
  const d = data.branding || {};
  const presets = [
    { name: "Ocean",    primary: "#0B6E8C", accent: "#00C9A7" },
    { name: "Slate",    primary: "#2A5A8C", accent: "#F4A620" },
    { name: "Forest",   primary: "#2D6A4F", accent: "#74C69D" },
    { name: "Charcoal", primary: "#2D3748", accent: "#63B3ED" },
  ];
  return (
    <div>
      <SectionHeader
        title="Branding & Theme"
        subtitle="Visual identity applied throughout the dealer-branded app."
      />
      <Label>Color Presets</Label>
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {presets.map(p => (
          <div
            key={p.name}
            onClick={() => { update("primaryColor", p.primary); update("accentColor", p.accent); }}
            style={{ padding: "8px 16px", borderRadius: 8, border: `2px solid ${d.primaryColor === p.primary ? p.primary : T.midGray}`, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
          >
            <div style={{ display: "flex", gap: 4 }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: p.primary }} />
              <div style={{ width: 14, height: 14, borderRadius: 3, background: p.accent }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: T.ink }}>{p.name}</span>
          </div>
        ))}
      </div>
      <FieldGroup columns={2}>
        <Field label="Primary Color">
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="color"
              value={d.primaryColor || "#2A5A8C"}
              onChange={e => update("primaryColor", e.target.value)}
              style={{ width: 44, height: 36, borderRadius: 6, border: `1.5px solid ${T.midGray}`, cursor: "pointer", padding: 2, flexShrink: 0 }}
            />
            <Input value={d.primaryColor || "#2A5A8C"} onChange={e => update("primaryColor", e.target.value)} style={{ fontFamily: "monospace" }} />
          </div>
        </Field>
        <Field label="Accent / Action Color">
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="color"
              value={d.accentColor || "#00A896"}
              onChange={e => update("accentColor", e.target.value)}
              style={{ width: 44, height: 36, borderRadius: 6, border: `1.5px solid ${T.midGray}`, cursor: "pointer", padding: 2, flexShrink: 0 }}
            />
            <Input value={d.accentColor || "#00A896"} onChange={e => update("accentColor", e.target.value)} style={{ fontFamily: "monospace" }} />
          </div>
        </Field>
      </FieldGroup>
      <FieldGroup columns={2}>
        <Field label="Privacy Policy URL">
          <Input value={d.privacyUrl || ""} onChange={e => update("privacyUrl", e.target.value)} placeholder="https://yourco.com/privacy" />
        </Field>
        <Field label="Terms of Service URL">
          <Input value={d.tosUrl || ""} onChange={e => update("tosUrl", e.target.value)} placeholder="https://yourco.com/terms" />
        </Field>
      </FieldGroup>
    </div>
  );
}

function SectionDocumentation({ data, setData }) {
  const docs = data.docs || [];
  const updateDoc = (i, val) => setData(d => {
    const arr = [...(d.docs || [])];
    arr[i] = val;
    return { ...d, docs: arr };
  });
  const addDoc = () => setData(d => ({ ...d, docs: [...(d.docs || []), {}] }));
  const removeDoc = (i) => setData(d => {
    const arr = [...(d.docs || [])];
    arr.splice(i, 1);
    return { ...d, docs: arr };
  });

  const updateGeneral = (k, v) => setData(d => ({ ...d, generalLinks: { ...d.generalLinks, [k]: v } }));
  const g = data.generalLinks || {};

  return (
    <div>
      <SectionHeader
        title="Documentation"
        subtitle="Links to product manuals, cut sheets, installation guides, and certifications available within the app."
      />

      {/* Part A — Product Documents */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, marginBottom: 4 }}>A — Product Documentation</div>
        <div style={{ fontSize: 12, color: T.muted, marginBottom: 16 }}>
          One row per document. Link to a publicly accessible URL (Google Drive, Dropbox, your website, etc.).
        </div>

        {/* Column headers */}
        {docs.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1.4fr 1.6fr 1fr auto", gap: 10, marginBottom: 6 }}>
            {["Document Title *", "Type", "URL *", "Language", ""].map((h, i) => (
              <div key={i} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: T.muted }}>{h}</div>
            ))}
          </div>
        )}

        {docs.length === 0 && (
          <div style={{ textAlign: "center", padding: 32, color: "#9AAABB", background: T.inputBg, borderRadius: 10, border: `1.5px dashed ${T.midGray}`, marginBottom: 12 }}>
            No documents added yet.
          </div>
        )}

        {docs.map((doc, i) => (
          <DocRow key={i} index={i} doc={doc} onChange={updateDoc} onRemove={removeDoc} />
        ))}

        <button
          type="button"
          onClick={addDoc}
          style={{ padding: "9px 18px", borderRadius: 8, border: `1.5px dashed ${T.slate}`, background: "none", color: T.slate, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", marginTop: 4 }}
        >
          + Add Document
        </button>
      </div>

      {/* Divider */}
      <div style={{ borderTop: `1.5px solid ${T.glacier}`, marginBottom: 28 }} />

      {/* Part B — General App Resources */}
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: T.navy, marginBottom: 4 }}>B — General App Resources</div>
        <div style={{ fontSize: 12, color: T.muted, marginBottom: 20 }}>
          Links that appear in the app's Help, FAQ, or Support sections — not tied to a specific product.
        </div>
        <FieldGroup columns={2}>
          <Field label="FAQ / Help Center URL">
            <Input value={g.faq || ""} onChange={e => updateGeneral("faq", e.target.value)} placeholder="https://yourcompany.com/faq" />
          </Field>
          <Field label="Video Tutorial URL">
            <Input value={g.video || ""} onChange={e => updateGeneral("video", e.target.value)} placeholder="https://youtube.com/watch?v=..." />
          </Field>
        </FieldGroup>
        <FieldGroup columns={2}>
          <Field label="Warranty Registration URL">
            <Input value={g.warranty || ""} onChange={e => updateGeneral("warranty", e.target.value)} placeholder="https://yourcompany.com/warranty" />
          </Field>
          <Field label="Safety & Compliance Doc URL">
            <Input value={g.safety || ""} onChange={e => updateGeneral("safety", e.target.value)} placeholder="https://yourcompany.com/safety" />
          </Field>
        </FieldGroup>
        <FieldGroup>
          <Field label="General Brochure URL">
            <Input value={g.brochure || ""} onChange={e => updateGeneral("brochure", e.target.value)} placeholder="https://yourcompany.com/brochure.pdf" />
          </Field>
        </FieldGroup>
      </div>
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function FlowProgress({ current, total }) {
  return (
    <div style={{ position: "relative", height: 4, background: T.midGray, borderRadius: 2, marginBottom: 24 }}>
      <div style={{ height: "100%", width: `${(current / total) * 100}%`, background: `linear-gradient(90deg, ${T.slate}, ${T.teal})`, borderRadius: 2, transition: "width 0.4s ease" }} />
      <div style={{ position: "absolute", right: 0, top: -14, fontSize: 10, color: T.muted, fontWeight: 600 }}>
        {current}/{total} sections
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive]       = useState("app-info");
  const [data, setData]           = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const sectionComponents = {
    "app-info":       <SectionAppInfo       data={data} setData={setData} />,
    "filter-catalog": <SectionFilterCatalog data={data} setData={setData} />,
    "dealer-info":    <SectionDealerInfo    data={data} setData={setData} />,
    "branding":       <SectionBranding      data={data} setData={setData} />,
    "documentation":  <SectionDocumentation data={data} setData={setData} />,
  };

  const currentIndex = SECTIONS.findIndex(s => s.id === active);
  const isLast = currentIndex === SECTIONS.length - 1;

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const payload = {
        ...data,
        _subject: `New Dealer Configuration — ${data?.dealer?.name || data?.appInfo?.companyName || "Unknown Dealer"}`,
      };
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const err = await res.json();
        setSubmitError(err?.error || "Submission failed. Please try again.");
      }
    } catch {
      setSubmitError("Network error. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: T.lightGray, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", maxWidth: 480, padding: 40 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
          <h2 style={{ color: T.navy, fontSize: 24, marginBottom: 8 }}>Configuration Submitted</h2>
          <p style={{ color: T.muted, fontSize: 15, lineHeight: 1.6 }}>
            Your dealer customization has been received. The development team will review and reach out within 2 business days.
          </p>
          <button
            type="button"
            onClick={() => { setSubmitted(false); setData({}); setActive("app-info"); }}
            style={{ marginTop: 24, padding: "12px 28px", borderRadius: 8, background: T.slate, color: T.white, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F0F5FA", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ background: T.navy, padding: "16px 32px", display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: `linear-gradient(135deg, ${T.slate}, ${T.teal})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
          💧
        </div>
        <div>
          <div style={{ color: T.white, fontWeight: 700, fontSize: 16 }}>My Water Manager</div>
          <div style={{ color: "#6B9DC2", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            OEM Configuration Portal
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, maxWidth: 1200, margin: "0 auto", width: "100%", padding: "32px 24px", gap: 28, boxSizing: "border-box" }}>
        {/* Sidebar */}
        <div style={{ width: 220, flexShrink: 0 }}>
          <div style={{ position: "sticky", top: 32 }}>
            {SECTIONS.map((s, i) => (
              <div
                key={s.id}
                onClick={() => setActive(s.id)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "11px 14px", borderRadius: 8, marginBottom: 4, cursor: "pointer",
                  background: active === s.id ? T.white : "transparent",
                  border: `1.5px solid ${active === s.id ? T.midGray : "transparent"}`,
                  boxShadow: active === s.id ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                  transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 15 }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: active === s.id ? T.navy : T.muted }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: 10, color: "#9AAABB", marginTop: 1 }}>Section {i + 1}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <FlowProgress current={currentIndex + 1} total={SECTIONS.length} />
          <Card>
            {sectionComponents[active]}

            {submitError && (
              <div style={{ marginTop: 16, padding: "10px 14px", borderRadius: 8, background: "#FFF3CD", border: "1.5px solid #F4A620", color: T.navy, fontSize: 13 }}>
                {submitError}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 32, paddingTop: 20, borderTop: `1.5px solid ${T.glacier}` }}>
              <button
                type="button"
                onClick={() => currentIndex > 0 && setActive(SECTIONS[currentIndex - 1].id)}
                disabled={currentIndex === 0}
                style={{
                  padding: "10px 22px", borderRadius: 8, border: `1.5px solid ${T.midGray}`,
                  background: T.white, color: currentIndex === 0 ? "#C0C8D0" : T.ink,
                  fontSize: 14, fontWeight: 600, cursor: currentIndex === 0 ? "default" : "pointer",
                  fontFamily: "inherit",
                }}
              >
                Back
              </button>

              {!isLast
                ? (
                  <button
                    type="button"
                    onClick={() => setActive(SECTIONS[currentIndex + 1].id)}
                    style={{ padding: "10px 22px", borderRadius: 8, border: "none", background: T.slate, color: T.white, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                  >
                    Next
                  </button>
                )
                : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    style={{
                      padding: "10px 28px", borderRadius: 8, border: "none",
                      background: submitting ? T.muted : `linear-gradient(135deg, ${T.slate}, ${T.teal})`,
                      color: T.white, fontSize: 14, fontWeight: 700,
                      cursor: submitting ? "default" : "pointer", fontFamily: "inherit",
                    }}
                  >
                    {submitting ? "Submitting..." : "Submit Configuration ✓"}
                  </button>
                )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
