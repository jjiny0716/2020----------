import { API_ENDPOINT } from "../constants.mjs";

async function getRequest(url) {
	try {
		const result = await fetch(url);
		if (!result.ok) {
			const { status } = result;
			if (status >= 400 && status < 500) throw new Error(`요청 오류: ${status}`);
			else if (status >= 500 && status < 600) throw new Error(`서버 오류: ${status}`);
			throw new Error(`오류: ${status}`);
		}
		return await result.json();
	} catch (e) {
		console.warn(e);
		return null;
	}
}

class CatClient {
	async fetchCatsByKeyword(keyword) {
		return await getRequest(`${API_ENDPOINT}/api/cats/search?q=${keyword}`) ?? { data: [] };
	}

	async fetchRandomCats() {
		return await getRequest(`${API_ENDPOINT}/api/cats/random50`) ?? { data: [] };
	}

	async fetchCatInfo(id) {
		return await getRequest(`${API_ENDPOINT}/api/cats/${id}`);
	}
}

export const catClient = new CatClient();
