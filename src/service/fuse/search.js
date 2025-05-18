import Fuse from "fuse.js";

const fuseOptions = {
  isCaseSensitive: false,
  threshold: 0.3,
  keys: [
    "name",
    "description",
    "nameTranslit",
    "nameReverseTranslit",
    "nameWrongLayout"
  ]
};

const cyrillicToLatinMap = {
  А: "A", а: "a", Б: "B", б: "b", В: "V", в: "v", Г: "G", г: "g", Д: "D", д: "d",
  Е: "E", е: "e", Ё: "E", ё: "e", Ж: "Zh", ж: "zh", З: "Z", з: "z", И: "I", и: "i",
  Й: "Y", й: "y", К: "K", к: "k", Л: "L", л: "l", М: "M", м: "m", Н: "N", н: "n",
  О: "O", о: "o", П: "P", п: "p", Р: "R", р: "r", С: "S", с: "s", Т: "T", т: "t",
  У: "U", у: "u", Ф: "F", ф: "f", Х: "Kh", х: "kh", Ц: "Ts", ц: "ts", Ч: "Ch", ч: "ch",
  Ш: "Sh", ш: "sh", Щ: "Shch", щ: "shch", Ы: "Y", ы: "y", Э: "E", э: "e", Ю: "Yu", ю: "yu", Я: "Ya", я: "ya",
};

const latinToCyrillicMap = {
  A: "А", a: "а", B: "Б", b: "б", V: "В", v: "в", G: "Г", g: "г", D: "Д", d: "д",
  E: "Е", e: "е", Z: "З", z: "з", I: "И", i: "и", Y: "Й", y: "й", K: "К", k: "к",
  L: "Л", l: "л", M: "М", m: "м", N: "Н", n: "н", O: "О", o: "о", P: "П", p: "п",
  R: "Р", r: "р", S: "С", s: "с", T: "Т", t: "т", U: "У", u: "у", F: "Ф", f: "ф",
  H: "Х", h: "х", C: "Ц", c: "ц"
  // Можно добавить больше букв для точности
};

export function transliterate(str) {
  return str
    .split("")
    .map((char) => cyrillicToLatinMap[char] || char)
    .join("");
}

export function reverseTransliterate(str) {
  return str
    .split("")
    .map((char) => latinToCyrillicMap[char] || char)
    .join("");
}

// Ошибочная русская и английская раскладки
const enToRuLayout = {
  q: "й", w: "ц", e: "у", r: "к", t: "е", y: "н", u: "г", i: "ш", o: "щ", p: "з",
  "[": "х", "]": "ъ", a: "ф", s: "ы", d: "в", f: "а", g: "п", h: "р", j: "о",
  k: "л", l: "д", ";": "ж", "'": "э", z: "я", x: "ч", c: "с", v: "м", b: "и",
  n: "т", m: "ь", ",": "б", ".": "ю", "/": "."
};

function wrongLayout(str) {
  return str
    .split("")
    .map((char) => enToRuLayout[char] || char)
    .join("");
}

const search = (list, searchPattern) => {
  const listWithTranslit = list.map(item => ({
    ...item,
    nameTranslit: transliterate(item.name),
    nameReverseTranslit: reverseTransliterate(item.name),
    nameWrongLayout: wrongLayout(item.name.toLowerCase())
  }));

  const searchPatternTranslit = transliterate(searchPattern);
  const searchPatternReverse = reverseTransliterate(searchPattern);
  const searchPatternWrongLayout = wrongLayout(searchPattern.toLowerCase());

  const fuse = new Fuse(listWithTranslit, fuseOptions);

  const results = [
    ...fuse.search(searchPattern),
    ...fuse.search(searchPatternTranslit),
    ...fuse.search(searchPatternReverse),
    ...fuse.search(searchPatternWrongLayout)
  ];

  const unique = {};
  results.forEach(res => {
    unique[res.item.id] = res.item;
  });

  return Object.values(unique);
};

export { search };