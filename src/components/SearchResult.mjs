import Component from '../core/Component.mjs';

export default class SearchResult extends Component {
	setup() {}

	template() {
		const { data } = this.props;
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

  setEvents() {
    const { showImageInfo } = this.props;
    this.addEventListener("click", ".item", (e) => {
      const selectedItem = e.target.closest(".item");
      const index = [...this.target.querySelectorAll(".item")].findIndex((item) => item === selectedItem);
      showImageInfo(index);
    })
  }
}
