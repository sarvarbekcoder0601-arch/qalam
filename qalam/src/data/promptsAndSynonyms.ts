export interface WritingPrompt {
  id: string
  title: string
  description: string
  category: 'scenario' | 'poetry' | 'story' | 'essay'
  genre?: string
}

export interface SynonymGroup {
  word: string
  synonyms: string[]
  poetic: string[]
  description?: string
}

export const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: "1",
    title: "Tungi Poyezdda Kutilmagan Uchrashuv",
    description: "Yomg'irli tunda so'nggi poyezdga chiqqan qahramon 10 yil avval yo'qolgan do'stini uchratib qoladi...",
    category: "story",
    genre: "Dramatizm / Sirli",
  },
  {
    id: "2",
    title: "Samo va Tuproq Muloqoti",
    description: "Osmonning yuksakligi va yerning sadoqati haqida falsafiy va ma'noli she'r bitiring.",
    category: "poetry",
    genre: "Falsafiy",
  },
  {
    id: "3",
    title: "So'nggi Xat",
    description: "Eski chordoqdan topilgan 1945-yilgi xat ikki oilaning taqdirini butunlay o'zgartirib yuboradi.",
    category: "scenario",
    genre: "Tarixiy Drama",
  },
  {
    id: "4",
    title: "Vaqtni To'xtatuvchi Soat",
    description: "Soatsoz har kuni roppa-rosa 1 minutga vaqtni to'xtata oladigan qadimgi soatni tuzatib qo'ydi.",
    category: "story",
    genre: "Fantastika",
  },
  {
    id: "5",
    title: "Xazonrezgi va Sog'inch",
    description: "Kuz barglarining to'kilishi va inson ko'nglidagi o'kinchli xotiralar haqida g'azal yoki she'r.",
    category: "poetry",
    genre: "Lirika",
  },
  {
    id: "6",
    title: "Kiber-Toshkent 2099",
    description: "Kelajakdagi Toshkentda sun'iy intellekt va inson tuyg'ulari o'rtasidagi to'qnashuv ssenariysi.",
    category: "scenario",
    genre: "Kiberpank",
  },
  {
    id: "7",
    title: "Yolg'iz Chiroq",
    description: "Tungi shahar chetidagi kichik choyxonada har kuni soat 3 da uchrashadigan sirli uch kishi.",
    category: "story",
    genre: "Detektiv / Sirli",
  },
  {
    id: "8",
    title: "Ko'ngil Qasri",
    description: "Inson qalbidagi orzu-havaslar, sabr va umid tuyg'ulari haqida teran bag'ishlov.",
    category: "poetry",
    genre: "Ishqiy-Falsafiy",
  },
]

export const SYNONYMS_DICTIONARY: SynonymGroup[] = [
  {
    word: "osmon",
    synonyms: ["samo", "falak", "ko'k", "gardun", "charx", "kavkabzar"],
    poetic: ["samo-yi bepoyon", "falaki davor", "garduni dun", "ko'k gumbazi"],
    description: "Kenglik, yuksaklik va abadiylik ramzi",
  },
  {
    word: "quyosh",
    synonyms: ["oftob", "xurshid", "mehr", "shams", "nur afshon", "zarrin kun"],
    poetic: ["xurshidi xovar", "oftobi olamtab", "nuri ilohi"],
    description: "Hayot, harorat va yorug'lik manbai",
  },
  {
    word: "yurak",
    synonyms: ["qalb", "dil", "ko'ngil", "bag'ir", "fuod", "suveydo"],
    poetic: ["dili vayron", "qarori qalb", "ko'ngil qasri", "bag'ri qon"],
    description: "Tuyg'ular va ishq makoni",
  },
  {
    word: "kecha",
    synonyms: ["tun", "shom", "oqshom", "zulmat", "soniya-yi tor"],
    poetic: ["shomi g'aribon", "tuni yoldoz", "zulmati oshyon"],
    description: "Sukunat va sirli tuyg'ular vaqti",
  },
  {
    word: "ko'z",
    synonyms: ["chashm", "dida", "nazar", "nigoh", "qorasoch ko'z"],
    poetic: ["chashmi shahlo", "nidiya-yi tar", "nigohi sehrikor"],
    description: "Qalb oynasi va tuyg'ular ifodasi",
  },
  {
    word: "yomg'ir",
    synonyms: ["baran", "barchin", "qatra", "bulut yoshi", "nayson"],
    poetic: ["barchini bahor", "qatra-yi dur", "nayson suvi"],
    description: "Poshash va poklanish ramzi",
  },
  {
    word: "g'am",
    synonyms: ["alam", "hasrat", "huzn", "kulfat", "o'kinch", "qayg'u", "melanxoliya"],
    poetic: ["huzni muloyim", "alami hijron", "hasrati bepoyon"],
    description: "Yozuvchi ijodini charxlovchi his",
  },
  {
    word: "sevgi",
    synonyms: ["ishq", "muhabbat", "mavoro", "sadoqat", "vafo", "mehr"],
    poetic: ["ishqi pok", "muhabbati otashin", "saodati dil"],
    description: "Barcha san'at turlarining sarchashmasi",
  },
  {
    word: "shamol",
    synonyms: ["sabo", "nasim", "yel", "bo'ron", "sarsar", "shabada"],
    poetic: ["nasimi bahor", "saboyi sahar", "sarsari fano"],
    description: "O'zgarish va xabar eltuvchi ramz",
  },
  {
    word: "gul",
    synonyms: ["lola", "rayhon", "chechak", "gulnozi", "sumbul"],
    poetic: ["guli ra'no", "lola-yi hamro", "nazi parvar"],
    description: "G'unchalik va nafosat timsoli",
  },
  {
    word: "suv",
    synonyms: ["ob", "daryo", "chashma", "bulaq", "kavsar"],
    poetic: ["obi hayot", "chashma-yi zolal", "daryo-yi ishq"],
    description: "Tozalik va hayotiy oqim",
  },
  {
    word: "yo'l",
    synonyms: ["tariq", "sarhad", "soqil", "joziya", "manzil"],
    poetic: ["tariqi ishq", "yo'li bexatar", "manzili maqsud"],
    description: "Izlanish va taqdir yo'nalishi",
  },
]
