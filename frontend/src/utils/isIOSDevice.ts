export const isIOSDevice = () => {
  let platform = navigator?.userAgentData?.platform || navigator?.platform || 'unknown'

  !!platform && /iPad|iPhone|iPod/.test(platform)
}
