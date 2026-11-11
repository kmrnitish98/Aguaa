/**
 * quotes.js - Hinglish Quote System
 * 
 * Provides deterministic quotes for each page of the biodata based on the user's name.
 * This ensures the quotes remain consistent for a given profile across all templates.
 */

const PAGE_1_QUOTES = [
  "Rishta sirf do logo ka nahi, do parivaron ke vishwas ka bandhan hota hai.",
  "Jahan samman aur samajh ho, wahi rishta sabse khoobsurat hota hai.",
];

const PAGE_2_QUOTES = [
  "Ek accha jeevansathi zindagi ko aur bhi sundar bana deta hai.",
  "Vishwas aur apnapan har safal rishte ki sabse badi taqat hai.",
];

const PAGE_3_QUOTES = [
  "Umeed hai ki ye safar pyaar, samman aur khushiyon se bhara hoga.",
  "Do dilon ka milan tabhi safal hota hai jab dono parivaron ka ashirwad saath ho.",
  "Ek sundar bhavishya ki shuruaat ek sahi rishte se hoti hai.",
];

/**
 * Get a deterministic quote for a specific page.
 * @param {number} pageNum - The page number (1, 2, or 3)
 * @param {string} fullName - The full name of the user to use as a seed
 * @returns {string} - The selected quote
 */
export const getQuoteForPage = (pageNum, fullName = '') => {
  const seed = fullName.length + (fullName.charCodeAt(0) || 0);
  
  if (pageNum === 1) {
    return PAGE_1_QUOTES[seed % PAGE_1_QUOTES.length];
  }
  if (pageNum === 2) {
    return PAGE_2_QUOTES[seed % PAGE_2_QUOTES.length];
  }
  if (pageNum === 3) {
    return PAGE_3_QUOTES[seed % PAGE_3_QUOTES.length];
  }
  
  return "";
};
