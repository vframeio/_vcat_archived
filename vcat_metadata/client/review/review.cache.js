import session from '../session'

export const getSaved = () => {
  try {
    return JSON.parse(session('saved'))
  } catch (e) {
    console.log('error getting saved!', e)
    return []
  }
}

export const setSaved = (saved) => {
  try {
    session('saved', JSON.stringify(saved))
  } catch (e) {
    console.log('error setting saved!', e)
  }
}
