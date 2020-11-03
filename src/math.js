// const calculateTip = (total, tipPercent) => {
//     const tip = total * tipPercent
//     return total + tip
// }
const calculateTip = (total, tipPercent = .25) => total + (total * tipPercent)

module.exports = {
    calculateTip
}