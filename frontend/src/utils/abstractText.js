const abstractText = (txt, txtLength) =>
  txt?.length > txtLength ? txt.slice(0, txtLength) + '...' : txt

export default abstractText
