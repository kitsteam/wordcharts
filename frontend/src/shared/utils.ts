const parseAdminId = (urlHash: string): string | undefined => {
  const matches = urlHash.match(/#adminId=(?<adminId>.+)/)
  return matches?.groups?.adminId
}

const cleanUrlFromAdminId = (urlHash: string): string => {
  return urlHash.split('#')[0]
}

const fileUrlToBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url)
  const blob = await response.blob()
  return await new Promise((resolve, reject) => {
    try {
      // file reader returns base64 encoded string
      const reader = new FileReader()
      reader.onload = (_e: Event) => {
        if (reader.result === null) {
          resolve('')
        } else if (typeof (reader.result) === 'string') {
          resolve(reader.result)
        } else {
          resolve(new TextDecoder().decode(reader.result))
        }
      }
      reader.readAsDataURL(blob)
    } catch (e) {
      reject(e)
    }
  })
}

const intersectionOfArray = (arrayOne: string[], arrayTwo: string[]): string[] => {
  return arrayOne.filter((e: string) => {
    if (!arrayTwo.includes(e)) { return false } else { return true }
  })
}

const detectSupportedLanguage = (language: string): string => {
  return language.slice(0, 2) === 'de' ? 'de' : 'en'
}

export { parseAdminId, cleanUrlFromAdminId, fileUrlToBase64, intersectionOfArray, detectSupportedLanguage }
