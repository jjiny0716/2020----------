# 과제를 수행하며 배운 것들

## OS의 다크 모드 활성화 여부를 기반으로 다크 모드 설정하기

css에서 OS의 다크 모드를 인식할려면 `prefers-color-scheme`를 사용하면 된다. [출처](https://studiomeal.com/archives/1053)

```css
/* only light mode */
@media (prefers-color-scheme: light) {
  .dark {
    display: none;
  }
}

/* only dark mode */
@media (prefers-color-scheme: dark) {
  body {
    color: lightgray;
    background: black;
  }
  .light {
    display: none;
  }
}
```

문제는, 라이트 모드 / 다크 모드를 토글링하는 버튼을 만들어야 했는데, 유저의 OS 설정을 바꿔버릴순 없으니 뭔가 추가적인 방법이 필요했다. 기존에 다크 모드를 구현했던 코드를 기억해봤는데, 위의 css코드와 섞기는 힘들어보였다. 그렇다면 css말고 JavaScript로 OS의 다크 모드를 인식하면 되지 않을까? 다행히 [관련 코드](https://jeycon.tistory.com/3)를 쉽게 찾을 수 있었다. 아래는 최종적으로 다크모드를 구현한 코드이다.

```css
/* html 태그의 attribute인 color-theme을 이용해 다크 모드를 구현 */
:root[color-theme="light"] {
  --color-background: #fff;
  --color-text: #000;
}

:root[color-theme="dark"] {
  --color-background: #111;
  --color-text: #fff;
}

body {
  /* 변수의 값이 바뀌면, 해당 변수를 참조하고 있던 모든 속성의 값도 자동으로 바뀐다. */
  color: var(--color-text);
  background-color: var(--color-background);
  transition: background-color 300ms ease, color 300ms ease;
}
```

```js
// html 태그의 color-theme의 값을 토글링하는 코드
function toggleDarkMode(e) {
  const btn = e.target.closest(".dark-mode-toggle-btn");
  if (!btn) return;

  const root = document.documentElement;
  const colorTheme = root.getAttribute("color-theme") === "light" ? "dark" : "light";
  root.setAttribute("color-theme", colorTheme);
  this.setState({ colorTheme: colorTheme });
});
```

```js
// 시작할 때 유저의 OS의 색 모드에 맞춰 라이트 모드 / 다크 모드를 설정하는 코드
export function setColorThemeByOSTheme() {
  const root = document.documentElement;
  if (window.matchMedia && window.matchMedia("prefers-color-scheme: dark").matches) {
    root.setAttribute("color-theme", "dark");
  } else root.setAttribute("color-theme", "light");
}
```

## lazy load를 적용하여 초기 로딩시간 줄이기

### Lazy Loading이란?

Image Lazy Loading은 페이지 안에 있는 실제 이미지들이 실제로 화면에 보여질 필요가 있을 때 로딩을 하는 기법이다.  
Lazy는 '가능한 길게 일을 미루는 행위'라는 의미를 갖고 있는데, 유사하게, lazy loading은 페이지 내에서 실제로 필요할 때까지 리소스의 로딩을 미루는 것이다.

### Lazy Loading을 사용하는 이유

1. 성능 향상
   Lazy Loading을 이용하면, 페이지 초기 로딩 시 필요한 이미지의 수를 줄일 수 있고, 이는 유저가 페이지를 더 빨리 이용할 수 있다는 것을 의미한다.
2. 비용 감소
   이미지가 필요하지 않다면 절대 로딩하지 않으므로, 페이지 전체를 보지 않았을 때 네트워크 이용량을 줄일 수 있다.

### Intersection observer를 이용해 구현하기

Intersection observer는 기본적으로 브라우저 뷰포트(Viewport)와 설정한 요소(Element)의 교차점을 관찰하며, 요소가 뷰포트에 포함되는지 포함되지 않는지, 더 쉽게는 사용자 화면에 지금 보이는 요소인지 아닌지를 구별하는 기능을 제공한다.  
이를 이용하면, 이미지가 화면상에 보이거나, 혹은 가까워졌을 때 이미지를 로딩시킬 수 있다.  
[여기](https://heropy.blog/2019/10/27/intersection-observer/) 엄청 자세하게 설명되어있다.

#### lazy loading 추상화하기

```js
class ImageLazyLoader {
  constructor(observerOption) {
    this.observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          // 현재 뷰포트에 요소가 포함된다면, loadImage()를 호출하고, observe를 해제한다
          if (!entry.isIntersecting) return;
          loadImage(entry.target);
          observer.unobserve(entry.target);
        });
      },
      observerOption ?? {
        rootMargin: "0px 0px",
        threshold: "0",
      }
    );
  }

  observe(target) {
    this.observer.observe(target);
  }

  // 여러 이미지를 observe하는 것을 추상화한 함수
  observeAll(targets) {
    targets.forEach((target) => {
      this.observer.observe(target);
    });
  }
}

// img태그의 src를 data-src에 있던 링크로 설정하여, 이미지를 로딩시킨다
function loadImage(imageElement) {
  console.log("lazy loaded.");
  imageElement.src = imageElement.dataset.src;
  imageElement.classList.remove("lazy");
}

// 생성후 내보내서 다른 곳에서 사용할 수 있게 하자
const imageLazyLoader = new ImageLazyLoader();

export { imageLazyLoader };
```

#### 마크업 예시

```html
<!-- 이미지가 로딩되지 않았을 때 기본적으로 불러올 이미지를 설정해준다 -->
<!-- data-src에 이미지의 url을 대신해서 적어놓자 -->
<!-- 나중에 이미지가 필요할 때 src는 data-src에 적은 값이 되면서 이미지가 로딩될 수 있다 -->
<img class="lazy" src="empty.png" alt="image" data-src="some/url" />
```

#### 스타일링 예시

```css
/* 처음 이미지가 로딩되지 않았을 때, 이미지의 크기가 0이므로, 화면에 img가 다 들어와버린다. */
/* 이미지를 감싸고 있는 컨테이너에 크기를 주자. */
.image-container {
  width: 350px;
  min-height: 200px;
}
```

이후 `imageLazyLoader.observeAll()`을 이용해 이미지들을 등록해놓으면, 이미지가 화면에 가까워졌을 때 로딩된다.  
진짜 되는지 궁금하다면 console.log를 찍어보거나 개발자 도구의 Network탭에서 확인해보자!

### Native Lazy Loading 방식

img, iframe 태그에 'loading=lazy' 속성을 추가해주면 native lazy loading을 적용할 수 있다.

```html
<img src="example.jpg" loading="lazy" alt="image" />
```

정말 간단하다. 하지만 최신기술이므로 브라우저가 지원하지 않을 수도 있다.

#### 참고한 자료

- https://heropy.blog/2019/10/27/intersection-observer/
- https://developer.mozilla.org/en-US/docs/Web/Performance/Lazy_loading
- https://developer.mozilla.org/ko/docs/Web/API/Intersection_Observer_API
- https://github.com/hanameee/vanillaJSKitty/blob/master/studyLog.md#intersection-observer-%EC%9D%B4%EB%9E%80
- https://helloinyong.tistory.com/297#title-5
