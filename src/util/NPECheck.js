export default function(object, nestedProps, substitute = "Unknown Value") {
  if (!object) return substitute;

  let nested = nestedProps.split("/");
  let val = object;

  while (nested.length > 0) {
    let prop = nested.shift();
    if (!val[prop] && val[prop] != 0) {
      return substitute;
    } else {
      val = val[prop];
    }
  }

  if (!val && val != 0) {
    return substitute;
  } else {
    return val;
  }
}