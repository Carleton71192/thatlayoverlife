// Country to travel-region mapping. Six regions plus a GLOBAL fallback, roughly
// UN M49 with the two adjustments the travel trade makes: the Middle East is
// split out of Asia, and Türkiye sits with Europe (EMEA convention).

export const REGIONS = ['EUROPE', 'ASIA', 'AMERICAS', 'AFRICA', 'MIDDLE EAST', 'OCEANIA'];
export const GLOBAL = 'GLOBAL';

const MEMBERS = {
  EUROPE: 'AD AL AT AX BA BE BG BY CH CY CZ DE DK EE ES FI FO FR GB GG GI GR HR HU IE IM IS IT JE LI LT LU LV MC MD ME MK MT NL NO PL PT RO RS RU SE SI SJ SK SM TR UA VA XK',
  ASIA: 'AF AM AZ BD BN BT CN GE HK ID IN IO JP KG KH KP KR KZ LA LK MM MN MO MV MY NP PH PK SG TH TJ TL TM TW UZ VN',
  'MIDDLE EAST': 'AE BH IL IQ IR JO KW LB OM PS QA SA SY YE',
  AFRICA: 'AO BF BI BJ BW CD CF CG CI CM CV DJ DZ EG EH ER ET GA GH GM GN GQ GW KE KM LR LS LY MA MG ML MR MU MW MZ NA NE NG RE RW SC SD SL SN SO SS ST SZ TD TG TN TZ UG YT ZA ZM ZW',
  AMERICAS: 'AG AI AR AW BB BL BM BO BQ BR BS BZ CA CL CO CR CU CW DM DO EC FK GD GF GL GP GT GY HN HT JM KN KY LC MF MQ MS MX NI PA PE PM PR PY SR SV SX TC TT US UY VC VE VG VI',
  OCEANIA: 'AS AU CC CK CX FJ FM GU KI MH MP NC NF NR NU NZ PF PG PN PW SB TK TO TV UM VU WF WS',
};

export const COUNTRY_TO_REGION = Object.freeze(
  Object.entries(MEMBERS).reduce((acc, [region, codes]) => {
    for (const code of codes.split(' ')) acc[code] = region;
    return acc;
  }, {}),
);

/** @param {string|null} code ISO 3166-1 alpha-2 */
export function regionForCountry(code) {
  if (!code) return GLOBAL;
  return COUNTRY_TO_REGION[code.toUpperCase()] || GLOBAL;
}

export function isRegion(value) {
  return REGIONS.includes(value) || value === GLOBAL;
}

/** Accepts "middle east", "MIDDLE_EAST", "middle-east". Returns null if unknown. */
export function normalizeRegion(value) {
  if (!value) return null;
  const cleaned = String(value).trim().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').toUpperCase();
  return isRegion(cleaned) ? cleaned : null;
}
