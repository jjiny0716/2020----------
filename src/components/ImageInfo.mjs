import Component from "../core/Component.mjs";
import { catClient } from "../api/catClient.mjs"

export default class ImageInfo extends Component {
  setup() {
    const { catInfo } = this.props;
    this.state = {
      catInfo,
    }

    this.loadingAdditionalCatInfo();
  }

  template() {
    const { catInfo } = this.state;
    const { name, url, temperament, origin } = catInfo;
    return `
    <div class="content-wrapper">
      <div class="title">
        <span>${name}</span>
        <div class="close">x</div>
      </div>
      <img src="${url}" alt="${name}"/>        
      <div class="description">
        <div>성격: ${temperament}</div>
        <div>태생: ${origin}</div>
      </div>
    </div>`;
  }

  setEvents() {
    const { closeImageInfo } = this.props;
    this.addEventListener("click", ".ImageInfo", (e) => {
      if (e.target === e.currentTarget || e.target.classList.contains("close")) closeImageInfo();
    });
    
    this.onESC = (e) => {
      if (e.key !== "Escape") return;
      closeImageInfo();
    }
    addEventListener("keydown", this.onESC);
  }

  beforeUnmount() {
    removeEventListener("keydown", this.onESC);
  }

  async loadingAdditionalCatInfo() {
    let { catInfo } = this.state;
    catInfo = await catClient.fetchCatInfo(catInfo.id);
    this.setState({ catInfo: catInfo.data });
  }
}
