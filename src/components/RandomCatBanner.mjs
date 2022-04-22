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
		return `
    ${data
			.map(({ url, name }, i) => `
        <div class="item ${i >= curIndex && i < curIndex + 5 ? "" : "hidden"}">
          <img src=${url} alt=${name} />
        </div>
      `)
			.join('')}
    <button class="prev-btn" ${curIndex === 0 ? "disabled" : ""}>&lt;</button>
    <button class="next-btn" ${curIndex >= data.length - 5 ? "disabled" : ""}>&gt;</button>
    `;
	}

  async loadingRandomCats() {
		const { data } = await catClient.fetchRandomCats();
    this.setState({ data });
  }

  setEvents() {
    this.addEventListener("click", ".RandomCatBanner", (e) => {
      if (e.target.classList.contains("prev-btn")) this.showPrevImage();
      if (e.target.classList.contains("next-btn")) this.showNextImage();
    });
  }

  showPrevImage() {
    const { curIndex } = this.state;
    if (curIndex === 0) return;
    this.setState({ curIndex: curIndex - 5 });
  }

  showNextImage() {
    const { data, curIndex } = this.state;
    if (curIndex >= data.length - 5) return;
    this.setState({ curIndex: curIndex + 5 });
  }

}
