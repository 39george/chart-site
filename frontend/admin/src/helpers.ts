import { FORBIDDEN_CHARS } from "./config";

// Format price
const number_format = new Intl.NumberFormat("ru");

export const format_price = (number_string: string) => {
  return number_string.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

export function format_input_price(price: string) {
  return number_format.format(parseInt(price, 10));
}

// Transliterate
export function transliterate(text: string): string {
  let result = "";
  let lower = text.toLowerCase();
  let chars = Array.from(text).map((char, index) => [char, lower[index]]);

  for (let i = 0; i < chars.length; i++) {
    let [c, lower] = chars[i];
    let isUpper = c.toUpperCase() === c;

    switch (lower) {
      case "й":
      case "й":
        result += isUpper ? "Y" : "y";
        break;
      case "ц":
        result += isUpper ? "TS" : "ts";
        break;
      case "у":
        result += isUpper ? "U" : "u";
        break;
      case "к":
        result += isUpper ? "K" : "k";
        break;
      case "е":
        result += isUpper ? "E" : "e";
        break;
      case "н":
        result += isUpper ? "N" : "n";
        break;
      case "г":
        result += isUpper ? "G" : "g";
        break;
      case "ш":
        result += isUpper ? "SH" : "sh";
        break;
      case "щ":
        result += isUpper ? "SCH" : "sch";
        break;
      case "з":
        result += isUpper ? "Z" : "z";
        break;
      case "х":
        result += isUpper ? "H" : "h";
        break;
      case "ъ":
        result += isUpper ? "'" : "'";
        break;
      case "ф":
        result += isUpper ? "F" : "f";
        break;
      case "ы":
        result += isUpper ? "Y" : "y";
        break;
      case "в":
        result += isUpper ? "V" : "v";
        break;
      case "а":
        result += isUpper ? "A" : "a";
        break;
      case "п":
        result += isUpper ? "P" : "p";
        break;
      case "р":
        result += isUpper ? "R" : "r";
        break;
      case "о":
        result += isUpper ? "O" : "o";
        break;
      case "л":
        result += isUpper ? "L" : "l";
        break;
      case "д":
        result += isUpper ? "D" : "d";
        break;
      case "ж":
        result += isUpper ? "ZH" : "zh";
        break;
      case "э":
        result += isUpper ? "E" : "e";
        break;
      case "я":
        result += isUpper ? "YA" : "ya";
        break;
      case "ч":
        result += isUpper ? "CH" : "ch";
        break;
      case "с":
        result += isUpper ? "S" : "s";
        break;
      case "м":
        result += isUpper ? "M" : "m";
        break;
      case "и":
        result += isUpper ? "I" : "i";
        break;
      case "т":
        result += isUpper ? "T" : "t";
        break;
      case "ь":
        result += isUpper ? "'" : "'";
        break;
      case "б":
        result += isUpper ? "B" : "b";
        break;
      case "ю":
        result += isUpper ? "YU" : "yu";
        break;
      default:
        if (c.length === 1) {
          let ch = c.charAt(0);
          if (ch.charCodeAt(0) <= 127) {
            if (FORBIDDEN_CHARS.test(ch)) {
              result += "_";
            } else {
              result += ch;
            }
          } else {
            result += "_";
          }
        }
        break;
    }
  }

  return result;
}

// Convert File to Blob
export async function fileToBlob(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(new Blob([reader.result], { type: file.type }));
      } else {
        reject(new Error("Failed to read file as ArrayBuffer"));
      }
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };
    reader.readAsArrayBuffer(file);
  });
}

// Bytes to megabytes conversion
export function bytes_to_mb(file: File): number {
  let mb_size = file.size / (1024 * 1024);
  return Math.round(mb_size * 10) / 10;
}

// Wait func
export const wait = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
