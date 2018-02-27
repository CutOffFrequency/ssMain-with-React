export const isArrOrObj = (obj) => {
    if (typeof obj === "object") {
        if (obj.length === undefined) {
            return "object"
        } else {
            return "array"
        }
    } else {
        return
    }
}

export const selectOptions = (obj) => {
    let arr
    if (isArrOrObj(obj) === "object" && Object.keys(obj).length > 0 ) {
        arr = Object.keys(obj)
    } else {
        arr = obj
    }
    let elems = []
    if (arr === undefined) return
    if (arr.length > 0 ) {
        for (let el of arr) {
            elems.push(<option key={el.toString()} value={el}>{el}</option>)
        }
        return elems
    } else return
}