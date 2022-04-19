import Component from '../core/Component.mjs';
import { imageLazyLoader } from '../utils/LazyLoader.mjs';

export default class SearchResult extends Component {
	template() {
		const { data } = this.props;
		return `
    ${data
			.map(cat => `
        <div class="item">
          <img class="lazy" src="./src/assets/images/empty.png" alt=${cat.name} data-src=${cat.url} />
          <span class="cat-name">${cat.name}</span>
        </div>
      `)
			.join('')}
    `;
	}

  setEvents() {
    const { showImageInfo } = this.props;
    this.addEventListener("click", ".item", (e) => {
      const selectedItem = e.target.closest(".item");
      const index = [...this.target.querySelectorAll(".item")].findIndex((item) => item === selectedItem);
      showImageInfo(index);
    })
  }

  afterMount() {
    imageLazyLoader.observeAll(this.target.querySelectorAll("img.lazy"));
  }

  afterUpdate() {
    imageLazyLoader.observeAll(this.target.querySelectorAll("img.lazy"));
  }
}
