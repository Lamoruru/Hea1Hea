import { getCustomProperty, setCustomProperty, changeCustomProperty } from "../JavaScript/Utility.js";

const FIELD = document.getElementById('field');
const SPEED = 0.05;
const MIN_GENRERATE_TIME = 500;
const MAX_GENRERATE_TIME = 2000;

let cactusTime;

export function setUpCactus() {
    cactusTime = MIN_GENRERATE_TIME;
    Array.from(document.getElementsByClassName('cactus')).forEach(cactus => {
        cactus.remove();
    })
}

export function updatecactus(delta, scale) {
    Array.from(document.getElementsByClassName('cactus')).forEach(cactus => {
        changeCustomProperty(cactus, '--left', delta * scale * SPEED * -1);
        if (getCustomProperty(cactus, '--left') <= -100) {
            cactus.remove();
        }
    })

    if (cactusTime <= 0){
        createCactus();
        cactusTime = randomVal(MIN_GENRERATE_TIME, MAX_GENRERATE_TIME) / scale;
    }
    cactusTime -= delta;
}

export function getCactusRects() {
    return [...document.getElementsByClassName('cactus')].map(cactus => {
      return cactus.getBoundingClientRect();
    })
  }  

function createCactus() {
    const cactus = document.createElement('img');
    cactus.src = "Images/cactus.png";
    cactus.classList.add('cactus');
    setCustomProperty(cactus, '--left', 100);
    FIELD.append(cactus);
}

function randomVal(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}