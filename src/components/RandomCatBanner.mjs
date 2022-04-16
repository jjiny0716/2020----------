import Component from "../core/Component.mjs";
import { catClient } from "../api/catClient.mjs"

export default class RandomCatBanner extends Component {
	setup() {
    this.state = {
      data: [],
      curIndex: 0,
    }
    this.loadingRandomCats();
  }

	template() {
		let { data, curIndex } = this.state;
    data = data.slice(curIndex, curIndex + 5);
		return `
    ${data
			.map(cat => `
        <div class="item">
          <img src=${cat.url} alt=${cat.name} />
        </div>
      `)
			.join('')}
    `;
	}

  async loadingRandomCats() {
    let data = [];
		try {
			const { data: responseData } = await catClient.fetchRandomCats();
			data = responseData;
		} catch {
			data = [];
		}
    this.setState({ data });
  }

}
