/**
 * This is just a helper, it curates spring data, values that are later being interpolated into css.
 */
export const rotatedTo = (i: number) => ({ x: 0, y: i * -4, scale: 1, rot: -10 + Math.random() * 20, delay: i * 100 })

/**
 * This is being used down there in the view, it interpolates rotation and scale into a css transform.
 */
export const trans = (r: number, s: number) => `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`
