
export function fetchExample() {
  // returns a 'Promise' that returns string 'hello' after 2seconds
  // prmises can be chained using '.then'
  return new Promise(
    (resolve,reject)=>{
      window.setTimeout(()=>{resolve(true)},2000)
  })
}