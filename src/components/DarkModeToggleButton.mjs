import Component from "../core/Component.mjs";

export default class DarkModeToggleButton extends Component {
  setup() {
    this.state = {
      colorTheme: document.documentElement.getAttribute("color-theme"), // "light", "dark"
    };
  }

  template() {
    const { colorTheme } = this.state;
    return `
    <i class="fa-solid fa-moon"></i>
    <i class="fa-solid fa-sun"></i>
    <div class="circle ${colorTheme === "dark" ? "active" : ""}"></div>
    `;
  }

  setEvents() {
    this.addEventListener("click", ".dark-mode-toggle-btn", this.toggleDarkMode.bind(this));
  }

  toggleDarkMode(e) {
    const btn = e.target.closest(".dark-mode-toggle-btn");
    if (!btn) return;
  
    const root = document.documentElement;
    const colorTheme = root.getAttribute("color-theme") === "light" ? "dark" : "light";
    root.setAttribute("color-theme", colorTheme);
    this.setState({ colorTheme: colorTheme });
  };
}
