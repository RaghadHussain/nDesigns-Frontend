const SERVER_URL = import.meta.env.VITE_BACK_END_SERVER_URL

function getImageUrl(path) {
  if (!path) return path
  if (/^https?:\/\//i.test(path)) return path
  return `${SERVER_URL}${path}`
}

export default getImageUrl
