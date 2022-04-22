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
	async fetchCatsByKeyword(keyword, page) {
		return await getRequest(`${API_ENDPOINT}/api/cats/search?q=${keyword}&page=${page}`) ?? { data: [] };
	}

	async fetchRandomCats(tryCount = 1) {
		// 최대 10번 로딩 시도후, 데이터를 얻지 못했으면 빈 데이터 반환
		if (tryCount > 10) return { data: [] };
		return await getRequest(`${API_ENDPOINT}/api/cats/random50`) ?? await this.fetchRandomCats(tryCount + 1);
	}

	async fetchCatInfo(id) {
		return await getRequest(`${API_ENDPOINT}/api/cats/${id}`);
	}
}

export const catClient = new CatClient();
