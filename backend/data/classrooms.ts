export const MASTER_CLASSROOMS: string[] = [
  "A Block",
  "A2", "A3", "A5 Lab", "A6", "A7 Lab", "A10",
  "A11 Lab", "A12 Lab", "A13 Lab", "A14 Lab",
  "A16 Lab", "A17 Lab",
  "B Block",
  "B2 Lab", "B3 Lab", "B7", "B12", "B13", "B16", "B17",
  "C Block",
  "C1 Lab", "C5", "C6", "C7 Lab", "C8 Lab", "C9 Lab",
  "C11 Lab", "C13 Lab", "C14 Lab", "C18 Lab", "C19 Lab",
  "D Block",
  "D1 Lab", "D2", "D3", "D4", "D5", "D6", "D7", "D8", "D9",
  "D10", "D11", "D12", "D13", "D14", "D15", "D16", "D17", "D18", "D19",
  "D20", "D21", "D22", "D23", "D24", "D25", "D26", "D27", "D28", "D29",
  "D30", "D31", "D32", "D33", "D34", "D35", "D36", "D37", "D38", "D39",
  "D40", "D41", "D42", "D43", "D44", "D45", "D46", "D47", "D48", "D49",
  "D50", "D51", "D52", "D53", "D54", "D55", "D56", "D57", "D58", "D59",
  "D60", "D61", "D62", "D63", "D64", "D65", "D66", "D67", "D68", "D69",
  "D70", "D71", "D72", "D73", "D74", "D75", "D76", "D77", "D78", "D79",
  "D80", "D81", "D82", "D83", "D84", "D85", "D86", "D87", "D88", "D89",
  "D90", "D91", "D92", "D93", "D94", "D95", "D96", "D97", "D98", "D99",
  "D100", "D101", "D102", "D103", "D104", "D105", "D106", "D107", "D108", "D109",
  "D110", "D111", "D112", "D113", "D114", "D115", "D116", "D117", "D118", "D119",
  "N Block",
  "N1", "N2", "N3", "N4", "N5", "N6", "N7", "N8", "N9", "N10",
  "N11", "N12", "N13", "N14", "N15", "N16", "N17", "N18", "N19", "N20",
  "N21", "N22", "N23", "N24", "N25", "N25B",
  "O Block",
  "O1", "O2", "O3", "O4",
  "P Block",
  "P1", "P3",
  "K Block",
  "K1 Lab"
];

export function normalizeRoom(name: string): string {
  let n = name.toLowerCase().trim();
  const parenMatch = n.match(/\(([^)]+)\)/);
  if (parenMatch) {
    n = parenMatch[1];
  }
  n = n.replace(/\b(block|lab)\b/g, '');
  n = n.replace(/[\s\-]+/g, '');
  return n;
}
