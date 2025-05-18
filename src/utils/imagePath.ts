export const getImagePath = (path: string): string => {
  // Storybook環境の判定
  const isStorybook = typeof window !== 'undefined' && window.location.hostname === 'localhost' && window.location.port === '6006'

  // GitHub Pages環境の判定
  const isGitHubPages = typeof window !== 'undefined' && window.location.hostname === 'niheikeita.github.io'

  if (isStorybook) {
    // Storybook環境では相対パスを使用
    return path
  }

  if (isGitHubPages) {
    // GitHub Pages環境では/my-siteを付与
    return `/my-site${path}`
  }

  // 開発環境ではそのままのパスを使用
  return path
} 