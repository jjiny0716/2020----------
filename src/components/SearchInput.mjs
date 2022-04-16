import Component from "../core/Component.mjs";

export default class SearchInput extends Component {
  setup() {
    this.state = {
      recentKeyword: [],
    }
  }

  template() {
    const { recentKeyword } = this.state;
    return `
    <div class="search-controls">
      <input class="SearchInput" type="text" placeholder="고양이를 검색해보세요.|">
      <button class="random-cat-btn">아무거나 주세요!!</button>
    </div>
    <div class="recent-keywords">
      ${recentKeyword.map((keyword) => `<span class="keyword">${keyword}</span>`).join('')}
    </div>
    `;
  }

  setEvents() { 
    const { onSearch, getRandomCats } = this.props;
    this.addEventListener("keyup", ".SearchInput", (e) => {
      if (e.key === 'Enter') {
        const keyword = e.target.value;
        if (!keyword) return;
        onSearch(keyword);

        const { recentKeyword } = this.state;
        recentKeyword.unshift(keyword);
        if (recentKeyword.length > 5) recentKeyword.pop();
        this.setState({ recentKeyword });
      }
    })
    this.addEventListener("click", ".SearchInput", (e) => {
      e.target.value = "";
    })
    this.addEventListener("click", ".random-cat-btn", (e) => {
      getRandomCats();
    })
    this.addEventListener("click", ".recent-keywords", (e) => {
      if (!e.target.classList.contains("keyword")) return;
      const keyword = e.target.textContent;
      onSearch(keyword);
    })
  }

  afterMount() {
    this.searchInput = this.target.querySelector(".SearchInput");
    this.searchInput.focus();
  }
}
