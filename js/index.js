class ServicesCarousel {
    constructor() {
        this.cards = document.querySelectorAll('.service_card');
        this.progressSegments = document.querySelectorAll('.progress_segment');
        this.currentIndex = 0;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 3000;
        this.fillAnimation = null;
        
        this.video = document.querySelector('.video-background video');
        this.bgImages = document.querySelectorAll('.bg-image');
        this.videoDuration = 3000; 
        
        this.init();
    }
    
    init() {
        this.startAutoPlay();
        
        this.addEventListeners();
        
        setTimeout(() => {
            this.startFillAnimation();
        }, 100);
        
        this.initBackgroundAnimation();
        
        if (window.innerWidth <= 1024) {
            this.updateMobileTitle(this.currentIndex);
        }
        
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 1024) {
                this.startBackgroundAnimation(this.currentIndex);
            } else {
                if (this.video) {
                    this.video.style.display = 'block';
                }
                this.bgImages.forEach(img => img.classList.remove('active'));
            }
        });
    }
    
    addEventListeners() {
        this.cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                this.stopFillAnimation();
                this.goToSlide(index);
                this.restartAutoPlay();
            });
        });
        
        this.progressSegments.forEach((segment, index) => {
            segment.addEventListener('click', () => {
                this.stopFillAnimation();
                this.goToSlide(index);
                this.restartAutoPlay();
            });
        });
        
        const container = document.querySelector('.services_container');
        container.addEventListener('mouseenter', () => {
            this.stopAutoPlay();
            this.stopFillAnimation();
        });
        
        container.addEventListener('mouseleave', () => {
            this.startAutoPlay();
        });
        
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.stopFillAnimation();
                    this.previousSlide();
                    this.restartAutoPlay();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.stopFillAnimation();
                    this.nextSlide();
                    this.restartAutoPlay();
                    break;
            }
        });
    }
    
    goToSlide(index) {

        if (index < 0 || index >= this.cards.length) return;
        
        this.cards.forEach(card => card.classList.remove('active'));
        this.progressSegments.forEach(segment => segment.classList.remove('active'));
        
        if (this.cards[index]) {
            this.cards[index].classList.add('active');
        }
        if (this.progressSegments[index]) {
            this.progressSegments[index].classList.add('active');
        }
        
        this.scrollToActiveCard(index);
        
        this.currentIndex = index;
        
        this.startFillAnimation();
        
        this.startBackgroundAnimation(index);
    }
    
    scrollToActiveCard(index) {
        const activeCard = this.cards[index];
        const container = document.querySelector('.services_cards');
        
        if (!activeCard || !container) return;
        
        const cardWidth = activeCard.offsetWidth;
        const cardLeft = activeCard.offsetLeft;
        const containerWidth = container.offsetWidth;
        const scrollLeft = cardLeft - (containerWidth / 2) + (cardWidth / 2);
        
        container.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
    }
    
    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.cards.length;
        this.goToSlide(nextIndex);
    }
    
    previousSlide() {
        const prevIndex = this.currentIndex === 0 ? this.cards.length - 1 : this.currentIndex - 1;
        this.goToSlide(prevIndex);
    }
    
    startAutoPlay() {
        this.stopAutoPlay(); 
        this.autoPlayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayDelay);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    restartAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
    
    startFillAnimation() {

        if (this.fillAnimation) {
            clearInterval(this.fillAnimation);
        }
        
        const activeSegment = this.progressSegments[this.currentIndex];
        if (!activeSegment) return;
        
        activeSegment.style.setProperty('--fill-percentage', '0%');
        
        const startTime = Date.now();
        const duration = this.autoPlayDelay;
        
        this.fillAnimation = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const percentage = progress * 100;
            
            activeSegment.style.setProperty('--fill-percentage', `${percentage}%`);
            
            if (progress >= 1) {
                clearInterval(this.fillAnimation);
                this.fillAnimation = null;
                
                if (window.innerWidth <= 820) {
                    activeSegment.style.setProperty('--fill-percentage', '100%');
                }
            }
        }, 16); 
    }
    
    stopFillAnimation() {
        if (this.fillAnimation) {
            clearInterval(this.fillAnimation);
            this.fillAnimation = null;
        }
        
        const activeSegment = this.progressSegments[this.currentIndex];
        if (activeSegment) {
            activeSegment.style.setProperty('--fill-percentage', '0%');
        }
    }
    
    startBackgroundAnimation(cardIndex) {
        if (window.innerWidth > 1024) {
            return; 
        }
        
        this.bgImages.forEach(img => img.classList.remove('active'));
        
        this.updateMobileTitle(cardIndex);

        if (cardIndex === 0) {
            if (this.video) {
                this.video.style.display = 'block';
                this.video.currentTime = 0;
                
                const playPromise = this.video.play();
                
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                        })
                        .catch(error => {
                            console.log('Video play was interrupted:', error.name);
                        });
                }
            }
            return; 
        }
        
        if (this.video) {
            this.video.style.display = 'none';
        }
        
        const targetImage = document.querySelector(`.bg-image[data-card="${cardIndex}"]`);
        if (targetImage) {
            targetImage.classList.add('active');
        }
    }
    
    updateMobileTitle(cardIndex) {
        if (window.innerWidth > 1024) return;
        
        const titleElement = document.querySelector('.angel_title');
        const subtitleElement = document.querySelector('.angel_subtitle');
        const progressBar = document.querySelector('.progress_bar');
        if (!titleElement) return;
        
        if (cardIndex === 1) {
            titleElement.innerHTML = "Косметология: уходы, инъекции, лифтинг";
            titleElement.style.setProperty('content', 'none', 'important');
            if (progressBar) {
                progressBar.style.setProperty('margin-top', '180px', 'important');
            }
        } else if (cardIndex === 2) {
            titleElement.innerHTML = "Коррекция фигуры и силуэта";
            titleElement.style.setProperty('content', 'none', 'important');
            if (progressBar) {
                progressBar.style.setProperty('margin-top', '220px', 'important');
            }
        } else if (cardIndex === 3) {
            titleElement.innerHTML = "SPA и европейские массажи";
            titleElement.style.setProperty('content', 'none', 'important');
            if (progressBar) {
                progressBar.style.setProperty('margin-top', '220px', 'important');
            } 
        } else if (cardIndex === 4) {
            titleElement.innerHTML = "Велнес-программы и флоатация";
            titleElement.style.setProperty('content', 'none', 'important');
            if (progressBar) {
                progressBar.style.setProperty('margin-top', '220px', 'important');
            }
        } else if (cardIndex === 5) {
            titleElement.innerHTML = "Beauty-услуги: волосы, ногти, макияж";
            titleElement.style.setProperty('content', 'none', 'important');
            if (progressBar) {
                progressBar.style.setProperty('margin-top', '180px', 'important');
            }
        } else if (cardIndex === 6) {
            titleElement.innerHTML = "Тайские и балийские массажи";
            titleElement.style.setProperty('content', 'none', 'important');
            if (progressBar) {
                progressBar.style.setProperty('margin-top', '180px', 'important');
            }
        } else {
            titleElement.innerHTML = "Ангел Concept— центр премиального ухода и косметологии в Ставрополе";
            titleElement.style.setProperty('content', 'none', 'important');
            if (progressBar) {
                progressBar.style.setProperty('margin-top', '60px', 'important');
            }
        }
        
        if (subtitleElement) {
            subtitleElement.innerHTML = "Место, где вы выбираете заботу о себе как стиль жизни. Эстетично, профессионально и легко";
            subtitleElement.style.setProperty('content', 'none', 'important');
            subtitleElement.style.setProperty('font-size', '14px', 'important');
            subtitleElement.style.setProperty('margin-top', '24px', 'important');
        }
    }
    
    initBackgroundAnimation() {
        if (window.innerWidth <= 1024) {
            this.startBackgroundAnimation(0);
        } else {
            if (this.video) {
                this.video.style.display = 'block';
                this.video.currentTime = 0;
                
                const playPromise = this.video.play();
                
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => {
                        })
                        .catch(error => {
                            console.log('Video play was interrupted:', error.name);
                        });
                }
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ServicesCarousel();
    
    // Мобильное меню
    const mobileMenuBtn = document.querySelector('.mobile_menu_btn');
    const mobileMenu = document.querySelector('.mobile_menu');
    const mobileMenuClose = document.querySelector('.mobile_menu_close');
    
    // Открытие меню при клике на кнопку
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            if (mobileMenu) {
                mobileMenu.classList.add('active');
                document.body.style.overflow = 'hidden'; // Блокируем прокрутку страницы
            }
        });
    }
    
    // Закрытие меню при клике на кнопку закрытия
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', () => {
            if (mobileMenu) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = ''; // Восстанавливаем прокрутку страницы
            }
        });
    }
    
    // Закрытие меню при клике вне меню
    if (mobileMenu) {
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
    
    // Закрытие меню при нажатии Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Обработка подменю
    const menuItems = document.querySelectorAll('.mobile_menu_item');
    menuItems.forEach(item => {
        item.addEventListener('click', () => {
            const submenu = item.nextElementSibling;
            const arrow = item.querySelector('.mobile_menu_arrow');
            
            if (submenu && submenu.classList.contains('mobile_submenu')) {
                // Закрываем все другие подменю
                document.querySelectorAll('.mobile_submenu').forEach(sub => {
                    if (sub !== submenu) {
                        sub.style.display = 'none';
                    }
                });
                
                document.querySelectorAll('.mobile_menu_item').forEach(menuItem => {
                    if (menuItem !== item) {
                        menuItem.classList.remove('mobile_menu_item_active');
                        const otherArrow = menuItem.querySelector('.mobile_menu_arrow img');
                        if (otherArrow) {
                            otherArrow.src = 'icon/Union.svg';
                        }
                    }
                });
                
                // Переключаем текущее подменю
                if (submenu.style.display === 'block') {
                    submenu.style.display = 'none';
                    item.classList.remove('mobile_menu_item_active');
                    if (arrow) {
                        const arrowImg = arrow.querySelector('img');
                        if (arrowImg) {
                            arrowImg.src = 'icon/Union.svg';
                        }
                    }
                } else {
                    submenu.style.display = 'block';
                    item.classList.add('mobile_menu_item_active');
                    if (arrow) {
                        const arrowImg = arrow.querySelector('img');
                        if (arrowImg) {
                            arrowImg.src = 'icon/union2.svg';
                        }
                    }
                }
            }
        });
    });
});
