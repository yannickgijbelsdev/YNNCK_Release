const K = () => <svg viewBox="66 26 42 51" aria-hidden="true"><polygon points="91.95,30.476 98.589,30.476 77.733,47.939 102.696,72.502 96.441,72.502 71.467,47.939" /></svg>;

export const LOGOS = {
  koodh: { name: "Koodh", bg: "#274080" },
  kmg: { name: "Koodh Media Group", bg: "linear-gradient(135deg,#2D067B,#F96F4F)" },
  grk: { name: "Radio GRK", bg: "#0E4974", img: "/img/radio-grk.png" },
  radiogroep: { name: "Radiogroep", bg: "#E5484D", img: "/img/radiogroep.png", wide: true },
  topradio: { name: "TOPradio", bg: "#111", img: "/img/topradio.png", wide: true },
  thomasmore: { name: "Thomas More", bg: "#1F7A8C", img: "/img/thomas-more.png", wide: true },
  ovb: { name: "OVB Congres", bg: "#4B2B8F", img: "/img/ovb-congres.png", wide: true },
  sonart: { name: "Studio Sonart", bg: "#16171C", img: "/img/studio-sonart.png", wide: true },
  telenet: { name: "Telenet Group", bg: "#FFC421", img: "/img/telenet.png", fill: true },
  autosoft: { name: "Autosoft IT Solutions, Lommel", bg: "#0F1424", img: "/img/autosoft.png", xwide: true },
  mfy: { name: "Lokale Radio MFY", bg: "#5C2273", img: "/img/radio-mfy.png", fill: true },
};

const RULES = [
  [/ovb/i, ["ovb"]],
  [/nostalgie|radiogroep/i, ["radiogroep"]],
  [/koodh/i, ["koodh", "kmg"]],
  [/radiobox|thomas more/i, ["radiogroep", "thomasmore"]],
  [/topradio/i, ["topradio"]],
  [/grk/i, ["grk"]],
];

export const logosFor = (title = "") => RULES.find(([re]) => re.test(title))?.[1] || [];

export const Logos = ({ ids, className = "blogos" }) =>
  ids?.length ? (
    <span className={className}>
      {ids.map((id) => {
        const l = LOGOS[id];
        return (
          <span key={id} className={`blogo${l.wide ? " wide" : ""}${l.fill ? " fill" : ""}${l.xwide ? " xwide" : ""}`} style={{ background: l.bg }} title={l.name} data-testid={`logo-${id}`}>
            {l.img ? <img src={l.img} alt={l.name} /> : <K />}
          </span>
        );
      })}
    </span>
  ) : null;
