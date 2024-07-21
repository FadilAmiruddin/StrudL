import { vienna } from "./city"

/**
 * Forces the screen to run its render function if it is focused by the bottom tab navigator.
 * In other words, causes the screen to re-render when it is tapped on the bottom bar.
 * 
 * @param {*} isFocused The boolean returned by the useIsFocused hook 
 * @param {*} identifier The screen's unique identifier (should be a string constant)
 * @param {*} forceRender The screen's "forceRender" function
 */
export const refreshIfFocused = (isFocused, identifier, forceRender) => {
    if (isFocused) {
        if (vienna.getLastScreen() != identifier) {
            vienna.setLastScreen(identifier)
            forceRender()
        }
        console.log(`${identifier} has been focused`)
    }
}

export default refreshIfFocused