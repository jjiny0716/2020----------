import { API_ENDPOINT } from "../constants.mjs";

async function getRequest(url) {
	try {
		const result = await fetch(url);
		if (!result.ok) {
			throw new Error("서버 상태가 불안정합니다.");
		}
		return result;
	} catch (e) {
		console.warn(e);
	}
}

class CatClient {
	async fetchCatsByKeyword(keyword) {
		const response = await getRequest(`${API_ENDPOINT}/api/cats/search?q=${keyword}`);
		const data = await response.json();
		return data;
	}

	async fetchRandomCats() {
		const response = await getRequest(`${API_ENDPOINT}/api/cats/random50`);
		const data = await response.json();
		return data;
	}

	async fetchCatInfo(id) {
		const response = await getRequest(`${API_ENDPOINT}/api/cats/${id}`);
		const data = await response.json();
		return data;
	}
}

export const catClient = new CatClient();
