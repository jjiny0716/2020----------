import Component from './core/Component.mjs';
import SearchInput from './components/SearchInput.mjs';
import RandomCatBanner from './components/RandomCatBanner.mjs';
import SearchResult from './components/SearchResult.mjs';
import ImageInfo from './components/ImageInfo.mjs';
import DarkModeToggleButton from './components/DarkModeToggleButton.mjs';
import { setColorThemeByOSTheme } from './utils/setColorThemeByOSTheme.mjs'
import { catClient } from './api/catClient.mjs'
import { store } from "./store/store.mjs"

export default class App extends Component {
	setup() {
		setColorThemeByOSTheme();
		this.state = this.loadData() ?? {
			beforeFirstSearch: true,
			data: [],
			isLoading: false,
			imageInfoOn: false,
			selectedImageIndex: -1,
		};
		this.state.beforeFirstSearch = true;
	}

	template() {
		store.setLocalStorage("App-data", JSON.stringify(this.state));
		const { beforeFirstSearch, data, isLoading, imageInfoOn } = this.state;
		return `
    <header class="header" data-component="SearchInput"></header>
    <main>
		<section class="RandomCatBanner" data-component="RandomCatBanner"></section>
    <section class="SearchResult" data-component="SearchResult"></section>
		${data.length === 0 && !beforeFirstSearch ? '<p class="no-result-warning">검색된 고양이가 없습니다.</br>새로운 키워드로 다시 검색해주세요.</p>' : ''}
    </main>
		${isLoading ? '<div id="loading"></div>' : ""}
    ${imageInfoOn ? '<div class="ImageInfo" data-component="ImageInfo"></div>' : ''}
		<button class="dark-mode-toggle-btn" data-component="DarkModeToggleButton"></button>
    `;
	}

	generateChildComponent(target, name, key) {
		const { onSearch, getRandomCats, showImageInfo, closeImageInfo } = this;
		if (name === 'SearchInput') {
			return new SearchInput(target, () => {
				return {
					onSearch: onSearch.bind(this),
					getRandomCats: getRandomCats.bind(this),
				};
			});
		} 
		else if (name === 'RandomCatBanner') {
			return new RandomCatBanner(target);
		} 
		else if (name === 'SearchResult') {
			return new SearchResult(target, () => {
				const { data } = this.state;
				return {
					data,
					showImageInfo: showImageInfo.bind(this),
				};
			});
		} 
		else if (name === 'ImageInfo') {
			return new ImageInfo(target, () => {
				const { data, selectedImageIndex } = this.state;
				return {
					catInfo: data[selectedImageIndex],
					closeImageInfo: closeImageInfo.bind(this),
				};
			});
		}
		else if (name === 'DarkModeToggleButton') {
			return new DarkModeToggleButton(target);
		}
	}

	loadData() {
		const data = JSON.parse(store.getLocalStorage("App-data"));
		return data;
	}

	async onSearch(keyword) {
		this.setState({ isLoading: true });
		const { data } = await catClient.fetchCatsByKeyword(keyword);
		this.setState({ beforeFirstSearch: false, data, isLoading: false });
	}

	async getRandomCats() {
		this.setState({ isLoading: true });
		const { data } = await catClient.fetchRandomCats();
		this.setState({ beforeFirstSearch: false, data, isLoading: false });
	}
	
	showImageInfo(index) {
		this.setState({
			imageInfoOn: true,
			selectedImageIndex: index,
		});
	}

	closeImageInfo() {
		this.setState({
			imageInfoOn: false,
		})
	}
}
