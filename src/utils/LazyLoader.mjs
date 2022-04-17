class ImageLazyLoader {
  constructor(observerOption) {
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {

        // 현재 뷰포트에 요소가 포함된다면, loadImage()를 호출하고, observe를 해제한다.
        if (!entry.isIntersecting) return;
        loadImage(entry.target);
        observer.unobserve(entry.target);
      })
    }, observerOption ?? {
      rootMargin: '0px 0px',
      threshold: '0',
    })
  }

  observe(target) {
    this.observer.observe(target);
  }

  // 여러 이미지를 observe하는 것을 추상화한 함수이다.
  observeAll(targets) {
    targets.forEach(target => {
      this.observer.observe(target);
    });
  }
}

// img태그의 src를 data-src에 있던 링크로 설정하여, 이미지를 로딩시킨다. 
function loadImage(imageElement) {
  console.log("lazy loaded.");
  imageElement.src = imageElement.dataset.src;
  imageElement.classList.remove("lazy");
}

const imageLazyLoader = new ImageLazyLoader();

export { imageLazyLoader };
