class FloatingCatExtension {
  constructor() {
    this.catWindow = null;
    this.timer = null;
    this.catApis = [
      'https://cataas.com/cat?width=180&height=140',
      'https://api.thecatapi.com/v1/images/search',
      'https://cataas.com/cat?width=180&height=140'
    ];
    this.currentApiIndex = 0;
    this.init();
  }

  init() {
    this.startTimer();
    
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stopTimer();
      } else {
        this.startTimer();
      }
    });
  }

  startTimer() {
    if (this.timer) return;
    
    this.showCatWindow();
    
    this.timer = setInterval(() => {
      this.showCatWindow();
    }, 20000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  async getCatImage() {
    for (let i = 0; i < this.catApis.length; i++) {
      try {
        const apiUrl = this.catApis[this.currentApiIndex];
        this.currentApiIndex = (this.currentApiIndex + 1) % this.catApis.length;
        
        if (apiUrl.includes('thecatapi')) {
          const response = await fetch(apiUrl);
          const data = await response.json();
          return data[0]?.url;
        } else {
          return `${apiUrl}&t=${Date.now()}`;
        }
      } catch (error) {
        console.log('Cat API failed, trying next one...', error);
        continue;
      }
    }
    
    return `https://cataas.com/cat?width=180&height=140&t=${Date.now()}`;
  }

  createCatWindow() {
    const window = document.createElement('div');
    window.className = 'floating-cat-window slide-up';
    
    window.innerHTML = `
      <div class="cat-image-container">
        <button class="cat-window-close" title="Close">&times;</button>
        <div class="cat-loading">
          <div class="loading-spinner"></div>
          <div>Loading cat...</div>
        </div>
      </div>
    `;
    

    const closeBtn = window.querySelector('.cat-window-close');
    closeBtn.addEventListener('click', () => {
      window.style.transform = 'translateY(100%)';
      window.style.opacity = '0';
      setTimeout(() => window.remove(), 300);
    });
    
   
    setTimeout(() => {
      if (window.parentNode) {
        window.style.transform = 'translateY(100%)';
        window.style.opacity = '0';
        setTimeout(() => window.remove(), 300);
      }
    }, 15000);
    
    return window;
  }

  async showCatWindow() {

    if (this.catWindow && this.catWindow.parentNode) {
      this.catWindow.style.transform = 'translateY(100%)';
      this.catWindow.style.opacity = '0';
      setTimeout(() => this.catWindow.remove(), 300);
    }
    
    this.catWindow = this.createCatWindow();
    document.body.appendChild(this.catWindow);
    
    try {
      const catImageUrl = await this.getCatImage();
      const imageContainer = this.catWindow.querySelector('.cat-image-container');
      
      const img = document.createElement('img');
      img.className = 'cat-image';
      img.alt = 'Random Cat';
      
      img.onload = () => {
        const closeBtn = imageContainer.querySelector('.cat-window-close');
        imageContainer.innerHTML = '';
        imageContainer.appendChild(closeBtn);
        imageContainer.appendChild(img);
      };
      
      img.onerror = () => {
        const closeBtn = imageContainer.querySelector('.cat-window-close');
        imageContainer.innerHTML = `
          <div style="text-align: center; color: rgba(255, 255, 255, 0.8); font-size: 11px;">
            <div style="font-size: 32px;">🐱</div>
            <div>Meow! Failed to load</div>
          </div>
        `;
        imageContainer.appendChild(closeBtn);
      };
      
      img.src = catImageUrl;
      
    } catch (error) {
      const imageContainer = this.catWindow.querySelector('.cat-image-container');
      const closeBtn = imageContainer.querySelector('.cat-window-close');
      imageContainer.innerHTML = `
        <div style="text-align: center; color: rgba(255, 255, 255, 0.8); font-size: 11px;">
          <div style="font-size: 32px;">🐱</div>
          <div>Meow! Something went wrong</div>
        </div>
      `;
      imageContainer.appendChild(closeBtn);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new FloatingCatExtension();
  });
} else {
  new FloatingCatExtension();
}