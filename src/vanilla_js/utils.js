

/**
 * @description EMOS Javascript Library
 * @abstract Initial Functions are initialize in this class
 *
 */

class EMOS {
  constructor() {
    this.init();
  }

  /**
   * @description Emos Lazy Load Function
   * @abstract This function uses IntersectionObserver API that can detect object which is reveals in screen .
   *
   */
  lazyLoad() {
    const el = {
      img: "[data-background]:not(.activeted), [data-image-src]:not(.activeted), picture.prm-media:not(.activeted)",
    };
    const cls = "activeted";

    function set(ID) {
      let src = ID.getAttribute("data-background") || "";

      if (src != "") ID.style.backgroundImage = "url(" + src + ")";

      src = ID.getAttribute("data-image-src") || ID.getAttribute("data-original") || "";
      if (src != "") ID.setAttribute("src", src);

      if (ID.classList.contains("prm-media")) ID.getElementsByClassName("lazy-picture")[0].setAttribute("media", "(max-width:0)");

      ID.classList.add(cls.activeted);
    }

    let imgs = [].slice.call(document.querySelectorAll(el.img));

    if ("IntersectionObserver" in window) {
      /* support */
      let lazyImageObserver = new IntersectionObserver(
        function(entries, observer) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting && entry.intersectionRatio > 0) {
              var ID = entry.target;
              _t.set(ID);
              lazyImageObserver.unobserve(ID);
            }
          });
        },
        {
          threshold: [0, 1.0],
        }
      );

      imgs.forEach(function(ID) {
        lazyImageObserver.observe(ID);
      });
    } else {
      /* not support... */
      imgs.forEach(function(ID) {
        if (!ID.classList.contains(_t.cls.activeted)) set(ID);
      });
    }
  }

  /**
   * @description Mobile Detection
   * @returns {Boolean}
   */

  isMobile() {
    const agentList = [
      "midp",
      "240x320",
      "blackberry",
      "netfront",
      "nokia",
      "panasonic",
      "portalmmm",
      "sharp",
      "sie-",
      "sonyericsson",
      "symbian",
      "windows ce",
      "benq",
      "mda",
      "mot-",
      "opera mini",
      "philips",
      "pocket pc",
      "sagem",
      "samsung",
      "sda",
      "sgh-",
      "vodafone",
      "xda",
      "palm",
      "iphone",
      "ipod",
      "android",
      "ipad",
    ];
    const currentAgent = navigator.userAgent.toLowerCase();
    agentList.forEach(agent => {
      if (agent == currentAgent) return true;
    });
    return false;
  }

  /**
   * @description Initial Function
   */

  init() {
    this.lazyLoad();
  }
}

/**
 * @description EMOS Utility Class
 *
 */

class Utils extends EMOS {
  /**
   * @description Get elements
   * @param {String} attr HTML element attribute name
   * @return {Array} Array of HTMLElement
   */

  static getElementByAttribute(attr) {
    let elements = [];
    let all = document.getElementsByTagName("*");
    for (const el of all) {
      if (el.getAttribute(attr)) elements.push(el);
    }
    return elements;
  }

  /**
   * @description This function checks element existence in DOM
   * @param {String} el
   */

  static checkElementExist(el) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(el) || document.getElementsByClassName(el)[0] || document.getElementById(el)) {
        resolve();
      } else {
        reject();
      }
    });
  }

  /**
   * @description This function adds class to target element
   * @param {String} target
   * @param {String} addedClass
   * @param {String} animatedClass
   */
  static addClassToTarget(target, addedClass, animatedClass) {
    document.querySelector(target).classList.add(addedClass);
    if (animatedClass) {
      const animated = this.animate(addedClass, animatedClass);
      this.checkElementExist(addedClass)
        .then(() => {
          animated();
        })
        .catch(() => {
          document.querySelector(target).classList.add(addedClass);
        });
    }
  }

  /**
   * @description This function removes class from target element
   * @param {String} target
   * @param {String} addedClass
   * @param {String} animatedClass
   */

  static removeClassFromTarget(target, addedClass, animatedClass) {
    const targetItem = document.querySelector(target);

    this.checkElementExist(animatedClass)
      .then(() => {
        targetItem.classList.remove(animatedClass);
        setTimeout(() => {
          targetItem.classList.remove(addedClass);
        }, 400);
      })
      .catch(() => targetItem.classList.remove(addedClass));
  }

  /**
   * @description This function removes class from target element and adds class to target element
   * @param {String} target
   * @param {String} addedClass
   * @param {String} animatedClass
   */

  static toogleClassFromTarget(target, addedClass, animatedClass) {
    const item = document.getElementsByClassName(addedClass)[0];
    if (!item) {
      this.addClassToTarget(target, addedClass, animatedClass);
    } else {
      this.removeClassFromTarget(target, addedClass, animatedClass);
    }
  }

  /**
   * @description This function add animated class to target element
   * @param {String} addedClass
   * @param {String} animatedClass
   */

  static animate(addedClass, animatedClass) {
    setTimeout(() => {
      var target = document.getElementsByClassName(addedClass);
      if(target.length > 0){
        target[0].classList.add(animatedClass);
      }
    }, 100);
  }
}

/**
 * @description This class is related with DOM manupulates and changes
 *
 */

class DOM extends Utils {
  /**
   * @description This function sets class to target within data-type (remove | add | toggle | scroll)
   */

  static setClassToTarget() {
    const elements = super.getElementByAttribute("data-target");

    elements.forEach(element => {
      const target = element.getAttribute("data-target");
      const addedClass = element.getAttribute("data-ready");
      const animatedClass = element.getAttribute("data-animate");
      const type = element.getAttribute("data-type");
      
      if (type === "scroll") {
        const offset = parseInt(element.getAttribute("data-offset"), 10);
        let isReveal = false;
        window.addEventListener("scroll", () => {
          if (Math.round(window.scrollY) > offset) isReveal = true;
          if (Math.round(window.scrollY) <= offset) isReveal = false;
          // TODO : Refactor
          if (isReveal) {
            super.addClassToTarget(target, addedClass, animatedClass);
          } else {
            setTimeout(() => {
              super.removeClassFromTarget(target, addedClass, animatedClass);
            }, 100);
          }
        });
      } else {
        element.addEventListener("click", () => {
          switch (type) {
            case "add":
              super.addClassToTarget(target, addedClass, animatedClass);
              break;
            case "remove":
              super.removeClassFromTarget(target, addedClass, animatedClass);
              break;
            case "toggle":
              super.toogleClassFromTarget(target, addedClass, animatedClass);
              break;
            default:
            case "add":
              super.addClassToTarget(target, addedClass, animatedClass);
              break;
          }
        });
      }
    });
  }
}

/*basic menu accordion*/
function showItem() {
  this.parentElement.classList.toggle('selected');
}

var accordionItem = document.querySelectorAll('.accordion > li > a');
for (var i = 0; i < accordionItem.length; i++) {
  accordionItem[i].addEventListener('click', showItem);
}
/*basic menu accordion*/

DOM.setClassToTarget();
