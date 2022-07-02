const TagIcon = ({
  width = '6',
  height = '6',
  iconFill = 'none',
  dotFill = '#fff',
  className = ''
}) => (
  <svg
    width='10'
    height='10'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 512 512'
    className={`w-${width} h-${height} ${className}`}
    xlinkTitle='Tag Icon'
  >
    <title>Item Tag</title>
    <path
      d='M435.25 48h-122.9a14.46 14.46 0 00-10.2 4.2L56.45 297.9a28.85 28.85 0 000 40.7l117 117a28.85 28.85 0 0040.7 0L459.75 210a14.46 14.46 0 004.2-10.2v-123a28.66 28.66 0 00-28.7-28.8z'
      fill={iconFill}
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='32'
    />
    <path d='M384 160a32 32 0 1132-32 32 32 0 01-32 32z' fill={dotFill} />
  </svg>
)

export default TagIcon
