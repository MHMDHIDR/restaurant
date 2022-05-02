export const toggleCSSclasses = ([...conditions], elem, [...addCls], [...removeCls]) => {
  if (conditions.every(condition => condition)) {
    addCls.map(cl => elem.classList.add(cl))
    removeCls.map(cl => elem.classList.remove(cl))
  } else if (conditions.every(condition => !condition)) {
    addCls.map(cl => elem.classList.remove(cl))
    removeCls.map(cl => elem.classList.add(cl))
  }
}
