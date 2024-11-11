import { getCustomProperty, setCustomProperty, changeCustomProperty } from "../JavaScript/Utility.js";

const SPEED = 0.02;
const grounds = Array.from(document.getElementsByClassName('ground'));

export function setUpGround() {
    setCustomProperty(grounds[0], '--left', 0);
    setCustomProperty(grounds[1], '--left', 100);
}

export function updateGround(delta, scale) {
    grounds.forEach(ground => {
        changeCustomProperty(ground, '--left', delta * scale * SPEED * -1)

        if (getCustomProperty(ground, '--left') <= -100) {
            setCustomProperty(ground, '--left', 100)
        }
    })
} 