var SITE_CONFIG = {
    general: {
        responsive: '(max-width: 960px)', /* kaç px de responsive geçeceği */
        regex: {
            typ1: /[^a-zA-ZıiIğüşöçİĞÜŞÖÇ\s]+/, /* sadece harf */
            typ2: /[^0-9\s]+/, /* sadece rakam */
            typ3: /[^a-zA-ZıiI0-9ğüşöçİĞÜŞÖÇ\s]+/ /* harf rakam karışık */
        },
    },
    management: {

        /* 
            url selection 
        */
        urlSelected: [
            
        ],
        
        /* 
            form yönetimi 
        */
        form: [
            
        ],

        /* 
            append yönetimi 
        */
        append: [
            
        ]
    },
    plugin: {

        animate: {
            animCls: 'slideInUp', // viewporta girince alacağı class belirlenir.
            threshold: 0, // threshold değeri
            delay: 0, // girilen milisaniyeye göre settimeot ile classı atacak
        },

        /* 
            zoom gallery
        */
        zoomGallery: {
            
        },

        /* 
           social Share
       */
        socialShare: {

        },

        /* 
            load more button
        */
        loadMoreButton: {
           
        },

        /* 
            counter
        */
        counter: {
            
        },

        /* 
           kategori filter
       */
        categoryFilter: {
            
        },

        /*  
            list sort
        */
        listSort: [
           
        ],

        /* 
           liste görünüm
       */
        viewer: {
        
        },

        /* 
            kategori swiper
        */
        catSwiper: [
           
        ],

        /* 
         popular worlds
        */
        popularWorlds: [
            
        ],

        /* 
            custom search
        */
        customSearch: {
            
        },

        /* 
            dropDown
        */
        dropDown: [
            
        ],

        /* 
            main menu
        */
        menu: [

        ],

        /* 
            swiper config
        */
        swiper: {

            defaultOpt: {
                videoStretching: 'responsive'
            },

            main: {
                paginationClickable: true,
                preloadImages: false,
                lazyLoading: true,
                slidesPerView: 1,
                loop: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            },

            widgetFive: {
                paginationClickable: true,
                preloadImages: false,
                lazyLoading: true,
                slidesPerView: 5,
                loop: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            },

            widgetThree: {
                paginationClickable: true,
                preloadImages: false,
                lazyLoading: true,
                slidesPerView: 3,
                loop: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            },

            widgetVertical: {
                paginationClickable: true,
                preloadImages: false,
                lazyLoading: true,
                slidesPerView: 1,
                loop: true,
                direction: 'vertical'
            },

            widgetAuto: {
                paginationClickable: true,
                preloadImages: false,
                lazyLoading: true,
                slidesPerView: 'auto',
                //loop: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
            },

            WidgetMarquee: {
                spaceBetween: 0,
                centeredSlides: true,
                speed: 6000,
                autoplay: {
                    delay: 1,
                },
                loop: true,
                slidesPerView:'auto',
                allowTouchMove: false,
                disableOnInteraction: true
            }
            
        },

        /* input, selectbox, radiobox stillendirme */
        styler: [
            //passiveIco: ikon
            //activeIco: tıklandıktan sonraki ikon
            //class: özel class
            {
                ID: 'select',
                prop: {
                    wrapper: true,
                    passiveIco: '<i class="icon-arrow3-right"></i>',
                    activeIco: '',
                    customClass: ''
                }
            },
            {
                ID: 'input:checkbox',
                prop: {
                    wrapper: true,
                    passiveIco: '<i class="icon-checkbox"></i>',
                    activeIco: '<i class="icon-checkbox-active"></i>',
                    customClass: ''
                }
            },
            {
                ID: 'input:radio',
                prop: {
                    wrapper: true,
                    passiveIco: '<i class="icon-radio"></i>',
                    activeIco: '<i class="icon-radio-active"></i>',
                    customClass: ''
                }
            }
        ]
    }
};