/**
 * Google Books API 책 검색
 * @param {string} query - 검색 키워드
 * @returns {Promise<Array>} 검색된 책 목록
 */
export async function searchGoogleBooks(query) {
  if (!query) return [];

  const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${apiKey}&maxResults=10`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Google Books API 검색 실패:", error);
    throw new Error("검색에 실패했습니다.");
  }
}